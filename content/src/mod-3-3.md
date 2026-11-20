@@meta
{
  "moduleId": "MOD-3.3",
  "slug": "mod-3-3",
  "unitId": "UNIT-3",
  "unitTitle": "Unit 3: Mastering Claude & Gemini",
  "title": "Claude Artifacts",
  "difficulty": "Foundational",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "What are artifacts and how do I use them?", "source": "Claude Help Center", "url": "https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them" },
    { "title": "Build and share AI-powered apps with Claude", "source": "Anthropic Blog", "url": "https://claude.com/blog/claude-powered-artifacts" },
    { "title": "Claude can now create and edit files", "source": "Anthropic Blog", "url": "https://claude.com/blog/create-files" },
    { "title": "Build and share AI-powered apps with Claude (commentary)", "source": "Simon Willison's Weblog", "url": "https://simonwillison.net/2025/Jun/25/ai-powered-apps-with-claude/" },
    { "title": "html.parser: Simple HTML and XHTML parser", "source": "Python Docs", "url": "https://docs.python.org/3/library/html.parser.html" },
    { "title": "difflib: Helpers for computing deltas", "source": "Python Docs", "url": "https://docs.python.org/3/library/difflib.html" }
  ],
  "videoLibrary": [
    {
      "id": "VID-3.3-1",
      "title": "Getting Started with Claude Artifacts – On-Demand Tutorial",
      "creator": "Wharton AI & Analytics Initiative",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=fp_sMnuRFrU",
      "timingInstruction": "Watch after reading Section 1 to see the artifact panel in use",
      "keyTakeaway": "A measured, classroom-style demonstration of asking for an artifact and revising it, which shows the conversation-beside-workpiece layout this chapter describes."
    },
    {
      "id": "VID-3.3-2",
      "title": "Claude 3.5 Artifacts: 15 Use Cases You Can Remix (With Links)",
      "creator": "AI Andy",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=zVUxO5CFA40",
      "timingInstruction": "Watch after Section 2 for a range of examples; the interface shown is an earlier version",
      "keyTakeaway": "Fifteen concrete things people build as artifacts, from calculators to diagrams. Useful for ideas, with the caveat that it shows the feature as it was at launch."
    },
    {
      "id": "VID-3.3-3",
      "title": "Build an AI-Powered App with Claude",
      "creator": "Coursera",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/build-an-ai-powered-app-with-claude",
      "timingInstruction": "Take after the lab if you want to build interactive artifacts that call the model",
      "keyTakeaway": "A guided project on building an interactive application as an artifact, extending the single-file pages you generate and check in this chapter's lab."
    },
    {
      "id": "VID-3.3-4",
      "title": "Claude AI Foundations and Prompt Engineering",
      "creator": "Coursera",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/claude-fundamentals-prompt-engineering",
      "timingInstruction": "Optional, alongside Units 3 and 5",
      "keyTakeaway": "A broader beginner course on working with Claude, useful for practising the specification-style prompts that produce good artifacts."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Build, Check, and Version an Artifact",
    "context": "A training team wants to hand out small single-file web pages made with an assistant, and needs to be sure they are safe to open, will work when shared, and can be revised without accidental damage. You will build a generator for a self-contained page, a checker that finds references the sandbox would block, a targeted edit function, and a version comparison.",
    "language": "python"
  }
}

@@reading
# Claude Artifacts

Ask a chat assistant for a one-page report and, in the simplest design, the report arrives as a long message in the conversation. Ask for a change and a second long message arrives. After five rounds the thing you care about is scattered through a scrolling transcript, and you are no longer sure which copy is current.

An **artifact** fixes this by taking the work product out of the conversation. The document, page, diagram, or small application appears in its own panel beside the chat. It has a title and a version history. You talk on one side and the work sits on the other.

This chapter covers what artifacts are, how to ask for them and revise them, what the sandbox that runs them allows, and what happens when you share one. Artifacts were introduced in June 2024 and have been extended several times since. Details here are from Anthropic's help pages in November 2026 and are dated. The ideas that last are the separation of conversation from work product, targeted edits, and the limits of a sandbox.

## 1. First-Principles Mental Model & Intuition

### The conversation and the workpiece

Imagine sitting with a designer. You talk across the table. Between you, on the table, lies the draft. When you say "make the heading bigger", the designer does not describe a new draft out loud. They change the one on the table, and you both look at it.

A chat without artifacts has no table. Every draft is spoken into the conversation and scrolls away. Artifacts add the table.

```text
+------------------------------+   +------------------------------------+
|  CONVERSATION                |   |  ARTIFACT: "Q3 summary page"   v3  |
|                              |   |                                    |
|  You: Build a one-page       |   |   +----------------------------+   |
|       summary of Q3.         |   |   |  Q3 Summary                |   |
|  Claude: Done. I used a      |   |   |  Revenue   ########        |   |
|       bar for each region.   |   |   |  Costs     #####           |   |
|  You: Make the heading       |   |   |  [ Show details ]          |   |
|       larger.                |   |   +----------------------------+   |
|  Claude: Updated.            |   |                                    |
|                              |   |   versions:  v1   v2  [v3]         |
+------------------------------+   +------------------------------------+
        talk happens here                 the work lives here
```

Three properties follow from putting the work on the table.

**It has identity.** There is one "Q3 summary page", not five messages that each contain a version of it. You can refer to it, reopen it, and export it.

**It has history.** Each change produces a new version. You can go back to version 2 if version 3 was a mistake.

