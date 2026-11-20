@@meta
{
  "moduleId": "MOD-3.1",
  "slug": "mod-3-1",
  "unitId": "UNIT-3",
  "unitTitle": "Unit 3: Mastering Claude & Gemini",
  "title": "Claude: Overview and Setup",
  "difficulty": "Foundational",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "Models overview", "source": "Anthropic Docs", "url": "https://platform.claude.com/docs/en/models/overview" },
    { "title": "Claude pricing and plans", "source": "Anthropic", "url": "https://claude.com/pricing" },
    { "title": "Claude's new constitution", "source": "Anthropic", "url": "https://www.anthropic.com/news/claude-new-constitution" },
    { "title": "Anthropic users face a new choice: opt out or share your data for AI training", "source": "TechCrunch", "url": "https://www.techcrunch.com/2025/08/28/anthropic-users-face-a-new-choice-opt-out-or-share-your-data-for-ai-training/" },
    { "title": "Updates to our privacy policy", "source": "Anthropic Privacy Center", "url": "https://privacy.claude.com/en/articles/10301952-updates-to-our-privacy-policy" },
    { "title": "Anthropic Academy courses", "source": "Anthropic", "url": "https://anthropic.skilljar.com/" },
    { "title": "Constitutional AI: Harmlessness from AI Feedback", "source": "arXiv", "url": "https://arxiv.org/abs/2212.08073v1" }
  ],
  "videoLibrary": [
    {
      "id": "VID-3.1-1",
      "title": "Full Claude Tutorial: Beginner to Advanced in 19 Minutes",
      "creator": "Futurepedia",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=WSPChlfxJyA",
      "timingInstruction": "Watch after reading Section 1 for a tour of the app",
      "keyTakeaway": "A fast walkthrough of the Claude app's main features, useful for matching the surfaces and settings in this chapter to what appears on screen."
    },
    {
      "id": "VID-3.1-2",
      "title": "Mastering Claude Code in 30 minutes",
      "creator": "Anthropic",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=6eBSHbLKuN0",
      "timingInstruction": "Optional preview of the Claude Code surface, covered properly in Module 3.4",
      "keyTakeaway": "Anthropic's own introduction to using Claude from the terminal, showing how different that surface feels from the chat app."
    },
    {
      "id": "VID-3.1-3",
      "title": "Building with the Claude API",
      "creator": "Anthropic",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/building-with-the-claude-api",
      "timingInstruction": "Take after Unit 3 if you want to use Claude from code",
      "keyTakeaway": "Anthropic's course on the developer surface: sending requests, choosing models, and controlling cost, which builds directly on this chapter's lab."
    },
    {
      "id": "VID-3.1-4",
      "title": "Claude Code 101",
      "creator": "Anthropic",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/claude-code-101",
      "timingInstruction": "Take alongside Module 3.4",
      "keyTakeaway": "A beginner course on setting up Claude Code and delegating tasks to it."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Model Tiers, Costs, and Usage Windows",
    "context": "A two-person studio is moving its work to Claude and wants to know which model tier to use for which job, what it would cost through the API, and why the app sometimes tells them to wait. You will build a cost calculator for the tiers, a rule-based tier chooser, and a simulator of the rolling usage windows that subscription plans apply.",
    "language": "python"
  }
}

@@reading
# Claude: Overview and Setup

Claude is the family of AI models made by Anthropic, and the name of the assistant built on them. If you have worked through the ChatGPT unit, most of what you learned transfers: the same architecture underneath, the same idea of a product wrapped around a stateless model, the same need to supply context and check output. This chapter covers what is particular to Claude: how its model family is organised, the different places you can use it, how the subscription limits work, and how to set it up well on the first day.

As everywhere in this course, product details are dated. Figures here are from Anthropic's documentation in November 2026. The structure they illustrate has been stable for several model generations.

## 1. First-Principles Mental Model & Intuition

### One staff, several doors

Think of Anthropic as running a staffing agency with a small team of specialists, and a building with several doors.

The **staff** are the models. They are arranged in tiers, from a fast, inexpensive one that handles routine work in bulk, up to the most capable one that you bring in for the hardest problems. Same agency, same training philosophy, different size and price.

The **doors** are the ways in. You can walk in through the chat application in a browser. You can use the desktop or mobile app. You can work from a terminal, where the assistant operates directly on your files. Or you can come in through the developer entrance, the API, and build the assistant into your own software.

