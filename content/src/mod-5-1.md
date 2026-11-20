@@meta
{
  "moduleId": "MOD-5.1",
  "slug": "mod-5-1",
  "unitId": "UNIT-5",
  "unitTitle": "Unit 5: Complete Prompt Engineering Master Class",
  "title": "Anatomy of a Perfect Prompt",
  "difficulty": "Foundational",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "Prompting best practices", "source": "Anthropic Docs", "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
    { "title": "Prompt engineering", "source": "OpenAI API Docs", "url": "https://developers.openai.com/api/docs/guides/prompt-engineering" },
    { "title": "Gemini for Google Workspace Prompting Guide 101", "source": "Google", "url": "https://services.google.com/fh/files/misc/gemini-for-google-workspace-prompting-guide-101.pdf" },
    { "title": "Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design", "source": "arXiv", "url": "https://arxiv.org/abs/2310.11324" },
    { "title": "Prompting Science Report 1: Prompt Engineering is Complicated and Contingent", "source": "Wharton Generative AI Labs", "url": "https://gail.wharton.upenn.edu/research-and-insights/tech-report-prompt-engineering-is-complicated-and-contingent/" },
    { "title": "The Prompt Report: A Systematic Survey of Prompt Engineering Techniques", "source": "arXiv", "url": "https://arxiv.org/abs/2406.06608" },
    { "title": "Mastering the art of prompt engineering with Empower", "source": "GovTech Singapore", "url": "https://www.tech.gov.sg/technews/mastering-the-art-of-prompt-engineering-with-empower/" }
  ],
  "videoLibrary": [
    {
      "id": "VID-5.1-1",
      "title": "Master the Perfect ChatGPT Prompt Formula (in just 8 minutes)!",
      "creator": "Jeff Su",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=jC4v5AS4RIM",
      "timingInstruction": "Watch the first twenty minutes before Section 2, for the idea of a model as a predictor of what comes next",
      "keyTakeaway": "A compact formula covering the parts of an effective prompt."
    },
    {
      "id": "VID-5.1-2",
      "title": "AI prompt engineering: A deep dive",
      "creator": "Anthropic",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=T9aRN5JkmL8",
      "timingInstruction": "Watch after reading Section 2",
      "keyTakeaway": "People who write prompts for a living discuss what makes one good: clear communication of a task to a reader with no context, far more than tricks or formulas."
    },
    {
      "id": "VID-5.1-3",
      "title": "Google Prompting Essentials",
      "creator": "Google",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/google-prompting-essentials",
      "timingInstruction": "Take alongside Unit 5",
      "keyTakeaway": "Google's short course on writing clear prompts, built around a small set of components close to the six in this chapter."
    },
    {
      "id": "VID-5.1-4",
      "title": "Prompt Engineering for ChatGPT",
      "creator": "Vanderbilt University",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/prompt-engineering",
      "timingInstruction": "Take after this module for a catalogue of reusable prompt patterns",
      "keyTakeaway": "A widely taken course that names and teaches recurring prompt patterns, which later modules of this unit draw on."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Build a Prompt, Review It, and Measure What Specificity Does",
    "context": "A team wants its prompts written to a common standard and wants to understand, with numbers, why a detailed prompt beats a vague one. You will build a prompt assembler for the six components, a review checklist, the entropy of a distribution of possible answers, the effect of each added constraint on that distribution, and a measure of how consistent a prompt's answers are across repeated runs.",
    "language": "python"
  }
}

@@reading
# Anatomy of a Perfect Prompt

Units 2 and 3 taught prompting as you needed it, tool by tool. This unit treats it as a subject of its own. It begins with the question that everything else depends on: what is a prompt made of, and why do some produce excellent results and others produce mush?

The title promises a "perfect" prompt, and it is worth saying at once that there is no such thing in general. There are prompts that are complete for their task and prompts that are not. This chapter names the parts a complete prompt has, explains with a little probability why being specific works, and gives you a template and a checklist to use for the rest of the course.

## 1. First-Principles Mental Model & Intuition

### Briefing a capable stranger

Imagine handing a piece of work to a contractor who is intelligent, well read, fast, and has never met you. They do not know your company, your audience, your standards, or what you tried last week. They will do exactly what the brief says, and where the brief is silent they will do something reasonable and generic.

Give that person "write something about our new product" and you will receive something about your new product: a competent, average, forgettable page. The contractor did nothing wrong. The brief described almost nothing.

Anthropic's documentation offers a test built on this picture. Show your prompt to a colleague who has little context on the task and ask them to follow it. If they would be confused, the model will be too.

The model is that stranger. A prompt is a brief, and prompt engineering is mostly the ordinary skill of writing a clear one.

### Six parts

A complete brief answers six questions. These are the components of a prompt.

```text
   +----------------+------------------------------------------------------+
   | ROLE           | Who should the model be, and for whom is it writing? |
   | TASK           | What exactly should it do?                           |
   | CONTEXT        | What does it need to know that it cannot guess?      |
   | CONSTRAINTS    | What limits apply? What must it avoid?               |
   | EXAMPLES       | What does a good result look like?                   |
   | OUTPUT FORMAT  | In what shape should the answer arrive?              |
   +----------------+------------------------------------------------------+
```

Not every prompt needs all six. "What is the capital of Peru?" needs only a task. The longer and more particular the work, the more of the six it needs, and when a result disappoints, the cause is nearly always that one of them was missing.

### One prompt, before and after

```text
BEFORE

Write something about our new product.
```

```text
AFTER

ROLE: You are a copywriter for a company that sells accounting software to
freelancers. You are writing to existing customers.

CONTEXT: We are launching automatic receipt scanning on 3 March. It is included
in every plan at no extra cost. Customers have asked for it for two years.

TASK: Write the announcement email.

CONSTRAINTS:
- At most 120 words.
- Plain language. No exclamation marks.
- Do not mention competitors or pricing.

EXAMPLES: Our last announcement began: "You asked for bank feeds. They arrive on Monday."

OUTPUT FORMAT: A subject line, then the body as two short paragraphs.
```

The second prompt is about sixteen times longer and took two minutes to write. It will produce in one attempt what the first would not produce in ten.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### The six components in detail