**It can be more than text.** A web page in the panel is rendered, so you see the page and not the code. A diagram is drawn. A small application runs, and you can click its buttons.

### What deserves to be an artifact

Not every answer belongs on the table. A two-line reply or a quick explanation is conversation. Anthropic's guidance describes artifacts as being for content that is substantial and self-contained, with roughly fifteen lines as the threshold, and that you are likely to edit, reuse, or take somewhere else.

| Request | Artifact? | Why |
|---|---|---|
| "What does this error mean?" | No | An explanation, read once |
| "Write a 600-word blog post on our launch" | Yes | Substantial, will be edited and exported |
| "Give me a regex for UK postcodes" | No | One line |
| "Build a tip calculator I can use on my phone" | Yes | A self-contained application |
| "Draw our approval process as a flowchart" | Yes | A diagram to keep and revise |

When the assistant does not create one and you want it, ask: "Put this in an artifact." When it creates one for something trivial, say so.

### Kinds of artifact

The range has grown since launch. The original kinds were documents, code files, single-page websites in HTML, vector graphics, diagrams written in a text notation, and interactive components. At the time of writing the app also offers guided formats for documents, slides, designs, spreadsheets, and others, with exports to common office and web formats, and the available set depends on your plan. Artifacts created in conversations before a change in September 2026 are labelled as legacy and keep their earlier behaviour.

The kind matters less than the principle. Whatever its form, an artifact is a single, self-contained work product with a history.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### How an artifact is produced

The model has no special drawing ability. It writes text. An artifact is text in a form that the application knows how to display: prose for a document, HTML for a page, a diagram notation for a flowchart. The application takes that text out of the reply and renders it in the panel.

```text
  your request
       |
       v
     MODEL  --- writes --->  reply text  +  artifact source (HTML, document text, ...)
                                              |
                                              v
                                   APPLICATION renders it
                                   in a sandboxed panel
                                              |
                                              v
                                   what you see and click
```

This explains two things users notice. First, an artifact can contain mistakes of the same kind as any generated text: a button that does nothing, a total that is computed wrongly. Rendering makes it look finished. It does not make it correct. Second, the artifact's source counts as output tokens, so a large artifact takes time to write and uses your allowance.

### Two ways to change an artifact

When you ask for a change, the assistant can do one of two things.

A **rewrite** produces the entire artifact again with the change included. A **targeted update** names a short piece of the existing text and its replacement, and the application swaps one for the other.

Let $L$ be the length of the artifact in tokens and $d$ the size of a targeted update, counting both the text to find and the text to put in its place. Over $n$ edits the output is

$$
T_{\text{rewrite}} = n \cdot L \qquad\qquad T_{\text{update}} = n \cdot d
$$

For a 4,000-token page, ten edits, and updates of about 100 tokens each, that is 40,000 tokens against 1,000. At an output price of USD 10 per million tokens the rewrites cost USD 0.40 and the updates USD 0.01. Waiting time follows the same ratio. If text is generated at an assumed 80 tokens per second, a rewrite takes $4000 / 80 = 50$ seconds and an update $100 / 80 = 1.25$ seconds.

Cost is the smaller issue. The larger one is **drift**. A rewrite regenerates every line, including the ones you were happy with, and each regeneration is a fresh chance for something to change that you did not ask to change: a label reworded, a colour altered, a feature quietly dropped. If each rewrite has probability $q$ of introducing an unintended change, the chance of at least one after $n$ rewrites is

$$
P(\text{drift}) = 1 - (1 - q)^{n}
$$

With $q = 0.1$ and $n = 10$ this is $1 - 0.9^{10} = 0.651$. Two times in three, something you did not ask for has changed by the tenth round. A targeted update cannot drift in this way, because the text outside the replaced span is never regenerated.

A targeted update has its own failure mode. It works by finding the old text, so the old text must appear in the artifact **exactly once**. If it appears nowhere, there is nothing to replace. If it appears twice, the instruction is ambiguous. A careful implementation refuses in both cases and falls back to a rewrite or asks for a more specific target. This is why a request such as "change the second paragraph's first sentence to 'We open at nine'" works better than "fix the wording".

You can also change an artifact without the model. At the time of writing the app lets you edit text directly in the panel, or select a part and ask for a change to that selection only. Selecting is the most precise instruction available, because it tells the assistant exactly which span you mean.

### Versions and differences

Each change adds a version: $v_1, v_2, \dots, v_n$. Comparing two versions is a classic problem. A **diff** finds the lines common to both, in order, and reports the rest as removed from the old or added in the new. Formally it rests on the longest common subsequence of the two lists of lines. For versions of $a$ and $b$ lines the standard dynamic-programming method takes $O(a \cdot b)$ time, and practical tools use faster heuristics.

The practical use is as a check on drift. After an edit you asked to be small, a diff showing three changed lines is reassuring. A diff showing sixty is a signal to look before continuing.

### The sandbox

A rendered artifact is running code that the model wrote, inside your browser, on a page where you are signed in to your account. That would be dangerous without isolation. So artifacts run in a **sandbox**: a restricted frame, separate from the main application, with rules about what the code inside may do.

