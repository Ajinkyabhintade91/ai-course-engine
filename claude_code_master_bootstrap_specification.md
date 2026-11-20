# AUTONOMOUS BOOTSTRAP & EXECUTION SPECIFICATION: 3-Modality AI Course Engine

> **SYSTEM DIRECTIVE FOR CLAUDE CODE (FABLE 5.2 ORCHESTRATOR):**
> You have been provided with this master bootstrap specification along with syllabus images attached to this prompt (or located in the current workspace). Execute every phase in this document sequentially and autonomously without pausing for human confirmation between steps.
>
> **Your Mission:**
> 1. Create the complete project directory structure.
> 2. Write all configuration files, custom sub-agent definitions (`.claude/agents/*.md`), the master `CLAUDE.md` file, and the automated QA verification script (`scripts/verify-module.js`).
> 3. Copy or ingest all attached syllabus images into `/syllabus` and extract the master curriculum queue into `/content/blueprint.json`.
> 4. Scaffold the complete 3-Pane Next.js + Tailwind CSS + Monaco Editor Interactive Course Platform (Coursera + Codecademy hybrid).
> 5. Execute the autonomous multi-agent batch loop to research, write, and unit-test every syllabus module into `/content/modules/mod-X-Y.json`.

---

## PHASE 1: DIRECTORY & ENVIRONMENT INITIALIZATION

Execute the following terminal commands in the current working directory to establish the project skeleton:

```bash
mkdir -p .claude/agents scripts syllabus content/modules
```

If any syllabus image files (`.png`, `.jpg`, `.jpeg`, `.webp`) are currently in the root workspace or parent directory, move or copy them into `./syllabus/`. If images were pasted directly into the chat prompt, inspect them directly from the conversation context during Phase 3.

---

## PHASE 2: WRITE SYSTEM CONFIGURATION, SUB-AGENTS & QA SCRIPTS

Create the following 6 core orchestration files on disk with the exact contents specified below.

### File 1: `.claude/settings.json`
Write the following JSON to `.claude/settings.json` so sub-agents, web tools, and verification scripts run unattended:

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "Glob",
      "Grep",
      "WebSearch",
      "WebFetch",
      "Task",
      "Agent",
      "Bash(mkdir *)",
      "Bash(cp *)",
      "Bash(mv *)",
      "Bash(npx *)",
      "Bash(npm *)",
      "Bash(node scripts/verify-module.js *)",
      "Bash(node -e *)",
      "Bash(python *)",
      "Bash(python3 *)"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(rm -rf ~)"
    ]
  }
}
```

---

### File 2: `.claude/agents/syllabus-extractor.md` (Syllabus / Cerebrus Extractor Sub-Agent)
Write the following Markdown to `.claude/agents/syllabus-extractor.md`:

```markdown
---
name: syllabus-extractor
description: Extracts syllabus images via 100% OCR fidelity into a structured curriculum blueprint (content/blueprint.json). Invoke first when building or updating the course queue from syllabus images.
tools: Read, Write, Glob
model: fable
---
You are a Principal Curriculum Architect (Syllabus/Cerebrus Extractor). Your responsibility is to inspect every syllabus image provided in `/syllabus` (or attached in the session context) with 100% OCR fidelity, expand shorthand syllabus bullet points into a logical pedagogical progression (Foundational -> Intermediate -> Advanced/Production), and write `/content/blueprint.json`.

### Rules for `/content/blueprint.json`
1. Never skip a single topic, equation, algorithm, or tool mentioned in the syllabus images.
2. Group related modules logically under parent units (`unitId`, `unitTitle`).
3. Output a valid JSON object matching this exact schema:

```json
{
  "courseTitle": "Inferred Comprehensive Course Title",
  "courseDescription": "High-level executive summary of the curriculum",
  "availablePaidPlatforms": ["Coursera Plus"],
  "modules": [
    {
      "moduleId": "MOD-1.1",
      "slug": "mod-1-1",
      "unitId": "UNIT-1",
      "unitTitle": "Unit 1: Foundational Concepts",
      "moduleTitle": "Exact Module Title",
      "difficulty": "Foundational | Intermediate | Advanced",
      "subTopics": [
        "Detailed sub-topic 1",
        "Detailed sub-topic 2",
        "Detailed sub-topic 3"
      ],
      "searchQueries": {
        "arxivAndTheory": "exact search query for arXiv / MIT OCW",
        "docsAndRepos": "exact search query for official documentation and GitHub repos",
        "communityWisdom": "exact search query for Reddit / Hacker News / Stack Overflow pitfalls",
        "youtubeFree": "exact search query for YouTube lectures",
        "courseraPaid": "exact search query for Coursera Plus specialization/module"
      },
      "status": "pending"
    }
  ]
}
```
```

---

### File 3: `.claude/agents/deep-researcher.md` (Multi-Platform Aggregator Sub-Agent)
Write the following Markdown to `.claude/agents/deep-researcher.md`:

```markdown
---
name: deep-researcher
description: Performs deep web research across arXiv, MIT OCW, official docs, GitHub, Reddit, Hacker News, YouTube, and Coursera Plus for a single syllabus module. Spawn in parallel batches before writing module JSON files.
tools: WebSearch, WebFetch, Read
model: sonnet
omitClaudeMd: true
---
You are an Elite Technical Research Aggregator operating in an isolated context window so raw web search logs never pollute the Lead Orchestrator's context.

