#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const file = process.argv[2];
if (!file || !fs.existsSync(file)) {
  console.error(`FAIL: Target module file does not exist: ${file}`);
  process.exit(1);
}

try {
  const raw = fs.readFileSync(path.resolve(file), 'utf8');
  const data = JSON.parse(raw);

  const requiredTopKeys = ['moduleId', 'slug', 'title', 'readingMarkdown', 'videoLibrary', 'interactiveLab'];
  for (const key of requiredTopKeys) {
    if (!data[key]) {
      console.error(`FAIL [${file}]: Missing required top-level key "${key}".`);
      process.exit(1);
    }
  }

  const wordCount = (data.readingMarkdown || '').trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 2500) {
    console.error(`FAIL [${file}]: readingMarkdown is too short (${wordCount} words). Minimum 2,500 words required for textbook depth.`);
    process.exit(1);
  }

  if (!Array.isArray(data.videoLibrary) || data.videoLibrary.length < 3) {
    console.error(`FAIL [${file}]: videoLibrary must contain at least 3 curated videos (found ${data.videoLibrary?.length || 0}).`);
    process.exit(1);
  }

  const lab = data.interactiveLab;
  if (!lab || !lab.starterCode || !lab.solutionCode || !Array.isArray(lab.steps) || lab.steps.length < 3) {
    console.error(`FAIL [${file}]: interactiveLab must include starterCode, solutionCode, and at least 3 progressive steps.`);
    process.exit(1);
  }

  for (const step of lab.steps) {
    if (!step.instruction || !step.hintConceptual || !step.hintSyntax || !step.testAssertion) {
      console.error(`FAIL [${file}]: Step ${step.stepNumber} in interactiveLab is missing instruction, hints, or testAssertion.`);
      process.exit(1);
    }
  }

  console.log(`PASS [${file}]: Verified (${wordCount} words | ${data.videoLibrary.length} videos | ${lab.steps.length} lab steps).`);
  process.exit(0);
} catch (err) {
  console.error(`FAIL [${file}]: Invalid JSON syntax - ${err.message}`);
  process.exit(1);
}
