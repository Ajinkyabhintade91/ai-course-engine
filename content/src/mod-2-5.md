@@meta
{
  "moduleId": "MOD-2.5",
  "slug": "mod-2-5",
  "unitId": "UNIT-2",
  "unitTitle": "Unit 2: Mastering ChatGPT",
  "title": "Advanced Prompt Engineering",
  "difficulty": "Intermediate",
  "estimatedMinutes": 100,
  "citations": [
    { "title": "Prompt engineering guide", "source": "OpenAI Docs", "url": "https://developers.openai.com/api/docs/guides/prompt-engineering" },
    { "title": "Reasoning best practices", "source": "OpenAI Docs", "url": "https://developers.openai.com/api/docs/guides/reasoning-best-practices" },
    { "title": "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models", "source": "arXiv", "url": "https://arxiv.org/abs/2201.11903" },
    { "title": "Large Language Models are Zero-Shot Reasoners", "source": "arXiv", "url": "https://arxiv.org/abs/2205.11916" },
    { "title": "Self-Refine: Iterative Refinement with Self-Feedback", "source": "arXiv", "url": "https://arxiv.org/abs/2303.17651" },
    { "title": "Prompting Science Report 3: I'll pay you or I'll kill you, but will you care?", "source": "arXiv", "url": "https://arxiv.org/abs/2508.00614v1" },
    { "title": "Technical report: Threaten or Tip", "source": "Wharton Generative AI Labs", "url": "https://gail.wharton.upenn.edu/research-and-insights/techreport-threaten-or-tip/" },
    { "title": "Prompts are technical debt too", "source": "Sean Goedecke's Blog", "url": "https://seangoedecke.com/prompts-are-technical-debt-too/" }
  ],
  "videoLibrary": [
    {
      "id": "VID-2.5-1",
      "title": "ChatGPT Chain-of-Thought Prompt Explained - LLM Chain of Thoughts for Beginners",
      "creator": "1littlecoder",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=b210W3JWOxw",
      "timingInstruction": "Watch after reading Section 2 (reasoning techniques)",
      "keyTakeaway": "A short explanation of chain-of-thought prompting. It predates reasoning models, so pair it with this chapter's note on when the technique no longer helps."
    },
    {
      "id": "VID-2.5-2",
      "title": "4 Methods of Prompt Engineering",
      "creator": "IBM Technology",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=1c9iyoVIwDs",
      "timingInstruction": "Watch the 'models need tokens to think' section after reading Section 2",
      "keyTakeaway": "Four core prompting methods, including chain-of-thought, compared side by side."
    },
    {
      "id": "VID-2.5-3",
      "title": "Prompt Engineering for ChatGPT",
      "creator": "Vanderbilt University",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/prompt-engineering",
      "timingInstruction": "Take alongside this module; its prompt patterns extend Section 2",
      "keyTakeaway": "A catalogue of reusable prompt patterns with exercises, covering structure, examples, and refinement in more depth than one chapter can."
    },
    {
      "id": "VID-2.5-4",
      "title": "Generative AI: Prompt Engineering Basics",
      "creator": "IBM",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/generative-ai-prompt-engineering-for-everyone",
      "timingInstruction": "Optional shorter alternative",
      "keyTakeaway": "A compact beginner course on prompt structure and common techniques including chain-of-thought."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Build a Prompt Engineering Workbench",
    "context": "Your team keeps rewriting the same product-description prompt by feel, and nobody can say whether the latest version is better than the last. You will build the tools that make prompting an engineering activity: a structured prompt builder, a completeness check, a guard that enforces changing one thing at a time, a pass-rate scorer for comparing versions, and a converter for reasoning models.",
    "language": "python"
  }
}

@@reading
# Advanced Prompt Engineering

Two people ask ChatGPT for the same thing and get results of very different quality. The difference is rarely the model. It is the prompt. This chapter covers the techniques that reliably improve results inside ChatGPT: how to structure a request, how to get better reasoning, how prompting changes for reasoning models, and how to debug a prompt that is not working. Unit 5 treats prompt engineering as a subject in full. This chapter is the practical core you need to work well today.

One theme runs through everything here: **treat prompting as engineering.** That means stating requirements clearly, changing one thing at a time, and testing against fixed examples. It does not mean collecting magic phrases.

## 1. First-Principles Mental Model & Intuition

### The brief for a brilliant new colleague

Imagine handing a task to a very capable colleague who started this morning. They are intelligent and widely read. They know nothing about your company, your customer, your standards, or what you asked for last week. If you say "write something about our new product", you will get something generic, because generic is all they can produce from that.

A good brief for that colleague would say what you are trying to achieve, give them the background they lack, state the limits they must work within, show them an example of what good looks like, and specify what the finished piece should look like.

A language model is that colleague, every single time. It brings enormous general ability and zero knowledge of your situation beyond what is in the context. The quality of the output is bounded by the quality of the brief.

### Why specificity works

There is a mechanical reason for this, and it comes straight from Unit 1. A model produces the most likely continuation of its input. A vague prompt is consistent with millions of possible good answers, and the model returns something near the average of them: safe, generic, bland. Every specific detail you add rules out a large part of that space. You are not persuading the model. You are narrowing the set of answers that fit.

```text
 "Write about our product."
    -> consistent with almost anything -> generic output

 "Write a 60-word product description of our steel water bottle
  for hikers. Mention the 24-hour insulation and the lifetime
  warranty. Plain language, no exclamation marks."
    -> consistent with a small set of answers -> useful output
```

### Senior and junior colleagues

OpenAI's own guidance offers a second analogy that matters once you use reasoning modes. A standard fast model is like a junior colleague: it does best with explicit instructions for each step. A reasoning model is like a senior colleague: you give it the goal and the constraints and trust it to work out the steps. Micromanaging the senior colleague is unnecessary and can make the result worse. Which colleague you are briefing changes how you should write.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### The five components of a structured prompt

| Component | Question it answers | Example |
|---|---|---|
| Goal | What do you want, and why? | "Write a product description that persuades a hiker to buy." |
| Context | What does the model need to know? | "The bottle is steel, holds 750 ml, keeps drinks cold for 24 hours." |
| Constraints | What limits apply? | "Maximum 60 words. No exclamation marks. Do not mention price." |
| Examples | What does good look like? | One or two descriptions you already like |
| Output format | What shape should the answer take? | "One paragraph, then three bullet points of features." |

Not every prompt needs all five. A quick factual question needs only the goal. But when a result disappoints, the cause is almost always a missing component, and running down this list finds it.

**Separate the parts visibly.** Models handle long prompts better when sections are marked. Use Markdown headings for the parts of the prompt and clear delimiters around material you are supplying, such as a document to summarise.

```text
## Goal
Summarise the report below for a board member with two minutes to read it.

## Constraints
- Maximum 120 words
- Lead with the single most important finding

## Report
<report>
... pasted text ...
</report>
```

The tags around the report do real work. They tell the model where your instructions end and the material begins, which reduces the chance that a sentence inside the report is mistaken for an instruction.

**Examples are the strongest lever.** Showing the model one or two examples of the output you want, called **few-shot prompting**, conveys tone, length, and structure more precisely than paragraphs of description. Make the examples varied, or the model will copy their surface features too closely.

### Reasoning techniques

**Chain of thought.** In 2022, researchers at Google showed that giving a model worked examples that include the intermediate reasoning, not just the final answer, substantially improved its performance on arithmetic and logic problems. A second paper the same year found that a single added sentence, "Let's think step by step", with no examples at all, had a similar effect. On one arithmetic benchmark it raised an older model's accuracy from about 18 percent to about 79 percent.

The reason was given in Unit 1. A model generates one token at a time, each conditioned on what came before. If it must produce the answer immediately, all the reasoning has to happen in a single pass. If it writes out the steps first, each step becomes part of the context for the next. Writing the reasoning down gives the model somewhere to compute.

**Self-critique.** A model is often better at finding flaws in a draft than at avoiding them while writing. The Self-Refine method (2023) formalised this as a loop: generate, critique against stated criteria, revise. In ChatGPT this is a two-message technique.

```text
 Message 1:  "Draft the email."
 Message 2:  "Review your draft against these criteria: under 100 words,
              one clear request, no jargon. List what fails, then rewrite."
```

The criteria are essential. "Make it better" gives the model nothing to check against.

**Prompting reasoning models differently.** Reasoning models perform the step-by-step thinking internally, before they answer. OpenAI's guidance for them reverses some older advice:

- Keep prompts simple and direct.
- Do not instruct the model to "think step by step". It already does, and the instruction is unnecessary and can sometimes reduce performance.
- State the goal and the constraints explicitly, for example a budget limit or a deadline.
- Define what success looks like.
- Still use delimiters to separate sections.

| | Standard fast model | Reasoning model |
|---|---|---|
| Role | Junior colleague | Senior colleague |
| Give it | Explicit steps | The goal and constraints |
| "Think step by step" | Helps on multi-step problems | Unnecessary; omit |
| Examples | Very helpful | Helpful for format; less needed for method |
| Best for | Routine, well-defined tasks | Ambiguous, multi-step problems |

### What does not work reliably

Prompting has accumulated a folklore of tricks: offering the model a tip, threatening it, saying please, telling it its career depends on the answer. A 2025 study from the Wharton School tested tipping and threats rigorously, running each question 25 times across difficult benchmarks. The overall result was no meaningful improvement. Individual questions sometimes moved, in either direction and unpredictably. The authors' summary is a good motto for this chapter: prompt engineering is complicated and contingent. Effort spent on clarity pays. Effort spent on incantations does not.

### Debugging a prompt

When a prompt gives poor results, resist the urge to rewrite all of it. Use the same method you would use on a faulty program.

```text
   +-------------+     +------------+     +--------------+     +-----------+
   | REPRODUCE   | --> | DIAGNOSE   | --> | CHANGE ONE   | --> | RE-TEST   |
   | run it on a |     | which of   |     | THING        |     | on the    |
   | fixed set   |     | the five   |     |              |     | SAME set  |
   | of inputs   |     | components |     |              |     |           |
   |             |     | is weak?   |     |              |     |           |
   +-------------+     +------------+     +--------------+     +-----+-----+
          ^                                                          |
          +----------------------------------------------------------+
```

**Why one change at a time.** If you alter $k$ things at once and the output changes, the cause could be any non-empty combination of them. The number of possibilities is

$$
2^{k} - 1
$$

One change has one explanation. Three changes have seven. Five have thirty-one. You cannot learn from an experiment with thirty-one explanations.

**Why a fixed test set.** Output is sampled, so a single run can be good or bad by chance. To compare two versions of a prompt, run each on the same set of $n$ inputs and count how many outputs meet your criteria. The **pass rate** is

$$
\hat{p} = \frac{\text{outputs that pass}}{n}
$$

and, as in Module 1.8, its standard error is $\sqrt{\hat{p}(1-\hat{p})/n}$. With ten test inputs and a pass rate near 50 percent, that is about 0.16. A difference between 5 passes and 6 passes out of 10 is therefore noise. A difference between 3 and 9 is real. Small test sets can only detect large improvements, which is one more reason to prefer clear, structural changes over tweaks.

**Ask the model to help.** Two debugging prompts are consistently useful:

- "Before answering, list anything in my request that is ambiguous or missing." This surfaces the gaps in your brief.
- "Here is my prompt and the output I got. The output is wrong because X. What in the prompt caused this, and how should I change it?" Models are good at this, since reading instructions for ambiguity is exactly their strength.

**Complexity.** Testing $v$ prompt versions on $n$ inputs costs $v \times n$ model calls. That linear cost is the price of knowing whether a change helped.

## 3. Production-Grade Implementation & Annotated Walkthrough

These ideas can be turned into small tools. First, a builder that assembles the five components in a fixed order and refuses a prompt with no goal.

```python
SECTIONS = ["goal", "context", "constraints", "examples", "output_format"]
TITLES = {"goal": "Goal", "context": "Context", "constraints": "Constraints",
          "examples": "Examples", "output_format": "Output format"}

def build_prompt(parts):
    """Assemble labelled sections in a fixed order. Lists become bullet points."""
    if not str(parts.get("goal", "")).strip():
        raise ValueError("a prompt needs a goal")
    blocks = []
    for key in SECTIONS:
        value = parts.get(key)
        if not value:
            continue
        body = "\n".join(f"- {item}" for item in value) if isinstance(value, list) else str(value).strip()
        blocks.append(f"## {TITLES[key]}\n{body}")
    return "\n\n".join(blocks)

def missing_sections(prompt_text):
    """Which of the five components does this prompt lack?"""
    return [TITLES[key] for key in SECTIONS if f"## {TITLES[key]}" not in prompt_text]

v1 = {"goal": "Write a product description for our steel water bottle."}
v2 = dict(v1, context="750 ml, keeps drinks cold for 24 hours, lifetime warranty. Buyers are hikers.",
          constraints=["Maximum 60 words", "No exclamation marks"],
          output_format="One paragraph.")

print(build_prompt(v2))
print("v1 is missing:", missing_sections(build_prompt(v1)))
print("v2 is missing:", missing_sections(build_prompt(v2)))
```

- **A fixed order makes prompts comparable.** When every prompt has its sections in the same sequence, differences between two versions are easy to see and to diff.
- **`raise ValueError` for a missing goal.** A prompt without a goal is a bug, and failing loudly at build time is better than discovering it in the output.
- **Lists become bullets.** Constraints written as separate bullet points are followed more reliably than constraints buried in a sentence, because each is a distinct, checkable item.
- **`missing_sections` is a checklist.** Version 1 lacks four components. Version 2 lacks only examples. The function does not judge quality. It tells you what you have not said.

Second, the discipline of changing one thing, and a scorer for comparing versions.

```python
def changed_sections(old, new):
    """Names of the sections that differ between two versions."""
    return sorted(key for key in SECTIONS if old.get(key) != new.get(key))

def pass_rate(outputs, required_words, max_words):
    """Fraction of outputs that contain every required word and respect the length limit."""
    def passes(text):
        lowered = text.lower()
        return all(word.lower() in lowered for word in required_words) and len(text.split()) <= max_words
    return sum(passes(text) for text in outputs) / len(outputs)

print("changed between v1 and v2:", changed_sections(v1, v2))

outputs_v1 = ["Stay hydrated on any adventure with our amazing bottle!",
              "This bottle is a great companion for everyone, everywhere, every day.",
              "A steel bottle with a lifetime warranty.",
              "Introducing the bottle you never knew you needed, crafted for life."]
outputs_v2 = ["Built for the trail: a 750 ml steel bottle that keeps water cold for 24 hours, backed by a lifetime warranty.",
              "Cold water at the summit. This steel bottle holds 750 ml, insulates for 24 hours, and carries a lifetime warranty.",
              "A hiker's bottle: steel, 750 ml, cold for 24 hours. Lifetime warranty included.",
              "Steel, 750 ml, and cold for a full day on the trail."]

for name, outs in (("v1", outputs_v1), ("v2", outputs_v2)):
    print(name, "pass rate:", pass_rate(outs, ["24 hours", "warranty"], 60))
```

- **`changed_sections` reports three changes between v1 and v2.** That is a warning. Version 2 is plainly better here, but with three sections changed at once you cannot say which mattered. In practice you would add context first and test, then constraints, then format.
- **`pass_rate` turns "looks better" into a number.** The criteria, required facts and a word limit, are stated in advance. Version 1 passes 0 of 4. Version 2 passes 3 of 4, and the one failure is informative: it omitted the warranty and paraphrased "24 hours" as "a full day", so it fails both required checks, which suggests stating both requirements more prominently.
- **The check is deliberately simple.** A substring test can be fooled, for example by "not available for 24 hours". For a first comparison it is adequate. More careful grading uses a second model or a person.

Third, adapting an old prompt for a reasoning model, following the guidance in Section 2.

```python
def adapt_for_reasoning(prompt_text):
    """Remove 'think step by step' style lines, which reasoning models do not need."""
    phrases = ("think step by step", "let's think", "show your reasoning")
    kept = [line for line in prompt_text.splitlines() if not any(p in line.lower() for p in phrases)]
    return "\n".join(kept).strip()

old = "## Goal\nFind the cheapest valid train route.\nLet's think step by step.\n\n## Constraints\n- Budget: 80 euros"
print(adapt_for_reasoning(old))
```

The function deletes whole lines containing the legacy phrases and keeps everything else, including the goal and the constraints, which matter even more for a reasoning model. It is a small demonstration of a larger point: a prompt is written for a particular kind of model, and moving it to another kind is a porting job that deserves a re-test.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Long prompts accrete, and models start dropping instructions.** The usual history of a bad prompt is that someone added a sentence each time something went wrong. After a year it is two pages long, contradicts itself, and the model follows an unpredictable subset. Periodically rewrite from scratch, keeping only rules that you can show fix a real failure.

**Editing without a test set is guessing.** Changing a prompt and looking at one output tells you almost nothing, because output varies from run to run. Keep five to ten fixed inputs and re-run them after each change.

**Prompts are technical debt.** A prompt tuned carefully for one model version may behave differently on the next, which may be more literal, more verbose, or differently trained. Record which model a prompt was written for, and re-test when the model changes. OpenAI's guidance for newer model generations has been to start from the smallest prompt that works, not to carry old prompts forward unchanged.

**Newer models take instructions more literally.** Contradictory or loosely worded instructions that older models smoothed over can now produce odd results, because the model tries to satisfy all of them. Vague emphasis such as writing rules in capital letters can cause over-application. Say what you mean once, plainly.

**Position matters in long prompts.** Put reference material first and the question or instruction after it. With long documents, an instruction placed at the very end is more reliably followed than one placed before thousands of words of pasted text.

**Do not trust a model's explanation of its own reasoning as a transcript.** Asking "why did you do that?" produces a plausible account, not a readout of what happened inside. It is useful for generating hypotheses about your prompt. It is not evidence.

**Role prompts help less than people think.** "You are a world-class expert" changes tone more than accuracy. Describing the audience and the task is more effective than flattering the model. Unit 5 examines the evidence.

**Start a new chat when a conversation goes wrong.** After several rounds of corrections, the context is full of failed attempts that keep influencing the output. It is usually faster to open a new chat and write a better first prompt using what you learned.

**Ask for the format you want.** Current flagship models tend toward long, heavily formatted answers by default. If you want two sentences, or plain paragraphs, or a table, say so explicitly.

**When you have a prompt that works, save it.** A personal library of tested prompts, with a note on what each is for and which model it was tested on, is worth more than any list of tips. Module 2.11 returns to this.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A prompt is a brief for a capable colleague who knows nothing about your situation, and its quality bounds the output. Structured prompts state a goal, context, constraints, examples, and an output format, with sections visibly separated. For standard models, asking for step-by-step reasoning and adding a critique-and-revise pass improve multi-step work, because written-out steps give the model somewhere to compute. Reasoning models do this internally, so they are best given a clear goal, explicit constraints, and success criteria, without instructions about how to think. Folk tricks such as tips and threats do not help reliably. Prompt debugging follows the method of software debugging: reproduce on a fixed set of inputs, diagnose which component is weak, change one thing, and re-test, remembering that small test sets can detect only large differences.

**Question 1.** A colleague's prompt reads: "Write a blog post about our new app. Make it really good." Using the five components, identify what is missing and write an improved version.

<details>
<summary>View Answer</summary>

Only a vague goal is present. There is no context (what the app does, who it is for), no constraints (length, tone, what to avoid), no example of the house style, and no output format. "Really good" is not checkable. An improved version: "Goal: write a blog post that persuades freelance designers to try our invoicing app. Context: the app creates an invoice from a time log in one click, sends payment reminders automatically, and costs nothing for the first three clients. Readers are designers who dislike admin. Constraints: 400 to 500 words, plain conversational English, no superlatives, mention the free tier once. Output format: a headline, four short sections with subheadings, and a one-line call to action." Adding one paragraph from an existing post as an example of tone would complete it.

</details>

**Question 2.** Explain why "Let's think step by step" improved the accuracy of older models on arithmetic problems, and why OpenAI now advises against adding it for reasoning models.

<details>
<summary>View Answer</summary>

A model generates tokens one at a time, each conditioned on everything written so far. If it must output a final answer immediately, the whole calculation has to happen within a single forward pass. When prompted to reason step by step, it writes intermediate results into the context, and each later step can build on the earlier ones, so the written text functions as working memory. That is why accuracy rose sharply on multi-step problems. Reasoning models perform this intermediate thinking internally before producing a visible answer, as a built-in part of how they operate. Telling them to think step by step adds nothing, can interfere with their own process, and can occasionally reduce performance. For them, the useful input is a clear goal, explicit constraints, and success criteria.

</details>

**Question 3.** You change four things in a prompt at once and the results improve from 4 passing outputs out of 10 to 6 out of 10. Give two separate reasons why you have learned very little.

<details>
<summary>View Answer</summary>

First, with four simultaneous changes there are 2 to the power 4 minus 1, which is 15, possible combinations that could explain the difference. You cannot tell which change helped, whether one of them hurt and was masked by the others, or whether they interact. Second, the difference itself may be noise. With ten test inputs and a pass rate around one half, the standard error is roughly 0.16, so a move from 0.4 to 0.6 is only a little more than one standard error and could easily arise from sampling variation alone. To learn something, change one component at a time, use more test inputs, and look for differences that are large compared with the noise.

</details>

@@starter
"""
Lab: Build a Prompt Engineering Workbench
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".

A prompt is described by a dict of parts. Keys (all optional except goal):
  "goal" (str), "context" (str), "constraints" (list of str),
  "examples" (list of str), "output_format" (str)
"""

SECTIONS = ["goal", "context", "constraints", "examples", "output_format"]
TITLES = {
    "goal": "Goal",
    "context": "Context",
    "constraints": "Constraints",
    "examples": "Examples",
    "output_format": "Output format",
}
LEGACY_PHRASES = ("think step by step", "let's think", "show your reasoning")


# ---------------------------------------------------------------- Step 1
def build_prompt(parts):
    """Assemble the prompt text.

    * If "goal" is missing or blank, raise ValueError("a prompt needs a goal").
    * For each key in SECTIONS (in that order) whose value is not empty, add a block:
          "## <title>\\n<body>"
      where <title> comes from TITLES and <body> is
        - for a list:  each item on its own line, prefixed with "- "
        - otherwise:   the text, stripped
    * Join the blocks with a blank line ("\\n\\n") and return the result.
    """
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def missing_sections(prompt_text):
    """Return the TITLES (in SECTIONS order) whose heading "## <title>" does not
    appear in prompt_text."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def changed_sections(old, new):
    """Return a sorted list of the keys in SECTIONS whose values differ between the
    two dicts of parts (a missing key counts as None)."""
    # TODO Step 3a
    return None


def safe_to_test(old, new):
    """True only when EXACTLY ONE section changed (change one thing at a time)."""
    # TODO Step 3b
    return None


# ---------------------------------------------------------------- Step 4
def pass_rate(outputs, required_words, max_words):
    """Fraction of outputs that pass. An output passes when it contains every string in
    required_words (case-insensitive) AND has at most max_words words (text.split()).
    Return 0.0 for an empty list of outputs."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def adapt_for_reasoning(prompt_text):
    """Return the prompt with every line removed that contains any of LEGACY_PHRASES
    (case-insensitive). Keep all other lines in order, joined with newlines, and strip
    leading/trailing whitespace from the result."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    parts = {"goal": "Write a product description.", "constraints": ["Maximum 60 words"]}
    print("prompt   :", build_prompt(parts))
    print("missing  :", missing_sections("## Goal\nWrite something."))
    print("changed  :", changed_sections(parts, dict(parts, context="For hikers.")))
    print("pass rate:", pass_rate(["cold for 24 hours"], ["24 hours"], 60))
    print("adapted  :", adapt_for_reasoning("## Goal\nSolve it.\nLet's think step by step."))

@@solution
"""
Lab solution: Build a Prompt Engineering Workbench
Standard library only.

A prompt is described by a dict of parts. Keys (all optional except goal):
  "goal" (str), "context" (str), "constraints" (list of str),
  "examples" (list of str), "output_format" (str)
"""

SECTIONS = ["goal", "context", "constraints", "examples", "output_format"]
TITLES = {
    "goal": "Goal",
    "context": "Context",
    "constraints": "Constraints",
    "examples": "Examples",
    "output_format": "Output format",
}
LEGACY_PHRASES = ("think step by step", "let's think", "show your reasoning")


# ---------------------------------------------------------------- Step 1
def build_prompt(parts):
    """A fixed section order makes two versions of a prompt easy to compare.

    A prompt with no goal is a bug, so fail loudly here instead of in the output.
    Lists become bullets because separate, checkable items are followed more reliably.
    """
    if not str(parts.get("goal") or "").strip():
        raise ValueError("a prompt needs a goal")
    blocks = []
    for key in SECTIONS:
        value = parts.get(key)
        if not value:
            continue
        if isinstance(value, list):
            body = "\n".join(f"- {item}" for item in value)
        else:
            body = str(value).strip()
        blocks.append(f"## {TITLES[key]}\n{body}")
    return "\n\n".join(blocks)


# ---------------------------------------------------------------- Step 2
def missing_sections(prompt_text):
    """A checklist, not a quality judgement: what have you not said?"""
    return [TITLES[key] for key in SECTIONS if f"## {TITLES[key]}" not in prompt_text]


# ---------------------------------------------------------------- Step 3
def changed_sections(old, new):
    """Which components differ between two versions."""
    return sorted(key for key in SECTIONS if old.get(key) != new.get(key))


def safe_to_test(old, new):
    """With k simultaneous changes there are 2**k - 1 possible explanations for a
    different result. Only k = 1 gives an experiment you can learn from."""
    return len(changed_sections(old, new)) == 1


# ---------------------------------------------------------------- Step 4
def pass_rate(outputs, required_words, max_words):
    """Turn 'looks better' into a number, using criteria fixed in advance."""
    if not outputs:
        return 0.0

    def passes(text):
        lowered = text.lower()
        has_all = all(word.lower() in lowered for word in required_words)
        return has_all and len(text.split()) <= max_words

    return sum(1 for text in outputs if passes(text)) / len(outputs)


# ---------------------------------------------------------------- Step 5
def adapt_for_reasoning(prompt_text):
    """Reasoning models think step by step on their own. Remove the instruction to do
    so and keep the goal and constraints, which matter even more for them."""
    kept = [line for line in prompt_text.splitlines()
            if not any(phrase in line.lower() for phrase in LEGACY_PHRASES)]
    return "\n".join(kept).strip()


if __name__ == "__main__":
    v1 = {"goal": "Write a product description for our steel water bottle."}
    v2 = dict(v1,
              context="750 ml, keeps drinks cold for 24 hours, lifetime warranty. Buyers are hikers.",
              constraints=["Maximum 60 words", "No exclamation marks"],
              output_format="One paragraph.")

    print(build_prompt(v2))
    print()
    print("v1 is missing:", missing_sections(build_prompt(v1)))
    print("v2 is missing:", missing_sections(build_prompt(v2)))
    print("changed between v1 and v2:", changed_sections(v1, v2), "-> safe to test?", safe_to_test(v1, v2))

    outputs_v1 = ["Stay hydrated on any adventure with our amazing bottle!",
                  "This bottle is a great companion for everyone, everywhere, every day.",
                  "A steel bottle with a lifetime warranty.",
                  "Introducing the bottle you never knew you needed, crafted for life."]
    outputs_v2 = ["Built for the trail: a 750 ml steel bottle that keeps water cold for 24 hours, backed by a lifetime warranty.",
                  "Cold water at the summit. This steel bottle holds 750 ml, insulates for 24 hours, and carries a lifetime warranty.",
                  "A hiker's bottle: steel, 750 ml, cold for 24 hours. Lifetime warranty included.",
                  "Steel, 750 ml, and cold for a full day on the trail."]
    for name, outs in (("v1", outputs_v1), ("v2", outputs_v2)):
        print(name, "pass rate:", pass_rate(outs, ["24 hours", "warranty"], 60))

    old = "## Goal\nFind the cheapest valid train route.\nLet's think step by step.\n\n## Constraints\n- Budget: 80 euros"
    print()
    print(adapt_for_reasoning(old))

@@step
{
  "stepNumber": 1,
  "title": "Build a structured prompt",
  "instruction": "Implement build_prompt(parts). If the goal is missing or blank, raise ValueError with the message a prompt needs a goal. Otherwise go through SECTIONS in order. For each key with a non-empty value, create a block: a line with ## and the title from TITLES, then the body. If the value is a list, the body is each item on its own line prefixed with a hyphen and a space; otherwise it is the stripped text. Join the blocks with a blank line. This is the five-component structure from Section 2, in a fixed order so that versions can be compared. [MOD-2.5]",
  "hintConceptual": "Think of a form with five labelled boxes. Empty boxes are left out, the goal box is compulsory, and lists are written as separate bullet points so each can be checked on its own.",
  "hintSyntax": "if not str(parts.get(\"goal\") or \"\").strip():\n    raise ValueError(\"a prompt needs a goal\")\nblocks = []\nfor key in SECTIONS:\n    value = parts.get(key)\n    if not value:\n        continue\n    if isinstance(value, list):\n        body = \"\\n\".join(f\"- {item}\" for item in value)\n    else:\n        body = str(value).strip()\n    blocks.append(f\"## {TITLES[key]}\\n{body}\")\nreturn \"\\n\\n\".join(blocks)"
}
@@assert
_p = build_prompt({"output_format": "One paragraph.", "goal": "  Describe the bottle.  ", "constraints": ["Max 60 words", "No exclamation marks"]})
assert _p == "## Goal\nDescribe the bottle.\n\n## Constraints\n- Max 60 words\n- No exclamation marks\n\n## Output format\nOne paragraph.", f"Unexpected prompt: {_p!r}"
assert build_prompt({"goal": "Just a goal."}) == "## Goal\nJust a goal.", "A prompt with only a goal has one block"
assert build_prompt({"goal": "G", "context": "", "constraints": [], "examples": None}) == "## Goal\nG", "Empty sections must be skipped"
assert build_prompt({"goal": "G", "examples": ["first", "second"]}) == "## Goal\nG\n\n## Examples\n- first\n- second", "Examples given as a list become bullet points"
for _bad in ({}, {"goal": ""}, {"goal": "   "}, {"context": "No goal here."}):
    try:
        build_prompt(_bad)
    except ValueError as _err:
        assert "goal" in str(_err), "The ValueError message should mention the goal"
    else:
        raise AssertionError(f"build_prompt({_bad!r}) must raise ValueError")
print("Step 1 passed: prompts now have a fixed, comparable structure.")

@@step
{
  "stepNumber": 2,
  "title": "Check what a prompt is missing",
  "instruction": "Implement missing_sections(prompt_text). For each key in SECTIONS, in order, check whether the heading made of ## , a space, and the title from TITLES appears in the text. Return a list of the titles that do not appear. When a result disappoints, the cause is usually a missing component, and this is the checklist that finds it. [MOD-2.5]",
  "hintConceptual": "You are not judging how good the prompt is. You are listing which of the five questions it has not answered.",
  "hintSyntax": "return [TITLES[key] for key in SECTIONS if f\"## {TITLES[key]}\" not in prompt_text]"
}
@@assert
assert missing_sections("## Goal\nWrite something.") == ["Context", "Constraints", "Examples", "Output format"], "A goal-only prompt is missing the other four components, in order"
_full = "## Goal\nG\n\n## Context\nC\n\n## Constraints\n- x\n\n## Examples\n- e\n\n## Output format\nF"
assert missing_sections(_full) == [], "A prompt with all five headings is missing nothing"
assert missing_sections("") == ["Goal", "Context", "Constraints", "Examples", "Output format"], "An empty prompt is missing everything"
assert missing_sections("## Output format\nA table.\n\n## Goal\nCompare plans.") == ["Context", "Constraints", "Examples"], "The result follows SECTIONS order, whatever order the prompt uses"
assert missing_sections("Goal: do something. Context: none.") == ["Goal", "Context", "Constraints", "Examples", "Output format"], "Only real '## Title' headings count"
print("Step 2 passed: you can see at a glance what a prompt has left unsaid.")

@@step
{
  "stepNumber": 3,
  "title": "Enforce one change at a time",
  "instruction": "Implement changed_sections(old, new), which returns a sorted list of the keys in SECTIONS whose values differ between the two dicts, treating a missing key as None. Then implement safe_to_test(old, new), which returns True only when exactly one section changed. With several simultaneous changes there are too many possible explanations for a different result, as the formula in Section 2 shows. [MOD-2.5]",
  "hintConceptual": "Compare the two versions component by component. An experiment is informative only if a single thing differs between the two runs.",
  "hintSyntax": "# changed_sections\nreturn sorted(key for key in SECTIONS if old.get(key) != new.get(key))\n\n# safe_to_test\nreturn len(changed_sections(old, new)) == 1"
}
@@assert
_a = {"goal": "Describe the bottle."}
_b = {"goal": "Describe the bottle.", "context": "For hikers."}
_c = {"goal": "Describe the bottle.", "context": "For hikers.", "constraints": ["Max 60 words"], "output_format": "One paragraph."}
assert changed_sections(_a, _b) == ["context"], "Only the context differs between these two versions"
assert changed_sections(_a, _c) == ["constraints", "context", "output_format"], "Three sections differ, returned sorted"
assert changed_sections(_a, dict(_a)) == [], "Identical versions have no changes"
assert changed_sections(_b, _a) == ["context"], "Removing a section also counts as a change"
assert changed_sections({"goal": "G", "note": "x"}, {"goal": "G", "note": "y"}) == [], "Keys outside SECTIONS are ignored"
assert safe_to_test(_a, _b) is True, "One change is safe to test"
assert safe_to_test(_a, _c) is False, "Three changes at once are not safe to test"
assert safe_to_test(_a, dict(_a)) is False, "No change at all is not an experiment"
print("Step 3 passed: your workbench refuses experiments with more than one change.")

@@step
{
  "stepNumber": 4,
  "title": "Score outputs against fixed criteria",
  "instruction": "Implement pass_rate(outputs, required_words, max_words). An output passes when it contains every string in required_words, ignoring case, and has at most max_words words as counted by text.split(). Return the fraction of outputs that pass, or 0.0 if the list is empty. Deciding the criteria before looking at results, and applying them to a fixed set of outputs, is what turns an opinion about a prompt into a measurement. [MOD-2.5]",
  "hintConceptual": "Write down what a good output must contain and how long it may be. Then count how many outputs meet both conditions and divide by the total.",
  "hintSyntax": "if not outputs:\n    return 0.0\n\ndef passes(text):\n    lowered = text.lower()\n    has_all = all(word.lower() in lowered for word in required_words)\n    return has_all and len(text.split()) <= max_words\n\nreturn sum(1 for text in outputs if passes(text)) / len(outputs)"
}
@@assert
_outs = [
    "Cold for 24 hours with a lifetime Warranty.",
    "A steel bottle with a lifetime warranty.",
    "Keeps water cold for 24 HOURS.",
    "This bottle keeps drinks cold for 24 hours and has a warranty that lasts for the whole of your natural life and beyond.",
]
assert pass_rate(_outs, ["24 hours", "warranty"], 12) == 0.25, f"Only the first output has both phrases within 12 words, got {pass_rate(_outs, ['24 hours', 'warranty'], 12)}"
assert pass_rate(_outs, ["24 hours", "warranty"], 100) == 0.5, "With a generous length limit, outputs 1 and 4 pass"
assert pass_rate(_outs, ["24 hours"], 100) == 0.75, "Three outputs mention 24 hours (matching ignores case)"
assert pass_rate(_outs, [], 8) == 0.75, "With no required words only the length limit applies: three outputs have 8 words or fewer"
assert pass_rate([], ["x"], 10) == 0.0, "An empty list of outputs gives 0.0"
assert pass_rate(["exactly five words right here"], [], 5) == 1.0, "An output exactly at the word limit passes"
print("Step 4 passed: 'this version is better' is now a number you can defend.")

@@step
{
  "stepNumber": 5,
  "title": "Adapt a prompt for a reasoning model",
  "instruction": "Implement adapt_for_reasoning(prompt_text). Split the text into lines and drop every line that contains any phrase in LEGACY_PHRASES, ignoring case. Join the remaining lines with newlines and strip leading and trailing whitespace. Reasoning models already think step by step, so the instruction is unnecessary for them, while the goal and constraints that remain are exactly what they need. [MOD-2.5]",
  "hintConceptual": "You are porting a prompt from a junior colleague to a senior one. Remove the instructions about how to think, and keep everything about what is wanted and what the limits are.",
  "hintSyntax": "kept = [line for line in prompt_text.splitlines()\n        if not any(phrase in line.lower() for phrase in LEGACY_PHRASES)]\nreturn \"\\n\".join(kept).strip()"
}
@@assert
_old = "## Goal\nFind the cheapest valid train route.\nLet's think step by step.\n\n## Constraints\n- Budget: 80 euros"
assert adapt_for_reasoning(_old) == "## Goal\nFind the cheapest valid train route.\n\n## Constraints\n- Budget: 80 euros", f"Unexpected result: {adapt_for_reasoning(_old)!r}"
assert adapt_for_reasoning("Solve this.\nTHINK STEP BY STEP before answering.") == "Solve this.", "Matching must ignore case, and the whole line is removed"
assert adapt_for_reasoning("Show your reasoning.\nReturn only the number.") == "Return only the number.", "Other legacy phrases are removed too"
assert adapt_for_reasoning("## Goal\nSummarise the report.") == "## Goal\nSummarise the report.", "A prompt with no legacy phrases is unchanged"
assert adapt_for_reasoning("Let's think step by step.") == "", "A prompt consisting only of a legacy line becomes empty"
assert "Budget" in adapt_for_reasoning(_old), "Constraints must be kept"
print("Step 5 passed: the prompt now states the goal and limits and leaves the thinking to the model.")