```text
+----------------------- your browser -------------------------------+
|                                                                    |
|  +------------------ the Claude app ---------------------------+   |
|  |  your account, your chats, your files                       |   |
|  |                                                             |   |
|  |   +--------------- SANDBOXED FRAME ---------------------+   |   |
|  |   |  the artifact's code runs here                      |   |   |
|  |   |                                                     |   |   |
|  |   |  can:    draw, compute, react to clicks             |   |   |
|  |   |  can:    use a small set of approved libraries      |   |   |
|  |   |  can:    use features the app provides to it        |   |   |
|  |   |          (calling the model, storage), on some plans|   |   |
|  |   |  cannot: read your chats or account                 |   |   |
|  |   |  cannot: load arbitrary outside scripts             |   |   |
|  |   |  cannot: send data to arbitrary outside servers     |   |   |
|  |   +-----------------------------------------------------+   |   |
|  +-------------------------------------------------------------+   |
+--------------------------------------------------------------------+
```

Anthropic does not publish the full rule set, and it has changed over time, so treat any specific list as provisional. The shape is stable and follows from the security goal. Code in the frame cannot reach out of it freely. Requests to load scripts or data from arbitrary addresses on the internet are blocked. Only a short approved list of library sources is allowed.

The consequence for you is the **self-contained rule**. An artifact works reliably when everything it needs is inside its own source: the structure, the styling, the logic, and the data. An artifact that depends on an outside file, an outside script, or a live outside service is likely to show a blank panel.

The app offers controlled exceptions. At the time of writing, artifacts can be given the ability to call the model themselves, which turns a static page into a small AI application. On paid plans they can keep data between sessions in storage provided by the app, with limits on total size and number of records, and can use connected services. Each of these goes through a door the application controls. The artifact's code does not get open access to the network.

### Sharing and publishing

An artifact is private by default. Only you see it. You can take it out of the app in three ways.

- **Export or copy.** Download the file or copy the source, and it becomes an ordinary document or web page that you host or send yourself.
- **Publish.** The app creates a link, and anyone with the link can open the artifact in their browser. Published artifacts can be unpublished.
- **Remix.** Someone viewing a published artifact can copy it into their own conversation and change it. Their copy is theirs. Yours is untouched.

Two details matter for anything beyond a toy. First, publishing shares the artifact and everything embedded in it. If client figures are written into the page's source, they are published with it. Second, for artifacts that call the model, Anthropic's announcement in June 2025 said that usage is counted against the plan of the person using the artifact and not against its author. You can share an AI-powered tool without paying for everyone who tries it, and each viewer needs to be signed in to an account.

### Complexity

Generating an artifact costs output tokens proportional to its length. A rewrite repeats that cost on each edit and a targeted update costs in proportion to the change. Checking a page for outside references is a single pass over its text, linear in its length.

## 3. Production-Grade Implementation & Annotated Walkthrough

The self-contained rule can be written down and checked. First, a generator for a single-file page.

```python
import html

def build_page(title, items):
    rows = "\n".join(f"    <li>{html.escape(item)}</li>" for item in items)
    return (
        "<!doctype html>\n<html>\n<head>\n"
        '  <meta charset="utf-8">\n'
        f"  <title>{html.escape(title)}</title>\n"
        "  <style>body { font-family: sans-serif; margin: 2rem; }</style>\n"
        "</head>\n<body>\n"
        f"  <h1>{html.escape(title)}</h1>\n"
        f"  <ul>\n{rows}\n  </ul>\n"
        "</body>\n</html>\n"
    )

page = build_page("Launch checklist", ["Book venue", "Send invites", "Order <b>cake</b> & candles"])
print(page)
```

- **Everything is in one string.** Structure, styling, and content travel together. Nothing is loaded from elsewhere, so the page works in a sandbox, in an email attachment, and offline.
- **`html.escape` is applied to every value that came from outside.** The third item contains angle brackets and an ampersand. Without escaping, the browser would treat part of the text as markup. With it, the characters are shown as typed. This is the standard defence against content being interpreted as code, and it matters as much when the content comes from a model as when it comes from a user.
- **The style is inline.** A separate stylesheet would be an outside reference. For a single-page artifact, a `style` element in the head keeps the page self-contained.

Next, a checker for references that a sandbox would block.

```python
from html.parser import HTMLParser
from urllib.parse import urlparse

LOADING_TAGS = {"script", "link", "img", "iframe"}

class ReferenceCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ("src", "href") and value:
                self.references.append((tag, value))

def lint_artifact(page, allowed_hosts=()):
    collector = ReferenceCollector()
    collector.feed(page)
    problems = []
    for tag, url in collector.references:
        if tag in LOADING_TAGS and url.startswith(("http://", "https://", "//")):
            host = urlparse("https:" + url if url.startswith("//") else url).netloc
            if host not in allowed_hosts:
                problems.append(f"{tag}: {url}")
    return problems

risky = ('<script src="https://cdn.example.com/chart.js"></script>'
         '<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"></script>'
         '<img src="logo.png"><a href="https://example.com/help">Help</a>')
print(lint_artifact(page))
print(lint_artifact(risky, allowed_hosts=("cdnjs.cloudflare.com",)))
```

- **A real parser reads the page.** Searching the text for "http" would flag addresses that appear in ordinary sentences and miss references written in unusual ways. `HTMLParser` reports each tag and its attributes, so the check looks at what the browser would load.
- **Only tags that load something are checked.** A `script`, stylesheet `link`, `img`, or `iframe` fetches a resource when the page opens. An `a` element is a link the reader may choose to click, which is harmless, so the help link is not reported.
- **The allowlist is a parameter.** Which hosts a sandbox permits is the platform's decision and changes. The function takes the list as input and does not hard-code a guess.
- **The generated page is clean, and the risky one has one problem.** The script from an unapproved host is reported. The one from the approved host passes. The relative `logo.png` is not an outside address, though in a real artifact a file that is not embedded would still be missing.