| Component | What it supplies | Typical mistake |
|---|---|---|
| **Role** | A point of view and an audience: vocabulary, register, what to assume the reader knows | A grand title with no audience: "You are a world-class expert" |
| **Task** | The action, stated with a verb and an object | A topic in place of a task: "our new product" |
| **Context** | Facts the model has no way to know: your situation, your data, what has been tried | Assuming it knows what you know |
| **Constraints** | Length, scope, tone, and what must not appear | Only negatives, with nothing said about what to do |
| **Examples** | A sample of the desired output, which conveys more than description can | One example, which is then copied too closely |
| **Output format** | The structure of the answer: headings, a table, a list, a particular order | Left unstated, then fixed by hand every time |

Each has its own module later in this unit: roles in 5.2, context in 5.3, examples in 5.4, and structured output in 5.5.

The task deserves a special word. It is the one component that can never be omitted, and it should begin with a verb: write, summarise, compare, extract, classify, translate, critique. A prompt with no clear verb is a topic, and a model given a topic will choose its own task.

### Why specificity works: a prompt conditions a distribution

Module 1.4 explained that a language model does not look up an answer. Given the text so far, it produces a probability distribution over what could come next, and samples from it. Write $x$ for your prompt and $y$ for a complete response. The model defines

$$
P(y \mid x)
$$

a distribution over every response it could give to that prompt. A vague prompt is compatible with an enormous range of responses: different topics, lengths, tones, audiences, and formats. The probability is spread thinly over all of them. What you receive is a sample from that spread, and it tends to land near the middle: the generic answer.

Each detail you add is a condition. Adding a constraint $c$ replaces the distribution with

$$
P(y \mid x, c) = \frac{P(y, c \mid x)}{P(c \mid x)}
$$

In words: discard every response that violates the constraint, and rescale what is left so that it sums to one. Responses you would not have wanted lose their probability, and it flows to the ones you would.

The spread of a distribution can be measured. Its **entropy**, in bits, is

$$
H = -\sum_{y} P(y) \log_2 P(y)
$$

High entropy means many roughly equally likely outcomes. Zero entropy means one certain outcome. A constraint that rules out half of the equally likely possibilities removes exactly one bit.

A toy example makes this concrete. Suppose the prompt "Tell me about Python" could be answered in eight ways, according to three things the prompt leaves open: the topic (the programming language or the snake), the depth (for a beginner or an expert), and the form (a paragraph or bullet points).

| Topic | Depth | Form | Probability |
|---|---|---|---|
| language | beginner | paragraph | 0.30 |
| language | beginner | bullets | 0.15 |
| language | expert | paragraph | 0.15 |
| language | expert | bullets | 0.10 |
| snake | beginner | paragraph | 0.15 |
| snake | beginner | bullets | 0.05 |
| snake | expert | paragraph | 0.07 |
| snake | expert | bullets | 0.03 |

The entropy of this distribution is about 2.72 bits. Suppose what you actually wanted was the programming language, for an expert, as bullet points. That outcome has probability 0.10. One attempt in ten gives you what you wanted.

Now add the details one at a time.

| Prompt | Outcomes left | Entropy | Chance of what you wanted |
|---|---|---|---|
| "Tell me about Python" | 8 | 2.72 bits | 0.10 |
| ... the programming language | 4 | 1.88 bits | 0.14 |
| ... for an experienced developer | 2 | 0.97 bits | 0.40 |
| ... as bullet points | 1 | 0 bits | 1.00 |

Three short phrases took the chance of the right answer from one in ten to certainty. In the real model the outcomes number in the trillions and no prompt reduces them to one, but the mechanism is the same: every specific detail removes responses you did not want.

### The cost of vagueness, in attempts

If each attempt independently has probability $p$ of being what you wanted, the expected number of attempts until you get it is

$$
E[\text{attempts}] = \frac{1}{p}
$$

At $p = 0.10$ that is ten attempts. At $p = 0.40$ it is two and a half. People who "keep regenerating until it is right" are paying this cost in time, and the alternative is one minute spent writing the details that were missing.

### Where the parts go

Order matters, and the official guides agree on the main points.

```text
   ROLE              first: it frames everything after it
   CONTEXT           long documents and background near the top
   TASK              after the material it refers to
   CONSTRAINTS
   EXAMPLES          clearly marked as examples
   OUTPUT FORMAT     last, closest to where the answer begins
```

Module 3.9 gave the evidence for putting long documents before the question: Anthropic's documentation reports that a query at the end can improve response quality by up to 30 percent in its tests. For a short prompt the order matters little. For a long one, material first and question last is the dependable arrangement.

The parts should also be visibly separate. OpenAI's and Anthropic's guides both recommend delimiters: headings or labels for sections, and tags or quotation marks around material such as a document or an example, so that the model cannot mistake your data for your instructions. A labelled prompt is also easier for you to review and reuse.

### Named frameworks

You will meet many acronyms for the same idea.

| Framework | Stands for |
|---|---|
| Google's guide | Persona, Task, Context, Format |
| CO-STAR | Context, Objective, Style, Tone, Audience, Response |
| RTF | Role, Task, Format |
| OpenAI's guide for a developer message | Identity, Instructions, Examples, Context |

CO-STAR came to attention when a data scientist won a prompt-engineering competition run by Singapore's government technology agency in 2023 and described the structure she used. The others have similar histories.

Look at the columns and they collapse into the six components above. Style, tone, and audience are aspects of role and constraints. Objective is the task. Response is the output format. The frameworks are different labels on the same slots. Use whichever you find memorable. None is magic, and filling every slot with padding to satisfy an acronym makes a prompt worse.

### What the research says

Three findings are worth carrying through the rest of this unit.

**Small changes in a prompt can change results a great deal.** A 2023 study of prompt formatting found that variations a person would consider meaningless, such as the choice of separator or the spacing between examples, produced accuracy differences of up to 76 points on one model in a few-shot setting. The effect is smaller on stronger models and has not disappeared.

**Folk remedies do not reliably work.** A 2025 report from the Wharton school tested whether being polite to a model, or commanding it, changed accuracy on hard questions. Asking each question 100 times, the researchers found that such wording altered the answers to individual questions but made little difference overall, and that results depended heavily on how correctness was judged. The report is titled "Prompt Engineering is Complicated and Contingent".