```text
                         THE MODELS (the staff)
        +-----------+-----------+-----------+-----------+
        |   Haiku   |  Sonnet   |   Opus    |   Fable   |
        | fast,     | everyday  | long,     | hardest   |
        | cheap,    | balance   | demanding | reasoning |
        | high      |           | work      | problems  |
        | volume    |           |           |           |
        +-----+-----+-----+-----+-----+-----+-----+-----+
              |           |           |           |
   -----------+-----------+-----------+-----------+-----------
              THE SURFACES (the doors)
   +--------------+ +--------------+ +-------------+ +----------+
   |  Chat app    | | Desktop and  | | Claude Code | |   API    |
   |  (web)       | | mobile apps  | | (terminal,  | | (your    |
   |              | |              | |  IDE, web)  | |  code)   |
   +--------------+ +--------------+ +-------------+ +----------+
```

Two questions therefore come up in every task. **Which model?** And **through which door?** They are independent. The same Sonnet model answers a question in the chat app and edits code in the terminal. What differs between doors is what the assistant can touch: in the chat app, the files you upload; in the terminal, your whole project folder; through the API, whatever your program sends it.

### Subscriptions and metered use

There are also two ways to pay, and confusing them causes endless misunderstanding.

- A **subscription plan** is like a gym membership. You pay a fixed monthly amount and get an allowance of use that refills on a schedule. Use it heavily and you hit a limit and must wait.
- The **API** is like a taxi meter. There is no allowance and no limit of that kind. You pay for exactly what you use, measured in tokens.

The chat apps run on the subscription. Software you build runs on the meter. Understanding which one you are on tells you whether "it stopped working" means "wait a few hours" or "check the bill".

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### The model family

At the time of writing, Anthropic's documentation lists four current models.

| Model | Recommended for | Input price per 1M tokens | Output price per 1M tokens |
|---|---|---|---|
| Claude Haiku 5.5 | Classification, extraction, routing, high-volume simple work | from USD 0.10 | from USD 0.50 |
| Claude Sonnet 5.5 | Everyday work; the best balance of speed and intelligence | USD 2 | USD 10 |
| Claude Opus 5.5 | Long-running coding and knowledge work; the documented starting point for most serious workloads | USD 4 | USD 20 |
| Claude Fable 5.2 | The most demanding reasoning and long-horizon agentic work | USD 8 | USD 40 |

All four are listed with a context window of one million tokens and a maximum output of 128 thousand tokens. As with OpenAI's lineup in Module 2.2, three things are more durable than the names.

1. **The tiers map to the triage idea.** Small and fast, balanced, large, and largest.
2. **Output costs five times as much as input** at every tier.
3. **The spread between tiers is large.** From the bottom to the top of this table the price differs by a factor of eighty.

All of these models can think before they answer. In current versions the amount of thinking adapts to the task, with a setting for how much effort to spend. The two largest models always reason, and the smaller ones do so when it helps. As Module 2.2 explained, thinking is billed as output.

### The cost of a request

The formula is the one you already know:

$$
\text{cost} = \frac{T_{\text{in}}}{10^{6}} \times P_{\text{in}} + \frac{T_{\text{out}}}{10^{6}} \times P_{\text{out}}
$$

For a request with 10,000 input tokens and 2,000 output tokens:

| Tier | Calculation | Cost |
|---|---|---|
| Haiku | $0.01 \times 0.10 + 0.002 \times 0.50$ | USD 0.002 |
| Sonnet | $0.01 \times 2 + 0.002 \times 10$ | USD 0.04 |
| Opus | $0.01 \times 4 + 0.002 \times 20$ | USD 0.08 |
| Fable | $0.01 \times 8 + 0.002 \times 40$ | USD 0.16 |

Two discounts matter in practice.

**Batch processing.** Work that does not need an immediate answer can be submitted as a batch and processed within a day at half price:

$$
\text{cost}_{\text{batch}} = 0.5 \times \text{cost}
$$

**Prompt caching.** When many requests begin with the same long block of text, such as a set of instructions or a document, that block can be cached. Reading it from the cache costs a small fraction of the normal input price, a tenth by default. This is why a long, stable set of instructions at the start of every request is much cheaper than it first appears. Module 3.2 works through the arithmetic.

### Surfaces

