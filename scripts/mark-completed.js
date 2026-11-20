#!/usr/bin/env node
/**
 * Queue-state update for the content engine.
 * Marks modules "completed" in content/blueprint.json, but ONLY if the module file
 * passes both gates (verify-module.js and verify-lab.js) right now.
 *
 * Usage: node scripts/mark-completed.js mod-1-1 mod-1-2 mod-1-3
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const blueprintPath = path.join(root, 'content', 'blueprint.json');
const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));
const slugs = process.argv.slice(2);
if (slugs.length === 0) {
  console.error('Usage: node scripts/mark-completed.js <slug> [...]');
  process.exit(1);
}

let failed = false;
for (const slug of slugs) {
  const entry = blueprint.modules.find((m) => m.slug === slug);
  if (!entry) {
    console.error(`SKIP ${slug}: not in blueprint.json`);
    failed = true;
    continue;
  }
  const rel = path.join('content', 'modules', `${slug}.json`);
  const ok = ['verify-module.js', 'verify-lab.js'].every((script) => {
    const res = spawnSync(process.execPath, [path.join('scripts', script), rel], { cwd: root, encoding: 'utf8' });
    if (res.status !== 0) process.stderr.write(res.stdout + res.stderr);
    return res.status === 0;
  });
  if (ok) {
    entry.status = 'completed';
    console.log(`completed ${slug}`);
  } else {
    console.error(`NOT marked ${slug}: a gate failed`);
    failed = true;
  }
}

fs.writeFileSync(blueprintPath, JSON.stringify(blueprint, null, 2) + '\n', 'utf8');
const done = blueprint.modules.filter((m) => m.status === 'completed').length;
console.log(`Queue: ${done} completed, ${blueprint.modules.length - done} pending.`);
process.exit(failed ? 1 : 0);
