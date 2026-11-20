@@meta
{
  "moduleId": "MOD-9.4",
  "slug": "mod-9-4",
  "unitId": "UNIT-9",
  "unitTitle": "Unit 9: Coding with AI",
  "title": "Cursor",
  "difficulty": "Intermediate",
  "estimatedMinutes": 100,
  "citations": [
    { "title": "Rules", "source": "Official Docs (Cursor)", "url": "https://cursor.com/docs/context/rules" },
    { "title": "Ignore files (.cursorignore)", "source": "Official Docs (Cursor)", "url": "https://cursor.com/docs/context/ignore-files" },
    { "title": "Plan Mode", "source": "Official Docs (Cursor)", "url": "https://cursor.com/docs/agent/plan-mode" },
    { "title": "Tab", "source": "Official Docs (Cursor)", "url": "https://cursor.com/docs/tab/overview" },
    { "title": "Models and pricing", "source": "Official Docs (Cursor)", "url": "https://cursor.com/docs/models-and-pricing" },
    { "title": "Security", "source": "Cursor", "url": "https://cursor.com/security" },
    { "title": "SpaceX makes its $60bn Cursor takeover official", "source": "The Next Web", "url": "https://thenextweb.com/news/spacex-cursor-acquisition-official-60-billion" }
  ],
  "videoLibrary": [
    {
      "id": "VID-9.4-1",
      "title": "Cursor 3.0 - Full Course for Beginners",
      "creator": "Tech With Tim",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=Tv8mLrLtyxo",
      "timingInstruction": "Watch after Section 1, before the rules part of Section 2",
      "keyTakeaway": "A guided tour of the editor, Tab, the agent, and the main settings."
    },
    {
      "id": "VID-9.4-2",
      "title": "How To Be 10x More Productive In Cursor Using MDC Rules",
      "creator": "Elie Steinbock",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=ABozvKmctkc",
      "timingInstruction": "Watch after the rules part of Section 2, before Step 1 of the lab",
      "keyTakeaway": "Writing focused .mdc rules that attach to the right files instead of one giant instruction file."
    },
    {
      "id": "VID-9.4-3",
      "title": "Introducing Plan Mode",
      "creator": "Cursor",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=WInPBmCK3l4",
      "timingInstruction": "Watch after the modes part of Section 2, before Section 3",
      "keyTakeaway": "How the agent researches, asks questions, and produces an editable plan before writing code."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Rule Files, Rule Activation, Ignore Files, Plan Choice, Context Budgets",
    "context": "The tool shop's web team uses Cursor and wants its house rules to load at the right moments, its secrets kept out of the AI's reach, the right subscription, and context that fits. You will parse .mdc rule files, decide which rules apply to a request, check what .cursorignore does and does not protect, choose the cheapest plan for a usage profile, and fit context items into a budget.",
    "language": "python"
  }
}

@@reading
# Cursor

**Cursor** is an AI code editor built on Visual Studio Code. It combines **Tab**, an AI autocomplete that predicts multi-line and cross-file edits, with an **agent** that can research the code base, edit many files, and run terminal commands. Where Claude Code, Module 9.3, starts from the terminal, Cursor starts from the editor: you see files, diffs, and suggestions inline as you work, which suits developers who like to stay close to the code.

The business around Cursor changed sharply in 2026. SpaceX completed a takeover of Anysphere, Cursor's developer, valued at 60 billion US dollars, as The Next Web reported, and Cursor's pricing moved into a bundled "X Subscription" alongside Grok and X. This module describes the product and plans as Cursor's own pages present them at the time of writing (November 2026); prices and plan names in particular change often, so check before you buy.

## 1. First-Principles Mental Model & Intuition

### A workshop with a smart assistant at your elbow

Picture a workshop where an assistant stands at your elbow. As you work, they hand you the next tool before you ask: that is **Tab**. When you describe a job, they go off and do it, coming back with the finished piece for inspection: that is the **agent**. On the wall hangs a set of laminated cards, some always visible, some pulled out only when you are working on a particular kind of joint: those are **rules**. A locked cabinet holds things the assistant must not handle: that is **`.cursorignore`**, with the important caveat that the cabinet locks against the assistant's hands but not against every tool in the room.

```text
   CURSOR
   Tab ------------------> predicts next edits, including cross-file ones, as you type
   Agent ----------------> researches code, edits files, runs terminal commands, uses MCP tools
     Plan Mode ----------> researches, asks clarifying questions, writes an editable plan, then builds
   CONTEXT
     rules: .cursor/rules/*.mdc (always | by file globs | agent decides by description | manual @)
            AGENTS.md (simple alternative); user rules; team rules (Team/Enterprise)
     @-mentions: files, folders, terminals, chats, git diffs, browser
     .cursorignore: hides paths from Agent, Tab, and @ (NOT from terminal or MCP tools)
   ACCOUNT
     plan: shared weekly usage pool; third-party models at API list price on higher tiers
     Privacy Mode: no training on your code by Cursor or model providers
```

### Context is the whole game

An AI editor is only as good as what it sees. Cursor's design is largely about **context control**: rules supply your conventions, @-mentions point at exactly the files that matter, search finds relevant code, and ignore files keep out what must not be seen. Most disappointing results come from the wrong context, too little, too much, or stale, rather than from the model.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Rules

Cursor's documentation describes four kinds of rules: **project rules**, **user rules**, **team rules**, and **AGENTS.md**.

**Project rules** are stored in `.cursor/rules`, version-controlled with the code, and must use the **`.mdc`** extension; a plain `.md` file there is ignored. Each rule file has optional frontmatter with three fields, `description`, `globs`, and `alwaysApply`, followed by the rule's text. The fields decide when the rule enters the context:

| Frontmatter | Behaviour | Shown in the editor as |
|---|---|---|
| `alwaysApply: true` | Included in every agent request | Always Apply |
| `globs` set | Attached automatically when a matching file is in context | Apply to Specific Files |
| `description` only | The agent reads the description and pulls the rule in when relevant | Apply Intelligently |
| None of these | Included only when mentioned with @ | Apply Manually |

```text
---
globs: src/components/*.tsx, src/pages/*.tsx
alwaysApply: false
---
Use function components and the shared Button for all buttons.
```

**User rules** are global preferences set in Cursor's settings that apply to all your projects. **Team rules**, on Team and Enterprise plans, apply across an organisation, with precedence documented as team rules, then project rules, then user rules. **AGENTS.md** in the project root is a simpler alternative to `.cursor/rules`, and nested AGENTS.md files in subdirectories are supported, with more specific instructions taking precedence. The documentation recommends keeping rules focused, under about 500 lines, and notes that rules do not affect Tab.

Rules are guidance in the same sense as Claude Code's CLAUDE.md, Module 9.3: they shape what the agent does, but they are not security controls.

### Ignore files

A **`.cursorignore`** file in the project root, written in `.gitignore` syntax, hides files and directories from Cursor. The documentation lists what it blocks: code accessible by **Agent and Tab**, and code accessible via **@-mention references**. It also states a crucial limit: **the terminal and MCP server tools used by Agent cannot block access to code governed by `.cursorignore`**. An agent asked to debug a configuration problem can still run `cat .env` in the terminal. Ignore files reduce accidental exposure; for real secrets, keep them out of the repository, require approval for terminal commands, and treat the agent's terminal as having your permissions, Module 8.14.

Ignore patterns follow `.gitignore` semantics: `.env*` matches `.env` and `.env.local`; a trailing slash, `secrets/`, matches a directory; and a later `!` pattern re-includes a match, so `!.env.example` keeps the harmless example file visible. Order matters: the **last** matching pattern decides.

### Modes and Tab

**Agent** is Cursor's assistant that, in the documentation's words, can complete complex coding tasks independently, run terminal commands, and edit code. **Plan Mode**, reached by pressing Shift+Tab in the chat input, has the agent research the code base, ask clarifying questions, and generate a reviewable plan that you can edit, in chat or as a Markdown file, before clicking to build it. As with Claude Code's plan mode, a plan is cheaper to fix than a diff.

**Tab** is Cursor's AI autocomplete: it predicts the next edit, jumps to the next location that needs editing, and predicts cross-file edits when a change in one file needs updates in another. It is the autocomplete end of Module 9.1's spectrum, inside the same editor as the agent end.

### Context: @-mentions and budgets

@-mentions add specific context to a request. Cursor's documentation lists files and folders, such as `@auth.ts` or `@src/components/`, terminals, previous chats, Git diffs such as the working-state diff or the branch's diff against main, and the browser. Every item costs part of the model's context window, which also holds the system prompt, tools, rules, and the conversation. Choosing context is a budgeting problem: with a limit $C$ and items $i$ with token costs $t_i$ and priorities $p_i$, we want a high-priority set with

$$\sum_{i \in S} t_i \le C$$

A simple, effective policy is greedy: sort by priority, then by size, and add items while they fit. Mentioning a whole folder of 40,000 tokens when you need one 2,400-token file wastes budget and dilutes attention, Module 8.3's "lost in the middle".

### Models, plans, and cost

At the time of writing, Cursor's pricing page presents its plans as part of the X Subscription. The documented tiers are **Free**, **Plus** at 8 US dollars a month, **Premium** at 30, **Super** at 100, and **Ultra** at 200, with Teams seats and custom Enterprise pricing. Each paid plan includes **one pool of usage** for Cursor's own models that refreshes **weekly**, larger on higher tiers, documented as 4, 15, and 50 times the Plus pool for Premium, Super, and Ultra. **Third-party models**, such as Claude, GPT, and Gemini, are not included on Free and Plus; on Premium and above they are billed at the model's **API list price** from prepaid credit. Customers on older plans, such as the previous Pro and Pro+ plans, can keep them.

Choosing a plan is a constrained minimisation. If your weekly need for Cursor-model usage is $u$, in units of the Plus pool $b$, and your monthly third-party spend at list price is $s$:

$$\text{cost} = \min_{p\,:\,u \le b\,m_p,\ (s = 0 \lor \text{third}_p)} \left(\text{price}_p + s\right)$$

where $m_p$ is plan $p$'s pool multiplier. The lab uses an illustrative pool of 100 units a week for Plus, purely to make the arithmetic concrete; Cursor does not publish its pool in those units.

### Privacy

Cursor's privacy documentation states that **Privacy Mode** ensures your code is never used for training by Cursor or other AI model providers; it is a setting in the editor, can be enforced by team administrators, and is on by default for Enterprise. Two cautions from the same pages: retention guarantees do not apply when you use your own API keys, and some models require data retention by the provider, which needs administrator approval. For client work or regulated code, check these settings, and your contracts, before the first prompt.

### Complexity

Parsing a rule is linear in its length. Deciding rule activation is linear in rules times context files times globs. Ignore matching is linear in patterns. Plan choice is linear in plans. Greedy context fitting is $O(n \log n)$ for the sort.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, parsing rule files.

```python
import fnmatch
import re

def parse_mdc(path, text):
    if not path.endswith(".mdc"):
        return None, "ignored: project rules must use .mdc"
    meta = {"description": "", "globs": [], "alwaysApply": False}
    body = text
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if m:
        for line in m.group(1).splitlines():
            if ":" not in line:
                continue
            key, value = (s.strip() for s in line.split(":", 1))
            if key == "globs":
                meta["globs"] = [g.strip() for g in value.split(",") if g.strip()]
            elif key == "alwaysApply":
                meta["alwaysApply"] = value.lower() == "true"
            elif key == "description":
                meta["description"] = value
        body = m.group(2)
    meta["body"] = body.strip()
    meta["name"] = path.rsplit("/", 1)[-1][:-4]
    return meta, "ok"

RULE_FILES = {".cursor/rules/style.mdc": "---\ndescription: House style\nalwaysApply: true\n---\nUse British spelling.",
              ".cursor/rules/react.mdc": "---\nglobs: src/components/*.tsx, src/pages/*.tsx\nalwaysApply: false\n---\nUse function components.",
              ".cursor/rules/db.mdc": "---\ndescription: Database migration conventions\n---\nMigrations are append-only.",
              ".cursor/rules/release.mdc": "---\n---\nRelease checklist.",
              ".cursor/rules/notes.md": "Plain markdown."}
RULES = {}
for path, text in RULE_FILES.items():
    rule, status = parse_mdc(path, text)
    print(path, status)
    if rule:
        RULES[rule["name"]] = rule
```

- **A `.md` file in the rules folder is ignored.** A common reason a rule "does nothing".
- **Globs are comma-separated in the frontmatter.** The React rule attaches to components and pages.
- **`alwaysApply` is a boolean written as text.**
- **The rule's name comes from its file name.** It is how you mention it with @.

Next, which rules apply to a request.

```python
def rule_status(rule, context_files, mentions):
    if rule["alwaysApply"]:
        return "always"
    if rule["globs"] and any(fnmatch.fnmatch(f, g) for f in context_files for g in rule["globs"]):
        return "auto-attached"
    if rule["name"] in mentions:
        return "mentioned"
    if rule["description"]:
        return "agent decides"
    return "inactive"

print({n: rule_status(r, ["src/components/Button.tsx", "README.md"], set()) for n, r in RULES.items()})
print({n: rule_status(r, ["api/orders.py"], {"release"}) for n, r in RULES.items()})
```

- **The style rule is always present.** Keep always-on rules short: they cost context in every request.
- **Editing `Button.tsx` attaches the React rule automatically.**
- **The database rule depends on the agent judging its description relevant.** Write descriptions as triggers: "Database migration conventions".
- **The release checklist appears only when mentioned.** In the second request, @release brings it in.

Then, what `.cursorignore` protects.

```python
def ignored(path, patterns):
    result = False
    for pattern in patterns:
        negate = pattern.startswith("!")
        p = pattern[1:] if negate else pattern
        if p.endswith("/"):
            hit = path.startswith(p) or ("/" + p) in ("/" + path)
        else:
            hit = fnmatch.fnmatch(path, p) or fnmatch.fnmatch(path.rsplit("/", 1)[-1], p)
        if hit:
            result = not negate
    return result

def exposure(path, patterns, channel):
    if not ignored(path, patterns):
        return "visible"
    return "blocked" if channel in {"agent", "tab", "mention"} else "NOT blocked: " + channel

PATTERNS = [".env*", "secrets/", "*.pem", "!.env.example"]
for path, channel in [(".env", "agent"), (".env.example", "agent"), ("secrets/prod.json", "mention"),
                      (".env", "terminal"), (".env.local", "mcp")]:
    print(path, channel, exposure(path, PATTERNS, channel))
```

- **The last matching pattern wins.** `.env.example` matches `.env*` but is re-included by `!.env.example`.
- **A trailing slash matches a directory and everything inside it.**
- **Agent, Tab, and @-mentions are blocked from ignored files.**
- **The terminal and MCP tools are not.** The same `.env` the agent cannot open is one `cat` command away.

Then, choosing a plan.

```python
PLANS = [("Free", 0, 0.25, False), ("Plus", 8, 1, False), ("Premium", 30, 4, True),
         ("Super", 100, 15, True), ("Ultra", 200, 50, True)]

def cheapest_plan(weekly_units, third_party_usd_month, base_units=100):
    options = []
    for name, price, multiplier, third_party in PLANS:
        if weekly_units > base_units * multiplier:
            continue
        if third_party_usd_month > 0 and not third_party:
            continue
        options.append((round(price + third_party_usd_month, 2), name))
    return min(options) if options else None

print(cheapest_plan(80, 0), cheapest_plan(80, 12), cheapest_plan(350, 0), cheapest_plan(1200, 40), cheapest_plan(6000, 0))
```

- **Plans are price, pool multiplier, and whether third-party models are available.** The Free pool size here is illustrative.
- **Light use with Cursor's models fits Plus for 8.**
- **Wanting a third-party model, even lightly, requires Premium: 30 plus 12 of list-price usage, 42.**
- **350 units a week needs Premium's 400; 1,200 units with 40 of third-party usage needs Super, 140.**
- **6,000 units exceeds every individual pool.** That is Teams or Enterprise territory, or a sign to change habits.

Finally, fitting context.

```python
def fit_context(items, limit):
    chosen, used, dropped = [], 0, []
    for name, tokens, priority in sorted(items, key=lambda i: (-i[2], i[1], i[0])):
        if used + tokens <= limit:
            chosen.append(name)
            used += tokens
        else:
            dropped.append(name)
    return chosen, used, dropped

ITEMS = [("rules: style", 300, 9), ("@Button.tsx", 2400, 8), ("@src/components/", 40000, 3),
         ("@Branch diff", 6000, 7), ("terminal output", 1500, 6), ("old chat", 9000, 1)]
print(fit_context(ITEMS, 12000))
```

- **Items go in by priority, then smallest first.**
- **With 12,000 tokens, the rule, the file, the branch diff, and the terminal output fit: 10,200.**
- **The whole components folder and the old chat are dropped.** Mentioning the one file you need beats mentioning its folder.

**Complexity.** `parse_mdc` is linear in the file. `rule_status` is linear in context files times globs. `ignored` is linear in patterns. `cheapest_plan` is linear in plans. `fit_context` sorts the items.

### A team setup for Cursor

```text
RULES        .cursor/rules/style.mdc (alwaysApply, under 30 lines); react.mdc (globs: src/components/*.tsx);
             db.mdc (description: "Database migration conventions"); release.mdc (manual, @release)
IGNORE       .cursorignore: .env*, secrets/, *.pem, !.env.example
             AND: secrets not in the repo; terminal commands need approval; MCP servers reviewed
MODES        Plan Mode for multi-file features; agent for focused tasks; Tab while writing
CONTEXT      mention specific files and the branch diff; avoid whole folders; new chat per task
PLAN         price usage before choosing; third-party models only on tiers that include them
PRIVACY      Privacy Mode on and enforced for the team; check provider retention for each model
```

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Rules saved as `.md`.** Project rules must be `.mdc`. Rename and check they appear in the rules list.

**One giant always-on rule.** It costs context in every request and buries what matters. Split by globs and descriptions.

**Vague descriptions.** "Misc notes" never gets pulled in. Describe when the rule is relevant.

**Treating `.cursorignore` as a vault.** The terminal and MCP tools can still read ignored files. Keep secrets out of the repository.

**Pattern order surprises.** The last match wins. Put `!` re-includes after the broad patterns.

**Mentioning whole folders.** Large context dilutes attention and costs usage. Mention files.

**Long, wandering chats.** Old turns consume context. Start a new chat per task.

**Skipping Plan Mode.** Multi-file features built without a plan drift. Plan, edit, then build.

**Plan surprises after the 2026 changes.** Bundled pricing and list-price billing for third-party models change the maths. Re-price your usage.

**Assuming Privacy Mode covers everything.** Own API keys and some models have different retention. Read the details.

**Accepting Tab blindly.** Cross-file predictions can be wrong in subtle ways. Review like any suggestion, Module 9.1.

**Tool lock-in.** Rules, plans, and habits transfer; keep them in the repository, AGENTS.md included, so another tool can use them.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Cursor is a Visual Studio Code-based AI editor combining Tab, an autocomplete that predicts next and cross-file edits, with an agent that edits files and runs commands, plus Plan Mode for research and an editable plan before building. Project rules live in `.cursor/rules` as `.mdc` files whose `alwaysApply`, `globs`, and `description` fields decide whether a rule always applies, attaches to matching files, is pulled in when the agent judges it relevant, or applies only when mentioned; user, team, and AGENTS.md rules complete the picture, and rules are guidance, not security. `.cursorignore`, in `.gitignore` syntax with the last match winning, hides paths from Agent, Tab, and @-mentions but not from the terminal or MCP tools. Context is a budget, best spent on specific files and diffs chosen by priority. After SpaceX's 2026 takeover of Cursor's developer, plans sit within the X Subscription, with a weekly usage pool that grows by tier and third-party models billed at API list price on Premium and above, and Privacy Mode prevents training on your code with documented exceptions for own keys and some models.

**Question 1.** A developer creates `.cursor/rules/testing.md` saying "Always run npm test after changes" and notices the agent never follows it. Using `parse_mdc` and `rule_status`, diagnose the problem and propose a better rule.

<details>
<summary>View Answer</summary>

`parse_mdc` returns None with "ignored: project rules must use .mdc" because the file ends in `.md`; Cursor's documentation says project rules must use the `.mdc` extension and plain `.md` files in the folder are ignored, so the agent never saw the instruction. Renaming it to `testing.mdc` is necessary but not sufficient: with no frontmatter, `rule_status` returns "inactive" unless the rule is mentioned, since it has no `alwaysApply`, no `globs`, and no `description`. A better rule has frontmatter that matches when it should apply. Because running tests after changes applies to almost every coding task, `alwaysApply: true` is reasonable if the rule is short, for example two lines giving the exact command and when to run it. Alternatively, `globs: src/**/*.ts, src/**/*.tsx` would attach it whenever source files are in context, or a `description` such as "Testing requirements after code changes" would let the agent pull it in. Even then, a rule is guidance: to make tests mandatory, run them in continuous integration, Module 9.11, and review that the agent actually ran them.

</details>

**Question 2.** A team's `.cursorignore` contains `.env*`, `secrets/`, and `!.env.example`. A security reviewer asks whether the agent can read the production database password stored in `.env.production`. Answer using `exposure`, and recommend controls.

<details>
<summary>View Answer</summary>

`.env.production` matches `.env*` and is not re-included, so `exposure` returns blocked for the agent's file tools, for Tab, and for @-mentions: the agent cannot open the file directly or have it attached as context. But for the terminal channel `exposure` returns "NOT blocked: terminal", reflecting Cursor's documentation that the terminal and MCP server tools used by the agent cannot block access to code governed by `.cursorignore`. An agent asked to debug a database connection could run `cat .env.production` or `printenv` and read the password into its context, and from there it could appear in chat logs or be exfiltrated if injected instructions are present, Module 8.14. So the honest answer is: not through file tools, yes through the terminal. Recommended controls: keep production secrets out of developers' working copies entirely, using a secrets manager and development credentials locally; require approval for terminal commands, or restrict the commands the agent may run; review MCP servers before enabling them; enable Privacy Mode; and rotate the password if there is any chance it has already been read. The ignore file remains useful for reducing accidental exposure but is not a security boundary.

</details>

**Question 3.** A freelancer uses Cursor's own models for about 350 units a week, in the lab's illustrative units, and wants to use a Claude model for about 15 US dollars a month of list-price usage. Using `cheapest_plan`, choose a plan and discuss what could change the answer.

<details>
<summary>View Answer</summary>

Plus offers 100 units a week, too few for 350; Premium offers 400 and includes third-party models, so `cheapest_plan(350, 15)` returns Premium at 30 plus 15, 45 dollars a month. Super, at 100 dollars plus usage, offers far more pool than needed. Several things could change the answer. Usage varies: if the weekly need grows past 400 units, Premium no longer fits and Super becomes the cheapest at 115 including the Claude usage, so it is worth tracking usage in the editor's settings for a few weeks before committing. Third-party spend is billed at the model's list price on top of the subscription, so heavier Claude use raises the cost one for one; a freelancer using mostly Claude might compare this with using Claude directly, for example through Claude Code, Module 9.3. Legacy plans can be kept by existing customers, which may be cheaper for some profiles. Annual billing lowers the effective monthly price. And plan names and prices changed in 2026 and may change again, so the inputs, not the specific answer, are the durable part: measure usage, separate own-model and third-party costs, and re-price periodically.

</details>

@@starter
"""
Lab: Rule Files, Rule Activation, Ignore Files, Plan Choice, Context Budgets
Standard library only. A simplified model of Cursor's configuration logic. Complete the TODO in each step, then
press "Run & Verify Step".
"""
import fnmatch
import re

RULE_FILES = {".cursor/rules/style.mdc": "---\ndescription: House style\nalwaysApply: true\n---\nUse British spelling.",
              ".cursor/rules/react.mdc": "---\nglobs: src/components/*.tsx, src/pages/*.tsx\nalwaysApply: false\n---\nUse function components.",
              ".cursor/rules/db.mdc": "---\ndescription: Database migration conventions\n---\nMigrations are append-only.",
              ".cursor/rules/release.mdc": "---\n---\nRelease checklist.",
              ".cursor/rules/notes.md": "Plain markdown."}
PATTERNS = [".env*", "secrets/", "*.pem", "!.env.example"]
PLANS = [("Free", 0, 0.25, False), ("Plus", 8, 1, False), ("Premium", 30, 4, True),
         ("Super", 100, 15, True), ("Ultra", 200, 50, True)]
ITEMS = [("rules: style", 300, 9), ("@Button.tsx", 2400, 8), ("@src/components/", 40000, 3),
         ("@Branch diff", 6000, 7), ("terminal output", 1500, 6), ("old chat", 9000, 1)]


# ---------------------------------------------------------------- Step 1
def parse_mdc(path, text):
    """Not .mdc -> (None, "ignored: project rules must use .mdc"). Defaults description "", globs [], alwaysApply
    False. Frontmatter between --- lines: globs comma-separated and stripped; alwaysApply true if "true" (any case);
    description as text. body = rest stripped (whole text if no frontmatter); name = file name without .mdc.
    Return (meta, "ok")."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def rule_status(rule, context_files, mentions):
    """alwaysApply -> "always"; any context file matches any glob (fnmatch) -> "auto-attached"; name in mentions ->
    "mentioned"; description -> "agent decides"; else "inactive"."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def ignored(path, patterns):
    """Last matching pattern wins. "!" negates. A pattern ending "/" matches paths starting with it or containing
    "/" + it. Others: fnmatch on the full path or the file name."""
    # TODO Step 3
    return None


def exposure(path, patterns, channel):
    """Not ignored -> "visible"; ignored and channel in agent/tab/mention -> "blocked"; else "NOT blocked: <channel>"."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def cheapest_plan(weekly_units, third_party_usd_month, base_units=100):
    """Plans whose pool (base_units * multiplier) covers the weekly units and that allow third-party models if any
    third-party spend. Return min((round(price + spend, 2), name)) or None."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def fit_context(items, limit):
    """Sort by priority descending, tokens ascending, name. Add while used + tokens <= limit, else drop.
    Return (chosen names, used tokens, dropped names)."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("rule  :", parse_mdc(".cursor/rules/react.mdc", RULE_FILES[".cursor/rules/react.mdc"]))
    print("plan  :", cheapest_plan(350, 0))

@@solution
"""
Lab solution: Rule Files, Rule Activation, Ignore Files, Plan Choice, Context Budgets
Standard library only. A simplified model of Cursor's configuration logic.
"""
import fnmatch
import re

RULE_FILES = {".cursor/rules/style.mdc": "---\ndescription: House style\nalwaysApply: true\n---\nUse British spelling.",
              ".cursor/rules/react.mdc": "---\nglobs: src/components/*.tsx, src/pages/*.tsx\nalwaysApply: false\n---\nUse function components.",
              ".cursor/rules/db.mdc": "---\ndescription: Database migration conventions\n---\nMigrations are append-only.",
              ".cursor/rules/release.mdc": "---\n---\nRelease checklist.",
              ".cursor/rules/notes.md": "Plain markdown."}
PATTERNS = [".env*", "secrets/", "*.pem", "!.env.example"]
PLANS = [("Free", 0, 0.25, False), ("Plus", 8, 1, False), ("Premium", 30, 4, True),
         ("Super", 100, 15, True), ("Ultra", 200, 50, True)]
ITEMS = [("rules: style", 300, 9), ("@Button.tsx", 2400, 8), ("@src/components/", 40000, 3),
         ("@Branch diff", 6000, 7), ("terminal output", 1500, 6), ("old chat", 9000, 1)]


# ---------------------------------------------------------------- Step 1
def parse_mdc(path, text):
    """Project rules are .mdc files with optional frontmatter."""
    if not path.endswith(".mdc"):
        return None, "ignored: project rules must use .mdc"
    meta = {"description": "", "globs": [], "alwaysApply": False}
    body = text
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if m:
        for line in m.group(1).splitlines():
            if ":" not in line:
                continue
            key, value = (s.strip() for s in line.split(":", 1))
            if key == "globs":
                meta["globs"] = [g.strip() for g in value.split(",") if g.strip()]
            elif key == "alwaysApply":
                meta["alwaysApply"] = value.lower() == "true"
            elif key == "description":
                meta["description"] = value
        body = m.group(2)
    meta["body"] = body.strip()
    meta["name"] = path.rsplit("/", 1)[-1][:-4]
    return meta, "ok"


# ---------------------------------------------------------------- Step 2
def rule_status(rule, context_files, mentions):
    """Always, by file globs, by @-mention, or by the agent's judgement of the description."""
    if rule["alwaysApply"]:
        return "always"
    if rule["globs"] and any(fnmatch.fnmatch(f, g) for f in context_files for g in rule["globs"]):
        return "auto-attached"
    if rule["name"] in mentions:
        return "mentioned"
    if rule["description"]:
        return "agent decides"
    return "inactive"


# ---------------------------------------------------------------- Step 3
def ignored(path, patterns):
    """gitignore-style: the last matching pattern decides."""
    result = False
    for pattern in patterns:
        negate = pattern.startswith("!")
        p = pattern[1:] if negate else pattern
        if p.endswith("/"):
            hit = path.startswith(p) or ("/" + p) in ("/" + path)
        else:
            hit = fnmatch.fnmatch(path, p) or fnmatch.fnmatch(path.rsplit("/", 1)[-1], p)
        if hit:
            result = not negate
    return result


def exposure(path, patterns, channel):
    """Blocks Agent, Tab, and @; not the terminal or MCP tools."""
    if not ignored(path, patterns):
        return "visible"
    return "blocked" if channel in {"agent", "tab", "mention"} else "NOT blocked: " + channel


# ---------------------------------------------------------------- Step 4
def cheapest_plan(weekly_units, third_party_usd_month, base_units=100):
    """Cheapest plan whose pool fits and that allows the models you need."""
    options = []
    for name, price, multiplier, third_party in PLANS:
        if weekly_units > base_units * multiplier:
            continue
        if third_party_usd_month > 0 and not third_party:
            continue
        options.append((round(price + third_party_usd_month, 2), name))
    return min(options) if options else None


# ---------------------------------------------------------------- Step 5
def fit_context(items, limit):
    """Greedy by priority, then size: specific files before whole folders."""
    chosen, used, dropped = [], 0, []
    for name, tokens, priority in sorted(items, key=lambda i: (-i[2], i[1], i[0])):
        if used + tokens <= limit:
            chosen.append(name)
            used += tokens
        else:
            dropped.append(name)
    return chosen, used, dropped


if __name__ == "__main__":
    print(parse_mdc(".cursor/rules/testing.md", "Always run npm test"))
    print(exposure(".env.production", PATTERNS, "terminal"))
    print(cheapest_plan(350, 15))
    print(fit_context(ITEMS, 12000))

@@step
{
  "stepNumber": 1,
  "title": "Parse .mdc rule files",
  "instruction": "Implement parse_mdc(path, text). Return (None, 'ignored: project rules must use .mdc') unless the path ends with .mdc. Start from description '', globs [], alwaysApply False. If the text has frontmatter between a first '---' line and a closing '---' line, read 'key: value' lines: globs as a comma-separated list of stripped, non-empty patterns; alwaysApply True when the value is 'true' in any case; description as text; the body is the text after the frontmatter. Store the stripped body as 'body' and the file name without '.mdc' as 'name', and return (meta, 'ok'). Parse the rule files and two synthetic examples. This is rules from Section 2. [MOD-9.4]",
  "hintConceptual": "Each laminated card has a small header saying when to pin it up; read the header, and refuse cards printed on the wrong stock.",
  "hintSyntax": "if not path.endswith(\".mdc\"):\n    return None, \"ignored: project rules must use .mdc\"\nmeta = {\"description\": \"\", \"globs\": [], \"alwaysApply\": False}\nbody = text\nm = re.match(r\"^---\\n(.*?)\\n---\\n(.*)$\", text, re.S)\nif m:\n    for line in m.group(1).splitlines():\n        if \":\" not in line: continue\n        key, value = (s.strip() for s in line.split(\":\", 1))\n        if key == \"globs\": meta[\"globs\"] = [g.strip() for g in value.split(\",\") if g.strip()]\n        elif key == \"alwaysApply\": meta[\"alwaysApply\"] = value.lower() == \"true\"\n        elif key == \"description\": meta[\"description\"] = value\n    body = m.group(2)\nmeta[\"body\"] = body.strip()\nmeta[\"name\"] = path.rsplit(\"/\", 1)[-1][:-4]\nreturn meta, \"ok\""
}
@@assert
_r, _s = parse_mdc(".cursor/rules/react.mdc", RULE_FILES[".cursor/rules/react.mdc"])
assert _s == "ok" and _r["globs"] == ["src/components/*.tsx", "src/pages/*.tsx"] and _r["alwaysApply"] is False and _r["name"] == "react" and _r["body"] == "Use function components.", f"React rule, got {_r}"
assert parse_mdc(".cursor/rules/notes.md", "Plain markdown.") == (None, "ignored: project rules must use .mdc"), "Plain .md is ignored"
_st = parse_mdc(".cursor/rules/style.mdc", RULE_FILES[".cursor/rules/style.mdc"])[0]
assert _st["alwaysApply"] is True and _st["description"] == "House style", "Always-apply style rule"
assert parse_mdc("x/plain.mdc", "No frontmatter here") [0]["body"] == "No frontmatter here" and parse_mdc("a.mdc", "---\nalwaysApply: TRUE\n---\nx")[0]["alwaysApply"] is True, "No frontmatter; case-insensitive boolean"
print("Step 1 passed: four rules parsed, and notes.md ignored for its extension.")

@@step
{
  "stepNumber": 2,
  "title": "Decide which rules apply",
  "instruction": "Implement rule_status(rule, context_files, mentions): 'always' if alwaysApply; 'auto-attached' if any context file matches any of its globs with fnmatch; 'mentioned' if its name is in mentions; 'agent decides' if it has a description; otherwise 'inactive'. Check the four rules for a component edit and for an API edit that mentions the release rule. This is rules from Section 2. [MOD-9.4]",
  "hintConceptual": "Some cards are always on the wall, some go up when you pick up a particular kind of work, some when you ask for them, and some when the assistant thinks they might help.",
  "hintSyntax": "if rule[\"alwaysApply\"]:\n    return \"always\"\nif rule[\"globs\"] and any(fnmatch.fnmatch(f, g) for f in context_files for g in rule[\"globs\"]):\n    return \"auto-attached\"\nif rule[\"name\"] in mentions:\n    return \"mentioned\"\nif rule[\"description\"]:\n    return \"agent decides\"\nreturn \"inactive\""
}
@@assert
_rules = {"style": {"name": "style", "description": "House style", "globs": [], "alwaysApply": True},
          "react": {"name": "react", "description": "", "globs": ["src/components/*.tsx", "src/pages/*.tsx"], "alwaysApply": False},
          "db": {"name": "db", "description": "Database migration conventions", "globs": [], "alwaysApply": False},
          "release": {"name": "release", "description": "", "globs": [], "alwaysApply": False}}
assert {n: rule_status(r, ["src/components/Button.tsx", "README.md"], set()) for n, r in _rules.items()} == {"style": "always", "react": "auto-attached", "db": "agent decides", "release": "inactive"}, "A component edit"
assert {n: rule_status(r, ["api/orders.py"], {"release"}) for n, r in _rules.items()} == {"style": "always", "react": "inactive", "db": "agent decides", "release": "mentioned"}, "An API edit with @release"
assert rule_status(_rules["react"], ["src/pages/Home.tsx"], set()) == "auto-attached" and rule_status(_rules["react"], ["src/pages/home.css"], set()) == "inactive", "Globs decide"
print("Step 2 passed: Button.tsx attaches the React rule; @release brings in the checklist.")

@@step
{
  "stepNumber": 3,
  "title": "Check what .cursorignore protects",
  "instruction": "Implement ignored(path, patterns): go through the patterns in order; a leading '!' negates; a pattern ending in '/' matches paths starting with it or containing '/' plus it; any other pattern matches if fnmatch matches the full path or the file name; each match sets the result to not negated, so the last match wins. Then implement exposure(path, patterns, channel), using ignored from this step: 'visible' if not ignored; 'blocked' for an ignored path on the agent, tab, or mention channel; otherwise 'NOT blocked: <channel>'. Check seven paths and channels. This is ignore files from Section 2. [MOD-9.4]",
  "hintConceptual": "Read the 'do not touch' list top to bottom, letting later lines overrule earlier ones; then remember the list stops the assistant's hands, not the shell they can type into.",
  "hintSyntax": "result = False\nfor pattern in patterns:\n    negate = pattern.startswith(\"!\")\n    p = pattern[1:] if negate else pattern\n    if p.endswith(\"/\"):\n        hit = path.startswith(p) or (\"/\" + p) in (\"/\" + path)\n    else:\n        hit = fnmatch.fnmatch(path, p) or fnmatch.fnmatch(path.rsplit(\"/\", 1)[-1], p)\n    if hit:\n        result = not negate\nreturn result\n\n# exposure\nif not ignored(path, patterns):\n    return \"visible\"\nreturn \"blocked\" if channel in {\"agent\", \"tab\", \"mention\"} else \"NOT blocked: \" + channel"
}
@@assert
assert exposure(".env", PATTERNS, "agent") == "blocked" and exposure(".env.example", PATTERNS, "agent") == "visible", f"Negation re-includes the example, got {exposure('.env.example', PATTERNS, 'agent')}"
assert exposure("secrets/prod.json", PATTERNS, "mention") == "blocked" and exposure("certs/server.pem", PATTERNS, "tab") == "blocked", "Directories and extensions"
assert exposure(".env", PATTERNS, "terminal") == "NOT blocked: terminal" and exposure(".env.local", PATTERNS, "mcp") == "NOT blocked: mcp", "The terminal and MCP are not blocked"
assert exposure("src/app.ts", PATTERNS, "agent") == "visible" and ignored(".env.example", ["!.env.example", ".env*"]) is True, "Order matters: the last match wins"
print("Step 3 passed: .env is blocked for the agent but one terminal command away.")

@@step
{
  "stepNumber": 4,
  "title": "Choose a plan",
  "instruction": "Implement cheapest_plan(weekly_units, third_party_usd_month, base_units). Consider each plan (name, price, pool multiplier, third-party allowed); skip it if the weekly units exceed base_units times its multiplier, or if there is third-party spend and it does not allow third-party models. Return the minimum of (price plus spend rounded to 2 places, name) among the rest, or None. Price seven usage profiles. This is models, plans, and cost from Section 2. [MOD-9.4]",
  "hintConceptual": "Cross off the plans that are too small or do not offer the models you need, then pick the cheapest that is left, remembering third-party models are paid on top.",
  "hintSyntax": "options = []\nfor name, price, multiplier, third_party in PLANS:\n    if weekly_units > base_units * multiplier:\n        continue\n    if third_party_usd_month > 0 and not third_party:\n        continue\n    options.append((round(price + third_party_usd_month, 2), name))\nreturn min(options) if options else None"
}
@@assert
assert cheapest_plan(80, 0) == (8, "Plus") and cheapest_plan(20, 0) == (0, "Free"), f"Light use, got {cheapest_plan(80, 0)}"
assert cheapest_plan(80, 12) == (42, "Premium"), "Third-party models need Premium"
assert cheapest_plan(350, 0) == (30, "Premium") and cheapest_plan(350, 15) == (45, "Premium"), "The third recall question"
assert cheapest_plan(1200, 40) == (140, "Super") and cheapest_plan(6000, 0) is None, "Heavy use; beyond every pool"
print("Step 4 passed: 350 units plus a little Claude use is Premium at 45 a month.")

@@step
{
  "stepNumber": 5,
  "title": "Fit context into a budget",
  "instruction": "Implement fit_context(items, limit). Sort the (name, tokens, priority) items by priority from highest, then tokens from smallest, then name. Add each while the running total plus its tokens stays within the limit; otherwise put it in dropped. Return the chosen names, the tokens used, and the dropped names. Fit the six items into 12,000 and 60,000 tokens. This is context and budgets from Section 2. [MOD-9.4]",
  "hintConceptual": "Pack the briefcase with the most important papers first, preferring slim ones, and leave behind whatever no longer fits.",
  "hintSyntax": "chosen, used, dropped = [], 0, []\nfor name, tokens, priority in sorted(items, key=lambda i: (-i[2], i[1], i[0])):\n    if used + tokens <= limit:\n        chosen.append(name)\n        used += tokens\n    else:\n        dropped.append(name)\nreturn chosen, used, dropped"
}
@@assert
assert fit_context(ITEMS, 12000) == (["rules: style", "@Button.tsx", "@Branch diff", "terminal output"], 10200, ["@src/components/", "old chat"]), f"A 12K budget, got {fit_context(ITEMS, 12000)}"
assert fit_context(ITEMS, 60000)[1] == 59200 and fit_context(ITEMS, 60000)[2] == [], "Everything fits in 60K"
assert fit_context([], 100) == ([], 0, []) and fit_context([("a", 50, 1), ("b", 60, 1)], 100) == (["a"], 50, ["b"]), "Empty; ties by size"
print("Step 5 passed: the one file you need fits; the whole folder does not.")
