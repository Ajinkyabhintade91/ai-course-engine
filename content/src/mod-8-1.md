@@meta
{
  "moduleId": "MOD-8.1",
  "slug": "mod-8-1",
  "unitId": "UNIT-8",
  "unitTitle": "Unit 8: Build Your Own AI Agents",
  "title": "What is an AI Agent?",
  "difficulty": "Foundational",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "Building effective agents", "source": "Anthropic Engineering", "url": "https://www.anthropic.com/engineering/building-effective-agents" },
    { "title": "ReAct: Synergizing Reasoning and Acting in Language Models", "source": "arXiv (Yao et al., 2022)", "url": "https://arxiv.org/abs/2210.03629" },
    { "title": "LLM Powered Autonomous Agents", "source": "Lil'Log (Lilian Weng)", "url": "https://lilianweng.github.io/posts/2023-06-23-agent/" },
    { "title": "Tool use with Claude", "source": "Claude Docs", "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview" }
  ],
  "videoLibrary": [
    {
      "id": "VID-8.1-1",
      "title": "AI agents explained: Build your first agent in 8 minutes",
      "creator": "Google Cloud Tech",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=Zqno_vux6d8",
      "timingInstruction": "Watch after reading Section 1, before the decision rubric in Section 2",
      "keyTakeaway": "Google's short explanation of agents, ending with a first build."
    },
    {
      "id": "VID-8.1-2",
      "title": "Agentic AI: Workflows vs. agents",
      "creator": "Google Cloud Tech",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=Qd6anWv0mv0",
      "timingInstruction": "Watch after the workflows and agents part of Section 2",
      "keyTakeaway": "The distinction between predefined paths and model-directed control, from another provider's perspective."
    },
    {
      "id": "VID-8.1-3",
      "title": "Generative vs Agentic AI: Shaping the Future of AI Collaboration",
      "creator": "IBM Technology",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=EDb37y_MhRw",
      "timingInstruction": "Watch after the lab, as a view of where agentic design is heading",
      "keyTakeaway": "How agentic AI differs from generative AI."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Choose an Architecture, Run a Loop, Count Context, Detect Stuck Runs, Score Runs",
    "context": "A tool shop is deciding which of its customer and back-office tasks deserve an AI agent and which a plain workflow. You will encode the decision rubric, run a small agent loop against stock tools with a scripted model, measure how context grows with each turn, detect an agent stuck repeating itself, and summarise a batch of runs by success and cost.",
    "language": "python"
  }
}

@@reading
# What is an AI Agent?

Unit 7 built automations in which code decided every step and a language model filled in particular steps: classify this email, summarise this transcript, draft this reply. This unit turns to systems where the model itself decides what to do next. Those are **agents**, and they are the most discussed and most misunderstood idea in applied AI.

Module 1.6 introduced agents and built a first agent loop. This chapter makes the idea precise enough to build with: a working definition, the distinction between workflows and agents and how to choose, the loop at the heart of every agent, the costs that grow with each turn of that loop, and the first measures of whether an agent is working. The rest of the unit then builds each part properly: architecture, tools, memory, retrieval, multiple agents, evaluation, deployment, and security.

## 1. First-Principles Mental Model & Intuition

### A new colleague with a task and a desk

Give a capable new colleague a task: "Find out whether we can deliver a tenon saw to a customer by Friday." You do not tell them each step. They look at the stock system, see the saw is out of stock, check the supplier's delivery date, compare it with Friday, and come back with an answer. If the stock system is down, they try another route. If they cannot find out, they say so. What makes this different from following a checklist is that **they choose the next step based on what they have just learned**.

An AI agent works the same way:

```text
          +---------------------------------------------------------+
          |                                                         |
   TASK --+--> MODEL decides: call a tool, or give the final answer |
          |        |                                                |
          |        v                                                |
          |    TOOL runs (stock lookup, supplier ETA, search)       |
          |        |                                                |
          |        v                                                |
          |    OBSERVATION (the tool's result, or its error)        |
          |        |                                                |
          +--------+   appended to the conversation, loop again ----+
                   |
                   v
             FINAL ANSWER, or a stop: step limit, budget, stuck
```

Anthropic's guide "Building effective agents" puts it plainly: agents are typically just language models using tools based on feedback from their environment, in a loop. Everything else, planning, memory, multiple agents, is built on that loop.

### A working definition

An **AI agent** is a system in which a language model **chooses actions**, usually tool calls, **observes their results**, and **repeats until it decides the goal is met** or a limit stops it. Three properties follow:

| Property | Meaning | Consequence |
|---|---|---|
| Model-directed control | The model, not code, picks the next step | Flexible, but less predictable |
| Tools | Actions beyond generating text | Real effects, real risks |
| A loop with feedback | Each result informs the next choice | Can recover from errors, or compound them |

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Workflows and agents

Anthropic's guide draws the distinction that matters most in practice. **Workflows** are systems where language models and tools are orchestrated through **predefined code paths**. **Agents** are systems where language models **dynamically direct their own processes and tool usage**, keeping control over how they accomplish tasks. Both are "agentic systems" in the loose sense; the difference is who decides the path.

| | Workflow | Agent |
|---|---|---|
| Who decides the next step | Code | The model |
| Number of steps | Known in advance | Varies by task |
| Predictability | High | Lower |
| Cost and latency | Bounded | Variable, often higher |
| Best for | Well-defined, repeatable tasks | Open-ended tasks where the path depends on what is found |

