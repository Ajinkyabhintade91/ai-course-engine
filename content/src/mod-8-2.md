@@meta
{
  "moduleId": "MOD-8.2",
  "slug": "mod-8-2",
  "unitId": "UNIT-8",
  "unitTitle": "Unit 8: Build Your Own AI Agents",
  "title": "AI Agent Architecture",
  "difficulty": "Intermediate",
  "estimatedMinutes": 95,
  "citations": [
    { "title": "ReAct: Synergizing Reasoning and Acting in Language Models", "source": "arXiv (Yao et al., 2022)", "url": "https://arxiv.org/abs/2210.03629" },
    { "title": "Reflexion: Language Agents with Verbal Reinforcement Learning", "source": "arXiv (Shinn et al., 2023)", "url": "https://arxiv.org/abs/2303.11366" },
    { "title": "Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models", "source": "arXiv (Wang et al., 2023)", "url": "https://arxiv.org/abs/2305.04091" },
    { "title": "Plan-and-Execute Agents", "source": "LangChain Blog", "url": "https://blog.langchain.com/planning-agents/" },
    { "title": "Persistence", "source": "LangGraph Docs", "url": "https://langchain-ai.github.io/langgraph/concepts/persistence/" },
    { "title": "Building effective agents", "source": "Anthropic Engineering", "url": "https://www.anthropic.com/engineering/building-effective-agents" }
  ],
  "videoLibrary": [
    {
      "id": "VID-8.2-1",
      "title": "ReAct AI Agents, clearly explained!",
      "creator": "Akshay Pachaar",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=vFdIrZyKEwQ",
      "timingInstruction": "Watch after reading Section 1, before the control-loop patterns in Section 2",
      "keyTakeaway": "The thought, action, observation cycle that underlies most agents."
    },
    {
      "id": "VID-8.2-2",
      "title": "Agent Design Patterns - Plan and Execute - Hands-on coding in LangGraph",
      "creator": "AI Bites",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=vpD9kf5Xwo0",
      "timingInstruction": "Watch after the plan-and-execute part of Section 2, before Step 2 of the lab",
      "keyTakeaway": "A planner writes the steps, an executor runs them, and a replanner revises when something fails."
    },
    {
      "id": "VID-8.2-3",
      "title": "Reflection Agents",
      "creator": "LangChain",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=v5ymBTXNqtk",
      "timingInstruction": "Watch after the reflection part of Section 2, before Step 3 of the lab",
      "keyTakeaway": "A critique step that feeds specific problems back to the generator, round after round."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Phases, Plan-and-Execute with Replanning, Reflection, Termination, Checkpoints",
    "context": "A tool shop wants an agent that restocks products: it plans the lookups and orders, executes them, recovers when a tool fails, has its customer message checked before sending, and can be paused and resumed. You will build the phase machine, a plan executor with replanning, a critique-and-revise loop, the termination check, and checkpointing of the agent's state.",
    "language": "python"
  }
}

@@reading
# AI Agent Architecture

Module 8.1 defined an agent as a model choosing actions in a loop. That loop is the heart of every agent, but a working agent needs more around it: somewhere to keep its instructions and tools, a way to decide its steps, memory of what it has done, rules for when to stop, and the ability to pause and pick up again. This chapter names those components, describes the three control patterns most agents are built from, ReAct, plan-and-execute, and reflection, and shows how state and termination keep an agent predictable enough to run in production.

## 1. First-Principles Mental Model & Intuition

### A project team in one system

Think of a small project team. A **lead** reads the brief and writes a plan. **Workers** carry out each step with their tools. A **reviewer** checks the result against the brief before it is handed over. A **project file** records the plan, what has been done, and what was found, so anyone can pick the work up after a break. And a **manager** decides when to stop: the work is done, the budget is spent, or the project is going nowhere.

An agent architecture puts all of these roles into one system, most of them played by the same model with different instructions.

```text
   +--------------------------------------------------------------------+
   |  INSTRUCTIONS   system prompt: role, goal, rules, output format    |
   |  TOOLS          names, descriptions, schemas, and the code behind  |
   |  MODEL          the reasoning engine: decides, plans, critiques    |
   |  MEMORY/STATE   history, plan, results, phase, counters            |
   |  CONTROLLER     code: runs the loop, enforces limits, checkpoints  |
   +--------------------------------------------------------------------+
            |                    |                      |
         PLANNER             EXECUTOR               REVIEWER
       (writes steps)     (runs tool calls)     (checks the result)
```

The **controller** is ordinary code, and it is the part that makes an agent safe: the model proposes, the controller disposes. The model can ask for anything; the controller decides what actually runs, how many times, and when the run ends.

### The components

| Component | What it holds or does | Covered in |
|---|---|---|
| Model | Decides the next step, writes plans, critiques | Module 8.3 |
| Instructions | Role, goal, constraints, output format | Module 5.7 |
| Tools | Actions and lookups with clear schemas | Modules 8.4 and 8.5 |
| Memory and state | History, plan, results, facts learned | Module 8.3 |
| Planner | Turns a goal into steps | This module |
| Executor | Runs steps and records results | This module |
| Controller | Loop, limits, checkpoints, stop rules | This module |

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Pattern 1: ReAct

The ReAct paper by Yao and colleagues introduced the simplest and most widely used pattern: the model **reasons** about what to do, **acts** by calling a tool, **observes** the result, and repeats. There is no separate plan: each step is chosen in light of the last observation.

```text
   thought -> action -> observation -> thought -> action -> observation -> answer
```

ReAct suits tasks where each finding changes what to do next, such as investigation and troubleshooting. Its weaknesses are the mirror image: without a plan, it can wander, repeat itself, or lose track of the overall goal on long tasks. Module 8.1's stuck detection and step limits exist mainly for ReAct loops.

### Pattern 2: Plan-and-execute

The **plan-and-execute** pattern separates thinking from doing. A planner call produces a list of steps; an executor runs them one by one, often with cheaper or simpler calls; when a step fails or reveals something unexpected, a **replanner** produces a revised list of remaining steps. The idea draws on research such as the Plan-and-Solve prompting work of Wang and colleagues, which showed that asking a model to devise a plan before solving improves multi-step reasoning, and LangChain's write-up of planning agents describes the architecture and its advantages: fewer calls to the large model, and a visible plan that people can inspect.

```text
   GOAL -> PLANNER -> [step 1, step 2, step 3]
                         |
                      EXECUTOR runs step 1: ok
                      EXECUTOR runs step 2: FAILED ("no such product in local stock")
                         |
                      REPLANNER, given the failure and results so far -> [step 2b, step 3]
                         |
                      EXECUTOR continues
```

Plan-and-execute suits tasks with a recognisable structure, such as research reports and multi-system updates. Two limits keep it safe: a maximum number of replans, so a plan that keeps failing ends instead of cycling, and validation of each plan, since a plan is model output and may name tools or steps that do not exist.

### Pattern 3: Reflection

**Reflection** adds a critique step: after producing an output, the system evaluates it and, if it falls short, revises it using the critique. The Reflexion paper by Shinn and colleagues showed agents improving across attempts by writing verbal feedback on their failures and using it next time. Anthropic's guide describes the same shape as the **evaluator-optimizer** workflow: one call generates, another evaluates and gives feedback, in a loop, and it works best when there are clear evaluation criteria.

The critic is most reliable when its checks are concrete. Some can be code: length limits, required phrases, forbidden promises, valid JSON. Others need a model: tone, accuracy against sources. The loop ends when the critic finds no problems, or after a maximum number of rounds, in which case the output is flagged as not accepted rather than sent anyway.

### Choosing a pattern

| Task | Pattern | Why |
|---|---|---|
| Troubleshooting, investigation | ReAct | Each finding decides the next step |
| Multi-step update across systems | Plan-and-execute | Steps are mostly known; failures need recovery |
| Writing that must meet criteria | Reflection | Clear checks, iterative improvement |
| Research report | Plan-and-execute with reflection | Plan the sections, check the draft |

Patterns combine freely. A planner can produce steps that are each small ReAct loops; a reflection step can review the final output of any pattern.

### State and phases

An agent's **state** is everything needed to continue its work: the current phase, the plan, the results so far, counters for steps and tokens, and the history. Making the phase explicit turns a vague loop into a **state machine** with allowed transitions:

```text
   planning --plan_ready--> executing --all_done--> reviewing --approved--> done
                               |  ^                     |
                   step_failed |  | plan_ready          | rejected
                               v  |                     v
                            replanning <-----------------+
   any phase --fail--> failed
```

Rejecting transitions that are not allowed, reviewing before planning, for instance, catches controller bugs early, and the phase tells monitoring tools and people exactly where a run is.

### Termination

An agent must stop for one of a small number of reasons, checked by the controller after every step:

| Reason | Check |
|---|---|
| Done | The model gave a final answer, or the reviewer approved |
| Step limit | Steps taken reached the maximum |
| Token or cost budget | Tokens used reached the budget |
| Time limit | Wall-clock time reached the maximum |
| Repeated errors | Consecutive failures reached a threshold |
| Stuck | The same call repeated, as in Module 8.1 |

"Done" is checked first: a run that finished on its last allowed step finished, it did not hit a limit. Every stop reason is recorded, because "why did it stop?" is the first question about any run.

### Checkpoints and resumption

Long agent runs are interrupted: a server restarts, a deployment happens, a human approval takes a day. **Checkpointing** saves the state after each step so the run can resume where it stopped instead of starting over, repeating work and possibly repeating side effects. LangGraph's persistence documentation describes this as saving a checkpoint of the graph state at every step, which enables resumption, human-in-the-loop pauses, and inspection of past states. A checkpoint should carry a **version number**, so code that changed shape since the checkpoint was written refuses it clearly rather than misreading it, and should be validated when loaded.

### Complexity

A ReAct run makes one model call per step. Plan-and-execute makes one planning call, one call or tool run per step, and one call per replan. Reflection makes two calls per round. State transitions and termination checks are constant time; checkpoints are linear in the size of the state.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, the phase machine.

```python
import json

TRANSITIONS = {"planning": {"plan_ready": "executing", "fail": "failed"},
               "executing": {"step_done": "executing", "step_failed": "replanning", "all_done": "reviewing", "fail": "failed"},
               "replanning": {"plan_ready": "executing", "fail": "failed"},
               "reviewing": {"approved": "done", "rejected": "replanning", "fail": "failed"}}

def transition(state, event):
    if state not in TRANSITIONS:
        raise ValueError(f"{state} is final")
    if event not in TRANSITIONS[state]:
        raise ValueError(f"{event} not allowed in {state}")
    return TRANSITIONS[state][event]

phase = "planning"
for event in ["plan_ready", "step_done", "step_failed", "plan_ready", "all_done", "approved"]:
    phase = transition(phase, event)
    print(event, "->", phase)
```

- **The table lists every allowed transition.** Anything else raises an error.
- **Done and failed are final.** They have no entry in the table, so any event after them is refused.
- **A failed step leads to replanning, and a new plan back to executing.** That is the plan-and-execute recovery path.
- **Review can send the work back to replanning.** The reflection path at the level of the whole run.

Next, plan-and-execute with replanning.

```python
INVENTORY = {"HAM-1": 14, "CHI-6": 5}
TOOLS = {"stock": lambda sku: INVENTORY[sku],
         "supplier_stock": lambda sku: {"SAW-3": 40}[sku],
         "order": lambda sku, qty: f"PO-{sku}-{qty}"}

def execute_plan(plan, tools, replan, max_replans=2):
    results, log, replans, queue = {}, [], 0, list(plan)
    while queue:
        step = queue.pop(0)
        try:
            results[step["id"]] = tools[step["tool"]](**step["input"])
            log.append((step["id"], "ok"))
        except Exception as error:
            log.append((step["id"], "failed"))
            if replans >= max_replans:
                return {"status": "failed", "results": results, "log": log, "replans": replans}
            replans += 1
            queue = replan(step, str(error), results)
    return {"status": "done", "results": results, "log": log, "replans": replans}

PLAN = [{"id": "s1", "tool": "stock", "input": {"sku": "SAW-3"}},
        {"id": "s2", "tool": "order", "input": {"sku": "SAW-3", "qty": 10}}]

def replan(step, error, results):
    if step["tool"] == "stock":
        return [{"id": "s1b", "tool": "supplier_stock", "input": {"sku": step["input"]["sku"]}},
                {"id": "s2", "tool": "order", "input": {"sku": "SAW-3", "qty": 10}}]
    return []

print(execute_plan(PLAN, TOOLS, replan))
print(execute_plan(PLAN, TOOLS, lambda step, error, results: [step], max_replans=2))
```

- **Steps run in order, and each result is stored by step ID.** Later steps and the final answer can refer to earlier results.
- **The local stock lookup fails: SAW-3 is not in the shop's inventory.** The error is caught and logged, not raised.
- **The replanner receives the failed step, the error, and the results so far.** Here it switches to the supplier's stock and keeps the order step.
- **The revised plan succeeds: supplier stock 40, purchase order PO-SAW-3-10, after one replan.**
- **A replanner that keeps returning the same failing step is stopped after two replans.** The run ends "failed" with its log, instead of cycling forever.

Then, reflection.

```python
def reflect(draft, critic, revise, max_rounds=3):
    history = []
    for round_number in range(1, max_rounds + 1):
        problems = critic(draft)
        history.append((round_number, list(problems)))
        if not problems:
            return {"final": draft, "rounds": round_number, "accepted": True, "history": history}
        draft = revise(draft, problems)
    return {"final": draft, "rounds": max_rounds, "accepted": False, "history": history}

def critic(text):
    problems = []
    if len(text.split()) > 25:
        problems.append("too_long")
    if "guarantee" in text.lower():
        problems.append("no_guarantees")
    if "order" not in text.lower():
        problems.append("mention_order")
    return problems

def revise(text, problems):
    if "no_guarantees" in problems:
        text = text.replace("We guarantee it will arrive", "It should arrive")
    if "mention_order" in problems:
        text = "Your order A1234: " + text
    if "too_long" in problems:
        text = " ".join(text.split()[:25])
    return text

print(reflect("We guarantee it will arrive on Thursday.", critic, revise))
print(reflect("word " * 40, critic, lambda text, problems: text, max_rounds=2)["accepted"])
```

- **The critic returns a list of specific problems.** Here they are code checks: length, a forbidden promise, a required mention.
- **The reviser addresses each named problem.** In a real agent this is a model call given the draft and the critique; here it is code, so the loop can be tested.
- **The customer message is fixed in two rounds.** Round one finds two problems, the guarantee and the missing order reference; round two finds none.
- **A draft that cannot be fixed is not accepted.** After the maximum rounds the result says so, and the controller must not send it.

Finally, termination and checkpoints.

```python
def should_stop(state, limits):
    if state.get("done"):
        return "done"
    for key in ("steps", "tokens", "seconds"):
        if state[key] >= limits[key]:
            return f"limit:{key}"
    if state["consecutive_errors"] >= limits["consecutive_errors"]:
        return "errors"
    return None

LIMITS = {"steps": 10, "tokens": 50000, "seconds": 120, "consecutive_errors": 3}
print(should_stop({"done": False, "steps": 4, "tokens": 12000, "seconds": 30, "consecutive_errors": 0}, LIMITS),
      should_stop({"done": False, "steps": 10, "tokens": 60000, "seconds": 30, "consecutive_errors": 0}, LIMITS),
      should_stop({"done": False, "steps": 4, "tokens": 12000, "seconds": 30, "consecutive_errors": 3}, LIMITS),
      should_stop({"done": True, "steps": 10, "tokens": 0, "seconds": 0, "consecutive_errors": 9}, LIMITS))

VERSION = 2

def checkpoint(state):
    return json.dumps({"version": VERSION, "state": state}, sort_keys=True)

def resume(text):
    data = json.loads(text)
    if data.get("version") != VERSION:
        raise ValueError(f"checkpoint version {data.get('version')} is not {VERSION}")
    state = data["state"]
    for key in ("phase", "plan", "results", "steps"):
        if key not in state:
            raise ValueError("checkpoint missing " + key)
    return state

STATE = {"phase": "executing", "plan": [{"id": "s2", "tool": "order", "input": {"sku": "SAW-3", "qty": 10}}],
         "results": {"s1b": 40}, "steps": 3}
saved = checkpoint(STATE)
print(resume(saved) == STATE)
```

- **A run still in progress gets None: keep going.**
- **Done is checked first.** A run that finished on its last allowed step is "done", not stopped by a limit.
- **Limits are checked in a fixed order, and the first reached is the reason.** Steps at 10 come before tokens at 60,000 in the second example.
- **Three consecutive errors stop the run.** The controller resets this counter on each success, so occasional errors do not end a long run.
- **The checkpoint is JSON with a version.** Sorted keys make it stable, so identical states produce identical files.
- **Resuming checks the version and the required keys.** The restored state equals the saved one, and the run continues with step s2 instead of repeating the supplier lookup.

**Complexity.** `transition` and `should_stop` are constant. `execute_plan` runs each step once plus the replanned steps, bounded by the replan limit. `reflect` makes at most two calls per round. `checkpoint` and `resume` are linear in the state size.

### An architecture card for an agent

```text
AGENT          restock agent
PATTERN        plan-and-execute; reflection on the supplier email before sending
TOOLS          stock(sku), supplier_stock(sku), order(sku, qty)           order needs approval
PHASES         planning -> executing -> reviewing -> done | failed (replanning after a failed step or a rejection)
LIMITS         12 steps, 60,000 tokens, 5 minutes, 3 consecutive errors, 2 replans, 3 review rounds
CHECKPOINT     after every step; version 2; resume on restart or after approval
TRACE          every transition, tool call, result, critique, and stop reason
```

### Pattern trade-offs

| | ReAct | Plan-and-execute | Reflection |
|---|---|---|---|
| Model calls | One per step | Plan, steps, replans | Two per round |
| Visibility | Step by step | Whole plan up front | Each critique |
| Adapts to surprises | Every step | At replans | Not its purpose |
| Main risk | Wandering, loops | Bad plans, replan cycles | Critic and writer agreeing on errors |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Letting the model run the loop.** The model proposes; code enforces limits, phases, and approvals.

**Plans that are never validated.** A plan may name tools that do not exist or skip required steps. Check plans before executing them.

**Replanning forever.** A step that always fails produces an endless replan cycle. Cap replans.

**Critics that check nothing concrete.** "Is this good?" gets "yes". Give the critic specific criteria, and use code checks where possible.

**The same model criticising itself.** A writer and critic sharing a blind spot will both miss the same error. Use code checks, different prompts, or a different model for review.

**Hidden phases.** A loop without explicit phases is hard to monitor or resume. Name the phases.

**Limits that report as success.** A run stopped by its step limit must say so; reporting "done" hides failures.

**No checkpoints on long runs.** A restart halfway through repeats work and side effects. Save state after each step.

**Unversioned checkpoints.** Code changes; old checkpoints silently misread. Version them and validate on load.

**Over-architecting simple agents.** A ReAct loop with good tools beats an elaborate framework for most small tasks.

**One huge prompt doing every role.** Planning, executing, and reviewing with separate, focused prompts is easier to debug.

**No record of stop reasons.** "Why did it stop?" should be answerable from the log for every run.

## 5. Active Recall Check & Synthesis Summary

**Summary.** An agent architecture combines a model, instructions, tools, memory and state, and a controller written in ordinary code that runs the loop, enforces limits, and decides what actually executes. Three control patterns cover most agents: ReAct interleaves reasoning, actions, and observations step by step, adapting constantly but risking wandering; plan-and-execute has a planner produce steps, an executor run them, and a replanner revise the remaining steps after a failure, with a cap on replans and validation of plans; and reflection, Anthropic's evaluator-optimizer pattern and the idea behind Reflexion, critiques an output against concrete criteria and revises it for a limited number of rounds, flagging rather than sending anything not accepted. Patterns combine. Making phases explicit as a state machine, planning, executing, replanning, reviewing, done, and failed, catches controller errors and shows where a run is. Termination checks done first, then step, token, and time limits, then consecutive errors, with Module 8.1's stuck detection as a further check, and records the reason. Checkpoints save versioned, validated state after each step so runs can resume after restarts or human approvals without repeating work.

**Question 1.** For each task, choose ReAct, plan-and-execute, reflection, or a combination, and justify it: (a) diagnosing why a customer's payment failed, using the payment provider, order, and fraud-check tools; (b) creating a new product in the shop, the warehouse system, and the accounting system, and setting its price in each; (c) writing a product description that must be under 80 words, mention the material, and make no unverifiable claims.

<details>
<summary>View Answer</summary>

(a) ReAct: the next step depends on each finding. The payment provider might show a card decline, which leads to the decline code, or a successful charge that the order system missed, which leads to a webhook log, or a fraud hold, which leads to the fraud tool. The path cannot be planned in advance, and the loop adapts as evidence arrives, with step limits and stuck detection to stop wandering. (b) Plan-and-execute: the steps are known, create in each system and set each price, so a plan can be written up front, shown to a person, and executed, while the replanner handles failures, such as the warehouse rejecting a duplicate code, by revising the remaining steps; replans are capped so a persistent failure ends the run cleanly, and each creation should use an idempotency key so retries do not create duplicates. (c) Reflection: the criteria are concrete and checkable, word count, mention of the material, no unverifiable claims, so a generator writes a draft, a critic checks it, code for length and the required word, a model or a list of banned phrases for claims, and the reviser fixes the named problems, for at most a few rounds, with anything still failing flagged for a person.

</details>

**Question 2.** A plan-and-execute agent with a replan limit of 2 runs the plan "look up local stock for SAW-3, then order 10". The local lookup fails. The replanner returns the same plan again each time. Trace the run with `execute_plan`, then describe two better replanner behaviours.

<details>
<summary>View Answer</summary>

The first step fails, so the log records s1 as failed; replans is 0, below the limit, so it becomes 1 and the queue is set to the replanner's output, the same plan. The lookup fails again, s1 failed a second time, replans becomes 2. The third failure finds replans equal to the limit of 2, so the run returns status "failed" with no results and a log of three failures of s1, with 2 replans recorded. Without the limit it would loop forever. A better replanner uses the error and the results so far: here, the error says SAW-3 is not in local inventory, so it should switch to a different source, such as the supplier's stock, as the worked example's replanner does. A second improvement is to recognise that a plan has failed for a reason it cannot fix and return an empty plan or an explicit request for help, for example "SAW-3 is unknown to every stock source; ask a person to check the product code", which ends the run with a useful message instead of exhausting the replan budget. The controller can also refuse a replan identical to the plan that just failed.

</details>

**Question 3.** An agent run has these counters after its 10th step: done is true, steps 10, tokens 52,000, seconds 40, consecutive errors 0, with limits of 10 steps and 50,000 tokens. What should `should_stop` return, and why does the order of checks matter? Then explain what must be in a checkpoint for this run to be resumed after a restart, and why it needs a version.

<details>
<summary>View Answer</summary>

It returns "done", because done is checked first. Both the step limit and the token budget were reached on the same step that produced the final answer, but the run did finish: it should be reported as a success that used its whole budget, not as a run stopped by a limit. If limits were checked first, the run would be logged as "limit:steps" and its answer might be discarded or treated as incomplete, distorting the success rate. That the run reached both limits exactly as it finished is still worth noting, since slightly harder tasks would fail, which suggests reviewing the limits or the agent's efficiency. For resumption, the checkpoint must hold everything needed to continue without repeating work: the current phase, the remaining plan, the results so far by step, the counters for steps, tokens, time, and errors, and the history or a summary of it, plus any pending approval. It needs a version because the code that reads it can change between the save and the resume: a renamed field or a new required counter would otherwise be misread silently, so the loader checks the version and the required keys and refuses a checkpoint it cannot interpret correctly.

</details>

@@starter
"""
Lab: Phases, Plan-and-Execute with Replanning, Reflection, Termination, Checkpoints
Standard library only. No network calls. Complete the TODO in each step, then press "Run & Verify Step".
"""
import json

TRANSITIONS = {"planning": {"plan_ready": "executing", "fail": "failed"},
               "executing": {"step_done": "executing", "step_failed": "replanning", "all_done": "reviewing", "fail": "failed"},
               "replanning": {"plan_ready": "executing", "fail": "failed"},
               "reviewing": {"approved": "done", "rejected": "replanning", "fail": "failed"}}
INVENTORY = {"HAM-1": 14, "CHI-6": 5}
TOOLS = {"stock": lambda sku: INVENTORY[sku],
         "supplier_stock": lambda sku: {"SAW-3": 40}[sku],
         "order": lambda sku, qty: f"PO-{sku}-{qty}"}
VERSION = 2


# ---------------------------------------------------------------- Step 1
def transition(state, event):
    """ValueError("STATE is final") if state is not in TRANSITIONS; ValueError("EVENT not allowed in STATE") if the
    event is not allowed; otherwise return the next state."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def execute_plan(plan, tools, replan, max_replans=2):
    """Queue = copy of plan. Pop steps from the front; run tools[step["tool"]](**step["input"]): success -> store the
    result under step["id"] and log (id, "ok"); exception -> log (id, "failed"); if replans >= max_replans return
    {"status": "failed", "results", "log", "replans"}; else replans += 1 and queue = replan(step, str(error), results). When the queue is
    empty return {"status": "done", "results", "log", "replans"}."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def reflect(draft, critic, revise, max_rounds=3):
    """For rounds 1..max_rounds: problems = critic(draft); record (round, list(problems)); none -> return {"final": draft,
    "rounds": round, "accepted": True, "history"}; else draft = revise(draft, problems). After the last round return
    {"final": draft, "rounds": max_rounds, "accepted": False, "history"}."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def should_stop(state, limits):
    """"done" if state["done"]; else "limit:KEY" for the first of steps, tokens, seconds where state >= limit; else
    "errors" if consecutive_errors >= its limit; else None."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def checkpoint(state):
    """json.dumps({"version": VERSION, "state": state}, sort_keys=True)."""
    # TODO Step 5
    return None


def resume(text):
    """Parse; a version other than VERSION -> ValueError; any of phase, plan, results, steps missing from the state ->
    ValueError; return the state."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("transition:", transition("planning", "plan_ready"))
    print("stop      :", should_stop({"done": True, "steps": 1, "tokens": 1, "seconds": 1, "consecutive_errors": 0}, {"steps": 9, "tokens": 9, "seconds": 9, "consecutive_errors": 9}))

@@solution
"""
Lab solution: Phases, Plan-and-Execute with Replanning, Reflection, Termination, Checkpoints
Standard library only. No network calls.
"""
import json

TRANSITIONS = {"planning": {"plan_ready": "executing", "fail": "failed"},
               "executing": {"step_done": "executing", "step_failed": "replanning", "all_done": "reviewing", "fail": "failed"},
               "replanning": {"plan_ready": "executing", "fail": "failed"},
               "reviewing": {"approved": "done", "rejected": "replanning", "fail": "failed"}}
INVENTORY = {"HAM-1": 14, "CHI-6": 5}
TOOLS = {"stock": lambda sku: INVENTORY[sku],
         "supplier_stock": lambda sku: {"SAW-3": 40}[sku],
         "order": lambda sku, qty: f"PO-{sku}-{qty}"}
VERSION = 2


# ---------------------------------------------------------------- Step 1
def transition(state, event):
    """Explicit phases: anything not in the table is a controller bug, caught at once."""
    if state not in TRANSITIONS:
        raise ValueError(f"{state} is final")
    if event not in TRANSITIONS[state]:
        raise ValueError(f"{event} not allowed in {state}")
    return TRANSITIONS[state][event]


# ---------------------------------------------------------------- Step 2
def execute_plan(plan, tools, replan, max_replans=2):
    """Run the plan; on failure ask the replanner for new remaining steps, at most max_replans times."""
    results, log, replans, queue = {}, [], 0, list(plan)
    while queue:
        step = queue.pop(0)
        try:
            results[step["id"]] = tools[step["tool"]](**step["input"])
            log.append((step["id"], "ok"))
        except Exception as error:
            log.append((step["id"], "failed"))
            if replans >= max_replans:
                return {"status": "failed", "results": results, "log": log, "replans": replans}
            replans += 1
            queue = replan(step, str(error), results)
    return {"status": "done", "results": results, "log": log, "replans": replans}


# ---------------------------------------------------------------- Step 3
def reflect(draft, critic, revise, max_rounds=3):
    """Critique with concrete checks, revise, and never pretend an unfixed draft was accepted."""
    history = []
    for round_number in range(1, max_rounds + 1):
        problems = critic(draft)
        history.append((round_number, list(problems)))
        if not problems:
            return {"final": draft, "rounds": round_number, "accepted": True, "history": history}
        draft = revise(draft, problems)
    return {"final": draft, "rounds": max_rounds, "accepted": False, "history": history}


# ---------------------------------------------------------------- Step 4
def should_stop(state, limits):
    """Done first, then limits in a fixed order, then repeated errors."""
    if state.get("done"):
        return "done"
    for key in ("steps", "tokens", "seconds"):
        if state[key] >= limits[key]:
            return f"limit:{key}"
    if state["consecutive_errors"] >= limits["consecutive_errors"]:
        return "errors"
    return None


# ---------------------------------------------------------------- Step 5
def checkpoint(state):
    """Versioned, stable JSON, saved after every step."""
    return json.dumps({"version": VERSION, "state": state}, sort_keys=True)


def resume(text):
    """Refuse what cannot be read correctly, rather than misreading it."""
    data = json.loads(text)
    if data.get("version") != VERSION:
        raise ValueError(f"checkpoint version {data.get('version')} is not {VERSION}")
    state = data["state"]
    for key in ("phase", "plan", "results", "steps"):
        if key not in state:
            raise ValueError("checkpoint missing " + key)
    return state


if __name__ == "__main__":
    plan = [{"id": "s1", "tool": "stock", "input": {"sku": "SAW-3"}}, {"id": "s2", "tool": "order", "input": {"sku": "SAW-3", "qty": 10}}]
    def replan(step, error, results):
        return [{"id": "s1b", "tool": "supplier_stock", "input": {"sku": "SAW-3"}}, {"id": "s2", "tool": "order", "input": {"sku": "SAW-3", "qty": 10}}]
    print(execute_plan(plan, TOOLS, replan))
    print(execute_plan(plan, TOOLS, lambda step, error, results: [step]))
    limits = {"steps": 10, "tokens": 50000, "seconds": 120, "consecutive_errors": 3}
    print(should_stop({"done": True, "steps": 10, "tokens": 52000, "seconds": 40, "consecutive_errors": 0}, limits))
    state = {"phase": "executing", "plan": plan[1:], "results": {"s1b": 40}, "steps": 3}
    print(resume(checkpoint(state)) == state)

@@step
{
  "stepNumber": 1,
  "title": "Enforce the agent's phases",
  "instruction": "Implement transition(state, event). If the state has no entry in TRANSITIONS, raise ValueError saying it is final. If the event is not allowed in that state, raise ValueError saying so. Otherwise return the next state. Walk a run through planning, executing, a failed step, replanning, review, and done, and try some forbidden transitions. This is the phase machine from Section 2. [MOD-8.2]",
  "hintConceptual": "A project board with columns and rules about which cards may move where: from planning to doing, from doing back to replanning when something breaks, and nothing out of the finished column.",
  "hintSyntax": "if state not in TRANSITIONS:\n    raise ValueError(f\"{state} is final\")\nif event not in TRANSITIONS[state]:\n    raise ValueError(f\"{event} not allowed in {state}\")\nreturn TRANSITIONS[state][event]"
}
@@assert
_phase = "planning"
_path = []
for _event in ["plan_ready", "step_done", "step_failed", "plan_ready", "all_done", "rejected", "plan_ready", "all_done", "approved"]:
    _phase = transition(_phase, _event)
    _path.append(_phase)
assert _path == ["executing", "executing", "replanning", "executing", "reviewing", "replanning", "executing", "reviewing", "done"], f"A full run, got {_path}"
for _state, _event in [("planning", "approved"), ("reviewing", "step_done"), ("done", "plan_ready"), ("failed", "plan_ready")]:
    try:
        transition(_state, _event)
        raise AssertionError(f"{_state} + {_event} must raise ValueError")
    except ValueError:
        pass
assert transition("executing", "fail") == "failed", "Any working phase can fail"
print("Step 1 passed: the run moves through every phase, and forbidden moves are refused.")

@@step
{
  "stepNumber": 2,
  "title": "Execute a plan with replanning",
  "instruction": "Implement execute_plan(plan, tools, replan, max_replans). Work through a copy of the plan from the front. Run each step's tool with its input; on success store the result under the step's ID and log the ID with 'ok'. On an exception, log the ID with 'failed'; if the replans already equal the maximum, return status 'failed' with the results, log, and replans; otherwise count a replan and replace the queue with replan(step, error message, results). When the queue is empty return status 'done'. Run the restock plan with a sensible replanner and a useless one. This is plan-and-execute from Section 2. [MOD-8.2]",
  "hintConceptual": "Work down the to-do list; when an item fails, hand the list back to the planner with what went wrong and what you have so far, and accept a new list, but only a couple of times before giving up.",
  "hintSyntax": "results, log, replans, queue = {}, [], 0, list(plan)\nwhile queue:\n    step = queue.pop(0)\n    try:\n        results[step[\"id\"]] = tools[step[\"tool\"]](**step[\"input\"])\n        log.append((step[\"id\"], \"ok\"))\n    except Exception as error:\n        log.append((step[\"id\"], \"failed\"))\n        if replans >= max_replans:\n            return {\"status\": \"failed\", \"results\": results, \"log\": log, \"replans\": replans}\n        replans += 1\n        queue = replan(step, str(error), results)\nreturn {\"status\": \"done\", \"results\": results, \"log\": log, \"replans\": replans}"
}
@@assert
_plan = [{"id": "s1", "tool": "stock", "input": {"sku": "SAW-3"}}, {"id": "s2", "tool": "order", "input": {"sku": "SAW-3", "qty": 10}}]
_calls = []
def _replan(step, error, results):
    _calls.append((step["id"], error, dict(results)))
    return [{"id": "s1b", "tool": "supplier_stock", "input": {"sku": "SAW-3"}}, {"id": "s2", "tool": "order", "input": {"sku": "SAW-3", "qty": 10}}]
_ok = execute_plan(_plan, TOOLS, _replan)
assert _ok == {"status": "done", "results": {"s1b": 40, "s2": "PO-SAW-3-10"}, "log": [("s1", "failed"), ("s1b", "ok"), ("s2", "ok")], "replans": 1}, f"One replan rescues the run, got {_ok}"
assert _calls == [("s1", "'SAW-3'", {})], "The replanner gets the step, the error, and the results so far"
_bad = execute_plan(_plan, TOOLS, lambda step, error, results: [step])
assert _bad == {"status": "failed", "results": {}, "log": [("s1", "failed")] * 3, "replans": 2}, "A useless replanner is stopped after two replans"
assert execute_plan([{"id": "a", "tool": "stock", "input": {"sku": "HAM-1"}}], TOOLS, _replan)["results"] == {"a": 14} and _plan[0]["id"] == "s1", "A clean plan needs no replan; the plan itself is not modified"
assert execute_plan(_plan, TOOLS, lambda step, error, results: [])["status"] == "done", "A replanner may decide nothing more is needed"
print("Step 2 passed: the local lookup fails, the supplier is checked instead, and the order is placed.")

@@step
{
  "stepNumber": 3,
  "title": "Critique and revise",
  "instruction": "Implement reflect(draft, critic, revise, max_rounds). For each round from 1, ask the critic for problems and record the round and a copy of the problems. With no problems, return the draft, the round, accepted True, and the history. Otherwise replace the draft with revise(draft, problems). After the last round return the draft, max_rounds, accepted False, and the history. Fix a customer message and try a draft that never improves. This is reflection from Section 2. [MOD-8.2]",
  "hintConceptual": "An editor marks specific problems in the margin, the writer fixes exactly those, and they go round again, but after a few rounds an unfixed piece is flagged, not printed.",
  "hintSyntax": "history = []\nfor round_number in range(1, max_rounds + 1):\n    problems = critic(draft)\n    history.append((round_number, list(problems)))\n    if not problems:\n        return {\"final\": draft, \"rounds\": round_number, \"accepted\": True, \"history\": history}\n    draft = revise(draft, problems)\nreturn {\"final\": draft, \"rounds\": max_rounds, \"accepted\": False, \"history\": history}"
}
@@assert
def _critic(text):
    problems = []
    if len(text.split()) > 25:
        problems.append("too_long")
    if "guarantee" in text.lower():
        problems.append("no_guarantees")
    if "order" not in text.lower():
        problems.append("mention_order")
    return problems
def _revise(text, problems):
    if "no_guarantees" in problems:
        text = text.replace("We guarantee it will arrive", "It should arrive")
    if "mention_order" in problems:
        text = "Your order A1234: " + text
    return text
_r = reflect("We guarantee it will arrive on Thursday.", _critic, _revise)
assert _r == {"final": "Your order A1234: It should arrive on Thursday.", "rounds": 2, "accepted": True, "history": [(1, ["no_guarantees", "mention_order"]), (2, [])]}, f"Fixed in two rounds, got {_r}"
_stuck = reflect("word " * 40, _critic, lambda text, problems: text, max_rounds=2)
assert _stuck["accepted"] is False and _stuck["rounds"] == 2 and len(_stuck["history"]) == 2, "An unfixable draft is not accepted"
assert reflect("Your order is ready.", _critic, _revise) == {"final": "Your order is ready.", "rounds": 1, "accepted": True, "history": [(1, [])]}, "A good first draft is accepted at once"
print("Step 3 passed: the guarantee is removed and the order mentioned in two rounds.")

@@step
{
  "stepNumber": 4,
  "title": "Decide when to stop",
  "instruction": "Implement should_stop(state, limits). Return 'done' if the state is done. Otherwise return 'limit:' and the key for the first of steps, tokens, and seconds where the state has reached its limit. Otherwise return 'errors' if consecutive errors have reached their limit. Otherwise return None. Check a running agent, an exhausted one, an erroring one, and one that finished on its last step. This is termination from Section 2. [MOD-8.2]",
  "hintConceptual": "The manager's end-of-day check: did they finish? If not, are they out of hours, out of budget, out of time, or failing over and over? If none of those, carry on.",
  "hintSyntax": "if state.get(\"done\"):\n    return \"done\"\nfor key in (\"steps\", \"tokens\", \"seconds\"):\n    if state[key] >= limits[key]:\n        return f\"limit:{key}\"\nif state[\"consecutive_errors\"] >= limits[\"consecutive_errors\"]:\n    return \"errors\"\nreturn None"
}
@@assert
_limits = {"steps": 10, "tokens": 50000, "seconds": 120, "consecutive_errors": 3}
_running = {"done": False, "steps": 4, "tokens": 12000, "seconds": 30, "consecutive_errors": 0}
assert should_stop(_running, _limits) is None, f"A running agent continues, got {should_stop(_running, _limits)}"
assert should_stop({**_running, "steps": 10, "tokens": 60000}, _limits) == "limit:steps" and should_stop({**_running, "tokens": 50000}, _limits) == "limit:tokens", "The first limit reached is the reason"
assert should_stop({**_running, "seconds": 121}, _limits) == "limit:seconds" and should_stop({**_running, "consecutive_errors": 3}, _limits) == "errors", "Time and repeated errors"
assert should_stop({"done": True, "steps": 10, "tokens": 52000, "seconds": 40, "consecutive_errors": 0}, _limits) == "done", "The third recall question: done is checked first"
print("Step 4 passed: done first, then steps, tokens, time, and repeated errors.")

@@step
{
  "stepNumber": 5,
  "title": "Checkpoint and resume",
  "instruction": "Implement checkpoint(state), which returns json.dumps of a dict with the VERSION and the state, with sorted keys. Then implement resume(text): parse it, raise ValueError if the version is not VERSION, raise ValueError if the state lacks any of phase, plan, results, or steps, and return the state. Save and restore a paused restock run, and reject an old or incomplete checkpoint. This is checkpointing from Section 2. [MOD-8.2]",
  "hintConceptual": "Before leaving for the night, write the project file with the date of the template you used; in the morning, check it is the current template and nothing is missing before carrying on from where you stopped.",
  "hintSyntax": "return json.dumps({\"version\": VERSION, \"state\": state}, sort_keys=True)\n\n# resume\ndata = json.loads(text)\nif data.get(\"version\") != VERSION:\n    raise ValueError(f\"checkpoint version {data.get('version')} is not {VERSION}\")\nstate = data[\"state\"]\nfor key in (\"phase\", \"plan\", \"results\", \"steps\"):\n    if key not in state:\n        raise ValueError(\"checkpoint missing \" + key)\nreturn state"
}
@@assert
_state = {"phase": "executing", "plan": [{"id": "s2", "tool": "order", "input": {"sku": "SAW-3", "qty": 10}}], "results": {"s1b": 40}, "steps": 3}
_saved = checkpoint(_state)
assert _saved is not None and json.loads(_saved) == {"version": 2, "state": _state}, f"A versioned checkpoint, got {_saved}"
assert _saved == checkpoint({"steps": 3, "results": {"s1b": 40}, "plan": _state["plan"], "phase": "executing"}), "Sorted keys make identical states identical text"
assert resume(_saved) == _state, "Resuming restores the state"
for _text in (json.dumps({"version": 1, "state": _state}), json.dumps({"version": 2, "state": {"phase": "executing", "plan": [], "results": {}}})):
    try:
        resume(_text)
        raise AssertionError("An old or incomplete checkpoint must raise ValueError")
    except ValueError:
        pass
print("Step 5 passed: the paused run resumes at step s2, and stale checkpoints are refused.")
