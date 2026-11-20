@@meta
{
  "moduleId": "MOD-9.3",
  "slug": "mod-9-3",
  "unitId": "UNIT-9",
  "unitTitle": "Unit 9: Coding with AI",
  "title": "Claude Code",
  "difficulty": "Intermediate",
  "estimatedMinutes": 110,
  "citations": [
    { "title": "Set up Claude Code", "source": "Official Docs (Claude Code)", "url": "https://code.claude.com/docs/en/setup" },
    { "title": "Manage Claude's memory (CLAUDE.md)", "source": "Official Docs (Claude Code)", "url": "https://code.claude.com/docs/en/memory" },
    { "title": "Settings", "source": "Official Docs (Claude Code)", "url": "https://code.claude.com/docs/en/settings" },
    { "title": "Common workflows (plan mode)", "source": "Official Docs (Claude Code)", "url": "https://code.claude.com/docs/en/common-workflows" },
    { "title": "Subagents", "source": "Official Docs (Claude Code)", "url": "https://code.claude.com/docs/en/sub-agents" },
    { "title": "Hooks reference", "source": "Official Docs (Claude Code)", "url": "https://code.claude.com/docs/en/hooks" },
    { "title": "Connect Claude Code to tools via MCP", "source": "Official Docs (Claude Code)", "url": "https://code.claude.com/docs/en/mcp" },
    { "title": "Best practices", "source": "Official Docs (Claude Code)", "url": "https://code.claude.com/docs/en/best-practices" }
  ],
  "videoLibrary": [
    {
      "id": "VID-9.3-1",
      "title": "Rules, Skills, Hooks & MCP Explained in 10 minutes",
      "creator": "Snyk",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=5LZg_WO0t-s",
      "timingInstruction": "Watch after Section 1, before the configuration parts of Section 2",
      "keyTakeaway": "How rules, skills, hooks, and MCP extend Claude Code."
    },
    {
      "id": "VID-9.3-2",
      "title": "The Explore → Plan → Code → Commit workflow in Claude Code",
      "creator": "Claude",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=xJQuF02NAK8",
      "timingInstruction": "Watch after the plan mode part of Section 2, before Section 3",
      "keyTakeaway": "Anthropic's recommended rhythm for a feature: understand, plan, implement with checks, commit."
    },
    {
      "id": "VID-9.3-3",
      "title": "Claude Code Skills vs CLAUDE.md vs Subagents vs Hooks vs MCP Explained",
      "creator": "Elshad Karimov",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=vYnJnphDs0Q",
      "timingInstruction": "Watch after the subagents, hooks, and MCP parts of Section 2, before Step 4 of the lab",
      "keyTakeaway": "Which extension mechanism to reach for, and why guidance and enforcement live in different places."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Settings Precedence, Permission Rules, CLAUDE.md Loading, Subagent Files, Hooks",
    "context": "The tool shop's developers are adopting Claude Code across their repositories and want shared settings that protect secrets, team instructions that load correctly, a reviewer subagent, and hooks that enforce the rules nobody may break. You will model how settings layers merge, how permission rules are decided, how CLAUDE.md files and imports load, how subagent files are parsed, and how hooks block actions.",
    "language": "python"
  }
}

@@reading
# Claude Code

**Claude Code** is Anthropic's agentic coding tool. It runs in your terminal, and also in IDE extensions, a desktop app, and the web, reads your code base, edits files, runs commands such as your tests, and iterates until a task is done, with you approving or steering along the way. In the spectrum of Module 9.1 it is firmly an **agent**: it plans, acts across many files, and checks its own work by running things.

This module covers installing and configuring it for a project, the mechanisms that shape its behaviour, **CLAUDE.md**, **permissions**, **plan mode**, **subagents**, **hooks**, and **MCP**, and a complete feature workflow. Product details are described as documented at the time of writing (November 2026); the tool changes often, so check the official documentation for the current specifics.

## 1. First-Principles Mental Model & Intuition

### A capable contractor in your workshop

Hiring a skilled contractor to work in your workshop raises the same questions as configuring Claude Code. **What do they need to know?** The house rules, where the tools are, how to test the work: that is CLAUDE.md. **What may they do without asking?** Use the sander, yes; touch the electrics, ask first; open the safe, never: that is permissions. **Should they start immediately or show you a plan first?** That is plan mode. **Can they bring in specialists?** That is subagents. **Are there rules enforced no matter what?** The circuit breaker trips whatever the contractor intends: that is hooks and deny rules. **What other systems can they use?** The supplier's ordering system, the job tracker: that is MCP.

```text
                      CLAUDE CODE SESSION (in your repository)
   guidance  ------>  CLAUDE.md files (managed, user, project, local) + imports   "please do"
   control   ------>  settings layers -> permissions: deny > ask > allow          "may / must ask / never"
   mode      ------>  default | acceptEdits | plan | auto | others                "how much to ask"
   delegation ----->  subagents (.claude/agents/*.md): own context, tools, model
   enforcement ---->  hooks (PreToolUse, PostToolUse, Stop and more): code that can block
   reach    ------->  MCP servers (claude mcp add): issue tracker, docs, databases
                                        |
                       explore -> plan -> implement + run checks -> review diff -> commit
```

### Guidance versus enforcement

The single most important distinction in configuring Claude Code is between **guidance** and **enforcement**. The documentation's best-practices guide puts it directly: CLAUDE.md is guidance that Claude reads, while deny rules, hooks, and managed settings apply every time. "Never read the `.env` file" in CLAUDE.md is a request; `Read(./.env)` in a deny list is a rule. Use guidance for conventions and preferences, and enforcement for anything that must have no exceptions, as Module 9.2's Replit story showed.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Installing and starting

The documentation recommends the native installer: on macOS, Linux, and WSL, `curl -fsSL https://claude.ai/install.sh | bash`; on Windows PowerShell, `irm https://claude.ai/install.ps1 | iex`. Package managers are also supported, including Homebrew (`brew install --cask claude-code`), WinGet (`winget install Anthropic.ClaudeCode`), and npm (`npm install -g @anthropic-ai/claude-code`, which needs Node.js 22 or later). Check the installation with `claude --version` and diagnose problems with `claude doctor`. Start a session by running `claude` in the project folder. At the time of writing, Claude Code requires a paid Claude plan or an API Console account; the free plan is not included. On native Windows, installing Git for Windows lets the Bash tool work; otherwise PowerShell is used.

### CLAUDE.md: project memory

CLAUDE.md files are Markdown instructions loaded into every session. The documented locations, from broadest to narrowest:

| Scope | Location | Shared? |
|---|---|---|
| Managed policy | System location set by an organisation, for example `/etc/claude-code/CLAUDE.md` on Linux | Organisation-wide |
| User | `~/.claude/CLAUDE.md` | Just you, all projects |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Committed, the team |
| Local | `./CLAUDE.local.md` | Just you, this project; add to `.gitignore` |

Claude Code reads CLAUDE.md and CLAUDE.local.md from the working directory and **every directory above it**, and the files are **concatenated, not overridden**: broader content comes first, and within a directory the local file comes after the shared one. Files in subdirectories below the working directory load on demand, when Claude works in them. A file can **import** another with a line such as `@docs/style.md`; imports can nest up to a documented maximum of four hops. Running `/init` generates a starting CLAUDE.md from the code base, or suggests improvements to an existing one.

What belongs in it: the commands to build, test, and lint; conventions that are not obvious from the code; architecture notes; and things Claude cannot see, such as which services are mocked. The best-practices guide recommends keeping it concise, under about 200 lines, and notes that the single most useful line is often the command that runs the tests.

### Settings layers and precedence

Settings are JSON files at several levels. From highest to lowest precedence, as documented: **managed** settings deployed by an organisation; **command-line** arguments; **local project** settings, `.claude/settings.local.json`, personal and kept out of Git; **shared project** settings, `.claude/settings.json`, committed for the team; and **user** settings, `~/.claude/settings.json`. For a single value such as the model, the highest layer that sets it wins. **Permission lists merge** across layers rather than replacing each other, so a deny rule from any layer stays in force. `/status` shows which settings files were loaded.

If we write the layers in increasing precedence as $L_1, \dots, L_5$, a scalar setting $k$ resolves to

$$\text{value}(k) = L_j[k], \quad j = \max\{\, i : k \in L_i \,\}$$

while each permission list is the union $\bigcup_i L_i[\text{list}]$.

### Permissions

Permission rules name a tool and optionally a pattern: `Bash(npm run lint)` allows exactly that command; `Bash(npm run test *)` allows commands that start with it; `Read(./.env)` and `Read(./.env.*)` refer to files; a bare `WebFetch` refers to the whole tool. Rules sit in three lists, `allow`, `ask`, and `deny`, under a `permissions` key:

```json
{
  "permissions": {
    "allow": ["Bash(npm run lint)", "Bash(npm run test *)"],
    "ask": ["Bash(git push *)"],
    "deny": ["Read(./.env)", "Read(./.env.*)"]
  }
}
```

A tool call is checked against **deny first, then ask, then allow**; a matching deny always wins, and the documentation notes that deny rules hold in every permission mode, including the most permissive ones. A call that matches nothing falls back to the current **permission mode**. The documented modes include `default`, which asks before edits and commands; `acceptEdits`, which accepts file edits automatically; `plan`, which only reads and proposes; `auto`, in which a safety classifier approves or escalates actions; `dontAsk`; and `bypassPermissions`, which should be used only in isolated environments. Organisations can prevent the permissive modes from being enabled by project files.

### Plan mode

Plan mode separates thinking from doing. In it, as the documentation describes, Claude reads files and proposes a plan but makes no edits until you approve. Enter it by pressing Shift+Tab during a session until the status bar shows plan mode, or start with `claude --permission-mode plan`. Plans are cheap to change; diffs are expensive to unpick. Use plan mode for anything touching several files, unfamiliar code, or architecture.

### Subagents

A **subagent** is a specialised assistant with **its own context window, system prompt, tool access, and permissions**; only its summary returns to the main conversation, which keeps the main context clean, Module 8.9's context isolation. Subagents are Markdown files with YAML frontmatter, in `.claude/agents/` for the project or `~/.claude/agents/` for the user. Only `name` and `description` are required; optional fields include `tools`, a list that restricts what it can use, omitted meaning it inherits all tools, and `model`, such as `sonnet`, `opus`, `haiku`, `fable`, a full model identifier, or `inherit`. The body is the subagent's system prompt. The description matters: Claude uses it to decide when to delegate.

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---
You are a careful reviewer. Report issues; do not edit files.
```

A read-only reviewer with only `Read`, `Glob`, and `Grep` cannot change code even if it wanted to: least privilege, Module 8.14, applied to delegation.

### Hooks

**Hooks** run your own code at points in Claude Code's lifecycle, configured under a `hooks` key in settings. Documented events include `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `Stop`, `SubagentStop`, `PreCompact`, and `SessionEnd`, among others. A hook has a **matcher**, for example `Bash` or `Edit|Write`, and a handler, most often a shell command. A `PreToolUse` hook can block a tool call, either by exiting with code 2, with its standard error output used as the reason fed back to Claude, or by returning JSON with a deny decision. A `Stop` hook that exits with code 2 sends Claude back to work: the best-practices guide's example runs a type check when Claude tries to finish, so it cannot stop while type errors remain.

Hooks are the enforcement layer for rules a deny pattern cannot express: "never run `rm -rf`", "format every edited file", "run the tests before finishing".

### MCP

The **Model Context Protocol**, Modules 3.6 and 8.6, connects Claude Code to external tools and data. Add a remote server with `claude mcp add --transport http <name> <url>`, or a local one with `claude mcp add <name> -- <command> [args]`, where `--` separates Claude Code's options from the server's command. Servers have a **scope**: local, the default, for you in this project; project, stored in a committed `.mcp.json` so the team shares it, with approval required before first use; or user, across all your projects. `claude mcp list` shows configured servers and `/mcp` manages them in a session. Every MCP server is a source of untrusted content and new capabilities, so Module 8.14's threat model applies.

### A feature workflow

The documented best practices reduce to a loop:

1. **Tell Claude what it cannot see**: the goal, constraints, relevant files, and how to verify, ideally a command that returns pass or fail.
2. **Explore and plan** in plan mode; review and edit the plan.
3. **Implement** with the checks running: tests, type checks, lint.
4. **Review the diff** yourself, Module 9.1's checklist.
5. **Commit** small, with a clear message, Module 9.10.

When the session goes wrong, the guide's advice is to stop correcting after two failed attempts, clear the context with `/clear`, and write a better prompt. Other useful commands include `claude --continue` and `claude --resume` to return to earlier sessions, and `--worktree` for parallel work in separate Git worktrees.

### Complexity

Merging settings is linear in the rules across layers. Deciding a permission scans the rules, linear in their number. Loading memory is linear in the directories and imports, bounded by the import depth. Parsing a subagent file is linear in its length. Running hooks is linear in the matching hooks.

## 3. Production-Grade Implementation & Annotated Walkthrough

The lab models Claude Code's configuration logic in plain Python, simplified, so you can reason about what a given set of files will do. The real tool has more cases; the principles are the same.

First, merging settings layers.

```python
import fnmatch
import re

ORDER = ["user", "project", "local", "cli", "managed"]

def merge_settings(layers):
    merged = {"permissions": {"allow": [], "ask": [], "deny": []}}
    for name in ORDER:
        for key, value in layers.get(name, {}).items():
            if key == "permissions":
                for kind in ("allow", "ask", "deny"):
                    for rule in value.get(kind, []):
                        if rule not in merged["permissions"][kind]:
                            merged["permissions"][kind].append(rule)
            else:
                merged[key] = value
    return merged

LAYERS = {"user": {"model": "sonnet", "permissions": {"allow": ["Bash(git status)"]}},
          "project": {"model": "opus", "permissions": {"allow": ["Bash(npm run test *)", "Bash(npm run lint)"],
                                                       "deny": ["Read(./.env)", "Read(./.env.*)"]}},
          "local": {"permissions": {"ask": ["Bash(git push *)"]}},
          "managed": {"permissions": {"deny": ["Bash(curl *)"]}}}
print(merge_settings(LAYERS))
```

- **Layers are applied from lowest to highest precedence.** Later layers overwrite scalar values.
- **The project's `opus` beats the user's `sonnet`.**
- **Permission lists are unions.** The user's allow, the project's allows and denies, the local ask, and the organisation's deny all survive.
- **No layer can remove another layer's deny.** That is why deny rules are dependable.

Next, deciding a tool call.

```python
RULE = re.compile(r"^(\w+)(?:\((.*)\))?$")

def matches(rule, call):
    m = RULE.match(rule)
    tool, pattern = m.group(1), m.group(2)
    if tool != call["tool"]:
        return False
    return pattern is None or fnmatch.fnmatchcase(call["arg"], pattern)

def decide(call, permissions):
    for kind in ("deny", "ask", "allow"):
        hit = next((rule for rule in permissions[kind] if matches(rule, call)), None)
        if hit:
            return kind, hit
    return "ask", "no matching rule"

PERMS = merge_settings(LAYERS)["permissions"]
for call in [{"tool": "Bash", "arg": "npm run test unit"}, {"tool": "Read", "arg": "./.env.production"},
             {"tool": "Bash", "arg": "git push origin main"}, {"tool": "Bash", "arg": "rm -rf build"}]:
    print(call["arg"], decide(call, PERMS))
```

- **Rules are a tool name with an optional pattern; here the pattern is a shell-style glob.** The real matcher has its own documented rules; the glob is a close stand-in.
- **Deny is checked first, so `.env.production` is refused even if something allowed reading files.**
- **`git push` matches the ask rule: Claude must request approval.**
- **`rm -rf build` matches nothing and falls back to asking**, the behaviour of the default mode. A hook can turn that into a hard block.

Then, loading CLAUDE.md files.

```python
IMPORT = re.compile(r"^@(\S+)\s*$", re.M)

def load_memory(files, cwd, max_depth=4):
    parts = cwd.strip("/").split("/")
    dirs = ["/"] + ["/" + "/".join(parts[:i]) for i in range(1, len(parts) + 1)]

    def expand(text, depth):
        def replace(m):
            target = m.group(1)
            if depth >= max_depth or target not in files:
                return f"[import skipped: {target}]"
            return expand(files[target], depth + 1)
        return IMPORT.sub(replace, text)

    loaded = []
    for d in dirs:
        for name in ("CLAUDE.md", "CLAUDE.local.md"):
            path = d.rstrip("/") + "/" + name
            if path in files:
                loaded.append(expand(files[path], 0))
    return "\n".join(loaded)

FILES = {"/CLAUDE.md": "Root rules.",
         "/repo/CLAUDE.md": "Run tests with: npm test\n@/repo/docs/style.md",
         "/repo/CLAUDE.local.md": "My sandbox URL is http://localhost:3000",
         "/repo/docs/style.md": "Use British spelling.\n@/repo/docs/deeper.md",
         "/repo/docs/deeper.md": "Deeper.",
         "/repo/web/CLAUDE.md": "Web app notes.",
         "/other/CLAUDE.md": "Unrelated."}
print(load_memory(FILES, "/repo/web"))
```

- **Directories from the root down to the working directory are visited in order.** Broader instructions come first.
- **In `/repo`, the shared CLAUDE.md comes before the personal CLAUDE.local.md.**
- **Import lines are replaced by the imported file, recursively.** Here two levels deep.
- **`/other` is not on the path, so it is not loaded.**
- **With a smaller depth limit, deep imports are skipped and marked.** The real limit is four hops.

Then, parsing a subagent file.

```python
MODELS = {"sonnet", "opus", "haiku", "fable", "inherit"}

def parse_agent(text):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        return None, ["missing frontmatter"]
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            meta[key.strip()] = value.strip()
    problems = [f"missing {k}" for k in ("name", "description") if not meta.get(k)]
    if "tools" in meta:
        meta["tools"] = [t.strip() for t in meta["tools"].split(",") if t.strip()]
    if "model" in meta and meta["model"] not in MODELS and not meta["model"].startswith("claude-"):
        problems.append(f"unknown model {meta['model']}")
    meta["prompt"] = m.group(2).strip()
    return meta, problems

REVIEWER = ("---\nname: code-reviewer\ndescription: Reviews code for quality and best practices\n"
            "tools: Read, Glob, Grep\nmodel: sonnet\n---\nYou are a careful reviewer. Report issues; do not edit files.")
print(parse_agent(REVIEWER))
print(parse_agent("---\nname: x\nmodel: gpt-9\n---\nHi"))
```

- **Frontmatter sits between two `---` lines; the rest is the system prompt.**
- **Name and description are required.** The description is how Claude decides when to delegate.
- **Tools become a list.** The reviewer can read and search but not edit or run commands.
- **Model aliases and full Claude model identifiers are accepted; anything else is flagged.** A simplified check for the lab.

Finally, hooks.

```python
def run_hooks(event, payload, hooks):
    for hook in hooks.get(event, []):
        if hook.get("matcher") and not re.fullmatch(hook["matcher"], payload.get("tool", "")):
            continue
        code, message = hook["run"](payload)
        if code == 2:
            return "block", message
    return "continue", ""

def no_rm(payload):
    if re.search(r"\brm\s+-rf\b", payload.get("arg", "")):
        return 2, "rm -rf is not allowed; use the clean script"
    return 0, ""

def typecheck(payload):
    return (2, "type errors remain: fix them before stopping") if payload.get("type_errors", 0) else (0, "")

HOOKS = {"PreToolUse": [{"matcher": "Bash", "run": no_rm}], "Stop": [{"run": typecheck}]}
print(run_hooks("PreToolUse", {"tool": "Bash", "arg": "rm -rf node_modules"}, HOOKS))
print(run_hooks("Stop", {"type_errors": 3}, HOOKS))
print(run_hooks("Stop", {"type_errors": 0}, HOOKS))
```

- **Hooks run for their event when the matcher fits the tool name.**
- **Exit code 2 blocks, and the message becomes the reason Claude sees.** It can then use the clean script instead.
- **The Stop hook refuses to let the session end with type errors.** Claude goes back to work.
- **Exit code 0 lets things continue.** Hooks are ordinary programs: test them like any other code.

**Complexity.** `merge_settings` is linear in rules. `decide` scans each list once. `load_memory` is linear in directories and imports, bounded by the depth. `parse_agent` is linear in the file. `run_hooks` is linear in hooks for the event.

### A team setup for one repository

```text
CLAUDE.md (committed)       build/test/lint commands; architecture notes; conventions; "run npm test before finishing"
CLAUDE.local.md (ignored)   personal sandbox URLs and preferences
.claude/settings.json       allow: npm run lint, npm run test *, git status, git diff *
                            ask: git push *; deny: Read(./.env), Read(./.env.*), Read(./secrets/**)
.claude/agents/             code-reviewer (Read, Glob, Grep; sonnet); test-writer (Read, Edit, Bash(npm run test *))
hooks                       PreToolUse Bash: block rm -rf and force-push; PostToolUse Edit|Write: run formatter;
                            Stop: run type check, exit 2 on errors
.mcp.json (committed)       issue tracker (http); docs search (http); approved by each developer on first use
WORKFLOW                    plan mode for multi-file work -> implement with tests -> review diff -> small commits
```

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Rules in CLAUDE.md that must never be broken.** Guidance can be missed. Put hard rules in deny lists and hooks.

**A 1,000-line CLAUDE.md.** Long files bury the important lines and cost context every session. Keep it short; use imports and skills.

**No verification command.** Claude cannot know it is done without a check. Put the test command in CLAUDE.md.

**Allowing everything to avoid prompts.** Fewer prompts, more risk. Allow the safe, repetitive commands; keep pushes and deletions on ask or deny.

**Secrets readable by default.** `.env` files are files. Deny them explicitly.

**Personal settings committed.** `settings.local.json` and `CLAUDE.local.md` are personal. Keep them out of Git.

**Skipping plan mode on big changes.** A wrong approach discovered after twenty edits is expensive. Plan first.

**Correcting endlessly.** After two failed corrections, clear the context and write a better prompt.

**Subagents with every tool.** A reviewer that can edit files will. Restrict tools to the job.

**Hooks that fail silently.** A broken hook script protects nothing. Test hooks with known inputs.

**Unvetted MCP servers.** A server's tool descriptions and outputs are untrusted input. Review before approving project servers.

**Permissive modes on your laptop.** Bypassing permissions belongs in isolated sandboxes, not on a machine with your credentials.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Claude Code is an agentic coding tool that reads a repository, edits files, runs commands, and iterates, installed with a native installer or package managers and started with `claude` in a project. CLAUDE.md files, managed, user, project, and local, load from the working directory and every directory above it, concatenated from broadest to narrowest, with imports up to four hops and `/init` to generate a starting file; they are guidance. Settings layers, from user up through project, local, command line, and managed, resolve scalar values by highest precedence and merge permission lists, so deny rules from any layer persist. Permission rules name a tool and pattern in allow, ask, and deny lists, checked deny first, and unmatched calls fall back to the permission mode. Plan mode reads and proposes without editing. Subagents in `.claude/agents/` have their own context, prompt, tools, and model, with only name and description required. Hooks run code at lifecycle events and can block actions with exit code 2 or a JSON decision, including keeping a session working until checks pass. MCP servers, added with `claude mcp add` at local, project, or user scope, extend its reach and bring untrusted input. The recommended workflow gives Claude a pass-or-fail check, plans before large changes, implements with checks, reviews diffs, and commits small.

**Question 1.** A team's CLAUDE.md says "Never read .env files", yet a developer finds Claude reading `.env.local` to debug a configuration problem. Explain why, and give the settings and hook changes that would actually prevent it, using the lab's `decide`.

<details>
<summary>View Answer</summary>

CLAUDE.md is guidance: Claude reads it as context and usually follows it, but it is not enforced, and when debugging a configuration problem, reading the configuration file can look like the helpful thing to do. The documentation's best-practices guide makes exactly this distinction: rules that cannot have exceptions belong in deny rules, hooks, or managed settings, which apply every time. The fix is to add deny rules to the committed project settings, `.claude/settings.json`: `Read(./.env)` and `Read(./.env.*)`, and possibly `Read(./**/.env*)` for nested folders. With these in the merged permissions, the lab's `decide` checks deny first, so a call to read `./.env.local` matches `Read(./.env.*)` and returns deny regardless of any allow rule or permission mode. Because permission lists merge across layers, no developer's personal settings can remove the project's deny. For defence in depth, a `PreToolUse` hook matching `Bash` can block commands such as `cat .env` that would read the file through the shell rather than the Read tool, exiting with code 2 and a reason telling Claude to ask the developer for the specific value instead. An organisation can put the same rules in managed settings.

</details>

**Question 2.** A developer runs Claude Code in `/repo/web`. The files are those in the lab's `FILES`. Using `load_memory`, list what Claude sees, in order, and explain where a team-wide testing rule and a personal sandbox URL should live.

<details>
<summary>View Answer</summary>

`load_memory` visits `/`, then `/repo`, then `/repo/web`. From `/` it loads "Root rules." From `/repo` it loads the shared CLAUDE.md, "Run tests with: npm test", followed by its import of `/repo/docs/style.md`, "Use British spelling.", which itself imports `/repo/docs/deeper.md`, "Deeper."; then the personal `/repo/CLAUDE.local.md`, "My sandbox URL is http://localhost:3000". From `/repo/web` it loads "Web app notes." `/other/CLAUDE.md` is not on the path from the root to the working directory, so it is not loaded. Everything is concatenated, broadest first, so nothing overrides anything; conflicting instructions would both be present, which is why files should be kept consistent. A team-wide testing rule, such as the test command, belongs in the committed project CLAUDE.md at `/repo/CLAUDE.md`, so every developer and every session gets it. A personal sandbox URL belongs in `CLAUDE.local.md`, which the documentation says to add to `.gitignore`, so it applies only to that developer and does not leak into the shared repository. Rules that must be enforced, not just read, go into settings or hooks rather than either file.

</details>

**Question 3.** A developer asks Claude Code to "add CSV export to the orders page". Describe a workflow using plan mode, a subagent, and hooks from this module, and explain what each contributes.

<details>
<summary>View Answer</summary>

Start by telling Claude what it cannot see: the goal, the relevant files, constraints such as "use the existing download helper", and how to verify, for example `npm run test orders` and a type check. Switch to plan mode with Shift+Tab, or start with `--permission-mode plan`, so Claude explores the code and proposes a plan without editing; review the plan, correct misunderstandings such as which columns to export or how to escape commas, and approve it. Plans are cheap to change, and multi-file features are where wrong approaches cost most. Implementation then runs under the project's permissions: test and lint commands allowed, pushes on ask, secrets denied. Hooks enforce the non-negotiables: a `PostToolUse` hook on `Edit|Write` runs the formatter after each edit, a `PreToolUse` hook on `Bash` blocks `rm -rf` and force pushes, and a `Stop` hook runs the type check and exits with code 2 if errors remain, so Claude cannot declare itself finished with broken types. Before committing, delegate a review to the read-only `code-reviewer` subagent, which has its own context and only Read, Glob, and Grep, so it can examine the diff with fresh eyes and report issues without being able to change anything. Finally, review the diff yourself using Module 9.1's checklist and commit with a clear message.

</details>

@@starter
"""
Lab: Settings Precedence, Permission Rules, CLAUDE.md Loading, Subagent Files, Hooks
Standard library only. A simplified model of Claude Code's configuration logic. Complete the TODO in each step,
then press "Run & Verify Step".
"""
import fnmatch
import re

ORDER = ["user", "project", "local", "cli", "managed"]
LAYERS = {"user": {"model": "sonnet", "permissions": {"allow": ["Bash(git status)"]}},
          "project": {"model": "opus", "permissions": {"allow": ["Bash(npm run test *)", "Bash(npm run lint)"],
                                                       "deny": ["Read(./.env)", "Read(./.env.*)"]}},
          "local": {"permissions": {"ask": ["Bash(git push *)"]}},
          "managed": {"permissions": {"deny": ["Bash(curl *)"]}}}
RULE = re.compile(r"^(\w+)(?:\((.*)\))?$")
IMPORT = re.compile(r"^@(\S+)\s*$", re.M)
FILES = {"/CLAUDE.md": "Root rules.",
         "/repo/CLAUDE.md": "Run tests with: npm test\n@/repo/docs/style.md",
         "/repo/CLAUDE.local.md": "My sandbox URL is http://localhost:3000",
         "/repo/docs/style.md": "Use British spelling.\n@/repo/docs/deeper.md",
         "/repo/docs/deeper.md": "Deeper.",
         "/repo/web/CLAUDE.md": "Web app notes.",
         "/other/CLAUDE.md": "Unrelated."}
MODELS = {"sonnet", "opus", "haiku", "fable", "inherit"}
REVIEWER = ("---\nname: code-reviewer\ndescription: Reviews code for quality and best practices\n"
            "tools: Read, Glob, Grep\nmodel: sonnet\n---\nYou are a careful reviewer. Report issues; do not edit files.")


def no_rm(payload):
    """Given: a PreToolUse hook that blocks rm -rf."""
    if re.search(r"\brm\s+-rf\b", payload.get("arg", "")):
        return 2, "rm -rf is not allowed; use the clean script"
    return 0, ""


def typecheck(payload):
    """Given: a Stop hook that refuses to stop with type errors."""
    return (2, "type errors remain: fix them before stopping") if payload.get("type_errors", 0) else (0, "")


HOOKS = {"PreToolUse": [{"matcher": "Bash", "run": no_rm}], "Stop": [{"run": typecheck}]}


# ---------------------------------------------------------------- Step 1
def merge_settings(layers):
    """Apply layers in ORDER. Scalar keys: later layers overwrite. "permissions": append each allow/ask/deny rule not
    already present. Start from {"permissions": {"allow": [], "ask": [], "deny": []}}."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def matches(rule, call):
    """RULE gives tool and optional pattern. Tool must equal call["tool"]; no pattern matches all; else
    fnmatch.fnmatchcase(call["arg"], pattern)."""
    # TODO Step 2
    return None


def decide(call, permissions):
    """Check deny, then ask, then allow: first matching rule -> (kind, rule). None -> ("ask", "no matching rule")."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def load_memory(files, cwd, max_depth=4):
    """Visit "/" then each ancestor down to cwd. In each, load CLAUDE.md then CLAUDE.local.md if present, replacing
    each IMPORT line with the imported file's expanded text, or "[import skipped: <path>]" when depth >= max_depth or
    the file is missing. Join with newlines."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def parse_agent(text):
    """Frontmatter between --- lines: key: value pairs. No frontmatter -> (None, ["missing frontmatter"]). Problems:
    "missing name"/"missing description"; "unknown model <m>" unless in MODELS or starting "claude-". tools -> list.
    prompt = body stripped. Return (meta, problems)."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def run_hooks(event, payload, hooks):
    """For each hook of the event whose matcher (if any) fully matches payload["tool"]: run it; exit code 2 ->
    ("block", message). Otherwise ("continue", "")."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("settings:", merge_settings(LAYERS))
    print("memory  :", load_memory(FILES, "/repo/web"))

@@solution
"""
Lab solution: Settings Precedence, Permission Rules, CLAUDE.md Loading, Subagent Files, Hooks
Standard library only. A simplified model of Claude Code's configuration logic.
"""
import fnmatch
import re

ORDER = ["user", "project", "local", "cli", "managed"]
LAYERS = {"user": {"model": "sonnet", "permissions": {"allow": ["Bash(git status)"]}},
          "project": {"model": "opus", "permissions": {"allow": ["Bash(npm run test *)", "Bash(npm run lint)"],
                                                       "deny": ["Read(./.env)", "Read(./.env.*)"]}},
          "local": {"permissions": {"ask": ["Bash(git push *)"]}},
          "managed": {"permissions": {"deny": ["Bash(curl *)"]}}}
RULE = re.compile(r"^(\w+)(?:\((.*)\))?$")
IMPORT = re.compile(r"^@(\S+)\s*$", re.M)
FILES = {"/CLAUDE.md": "Root rules.",
         "/repo/CLAUDE.md": "Run tests with: npm test\n@/repo/docs/style.md",
         "/repo/CLAUDE.local.md": "My sandbox URL is http://localhost:3000",
         "/repo/docs/style.md": "Use British spelling.\n@/repo/docs/deeper.md",
         "/repo/docs/deeper.md": "Deeper.",
         "/repo/web/CLAUDE.md": "Web app notes.",
         "/other/CLAUDE.md": "Unrelated."}
MODELS = {"sonnet", "opus", "haiku", "fable", "inherit"}
REVIEWER = ("---\nname: code-reviewer\ndescription: Reviews code for quality and best practices\n"
            "tools: Read, Glob, Grep\nmodel: sonnet\n---\nYou are a careful reviewer. Report issues; do not edit files.")


def no_rm(payload):
    """Given: a PreToolUse hook that blocks rm -rf."""
    if re.search(r"\brm\s+-rf\b", payload.get("arg", "")):
        return 2, "rm -rf is not allowed; use the clean script"
    return 0, ""


def typecheck(payload):
    """Given: a Stop hook that refuses to stop with type errors."""
    return (2, "type errors remain: fix them before stopping") if payload.get("type_errors", 0) else (0, "")


HOOKS = {"PreToolUse": [{"matcher": "Bash", "run": no_rm}], "Stop": [{"run": typecheck}]}


# ---------------------------------------------------------------- Step 1
def merge_settings(layers):
    """Scalars: highest layer wins. Permission lists: union, so deny rules persist."""
    merged = {"permissions": {"allow": [], "ask": [], "deny": []}}
    for name in ORDER:
        for key, value in layers.get(name, {}).items():
            if key == "permissions":
                for kind in ("allow", "ask", "deny"):
                    for rule in value.get(kind, []):
                        if rule not in merged["permissions"][kind]:
                            merged["permissions"][kind].append(rule)
            else:
                merged[key] = value
    return merged


# ---------------------------------------------------------------- Step 2
def matches(rule, call):
    """Tool name, then an optional glob pattern on the argument."""
    m = RULE.match(rule)
    tool, pattern = m.group(1), m.group(2)
    if tool != call["tool"]:
        return False
    return pattern is None or fnmatch.fnmatchcase(call["arg"], pattern)


def decide(call, permissions):
    """Deny first, then ask, then allow; otherwise the mode decides (here: ask)."""
    for kind in ("deny", "ask", "allow"):
        hit = next((rule for rule in permissions[kind] if matches(rule, call)), None)
        if hit:
            return kind, hit
    return "ask", "no matching rule"


# ---------------------------------------------------------------- Step 3
def load_memory(files, cwd, max_depth=4):
    """Broadest first, shared before local, imports expanded to a depth limit."""
    parts = cwd.strip("/").split("/")
    dirs = ["/"] + ["/" + "/".join(parts[:i]) for i in range(1, len(parts) + 1)]

    def expand(text, depth):
        def replace(m):
            target = m.group(1)
            if depth >= max_depth or target not in files:
                return f"[import skipped: {target}]"
            return expand(files[target], depth + 1)
        return IMPORT.sub(replace, text)

    loaded = []
    for d in dirs:
        for name in ("CLAUDE.md", "CLAUDE.local.md"):
            path = d.rstrip("/") + "/" + name
            if path in files:
                loaded.append(expand(files[path], 0))
    return "\n".join(loaded)


# ---------------------------------------------------------------- Step 4
def parse_agent(text):
    """Frontmatter plus a system prompt; name and description required."""
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        return None, ["missing frontmatter"]
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            meta[key.strip()] = value.strip()
    problems = [f"missing {k}" for k in ("name", "description") if not meta.get(k)]
    if "tools" in meta:
        meta["tools"] = [t.strip() for t in meta["tools"].split(",") if t.strip()]
    if "model" in meta and meta["model"] not in MODELS and not meta["model"].startswith("claude-"):
        problems.append(f"unknown model {meta['model']}")
    meta["prompt"] = m.group(2).strip()
    return meta, problems


# ---------------------------------------------------------------- Step 5
def run_hooks(event, payload, hooks):
    """Code that runs every time: exit code 2 blocks and explains."""
    for hook in hooks.get(event, []):
        if hook.get("matcher") and not re.fullmatch(hook["matcher"], payload.get("tool", "")):
            continue
        code, message = hook["run"](payload)
        if code == 2:
            return "block", message
    return "continue", ""


if __name__ == "__main__":
    perms = merge_settings(LAYERS)["permissions"]
    print(decide({"tool": "Read", "arg": "./.env.local"}, perms))
    print(load_memory(FILES, "/repo", max_depth=1))
    print(parse_agent(REVIEWER)[0]["tools"])
    print(run_hooks("Stop", {"type_errors": 3}, HOOKS))

@@step
{
  "stepNumber": 1,
  "title": "Merge settings layers",
  "instruction": "Implement merge_settings(layers). Start from {'permissions': {'allow': [], 'ask': [], 'deny': []}}. Apply the layers in ORDER (user, project, local, cli, managed), skipping missing ones. For the 'permissions' key, append each allow, ask, and deny rule that is not already in the merged list; for any other key, overwrite the merged value. Merge the four example layers. This is settings layers and precedence from Section 2. [MOD-9.3]",
  "hintConceptual": "Stack the rulebooks from the most personal to the most official: for a single setting the top book wins, but every book's list of forbidden things is kept.",
  "hintSyntax": "merged = {\"permissions\": {\"allow\": [], \"ask\": [], \"deny\": []}}\nfor name in ORDER:\n    for key, value in layers.get(name, {}).items():\n        if key == \"permissions\":\n            for kind in (\"allow\", \"ask\", \"deny\"):\n                for rule in value.get(kind, []):\n                    if rule not in merged[\"permissions\"][kind]:\n                        merged[\"permissions\"][kind].append(rule)\n        else:\n            merged[key] = value\nreturn merged"
}
@@assert
_m = merge_settings(LAYERS)
assert _m is not None and _m["model"] == "opus", f"The project model beats the user model, got {_m}"
assert _m["permissions"] == {"allow": ["Bash(git status)", "Bash(npm run test *)", "Bash(npm run lint)"], "ask": ["Bash(git push *)"], "deny": ["Read(./.env)", "Read(./.env.*)", "Bash(curl *)"]}, "Lists merge across layers"
assert merge_settings({"user": {"model": "haiku"}, "cli": {"model": "sonnet"}})["model"] == "sonnet", "The command line beats the user layer"
assert merge_settings({"project": {"permissions": {"deny": ["X"]}}, "managed": {"permissions": {"deny": ["X"]}}})["permissions"]["deny"] == ["X"] and merge_settings({}) == {"permissions": {"allow": [], "ask": [], "deny": []}}, "No duplicates; empty layers"
print("Step 1 passed: opus wins, and every layer's deny rules survive.")

@@step
{
  "stepNumber": 2,
  "title": "Decide permission rules",
  "instruction": "Implement matches(rule, call): split the rule with RULE into a tool and an optional pattern; the call matches if its tool equals the rule's tool and either there is no pattern or fnmatch.fnmatchcase(call['arg'], pattern) is true. Then implement decide(call, permissions), using matches from this step: check the deny list, then ask, then allow, returning (kind, first matching rule); with no match return ('ask', 'no matching rule'). Decide seven calls. This is permissions from Section 2. [MOD-9.3]",
  "hintConceptual": "Look at the 'never' list first, then the 'ask me' list, then the 'go ahead' list; the first list with a match decides, and anything unlisted means ask.",
  "hintSyntax": "m = RULE.match(rule)\ntool, pattern = m.group(1), m.group(2)\nif tool != call[\"tool\"]:\n    return False\nreturn pattern is None or fnmatch.fnmatchcase(call[\"arg\"], pattern)\n\n# decide\nfor kind in (\"deny\", \"ask\", \"allow\"):\n    hit = next((rule for rule in permissions[kind] if matches(rule, call)), None)\n    if hit:\n        return kind, hit\nreturn \"ask\", \"no matching rule\""
}
@@assert
_p = {"allow": ["Bash(git status)", "Bash(npm run test *)", "Bash(npm run lint)", "Read"], "ask": ["Bash(git push *)"], "deny": ["Read(./.env)", "Read(./.env.*)", "Bash(curl *)"]}
assert decide({"tool": "Bash", "arg": "npm run test unit"}, _p) == ("allow", "Bash(npm run test *)"), f"Test commands allowed, got {decide({'tool': 'Bash', 'arg': 'npm run test unit'}, _p)}"
assert decide({"tool": "Read", "arg": "./.env.production"}, _p) == ("deny", "Read(./.env.*)") and decide({"tool": "Read", "arg": "./src/app.py"}, _p) == ("allow", "Read"), "Deny beats a bare allow"
assert decide({"tool": "Bash", "arg": "git push origin main"}, _p) == ("ask", "Bash(git push *)") and decide({"tool": "Bash", "arg": "curl https://x.example"}, _p)[0] == "deny", "Ask and deny"
assert decide({"tool": "Bash", "arg": "rm -rf build"}, _p) == ("ask", "no matching rule") and decide({"tool": "Bash", "arg": "npm run testing"}, _p) == ("ask", "no matching rule"), "Unmatched falls back; patterns need the space"
assert matches("WebFetch", {"tool": "WebFetch", "arg": "https://x"}) and not matches("Bash(npm run lint)", {"tool": "Bash", "arg": "npm run lint --fix"}), "Bare tools match all; exact rules match exactly"
print("Step 2 passed: .env.production is denied even though Read is allowed.")

@@step
{
  "stepNumber": 3,
  "title": "Load CLAUDE.md files",
  "instruction": "Implement load_memory(files, cwd, max_depth). Build the directory list '/', then each ancestor of cwd down to cwd itself. In each directory, load CLAUDE.md and then CLAUDE.local.md if present. Expand IMPORT lines recursively: replace each with the imported file's expanded text, or '[import skipped: <path>]' when the current depth has reached max_depth or the file does not exist; top-level files start at depth 0. Join the loaded texts with newlines. Load memory for /repo/web, and for /repo with a depth limit of 1. This is CLAUDE.md from Section 2. [MOD-9.3]",
  "hintConceptual": "Walk from the front door to the room you are working in, picking up every house-rules sheet on the way, the shared one before your personal note, and follow 'see also' references a limited number of times.",
  "hintSyntax": "parts = cwd.strip(\"/\").split(\"/\")\ndirs = [\"/\"] + [\"/\" + \"/\".join(parts[:i]) for i in range(1, len(parts) + 1)]\ndef expand(text, depth):\n    def replace(m):\n        target = m.group(1)\n        if depth >= max_depth or target not in files:\n            return f\"[import skipped: {target}]\"\n        return expand(files[target], depth + 1)\n    return IMPORT.sub(replace, text)\nloaded = []\nfor d in dirs:\n    for name in (\"CLAUDE.md\", \"CLAUDE.local.md\"):\n        path = d.rstrip(\"/\") + \"/\" + name\n        if path in files:\n            loaded.append(expand(files[path], 0))\nreturn \"\\n\".join(loaded)"
}
@@assert
_mem = load_memory(FILES, "/repo/web")
assert _mem == "Root rules.\nRun tests with: npm test\nUse British spelling.\nDeeper.\nMy sandbox URL is http://localhost:3000\nWeb app notes.", f"Broadest first, imports expanded, got {_mem!r}"
assert load_memory(FILES, "/repo", max_depth=1) == "Root rules.\nRun tests with: npm test\nUse British spelling.\n[import skipped: /repo/docs/deeper.md]\nMy sandbox URL is http://localhost:3000", "Depth limit"
assert "Unrelated." not in _mem and load_memory(FILES, "/other") == "Root rules.\nUnrelated.", "Only the path to cwd"
assert load_memory({"/a/CLAUDE.md": "@/a/missing.md"}, "/a") == "[import skipped: /a/missing.md]", "Missing imports are marked"
print("Step 3 passed: six instructions load, shared before local, and /other is ignored.")

@@step
{
  "stepNumber": 4,
  "title": "Parse a subagent file",
  "instruction": "Implement parse_agent(text). Match frontmatter between a first '---' line and a closing '---' line; with none, return (None, ['missing frontmatter']). Read 'key: value' lines into a dict (split on the first colon, strip both). Problems: 'missing name' and 'missing description' for absent or empty values; 'unknown model <m>' if a model is given that is not in MODELS and does not start with 'claude-'. Turn tools into a list of stripped, non-empty names. Store the stripped body as 'prompt'. Return (meta, problems). Parse the reviewer and two bad files. This is subagents from Section 2. [MOD-9.3]",
  "hintConceptual": "Read the job card at the top of the file, check it has a job title and a description of when to call this specialist, note which tools they are allowed, and keep the rest as their briefing.",
  "hintSyntax": "m = re.match(r\"^---\\n(.*?)\\n---\\n(.*)$\", text, re.S)\nif not m:\n    return None, [\"missing frontmatter\"]\nmeta = {}\nfor line in m.group(1).splitlines():\n    if \":\" in line:\n        key, value = line.split(\":\", 1)\n        meta[key.strip()] = value.strip()\nproblems = [f\"missing {k}\" for k in (\"name\", \"description\") if not meta.get(k)]\nif \"tools\" in meta:\n    meta[\"tools\"] = [t.strip() for t in meta[\"tools\"].split(\",\") if t.strip()]\nif \"model\" in meta and meta[\"model\"] not in MODELS and not meta[\"model\"].startswith(\"claude-\"):\n    problems.append(f\"unknown model {meta['model']}\")\nmeta[\"prompt\"] = m.group(2).strip()\nreturn meta, problems"
}
@@assert
_a, _probs = parse_agent(REVIEWER)
assert _probs == [] and _a["name"] == "code-reviewer" and _a["tools"] == ["Read", "Glob", "Grep"] and _a["model"] == "sonnet", f"The reviewer parses, got {_a} {_probs}"
assert _a["prompt"] == "You are a careful reviewer. Report issues; do not edit files." and _a["description"] == "Reviews code for quality and best practices", "Body and description"
assert parse_agent("---\nname: x\nmodel: gpt-9\n---\nHi")[1] == ["missing description", "unknown model gpt-9"], "Missing description; unknown model"
assert parse_agent("no frontmatter") == (None, ["missing frontmatter"]) and parse_agent("---\nname: a\ndescription: b\nmodel: claude-opus-5-5\n---\nx")[1] == [], "No frontmatter; full model ids accepted"
print("Step 4 passed: a read-only reviewer with three tools, and two broken files caught.")

@@step
{
  "stepNumber": 5,
  "title": "Enforce rules with hooks",
  "instruction": "Implement run_hooks(event, payload, hooks). For each hook registered for the event, skip it if it has a matcher that does not fully match payload['tool'] (use re.fullmatch and '' for a missing tool). Run it with the payload; if it returns exit code 2, return ('block', its message). If no hook blocks, return ('continue', ''). Run the PreToolUse and Stop hooks. This is hooks from Section 2. [MOD-9.3]",
  "hintConceptual": "Before and after each action, the circuit breakers get a look; any breaker that trips stops the action and says why, whatever the contractor intended.",
  "hintSyntax": "for hook in hooks.get(event, []):\n    if hook.get(\"matcher\") and not re.fullmatch(hook[\"matcher\"], payload.get(\"tool\", \"\")):\n        continue\n    code, message = hook[\"run\"](payload)\n    if code == 2:\n        return \"block\", message\nreturn \"continue\", \"\""
}
@@assert
assert run_hooks("PreToolUse", {"tool": "Bash", "arg": "rm -rf node_modules"}, HOOKS) == ("block", "rm -rf is not allowed; use the clean script"), f"rm -rf blocked, got {run_hooks('PreToolUse', {'tool': 'Bash', 'arg': 'rm -rf node_modules'}, HOOKS)}"
assert run_hooks("PreToolUse", {"tool": "Edit", "arg": "rm -rf"}, HOOKS) == ("continue", "") and run_hooks("PreToolUse", {"tool": "Bash", "arg": "npm test"}, HOOKS) == ("continue", ""), "Matcher and harmless commands"
assert run_hooks("Stop", {"type_errors": 3}, HOOKS) == ("block", "type errors remain: fix them before stopping") and run_hooks("Stop", {"type_errors": 0}, HOOKS) == ("continue", ""), "The Stop hook keeps Claude working"
assert run_hooks("PostToolUse", {}, HOOKS) == ("continue", "") and run_hooks("PreToolUse", {"tool": "BashX", "arg": "rm -rf /"}, HOOKS) == ("continue", ""), "No hooks; matchers match the whole name"
print("Step 5 passed: rm -rf is blocked, and the session cannot stop with type errors.")
