@@meta
{
  "moduleId": "MOD-3.5",
  "slug": "mod-3-5",
  "unitId": "UNIT-3",
  "unitTitle": "Unit 3: Mastering Claude & Gemini",
  "title": "Claude Skills",
  "difficulty": "Intermediate",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "Agent Skills overview", "source": "Anthropic Docs", "url": "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview" },
    { "title": "Skill authoring best practices", "source": "Anthropic Docs", "url": "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices" },
    { "title": "Equipping agents for the real world with Agent Skills", "source": "Anthropic Engineering", "url": "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills" },
    { "title": "Use Skills in Claude Code", "source": "Claude Code Docs", "url": "https://code.claude.com/docs/en/skills" },
    { "title": "Agent Skills specification", "source": "agentskills.io", "url": "https://agentskills.io/specification" }
  ],
  "videoLibrary": [
    {
      "id": "VID-3.5-1",
      "title": "Claude Agent Skills Explained",
      "creator": "Anthropic",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=fOxC44g8vig",
      "timingInstruction": "Watch after reading Section 1 as the short official explainer",
      "keyTakeaway": "Anthropic's own summary of what a skill is and how it differs from a prompt, a project, and a tool connection."
    },
    {
      "id": "VID-3.5-2",
      "title": "Don't Build Agents, Build Skills Instead – Barry Zhang & Mahesh Murag, Anthropic",
      "creator": "AI Engineer",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=CEvIs9y1uog",
      "timingInstruction": "Watch after reading Section 2 (progressive disclosure)",
      "keyTakeaway": "The people who designed skills explain the reasoning: one general agent plus a library of packaged procedures scales better than many specialised agents."
    },
    {
      "id": "VID-3.5-3",
      "title": "Claude Skills clearly explained in under 10 minutes",
      "creator": "DigitalOcean",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=DB_t1v4xOfQ",
      "timingInstruction": "Watch before the lab for a walkthrough of a skill folder",
      "keyTakeaway": "A beginner walkthrough of the folder, the SKILL.md file, and how a skill gets triggered, matching the anatomy described in this chapter."
    },
    {
      "id": "VID-3.5-4",
      "title": "Introduction to agent skills",
      "creator": "Anthropic",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/introduction-to-agent-skills",
      "timingInstruction": "Take after completing the lab",
      "keyTakeaway": "Anthropic's short course on creating, testing, and sharing skills, which turns this chapter's validator and trigger tests into a practised authoring routine."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Validate, Trigger, and Budget a Skill",
    "context": "An operations team wants to package its recurring procedures as skills and needs to know that each one is well formed, fires on the right requests, and does not bloat every conversation. You will build a frontmatter parser and validator, a description-based trigger matcher with an accuracy test, and a calculator for the context cost of a skill library.",
    "language": "python"
  }
}

@@reading
# Claude Skills

You have a procedure that you explain to an assistant again and again: how your company formats its quarterly report, how to check an invoice against a purchase order, how to turn a meeting transcript into minutes. Each time, you paste the same instructions, attach the same template, and hope you have not forgotten a step.

A **skill** is that procedure, packaged once. It is a folder containing written instructions and, optionally, reference documents, templates, and small programs. The assistant keeps a one-line description of every skill it has, and opens the full instructions only when a request calls for them.

This chapter explains what is inside a skill, how the assistant decides to use one, why the design keeps the context window clear, and how to write and test your own. Skills were announced by Anthropic in October 2025 and published as an open standard two months later. Facts here are from the documentation in November 2026. The central idea, loading instructions on demand instead of all at once, is the durable part.

## 1. First-Principles Mental Model & Intuition

### The binder on the shelf

A new employee does not memorise every company procedure on the first day. The procedures sit in binders on a shelf, and each binder has a label on its spine: "Expense claims: use when an employee submits receipts." When a task arrives, the employee scans the spines, takes down the one binder that fits, and follows it. Inside the binder there may be an appendix to consult only for unusual cases, and a ready-made calculator to use without needing to understand how it works.

Skills copy this arrangement.

```text
   THE SHELF (always visible)             ONE BINDER (opened only when needed)

   +-------------------------------+      +-------------------------------------+
   | brand-report                  |      |  invoice-check/                     |
   |  "Formats quarterly reports"  |      |    SKILL.md        the instructions |
   +-------------------------------+      |    references/                      |
   | invoice-check                 | ---> |      approval-rules.md   appendix   |
   |  "Checks supplier invoices"   |      |    scripts/                         |
   +-------------------------------+      |      reconcile.py    ready-made tool|
   | meeting-notes                 |      |    assets/                          |
   |  "Minutes from a transcript"  |      |      report-template.xlsx           |
   +-------------------------------+      +-------------------------------------+

   cost: one line per skill                cost: paid only for the binder in use
```

Three things about the shelf carry over directly.

**The label does the work of selection.** The assistant chooses a skill by reading descriptions. A binder with a vague spine never gets taken down, however good its contents.

**Opening a binder is cheap because the others stay shut.** Twenty binders on the shelf cost twenty labels. They do not cost twenty binders' worth of reading.

**Some contents are used without being read.** The employee runs the calculator and reads only its answer. A skill's script is executed in the same way, and only its output comes back.

### What problem this solves

You already know two places to keep standing instructions: profile preferences and project instructions. Both are loaded in full into every conversation they cover. That is right for things that are always relevant, and wasteful for procedures that are relevant occasionally. Ten detailed procedures written into a project's instructions would cost their full length on every message, whether or not the message has anything to do with them. They would also compete for the model's attention with whatever you are actually asking.

Skills solve the "occasionally relevant" case. They also travel. A project's instructions live in that project. A skill is a folder, so it can be copied, shared with a colleague, put under version control, and used across the chat app, Claude Code, and applications built on the API.

| | Always in context? | Scope | Best for |
|---|---|---|---|
| Profile preferences | Yes | All your chats | Who you are, how you like answers |
| Project instructions and knowledge | Yes, within the project | One body of work | Facts and rules for that work |
| Skill | Only its description, until triggered | Wherever it is installed | A repeatable procedure, with its templates and tools |
| Connector (Module 3.6) | Tool descriptions | Wherever it is connected | Reaching an outside system |

