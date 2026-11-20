#!/usr/bin/env node
/**
 * Compiles a module source file (content/src/<slug>.md) into the module JSON
 * consumed by the course player (content/modules/<slug>.json).
 *
 * Authoring long Markdown + code inside hand-escaped JSON strings is error prone,
 * so modules are written in a sectioned plain-text format instead:
 *
 *   @@meta        JSON object: moduleId, slug, unitId, unitTitle, title, difficulty,
 *                 estimatedMinutes, citations[], videoLibrary[], lab{labTitle, context, language}
 *   @@reading     the full readingMarkdown chapter
 *   @@starter     interactiveLab.starterCode
 *   @@solution    interactiveLab.solutionCode
 *   @@step        JSON object: stepNumber, title, instruction, hintConceptual, hintSyntax
 *   @@assert      the testAssertion code for the step directly above
 *   (repeat @@step / @@assert for every step)
 *
 * Usage: node scripts/build-module.js content/src/mod-1-1.md [more files...]
 */
const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node scripts/build-module.js <content/src/slug.md> [...]');
  process.exit(1);
}

const MARKERS = new Set(['meta', 'reading', 'starter', 'solution', 'step', 'assert']);
let failed = false;

for (const file of files) {
  try {
    const raw = fs.readFileSync(path.resolve(file), 'utf8').replace(/\r\n/g, '\n');
    const sections = [];
    let current = null;
    for (const line of raw.split('\n')) {
      const m = /^@@([a-z]+)\s*$/.exec(line);
      if (m && MARKERS.has(m[1])) {
        current = { kind: m[1], lines: [] };
        sections.push(current);
      } else if (current) {
        current.lines.push(line);
      }
    }
    const text = (s) => s.lines.join('\n').replace(/^\n+/, '').replace(/\s+$/, '');
    const one = (kind) => {
      const found = sections.filter((s) => s.kind === kind);
      if (found.length !== 1) throw new Error(`expected exactly one @@${kind} section, found ${found.length}`);
      return text(found[0]);
    };

    const meta = JSON.parse(one('meta'));
    const steps = [];
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].kind !== 'step') continue;
      const next = sections[i + 1];
      if (!next || next.kind !== 'assert') throw new Error('every @@step must be followed by an @@assert section');
      const step = JSON.parse(text(sections[i]));
      steps.push({
        stepNumber: step.stepNumber,
        title: step.title,
        instruction: step.instruction,
        hintConceptual: step.hintConceptual,
        hintSyntax: step.hintSyntax,
        testAssertion: text(next),
      });
    }

    const { lab, citations, videoLibrary, ...head } = meta;
    const out = {
      moduleId: head.moduleId,
      slug: head.slug,
      unitId: head.unitId,
      unitTitle: head.unitTitle,
      title: head.title,
      difficulty: head.difficulty,
      estimatedMinutes: head.estimatedMinutes,
      readingMarkdown: one('reading'),
      citations: citations || [],
      videoLibrary: videoLibrary || [],
      interactiveLab: {
        labTitle: lab.labTitle,
        context: lab.context,
        language: lab.language,
        starterCode: one('starter') + '\n',
        steps,
        solutionCode: one('solution') + '\n',
      },
    };

    const target = path.join(path.dirname(path.resolve(file)), '..', 'modules', `${out.slug}.json`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, JSON.stringify(out, null, 2) + '\n', 'utf8');
    console.log(`BUILT ${path.relative(process.cwd(), target)}`);
  } catch (err) {
    failed = true;
    console.error(`FAIL [${file}]: ${err.message}`);
  }
}

process.exit(failed ? 1 : 0);
