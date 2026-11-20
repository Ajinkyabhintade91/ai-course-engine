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

## 4. LOCAL PIPELINE NOTES (how modules are actually produced in this repo)
- **Author in `content/src/<slug>.md`, never hand-write the JSON.** The source uses `@@meta`, `@@reading`, `@@starter`, `@@solution`, `@@step`, `@@assert` sections (format documented at the top of `scripts/build-module.js`). Compile with `node scripts/build-module.js content/src/<slug>.md`, which writes `content/modules/<slug>.json`.
- **Two gates must pass before a module is marked `completed` in `content/blueprint.json`:**
  `node scripts/verify-module.js content/modules/<slug>.json` (structure + 2,500-word depth) and
  `node scripts/verify-lab.js content/modules/<slug>.json` (solution passes every assertion, starter fails every assertion, starter runs cleanly on its own).
- **Lab rules:** labs run offline with the standard library only (no API keys, no network, no pip/npm installs). Starter code must run without errors, each step's assertion must test only that step, and `python` (not `python3`) is the interpreter on this machine.
- **Math rule:** the reader parses `$...$` as LaTeX. Never write a bare dollar sign for currency in `readingMarkdown`; write `USD 20`, `Rs 500`, or escape it as `\$20`.
- **Recall answers:** leave a blank line after `<summary>View Answer</summary>` and before `</details>` so the Markdown inside the block renders.
