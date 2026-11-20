@@meta
{
  "moduleId": "MOD-5.2",
  "slug": "mod-5-2",
  "unitId": "UNIT-5",
  "unitTitle": "Unit 5: Complete Prompt Engineering Master Class",
  "title": "Role-Based Prompting",
  "difficulty": "Foundational",
  "estimatedMinutes": 85,
  "citations": [
    { "title": "When \"A Helpful Assistant\" Is Not Really Helpful: Personas in System Prompts Do Not Improve Performances of Large Language Models", "source": "arXiv", "url": "https://arxiv.org/abs/2311.10054" },
    { "title": "Prompting Science Report 4: Playing Pretend: Expert Personas Don't Improve Factual Accuracy", "source": "Wharton Generative AI Labs", "url": "https://gail.wharton.upenn.edu/research-and-insights/playing-pretend-expert-personas/" },
    { "title": "Prompting best practices (Give Claude a role)", "source": "Anthropic Docs", "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
    { "title": "Better Zero-Shot Reasoning with Role-Play Prompting", "source": "arXiv", "url": "https://arxiv.org/abs/2308.07702" },
    { "title": "Bias Runs Deep: Implicit Reasoning Biases in Persona-Assigned LLMs", "source": "arXiv", "url": "https://arxiv.org/abs/2311.04892" },
    { "title": "Google Workspace with Gemini Prompt Guide", "source": "Google", "url": "https://workspace.google.com/learning/content/gemini-prompt-guide" }
  ],
  "videoLibrary": [
    {
      "id": "VID-5.2-1",
      "title": "You're Using Persona Prompting Wrong (EACL 2026)",
      "creator": "Women in AI Research WiAIR",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=bydex6cwgEs",
      "timingInstruction": "Watch the discussion of roles and of being honest with the model about the task, after reading Section 1",
      "keyTakeaway": "Recent research on when persona prompts help and when they do not."
    },
    {
      "id": "VID-5.2-2",
      "title": "AI Persona Prompting: How to Create Effective AI Personas for Better AI Outputs",
      "creator": "Matthew Esposito | AI",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=zZPlvHtRtT0",
      "timingInstruction": "Watch after reading Section 2; the speaker co-authored the persona study discussed there",
      "keyTakeaway": "Designing detailed personas that steer tone and expertise."
    },
    {
      "id": "VID-5.2-3",
      "title": "Prompt Engineering for ChatGPT",
      "creator": "Vanderbilt University",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/prompt-engineering",
      "timingInstruction": "Take the lessons on the persona and audience-persona patterns after the lab",
      "keyTakeaway": "Teaches the persona pattern and its companion, the audience persona, with worked examples of each."
    },
    {
      "id": "VID-5.2-4",
      "title": "Google Prompting Essentials",
      "creator": "Google",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/google-prompting-essentials",
      "timingInstruction": "Optional, alongside Unit 5",
      "keyTakeaway": "Covers persona as one element of a prompt among several, in the proportion this chapter recommends."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: What a Role Changes, and What It Does Not",
    "context": "A team has been told that starting every prompt with an expert persona makes answers more accurate, and wants to test the claim before adopting it. You will build a well-formed role, a linter for inflated ones, a measure of writing style, a comparison that separates the effect of a role on style from its effect on correctness, and a simulation showing how one persona can appear to be the best purely by chance.",
    "language": "python"
  }
}

@@reading
# Role-Based Prompting

"You are a world-class marketing expert with twenty years of experience." Few pieces of prompting advice are more widely repeated than this one: open with a role, and the model will perform like the person described.

Roles are useful. They are also misunderstood, and the difference matters. This chapter explains what telling a model who to be actually changes, what it leaves untouched, how to write a role that earns its place, and what careful experiments have found when the folklore was put to the test.

## 1. First-Principles Mental Model & Intuition

### A costume and a stage direction

Ask an actor to play a surgeon. They will stand differently, speak in clipped, technical sentences, and carry themselves with authority. They will be entirely convincing. They will not be able to remove an appendix.

A role prompt works on a model the same way. It is a costume and a stage direction. It changes **how** the model speaks: its vocabulary, its formality, what it emphasises, whom it assumes it is addressing. It does not add to **what** the model knows. The knowledge was fixed when the model was trained.

```text
                         A ROLE CHANGES                     A ROLE DOES NOT CHANGE

   "You are a           tone and register                   the facts the model knows
    paediatric nurse    vocabulary                          its ability to reason
    explaining to       what is emphasised                  whether a figure is right
    a worried parent"   what the reader is assumed to know
                        length and structure
```

This single distinction resolves most of the confusion. When people say a role "made the answer better", they nearly always mean the answer was better pitched: clearer for its audience, in a more suitable voice, focused on the right things. That is a real improvement, and often the one that was needed. It is a different thing from the answer being more accurate.

### Why the costume works at all

Module 5.1 described a prompt as conditioning a probability distribution over responses. The model has read vast amounts of text written by and for different kinds of people. Text written by a nurse for a parent has recognisable patterns: plain words, reassurance, practical steps. Naming that situation moves the distribution toward responses with those patterns.

The model's knowledge lives in its trained parameters, which a prompt cannot alter. In symbols, the model's response $y$ to a question $x$ under a role $r$ is drawn from

$$
P_\theta(y \mid r, x)
$$

where $\theta$ stands for the parameters. The role $r$ is on the right of the bar and can be changed by you. The parameters $\theta$ are a subscript and cannot. A role selects among the things the model can already say. It cannot make the model able to say something it could not.

### The more useful half: the audience

There are two people in any role. One is who the model is. The other is who it is talking to. The second is usually the more valuable to specify.

"You are an expert" narrows very little. "Explain this to a new employee on their first day" narrows a great deal: it fixes the vocabulary, the assumed knowledge, the level of detail, and the purpose. If you can write only one of the two, write the audience.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### What a role reliably changes

| A role changes | Example |
|---|---|
| **Register and tone** | "A barrister addressing a court" against "a friend explaining over coffee" |
| **Vocabulary** | Technical terms for a specialist, plain words for a beginner |
| **Assumed knowledge** | What is explained and what is taken for granted |
| **Focus** | A security reviewer looks for vulnerabilities. A copy editor looks for style |
| **Format habits** | A consultant produces bullet points. An essayist produces paragraphs |
| **Boundaries** | A support agent for one product declines questions about another |

The fourth row deserves attention. A role that sets a **stance** changes what the model looks for. "Review this plan as a sceptical finance director" produces objections that "review this plan" does not, because it points attention at costs and risks. That is a real change in the usefulness of the output, achieved by redirecting focus and not by adding knowledge.

### What a role does not change: the evidence

The claim that an expert persona improves factual accuracy has been tested directly.

| Study | Design | Finding |
|---|---|---|
| Zheng and colleagues, published 2024 | 162 roles of various kinds, four families of models, 2,410 factual questions | Adding a persona to the system prompt did not improve performance compared with no persona. Which persona did best varied unpredictably, and automatic methods of choosing a persona were often no better than choosing at random |
| Wharton's Generative AI Labs, December 2025 | Six models, two sets of difficult questions totalling 498, twelve conditions, each question asked 25 times per condition | Expert personas gave no consistent improvement in accuracy. Experts in the wrong field sometimes made results worse, and personas with little knowledge, such as a toddler, made them worse still |

The Wharton report's title states its conclusion: "Playing Pretend: Expert Personas Don't Improve Factual Accuracy". Its authors add that personas may still be useful for changing tone.

The scale of such studies is worth noticing, because it is what makes them trustworthy. The Wharton design produced

$$
498 \times 12 \times 25 = 149{,}400
$$

responses for each model. A conclusion drawn from that many trials deserves more weight than an impression formed from trying a persona once.

The picture has two qualifications.

**Role-play can help on some tasks.** A 2023 study found that a carefully constructed role-play prompt improved one model's results on several reasoning benchmarks. Effects of this kind depend on the model and the task, and tend to shrink as models improve.

**Personas can hurt.** A 2023 study titled "Bias Runs Deep" found that assigning a model certain demographic personas produced substantial drops in accuracy on reasoning problems, as though the model were acting out a stereotype of what that person could do. A role is not always harmless.

Vendors' own guidance is consistent with all this. Anthropic's documentation says that setting a role focuses the model's behaviour and tone for your use case, and that even a single sentence makes a difference. The claim is about behaviour and tone. Google's guide lists persona as one of four elements and says the task matters most.

### Why one persona seems to win: the winner's curse

If personas do not improve accuracy, why do so many people report finding one that did? Part of the answer is statistics.

Suppose you try $K$ personas, each on $n$ questions, and that every persona has exactly the same true accuracy $p$. Each observed score is a sample, and it varies around $p$ with a standard deviation of

$$
\sigma = \sqrt{\frac{p(1-p)}{n}}
$$

With $p = 0.6$ and $n = 200$, that is about 0.035. Individual scores will scatter several points either side of 0.60 through chance alone. The best of many scatters furthest. A useful approximation for the expected best of $K$ such scores is

$$
E[\text{best}] \approx p + \sigma \sqrt{2 \ln K}
$$

For $K = 162$ this gives about $0.60 + 0.035 \times 3.19 \approx 0.71$. The "best persona" appears to beat the average by eleven points, although no persona is better than any other.

This is called the **winner's curse**: the winner of a large field is the one that was luckiest, and its score overstates its ability. The test is to try the winner again on fresh questions. A real advantage survives. Luck falls back toward the average. This is why the study of 162 roles found that picking the best persona after the fact looks impressive and predicts nothing.

The same trap applies to every prompt variation, not only to roles, and Module 5.9 returns to it.

### Designing a role

A role that earns its place specifies four things.

| Element | Question | Weak | Strong |
|---|---|---|---|
| **Expertise** | What does this person know and do? | "An expert" | "A tax adviser who works with freelancers in the UK" |
| **Audience** | Who are they addressing? | Omitted | "A client who has never filed a return" |
| **Stance** | What is their attitude to the material? | Omitted | "Cautious: flags anything that needs professional confirmation" |
| **Boundaries** | What is outside their remit? | Omitted | "Does not give advice on investments" |

Written out:

```text
You are a tax adviser who works with freelancers in the UK. You are writing to a
client who has never filed a tax return. You are cautious: flag anything that
should be confirmed with a qualified accountant. Do not give advice on investments.
```

Every phrase removes possibilities. Compare "You are a world-class tax genius", which removes almost none. Superlatives add nothing a model can act on. There is no vocabulary, audience, or boundary implied by "world-class".

### Kinds of role and when to use each

| Kind | What it is for | Example |
|---|---|---|
| **Professional role** | Register, vocabulary, and focus for a domain | "A technical writer documenting software for administrators" |
| **Audience role** | Pitching an explanation | "Explain as you would to a twelve-year-old" |
| **Critic or reviewer** | Directing attention to faults | "A sceptical reviewer looking for unsupported claims" |
| **Simulated counterpart** | Practice | "Play a customer who is unhappy about a late delivery, so I can rehearse" |
| **Product identity** | Consistent behaviour in a deployed assistant | "The support assistant for Acme's accounting software" |

The last kind belongs in a system prompt, the subject of Module 5.7.

### Where a role is the wrong tool

When the goal is a correct fact, a role is the wrong lever. What improves accuracy is what earlier modules covered: supplying the source material, asking for quotes, allowing the model to say it does not know, and checking. A role that makes the model sound like an authority, with nothing behind it, makes a wrong answer more persuasive. In medicine, law, and finance that is a hazard and not a help.

### Complexity

Building and checking a role are linear in its length. Testing whether a role helps costs one model call per question per variant, which is why the test set should be small, fixed, and reused.

## 3. Production-Grade Implementation & Annotated Walkthrough

The claims of this chapter can be checked in miniature. First, building a role with its four elements and catching the inflated kind.

```python
def build_role(expertise, audience, stance="", boundaries=""):
    if not expertise.strip() or not audience.strip():
        raise ValueError("a role needs expertise and an audience")
    parts = [f"You are {expertise.strip()}.", f"You are writing for {audience.strip()}."]
    parts += [text.strip() for text in (stance, boundaries) if text.strip()]
    return " ".join(parts)

INFLATED = ("world-class", "genius", "best in the world", "greatest", "legendary", "10x")
AUDIENCE_WORDS = ("writing for", "writing to", "audience", "reader", "explaining to", "speaking to")
BOUNDARY_WORDS = ("do not", "never", "only", "outside", "decline")

def lint_role(role):
    text = role.lower()
    warnings = []
    if any(word in text for word in INFLATED):
        warnings.append("inflated")
    if not any(word in text for word in AUDIENCE_WORDS):
        warnings.append("no-audience")
    if not any(word in text for word in BOUNDARY_WORDS):
        warnings.append("no-boundary")
    if len(role.split()) > 60:
        warnings.append("too-long")
    return warnings

good = build_role("a tax adviser who works with freelancers in the UK", "a client who has never filed a tax return",
                  "Flag anything that should be confirmed with an accountant.", "Do not give advice on investments.")
print(good)
print(lint_role(good), lint_role("You are a world-class tax genius."))
```

- **Expertise and audience are both required.** The function refuses to build a role without either. The audience is not optional decoration: it is the half that narrows the response most.
- **Stance and boundaries are added when supplied.** They are complete sentences written by you, so they are joined on as they are.
- **The linter looks for two excesses and two absences.** Superlatives that carry no information, no mention of whom the text is for, no statement of what is out of scope, and a role so long that it has stopped being a role and become the whole prompt.
- **The inflated role trips three checks.** It contains two superlatives, names no audience, and sets no boundary. It is also the kind of role most often recommended.

Next, measuring style separately from correctness, with a stand-in model whose behaviour is known.

```python
FACTS = {
    "What is the boiling point of water at sea level in Celsius?": "100",
    "How many sides does a hexagon have?": "6",
    "What is the chemical symbol for gold?": "Au",
    "What is 12 times 12?": "144",
    "What is the capital of Australia?": "Sydney",
}
KEY = dict(FACTS, **{"What is the capital of Australia?": "Canberra"})

def stub_model(role, question):
    fact = FACTS[question]
    role = role.lower()
    if "professor" in role:
        return f"The established scholarly consensus indicates that the answer is {fact}."
    if "pirate" in role:
        return f"Arr, the answer be {fact}, matey."
    if "child" in role:
        return f"It is {fact}."
    return f"The answer is {fact}."

def style_features(text):
    words = [word.strip(".,;:!?") for word in text.split()]
    words = [word for word in words if word]
    if not words:
        return 0.0, 0.0
    sentences = [part for part in text.replace("!", ".").replace("?", ".").split(".") if part.strip()]
    return round(sum(len(word) for word in words) / len(words), 2), round(len(words) / max(1, len(sentences)), 2)

def ab_summary(control, treated):
    def accuracy(runs):
        return sum(1 for reply, answer in runs if answer in reply) / len(runs)
    def word_length(runs):
        return sum(style_features(reply)[0] for reply, _ in runs) / len(runs)
    return round(accuracy(treated) - accuracy(control), 3), round(word_length(treated) - word_length(control), 2)

def run(role):
    return [(stub_model(role, question), KEY[question]) for question in FACTS]

control = run("")
print("no role: accuracy", sum(1 for reply, answer in control if answer in reply) / len(control))
for role in ("You are a distinguished professor.", "You are a pirate.", "You are a small child."):
    print(f"{role:<36} accuracy change, word-length change: {ab_summary(control, run(role))}")
```

- **The stand-in model separates knowledge from voice by construction.** `FACTS` is what it "knows", including one thing it has wrong: it believes the capital of Australia is Sydney. The role only chooses the sentence wrapped around the fact. A real model is not built this way, but the studies in Section 2 found that it behaves much as if it were.
- **`style_features` measures two things about a text.** The average length of its words and the average number of words in its sentences. Longer words and longer sentences are a rough signal of a more formal register.
- **`ab_summary` reports two differences.** The change in accuracy and the change in average word length, between runs with and without the role. Reporting them separately is the whole point. A single "is it better?" judgement mixes them.
- **Accuracy does not move.** With no role the model gets four of five right. With a professor's role, a pirate's, or a child's, it gets the same four of five, and the same one wrong. The change is zero in every case.
- **Style moves every time.** The professor's words are much longer, the pirate's slightly longer, the child's shorter. The role did exactly what a costume does.
- **The professor is the dangerous one.** "The established scholarly consensus indicates that the answer is Sydney" is the same wrong answer as "It is Sydney", and it is far more convincing.

Finally, the winner's curse.

```python
import math
import random

def persona_sweep(n_personas, n_questions, p, seed=0):
    rng = random.Random(seed)
    scores = [sum(rng.random() < p for _ in range(n_questions)) / n_questions for _ in range(n_personas)]
    return max(scores), sum(scores) / len(scores)

best, mean = persona_sweep(162, 200, 0.6, seed=1)
sigma = math.sqrt(0.6 * 0.4 / 200)
print(f"162 personas on 200 questions: best {best:.3f}, mean {mean:.3f}, formula for the best {0.6 + sigma * math.sqrt(2 * math.log(162)):.3f}")
print(f"on 20 questions the best looks like {persona_sweep(162, 20, 0.6, seed=1)[0]:.2f}; on 2,000 questions {persona_sweep(162, 2000, 0.6, seed=1)[0]:.2f}")
retest = random.Random(99)
print("the winner, re-tested on 200 fresh questions:", sum(retest.random() < 0.6 for _ in range(200)) / 200)
```

- **Every simulated persona has the same true accuracy.** Each answers each question correctly with probability 0.6. Nothing distinguishes them except luck.
- **The best of 162 scores 0.71.** The mean is 0.60, as it must be. The formula from Section 2 predicts 0.71 for the best. A reader shown only the winner would conclude that this persona adds eleven points.
- **Fewer questions make it worse.** On 20 questions the best persona appears to score 0.85. On 2,000 it scores 0.63. Small test sets manufacture winners.
- **Re-testing removes the illusion.** On fresh questions the winning persona scores 0.59. It was never better. This is the check to apply to any prompt variation that "won" a comparison.
- **The seed makes the experiment repeatable.** `random.Random(seed)` gives the same sequence each time, so the result can be examined and reproduced.

**Complexity.** `build_role`, `lint_role`, and `style_features` are linear in the text. `ab_summary` is linear in the number of runs. `persona_sweep` does one random draw per persona per question.

### A role template

```text
You are [expertise: a specific job, domain, and setting].
You are writing for [audience: who they are and what they already know].
[Stance: your attitude to the material, in one sentence.]
[Boundaries: what you do not do, and what to do when asked.]
```

Then the task, context, constraints, and format from Module 5.1. The role is one or two lines. Everything else carries the rest.

### Testing whether a role helps

1. **Decide what you want it to change.** Tone, level, focus, or accuracy. Write it down.
2. **Take five to ten real inputs** with known good answers.
3. **Run each with and without the role**, several times.
4. **Score style and correctness separately.** A role can improve one and not the other.
5. **If one variant wins, re-test it on new inputs** before believing it.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**"World-class expert" inflation.** Each generation of prompt advice adds adjectives: senior, elite, world-renowned, with decades of experience. None of them names a vocabulary, an audience, or a boundary, so none of them narrows the response. The controlled studies found no accuracy benefit from expert personas at all.

**A persona in place of a task.** "You are a brilliant strategist. Here is our situation." The model has been told who to be and not what to do. It will choose its own task. A role is the first line of a brief, not a substitute for one.

**Forgetting the audience.** People specify who the model is and omit whom it is addressing. The second is where most of the value lies. "For a board member with five minutes" changes an answer more than any title.

**Authority without grounding.** A model playing a doctor, lawyer, or financial adviser sounds like one. Its facts are no better than before. The confident voice makes errors harder to notice. For questions of fact, supply sources and ask for them to be cited, as in Module 3.9.

**Mismatched experts.** Asking a "physics professor" a law question, because a role was left over from an earlier turn or copied from a template. The Wharton study found that experts in the wrong domain sometimes lowered accuracy. Match the role to the task, or drop it.

**Personas that lower performance.** Asking for an answer "as a five-year-old would" can produce simpler reasoning as well as simpler words. If you want a simple explanation of a correct answer, ask for the audience to be a child and not the author: "explain to a five-year-old".

**Stereotypes.** Demographic personas can import stereotyped assumptions, including about competence. The research on this is sobering. Describe the knowledge and the situation you need, not a kind of person.

**The role that fights the request.** A system prompt establishes a formal analyst, and the user asks for a limerick. The model must choose. Roles set in standing instructions should say what to do with requests outside them.

**One lucky test.** Someone tries a persona once, likes the result, and adopts it for everything. With several variants tried, one always looks best by chance. Re-test on new inputs.

**Role-play that will not stop.** Having asked a model to play an angry customer for practice, users find it stays in character when they want feedback. Say in advance how to end the exercise: "When I write 'pause', step out of the role and tell me how I did."

**Roles that leak into the output.** "As a senior consultant, I recommend..." appears in a document meant for a client. If the role is a means to a voice and not something to announce, say so: "Do not refer to yourself or your role."

**Expecting newer models to need it.** Earlier models benefited more from heavy scaffolding of every kind. Current models pick up register and audience from a plain description of the situation. A sentence of honest context often does what an elaborate persona was meant to.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A role is a costume and a stage direction. It changes how a model writes: register, vocabulary, assumed knowledge, focus, format habits, and boundaries. It does not change what the model knows, because knowledge lives in trained parameters that a prompt cannot alter. Controlled studies with hundreds of roles and many thousands of trials have found that expert personas do not reliably improve factual accuracy, that experts in the wrong field and low-knowledge personas can reduce it, and that demographic personas can import bias. A role that earns its place names specific expertise, an audience, a stance, and boundaries, and the audience is usually the most valuable part. A persona that seems to win a comparison is often the luckiest of many: with $K$ variants of equal ability the best observed score exceeds the truth by about $\sigma\sqrt{2 \ln K}$, and only a re-test on fresh inputs tells luck from merit. Use roles to shape voice, level, and attention, and use sources and verification for facts.

**Question 1.** A team tests 50 different personas on the same 100 questions. Suppose that in truth every persona has an accuracy of 0.70. Compute the standard deviation of one persona's observed score, and estimate the score of the best-looking persona using the approximation from Section 2. What will the team be tempted to conclude, and how should they check?

<details>
<summary>View Answer</summary>

The standard deviation of an observed score is the square root of 0.70 times 0.30 divided by 100. The product is 0.21, divided by 100 is 0.0021, and its square root is about 0.046. So individual personas will typically score within four or five points of 0.70 by chance. For the best of 50, the approximation multiplies the standard deviation by the square root of twice the natural logarithm of 50. The logarithm of 50 is about 3.91, twice that is 7.82, and its square root is about 2.80. So the best persona is expected to score about 0.70 plus 0.046 times 2.80, which is about 0.83. The team will see one persona at 83 percent against an average of 70 and be tempted to conclude that they have found a persona worth thirteen points, and to adopt it everywhere. In fact all fifty are identical and the leader is the luckiest. The check is to take the winning persona and the plain prompt and run both on a fresh set of questions that played no part in the selection, preferably several times. If the advantage is real it will persist. If it was luck the winner will fall back to about 0.70. They could also reduce the problem at the source by testing fewer variants on more questions.

</details>

**Question 2.** Rewrite this role, and explain each change: "You are a world-class, award-winning senior financial genius with 30 years of experience." The task it accompanies is explaining to first-time employees how their workplace pension works.

<details>
<summary>View Answer</summary>

The original consists of superlatives. "World-class", "award-winning", "senior", "genius", and "30 years" describe status and say nothing about vocabulary, audience, or limits, so they give the model nothing to act on. It names no audience, which for an explanation is the most important thing to specify. It sets no stance and no boundaries, which matters because pensions involve regulated financial advice. A rewrite: "You are a workplace benefits adviser who explains pension schemes to staff. You are writing for employees in their first job, who have never had a pension and do not know the terminology. Be plain and reassuring, and define each term the first time you use it. Explain how the scheme works. Do not recommend how much anyone should contribute or which funds to choose. If asked, say that this is a personal decision and suggest speaking to the scheme's helpline or a regulated adviser." The expertise is now a specific job in a specific setting, which implies the right vocabulary. The audience is named with what they know and do not know, which fixes the level. The stance, plain and reassuring with terms defined, shapes the voice. The boundary keeps the model from giving personal financial advice and tells it what to do when asked. None of these changes makes the model know more about pensions. For the facts of a particular scheme, the scheme's own documents should be supplied in the prompt.

</details>

**Question 3.** A hospital pilot gives a model the role "You are an experienced consultant cardiologist" and asks it questions about drug dosages. Staff report that the answers are "much better than before". Using this chapter, explain what has probably improved and what has not, why that is a risk, and what the pilot should do instead.

<details>
<summary>View Answer</summary>

What has improved is almost certainly the presentation. With the cardiologist role the answers use clinical vocabulary, are organised as a specialist would organise them, and are delivered with professional confidence, so they read as better to clinicians. What has not improved is the factual accuracy of the dosages. The role is part of the prompt and can only select among things the model could already say. It cannot add knowledge, and controlled studies have found that expert personas do not reliably raise accuracy on factual questions. The risk is that the two effects point in opposite directions for safety. Any dosage error the model would have made before, it still makes, and now states in the voice of a consultant. Errors become harder to spot at exactly the moment the stakes are highest, and "much better" is an impression that may reflect fluency. The pilot should separate the two measurements: score a fixed set of dosage questions for correctness against an authoritative reference, with and without the role, several times each. More importantly, it should stop relying on the model's memory for dosages. The current formulary or guideline should be supplied in the prompt, the model should be told to answer only from it, to quote the passage, and to say when the source does not cover the question, and a clinician should verify every answer before it is used. A role may then be used for what it is good at, pitching the explanation to its reader.

</details>

@@starter
"""
Lab: What a Role Changes, and What It Does Not
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import random

INFLATED = ("world-class", "genius", "best in the world", "greatest", "legendary", "10x")
AUDIENCE_WORDS = ("writing for", "writing to", "audience", "reader", "explaining to", "speaking to")
BOUNDARY_WORDS = ("do not", "never", "only", "outside", "decline")

# What the stand-in model "knows". It has one fact wrong.
FACTS = {
    "What is the boiling point of water at sea level in Celsius?": "100",
    "How many sides does a hexagon have?": "6",
    "What is the chemical symbol for gold?": "Au",
    "What is 12 times 12?": "144",
    "What is the capital of Australia?": "Sydney",
}
KEY = dict(FACTS, **{"What is the capital of Australia?": "Canberra"})


def stub_model(role, question):
    """Provided: a stand-in model. The role chooses the wording; FACTS supplies the content."""
    fact = FACTS[question]
    role = role.lower()
    if "professor" in role:
        return f"The established scholarly consensus indicates that the answer is {fact}."
    if "pirate" in role:
        return f"Arr, the answer be {fact}, matey."
    if "child" in role:
        return f"It is {fact}."
    return f"The answer is {fact}."


def run(role):
    """Provided: ask every question under a role. Returns a list of (reply, correct_answer)."""
    return [(stub_model(role, question), KEY[question]) for question in FACTS]


# ---------------------------------------------------------------- Step 1
def build_role(expertise, audience, stance="", boundaries=""):
    """Build a role from its four elements.
    If expertise or audience is blank, raise ValueError. Otherwise return, joined by single spaces:
        "You are <expertise>."
        "You are writing for <audience>."
        the stance, if not blank          (already a full sentence)
        the boundaries, if not blank      (already a full sentence)
    Strip each piece."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def lint_role(role):
    """Return a list of warnings, in this order (compare in lowercase):
        "inflated"     contains any phrase in INFLATED
        "no-audience"  contains none of the phrases in AUDIENCE_WORDS
        "no-boundary"  contains none of the phrases in BOUNDARY_WORDS
        "too-long"     more than 60 words"""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def style_features(text):
    """Return (average word length, average words per sentence), each rounded to 2 places.
    Words: text.split(), with the characters .,;:!? stripped from each, ignoring empty results.
    Sentences: replace "!" and "?" with ".", split on ".", and count the non-blank parts
    (treat the count as at least 1). For a text with no words return (0.0, 0.0)."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def ab_summary(control, treated):
    """control and treated are lists of (reply, correct_answer), without and with a role.
    Return (accuracy_change, word_length_change):
        accuracy    = share of runs whose reply contains the correct answer
        word length = average of style_features(reply)[0] over the runs
    each as treated minus control, rounded to 3 and 2 decimal places."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def persona_sweep(n_personas, n_questions, p, seed=0):
    """Simulate n_personas that all have the SAME true accuracy p.
    Use rng = random.Random(seed). For each persona, its score is the share of n_questions
    for which rng.random() < p. Return (best_score, mean_score)."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("role   :", build_role("a tax adviser for freelancers", "a client who has never filed a return"))
    print("lint   :", lint_role("You are a world-class tax genius."))
    print("style  :", style_features("The answer is 100."))
    print("a/b    :", ab_summary(run(""), run("You are a distinguished professor.")))
    print("sweep  :", persona_sweep(162, 200, 0.6, seed=1))

@@solution
"""
Lab solution: What a Role Changes, and What It Does Not
Standard library only.
"""
import math
import random

INFLATED = ("world-class", "genius", "best in the world", "greatest", "legendary", "10x")
AUDIENCE_WORDS = ("writing for", "writing to", "audience", "reader", "explaining to", "speaking to")
BOUNDARY_WORDS = ("do not", "never", "only", "outside", "decline")

# What the stand-in model "knows". It has one fact wrong.
FACTS = {
    "What is the boiling point of water at sea level in Celsius?": "100",
    "How many sides does a hexagon have?": "6",
    "What is the chemical symbol for gold?": "Au",
    "What is 12 times 12?": "144",
    "What is the capital of Australia?": "Sydney",
}
KEY = dict(FACTS, **{"What is the capital of Australia?": "Canberra"})


def stub_model(role, question):
    """Provided: a stand-in model. The role chooses the wording; FACTS supplies the content."""
    fact = FACTS[question]
    role = role.lower()
    if "professor" in role:
        return f"The established scholarly consensus indicates that the answer is {fact}."
    if "pirate" in role:
        return f"Arr, the answer be {fact}, matey."
    if "child" in role:
        return f"It is {fact}."
    return f"The answer is {fact}."


def run(role):
    """Provided: ask every question under a role. Returns a list of (reply, correct_answer)."""
    return [(stub_model(role, question), KEY[question]) for question in FACTS]


# ---------------------------------------------------------------- Step 1
def build_role(expertise, audience, stance="", boundaries=""):
    """Expertise and audience are both required. The audience is the half that narrows
    the response most."""
    if not expertise.strip() or not audience.strip():
        raise ValueError("a role needs expertise and an audience")
    parts = [f"You are {expertise.strip()}.", f"You are writing for {audience.strip()}."]
    parts += [text.strip() for text in (stance, boundaries) if text.strip()]
    return " ".join(parts)


# ---------------------------------------------------------------- Step 2
def lint_role(role):
    """Superlatives name no vocabulary, audience, or boundary, so they narrow nothing."""
    text = role.lower()
    warnings = []
    if any(word in text for word in INFLATED):
        warnings.append("inflated")
    if not any(word in text for word in AUDIENCE_WORDS):
        warnings.append("no-audience")
    if not any(word in text for word in BOUNDARY_WORDS):
        warnings.append("no-boundary")
    if len(role.split()) > 60:
        warnings.append("too-long")
    return warnings


# ---------------------------------------------------------------- Step 3
def style_features(text):
    """Longer words and longer sentences are a rough signal of a more formal register."""
    words = [word.strip(".,;:!?") for word in text.split()]
    words = [word for word in words if word]
    if not words:
        return 0.0, 0.0
    sentences = [part for part in text.replace("!", ".").replace("?", ".").split(".") if part.strip()]
    return round(sum(len(word) for word in words) / len(words), 2), round(len(words) / max(1, len(sentences)), 2)


# ---------------------------------------------------------------- Step 4
def ab_summary(control, treated):
    """Style and correctness are reported separately. A single 'is it better?' mixes them."""
    def accuracy(runs):
        return sum(1 for reply, answer in runs if answer in reply) / len(runs)

    def word_length(runs):
        return sum(style_features(reply)[0] for reply, _ in runs) / len(runs)

    return round(accuracy(treated) - accuracy(control), 3), round(word_length(treated) - word_length(control), 2)


# ---------------------------------------------------------------- Step 5
def persona_sweep(n_personas, n_questions, p, seed=0):
    """Every persona is identical. The best observed score still beats the mean, by luck."""
    rng = random.Random(seed)
    scores = [sum(rng.random() < p for _ in range(n_questions)) / n_questions for _ in range(n_personas)]
    return max(scores), sum(scores) / len(scores)


if __name__ == "__main__":
    good = build_role("a tax adviser who works with freelancers in the UK", "a client who has never filed a tax return",
                      "Flag anything that should be confirmed with an accountant.", "Do not give advice on investments.")
    print(good)
    print(lint_role(good), lint_role("You are a world-class tax genius."))

    control = run("")
    print("no role: accuracy", sum(1 for reply, answer in control if answer in reply) / len(control))
    for role in ("You are a distinguished professor.", "You are a pirate.", "You are a small child."):
        print(f"{role:<36} accuracy change, word-length change: {ab_summary(control, run(role))}")

    best, mean = persona_sweep(162, 200, 0.6, seed=1)
    sigma = math.sqrt(0.6 * 0.4 / 200)
    print(f"162 personas on 200 questions: best {best:.3f}, mean {mean:.3f}, formula for the best {0.6 + sigma * math.sqrt(2 * math.log(162)):.3f}")
    print(f"on 20 questions the best looks like {persona_sweep(162, 20, 0.6, seed=1)[0]:.2f}; on 2,000 questions {persona_sweep(162, 2000, 0.6, seed=1)[0]:.2f}")
    retest = random.Random(99)
    print("the winner, re-tested on 200 fresh questions:", sum(retest.random() < 0.6 for _ in range(200)) / 200)
    s = math.sqrt(0.7 * 0.3 / 100)
    print(f"recall question 1: sigma {s:.3f}, best of 50 about {0.7 + s * math.sqrt(2 * math.log(50)):.2f}; Wharton design {498 * 12 * 25:,} responses per model")

@@step
{
  "stepNumber": 1,
  "title": "Build a role with its four elements",
  "instruction": "Implement build_role(expertise, audience, stance, boundaries). If the expertise or the audience is blank, raise ValueError: a role needs both. Otherwise build a list of sentences: 'You are ' followed by the stripped expertise and a full stop; 'You are writing for ' followed by the stripped audience and a full stop; then the stance and the boundaries, stripped, each only if it is not blank. Join them with single spaces and return the result. These are the four elements from Section 2. The audience is required because it is the part that narrows the response most. [MOD-5.2]",
  "hintConceptual": "A role answers four questions: what does this person know, whom are they addressing, what is their attitude, and what is outside their remit. The first two are compulsory.",
  "hintSyntax": "if not expertise.strip() or not audience.strip():\n    raise ValueError(\"a role needs expertise and an audience\")\nparts = [f\"You are {expertise.strip()}.\", f\"You are writing for {audience.strip()}.\"]\nparts += [text.strip() for text in (stance, boundaries) if text.strip()]\nreturn \" \".join(parts)"
}
@@assert
assert build_role("a tax adviser for freelancers", "a client who has never filed a return") == "You are a tax adviser for freelancers. You are writing for a client who has never filed a return.", f"Got {build_role('a tax adviser for freelancers', 'a client who has never filed a return')!r}"
assert build_role("an editor", "new writers", "Be encouraging.", "Do not rewrite whole paragraphs.") == "You are an editor. You are writing for new writers. Be encouraging. Do not rewrite whole paragraphs.", "Stance and boundaries are added as sentences"
assert build_role("an editor", "new writers", boundaries="Never change the meaning.") == "You are an editor. You are writing for new writers. Never change the meaning.", "A blank stance is left out"
assert build_role("  an editor  ", "  new writers  ", "  Be brief.  ") == "You are an editor. You are writing for new writers. Be brief.", "Each piece is stripped"
def _refuses(*args):
    try:
        build_role(*args)
    except ValueError:
        return True
    return False
assert _refuses("", "new writers"), "A role with no expertise raises ValueError"
assert _refuses("an editor", "   "), "A role with no audience raises ValueError"
assert not _refuses("an editor", "new writers", "", ""), "Stance and boundaries are optional"
print("Step 1 passed: a role names its expertise and its audience, with stance and boundaries when given.")

@@step
{
  "stepNumber": 2,
  "title": "Lint a role for inflation and omissions",
  "instruction": "Implement lint_role(role). Work with the lowercase text. Return a list of warnings in this order: 'inflated' if the role contains any phrase in INFLATED; 'no-audience' if it contains none of the phrases in AUDIENCE_WORDS; 'no-boundary' if it contains none of the phrases in BOUNDARY_WORDS; and 'too-long' if it has more than 60 words. An empty list means none of these was found. Try it on 'You are a world-class tax genius.', which is the kind of role most often recommended. [MOD-5.2]",
  "hintConceptual": "Look for two excesses and two absences: praise that carries no information, no mention of the reader, no limit on scope, and a role so long it has become the whole prompt.",
  "hintSyntax": "text = role.lower()\nwarnings = []\nif any(word in text for word in INFLATED):\n    warnings.append(\"inflated\")\nif not any(word in text for word in AUDIENCE_WORDS):\n    warnings.append(\"no-audience\")\nif not any(word in text for word in BOUNDARY_WORDS):\n    warnings.append(\"no-boundary\")\nif len(role.split()) > 60:\n    warnings.append(\"too-long\")\nreturn warnings"
}
@@assert
assert lint_role("You are a world-class tax genius.") == ["inflated", "no-audience", "no-boundary"], f"The inflated role trips three checks, got {lint_role('You are a world-class tax genius.')}"
_good = "You are a tax adviser who works with freelancers. You are writing for a client who has never filed a return. Do not give advice on investments."
assert lint_role(_good) == [], f"A well-formed role raises no warnings, got {lint_role(_good)}"
assert lint_role("You are an editor. You are WRITING FOR new writers. NEVER change the meaning.") == [], "Matching ignores case"
assert lint_role("You are an editor explaining to new writers.") == ["no-boundary"], "A role with an audience and no boundary"
assert lint_role("You are an editor. Only correct spelling.") == ["no-audience"], "A role with a boundary and no audience"
assert lint_role("You are the greatest editor, writing for new writers. Do not rewrite.") == ["inflated"], "A superlative is flagged even when audience and boundary are present"
assert lint_role(_good + " " + " ".join(["word"] * 40)) == ["too-long"], "More than 60 words is too long"
assert "too-long" not in lint_role(" ".join(["word"] * 60)), "Exactly 60 words is not MORE than 60"
print("Step 2 passed: 'world-class tax genius' is inflated and names no audience and no boundary.")

@@step
{
  "stepNumber": 3,
  "title": "Measure writing style",
  "instruction": "Implement style_features(text). Split the text into words, strip the punctuation characters . , ; : ! ? from each, and discard any that become empty. If there are no words, return (0.0, 0.0). Count sentences by replacing every '!' and '?' with '.', splitting on '.', and counting the parts that are not blank, treating the count as at least 1. Return a tuple of two numbers rounded to 2 decimal places: the average number of letters per word, and the average number of words per sentence. These two figures are a rough measure of register: a formal voice uses longer words and longer sentences. [MOD-5.2]",
  "hintConceptual": "Two simple measurements of a voice: how long its words are, and how long its sentences are. Neither says anything about whether the content is right.",
  "hintSyntax": "words = [word.strip(\".,;:!?\") for word in text.split()]\nwords = [word for word in words if word]\nif not words:\n    return 0.0, 0.0\nsentences = [part for part in text.replace(\"!\", \".\").replace(\"?\", \".\").split(\".\") if part.strip()]\nreturn round(sum(len(word) for word in words) / len(words), 2), round(len(words) / max(1, len(sentences)), 2)"
}
@@assert
assert style_features("The answer is 100.") == (3.5, 4.0), f"Four words averaging 3.5 letters in one sentence, got {style_features('The answer is 100.')}"
assert style_features("The established scholarly consensus indicates that the answer is 100.") == (5.9, 10.0), "The professor's sentence has longer words and more of them"
assert style_features("It is 100.") == (2.33, 3.0), "The child's sentence has short words"
assert style_features("Arr, the answer be 100, matey.") == (3.67, 6.0), "Commas are stripped from words"
assert style_features("Stop! Who goes there? A friend.") == (3.83, 2.0), "Exclamation and question marks end sentences: six words in three sentences"
assert style_features("") == (0.0, 0.0), "A text with no words returns (0.0, 0.0)"
assert style_features("no full stop here") == (3.5, 4.0), "A text with no full stop is one sentence"
assert style_features("...") == (0.0, 0.0), "Punctuation alone contains no words"
print("Step 3 passed: the professor's reply averages 5.9 letters a word and the child's 2.33.")

@@step
{
  "stepNumber": 4,
  "title": "Separate style from correctness",
  "instruction": "Implement ab_summary(control, treated). Each argument is a list of (reply, correct_answer) pairs, from runs without and with a role. For each list compute two things: the accuracy, which is the share of runs whose reply contains the correct answer; and the word length, which is the average over the runs of style_features(reply)[0]. Return a tuple: accuracy of treated minus accuracy of control, rounded to 3 decimal places, and word length of treated minus word length of control, rounded to 2 decimal places. Use the provided run() helper to compare no role with the professor, the pirate, and the child. The accuracy change is zero each time, and the style change is not. [MOD-5.2]",
  "hintConceptual": "Ask two separate questions of the same pair of runs: did the role make the answers more correct, and did it change how they are written? Keep the two answers apart.",
  "hintSyntax": "def accuracy(runs):\n    return sum(1 for reply, answer in runs if answer in reply) / len(runs)\n\ndef word_length(runs):\n    return sum(style_features(reply)[0] for reply, _ in runs) / len(runs)\n\nreturn round(accuracy(treated) - accuracy(control), 3), round(word_length(treated) - word_length(control), 2)"
}
@@assert
_control = run("")
_professor = ab_summary(_control, run("You are a distinguished professor."))
assert _professor[0] == 0.0, f"The professor's role does not change accuracy, got {_professor[0]}"
assert _professor[1] > 2.0, f"The professor's role raises average word length by more than two letters, got {_professor[1]}"
_child = ab_summary(_control, run("You are a small child."))
assert _child[0] == 0.0 and _child[1] < 0, f"The child's role leaves accuracy alone and shortens the words, got {_child}"
_pirate = ab_summary(_control, run("You are a pirate."))
assert _pirate[0] == 0.0 and _pirate[1] > 0, f"The pirate's role leaves accuracy alone and changes the style, got {_pirate}"
assert ab_summary(_control, _control) == (0.0, 0.0), "Comparing a run with itself shows no change"
assert ab_summary([("It is 5.", "6")], [("It is 6.", "6")]) == (1.0, 0.0), "A reply that contains the correct answer counts as correct"
assert ab_summary([("aa bb.", "x"), ("aa bb.", "x")], [("aaaa bbbb.", "x"), ("aa bb.", "x")]) == (0.0, 1.0), "Word length is averaged over the runs"
print("Step 4 passed: every role changes the style, and none changes the accuracy.")

@@step
{
  "stepNumber": 5,
  "title": "The winner's curse",
  "instruction": "Implement persona_sweep(n_personas, n_questions, p, seed). Create a random generator with random.Random(seed). Every persona has the same true accuracy p. For each persona, its observed score is the share of n_questions for which rng.random() is less than p. Return a tuple of the best observed score and the mean of the observed scores. Run it for 162 personas on 200 questions with p = 0.6: the mean is about 0.60 and the best is about 0.71, although no persona is better than any other. This is the winner's curse from Section 2. [MOD-5.2]",
  "hintConceptual": "Give many identical contestants the same test and their scores will differ by luck. The top score always looks impressive. That is what a lucky sample looks like.",
  "hintSyntax": "rng = random.Random(seed)\nscores = [sum(rng.random() < p for _ in range(n_questions)) / n_questions for _ in range(n_personas)]\nreturn max(scores), sum(scores) / len(scores)"
}
@@assert
_best, _mean = persona_sweep(162, 200, 0.6, seed=1)
assert abs(_mean - 0.6) < 0.02, f"The mean of 162 identical personas is close to the true accuracy of 0.6, got {_mean}"
assert _best > 0.65, f"The best of 162 identical personas scores well above 0.6 by chance, got {_best}"
assert _best >= _mean, "The best score is never below the mean"
assert persona_sweep(162, 200, 0.6, seed=1) == (_best, _mean), "The same seed gives the same result"
_one = persona_sweep(1, 50, 0.6, seed=3)
assert _one[0] == _one[1], "With a single persona the best and the mean are the same"
assert persona_sweep(10, 40, 1.0, seed=5) == (1.0, 1.0), "A true accuracy of 1 gives perfect scores"
assert persona_sweep(10, 40, 0.0, seed=5) == (0.0, 0.0), "A true accuracy of 0 gives zero scores"
assert persona_sweep(162, 20, 0.6, seed=1)[0] > persona_sweep(162, 2000, 0.6, seed=1)[0], "Fewer questions exaggerate the best score"
assert 0 <= _mean <= 1 and 0 <= _best <= 1, "Each score is a share of the questions, between 0 and 1"
print("Step 5 passed: the best of 162 identical personas appears to score about 0.71 against a true 0.60.")