When given a `moduleId`, `moduleTitle`, `subTopics`, and `searchQueries`:
1. **Academic & First-Principles Research:** Search arXiv, MIT OpenCourseWare, OpenStax, and university lecture notes for formal definitions, mathematical derivations, proofs, and foundational mental models.
2. **Engineering & Official Documentation:** Search official language/framework docs, GitHub "Awesome" lists, and reference architectures for idiomatic implementation patterns and time/space complexity trade-offs.
3. **Practitioner Wisdom (Reddit / Hacker News / Stack Overflow):** Search technical subreddits, HN discussions, and Stack Overflow for real-world production failure modes, subtle edge cases, and "what textbooks don't tell you."
4. **Video Curation (Free + Paid Tracks):**
   - Find at least 3 high-signal **Free YouTube** videos (e.g., 3Blue1Brown, FreeCodeCamp, Stanford/MIT lectures, Andrej Karpathy, StatQuest, Fireship, or domain leaders) with exact titles, creator names, and URLs.
   - Find at least 2 **Paid Coursera Plus** courses/modules that directly teach this module's concepts.

### Output Format (Return to Orchestrator)
Return a dense, zero-fluff Markdown Research Dossier containing:
1. **Intuitive Analogy & Mental Model**
2. **Formal Theory, Equations ($LaTeX$), & System Architecture Notes**
3. **Production Code Patterns & Edge Cases**
4. **Community Pitfalls (Synthesized from Reddit/HN/SO)**
5. **Verified Citation Links (arXiv, Docs, Repos, Blogs)**
6. **Curated Video Playlist Data (YouTube + Coursera Plus with viewing sequence recommendations)**
```

---

### File 4: `.claude/agents/lab-verifier.md` (Automated QA & Lab Execution Sub-Agent)
Write the following Markdown to `.claude/agents/lab-verifier.md`:

```markdown
---
name: lab-verifier
description: Validates generated module JSON files in /content/modules/ for JSON syntax, 2500+ word textbook depth, video count, and executes interactiveLab solutionCode against testAssertions. Invoke after writing any module JSON file.
tools: Read, Edit, Bash
model: sonnet
omitClaudeMd: true
---
You are a Principal QA & Curriculum Verification Engineer.
When given a module file path (e.g., `content/modules/mod-1-1.json`):

1. **Run Structural & Depth Gate:**
   Execute `node scripts/verify-module.js <filepath>`.
   - If it fails word count (< 2,500 words), JSON parsing, video count (< 3), or step count (< 3), report the exact failure reason immediately.

2. **Execute & Verify Interactive Lab Code:**
   - Inspect `interactiveLab.language`, `interactiveLab.starterCode`, `interactiveLab.solutionCode`, and `interactiveLab.steps[].testAssertion`.
   - Run the `solutionCode` combined with all `testAssertion` checks using `node -e` (for JS/TS) or `python -c` / `python3 -c` (for Python) to verify that the reference solution executes with zero syntax or assertion errors.
   - If a syntax error or broken assertion is found in `solutionCode` or `testAssertion`, fix it directly in the JSON file and re-run `node scripts/verify-module.js <filepath>`.

3. **Sign-Off:**
   Return `VERIFIED: <filepath>` only when both `verify-module.js` and live code execution pass 100%.
```

---

### File 5: `scripts/verify-module.js` (Deterministic Verification Harness)
Write the following Node.js script to `scripts/verify-module.js`:

```javascript
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
```

---

### File 6: `CLAUDE.md` (Master Orchestrator Memory)
Write the following Markdown to `CLAUDE.md` in the root directory:

```markdown
# MASTER ORCHESTRATOR: 3-Modality Course Platform & Autonomous Content Engine

You are the Lead Curriculum Orchestrator running on **Claude Fable 5.2**.
Your job is to build and populate a local-first **Coursera + O'Reilly + Codecademy** hybrid learning platform from the syllabus images in `/syllabus`.