**There are many techniques, and they are documented.** A 2024 survey catalogued 58 distinct text prompting techniques. Later modules of this unit teach the ones that matter most.

Put together: structure and content matter, tricks mostly do not, and the only way to know whether a change helped is to test it on several examples, more than once. Module 5.9 covers how.

### Newer models and long prompts

Two refinements complete the picture.

Models that reason before answering need less procedural hand-holding. OpenAI's guide says that such models do well with a high-level goal and work out the steps themselves, whereas ordinary models benefit from explicit instructions. Telling a reasoning model exactly how to think can make it worse. Telling it clearly what you want, for whom, and in what form never does. The six components concern what, not how, which is why they have survived every generation of model.

There is no correct length. A prompt should be as long as the task requires. A two-line prompt is right for a simple question. A two-page prompt is right for a complex, recurring job. What makes a prompt bad is contradiction, irrelevance, and omission. Length alone does not.

### Complexity

Assembling and reviewing a prompt are linear in its length. The cost that matters is on the other side: each failed attempt costs a full response, and vagueness multiplies attempts by $1/p$.

## 3. Production-Grade Implementation & Annotated Walkthrough

A prompt with labelled parts can be built and checked by a few lines of code. First, the assembler and the review checklist.

```python
def build_prompt(role="", task="", context="", constraints=(), examples=(), output_format=""):
    if not task.strip():
        raise ValueError("a prompt needs a task")
    sections = []
    if role.strip():
        sections.append("ROLE: " + role.strip())
    if context.strip():
        sections.append("CONTEXT: " + context.strip())
    sections.append("TASK: " + task.strip())
    if constraints:
        sections.append("CONSTRAINTS:\n" + "\n".join("- " + item for item in constraints))
    if examples:
        sections.append("EXAMPLES:\n" + "\n".join(f"Input: {given}\nOutput: {wanted}" for given, wanted in examples))
    if output_format.strip():
        sections.append("OUTPUT FORMAT: " + output_format.strip())
    return "\n\n".join(sections)

VAGUE = {"good", "nice", "better", "some", "stuff", "things", "appropriate", "etc"}

def checklist(parts):
    failed = []
    task = parts.get("task", "")
    if not task.strip():
        failed.append("no-task")
    if not parts.get("context", "").strip():
        failed.append("no-context")
    if not parts.get("output_format", "").strip():
        failed.append("no-format")
    if not parts.get("constraints"):
        failed.append("no-constraints")
    if {word.strip(".,;:!?").lower() for word in task.split()} & VAGUE:
        failed.append("vague-task")
    if any(not given.strip() or not wanted.strip() for given, wanted in parts.get("examples", ())):
        failed.append("bad-example")
    return failed

weak = {"task": "Write something good about our new product"}
strong = {
    "role": "You are a copywriter for an accounting-software company, writing to existing customers.",
    "context": "Automatic receipt scanning launches on 3 March and is included in every plan.",
    "task": "Write the announcement email.",
    "constraints": ["At most 120 words.", "No exclamation marks.", "Do not mention pricing."],
    "examples": [("bank feeds launch", "You asked for bank feeds. They arrive on Monday.")],
    "output_format": "A subject line, then two short paragraphs.",
}
print(checklist(weak))
print(checklist(strong))
print(build_prompt(**strong))
```

- **The task is required and everything else is optional.** `build_prompt` raises an error without a task and silently skips any other part that is empty. A prompt can be one line or six sections, and the function handles both.
- **Sections appear in a fixed order with labels.** Role, context, task, constraints, examples, format. The labels act as delimiters, so the model can tell an example from an instruction, and so a person reviewing the prompt can see at a glance what is present.
- **Constraints are a list.** One rule per line is easier for the model to follow and for you to edit than a paragraph of conditions.
- **`checklist` returns what is missing, in a fixed order.** The weak prompt fails four checks: no context, no format, no constraints, and a vague word in the task. The word "good" tells the model nothing about what good means here.
- **The vague-word check compares whole words.** The task is split into words and each is stripped of punctuation, so "good." is caught and "goods" is not.
- **A passing checklist is not a good prompt.** It shows that nothing obvious is missing. Whether the context is the right context is still for you to judge.

Next, the distribution of possible answers, and what each added detail does to it.

```python
import math

VAGUE_PROMPT = {
    ("language", "beginner", "paragraph"): 0.30, ("language", "beginner", "bullets"): 0.15,
    ("language", "expert", "paragraph"): 0.15, ("language", "expert", "bullets"): 0.10,
    ("snake", "beginner", "paragraph"): 0.15, ("snake", "beginner", "bullets"): 0.05,
    ("snake", "expert", "paragraph"): 0.07, ("snake", "expert", "bullets"): 0.03,
}

def entropy(distribution):
    return sum(-p * math.log2(p) for p in distribution.values() if p > 0)

def condition(distribution, keep):
    kept = {outcome: p for outcome, p in distribution.items() if keep(outcome)}
    total = sum(kept.values())
    if total == 0:
        raise ValueError("no outcome satisfies the constraint")
    return {outcome: p / total for outcome, p in kept.items()}

WANTED = ("language", "expert", "bullets")
current = VAGUE_PROMPT
steps = [("tell me about Python", None), ("... the programming language", lambda o: o[0] == "language"),
         ("... for an experienced developer", lambda o: o[1] == "expert"), ("... as bullet points", lambda o: o[2] == "bullets")]
for label, constraint in steps:
    if constraint:
        current = condition(current, constraint)
    p = current.get(WANTED, 0)
    print(f"{label:<34} outcomes {len(current)}  entropy {entropy(current):.2f} bits  P(wanted) {p:.2f}  expected attempts {1 / p:.1f}")
```

- **The distribution is a dictionary from outcome to probability.** Each outcome is a triple of topic, depth, and form. The eight probabilities add to one.
- **`entropy` is the formula from Section 2.** Outcomes with zero probability are skipped, because the logarithm of zero is undefined and such outcomes contribute nothing.
- **`condition` filters and rescales.** It keeps the outcomes that satisfy the constraint and divides by their total, which is exactly the conditional probability formula. If nothing satisfies the constraint it raises an error. That case is real: a prompt whose instructions contradict each other has no response that satisfies all of them.
- **Each added phrase lowers the entropy and raises the chance of the wanted answer.** From 2.72 bits and one chance in ten, to zero bits and certainty, in three steps. The expected number of attempts falls from ten to one.
- **The first constraint helps least here.** Most of the probability was already on the programming language. Specifying what the model would have assumed anyway gains little. The biggest gains come from stating what it would otherwise get wrong.

