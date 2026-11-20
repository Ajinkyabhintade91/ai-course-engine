#!/usr/bin/env node
/**
 * Live lab execution gate (companion to verify-module.js).
 *
 * For every step of a module's interactiveLab it runs, in a real interpreter:
 *   1. solutionCode + testAssertion  -> must exit 0   (the reference solution is correct)
 *   2. starterCode  + testAssertion  -> must exit != 0 (the step is not passable without doing the work)
 * It also checks that starterCode on its own runs cleanly, so a learner who has only
 * finished step 1 is never blocked by a crash in the untouched boilerplate.
 *
 * Usage: node scripts/verify-lab.js content/modules/mod-1-1.json [more files...]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node scripts/verify-lab.js <module.json> [...]');
  process.exit(1);
}

function pythonCommand() {
  for (const cmd of ['python', 'python3']) {
    const probe = spawnSync(cmd, ['--version'], { encoding: 'utf8' });
    if (probe.status === 0) return cmd;
  }
  return null;
}

function run(language, code, python) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lab-verify-'));
  const isPy = language === 'python';
  const file = path.join(dir, isPy ? 'lab.py' : 'lab.js');
  fs.writeFileSync(file, code, 'utf8');
  const cmd = isPy ? python : process.execPath;
  const res = spawnSync(cmd, [file], {
    encoding: 'utf8',
    timeout: 20000,
    cwd: dir,
    env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' },
  });
  fs.rmSync(dir, { recursive: true, force: true });
  return {
    ok: res.status === 0 && !res.error,
    detail: ((res.stderr || '') + (res.error ? String(res.error) : '')).trim().split('\n').slice(-4).join('\n'),
  };
}

const python = pythonCommand();
let failed = false;

for (const file of files) {
  const problems = [];
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
  } catch (err) {
    console.error(`FAIL [${file}]: cannot parse JSON - ${err.message}`);
    failed = true;
    continue;
  }
  const lab = data.interactiveLab || {};
  const language = lab.language;
  if (!['python', 'javascript'].includes(language)) {
    problems.push(`unsupported lab language "${language}"`);
  } else if (language === 'python' && !python) {
    problems.push('no python interpreter found on PATH');
  } else {
    const starterAlone = run(language, lab.starterCode, python);
    if (!starterAlone.ok) problems.push(`starterCode does not run cleanly on its own:\n${starterAlone.detail}`);

    const solutionAlone = run(language, lab.solutionCode, python);
    if (!solutionAlone.ok) problems.push(`solutionCode does not run cleanly on its own:\n${solutionAlone.detail}`);

    for (const step of lab.steps || []) {
      const withSolution = run(language, `${lab.solutionCode}\n${step.testAssertion}`, python);
      if (!withSolution.ok) {
        problems.push(`step ${step.stepNumber}: solutionCode FAILS its testAssertion:\n${withSolution.detail}`);
      }
      const withStarter = run(language, `${lab.starterCode}\n${step.testAssertion}`, python);
      if (withStarter.ok) {
        problems.push(`step ${step.stepNumber}: starterCode already PASSES the testAssertion (assertion checks nothing)`);
      }
    }
  }

  if (problems.length) {
    failed = true;
    console.error(`FAIL [${file}]:\n  - ${problems.join('\n  - ')}`);
  } else {
    console.log(`PASS [${file}]: lab executes (${language} | ${lab.steps.length} steps | solution passes, starter fails every assertion).`);
  }
}

process.exit(failed ? 1 : 0);