| Surface | What it is | What Claude can reach | Best for |
|---|---|---|---|
| Chat app (web) | The assistant in a browser | Files you upload, connected services, the web | Everyday questions, writing, analysis |
| Desktop and mobile apps | The same assistant as an installed application | As above, plus local integrations on desktop | Daily use, voice, quick capture |
| Browser extension | Claude operating inside your web browser | Pages you are viewing | Tasks that live on websites |
| Claude Code | An agent that works in your terminal, code editor, desktop app, or on the web | Your project's files and command line | Software work and file-heavy tasks |
| API and Agent SDK | Programmatic access for developers | Whatever your program provides | Building Claude into products |
| Cloud platforms | The same models through Amazon, Google, and Microsoft cloud services | As configured there | Organisations already on those clouds |

The later modules of this unit take these in turn: projects (3.2), artifacts (3.3), Claude Code (3.4), skills (3.5), the Model Context Protocol for connecting tools (3.6), and computer use (3.7).

### Plans

At the time of writing, the consumer and team plans are broadly as follows. Check the pricing page for current figures.

| Plan | Approximate price | What it adds |
|---|---|---|
| Free | USD 0 | The chat app with the smaller models, web search, file creation, artifacts, memory, and a small number of projects, within tight limits |
| Pro | About USD 20 per month, less on annual billing | All models, Claude Code, research, many more projects, much higher limits |
| Max and Ultra | From about USD 100 to USD 200 per month | Several times the Pro limits, for heavy daily use |
| Team | Per seat, from about USD 20 to USD 25 per month, with a premium seat tier | Central billing and administration, no training on your data by default |
| Enterprise | Negotiated, with usage billed at API rates | Advanced security and compliance controls |

### How usage limits work

Subscription limits on Claude are applied over two overlapping periods: a short window of about five hours, and a weekly allowance. You must be within both.

The amount each message consumes is not fixed. It depends on which model you use, how long the conversation is, and how large your attached files are. Recall from Module 2.1 that every turn re-sends the entire conversation. A long chat with a large document attached consumes far more of your allowance per message than a short one.

A useful way to model this is a **rolling window**. Let each use at time $t_j$ have a weight $w_j$. The usage counted at time $t$ over a window of length $L$ is

$$
U_L(t) = \sum_{j \,:\, t - L < t_j \le t} w_j
$$

A new request of weight $w$ is allowed only if both conditions hold:

$$
U_{5\text{h}}(t) + w \le C_{5\text{h}} \qquad \text{and} \qquad U_{7\text{d}}(t) + w \le C_{7\text{d}}
$$

where the $C$ values are the caps for your plan. This is a simplified model for building intuition. Anthropic does not publish its exact accounting. It explains the two experiences users report: being told to wait a few hours after an intense session, and being told to wait until a later day after a heavy week.

The practical consequences are the habits you already know, now with a direct cost attached. Start a new chat for a new topic. Do not keep a huge document attached when you no longer need it. Use a smaller model for simple work, because heavier models draw down the allowance faster.

### Anthropic's stated approach

Anthropic describes itself as a safety-focused company, and two published documents are worth knowing about because they shape how the assistant behaves.

The first is the method of **Constitutional AI**, introduced in a 2022 research paper and described in Module 1.4: training a model against a written set of principles, using the model's own critiques, in addition to human feedback.

The second is the **constitution** itself, a long public document, most recently reissued in January 2026, that sets out the values Claude is meant to hold. It explains its reasoning instead of listing rules, sets a small number of firm limits, and states an order of priorities for cases of conflict: being broadly safe, then broadly ethical, then following Anthropic's more specific guidelines, then being helpful. In ordinary use these do not conflict, and the practical effect you will notice is in tone and judgement: a tendency to explain a refusal, to say when it is unsure, and to push back on a mistaken premise.

You do not need to accept any company's account of itself. It is useful to know that such a document exists and is public, because it lets you check stated intent against observed behaviour.

### First-day setup

Ten minutes of configuration improves every later conversation.

1. **Profile preferences.** Claude's equivalent of custom instructions: who you are and how you like answers. Everything in Module 2.3 applies.
2. **Styles.** Saved response styles you can switch between, such as concise or explanatory, including ones built from a sample of your own writing.
3. **Privacy settings.** On consumer plans, a setting controls whether your conversations may be used to improve Anthropic's models. Since a policy change in late 2025 it has been switched on by default for consumer accounts, and it affects how long data is retained. Team, Enterprise, and API usage is excluded from training by default. Find the setting and decide deliberately.
4. **Memory.** Claude can carry information between conversations, with an incognito mode for chats that should not be remembered. The considerations in Module 2.4 apply unchanged.
5. **Connectors.** Links to services such as your documents and calendar. Connect only what you need, for the reasons given in Module 1.10.
6. **Model choice.** Know where the model selector is and what the default is on your plan.

## 3. Production-Grade Implementation & Annotated Walkthrough