A useful short form: a project tells the assistant **what is true here**, a skill tells it **how to do a kind of task**, and a connector gives it **access to something outside**.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Anatomy of a skill

A skill is a folder. The only required file is `SKILL.md`, which has two parts: a short header called **frontmatter**, between two lines of three hyphens, and then the instructions in ordinary Markdown.

```text
---
name: invoice-check
description: Checks supplier invoices against purchase orders. Use when the user asks to check, verify, or reconcile an invoice.
---

# Invoice check

1. Find the purchase order number on the invoice.
2. Compare each line: item, quantity, unit price.
3. Flag any difference above 2 percent. See references/approval-rules.md
   for who must approve an exception.
4. To total a long invoice, run scripts/reconcile.py and report its output.
5. Reply with a table: line, ordered, invoiced, difference, verdict.
```

The frontmatter has two required fields, and the documentation is strict about both.

| Field | Rules at the time of writing |
|---|---|
| `name` | At most 64 characters. Lowercase letters, numbers, and hyphens only. Must not contain the reserved words "anthropic" or "claude". The open specification adds that it must match the folder's name and must not start or end with a hyphen or contain two hyphens in a row |
| `description` | Not empty. At most 1,024 characters. No angle brackets. Should say what the skill does and when to use it |

Beside `SKILL.md`, the folder may hold supporting material. The open specification suggests three sub-folders: `references` for documents to consult, `scripts` for programs to run, and `assets` for templates and other files to use in the output.

### Progressive disclosure

The design principle is called **progressive disclosure**: reveal information in stages, each stage only when needed. A skill has three levels.

| Level | What | When it enters the context | Approximate cost |
|---|---|---|---|
| 1 | The name and description | Always, at the start of every session | About 100 tokens per skill |
| 2 | The body of `SKILL.md` | When the assistant decides the skill is relevant | Recommended under 5,000 tokens and 500 lines |
| 3 | Reference files, scripts, assets | Only when the instructions point to them and the task needs them | Nothing until read. A script's code never enters the context, only its output |

```text
session starts
    |
    v
[ level 1 ]  all descriptions loaded            (always)
    |
    |  a request arrives; the model compares it with the descriptions
    v
[ level 2 ]  matching SKILL.md body is read     (only if one matches)
    |
    |  the instructions mention a reference file or a script
    v
[ level 3 ]  that file is read, or the script   (only if the task needs it)
             is run and its output returned
```

Level 3 is what makes a skill effectively unlimited in size. A skill can bundle a hundred pages of reference material, and the cost of having it installed is still about a hundred tokens until the day a task needs page sixty.

### The arithmetic of loading on demand

Suppose you have $N$ skills, each with a body of $B$ tokens and a description costing $m$ tokens, and a given task triggers $k$ of them. If every procedure were written into always-loaded instructions, each request would carry

$$
T_{\text{all}} = N \cdot (m + B)
$$

With progressive disclosure, each request carries all the descriptions and only the triggered bodies:

$$
T_{\text{prog}} = N \cdot m + k \cdot B
$$

For $N = 50$, $B = 3{,}000$, $m = 100$, and $k = 1$:

$$
T_{\text{all}} = 50 \times 3{,}100 = 155{,}000 \qquad T_{\text{prog}} = 5{,}000 + 3{,}000 = 8{,}000
$$

That is about 19 times less. The saving is $(N - k) \cdot B$, the bodies that stayed shut.

The formula also shows the remaining cost. The term $N \cdot m$ is paid on every request, whether or not any skill is used. Fifty skills cost 5,000 tokens of descriptions in every conversation. Five hundred would cost 50,000. Descriptions are cheap one at a time and add up across a large library, so install what you use.

The 100 and 5,000 figures are Anthropic's guidance for authors, not measurements of any particular skill.

### How a skill is triggered

No separate program decides which skill to use. The descriptions are placed in the model's context, and the model itself judges, as part of understanding your request, whether one of them applies. If so, it reads that skill's `SKILL.md` and follows it.

This is why the description is the most important sentence in a skill. A simple way to reason about triggering is as a matching problem between the words of a request and the words of each description. With $R$ the set of meaningful words in the request and $D_i$ the set in the description of skill $i$:

$$
\text{score}_i = |R \cap D_i| \qquad \text{trigger skill } i^{*} = \arg\max_i \text{score}_i \ \text{ if } \ \text{score}_{i^{*}} \ge \theta
$$

The real model matches on meaning, not on exact words, so it is far more forgiving than this formula. The formula still predicts the two ways descriptions fail.

- **Under-triggering.** The description lacks the words and situations in which people ask for the task. "Helps with documents" shares almost nothing with "reconcile this invoice", so the skill is never used.
- **Over-triggering.** The description is so broad that it overlaps with everything. The skill fires on requests it was not meant for and pushes aside better-suited ones.

A good description therefore has two halves: **what the skill does**, and **when to use it**, in the vocabulary a user would use. The documentation recommends writing it in the third person ("Checks supplier invoices against purchase orders") and including the key terms that should trigger it.

### Measuring a description

Because triggering is a judgement, it should be tested like any other behaviour. Write a set of example requests, some that should trigger the skill and some that should not, and record what happens. With $c$ correct outcomes out of $n$ cases:

$$
\text{accuracy} = \frac{c}{n}
$$

Anthropic's authoring guidance is to build a few such evaluations before writing long instructions, and to compare results with and without the skill. A skill that does not change the outcome is not earning its place on the shelf.

### Where skills run

The same folder format is used in several places, with different ways of installing it. According to the documentation at the time of writing:

| Surface | How skills get there | Notes |
|---|---|---|
| Claude apps | Upload the folder as a zip file in settings | Custom skills need a paid plan with code execution switched on. Skills for creating office documents are built in |
| Claude Code | Put the folder in a personal or project skills directory, or install a plugin | A project's skills can be shared through version control |
| Claude API | Upload and reference the skill in a request, with the code execution tool | The sandbox has no network access |

Custom skills do not synchronise between these surfaces. A skill uploaded to the app is not automatically present in Claude Code.

In December 2025 the format was published as an open standard, so that other assistants and tools can read the same folders. A skill written to the specification is not tied to one vendor.

### Skills and scripts