Then, targeted edits and version comparison.

```python
import difflib

def apply_update(text, old, new):
    count = text.count(old) if old else 0
    if count != 1:
        raise ValueError(f"expected exactly one match for the old text, found {count}")
    return text.replace(old, new)

def changed_lines(old, new):
    diff = list(difflib.ndiff(old.splitlines(), new.splitlines()))
    added = sum(1 for line in diff if line.startswith("+ "))
    removed = sum(1 for line in diff if line.startswith("- "))
    return added, removed

version_2 = apply_update(page, "Send invites", "Send invitations by Friday")
print(changed_lines(page, version_2))
try:
    apply_update(page, "Launch checklist", "Launch plan")
except ValueError as problem:
    print("refused:", problem)
```

- **`apply_update` counts before it replaces.** Zero matches means the instruction refers to text that is not there. Two or more means it is ambiguous. Both raise an error. A silent no-op or a replace-everything would each leave the artifact in a state the user did not ask for.
- **The title appears twice.** "Launch checklist" is in the `title` element and in the heading, so the last call is refused. A correct instruction would include enough surrounding text to pick one, or would make two separate updates.
- **`changed_lines` turns a diff into two numbers.** `ndiff` marks lines only in the new version with a plus sign and lines only in the old with a minus sign. One line changed gives one added and one removed. These two numbers are a cheap drift alarm: an edit meant to touch one line should not report forty.

Finally, the arithmetic of rewrites against updates.

```python
def edit_tokens(n_edits, artifact_tokens, update_tokens):
    return n_edits * artifact_tokens, n_edits * update_tokens

def drift_probability(q, n_rewrites):
    return 1 - (1 - q) ** n_rewrites

rewrite, update = edit_tokens(10, 4_000, 100)
print(f"rewrite: {rewrite:,} tokens, USD {rewrite / 1e6 * 10:.2f}   update: {update:,} tokens, USD {update / 1e6 * 10:.2f}")
print(f"seconds per edit at 80 tokens/s: rewrite {4_000 / 80:.2f}, update {100 / 80:.2f}")
print(f"chance of drift after 10 rewrites at q=0.1: {drift_probability(0.1, 10):.3f}")
```

- **The two totals differ by the ratio of artifact size to change size.** Here that ratio is forty. The larger the artifact and the smaller the edits, the more a targeted approach matters.
- **The drift formula is the complement rule.** The chance that nothing goes wrong in every one of ten rewrites is $0.9^{10}$, and one minus that is the chance that something does.

**Complexity.** `build_page` and `lint_artifact` are linear in the size of the page. `apply_update` is linear in the text. `changed_lines` is quadratic in the number of lines in the worst case, which is negligible for a document of a few hundred lines.

### Prompting for an artifact

An artifact request is a specification. The pattern from Module 2.5 applies, with a few artifact-specific parts.

```text
Build a single-page [what] as an artifact.

PURPOSE      Who will use it and for what.
CONTENT      The exact data or text to include (paste it; do not describe it).
BEHAVIOUR    What each control does. What happens with empty or invalid input.
LOOK         Plain and readable; works on a phone; any colours or fonts that matter.
CONSTRAINTS  Self-contained in one file. No outside scripts, images, or data.
CHECK        After building, list three things I should test by hand.
```

The last line pays for itself. It makes the assistant state what the page is supposed to do, and it gives you a short test script.

For revisions, change one thing at a time, name the exact place, and say what must stay the same: "In the heading only, change 'Q3' to 'Third quarter'. Do not change anything else."

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**It looks finished, so people stop checking.** A rendered page with tidy styling carries an authority that a block of code does not. Calculators with wrong formulas and charts with mislabelled axes get shared because they looked right. Test an interactive artifact with inputs whose answers you know, including zero, a negative number, and an empty field.

**Long artifacts get truncated or rewritten badly.** Past a certain size, each rewrite risks hitting an output limit partway through, or losing a section. Keep artifacts focused. Two artifacts of moderate size are easier to maintain than one enormous one.

**Features disappear between versions.** The commonest complaint about iterating is that a change to one part silently removed something elsewhere. This is drift from full rewrites. Ask for the smallest change, say what must not change, and glance at earlier versions when something seems to be missing.

**"Fix it" is not an instruction.** When a button does not work, describe what you did, what you expected, and what happened. If the panel shows an error message, paste it. The assistant cannot see your screen unless you show it.

**A blank panel usually means an outside dependency.** The page asked for a script, font, image, or data file from an address the sandbox does not allow. Ask for a version that is fully self-contained, with data embedded and only built-in browser features.

**It works in the panel and breaks when exported.** The reverse also happens. An artifact that relies on libraries the app supplies to the sandbox, or on the app's storage and model-calling features, will not run as a plain file on your own website. If you plan to host it yourself, say so at the start and ask for standard HTML with no dependence on the app.

**Published means public.** A published link can be opened by anyone who has it and can be forwarded. Do not publish an artifact with personal data, client figures, or credentials in its source. Check the source, not only what is visible on the page, because data can be embedded without being displayed.

**Never put secrets in an artifact.** An API key written into a page is readable by everyone who opens it. Artifacts that need to call a model should use the facility the app provides, which does not expose a key.