Every project in Unit 7 was a workflow, and correctly so: the steps of email triage or a weekly report are known. An agent earns its place when the steps cannot be listed in advance: investigating why an order went missing, researching a topic across sources, fixing a bug in an unfamiliar codebase.

### When to build an agent

The same guide recommends finding the simplest solution possible and only increasing complexity when needed, which might mean not building agentic systems at all, because they trade latency and cost for better task performance. A useful rubric asks four questions before choosing an agent:

| Question | If the answer is no |
|---|---|
| Is the task multi-step, with steps that cannot be specified in advance? | A workflow or a single call is simpler |
| Is the outcome valuable enough to justify higher cost and latency? | A workflow is cheaper |
| Can mistakes be caught and recovered from, by tests, review, or rollback? | Keep a workflow, or add human approval |
| Is the model capable at this kind of task? | Simplify the task or keep a person in charge |

The first question separates the three architectures: a single model call for one-step tasks without tools, a workflow when the steps are known, and an agent only when they are not and the other three answers are yes.

### The loop in detail

Every agent loop has the same parts:

1. **Context:** the system prompt, the task, the tool definitions, and the history so far.
2. **Decision:** the model returns either a tool call, a name and arguments, or a final answer.
3. **Execution:** code runs the tool. Errors are caught and returned as observations, never allowed to crash the loop, so the model can try another way.
4. **Observation:** the result is appended to the history.
5. **Stop conditions:** a final answer, a maximum number of steps, a budget, a stuck pattern, or a request for human help.

The ReAct paper by Yao and colleagues, "Synergizing Reasoning and Acting in Language Models", showed that interleaving reasoning with actions and observations, thinking about what to do, doing it, and reading the result, works better than either reasoning alone or acting alone. Modern model APIs build this pattern in: the model returns structured tool calls, and the application returns structured results, as Module 8.4 will show in detail.

### Context grows every turn

An agent's cost is not linear in its steps. Because the API has no memory, as Module 7.10 explained, each turn sends the entire history again. With a system prompt and tool definitions of $S$ tokens, each turn adding $a$ tokens of tool result and $b$ tokens of model output, the input on turn $k$ is

$$\text{input}_k = S + (k-1)(a + b) + a$$

and the total input over $n$ turns is

$$\sum_{k=1}^{n} \text{input}_k = nS + na + (a+b)\frac{n(n-1)}{2}$$

which grows with the **square** of the number of turns. With $S = 2000$, $a = 300$, and $b = 200$, one turn sends 2,300 input tokens, ten turns send 45,500, and twenty turns send 141,000. Doubling the steps roughly triples the input here, and the effect grows with longer runs. This is why agents need step limits, why prompt caching, which re-bills an unchanged prefix at a fraction of the price, matters so much for them, and why later modules cover summarising or trimming context.

### Errors compound, and agents can get stuck

If each step succeeds with probability $p$, a task needing $n$ correct steps succeeds with roughly $p^n$, as Module 1.6 showed; agents mitigate this by observing errors and retrying. But the same feedback can trap them: an agent can call the same tool with the same arguments again and again, each time getting the same unhelpful result. A simple detector looks for the same call repeated several times in a row and stops the run. Other stop conditions protect against runaway cost: a maximum number of steps and a token or money budget.

### Measuring an agent

A single impressive run proves little. Agents are judged on many runs of representative tasks, with at least four measures:

| Measure | Question |
|---|---|
| Success rate | How often is the final answer correct? |
| Steps | How many turns does a typical task take? |
| Cost | How much does a run cost, and how much per success? |
| Failure modes | How do failed runs fail: wrong answer, step limit, stuck, error? |

**Cost per success**, total cost divided by successful runs, is the honest figure: a cheap agent that fails half the time costs twice its run price per useful result. Module 8.12 builds full evaluation.

### Complexity

Each turn's model call is the dominant cost. Total input tokens grow quadratically with turns. Tool execution, stuck detection, and run summaries are linear in the trace length.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, choosing an architecture.

```python
import json

def choose_architecture(task):
    if not task["needs_tools"] and task["steps"] == 1:
        return "single_call", ["one step, no tools"]
    if task["steps_known"]:
        return "workflow", ["the steps are known in advance"]
    reasons = []
    for key, why in (("high_value", "value does not justify agent cost"),
                     ("errors_recoverable", "mistakes cannot be caught or undone"),
                     ("model_capable", "the model is not reliable at this task")):
        if not task[key]:
            reasons.append(why)
    if reasons:
        return "workflow", reasons
    return "agent", ["open-ended steps, valuable, recoverable, viable"]

BASE = {"needs_tools": True, "steps": 8, "steps_known": False, "high_value": True, "errors_recoverable": True, "model_capable": True}
print(choose_architecture({**BASE, "needs_tools": False, "steps": 1, "steps_known": True}))
print(choose_architecture({**BASE, "steps": 4, "steps_known": True}))
print(choose_architecture(BASE))
print(choose_architecture({**BASE, "errors_recoverable": False}))
```

- **A one-step task without tools is a single call.** Summarising a paragraph needs no loop.
- **Known steps mean a workflow.** Email triage has four steps that never change.
- **Open-ended, valuable, recoverable, viable tasks get an agent.** Investigating a missing order qualifies.
- **If mistakes cannot be undone, the answer is a workflow, with reasons.** An agent that issues refunds without review fails the rubric; keep the steps fixed or add approval, Module 8.11's subject.