## 1. SUB-AGENT DELEGATION ARCHITECTURE
To keep your 1M context window clean and preserve token quota:
- **`@syllabus-extractor`**: Delegate OCR extraction of `/syllabus` images into `/content/blueprint.json`.
- **`@deep-researcher`**: Delegate all web searches (arXiv, Docs, Reddit, HN, YouTube, Coursera Plus) in parallel batches of 2–3 modules. Never perform raw multi-page web scraping in the main orchestrator context.
- **`@lab-verifier`**: Delegate validation of every generated `/content/modules/mod-X-Y.json` file using `node scripts/verify-module.js` and live execution of `interactiveLab.solutionCode`.

## 2. MODULE JSON SPECIFICATION (`/content/modules/mod-X-Y.json`)
Every module file written to `/content/modules/` MUST strictly adhere to this JSON schema:

```json
{
  "moduleId": "MOD-1.1",
  "slug": "mod-1-1",
  "unitId": "UNIT-1",
  "unitTitle": "Unit 1: ...",
  "title": "Module Title",
  "difficulty": "Foundational | Intermediate | Advanced",
  "estimatedMinutes": 90,
  "readingMarkdown": "EXHAUSTIVE 2,500+ WORD TEXTBOOK CHAPTER IN MARKDOWN + LATEX...",
  "citations": [
    {
      "title": "Paper / Doc / Thread Title",
      "source": "arXiv | Official Docs | Reddit | MIT OCW",
      "url": "https://..."
    }
  ],
  "videoLibrary": [
    {
      "id": "VID-1.1-1",
      "title": "Exact Video or Course Module Title",
      "creator": "Channel or University Name",
      "platform": "YouTube | Coursera Plus",
      "tier": "Free | Paid",
      "url": "https://...",
      "timingInstruction": "Watch after reading Section 2 (Core Mechanics)",
      "keyTakeaway": "Clarifies the geometric intuition behind..."
    }
  ],
  "interactiveLab": {
    "labTitle": "Hands-On Lab: ...",
    "context": "2-sentence realistic engineering scenario directly tied to the reading and video.",
    "language": "python | javascript",
    "starterCode": "# Boilerplate code with clear TODO markers for each step\n",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Step 1 Title",
        "instruction": "Detailed micro-task instruction connected to concept [MOD-1.1]",
        "hintConceptual": "Tier 1 Hint: Conceptual mental-model nudge without giving away syntax",
        "hintSyntax": "Tier 2 Hint: Exact formula, method signature, or code pattern",
        "testAssertion": "Executable assertion statement that throws/exits non-zero if Step 1 is incomplete"
      }
    ],
    "solutionCode": "# Complete, production-grade annotated solution that passes all step testAssertions\n"
  }
}
```

## 3. MANDATORY TEXTBOOK DEPTH RULES (`readingMarkdown`)
Every module's `readingMarkdown` MUST exceed **2,500 words** (use your 128K output window; zero summarization, zero ellipses, zero placeholders) and include these 5 sections:
1. `## 1. First-Principles Mental Model & Intuition` (Why this exists, the problem it solves, concrete real-world analogy).
2. `## 2. Core Theory, Mathematical Foundations & Architecture Internals` (Step-by-step derivations in `$inline$` and `$$display$$` LaTeX, ASCII architecture/data-flow diagrams, time/space complexity).
3. `## 3. Production-Grade Implementation & Annotated Walkthrough` (Complete, runnable code blocks with line-by-line engineering commentary).
4. `## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)` (Real-world failure modes, performance traps, debugging strategies, and what standard textbooks omit).
5. `## 5. Active Recall Check & Synthesis Summary` (3 deep conceptual questions with collapsible `<details><summary>View Answer</summary>...</details>` blocks).
```

---

## PHASE 3: SCAFFOLD THE 3-PANE INTERACTIVE WEB APPLICATION

Initialize a Next.js (App Router, TypeScript, Tailwind CSS) web application in the root directory (or integrate smoothly without overwriting `.claude/`, `CLAUDE.md`, `scripts/`, `syllabus/`, or `content/`).

Install required packages:
```bash
npm install next react react-dom lucide-react react-markdown remark-gfm remark-math rehype-katex @monaco-editor/react clsx tailwind-merge
npm install -D typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer
```

### Web Application Architecture Requirements:
Build the following files so the platform works out-of-the-box at `http://localhost:3000`:

1. **`app/api/course/route.ts` (Course Data API):**
   - Reads `/content/blueprint.json` and scans `/content/modules/*.json`.
   - Returns the master syllabus blueprint, completion availability of each module on disk, and the active module payload.

