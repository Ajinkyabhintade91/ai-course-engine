#!/usr/bin/env node
/**
 * Runs both gates (verify-module.js + verify-lab.js) on every module in content/modules
 * and prints a one-line summary against the blueprint.
 *
 * Usage: node scripts/verify-all.js   (or: npm run verify)
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const modulesDir = path.join(root, 'content', 'modules');
const blueprint = JSON.parse(fs.readFileSync(path.join(root, 'content', 'blueprint.json'), 'utf8'));
const files = fs.existsSync(modulesDir) ? fs.readdirSync(modulesDir).filter((f) => f.endsWith('.json')).sort() : [];

let passed = 0;
const failures = [];
for (const name of files) {
  const rel = path.join('content', 'modules', name);
  const gates = ['verify-module.js', 'verify-lab.js'].map((script) =>
    spawnSync(process.execPath, [path.join('scripts', script), rel], { cwd: root, encoding: 'utf8' }),
  );
  const ok = gates.every((g) => g.status === 0);
  for (const g of gates) process.stdout.write(g.stdout + g.stderr);
  if (ok) passed += 1;
  else failures.push(name);
}

console.log('\n' + '-'.repeat(60));
console.log(`Blueprint modules : ${blueprint.modules.length}`);
console.log(`Generated on disk : ${files.length}`);
console.log(`Passed both gates : ${passed}`);
if (failures.length) console.log(`FAILED            : ${failures.join(', ')}`);
process.exit(failures.length ? 1 : 0);