The calculations in this chapter make a compact planning tool. First, cost across the tiers.

```python
PRICES = {            # USD per 1M tokens (input, output). A dated snapshot: verify before use.
    "haiku": (0.10, 0.50),
    "sonnet": (2.00, 10.00),
    "opus": (4.00, 20.00),
    "fable": (8.00, 40.00),
}

def request_cost(tier, input_tokens, output_tokens, batch=False, prices=PRICES):
    price_in, price_out = prices[tier]
    cost = input_tokens / 1e6 * price_in + output_tokens / 1e6 * price_out
    return cost * 0.5 if batch else cost

for tier in PRICES:
    live = request_cost(tier, 10_000, 2_000)
    print(f"{tier:>7}: USD {live:.4f} per request   USD {request_cost(tier, 10_000, 2_000, batch=True):.4f} in a batch")
```

- **Prices are data, labelled as a snapshot.** Model prices change with every generation. One dictionary to update, with a comment that says so.
- **`batch` is a flag with a default.** Most calls are live, so the common case needs no extra argument, and the discount is applied in exactly one place.
- **The printed table is the argument for triage.** The same request costs a fifth of a cent on the smallest model and sixteen cents on the largest. For one request that is nothing. For a million it is the difference between USD 2,000 and USD 160,000.

Next, a rule for choosing a tier.

```python
def choose_tier(task):
    """difficulty is 1 (trivial) to 5 (hardest). volume is 'high' or 'normal'."""
    if task.get("difficulty", 3) >= 5:
        return "fable"
    if task.get("long_running") or task.get("difficulty", 3) == 4:
        return "opus"
    if task.get("volume") == "high" and task.get("difficulty", 3) <= 2:
        return "haiku"
    return "sonnet"

for name, task in [("tag 50,000 support tickets", {"volume": "high", "difficulty": 1}),
                   ("draft a client email", {"difficulty": 2}),
                   ("refactor a large codebase overnight", {"long_running": True, "difficulty": 4}),
                   ("untangle a contradictory legal dataset", {"difficulty": 5})]:
    print(f"{name:>40} -> {choose_tier(task)}")
```

- **The checks run from the most demanding case down.** The hardest work is identified first so that nothing difficult falls through to a cheap tier by accident.
- **The default is the middle tier.** When nothing special is known about a task, the balanced model is the sensible choice. Defaults should be the option you would least regret.
- **A simple email goes to Sonnet, not Haiku.** The cheapest tier is selected only for work that is both simple and high in volume. For a single email the saving is a fraction of a cent and not worth any loss in quality.

Finally, the rolling usage window.

```python
def usage_in_window(history, now, hours):
    """Total weight of uses in the last `hours` hours. history holds (time_in_hours, weight)."""
    return sum(weight for when, weight in history if now - hours < when <= now)

def can_send(history, now, weight, cap_5h, cap_week):
    """A request must fit within BOTH the 5-hour window and the weekly allowance."""
    return (usage_in_window(history, now, 5) + weight <= cap_5h
            and usage_in_window(history, now, 168) + weight <= cap_week)

history = [(0, 30), (1, 30), (2, 30)]          # three heavy sessions in the first two hours
for now in (3, 5.5, 7.5):
    print(f"hour {now}: used in 5h window = {usage_in_window(history, now, 5)}, "
          f"can send 20? {can_send(history, now, 20, cap_5h=100, cap_week=1000)}")
```

- **`history` records when each use happened and how heavy it was.** Weight stands in for everything that makes a message expensive: the model, the length of the conversation, the attachments.
- **The condition `now - hours < when <= now` defines the window.** A use exactly five hours old has dropped out. As time passes, old uses leave the window and capacity returns, without anything being "reset" at a fixed clock time.
- **`can_send` requires both limits.** At hour 3 the short window holds 90 units, so a request of 20 is refused. At hour 5.5 the first session has aged out, 60 remain, and the request is allowed. This is the behaviour users describe as "it told me to come back in a couple of hours".
- **It is a model, not the real algorithm.** The point is the shape of the behaviour: usage is weighted, windows roll, and two limits apply at once.

**Complexity.** The cost and tier functions are constant time. The window calculation scans the history, so it is linear in the number of recorded uses, which could be reduced by discarding entries older than a week.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Long chats with big attachments burn the allowance.** The most common complaint from new subscribers is hitting a limit sooner than expected. Almost always the cause is a long conversation with a large file attached, re-sent in full on every turn. Start fresh chats, and use projects (next module) for material you need repeatedly.