**Storage and AI features depend on the plan.** Persistent storage, connected services, and some artifact formats are limited to paid plans at the time of writing, and people who receive a shared artifact may not have the same features. Test a shared artifact from a second account when you can.

**Remixing is copying.** When someone remixes your published artifact they get an independent copy. Later improvements to yours do not reach theirs. For a tool a team depends on, agree where the master copy lives.

**An artifact is not a deployment.** It has no monitoring, no access control beyond the link, and no guarantee that the platform's rules will stay the same. It is excellent for prototypes, internal aids, teaching materials, and one-off tools. For anything customers rely on, treat the artifact as a draft to hand to a developer.

**Diagram notations fail on small syntax errors.** A flowchart written in a text notation can fail to draw because of one unbalanced bracket or an unquoted label containing punctuation. If a diagram shows an error, ask for the labels to be simplified and quoted.

## 5. Active Recall Check & Synthesis Summary

**Summary.** An artifact is a self-contained work product, such as a document, page, diagram, or small application, displayed in its own panel beside the conversation, with an identity and a version history. The model writes its source as text and the application renders it, so it can be wrong in every way generated text can be wrong while looking finished. Changes are made by rewriting the whole artifact or by a targeted update of one span. Rewrites cost in proportion to the artifact's size on every edit and risk drift, with the chance of an unintended change growing as $1 - (1 - q)^{n}$. Targeted updates are cheap and safe but need the old text to match exactly once. Artifacts run in a sandbox that blocks free access to the network and to your account, which is why they must be self-contained, with controlled exceptions for calling the model and storing data. They are private until published, and publishing shares everything in the source.

**Question 1.** A 6,000-token artifact is revised 15 times. Compare the total output tokens, the cost at USD 10 per million output tokens, and the waiting time at 75 tokens per second, for full rewrites and for targeted updates of 150 tokens each. If each rewrite has a 5 percent chance of an unintended change, how likely is at least one after 15 rewrites?

<details>
<summary>View Answer</summary>

Full rewrites produce 15 times 6,000, which is 90,000 tokens, costing USD 0.90. Each rewrite takes 6,000 divided by 75, which is 80 seconds, so the fifteen take 1,200 seconds, or 20 minutes of waiting. Targeted updates produce 15 times 150, which is 2,250 tokens, costing about USD 0.02. Each takes 2 seconds, 30 seconds in all. The ratio between the two approaches is forty, the ratio of the artifact's size to the size of a change. For drift, the chance that a single rewrite introduces no unintended change is 0.95, the chance that all fifteen are clean is 0.95 to the fifteenth power, about 0.463, and so the chance of at least one unintended change is about 0.537, or 54 percent. The money is trivial. The twenty minutes and the better-than-even chance of silent damage are the real costs, and they are the reason to ask for small, precisely located changes.

</details>

**Question 2.** A user asks for a sales dashboard as an artifact. The assistant writes a page that loads a charting library from an arbitrary address and fetches figures from the company's internal web service. The panel is blank. Explain why, and describe a request that would produce a working artifact.

<details>
<summary>View Answer</summary>

The artifact runs in a sandbox whose purpose is to stop model-written code from reaching out of its frame. Loading a script from an arbitrary outside address is blocked, so the charting library never arrives and the code that depends on it fails. The request to the company's internal service is blocked for the same reason, and would in any case fail because the sandbox has no access to the user's credentials or network. With neither the library nor the data, nothing is drawn. A working request follows the self-contained rule. The user pastes the figures into the prompt and asks for them to be embedded in the page, and asks for the chart to be drawn with built-in browser features, or with a library from the approved list if the platform offers one. The request should state "one file, no outside scripts or data". If live data is essential, the right route is a connected service that the app provides to artifacts on plans that support it, or a properly hosted application built by a developer. An artifact that tries to reach the service directly cannot work.

</details>

**Question 3.** A manager builds an artifact that analyses customer feedback. The page has last quarter's comments, with customer names, embedded in its source, and it calls the model to summarise whatever the viewer pastes in. The manager publishes it and posts the link in a public forum. Identify what has been exposed, who pays for the model usage, and what should have been done.

<details>
<summary>View Answer</summary>

Publishing shares the artifact's whole source with anyone who has the link, and a link in a public forum is available to everyone. The embedded customer comments and names are therefore public, whether or not the page displays them, because anyone can view the source or remix the artifact into their own conversation and read it there. That is a disclosure of personal data. On usage, Anthropic's stated arrangement for AI-powered artifacts is that calls to the model are counted against the plan of the person using the artifact, so the manager is not charged for strangers' use, and each visitor needs to be signed in to their own account. What should have been done: remove the real data from the source before sharing, replacing it with invented examples or with nothing, so that the tool works only on what each viewer supplies. Share the link with the intended colleagues only, or keep the artifact unpublished and share within the organisation's own plan. Check the source, not just the visible page, before publishing. If the link has already spread, unpublish it at once and treat the event as a data incident under the organisation's policy.

</details>

