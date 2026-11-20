import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import type { Blueprint, CourseModule, CourseResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const MODULES_DIR = path.join(CONTENT_DIR, 'modules');
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8')) as T;
  } catch {
    return null;
  }
}

/**
 * GET /api/course            -> blueprint + which modules exist on disk + first ready module
 * GET /api/course?module=slug -> same, with that module's payload as activeModule (null if not generated yet)
 */
export async function GET(request: Request) {
  const blueprint = await readJson<Blueprint>(path.join(CONTENT_DIR, 'blueprint.json'));
  if (!blueprint) {
    return NextResponse.json(
      { error: 'content/blueprint.json is missing or invalid. Run: node scripts/seed-blueprint.js' },
      { status: 500 },
    );
  }

  let files: string[] = [];
  try {
    files = await fs.readdir(MODULES_DIR);
  } catch {
    files = [];
  }
  const onDisk = new Set(files.filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -'.json'.length)));
  const availability: Record<string, boolean> = {};
  for (const mod of blueprint.modules) availability[mod.slug] = onDisk.has(mod.slug);

  const requested = new URL(request.url).searchParams.get('module');
  let activeSlug: string | null = null;
  if (requested && SLUG_PATTERN.test(requested) && blueprint.modules.some((m) => m.slug === requested)) {
    activeSlug = requested;
  } else {
    const firstReady = blueprint.modules.find((m) => availability[m.slug]);
    activeSlug = firstReady?.slug ?? blueprint.modules[0]?.slug ?? null;
  }

  let activeModule: CourseModule | null = null;
  let moduleError: string | undefined;
  if (activeSlug && availability[activeSlug]) {
    activeModule = await readJson<CourseModule>(path.join(MODULES_DIR, `${activeSlug}.json`));
    // The file exists but could not be parsed: say so instead of presenting the module as "not generated yet".
    if (!activeModule) {
      moduleError = `content/modules/${activeSlug}.json exists but is not valid JSON. Rebuild it with: node scripts/build-module.js content/src/${activeSlug}.md`;
    }
  }

  const body: CourseResponse = { blueprint, availability, activeSlug, activeModule, moduleError };
  return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } });
}