A script inside a skill changes what kind of work the assistant can do reliably. Models are weak at exact arithmetic over long lists, strict format conversion, and anything that must be done identically every time. A twenty-line program is perfect at those things. When a skill says "run `scripts/reconcile.py`", the assistant executes the program in its code environment and reads the result. The work is done by deterministic code, and the model's job is reduced to deciding when to run it and explaining the answer.

There is also a risk here. A skill's instructions direct the assistant, and its scripts run with whatever access the environment has. Installing a skill is closer to installing software than to saving a prompt. Anthropic's guidance is to use skills only from sources you trust, and to read everything in the folder first, paying particular attention to any skill that fetches content from the internet.

### Complexity

Selecting a skill costs the model a read of $N$ descriptions, $O(N \cdot m)$ tokens, on every request. Using one costs $O(B)$ more, and each level-3 file its own length. Validation of a skill's header is linear in the header's size.

## 3. Production-Grade Implementation & Annotated Walkthrough

The rules for a skill's header are precise enough to check by program, which is worth doing before you upload anything. First, reading and validating the frontmatter.

```python
import re

NAME_PATTERN = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
RESERVED = ("anthropic", "claude")

def parse_frontmatter(text):
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return {}, text
    end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
    if end is None:
        return {}, text
    meta = {}
    for line in lines[1:end]:
        if ":" in line:
            key, value = line.split(":", 1)
            meta[key.strip()] = value.strip()
    return meta, "\n".join(lines[end + 1:]).strip()

def validate_skill(meta, folder):
    problems = []
    name, description = meta.get("name", ""), meta.get("description", "")
    if not name:
        problems.append("name-missing")
    else:
        if len(name) > 64:
            problems.append("name-too-long")
        if not NAME_PATTERN.match(name):
            problems.append("name-format")
        if any(word in name.lower() for word in RESERVED):
            problems.append("name-reserved")
        if name != folder:
            problems.append("name-folder-mismatch")
    if not description:
        problems.append("description-missing")
    else:
        if len(description) > 1024:
            problems.append("description-too-long")
        if "<" in description or ">" in description:
            problems.append("description-angle-brackets")
    return problems

GOOD = """---
name: invoice-check
description: Checks supplier invoices against purchase orders. Use when the user asks to check, verify, or reconcile an invoice.
---

# Invoice check
1. Find the purchase order number on the invoice.
"""
meta, body = parse_frontmatter(GOOD)
print(meta["name"], "->", validate_skill(meta, "invoice-check"))

bad_meta, _ = parse_frontmatter("---\nname: Claude_PDF Helper\ndescription: <b>Helps</b> with files\n---\nBody")
print(validate_skill(bad_meta, "pdf-helper"))
print(parse_frontmatter("# Invoice check\nname: invoice-check"))
```

- **The file must begin with the three hyphens.** If the first line is anything else, the function returns an empty header and treats the whole file as body. The last line of the example shows this. A real loader does much the same, and the documentation warns that a header which cannot be read can leave a skill loaded with no name or description, without an error. An empty result from this function is the signal to look.
- **Each header line is split on the first colon only.** A description often contains colons of its own. Splitting once keeps everything after the first colon as the value. Real frontmatter is written in a format called YAML, which has more features than this, such as quoted and multi-line values. A simple parser is enough for the two required fields.
- **`NAME_PATTERN` encodes the naming rule in one expression.** One or more lowercase letters or digits, then any number of groups of a single hyphen followed by more letters or digits. That allows `invoice-check` and rejects capitals, spaces, underscores, a leading or trailing hyphen, and doubled hyphens.
- **Every rule is checked, and all failures are reported.** The function does not stop at the first problem. An author fixing a skill wants the whole list at once.
- **The bad example fails four ways.** Its name has capitals, an underscore, and a space. It contains a reserved word. It does not match the folder. Its description contains angle brackets. Even if all that were fixed, "Helps with files" would be a poor description, which is the subject of the next block.

Next, triggering, modelled as word overlap, and a test of how well descriptions work.

```python
STOPWORDS = {"a", "an", "and", "are", "as", "asks", "at", "be", "can", "for", "from", "i", "in", "into",
             "is", "it", "me", "my", "of", "on", "or", "please", "that", "the", "this", "to", "use",
             "user", "when", "with", "you"}

def keywords(text):
    words = {word.strip(".,;:!?()\"'").lower() for word in text.split()}
    return words - STOPWORDS - {""}

def match_skill(request, skills, threshold=2):
    wanted = keywords(request)
    best_name, best_score = None, 0
    for name, description in skills.items():
        score = len(wanted & keywords(description))
        if score > best_score:
            best_name, best_score = name, score
    return best_name if best_score >= threshold else None

def trigger_accuracy(cases, skills, threshold=2):
    correct = sum(1 for request, expected in cases if match_skill(request, skills, threshold) == expected)
    return correct / len(cases)

SKILLS = {
    "brand-report": "Formats quarterly reports in the Acme brand style. Use when the user asks for a report, quarterly summary, or branded document.",
    "invoice-check": "Checks supplier invoices against purchase orders. Use when the user asks to check, verify, or reconcile an invoice.",
    "meeting-notes": "Turns a meeting transcript into minutes with decisions and action items. Use when the user shares a transcript or asks for minutes.",
}
CASES = [
    ("Please check this invoice against the purchase order", "invoice-check"),
    ("Write the quarterly report for the board", "brand-report"),
    ("Here is the transcript, can you write minutes?", "meeting-notes"),
    ("What is the capital of France?", None),
    ("Summarise this meeting", "meeting-notes"),
]
for request, expected in CASES:
    print(f"{request:<55} -> {match_skill(request, SKILLS)}")
print("accuracy:", trigger_accuracy(CASES, SKILLS))

improved = dict(SKILLS)
improved["meeting-notes"] = ("Turns a meeting transcript into minutes with decisions and action items. "
                             "Use when the user shares a transcript, asks for minutes, or wants to summarise a meeting.")
print("accuracy after rewriting one description:", trigger_accuracy(CASES, improved))
print(match_skill("Help me with these documents", {"doc-helper": "Helps with documents."}))
```