@@starter
"""
Lab: Build, Check, and Version an Artifact
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import difflib
import html
from html.parser import HTMLParser
from urllib.parse import urlparse

LOADING_TAGS = {"script", "link", "img", "iframe"}


class ReferenceCollector(HTMLParser):
    """Provided helper. After collector.feed(page), collector.references is a list of
    (tag, url) pairs for every src or href attribute in the page."""

    def __init__(self):
        super().__init__()
        self.references = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ("src", "href") and value:
                self.references.append((tag, value))


# ---------------------------------------------------------------- Step 1
def should_be_artifact(text, reusable):
    """True only if the text has MORE than 15 lines AND reusable is true.
    (reusable means the user is likely to edit, reuse, or export it.)"""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def build_page(title, items):
    """Return a complete, self-contained HTML page as one string.
    It must contain, in this order:
      <!doctype html>
      a <title> element and an <h1> element, each holding the ESCAPED title
      a <ul> element with one <li> element per item, each holding the ESCAPED item
    Escape with html.escape. Do not reference any outside file."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def lint_artifact(page, allowed_hosts=()):
    """Return a list of problems, one string "tag: url" for every reference that
      - belongs to a tag in LOADING_TAGS, and
      - is an outside address: starts with "http://", "https://", or "//", and
      - has a host that is not in allowed_hosts.
    Use ReferenceCollector to read the page, and urlparse(url).netloc for the host.
    For a url starting with "//", put "https:" in front before parsing."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def apply_update(text, old, new):
    """Replace old with new, but only if old occurs in text EXACTLY once.
    If old is empty, or occurs zero times, or more than once: raise ValueError."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def changed_lines(old, new):
    """Return (added, removed): how many lines are only in new, and only in old.
    Use difflib.ndiff on the two texts split into lines. In its output, lines only in
    the new text start with "+ " and lines only in the old text start with "- "."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("artifact? :", should_be_artifact("line\n" * 20, True))
    print("page      :", build_page("Launch checklist", ["Book venue", "Send invites"]))
    print("problems  :", lint_artifact('<script src="https://cdn.example.com/chart.js"></script>'))
    print("updated   :", apply_update("Send invites", "invites", "invitations"))
    print("changed   :", changed_lines("a\nb\nc", "a\nB\nc"))

@@solution
"""
Lab solution: Build, Check, and Version an Artifact
Standard library only.
"""
import difflib
import html
from html.parser import HTMLParser
from urllib.parse import urlparse

LOADING_TAGS = {"script", "link", "img", "iframe"}


class ReferenceCollector(HTMLParser):
    """Provided helper. After collector.feed(page), collector.references is a list of
    (tag, url) pairs for every src or href attribute in the page."""

    def __init__(self):
        super().__init__()
        self.references = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ("src", "href") and value:
                self.references.append((tag, value))


# ---------------------------------------------------------------- Step 1
def should_be_artifact(text, reusable):
    """Substantial AND worth keeping. A long answer read once is still conversation."""
    return bool(reusable) and len(text.splitlines()) > 15


# ---------------------------------------------------------------- Step 2
def build_page(title, items):
    """One string holds structure, style, and content, so the page works in a sandbox
    and offline. Every outside value is escaped so it is shown as text, never run as markup."""
    rows = "\n".join(f"    <li>{html.escape(item)}</li>" for item in items)
    return (
        "<!doctype html>\n<html>\n<head>\n"
        '  <meta charset="utf-8">\n'
        f"  <title>{html.escape(title)}</title>\n"
        "  <style>body { font-family: sans-serif; margin: 2rem; }</style>\n"
        "</head>\n<body>\n"
        f"  <h1>{html.escape(title)}</h1>\n"
        f"  <ul>\n{rows}\n  </ul>\n"
        "</body>\n</html>\n"
    )


# ---------------------------------------------------------------- Step 3
def lint_artifact(page, allowed_hosts=()):
    """Report what the browser would try to load from outside. Ordinary links (the a tag)
    are not loaded when the page opens, so they are not reported. The allowlist is the
    platform's decision, so it is an argument and not a constant."""
    collector = ReferenceCollector()
    collector.feed(page)
    problems = []
    for tag, url in collector.references:
        if tag in LOADING_TAGS and url.startswith(("http://", "https://", "//")):
            host = urlparse("https:" + url if url.startswith("//") else url).netloc
            if host not in allowed_hosts:
                problems.append(f"{tag}: {url}")
    return problems


# ---------------------------------------------------------------- Step 4
def apply_update(text, old, new):
    """A targeted edit must be unambiguous. Zero matches means the target is not there;
    several mean we cannot tell which one was meant. Refuse both, loudly."""
    count = text.count(old) if old else 0
    if count != 1:
        raise ValueError(f"expected exactly one match for the old text, found {count}")
    return text.replace(old, new)


# ---------------------------------------------------------------- Step 5
def changed_lines(old, new):
    """Two numbers that work as a drift alarm: a one-line edit should report (1, 1)."""
    diff = list(difflib.ndiff(old.splitlines(), new.splitlines()))
    added = sum(1 for line in diff if line.startswith("+ "))
    removed = sum(1 for line in diff if line.startswith("- "))
    return added, removed


if __name__ == "__main__":
    print("20 reusable lines ->", should_be_artifact("line\n" * 20, True),
          "| 3 lines ->", should_be_artifact("a\nb\nc", True))

    page = build_page("Launch checklist", ["Book venue", "Send invites", "Order <b>cake</b> & candles"])
    print(page)
    print("problems in generated page:", lint_artifact(page))

    risky = ('<script src="https://cdn.example.com/chart.js"></script>'
             '<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"></script>'
             '<img src="logo.png"><a href="https://example.com/help">Help</a>')
    print("problems in risky page    :", lint_artifact(risky, allowed_hosts=("cdnjs.cloudflare.com",)))

    version_2 = apply_update(page, "Send invites", "Send invitations by Friday")
    print("lines added, removed      :", changed_lines(page, version_2))
    try:
        apply_update(page, "Launch checklist", "Launch plan")
    except ValueError as problem:
        print("refused                   :", problem)

    print("recall question 1         :", 15 * 6_000, "vs", 15 * 150, "tokens;",
          f"drift {1 - 0.95 ** 15:.3f}")

