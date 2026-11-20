@@meta
{
  "moduleId": "MOD-2.3",
  "slug": "mod-2-3",
  "unitId": "UNIT-2",
  "unitTitle": "Unit 2: Mastering ChatGPT",
  "title": "Custom Instructions",
  "difficulty": "Foundational",
  "estimatedMinutes": 85,
  "citations": [
    { "title": "OpenAI Model Spec (chain of command)", "source": "OpenAI", "url": "https://model-spec.openai.com/2026-10-29.html" },
    { "title": "Custom instructions for ChatGPT", "source": "OpenAI Help Center", "url": "https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions" },
    { "title": "OpenAI says it's fixed ChatGPT's em dash problem", "source": "TechCrunch", "url": "https://www.techcrunch.com/2025/11/14/openai-says-its-fixed-chatgpts-em-dash-problem/" },
    { "title": "OpenAI says ChatGPT will listen if you tell it not to use em dashes", "source": "Engadget", "url": "https://www.engadget.com/ai/openai-says-chatgpt-will-listen-if-you-tell-it-not-to-use-em-dashes-140000927.html" },
    { "title": "Does the 'Customize ChatGPT' feature actually influence responses across all models?", "source": "OpenAI Community", "url": "https://community.openai.com/t/does-the-customize-chatgpt-feature-actually-influence-responses-across-all-models/1122157" },
    { "title": "Custom instructions no longer work", "source": "OpenAI Community", "url": "https://community.openai.com/t/custom-instructions-no-longer-work/1116521" },
    { "title": "Frustrations with ChatGPT's new tone", "source": "OpenAI Community", "url": "https://community.openai.com/t/frustrations-with-chatgpts-new-tone/1224165" }
  ],
  "videoLibrary": [
    {
      "id": "VID-2.3-1",
      "title": "AI Custom Instructions for Lawyers: ChatGPT and Claude",
      "creator": "Ryan McCarl",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=i2_Raiid288",
      "timingInstruction": "Watch the section on memory and custom instructions after reading Section 1",
      "keyTakeaway": "A worked example of custom instructions written for a professional's daily work, in ChatGPT and Claude."
    },
    {
      "id": "VID-2.3-2",
      "title": "Prompt Engineering for ChatGPT",
      "creator": "Vanderbilt University",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/prompt-engineering",
      "timingInstruction": "The modules on the persona and audience-persona patterns pair with Section 2",
      "keyTakeaway": "Teaches the role, audience, and format patterns that make standing instructions effective, with exercises you can run in ChatGPT."
    },
    {
      "id": "VID-2.3-3",
      "title": "AI Foundations: Prompt Engineering with ChatGPT",
      "creator": "Arizona State University",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/ai-foundations-prompt-engineering-with-chatgpt",
      "timingInstruction": "Optional beginner-level alternative",
      "keyTakeaway": "A gentler introduction to structuring prompts, useful if the Vanderbilt course moves too quickly."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Build a Custom Instructions Workbench",
    "context": "Your agency writes custom instructions for client teams and keeps getting complaints that the assistant ignores some rules and over-applies others. You will build a workbench that checks instructions against the character budget, lints them for the phrasing problems that cause those complaints, assembles the layered prompt the model actually receives, and resolves conflicts between layers.",
    "language": "python"
  }
}

@@reading
# Custom Instructions

If you find yourself typing "keep it short", "I'm a beginner at this", or "use British spelling" at the start of every conversation, you are doing by hand what a settings page can do for you. **Custom instructions** are standing preferences that ChatGPT attaches to every new chat. They take ten minutes to write and, written well, improve every answer you get afterwards. Written badly, they produce an assistant that ignores half of what you asked and applies the other half where it makes no sense. This chapter explains what custom instructions really are, how to write ones that last, and how to tell when a preference belongs somewhere else.

## 1. First-Principles Mental Model & Intuition

### A note handed over before every meeting

Imagine you work with a very capable assistant who has no memory of you from one day to the next. To save time, you write a note and have it placed on their desk before every meeting. It says who you are, what you do, and how you like things done.

That note is your custom instructions. Three properties of the note explain almost everything about how the feature behaves.

1. **It is just text placed in the conversation.** Module 2.1 showed that the application assembles each request from several pieces. Custom instructions are one of those pieces. The model is not retrained, reconfigured, or switched into a mode. It reads your note, along with everything else, and takes it into account.
2. **It is read before every meeting, whatever the meeting is about.** A note that says "always include a code example" will be read before you ask for a dinner recipe.
3. **It is advice, not a control.** The assistant weighs the note against the company's rules, the task in front of them, and what you say in the room. Usually they follow it. Sometimes they do not.

Hold on to the third point. People are regularly surprised that an instruction is not obeyed every single time. A language model does not execute instructions the way a program executes code. It produces the output that best fits everything in its context, and your instruction is one influence among many.

### Two kinds of content

Good custom instructions separate two different things.

- **Facts about you.** Your role, your level of expertise, your location, the tools you use, what you are working on. These help the model pitch its answers.
- **Preferences about responses.** Length, tone, format, what to include, what to leave out.

ChatGPT's settings have reflected this split since the feature launched in July 2023, originally as two boxes: one for what you would like the assistant to know about you, and one for how you would like it to respond. The settings page has since grown, with fields for what to call you, what you do, a choice of overall style or personality, and specific traits. The field names and limits change from time to time. The two underlying questions do not.

### Scope decides where a preference lives

The most useful skill in this chapter is deciding *where* an instruction belongs.

```text
 widest scope                                                    narrowest scope
 +--------------------+   +--------------------+   +--------------------+
 | CUSTOM INSTRUCTIONS|   | PROJECT            |   | THE MESSAGE ITSELF |
 | every new chat     |   | INSTRUCTIONS       |   | this one request   |
 |                    |   | chats in one       |   |                    |
 | "I'm a nurse."     |   | project            |   | "Make this one     |
 | "Be concise."      |   | "Use our client's  |   |  a table."         |
 | "British spelling."|   |  style guide."     |   |                    |
 +--------------------+   +--------------------+   +--------------------+
   true of ALL my work      true of ONE area         true of ONE answer
```

A preference that holds for all your work goes in custom instructions. A preference that holds for one client, subject, or codebase goes in that project's instructions. A preference that holds for one answer goes in the message. Most trouble with custom instructions comes from putting a narrow preference in the widest place.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Where custom instructions sit in the stack

OpenAI publishes a document called the **Model Spec** that describes how its models are meant to behave, including whose instructions take priority. It defines a **chain of command** with levels of authority.

| Level | Who it is | Can be overridden by |
|---|---|---|
| Root | Fundamental rules that nothing overrides | Nobody |
| System | OpenAI's own instructions to the model in its products | Nobody below it |
| Developer | Whoever built the application or assistant you are using | System |
| User | You | System and developer |
| Guideline | Default behaviours the model falls back on | Any explicit instruction above, or context |
| No authority | Text inside tool results, web pages, files, and quotations | It carries no authority at all |

The Model Spec does not use the phrase "custom instructions". They come from you, so the natural reading is that they carry *user-level* authority: above the model's default habits, below OpenAI's rules and below the instructions of whoever built the product you are using. When two instructions at the same level conflict, the Spec's general guidance is that the later one usually prevails.

Three practical consequences follow.

- **Your instruction can change a default.** "Do not use bullet points" overrides the model's habit of using them, because an explicit user instruction outranks a guideline-level default.
- **Your instruction cannot change a rule.** No custom instruction will switch off a safety policy set at a higher level.
- **A message in the chat can override your custom instructions.** If your instructions say "be concise" and your message says "explain this in full detail", the message is later and more specific, and a well-behaved model follows it.

The bottom row deserves a second look, because it is the security principle from Module 1.10 stated as policy: text that arrives inside a document or web page is information, and is not supposed to be treated as a command.

### How project instructions interact

A project has its own instructions, which apply only to chats inside that project. How these combine with your account-level custom instructions is not precisely documented by OpenAI, and secondary sources disagree on whether project instructions replace the account-level ones or are added on top. A safe working model, and the one used in this chapter's lab, is:

1. system and developer rules always win,
2. among your own instructions, the more specific and more recent wins: the current message, then the project's instructions, then your account-level custom instructions.

Because the real behaviour is not guaranteed, avoid relying on it. Do not put "be formal" in your custom instructions and "be casual" in a project and hope the right one wins. Remove the conflict.

### The cost of standing instructions

Custom instructions are included in every request, so they occupy the context window on every turn. If your instructions total $c$ characters, they cost roughly

$$
t \approx \frac{c}{4} \text{ tokens per request}
$$

The fields have historically been limited to about 1,500 characters each. Two full fields are 3,000 characters, or about 750 tokens. Over a conversation of $n$ turns that is $750\,n$ tokens re-read in total: 30,000 tokens across a 40-turn chat. This is small next to a modern context window, and it is not nothing on a plan with a small one.

The more important cost is attention, not tokens. Every instruction competes with every other piece of text in the context. Ten well-chosen lines are followed more reliably than forty, because each additional rule dilutes the rest and raises the chance that two of them conflict. Treat the character limit as a ceiling to stay well under.

### Writing instructions that last

Five properties separate durable instructions from ones that misfire.

**1. Specific.** "Be professional" means something different to everyone, including the model. "Write in plain English, no slang, no exclamation marks" can be checked.

**2. Conditional, not absolute.** Words like "always" and "never" are the main cause of over-application, because they are read before every conversation on every subject.

| Misfires | Holds up |
|---|---|
| Always include a code example. | When I ask a programming question, include a short code example. |
| Never use bullet points. | Write in paragraphs. Use a list only when I ask for steps or a comparison. |
| Always ask clarifying questions. | If a request is ambiguous in a way that would change the answer, ask one question before answering. |

**3. Positive.** Tell the model what to do. "Do not be verbose" names the thing you do not want and leaves the alternative open. "Answer in three sentences or fewer unless I ask for more" gives a target.

**4. Consistent.** "Be concise" and "be thorough and cover every detail" cannot both be satisfied. The model will pick one unpredictably. If you want both, say when each applies.

**5. Testable.** For each line, ask whether you could look at a reply and say yes or no to "did it follow this?" If not, rewrite the line.

A compact template that covers both kinds of content:

```text
ABOUT ME
- Role and field: ...
- Level of expertise in the things I usually ask about: ...
- Location, language, units: ...

HOW TO RESPOND
- Length: ...
- Tone: ...
- Format: ...
- When I ask about <my common task>, do <the specific thing>.
- If you are unsure or lack information, say so plainly.
```

### Testing and iterating

Instructions are a small piece of software and deserve a small test. The method is the one from Module 2.2, scaled down.

1. Choose five to ten prompts that represent what you really ask, including at least two on subjects unrelated to your work, to catch over-application.
2. Save the answers you get with your current instructions.
3. Change **one** line.
4. Open new chats and run the same prompts again. Custom instructions apply to new conversations, so reusing an old chat tests nothing.
5. Compare. Keep the change if it helped and did no harm elsewhere.

Changing several lines at once is the common mistake. If the results improve you will not know which change did it, and if they get worse you will not know which to undo.

### When to move a preference elsewhere

| Symptom | Better home |
|---|---|
| The rule only applies to one client, subject, or codebase | A project's instructions |
| The rule only applies to one kind of repeated task | A project, or a reusable assistant built for that task |
| You need the assistant to consult specific documents | Files attached to a project |
| The rule is true of one answer | The message |
| It is a fact about you that changes over time | Memory, covered in the next module |

One note on reusable assistants. ChatGPT's custom GPTs have been the usual home for task-specific instructions. At the time of writing OpenAI has announced that custom GPTs are being retired in favour of a newer plugin and skills system, starting with enterprise workspaces. Projects are the more stable place for scoped instructions today, and Module 2.6 covers the transition.

## 3. Production-Grade Implementation & Annotated Walkthrough

The checks described above can be automated. This program is a small linter for custom instructions: it measures the character budget and flags the four phrasing problems that cause most complaints.

```python
import re

LIMIT = 1500            # characters per field; confirm the current limit in the settings page

VAGUE = {"good", "nice", "better", "appropriate", "professional", "high-quality"}
ABSOLUTE = {"always", "never"}
CONTRADICTIONS = [("concise", "detailed"), ("brief", "thorough"), ("formal", "casual")]

def check_budget(fields, limit=LIMIT):
    """Characters remaining in each field (negative means over the limit)."""
    return {name: limit - len(text) for name, text in fields.items()}

def lint_instructions(text):
    """Return a sorted list of problem codes found in the instruction text."""
    words = set(re.findall(r"[a-z][a-z'-]*", text.lower()))
    issues = set()
    if words & VAGUE:
        issues.add("vague")
    if words & ABSOLUTE:
        issues.add("absolute")
    if any(a in words and b in words for a, b in CONTRADICTIONS):
        issues.add("contradiction")
    lines = [line.strip().lower() for line in text.splitlines() if line.strip()]
    if len(lines) != len(set(lines)):
        issues.add("duplicate")
    return sorted(issues)

draft = """Be professional.
Always include a code example.
Be concise.
Give detailed explanations of every step.
Be concise."""

better = """Write in plain English with no slang.
When I ask a programming question, include one short code example.
Answer in five sentences or fewer unless I ask for more."""

print(check_budget({"about_me": "I am a nurse.", "how_to_respond": draft}))
print("draft :", lint_instructions(draft))
print("better:", lint_instructions(better))
```

Commentary:

- **`check_budget` uses `len(text)`, which counts characters.** This is the right unit for a character limit. It is not the same as bytes: an emoji or an accented letter is one character and several bytes. Counting bytes would wrongly reject valid instructions in many languages.
- **The limit is a named constant with a warning.** Product limits change. A number buried inside a function is the kind of thing that becomes silently wrong.
- **`re.findall(r"[a-z][a-z'-]*", ...)` extracts whole words.** Matching whole words, and not substrings, matters: a naive `"never" in text` check would fire on "nevertheless", and `"good" in text` would fire on "goodbye".
- **The word set makes each check a set intersection.** `words & VAGUE` is non-empty exactly when at least one vague word is present. This is fast and reads like the rule it implements.
- **The contradiction check needs both members of a pair.** "Concise" alone is fine. "Concise" together with "detailed" is the problem.
- **The duplicate check compares the number of lines with the number of distinct lines.** A repeated instruction wastes budget and, more subtly, signals an instruction set that has grown by accretion and is due for a rewrite.
- **The draft triggers all four codes and the rewrite triggers none.** Compare them line by line: every change follows one of the five properties from Section 2.

A linter cannot judge whether your instructions are *good*. It catches the mechanical faults. Treat a clean result as the starting point for the testing procedure, never as its replacement.

Next, the layered prompt and conflict resolution. This models the stack from Section 2 so you can see why a narrower layer can override a wider one.

```python
ORDER = ["platform", "developer", "custom_instructions", "project", "user_message"]
PRECEDENCE = ["platform", "developer", "user_message", "project", "custom_instructions"]

def assemble_prompt(layers):
    """Text the model receives: every non-empty layer, in ORDER, each under a header."""
    parts = [f"[{name.upper()}]\n{layers[name].strip()}" for name in ORDER if layers.get(name, "").strip()]
    return "\n\n".join(parts)

def resolve(setting, sources):
    """Which layer decides a setting? Return (value, layer) from the first layer in
    PRECEDENCE that defines it, or (None, None)."""
    for layer in PRECEDENCE:
        if setting in sources.get(layer, {}):
            return sources[layer][setting], layer
    return None, None

settings = {
    "custom_instructions": {"length": "concise", "spelling": "British"},
    "project": {"length": "detailed"},
    "user_message": {},
}
print(resolve("length", settings))      # the project is narrower than custom instructions
print(resolve("spelling", settings))    # only custom instructions has an opinion
```

Two different orderings appear, and the difference is the point. `ORDER` is the sequence in which text appears in the prompt, widest scope first and your message last. `PRECEDENCE` is who wins a conflict: the platform and developer first, then your sources from narrowest to widest. Position in the prompt and authority are separate ideas, and confusing them is why people expect a rule placed "at the top" to beat everything below it. As Section 2 said, the exact precedence between project and account-level instructions is this chapter's working model, and the dependable practice is to avoid creating the conflict.

**Complexity.** The linter is linear in the length of the text. Assembly and resolution are linear in the number of layers, which is a small constant.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Compliance is probabilistic.** The most common complaint on user forums is that custom instructions are "ignored". Sometimes there is a real bug or a model that handles them poorly. More often an instruction is being outweighed by something else in the context: a long conversation, a strong default habit, or a conflicting line. The em dash is the well-known case. For a long time users could not stop ChatGPT using it. In November 2025 OpenAI said the model would follow a no-em-dash rule set in custom instructions, and users continued to report lapses afterwards. Expect a good instruction to work most of the time, and build in a check for anything that must hold every time.

**Phrase stubborn preferences as a rewrite.** For habits the model clings to, practitioners report better results from telling it what to do instead: "if a sentence would contain a dash, rewrite it as two sentences" works better than "never use dashes".

**Absolute rules leak everywhere.** "Always end with a follow-up question" sounds helpful until it is appended to a one-word answer or a poem. If you see a rule being applied where it makes no sense, look for "always" or "never" and add the condition under which it applies.

**Anti-flattery instructions overshoot.** Many users add "be brutally honest" or "no sugar-coating" to counter the model's tendency to agree with them. This often produces manufactured criticism of sound ideas. A more precise instruction gets a better result: "If my plan has a flaw, state it first. If it does not, say so in one line."

**Custom instructions apply to new chats.** Editing them does not change a conversation already in progress. People test a change in the same chat, see no difference, and conclude the feature is broken.

**Fewer rules, followed better.** Long instruction sets that have grown one complaint at a time are the hardest to get right. Rewrite from scratch every few months, keeping only the lines you can show are doing something.

**Do not paste secrets or sensitive personal details.** Your instructions are sent with every conversation and can be read back by anyone who has access to your account. Keep them to what the model needs in order to pitch its answers.

**Instructions do not cross products.** Custom instructions set in the ChatGPT app do not apply to the developer API, and the same model reached through another company's product has that company's instructions, not yours.

**Check what is shared in a workspace.** In team and enterprise workspaces an administrator may set instructions or restrict personalisation. If your settings behave differently at work, that is the likely reason.

**Model changes can break tuned instructions.** An instruction set refined for one model generation may behave differently on the next, which may be more literal or have different defaults. Keep your test prompts and re-run them after a major model update.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Custom instructions are standing text that the application adds to every new conversation: facts about you and preferences about responses. They carry user-level authority, which means they can change the model's default habits, cannot override rules set by OpenAI or by the builder of a product, and can themselves be overridden by a later, more specific message. They cost context on every turn and compete for attention, so short sets work better than long ones. Durable instructions are specific, conditional, positive, consistent, and testable. They should be tested like software, with a fixed set of prompts and one change at a time, and any preference that applies to only one area of work belongs in a project, not in the account-wide settings.

**Question 1.** A user's custom instructions say "Always respond in a formal tone." In one chat they write, "Give me a silly limerick about my cat." What should a well-behaved model do, and which idea from the chain of command explains it?

<details>
<summary>View Answer</summary>

It should write a silly limerick. Both the custom instruction and the message come from the user and carry the same level of authority, and when two instructions at the same level conflict, the later and more specific one generally prevails. The message is a direct, current request that plainly calls for a playful tone, so it overrides the standing preference for this answer. The episode also shows why the instruction was badly phrased: "always" made it apply to requests where the user did not want it. A better version is "Use a formal tone for work-related writing."

</details>

**Question 2.** Rewrite this instruction set so that it satisfies the five properties from Section 2, and say what was wrong with each original line: "Be professional. Never use lists. Be concise but explain everything in detail."

<details>
<summary>View Answer</summary>

"Be professional" is vague: it cannot be checked and means different things to different readers. Replace it with something specific, such as "Write in plain English with no slang or exclamation marks." "Never use lists" is absolute and negative: it will be applied even when a list is the right format, and it does not say what to do instead. Replace it with "Write in paragraphs. Use a numbered list only when I ask for steps." "Be concise but explain everything in detail" is contradictory: the model cannot do both and will choose unpredictably. Replace it with a conditional: "Answer in five sentences or fewer. If I ask you to explain, give the full reasoning." The rewritten lines are specific, conditional, positive, consistent, and each can be checked against a reply.

</details>

**Question 3.** You work for three clients, each with its own style guide, and you also want British spelling and short answers in everything you do. Where should each of these preferences live, and why?

<details>
<summary>View Answer</summary>

British spelling and short answers are true of all your work, so they belong in the account-level custom instructions, which apply to every new chat. Each client's style guide is true of one area of work only, so it belongs in a separate project for that client, as the project's instructions and attached files. Putting a client's style guide in the custom instructions would apply it to the other two clients and to your personal chats, and would consume context in every conversation. Anything that applies to a single answer, such as "make this one a table", goes in the message. Matching the scope of a preference to the scope of the place it is stored is what prevents over-application and conflicts.

</details>

@@starter
"""
Lab: Build a Custom Instructions Workbench
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import re

LIMIT = 1500    # characters per field (confirm the current limit in the product's settings)

VAGUE = {"good", "nice", "better", "appropriate", "professional", "high-quality"}
ABSOLUTE = {"always", "never"}
CONTRADICTIONS = [("concise", "detailed"), ("brief", "thorough"), ("formal", "casual")]

# The order in which layers APPEAR in the prompt (widest scope first, your message last).
ORDER = ["platform", "developer", "custom_instructions", "project", "user_message"]

# Who WINS a conflict (first entry wins).
PRECEDENCE = ["platform", "developer", "user_message", "project", "custom_instructions"]


# ---------------------------------------------------------------- Step 1
def check_budget(fields, limit=LIMIT):
    """fields maps a field name to its text. Return a dict mapping each field name to
    the characters remaining: limit - len(text). A negative number means over the limit."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def lint_instructions(text):
    """Return a SORTED list of the problem codes found in `text`:
         "vague"         - any word from VAGUE appears
         "absolute"      - any word from ABSOLUTE appears
         "contradiction" - BOTH words of any pair in CONTRADICTIONS appear
         "duplicate"     - the same non-empty line appears more than once (ignore case
                           and surrounding spaces)
       Find words with  re.findall(r"[a-z][a-z'-]*", text.lower())  so that only WHOLE
       words match ("nevertheless" must not count as "never")."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def assemble_prompt(layers):
    """layers maps a layer name to its text. Return one string made of every layer in
    ORDER whose text is not empty (after .strip()), each formatted as

        [LAYER_NAME_IN_UPPER_CASE]
        the stripped text

    with a blank line between layers. Layers missing from the dict are skipped."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def resolve(setting, sources):
    """sources maps a layer name to a dict of settings, e.g.
         {"custom_instructions": {"length": "concise"}, "project": {"length": "detailed"}}
    Go through PRECEDENCE in order and return (value, layer_name) from the first layer
    that defines `setting`. Return (None, None) if no layer defines it."""
    # TODO Step 4
    return None


if __name__ == "__main__":
    print("budget  :", check_budget({"about_me": "I am a nurse."}))
    print("lint    :", lint_instructions("Be professional.\nAlways be concise."))
    print("prompt  :", assemble_prompt({"custom_instructions": "Be concise.", "user_message": "Hi"}))
    print("resolve :", resolve("length", {"custom_instructions": {"length": "concise"}}))

@@solution
"""
Lab solution: Build a Custom Instructions Workbench
Standard library only.
"""
import re

LIMIT = 1500    # characters per field (confirm the current limit in the product's settings)

VAGUE = {"good", "nice", "better", "appropriate", "professional", "high-quality"}
ABSOLUTE = {"always", "never"}
CONTRADICTIONS = [("concise", "detailed"), ("brief", "thorough"), ("formal", "casual")]

# The order in which layers APPEAR in the prompt (widest scope first, your message last).
ORDER = ["platform", "developer", "custom_instructions", "project", "user_message"]

# Who WINS a conflict (first entry wins).
PRECEDENCE = ["platform", "developer", "user_message", "project", "custom_instructions"]


# ---------------------------------------------------------------- Step 1
def check_budget(fields, limit=LIMIT):
    """len() counts characters, which is the unit the limit is expressed in.

    Counting bytes would wrongly reject valid text containing accented letters or emoji.
    """
    return {name: limit - len(text) for name, text in fields.items()}


# ---------------------------------------------------------------- Step 2
def lint_instructions(text):
    """Catch the mechanical faults that cause most 'it ignores my instructions' complaints.

    Whole-word matching matters: a substring test for "never" would fire on "nevertheless".
    A clean result means the instructions are ready to TEST, not that they are good.
    """
    words = set(re.findall(r"[a-z][a-z'-]*", text.lower()))
    issues = set()
    if words & VAGUE:
        issues.add("vague")
    if words & ABSOLUTE:
        issues.add("absolute")
    if any(first in words and second in words for first, second in CONTRADICTIONS):
        issues.add("contradiction")
    lines = [line.strip().lower() for line in text.splitlines() if line.strip()]
    if len(lines) != len(set(lines)):
        issues.add("duplicate")
    return sorted(issues)


# ---------------------------------------------------------------- Step 3
def assemble_prompt(layers):
    """What the model actually receives: your instructions are one labelled block among several.

    Custom instructions are text in the context, read on every turn. Nothing about the
    model itself changes.
    """
    parts = []
    for name in ORDER:
        text = layers.get(name, "").strip()
        if text:
            parts.append(f"[{name.upper()}]\n{text}")
    return "\n\n".join(parts)


# ---------------------------------------------------------------- Step 4
def resolve(setting, sources):
    """Position in the prompt (ORDER) and authority (PRECEDENCE) are different things.

    This precedence is a working model: platform and developer rules win, then your
    own sources from narrowest to widest. The dependable practice is to avoid
    creating the conflict in the first place.
    """
    for layer in PRECEDENCE:
        if setting in sources.get(layer, {}):
            return sources[layer][setting], layer
    return None, None


if __name__ == "__main__":
    draft = ("Be professional.\nAlways include a code example.\nBe concise.\n"
             "Give detailed explanations of every step.\nBe concise.")
    better = ("Write in plain English with no slang.\n"
              "When I ask a programming question, include one short code example.\n"
              "Answer in five sentences or fewer unless I ask for more.")

    print(check_budget({"about_me": "I am a nurse.", "how_to_respond": draft}))
    print("draft :", lint_instructions(draft))
    print("better:", lint_instructions(better))

    print()
    print(assemble_prompt({
        "platform": "You are ChatGPT. Follow OpenAI's policies.",
        "custom_instructions": better,
        "project": "Client: Northwind. Follow the Northwind style guide.",
        "user_message": "Draft a two-line product update.",
    }))

    print()
    settings = {
        "custom_instructions": {"length": "concise", "spelling": "British"},
        "project": {"length": "detailed"},
        "user_message": {},
    }
    for key in ("length", "spelling", "emoji"):
        print(f"{key:>8} -> {resolve(key, settings)}")

@@step
{
  "stepNumber": 1,
  "title": "Check the character budget",
  "instruction": "Implement check_budget(fields, limit). The argument maps each field name to its text. Return a dict mapping each field name to the number of characters remaining, which is limit minus len(text). A negative number means the field is over the limit. Custom instruction fields have a character limit, and every character is re-sent with every request, so staying well under the limit is the goal. [MOD-2.3]",
  "hintConceptual": "The limit is counted in characters, and len() on a string counts characters. You want one number per field showing how much room is left.",
  "hintSyntax": "return {name: limit - len(text) for name, text in fields.items()}"
}
@@assert
_b = check_budget({"about_me": "I am a nurse.", "how_to_respond": "x" * 1600})
assert isinstance(_b, dict) and set(_b) == {"about_me", "how_to_respond"}, "check_budget must return one entry per field"
assert _b["about_me"] == 1487, f"'I am a nurse.' is 13 characters, leaving 1487, got {_b.get('about_me')}"
assert _b["how_to_respond"] == -100, "1600 characters is 100 over the limit: -100"
assert check_budget({"a": ""}) == {"a": 1500}, "An empty field has the whole limit remaining"
assert check_budget({"a": "hello"}, limit=3) == {"a": -2}, "The limit argument must be respected"
assert check_budget({"a": "café \U0001F600"}) == {"a": 1494}, "Count characters, not bytes: an accented letter and an emoji are one character each"
assert check_budget({}) == {}, "No fields gives an empty dict"
print("Step 1 passed: you can see how much room each field has left.")

@@step
{
  "stepNumber": 2,
  "title": "Lint the instructions",
  "instruction": "Implement lint_instructions(text). Extract the set of lower-case words with re.findall(r\"[a-z][a-z'-]*\", text.lower()). Add 'vague' if any word is in VAGUE, 'absolute' if any word is in ABSOLUTE, and 'contradiction' if both words of any pair in CONTRADICTIONS are present. Add 'duplicate' if any non-empty line, compared after strip() and lower(), appears more than once. Return the codes as a sorted list. These are the four phrasing faults from Section 2 that cause instructions to be ignored or over-applied. [MOD-2.3]",
  "hintConceptual": "Each check asks one question about the set of words: is there a word nobody could measure, a word that applies everywhere, or a pair that cannot both be satisfied? The duplicate check compares how many lines there are with how many different lines there are.",
  "hintSyntax": "words = set(re.findall(r\"[a-z][a-z'-]*\", text.lower()))\nissues = set()\nif words & VAGUE:\n    issues.add(\"vague\")\nif words & ABSOLUTE:\n    issues.add(\"absolute\")\nif any(first in words and second in words for first, second in CONTRADICTIONS):\n    issues.add(\"contradiction\")\nlines = [line.strip().lower() for line in text.splitlines() if line.strip()]\nif len(lines) != len(set(lines)):\n    issues.add(\"duplicate\")\nreturn sorted(issues)"
}
@@assert
_draft = "Be professional.\nAlways include a code example.\nBe concise.\nGive detailed explanations of every step.\nBe concise."
assert lint_instructions(_draft) == ["absolute", "contradiction", "duplicate", "vague"], f"The draft has all four problems, got {lint_instructions(_draft)}"
_better = "Write in plain English with no slang.\nWhen I ask a programming question, include one short code example.\nAnswer in five sentences or fewer unless I ask for more."
assert lint_instructions(_better) == [], f"The rewritten instructions should be clean, got {lint_instructions(_better)}"
assert lint_instructions("Nevertheless, say goodbye warmly.") == [], "Match whole words only: 'nevertheless' is not 'never' and 'goodbye' is not 'good'"
assert lint_instructions("NEVER use slang.") == ["absolute"], "Matching must ignore case"
assert lint_instructions("Be concise.") == [], "One half of a contradictory pair is not a contradiction"
assert lint_instructions("Be formal at work.\nBe casual with friends.") == ["contradiction"], "'formal' and 'casual' together are flagged"
assert lint_instructions("Use metric units.\n\n  use metric units.  ") == ["duplicate"], "Duplicate lines are detected ignoring case, spaces, and blank lines"
assert lint_instructions("") == [], "Empty text has no problems"
print("Step 2 passed: your linter catches vague, absolute, contradictory, and duplicated rules.")

@@step
{
  "stepNumber": 3,
  "title": "Assemble the layered prompt",
  "instruction": "Implement assemble_prompt(layers). Go through the names in ORDER. For each one whose text in the layers dict is non-empty after strip(), produce a block consisting of the name in upper case inside square brackets, a newline, and the stripped text. Join the blocks with a blank line between them and return the string. Layers that are missing or empty are skipped. This shows what custom instructions really are: one labelled block of text among several that the model reads on every turn. [MOD-2.3]",
  "hintConceptual": "The application stacks several sources of instructions into one text, from the widest scope to your message. Your custom instructions are the middle of that stack, not a special mode.",
  "hintSyntax": "parts = []\nfor name in ORDER:\n    text = layers.get(name, \"\").strip()\n    if text:\n        parts.append(f\"[{name.upper()}]\\n{text}\")\nreturn \"\\n\\n\".join(parts)"
}
@@assert
_p = assemble_prompt({"user_message": "Hi", "custom_instructions": "Be concise.", "platform": "Follow policy."})
assert _p == "[PLATFORM]\nFollow policy.\n\n[CUSTOM_INSTRUCTIONS]\nBe concise.\n\n[USER_MESSAGE]\nHi", f"Layers must appear in ORDER regardless of dict order, got {_p!r}"
assert assemble_prompt({"project": "  Use the style guide.  \n"}) == "[PROJECT]\nUse the style guide.", "Text must be stripped"
assert assemble_prompt({"custom_instructions": "   ", "user_message": "Hello"}) == "[USER_MESSAGE]\nHello", "Empty or whitespace-only layers are skipped"
assert assemble_prompt({}) == "", "No layers gives an empty string"
assert assemble_prompt({"unknown_layer": "x", "user_message": "Hi"}) == "[USER_MESSAGE]\nHi", "Layers not listed in ORDER are ignored"
_all = assemble_prompt({name: name for name in ORDER})
assert [line for line in _all.splitlines() if line.startswith("[")] == ["[PLATFORM]", "[DEVELOPER]", "[CUSTOM_INSTRUCTIONS]", "[PROJECT]", "[USER_MESSAGE]"], "All five layers must appear in ORDER"
print("Step 3 passed: your instructions are one labelled block in the text the model reads.")

@@step
{
  "stepNumber": 4,
  "title": "Resolve a conflict between layers",
  "instruction": "Implement resolve(setting, sources). The sources dict maps a layer name to a dict of settings. Go through PRECEDENCE in order and return a tuple of the value and the layer name from the first layer that defines the setting. If no layer defines it, return (None, None). Notice that PRECEDENCE differs from ORDER: the platform and developer win, then your own sources from the narrowest (the message) to the widest (custom instructions). Position in the prompt and authority are separate ideas. [MOD-2.3]",
  "hintConceptual": "When two layers disagree, the one with more authority decides. Among your own instructions, the more specific one wins, because it was written with this particular situation in mind.",
  "hintSyntax": "for layer in PRECEDENCE:\n    if setting in sources.get(layer, {}):\n        return sources[layer][setting], layer\nreturn None, None"
}
@@assert
_src = {
    "custom_instructions": {"length": "concise", "spelling": "British"},
    "project": {"length": "detailed"},
    "user_message": {},
}
assert resolve("length", _src) == ("detailed", "project"), "The project is narrower than custom instructions and wins"
assert resolve("spelling", _src) == ("British", "custom_instructions"), "Only custom instructions defines spelling"
assert resolve("emoji", _src) == (None, None), "A setting nobody defines returns (None, None)"
_src["user_message"] = {"length": "one line"}
assert resolve("length", _src) == ("one line", "user_message"), "The current message overrides both project and custom instructions"
_src["developer"] = {"length": "max 50 words"}
assert resolve("length", _src) == ("max 50 words", "developer"), "A developer rule outranks everything from the user"
_src["platform"] = {"length": "policy limit"}
assert resolve("length", _src) == ("policy limit", "platform"), "A platform rule outranks the developer"
assert resolve("length", {}) == (None, None), "With no sources there is nothing to resolve"
assert resolve("tone", {"project": {"tone": None}}) == (None, "project"), "A layer that defines the setting (even as None) is the one that decides"
print("Step 4 passed: narrower beats wider among your own instructions, and platform rules beat them all.")