- **Words that appear in every description are stop words.** "Use", "when", "user", and "asks" are part of the standard phrasing. If they counted, every request containing "use" would look relevant to every skill.
- **`match_skill` keeps the best score and applies a threshold.** A single shared word is weak evidence. Requiring two prevents a skill from firing because of one coincidental term. The strict `>` in the comparison means that when two skills tie, the one listed first wins, which makes the result repeatable.
- **Four of the five cases succeed.** The question about France shares nothing with any description and correctly triggers nothing. "Summarise this meeting" should reach the meeting-notes skill and does not, because the description speaks of transcripts and minutes and never uses the word a person actually typed. Accuracy is 0.8.
- **One sentence fixes it.** Adding the phrase about summarising a meeting to the description raises accuracy to 1.0. Nothing in the skill's instructions changed. This is the general pattern of skill debugging: when a skill does not fire, the fault is usually in the description.
- **The vague description never triggers.** "Helps with documents" shares one word with a request about documents, below the threshold. A real model is more generous than word overlap, but the direction of the effect is the same, and Anthropic's guidance names this kind of description as the one to avoid.

Finally, the context budget.

```python
def context_cost(n_skills, body_tokens, triggered, metadata_tokens=100):
    load_all = n_skills * (metadata_tokens + body_tokens)
    progressive = n_skills * metadata_tokens + triggered * body_tokens
    return load_all, progressive

for n in (5, 50, 500):
    load_all, progressive = context_cost(n, 3_000, 1)
    print(f"{n:>4} skills: all at once {load_all:>9,}   on demand {progressive:>7,}   ratio {load_all / progressive:5.1f}")
```

- **Both formulas from Section 2 are computed side by side.** With five skills the ratio is modest. With fifty it is about 19. With five hundred it is about 29, and by then the descriptions alone cost 50,000 tokens on every request.
- **`metadata_tokens` is a parameter with a default.** One hundred is the documented rule of thumb. A library of long descriptions would cost more, and the function lets you see the effect.

**Complexity.** Parsing and validating are linear in the header. Matching is linear in the number of skills times the description length. The cost function is constant time.

### Writing a skill that works

A procedure for authoring, in the order that saves the most effort:

1. **Do the task by hand with the assistant first.** Notice what you had to explain and which files you attached. That is the content of the skill.
2. **Write three test requests** that should trigger it and two that should not. Note what a good result looks like for each.
3. **Write the description**: what it does, then "Use when" followed by the situations and words a user would use.
4. **Write the instructions as numbered steps**, addressed to a capable colleague who does not know your organisation. State the output format exactly.
5. **Move bulk out of `SKILL.md`.** Long reference material goes into a separate file, mentioned by name at the step where it is needed. Keep references one level deep: the main file points to a reference file, and that file does not point onward to another.
6. **Turn anything mechanical into a script.** Totals, format checks, and conversions are done better by code.
7. **Run the tests.** Fix the description if it does not trigger. Fix the instructions if it triggers and does the wrong thing.

Anthropic also provides a skill whose purpose is to help write and test other skills, which automates much of this loop.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

Skills are recent, and most of the available guidance comes from Anthropic's own documentation and early adopters' write-ups. The following are the failure modes those sources describe most often.

**"My skill never runs."** Nine times in ten the description is the cause. It says what the skill is and not when to use it, or it is written in the author's vocabulary and not the user's. Rewrite it with "Use when" and the phrases people actually type. As a quick check, ask the assistant which skills it has and when it would use each.

**A header that silently fails.** A missing opening line of three hyphens, a tab where a space should be, or an unclosed quotation mark can make the header unreadable. The documentation notes that in this case a skill can load with no fields set and no error shown. If a skill behaves as if it were not there, check the first lines of the file.

**Too much in `SKILL.md`.** Once a skill triggers, its whole body is in the context for the rest of the task, competing with the conversation. Authors who paste an entire manual into the main file get a skill that is slow and that distracts the model. Keep the main file to the procedure, and put reference material in separate files.

**References that point to references.** When the main file points to a document that points to another, the assistant may read only part of the chain. Keep everything one step from `SKILL.md`.

**Too many skills.** Each installed skill costs its description on every request and adds one more candidate to choose between. Large libraries of overlapping skills cause the wrong one to be selected. Remove skills you do not use, and merge those that overlap.

**Assuming it is installed everywhere.** A skill uploaded in the app is not in Claude Code, and the reverse. Teams are regularly confused when a skill "works for me" and not for a colleague. Decide where the master copy lives, ideally under version control.

**Treating a downloaded skill as harmless.** A skill can contain scripts and can instruct the assistant to fetch things from the internet. Read every file before installing a skill written by someone else, as you would before running an unfamiliar program.

**Paths written for one operating system.** Authors working on Windows write paths with backslashes, which fail elsewhere. Use forward slashes inside skills.

**Testing on one model only.** The documentation advises testing a skill with each model you intend to use it with. Instructions that a larger model follows from a hint may need to be spelled out for a smaller one.

**Using a skill where a project would do.** If the information is a fact about one client or one body of work, and is relevant to every conversation there, it belongs in a project. A skill is for a procedure you will repeat across contexts. Mixing the two leads to skills that carry one client's details into another's work.

**No baseline.** People install a skill and assume it helps. Run the same request with and without it. If the results are the same, the skill is adding cost and nothing else.

**Scripts that assume the internet.** In the API's code environment there is no network access and no way to install extra packages at run time. A script that works on your laptop by downloading something will fail there. Keep scripts self-contained.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A skill is a folder that packages a repeatable procedure: a `SKILL.md` file with a short header and written instructions, plus optional reference documents, scripts, and templates. It is loaded in three stages. The name and description are always present, at about a hundred tokens per skill. The instructions are read only when the model judges the skill relevant. Supporting files are read, or scripts run, only when the task needs them. The cost per request therefore falls from $N(m + B)$ to $N \cdot m + k \cdot B$. The description decides whether a skill is ever used, so it must say what the skill does and when to use it, in the user's words, and it should be tested against example requests. Skills complement projects, which hold what is always true for a body of work, and connectors, which reach outside systems. Because skills can contain code, they should be installed only from trusted sources.

**Question 1.** A team has 120 skills, each with a 2,500-token body and a 100-token description. A typical request triggers two of them. Compute the tokens carried per request if everything were loaded, and with progressive disclosure. Then state what the team still pays on a request that triggers no skill at all, and what that implies.

<details>
<summary>View Answer</summary>

