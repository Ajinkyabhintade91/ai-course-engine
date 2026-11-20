@@meta
{
  "moduleId": "MOD-8.9",
  "slug": "mod-8-9",
  "unitId": "UNIT-8",
  "unitTitle": "Unit 8: Build Your Own AI Agents",
  "title": "Multi-Agent Systems",
  "difficulty": "Advanced",
  "estimatedMinutes": 105,
  "citations": [
    { "title": "How we built our multi-agent research system", "source": "Anthropic Engineering", "url": "https://www.anthropic.com/engineering/multi-agent-research-system" },
    { "title": "Don't Build Multi-Agents", "source": "Cognition", "url": "https://cognition.ai/blog/dont-build-multi-agents" },
    { "title": "Why Do Multi-Agent LLM Systems Fail?", "source": "arXiv (Cemri et al., 2025)", "url": "https://arxiv.org/abs/2503.13657" },
    { "title": "Improving Factuality and Reasoning in Language Models through Multiagent Debate", "source": "arXiv (Du et al., 2023)", "url": "https://arxiv.org/abs/2305.14325" },
    { "title": "Self-Consistency Improves Chain of Thought Reasoning in Language Models", "source": "arXiv (Wang et al., 2022)", "url": "https://arxiv.org/abs/2203.11171" }
  ],
  "videoLibrary": [
    {
      "id": "VID-8.9-1",
      "title": "Multi Agent Systems Explained: How AI Agents & LLMs Work Together",
      "creator": "IBM Technology",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=sWH0T4Zez6I",
      "timingInstruction": "Watch after Section 1, before the topologies in Section 2",
      "keyTakeaway": "What makes a system multi-agent, and the coordination structures agents can work in."
    },
    {
      "id": "VID-8.9-2",
      "title": "Why You Shouldn't Use Multi-Agent Architectures",
      "creator": "Dan Cleary",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=KlgqUqBvT5o",
      "timingInstruction": "Watch after the failure modes part of Section 2, before Step 3 of the lab",
      "keyTakeaway": "The case for a single agent: shared context and the conflicting decisions that split context causes."
    },
    {
      "id": "VID-8.9-3",
      "title": "Debating AI Agents: How LLMs Work Together to Solve Complex Problems",
      "creator": "Don Woodlock",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=fDG2Qj7jEqw",
      "timingInstruction": "Watch after the debate part of Section 2, before Step 4 of the lab",
      "keyTakeaway": "How several agents critiquing each other's answers can improve reasoning, and where it falls short."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Parallel Schedules, Token Budgets, Merging, Voting and Debate, Topology",
    "context": "The tool shop wants a research assistant that compares competitors' products, and the team is arguing about whether to build one agent or a team of them. You will compute how much parallel workers actually save in time, what they cost in tokens, how an orchestrator merges conflicting findings, how voting and debate behave, and which topology fits which task.",
    "language": "python"
  }
}

@@reading
# Multi-Agent Systems

A **multi-agent system** splits work across several language model agents, each with its own context, instructions, and tools, coordinated by code or by another agent. Module 8.1 asked whether a task needs an agent at all. This chapter asks the next question: when an agent is right, should it be one agent or several? The honest answer from practitioners is "usually one", with specific, measurable exceptions. This chapter explains why multiple agents can help, the common ways of arranging them, what they cost, how they fail, and how to decide.

## 1. First-Principles Mental Model & Intuition

### A newsroom

A newspaper covering an election does not send one reporter to every polling station. An editor splits the story: one reporter per region, each working independently, each filing a short report. The editor then merges the reports, resolves contradictions, and writes the lead. This works because the regions are **independent**: what happens in one barely affects reporting in another, and the editor only needs each region's summary, not every interview.

Now imagine the same newsroom writing a single feature article, with five writers each drafting a paragraph without reading the others. The paragraphs contradict each other, repeat facts, and change tone. The work was not independent: every paragraph depended on decisions made in the others. One good writer would have done better.

That is the whole chapter in two scenes. Multiple agents help when work divides into independent parts whose results can be summarised. They hurt when the parts are coupled, because each agent makes decisions the others cannot see.

```text
   ORCHESTRATOR-WORKER                 PIPELINE                         DEBATE / VOTE
   lead agent: plan, split             stage A -> stage B -> stage C    agent 1 --\
     |        |        |               (draft)   (check)   (format)     agent 2 ---+--> compare, critique,
   worker1 worker2 worker3                                              agent 3 --/    vote or converge
     |        |        |
   summaries back to the lead -> merge, resolve conflicts -> answer
```

### Three reasons to split

| Reason | Mechanism | Example |
|---|---|---|
| Context isolation | Each worker explores in its own context window and returns a short summary, so the lead's context stays clean | A researcher reading 40 web pages returns 300 words |
| Specialisation | Different instructions, tools, or models per role | A code reviewer with read-only tools; a writer with none |
| Parallelism | Independent subtasks run at the same time | Five competitors researched simultaneously |

Each reason has a cost: more tokens, more latency in coordination, and new ways for information to get lost between agents.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Evidence that it can work

Anthropic's engineering write-up on its multi-agent research system reported that a lead agent using Claude Opus 4, delegating to Claude Sonnet 4 subagents, outperformed a single Claude Opus 4 agent by 90.2 percent on their internal research evaluation. The same analysis found that token usage by itself explained 80 percent of the variance in performance on their browsing evaluation, with the number of tool calls and model choice as the other factors. In other words, much of the gain came from **spending more tokens**, spread across parallel contexts that a single agent's window could not hold. They also reported that agents typically use about 4 times more tokens than chat interactions, and multi-agent systems about 15 times more, and that parallelism cut research time by up to 90 percent for complex queries.

The lesson is precise: multi-agent systems are a way to spend more compute on problems that are **broad**, many independent directions to explore, and **valuable** enough to pay for it.

### Evidence that it often does not

Cognition's essay "Don't Build Multi-Agents" makes the opposite case for tasks such as coding, with two principles: share context, meaning full agent traces rather than individual messages, and recognise that **actions carry implicit decisions, and conflicting decisions carry bad results**. Two subagents building parts of the same feature will each make unstated choices, a naming convention, a library, a visual style, that clash when combined.

A systematic study, "Why Do Multi-Agent LLM Systems Fail?" by Cemri and colleagues, annotated over 1,600 traces from seven multi-agent frameworks and found that performance gains on popular benchmarks are often minimal. Their taxonomy, MAST, identifies 14 failure modes in three categories: **system design issues**, such as ignoring role specifications or failing to recognise when the task is complete; **inter-agent misalignment**, such as withholding information, ignoring other agents' input, or derailing from the task; and **task verification**, such as stopping early or verifying incorrectly.

### Topologies

**Orchestrator-worker.** A lead agent plans, splits the task into subtasks, writes a brief for each worker, runs them, often in parallel, and merges the results. Anthropic's write-up describes scaling effort to the query: simple fact-finding with one agent and 3 to 10 tool calls, direct comparisons with 2 to 4 subagents, and complex research with more than 10. Each brief needs an objective, an output format, guidance on tools and sources, and clear boundaries, or workers duplicate each other and leave gaps.

**Pipeline.** Fixed stages in order, each a specialised agent or call: draft, fact-check, format. This is close to Module 8.10's prompt chaining; it becomes "multi-agent" when stages are agents with their own tools and loops. Pipelines are easy to test stage by stage and fail at the handoffs.

**Debate and voting.** Several agents answer the same question independently. **Voting**, also called self-consistency after Wang and colleagues' work on sampling several reasoning paths and taking the majority answer, picks the most common answer. **Debate**, studied by Du and colleagues, lets agents read each other's answers and revise over several rounds, which improved factuality and reasoning in their experiments. Both need a question with a comparable answer, and both can converge on a confident wrong answer if the majority starts wrong.

### Time: what parallelism really saves

With $n$ independent subtasks of durations $t_1, \dots, t_n$, a single agent needs $T_1 = \sum_i t_i$. With $w$ workers and coordination overhead $o$, for planning and merging:

$$T_w \;\ge\; o + \max\!\left(\max_i t_i,\; \frac{\sum_i t_i}{w}\right)$$

The longest subtask is a floor no number of workers can beat, and overhead is paid once. A common scheduling heuristic, **longest processing time first**, assigns the longest remaining task to the least-loaded worker and comes close to the bound. In the lab, six research subtasks totalling 170 minutes take 80 minutes with three workers and 20 minutes of overhead, and 70 with six workers: the 50-minute competitor analysis sets the floor.

### Tokens: what it costs

Total tokens are the lead's tokens, plus each worker's, plus the handoffs: briefs out and summaries back:

$$N_{\text{team}} = N_{\text{lead}} + \sum_{j=1}^{w} N_j + w \cdot N_{\text{handoff}}$$

A lead using 30,000 tokens with five workers at 40,000 each and 2,000-token handoffs uses 240,000 tokens: 4 times a 60,000-token single-agent run. Whether that is worth it is the value question of Module 8.1: worth it for a research report that saves an analyst a day, not for answering "what is our returns window?"

### Merging and conflicts

The orchestrator's hardest job is merging. Workers return claims; some agree, some are new, some contradict. A merge step should keep the first value of each claim, record which workers support it, and **surface conflicts rather than silently picking one**. Conflicts are either real disagreements in the sources, which the answer should report, or errors, which need a check against a primary source. A merge that silently keeps the first value hides exactly the inter-agent misalignment MAST describes.

### Debate dynamics

In a simple synchronous debate, each agent, each round, adopts the majority answer of the other agents if a strict majority of them disagrees with it, and otherwise keeps its own. Four behaviours follow, and the lab reproduces each:

| Starting answers | Outcome | Lesson |
|---|---|---|
| Majority correct | All converge to the correct answer | Debate spreads a correct majority |
| Majority wrong | All converge to the wrong answer | Debate is conformity, not verification |
| Split evenly | Agents swap answers each round and never settle | Synchronous updates can oscillate |
| All different | Nobody moves | No majority, no signal |

Real debates use language, not just answers, so a well-argued minority can persuade, which is the point of Du and colleagues' method. But the structural risk remains: agreement is not evidence of correctness unless the agents had independent evidence. A verifier with a tool, running the code or checking the source, beats another voter.

### When a single agent wins

| Signal | Prefer |
|---|---|
| Subtasks share and modify state: one codebase, one document | Single agent, full context |
| Subtasks are independent and broad, results summarise well | Orchestrator-worker |
| Fixed sequence of distinct skills | Pipeline |
| One verifiable answer, high uncertainty, cheap to sample | Vote, or debate with a verifier |
| Low value per task | Single agent or a workflow |

### Complexity

Longest-processing-time scheduling is $O(n \log n + n w)$. Token totals are linear in workers. Merging is linear in total claims. Each debate round is $O(a^2)$ for $a$ agents comparing with all others.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, the time saved by parallel workers.

```python
from collections import Counter

def makespan(durations, workers, overhead=0):
    loads = [0] * workers
    assignment = [[] for _ in range(workers)]
    for name, duration in sorted(durations.items(), key=lambda pair: (-pair[1], pair[0])):
        worker = min(range(workers), key=lambda w: (loads[w], w))
        loads[worker] += duration
        assignment[worker].append(name)
    return max(loads) + overhead, assignment

SUBTASKS = {"pricing": 40, "reviews": 30, "specs": 25, "competitors": 50, "stock": 10, "warranty": 15}
print(makespan(SUBTASKS, 1))
print(makespan(SUBTASKS, 3, overhead=20))
print(makespan(SUBTASKS, 6, overhead=20))
```

- **Tasks go longest first, each to the least-loaded worker.** Ties between workers go to the lowest index, so the result is deterministic.
- **One worker takes 170 minutes, the sum.** That is the single-agent baseline.
- **Three workers take 80 minutes with 20 of overhead.** Loads of 60, 55, and 55, so a 2.1 times speedup, not 3.
- **Six workers take 70 minutes.** The 50-minute competitor analysis is the floor; doubling the workers saved 10 minutes and doubled the handoffs.

Next, the token bill.

```python
def team_tokens(lead, workers, handoff):
    return lead + sum(workers) + handoff * len(workers)

def multiplier(total, baseline):
    return round(total / baseline, 1)

total = team_tokens(30_000, [40_000] * 5, 2_000)
print(total, multiplier(total, 60_000), multiplier(total, 4_000))
```

- **Five workers cost 240,000 tokens.** The workers' own exploration dominates; handoffs add 10,000.
- **That is 4.0 times a 60,000-token single agent, and 60.0 times a 4,000-token chat answer.** Compare these with the ratios Anthropic reported, about 4 times for agents over chat and 15 times for multi-agent systems.
- **The multiplier is the number to put next to the value of the task.**

Then, merging workers' findings.

```python
def merge(results):
    merged, sources, conflicts = {}, {}, []
    for result in results:
        for key, value in result["claims"].items():
            if key not in merged:
                merged[key], sources[key] = value, [result["worker"]]
            elif merged[key] == value:
                sources[key].append(result["worker"])
            else:
                conflicts.append((key, merged[key], value, sources[key][0], result["worker"]))
    return merged, sources, conflicts

RESULTS = [{"worker": "w1", "claims": {"price_saw3": "GBP 89", "warranty": "2 years"}},
           {"worker": "w2", "claims": {"price_saw3": "GBP 79", "stock": "in stock"}},
           {"worker": "w3", "claims": {"warranty": "2 years", "weight": "3.1 kg"}}]
print(merge(RESULTS))
```

- **New claims are added with their source.** Stock from w2, weight from w3.
- **Agreement is recorded.** The 2-year warranty is supported by w1 and w3.
- **Disagreement is surfaced, not resolved silently.** w1 says GBP 89 and w2 says GBP 79 for SAW-3; the orchestrator must check a primary source or report both, perhaps one is a sale price.

Then, voting and debate.

```python
def vote(answers):
    counts = Counter(answers).most_common()
    if not counts:
        return None, 0.0
    if len(counts) > 1 and counts[0][1] == counts[1][1]:
        return None, round(counts[0][1] / len(answers), 3)
    return counts[0][0], round(counts[0][1] / len(answers), 3)

def debate(answers, rounds=2):
    current, history = list(answers), [list(answers)]
    for _ in range(rounds):
        updated = []
        for i, own in enumerate(current):
            top, share = vote(current[:i] + current[i + 1:])
            updated.append(top if top is not None and top != own and share > 0.5 else own)
        history.append(updated)
        if updated == current:
            break
        current = updated
    return current, history

print(vote(["42", "42", "41"]))
print(debate(["42", "41", "42", "40", "42"]))
print(debate(["41", "41", "42", "40", "41"]))
print(debate(["a", "a", "b", "b"]))
```

- **A vote returns the majority answer and its share, or no winner on a tie.** Two of three say 42: 0.667.
- **Each agent compares only with the others.** It switches when a strict majority of the others agree on a different answer.
- **A correct majority spreads.** Three agents say 42, and after one round all five do.
- **A wrong majority spreads just as well.** If 42 is correct, the second debate converges on 41: consensus, not truth.
- **An even split oscillates.** Each agent sees the opposite answer as the majority of the others and switches, so after two rounds the answers are back where they started.

Finally, choosing a topology.

```python
def topology(task):
    if task["shared_writes"]:
        return "single_agent", "workers would make conflicting decisions on shared state"
    if task["independent_subtasks"] >= 2 and task["high_value"]:
        return "orchestrator_worker", f"{task['independent_subtasks']} independent subtasks can run in parallel"
    if task["fixed_stages"]:
        return "pipeline", "the stages are known and run in order"
    if task["verifiable_answer"] and task["high_value"]:
        return "vote", "independent answers to one question can be compared"
    return "single_agent", "no structure that more agents would exploit"

BASE = {"shared_writes": False, "independent_subtasks": 0, "high_value": True, "fixed_stages": False, "verifiable_answer": False}
print(topology({**BASE, "independent_subtasks": 5}))
print(topology({**BASE, "independent_subtasks": 5, "shared_writes": True}))
print(topology({**BASE, "independent_subtasks": 5, "high_value": False, "fixed_stages": True}))
```

- **Shared writes come first.** Cognition's principle: coupled work belongs in one context, however parallel it looks.
- **Independent, valuable subtasks justify an orchestrator.** The research comparison qualifies.
- **Known, ordered stages make a pipeline.** Even without enough value for parallel workers.
- **A verifiable single answer can be sampled several times and voted.** Only if the value pays for the samples.
- **Everything else is one agent.** The default.

**Complexity.** `makespan` sorts the tasks and scans the workers for each, $O(n \log n + n w)$. `team_tokens` is linear in workers. `merge` is linear in claims. Each `debate` round votes for every agent over the others, $O(a^2)$. `topology` is constant.

### A multi-agent design review

```text
TASK         competitor comparison report, 6 independent research subtasks (pricing, reviews, specs, competitors, stock, warranty), weekly
TOPOLOGY     orchestrator-worker: 5 workers for the 6 subtasks (independent, summarise well)
BRIEF        objective, aspects to cover, output as JSON claims with source URLs, tools: web search and fetch only,
             boundary: one subtask, no recommendations
MERGE        claims keyed by competitor and aspect; conflicts listed with both sources; lead checks primary page
TIME         single agent ~170 min; 5 workers + 20 min overhead ~70 min
TOKENS       ~240K per report, 4x a single agent; acceptable for a weekly report replacing half a day of analyst work
FAILURE PLAN worker timeout -> lead reports the gap; empty or unsourced claims rejected; traces kept per worker
NOT USED FOR the website copy rewrite (shared document: single agent)
```

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Splitting coupled work.** Parallel agents editing one codebase make clashing decisions. Keep coupled work in one context.

**Vague briefs.** "Research the competitors" sent to three workers produces three overlapping reports. Give each an objective, a format, tools, and a boundary.

**Merging by overwriting.** Keeping the last worker's value hides disagreements. Surface conflicts with their sources.

**Counting agreement as evidence.** Agents sharing one model and one prompt share biases. Verify with tools, not more votes.

**Paying 15 times for a simple question.** Multi-agent research for a one-fact lookup wastes money and time. Scale effort to the query.

**Ignoring the longest subtask.** Adding workers cannot beat the slowest piece. Split it further or accept the floor.

**Lost information at handoffs.** Summaries drop details the lead later needs. Ask workers for structured output with sources, and keep their full traces for debugging.

**Workers that never stop.** A worker loop without limits burns the budget. Apply Module 8.2's stop conditions to every worker.

**No per-agent observability.** When the report is wrong, you need to know which worker went wrong. Trace each agent separately, Module 8.13.

**Debating without a verifier.** Rounds of debate can converge on a wrong answer. Add a tool-backed check.

**Framework first, problem second.** Multi-agent frameworks make teams easy to create. Start with one agent and split only where measurements show a gain.

**Synchronous loops that oscillate.** Agents updating simultaneously on each other's answers can swap forever. Cap rounds and detect cycles.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A multi-agent system divides work among agents with their own contexts, instructions, and tools. Splitting helps through context isolation, specialisation, and parallelism, and costs tokens, coordination time, and lost information at handoffs. Anthropic reported a lead-and-subagents research system outperforming a single agent by 90.2 percent on its internal evaluation, with token usage explaining 80 percent of performance variance on a browsing evaluation and multi-agent systems using about 15 times the tokens of chat: more compute, spread across contexts, for broad and valuable tasks. Cognition's principles warn that agents must share context because actions carry implicit decisions, and the MAST study of over 1,600 traces catalogued 14 failure modes in system design, inter-agent misalignment, and task verification. The main topologies are orchestrator-worker, pipeline, and debate or voting. Parallel time is bounded below by the longest subtask plus overhead; team tokens are the lead's, the workers', and the handoffs'. Merging must record support and surface conflicts. Voting and debate amplify whatever the majority believes, correct or not, and synchronous debate can oscillate, so pair them with verification. Choose a single agent for coupled work or low value, orchestrator-worker for independent broad work, a pipeline for fixed stages, and voting for one verifiable answer worth sampling.

**Question 1.** A team splits a feature into "backend API" and "frontend form", gives each to a separate agent in parallel, and merges the results. Both parts work in isolation but fail together: field names differ and the date formats disagree. Explain this using the chapter's concepts, show what the lab's `topology` function says, and propose a better design.

<details>
<summary>View Answer</summary>

The two parts are coupled: the form's fields and formats must match the API's, so every choice one agent made, a field called `postcode` or `zip`, dates as ISO strings or day-month-year, was an implicit decision the other could not see. This is Cognition's second principle, actions carry implicit decisions and conflicting decisions carry bad results, and in MAST's terms an inter-agent misalignment failure. The lab's `topology` function checks shared writes first: for a task with two independent-looking subtasks but `shared_writes` set to True, it returns `single_agent` with the reason that workers would make conflicting decisions on shared state, even though the subtask count and value would otherwise suggest an orchestrator. A better design is a single agent with the whole feature in context, building the API and then the form against it. If parallelism is truly needed, first fix the shared decisions in a written contract, an API schema with field names and formats, produced by one agent or a person, and give both workers the contract as a non-negotiable input, then verify the integration with a test that exercises both parts together.

</details>

**Question 2.** Using the lab's `makespan`, six subtasks of 40, 30, 25, 50, 10, and 15 minutes take 170 minutes for one agent. A manager proposes twelve workers to make it "twelve times faster". Compute what happens with 3, 6, and 12 workers and 20 minutes of overhead, explain the result with the formula from Section 2, and say what would actually reduce the time.

<details>
<summary>View Answer</summary>

With three workers, longest-first assignment gives loads of 60, 55, and 55 minutes, so 80 minutes including the 20 minutes of overhead: about 2.1 times faster. With six workers each task gets its own worker, so the slowest worker takes 50 minutes and the total is 70. With twelve workers, six sit idle, because there are only six subtasks, and the time is still 70 minutes. The bound from Section 2 explains it: the parallel time is at least the overhead plus the larger of the longest subtask and the total divided by the workers. With 12 workers the total divided by workers is about 14 minutes, but the longest subtask is 50, so it dominates: 20 plus 50 is 70, a 2.4 times speedup at best, not 12. Adding workers also adds handoffs and tokens. What would reduce the time is splitting the 50-minute competitor analysis into independent parts, for example one per competitor, so the floor drops; reducing the overhead by giving the lead a reusable plan template; or accepting 80 minutes with three workers, which captures most of the gain at a fraction of the coordination and token cost.

</details>

**Question 3.** Five agents answer a calculation question; the correct answer is 42. Their first answers are 41, 41, 42, 40, 41. Trace the lab's `debate` function, explain the outcome, and propose how to make the system reach the right answer.

<details>
<summary>View Answer</summary>

In the first round, each agent looks at the other four. The first agent, answering 41, sees 41, 42, 40, 41: 41 is the majority of the others but equals its own answer, so it keeps 41; the second agent likewise. The third agent, answering 42, sees 41, 41, 40, 41: three of four say 41, a strict majority, so it switches to 41. The fourth agent, answering 40, sees 41, 41, 42, 41 and also switches to 41. The fifth keeps 41. After one round all five say 41; the second round changes nothing and the loop stops. The debate reached unanimous agreement on the wrong answer, because the update rule rewards conformity, and the one agent that was right was outvoted. Agreement among agents sharing a model and a prompt is weak evidence, since their errors are correlated. To reach the right answer, add independent verification: have an agent compute the result with a tool, such as running the calculation in code, and accept the answer the tool confirms; require agents to show their working so a judge can check the reasoning rather than count votes; and diversify the agents, different prompts or models, so their errors are less correlated. Voting and debate are useful for reducing random errors, not systematic ones.

</details>

@@starter
"""
Lab: Parallel Schedules, Token Budgets, Merging, Voting and Debate, Topology
Standard library only. No network calls or models. Complete the TODO in each step, then press "Run & Verify Step".
"""
from collections import Counter

SUBTASKS = {"pricing": 40, "reviews": 30, "specs": 25, "competitors": 50, "stock": 10, "warranty": 15}
RESULTS = [{"worker": "w1", "claims": {"price_saw3": "GBP 89", "warranty": "2 years"}},
           {"worker": "w2", "claims": {"price_saw3": "GBP 79", "stock": "in stock"}},
           {"worker": "w3", "claims": {"warranty": "2 years", "weight": "3.1 kg"}}]
BASE = {"shared_writes": False, "independent_subtasks": 0, "high_value": True, "fixed_stages": False, "verifiable_answer": False}


# ---------------------------------------------------------------- Step 1
def makespan(durations, workers, overhead=0):
    """Longest task first (ties by name), each to the least-loaded worker (ties by lowest index).
    Return (largest load + overhead, [[task names] per worker])."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def team_tokens(lead, workers, handoff):
    """lead + sum(workers) + handoff per worker."""
    # TODO Step 2
    return None


def multiplier(total, baseline):
    """total / baseline rounded to 1 place."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def merge(results):
    """Return (merged {key: first value}, sources {key: [workers agreeing]}, conflicts [(key, kept value,
    new value, first worker, conflicting worker)])."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def vote(answers):
    """(None, 0.0) if empty; (None, share) on a tie for first; else (top answer, share). Shares rounded to 3 places."""
    # TODO Step 4
    return None


def debate(answers, rounds=2):
    """Each round, each agent adopts the vote of the OTHER agents if it has a winner, differs from its own answer, and
    its share is above 0.5. Append every round to history; stop early when nothing changes. Return (final, history)."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def topology(task):
    """In order: shared_writes -> single_agent; >= 2 independent subtasks and high value -> orchestrator_worker;
    fixed_stages -> pipeline; verifiable answer and high value -> vote; else single_agent. Return (name, reason)."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("makespan:", makespan(SUBTASKS, 3, overhead=20))
    print("merge   :", merge(RESULTS))

@@solution
"""
Lab solution: Parallel Schedules, Token Budgets, Merging, Voting and Debate, Topology
Standard library only. No network calls or models.
"""
from collections import Counter

SUBTASKS = {"pricing": 40, "reviews": 30, "specs": 25, "competitors": 50, "stock": 10, "warranty": 15}
RESULTS = [{"worker": "w1", "claims": {"price_saw3": "GBP 89", "warranty": "2 years"}},
           {"worker": "w2", "claims": {"price_saw3": "GBP 79", "stock": "in stock"}},
           {"worker": "w3", "claims": {"warranty": "2 years", "weight": "3.1 kg"}}]
BASE = {"shared_writes": False, "independent_subtasks": 0, "high_value": True, "fixed_stages": False, "verifiable_answer": False}


# ---------------------------------------------------------------- Step 1
def makespan(durations, workers, overhead=0):
    """Longest processing time first: close to the bound set by the longest task and the overhead."""
    loads = [0] * workers
    assignment = [[] for _ in range(workers)]
    for name, duration in sorted(durations.items(), key=lambda pair: (-pair[1], pair[0])):
        worker = min(range(workers), key=lambda w: (loads[w], w))
        loads[worker] += duration
        assignment[worker].append(name)
    return max(loads) + overhead, assignment


# ---------------------------------------------------------------- Step 2
def team_tokens(lead, workers, handoff):
    """The lead, every worker's exploration, and a brief and summary per worker."""
    return lead + sum(workers) + handoff * len(workers)


def multiplier(total, baseline):
    """Put this number next to the value of the task."""
    return round(total / baseline, 1)


# ---------------------------------------------------------------- Step 3
def merge(results):
    """Record support, surface conflicts: never let the last worker silently win."""
    merged, sources, conflicts = {}, {}, []
    for result in results:
        for key, value in result["claims"].items():
            if key not in merged:
                merged[key], sources[key] = value, [result["worker"]]
            elif merged[key] == value:
                sources[key].append(result["worker"])
            else:
                conflicts.append((key, merged[key], value, sources[key][0], result["worker"]))
    return merged, sources, conflicts


# ---------------------------------------------------------------- Step 4
def vote(answers):
    """Majority with its share; a tie has no winner."""
    counts = Counter(answers).most_common()
    if not counts:
        return None, 0.0
    if len(counts) > 1 and counts[0][1] == counts[1][1]:
        return None, round(counts[0][1] / len(answers), 3)
    return counts[0][0], round(counts[0][1] / len(answers), 3)


def debate(answers, rounds=2):
    """Synchronous conformity: spreads a majority, right or wrong, and can oscillate on a split."""
    current, history = list(answers), [list(answers)]
    for _ in range(rounds):
        updated = []
        for i, own in enumerate(current):
            top, share = vote(current[:i] + current[i + 1:])
            updated.append(top if top is not None and top != own and share > 0.5 else own)
        history.append(updated)
        if updated == current:
            break
        current = updated
    return current, history


# ---------------------------------------------------------------- Step 5
def topology(task):
    """Coupled work stays in one context; split only what is independent and worth paying for."""
    if task["shared_writes"]:
        return "single_agent", "workers would make conflicting decisions on shared state"
    if task["independent_subtasks"] >= 2 and task["high_value"]:
        return "orchestrator_worker", f"{task['independent_subtasks']} independent subtasks can run in parallel"
    if task["fixed_stages"]:
        return "pipeline", "the stages are known and run in order"
    if task["verifiable_answer"] and task["high_value"]:
        return "vote", "independent answers to one question can be compared"
    return "single_agent", "no structure that more agents would exploit"


if __name__ == "__main__":
    for workers in (1, 3, 6, 12):
        print(workers, makespan(SUBTASKS, workers, overhead=20 if workers > 1 else 0)[0])
    print(debate(["41", "41", "42", "40", "41"]))
    print(topology({**BASE, "independent_subtasks": 2, "shared_writes": True}))

@@step
{
  "stepNumber": 1,
  "title": "Schedule subtasks across workers",
  "instruction": "Implement makespan(durations, workers, overhead). Go through the subtasks from longest to shortest, breaking ties by name, and give each to the worker with the smallest load so far, breaking ties by the lowest worker index. Return the largest load plus the overhead, and the list of task names assigned to each worker. Schedule six research subtasks with one, three, six, and twelve workers. This is time and parallelism from Section 2. [MOD-8.9]",
  "hintConceptual": "Hand out the biggest jobs first, always to whoever is least busy. The finishing time is set by the busiest person, plus the time spent organising everyone.",
  "hintSyntax": "loads = [0] * workers\nassignment = [[] for _ in range(workers)]\nfor name, duration in sorted(durations.items(), key=lambda pair: (-pair[1], pair[0])):\n    worker = min(range(workers), key=lambda w: (loads[w], w))\n    loads[worker] += duration\n    assignment[worker].append(name)\nreturn max(loads) + overhead, assignment"
}
@@assert
_one = makespan(SUBTASKS, 1)
assert _one is not None and _one[0] == 170 and _one[1] == [["competitors", "pricing", "reviews", "specs", "warranty", "stock"]], f"One worker does everything, got {_one}"
assert makespan(SUBTASKS, 3, overhead=20) == (80, [["competitors", "stock"], ["pricing", "warranty"], ["reviews", "specs"]]), f"Three workers, got {makespan(SUBTASKS, 3, overhead=20)}"
assert makespan(SUBTASKS, 6, overhead=20)[0] == 70 and makespan(SUBTASKS, 12, overhead=20)[0] == 70, "The longest subtask is the floor"
assert makespan({"a": 5, "b": 5}, 2) == (5, [["a"], ["b"]]), "Ties by name and worker index"
print("Step 1 passed: 170 minutes alone, 80 with three workers, never below 70.")

@@step
{
  "stepNumber": 2,
  "title": "Count the token bill",
  "instruction": "Implement team_tokens(lead, workers, handoff): the lead's tokens, plus the sum of the workers' tokens, plus one handoff per worker. Implement multiplier(total, baseline): the total divided by the baseline, rounded to 1 place. Price a team of five workers against a single agent and against a chat answer. This is tokens and cost from Section 2. [MOD-8.9]",
  "hintConceptual": "Add up every mouth you are feeding: the manager, each team member, and the memos passed between them. Then compare that bill with what one person working alone would cost.",
  "hintSyntax": "def team_tokens(lead, workers, handoff):\n    return lead + sum(workers) + handoff * len(workers)\n\ndef multiplier(total, baseline):\n    return round(total / baseline, 1)"
}
@@assert
_t = team_tokens(30_000, [40_000] * 5, 2_000)
assert _t == 240_000, f"Five workers, got {_t}"
assert multiplier(_t, 60_000) == 4.0 and multiplier(_t, 4_000) == 60.0, "Against a single agent and a chat answer"
assert team_tokens(10_000, [], 2_000) == 10_000, "No workers, only the lead"
assert team_tokens(0, [100, 200], 50) == 400 and multiplier(10, 3) == 3.3, "Handoffs per worker; rounding"
print("Step 2 passed: 240,000 tokens, 4.0 times a single agent.")

@@step
{
  "stepNumber": 3,
  "title": "Merge findings and surface conflicts",
  "instruction": "Implement merge(results). For each result, in order, and each of its claims: if the key is new, keep the value and record the worker as its source; if the value matches the kept one, add the worker to the sources; otherwise record a conflict as (key, kept value, new value, first worker, conflicting worker). Return the merged claims, the sources, and the conflicts. Merge three workers' findings. This is merging and conflicts from Section 2. [MOD-8.9]",
  "hintConceptual": "As an editor, file each fact with the reporters who confirmed it, and when two reporters disagree, put the disagreement on your desk instead of quietly picking one.",
  "hintSyntax": "merged, sources, conflicts = {}, {}, []\nfor result in results:\n    for key, value in result[\"claims\"].items():\n        if key not in merged:\n            merged[key], sources[key] = value, [result[\"worker\"]]\n        elif merged[key] == value:\n            sources[key].append(result[\"worker\"])\n        else:\n            conflicts.append((key, merged[key], value, sources[key][0], result[\"worker\"]))\nreturn merged, sources, conflicts"
}
@@assert
_m = merge(RESULTS)
assert _m is not None and _m[0] == {"price_saw3": "GBP 89", "warranty": "2 years", "stock": "in stock", "weight": "3.1 kg"}, f"First values kept, got {_m}"
assert _m[1]["warranty"] == ["w1", "w3"] and _m[1]["stock"] == ["w2"], "Support recorded"
assert _m[2] == [("price_saw3", "GBP 89", "GBP 79", "w1", "w2")], "The price conflict is surfaced"
assert merge([]) == ({}, {}, []), "Nothing to merge"
print("Step 3 passed: the warranty is confirmed twice, and the SAW-3 price conflict is on the desk.")

@@step
{
  "stepNumber": 4,
  "title": "Vote and debate",
  "instruction": "Implement vote(answers): return (None, 0.0) for no answers; if the two most common answers tie, return None with the top share; otherwise return the most common answer and its share, rounded to 3 places. Then implement debate(answers, rounds), using vote from this step: in each round, every agent looks at the other agents' answers and switches to their vote if it has a winner that differs from its own answer with a share above 0.5. Record each round in the history, which starts with the initial answers, and stop early when a round changes nothing. Return the final answers and the history. Debate with a correct majority, a wrong majority, and an even split. This is debate dynamics from Section 2. [MOD-8.9]",
  "hintConceptual": "Everyone in the room looks at what the others said and goes along with a clear majority. Notice that nothing in that rule checks whether the majority is right.",
  "hintSyntax": "counts = Counter(answers).most_common()\nif not counts:\n    return None, 0.0\nif len(counts) > 1 and counts[0][1] == counts[1][1]:\n    return None, round(counts[0][1] / len(answers), 3)\nreturn counts[0][0], round(counts[0][1] / len(answers), 3)\n\n# debate\ncurrent, history = list(answers), [list(answers)]\nfor _ in range(rounds):\n    updated = []\n    for i, own in enumerate(current):\n        top, share = vote(current[:i] + current[i + 1:])\n        updated.append(top if top is not None and top != own and share > 0.5 else own)\n    history.append(updated)\n    if updated == current:\n        break\n    current = updated\nreturn current, history"
}
@@assert
assert vote(["42", "42", "41"]) == ("42", 0.667) and vote(["a", "b"]) == (None, 0.5) and vote([]) == (None, 0.0), f"Votes, got {vote(['42', '42', '41'])}"
_right = debate(["42", "41", "42", "40", "42"])
assert _right is not None and _right[0] == ["42"] * 5 and len(_right[1]) == 3, f"A correct majority spreads, got {_right}"
assert debate(["41", "41", "42", "40", "41"])[0] == ["41"] * 5, "A wrong majority spreads too"
assert debate(["a", "a", "b", "b"])[1] == [["a", "a", "b", "b"], ["b", "b", "a", "a"], ["a", "a", "b", "b"]], "An even split oscillates"
assert debate(["a", "b", "c"]) == (["a", "b", "c"], [["a", "b", "c"], ["a", "b", "c"]]), "No majority, nobody moves"
print("Step 4 passed: debate spreads the majority, right or wrong, and oscillates on a split.")

@@step
{
  "stepNumber": 5,
  "title": "Choose a topology",
  "instruction": "Implement topology(task), checking in order: shared_writes gives ('single_agent', 'workers would make conflicting decisions on shared state'); at least 2 independent_subtasks with high_value gives ('orchestrator_worker', '<n> independent subtasks can run in parallel'); fixed_stages gives ('pipeline', 'the stages are known and run in order'); verifiable_answer with high_value gives ('vote', 'independent answers to one question can be compared'); otherwise ('single_agent', 'no structure that more agents would exploit'). Classify five tasks. This is when a single agent wins from Section 2. [MOD-8.9]",
  "hintConceptual": "First ask whether the pieces touch the same thing; if they do, one person does it. Only then ask whether the pieces are independent and worth a team.",
  "hintSyntax": "if task[\"shared_writes\"]:\n    return \"single_agent\", \"workers would make conflicting decisions on shared state\"\nif task[\"independent_subtasks\"] >= 2 and task[\"high_value\"]:\n    return \"orchestrator_worker\", f\"{task['independent_subtasks']} independent subtasks can run in parallel\"\nif task[\"fixed_stages\"]:\n    return \"pipeline\", \"the stages are known and run in order\"\nif task[\"verifiable_answer\"] and task[\"high_value\"]:\n    return \"vote\", \"independent answers to one question can be compared\"\nreturn \"single_agent\", \"no structure that more agents would exploit\""
}
@@assert
assert topology({**BASE, "independent_subtasks": 5}) == ("orchestrator_worker", "5 independent subtasks can run in parallel"), f"Research comparison, got {topology({**BASE, 'independent_subtasks': 5})}"
assert topology({**BASE, "independent_subtasks": 2, "shared_writes": True})[0] == "single_agent", "The backend and frontend feature"
assert topology({**BASE, "independent_subtasks": 5, "high_value": False, "fixed_stages": True}) == ("pipeline", "the stages are known and run in order"), "Low value, fixed stages"
assert topology({**BASE, "verifiable_answer": True})[0] == "vote" and topology({**BASE, "verifiable_answer": True, "high_value": False})[0] == "single_agent", "Sampling only when it pays"
assert topology(BASE) == ("single_agent", "no structure that more agents would exploit"), "The default"
print("Step 5 passed: coupled work stays with one agent; independent, valuable work gets a team.")