Next, the loop itself, with a scripted model standing in for a real one.

```python
STOCK = {"HAM-1": 14, "SAW-3": 0, "CHI-6": 5}
TOOLS = {"stock": lambda sku: STOCK[sku], "eta": lambda sku: {"SAW-3": "2026-11-24"}.get(sku, "in stock")}

def run_agent(model, tools, task, max_steps=6):
    history, trace = [{"role": "user", "content": task}], []
    for step in range(1, max_steps + 1):
        action = model(history)
        if "final" in action:
            trace.append({"step": step, "final": action["final"]})
            return {"status": "done", "answer": action["final"], "steps": step, "trace": trace}
        name, arguments = action["tool"], action.get("input", {})
        if name not in tools:
            observation = {"error": f"unknown tool: {name}"}
        else:
            try:
                observation = {"result": tools[name](**arguments)}
            except Exception as error:
                observation = {"error": f"{type(error).__name__}: {error}"}
        trace.append({"step": step, "tool": name, "input": arguments, "observation": observation})
        history.append({"role": "assistant", "content": json.dumps(action)})
        history.append({"role": "user", "content": json.dumps(observation)})
    return {"status": "max_steps", "answer": None, "steps": max_steps, "trace": trace}

def scripted(actions):
    remaining = iter(actions)
    return lambda history: next(remaining)

model = scripted([{"tool": "stock", "input": {"sku": "SAW-3"}}, {"tool": "eta", "input": {"sku": "SAW-3"}},
                  {"final": "The tenon saw is out of stock; restock is expected on 2026-11-24, so not this week."}])
result = run_agent(model, TOOLS, "Can I buy a tenon saw this week?")
print(result["status"], result["steps"], [entry.get("observation") for entry in result["trace"]])
```

- **The model returns either a tool call or a final answer.** Real APIs return structured tool calls; the scripted model returns the same shapes, so the loop can be tested without a network.
- **Tools are looked up by name and called with the model's arguments.**
- **Unknown tools and exceptions become error observations.** The loop never crashes; the model sees the error and can choose differently.
- **Each action and observation is appended to the history.** That is how the next decision is informed by the last result.
- **The saw question takes three steps.** Stock is 0, the supplier date is 24 November, and the answer follows from both.
- **A step limit ends runaway loops with status "max_steps".** The run reports that it did not finish, rather than pretending.

Then, how context grows.

```python
def loop_tokens(turns, system, per_turn_in, per_turn_out):
    total_in = sum(system + (k - 1) * (per_turn_in + per_turn_out) + per_turn_in for k in range(1, turns + 1))
    return total_in, turns * per_turn_out

for turns in (1, 10, 20):
    print(turns, loop_tokens(turns, 2000, 300, 200))
```

- **Each turn resends the system prompt and the whole history.** That is the formula from Section 2, summed turn by turn.
- **One turn sends 2,300 input tokens; ten send 45,500; twenty send 141,000.** Output grows only linearly, 200 per turn.
- **The quadratic term dominates long runs.** It is why step limits, prompt caching, and context trimming matter.

Finally, stuck detection and run summaries.

```python
def stuck(trace, repeats=3):
    calls = [(entry["tool"], json.dumps(entry["input"], sort_keys=True)) for entry in trace if "tool" in entry]
    for start in range(len(calls) - repeats + 1):
        if len(set(calls[start:start + repeats])) == 1:
            return True, calls[start][0]
    return False, None

looping = scripted([{"tool": "stock", "input": {"sku": "HAM-1"}}] * 10)
looped = run_agent(looping, TOOLS, "How many hammers?", max_steps=5)
print(looped["status"], stuck(looped["trace"]), stuck(result["trace"]))

def summarise_runs(runs, price_in, price_out):
    successes = [run for run in runs if run["status"] == "done" and run["correct"]]
    cost = sum((run["tokens_in"] * price_in + run["tokens_out"] * price_out) / 1_000_000 for run in runs)
    return {"success_rate": round(len(successes) / len(runs), 3),
            "mean_steps": round(sum(run["steps"] for run in runs) / len(runs), 2),
            "total_cost": round(cost, 4),
            "cost_per_success": round(cost / len(successes), 4) if successes else None}

RUNS = [{"status": "done", "correct": True, "steps": 3, "tokens_in": 7800, "tokens_out": 600},
        {"status": "done", "correct": False, "steps": 5, "tokens_in": 15500, "tokens_out": 1000},
        {"status": "max_steps", "correct": False, "steps": 6, "tokens_in": 19500, "tokens_out": 1200},
        {"status": "done", "correct": True, "steps": 2, "tokens_in": 4500, "tokens_out": 400}]
print(summarise_runs(RUNS, 4.0, 20.0))
```

- **`stuck` looks for the same tool with the same arguments several times in a row.** Arguments are serialised with sorted keys, so argument order does not hide a repeat.
- **The looping agent asked for hammer stock five times.** The step limit stopped it, and `stuck` names the tool it was stuck on; in a real loop the check runs after every step and stops earlier.
- **The successful saw run is not stuck.** Different tools and arguments each time.
- **Four runs, two correct: a success rate of 0.5.** One run answered wrongly, one hit the step limit.
- **The batch cost USD 0.2532 at USD 4 and 20 per million tokens, the rates of a large model in Module 7.10.** Per success it is USD 0.1266, twice the average run cost, because half the runs produced nothing useful.