**The subscription and the API are separate.** A paid plan for the app does not include API usage, and API credit does not raise app limits. People building their first script are regularly surprised to be asked for separate payment.

**Know which model you are on, and what the plan includes.** The free tier offers the smaller models only. On some plans the most capable model is limited or billed separately. If results differ from what a tutorial showed, check the model selector before anything else.

**Check the privacy setting on day one.** The default for consumer accounts changed in 2025 to allow training use unless you switch it off, and many people never saw the prompt. It takes a minute to look.

**Do not start with the largest model.** New users gravitate to the most powerful option for everything, exhaust their allowance, and conclude the plan is stingy. The balanced tier handles the great majority of work. Move up when a task is hard, not out of habit.

**Old tutorials describe controls that no longer exist.** Thinking settings in particular have changed between model generations, and older code that sets a fixed thinking budget may be rejected by current models. When a guide and the documentation disagree, the documentation is right.

**Different assistants have different defaults.** People moving from ChatGPT notice differences in tone, in how readily the assistant disagrees, and in formatting habits. These come from training and hidden instructions, and you can adjust most of them through profile preferences and styles.

**Hard-coded model names and prices go stale.** In anything you build, keep model identifiers and prices in configuration, and re-test when you change them.

**The context window in the app is not unlimited in practice.** A million-token window is the model's capacity. Quality over very long inputs still degrades as Module 1.9 described, and very large inputs consume your allowance quickly. Supply what the task needs.

**One assistant is rarely enough, and that is fine.** Experienced users keep access to more than one and choose by task. The skills in this course, clear briefs, supplied context, verification, carry across all of them.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Claude is a family of models from Anthropic, arranged in tiers from a fast, inexpensive model for high-volume simple work to the most capable model for the hardest reasoning, with the price differing by a large factor between the ends. The same models are reached through several surfaces, the chat apps, a browser extension, Claude Code, and the API, which differ in what the assistant can touch. Subscriptions provide an allowance governed by a rolling short window and a weekly limit, and each message's cost against that allowance grows with the model used, the length of the conversation, and attached files. The API is metered by the token, with discounts for batch processing and cached prompts. Good setup means writing profile preferences, choosing styles, deciding the privacy setting deliberately, and connecting only what you need.

**Question 1.** A workflow sends 50,000 requests a month, each with 4,000 input tokens and 500 output tokens. Compute the monthly cost on Sonnet and on Haiku using the prices in Section 2, and the cost on Sonnet if the work can be batched. What should decide between them?

<details>
<summary>View Answer</summary>

On Sonnet, one request costs 4,000 divided by a million times 2, plus 500 divided by a million times 10, which is 0.008 plus 0.005, or USD 0.013. Fifty thousand requests cost USD 650 a month. With batch processing at half price that is USD 325. On Haiku, one request costs 0.0004 plus 0.00025, or USD 0.00065, and fifty thousand cost USD 32.50. The decision should rest on measured quality. Run a test set of representative requests through both models with acceptance criteria fixed in advance, as in Module 2.2. If Haiku meets the bar, it is twenty times cheaper than live Sonnet. If it does not, consider whether the work can wait a day, which halves the Sonnet cost, or whether a router can send only the harder requests to the larger model.

</details>

**Question 2.** A subscriber works intensively with a long document for two hours and is told to wait. Three hours later the assistant works again, and by the end of the week they are stopped for a day. Explain both events with the rolling-window model, and name three habits that would have reduced them.

<details>
<summary>View Answer</summary>

Two limits apply at once: usage over roughly the last five hours, and usage over the week. Each message has a weight that grows with the model, the conversation length, and attachments, and since every turn re-sends the whole conversation, a long chat with a large document makes each message heavy. Two hours of that filled the short window, so further messages were refused. As time passed the early messages aged out of the five-hour window and capacity returned, which is why it worked again three hours later. Meanwhile every session also counted toward the weekly total, and repeated heavy days exhausted it. Habits that help: start a new chat when the topic changes so that history is not re-sent; put reference material in a project or supply only the relevant excerpt instead of keeping a large file attached; and use a smaller model for simple steps, reserving the largest for work that needs it.

</details>

**Question 3.** Explain the difference between a model and a surface, using the example of Claude Sonnet in the chat app and in Claude Code. Why does the distinction matter for deciding how to do a task?

<details>
<summary>View Answer</summary>

