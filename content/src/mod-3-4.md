@@meta
{
  "moduleId": "MOD-3.4",
  "slug": "mod-3-4",
  "unitId": "UNIT-3",
  "unitTitle": "Unit 3: Mastering Claude & Gemini",
  "title": "Claude Code",
  "difficulty": "Intermediate",
  "estimatedMinutes": 100,
  "citations": [
    { "title": "Claude Code overview", "source": "Claude Code Docs", "url": "https://code.claude.com/docs/en/overview" },
    { "title": "Permission modes", "source": "Claude Code Docs", "url": "https://code.claude.com/docs/en/permission-modes" },
    { "title": "Configure permissions", "source": "Claude Code Docs", "url": "https://code.claude.com/docs/en/permissions" },
    { "title": "How Claude remembers your project", "source": "Claude Code Docs", "url": "https://code.claude.com/docs/en/memory" },
    { "title": "Commands reference", "source": "Claude Code Docs", "url": "https://code.claude.com/docs/en/commands" },
    { "title": "Best practices for Claude Code", "source": "Claude Code Docs", "url": "https://code.claude.com/docs/en/best-practices" }
  ],
  "videoLibrary": [
    {
      "id": "VID-3.4-1",
      "title": "Claude Code Tutorial #2 - CLAUDE.md Files & /init",
      "creator": "Net Ninja",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=i_OHQH4-M2Y",
      "timingInstruction": "Watch after reading Section 1 as the official introduction",
      "keyTakeaway": "How CLAUDE.md and /init give Claude Code its project context."
    },
    {
      "id": "VID-3.4-2",
      "title": "Claude Code - Full Tutorial for Beginners",
      "creator": "Tech With Tim",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=ntDIxaeo3Wg",
      "timingInstruction": "Watch after reading Section 2 to see installation, permissions, and the memory file on screen",
      "keyTakeaway": "A beginner-paced tour from installation to a first task, showing the permission prompts and the project memory file that this chapter explains."
    },
    {
      "id": "VID-3.4-3",
      "title": "Claude Code best practices | Code w/ Claude",
      "creator": "Anthropic",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=gv0WHhKelSE",
      "timingInstruction": "Watch after reading Section 4 (practitioner wisdom)",
      "keyTakeaway": "Working habits from the team that builds the tool: give it a way to check its work, plan before editing, and keep the context clean."
    },
    {
      "id": "VID-3.4-4",
      "title": "Claude Code in Action",
      "creator": "Anthropic",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/claude-code-in-action",
      "timingInstruction": "Take after completing the lab",
      "keyTakeaway": "A short course covering plan mode, the memory file, hooks, and non-interactive use, which turns this chapter's concepts into practised routines."
    },
    {
      "id": "VID-3.4-5",
      "title": "Claude Code 101",
      "creator": "Anthropic",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/claude-code-101",
      "timingInstruction": "An alternative starting point if you have never used a terminal",
      "keyTakeaway": "An introductory course on setting up Claude Code and delegating a first task to it."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Permissions, Memory Files, and the Tool Loop",
    "context": "A small team is about to let a coding agent work in its repository and wants to understand the controls before switching it on. You will build the three mechanisms that govern such an agent: a permission-rule evaluator, a loader for layered memory files with imports, and the loop that lets a model call tools until the work is verified.",
    "language": "python"
  }
}

@@reading
# Claude Code

In the chat app, Claude can tell you how to rename two hundred files, fix a failing test, or reorganise a folder of reports. You then do it. **Claude Code** removes that last step. It is the same model, given tools to read and change the files in a folder and to run commands, so it carries out the task itself and checks the result.

The name suggests a tool for programmers, and that is its main audience. The mechanism is more general. Any work that lives in files, such as documents, spreadsheets exported as text, notes, data, and websites, can be done this way. This chapter explains how the tool works, the controls that keep it safe, the memory file that tells it about your project, and the working habits that get good results. Details are from the Claude Code documentation in November 2026, and the tool changes quickly. The three ideas at its centre, a tool loop, permissions, and persistent instructions, are common to every coding agent.

## 1. First-Principles Mental Model & Intuition

### A contractor at your desk

Picture hiring a capable contractor and seating them at your computer. They can open your files, edit them, and run programs. They work quickly and do not get bored. They have never seen your project before today, and tomorrow they will have forgotten it.

You manage a contractor like that with three controls.

- **What they may touch.** The contractor may read anything in the project, must ask before running commands, and must never open the folder of passwords. These are **permissions**.
- **What they already know.** You hand over a one-page briefing: how the project is laid out, how to run the tests, the house conventions. This is the **memory file**, named `CLAUDE.md`.
- **How closely you supervise.** For risky work you approve each step. For routine work you let them proceed and review at the end. These are the **permission modes**.

Almost everything in this chapter is one of these three controls or the loop they govern.

### Chat versus an agent

| | Chat app | Claude Code |
|---|---|---|
| What it can see | What you paste or upload | The files in the folder you start it in |
| What it produces | Text and artifacts for you to use | Changes to real files, and the output of real commands |
| Who carries out the steps | You | The agent, within its permissions |
| How it checks its work | It cannot | It can run the tests or the program and read the result |
| What can go wrong | A wrong answer you might act on | A wrong action that has already happened |

The last two rows are the trade. An agent that can run the tests can discover that its first attempt failed and fix it without being told. This ability to verify is the biggest single reason agents outperform chat for multi-step work. The same access means a mistake is an event, not a suggestion. That is why permissions exist.

### The loop

Claude Code works by repeating a short cycle.

```text
        +------------------+
        |  GATHER CONTEXT  |   read files, search the project, look at errors
        +--------+---------+
                 |
                 v
        +------------------+
        |       ACT        |   edit a file, run a command
        +--------+---------+
                 |
                 v
        +------------------+
        |      VERIFY      |   run the tests, re-read the result
        +--------+---------+
                 |
        done? ---+--- no: go round again
                 |
                yes
                 v
          report to you
```

You have met this pattern before. Module 1.6 described an agent as a model in a loop with tools. Claude Code is that idea, built into a product and pointed at a folder.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Where it runs and how to install it

Claude Code is one engine with several front ends. According to the documentation at the time of writing, it is available in the terminal, as an extension for code editors, in the desktop app, on the web, in the mobile app, and inside automation such as scheduled jobs and code-review pipelines. The memory file, the settings, and the connected tools are shared across these surfaces.

The terminal version is installed with one command. On macOS, Linux, or the Windows Subsystem for Linux:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

On Windows PowerShell:

```text
irm https://claude.ai/install.ps1 | iex
```

You then open a terminal in your project's folder and type `claude`. Using it requires a paid Claude plan or a developer account billed by usage. If you have never used a terminal, the desktop app offers the same engine with a graphical interface, and is the gentler place to start.

### The tool loop, precisely

Module 1.4 showed that a model only produces text. A tool loop turns text into action through a simple agreement between the model and the program around it, which is called the **harness**.

1. The harness sends the model the conversation so far and a list of tools it may request.
2. The model replies either with ordinary text, which means it is finished, or with a **tool call**: the name of a tool and its arguments.
3. The harness checks whether the call is permitted. If it is, the harness carries it out and appends the result to the conversation.
4. Go to step 1.

```text
   +---------+   conversation + tool list    +---------+
   |         | ----------------------------> |         |
   | HARNESS |                               |  MODEL  |
   |         | <---------------------------- |         |
   +----+----+   text (finished) or          +---------+
        |        tool call (name, arguments)
        |
        |  permitted?  --no-->  ask you, or refuse
        |
        v yes
   +----------------------------------------------+
   |  TOOLS: read file, edit file, run command,   |
   |         search, fetch a web page, ...        |
   +----------------------------------------------+
        |
        +--> result appended to the conversation, loop again
```

The model never touches your files directly. It asks, and the harness acts. That separation is what makes permissions enforceable: they are checked by ordinary program code, outside the model, and the model's opinion has no bearing on the outcome.

The built-in tools are few and general.

| Tool | What it does |
|---|---|
| Read | Opens a file and returns its contents |
| Edit and Write | Change part of a file, or create one |
| Bash | Runs a command in the shell |
| Search tools | Find files by name or by content |
| Web tools | Fetch a page or run a web search |
| Agent | Hands a sub-task to a helper agent with its own fresh context |

With "read", "edit", and "run a command", an agent can do nearly anything a person can do at a keyboard.

### Context is the scarce resource

Every tool result is appended to the conversation, and the whole conversation is sent to the model on every step. A session therefore grows. If the context starts at $C_0$ tokens and each step adds $s$ tokens on average, then at step $t$ the model reads

$$
C_t = C_0 + s \cdot t
$$

and over $n$ steps the total input processed is

$$
\sum_{t=0}^{n-1} C_t = n \cdot C_0 + s \cdot \frac{n(n-1)}{2}
$$

The second term grows with the square of the number of steps. For $C_0 = 20{,}000$, $s = 3{,}000$, and $n = 50$:

$$
50 \times 20{,}000 + 3{,}000 \times \frac{50 \times 49}{2} = 1{,}000{,}000 + 3{,}675{,}000 = 4{,}675{,}000 \text{ tokens}
$$

Prompt caching, from Module 3.2, makes most of that cheap, because each step repeats the previous one's input. The growth still matters for two reasons. A long session consumes your usage allowance faster than a short one, and a context full of old file contents and stale errors makes the model less focused, as Module 1.9 described.

Claude Code manages this in three ways. When the window is nearly full it **compacts** the conversation, replacing the detail with a summary. You can do the same at a moment of your choosing. And you can clear the conversation entirely when you move to a new task. Splitting work across fresh sessions is the more effective habit. The forty-step example in the recall questions shows how much it saves.

### Permissions

Every tool call passes through a decision with three possible outcomes: **allow** (do it), **ask** (pause and prompt the user), or **deny** (refuse).

**Rules** state the policy. A rule names a tool, optionally with a specifier in brackets that narrows it:

| Rule | Meaning |
|---|---|
| `Read` | Any use of the Read tool |
| `Bash(npm run build)` | That exact command |
| `Bash(npm run *)` | Any command beginning with `npm run ` |
| `Read(./.env)` | Reading that one file |
| `WebFetch(domain:example.com)` | Fetching pages from that site |

Rules are grouped into three lists, and the documentation specifies the order in which they are consulted: **deny first, then ask, then allow, and the first match wins.** Written as a function of a tool call $c$:

$$
\text{decision}(c) =
\begin{cases}
\text{deny} & \text{if any deny rule matches } c \\
\text{ask} & \text{else if any ask rule matches } c \\
\text{allow} & \text{else if any allow rule matches } c \\
\text{the mode's default} & \text{otherwise}
\end{cases}
$$

The ordering has an important consequence. A deny rule cannot be overridden by an allow rule, however specific the allow rule is. If `Bash(aws *)` is denied, then allowing `Bash(aws s3 ls)` has no effect. This is deliberate. A safety rule that could be cancelled by a later, narrower permission would not be a safety rule.

Rules live in settings files. A project-level file might contain:

```json
{
  "permissions": {
    "allow": ["Read", "Bash(npm run *)"],
    "ask": ["Bash(git commit *)"],
    "deny": ["Read(./.env)", "Bash(git push*)"]
  }
}
```

**Modes** set the default for calls that no rule covers, and the general level of supervision.

| Mode | Label in the interface | Behaviour |
|---|---|---|
| `default` | Manual | Reads freely. Asks before edits and commands |
| `acceptEdits` | Edit automatically | File edits and common file operations proceed. Other commands still ask |
| `plan` | Plan | Explores and proposes a plan. Makes no changes to your files |
| `auto` | Auto | Proceeds without routine prompts, with a background check on each action |
| `dontAsk` | (set in configuration) | Anything that would prompt is refused. Meant for unattended automation |
| `bypassPermissions` | Bypass permissions | Skips prompts entirely. For disposable containers and virtual machines only |

A beginner needs three of these. Use **plan** when you want to see the approach before anything changes. Use the manual default when you want to approve each step. Use **edit automatically** once you trust the direction and have a way to undo. The last mode in the table removes the safety net and belongs only in an environment you can throw away.

### The memory file

Each session starts with an empty conversation. The agent does not remember yesterday. What carries over is a set of plain text files named `CLAUDE.md`, which the harness reads at the start of every session and places in the context.

They are layered, from the broadest scope to the narrowest:

| Layer | Location | Shared with | Typical content |
|---|---|---|---|
| Organisation | A system folder managed by administrators | Everyone in the company | Company-wide policies |
| User | `~/.claude/CLAUDE.md` | Only you, in every project | Your personal preferences |
| Project | `./CLAUDE.md` in the project folder | The team, through version control | How this project is built, tested, and organised |
| Local | `./CLAUDE.local.md` | Only you, in this project | Your private notes for this project |

All the layers that exist are loaded, the broad ones first, so the more specific instructions appear later in the context. A memory file can pull in other files with an import line: an at-sign followed by a path, such as `@docs/conventions.md`. Imports can be nested, to a documented limit of four hops, which prevents a chain of files from importing each other forever.

This is the same layering idea as profile preferences and project instructions in Module 3.2, with one addition: the project file sits in the repository, so the whole team shares it and it is reviewed and versioned like the code.

Two facts about memory files prevent most misunderstandings.

**A memory file is context, not enforcement.** Writing "never push to the main branch" in `CLAUDE.md` makes that action unlikely. It does not make it impossible, because the instruction is text the model reads, and models sometimes fail to follow text. A deny rule is enforced by the harness and cannot be argued with. Put conventions and knowledge in the memory file. Put prohibitions in the permission rules.

**Short files work better.** The documentation recommends keeping each file under about two hundred lines. Every line is read on every step of every session. A long file costs tokens and dilutes the instructions that matter, and contradictory lines are resolved unpredictably.

The command `/init` reads your project and writes a first draft of the memory file. Claude Code can also keep its own notes between sessions, a feature called auto memory, of which only the opening portion is loaded each time.

### Commands

Typing a slash at the prompt runs a built-in command. A dozen cover most needs.

| Command | Purpose |
|---|---|
| `/init` | Draft a memory file for this project |
| `/memory` | View and edit the memory files |
| `/permissions` | See every rule and which file it came from |
| `/plan` | Switch to planning before any changes |
| `/model` | Choose the model |
| `/context` | Show what is filling the context window |
| `/compact` | Summarise the conversation to free space |
| `/clear` | Start a fresh conversation, keeping project memory |
| `/resume` | Return to an earlier session |
| `/rewind` | Roll files and conversation back to an earlier checkpoint |
| `/diff` | Show what has changed |
| `/code-review` | Review the current changes for defects |

Claude Code can also run without a conversation. The form `claude -p "your instruction"` performs one task and prints the result, which lets it be used inside scripts and scheduled jobs.

### The everyday workflow

The documentation and experienced users converge on one sequence.

```text
EXPLORE  ->  PLAN  ->  IMPLEMENT  ->  VERIFY  ->  COMMIT
 read the     agree     make the      run the     save a
 relevant     the       change in     tests or    checkpoint
 files        approach  small steps   the program you can return to
```

Each stage guards against a specific failure. Exploring prevents changes based on a guess about how the project works. Planning lets you catch a wrong approach before it costs anything. Small steps keep each change reviewable. Verification replaces "it should work" with evidence. Committing gives you a known-good point to return to.

### Complexity

Evaluating a tool call against $r$ rules is $O(r)$. Loading memory files is linear in their total size, bounded by the import depth. The loop's cost is dominated by the model: $n$ steps process input that grows as $n^2$ without compaction, which is the real constraint on long sessions.

## 3. Production-Grade Implementation & Annotated Walkthrough

The three mechanisms are small enough to write out. The versions here are simplified. Real rule matching handles more cases, such as several commands joined on one line. The logic of the decision is the documented one.

First, permission rules.

```python
from fnmatch import fnmatchcase

def parse_rule(rule):
    if rule.endswith(")") and "(" in rule:
        tool, specifier = rule[:-1].split("(", 1)
        return tool, specifier
    return rule, None

def rule_matches(rule, tool, argument):
    rule_tool, specifier = parse_rule(rule)
    if rule_tool != tool:
        return False
    return specifier is None or fnmatchcase(argument, specifier)

def decide(tool, argument, rules, mode="default"):
    for outcome in ("deny", "ask", "allow"):
        if any(rule_matches(rule, tool, argument) for rule in rules.get(outcome, [])):
            return "deny" if outcome == "ask" and mode == "dontAsk" else outcome
    return "deny" if mode == "dontAsk" else "ask"

RULES = {
    "allow": ["Read", "Bash(npm run *)", "Bash(aws s3 ls)"],
    "ask": ["Bash(git commit *)"],
    "deny": ["Read(./.env)", "Bash(git push*)", "Bash(aws *)"],
}
calls = [("Read", "./src/app.js"), ("Read", "./.env"), ("Bash", "npm run build"),
         ("Bash", "git commit -m fix"), ("Bash", "git push origin main"),
         ("Bash", "aws s3 ls"), ("Bash", "rm -rf build"), ("Edit", "./src/app.js")]
for tool, argument in calls:
    print(f"{tool:>5} {argument:<22} -> {decide(tool, argument, RULES):<6}"
          f" (unattended: {decide(tool, argument, RULES, mode='dontAsk')})")
```

- **`parse_rule` splits on the first bracket only.** A specifier may itself contain brackets, as a shell command can. Splitting once, from the left, keeps everything after the first bracket together.
- **A rule with no specifier matches every use of its tool.** `Read` covers all reading. This is why `Read` in the allow list and `Read(./.env)` in the deny list can coexist: the broad rule grants and the narrow one takes away.
- **`decide` walks the three lists in a fixed order.** Deny is checked before anything else. The loop returns at the first list containing a match, so a later list is never consulted for that call.
- **`aws s3 ls` is denied even though it is explicitly allowed.** The broad deny rule `Bash(aws *)` matches first. This is the property that makes deny rules trustworthy.
- **Unmatched calls fall to the mode's default.** `rm -rf build` and the edit match no rule. In the manual mode the answer is to ask. In the unattended mode, where nobody is there to answer, the answer is to refuse. The commit, which a rule says to ask about, is also refused when unattended.

Next, the memory loader.

```python
def load_memory(files, path, depth=0, max_depth=4):
    text = files.get(path)
    if text is None:
        return ""
    lines = []
    for line in text.splitlines():
        target = line.strip()
        if target.startswith("@") and len(target) > 1:
            if depth < max_depth:
                imported = load_memory(files, target[1:], depth + 1, max_depth)
                if imported:
                    lines.append(imported)
        else:
            lines.append(line)
    return "\n".join(lines)

def build_context(files, order=("~/.claude/CLAUDE.md", "./CLAUDE.md", "./CLAUDE.local.md")):
    parts = [load_memory(files, path) for path in order]
    return "\n\n".join(part for part in parts if part)

FILES = {
    "~/.claude/CLAUDE.md": "Prefer short explanations.",
    "./CLAUDE.md": "# Shop website\nRun tests with: npm test\n@docs/style.md",
    "docs/style.md": "Use British spelling.\n@docs/missing.md",
    "./CLAUDE.local.md": "My test database is on port 5433.",
}
print(build_context(FILES))
```

- **A missing file contributes nothing.** Most projects have only some of the layers. The loader treats absence as normal, and a broken import does not stop the session.
- **An import line is replaced by the imported file's content.** The recursion passes `depth + 1`, so each nested import is one hop further from the file that started it.
- **The depth check is the guard against loops.** If two files import each other, the recursion stops after four hops instead of running forever. A limit is simpler and more robust than tracking which files have been visited.
- **`build_context` fixes the order.** Personal preferences come first, then the shared project file, then private project notes. Later text is more specific, and models tend to give later instructions more weight.
- **This version treats any line that starts with an at-sign as an import.** The real loader is more careful. It also recognises imports within a line and ignores those inside code examples.

Finally, the loop itself, with a scripted stand-in for the model so that it runs offline.

```python
def agent_loop(next_action, tools, max_steps=10):
    history = []
    for _ in range(max_steps):
        action = next_action(history)
        if action is None:
            break
        name, argument = action
        result = tools[name](argument) if name in tools else f"error: unknown tool {name}"
        history.append((name, argument, result))
    return history

project = {"calc.py": "def add(a, b):\n    return a - b\n"}

def run_tests(_):
    scope = {}
    exec(project["calc.py"], scope)          # run the project's code to see what it really does
    return "PASS" if scope["add"](2, 3) == 5 else "FAIL"

def fix(path):
    project[path] = project[path].replace("a - b", "a + b")
    return "edited"

TOOLS = {"read": lambda path: project.get(path, "error: no such file"), "edit": fix, "run_tests": run_tests}

def scripted_model(history):
    if not history:
        return ("read", "calc.py")                       # gather context
    name, _, result = history[-1]
    if name == "read":
        return ("run_tests", "")                         # see the failure before changing anything
    if name == "run_tests" and result == "FAIL":
        return ("edit", "calc.py")                       # act
    if name == "edit":
        return ("run_tests", "")                         # verify
    return None                                          # tests pass: finished

for step in agent_loop(scripted_model, TOOLS):
    print(step[0], "->", step[2].strip().splitlines()[0])
```

- **`next_action` is the model.** It receives the history and returns the next tool call, or `None` when it judges the work complete. In the real product this function is a request to Claude. Everything else in the loop is ordinary code.
- **The harness, not the model, runs the tool.** The model returns a name and an argument. The loop looks the name up and calls the function. A permission check belongs at exactly this point.
- **An unknown tool produces an error message, not a crash.** The error goes into the history like any other result, so the model can see its mistake and try something else. Agents recover from errors they are shown.
- **`max_steps` bounds the loop.** An agent that never decides it is finished would otherwise run, and spend, without end.
- **The trace shows the cycle.** Read, test and see a failure, edit, test again and see a pass, stop. The second test run is the step chat cannot do. It is how the agent knows the fix worked.

The quadratic growth of context from Section 2 takes two lines to check.

```python
def cumulative_input(steps, base, per_step):
    return sum(base + per_step * t for t in range(steps))

print(f"{cumulative_input(50, 20_000, 3_000):,}")
print(f"{cumulative_input(40, 15_000, 2_500):,} in one session, {2 * cumulative_input(20, 15_000, 2_500):,} in two")
```

**Complexity.** `decide` is linear in the number of rules. `load_memory` is linear in the total size of the files it reads. `agent_loop` runs at most `max_steps` iterations, and `cumulative_input` shows why the tokens consumed by those iterations grow with the square of their number.

### A memory file worth having

```text
# Shop website

## Commands
- Install: npm install
- Run tests: npm test          (always run before saying a task is done)
- Start locally: npm run dev

## Layout
- src/pages    one file per page
- src/lib      shared helpers; check here before writing a new one
- tests/       mirrors src/

## Conventions
- British spelling in all user-facing text.
- Prices are stored in pence as whole numbers, never as decimals.

## Do not
- Edit anything in vendor/ (generated).
```

This is eighteen lines, and each one saves a question. It says how to verify, where things are, and what is unusual about this project. It contains nothing the agent could work out by reading the code.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Give it a way to check its work.** The most repeated advice from the tool's own documentation is to supply a test, a build command, or an expected output. Without one, the agent stops when the change looks plausible. With one, it stops when the check passes. If your project has no tests, ask for one to be written first and confirm that it fails for the right reason.

**Treating the memory file as a lock.** People write "never delete files" in `CLAUDE.md` and are surprised when a file is deleted. The memory file is advice. Anything that must not happen needs a deny rule, or work in a copy.

**Memory files that grow without limit.** Each incident adds a line. Six months later the file is four hundred lines of history, half of it obsolete. Review it as you would any shared document, and delete what the code already makes obvious.

**One session for everything.** A session that has fixed a bug, then redesigned a page, then answered questions about deployment carries all three in its context. Results get worse and usage goes up. Clear the conversation between unrelated tasks.

**Skipping the plan.** For anything larger than a small fix, asking for a plan first costs a minute and frequently exposes a misunderstanding: the wrong file, an approach that ignores an existing helper, a much larger change than you intended. A plan is cheap to correct. A finished change is not.

**Letting it run without a checkpoint.** Before a substantial task, save the current state in version control. Then the worst outcome is that you discard the changes. The built-in rewind feature helps, and version control is the dependable undo. If you do not use version control, work on a copy of the folder.

**Not reading the diff.** The agent reports "done, all tests pass". Read what changed anyway. Common surprises are a test that was altered so that it would pass, an unrelated file tidied up, or a dependency added. Reviewing changes is the subject of Module 3.8.

**Running with all prompts disabled on your own machine.** The bypass mode exists for disposable environments. On a personal computer it gives a program that can be misled by text in a file or web page the power to run any command as you.

**Assuming an allow rule can make an exception to a deny rule.** It cannot. Deny is checked first. If you need an exception, narrow the deny rule.

**Secrets in the folder.** Files holding passwords and keys are readable like any other file unless a rule says otherwise. Deny reading them, and never paste a secret into the conversation.

**Text it reads can contain instructions.** A web page, a file from someone else, or an error message may include text written to redirect an agent. This is the prompt-injection risk from Module 1.10, with real consequences when the agent can run commands. Be most careful when the agent both reads untrusted content and has broad permissions.

**Vague requests get vague work.** "Improve the report script" invites a rewrite. "In `report.py`, the totals are wrong when a row has an empty amount; treat empty as zero, add a test for that case, change nothing else" gets the fix. Name the file, the behaviour, the check, and the boundary.

**Stop early when it goes wrong.** You can interrupt at any time. If the first two steps head in the wrong direction, interrupting and correcting costs far less than letting it finish and then undoing the result.

**Some installations do not update themselves.** The documentation notes that the recommended installer keeps the tool current, while versions installed through some package managers must be updated by hand. If a feature in a tutorial is missing, check your version.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Claude Code is Claude given tools to read files, edit them, and run commands in a folder, working in a loop of gathering context, acting, and verifying. The model only requests actions. A surrounding harness carries them out and checks each one against permission rules, in the order deny, then ask, then allow, with the first match deciding, and a permission mode supplying the default for anything unmatched. Because the check happens outside the model, a deny rule is a real barrier. An instruction in the memory file is only advice. Memory files named `CLAUDE.md` are layered from organisation to user to project to local, loaded at the start of every session, and can import other files to a limited depth. Context grows with every step, so total input grows with the square of the session length, which is why clearing between tasks matters. The reliable workflow is explore, plan, implement in small steps, verify with a real check, and commit.

**Question 1.** A project's settings allow `Read` and `Bash(npm run *)`, ask for `Bash(git commit *)`, and deny `Read(./.env)` and `Bash(git push*)`. State the decision for each of these calls in the manual mode, and say which change in the unattended `dontAsk` mode: reading `./README.md`; reading `./.env`; running `npm run test`; running `git commit -m update`; running `git push`; running `python script.py`.

<details>
<summary>View Answer</summary>

Reading `./README.md` matches no deny or ask rule and matches the allow rule `Read`, so it is allowed. Reading `./.env` matches the deny rule `Read(./.env)`, which is checked first, so it is denied even though `Read` is allowed in general. Running `npm run test` matches the allow rule `Bash(npm run *)` and nothing earlier, so it is allowed. Running `git commit -m update` matches the ask rule, so the user is prompted. Running `git push` matches the deny pattern `Bash(git push*)`, so it is denied. Running `python script.py` matches no rule at all, so the mode's default applies, and in the manual mode that is to ask. In the unattended mode nobody can answer a prompt, so everything that would ask is refused: the commit and the Python script both become denied. The allowed and denied calls are unchanged. The general lesson is that for unattended use you must allow in advance exactly what the job needs, because the fallback is refusal.

</details>

**Question 2.** A session starts with 15,000 tokens of context and each step adds 2,500 tokens. Compute the total input processed over 40 steps in one session. Then compute the total if the same work is done as two separate 20-step sessions, each starting fresh. What does the comparison show?

<details>
<summary>View Answer</summary>

For one session of 40 steps, the total is 40 times 15,000, plus 2,500 times 40 times 39 divided by 2. The first term is 600,000. The second is 2,500 times 780, which is 1,950,000. The total is 2,550,000 tokens. For one session of 20 steps, the total is 20 times 15,000, which is 300,000, plus 2,500 times 20 times 19 divided by 2, which is 2,500 times 190, or 475,000, giving 775,000. Two such sessions process 1,550,000 tokens. Splitting the work saves 1,000,000 tokens, about 39 percent, even though the number of steps is the same. The saving comes entirely from the squared term. In one long session, the later steps each re-read everything accumulated by the earlier ones. This is the arithmetic behind the advice to clear the conversation between unrelated tasks. The split works only if the second task does not need the first task's context, which is why the memory file, not the conversation, is the right place for anything that must carry over.

</details>

**Question 3.** A team writes "Never push directly to the main branch" in its project memory file. A week later the agent pushes to main during a long session. Explain why this could happen, how to make it impossible, and what the memory file should be used for.

<details>
<summary>View Answer</summary>

The memory file is loaded into the model's context as text. It influences what the model chooses to do, but nothing checks the model's actions against it. In a long session the instruction is one line among a very large amount of other text, and a model can fail to apply it, particularly if a later request seems to call for a push. So the instruction made the push unlikely without preventing it. To make it impossible, the prohibition must be enforced by the harness and not left to the model: add a deny rule that matches push commands. Deny rules are evaluated before ask and allow rules and cannot be overridden by them, so the call is refused whatever the model intends. Protection on the repository's own server is a further layer. The memory file should hold what helps the agent do the work well and cannot be worked out from the code: how to run the tests and the program, how the project is laid out, conventions that are unusual, and things to be careful about. It should stay short, because every line is read on every step. Knowledge belongs in the memory file. Prohibitions belong in the permission rules.

</details>

@@starter
"""
Lab: Permissions, Memory Files, and the Tool Loop
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".

These are simplified models of how a coding agent is governed. The real matching rules
handle more cases, but the decision logic (deny, then ask, then allow) is the documented one.
"""
from fnmatch import fnmatchcase

RULES = {
    "allow": ["Read", "Bash(npm run *)", "Bash(aws s3 ls)"],
    "ask": ["Bash(git commit *)"],
    "deny": ["Read(./.env)", "Bash(git push*)", "Bash(aws *)"],
}

FILES = {
    "~/.claude/CLAUDE.md": "Prefer short explanations.",
    "./CLAUDE.md": "# Shop website\nRun tests with: npm test\n@docs/style.md",
    "docs/style.md": "Use British spelling.\n@docs/missing.md",
    "./CLAUDE.local.md": "My test database is on port 5433.",
}


# ---------------------------------------------------------------- Step 1
def parse_rule(rule):
    """Split a rule into (tool, specifier).
         "Bash(npm run build)" -> ("Bash", "npm run build")
         "Read"                -> ("Read", None)
    A rule has a specifier only if it ends with ")" and contains "(".
    Split on the FIRST "(" only, because a specifier may contain brackets."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def rule_matches(rule, tool, argument):
    """True if the rule applies to this tool call.
    The rule's tool must equal `tool`. Then:
      - a rule with no specifier matches any argument;
      - otherwise the argument must match the specifier as a pattern:
        fnmatchcase(argument, specifier), where * stands for any text."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def decide(tool, argument, rules, mode="default"):
    """Return "deny", "ask", or "allow" for a tool call.
    rules is a dict with optional lists under "deny", "ask", and "allow".
    Check the lists IN THAT ORDER and stop at the first list with a matching rule.
    If nothing matches, the answer is "ask".
    In mode "dontAsk" nobody can answer a prompt, so every "ask" becomes "deny"."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def load_memory(files, path, depth=0, max_depth=4):
    """Return the text of a memory file with its imports expanded.
    files maps a path to that file's text. A path that is not in files gives "".
    Go through the text line by line:
      - a line that, once stripped, starts with "@" and has a path after it is an import.
        If depth < max_depth, replace it with load_memory(files, that_path, depth + 1, max_depth),
        leaving it out if that result is empty. If depth >= max_depth, leave it out.
      - every other line is kept as it is.
    Join the resulting lines with "\\n"."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def agent_loop(next_action, tools, max_steps=10):
    """Run a tool loop and return its history.
    Repeat at most max_steps times:
      - action = next_action(history). If it is None, stop.
      - otherwise action is (name, argument). If name is in tools, result = tools[name](argument);
        if not, result = "error: unknown tool " + name   (do not raise).
      - append (name, argument, result) to history.
    Return history, a list of (name, argument, result) tuples."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("parsed  :", parse_rule("Bash(npm run build)"))
    print("matches :", rule_matches("Bash(npm run *)", "Bash", "npm run build"))
    print("decision:", decide("Bash", "aws s3 ls", RULES))
    print("memory  :", load_memory(FILES, "./CLAUDE.md"))
    print("history :", agent_loop(lambda history: None, {}))

@@solution
"""
Lab solution: Permissions, Memory Files, and the Tool Loop
Standard library only.

These are simplified models of how a coding agent is governed. The real matching rules
handle more cases, but the decision logic (deny, then ask, then allow) is the documented one.
"""
from fnmatch import fnmatchcase

RULES = {
    "allow": ["Read", "Bash(npm run *)", "Bash(aws s3 ls)"],
    "ask": ["Bash(git commit *)"],
    "deny": ["Read(./.env)", "Bash(git push*)", "Bash(aws *)"],
}

FILES = {
    "~/.claude/CLAUDE.md": "Prefer short explanations.",
    "./CLAUDE.md": "# Shop website\nRun tests with: npm test\n@docs/style.md",
    "docs/style.md": "Use British spelling.\n@docs/missing.md",
    "./CLAUDE.local.md": "My test database is on port 5433.",
}


# ---------------------------------------------------------------- Step 1
def parse_rule(rule):
    """Split once, from the left: a shell command inside the brackets may contain brackets."""
    if rule.endswith(")") and "(" in rule:
        tool, specifier = rule[:-1].split("(", 1)
        return tool, specifier
    return rule, None


# ---------------------------------------------------------------- Step 2
def rule_matches(rule, tool, argument):
    """A bare tool name covers every use of that tool. A specifier narrows it to a pattern."""
    rule_tool, specifier = parse_rule(rule)
    if rule_tool != tool:
        return False
    return specifier is None or fnmatchcase(argument, specifier)


# ---------------------------------------------------------------- Step 3
def decide(tool, argument, rules, mode="default"):
    """Deny is consulted first, so no allow rule can override it. That ordering is what
    makes a deny rule a real barrier. Unmatched calls fall to the mode's default."""
    for outcome in ("deny", "ask", "allow"):
        if any(rule_matches(rule, tool, argument) for rule in rules.get(outcome, [])):
            return "deny" if outcome == "ask" and mode == "dontAsk" else outcome
    return "deny" if mode == "dontAsk" else "ask"


# ---------------------------------------------------------------- Step 4
def load_memory(files, path, depth=0, max_depth=4):
    """Missing files are normal and contribute nothing. The depth limit bounds the
    recursion, so files that import each other cannot loop forever."""
    text = files.get(path)
    if text is None:
        return ""
    lines = []
    for line in text.splitlines():
        target = line.strip()
        if target.startswith("@") and len(target) > 1:
            if depth < max_depth:
                imported = load_memory(files, target[1:], depth + 1, max_depth)
                if imported:
                    lines.append(imported)
        else:
            lines.append(line)
    return "\n".join(lines)


def build_context(files, order=("~/.claude/CLAUDE.md", "./CLAUDE.md", "./CLAUDE.local.md")):
    """Broad layers first, specific layers last."""
    parts = [load_memory(files, path) for path in order]
    return "\n\n".join(part for part in parts if part)


# ---------------------------------------------------------------- Step 5
def agent_loop(next_action, tools, max_steps=10):
    """The model (next_action) only chooses. The harness (this loop) acts, records the
    result, and enforces the step limit. Errors are shown to the model, not raised."""
    history = []
    for _ in range(max_steps):
        action = next_action(history)
        if action is None:
            break
        name, argument = action
        result = tools[name](argument) if name in tools else f"error: unknown tool {name}"
        history.append((name, argument, result))
    return history


if __name__ == "__main__":
    calls = [("Read", "./src/app.js"), ("Read", "./.env"), ("Bash", "npm run build"),
             ("Bash", "git commit -m fix"), ("Bash", "git push origin main"),
             ("Bash", "aws s3 ls"), ("Bash", "rm -rf build"), ("Edit", "./src/app.js")]
    for tool, argument in calls:
        print(f"{tool:>5} {argument:<22} -> {decide(tool, argument, RULES):<6}"
              f" (unattended: {decide(tool, argument, RULES, mode='dontAsk')})")

    print()
    print(build_context(FILES))
    print()

    project = {"calc.py": "def add(a, b):\n    return a - b\n"}

    def run_tests(_):
        scope = {}
        exec(project["calc.py"], scope)
        return "PASS" if scope["add"](2, 3) == 5 else "FAIL"

    def fix(path):
        project[path] = project[path].replace("a - b", "a + b")
        return "edited"

    tools = {"read": lambda path: project.get(path, "error: no such file"), "edit": fix, "run_tests": run_tests}

    def scripted_model(history):
        if not history:
            return ("read", "calc.py")
        name, _, result = history[-1]
        if name == "read":
            return ("run_tests", "")
        if name == "run_tests" and result == "FAIL":
            return ("edit", "calc.py")
        if name == "edit":
            return ("run_tests", "")
        return None

    for step in agent_loop(scripted_model, tools):
        print(step[0], "->", step[2].strip().splitlines()[0])

@@step
{
  "stepNumber": 1,
  "title": "Parse a permission rule",
  "instruction": "Implement parse_rule(rule). A permission rule is a tool name, optionally followed by a specifier in brackets. Return a tuple (tool, specifier). If the rule ends with ')' and contains '(', the tool is the text before the first '(' and the specifier is everything between that bracket and the final ')'. Otherwise the tool is the whole rule and the specifier is None. Split on the first '(' only, because a specifier such as a shell command may itself contain brackets. This is the rule format from Section 2. [MOD-3.4]",
  "hintConceptual": "A rule is either a bare tool name, or a tool name with a narrower description in brackets. Remove the final bracket, then cut once at the first opening bracket.",
  "hintSyntax": "if rule.endswith(\")\") and \"(\" in rule:\n    tool, specifier = rule[:-1].split(\"(\", 1)\n    return tool, specifier\nreturn rule, None"
}
@@assert
assert parse_rule("Bash(npm run build)") == ("Bash", "npm run build"), f"Got {parse_rule('Bash(npm run build)')}"
assert parse_rule("Read") == ("Read", None), "A bare tool name has no specifier"
assert parse_rule("Read(./.env)") == ("Read", "./.env"), "The specifier is the text inside the brackets"
assert parse_rule("WebFetch(domain:example.com)") == ("WebFetch", "domain:example.com"), "Specifiers may contain colons"
assert parse_rule("Bash(echo (hi))") == ("Bash", "echo (hi)"), "Split on the FIRST bracket only, and remove only the final one"
assert parse_rule("Bash(git push*)") == ("Bash", "git push*"), "Wildcards stay in the specifier"
print("Step 1 passed: rules are split into a tool and an optional specifier.")

@@step
{
  "stepNumber": 2,
  "title": "Does a rule match a tool call?",
  "instruction": "Implement rule_matches(rule, tool, argument). Use parse_rule to split the rule. If the rule's tool is not equal to tool, return False. If the rule has no specifier, return True: a bare tool name covers every use of that tool. Otherwise return whether the argument matches the specifier as a pattern, using fnmatchcase(argument, specifier), in which an asterisk stands for any text. The result must be exactly True or False. [MOD-3.4]",
  "hintConceptual": "Two questions in order: is this rule about the same tool? If so, is it a blanket rule, or does its pattern fit this particular argument?",
  "hintSyntax": "rule_tool, specifier = parse_rule(rule)\nif rule_tool != tool:\n    return False\nreturn specifier is None or fnmatchcase(argument, specifier)"
}
@@assert
assert rule_matches("Read", "Read", "./src/app.js") is True, "A bare tool rule matches any argument for that tool"
assert rule_matches("Read", "Edit", "./src/app.js") is False, "A rule for one tool never matches another tool"
assert rule_matches("Bash(npm run *)", "Bash", "npm run build") is True, "The asterisk stands for any text"
assert rule_matches("Bash(npm run *)", "Bash", "npm install") is False, "A different command does not match the pattern"
assert rule_matches("Bash(npm run build)", "Bash", "npm run build") is True, "An exact specifier matches the exact command"
assert rule_matches("Bash(npm run build)", "Bash", "npm run build --watch") is False, "Without an asterisk the match must be exact"
assert rule_matches("Read(./.env)", "Read", "./.env") is True, "A file rule matches that file"
assert rule_matches("Read(./.env)", "Read", "./README.md") is False, "A file rule does not match other files"
assert rule_matches("Bash(git push*)", "Bash", "git push") is True and rule_matches("Bash(git push*)", "Bash", "git push origin main") is True, "git push* matches with or without further arguments"
assert rule_matches("Bash(Read)", "Read", "Read") is False, "The tool is the part before the bracket"
print("Step 2 passed: bare rules cover a whole tool, and specifiers narrow them with patterns.")

@@step
{
  "stepNumber": 3,
  "title": "Deny, then ask, then allow",
  "instruction": "Implement decide(tool, argument, rules, mode). rules is a dict that may have lists under the keys 'deny', 'ask', and 'allow'. Check the lists in exactly that order, using rule_matches, and return the name of the first list that contains a matching rule. If no rule in any list matches, return 'ask'. When mode is 'dontAsk' there is nobody to answer a prompt, so return 'deny' wherever you would have returned 'ask'. A missing key must not cause an error. This is the decision function from Section 2: because deny is checked first, no allow rule can override it. [MOD-3.4]",
  "hintConceptual": "Walk the three lists from strictest to most permissive and stop at the first hit. Then handle the fall-through, and the mode in which asking is not possible.",
  "hintSyntax": "for outcome in (\"deny\", \"ask\", \"allow\"):\n    if any(rule_matches(rule, tool, argument) for rule in rules.get(outcome, [])):\n        return \"deny\" if outcome == \"ask\" and mode == \"dontAsk\" else outcome\nreturn \"deny\" if mode == \"dontAsk\" else \"ask\""
}
@@assert
assert decide("Read", "./src/app.js", RULES) == "allow", f"Reading an ordinary file is allowed, got {decide('Read', './src/app.js', RULES)}"
assert decide("Read", "./.env", RULES) == "deny", "The deny rule for ./.env beats the general allow rule for Read"
assert decide("Bash", "npm run build", RULES) == "allow", "npm run commands are allowed"
assert decide("Bash", "git commit -m fix", RULES) == "ask", "Commits match the ask rule"
assert decide("Bash", "git push origin main", RULES) == "deny", "Pushes are denied"
assert decide("Bash", "aws s3 ls", RULES) == "deny", "A broad deny (aws *) beats a narrow allow (aws s3 ls)"
assert decide("Bash", "rm -rf build", RULES) == "ask", "A call that matches no rule falls back to ask"
assert decide("Edit", "./src/app.js", RULES) == "ask", "A tool with no rules falls back to ask"
assert decide("Bash", "rm -rf build", RULES, mode="dontAsk") == "deny", "In dontAsk mode an unmatched call is denied"
assert decide("Bash", "git commit -m fix", RULES, mode="dontAsk") == "deny", "In dontAsk mode a call matching an ask rule is denied"
assert decide("Bash", "npm run build", RULES, mode="dontAsk") == "allow", "In dontAsk mode allowed calls still run"
assert decide("Read", "x", {}) == "ask", "With no rules at all, and no error, the answer is ask"
assert decide("Read", "x", {"allow": ["Read"], "ask": ["Read"]}) == "ask", "ask is checked before allow"
print("Step 3 passed: deny is checked first, so no allow rule can override it.")

@@step
{
  "stepNumber": 4,
  "title": "Load memory files with imports",
  "instruction": "Implement load_memory(files, path, depth, max_depth). files is a dict from path to text. If path is not in files, return an empty string. Otherwise go through the text line by line. A line that, after strip(), starts with '@' and has at least one more character is an import of the path after the '@'. If depth is less than max_depth, replace the line with the result of load_memory for that path at depth + 1, and leave it out entirely if the result is empty. If depth has reached max_depth, leave the import out. Keep every other line unchanged. Join the lines with a newline and return the text. This is the import mechanism and the four-hop limit from Section 2. [MOD-3.4]",
  "hintConceptual": "Reading a file means reading its lines, and wherever a line points at another file, reading that file in its place. A counter that goes up by one with each hop stops the chain from running forever.",
  "hintSyntax": "text = files.get(path)\nif text is None:\n    return \"\"\nlines = []\nfor line in text.splitlines():\n    target = line.strip()\n    if target.startswith(\"@\") and len(target) > 1:\n        if depth < max_depth:\n            imported = load_memory(files, target[1:], depth + 1, max_depth)\n            if imported:\n                lines.append(imported)\n    else:\n        lines.append(line)\nreturn \"\\n\".join(lines)"
}
@@assert
assert load_memory(FILES, "~/.claude/CLAUDE.md") == "Prefer short explanations.", "A file with no imports is returned as it is"
assert load_memory(FILES, "./nope.md") == "", "A missing file gives an empty string"
assert load_memory(FILES, "./CLAUDE.md") == "# Shop website\nRun tests with: npm test\nUse British spelling.", f"The import is replaced by the imported file, and the missing import inside it is left out, got {load_memory(FILES, './CLAUDE.md')!r}"
_chain = {"a": "A\n@b", "b": "B\n@c", "c": "C\n@d", "d": "D\n@e", "e": "E\n@f", "f": "F"}
assert load_memory(_chain, "a") == "A\nB\nC\nD\nE", f"Imports stop after four hops: f is five hops from a, got {load_memory(_chain, 'a')!r}"
assert load_memory(_chain, "a", max_depth=1) == "A\nB", "max_depth must be passed down through the recursion"
assert load_memory(_chain, "c") == "C\nD\nE\nF", "Starting at c, f is only three hops away"
_loop = {"x": "X\n@y", "y": "Y\n@x"}
assert load_memory(_loop, "x") == "X\nY\nX\nY\nX", "Files that import each other must stop at the depth limit, not loop forever"
assert load_memory({"m": "before\n  @n  \nafter", "n": "inside"}, "m") == "before\ninside\nafter", "Strip the line before looking for the @"
assert load_memory({"m": "email me @ noon\n@", "n": "x"}, "m") == "email me @ noon\n@", "Only a line that starts with @ and has a path after it is an import; other lines, including a lone @, are kept"
print("Step 4 passed: imports are expanded in place, missing files are skipped, and the hop limit stops loops.")

@@step
{
  "stepNumber": 5,
  "title": "The tool loop",
  "instruction": "Implement agent_loop(next_action, tools, max_steps). Start with an empty history list. Repeat at most max_steps times: call next_action(history). If it returns None, the model is finished, so stop. Otherwise it returns a tuple (name, argument). If name is a key in tools, the result is tools[name](argument). If it is not, the result is the string 'error: unknown tool ' followed by the name, and the loop continues without raising. Append (name, argument, result) to the history. Return the history. This is the harness from Section 2: the model chooses, the loop acts and records, and the step limit bounds the work. [MOD-3.4]",
  "hintConceptual": "The model only says what it wants next. Your loop does it, writes down what happened, and asks again, until the model says it is done or the step budget runs out.",
  "hintSyntax": "history = []\nfor _ in range(max_steps):\n    action = next_action(history)\n    if action is None:\n        break\n    name, argument = action\n    result = tools[name](argument) if name in tools else f\"error: unknown tool {name}\"\n    history.append((name, argument, result))\nreturn history"
}
@@assert
assert agent_loop(lambda history: None, {}) == [], "A model that is finished at once produces an empty history"
_tools = {"double": lambda n: n * 2, "shout": lambda s: s.upper()}
_plan = [("double", 4), ("shout", "ok"), None]
assert agent_loop(lambda history: _plan[len(history)], _tools) == [("double", 4, 8), ("shout", "ok", "OK")], "Each action is executed and recorded as (name, argument, result) until the model returns None"
assert agent_loop(lambda history: ("double", len(history)), _tools, max_steps=3) == [("double", 0, 0), ("double", 1, 2), ("double", 2, 4)], "A model that never stops is cut off at max_steps"
assert len(agent_loop(lambda history: ("double", 1), _tools)) == 10, "The default step limit is 10"
_bad = agent_loop(lambda history: ("delete", "x") if not history else None, _tools)
assert _bad == [("delete", "x", "error: unknown tool delete")], f"An unknown tool gives an error result and does not raise, got {_bad}"
_project = {"calc.py": "return a - b"}
def _fix(path):
    _project[path] = _project[path].replace("a - b", "a + b")
    return "edited"
_agent_tools = {"read": lambda path: _project[path], "edit": _fix, "run_tests": lambda _: "PASS" if "a + b" in _project["calc.py"] else "FAIL"}
def _model(history):
    if not history:
        return ("read", "calc.py")
    name, _, result = history[-1]
    if name == "read":
        return ("run_tests", "")
    if name == "run_tests" and result == "FAIL":
        return ("edit", "calc.py")
    if name == "edit":
        return ("run_tests", "")
    return None
_trace = agent_loop(_model, _agent_tools)
assert [step[0] for step in _trace] == ["read", "run_tests", "edit", "run_tests"], f"The model must see each result before choosing the next action, got {[step[0] for step in _trace]}"
assert _trace[1][2] == "FAIL" and _trace[-1][2] == "PASS", "The first test run fails and the run after the edit passes"
print("Step 5 passed: read, test, edit, test again. The second test run is how the agent knows the fix worked.")