Finally, measuring how consistent a prompt's answers are.

```python
from collections import Counter

def consistency(answers):
    if not answers:
        return None, 0.0
    answer, count = Counter(answers).most_common(1)[0]
    return answer, count / len(answers)

vague_runs = ["bullets", "paragraph", "paragraph", "table", "bullets", "paragraph", "essay", "paragraph", "bullets", "paragraph"]
specific_runs = ["bullets"] * 9 + ["paragraph"]
print(consistency(vague_runs), consistency(specific_runs))
```

- **A prompt is tested by running it more than once.** One good answer shows that a good answer is possible. Ten runs show how often you get it.
- **`consistency` reports the most common answer and its share.** The vague prompt's most frequent form is a paragraph, in five runs of ten. The specific prompt gives bullets in nine of ten.
- **Consistency is not correctness.** A prompt can be reliably wrong. Both must be checked. For a prompt that will be reused many times, though, an inconsistent prompt is unusable however good its best answer is.

**Complexity.** `build_prompt` and `checklist` are linear in the length of the prompt. `entropy` and `condition` are linear in the number of outcomes. `consistency` is linear in the number of runs.

### A template

```text
ROLE
You are [who], writing for [audience].

CONTEXT
[What the model cannot know: the situation, the facts, the material itself.
 Long documents go here, clearly delimited.]

TASK
[A verb and an object. One task.]

CONSTRAINTS
- [Length]
- [Scope: what to include and exclude]
- [Tone and style]
- [What to do if information is missing]

EXAMPLES
[One to three samples of the output you want, marked as examples.]

OUTPUT FORMAT
[The exact structure of the answer.]
```

### A checklist for reviewing a prompt

Before sending a prompt that matters, read it as the capable stranger would.

1. **Is there a task, with a verb?** Could two readers disagree about what is being asked?
2. **Is the audience named?** Who will read the result?
3. **Is everything the model cannot guess in the prompt?** Names, dates, figures, the document itself.
4. **Are the limits stated?** Length, scope, what to leave out.
5. **Does it say what to do when unsure?** Ask, or say so, and not guess.
6. **Is the shape of the answer specified?**
7. **Are there words that sound like instructions and say nothing?** "Good", "appropriate", "professional", "engaging".
8. **Do any two instructions conflict?**
9. **Could a colleague with no context carry this out?**
10. **Have you run it more than once?**

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**The curse of knowledge.** The commonest fault in prompts is leaving out what is obvious to the writer. You know the audience, the product, the house style, and last week's decision. The model knows none of it. Rereading the prompt as a stranger is the fix.

**A topic is not a task.** "Our Q3 results" is a topic. "Summarise our Q3 results in five bullet points for the sales team, leading with the figures that changed most" is a task.

**Vague adjectives.** "Make it better", "more professional", "engaging". These feel like instructions and constrain almost nothing. Say what better means: shorter, with a clearer first sentence, without jargon.

**Only saying what not to do.** A list of prohibitions leaves the model guessing what is wanted. The official guides advise stating the positive instruction. "Write in plain sentences" works better than "do not use bullet points, tables, or headings".

**Contradictory instructions.** "Be comprehensive" and "keep it under 100 words". "Be creative" and "follow the template exactly". The model must break one, and you cannot predict which. In the terms of Section 2, no response satisfies the condition.

**Framework worship.** Filling every letter of an acronym with padding makes a longer prompt and not a better one. The components are a checklist of what might be needed. A slot with nothing useful to say should be left empty.

**The magic phrase.** Offers of tips, threats, flattery, "take a deep breath". The controlled evidence is that such phrases have little reliable effect on accuracy. Time spent on them is better spent on context.

**"You are a world-class expert."** A role with no audience and no task adds little, as the next module shows in detail. Say who the reader is and what they need.

**One example, copied.** A single example is often reproduced too faithfully: its length, its opening words, even its subject. Give two or three that differ, or say which features of the example to follow.

**Unmarked material.** A pasted document followed immediately by a question, with nothing to separate them, invites the model to treat sentences in the document as instructions. Label or delimit what you paste.

**Judging a prompt on one run.** A single good output proves little, and so does a single bad one. Run a prompt that matters several times and on several inputs.

**Carrying a prompt between models unchanged.** A prompt tuned for one model, or one version, can behave differently on another. Re-test when the model changes.

**Over-instructing a reasoning model.** Step-by-step thinking instructions that helped older models can constrain newer ones that plan for themselves. Describe the goal and the standard for success, and let the model choose the route.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A prompt is a brief to a capable stranger, and a complete one has up to six parts: a role and audience, a task stated with a verb, the context the model cannot guess, constraints, examples, and an output format. Only the task is always required. Specificity works because a model samples its response from a probability distribution conditioned on the prompt. A vague prompt leaves that distribution wide, and the answer drifts to the generic middle. Each added detail discards the responses that violate it and concentrates probability on the ones you want, which can be measured as a fall in entropy and felt as fewer attempts, since the expected number of tries is $1/p$. The parts should be ordered with material before the task and the format last, and kept visibly separate with labels or delimiters. The many named frameworks are relabellings of the same slots. Research shows that structure and content matter, that small formatting changes can have large effects, and that tricks such as politeness or threats do not reliably help, so prompts must be tested on several inputs and several runs.

**Question 1.** A prompt is compatible with 16 kinds of response, all equally likely, of which exactly one is what the user wants. Compute the entropy and the expected number of attempts. The user then adds three details, each of which rules out half of the remaining kinds without ruling out the wanted one. Compute the entropy, the probability of the wanted response, and the expected number of attempts afterwards. What does the exercise show about which details are worth adding?

<details>
<summary>View Answer</summary>

