@@meta
{
  "moduleId": "MOD-5.6",
  "slug": "mod-5-6",
  "unitId": "UNIT-5",
  "unitTitle": "Unit 5: Complete Prompt Engineering Master Class",
  "title": "Prompt Chaining",
  "difficulty": "Intermediate",
  "estimatedMinutes": 95,
  "citations": [
    { "title": "Building effective agents", "source": "Anthropic Research", "url": "https://www.anthropic.com/research/building-effective-agents" },
    { "title": "Prompting best practices (chain complex prompts)", "source": "Anthropic Docs", "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
    { "title": "AI Chains: Transparent and Controllable Human-AI Interaction by Chaining Large Language Model Prompts", "source": "arXiv", "url": "https://arxiv.org/abs/2110.01691" },
    { "title": "Decomposed Prompting: A Modular Approach for Solving Complex Tasks", "source": "arXiv", "url": "https://arxiv.org/abs/2210.02406" },
    { "title": "Self-Consistency Improves Chain of Thought Reasoning in Language Models", "source": "arXiv", "url": "https://arxiv.org/abs/2203.11171" }
  ],
  "videoLibrary": [
    {
      "id": "VID-5.6-1",
      "title": "Prompt Engineering Course Part 3 - Prompt Chaining",
      "creator": "WaldoGPT",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=IGdiKtCzhRc",
      "timingInstruction": "Watch after reading Section 1; listen for when a fixed chain is preferred to an agent",
      "keyTakeaway": "Building a prompt chain where each step's output feeds the next."
    },
    {
      "id": "VID-5.6-2",
      "title": "Prompt Chaining vs Dynamic Decomposition | Claude Certified Architect Foundations - 06",
      "creator": "TechWhistle",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=aG68fSDe_-k",
      "timingInstruction": "Watch after reading Section 2 (the evaluator and optimiser pattern)",
      "keyTakeaway": "When to use a fixed chain and when to let the model decompose the task itself."
    },
    {
      "id": "VID-5.6-3",
      "title": "Building with the Claude API",
      "creator": "Anthropic",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/building-with-the-claude-api",
      "timingInstruction": "Take the lessons on workflows after completing the lab",
      "keyTakeaway": "Builds chains, routers, and parallel calls in code with a real model, the production form of this chapter's stand-ins."
    },
    {
      "id": "VID-5.6-4",
      "title": "Prompt Engineering for ChatGPT",
      "creator": "Vanderbilt University",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/prompt-engineering",
      "timingInstruction": "Optional; the lessons on breaking problems into steps complement Section 1",
      "keyTakeaway": "Teaches decomposition of a task into prompts by hand, in a chat, before any automation."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Chains, Gates, Routers, Votes, and Loops",
    "context": "A support team wants to replace one sprawling prompt that reads a ticket, classifies it, and drafts a reply with a pipeline whose stages can be checked and fixed one at a time. You will build each pattern: a sequential chain with gates, a router with a fallback, a calculation of what majority voting buys, a draft-and-critique loop with a limit, and a model of how gates and retries change a chain's reliability.",
    "language": "python"
  }
}

@@reading
# Prompt Chaining

A single prompt can ask for a great deal: read this ticket, work out what the customer wants, find the order number, decide which team it is for, and write a reply in our tone, under 100 words. A capable model will attempt all of it at once and often succeed. When it fails, though, you cannot tell which part went wrong, and fixing one part tends to disturb another.

**Prompt chaining** splits the work into a sequence of smaller prompts, each doing one thing, with the output of one becoming the input of the next. Module 3.9 introduced the idea as one of five workflow patterns. This chapter looks at the patterns closely: how to decompose a task, how the patterns differ, what the arithmetic of reliability says, and how to pass information between steps and cope when one of them fails.

## 1. First-Principles Mental Model & Intuition

### An assembly line

A craftsman working alone builds a chair from start to finish. If the chair wobbles, the cause could be anywhere. A workshop that splits the job into stations, cut, sand, join, finish, with someone checking the parts between stations, gains three things.

```text
   ONE PROMPT

   ticket  -->  [ read, extract, classify, draft, polish ]  -->  reply
                 one large step: when it fails, where?


   A CHAIN

   ticket --> [extract] --gate--> [classify] --gate--> [draft] --gate--> reply
                 |                    |                   |
              order number         category            checked reply
                 each output can be inspected, tested, and fixed alone
```

**Each station is simple.** A prompt that does one thing can be short, specific, and tested with a handful of examples.

**Each station sees only what it needs.** The drafting step receives the order number and the category, not the raw reasoning that produced them. Module 5.3 explained why a focused context works better than a crowded one.

**Faults are found where they happen.** A check between stations, a **gate**, stops a bad part before more work is built on it. When something goes wrong, you know which station to look at.

### The price

A chain costs more model calls and takes longer, because the steps run one after another. It also has more joins, and every join is a place where information can be lost or an error can pass through. Anthropic's guide to these patterns describes prompt chaining as trading latency for higher accuracy by making each call an easier task.

That trade is not always worth making. The same guide's main advice is to find the simplest solution that works. A task a single well-written prompt handles reliably should stay a single prompt.

### When to chain

| Sign | What it suggests |
|---|---|
| The prompt has grown to several unrelated instructions | Split it at the seams |
| Fixing one behaviour keeps breaking another | The parts are interfering. Separate them |
| You cannot tell which part of a wrong answer went wrong | You need intermediate outputs to inspect |
| Different inputs need quite different handling | Route them |
| The output must be checked before anything is built on it | Put a gate there |
| One prompt does it reliably | Leave it alone |

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Decomposition

To decompose a task, look for points where an intermediate result is a thing in its own right: something you could write down, look at, and judge. "The order number." "The category." "A list of the five main points." Each such result is the boundary between two steps.

A good step has three properties.

| Property | Meaning |
|---|---|
| **One job** | It can be described in a sentence without the word "and" |
| **A checkable output** | You can state, in advance, what a valid output looks like |
| **A defined input** | It needs specific earlier outputs, not "everything so far" |

Research supports the approach. A 2022 study of people building with chained prompts found that chaining improved the quality of results and made the system easier to understand and control. Work on "decomposed prompting" found that splitting a hard task into sub-tasks, each with its own prompt, outperformed a single prompt asked to reason through the whole thing.

### Four patterns

**Sequential chain with gates.** Steps run in a fixed order. Between steps, a gate checks the output with ordinary code or another prompt, and stops the chain if it fails.

```text
   input --> [step 1] --gate--> [step 2] --gate--> [step 3] --> output
                          |                  |
                        fail: stop         fail: stop
```

**Routing.** A first step classifies the input, and the classification selects which of several specialised prompts handles it.

```text
                       +--> [billing prompt]
   input --> [classify]+--> [technical prompt]  --> output
                       +--> [general prompt]     (the fallback)
```

A prompt tuned for refund requests does not have to handle password resets too. Routing works when the categories are distinct and the classifier is accurate. It needs a fallback for inputs that fit no category.

**Parallelisation.** Several calls run at the same time and their results are combined. There are two kinds. **Sectioning** splits a task into independent parts: summarise each chapter separately. **Voting** runs the same task several times and takes the commonest answer.

```text
   SECTIONING                               VOTING

            +--> [part A] --+                        +--> [attempt 1] --+
   input ---+--> [part B] --+--> combine     input --+--> [attempt 2] --+--> majority
            +--> [part C] --+                        +--> [attempt 3] --+
```

**Evaluator and optimiser.** One prompt produces a draft. Another judges it against stated criteria. If it falls short, the criticism is fed back and the draft is revised, for a limited number of rounds.

```text
   input --> [draft] --> [evaluate] --pass--> output
                ^             |
                +--- fail ----+     (at most N rounds)
```

A fifth pattern, in which a model decides for itself what the sub-tasks are and hands them to helpers, belongs to agents and is covered in Unit 8. The four above have a fixed structure decided by you.

### The arithmetic of a chain

Module 2.12 gave the basic fact. If each of $n$ steps succeeds independently with probability $p$, the chain succeeds with probability

$$
P(\text{chain}) = p^{n}
$$

Five steps at 90 percent each succeed together $0.9^{5} = 0.590$ of the time. A chain is less reliable than any of its steps, which is the strongest argument against adding steps casually.

Gates and retries change the picture. Suppose that when a step fails, the gate after it notices with probability $c$, and a noticed failure is retried, up to $r$ times. A step now succeeds if it works the first time, or fails detectably and then works, and so on:

$$
p_{\text{step}} = p \sum_{j=0}^{r} \bigl((1 - p)\,c\bigr)^{j}
$$

and the chain succeeds with probability $p_{\text{step}}^{\,n}$.

| Setup, with $p = 0.9$ and $n = 5$ | Chain success |
|---|---|
| No gates | 0.590 |
| Gates that catch 80 percent of failures, two retries | 0.894 |
| Gates that catch every failure, two retries | 0.995 |

The gate is what makes a retry possible: an error nobody notices cannot be retried. A chain with good gates can be more reliable than a single prompt, because a single prompt has nowhere to put a check.

The formula assumes that a retry is a fresh, independent attempt. Module 5.5 explained why that holds better when the error is fed back to the model than when the same request is simply repeated.

### The arithmetic of voting

If each of $k$ independent attempts is correct with probability $p$, and the answer is decided by majority, the result is correct when more than half the attempts are. For odd $k$:

$$
P(\text{majority correct}) = \sum_{i = (k+1)/2}^{k} \binom{k}{i} p^{i} (1 - p)^{k - i}
$$

| Accuracy of one attempt | 1 attempt | 3 attempts | 5 attempts |
|---|---|---|---|
| 0.7 | 0.700 | 0.784 | 0.837 |
| 0.8 | 0.800 | 0.896 | 0.942 |
| 0.4 | 0.400 | 0.352 | 0.317 |

Voting amplifies whatever tendency is there. Above one half it helps. Below one half it makes things worse, because the wrong answer is the majority. A 2022 paper on "self-consistency" showed large gains on reasoning problems from sampling several answers and taking the commonest.

Two cautions. Voting multiplies cost by $k$. And the gain depends on the attempts being independent, which they are only partly: the same model with the same prompt tends to make the same mistake. Varying the prompt or the model between attempts gives more independence than repeating one request.

### Passing state between steps

What travels from one step to the next matters as much as the steps themselves.

**Pass structured data.** A step that returns "The order number appears to be A1234, I think" forces the next step to interpret prose. A step that returns `{"order": "A1234"}` does not. The structured output of Module 5.5 is what makes chains dependable.

**Pass only what the next step needs.** Each step should receive the specific earlier outputs it depends on. Forwarding the entire accumulated transcript recreates the crowded context the chain was meant to avoid.

**Keep everything in one record.** A simple shared record, holding the original input and each step's output under its name, makes the flow traceable. When a result is wrong, you can read the record and see which step produced the fault.

**Mark material clearly.** When one step's output is inserted into the next step's prompt, delimit it, as Module 5.1 advised, so that the model does not take an earlier output for an instruction.

### Handling failure

A gate that fails has to lead somewhere. There are four options, and a good chain chooses deliberately at each gate.

| Response | When |
|---|---|
| **Retry** with the error fed back | The failure is likely to be a one-off, such as a formatting slip |
| **Fall back** to a simpler or safer path | A specialised route did not fit: use the general one |
| **Stop** and report | Continuing would build on a known error |
| **Hand to a person** | The decision matters, and the system cannot make it reliably |

The worst response is none: continuing as if nothing had happened. A chain with no gates passes every error forward, and the final output gives no sign of where it started.

Every loop needs a limit. An evaluator that is never satisfied, with an optimiser that cannot satisfy it, will run until someone notices the bill.

### Cost and latency

A sequential chain of $n$ steps makes $n$ calls, and its latency is the sum of theirs. Parallel steps cost the same in total and take only as long as the slowest. Voting costs $k$ times one call. An evaluator loop costs two calls per round. For work done in the background these are minor. For someone waiting for a reply, three sequential calls may be too slow, and that alone can decide the design.

### Complexity

A chain is linear in its steps. Routing adds one classification call. Voting and sectioning multiply calls by the number of branches. An evaluator loop is bounded by its round limit. The real complexity is in the joins: each one is an interface to design, a gate to write, and a failure to handle.

## 3. Production-Grade Implementation & Annotated Walkthrough

Each pattern is a few lines of ordinary code around the model calls. Here the "model calls" are simple stand-in functions, so that everything runs offline. First, a chain with gates.

```python
import re

def extract(state):
    found = re.search(r"\b[A-Z]\d{4}\b", state["input"])
    return {"order": found.group(0) if found else None}

def classify(state):
    text = state["input"].lower()
    if any(word in text for word in ("charged", "refund", "invoice", "payment")):
        return "billing"
    if any(word in text for word in ("error", "crash", "login", "password")):
        return "technical"
    return "general"

def draft(state):
    return f"Thank you for contacting us about order {state['extract']['order']}. Our {state['classify']} team will reply within one working day."

STEPS = [
    ("extract", extract, lambda output: output["order"] is not None),
    ("classify", classify, lambda output: output in ("billing", "technical", "general")),
    ("draft", draft, lambda output: len(output.split()) <= 40),
]

def run_chain(steps, data):
    state = {"input": data}
    for name, function, gate in steps:
        output = function(state)
        state[name] = output
        if not gate(output):
            return {"ok": False, "failed_at": name, "state": state}
    return {"ok": True, "failed_at": None, "state": state}

good = run_chain(STEPS, "Hi, I was charged twice for order A1234. Please refund one payment.")
print(good["ok"], good["state"]["extract"], good["state"]["classify"])
print(good["state"]["draft"])
bad = run_chain(STEPS, "Hello, I was charged twice and want a refund.")
print(bad["ok"], bad["failed_at"], sorted(bad["state"]))
```

- **Each step is a function of the shared state.** It reads what it needs by name, the original input or an earlier step's output, and returns its own result. The drafting step uses the order number and the category and never looks at the ticket again.
- **Each step comes with its gate.** The gate is a small function that says whether the output is acceptable: an order number was found, the category is one of three, the reply is short enough. These are checks a program can make, with no model involved.
- **`run_chain` stores every output under the step's name.** The state is a complete record of what happened. For the good ticket it holds the order number, the category, and the reply.
- **A failed gate stops the chain.** The second ticket has no order number. The extraction gate fails, and the function returns at once, naming the step. Classification and drafting never run.
- **Stopping is the point.** Without the gate, the drafting step would have written "Thank you for contacting us about order None". The gate turned a silently wrong reply into a clear signal: this ticket needs a different path.

Next, routing with a fallback.

```python
HANDLERS = {
    "billing": lambda text: "Routed to billing: a refund specialist will review the charge.",
    "technical": lambda text: "Routed to technical: please send the error message you saw.",
    "general": lambda text: "Routed to general enquiries.",
}

def route(text, classifier, handlers, default="general"):
    label = classifier(text)
    if label not in handlers:
        label = default
    return label, handlers[label](text)

print(route("I was charged twice", lambda text: classify({"input": text}), HANDLERS))
print(route("My parcel is late", lambda text: "shipping", HANDLERS))
```

- **The classifier and the handlers are separate.** One function decides the category and another, chosen by that decision, does the work. Each can be improved and tested without touching the other.
- **An unknown label falls back to the default.** The second classifier returns "shipping", for which there is no handler. A model used as a classifier will occasionally invent a category. Without the fallback, that would be a crash.
- **The function returns the label as well as the result.** Recording which route was taken is what lets you measure, later, how often the classifier sends things to the wrong place.

Then, the arithmetic of voting and of gated chains.

```python
import math
from collections import Counter

def vote_accuracy(p, k):
    return sum(math.comb(k, i) * p ** i * (1 - p) ** (k - i) for i in range(k // 2 + 1, k + 1))

def chain_reliability(p, n, catch=0.0, retries=0):
    per_step = p * sum(((1 - p) * catch) ** attempt for attempt in range(retries + 1))
    return per_step ** n

for p in (0.7, 0.8, 0.4):
    print(p, [round(vote_accuracy(p, k), 3) for k in (1, 3, 5)])
print(Counter(["billing", "billing", "technical", "billing", "general"]).most_common(1)[0])
print(round(chain_reliability(0.9, 5), 3), round(chain_reliability(0.9, 5, catch=0.8, retries=2), 3),
      round(chain_reliability(0.9, 5, catch=1.0, retries=2), 3))
```

- **`vote_accuracy` adds up the ways a majority can be right.** For five attempts that is three, four, or five correct. `math.comb` counts the arrangements of each.
- **Voting helps a good voter and harms a bad one.** At 0.7 per attempt, five votes give 0.837. At 0.4, five votes give 0.317, worse than one.
- **The vote itself is one line.** `Counter(...).most_common(1)` returns the commonest answer and its count: here "billing", three times out of five.
- **`chain_reliability` is the formula from Section 2.** A five-step chain at 0.9 per step succeeds 59 percent of the time with no gates, 89 percent with gates that catch four failures in five and two retries, and 99.5 percent with gates that catch everything.
- **The middle figure is the realistic one.** No gate catches every error. The lesson is that even imperfect gates recover most of what an ungated chain loses.

Finally, the evaluator and optimiser loop.

```python
def evaluator_optimizer(draft, evaluate, improve, max_rounds=3):
    for round_number in range(max_rounds + 1):
        problems = evaluate(draft)
        if not problems:
            return draft, round_number, True
        if round_number == max_rounds:
            return draft, round_number, False
        draft = improve(draft, problems)

def evaluate_reply(text):
    problems = []
    if len(text.split()) > 20:
        problems.append("too long")
    if "sorry" not in text.lower():
        problems.append("no apology")
    return problems

def improve_reply(text, problems):
    if "no apology" in problems:
        return "Sorry for the trouble. " + text
    if "too long" in problems:
        return " ".join(text.split()[:20])
    return text

first = ("We have looked into the duplicate charge on your order and a refund for the second payment "
         "will be issued to your original payment method within five working days.")
print(evaluator_optimizer(first, evaluate_reply, improve_reply))
print(evaluator_optimizer(first, evaluate_reply, lambda text, problems: text, max_rounds=2)[1:])
```

- **The evaluator returns a list of specific problems.** "Too long" and "no apology" tell the next step what to change. A verdict of "not good enough" would not.
- **The problems are passed to the improver.** The revision is directed by the criticism. This is the same principle as the repair loop in Module 5.5.
- **Success is checked before the limit.** Each round begins by evaluating. A draft that passes is returned at once, with the number of rounds used and `True`.
- **The loop is bounded.** After `max_rounds` revisions it returns the best it has, with `False`. The second call uses an improver that changes nothing, and the loop ends after two rounds having failed, which is exactly what it should report.
- **The first reply takes two rounds to fix.** The apology is added, which makes it longer, and then it is cut to length. A revision can introduce a new problem while fixing an old one, which is why the evaluation runs again after every change.

**Complexity.** `run_chain` is linear in the steps. `route` is one classification and one handler. `vote_accuracy` sums at most $k$ terms. `evaluator_optimizer` runs the evaluator at most `max_rounds + 1` times.

### Designing a chain

1. **Write the single prompt first.** If it works reliably, stop.
2. **Find the seams.** Where is there an intermediate result you could inspect?
3. **Define each step's input and output.** In structured form where possible.
4. **Write a gate for each output.** What makes it valid? Prefer checks in code.
5. **Decide what happens when each gate fails.** Retry, fall back, stop, or ask a person.
6. **Limit every loop.**
7. **Log the state.** Keep each step's input and output for every run.
8. **Test each step alone**, then the whole chain, on the same fixed set of inputs.

### Chaining by hand

None of this needs code. In a chat application, a chain is a sequence of messages, with you as the gate.

```text
Message 1:  "List the claims this report makes, one per line, with the page number of each."
You:        check the list against the report
Message 2:  "For each claim above, state the evidence the report gives for it, or 'none given'."
You:        check
Message 3:  "Using only the two lists above, write a 200-word assessment of how well supported
             the report's conclusions are."
```

Each message does one job, each output is inspected before the next step builds on it, and the final answer rests on material you have seen.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Chaining too early.** People who have learned the patterns build a five-step pipeline for a job one prompt does well. The result is slower, costlier, and less reliable than what it replaced. Start with one prompt, and split only where it demonstrably fails.

**No gates.** A chain whose steps simply feed each other passes every error forward. The final output looks finished, and the mistake was made four steps earlier. A gate after each step is the difference between a pipeline and a hopeful sequence.

**Free text between steps.** One step's chatty output becomes the next step's input, and the next step has to guess what the previous one meant. Pass structured data and validate it.

**Passing everything forward.** Each step is given the full history "just in case". By the fifth step the context is long, repetitive, and full of superseded drafts. Give each step only its inputs.

**Loops with no limit.** An evaluator and an optimiser that disagree will run forever. Every loop gets a maximum number of rounds and a defined result when the maximum is reached.

**An evaluator that agrees with itself.** The same model, with similar instructions, judging its own draft, tends to approve it. Give the evaluator explicit criteria, a different brief, and where possible a check in code or a different model.

**Voting with identical attempts.** Asking the same question the same way five times at a low temperature gives five copies of one answer. Agreement then means nothing. Vary the wording, the examples, or the model.

**A router with no fallback.** The classifier returns a label nobody planned for, and the system fails. Always have a default route, and record how often it is used: a busy fallback means the categories need revisiting.

**Misrouting that nobody measures.** A router that sends 8 percent of tickets to the wrong specialist degrades everything downstream. Keep a labelled sample and check the classifier's accuracy regularly.

**Retries with side effects.** A step that sends an email or charges a card, retried after a failure, sends the email or charges the card twice. Steps that act on the world must be safe to repeat, or must not be retried automatically.

**No record of the run.** When a chain produces a bad result and nothing was logged, there is no way to find the faulty step. Keep the state.

**Latency nobody budgeted for.** Three sequential calls at four seconds each is twelve seconds, which is a long time to watch a spinner. For interactive use, count the calls on the path to a reply and run in parallel what can be.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Prompt chaining splits a task into a sequence of focused prompts, each with one job, a defined input, and a checkable output. It trades more calls and more latency for accuracy and for the ability to see where a fault arose. Four patterns have a fixed structure: a sequential chain with gates, routing to specialised prompts with a fallback, parallel calls that are either split by section or combined by vote, and a loop in which an evaluator's specific criticisms drive revisions for a limited number of rounds. A chain of $n$ steps at reliability $p$ succeeds only $p^n$ of the time, so steps should not be added casually. Gates that detect failures, with retries, recover most of that loss and can make a chain more reliable than a single prompt. Majority voting raises accuracy when a single attempt is better than even and lowers it otherwise, at a multiple of the cost, and only to the extent that attempts are independent. State should pass between steps as structured data, limited to what the next step needs, and every gate needs a decided response to failure: retry, fall back, stop, or hand to a person.

**Question 1.** A document-processing chain has 8 steps, each of which succeeds 95 percent of the time. Compute the chance the chain succeeds with no gates. Then add a gate after each step that detects 90 percent of failures, with one retry allowed, and compute the chance again. What does the comparison show about where to spend effort?

<details>
<summary>View Answer</summary>

With no gates the chain succeeds only if all eight steps do: 0.95 to the eighth power, which is about 0.663. One run in three produces a faulty result, with no indication of which step failed. With gates and one retry, a step succeeds if it works the first time, with probability 0.95, or if it fails, the failure is detected, and the retry works: 0.05 times 0.9 times 0.95, which is 0.04275. The per-step success is 0.99275. Raised to the eighth power that is about 0.943. The same eight steps, with the same underlying reliability, now succeed 94 percent of the time. The comparison shows that the gates did more than any plausible improvement to the prompts could. Raising each step from 95 to 97 percent, which would take considerable prompt work, would give 0.97 to the eighth, about 0.784. Adding checks between steps, most of which can be a few lines of code, gave 0.943. Effort is best spent first on making failures detectable, since a failure that is caught can be retried, redirected, or stopped, and one that is not caught cannot. The calculation assumes the retry is an independent attempt, which is more nearly true if the specific error is fed back to the model.

</details>

**Question 2.** A classification prompt is correct 80 percent of the time. Compute the accuracy of a majority vote over 3 attempts and over 5. State the cost of each. Then explain what would happen if the five attempts were made with the identical prompt at a very low temperature, and what to do instead.

<details>
<summary>View Answer</summary>

For three attempts, the majority is correct when two or three are. Three correct has probability 0.8 cubed, which is 0.512. Exactly two correct has probability 3 times 0.8 squared times 0.2, which is 0.384. The total is 0.896. For five attempts, the majority is correct when three, four, or five are. Five correct is 0.8 to the fifth, 0.328. Four correct is 5 times 0.8 to the fourth times 0.2, which is 0.410. Three correct is 10 times 0.8 cubed times 0.04, which is 0.205. The total is about 0.942. So accuracy rises from 80 to about 90 to about 94 percent, at three times and five times the cost of a single call. The gain from three to five is smaller than from one to three, which is typical: returns diminish. These figures assume the attempts are independent. Five runs of an identical prompt at a very low temperature are close to five copies of one answer. If that answer is wrong, all five are wrong, the vote is unanimous, and accuracy stays near 80 percent while the cost is five times higher. Unanimity would also look like confidence, which makes it worse. To get the benefit of voting, the attempts must be able to differ: raise the temperature, vary the wording of the prompt or the order and choice of examples, or use different models. Disagreement between varied attempts is then informative, and can be used to send uncertain cases to a person.

</details>

**Question 3.** A company uses one long prompt to turn a recorded sales call into a follow-up email: it must summarise the call, identify the customer's objections, look up the right product page, and write the email in the company's tone. Results are inconsistent. Design a chain to replace it, naming each step, its output, its gate, and what happens when the gate fails.

<details>
<summary>View Answer</summary>

The task has clear seams, because each requirement produces something that can be inspected. Step one extracts from the transcript a structured record: the customer's name, the products discussed, the objections raised, each as a direct quote, and any commitments made. Its gate checks that the record has the required fields and that each quoted objection actually appears in the transcript. If the gate fails, retry once with the error fed back, and if it fails again, hand the call to a person, since everything later depends on it. Step two routes on the products discussed, choosing the product page from a fixed list. Its gate checks that the chosen page is on the list. If no product matches, fall back to a general page and flag the email for review. Step three drafts the email, given only the structured record and the product page, with two examples of the company's tone. Its gate checks length, that every objection in the record is addressed, and that no price or date appears that is not in the record. If it fails, the specific problems go back for a revision, for at most two rounds. Step four is a final evaluation against a short checklist by a prompt with a different brief, or a different model. If the email still fails, it goes to the salesperson as a draft marked for attention and is not sent. The state for every call is logged, so that when an email is wrong the faulty step can be found. Because the email goes to a customer, sending remains a human decision at least until the chain's error rate has been measured.

</details>

@@starter
"""
Lab: Chains, Gates, Routers, Votes, and Loops
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".

The "model calls" here are ordinary functions, so that everything runs offline.
"""
import math
import re


def extract(state):
    """Provided step: find an order number such as A1234 in the ticket."""
    found = re.search(r"\b[A-Z]\d{4}\b", state["input"])
    return {"order": found.group(0) if found else None}


def classify(state):
    """Provided step: choose a category from words in the ticket."""
    text = state["input"].lower()
    if any(word in text for word in ("charged", "refund", "invoice", "payment")):
        return "billing"
    if any(word in text for word in ("error", "crash", "login", "password")):
        return "technical"
    return "general"


def draft(state):
    """Provided step: write a reply from the EARLIER OUTPUTS, not from the ticket."""
    return f"Thank you for contacting us about order {state['extract']['order']}. Our {state['classify']} team will reply within one working day."


# Each step is (name, function, gate). The gate says whether the step's output is acceptable.
STEPS = [
    ("extract", extract, lambda output: output["order"] is not None),
    ("classify", classify, lambda output: output in ("billing", "technical", "general")),
    ("draft", draft, lambda output: len(output.split()) <= 40),
]

HANDLERS = {
    "billing": lambda text: "Routed to billing: a refund specialist will review the charge.",
    "technical": lambda text: "Routed to technical: please send the error message you saw.",
    "general": lambda text: "Routed to general enquiries.",
}


def evaluate_reply(text):
    """Provided evaluator: returns a list of specific problems."""
    problems = []
    if len(text.split()) > 20:
        problems.append("too long")
    if "sorry" not in text.lower():
        problems.append("no apology")
    return problems


def improve_reply(text, problems):
    """Provided optimiser: fixes one named problem per call."""
    if "no apology" in problems:
        return "Sorry for the trouble. " + text
    if "too long" in problems:
        return " ".join(text.split()[:20])
    return text


FIRST_DRAFT = ("We have looked into the duplicate charge on your order and a refund for the second payment "
               "will be issued to your original payment method within five working days.")


# ---------------------------------------------------------------- Step 1
def run_chain(steps, data):
    """Run a sequential chain with gates.
    Start with state = {"input": data}. For each (name, function, gate) in steps:
      - output = function(state); store it as state[name]
      - if gate(output) is false, return {"ok": False, "failed_at": name, "state": state}
    If every gate passes, return {"ok": True, "failed_at": None, "state": state}."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def route(text, classifier, handlers, default="general"):
    """Routing with a fallback. label = classifier(text). If the label is not a key of
    handlers, use default instead. Return (label, handlers[label](text))."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def vote_accuracy(p, k):
    """The probability that a majority of k independent attempts is correct, when each is
    correct with probability p. Sum, for i from k // 2 + 1 to k inclusive,
        math.comb(k, i) * p ** i * (1 - p) ** (k - i)"""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def evaluator_optimizer(draft_text, evaluate, improve, max_rounds=3):
    """Draft, criticise, revise, with a limit. For round_number = 0, 1, ..., max_rounds:
      - problems = evaluate(draft_text)
      - if there are no problems, return (draft_text, round_number, True)
      - if round_number == max_rounds, return (draft_text, round_number, False)
      - otherwise draft_text = improve(draft_text, problems)"""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def chain_reliability(p, n, catch=0.0, retries=0):
    """The probability that an n-step chain succeeds. Each step succeeds with probability p.
    When a step fails, its gate notices with probability `catch`, and a noticed failure is
    retried, up to `retries` times.
        per_step = p * sum(((1 - p) * catch) ** attempt for attempt in 0 .. retries)
        result   = per_step ** n"""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("chain  :", run_chain(STEPS, "Hi, I was charged twice for order A1234. Please refund one payment."))
    print("route  :", route("I was charged twice", lambda text: classify({"input": text}), HANDLERS))
    print("vote   :", vote_accuracy(0.7, 5))
    print("loop   :", evaluator_optimizer(FIRST_DRAFT, evaluate_reply, improve_reply))
    print("gates  :", chain_reliability(0.9, 5))

@@solution
"""
Lab solution: Chains, Gates, Routers, Votes, and Loops
Standard library only.

The "model calls" here are ordinary functions, so that everything runs offline.
"""
import math
import re
from collections import Counter


def extract(state):
    """Provided step: find an order number such as A1234 in the ticket."""
    found = re.search(r"\b[A-Z]\d{4}\b", state["input"])
    return {"order": found.group(0) if found else None}


def classify(state):
    """Provided step: choose a category from words in the ticket."""
    text = state["input"].lower()
    if any(word in text for word in ("charged", "refund", "invoice", "payment")):
        return "billing"
    if any(word in text for word in ("error", "crash", "login", "password")):
        return "technical"
    return "general"


def draft(state):
    """Provided step: write a reply from the EARLIER OUTPUTS, not from the ticket."""
    return f"Thank you for contacting us about order {state['extract']['order']}. Our {state['classify']} team will reply within one working day."


# Each step is (name, function, gate). The gate says whether the step's output is acceptable.
STEPS = [
    ("extract", extract, lambda output: output["order"] is not None),
    ("classify", classify, lambda output: output in ("billing", "technical", "general")),
    ("draft", draft, lambda output: len(output.split()) <= 40),
]

HANDLERS = {
    "billing": lambda text: "Routed to billing: a refund specialist will review the charge.",
    "technical": lambda text: "Routed to technical: please send the error message you saw.",
    "general": lambda text: "Routed to general enquiries.",
}


def evaluate_reply(text):
    """Provided evaluator: returns a list of specific problems."""
    problems = []
    if len(text.split()) > 20:
        problems.append("too long")
    if "sorry" not in text.lower():
        problems.append("no apology")
    return problems


def improve_reply(text, problems):
    """Provided optimiser: fixes one named problem per call."""
    if "no apology" in problems:
        return "Sorry for the trouble. " + text
    if "too long" in problems:
        return " ".join(text.split()[:20])
    return text


FIRST_DRAFT = ("We have looked into the duplicate charge on your order and a refund for the second payment "
               "will be issued to your original payment method within five working days.")


# ---------------------------------------------------------------- Step 1
def run_chain(steps, data):
    """The state is a complete record of the run. A failed gate stops the chain, so that
    nothing is built on a known error."""
    state = {"input": data}
    for name, function, gate in steps:
        output = function(state)
        state[name] = output
        if not gate(output):
            return {"ok": False, "failed_at": name, "state": state}
    return {"ok": True, "failed_at": None, "state": state}


# ---------------------------------------------------------------- Step 2
def route(text, classifier, handlers, default="general"):
    """A classifier will occasionally return a label nobody planned for. The fallback
    turns that from a crash into a handled case."""
    label = classifier(text)
    if label not in handlers:
        label = default
    return label, handlers[label](text)


# ---------------------------------------------------------------- Step 3
def vote_accuracy(p, k):
    """Voting amplifies the tendency that is there: it helps above one half and harms below."""
    return sum(math.comb(k, i) * p ** i * (1 - p) ** (k - i) for i in range(k // 2 + 1, k + 1))


# ---------------------------------------------------------------- Step 4
def evaluator_optimizer(draft_text, evaluate, improve, max_rounds=3):
    """The evaluator's specific problems direct the revision. The loop is bounded, and it
    reports whether it ended in success."""
    for round_number in range(max_rounds + 1):
        problems = evaluate(draft_text)
        if not problems:
            return draft_text, round_number, True
        if round_number == max_rounds:
            return draft_text, round_number, False
        draft_text = improve(draft_text, problems)


# ---------------------------------------------------------------- Step 5
def chain_reliability(p, n, catch=0.0, retries=0):
    """A gate is what makes a retry possible: an error nobody notices cannot be retried."""
    per_step = p * sum(((1 - p) * catch) ** attempt for attempt in range(retries + 1))
    return per_step ** n


if __name__ == "__main__":
    good = run_chain(STEPS, "Hi, I was charged twice for order A1234. Please refund one payment.")
    print(good["ok"], good["state"]["extract"], good["state"]["classify"])
    print(good["state"]["draft"])
    bad = run_chain(STEPS, "Hello, I was charged twice and want a refund.")
    print(bad["ok"], bad["failed_at"], sorted(bad["state"]))

    print(route("I was charged twice", lambda text: classify({"input": text}), HANDLERS))
    print(route("My parcel is late", lambda text: "shipping", HANDLERS))

    for p in (0.7, 0.8, 0.4):
        print(p, [round(vote_accuracy(p, k), 3) for k in (1, 3, 5)])
    print(Counter(["billing", "billing", "technical", "billing", "general"]).most_common(1)[0])
    print(round(chain_reliability(0.9, 5), 3), round(chain_reliability(0.9, 5, catch=0.8, retries=2), 3),
          round(chain_reliability(0.9, 5, catch=1.0, retries=2), 3))

    print(evaluator_optimizer(FIRST_DRAFT, evaluate_reply, improve_reply))
    print(evaluator_optimizer(FIRST_DRAFT, evaluate_reply, lambda text, problems: text, max_rounds=2)[1:])
    print("recall question 1:", round(chain_reliability(0.95, 8), 3), round(chain_reliability(0.95, 8, catch=0.9, retries=1), 3), round(0.97 ** 8, 3))

@@step
{
  "stepNumber": 1,
  "title": "A sequential chain with gates",
  "instruction": "Implement run_chain(steps, data). Create the state as a dict with the key 'input' holding the data. Go through the steps in order. Each is a tuple (name, function, gate). Call the function with the state, store the result in the state under the step's name, and then call the gate with that result. If the gate returns a false value, return at once the dict {'ok': False, 'failed_at': name, 'state': state}. If every step passes its gate, return {'ok': True, 'failed_at': None, 'state': state}. Run it on a ticket with no order number: the chain should stop at the first step, and the later steps must not run. This is the first pattern from Section 2. [MOD-5.6]",
  "hintConceptual": "An assembly line with an inspector after every station. Each station adds its part to the tray. The moment an inspector rejects a part, the line stops and reports where.",
  "hintSyntax": "state = {\"input\": data}\nfor name, function, gate in steps:\n    output = function(state)\n    state[name] = output\n    if not gate(output):\n        return {\"ok\": False, \"failed_at\": name, \"state\": state}\nreturn {\"ok\": True, \"failed_at\": None, \"state\": state}"
}
@@assert
_good = run_chain(STEPS, "Hi, I was charged twice for order A1234. Please refund one payment.")
assert _good["ok"] is True and _good["failed_at"] is None, f"A ticket with an order number passes every gate, got {_good}"
assert _good["state"]["input"].startswith("Hi, I was charged") and _good["state"]["extract"] == {"order": "A1234"} and _good["state"]["classify"] == "billing", "The state holds the input and each step's output under the step's name"
assert _good["state"]["draft"] == "Thank you for contacting us about order A1234. Our billing team will reply within one working day.", "Later steps read earlier outputs from the state"
_bad = run_chain(STEPS, "Hello, I was charged twice and want a refund.")
assert _bad["ok"] is False and _bad["failed_at"] == "extract", f"With no order number the chain stops at the extract step, got {_bad}"
assert sorted(_bad["state"]) == ["extract", "input"], "Steps after a failed gate must not run"
assert _bad["state"]["extract"] == {"order": None}, "The failing step's output is still recorded"
_calls = []
_steps = [("a", lambda state: _calls.append("a") or 1, lambda output: True), ("b", lambda state: _calls.append("b") or 2, lambda output: False), ("c", lambda state: _calls.append("c") or 3, lambda output: True)]
_result = run_chain(_steps, "x")
assert _result["failed_at"] == "b" and _calls == ["a", "b"] and _result["state"] == {"input": "x", "a": 1, "b": 2}, "The chain stops at the first failed gate, in the middle if need be"
assert run_chain([], "x") == {"ok": True, "failed_at": None, "state": {"input": "x"}}, "A chain with no steps succeeds with only the input in the state"
print("Step 1 passed: the chain records every output and stops at the first failed gate.")

@@step
{
  "stepNumber": 2,
  "title": "Route to a specialist, with a fallback",
  "instruction": "Implement route(text, classifier, handlers, default). Call classifier(text) to get a label. If the label is not a key in handlers, replace it with the default. Then call the handler for that label with the text, and return a tuple of the label used and the handler's result. Try it with a classifier that returns 'shipping', for which there is no handler: the request must fall back to the general handler and not crash. This is the routing pattern from Section 2, and the fallback is the part most often forgotten. [MOD-5.6]",
  "hintConceptual": "A receptionist decides which department a visitor needs. If the receptionist names a department that does not exist, the visitor goes to the general desk, not out of the door.",
  "hintSyntax": "label = classifier(text)\nif label not in handlers:\n    label = default\nreturn label, handlers[label](text)"
}
@@assert
_by_words = lambda text: classify({"input": text})
assert route("I was charged twice", _by_words, HANDLERS) == ("billing", "Routed to billing: a refund specialist will review the charge."), f"A billing ticket goes to the billing handler, got {route('I was charged twice', _by_words, HANDLERS)}"
assert route("The app shows an error on login", _by_words, HANDLERS)[0] == "technical", "A technical ticket goes to the technical handler"
assert route("My parcel is late", lambda text: "shipping", HANDLERS) == ("general", "Routed to general enquiries."), "An unknown label falls back to the default handler"
assert route("anything", lambda text: None, HANDLERS)[0] == "general", "A classifier that returns nothing useful also falls back"
assert route("x", lambda text: "odd", {"a": lambda text: "A", "b": lambda text: "B"}, default="b") == ("b", "B"), "The default argument must be used"
assert route("hello", lambda text: "echo", {"echo": lambda text: text.upper(), "general": lambda text: ""}) == ("echo", "HELLO"), "The handler is called with the text"
print("Step 2 passed: known labels reach their specialist, and unknown ones fall back.")

@@step
{
  "stepNumber": 3,
  "title": "What does voting buy?",
  "instruction": "Implement vote_accuracy(p, k). Each of k independent attempts is correct with probability p, and the answer is the majority. The majority is correct when more than half of the attempts are, so add up, for i from k // 2 + 1 to k inclusive, the probability of exactly i correct attempts: math.comb(k, i) times p to the power i times (1 - p) to the power (k - i). Return the sum. This is the voting formula from Section 2. Compare p = 0.7 and p = 0.4 at k = 5: voting helps a good voter and harms a bad one. [MOD-5.6]",
  "hintConceptual": "Ask several people and go with the majority. If each is more often right than wrong, the group is better than any one of them. If each is more often wrong, the group is worse.",
  "hintSyntax": "return sum(math.comb(k, i) * p ** i * (1 - p) ** (k - i) for i in range(k // 2 + 1, k + 1))"
}
@@assert
assert abs(vote_accuracy(0.7, 5) - 0.83692) < 1e-9, f"Five votes at 0.7 each give about 0.837, got {vote_accuracy(0.7, 5)}"
assert abs(vote_accuracy(0.7, 3) - 0.784) < 1e-9, "Three votes at 0.7 each give 0.784"
assert abs(vote_accuracy(0.7, 1) - 0.7) < 1e-12, "One vote is just the single attempt"
assert abs(vote_accuracy(0.8, 3) - 0.896) < 1e-9 and abs(vote_accuracy(0.8, 5) - 0.94208) < 1e-9, "Recall question 2: 0.896 for three votes and about 0.942 for five"
assert abs(vote_accuracy(0.4, 5) - 0.31744) < 1e-9, "Below one half, voting makes things worse: 0.317 against 0.4"
assert abs(vote_accuracy(0.5, 7) - 0.5) < 1e-12, "At exactly one half, voting changes nothing"
assert vote_accuracy(1.0, 9) == 1.0 and vote_accuracy(0.0, 9) == 0.0, "A perfect voter stays perfect and a hopeless one stays hopeless"
assert vote_accuracy(0.7, 5) > vote_accuracy(0.7, 3) > vote_accuracy(0.7, 1), "More votes help when a single attempt is better than even"
print("Step 3 passed: five votes raise 0.7 to 0.837 and lower 0.4 to 0.317.")

@@step
{
  "stepNumber": 4,
  "title": "Draft, criticise, revise, and stop",
  "instruction": "Implement evaluator_optimizer(draft_text, evaluate, improve, max_rounds). Loop with round_number going from 0 to max_rounds inclusive. In each round, call evaluate(draft_text) to get a list of problems. If the list is empty, return the tuple (draft_text, round_number, True). If round_number has reached max_rounds, return (draft_text, round_number, False). Otherwise replace draft_text with improve(draft_text, problems) and continue. The evaluation runs again after every revision, because a fix can introduce a new problem. This is the evaluator and optimiser pattern from Section 2, with the limit that keeps it from running forever. [MOD-5.6]",
  "hintConceptual": "An editor reads the draft and lists what is wrong. The writer fixes those things. The editor reads it again. This repeats until the editor has no complaints or the deadline arrives, and you must be able to tell which.",
  "hintSyntax": "for round_number in range(max_rounds + 1):\n    problems = evaluate(draft_text)\n    if not problems:\n        return draft_text, round_number, True\n    if round_number == max_rounds:\n        return draft_text, round_number, False\n    draft_text = improve(draft_text, problems)"
}
@@assert
_final, _rounds, _passed = evaluator_optimizer(FIRST_DRAFT, evaluate_reply, improve_reply)
assert _passed is True and _rounds == 2, f"The first draft is fixed in two rounds, got rounds={_rounds}, passed={_passed}"
assert _final.startswith("Sorry for the trouble.") and len(_final.split()) == 20 and evaluate_reply(_final) == [], f"The final draft has an apology and is 20 words long, got {_final!r}"
assert evaluator_optimizer("Sorry, we will fix it.", evaluate_reply, improve_reply) == ("Sorry, we will fix it.", 0, True), "A draft with no problems is returned after zero rounds"
assert evaluator_optimizer(FIRST_DRAFT, evaluate_reply, lambda text, problems: text, max_rounds=2) == (FIRST_DRAFT, 2, False), "An improver that changes nothing ends at the limit with False"
assert evaluator_optimizer(FIRST_DRAFT, evaluate_reply, improve_reply, max_rounds=1)[1:] == (1, False), "With one round allowed the draft still has a problem: the max_rounds argument must be used"
assert evaluator_optimizer(FIRST_DRAFT, evaluate_reply, improve_reply, max_rounds=0) == (FIRST_DRAFT, 0, False), "With no rounds allowed the draft is evaluated once and returned unchanged"
_seen = []
evaluator_optimizer("x", lambda text: ["short"] if len(text) < 3 else [], lambda text, problems: (_seen.append(list(problems)) or text + "y"))
assert _seen == [["short"], ["short"]], "The evaluator's problems are passed to the improver each round"
print("Step 4 passed: the draft is revised until it passes, and the loop stops at its limit.")

@@step
{
  "stepNumber": 5,
  "title": "How gates change a chain's reliability",
  "instruction": "Implement chain_reliability(p, n, catch, retries). Each of n steps succeeds with probability p. When a step fails, its gate notices with probability catch, and a noticed failure is retried, up to retries times. The probability that one step ends in success is p multiplied by the sum, for attempt from 0 to retries inclusive, of ((1 - p) * catch) to the power attempt. The chain succeeds when every step does, so return that per-step probability raised to the power n. This is the formula from Section 2. Compare a five-step chain at 0.9 with no gates, with gates that catch 80 percent of failures and two retries, and with perfect gates. [MOD-5.6]",
  "hintConceptual": "A step can succeed straight away, or fail, be caught, and succeed on the next try, and so on. Add up those routes to success for one step, then remember that every step in the chain has to get there.",
  "hintSyntax": "per_step = p * sum(((1 - p) * catch) ** attempt for attempt in range(retries + 1))\nreturn per_step ** n"
}
@@assert
assert abs(chain_reliability(0.9, 5) - 0.59049) < 1e-9, f"Five steps at 0.9 with no gates succeed 0.590 of the time, got {chain_reliability(0.9, 5)}"
assert abs(chain_reliability(0.9, 5, catch=0.8, retries=2) - 0.97776 ** 5) < 1e-9 and round(chain_reliability(0.9, 5, catch=0.8, retries=2), 3) == 0.894, "Gates catching 80 percent with two retries give 0.894"
assert round(chain_reliability(0.9, 5, catch=1.0, retries=2), 3) == 0.995, "Perfect gates with two retries give 0.995"
assert abs(chain_reliability(0.95, 8) - 0.95 ** 8) < 1e-12 and round(chain_reliability(0.95, 8, catch=0.9, retries=1), 3) == 0.943, "Recall question 1: 0.663 without gates and 0.943 with them"
assert abs(chain_reliability(0.9, 5, catch=1.0, retries=0) - 0.59049) < 1e-9, "A gate with no retries allowed does not raise the success rate"
assert abs(chain_reliability(0.9, 5, catch=0.0, retries=5) - 0.59049) < 1e-9, "Retries with a gate that catches nothing do not help either"
assert chain_reliability(1.0, 10) == 1.0 and chain_reliability(0.5, 1) == 0.5, "A perfect step gives a perfect chain, and one step is just that step"
assert chain_reliability(0.9, 10) < chain_reliability(0.9, 5), "A longer chain is less reliable"
print("Step 5 passed: gates and retries take a five-step chain from 0.590 to 0.894, and to 0.995 if they catch everything.")
