@@meta
{
  "moduleId": "MOD-2.2",
  "slug": "mod-2-2",
  "unitId": "UNIT-2",
  "unitTitle": "Unit 2: Mastering ChatGPT",
  "title": "Models and Model Selection",
  "difficulty": "Foundational",
  "estimatedMinutes": 95,
  "citations": [
    { "title": "Models and pricing", "source": "OpenAI Docs", "url": "https://developers.openai.com/api/docs/models" },
    { "title": "Model selection guide", "source": "OpenAI Docs", "url": "https://developers.openai.com/api/docs/guides/model-selection" },
    { "title": "Evals guide", "source": "OpenAI Docs", "url": "https://developers.openai.com/api/docs/guides/evals" },
    { "title": "Reasoning best practices", "source": "OpenAI Docs", "url": "https://developers.openai.com/api/docs/guides/reasoning-best-practices" },
    { "title": "ChatGPT plans and model access", "source": "OpenAI", "url": "https://chatgpt.com/pricing" },
    { "title": "OpenAI overhauls ChatGPT's model selection", "source": "The Decoder", "url": "https://the-decoder.com/openai-overhauls-chatgpts-model-selection/" },
    { "title": "Bring back a true Auto mode", "source": "OpenAI Community", "url": "https://community.openai.com/t/bring-back-a-true-auto-mode-let-chatgpt-choose-the-model-and-reasoning-effort/1388693" }
  ],
  "videoLibrary": [
    {
      "id": "VID-2.2-1",
      "title": "How to Choose the RIGHT ChatGPT Model Every Time",
      "creator": "Santrel Clips",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=xClh4bDrJVM",
      "timingInstruction": "Watch the sections on choosing a model and on thinking models after reading Section 1",
      "keyTakeaway": "A decision approach for matching each task to the right ChatGPT model."
    },
    {
      "id": "VID-2.2-2",
      "title": "GPT 5.6 explained in 8min..",
      "creator": "Caleb Writes Code",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=6DKDgQ27smM",
      "timingInstruction": "Watch the thinking-models section after reading Section 2",
      "keyTakeaway": "A short technical overview of the current GPT model family and its trade-offs."
    },
    {
      "id": "VID-2.2-3",
      "title": "Generative AI: Foundation Models and Platforms",
      "creator": "IBM",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/generative-ai-foundation-models-and-platforms",
      "timingInstruction": "Optional after this module, for a wider view beyond one vendor",
      "keyTakeaway": "Surveys model families and hosting platforms, useful for seeing that the tiering described here is common across vendors."
    },
    {
      "id": "VID-2.2-4",
      "title": "Prompt Engineering for ChatGPT",
      "creator": "Vanderbilt University",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/prompt-engineering",
      "timingInstruction": "Continue alongside Unit 2",
      "keyTakeaway": "Model choice and prompt quality interact: a better prompt often lets a cheaper model do the job. This course builds the prompt side."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Build a Model Selection Toolkit",
    "context": "A client runs 5,000 support tickets a day through an AI assistant on the most expensive model available, and the bill has become a problem. You will build a cost calculator, a simple router that sends each task to an appropriate tier, and a small evaluation harness that picks the cheapest model meeting a quality bar.",
    "language": "python"
  }
}

@@reading
# Models and Model Selection

Open the model picker in ChatGPT and you face a list of names and modes. Most people pick one once and never touch it again, or always choose the one that sounds most powerful. Both habits cost them: the first in quality on hard problems, the second in time and usage limits on easy ones. Choosing a model is a small engineering decision with a clear method, and this chapter teaches the method.

One caution before starting. Model names are the most perishable facts in this course. OpenAI has renamed, replaced, and retired its lineup several times, and third-party articles written months apart contradict each other. This chapter gives the current names once, for orientation, and otherwise speaks in terms of *tiers*, which have stayed stable through every renaming.

## 1. First-Principles Mental Model & Intuition

### Triage at a hospital

A hospital does not send every patient to its most senior specialist. A nurse at triage handles the routine cases quickly and cheaply. A general doctor sees most of the rest. The specialist is booked only for the cases that need one, because the specialist's time is scarce and expensive, and because a scraped knee gains nothing from a neurosurgeon.

AI models are organised the same way.

| Tier | Hospital analogy | Strengths | Costs |
|---|---|---|---|
| Nano or mini | Triage nurse | Very fast, very cheap | Makes more mistakes on anything subtle |
| Balanced | General doctor | Good quality at moderate cost | The sensible default |
| Flagship | Specialist | Best quality on hard problems | Several times the price, often slower |
| Reasoning mode | A specialist who takes time to think it over | Best on multi-step problems | Slowest, and bills for the thinking |

The goal of model selection is the triage nurse's goal: **send each task to the cheapest level that handles it well.** The goal is never "use the best model". That framing wastes money on easy work and, as you will see, can even be slower without being better.

### Two dials, not one

In current systems you are really setting two dials.

- **Which model**: how large and capable the network is.
- **How much thinking**: how much hidden reasoning the model does before it answers, often called *reasoning effort*.

A large model at low effort and a mid-sized model at high effort can cost about the same and behave quite differently. Keep the two dials separate in your mind. Much of the confusion about the model picker comes from menus that fold both into one list.

### What the interface offers

Inside ChatGPT, the picker has at various times presented named models, modes such as an instant mode and a thinking mode, and graded effort levels. An automatic mode has sometimes chosen for you. Whatever the current labels, they map onto the two dials: a fast setting uses little or no extra reasoning, a thinking setting uses more, and a pro setting uses the most and is restricted to higher plans. When you hit a usage limit the application may move you to a smaller model, so it is worth glancing at which one is active when quality suddenly changes.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### The current lineup, for orientation

At the time of writing, in November 2026, OpenAI's model documentation lists a family with four tiers. The names below are from that page. Treat them as a snapshot.

| Tier | Current name | Input price per 1M tokens | Output price per 1M tokens |
|---|---|---|---|
| Flagship, most capable | GPT-6 Astra | USD 10.00 | USD 50.00 |
| Balanced | GPT-6.1 Sol | USD 2.00 | USD 10.00 |
| Smaller | GPT-6.1 Terra | USD 1.00 | USD 5.00 |
| Most cost-efficient | GPT-6 Luna | USD 0.10 | USD 0.50 |

All four are listed with context windows of about one million tokens through the developer API. Inside ChatGPT, the usable context is much smaller and depends on your plan, as Module 2.1 described. Free and Go plans are given the smallest model with limited access to others. Plus and Pro add the larger models and reasoning modes, and Pro adds the highest-effort mode.

Three patterns in that table are durable even though the names are not.

1. **Output tokens cost about five times as much as input tokens.** Long answers are expensive. Long prompts are comparatively cheap.
2. **Each step up a tier multiplies the price.** Here the range from bottom to top is a factor of one hundred.
3. **The cheapest tier is extremely cheap.** For simple high-volume work it is often the right answer.

### The cost of one request

With prices quoted per million tokens, the cost of a request is:

$$
\text{cost} = \frac{T_{\text{in}}}{10^{6}} \times P_{\text{in}} + \frac{T_{\text{out}}}{10^{6}} \times P_{\text{out}}
$$

Worked example on the balanced tier, with 2,000 input tokens and 500 output tokens:

$$
\frac{2000}{10^{6}} \times 2.00 + \frac{500}{10^{6}} \times 10.00 = 0.004 + 0.005 = \text{USD } 0.009
$$

Less than one cent. Now scale it. At 5,000 such requests a day for 30 days:

$$
0.009 \times 5000 \times 30 = \text{USD } 1{,}350 \text{ per month}
$$

The same workload on the flagship tier, at five times the price, costs USD 6,750. On the cheapest tier it costs USD 67.50. The decision about which tier handles those tickets is worth several thousand dollars a month.

**Reasoning tokens are billed as output.** When a model thinks before answering, the hidden thinking is counted and charged at the output rate, even though you never see it. A request that produces a 500-token answer after 4,000 tokens of reasoning is billed for 4,500 output tokens. This is why raising the effort setting can multiply the cost of a request several times while the visible answer stays the same length.

### Cost per successful task

Price per request is the wrong number to optimise if the cheaper model fails more often. Suppose a model succeeds on a fraction $p$ of tasks and each attempt costs $c$. If a failed task must be redone, the expected number of attempts per success is $1/p$, so:

$$
\text{cost per successful task} = \frac{c}{p}
$$

A cheap model at USD 0.001 per attempt with a 50 percent success rate costs USD 0.002 per success. A model at USD 0.009 with 95 percent success costs about USD 0.0095. The cheap one still wins on raw cost. But the formula leaves out the price of *detecting* the failures and of the human time spent repairing them. If each failure costs a person two minutes, the cheap model is far more expensive overall. Include review and repair time when you compare.

### The five dimensions of choice

| Dimension | Question to ask | Pushes you toward |
|---|---|---|
| Difficulty | Does the task need multi-step reasoning or deep knowledge? | Larger model, more effort |
| Stakes | What does a wrong answer cost? | Larger model, plus review |
| Speed | Is a person waiting on the answer? | Smaller model, less effort |
| Volume | How many times will this run? | Smaller model |
| Input size and type | Is it long, or does it involve images or files? | A model and plan with enough context and the right inputs |

Typical assignments:

| Task | Sensible starting tier |
|---|---|
| Classify a support ticket, extract fields from a form | Nano |
| Rewrite an email, summarise a short document | Smaller or balanced |
| Draft a report from several sources, write a moderately complex function | Balanced |
| Debug a subtle problem, plan a multi-step project, analyse a contract | Flagship or reasoning mode |
| A live voice conversation or autocomplete | Fastest available |

### A repeatable selection procedure

OpenAI's own guidance on choosing a model reduces to a short experimental method. It is worth adopting exactly, because it applies to any vendor.

1. **Build a small test set.** Collect 20 to 50 real examples of the task, with the correct or acceptable output for each. Include the awkward cases.
2. **Write down the acceptance criteria first.** Decide what counts as good enough before you look at any results. Otherwise you will rationalise whatever the first model produces.
3. **Run the same inputs through each candidate.** Same prompt, same examples, same settings apart from the one thing being compared.
4. **Measure quality, cost, and time to a usable result.** Time to a usable result includes the time a person spends checking and fixing the output.
5. **Hold the model fixed and vary the effort.** Then hold the effort fixed and vary the model. Changing both at once tells you nothing.
6. **Keep the lightest setting that meets the bar.** Stop there.

This is a miniature **evaluation**, or eval. The discipline matters more than any tooling. Vendor dashboards for running evals come and go, and a spreadsheet with a column per model is a perfectly good eval harness.

```text
              +--------------------+
              |  test set (20-50)  |
              +----------+---------+
                         |  same inputs
        +----------------+----------------+
        v                v                v
   +---------+      +---------+      +----------+
   |  nano   |      | balanced|      | flagship |
   +----+----+      +----+----+      +----+-----+
        | accuracy,      |                |
        | cost, latency  |                |
        +--------+-------+--------+-------+
                 v                v
        +-------------------------------+
        | meets the acceptance bar?     |
        | pick the CHEAPEST that does   |
        +-------------------------------+
```

Remember the lesson from Module 1.8 about sample size. With 30 examples, the difference between 27 correct and 28 correct is noise. Use the test set to rule out models that clearly fail, and prefer the cheaper of two that are statistically indistinguishable.

### Routing

Once you know which tier suits which kind of task, you can assign tasks automatically. A **router** is a piece of logic, sometimes rules and sometimes a small model, that inspects each request and sends it to an appropriate tier. ChatGPT's automatic mode is a router. So is the few-line function you will write in the lab. Routing is how the support-ticket bill in the earlier example comes down: most tickets go to the cheapest tier, and only the hard or high-stakes ones go up.

**Complexity.** Every calculation in this chapter is constant time per request. An evaluation over $m$ models and $n$ examples needs $m \times n$ model calls, which is the real cost: 5 candidates on 50 examples is 250 requests.

## 3. Production-Grade Implementation & Annotated Walkthrough

The toolkit below implements the cost formula, a rule-based router, and the selection step. The prices are the tier prices from Section 2, stored under generic tier names so the code survives the next renaming.

```python
PRICES = {                      # USD per 1M tokens: (input, output). Verify before use.
    "flagship": (10.00, 50.00),
    "balanced": (2.00, 10.00),
    "small":    (1.00, 5.00),
    "nano":     (0.10, 0.50),
}

def request_cost(model, input_tokens, output_tokens, prices=PRICES):
    price_in, price_out = prices[model]
    return input_tokens / 1e6 * price_in + output_tokens / 1e6 * price_out

def monthly_cost(model, requests_per_day, input_tokens, output_tokens, prices=PRICES, days=30):
    return request_cost(model, input_tokens, output_tokens, prices) * requests_per_day * days

def route(task):
    """Send a task to the cheapest tier likely to handle it."""
    if task.get("high_stakes"):
        return "flagship"
    if task.get("multi_step") or task.get("input_tokens", 0) > 20_000:
        return "balanced"
    if task.get("type") in ("classify", "extract"):
        return "nano"
    return "small"

print(f"one request, balanced: USD {request_cost('balanced', 2000, 500):.4f}")
for tier in PRICES:
    print(f"{tier:>9}: USD {monthly_cost(tier, 5000, 2000, 500):>9,.2f} per month")

print(f"with 4,000 reasoning tokens: USD {request_cost('balanced', 2000, 500 + 4000):.4f}")

tickets = [{"type": "classify"}, {"type": "reply"}, {"type": "reply", "multi_step": True},
           {"type": "refund", "high_stakes": True}, {"type": "extract", "input_tokens": 30_000}]
print([route(t) for t in tickets])
```

Commentary:

- **Prices live in one dictionary.** When prices or names change, one place changes. The comment "verify before use" is not decoration: hard-coded prices are the most common cause of a cost estimate being quietly wrong.
- **`request_cost` divides by one million.** Prices are quoted per million tokens. Forgetting the division produces an answer a million times too large, which at least is obvious. Dividing by a thousand, an old convention, produces one that is plausible and wrong.
- **`prices=PRICES` is a parameter.** The function can be tested with a made-up price table, and can price another vendor's models without modification.
- **The reasoning line shows the hidden cost.** Adding 4,000 reasoning tokens to a 500-token answer raises the request from USD 0.009 to USD 0.049, more than five times, for the same visible output.
- **`route` checks conditions from most to least important.** High stakes overrides everything. A long or multi-step task comes next. Only then does the cheap path apply. Look at the last ticket: it is an extraction, which would normally go to the nano tier, but its 30,000-token input sends it to the balanced tier, because the earlier rule fires first. The order of the `if` statements *is* the policy.
- **`.get(...)` with a default tolerates missing fields.** A task that does not say whether it is high-stakes is treated as not high-stakes. Whether that default is safe depends on your application, and it is a decision worth making deliberately.

Now the selection step, on recorded results:

```python
def summarise(runs):
    """runs: list of (correct, cost_usd, latency_seconds) for one model."""
    n = len(runs)
    return {"accuracy": sum(1 for ok, _, _ in runs if ok) / n,
            "mean_cost": sum(cost for _, cost, _ in runs) / n,
            "mean_latency": sum(lat for _, _, lat in runs) / n}

def pick_model(summaries, min_accuracy):
    """Cheapest model that clears the bar; ties broken by latency, then name."""
    ok = [(s["mean_cost"], s["mean_latency"], name) for name, s in summaries.items() if s["accuracy"] >= min_accuracy]
    return min(ok)[2] if ok else None

results = {
    "nano":     [(True, 0.0005, 0.6)] * 16 + [(False, 0.0005, 0.6)] * 4,
    "balanced": [(True, 0.009, 1.8)] * 19 + [(False, 0.009, 1.8)] * 1,
    "flagship": [(True, 0.045, 3.5)] * 20,
}
summaries = {name: summarise(runs) for name, runs in results.items()}
for bar in (0.75, 0.90, 0.99, 1.01):
    print(f"quality bar {bar:.2f} -> {pick_model(summaries, bar)}")
```

- **`summarise` reduces raw runs to three numbers per model.** Accuracy, mean cost, and mean latency are the minimum needed to make the trade-off visible.
- **`pick_model` filters first, then minimises.** It discards every model below the bar, then takes the cheapest survivor. Sorting tuples of `(cost, latency, name)` makes cost the primary criterion, latency the tie-break, and the name a final tie-break so the result never depends on dictionary order.
- **The output changes with the bar.** At 0.75 the nano tier, 80 percent accurate, is chosen. At 0.90 the balanced tier, 95 percent. At 0.99 only the flagship qualifies. At an impossible 1.01 the function returns `None`, which is the right response: no model meets the requirement, so the requirement or the approach must change.

That last table is the whole lesson in four lines. The right model is not a property of the models. It is a function of how good the answer needs to be.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Model names change faster than tutorials.** Anything that says "always use model X" was written for a lineup that may no longer exist. Learn the tiers, and look up which current name occupies each one.

**Know which model you are on.** A recurring complaint is that people cannot tell which model answered. The application may switch models automatically, including downward when you reach a limit. If quality drops mid-session, check the picker before blaming your prompt.

**The most powerful setting is often the wrong default.** High-effort reasoning modes can take a minute or more per reply and consume limited allowances quickly. For everyday questions they give no visible improvement. Use them for problems that are hard in the multi-step sense, and use the fast setting for the rest.

**Reasoning modes want different prompts.** OpenAI's guidance for reasoning models is to keep prompts simple and direct, state the goal and constraints, and not tell the model to "think step by step", which is unnecessary and can occasionally make results worse. Module 2.5 returns to this.

**Evaluating on five hand-picked examples is noise.** People routinely conclude that one model is better from a handful of trials. Use at least a few dozen varied cases, include the hard ones, and remember the confidence intervals from Module 1.8.

**Judging quality alone hides the real cost.** A model whose output needs ten minutes of human correction is more expensive than a pricier model whose output is usable as is. Measure time to a usable result.

**Hidden reasoning tokens surprise budgets.** Teams moving to reasoning modes have seen bills rise several-fold with no change in the length of the answers. Check how thinking is billed on your plan or API before switching a high-volume workflow.

**The API window is not the ChatGPT window.** A model listed with a context window of about a million tokens for developers may give you a small fraction of that inside the consumer application on a low plan. Check the plan table for the number that applies to you.

**Pin versions in anything automated.** In scripts and applications, refer to a specific dated model version, not a floating alias, and re-run your test set when you change it. A prompt tuned for one version can behave differently on the next.

**Sometimes the answer is a better prompt, not a bigger model.** Before moving up a tier, try giving the cheaper model clearer instructions, an example, or the missing context. A good prompt on the balanced tier frequently beats a lazy one on the flagship.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Models come in tiers that trade capability against cost and speed, and current systems add a second dial for how much hidden reasoning to spend. The cost of a request is input tokens times the input price plus output tokens times the output price, with reasoning tokens billed as output, and the number that matters is cost per usable result including human review. Selection means sending each task to the cheapest tier that meets a quality bar you set in advance. The procedure is a small experiment: a test set of real examples, acceptance criteria written first, the same inputs through each candidate, one variable changed at a time, and the lightest passing setting kept. Names and prices will change. The tiers and the method will not.

**Question 1.** A workflow sends 3,000 input tokens and receives 800 output tokens per request, 2,000 times a day. Using the tier prices in Section 2, compute the monthly cost (30 days) on the balanced tier and on the nano tier. What else would you need to know before recommending the nano tier?

<details>
<summary>View Answer</summary>

On the balanced tier one request costs 3,000 divided by a million times 2.00, plus 800 divided by a million times 10.00, which is 0.006 plus 0.008, or USD 0.014. Over 2,000 requests a day for 30 days that is USD 840 per month. On the nano tier one request costs 0.0003 plus 0.0004, or USD 0.0007, which is USD 42 per month. Before recommending the nano tier you need its measured success rate on a representative test set of this task, the cost of a failure (including the human time to detect and repair it), and whether the failures are evenly spread or concentrated in a type of request that could be routed to a higher tier. If nano meets the quality bar, or meets it for a routable majority of requests, the saving is about 95 percent.

</details>

**Question 2.** A team switches a summarisation workflow from the fast setting to a high-effort reasoning setting. The summaries look the same length and no better, but the bill is four times higher. Explain why, and what they should have done first.

<details>
<summary>View Answer</summary>

Reasoning modes generate hidden thinking tokens before the visible answer, and those tokens are billed at the output rate. A 300-token summary preceded by 1,000 tokens of reasoning is billed as 1,300 output tokens, so the cost can rise several-fold with no change in what the user sees. Summarisation of a single document is rarely a multi-step reasoning problem, so the extra thinking adds little quality. They should have run both settings on a fixed test set of documents with acceptance criteria defined in advance, compared quality, cost, and time, and kept the lighter setting once it was shown to meet the bar.

</details>

**Question 3.** Explain why "use the best model for everything" is a poor policy, using the idea of the two dials and the cost-per-successful-task formula.

<details>
<summary>View Answer</summary>

There are two dials, model size and reasoning effort, and turning both to maximum for every task buys capability that easy tasks cannot use while paying the full price in money, latency, and usage limits. For a simple classification, a small model may already succeed nearly every time, so its cost per successful task, cost divided by success rate, is tiny, and the flagship's higher success rate cannot make up a price difference of a hundred times. The best-for-everything policy is justified only where failures are very costly and cannot be cheaply detected. A better policy is triage: route routine tasks to the cheapest tier that meets the quality bar and reserve large models and high effort for hard or high-stakes work.

</details>

@@starter
"""
Lab: Build a Model Selection Toolkit
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".

PRICES maps a tier name to (input price, output price) in USD per 1,000,000 tokens.
These are example prices: always check the provider's current price list.
"""

PRICES = {
    "flagship": (10.00, 50.00),
    "balanced": (2.00, 10.00),
    "small": (1.00, 5.00),
    "nano": (0.10, 0.50),
}

# Recorded evaluation runs: for each model, a list of (correct, cost_usd, latency_seconds).
EVAL_RESULTS = {
    "nano": [(True, 0.0005, 0.6)] * 16 + [(False, 0.0005, 0.6)] * 4,
    "balanced": [(True, 0.009, 1.8)] * 19 + [(False, 0.009, 1.8)] * 1,
    "flagship": [(True, 0.045, 3.5)] * 20,
}


# ---------------------------------------------------------------- Step 1
def request_cost(model, input_tokens, output_tokens, prices=PRICES):
    """Cost in USD of one request:
       input_tokens / 1e6 * input_price + output_tokens / 1e6 * output_price"""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def monthly_cost(model, requests_per_day, input_tokens, output_tokens, prices=PRICES, days=30):
    """Cost in USD of running the same request `requests_per_day` times a day for `days` days."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def route(task):
    """Choose a tier for a task. `task` is a dict that may contain:
         'high_stakes' (bool), 'multi_step' (bool), 'input_tokens' (int), 'type' (str)
       Check IN THIS ORDER and return at the first match:
         1. high_stakes is true                         -> "flagship"
         2. multi_step is true OR input_tokens > 20000  -> "balanced"
         3. type is "classify" or "extract"             -> "nano"
         4. anything else                               -> "small"
       Missing keys count as False / 0 / None."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def summarise(runs):
    """runs is a list of (correct, cost_usd, latency_seconds) tuples for ONE model.
    Return a dict with the keys 'accuracy', 'mean_cost', and 'mean_latency'."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def pick_model(summaries, min_accuracy):
    """summaries maps model name -> the dict returned by summarise().
    Return the name of the CHEAPEST model (lowest mean_cost) whose accuracy is
    >= min_accuracy. Break ties by lower mean_latency, then by name.
    Return None if no model meets the bar."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("one request  :", request_cost("balanced", 2000, 500))
    print("one month    :", monthly_cost("balanced", 5000, 2000, 500))
    print("route        :", route({"type": "classify"}))
    print("summary      :", summarise(EVAL_RESULTS["nano"]))
    print("pick         :", pick_model({}, 0.9))

@@solution
"""
Lab solution: Build a Model Selection Toolkit
Standard library only.

PRICES maps a tier name to (input price, output price) in USD per 1,000,000 tokens.
These are example prices: always check the provider's current price list.
"""

PRICES = {
    "flagship": (10.00, 50.00),
    "balanced": (2.00, 10.00),
    "small": (1.00, 5.00),
    "nano": (0.10, 0.50),
}

# Recorded evaluation runs: for each model, a list of (correct, cost_usd, latency_seconds).
EVAL_RESULTS = {
    "nano": [(True, 0.0005, 0.6)] * 16 + [(False, 0.0005, 0.6)] * 4,
    "balanced": [(True, 0.009, 1.8)] * 19 + [(False, 0.009, 1.8)] * 1,
    "flagship": [(True, 0.045, 3.5)] * 20,
}


# ---------------------------------------------------------------- Step 1
def request_cost(model, input_tokens, output_tokens, prices=PRICES):
    """Prices are per MILLION tokens. Hidden reasoning tokens count as output tokens."""
    price_in, price_out = prices[model]
    return input_tokens / 1e6 * price_in + output_tokens / 1e6 * price_out


# ---------------------------------------------------------------- Step 2
def monthly_cost(model, requests_per_day, input_tokens, output_tokens, prices=PRICES, days=30):
    """A fraction of a cent per request becomes a real budget line at volume."""
    return request_cost(model, input_tokens, output_tokens, prices) * requests_per_day * days


# ---------------------------------------------------------------- Step 3
def route(task):
    """Triage. The ORDER of the checks is the policy: stakes outrank difficulty,
    and difficulty outranks the cheap path."""
    if task.get("high_stakes"):
        return "flagship"
    if task.get("multi_step") or task.get("input_tokens", 0) > 20_000:
        return "balanced"
    if task.get("type") in ("classify", "extract"):
        return "nano"
    return "small"


# ---------------------------------------------------------------- Step 4
def summarise(runs):
    """Reduce raw evaluation runs to the three numbers a decision needs."""
    n = len(runs)
    return {
        "accuracy": sum(1 for correct, _, _ in runs if correct) / n,
        "mean_cost": sum(cost for _, cost, _ in runs) / n,
        "mean_latency": sum(latency for _, _, latency in runs) / n,
    }


# ---------------------------------------------------------------- Step 5
def pick_model(summaries, min_accuracy):
    """Filter by the quality bar, then minimise cost.

    Tuples compare element by element, so (cost, latency, name) makes cost the main
    criterion, latency the tie-break, and name the final deterministic tie-break.
    """
    qualifying = [(s["mean_cost"], s["mean_latency"], name)
                  for name, s in summaries.items() if s["accuracy"] >= min_accuracy]
    if not qualifying:
        return None
    return min(qualifying)[2]


if __name__ == "__main__":
    print(f"one request, balanced: USD {request_cost('balanced', 2000, 500):.4f}")
    for tier in PRICES:
        print(f"{tier:>9}: USD {monthly_cost(tier, 5000, 2000, 500):>9,.2f} per month")
    print(f"with 4,000 reasoning tokens: USD {request_cost('balanced', 2000, 500 + 4000):.4f}")

    tickets = [{"type": "classify"}, {"type": "reply"}, {"type": "reply", "multi_step": True},
               {"type": "refund", "high_stakes": True}, {"type": "extract", "input_tokens": 30_000}]
    print([route(t) for t in tickets])

    summaries = {name: summarise(runs) for name, runs in EVAL_RESULTS.items()}
    for name, s in summaries.items():
        print(f"{name:>9}: accuracy {s['accuracy']:.2f}  cost USD {s['mean_cost']:.4f}  "
              f"latency {s['mean_latency']:.1f}s  cost per success USD {s['mean_cost'] / s['accuracy']:.5f}")
    for bar in (0.75, 0.90, 0.99, 1.01):
        print(f"quality bar {bar:.2f} -> {pick_model(summaries, bar)}")

@@step
{
  "stepNumber": 1,
  "title": "Price one request",
  "instruction": "Implement request_cost(model, input_tokens, output_tokens, prices). Look up the model's (input price, output price) in the prices dict, which are in USD per million tokens, and return input_tokens / 1e6 * input_price + output_tokens / 1e6 * output_price. This is the cost formula from Section 2. Note that output is priced about five times higher than input, and that hidden reasoning tokens are counted as output. [MOD-2.2]",
  "hintConceptual": "You pay separately for what goes in and what comes out, at different rates, and the rates are quoted for a million tokens at a time.",
  "hintSyntax": "price_in, price_out = prices[model]\nreturn input_tokens / 1e6 * price_in + output_tokens / 1e6 * price_out"
}
@@assert
assert abs(request_cost("balanced", 2000, 500) - 0.009) < 1e-12, f"2000 in and 500 out on 'balanced' costs USD 0.009, got {request_cost('balanced', 2000, 500)}"
assert abs(request_cost("flagship", 2000, 500) - 0.045) < 1e-12, "The same request on 'flagship' costs USD 0.045"
assert abs(request_cost("nano", 2000, 500) - 0.00045) < 1e-12, "The same request on 'nano' costs USD 0.00045"
assert abs(request_cost("balanced", 1_000_000, 0) - 2.0) < 1e-12, "One million input tokens on 'balanced' costs USD 2.00"
assert abs(request_cost("balanced", 0, 1_000_000) - 10.0) < 1e-12, "One million output tokens on 'balanced' costs USD 10.00"
assert request_cost("small", 0, 0) == 0, "A request with no tokens costs nothing"
assert abs(request_cost("x", 1000, 1000, prices={"x": (3.0, 6.0)}) - 0.009) < 1e-12, "The prices argument must be used, not the global PRICES"
print("Step 1 passed: a typical request on the balanced tier costs under one cent.")

@@step
{
  "stepNumber": 2,
  "title": "Scale it to a month",
  "instruction": "Implement monthly_cost(model, requests_per_day, input_tokens, output_tokens, prices, days). Return the cost of one request, from request_cost, multiplied by the number of requests per day and by the number of days. A fraction of a cent per request turns into a budget line once it runs thousands of times a day, which is why the choice of tier matters. [MOD-2.2]",
  "hintConceptual": "Total cost is the cost of one request times how many requests are made. Pass the prices table through so the function works with any price list.",
  "hintSyntax": "return request_cost(model, input_tokens, output_tokens, prices) * requests_per_day * days"
}
@@assert
assert abs(monthly_cost("balanced", 5000, 2000, 500) - 1350.0) < 1e-6, f"5000 requests a day for 30 days on 'balanced' is USD 1350, got {monthly_cost('balanced', 5000, 2000, 500)}"
assert abs(monthly_cost("flagship", 5000, 2000, 500) - 6750.0) < 1e-6, "The same workload on 'flagship' is USD 6750"
assert abs(monthly_cost("nano", 5000, 2000, 500) - 67.5) < 1e-6, "The same workload on 'nano' is USD 67.50"
assert abs(monthly_cost("balanced", 5000, 2000, 500, days=1) - 45.0) < 1e-6, "One day of the workload on 'balanced' is USD 45"
assert monthly_cost("balanced", 0, 2000, 500) == 0, "No requests cost nothing"
assert abs(monthly_cost("x", 10, 1000, 1000, prices={"x": (3.0, 6.0)}, days=10) - 0.9) < 1e-9, "The prices and days arguments must both be respected"
print("Step 2 passed: the same workload costs USD 67.50 or USD 6,750 depending on the tier.")

@@step
{
  "stepNumber": 3,
  "title": "Route each task to a tier",
  "instruction": "Implement route(task). Check the conditions in this order and return at the first one that matches: if high_stakes is true return 'flagship'; if multi_step is true or input_tokens is greater than 20000 return 'balanced'; if type is 'classify' or 'extract' return 'nano'; otherwise return 'small'. Use task.get so that missing keys do not cause an error. This is the triage nurse from Section 1: the order of the checks is the policy. [MOD-2.2]",
  "hintConceptual": "Decide what matters most and test for it first. A cheap task type should not override the fact that the task is high-stakes or unusually large.",
  "hintSyntax": "if task.get(\"high_stakes\"):\n    return \"flagship\"\nif task.get(\"multi_step\") or task.get(\"input_tokens\", 0) > 20_000:\n    return \"balanced\"\nif task.get(\"type\") in (\"classify\", \"extract\"):\n    return \"nano\"\nreturn \"small\""
}
@@assert
assert route({"type": "classify"}) == "nano", "A classification task goes to 'nano'"
assert route({"type": "extract", "input_tokens": 500}) == "nano", "A small extraction task goes to 'nano'"
assert route({"type": "reply"}) == "small", "An ordinary task goes to 'small'"
assert route({}) == "small", "A task with no information goes to 'small' and must not raise an error"
assert route({"type": "reply", "multi_step": True}) == "balanced", "A multi-step task goes to 'balanced'"
assert route({"type": "extract", "input_tokens": 30_000}) == "balanced", "A very long input goes to 'balanced' even for an extraction task"
assert route({"type": "classify", "input_tokens": 20_000}) == "nano", "Exactly 20000 input tokens is not above the limit"
assert route({"type": "classify", "high_stakes": True}) == "flagship", "High stakes overrides the cheap path"
assert route({"type": "classify", "high_stakes": True, "multi_step": True}) == "flagship", "High stakes is checked before multi_step"
print("Step 3 passed: your router sends each task to the cheapest sensible tier.")

@@step
{
  "stepNumber": 4,
  "title": "Summarise an evaluation run",
  "instruction": "Implement summarise(runs). The argument is a list of (correct, cost_usd, latency_seconds) tuples recorded for one model on a test set. Return a dict with three keys: 'accuracy' is the fraction of runs where correct is true, 'mean_cost' is the average cost, and 'mean_latency' is the average latency. These are the three numbers the selection procedure in Section 2 asks you to measure. [MOD-2.2]",
  "hintConceptual": "An evaluation produces many individual results. To compare models you need each one boiled down to how often it was right, what it cost, and how long it took.",
  "hintSyntax": "n = len(runs)\nreturn {\n    \"accuracy\": sum(1 for correct, _, _ in runs if correct) / n,\n    \"mean_cost\": sum(cost for _, cost, _ in runs) / n,\n    \"mean_latency\": sum(latency for _, _, latency in runs) / n,\n}"
}
@@assert
_s = summarise([(True, 0.01, 1.0), (True, 0.03, 2.0), (False, 0.02, 3.0), (True, 0.02, 2.0)])
assert isinstance(_s, dict) and set(_s) == {"accuracy", "mean_cost", "mean_latency"}, "summarise must return a dict with exactly the keys accuracy, mean_cost, mean_latency"
assert _s["accuracy"] == 0.75, "3 of 4 runs were correct: accuracy 0.75"
assert abs(_s["mean_cost"] - 0.02) < 1e-12, "The mean cost of 0.01, 0.03, 0.02, 0.02 is 0.02"
assert abs(_s["mean_latency"] - 2.0) < 1e-12, "The mean latency of 1, 2, 3, 2 is 2.0"
_n = summarise(EVAL_RESULTS["nano"])
assert abs(_n["accuracy"] - 0.8) < 1e-12 and abs(_n["mean_cost"] - 0.0005) < 1e-12, "The recorded 'nano' runs are 80% accurate at USD 0.0005 each"
assert summarise([(False, 1.0, 1.0)])["accuracy"] == 0.0, "A single wrong run gives accuracy 0.0"
print("Step 4 passed: each model is now three comparable numbers.")

@@step
{
  "stepNumber": 5,
  "title": "Pick the cheapest model that clears the bar",
  "instruction": "Implement pick_model(summaries, min_accuracy). From the models whose accuracy is at least min_accuracy, return the name of the one with the lowest mean_cost. If two cost the same, prefer the lower mean_latency, then the alphabetically first name. Return None when no model qualifies. This is the last step of the selection procedure: keep the lightest setting that meets the bar. Try several bars and watch the answer change. [MOD-2.2]",
  "hintConceptual": "First throw out everything that is not good enough. Among what remains, cost decides. If nothing remains, the honest answer is that no model meets the requirement.",
  "hintSyntax": "qualifying = [(s[\"mean_cost\"], s[\"mean_latency\"], name)\n              for name, s in summaries.items() if s[\"accuracy\"] >= min_accuracy]\nif not qualifying:\n    return None\nreturn min(qualifying)[2]"
}
@@assert
_sum = {
    "nano": {"accuracy": 0.80, "mean_cost": 0.0005, "mean_latency": 0.6},
    "balanced": {"accuracy": 0.95, "mean_cost": 0.009, "mean_latency": 1.8},
    "flagship": {"accuracy": 1.00, "mean_cost": 0.045, "mean_latency": 3.5},
}
assert pick_model(_sum, 0.75) == "nano", "At a bar of 0.75 the cheapest qualifying model is 'nano'"
assert pick_model(_sum, 0.80) == "nano", "A model exactly at the bar qualifies (use >=)"
assert pick_model(_sum, 0.90) == "balanced", "At a bar of 0.90 'nano' is excluded and 'balanced' is cheapest"
assert pick_model(_sum, 0.99) == "flagship", "At a bar of 0.99 only 'flagship' qualifies"
assert pick_model(_sum, 1.01) is None, "If no model meets the bar, return None"
assert pick_model({}, 0.5) is None, "With no models there is nothing to pick"
_tie = {"slow": {"accuracy": 0.9, "mean_cost": 0.01, "mean_latency": 4.0}, "fast": {"accuracy": 0.9, "mean_cost": 0.01, "mean_latency": 1.0}}
assert pick_model(_tie, 0.9) == "fast", "Equal cost: the lower latency wins"
_tie2 = {"zeta": {"accuracy": 0.9, "mean_cost": 0.01, "mean_latency": 1.0}, "alpha": {"accuracy": 0.9, "mean_cost": 0.01, "mean_latency": 1.0}}
assert pick_model(_tie2, 0.9) == "alpha", "Equal cost and latency: the alphabetically first name wins"
print("Step 5 passed: the right model depends on how good the answer needs to be.")