@@step
{
  "stepNumber": 1,
  "title": "Does this belong in an artifact?",
  "instruction": "Implement should_be_artifact(text, reusable). Return True only when both conditions hold: the text has more than 15 lines (count them with text.splitlines()), and reusable is true, meaning the user is likely to edit, reuse, or export the content. Otherwise return False. This is the 'substantial and self-contained' rule from Section 1: a long answer that is read once is still conversation, and a short snippet is not worth a panel. [MOD-3.3]",
  "hintConceptual": "Two tests, both required: is it big enough to be worth putting on the table, and will anyone come back to it?",
  "hintSyntax": "return bool(reusable) and len(text.splitlines()) > 15"
}
@@assert
assert should_be_artifact("line\n" * 20, True) is True, "Twenty lines that will be reused belong in an artifact"
assert should_be_artifact("line\n" * 20, False) is False, "A long answer that is read once is conversation"
assert should_be_artifact("a\nb\nc", True) is False, "Three lines are too short, even if reusable"
assert should_be_artifact("line\n" * 15, True) is False, "Exactly 15 lines is not MORE than 15"
assert should_be_artifact("line\n" * 16, True) is True, "Sixteen lines is more than 15"
assert should_be_artifact("", True) is False, "Empty text is not an artifact"
print("Step 1 passed: only substantial, reusable content goes in an artifact.")

@@step
{
  "stepNumber": 2,
  "title": "Generate a self-contained page",
  "instruction": "Implement build_page(title, items). Return one string containing a complete HTML page: the doctype line, a head with a title element holding the title, and a body with an h1 element holding the title and a ul element holding one li element per item. Pass the title and every item through html.escape before putting them in the page, so that characters such as angle brackets and ampersands are displayed as text and not treated as markup. The page must not reference any outside file: put any styling in a style element. This is the self-contained rule from Section 2. [MOD-3.3]",
  "hintConceptual": "Build the list rows first, one per item, then drop them and the title into a fixed page template. Anything that came from outside the template gets escaped on the way in.",
  "hintSyntax": "rows = \"\\n\".join(f\"    <li>{html.escape(item)}</li>\" for item in items)\nreturn (\"<!doctype html>\\n<html>\\n<head>\\n\"\n        f\"  <title>{html.escape(title)}</title>\\n\"\n        \"</head>\\n<body>\\n\"\n        f\"  <h1>{html.escape(title)}</h1>\\n\"\n        f\"  <ul>\\n{rows}\\n  </ul>\\n\"\n        \"</body>\\n</html>\\n\")"
}
@@assert
_page = build_page("Launch checklist", ["Book venue", "Send invites", "Order <b>cake</b> & candles"])
assert isinstance(_page, str), "build_page must return a string"
assert _page.lower().lstrip().startswith("<!doctype html>"), "The page must start with <!doctype html>"
assert "<title>Launch checklist</title>" in _page, "The title element must hold the title"
assert "<h1>Launch checklist</h1>" in _page, "The h1 element must hold the title"
assert _page.count("<li>") == 3 and _page.count("</li>") == 3, f"One li element per item, found {_page.count('<li>')}"
assert "<li>Book venue</li>" in _page and "<li>Send invites</li>" in _page, "Each item must be inside its own li element"
assert "<ul>" in _page and "</ul>" in _page, "The items must be inside a ul element"
assert "&lt;b&gt;cake&lt;/b&gt; &amp; candles" in _page, "Items must be escaped with html.escape"
assert "<b>cake</b>" not in _page, "Unescaped markup from an item reached the page"
assert "<h1>A &amp; B</h1>" in build_page("A & B", []), "The title must be escaped too"
assert build_page("Empty", []).count("<li>") == 0, "No items, no li elements"
assert "http://" not in _page and "https://" not in _page, "The page must not reference outside addresses"
assert _page.index("<title>") < _page.index("<h1>") < _page.index("<li>"), "Order: title, then h1, then the list"
print("Step 2 passed: one file, everything inside it, and outside values escaped.")