**Complexity.** `choose_architecture` is constant. `run_agent` makes at most `max_steps` model calls. `loop_tokens` is linear in the turns. `stuck` is linear in the trace times the repeat window. `summarise_runs` is linear in the runs.

### An agent specification sheet

```text
TASK            "Answer delivery questions for any product, using live stock and supplier data"
WHY AN AGENT    paths differ: in stock, back-ordered, discontinued, substitute products
TOOLS           stock(sku), eta(sku), substitutes(sku)                  read-only
STOP            final answer | 8 steps | 40,000 tokens | same call 3 times | asks for a person
ERRORS          returned to the model as observations, never raised
EVALUATION      50 real questions with known answers; success rate, steps, cost per success
RISK            read-only tools; no customer-facing send without review at first
```

### Common misconceptions

| Misconception | Reality |
|---|---|
| "Agent" means any AI feature | An agent chooses its own steps in a loop |
| Agents are always better | They trade cost and predictability for flexibility |
| More steps mean more thorough | More steps mean more cost and more chances to go wrong |
| The model will stop when it should | Code must enforce limits |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Building an agent for a workflow problem.** If you can list the steps, code them. Agents are for paths you cannot list.

**No step limit.** An agent without a limit can loop until the budget is gone. Always cap steps and tokens.

**Exceptions that crash the loop.** A tool error should become an observation the model can react to.

**Judging by demos.** One great run is anecdote. Measure success rate over many representative tasks.

**Ignoring context growth.** Long runs cost far more than steps suggest. Watch total tokens, and cache stable prefixes.

**Tools with real side effects on day one.** Start read-only; add actions behind approval, as Module 8.11 describes.

**Vague task statements.** An agent given "sort out the orders" wanders. State the goal and what done looks like.

**Repeated identical calls.** A stuck agent burns money politely. Detect repeats and stop.

**Hiding failures.** "I couldn't determine that" is a valid and valuable answer. Reward it in prompts and evaluation.

**Too many tools.** A dozen overlapping tools confuse the model. Fewer, clearer tools work better, as Module 8.5 explains.

**No trace.** Without a record of each step, a wrong answer cannot be debugged. Log every action and observation.

**Assuming an agent replaces a person.** Most valuable agents assist a person who checks the result.

## 5. Active Recall Check & Synthesis Summary

**Summary.** An AI agent is a system in which a language model chooses actions, usually tool calls, observes their results, and repeats until it gives a final answer or a limit stops it; Anthropic's guide describes agents as models using tools based on environmental feedback in a loop. Workflows orchestrate models and tools through predefined code paths; agents let the model direct its own process. The recommended approach is the simplest that works: a single call for one-step tasks, a workflow when steps are known, and an agent only when steps cannot be specified in advance, the value justifies the cost, mistakes can be caught and recovered, and the model is capable. The loop assembles context, gets a decision, executes tools with errors returned as observations, appends results, and checks stop conditions: a final answer, a step limit, a budget, a stuck pattern, or a request for help. Because each turn resends the whole history, input tokens grow quadratically with turns, 2,300 for one turn but 141,000 for twenty in the worked example. Agents are judged over many runs by success rate, steps, cost, cost per success, and failure modes, and their traces are kept for debugging.

**Question 1.** Classify each task as a single call, a workflow, or an agent, using the rubric in Section 2, and justify each: (a) translating a product description into French; (b) every night, exporting new orders to the accounting system; (c) investigating why a customer's order shows "delivered" but they say it never arrived, using order, courier, and warehouse systems; (d) automatically issuing refunds of any size based on the investigation in (c).

<details>
<summary>View Answer</summary>

(a) A single call: one step, no tools, and the output can be checked by reading it. (b) A workflow: the steps are the same every night, fetch new orders, map fields, create entries, log, so code should define them, with the model used only if some step needs language understanding. (c) An agent is reasonable: the path depends on what is found, the courier's tracking might show a different address, the warehouse might show a mis-scan, the order might have been split, so the steps cannot be listed in advance; the outcome is valuable, a resolved complaint and possibly a lost parcel recovered; mistakes are recoverable if the agent's tools are read-only and its conclusion goes to a person; and models are capable of this kind of investigation. (d) Not an agent acting alone: issuing refunds is an irreversible action with money, so the "errors recoverable" question fails. The rubric says to keep a workflow or add human approval: the agent can recommend a refund with its evidence, and a person or a fixed rule, such as refunds under a small amount for confirmed courier losses, approves it.

</details>

**Question 2.** An agent's system prompt and tool definitions total 3,000 tokens, and each turn adds about 400 tokens of tool result and 250 of model output. Compute the total input tokens for 5 turns and for 15 turns using the formula in Section 2, and explain what this means for a design that allows up to 30 turns.

<details>
<summary>View Answer</summary>