Loading everything costs 120 times 2,600, which is 312,000 tokens per request. With progressive disclosure, the descriptions cost 120 times 100, which is 12,000, and the two triggered bodies cost 5,000, for a total of 17,000. That is about 18 times less, and the saving is the 118 bodies that stayed unopened, 295,000 tokens. On a request that triggers nothing, the team still pays the 12,000 tokens of descriptions, because those are loaded at the start of every session. That fixed cost is the price of having the library installed. It implies that skills are not free to accumulate: each one adds about a hundred tokens to every conversation and one more option for the model to consider. A library should be pruned of skills that are unused or that overlap, both to save tokens and to keep selection accurate.

</details>

**Question 2.** A colleague sends you a skill in a folder named `pdf-helper`. Its header gives the name as "Claude_PDF Helper" and the description as "Helps with files", written with bold tags around the first word. List every rule the header breaks, and then explain why the skill would be unlikely to work well even after those are fixed.

<details>
<summary>View Answer</summary>

The name breaks three rules. It is not in the required format, which allows only lowercase letters, numbers, and single hyphens: it has capital letters, an underscore, and a space. It contains the reserved word "claude". And it does not match the name of the folder, which the open specification requires. The description breaks one rule: it contains angle brackets, which are not permitted. A corrected header would use the name `pdf-helper` and a description with no markup. Even then, "Helps with files" is a poor description. It does not say what the skill does, since "helps" could mean anything, and it does not say when to use it. It shares almost no words with the requests people would make, such as "extract the tables from this PDF" or "merge these two PDFs", so the model has little reason to select it. It is also so general that when it does match, it may match the wrong requests. A working description would be something like: "Extracts text and tables from PDF files, and merges or splits them. Use when the user uploads a PDF or asks to extract, merge, split, or convert a PDF." Before installing a colleague's skill you should also read its instructions and any scripts, because a skill can run code.

</details>

**Question 3.** A consultant wants the assistant to (a) always know that a particular client uses British spelling and a formal tone, (b) follow the same seven-step method whenever asked to produce a competitor analysis for any client, and (c) read the client's files from a shared drive. Assign each need to a project, a skill, or a connector, and justify the assignment using the idea of what is loaded and when.

<details>
<summary>View Answer</summary>

Need (a) belongs in a project for that client. It is a fact about one body of work, and it is relevant to every conversation in that work, so it should be loaded every time. Project instructions are always in context within the project, which is exactly the required behaviour, and they do not leak into other clients' work. Need (b) belongs in a skill. It is a procedure, it is the same for every client, and it is needed only when a competitor analysis is requested. As a skill, it costs about a hundred tokens of description until it is triggered, its full steps and any report template load only when used, and it can be used inside any client's project. Writing the seven steps into each project's instructions would load them on every message and would mean maintaining several copies. Need (c) is a connector, the subject of the next module. It is not an instruction at all. It is access to an outside system, which the assistant needs a tool to reach. The three work together: in the client's project, with its tone rules loaded, the consultant asks for a competitor analysis, the skill supplies the method, and the connector supplies the files.

</details>

@@starter
"""
Lab: Validate, Trigger, and Budget a Skill
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import re

NAME_PATTERN = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
RESERVED = ("anthropic", "claude")

STOPWORDS = {"a", "an", "and", "are", "as", "asks", "at", "be", "can", "for", "from", "i", "in", "into",
             "is", "it", "me", "my", "of", "on", "or", "please", "that", "the", "this", "to", "use",
             "user", "when", "with", "you"}

GOOD = """---
name: invoice-check
description: Checks supplier invoices against purchase orders. Use when the user asks to check, verify, or reconcile an invoice.
---

# Invoice check
1. Find the purchase order number on the invoice.
"""

SKILLS = {
    "brand-report": "Formats quarterly reports in the Acme brand style. Use when the user asks for a report, quarterly summary, or branded document.",
    "invoice-check": "Checks supplier invoices against purchase orders. Use when the user asks to check, verify, or reconcile an invoice.",
    "meeting-notes": "Turns a meeting transcript into minutes with decisions and action items. Use when the user shares a transcript or asks for minutes.",
}

CASES = [
    ("Please check this invoice against the purchase order", "invoice-check"),
    ("Write the quarterly report for the board", "brand-report"),
    ("Here is the transcript, can you write minutes?", "meeting-notes"),
    ("What is the capital of France?", None),
    ("Summarise this meeting", "meeting-notes"),
]


def keywords(text):
    """Provided helper: the set of meaningful lowercase words in a text."""
    words = {word.strip(".,;:!?()\"'").lower() for word in text.split()}
    return words - STOPWORDS - {""}


# ---------------------------------------------------------------- Step 1
def parse_frontmatter(text):
    """Return (meta, body) for the text of a SKILL.md file.
    The header sits between a first line that is exactly --- and the next line that is ---.
    Each header line "key: value" becomes meta[key] = value (split on the FIRST colon,
    strip spaces from both parts; ignore lines without a colon).
    body is everything after the closing ---, joined with "\\n" and stripped.
    If the first line is not ---, or there is no closing ---, return ({}, text)."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def validate_skill(meta, folder):
    """Return a list of problem codes, in this order, for a parsed header:
      name missing or empty                                   -> "name-missing"   (then skip the other name checks)
      name longer than 64 characters                          -> "name-too-long"
      name does not match NAME_PATTERN                        -> "name-format"
      name, lowercased, contains a word in RESERVED           -> "name-reserved"
      name is not equal to folder                             -> "name-folder-mismatch"
      description missing or empty                            -> "description-missing"  (then skip the other description checks)
      description longer than 1024 characters                 -> "description-too-long"
      description contains "<" or ">"                         -> "description-angle-brackets"
    A valid header gives an empty list."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def match_skill(request, skills, threshold=2):
    """skills maps a skill name to its description.
    Score each skill by how many keywords() its description shares with the request.
    Return the name with the highest score (the first one, if several tie),
    but only if that score is at least threshold. Otherwise return None."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def trigger_accuracy(cases, skills, threshold=2):
    """cases is a list of (request, expected) pairs; expected is a skill name or None.
    Return the fraction of cases for which match_skill gives the expected result."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def context_cost(n_skills, body_tokens, triggered, metadata_tokens=100):
    """Return (load_all, progressive):
         load_all    = n_skills * (metadata_tokens + body_tokens)
         progressive = n_skills * metadata_tokens + triggered * body_tokens"""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("parsed   :", parse_frontmatter(GOOD))
    print("problems :", validate_skill({"name": "invoice-check", "description": "Checks invoices."}, "invoice-check"))
    print("matched  :", match_skill("Please check this invoice against the purchase order", SKILLS))
    print("accuracy :", trigger_accuracy(CASES, SKILLS))
    print("cost     :", context_cost(50, 3_000, 1))

@@solution
"""
Lab solution: Validate, Trigger, and Budget a Skill
Standard library only.
"""
import re

NAME_PATTERN = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
RESERVED = ("anthropic", "claude")

STOPWORDS = {"a", "an", "and", "are", "as", "asks", "at", "be", "can", "for", "from", "i", "in", "into",
             "is", "it", "me", "my", "of", "on", "or", "please", "that", "the", "this", "to", "use",
             "user", "when", "with", "you"}

GOOD = """---
name: invoice-check
description: Checks supplier invoices against purchase orders. Use when the user asks to check, verify, or reconcile an invoice.
---