With 16 equally likely outcomes each has probability 1/16, and the entropy is the base-2 logarithm of 16, which is 4 bits. The probability of the wanted response is 1/16, about 0.06, so the expected number of attempts is 16. Each detail halves the number of remaining outcomes: to 8, then 4, then 2. With 2 equally likely outcomes the entropy is 1 bit, the probability of the wanted response is 1/2, and the expected number of attempts is 2. Three details removed three bits and cut the expected attempts from sixteen to two. A fourth detail, distinguishing the last two outcomes, would make the result certain. The exercise shows two things. First, the gain from a detail depends on how much probability it removes. A detail that rules out half of what the model might have done is worth a full bit. A detail that only confirms what the model would have assumed anyway rules out almost nothing and is worth almost nothing. So the details most worth adding are the ones where the model's default differs from what you want: an unusual audience, an unexpected length, a particular format. Second, writing three short phrases is far cheaper than making sixteen attempts and reading them all, which is why specifying beats regenerating.

</details>

**Question 2.** A manager sends this prompt: "Can you do a nice summary of the attached report for the team? Make it good and not too long." Identify which of the six components are present, which are missing or weak, and rewrite the prompt.

<details>
<summary>View Answer</summary>

A task is present in outline, summarising, and there is context in the form of the attached report. Everything else is missing or weak. There is no role and, more importantly, no real audience: "the team" does not say which team, what they already know, or what they will do with the summary. The constraints are vague words. "Nice" and "good" say nothing about what a good summary is here, and "not too long" gives no length. There is no statement of what to do if the report lacks something, no example, and no output format. Different readers would produce different summaries from this prompt, which means the model's distribution of responses is wide. A rewrite: "You are writing for the regional sales team, who have not read the attached report and need to know what changes for them next quarter. Summarise the report. Lead with the three findings that affect sales targets, giving the figure for each. Then list any decisions the report asks the team to make. Use at most 150 words. Do not include background or methodology. If the report does not give a figure for a finding, say so and do not estimate. Format: a one-sentence headline, three bullet points, then a short list headed Decisions needed." The rewrite names the audience and their purpose, states the task with a verb and a priority, sets a length and a scope, says what to do about gaps, and fixes the shape of the answer.

</details>

**Question 3.** A colleague insists that the secret to good results is to always start with "You are a world-class expert", always say please, and always follow the CO-STAR framework to the letter. Using this chapter, say what is right and wrong in each claim, and describe how the colleague could find out what actually helps on their own tasks.

<details>
<summary>View Answer</summary>

There is something right behind each claim and something wrong in the word "always". A role does help when it supplies a point of view and an audience, because that narrows vocabulary, register, and assumptions. "World-class expert" supplies neither. It names no audience and no task, so it removes little from the range of possible responses. Politeness is harmless and pleasant, but the controlled study from Wharton found that polite or commanding wording changed answers to individual questions without a reliable effect on accuracy overall, so it cannot be the secret. CO-STAR is a sound checklist. Its six letters map onto the components of this chapter: context, the task as objective, style and tone and audience as aspects of role and constraints, and response as output format. Following it "to the letter" is the mistake, since filling every slot with padding lengthens a prompt without adding information, and some tasks need parts the acronym does not name, such as examples. What decides quality is whether the prompt contains what the model could not guess. To find out what helps on their own work, the colleague should take five real inputs, write two versions of the prompt that differ in only one respect, run each version several times on each input, and judge the outputs against criteria fixed beforehand. A difference that shows up across inputs and runs is real. A difference seen once is noise, and research on prompt formatting shows that such noise can be large.

</details>

