@@meta
{
  "moduleId": "MOD-9.5",
  "slug": "mod-9-5",
  "unitId": "UNIT-9",
  "unitTitle": "Unit 9: Coding with AI",
  "title": "Windsurf (now Devin Desktop)",
  "difficulty": "Intermediate",
  "estimatedMinutes": 95,
  "citations": [
    { "title": "Windsurf is now Devin Desktop", "source": "Cognition (Devin blog)", "url": "https://devin.ai/blog/windsurf-is-now-devin-desktop" },
    { "title": "Devin Desktop FAQ", "source": "Official Docs (Devin)", "url": "https://docs.devin.ai/desktop/devin-desktop-faq.md" },
    { "title": "Customizations: rules, AGENTS.md, skills", "source": "Official Docs (Devin)", "url": "https://docs.devin.ai/desktop/devin-local/customizations.md" },
    { "title": "Workflows (Cascade, legacy)", "source": "Official Docs (Devin)", "url": "https://docs.devin.ai/desktop/cascade/workflows" },
    { "title": "Cognition, maker of the AI coding agent Devin, acquires Windsurf", "source": "TechCrunch", "url": "https://techcrunch.com/2025/07/14/cognition-maker-of-the-ai-coding-agent-devin-acquires-windsurf/" },
    { "title": "Google, Cognition carve up Windsurf after OpenAI's failed acquisition bid", "source": "The Batch (DeepLearning.AI)", "url": "https://www.deeplearning.ai/the-batch/google-cognition-carve-up-windsurf-after-openais-failed-3b-acquisition-bid/" }
  ],
  "videoLibrary": [
    {
      "id": "VID-9.5-1",
      "title": "Windsurf is now Devin Desktop",
      "creator": "Cognition",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=5kLIIg-2K8M",
      "timingInstruction": "Watch after Section 1, before the history part of Section 2",
      "keyTakeaway": "What the rename brought: Devin Local, the Agent Command Center, and how local and cloud agents fit together."
    },
    {
      "id": "VID-9.5-2",
      "title": "Intro to Rules, Memories, & Workflows | Windsurf University",
      "creator": "Windsurf",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=xc9kktNRfaY",
      "timingInstruction": "Watch after the rules and memories part of Section 2, before Step 1 of the lab",
      "keyTakeaway": "The three customisation mechanisms Windsurf introduced, which carry over into Devin Desktop."
    },
    {
      "id": "VID-9.5-3",
      "title": "Best AI Code Editors in 2026 - Cursor vs Windsurf vs Copilot vs Zed vs Claude Code",
      "creator": "Nordic AI Dev",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=fiI5vG9VPHY",
      "timingInstruction": "Watch after the comparison part of Section 2, before Step 4 of the lab",
      "keyTakeaway": "How the main agentic editors differ in practice, as a starting point for your own weighted comparison."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Rule Discovery, Rule Triggers, Workflow-to-Skill Migration, IDE Comparison, Memory Hygiene",
    "context": "The tool shop's second development team used Windsurf, which became Devin Desktop in June 2026, and must check that its old rules and workflows still work while deciding whether to standardise on one editor. You will discover which rule files load and which are shadowed, decide when each rule triggers, migrate workflows to skills, compare editors with a weighted matrix, and clean up auto-generated memories.",
    "language": "python"
  }
}

@@reading
# Windsurf (now Devin Desktop)

**Windsurf** was one of the first editors built around an AI agent rather than an AI assistant. Its agent, **Cascade**, could read a code base, edit many files, run commands, and keep working through a task, and Windsurf introduced customisation ideas that the whole field adopted: **rules**, **memories**, and **workflows**. It also had one of the most dramatic corporate histories in software, ending, for now, as **Devin Desktop**, part of Cognition's Devin family.

This module covers that history briefly, because it explains why the product and its documentation look the way they do; the customisation mechanisms and how they carried over; and a method for comparing agentic editors, which matters more than any single product in a market that changes this fast. Facts are given as documented at the time of writing (November 2026).

## 1. First-Principles Mental Model & Intuition

### Same workshop, new owner, new foreman

Imagine a workshop you rely on is sold twice in a year. The tools on the wall stay the same, your keys still work, and the house rules you pinned up are still there, but there is a new foreman, a new name over the door, and some old procedures are being phased out. The sensible response is neither panic nor ignoring it: check which of your pinned rules the new foreman still reads, convert procedures written for the old foreman, and take the opportunity to ask whether this is still the right workshop.

That is the situation of a Windsurf team in 2026, and it is a pattern worth recognising, because every AI coding tool is changing quickly.

```text
   2024-2025  Codeium -> Windsurf editor, Cascade agent; rules, memories, workflows
   2025       OpenAI talks (about USD 3 billion) collapse -> Google licenses technology and hires CEO and
              key staff (about USD 2.4 billion) -> Cognition, maker of Devin, acquires the rest (July 2025)
   June 2026  Windsurf becomes Devin Desktop
                Devin Local replaces Cascade as the local agent (Cascade later retired)
                Agent Command Center: one board for local and cloud agents
                rules: .devin/rules preferred, .windsurf/rules and .windsurfrules still read, AGENTS.md read
                workflows (Cascade) -> skills (.devin/skills/<name>/SKILL.md)
   Your plan, pricing, settings, and extensions carried over
```

### Portable versus proprietary customisation

Every agentic editor offers ways to give the agent standing instructions. Some are portable, plain Markdown files such as AGENTS.md that several tools read; some are specific to one product. In a market where products are renamed, acquired, and re-priced within months, a team that keeps its knowledge in portable, version-controlled files loses little when it changes tools; a team whose conventions live in one product's private settings loses a lot.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### A short history

Windsurf grew out of **Codeium**, an AI autocomplete company, and launched the Windsurf editor with the Cascade agent. In 2025, talks for OpenAI to acquire it for about 3 billion US dollars fell through; Google then licensed Windsurf's technology and hired its chief executive, Varun Mohan, a co-founder, and some engineers in a deal reported at 2.4 billion US dollars; and within days, as TechCrunch reported in July 2025, Cognition, the maker of the Devin agent, acquired Windsurf's product, intellectual property, and remaining team. On 2 June 2026, Cognition renamed the editor **Devin Desktop**, delivered as an ordinary update.

### What changed in Devin Desktop

According to Cognition's announcement and FAQ:

| Area | Change |
|---|---|
| Local agent | **Devin Local**, described as the successor to Cascade, rewritten in Rust, supporting the same capabilities and settings, up to 30 percent more token efficient, with subagents |
| Cascade | Available as a legacy agent for a short transition; the current documentation says Devin Desktop no longer starts or opens Cascade conversations |
| Agent Command Center | The default surface: a single board for managing local and cloud agents, including some third-party agents |
| Devin Cloud | The autonomous, long-running Devin agent on its own cloud machine, a separate product |
| Plans and pricing | Unchanged for existing customers at the rename |
| Settings | Ported automatically, with a choice to migrate from Windsurf or start fresh |
| Commands | `devin-desktop` is the new shell command; legacy `windsurf` and `surf` commands still ship |

### Rules

Rules in Devin Desktop follow the Windsurf design. The documentation describes:

| Source | Behaviour |
|---|---|
| `AGENTS.md` | Read as always-on instructions, no frontmatter |
| `.devin/global_rules.md` | A single always-on file for the project |
| `.devin/rules/*.md` | Individual rules with a `trigger` in frontmatter; **preferred**, and takes precedence |
| `.windsurf/rules/*.md` | Legacy location, still imported as a fallback |
| `.windsurfrules` | Legacy single file, still read |
| `~/.devin/rules/`, `~/.devin/global_rules.md` | User-level rules for all projects |

The **trigger** decides when a rule applies: `always_on`; `glob`, with a `globs` pattern such as `**/*.test.ts`, when matching files are involved; `model_decision`, when the agent judges the rule's description relevant; and `manual`, when you mention it. These map closely onto Cursor's four rule behaviours in Module 9.4, and both tools read AGENTS.md. The FAQ notes that Cursor rules can also be imported. The documentation's advice is the same as everyone's: keep rules short and specific.

When the same rule exists in both `.devin/rules` and `.windsurf/rules`, the preferred location wins. A team that migrated some rules but not others can end up with an old rule silently shadowed by a new one, or an updated rule left behind in the legacy folder.

### Memories

Windsurf's **memories** let the agent save facts it learned during a session, such as "this project uses pnpm" or "the API base URL is https://api.example.com", and recall them later, alongside rules you write yourself. Auto-generated memories have the same strengths and risks as any agent memory, Modules 8.3 and 8.19: they save repeated explanations, but they can be duplicated, contradictory, or stale. A memory that says "tests use jest" after the project moved to vitest is worse than no memory. Treat memories like rules: review them periodically, delete stale ones, and promote durable facts into version-controlled rules.

### Workflows and skills

**Workflows** were saved Markdown procedures, invoked manually with a slash command such as `/deploy-staging`, and stored in `.windsurf/workflows/` or, later, `.devin/workflows/`. The documentation is explicit that workflows were manual-only, never invoked automatically, and limited to **12,000 characters** each. Under Devin Local, workflows are not supported; the documentation says to migrate them to **skills**, stored at `.devin/skills/<name>/SKILL.md` and invoked with `/skill-name`, the same skill format used by Claude Code and other tools.

Migration is mechanical: create the skill folder, add frontmatter with a name and description, and copy the procedure. A workflow over the size limit should be split, which usually improves it.

### Comparing agentic editors

With Claude Code, Cursor, Devin Desktop, GitHub Copilot, and others all capable, choosing a tool is a **multi-criteria decision**. A standard method is a weighted scoring matrix. First apply **must-haves** as filters: a tool lacking a required capability, for example on-premises deployment or a particular operating system, is out regardless of score. Then score each remaining tool $j$ from 1 to 5 on each criterion $c$, weight the criteria by importance $w_c$, and rank by

$$S_j = \sum_c w_c \, s_{j,c}$$

The weights carry the decision: a team that values the terminal and scripting weights those criteria highly; a team of designers who live in the editor weights the visual diff experience. Write the weights down before scoring, so that preferences do not quietly rearrange themselves to justify a favourite.

### Complexity

Rule discovery is linear in files. Trigger checks are linear in files times globs, or in the words of a description. Workflow migration is linear in the text. The comparison matrix is linear in tools times criteria. Memory hygiene with a dictionary of keys is linear in memories.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, discovering which rules load.

```python
import fnmatch
import re

FILES = {"AGENTS.md": "Run npm test before finishing.",
         ".devin/global_rules.md": "Use British spelling.",
         ".devin/rules/testing.md": "---\ntrigger: glob\nglobs: \"**/*.test.ts\"\n---\nUse vitest.",
         ".devin/rules/release.md": "---\ntrigger: manual\n---\nRelease checklist.",
         ".windsurf/rules/testing.md": "---\ntrigger: always_on\n---\nUse jest.",
         ".windsurf/rules/api.md": "---\ntrigger: model_decision\ndescription: REST API conventions for endpoints\n---\nReturn JSON errors.",
         ".windsurfrules": "Legacy: two-space indentation."}

def parse_rule(name, origin, text):
    rule = {"name": name, "origin": origin, "trigger": "always_on", "globs": [], "description": "", "body": text.strip()}
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                key, value = (s.strip() for s in line.split(":", 1))
                value = value.strip('"')
                if key == "globs":
                    rule["globs"] = [g.strip() for g in value.split(",") if g.strip()]
                elif key in ("trigger", "description"):
                    rule[key] = value
        rule["body"] = m.group(2).strip()
    return rule

def discover_rules(files):
    rules, seen = [], set()
    for path, name in (("AGENTS.md", "AGENTS"), (".devin/global_rules.md", "global_rules")):
        if path in files:
            rules.append(parse_rule(name, path, files[path]))
    for folder in (".devin/rules/", ".windsurf/rules/"):
        for path in sorted(p for p in files if p.startswith(folder) and p.endswith(".md")):
            name = path[len(folder):-3]
            if name not in seen:
                seen.add(name)
                rules.append(parse_rule(name, path, files[path]))
    if ".windsurfrules" in files:
        rules.append(parse_rule("windsurfrules", ".windsurfrules", files[".windsurfrules"]))
    return rules

for rule in discover_rules(FILES):
    print(rule["name"], rule["origin"], rule["trigger"])
```

- **AGENTS.md and the global rules file are always on, with no frontmatter needed.**
- **`.devin/rules` is read first, so its `testing` rule wins.** The legacy `testing` rule saying "Use jest" is shadowed: the right outcome here, but only if the team meant it.
- **The legacy `api` rule has no `.devin` counterpart, so it is still loaded.**
- **`.windsurfrules` is still read.** Six rules load, from five locations.

Next, deciding when each rule applies.

```python
WORD = re.compile(r"[a-z]+")

def active(rule, files, task, mentions):
    trigger = rule["trigger"]
    if trigger == "always_on":
        return True, "always on"
    if trigger == "glob":
        hit = any(fnmatch.fnmatch(f, g) for f in files for g in rule["globs"])
        return hit, "glob match" if hit else "no matching file"
    if trigger == "model_decision":
        overlap = set(WORD.findall(rule["description"].lower())) & set(WORD.findall(task.lower()))
        return len(overlap) >= 2, f"{len(overlap)} shared words"
    if trigger == "manual":
        return rule["name"] in mentions, "mentioned" if rule["name"] in mentions else "not mentioned"
    return False, "unknown trigger"

RULES = {r["name"]: r for r in discover_rules(FILES)}
print(active(RULES["testing"], ["src/cart.test.ts"], "fix the cart total", set()))
print(active(RULES["api"], ["src/api/orders.ts"], "add a REST endpoint for orders", set()))
print(active(RULES["release"], [], "prepare the release", {"release"}))
```

- **The glob rule fires because a test file is involved.**
- **Model-decision rules are judged by the agent; the lab stands in with a word-overlap count.** "REST" and "for" overlap, 2 shared words, so the API rule applies; "endpoint" and "endpoints" do not match, a reminder that the real judgement is the model's.
- **Manual rules apply only when mentioned.**

Then, migrating a workflow to a skill.

```python
def migrate_workflow(name, text, limit=12000):
    if len(text) > limit:
        return None, f"{len(text)} characters exceeds the {limit} limit; split it first"
    first = text.strip().splitlines()[0].lstrip("# ").strip() if text.strip() else name
    content = f"---\nname: {name}\ndescription: {first}\n---\n{text.strip()}\n"
    return f".devin/skills/{name}/SKILL.md", content

print(migrate_workflow("deploy-staging", "# Deploy to staging\n1. Run tests.\n2. Build.\n3. Deploy with ./deploy.sh staging."))
print(migrate_workflow("huge", "x" * 12001))
```

- **The skill lives in its own folder, named after the workflow.**
- **The first heading becomes the description.** Skills are selected by description, so make it say when to use the skill.
- **Workflows over 12,000 characters are refused.** Split long procedures into smaller skills.

Then, comparing editors.

```python
def choose_ide(ides, weights, must_have):
    ranked = []
    for name, info in ides.items():
        missing = [m for m in must_have if m not in info["features"]]
        if missing:
            continue
        ranked.append((sum(weights[c] * info["scores"][c] for c in weights), name))
    return sorted(ranked, key=lambda pair: (-pair[0], pair[1]))

IDES = {"Claude Code": {"features": {"terminal", "agents_md", "hooks"}, "scores": {"agent": 5, "editor": 3, "cost": 3, "team": 4}},
        "Cursor": {"features": {"agents_md", "plan_mode"}, "scores": {"agent": 4, "editor": 5, "cost": 3, "team": 4}},
        "Devin Desktop": {"features": {"agents_md", "cloud_agents"}, "scores": {"agent": 4, "editor": 4, "cost": 4, "team": 3}}}
print(choose_ide(IDES, {"agent": 3, "editor": 2, "cost": 2, "team": 1}, {"agents_md"}))
print(choose_ide(IDES, {"agent": 1, "editor": 3, "cost": 1, "team": 1}, {"agents_md"}))
print(choose_ide(IDES, {"agent": 3, "editor": 2, "cost": 2, "team": 1}, {"hooks"}))
```

- **Must-haves filter first.** Requiring hooks leaves only one candidate, whatever the scores.
- **The same scores rank differently under different weights.** Agent-heavy weights put Cursor first at 32, with Claude Code and Devin Desktop tied at 31; editor-heavy weights widen Cursor's lead and move Claude Code to last.
- **The scores here are illustrative.** Score from your own trial on your own code.

Finally, cleaning up memories.

```python
def memory_hygiene(memories, now, max_age_days=90):
    flags, first_by_key = {}, {}
    for memory in sorted(memories, key=lambda m: (m["created"], m["id"])):
        notes = []
        earlier = first_by_key.get(memory["key"])
        if earlier:
            notes.append(f"duplicate of {earlier['id']}" if earlier["value"] == memory["value"] else f"conflicts with {earlier['id']}")
        else:
            first_by_key[memory["key"]] = memory
        if now - memory["last_used"] > max_age_days:
            notes.append("stale")
        flags[memory["id"]] = notes
    return flags

MEMORIES = [{"id": "m1", "key": "test_runner", "value": "jest", "created": 10, "last_used": 40},
            {"id": "m2", "key": "package_manager", "value": "pnpm", "created": 12, "last_used": 300},
            {"id": "m3", "key": "test_runner", "value": "vitest", "created": 200, "last_used": 290},
            {"id": "m4", "key": "package_manager", "value": "pnpm", "created": 250, "last_used": 299}]
print(memory_hygiene(MEMORIES, now=300))
```

- **Memories are processed oldest first, so the first memory for each key is the reference.**
- **m3 conflicts with m1: the project moved from jest to vitest.** The old memory must go.
- **m1 is also stale, unused for 260 days.**
- **m4 duplicates m2.** Same fact, saved twice.

**Complexity.** `discover_rules` is linear in files after sorting each folder. `active` is linear in files times globs, or in description words. `migrate_workflow` is linear in the text. `choose_ide` is linear in tools times criteria. `memory_hygiene` sorts the memories and checks each once.

### A migration checklist for Windsurf teams

```text
RULES       move .windsurf/rules/*.md and .windsurfrules into .devin/rules/ with explicit triggers;
            delete the legacy copies so nothing is silently shadowed; keep shared conventions in AGENTS.md
WORKFLOWS   convert each to .devin/skills/<name>/SKILL.md; split any over 12,000 characters
MEMORIES    review: delete stale and conflicting entries; promote durable facts to rules
AGENT       confirm Devin Local behaves as expected on a known task; Cascade is retired
SCRIPTS     update anything that calls `windsurf` to `devin-desktop`; check managed-device allowlists
DECISION    re-run the weighted comparison with your must-haves before renewing seats
```

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Shadowed rules.** A rule edited in the legacy folder has no effect if a preferred copy exists. Keep one copy.

**Rules hidden in product settings.** Conventions in one tool's private settings are lost when you switch. Use version-controlled files, AGENTS.md first.

**Trusting old memories.** A stale "tests use jest" misleads every session. Review memories periodically.

**Workflows that silently stopped working.** Devin Local does not run workflows. Migrate them to skills.

**Over-long procedures.** A 12,000-character workflow is hard to follow, for agents and people. Split it.

**Reading old tutorials.** Many guides describe Cascade and Windsurf menus that no longer exist. Check the date.

**Scripts calling old commands.** Automation that runs `windsurf` may break as legacy commands are retired. Update to `devin-desktop`.

**Choosing tools by hype.** Rankings change monthly. Use must-haves and written weights.

**Comparing on toy projects.** Every tool shines on a to-do app. Trial on your own repository.

**Ignoring ownership changes.** Acquisitions change pricing, data handling, and roadmaps. Re-read terms after each.

**Model lists drift.** Which models a tool offers changes often. Check the current models page.

**Assuming portability.** AGENTS.md and skills are increasingly shared formats, but triggers and frontmatter differ. Test after moving.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Windsurf, the agent-first editor that grew out of Codeium, passed through a collapsed OpenAI deal, a Google licensing and hiring deal, and an acquisition by Cognition in July 2025, and on 2 June 2026 became Devin Desktop, with Devin Local replacing the Cascade agent, an Agent Command Center for local and cloud agents, and plans, pricing, and settings carried over. Rules come from AGENTS.md and a global rules file, both always on, and from rule files with `always_on`, `glob`, `model_decision`, or `manual` triggers; `.devin/rules` is preferred and shadows same-named rules in the legacy `.windsurf/rules`, and `.windsurfrules` is still read. Memories save learned facts but need review for duplicates, conflicts, and staleness. Manual workflows, limited to 12,000 characters, are not supported by Devin Local and migrate to skills in `.devin/skills/<name>/SKILL.md`. Choosing among agentic editors works best with must-have filters and a weighted scoring matrix decided before scoring, and with team knowledge kept in portable, version-controlled files.

**Question 1.** After the rename, a developer edits `.windsurf/rules/testing.md` to say "Use vitest with coverage", but the agent never mentions coverage. Using `discover_rules`, explain why, and fix the setup.

<details>
<summary>View Answer</summary>

`discover_rules` reads `.devin/rules/` before `.windsurf/rules/`, and records each rule name the first time it sees it. The project already has `.devin/rules/testing.md`, so the name `testing` is taken by the preferred copy, "Use vitest" with a glob trigger, and the legacy `.windsurf/rules/testing.md` is skipped entirely. The developer's edit is in a file that no longer loads, which matches the documentation's statement that `.devin/rules/` takes precedence with `.windsurf/rules/` as a fallback. The fix is to make the preferred file the single source of truth: edit `.devin/rules/testing.md` to say "Use vitest with coverage", keeping its glob trigger for test files, and delete the legacy copy so the confusion cannot recur. While doing so, migrate the other legacy rules, here `api.md` and `.windsurfrules`, into `.devin/rules/` with explicit triggers, and check the result by listing the active rules for a sample task, as `active` does in the lab.

</details>

**Question 2.** The team's 14,500-character `/release` workflow fails to migrate. Using `migrate_workflow`, explain the failure and describe a better structure.

<details>
<summary>View Answer</summary>

`migrate_workflow` refuses any workflow longer than 12,000 characters, the documented limit for workflow files, returning a message that 14,500 characters exceeds the limit and must be split first. The limit is a useful prompt to restructure: a 14,500-character procedure probably mixes several jobs, such as version bumping, changelog writing, building, deploying, and post-release checks, and an agent following one long document is more likely to skip or confuse steps. Split it into focused skills, for example `bump-version`, `write-changelog`, `deploy-production`, and `post-release-checks`, each with a description that says when to use it, and a short `release` skill that lists the order and invokes the others. Each piece then migrates cleanly to `.devin/skills/<name>/SKILL.md`, can be tested and improved separately, and is reusable, for example `deploy-production` for hotfixes. Steps that must never be skipped, such as running tests before deploying, should also be enforced outside the agent, in continuous integration, Module 9.11.

</details>

**Question 3.** Using `choose_ide` with the lab's scores, show how the ranking changes between an agent-focused team, weights agent 3, editor 2, cost 2, team 1, and an editor-focused team, weights agent 1, editor 3, cost 1, team 1. What does this say about tool comparisons you read online?

<details>
<summary>View Answer</summary>

With agent-focused weights, Claude Code scores 3 times 5 plus 2 times 3 plus 2 times 3 plus 1 times 4, which is 31; Cursor scores 12 plus 10 plus 6 plus 4, 32; and Devin Desktop 12 plus 8 plus 8 plus 3, 31. So Cursor leads narrowly with 32, and Claude Code and Devin Desktop tie at 31, with the tie broken by name; despite Claude Code's top agent score, its lower editor score costs it the lead. With editor-focused weights, Claude Code scores 5 plus 9 plus 3 plus 4, 21; Cursor 4 plus 15 plus 3 plus 4, 26; Devin Desktop 4 plus 12 plus 4 plus 3, 23; so Cursor leads more clearly and Devin Desktop moves to second. Requiring hooks as a must-have would remove every tool except Claude Code before scoring. The lesson is that rankings are a function of weights and must-haves as much as of the tools: an online comparison reflects its author's priorities, workloads, and the product versions of the month it was written. Use such comparisons for candidate features, then write your own weights and must-haves first, score the tools on a trial with your own code, and record the reasoning so the decision can be revisited when products change, as they did repeatedly in 2025 and 2026.

</details>

@@starter
"""
Lab: Rule Discovery, Rule Triggers, Workflow-to-Skill Migration, IDE Comparison, Memory Hygiene
Standard library only. A simplified model of Devin Desktop's customisation files. Complete the TODO in each step,
then press "Run & Verify Step".
"""
import fnmatch
import re

FILES = {"AGENTS.md": "Run npm test before finishing.",
         ".devin/global_rules.md": "Use British spelling.",
         ".devin/rules/testing.md": "---\ntrigger: glob\nglobs: \"**/*.test.ts\"\n---\nUse vitest.",
         ".devin/rules/release.md": "---\ntrigger: manual\n---\nRelease checklist.",
         ".windsurf/rules/testing.md": "---\ntrigger: always_on\n---\nUse jest.",
         ".windsurf/rules/api.md": "---\ntrigger: model_decision\ndescription: REST API conventions for endpoints\n---\nReturn JSON errors.",
         ".windsurfrules": "Legacy: two-space indentation."}
WORD = re.compile(r"[a-z]+")
IDES = {"Claude Code": {"features": {"terminal", "agents_md", "hooks"}, "scores": {"agent": 5, "editor": 3, "cost": 3, "team": 4}},
        "Cursor": {"features": {"agents_md", "plan_mode"}, "scores": {"agent": 4, "editor": 5, "cost": 3, "team": 4}},
        "Devin Desktop": {"features": {"agents_md", "cloud_agents"}, "scores": {"agent": 4, "editor": 4, "cost": 4, "team": 3}}}
MEMORIES = [{"id": "m1", "key": "test_runner", "value": "jest", "created": 10, "last_used": 40},
            {"id": "m2", "key": "package_manager", "value": "pnpm", "created": 12, "last_used": 300},
            {"id": "m3", "key": "test_runner", "value": "vitest", "created": 200, "last_used": 290},
            {"id": "m4", "key": "package_manager", "value": "pnpm", "created": 250, "last_used": 299}]


def parse_rule(name, origin, text):
    """Given: trigger (default always_on), globs, description from frontmatter; body after it."""
    rule = {"name": name, "origin": origin, "trigger": "always_on", "globs": [], "description": "", "body": text.strip()}
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                key, value = (s.strip() for s in line.split(":", 1))
                value = value.strip('"')
                if key == "globs":
                    rule["globs"] = [g.strip() for g in value.split(",") if g.strip()]
                elif key in ("trigger", "description"):
                    rule[key] = value
        rule["body"] = m.group(2).strip()
    return rule


# ---------------------------------------------------------------- Step 1
def discover_rules(files):
    """Load AGENTS.md (name "AGENTS") and .devin/global_rules.md ("global_rules"); then .devin/rules/*.md and
    .windsurf/rules/*.md in sorted order, skipping names already seen; then .windsurfrules ("windsurfrules").
    Use parse_rule(name, path, text)."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def active(rule, files, task, mentions):
    """always_on -> (True, "always on"); glob -> (any fnmatch, "glob match" or "no matching file"); model_decision ->
    (shared lower-case words of description and task >= 2, "<n> shared words"); manual -> (name in mentions,
    "mentioned" or "not mentioned"); else (False, "unknown trigger")."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def migrate_workflow(name, text, limit=12000):
    """Over the limit -> (None, "<n> characters exceeds the <limit> limit; split it first"). Else description = first
    line of the stripped text without leading "# " (or the name if empty); return (".devin/skills/<name>/SKILL.md",
    "---\\nname: <name>\\ndescription: <desc>\\n---\\n<stripped text>\\n")."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def choose_ide(ides, weights, must_have):
    """Skip tools missing any must-have feature. Score = sum(weight * score). Return [(score, name)] sorted by score
    descending, then name."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def memory_hygiene(memories, now, max_age_days=90):
    """Process by (created, id). The first memory per key is the reference; later ones get "duplicate of <id>" (same
    value) or "conflicts with <id>". Any memory with now - last_used > max_age_days also gets "stale".
    Return {id: [notes]}."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("rules  :", discover_rules(FILES))
    print("migrate:", migrate_workflow("deploy-staging", "# Deploy to staging\n1. Run tests."))

@@solution
"""
Lab solution: Rule Discovery, Rule Triggers, Workflow-to-Skill Migration, IDE Comparison, Memory Hygiene
Standard library only. A simplified model of Devin Desktop's customisation files.
"""
import fnmatch
import re

FILES = {"AGENTS.md": "Run npm test before finishing.",
         ".devin/global_rules.md": "Use British spelling.",
         ".devin/rules/testing.md": "---\ntrigger: glob\nglobs: \"**/*.test.ts\"\n---\nUse vitest.",
         ".devin/rules/release.md": "---\ntrigger: manual\n---\nRelease checklist.",
         ".windsurf/rules/testing.md": "---\ntrigger: always_on\n---\nUse jest.",
         ".windsurf/rules/api.md": "---\ntrigger: model_decision\ndescription: REST API conventions for endpoints\n---\nReturn JSON errors.",
         ".windsurfrules": "Legacy: two-space indentation."}
WORD = re.compile(r"[a-z]+")
IDES = {"Claude Code": {"features": {"terminal", "agents_md", "hooks"}, "scores": {"agent": 5, "editor": 3, "cost": 3, "team": 4}},
        "Cursor": {"features": {"agents_md", "plan_mode"}, "scores": {"agent": 4, "editor": 5, "cost": 3, "team": 4}},
        "Devin Desktop": {"features": {"agents_md", "cloud_agents"}, "scores": {"agent": 4, "editor": 4, "cost": 4, "team": 3}}}
MEMORIES = [{"id": "m1", "key": "test_runner", "value": "jest", "created": 10, "last_used": 40},
            {"id": "m2", "key": "package_manager", "value": "pnpm", "created": 12, "last_used": 300},
            {"id": "m3", "key": "test_runner", "value": "vitest", "created": 200, "last_used": 290},
            {"id": "m4", "key": "package_manager", "value": "pnpm", "created": 250, "last_used": 299}]


def parse_rule(name, origin, text):
    """Given: trigger (default always_on), globs, description from frontmatter; body after it."""
    rule = {"name": name, "origin": origin, "trigger": "always_on", "globs": [], "description": "", "body": text.strip()}
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                key, value = (s.strip() for s in line.split(":", 1))
                value = value.strip('"')
                if key == "globs":
                    rule["globs"] = [g.strip() for g in value.split(",") if g.strip()]
                elif key in ("trigger", "description"):
                    rule[key] = value
        rule["body"] = m.group(2).strip()
    return rule


# ---------------------------------------------------------------- Step 1
def discover_rules(files):
    """Preferred locations first; same-named legacy rules are shadowed."""
    rules, seen = [], set()
    for path, name in (("AGENTS.md", "AGENTS"), (".devin/global_rules.md", "global_rules")):
        if path in files:
            rules.append(parse_rule(name, path, files[path]))
    for folder in (".devin/rules/", ".windsurf/rules/"):
        for path in sorted(p for p in files if p.startswith(folder) and p.endswith(".md")):
            name = path[len(folder):-3]
            if name not in seen:
                seen.add(name)
                rules.append(parse_rule(name, path, files[path]))
    if ".windsurfrules" in files:
        rules.append(parse_rule("windsurfrules", ".windsurfrules", files[".windsurfrules"]))
    return rules


# ---------------------------------------------------------------- Step 2
def active(rule, files, task, mentions):
    """Four triggers; the model's judgement is approximated by word overlap."""
    trigger = rule["trigger"]
    if trigger == "always_on":
        return True, "always on"
    if trigger == "glob":
        hit = any(fnmatch.fnmatch(f, g) for f in files for g in rule["globs"])
        return hit, "glob match" if hit else "no matching file"
    if trigger == "model_decision":
        overlap = set(WORD.findall(rule["description"].lower())) & set(WORD.findall(task.lower()))
        return len(overlap) >= 2, f"{len(overlap)} shared words"
    if trigger == "manual":
        return rule["name"] in mentions, "mentioned" if rule["name"] in mentions else "not mentioned"
    return False, "unknown trigger"


# ---------------------------------------------------------------- Step 3
def migrate_workflow(name, text, limit=12000):
    """Workflows become skills; oversized ones must be split first."""
    if len(text) > limit:
        return None, f"{len(text)} characters exceeds the {limit} limit; split it first"
    first = text.strip().splitlines()[0].lstrip("# ").strip() if text.strip() else name
    content = f"---\nname: {name}\ndescription: {first}\n---\n{text.strip()}\n"
    return f".devin/skills/{name}/SKILL.md", content


# ---------------------------------------------------------------- Step 4
def choose_ide(ides, weights, must_have):
    """Must-haves filter; written weights rank."""
    ranked = []
    for name, info in ides.items():
        missing = [m for m in must_have if m not in info["features"]]
        if missing:
            continue
        ranked.append((sum(weights[c] * info["scores"][c] for c in weights), name))
    return sorted(ranked, key=lambda pair: (-pair[0], pair[1]))


# ---------------------------------------------------------------- Step 5
def memory_hygiene(memories, now, max_age_days=90):
    """Duplicates, conflicts, and staleness: memories need housekeeping too."""
    flags, first_by_key = {}, {}
    for memory in sorted(memories, key=lambda m: (m["created"], m["id"])):
        notes = []
        earlier = first_by_key.get(memory["key"])
        if earlier:
            notes.append(f"duplicate of {earlier['id']}" if earlier["value"] == memory["value"] else f"conflicts with {earlier['id']}")
        else:
            first_by_key[memory["key"]] = memory
        if now - memory["last_used"] > max_age_days:
            notes.append("stale")
        flags[memory["id"]] = notes
    return flags


if __name__ == "__main__":
    print([(r["name"], r["origin"]) for r in discover_rules(FILES)])
    print(migrate_workflow("release", "x" * 14500)[1])
    print(choose_ide(IDES, {"agent": 3, "editor": 2, "cost": 2, "team": 1}, {"agents_md"}))
    print(choose_ide(IDES, {"agent": 1, "editor": 3, "cost": 1, "team": 1}, {"agents_md"}))
    print(memory_hygiene(MEMORIES, now=300))

@@step
{
  "stepNumber": 1,
  "title": "Discover which rules load",
  "instruction": "Implement discover_rules(files). First add AGENTS.md as 'AGENTS' and .devin/global_rules.md as 'global_rules' if present. Then, for the folders '.devin/rules/' and '.windsurf/rules/' in that order, go through their '.md' files in sorted order, name each by its file name without the folder and '.md', and add it only if that name has not been seen. Finally add '.windsurfrules' as 'windsurfrules' if present. Build each rule with parse_rule(name, path, text). Discover the rules in FILES. This is rules from Section 2. [MOD-9.5]",
  "hintConceptual": "Read the noticeboards in order of authority, the new one before the old one, and ignore an old notice when the new board already has one with the same title.",
  "hintSyntax": "rules, seen = [], set()\nfor path, name in ((\"AGENTS.md\", \"AGENTS\"), (\".devin/global_rules.md\", \"global_rules\")):\n    if path in files:\n        rules.append(parse_rule(name, path, files[path]))\nfor folder in (\".devin/rules/\", \".windsurf/rules/\"):\n    for path in sorted(p for p in files if p.startswith(folder) and p.endswith(\".md\")):\n        name = path[len(folder):-3]\n        if name not in seen:\n            seen.add(name)\n            rules.append(parse_rule(name, path, files[path]))\nif \".windsurfrules\" in files:\n    rules.append(parse_rule(\"windsurfrules\", \".windsurfrules\", files[\".windsurfrules\"]))\nreturn rules"
}
@@assert
_r = discover_rules(FILES)
assert _r is not None and [(r["name"], r["origin"]) for r in _r] == [("AGENTS", "AGENTS.md"), ("global_rules", ".devin/global_rules.md"), ("release", ".devin/rules/release.md"), ("testing", ".devin/rules/testing.md"), ("api", ".windsurf/rules/api.md"), ("windsurfrules", ".windsurfrules")], f"Six rules, legacy testing shadowed, got {[(r['name'], r['origin']) for r in _r]}"
_t = {r["name"]: r for r in _r}["testing"]
assert _t["trigger"] == "glob" and _t["globs"] == ["**/*.test.ts"] and _t["body"] == "Use vitest.", "The preferred testing rule wins"
assert discover_rules({".windsurf/rules/testing.md": FILES[".windsurf/rules/testing.md"]})[0]["body"] == "Use jest." and discover_rules({}) == [], "Legacy alone still loads; nothing to load"
print("Step 1 passed: six rules load, and the legacy 'Use jest' rule is shadowed.")

@@step
{
  "stepNumber": 2,
  "title": "Decide when rules trigger",
  "instruction": "Implement active(rule, files, task, mentions). For 'always_on' return (True, 'always on'). For 'glob' return whether any file matches any glob with fnmatch, and 'glob match' or 'no matching file'. For 'model_decision' count the distinct lower-case words shared by the description and the task, and return (count >= 2, '<count> shared words'). For 'manual' return whether the rule's name is in mentions, with 'mentioned' or 'not mentioned'. Otherwise return (False, 'unknown trigger'). Check each of the four triggers and an unknown trigger. This is rules from Section 2. [MOD-9.5]",
  "hintConceptual": "Some notices are always read, some only when you pick up a certain kind of file, some when the task sounds related, and some only when you ask for them by name.",
  "hintSyntax": "trigger = rule[\"trigger\"]\nif trigger == \"always_on\":\n    return True, \"always on\"\nif trigger == \"glob\":\n    hit = any(fnmatch.fnmatch(f, g) for f in files for g in rule[\"globs\"])\n    return hit, \"glob match\" if hit else \"no matching file\"\nif trigger == \"model_decision\":\n    overlap = set(WORD.findall(rule[\"description\"].lower())) & set(WORD.findall(task.lower()))\n    return len(overlap) >= 2, f\"{len(overlap)} shared words\"\nif trigger == \"manual\":\n    return rule[\"name\"] in mentions, \"mentioned\" if rule[\"name\"] in mentions else \"not mentioned\"\nreturn False, \"unknown trigger\""
}
@@assert
_glob = {"name": "testing", "trigger": "glob", "globs": ["**/*.test.ts"], "description": ""}
_md = {"name": "api", "trigger": "model_decision", "globs": [], "description": "REST API conventions for endpoints"}
_man = {"name": "release", "trigger": "manual", "globs": [], "description": ""}
assert active(_glob, ["src/cart.test.ts"], "fix the cart total", set()) == (True, "glob match") and active(_glob, ["src/cart.ts"], "x", set()) == (False, "no matching file"), f"Glob trigger, got {active(_glob, ['src/cart.test.ts'], 'fix', set())}"
assert active(_md, [], "add a REST endpoint for orders", set()) == (True, "2 shared words") and active(_md, [], "fix the footer", set()) == (False, "0 shared words"), "Model decision approximated"
assert active(_man, [], "prepare the release", {"release"}) == (True, "mentioned") and active(_man, [], "prepare the release", set()) == (False, "not mentioned"), "Manual trigger"
assert active({"name": "a", "trigger": "always_on"}, [], "", set()) == (True, "always on") and active({"name": "b", "trigger": "weekly"}, [], "", set()) == (False, "unknown trigger"), "Always on; unknown"
print("Step 2 passed: a test file triggers the testing rule; a task sharing two description words triggers the API rule.")

@@step
{
  "stepNumber": 3,
  "title": "Migrate a workflow to a skill",
  "instruction": "Implement migrate_workflow(name, text, limit). If the text is longer than the limit, return (None, '<length> characters exceeds the <limit> limit; split it first'). Otherwise take the description from the first line of the stripped text with leading '#' and spaces removed (or the name if the text is empty), and return ('.devin/skills/<name>/SKILL.md', a string of '---', 'name: <name>', 'description: <description>', '---', then the stripped text, each on its own line, ending with a newline). Check four cases. This is workflows and skills from Section 2. [MOD-9.5]",
  "hintConceptual": "Move each written procedure into its own folder with a short label on the front saying what it is for, and send back any procedure too long to fit the binder.",
  "hintSyntax": "if len(text) > limit:\n    return None, f\"{len(text)} characters exceeds the {limit} limit; split it first\"\nfirst = text.strip().splitlines()[0].lstrip(\"# \").strip() if text.strip() else name\ncontent = f\"---\\nname: {name}\\ndescription: {first}\\n---\\n{text.strip()}\\n\"\nreturn f\".devin/skills/{name}/SKILL.md\", content"
}
@@assert
_w = migrate_workflow("deploy-staging", "# Deploy to staging\n1. Run tests.\n2. Build.\n3. Deploy with ./deploy.sh staging.")
assert _w == (".devin/skills/deploy-staging/SKILL.md", "---\nname: deploy-staging\ndescription: Deploy to staging\n---\n# Deploy to staging\n1. Run tests.\n2. Build.\n3. Deploy with ./deploy.sh staging.\n"), f"A migrated skill, got {_w}"
assert migrate_workflow("release", "x" * 14500) == (None, "14500 characters exceeds the 12000 limit; split it first"), "Too long"
assert migrate_workflow("ok", "x" * 12000)[0] == ".devin/skills/ok/SKILL.md" and migrate_workflow("empty", "")[1] == "---\nname: empty\ndescription: empty\n---\n\n", "Exactly at the limit; empty text"
print("Step 3 passed: /deploy-staging becomes a skill; the 14,500-character release workflow must be split.")

@@step
{
  "stepNumber": 4,
  "title": "Compare editors with a weighted matrix",
  "instruction": "Implement choose_ide(ides, weights, must_have). Skip any tool missing a must-have feature. Score the rest as the sum over the weights of weight times the tool's score for that criterion. Return a list of (score, name) sorted by score from highest, then by name. Rank the three editors for an agent-focused team, an editor-focused team, and a team that must have hooks. This is comparing agentic editors from Section 2. [MOD-9.5]",
  "hintConceptual": "Cross off the candidates that lack a deal-breaker, then add up marks per criterion multiplied by how much that criterion matters to you, decided before you look at the marks.",
  "hintSyntax": "ranked = []\nfor name, info in ides.items():\n    if [m for m in must_have if m not in info[\"features\"]]:\n        continue\n    ranked.append((sum(weights[c] * info[\"scores\"][c] for c in weights), name))\nreturn sorted(ranked, key=lambda pair: (-pair[0], pair[1]))"
}
@@assert
_agent = {"agent": 3, "editor": 2, "cost": 2, "team": 1}
_editor = {"agent": 1, "editor": 3, "cost": 1, "team": 1}
assert choose_ide(IDES, _agent, {"agents_md"}) == [(32, "Cursor"), (31, "Claude Code"), (31, "Devin Desktop")], f"Agent-focused, got {choose_ide(IDES, _agent, {'agents_md'})}"
assert choose_ide(IDES, _editor, {"agents_md"}) == [(26, "Cursor"), (23, "Devin Desktop"), (21, "Claude Code")], "Editor-focused"
assert choose_ide(IDES, _agent, {"hooks"}) == [(31, "Claude Code")] and choose_ide(IDES, _agent, {"teleport"}) == [], "Must-haves filter first"
print("Step 4 passed: weights reorder the field; requiring hooks leaves one candidate.")

@@step
{
  "stepNumber": 5,
  "title": "Clean up memories",
  "instruction": "Implement memory_hygiene(memories, now, max_age_days). Process memories in order of (created, id). The first memory seen for each key is the reference; a later memory with the same key gets 'duplicate of <reference id>' if its value is the same, or 'conflicts with <reference id>' otherwise. Any memory with now minus last_used above max_age_days also gets 'stale'. Return a dict of each id and its notes. Check four memories. This is memories from Section 2. [MOD-9.5]",
  "hintConceptual": "Go through the notebook from the oldest page: cross out notes that repeat an earlier one, flag notes that contradict it, and mark anything nobody has looked at for months.",
  "hintSyntax": "flags, first_by_key = {}, {}\nfor memory in sorted(memories, key=lambda m: (m[\"created\"], m[\"id\"])):\n    notes = []\n    earlier = first_by_key.get(memory[\"key\"])\n    if earlier:\n        notes.append(f\"duplicate of {earlier['id']}\" if earlier[\"value\"] == memory[\"value\"] else f\"conflicts with {earlier['id']}\")\n    else:\n        first_by_key[memory[\"key\"]] = memory\n    if now - memory[\"last_used\"] > max_age_days:\n        notes.append(\"stale\")\n    flags[memory[\"id\"]] = notes\nreturn flags"
}
@@assert
assert memory_hygiene(MEMORIES, now=300) == {"m1": ["stale"], "m2": [], "m3": ["conflicts with m1"], "m4": ["duplicate of m2"]}, f"Stale, conflict, duplicate, got {memory_hygiene(MEMORIES, now=300)}"
assert memory_hygiene(MEMORIES, now=300, max_age_days=300) == {"m1": [], "m2": [], "m3": ["conflicts with m1"], "m4": ["duplicate of m2"]}, "A longer age limit"
assert memory_hygiene([], now=1) == {} and memory_hygiene([{"id": "x", "key": "k", "value": 1, "created": 0, "last_used": 0}], now=91) == {"x": ["stale"]}, "Empty; just over the limit"
print("Step 5 passed: the old jest memory is stale and contradicted; the pnpm memory was saved twice.")