2. **`app/api/run-lab/route.ts` (Local Code & Test Execution Sandbox API):**
   - Accepts `{ language, userCode, stepNumber, testAssertion }`.
   - For `"javascript"`, executes `userCode + "\n" + testAssertion` inside a timeout-protected Node `vm` or child process (`node -e`).
   - For `"python"`, executes `userCode + "\n" + testAssertion` inside a timeout-protected `python3 -c` / `python -c` child process.
   - Returns `{ passed: boolean, stdout: string, stderr: string, executionTimeMs: number }`.

3. **`app/page.tsx` (The 3-Pane Coursera + Codecademy Course Player UI):**
   - **Dark-Mode Engineering Aesthetic** (Slate/Zinc palette with high-contrast typography and KaTeX CSS imported in `app/layout.tsx`).
   - **Pane 1 — Left Collapsible Syllabus Sidebar:**
     - Displays Course Title, overall progress bar, and all Units & Modules from `blueprint.json`.
     - Shows a green badge if the module JSON is generated (`Ready`), a pulsing amber badge if `Pending`, and a user completion checkbox persisted in `localStorage`.
   - **Pane 2 — Center Study & Video Hub:**
     - **Tab A ("Reference Book"):** Renders `readingMarkdown` with full LaTeX math (`remark-math` + `rehype-katex`), tables (`remark-gfm`), ASCII diagrams, syntax-highlighted code blocks, and clickable citation pills at the bottom.
     - **Tab B ("Video Library — Free & Paid"):** Filterable by `All`, `Free (YouTube)`, and `Paid (Coursera Plus)`. Embeds YouTube videos directly via `iframe` when a YouTube URL is present, displays the `timingInstruction` badge (e.g., *"Watch after Section 2"*), and provides direct deep-search links for Coursera Plus modules.
   - **Pane 3 — Right Codecademy-Style Interactive Lab:**
     - **Top Bar:** Lab Title, scenario context, and interactive Step Pill selector (`Step 1`, `Step 2`, `Step 3`...) with lock/unlock icons.
     - **Instruction & Progressive Hints Card:** Shows the active step's `instruction`, plus two expandable buttons: **"Show Hint 1 (Conceptual)"** and **"Show Hint 2 (Syntax)"**.
     - **Middle Editor:** `@monaco-editor/react` instance pre-populated with `starterCode`, a **"Reset Code"** button, and a **"Reveal Annotated Solution"** toggle.
     - **Bottom Terminal & Verification Bar:** **"Run & Verify Step"** button that calls `/api/run-lab`, prints real `stdout`/`stderr` output in a terminal drawer, marks the current step passed on success, and automatically advances to the next micro-step.

---

## PHASE 4: AUTONOMOUS MULTI-AGENT SYLLABUS EXTRACTION & BATCH GENERATION LOOP

Once Phases 1, 2, and 3 are scaffolded, immediately execute this autonomous content generation workflow:

1. **Step 1 — Generate `content/blueprint.json`:**
   - Invoke `@syllabus-extractor` (or inspect all attached/workspace syllabus images directly if pasted in chat, saving copies or metadata as needed) to transcribe 100% of the syllabus into `/content/blueprint.json`.

2. **Step 2 — Batch-Generate & Verify All Modules (3 Modules per Batch):**
   - Read `/content/blueprint.json` and filter all modules where `"status": "pending"`.
   - For each batch of up to 3 pending modules:
     - **A. Parallel Research:** Spawn `@deep-researcher` sub-agents in parallel for the current batch of modules to gather arXiv theory, official docs, Reddit/HN pitfalls, YouTube links, and Coursera Plus mappings.
     - **B. 128K-Output Authoring:** Using the returned research dossiers, write each `/content/modules/<slug>.json` file yourself in full textbook depth (2,500+ words in `readingMarkdown`, 3+ curated videos in `videoLibrary`, and a 3–5 step executable `interactiveLab`).
     - **C. Automated Verification:** Spawn `@lab-verifier` on each written JSON file to run `node scripts/verify-module.js` and test `interactiveLab.solutionCode` against all `testAssertion` checks. Fix any failures immediately.
     - **D. Update Queue State:** Update those modules to `"status": "completed"` inside `/content/blueprint.json` and immediately continue to the next batch of `"pending"` modules without asking for user confirmation.

---

## PHASE 5: LAUNCH & LIVE VERIFICATION

After generating the platform and at least the first batch of verified modules:
1. Run `npm run build` or start the development server (`npm run dev`) to confirm zero TypeScript or Next.js build errors.
2. Print a concise summary report showing how many syllabus modules were extracted, how many passed `verify-module.js`, and the local URL (`http://localhost:3000`) to open in Claude Desktop's Live Preview.