@@step
{
  "stepNumber": 3,
  "title": "Find what the sandbox would block",
  "instruction": "Implement lint_artifact(page, allowed_hosts). Create a ReferenceCollector, feed it the page, and look at each (tag, url) pair in its references. Report a problem when all three are true: the tag is in LOADING_TAGS (script, link, img, iframe); the url is an outside address, starting with 'http://', 'https://', or '//'; and its host is not in allowed_hosts. Get the host with urlparse(url).netloc, adding 'https:' in front of a url that starts with '//'. Each problem is the string 'tag: url'. Return the list, in page order. Ordinary a links are not loaded when the page opens, so they are never reported. [MOD-3.3]",
  "hintConceptual": "Ask of each reference: would the browser fetch this on opening the page, does it point outside, and is the place it points to approved? Only a yes, yes, no is a problem.",
  "hintSyntax": "collector = ReferenceCollector()\ncollector.feed(page)\nproblems = []\nfor tag, url in collector.references:\n    if tag in LOADING_TAGS and url.startswith((\"http://\", \"https://\", \"//\")):\n        host = urlparse(\"https:\" + url if url.startswith(\"//\") else url).netloc\n        if host not in allowed_hosts:\n            problems.append(f\"{tag}: {url}\")\nreturn problems"
}
@@assert
assert lint_artifact("<h1>Hello</h1><p>No references here.</p>") == [], "A page with no references has no problems"
assert lint_artifact('<script src="https://cdn.example.com/chart.js"></script>') == ["script: https://cdn.example.com/chart.js"], "An outside script must be reported as the string 'script: url'"
assert lint_artifact('<a href="https://example.com/help">Help</a>') == [], "An ordinary link is not loaded by the page, so it is not a problem"
assert lint_artifact('<img src="logo.png">') == [], "A relative address is not an outside address"
assert lint_artifact('<script src="https://cdnjs.cloudflare.com/x.js"></script>', allowed_hosts=("cdnjs.cloudflare.com",)) == [], "A host on the allowlist is permitted"
assert lint_artifact('<script src="https://cdnjs.cloudflare.com/x.js"></script>') == ["script: https://cdnjs.cloudflare.com/x.js"], "With an empty allowlist every outside host is a problem"
assert lint_artifact('<img src="//tracker.example.net/p.gif">') == ["img: //tracker.example.net/p.gif"], "An address starting with // is an outside address"
assert lint_artifact('<img src="//ok.example/p.gif">', allowed_hosts=("ok.example",)) == [], "The host of a // address must be checked against the allowlist"
_mixed = '<link href="http://fonts.example.org/a.css"><iframe src="https://video.example.com/v"></iframe><script src="app.js"></script>'
assert lint_artifact(_mixed) == ["link: http://fonts.example.org/a.css", "iframe: https://video.example.com/v"], "Report every loading tag with an outside address, in page order"
print("Step 3 passed: the checker reports outside scripts, styles, images, and frames, and ignores ordinary links.")

@@step
{
  "stepNumber": 4,
  "title": "A targeted update that refuses to guess",
  "instruction": "Implement apply_update(text, old, new). Count how many times old occurs in text. If old is an empty string, or the count is not exactly 1, raise ValueError. Otherwise return the text with old replaced by new. This is the targeted update from Section 2: it changes one span and leaves every other character untouched, and it refuses when the target is missing or ambiguous. [MOD-3.3]",
  "hintConceptual": "An edit instruction is only safe if it points at one place. Nowhere and several places are both reasons to stop and ask, not to do something anyway.",
  "hintSyntax": "count = text.count(old) if old else 0\nif count != 1:\n    raise ValueError(f\"expected exactly one match for the old text, found {count}\")\nreturn text.replace(old, new)"
}
@@assert
assert apply_update("Send invites", "invites", "invitations") == "Send invitations", f"One match is replaced, got {apply_update('Send invites', 'invites', 'invitations')!r}"
assert apply_update("a\nb\nc", "b", "B") == "a\nB\nc", "Only the matched span changes"
assert apply_update("price: 10", "10", "") == "price: ", "The replacement may be empty"
def _refuses(text, old, new):
    try:
        apply_update(text, old, new)
    except ValueError:
        return True
    return False
assert _refuses("Launch checklist / Launch checklist", "Launch checklist", "Plan"), "Two matches are ambiguous: raise ValueError"
assert _refuses("Send invites", "Order cake", "x"), "No match: raise ValueError"
assert _refuses("Send invites", "", "x"), "An empty old text is not a target: raise ValueError"
assert _refuses("", "a", "b"), "Nothing can be found in an empty text: raise ValueError"
print("Step 4 passed: a single match is replaced, and missing or ambiguous targets are refused.")

@@step
{
  "stepNumber": 5,
  "title": "Measure the change between versions",
  "instruction": "Implement changed_lines(old, new). Split both texts into lines with splitlines() and pass the two lists to difflib.ndiff. In its output, a line that is only in the new text starts with '+ ' and a line that is only in the old text starts with '- '. Count each kind and return the tuple (added, removed). Lines starting with '? ' or two spaces are not counted. These two numbers are the drift alarm from Section 2: an edit meant to change one line should report (1, 1). [MOD-3.3]",
  "hintConceptual": "A diff labels every line as kept, removed, or added. You only need to count the last two labels.",
  "hintSyntax": "diff = list(difflib.ndiff(old.splitlines(), new.splitlines()))\nadded = sum(1 for line in diff if line.startswith(\"+ \"))\nremoved = sum(1 for line in diff if line.startswith(\"- \"))\nreturn added, removed"
}
@@assert
assert changed_lines("a\nb\nc", "a\nB\nc") == (1, 1), "One line changed is one added and one removed"
assert changed_lines("a\nb\nc", "a\nb\nc") == (0, 0), "Identical texts have no changes"
assert changed_lines("a\nb", "a\nb\nc\nd") == (2, 0), "Two lines appended: two added, none removed"
assert changed_lines("a\nb\nc\nd", "a\nd") == (0, 2), "Two lines deleted: none added, two removed"
assert changed_lines("", "x\ny") == (2, 0), "Everything in a new text is added"
assert changed_lines("Send invites today", "Send invitations today") == (1, 1), "Hint lines starting with '? ' must not be counted"
assert changed_lines("+ plus\n- minus", "+ plus\n- minus") == (0, 0), "Content that begins with + or - is not a change"
print("Step 5 passed: a one-line edit reports (1, 1), and anything much larger is a signal to look.")