The total input over n turns is n times S plus n times a plus (a + b) times n(n - 1)/2, with S = 3,000, a = 400, and b = 250, so a + b = 650. For 5 turns: 15,000 + 2,000 + 650 times 10, which is 6,500, giving 23,500 tokens. For 15 turns: 45,000 + 6,000 + 650 times 105, which is 68,250, giving 119,250 tokens. Three times the turns costs about five times the input. At 30 turns the quadratic term is 650 times 435, 282,750, plus 90,000 plus 12,000, about 384,750 input tokens per run, sixteen times the 5-turn figure. A design allowing 30 turns therefore needs: a step limit set from evidence of how many steps tasks really take; prompt caching of the stable 3,000-token prefix, so it is billed at a fraction on each turn; trimming or summarising old tool results that are no longer needed; and smaller tool outputs, since every token of a result is resent on every later turn.

</details>

**Question 3.** An agent is evaluated on 20 questions. It answers 12 correctly, answers 5 wrongly, hits the step limit on 2, and is stopped as stuck on 1. The total cost of the 20 runs is USD 1.80. Compute the success rate and cost per success, and explain what you would investigate first and why.

<details>
<summary>View Answer</summary>

The success rate is 12 of 20, 0.6. The cost per success is USD 1.80 divided by 12, USD 0.15, compared with an average run cost of USD 0.09: every useful answer effectively costs the price of one and two thirds runs. I would investigate the 5 wrong answers first, because they are the dangerous failures: an agent that hits its step limit or gets stuck reports that it did not finish, while a wrong final answer looks like success to a user. Their traces show whether the agent misread a tool result, used the wrong tool, lacked a tool it needed, or stated something no tool supported. Next I would look at the 2 step-limit runs and the stuck run, which often share a cause, such as a tool returning an unhelpful error or a missing capability, and are usually fixed by better tool descriptions or error messages, Module 8.5's topic. Improving the prompt so the agent says "I could not determine this" instead of guessing would turn some wrong answers into honest non-answers, which is a real improvement even though the success rate does not change.

</details>

@@starter
"""
Lab: Choose an Architecture, Run a Loop, Count Context, Detect Stuck Runs, Score Runs
Standard library only. No network calls: the model is scripted. Complete each TODO, then press "Run & Verify Step".
"""
import json

STOCK = {"HAM-1": 14, "SAW-3": 0, "CHI-6": 5}
TOOLS = {"stock": lambda sku: STOCK[sku], "eta": lambda sku: {"SAW-3": "2026-11-24"}.get(sku, "in stock")}


def scripted(actions):
    """Given: a fake model that returns the actions in order, ignoring the history."""
    remaining = iter(actions)
    return lambda history: next(remaining)