The model is the neural network that does the reasoning. The surface is the application through which it is used. Claude Sonnet is one model, and it can sit behind both the chat app and Claude Code. In the chat app it can work with what you type and the files you upload, and it returns text and artifacts. In Claude Code the same model is given tools to read and modify the files in a project folder and to run commands, so it can carry out multi-step work on real files. The intelligence is the same and what it can reach and do is different. That matters because choosing how to do a task involves two separate decisions: how capable a model the task needs, which affects quality and cost, and which surface gives the assistant access to the material and actions the task requires, which affects what is possible and what could go wrong.

</details>

@@starter
"""
Lab: Model Tiers, Costs, and Usage Windows
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".

PRICES maps a tier to (input price, output price) in USD per 1,000,000 tokens.
These are a dated snapshot for practice: always check the provider's current price list.
"""

PRICES = {
    "haiku": (0.10, 0.50),
    "sonnet": (2.00, 10.00),
    "opus": (4.00, 20.00),
    "fable": (8.00, 40.00),
}


# ---------------------------------------------------------------- Step 1
def request_cost(tier, input_tokens, output_tokens, batch=False, prices=PRICES):
    """Cost in USD of one request:
         input_tokens / 1e6 * input_price + output_tokens / 1e6 * output_price
       If batch is True the cost is halved."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def choose_tier(task):
    """Pick a tier for a task dict that may contain:
         "difficulty" (1 to 5, default 3), "long_running" (bool), "volume" ("high" or "normal")
       Check IN THIS ORDER:
         difficulty >= 5                              -> "fable"
         long_running is true, or difficulty == 4     -> "opus"
         volume == "high" and difficulty <= 2         -> "haiku"
         anything else                                -> "sonnet"
    """
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def usage_in_window(history, now, hours):
    """history is a list of (time_in_hours, weight) tuples.
    Return the total weight of the uses with  now - hours < time <= now."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def can_send(history, now, weight, cap_5h, cap_week):
    """True only if a new use of `weight` fits within BOTH limits:
         usage in the last 5 hours   + weight <= cap_5h
         usage in the last 168 hours + weight <= cap_week"""
    # TODO Step 4
    return None


if __name__ == "__main__":
    print("cost       :", request_cost("sonnet", 10_000, 2_000))
    print("tier       :", choose_tier({"difficulty": 2}))
    print("used in 5h :", usage_in_window([(0, 30), (1, 30)], 3, 5))
    print("can send   :", can_send([(0, 30), (1, 30)], 3, 20, 100, 1000))

@@solution
"""
Lab solution: Model Tiers, Costs, and Usage Windows
Standard library only.

PRICES maps a tier to (input price, output price) in USD per 1,000,000 tokens.
These are a dated snapshot for practice: always check the provider's current price list.
"""

PRICES = {
    "haiku": (0.10, 0.50),
    "sonnet": (2.00, 10.00),
    "opus": (4.00, 20.00),
    "fable": (8.00, 40.00),
}


# ---------------------------------------------------------------- Step 1
def request_cost(tier, input_tokens, output_tokens, batch=False, prices=PRICES):
    """Prices are per MILLION tokens; output costs five times input at every tier.

    Batch work (answers within a day, not immediately) is half price.
    """
    price_in, price_out = prices[tier]
    cost = input_tokens / 1e6 * price_in + output_tokens / 1e6 * price_out
    return cost * 0.5 if batch else cost


# ---------------------------------------------------------------- Step 2
def choose_tier(task):
    """Triage from the most demanding case down, so nothing hard falls through to a
    cheap tier. The default is the balanced middle tier: the choice least regretted."""
    difficulty = task.get("difficulty", 3)
    if difficulty >= 5:
        return "fable"
    if task.get("long_running") or difficulty == 4:
        return "opus"
    if task.get("volume") == "high" and difficulty <= 2:
        return "haiku"
    return "sonnet"


# ---------------------------------------------------------------- Step 3
def usage_in_window(history, now, hours):
    """A rolling window: old uses age out continuously; nothing 'resets' at a clock time."""
    return sum(weight for when, weight in history if now - hours < when <= now)


# ---------------------------------------------------------------- Step 4
def can_send(history, now, weight, cap_5h, cap_week):
    """Two limits apply at once. This models the shape of the behaviour; it is not the
    provider's actual accounting."""
    within_short = usage_in_window(history, now, 5) + weight <= cap_5h
    within_week = usage_in_window(history, now, 168) + weight <= cap_week
    return within_short and within_week


