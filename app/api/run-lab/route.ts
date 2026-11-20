import { spawn, spawnSync } from 'child_process';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { NextResponse } from 'next/server';
import type { RunResult } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TIMEOUT_MS = 10_000;
const MAX_CODE_BYTES = 200_000;
const MAX_OUTPUT_CHARS = 60_000;
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

let cachedPython: string | null | undefined;

/** Finds a working Python launcher once ("python" on Windows, "python3" on most Unix systems). */
function pythonCommand(): string | null {
  if (cachedPython !== undefined) return cachedPython;
  for (const cmd of ['python', 'python3']) {
    const probe = spawnSync(/*turbopackIgnore: true*/ cmd, ['--version'], { encoding: 'utf8' });
    if (probe.status === 0) {
      cachedPython = cmd;
      return cmd;
    }
  }
  cachedPython = null;
  return null;
}

/** Kills a lab process and every process it started (taskkill /T on Windows, the process group elsewhere). */
function killTree(pid: number | undefined) {
  if (!pid) return;
  try {
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/pid', String(pid), '/T', '/F'], { windowsHide: true });
    } else {
      process.kill(-pid, 'SIGKILL');
    }
  } catch {
    /* already exited */
  }
}

// Interpreters colour their tracebacks when they think they are on a terminal (Python 3.13+ does this
// by default). The drawer shows plain text, so colour is switched off via env and stripped as a backstop.
const ANSI_PATTERN = /\u001b\[[0-9;?]*[ -/]*[@-~]/g;
const PLAIN_OUTPUT_ENV = { NO_COLOR: '1', FORCE_COLOR: '0', PYTHON_COLORS: '0', TERM: 'dumb' };

function clean(text: string, tempDir: string): string {
  const plain = text
    .replace(ANSI_PATTERN, '')
    .replace(/\r\n/g, '\n')
    // Hide the temp path so tracebacks read "lab.py, line 12" instead of a long machine-specific path.
    .split(tempDir + path.sep)
    .join('');
  return plain.length > MAX_OUTPUT_CHARS ? `${plain.slice(0, MAX_OUTPUT_CHARS)}\n... [output truncated]` : plain;
}

/**
 * POST /api/run-lab  { language, userCode, stepNumber, testAssertion }
 *
 * Runs `userCode + "\n" + testAssertion` in a child process (python or node) with a hard timeout
 * and returns { passed, stdout, stderr, executionTimeMs }. The code is written to a throwaway
 * temp directory rather than passed with -c / -e, which avoids command-line length limits and
 * shell-quoting problems on Windows.
 *
 * This endpoint executes arbitrary code on the machine running the dev server, so it only
 * answers requests addressed to localhost. Do not expose this app to a network.
 */
export async function POST(request: Request) {
  const rawHost = (request.headers.get('host') ?? '').toLowerCase();
  const host = rawHost.replace(/:\d+$/, '');
  if (!LOCAL_HOSTS.has(host)) {
    return NextResponse.json({ error: 'The lab runner only accepts requests on localhost.' }, { status: 403 });
  }
  // Block cross-site requests. A page on another site can send a "simple" POST (text/plain, no preflight) to
  // localhost, so: (1) require a JSON content type, which forces a CORS preflight that this route never
  // approves; (2) reject any request whose Origin or Sec-Fetch-Site says it came from another site.
  const contentType = (request.headers.get('content-type') ?? '').toLowerCase();
  if (!contentType.startsWith('application/json')) {
    return NextResponse.json({ error: 'Content-Type must be application/json.' }, { status: 415 });
  }
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'none') {
    return NextResponse.json({ error: 'Cross-site requests are not allowed.' }, { status: 403 });
  }
  const origin = request.headers.get('origin');
  if (origin) {
    let originHost = '';
    try {
      originHost = new URL(origin).host.toLowerCase();
    } catch {
      /* "null" or malformed origin */
    }
    if (originHost !== rawHost) {
      return NextResponse.json({ error: 'Cross-site requests are not allowed.' }, { status: 403 });
    }
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be JSON.' }, { status: 400 });
  }
  const { language, userCode, testAssertion } = (payload ?? {}) as Record<string, unknown>;

  if (language !== 'python' && language !== 'javascript') {
    return NextResponse.json({ error: 'language must be "python" or "javascript".' }, { status: 400 });
  }
  if (typeof userCode !== 'string' || (testAssertion !== undefined && typeof testAssertion !== 'string')) {
    return NextResponse.json({ error: 'userCode and testAssertion must be strings.' }, { status: 400 });
  }
  const source = `${userCode}\n${testAssertion ?? ''}\n`;
  if (Buffer.byteLength(source, 'utf8') > MAX_CODE_BYTES) {
    return NextResponse.json({ error: 'Code is too large to run.' }, { status: 413 });
  }

  let command: string;
  if (language === 'python') {
    const python = pythonCommand();
    if (!python) {
      const result: RunResult = {
        passed: false,
        stdout: '',
        stderr: 'No Python interpreter was found on PATH. Install Python 3 and restart the dev server.',
        executionTimeMs: 0,
      };
      return NextResponse.json(result);
    }
    command = python;
  } else {
    command = process.execPath;
  }

  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'course-lab-'));
  const file = path.join(dir, language === 'python' ? 'lab.py' : 'lab.js');
  await fs.writeFile(file, source, 'utf8');

  const started = Date.now();
  const result = await new Promise<RunResult>((resolve) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let settled = false;
    let exitCode: number | null = null;
    let grace: ReturnType<typeof setTimeout> | undefined;

    const child = spawn(/*turbopackIgnore: true*/ command, [file], {
      cwd: dir,
      windowsHide: true,
      // On Unix, a new process group lets the timeout kill the lab code and anything it started.
      detached: process.platform !== 'win32',
      env: { ...process.env, ...PLAIN_OUTPUT_ENV, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1', PYTHONDONTWRITEBYTECODE: '1' },
    });

    // Resolves exactly once. Output pipes are destroyed so a background process started by the lab
    // code, which inherits them, cannot keep the request open after the lab code itself has finished.
    const finish = (extraError?: string) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (grace) clearTimeout(grace);
      child.stdout.destroy();
      child.stderr.destroy();
      if (timedOut) stderr += `\nTimed out after ${TIMEOUT_MS / 1000}s. Check for an infinite loop.`;
      if (extraError) stderr += `\n${extraError}`;
      resolve({
        passed: exitCode === 0 && !timedOut && !extraError,
        stdout: clean(stdout, dir),
        stderr: clean(stderr, dir).trim(),
        executionTimeMs: Date.now() - started,
      });
    };

    const timer = setTimeout(() => {
      timedOut = true;
      killTree(child.pid);
      grace = setTimeout(() => finish(), 1000);
    }, TIMEOUT_MS);

    child.stdout.on('data', (chunk: Buffer) => {
      if (stdout.length <= MAX_OUTPUT_CHARS) stdout += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk: Buffer) => {
      if (stderr.length <= MAX_OUTPUT_CHARS) stderr += chunk.toString('utf8');
    });
    child.on('error', (err) => finish(String(err)));
    child.on('exit', (code) => {
      exitCode = code;
      // Normally 'close' follows at once; if a leftover background process holds the pipes, stop waiting.
      if (!settled) grace = setTimeout(() => finish(), 300);
    });
    child.on('close', (code) => {
      if (exitCode === null) exitCode = code;
      finish();
    });
  });

  await fs.rm(dir, { recursive: true, force: true }).catch(() => undefined);
  return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
}