@@starter
"""
Lab: Build a Prompt, Review It, and Measure What Specificity Does
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import math
from collections import Counter

VAGUE = {"good", "nice", "better", "some", "stuff", "things", "appropriate", "etc"}

STRONG = {
    "role": "You are a copywriter for an accounting-software company, writing to existing customers.",
    "context": "Automatic receipt scanning launches on 3 March and is included in every plan.",
    "task": "Write the announcement email.",
    "constraints": ["At most 120 words.", "No exclamation marks.", "Do not mention pricing."],
    "examples": [("bank feeds launch", "You asked for bank feeds. They arrive on Monday.")],
    "output_format": "A subject line, then two short paragraphs.",
}

# The eight kinds of answer to "Tell me about Python": (topic, depth, form) -> probability
VAGUE_PROMPT = {
    ("language", "beginner", "paragraph"): 0.30, ("language", "beginner", "bullets"): 0.15,
    ("language", "expert", "paragraph"): 0.15, ("language", "expert", "bullets"): 0.10,
    ("snake", "beginner", "paragraph"): 0.15, ("snake", "beginner", "bullets"): 0.05,
    ("snake", "expert", "paragraph"): 0.07, ("snake", "expert", "bullets"): 0.03,
}


# ---------------------------------------------------------------- Step 1
def build_prompt(role="", task="", context="", constraints=(), examples=(), output_format=""):
    """Assemble a prompt from its components. If task is blank, raise ValueError.
    Build these sections, skipping any that is blank or empty, in this order:
        ROLE: <role>
        CONTEXT: <context>
        TASK: <task>
        CONSTRAINTS:        followed by one line "- <item>" per constraint
        EXAMPLES:           followed by "Input: <given>" and "Output: <wanted>" lines per example
        OUTPUT FORMAT: <output_format>
    Strip role, context, task, and output_format. Join the sections with a blank line ("\\n\\n")."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def checklist(parts):
    """parts is a dict that may have: role, task, context, constraints, examples, output_format.
    Return a list of the checks that FAIL, in this order:
        "no-task"         task missing or blank
        "no-context"      context missing or blank
        "no-format"       output_format missing or blank
        "no-constraints"  constraints missing or empty
        "vague-task"      the task contains a word in VAGUE (whole words, lowercased,
                          with the characters .,;:!? stripped from each word)
        "bad-example"     some example has a blank input or a blank output"""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def entropy(distribution):
    """distribution maps an outcome to its probability.
    Return the entropy in bits: minus the sum of p * log2(p), skipping outcomes with p == 0."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def condition(distribution, keep):
    """keep is a function that takes an outcome and returns True if it satisfies a constraint.
    Return a new distribution containing only the outcomes for which keep(outcome) is true,
    with each probability divided by the total probability of the kept outcomes.
    If that total is 0, raise ValueError: no response satisfies the constraint."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def consistency(answers):
    """answers is a list of the answers a prompt gave on repeated runs.
    Return (most_common_answer, share), where share is its count divided by the number of runs.
    If several answers tie, return the one that appeared first. For an empty list return (None, 0.0)."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print(build_prompt(task="Write the announcement email.", output_format="A subject line, then two short paragraphs."))
    print("checks     :", checklist({"task": "Write something good about our new product"}))
    print("entropy    :", entropy(VAGUE_PROMPT))
    print("conditioned:", condition(VAGUE_PROMPT, lambda outcome: outcome[0] == "language"))
    print("consistency:", consistency(["bullets", "paragraph", "paragraph", "table"]))

@@solution
"""
Lab solution: Build a Prompt, Review It, and Measure What Specificity Does
Standard library only.
"""
import math
from collections import Counter

VAGUE = {"good", "nice", "better", "some", "stuff", "things", "appropriate", "etc"}

STRONG = {
    "role": "You are a copywriter for an accounting-software company, writing to existing customers.",
    "context": "Automatic receipt scanning launches on 3 March and is included in every plan.",
    "task": "Write the announcement email.",
    "constraints": ["At most 120 words.", "No exclamation marks.", "Do not mention pricing."],
    "examples": [("bank feeds launch", "You asked for bank feeds. They arrive on Monday.")],
    "output_format": "A subject line, then two short paragraphs.",
}

# The eight kinds of answer to "Tell me about Python": (topic, depth, form) -> probability
VAGUE_PROMPT = {
    ("language", "beginner", "paragraph"): 0.30, ("language", "beginner", "bullets"): 0.15,
    ("language", "expert", "paragraph"): 0.15, ("language", "expert", "bullets"): 0.10,
    ("snake", "beginner", "paragraph"): 0.15, ("snake", "beginner", "bullets"): 0.05,
    ("snake", "expert", "paragraph"): 0.07, ("snake", "expert", "bullets"): 0.03,
}


# ---------------------------------------------------------------- Step 1
def build_prompt(role="", task="", context="", constraints=(), examples=(), output_format=""):
    """Only the task is required. Labels act as delimiters, so the model can tell an
    example from an instruction and a reviewer can see what is present."""
    if not task.strip():
        raise ValueError("a prompt needs a task")
    sections = []
    if role.strip():
        sections.append("ROLE: " + role.strip())
    if context.strip():
        sections.append("CONTEXT: " + context.strip())
    sections.append("TASK: " + task.strip())
    if constraints:
        sections.append("CONSTRAINTS:\n" + "\n".join("- " + item for item in constraints))
    if examples:
        sections.append("EXAMPLES:\n" + "\n".join(f"Input: {given}\nOutput: {wanted}" for given, wanted in examples))
    if output_format.strip():
        sections.append("OUTPUT FORMAT: " + output_format.strip())
    return "\n\n".join(sections)


# ---------------------------------------------------------------- Step 2
def checklist(parts):
    """A passing checklist shows that nothing obvious is missing. Whether the context is
    the right context is still for a person to judge."""
    failed = []
    task = parts.get("task", "")
    if not task.strip():
        failed.append("no-task")
    if not parts.get("context", "").strip():
        failed.append("no-context")
    if not parts.get("output_format", "").strip():
        failed.append("no-format")
    if not parts.get("constraints"):
        failed.append("no-constraints")
    if {word.strip(".,;:!?").lower() for word in task.split()} & VAGUE:
        failed.append("vague-task")
    if any(not given.strip() or not wanted.strip() for given, wanted in parts.get("examples", ())):
        failed.append("bad-example")
    return failed


# ---------------------------------------------------------------- Step 3
def entropy(distribution):
    """High entropy: many roughly equally likely answers. Zero: one certain answer."""
    return sum(-p * math.log2(p) for p in distribution.values() if p > 0)


# ---------------------------------------------------------------- Step 4
def condition(distribution, keep):
    """Discard the responses that violate the constraint and rescale the rest to sum to one.
    Contradictory instructions leave nothing, which is an error worth raising."""
    kept = {outcome: p for outcome, p in distribution.items() if keep(outcome)}
    total = sum(kept.values())
    if total == 0:
        raise ValueError("no outcome satisfies the constraint")
    return {outcome: p / total for outcome, p in kept.items()}


# ---------------------------------------------------------------- Step 5
def consistency(answers):
    """One good answer shows a good answer is possible. Repeated runs show how often you get it."""
    if not answers:
        return None, 0.0
    answer, count = Counter(answers).most_common(1)[0]
    return answer, count / len(answers)


if __name__ == "__main__":
    print(checklist({"task": "Write something good about our new product"}))
    print(checklist(STRONG))
    print(build_prompt(**STRONG))

    wanted = ("language", "expert", "bullets")
    current = VAGUE_PROMPT
    steps = [("tell me about Python", None), ("... the programming language", lambda o: o[0] == "language"),
             ("... for an experienced developer", lambda o: o[1] == "expert"), ("... as bullet points", lambda o: o[2] == "bullets")]
    for label, constraint in steps:
        if constraint:
            current = condition(current, constraint)
        p = current.get(wanted, 0)
        print(f"{label:<34} outcomes {len(current)}  entropy {entropy(current):.2f} bits  P(wanted) {p:.2f}  expected attempts {1 / p:.1f}")

    vague_runs = ["bullets", "paragraph", "paragraph", "table", "bullets", "paragraph", "essay", "paragraph", "bullets", "paragraph"]
    print(consistency(vague_runs), consistency(["bullets"] * 9 + ["paragraph"]))
    uniform = {kind: 1 / 16 for kind in range(16)}
    print("recall question 1:", entropy(uniform), entropy(condition(uniform, lambda kind: kind < 2)))

@@step
{
  "stepNumber": 1,
  "title": "Assemble a prompt from its components",
  "instruction": "Implement build_prompt(role, task, context, constraints, examples, output_format). If the task is blank, raise ValueError, because the task is the one part no prompt can do without. Otherwise build a list of sections in this order, leaving out any that is blank or empty: 'ROLE: ' and the role; 'CONTEXT: ' and the context; 'TASK: ' and the task; 'CONSTRAINTS:' on its own line followed by one line per constraint beginning with a hyphen and a space; 'EXAMPLES:' on its own line followed, for each (given, wanted) pair, by a line 'Input: given' and a line 'Output: wanted'; and 'OUTPUT FORMAT: ' and the format. Strip the role, context, task, and format. Join the sections with a blank line between them. These are the six components and their order from Section 2. [MOD-5.1]",
  "hintConceptual": "Think of a form with six labelled boxes in a fixed order. One box is compulsory. Each of the others appears on the printed form only if something was written in it.",
  "hintSyntax": "if not task.strip():\n    raise ValueError(\"a prompt needs a task\")\nsections = []\nif role.strip():\n    sections.append(\"ROLE: \" + role.strip())\nif context.strip():\n    sections.append(\"CONTEXT: \" + context.strip())\nsections.append(\"TASK: \" + task.strip())\nif constraints:\n    sections.append(\"CONSTRAINTS:\\n\" + \"\\n\".join(\"- \" + item for item in constraints))\nif examples:\n    sections.append(\"EXAMPLES:\\n\" + \"\\n\".join(f\"Input: {given}\\nOutput: {wanted}\" for given, wanted in examples))\nif output_format.strip():\n    sections.append(\"OUTPUT FORMAT: \" + output_format.strip())\nreturn \"\\n\\n\".join(sections)"
}
@@assert
assert build_prompt(task="Write the announcement email.") == "TASK: Write the announcement email.", f"A task alone is a complete prompt, got {build_prompt(task='Write the announcement email.')!r}"
_full = build_prompt(role="R", task="T", context="C", constraints=["one", "two"], examples=[("in", "out")], output_format="F")
assert _full == "ROLE: R\n\nCONTEXT: C\n\nTASK: T\n\nCONSTRAINTS:\n- one\n- two\n\nEXAMPLES:\nInput: in\nOutput: out\n\nOUTPUT FORMAT: F", f"All six sections in order, separated by blank lines, got {_full!r}"
assert build_prompt(task="T", output_format="F") == "TASK: T\n\nOUTPUT FORMAT: F", "Blank sections are left out"
assert build_prompt(role="  R  ", task="  T  ") == "ROLE: R\n\nTASK: T", "Role and task are stripped"
assert build_prompt(task="T", examples=[("a", "b"), ("c", "d")]) == "TASK: T\n\nEXAMPLES:\nInput: a\nOutput: b\nInput: c\nOutput: d", "Each example adds an Input line and an Output line"
assert build_prompt(role="   ", task="T", context="  ", output_format=" ") == "TASK: T", "Sections containing only spaces are blank"
def _refuses(**parts):
    try:
        build_prompt(**parts)
    except ValueError:
        return True
    return False
assert _refuses(role="R", context="C"), "A prompt with no task raises ValueError"
assert _refuses(task="   "), "A task of only spaces raises ValueError"
_strong = build_prompt(**STRONG)
assert _strong.startswith("ROLE: You are a copywriter") and _strong.endswith("OUTPUT FORMAT: A subject line, then two short paragraphs.") and _strong.count("\n\n") == 5, "The full example has six sections"
print("Step 1 passed: prompts are assembled from labelled components in a fixed order.")

@@step
{
  "stepNumber": 2,
  "title": "A checklist for reviewing a prompt",
  "instruction": "Implement checklist(parts). parts is a dict that may contain role, task, context, constraints, examples, and output_format. Return a list of the checks that fail, in this order: 'no-task' if the task is missing or blank; 'no-context' if the context is missing or blank; 'no-format' if output_format is missing or blank; 'no-constraints' if constraints is missing or empty; 'vague-task' if the task contains any word from VAGUE, comparing whole words in lowercase after stripping the punctuation characters . , ; : ! ? from each; and 'bad-example' if any example pair has a blank input or a blank output. An empty list means nothing obvious is missing. Try it on the one-line prompt in Section 3. [MOD-5.1]",
  "hintConceptual": "Go down the list of what a complete brief contains and note each thing that is absent, plus two signs of carelessness: words that say nothing, and examples that are half filled in.",
  "hintSyntax": "failed = []\ntask = parts.get(\"task\", \"\")\nif not task.strip():\n    failed.append(\"no-task\")\nif not parts.get(\"context\", \"\").strip():\n    failed.append(\"no-context\")\nif not parts.get(\"output_format\", \"\").strip():\n    failed.append(\"no-format\")\nif not parts.get(\"constraints\"):\n    failed.append(\"no-constraints\")\nif {word.strip(\".,;:!?\").lower() for word in task.split()} & VAGUE:\n    failed.append(\"vague-task\")\nif any(not given.strip() or not wanted.strip() for given, wanted in parts.get(\"examples\", ())):\n    failed.append(\"bad-example\")\nreturn failed"
}
@@assert
assert checklist({"task": "Write something good about our new product"}) == ["no-context", "no-format", "no-constraints", "vague-task"], f"The one-line prompt fails four checks, got {checklist({'task': 'Write something good about our new product'})}"
assert checklist(STRONG) == [], f"The full example passes every check, got {checklist(STRONG)}"
assert checklist({}) == ["no-task", "no-context", "no-format", "no-constraints"], "An empty prompt is missing everything that is checked"
assert checklist(dict(STRONG, task="Make it Better.")) == ["vague-task"], "Vague words are matched ignoring case and punctuation"
assert checklist(dict(STRONG, task="Sell the goods quickly.")) == [], "Whole words are compared: 'goods' is not 'good'"
assert checklist(dict(STRONG, examples=[("input", "  ")])) == ["bad-example"], "An example with a blank output is a bad example"
assert checklist(dict(STRONG, examples=[("", "output"), ("in", "out")])) == ["bad-example"], "One bad example among several is enough"
assert checklist(dict(STRONG, constraints=[])) == ["no-constraints"], "An empty list of constraints counts as none"
assert checklist(dict(STRONG, context="   ", output_format="")) == ["no-context", "no-format"], "Blank strings count as missing, and failures keep their order"
print("Step 2 passed: the one-line prompt is missing context, format, and constraints, and uses a word that says nothing.")

@@step
{
  "stepNumber": 3,
  "title": "Measure the spread of possible answers",
  "instruction": "Implement entropy(distribution). distribution maps each possible outcome to its probability. Return the entropy in bits: the negative of the sum, over all outcomes, of the probability multiplied by math.log2 of the probability. Skip any outcome whose probability is 0, because the logarithm of zero is undefined and such an outcome contributes nothing. This is the formula H from Section 2. The eight kinds of answer to the vague prompt have an entropy of about 2.72 bits. [MOD-5.1]",
  "hintConceptual": "Entropy is a number for how undecided a distribution is. Many equally likely outcomes give a high number. One certain outcome gives zero.",
  "hintSyntax": "return sum(-p * math.log2(p) for p in distribution.values() if p > 0)"
}
@@assert
assert abs(entropy(VAGUE_PROMPT) - 2.7214) < 0.001, f"The vague prompt's eight outcomes have about 2.72 bits of entropy, got {entropy(VAGUE_PROMPT)}"
assert abs(entropy({"a": 0.5, "b": 0.5}) - 1.0) < 1e-12, "Two equally likely outcomes are one bit"
assert abs(entropy({kind: 1 / 16 for kind in range(16)}) - 4.0) < 1e-12, "Sixteen equally likely outcomes are four bits"
assert abs(entropy({"only": 1.0})) < 1e-12, "A certain outcome has zero entropy"
assert abs(entropy({"a": 1.0, "b": 0.0})) < 1e-12, "Outcomes with zero probability are skipped without an error"
assert abs(entropy({"a": 0.6, "b": 0.4}) - 0.97095) < 0.0001, "Unequal probabilities give less than one bit"
assert entropy({}) == 0, "An empty distribution has zero entropy"
print("Step 3 passed: the vague prompt leaves 2.72 bits of uncertainty about the kind of answer.")

@@step
{
  "stepNumber": 4,
  "title": "What a constraint does to the distribution",
  "instruction": "Implement condition(distribution, keep). keep is a function that takes an outcome and returns True if the outcome satisfies a constraint. Build a new dict containing only the outcomes for which keep returns True. Add up their probabilities. If the total is 0, raise ValueError: nothing satisfies the constraint, which is what contradictory instructions amount to. Otherwise return the kept outcomes with each probability divided by the total, so that they sum to one. This is the conditional probability formula from Section 2. Apply the three constraints in turn and watch the chance of the wanted answer rise from 0.10 to 1. [MOD-5.1]",
  "hintConceptual": "A constraint throws away every answer that breaks it. What remains must still add up to certainty, so each surviving answer becomes proportionally more likely.",
  "hintSyntax": "kept = {outcome: p for outcome, p in distribution.items() if keep(outcome)}\ntotal = sum(kept.values())\nif total == 0:\n    raise ValueError(\"no outcome satisfies the constraint\")\nreturn {outcome: p / total for outcome, p in kept.items()}"
}
@@assert
_language = condition(VAGUE_PROMPT, lambda outcome: outcome[0] == "language")
assert len(_language) == 4 and abs(sum(_language.values()) - 1) < 1e-12, f"Four outcomes remain and their probabilities sum to one, got {_language}"
assert abs(_language[("language", "expert", "bullets")] - 0.10 / 0.70) < 1e-12, "Each kept probability is divided by the total kept: 0.10 / 0.70"
_expert = condition(_language, lambda outcome: outcome[1] == "expert")
assert len(_expert) == 2 and abs(_expert[("language", "expert", "bullets")] - 0.4) < 1e-12, "After the second constraint the wanted answer has probability 0.40"
_bullets = condition(_expert, lambda outcome: outcome[2] == "bullets")
assert _bullets == {("language", "expert", "bullets"): 1.0}, f"After the third constraint only the wanted answer remains, got {_bullets}"
assert len(VAGUE_PROMPT) == 8 and abs(VAGUE_PROMPT[("language", "beginner", "paragraph")] - 0.30) < 1e-12, "The original distribution must not be changed"
assert condition({"a": 0.2, "b": 0.8}, lambda outcome: True) == {"a": 0.2, "b": 0.8}, "A constraint everything satisfies changes nothing"
def _contradiction():
    try:
        condition(VAGUE_PROMPT, lambda outcome: outcome[0] == "language" and outcome[0] == "snake")
    except ValueError:
        return True
    return False
assert _contradiction(), "A constraint that nothing satisfies raises ValueError"
print("Step 4 passed: three constraints take the chance of the wanted answer from 0.10 to 1.")

@@step
{
  "stepNumber": 5,
  "title": "How consistent is a prompt?",
  "instruction": "Implement consistency(answers). answers is a list of the answers a prompt produced on repeated runs. Return a tuple of the most common answer and its share, which is its count divided by the number of runs. Use Counter(answers).most_common(1), which returns the first answer seen when several are tied. For an empty list return (None, 0.0). This is the repeated-run test from Section 3: one good output shows what is possible, and the share shows how often you get it. [MOD-5.1]",
  "hintConceptual": "Run the prompt several times, tally the answers, and report the winner together with how large its majority was.",
  "hintSyntax": "if not answers:\n    return None, 0.0\nanswer, count = Counter(answers).most_common(1)[0]\nreturn answer, count / len(answers)"
}
@@assert
_vague = ["bullets", "paragraph", "paragraph", "table", "bullets", "paragraph", "essay", "paragraph", "bullets", "paragraph"]
assert consistency(_vague) == ("paragraph", 0.5), f"The vague prompt's commonest form appears in half the runs, got {consistency(_vague)}"
assert consistency(["bullets"] * 9 + ["paragraph"]) == ("bullets", 0.9), "The specific prompt gives the same form in nine runs of ten"
assert consistency(["a", "a", "a"]) == ("a", 1.0), "Identical answers are fully consistent"
assert consistency(["x", "y", "y", "x"]) == ("x", 0.5), "When answers tie, the one that appeared first is returned"
assert consistency([]) == (None, 0.0), "With no runs there is no answer and no share"
assert consistency(["only"]) == ("only", 1.0), "A single run is trivially consistent, which is why one run proves little"
assert consistency([1, 2, 2, 3]) == (2, 0.5), "Answers need not be text"
print("Step 5 passed: the vague prompt is consistent half the time and the specific one nine times in ten.")