if __name__ == "__main__":
    for tier in PRICES:
        live = request_cost(tier, 10_000, 2_000)
        batched = request_cost(tier, 10_000, 2_000, batch=True)
        print(f"{tier:>7}: USD {live:.4f} per request   USD {batched:.4f} in a batch   "
              f"USD {live * 1_000_000:>9,.0f} per million requests")

    for name, task in [("tag 50,000 support tickets", {"volume": "high", "difficulty": 1}),
                       ("draft a client email", {"difficulty": 2}),
                       ("refactor a large codebase overnight", {"long_running": True, "difficulty": 4}),
                       ("untangle a contradictory legal dataset", {"difficulty": 5})]:
        print(f"{name:>40} -> {choose_tier(task)}")

    history = [(0, 30), (1, 30), (2, 30)]
    for now in (3, 5.5, 7.5):
        print(f"hour {now}: used in 5h window = {usage_in_window(history, now, 5)}, "
              f"can send 20? {can_send(history, now, 20, cap_5h=100, cap_week=1000)}")

    heavy_week = [(day * 24, 300) for day in range(4)]
    print("after four heavy days, can send on day 5?",
          can_send(heavy_week, 4 * 24 + 6, 50, cap_5h=400, cap_week=1200))

@@step
{
  "stepNumber": 1,
  "title": "Cost across the tiers",
  "instruction": "Implement request_cost(tier, input_tokens, output_tokens, batch, prices). Look up the tier's (input price, output price) per million tokens in prices. The cost is input_tokens / 1e6 times the input price, plus output_tokens / 1e6 times the output price. If batch is True, return half of that. Then compare the same request across the four tiers: the gap between the smallest and largest is what makes model choice a real decision. [MOD-3.1]",
  "hintConceptual": "You pay for what goes in and what comes out at different rates, quoted per million tokens. Work that can wait a day is charged at half price.",
  "hintSyntax": "price_in, price_out = prices[tier]\ncost = input_tokens / 1e6 * price_in + output_tokens / 1e6 * price_out\nreturn cost * 0.5 if batch else cost"
}
@@assert
assert abs(request_cost("sonnet", 10_000, 2_000) - 0.04) < 1e-12, f"10K in and 2K out on sonnet costs USD 0.04, got {request_cost('sonnet', 10_000, 2_000)}"
assert abs(request_cost("haiku", 10_000, 2_000) - 0.002) < 1e-12, "The same request on haiku costs USD 0.002"
assert abs(request_cost("opus", 10_000, 2_000) - 0.08) < 1e-12, "The same request on opus costs USD 0.08"
assert abs(request_cost("fable", 10_000, 2_000) - 0.16) < 1e-12, "The same request on fable costs USD 0.16"
assert abs(request_cost("sonnet", 10_000, 2_000, batch=True) - 0.02) < 1e-12, "Batch processing halves the cost"
assert abs(request_cost("sonnet", 4_000, 500) - 0.013) < 1e-12, "4K in and 500 out on sonnet costs USD 0.013"
assert request_cost("opus", 0, 0) == 0, "No tokens cost nothing"
assert abs(request_cost("x", 1_000_000, 1_000_000, prices={"x": (1.0, 3.0)}) - 4.0) < 1e-12, "The prices argument must be used"
print("Step 1 passed: the same request costs USD 0.002 on the smallest tier and USD 0.16 on the largest.")

@@step
{
  "stepNumber": 2,
  "title": "Choose a tier by rule",
  "instruction": "Implement choose_tier(task). Read difficulty from the dict with a default of 3. Check in this order: if difficulty is 5 or more return 'fable'; if long_running is true or difficulty is exactly 4 return 'opus'; if volume is 'high' and difficulty is 2 or less return 'haiku'; otherwise return 'sonnet'. Missing keys must not cause an error. This is the staffing-agency triage from Section 1 written down as a policy. [MOD-3.1]",
  "hintConceptual": "Identify the hardest work first so it cannot slip through to a cheap model. Reserve the cheapest model for work that is both simple and repeated many times. Everything else goes to the balanced middle.",
  "hintSyntax": "difficulty = task.get(\"difficulty\", 3)\nif difficulty >= 5:\n    return \"fable\"\nif task.get(\"long_running\") or difficulty == 4:\n    return \"opus\"\nif task.get(\"volume\") == \"high\" and difficulty <= 2:\n    return \"haiku\"\nreturn \"sonnet\""
}
@@assert
assert choose_tier({"volume": "high", "difficulty": 1}) == "haiku", "Simple, high-volume work goes to haiku"
assert choose_tier({"difficulty": 2}) == "sonnet", "A simple one-off task goes to sonnet, not haiku"
assert choose_tier({}) == "sonnet", "With no information the default is sonnet, and no error is raised"
assert choose_tier({"volume": "high"}) == "sonnet", "High volume at the default difficulty of 3 goes to sonnet"
assert choose_tier({"difficulty": 4}) == "opus", "Difficulty 4 goes to opus"
assert choose_tier({"long_running": True, "difficulty": 2}) == "opus", "Long-running work goes to opus even if each step is simple"
assert choose_tier({"difficulty": 5}) == "fable", "The hardest work goes to fable"
assert choose_tier({"difficulty": 5, "volume": "high", "long_running": True}) == "fable", "Difficulty 5 is checked before everything else"
assert choose_tier({"volume": "high", "difficulty": 2, "long_running": True}) == "opus", "long_running is checked before the cheap path"
print("Step 2 passed: each task is sent to the cheapest tier that suits it.")