# ---------------------------------------------------------------- Step 1
def choose_architecture(task):
    """No tools and 1 step -> ("single_call", ["one step, no tools"]). steps_known -> ("workflow", ["the steps are known
    in advance"]). Otherwise collect reasons, in order, for high_value False ("value does not justify agent cost"),
    errors_recoverable False ("mistakes cannot be caught or undone"), model_capable False ("the model is not reliable
    at this task"): any -> ("workflow", reasons); none -> ("agent", ["open-ended steps, valuable, recoverable, viable"])."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def run_agent(model, tools, task, max_steps=6):
    """history starts as [{"role": "user", "content": task}]. For step 1..max_steps: action = model(history).
    "final" in action -> append {"step", "final"} to trace and return {"status": "done", "answer", "steps": step, "trace"}.
    Otherwise run tools[action["tool"]](**action.get("input", {})): unknown tool -> {"error": "unknown tool: NAME"};
    exception -> {"error": "ExceptionType: message"}; else {"result": value}. Append {"step", "tool", "input",
    "observation"} to trace, and the action and observation (json.dumps) to history as assistant and user messages.
    After the loop return {"status": "max_steps", "answer": None, "steps": max_steps, "trace"}."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def loop_tokens(turns, system, per_turn_in, per_turn_out):
    """Total input = sum over k = 1..turns of system + (k - 1) * (per_turn_in + per_turn_out) + per_turn_in.
    Return (total input, turns * per_turn_out)."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def stuck(trace, repeats=3):
    """calls = (tool, json.dumps(input, sort_keys=True)) for trace entries with a "tool". If any `repeats` consecutive
    calls are identical return (True, that tool), else (False, None)."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def summarise_runs(runs, price_in, price_out):
    """success = status "done" and correct. Return {"success_rate": round(successes / runs, 3), "mean_steps":
    round(mean steps, 2), "total_cost": round(sum of per-run token costs per million, 4), "cost_per_success":
    round(total / successes, 4) or None if there are no successes}."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("arch  :", choose_architecture({"needs_tools": False, "steps": 1, "steps_known": True, "high_value": True, "errors_recoverable": True, "model_capable": True}))
    print("tokens:", loop_tokens(10, 2000, 300, 200))

@@solution
"""
Lab solution: Choose an Architecture, Run a Loop, Count Context, Detect Stuck Runs, Score Runs
Standard library only. No network calls: the model is scripted.
"""
import json

STOCK = {"HAM-1": 14, "SAW-3": 0, "CHI-6": 5}
TOOLS = {"stock": lambda sku: STOCK[sku], "eta": lambda sku: {"SAW-3": "2026-11-24"}.get(sku, "in stock")}


def scripted(actions):
    """Given: a fake model that returns the actions in order, ignoring the history."""
    remaining = iter(actions)
    return lambda history: next(remaining)


# ---------------------------------------------------------------- Step 1
def choose_architecture(task):
    """The simplest architecture that works; an agent only when every rubric question is yes."""
    if not task["needs_tools"] and task["steps"] == 1:
        return "single_call", ["one step, no tools"]
    if task["steps_known"]:
        return "workflow", ["the steps are known in advance"]
    reasons = []
    for key, why in (("high_value", "value does not justify agent cost"),
                     ("errors_recoverable", "mistakes cannot be caught or undone"),
                     ("model_capable", "the model is not reliable at this task")):
        if not task[key]:
            reasons.append(why)
    if reasons:
        return "workflow", reasons
    return "agent", ["open-ended steps, valuable, recoverable, viable"]


# ---------------------------------------------------------------- Step 2
def run_agent(model, tools, task, max_steps=6):
    """Decide, act, observe, repeat. Errors become observations; a step limit ends the run honestly."""
    history, trace = [{"role": "user", "content": task}], []
    for step in range(1, max_steps + 1):
        action = model(history)
        if "final" in action:
            trace.append({"step": step, "final": action["final"]})
            return {"status": "done", "answer": action["final"], "steps": step, "trace": trace}
        name, arguments = action["tool"], action.get("input", {})
        if name not in tools:
            observation = {"error": f"unknown tool: {name}"}
        else:
            try:
                observation = {"result": tools[name](**arguments)}
            except Exception as error:
                observation = {"error": f"{type(error).__name__}: {error}"}
        trace.append({"step": step, "tool": name, "input": arguments, "observation": observation})
        history.append({"role": "assistant", "content": json.dumps(action)})
        history.append({"role": "user", "content": json.dumps(observation)})
    return {"status": "max_steps", "answer": None, "steps": max_steps, "trace": trace}


# ---------------------------------------------------------------- Step 3
def loop_tokens(turns, system, per_turn_in, per_turn_out):
    """Every turn resends the whole history, so input grows with the square of the turns."""
    total_in = sum(system + (k - 1) * (per_turn_in + per_turn_out) + per_turn_in for k in range(1, turns + 1))
    return total_in, turns * per_turn_out


# ---------------------------------------------------------------- Step 4
def stuck(trace, repeats=3):
    """The same call again and again means the agent is not learning from its observations."""
    calls = [(entry["tool"], json.dumps(entry["input"], sort_keys=True)) for entry in trace if "tool" in entry]
    for start in range(len(calls) - repeats + 1):
        if len(set(calls[start:start + repeats])) == 1:
            return True, calls[start][0]
    return False, None


# ---------------------------------------------------------------- Step 5
def summarise_runs(runs, price_in, price_out):
    """Cost per success is the honest price of an agent."""
    successes = [run for run in runs if run["status"] == "done" and run["correct"]]
    cost = sum((run["tokens_in"] * price_in + run["tokens_out"] * price_out) / 1_000_000 for run in runs)
    return {"success_rate": round(len(successes) / len(runs), 3),
            "mean_steps": round(sum(run["steps"] for run in runs) / len(runs), 2),
            "total_cost": round(cost, 4),
            "cost_per_success": round(cost / len(successes), 4) if successes else None}


if __name__ == "__main__":
    base = {"needs_tools": True, "steps": 8, "steps_known": False, "high_value": True, "errors_recoverable": True, "model_capable": True}
    print(choose_architecture(base), choose_architecture({**base, "errors_recoverable": False}))
    model = scripted([{"tool": "stock", "input": {"sku": "SAW-3"}}, {"tool": "eta", "input": {"sku": "SAW-3"}}, {"final": "Restock 2026-11-24."}])
    print(run_agent(model, TOOLS, "Can I buy a tenon saw this week?")["steps"])
    print(loop_tokens(5, 3000, 400, 250), loop_tokens(15, 3000, 400, 250), loop_tokens(30, 3000, 400, 250))
    looped = run_agent(scripted([{"tool": "stock", "input": {"sku": "HAM-1"}}] * 10), TOOLS, "Hammers?", max_steps=5)
    print(stuck(looped["trace"]))

@@step
{
  "stepNumber": 1,
  "title": "Choose an architecture",
  "instruction": "Implement choose_architecture(task). Return 'single_call' with the reason 'one step, no tools' when the task needs no tools and has one step. Return 'workflow' with 'the steps are known in advance' when the steps are known. Otherwise collect a reason for each failed rubric question, in order: high_value, errors_recoverable, model_capable, with the messages in the docstring; if there are any, return 'workflow' with them, else 'agent' with 'open-ended steps, valuable, recoverable, viable'. Classify four tasks. This is the decision rubric from Section 2. [MOD-8.1]",
  "hintConceptual": "Before hiring an investigator, ask: is this a one-line errand, a checklist job, or a genuine investigation that is worth the fee, safe to get wrong, and within their abilities?",
  "hintSyntax": "if not task[\"needs_tools\"] and task[\"steps\"] == 1:\n    return \"single_call\", [\"one step, no tools\"]\nif task[\"steps_known\"]:\n    return \"workflow\", [\"the steps are known in advance\"]\nreasons = []\nfor key, why in ((\"high_value\", \"value does not justify agent cost\"),\n                 (\"errors_recoverable\", \"mistakes cannot be caught or undone\"),\n                 (\"model_capable\", \"the model is not reliable at this task\")):\n    if not task[key]:\n        reasons.append(why)\nif reasons:\n    return \"workflow\", reasons\nreturn \"agent\", [\"open-ended steps, valuable, recoverable, viable\"]"
}
@@assert
_base = {"needs_tools": True, "steps": 8, "steps_known": False, "high_value": True, "errors_recoverable": True, "model_capable": True}
assert choose_architecture({**_base, "needs_tools": False, "steps": 1, "steps_known": True}) == ("single_call", ["one step, no tools"]), "One step without tools is a single call"
assert choose_architecture({**_base, "steps": 4, "steps_known": True}) == ("workflow", ["the steps are known in advance"]), "Known steps mean a workflow"
assert choose_architecture(_base) == ("agent", ["open-ended steps, valuable, recoverable, viable"]), f"An open-ended investigation, got {choose_architecture(_base)}"
assert choose_architecture({**_base, "errors_recoverable": False}) == ("workflow", ["mistakes cannot be caught or undone"]), "Irreversible actions keep a workflow"
assert choose_architecture({**_base, "high_value": False, "model_capable": False}) == ("workflow", ["value does not justify agent cost", "the model is not reliable at this task"]), "Every failed question is a reason, in order"
assert choose_architecture({**_base, "needs_tools": False, "steps": 3})[0] == "agent", "Several steps without tools can still be open-ended"
print("Step 1 passed: single call, workflow, agent, and a workflow when mistakes cannot be undone.")

@@step
{
  "stepNumber": 2,
  "title": "Run the agent loop",
  "instruction": "Implement run_agent(model, tools, task, max_steps). Start the history with the user's task. For each step from 1 to max_steps, ask the model for an action. A final answer ends the run with status 'done', the answer, the step number, and the trace. Otherwise run the named tool with the action's input: an unknown tool or an exception becomes an error observation as described in the docstring, a normal return becomes a result observation. Record the step, tool, input, and observation in the trace, and append the action and observation to the history as JSON. If the steps run out, return status 'max_steps' with no answer. Run the saw question and a model that calls a missing tool. This is the loop from Section 2. [MOD-8.1]",
  "hintConceptual": "The colleague's day: decide what to check, check it, write down what you found, decide again, and either report back or stop at home time with a note saying you did not finish.",
  "hintSyntax": "history, trace = [{\"role\": \"user\", \"content\": task}], []\nfor step in range(1, max_steps + 1):\n    action = model(history)\n    if \"final\" in action:\n        trace.append({\"step\": step, \"final\": action[\"final\"]})\n        return {\"status\": \"done\", \"answer\": action[\"final\"], \"steps\": step, \"trace\": trace}\n    name, arguments = action[\"tool\"], action.get(\"input\", {})\n    if name not in tools:\n        observation = {\"error\": f\"unknown tool: {name}\"}\n    else:\n        try:\n            observation = {\"result\": tools[name](**arguments)}\n        except Exception as error:\n            observation = {\"error\": f\"{type(error).__name__}: {error}\"}\n    trace.append({\"step\": step, \"tool\": name, \"input\": arguments, \"observation\": observation})\n    history.append({\"role\": \"assistant\", \"content\": json.dumps(action)})\n    history.append({\"role\": \"user\", \"content\": json.dumps(observation)})\nreturn {\"status\": \"max_steps\", \"answer\": None, \"steps\": max_steps, \"trace\": trace}"
}
@@assert
_model = scripted([{"tool": "stock", "input": {"sku": "SAW-3"}}, {"tool": "eta", "input": {"sku": "SAW-3"}}, {"final": "Out of stock until 2026-11-24."}])
_r = run_agent(_model, TOOLS, "Can I buy a tenon saw this week?")
assert _r is not None and _r["status"] == "done" and _r["steps"] == 3 and _r["answer"] == "Out of stock until 2026-11-24.", f"Three steps to an answer, got {_r}"
assert [e.get("observation") for e in _r["trace"][:2]] == [{"result": 0}, {"result": "2026-11-24"}], "Observations are recorded"
_seen = []
def _recording(history):
    _seen.append(len(history))
    return [{"tool": "stock", "input": {"sku": "PLN-9"}}, {"tool": "lookup"}, {"final": "done"}][len(_seen) - 1]
_r2 = run_agent(_recording, TOOLS, "x")
assert [e["observation"] for e in _r2["trace"][:2]] == [{"error": "KeyError: 'PLN-9'"}, {"error": "unknown tool: lookup"}], "Errors become observations"
assert _seen == [1, 3, 5], "Each action and observation is appended to the history"
_r3 = run_agent(scripted([{"tool": "stock", "input": {"sku": "HAM-1"}}] * 10), TOOLS, "x", max_steps=4)
assert _r3["status"] == "max_steps" and _r3["answer"] is None and _r3["steps"] == 4 and len(_r3["trace"]) == 4, "The step limit ends the run"
print("Step 2 passed: three steps to the saw answer, and errors never crash the loop.")

@@step
{
  "stepNumber": 3,
  "title": "Count context growth",
  "instruction": "Implement loop_tokens(turns, system, per_turn_in, per_turn_out). The input on turn k is the system tokens plus (k - 1) times the sum of per-turn input and output, plus the per-turn input. Return the total input over all turns and the total output, turns times per-turn output. Compare 1, 10, and 20 turns. This is context growth from Section 2. [MOD-8.1]",
  "hintConceptual": "Every time you phone the colleague, you read out the whole case file so far before asking the next question. The file gets longer each call, so the calls get longer too.",
  "hintSyntax": "total_in = sum(system + (k - 1) * (per_turn_in + per_turn_out) + per_turn_in for k in range(1, turns + 1))\nreturn total_in, turns * per_turn_out"
}
@@assert
assert loop_tokens(1, 2000, 300, 200) == (2300, 200) and loop_tokens(10, 2000, 300, 200) == (45500, 2000) and loop_tokens(20, 2000, 300, 200) == (141000, 4000), f"1, 10, and 20 turns, got {loop_tokens(10, 2000, 300, 200)}"
assert loop_tokens(5, 3000, 400, 250) == (23500, 1250) and loop_tokens(15, 3000, 400, 250) == (119250, 3750), "The second recall question"
assert loop_tokens(30, 3000, 400, 250)[0] == 384750 and loop_tokens(0, 2000, 300, 200) == (0, 0), "Thirty turns, and no turns"
print("Step 3 passed: 2,300 input tokens for one turn, 141,000 for twenty.")

@@step
{
  "stepNumber": 4,
  "title": "Detect a stuck agent",
  "instruction": "Implement stuck(trace, repeats). Build the list of calls from trace entries that have a tool, each as the tool name and its input serialised with json.dumps and sorted keys. If any run of `repeats` consecutive calls are all identical, return True and that tool's name; otherwise return False and None. Check a looping run and a healthy one. This is stuck detection from Section 2. [MOD-8.1]",
  "hintConceptual": "If the colleague rings the same supplier with the same question three times in a row, they are not getting anywhere, and someone should step in.",
  "hintSyntax": "calls = [(entry[\"tool\"], json.dumps(entry[\"input\"], sort_keys=True)) for entry in trace if \"tool\" in entry]\nfor start in range(len(calls) - repeats + 1):\n    if len(set(calls[start:start + repeats])) == 1:\n        return True, calls[start][0]\nreturn False, None"
}
@@assert
_loop = [{"step": i, "tool": "stock", "input": {"sku": "HAM-1"}, "observation": {"result": 14}} for i in range(1, 6)]
assert stuck(_loop) == (True, "stock"), f"Five identical calls are stuck, got {stuck(_loop)}"
_healthy = [{"step": 1, "tool": "stock", "input": {"sku": "SAW-3"}}, {"step": 2, "tool": "eta", "input": {"sku": "SAW-3"}}, {"step": 3, "final": "x"}]
assert stuck(_healthy) == (False, None) and stuck([]) == (False, None), "Different calls are not stuck"
_order = [{"tool": "t", "input": {"a": 1, "b": 2}}, {"tool": "t", "input": {"b": 2, "a": 1}}, {"tool": "t", "input": {"a": 1, "b": 2}}]
assert stuck(_order) == (True, "t"), "Argument order does not hide a repeat"
_alternating = [{"tool": "t", "input": {"x": n % 2}} for n in range(6)]
assert stuck(_alternating) == (False, None) and stuck(_loop[:2]) == (False, None) and stuck(_loop[:2], repeats=2) == (True, "stock"), "Only consecutive repeats count; the window is an argument"
print("Step 4 passed: five identical stock calls are caught as stuck.")

@@step
{
  "stepNumber": 5,
  "title": "Summarise a batch of runs",
  "instruction": "Implement summarise_runs(runs, price_in, price_out). A success is a run with status 'done' that is correct. Return the success rate rounded to 3 places, the mean steps rounded to 2, the total cost, each run's input tokens times the input price plus output tokens times the output price divided by one million, summed and rounded to 4 places, and the cost per success rounded to 4 places, or None if nothing succeeded. Summarise the four runs from Section 3. This is measuring an agent from Section 2. [MOD-8.1]",
  "hintConceptual": "Judge the investigator by the month, not the best case: how many cases they solved, how long they took, what they billed, and what each solved case really cost.",
  "hintSyntax": "successes = [run for run in runs if run[\"status\"] == \"done\" and run[\"correct\"]]\ncost = sum((run[\"tokens_in\"] * price_in + run[\"tokens_out\"] * price_out) / 1_000_000 for run in runs)\nreturn {\"success_rate\": round(len(successes) / len(runs), 3),\n        \"mean_steps\": round(sum(run[\"steps\"] for run in runs) / len(runs), 2),\n        \"total_cost\": round(cost, 4),\n        \"cost_per_success\": round(cost / len(successes), 4) if successes else None}"
}
@@assert
_runs = [{"status": "done", "correct": True, "steps": 3, "tokens_in": 7800, "tokens_out": 600},
         {"status": "done", "correct": False, "steps": 5, "tokens_in": 15500, "tokens_out": 1000},
         {"status": "max_steps", "correct": False, "steps": 6, "tokens_in": 19500, "tokens_out": 1200},
         {"status": "done", "correct": True, "steps": 2, "tokens_in": 4500, "tokens_out": 400}]
assert summarise_runs(_runs, 4.0, 20.0) == {"success_rate": 0.5, "mean_steps": 4.0, "total_cost": 0.2532, "cost_per_success": 0.1266}, f"The batch, got {summarise_runs(_runs, 4.0, 20.0)}"
assert summarise_runs([{"status": "max_steps", "correct": True, "steps": 6, "tokens_in": 1000, "tokens_out": 0}], 4.0, 20.0)["cost_per_success"] is None, "A run that did not finish is not a success, even if marked correct"
assert summarise_runs(_runs[3:], 4.0, 20.0)["success_rate"] == 1.0, "A single good run"
print("Step 5 passed: half the runs succeed, so each success costs twice the average run.")
