# AI Course Engine

A local-first learning platform that combines three ways of studying in one screen: a textbook chapter to read, curated videos to watch, and a hands-on coding lab that checks your work step by step.

It ships with a full course, **The Complete AI Mastery Course: Learn, Build, Earn**: 161 modules across 13 units, from AI fundamentals through prompt engineering, automation, AI agents, coding with AI, running models locally, and earning with AI skills.

## What's in each module

| Part | What you get |
| --- | --- |
| **Reading** | A textbook chapter of at least 2,500 words, in five fixed sections: first-principles intuition, core theory (with LaTeX math and diagrams), an annotated implementation, practitioner pitfalls, and active-recall questions with hidden answers. Sources are cited at the end. |
| **Videos** | A short library of free YouTube videos and Coursera courses, each with when to watch it and what to take away. |
| **Lab** | A Python exercise in a Monaco editor, split into steps. Each step has two hint levels and an automatic check. Passing every step marks the module complete. |

The whole course has about 633,000 words of reading, 575 videos and 161 labs. Every lab runs offline with the Python standard library only: no API keys, no network, no package installs.

## Course outline

| Unit | Modules |
| --- | ---: |
| 1. Understanding AI from Basics | 12 |
| 2. Mastering ChatGPT | 12 |
| 3. Mastering Claude & Gemini | 14 |
| 4. 100+ AI Tools Directory | 3 |
| 5. Complete Prompt Engineering Master Class | 14 |
| 6. AI Content Creation Masterclass | 12 |
| 7. AI Automation Masterclass | 22 |
| 8. Build Your Own AI Agents | 19 |
| 9. Coding with AI | 15 |
| 10. Run AI Locally | 15 |
| 11. Make Money with AI | 12 |
| 12. 30 Day AI Mastery Roadmap | 3 |
| 13. Bonus Resources | 8 |

The course plan in [`content/blueprint.json`](content/blueprint.json) was built from a set of syllabus images. Those images are kept locally in `syllabus/` and are not published in this repository.

## Getting started

You need **Node.js 20 or later** and **Python 3** available as `python` on your PATH (the lab runner calls `python`, not `python3`).

```bash
git clone https://github.com/Ajinkyabhintade91/ai-course-engine.git
cd ai-course-engine
npm install
npm run dev
```

Then open http://localhost:3000.

For a production build, run `npm run build` and then `npm run start`.

Your progress (completed modules, the last module you opened, and your lab code) is saved in the browser's local storage.

## Security note

The lab runner executes code on your computer, so the server is locked down to local use:

- Both `npm run dev` and `npm run start` listen on `127.0.0.1` only, so other devices on your network can't reach it.
- The `/api/run-lab` endpoint only accepts same-origin JSON requests, which stops other websites from sending code to it.
- Each run is limited to 10 seconds, and on timeout the runner kills the whole process tree.

Don't expose this server to the internet.

## Project layout

```
app/
  page.tsx               course player (sidebar, study pane, lab pane)
  api/course/            serves the blueprint and module JSON
  api/run-lab/           runs lab code with a timeout
components/              Sidebar, StudyHub, ReadingView, VideoLibrary, LabPane
lib/                     shared types and helpers
content/
  blueprint.json         the course plan: units, modules, status
  src/<slug>.md          module sources (edit these)
  modules/<slug>.json    compiled modules (generated, do not hand-edit)
scripts/                 build and verification tools
syllabus/                syllabus images (local only, not in the repo)
```

## Editing or adding modules

Modules are written in `content/src/<slug>.md` using a sectioned format (`@@meta`, `@@reading`, `@@starter`, `@@solution`, `@@step`, `@@assert`), documented at the top of [`scripts/build-module.js`](scripts/build-module.js). Don't edit the JSON directly.

1. Edit the source file.
2. Compile it:

   ```bash
   node scripts/build-module.js content/src/mod-1-1.md
   ```

3. Check it against both quality gates:

   ```bash
   node scripts/verify-module.js content/modules/mod-1-1.json   # structure and 2,500-word depth
   node scripts/verify-lab.js content/modules/mod-1-1.json      # lab checks
   ```

   `verify-lab.js` confirms that the solution passes every step's check, that the starter code fails every check, and that the starter runs cleanly on its own.

4. Run both gates across the whole course with:

   ```bash
   npm run verify
   ```

Two writing rules for readings: `$...$` is parsed as LaTeX, so write currency as `USD 20` or `\$20`; and leave a blank line inside `<details>` answer blocks so their Markdown renders.

## Tech stack

Next.js 16, React 19, TypeScript, Tailwind CSS, Monaco Editor, react-markdown with KaTeX math and highlight.js code highlighting.

## License

Released under the [MIT License](LICENSE). Linked videos, courses and cited sources belong to their respective owners.