@@step
{
  "stepNumber": 3,
  "title": "Usage in a rolling window",
  "instruction": "Implement usage_in_window(history, now, hours). The history is a list of (time_in_hours, weight) tuples. Return the sum of the weights of the entries whose time is greater than now minus hours and less than or equal to now. This is the rolling-window formula from Section 2. Notice that a use exactly `hours` old has left the window, so capacity returns gradually as old uses age out. [MOD-3.1]",
  "hintConceptual": "Imagine a window of fixed width sliding along a timeline. Only the uses currently inside it count. As the window moves forward, the oldest uses drop out of the back.",
  "hintSyntax": "return sum(weight for when, weight in history if now - hours < when <= now)"
}
@@assert
_h = [(0, 30), (1, 30), (2, 30)]
assert usage_in_window(_h, 3, 5) == 90, f"At hour 3 all three uses are inside the 5-hour window: 90, got {usage_in_window(_h, 3, 5)}"
assert usage_in_window(_h, 5.5, 5) == 60, "At hour 5.5 the use at hour 0 has aged out: 60"
assert usage_in_window(_h, 5, 5) == 60, "A use exactly 5 hours old is no longer in the window"
assert usage_in_window(_h, 7.5, 5) == 0, "At hour 7.5 every use has aged out"
assert usage_in_window(_h, 1, 5) == 60, "Uses in the future (after `now`) must not be counted"
assert usage_in_window(_h, 100, 168) == 90, "All three uses are inside a one-week window at hour 100"
assert usage_in_window([], 10, 5) == 0, "No history means no usage"
print("Step 3 passed: usage rolls off continuously as time passes.")

@@step
{
  "stepNumber": 4,
  "title": "Two limits at once",
  "instruction": "Implement can_send(history, now, weight, cap_5h, cap_week). Using usage_in_window, compute the usage in the last 5 hours and in the last 168 hours. Return True only if adding the new weight keeps the 5-hour total within cap_5h and the weekly total within cap_week. This explains the two experiences subscribers report: being asked to wait a few hours after an intense session, and being stopped until later in the week after several heavy days. [MOD-3.1]",
  "hintConceptual": "A request has to fit under a short-term limit and a long-term limit together. Passing one is not enough.",
  "hintSyntax": "within_short = usage_in_window(history, now, 5) + weight <= cap_5h\nwithin_week = usage_in_window(history, now, 168) + weight <= cap_week\nreturn within_short and within_week"
}
@@assert
_h = [(0, 30), (1, 30), (2, 30)]
assert can_send(_h, 3, 20, 100, 1000) is False, "At hour 3 the window holds 90, so 20 more would exceed 100"
assert can_send(_h, 3, 10, 100, 1000) is True, "A request that brings the total to exactly the cap is allowed"
assert can_send(_h, 5.5, 20, 100, 1000) is True, "At hour 5.5 only 60 remain in the window, so 20 fits"
assert can_send(_h, 7.5, 20, 100, 1000) is True, "At hour 7.5 the short window is empty"
_week = [(day * 24, 300) for day in range(4)]
assert can_send(_week, 4 * 24 + 6, 50, 400, 1200) is False, "Four heavy days used 1200 of the weekly 1200, so the weekly limit blocks the request even though the 5-hour window is empty"
assert can_send(_week, 4 * 24 + 6, 50, 400, 1300) is True, "With a higher weekly cap the same request is allowed"
assert can_send(_week, 8 * 24, 50, 400, 1200) is True, "After the first day ages out of the week, capacity returns"
assert can_send([], 0, 0, 0, 0) is True, "A zero-weight request always fits"
print("Step 4 passed: a request must clear both the 5-hour window and the weekly allowance.")