# Invoice check
1. Find the purchase order number on the invoice.
"""

SKILLS = {
    "brand-report": "Formats quarterly reports in the Acme brand style. Use when the user asks for a report, quarterly summary, or branded document.",
    "invoice-check": "Checks supplier invoices against purchase orders. Use when the user asks to check, verify, or reconcile an invoice.",
    "meeting-notes": "Turns a meeting transcript into minutes with decisions and action items. Use when the user shares a transcript or asks for minutes.",
}

CASES = [
    ("Please check this invoice against the purchase order", "invoice-check"),
    ("Write the quarterly report for the board", "brand-report"),
    ("Here is the transcript, can you write minutes?", "meeting-notes"),
    ("What is the capital of France?", None),
    ("Summarise this meeting", "meeting-notes"),
]


def keywords(text):
    """Provided helper: the set of meaningful lowercase words in a text."""
    words = {word.strip(".,;:!?()\"'").lower() for word in text.split()}
    return words - STOPWORDS - {""}


# ---------------------------------------------------------------- Step 1
def parse_frontmatter(text):
    """A header that cannot be found gives an empty dict: the signal that the skill
    would load with no name and no description. Split on the first colon only,
    because descriptions often contain colons."""
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return {}, text
    end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
    if end is None:
        return {}, text
    meta = {}
    for line in lines[1:end]:
        if ":" in line:
            key, value = line.split(":", 1)
            meta[key.strip()] = value.strip()
    return meta, "\n".join(lines[end + 1:]).strip()


# ---------------------------------------------------------------- Step 2
def validate_skill(meta, folder):
    """Report every failure, not just the first: an author wants the whole list."""
    problems = []
    name, description = meta.get("name", ""), meta.get("description", "")
    if not name:
        problems.append("name-missing")
    else:
        if len(name) > 64:
            problems.append("name-too-long")
        if not NAME_PATTERN.match(name):
            problems.append("name-format")
        if any(word in name.lower() for word in RESERVED):
            problems.append("name-reserved")
        if name != folder:
            problems.append("name-folder-mismatch")
    if not description:
        problems.append("description-missing")
    else:
        if len(description) > 1024:
            problems.append("description-too-long")
        if "<" in description or ">" in description:
            problems.append("description-angle-brackets")
    return problems


# ---------------------------------------------------------------- Step 3
def match_skill(request, skills, threshold=2):
    """A word-overlap model of triggering. The real model matches on meaning, but this
    predicts the same two failures: vague descriptions never fire, broad ones fire too often."""
    wanted = keywords(request)
    best_name, best_score = None, 0
    for name, description in skills.items():
        score = len(wanted & keywords(description))
        if score > best_score:
            best_name, best_score = name, score
    return best_name if best_score >= threshold else None


# ---------------------------------------------------------------- Step 4
def trigger_accuracy(cases, skills, threshold=2):
    """Include cases that should trigger nothing: a skill that fires on everything is also wrong."""
    correct = sum(1 for request, expected in cases if match_skill(request, skills, threshold) == expected)
    return correct / len(cases)


# ---------------------------------------------------------------- Step 5
def context_cost(n_skills, body_tokens, triggered, metadata_tokens=100):
    """Descriptions are always loaded; bodies only when triggered."""
    load_all = n_skills * (metadata_tokens + body_tokens)
    progressive = n_skills * metadata_tokens + triggered * body_tokens
    return load_all, progressive


if __name__ == "__main__":
    meta, body = parse_frontmatter(GOOD)
    print(meta["name"], "->", validate_skill(meta, "invoice-check"))
    bad_meta, _ = parse_frontmatter("---\nname: Claude_PDF Helper\ndescription: <b>Helps</b> with files\n---\nBody")
    print("bad header ->", validate_skill(bad_meta, "pdf-helper"))
    print("no header  ->", parse_frontmatter("# Invoice check\nname: invoice-check")[0])

    for request, expected in CASES:
        print(f"{request:<55} -> {match_skill(request, SKILLS)}")
    print("accuracy:", trigger_accuracy(CASES, SKILLS))
    improved = dict(SKILLS)
    improved["meeting-notes"] = ("Turns a meeting transcript into minutes with decisions and action items. "
                                 "Use when the user shares a transcript, asks for minutes, or wants to summarise a meeting.")
    print("accuracy after rewriting one description:", trigger_accuracy(CASES, improved))

    for n in (5, 50, 500):
        load_all, progressive = context_cost(n, 3_000, 1)
        print(f"{n:>4} skills: all at once {load_all:>9,}   on demand {progressive:>7,}   ratio {load_all / progressive:5.1f}")
    print("recall question 1:", context_cost(120, 2_500, 2), "and with nothing triggered:", context_cost(120, 2_500, 0)[1])

@@step
{
  "stepNumber": 1,
  "title": "Read the frontmatter",
  "instruction": "Implement parse_frontmatter(text). Split the text into lines. If there are no lines, or the first line (stripped) is not exactly three hyphens, return ({}, text): no header was found. Otherwise find the next line that is exactly three hyphens. If there is none, also return ({}, text). For each line between the two, if it contains a colon, split it on the first colon only, strip both parts, and store meta[key] = value. The body is every line after the closing hyphens, joined with a newline and stripped. Return (meta, body). An empty dict is the warning sign described in Section 3: a skill whose header cannot be read loads with no name and no description. [MOD-3.5]",
  "hintConceptual": "The header is a small fenced-off block at the very top. Find where it opens and closes, turn each line inside into a key and a value, and treat the rest as the instructions.",
  "hintSyntax": "lines = text.splitlines()\nif not lines or lines[0].strip() != \"---\":\n    return {}, text\nend = next((i for i in range(1, len(lines)) if lines[i].strip() == \"---\"), None)\nif end is None:\n    return {}, text\nmeta = {}\nfor line in lines[1:end]:\n    if \":\" in line:\n        key, value = line.split(\":\", 1)\n        meta[key.strip()] = value.strip()\nreturn meta, \"\\n\".join(lines[end + 1:]).strip()"
}
@@assert
_meta, _body = parse_frontmatter(GOOD)
assert _meta.get("name") == "invoice-check", f"The name field must be read from the header, got {_meta}"
assert _meta.get("description", "").startswith("Checks supplier invoices") and _meta["description"].endswith("reconcile an invoice."), "The whole description line after the first colon is the value"
assert len(_meta) == 2, f"Only the lines inside the header become fields, got {sorted(_meta)}"
assert _body.startswith("# Invoice check") and _body.endswith("on the invoice."), f"The body is everything after the closing ---, stripped, got {_body!r}"
assert parse_frontmatter("# Invoice check\nname: invoice-check") == ({}, "# Invoice check\nname: invoice-check"), "A file that does not start with --- has no header: return ({}, text)"
assert parse_frontmatter("---\nname: x\nno closing line") == ({}, "---\nname: x\nno closing line"), "A header that is never closed is not a header: return ({}, text)"
assert parse_frontmatter("") == ({}, ""), "An empty file gives ({}, '')"
assert parse_frontmatter("---\ndescription: Use when: the user asks\n---\nBody")[0] == {"description": "Use when: the user asks"}, "Split on the FIRST colon only"
assert parse_frontmatter("---\n  name :  spaced-out  \njust a line\n---\n\n\nBody\n")== ({"name": "spaced-out"}, "Body"), "Strip keys and values, ignore lines without a colon, and strip the body"
print("Step 1 passed: the header is read into fields, and a missing header gives an empty dict.")

@@step
{
  "stepNumber": 2,
  "title": "Validate the name and description",
  "instruction": "Implement validate_skill(meta, folder). Return a list of problem codes in the order given in the docstring. For the name: if it is missing or empty add 'name-missing' and skip the other name checks. Otherwise add 'name-too-long' if it has more than 64 characters, 'name-format' if NAME_PATTERN does not match it, 'name-reserved' if its lowercase form contains 'anthropic' or 'claude', and 'name-folder-mismatch' if it differs from folder. For the description: if it is missing or empty add 'description-missing' and skip the rest. Otherwise add 'description-too-long' if it has more than 1024 characters and 'description-angle-brackets' if it contains an opening or closing angle bracket. Report every failure, not just the first. These are the rules in the table in Section 2. [MOD-3.5]",
  "hintConceptual": "Two fields, each with a presence check first and then its own short list of rules. Collect every broken rule so the author can fix them all in one pass.",
  "hintSyntax": "problems = []\nname, description = meta.get(\"name\", \"\"), meta.get(\"description\", \"\")\nif not name:\n    problems.append(\"name-missing\")\nelse:\n    if len(name) > 64:\n        problems.append(\"name-too-long\")\n    if not NAME_PATTERN.match(name):\n        problems.append(\"name-format\")\n    if any(word in name.lower() for word in RESERVED):\n        problems.append(\"name-reserved\")\n    if name != folder:\n        problems.append(\"name-folder-mismatch\")\nif not description:\n    problems.append(\"description-missing\")\nelse:\n    if len(description) > 1024:\n        problems.append(\"description-too-long\")\n    if \"<\" in description or \">\" in description:\n        problems.append(\"description-angle-brackets\")\nreturn problems"
}
@@assert
_ok = {"name": "invoice-check", "description": "Checks supplier invoices. Use when the user asks to check an invoice."}
assert validate_skill(_ok, "invoice-check") == [], f"A valid header has no problems, got {validate_skill(_ok, 'invoice-check')}"
assert validate_skill({"name": "Claude_PDF Helper", "description": "<b>Helps</b> with files"}, "pdf-helper") == ["name-format", "name-reserved", "name-folder-mismatch", "description-angle-brackets"], "The bad example breaks four rules, reported in order"
assert validate_skill({}, "x") == ["name-missing", "description-missing"], "An empty header is missing both fields, and the other checks are skipped"
assert validate_skill({"name": "", "description": ""}, "x") == ["name-missing", "description-missing"], "Empty values count as missing"
assert validate_skill({"name": "a" * 65, "description": "ok"}, "a" * 65) == ["name-too-long"], "A 65-character name is too long"
assert validate_skill({"name": "a" * 64, "description": "ok"}, "a" * 64) == [], "A 64-character name is allowed"
assert validate_skill({"name": "invoice--check", "description": "ok"}, "invoice--check") == ["name-format"], "Two hyphens in a row are not allowed"
assert validate_skill({"name": "-invoice", "description": "ok"}, "-invoice") == ["name-format"], "A leading hyphen is not allowed"
assert validate_skill({"name": "my-claude-helper", "description": "ok"}, "my-claude-helper") == ["name-reserved"], "Reserved words are not allowed anywhere in the name"
assert validate_skill({"name": "invoice-check", "description": "ok"}, "invoices") == ["name-folder-mismatch"], "The name must equal the folder name"
assert validate_skill({"name": "ok-name", "description": "d" * 1025}, "ok-name") == ["description-too-long"], "A 1,025-character description is too long"
assert validate_skill({"name": "ok-name", "description": "d" * 1024}, "ok-name") == [], "A 1,024-character description is allowed"
assert validate_skill({"name": "ok-name", "description": "Use when x > y"}, "ok-name") == ["description-angle-brackets"], "A single angle bracket is enough to fail"
print("Step 2 passed: every broken rule is reported, and a well-formed header passes.")

@@step
{
  "stepNumber": 3,
  "title": "Which skill does a request trigger?",
  "instruction": "Implement match_skill(request, skills, threshold). skills is a dict from skill name to description. Compute keywords(request). For each skill, the score is the number of keywords its description shares with the request. Keep track of the highest score and the first skill that reached it. Return that skill's name if its score is at least threshold, and None otherwise. This is the selection rule from Section 2. Afterwards, try the request 'Summarise this meeting' and see that no skill fires: the description never uses that word. [MOD-3.5]",
  "hintConceptual": "The assistant picks a skill by its label. Compare the words of the request with the words of each label, take the best fit, and refuse to pick anything if even the best fit is weak.",
  "hintSyntax": "wanted = keywords(request)\nbest_name, best_score = None, 0\nfor name, description in skills.items():\n    score = len(wanted & keywords(description))\n    if score > best_score:\n        best_name, best_score = name, score\nreturn best_name if best_score >= threshold else None"
}
@@assert
assert match_skill("Please check this invoice against the purchase order", SKILLS) == "invoice-check", f"Got {match_skill('Please check this invoice against the purchase order', SKILLS)}"
assert match_skill("Write the quarterly report for the board", SKILLS) == "brand-report", "Two shared words (quarterly, report) reach the threshold"
assert match_skill("Here is the transcript, can you write minutes?", SKILLS) == "meeting-notes", "Punctuation must not stop a match: use keywords()"
assert match_skill("What is the capital of France?", SKILLS) is None, "A request that shares nothing triggers no skill"
assert match_skill("Summarise this meeting", SKILLS) is None, "One shared word is below the default threshold of 2"
assert match_skill("Summarise this meeting", SKILLS, threshold=1) == "meeting-notes", "The threshold argument must be used"
assert match_skill("Help me with these documents", {"doc-helper": "Helps with documents."}) is None, "A vague description does not reach the threshold"
assert match_skill("alpha beta", {"first": "alpha beta gamma", "second": "alpha beta delta"}) == "first", "When scores tie, the first skill wins"
assert match_skill("alpha beta gamma", {"first": "alpha beta", "second": "alpha beta gamma"}) == "second", "The highest score wins, wherever it is in the dict"
assert match_skill("anything at all", {}) is None, "With no skills installed nothing is triggered"
print("Step 3 passed: requests reach the skill whose description shares their words, and weak matches trigger nothing.")

@@step
{
  "stepNumber": 4,
  "title": "Test your descriptions",
  "instruction": "Implement trigger_accuracy(cases, skills, threshold). cases is a list of (request, expected) pairs, where expected is the name of the skill that should fire, or None if no skill should. Count the cases for which match_skill(request, skills, threshold) equals expected, and return that count divided by the number of cases. This is the evaluation from Section 2. With the starting descriptions the result is 0.8, because 'Summarise this meeting' is missed. Rewriting one description, without touching any instructions, brings it to 1.0. [MOD-3.5]",
  "hintConceptual": "A description is only good if it fires when it should and stays quiet when it should not. Run every example, count the ones that behave as expected, and report the share.",
  "hintSyntax": "correct = sum(1 for request, expected in cases if match_skill(request, skills, threshold) == expected)\nreturn correct / len(cases)"
}
@@assert
assert trigger_accuracy(CASES, SKILLS) == 0.8, f"Four of the five cases succeed with the starting descriptions, got {trigger_accuracy(CASES, SKILLS)}"
_improved = dict(SKILLS)
_improved["meeting-notes"] = "Turns a meeting transcript into minutes with decisions and action items. Use when the user shares a transcript, asks for minutes, or wants to summarise a meeting."
assert trigger_accuracy(CASES, _improved) == 1.0, "After the description is rewritten all five cases succeed"
assert trigger_accuracy([("What is the capital of France?", None)], SKILLS) == 1.0, "A case that should trigger nothing counts as correct when nothing fires"
assert trigger_accuracy([("Write the quarterly report for the board", "invoice-check")], SKILLS) == 0.0, "Firing the wrong skill is a failure"
assert trigger_accuracy(CASES, SKILLS, threshold=1) == 1.0, "The threshold must be passed on to match_skill"
assert trigger_accuracy(CASES, {}) == 0.2, "With no skills installed only the case expecting None is correct"
print("Step 4 passed: accuracy is 0.8 with the starting descriptions and 1.0 after one description is rewritten.")

@@step
{
  "stepNumber": 5,
  "title": "The context cost of a skill library",
  "instruction": "Implement context_cost(n_skills, body_tokens, triggered, metadata_tokens). Return a tuple of two numbers. The first is the cost of loading every skill in full: n_skills times (metadata_tokens plus body_tokens). The second is the cost with progressive disclosure: n_skills times metadata_tokens, plus triggered times body_tokens. These are the two formulas from Section 2. Notice what remains when triggered is zero: the descriptions are paid for on every request. [MOD-3.5]",
  "hintConceptual": "Either everything is in the context all the time, or only the labels are, plus the full text of whichever skills are actually in use.",
  "hintSyntax": "load_all = n_skills * (metadata_tokens + body_tokens)\nprogressive = n_skills * metadata_tokens + triggered * body_tokens\nreturn load_all, progressive"
}
@@assert
assert context_cost(50, 3_000, 1) == (155_000, 8_000), f"50 skills of 3,000 tokens with one triggered, got {context_cost(50, 3_000, 1)}"
assert context_cost(120, 2_500, 2) == (312_000, 17_000), "Recall question 1: 120 skills of 2,500 tokens with two triggered"
assert context_cost(120, 2_500, 0) == (312_000, 12_000), "With nothing triggered the descriptions are still paid for"
assert context_cost(500, 3_000, 1) == (1_550_000, 53_000), "500 skills cost 50,000 tokens of descriptions alone"
assert context_cost(10, 1_000, 10) == (11_000, 11_000), "If every skill is triggered the two costs are equal"
assert context_cost(10, 1_000, 1, metadata_tokens=250) == (12_500, 3_500), "The metadata_tokens argument must be used"
assert context_cost(0, 3_000, 0) == (0, 0), "No skills, no cost"
print("Step 5 passed: 50 skills cost 155,000 tokens loaded whole and 8,000 on demand.")
