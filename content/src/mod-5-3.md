@@meta
{
  "moduleId": "MOD-5.3",
  "slug": "mod-5-3",
  "unitId": "UNIT-5",
  "unitTitle": "Unit 5: Complete Prompt Engineering Master Class",
  "title": "Context Engineering",
  "difficulty": "Intermediate",
  "estimatedMinutes": 95,
  "citations": [
    { "title": "Effective context engineering for AI agents", "source": "Anthropic Engineering", "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
    { "title": "Context Rot: How Increasing Input Tokens Impacts LLM Performance", "source": "Chroma Research", "url": "https://www.trychroma.com/research/context-rot" },
    { "title": "Lost in the Middle: How Language Models Use Long Contexts", "source": "arXiv", "url": "https://arxiv.org/abs/2307.03172" },
    { "title": "Prompting best practices (long context prompting)", "source": "Anthropic Docs", "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
    { "title": "How Long Contexts Fail", "source": "Drew Breunig", "url": "https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html" },
    { "title": "Context Engineering for Agents", "source": "LangChain Blog", "url": "https://blog.langchain.com/context-engineering-for-agents/" }
  ],
  "videoLibrary": [
    {
      "id": "VID-5.3-1",
      "title": "What is a Context Window? Unlocking LLM Secrets",
      "creator": "IBM Technology",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=-QVoIxEpFkM",
      "timingInstruction": "Watch the section comparing a language model to an operating system, after reading Section 1",
      "keyTakeaway": "What the context window is and why it limits what a model can use."
    },
    {
      "id": "VID-5.3-2",
      "title": "Context Engineering for Agents",
      "creator": "LangChain",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=4GiqzUHD5AA",
      "timingInstruction": "Watch after reading Section 2 (selecting what enters the context)",
      "keyTakeaway": "Strategies for writing, selecting, compressing, and isolating context in agents."
    },
    {
      "id": "VID-5.3-3",
      "title": "Context Engineering for AI Agents: 4 Failure Modes to Avoid",
      "creator": "IBM Technology",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=BwXremQ-i6I",
      "timingInstruction": "Optional; listen for how much of the discussion is about what information the model is given",
      "keyTakeaway": "Common ways context goes wrong and how to prevent them."
    },
    {
      "id": "VID-5.3-4",
      "title": "Building with the Claude API",
      "creator": "Anthropic",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/building-with-the-claude-api",
      "timingInstruction": "Take the lessons on retrieval, caching, and tool use after completing the lab",
      "keyTakeaway": "Covers in code the mechanisms this chapter reasons about: what is placed in the context, in what order, and how repeated context is cached."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Pack, Order, Compact, and Cache a Context",
    "context": "A team's assistant answers questions over a large set of documents and, as an agent, runs long sessions that fill its context window. You will build the four operations that keep such a context healthy: choosing what to include under a token budget, ordering it so that the most important material is best placed, compacting a long history without losing pinned facts, and measuring how much of a prompt can be reused from a cache.",
    "language": "python"
  }
}

@@reading
# Context Engineering

Module 5.1 treated a prompt as a brief with six parts. In real systems the brief is the smallest thing the model reads. Around it sit documents, earlier conversation, descriptions of tools, the results those tools returned, and notes carried over from before. All of it together is the **context**: every token in the window at the moment the model produces its answer.

In mid-2025 practitioners began calling the management of that whole window **context engineering**. Anthropic's engineering team describes it as curating and maintaining the best set of tokens available to the model during inference, and presents it as the natural development of prompt engineering. The shift in name reflects a shift in where the work is. For a single question, the wording of the request matters most. For an assistant with documents, tools, and a long session, what is in the window, and in what order, matters more.

This chapter is about that: what occupies the window, why more is not better, and the four operations that keep a context useful.

## 1. First-Principles Mental Model & Intuition

### A desk, not a filing cabinet

Picture an analyst at a desk. The desk is large, and it has an edge. Everything they can consult while working must be on it. A filing cabinet in the next room holds far more, but nothing in the cabinet affects the work until someone fetches it.

The context window is the desk. Your files, your databases, and the model's saved notes are the cabinet.

```text
   THE CABINET (not seen by the model)        THE DESK (the context window)
   +------------------------------+           +--------------------------------------+
   | all your documents           |  select   | system instructions                  |
   | past conversations           | --------> | tool descriptions                    |
   | saved notes and memory       |           | documents chosen for this task       |
   | everything tools could fetch | <-------- | the conversation so far              |
   +------------------------------+   write   | results of tool calls                |
                                              | the current request                  |
                                              +--------------------------------------+
                                                        |
                                                        v
                                                     MODEL
```

Two facts about desks carry the whole chapter.

**A cluttered desk slows the worker.** An analyst surrounded by forty open folders, half of them irrelevant and two of them contradicting each other, works worse than one with the five that matter. A bigger desk does not fix this. It allows more clutter.

**Position matters.** What is directly in front of the analyst, and what was put down last, gets the most attention. What is buried in the middle of a pile gets the least.

### More is not better

It is tempting to treat a million-token window as an invitation: put everything in, and let the model sort it out. The evidence, reviewed in Section 2, is that this makes answers worse. Anthropic's guidance states the principle directly: context must be treated as a finite resource with diminishing marginal returns. The aim is the smallest set of high-signal tokens that makes the desired outcome likely.

### Four operations

Everything a context engineer does is one of four things. The names below follow a framing popularised in 2025.

| Operation | What it means | Where you have met it |
|---|---|---|
| **Write** | Save information outside the window, to be fetched later | Memory files in Module 3.4, saved notes |
| **Select** | Choose what to bring into the window for this task | Retrieval in Module 3.2, skills in Module 3.5 |
| **Compress** | Reduce what is in the window while keeping what matters | Compaction in Module 3.4 |
| **Isolate** | Give a sub-task its own separate window | Helper agents in Module 3.4 |

Earlier modules introduced each of these as a feature of a product. This chapter treats them as one subject.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### What is in the window

For a simple chat, the window holds the system prompt, the conversation, and your message. For an agent it holds much more.

| Component | Typical size | Changes how often |
|---|---|---|
| System instructions | Hundreds to thousands of tokens | Rarely |
| Tool descriptions | Hundreds of tokens per tool | Rarely |
| Examples | Hundreds to thousands | Rarely |
| Retrieved documents | Thousands to hundreds of thousands | Per task |
| Conversation history | Grows without limit | Every turn |
| Tool results | Often the largest part | Every step |
| Notes and memory | Hundreds to thousands | Occasionally |
| The current request | Tens to hundreds | Every turn |

In a long agent session, the request you typed is a tiny fraction of what the model reads. Most of the window is tool results and history. That is why wording alone cannot fix a session that has gone wrong.

### Why long contexts degrade

Three lines of evidence agree.

**Position.** A 2023 study, "Lost in the Middle", placed the document containing the answer at different positions among many others. Accuracy was highest when the relevant document was at the beginning or the end of the input and lowest when it was in the middle, giving a U-shaped curve. For some models, a relevant document in the middle did worse than giving no documents at all.

**Length.** A 2025 report by Chroma, titled "Context Rot", tested 18 models on deliberately simple tasks while increasing the amount of input. Performance fell as input grew, even though the tasks did not get harder. Irrelevant but similar-looking material, called distractors, made it worse. On one benchmark of conversational memory, every model did better with a focused input of about 300 tokens than with the full history of about 113,000 tokens that contained the same answer.

$$
\frac{113{,}000}{300} \approx 377
$$

The full context was nearly four hundred times larger, and the answers were worse.

**Mechanism.** Anthropic's engineers offer an explanation. In the architecture described in Module 1.9, every token can attend to every other token. For $n$ tokens that is on the order of

$$
n^2
$$

pairwise relationships. Doubling the context quadruples the relationships the model must keep in view, with the same capacity to do it. They describe this as a limited attention budget that each additional token draws down.

### How contexts fail

It helps to have names for the ways a context goes wrong. One widely used list has four.

| Failure | What happens | Example |
|---|---|---|
| **Poisoning** | A mistake enters the context and is then treated as fact | An agent misreads a file early on and builds every later step on the error |
| **Distraction** | The context is so long that the model attends to its history more than to the task | A session repeats earlier actions it can see in its own transcript |
| **Confusion** | Irrelevant material influences the answer | A question about one client is answered using a passage about another |
| **Clash** | Parts of the context contradict each other | Two versions of a policy, with different figures, both present |

Each has a remedy among the four operations. Poisoning is treated by starting a fresh context or removing the bad material. Distraction by compressing. Confusion by selecting more strictly. Clash by removing the stale version.

### Selecting under a budget

Suppose you have candidate chunks, each with a size $t_i$ in tokens and a relevance $v_i$ to the task, and a budget $B$. Choosing which to include is a classic optimisation problem, the knapsack:

$$
\text{maximise} \ \sum_{i \in S} v_i \qquad \text{subject to} \ \sum_{i \in S} t_i \le B
$$

A simple and effective method is to rank chunks by **value density**, relevance per token,

$$
d_i = \frac{v_i}{t_i}
$$

and add them from the densest downward, skipping any that does not fit. A short, highly relevant passage beats a long, moderately relevant one.

The naive alternative is to take chunks in the order they arrived until one does not fit. This is what happens when "the top results" are pasted in. It fills the window with whatever came first, large or small, relevant or not.

The budget $B$ is a choice, and the evidence above says it should be well below the window's limit. A context is sized by what the task needs, with the limit as a ceiling and not a target.

### Ordering

Given what to include, where should it go? Three rules, from three different considerations, fit together.

**Rule 1: long material first, the question last.** Module 3.9 gave Anthropic's guidance and its reported gain of up to 30 percent on long, multi-document inputs.

**Rule 2: the most important material at the ends.** If attention follows a U-shape, a simple model of how much of a chunk's content is effectively used is a weight that is highest at the first and last positions and lowest in the middle. For position $i$ of $n$, counting from zero, one such weight is

$$
w_i = f + (1 - f) \cdot \left| \frac{2i}{n - 1} - 1 \right|
$$

where $f$ is the floor, the weight at the very middle. With $f = 0.4$ the ends have weight 1 and the centre 0.4. The **expected recall** of an arrangement is then the relevance-weighted average of these weights:

$$
\text{recall} = \frac{\sum_i v_i \, w_i}{\sum_i v_i}
$$

The numbers are an illustration and not a measurement of any model. The conclusion is robust: placing the most relevant chunks first and last, with the least relevant in the middle, beats the obvious arrangement of most relevant first and descending from there.

**Rule 3: stable material before changing material.** Module 3.2 explained prompt caching: a prefix that is identical to a previous request can be reused at a fraction of the cost. A cache matches from the beginning and stops at the first difference. So anything that changes on every request, a timestamp, the user's question, must come after everything that does not. A single changing line at the top makes the whole prompt uncacheable.

Put together:

```text
   +---------------------------------------------+
   | system instructions            stable       |  cached
   | tool descriptions              stable       |  cached
   | examples                       stable       |  cached
   | documents: MOST relevant first              |
   |            least relevant in the middle     |
   |            second most relevant last        |
   | conversation history           grows        |
   | the current request            changes      |  last
   +---------------------------------------------+
```

### Compressing

A long session eventually fills any window. **Compaction** replaces older material with a summary. The risk is obvious: a summary can drop the one constraint that mattered.

The defence is **pinning**. Some items must survive any compaction: the system instructions, the user's stated goal, hard constraints, and decisions already made. Everything else is a candidate for summarising, oldest first.

Tool results deserve special treatment. A result that was needed for one step, the full contents of a file, a long list of search hits, is often dead weight ten steps later. Anthropic's guidance suggests clearing old tool results as one of the lightest forms of compaction. A good tool also returns less in the first place: a filtered answer, not a whole table.

### Writing and isolating

Two operations move information out of the window.

**Writing** saves it somewhere durable. An agent that keeps a notes file, recording what it has learned and decided, can lose its conversation to compaction and recover by reading its notes. Module 3.4's memory file is this idea. Anthropic calls it structured note-taking.

**Isolating** gives a sub-task its own window. A helper agent explores twenty files in a fresh context and returns a paragraph. The main agent's window receives the paragraph and never sees the twenty files. The exploration cost tokens. It did not cost attention in the place where the main work is done.

There is also a middle course between loading everything up front and loading nothing: keep lightweight references, a file path, a query, a link, and fetch the content only when a step needs it. Anthropic calls this just-in-time retrieval. Skills in Module 3.5 work this way.

### Complexity

Greedy packing sorts the chunks, $O(n \log n)$. Ordering is linear. Compaction is linear in the history. Measuring a shared prefix is linear in the shorter prompt. The significant costs are in tokens: a model reading $n$ tokens does work that grows faster than $n$, and a session's total input grows with the square of its length, as Module 3.4 showed.

## 3. Production-Grade Implementation & Annotated Walkthrough

Each operation can be written down. First, selecting under a budget.

```python
CHUNKS = [
    {"id": "A", "tokens": 3000, "relevance": 9},
    {"id": "B", "tokens": 500, "relevance": 6},
    {"id": "C", "tokens": 4000, "relevance": 4},
    {"id": "D", "tokens": 800, "relevance": 8},
    {"id": "E", "tokens": 2500, "relevance": 2},
    {"id": "F", "tokens": 300, "relevance": 3},
    {"id": "G", "tokens": 1200, "relevance": 7},
]

def pack_context(chunks, budget):
    ranked = sorted(chunks, key=lambda chunk: (-chunk["relevance"] / chunk["tokens"], chunk["id"]))
    chosen, used = [], 0
    for chunk in ranked:
        if used + chunk["tokens"] <= budget:
            chosen.append(chunk["id"])
            used += chunk["tokens"]
    return chosen, used

def take_in_order(chunks, budget):
    chosen, used = [], 0
    for chunk in chunks:
        if used + chunk["tokens"] > budget:
            break
        chosen.append(chunk["id"])
        used += chunk["tokens"]
    return chosen, used

relevance = {chunk["id"]: chunk["relevance"] for chunk in CHUNKS}
for name, method in (("by value density", pack_context), ("in arrival order", take_in_order)):
    ids, used = method(CHUNKS, 6000)
    print(f"{name:<17} {ids}  {used} tokens  total relevance {sum(relevance[i] for i in ids)}")
```

- **Chunks are ranked by relevance per token.** The sort key is the negative density, so the densest comes first, with the identifier breaking ties so that the result is repeatable.
- **A chunk that does not fit is skipped, and the loop continues.** A smaller chunk further down may still fit. Stopping at the first failure would waste space.
- **Density packing fills 5,800 of 6,000 tokens with a total relevance of 33.** It takes the four short, relevant chunks and then the large, highly relevant one.
- **Arrival order takes two chunks and stops.** The third is too large, so the window holds 3,500 tokens with a relevance of 15. Less than half the value from the same candidates and the same budget.
- **Greedy is not always optimal.** On some inputs a different combination scores higher. It is simple, fast, and good, and the relevance scores are estimates anyway.

Next, ordering.

```python
def order_for_recall(ids_by_relevance):
    return ids_by_relevance[0::2] + ids_by_relevance[1::2][::-1]

def expected_recall(relevances, floor=0.4):
    n = len(relevances)
    if n == 0:
        return 0.0
    if n == 1:
        return 1.0
    weights = [floor + (1 - floor) * abs(2 * i / (n - 1) - 1) for i in range(n)]
    return round(sum(r * w for r, w in zip(relevances, weights)) / sum(relevances), 3)

best_first = sorted(pack_context(CHUNKS, 6000)[0], key=lambda i: -relevance[i])
ends_first = order_for_recall(best_first)
print(best_first, expected_recall([relevance[i] for i in best_first]))
print(ends_first, expected_recall([relevance[i] for i in ends_first]))
print("best in the middle:", expected_recall([3, 7, 9, 8, 6]))
```

- **`order_for_recall` deals the ranked list to the two ends.** Items at even positions, the first, third, and fifth most relevant, go to the front in order. Items at odd positions go to the back in reverse. The most relevant chunk is first, the second most relevant is last, and the least relevant ends up in the middle.
- **`expected_recall` applies the U-shaped weight.** The first and last positions have weight 1, the centre has the floor, and the result is the share of total relevance that is effectively used.
- **Descending order scores 0.745.** Most relevant first is the natural arrangement, and it puts the third most relevant chunk at the weakest position.
- **Ends-first scores 0.827.** The same five chunks, rearranged, with nothing added.
- **Putting the best chunk in the middle scores 0.7.** This is what happens by accident when the key document is pasted between others.
- **The weights are a model.** No assistant follows this formula exactly. The ranking of the three arrangements is what the research supports.

Then, compaction with pinned items.

```python
def compact(messages, budget, summary_tokens=200):
    kept, removed, position = list(messages), 0, None

    def total():
        return sum(message["tokens"] for message in kept) + (summary_tokens if removed else 0)

    while total() > budget:
        index = next((i for i, message in enumerate(kept) if not message["pinned"]), None)
        if index is None:
            break
        if position is None:
            position = index
        kept.pop(index)
        removed += 1
    if removed:
        kept.insert(position, {"text": f"[summary of {removed} earlier messages]", "tokens": summary_tokens, "pinned": True})
    return kept

HISTORY = [
    {"text": "SYSTEM: rules for the assistant", "tokens": 500, "pinned": True},
    {"text": "USER GOAL: keep the total under the 40,000 budget cap", "tokens": 300, "pinned": True},
    {"text": "tool result: contents of file A", "tokens": 4000, "pinned": False},
    {"text": "assistant: analysis of file A", "tokens": 800, "pinned": False},
    {"text": "tool result: contents of file B", "tokens": 5000, "pinned": False},
    {"text": "assistant: analysis of file B", "tokens": 700, "pinned": False},
    {"text": "user: latest question", "tokens": 200, "pinned": False},
]
print(sum(message["tokens"] for message in HISTORY), "tokens before")
after = compact(HISTORY, 7000)
for message in after:
    print(f"  {message['tokens']:>5}  {message['text']}")
print(sum(message["tokens"] for message in after), "tokens after")
```

- **The oldest unpinned message goes first.** `next(...)` finds the first message that is not pinned. Old tool results and old analysis are the least likely to matter now.
- **Pinned messages are never removed.** The system rules and the user's goal, with its budget cap, survive however much is compacted. An unpinned constraint would have been summarised away, and the agent would have continued without it.
- **The summary's own size is counted.** `total()` adds the summary's tokens as soon as anything has been removed, so the result really fits the budget.
- **The summary goes where the removed messages were.** It is inserted at the position of the first removal, after the leading pinned items. The stable start of the context is undisturbed, which keeps it cacheable.
- **The loop stops when it cannot help.** If only pinned messages remain, there is nothing left to remove, and the function returns what it has.
- **Two messages are replaced by a summary.** The session goes from 11,500 tokens to 6,900. In a real system the summary would be written by the model. Here it is a placeholder that records how much was replaced.

Finally, the cacheable prefix.

```python
def shared_prefix_tokens(first, second):
    shared = 0
    for (text_a, tokens_a), (text_b, _) in zip(first, second):
        if text_a != text_b:
            break
        shared += tokens_a
    return shared

stable = [("system instructions", 2000), ("tool descriptions", 3000), ("reference documents", 25000)]
print(shared_prefix_tokens(stable + [("question one", 50)], stable + [("question two", 50)]))
print(shared_prefix_tokens([("time: 10:01", 10)] + stable + [("question one", 50)],
                           [("time: 10:02", 10)] + stable + [("question two", 50)]))
```

- **A prompt is compared segment by segment from the start.** The count stops at the first segment that differs, because a cache matches a prefix and nothing after a difference can be reused.
- **With stable material first, 30,000 tokens are shared.** Only the question differs, and it is last.
- **With a timestamp first, nothing is shared.** One changing line of ten tokens at the top makes all 30,000 tokens that follow uncacheable. The fix is to move the line to the end.

**Complexity.** `pack_context` is dominated by its sort. `order_for_recall` and `expected_recall` are linear. `compact` is quadratic in the worst case, because each removal searches from the start, which is immaterial for a history of hundreds of messages. `shared_prefix_tokens` is linear.

### A context checklist

Before a long task, and when a session goes wrong, go down this list.

1. **Is everything here needed for this task?** Remove what is not.
2. **Is anything contradicted by something else here?** Keep the current version only.
3. **Is the key material at the start or the end?**
4. **Is the question last?**
5. **Is the stable part first, with nothing changing above it?**
6. **Are the constraints that must not be lost stated where they will survive?** In standing instructions or a notes file, not only in an early message.
7. **Has an error entered the context?** If so, a fresh session with a corrected summary beats arguing with a poisoned one.
8. **Could a sub-task run in its own context and return a summary?**

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**"It fits, so I will include it."** The commonest mistake with large windows. Fitting is a limit. Every irrelevant page competes with the relevant ones for attention, and the research shows accuracy falling as input grows.

**Tool results nobody trimmed.** An agent calls a tool that returns a 20,000-token listing, uses two lines of it, and carries the rest for the remainder of the session. A few such calls and the window is mostly dead results. Prefer tools that filter, and clear old results.

**Arguing with a poisoned context.** Once a wrong belief is in the transcript, the model keeps seeing its own earlier statement and tends to return to it. Correcting it repeatedly adds more text about the error. Start a new session with a short, correct summary.

**Two versions of the truth.** An old policy and a new one, a draft and a final, last year's figures and this year's. The model will use either. Remove the stale one before asking.

**The constraint that was compacted away.** A requirement stated once, early in a long session, is exactly what a summary drops. Put durable constraints in standing instructions or a file the agent re-reads, as Module 3.4 advised.

**The timestamp at the top.** A current date or a request identifier placed first in a prompt silently disables caching for everything after it. Bills rise and nothing appears to be wrong. Put changing values last.

**Too many tools.** Every tool's description is context, and many similar tools are confusion waiting to happen: the model picks the wrong one. Module 3.6 made the same point about connectors. Fewer, clearer tools work better.

**The key document in the middle.** People paste background, then the important document, then more background, then ask. The important document is now at the weakest position. Put it first or last, and name it in the question.

**Trusting the advertised window.** A model that accepts a million tokens does not use a million tokens equally well. The usable window, the amount it handles reliably for your task, is smaller, and only testing reveals it.

**Summaries of summaries.** After several rounds of compaction a session is working from a description of a description. Detail and nuance are gone. For long work, save facts and decisions to a notes file as you go, where they are not re-summarised.

**Retrieval that returns near-duplicates.** Five chunks that say the same thing cost five times the tokens and add nothing. Remove duplicates before packing.

**Everything in one session.** A day's unrelated tasks in a single conversation carry each other's context. Start a new session per task. This is the cheapest context engineering there is.

## 5. Active Recall Check & Synthesis Summary

**Summary.** The context is everything in the model's window when it answers: instructions, tool descriptions, documents, history, tool results, notes, and the request. Managing it is context engineering, and its principle is that context is a finite resource with diminishing returns. Long contexts degrade: material in the middle is used least, accuracy falls as input grows even on simple tasks, and a focused input of a few hundred tokens can beat a full history hundreds of times larger. Contexts fail by poisoning, distraction, confusion, and clash. Four operations keep them healthy. Selecting chooses what to include under a budget, well by relevance per token and badly by arrival order. Ordering puts long material before the question, the most relevant material at the ends, and stable material before changing material so that it can be cached. Compressing replaces old material with summaries while pinning what must survive. Writing and isolating move information out of the window, into notes and into helper agents with their own contexts.

**Question 1.** Four chunks have relevance 10, 6, 4, and 2. Using the weight formula from Section 2 with a floor of 0.4, compute the expected recall for three arrangements: descending order (10, 6, 4, 2), ends-first (10, 4, 2, 6), and the most relevant chunk second (4, 10, 6, 2). What do the three results show?

<details>
<summary>View Answer</summary>

With four positions, numbered 0 to 3, the weights are: position 0, the absolute value of 0 minus 1 is 1, giving 0.4 plus 0.6, which is 1.0. Position 1: two thirds minus 1 is minus one third, absolute value one third, giving 0.4 plus 0.2, which is 0.6. Position 2 is the mirror image, also 0.6. Position 3 is 1.0. The total relevance is 22. For descending order: 10 times 1.0 is 10, 6 times 0.6 is 3.6, 4 times 0.6 is 2.4, and 2 times 1.0 is 2, a sum of 18, and 18 divided by 22 is about 0.818. For ends-first: 10, plus 4 times 0.6 which is 2.4, plus 2 times 0.6 which is 1.2, plus 6, a sum of 19.6, giving about 0.891. For the most relevant chunk second: 4, plus 10 times 0.6 which is 6, plus 3.6, plus 2, a sum of 15.6, giving about 0.709. The results show that the same four chunks are used very differently depending on arrangement. The obvious order, best first and descending, wastes the last position on the least relevant chunk. Ends-first puts the two most relevant chunks in the two strongest positions and gains seven points. Burying the best chunk one place in from the start loses eleven points against the obvious order. The formula is an illustration, but the ranking matches what research on long contexts found: the beginning and the end are used best.

</details>

**Question 2.** An application sends 40 requests an hour. Each begins with a 30,000-token block of instructions and reference material that never changes, followed by a short question. The input price is USD 2 per million tokens, a cache write costs 1.25 times the normal price, and a cache read 0.1 times. Compute the hourly cost of that block without caching and with caching. Then a developer adds the current time as the first line of every prompt. What happens, and what is the fix?

<details>
<summary>View Answer</summary>

Sending the block once at the normal price costs 30,000 divided by a million, times 2, which is USD 0.06. Without caching, 40 requests cost 40 times 0.06, or USD 2.40 an hour. With caching, and assuming the requests arrive close enough together for the cache to stay alive, the first request writes the cache at 1.25 times 0.06, which is USD 0.075, and the other 39 read it at 0.1 times 0.06, which is USD 0.006 each, or USD 0.234 in total. The hourly cost is USD 0.309, a saving of about 87 percent. When the current time is added as the first line, every request begins with different text. A cache matches a prompt from its start and stops at the first difference, so the shared prefix is now zero tokens and nothing can be read from the cache. Every request pays to write a new cache entry that will never be read: 40 times 0.075 is USD 3.00 an hour, which is 25 percent more than with no caching at all, and about ten times the cached cost. Nothing appears broken, since the answers are unchanged. The fix is to move the time to the end of the prompt, after the stable block, next to the question. The general rule is that anything that changes between requests goes after everything that does not.

</details>

**Question 3.** An agent is two hours into a data-cleaning task. Early on it misread a column of dates as American format and has been converting them wrongly since. The user's instruction "never modify the original file" was given in the first message. The session has been compacted twice. The agent now proposes to overwrite the original file. Diagnose what has gone wrong in the terms of this chapter, and say how the session should have been set up.

<details>
<summary>View Answer</summary>

Two separate failures have occurred. The first is context poisoning. The mistaken reading of the date format entered the context early, and every later step saw the agent's own earlier statement and built on it. Two hours of transcript now treat the wrong format as established, so a brief correction would have to outweigh a large volume of text asserting the opposite. The second is a constraint lost to compaction. "Never modify the original file" was stated once, in the first message, as part of the conversation. Compaction replaces old messages with a summary, and a summary of the early conversation, made twice, has dropped it. The agent is proposing to overwrite the file because, as far as its current context shows, nothing forbids it. The session should have been set up differently in three ways. The constraint should have been pinned: placed in standing instructions or a project memory file that is reloaded and never summarised, and, better still, enforced by a permission rule that denies writes to that file, since Module 3.4 showed that an instruction is advice and a deny rule is a barrier. The agent should have been asked to keep a notes file recording its assumptions, including the date format, so that the assumption was visible and checkable early. And the work should have had verification steps, such as checking a handful of converted dates against known values. Now, the right move is to stop, start a fresh session with a short correct summary and the right date format, and re-do the conversion from the untouched original.

</details>

@@starter
"""
Lab: Pack, Order, Compact, and Cache a Context
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""

CHUNKS = [
    {"id": "A", "tokens": 3000, "relevance": 9},
    {"id": "B", "tokens": 500, "relevance": 6},
    {"id": "C", "tokens": 4000, "relevance": 4},
    {"id": "D", "tokens": 800, "relevance": 8},
    {"id": "E", "tokens": 2500, "relevance": 2},
    {"id": "F", "tokens": 300, "relevance": 3},
    {"id": "G", "tokens": 1200, "relevance": 7},
]

HISTORY = [
    {"text": "SYSTEM: rules for the assistant", "tokens": 500, "pinned": True},
    {"text": "USER GOAL: keep the total under the 40,000 budget cap", "tokens": 300, "pinned": True},
    {"text": "tool result: contents of file A", "tokens": 4000, "pinned": False},
    {"text": "assistant: analysis of file A", "tokens": 800, "pinned": False},
    {"text": "tool result: contents of file B", "tokens": 5000, "pinned": False},
    {"text": "assistant: analysis of file B", "tokens": 700, "pinned": False},
    {"text": "user: latest question", "tokens": 200, "pinned": False},
]

STABLE = [("system instructions", 2000), ("tool descriptions", 3000), ("reference documents", 25000)]


# ---------------------------------------------------------------- Step 1
def pack_context(chunks, budget):
    """Choose chunks by value density. Each chunk is a dict with id, tokens, and relevance.
    Sort by relevance / tokens, highest first, breaking ties by id. Go through them in that
    order, adding a chunk whenever it still fits within the budget, and SKIPPING (not stopping)
    when it does not. Return (ids in the order chosen, total tokens used)."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def order_for_recall(ids_by_relevance):
    """ids_by_relevance is a list sorted from most to least relevant.
    Return it rearranged so the most relevant items are at the two ends:
    the items at positions 0, 2, 4, ... in order, followed by the items at
    positions 1, 3, 5, ... in REVERSE order.   [1, 2, 3, 4, 5] -> [1, 3, 5, 4, 2]"""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def expected_recall(relevances, floor=0.4):
    """relevances lists the relevance of each chunk in the order it appears in the context.
    The weight of position i (counting from 0) among n positions is
        floor + (1 - floor) * abs(2 * i / (n - 1) - 1)
    Return sum(relevance * weight) / sum(relevance), rounded to 3 decimal places.
    Return 0.0 for an empty list and 1.0 for a single chunk."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def compact(messages, budget, summary_tokens=200):
    """Each message is a dict with text, tokens, and pinned. Work on a copy of the list.
    While the total is over budget, remove the OLDEST message that is not pinned.
    The total is the tokens of the remaining messages, plus summary_tokens once anything
    has been removed. Stop if no unpinned message is left.
    If any were removed, insert at the position of the first removal:
        {"text": "[summary of N earlier messages]", "tokens": summary_tokens, "pinned": True}
    where N is the number removed. Return the new list."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def shared_prefix_tokens(first, second):
    """first and second are prompts, each a list of (text, tokens) segments.
    Go through them together from the start. While the segment texts are equal, add the
    segment's tokens. Stop at the first pair that differs. Return the total."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("packed :", pack_context(CHUNKS, 6000))
    print("ordered:", order_for_recall(["A", "D", "G", "B", "F"]))
    print("recall :", expected_recall([9, 8, 7, 6, 3]))
    print("compact:", compact(HISTORY, 7000))
    print("prefix :", shared_prefix_tokens(STABLE + [("question one", 50)], STABLE + [("question two", 50)]))

@@solution
"""
Lab solution: Pack, Order, Compact, and Cache a Context
Standard library only.
"""

CHUNKS = [
    {"id": "A", "tokens": 3000, "relevance": 9},
    {"id": "B", "tokens": 500, "relevance": 6},
    {"id": "C", "tokens": 4000, "relevance": 4},
    {"id": "D", "tokens": 800, "relevance": 8},
    {"id": "E", "tokens": 2500, "relevance": 2},
    {"id": "F", "tokens": 300, "relevance": 3},
    {"id": "G", "tokens": 1200, "relevance": 7},
]

HISTORY = [
    {"text": "SYSTEM: rules for the assistant", "tokens": 500, "pinned": True},
    {"text": "USER GOAL: keep the total under the 40,000 budget cap", "tokens": 300, "pinned": True},
    {"text": "tool result: contents of file A", "tokens": 4000, "pinned": False},
    {"text": "assistant: analysis of file A", "tokens": 800, "pinned": False},
    {"text": "tool result: contents of file B", "tokens": 5000, "pinned": False},
    {"text": "assistant: analysis of file B", "tokens": 700, "pinned": False},
    {"text": "user: latest question", "tokens": 200, "pinned": False},
]

STABLE = [("system instructions", 2000), ("tool descriptions", 3000), ("reference documents", 25000)]


# ---------------------------------------------------------------- Step 1
def pack_context(chunks, budget):
    """A short, highly relevant passage beats a long, moderately relevant one.
    A chunk that does not fit is skipped, because a smaller one further down may."""
    ranked = sorted(chunks, key=lambda chunk: (-chunk["relevance"] / chunk["tokens"], chunk["id"]))
    chosen, used = [], 0
    for chunk in ranked:
        if used + chunk["tokens"] <= budget:
            chosen.append(chunk["id"])
            used += chunk["tokens"]
    return chosen, used


# ---------------------------------------------------------------- Step 2
def order_for_recall(ids_by_relevance):
    """Deal the ranked list to the two ends: the beginning and end of a long context
    are used best, and the middle least."""
    return ids_by_relevance[0::2] + ids_by_relevance[1::2][::-1]


# ---------------------------------------------------------------- Step 3
def expected_recall(relevances, floor=0.4):
    """A U-shaped weight: 1 at the ends, the floor in the middle. An illustration of the
    'lost in the middle' finding, not a measurement of any model."""
    n = len(relevances)
    if n == 0:
        return 0.0
    if n == 1:
        return 1.0
    weights = [floor + (1 - floor) * abs(2 * i / (n - 1) - 1) for i in range(n)]
    return round(sum(r * w for r, w in zip(relevances, weights)) / sum(relevances), 3)


# ---------------------------------------------------------------- Step 4
def compact(messages, budget, summary_tokens=200):
    """Oldest unpinned material goes first. Pinned items survive any compaction: this is
    how a constraint stated once is kept from being summarised away."""
    kept, removed, position = list(messages), 0, None

    def total():
        return sum(message["tokens"] for message in kept) + (summary_tokens if removed else 0)

    while total() > budget:
        index = next((i for i, message in enumerate(kept) if not message["pinned"]), None)
        if index is None:
            break
        if position is None:
            position = index
        kept.pop(index)
        removed += 1
    if removed:
        kept.insert(position, {"text": f"[summary of {removed} earlier messages]", "tokens": summary_tokens, "pinned": True})
    return kept


# ---------------------------------------------------------------- Step 5
def shared_prefix_tokens(first, second):
    """A cache matches from the start and stops at the first difference. Anything that
    changes between requests must come after everything that does not."""
    shared = 0
    for (text_a, tokens_a), (text_b, _) in zip(first, second):
        if text_a != text_b:
            break
        shared += tokens_a
    return shared


def take_in_order(chunks, budget):
    """The naive alternative: take chunks as they arrive and stop at the first that does not fit."""
    chosen, used = [], 0
    for chunk in chunks:
        if used + chunk["tokens"] > budget:
            break
        chosen.append(chunk["id"])
        used += chunk["tokens"]
    return chosen, used


if __name__ == "__main__":
    relevance = {chunk["id"]: chunk["relevance"] for chunk in CHUNKS}
    for name, method in (("by value density", pack_context), ("in arrival order", take_in_order)):
        ids, used = method(CHUNKS, 6000)
        print(f"{name:<17} {ids}  {used} tokens  total relevance {sum(relevance[i] for i in ids)}")

    best_first = sorted(pack_context(CHUNKS, 6000)[0], key=lambda i: -relevance[i])
    ends_first = order_for_recall(best_first)
    print(best_first, expected_recall([relevance[i] for i in best_first]))
    print(ends_first, expected_recall([relevance[i] for i in ends_first]))
    print("best in the middle:", expected_recall([3, 7, 9, 8, 6]))

    print(sum(message["tokens"] for message in HISTORY), "tokens before")
    after = compact(HISTORY, 7000)
    for message in after:
        print(f"  {message['tokens']:>5}  {message['text']}")
    print(sum(message["tokens"] for message in after), "tokens after")

    print(shared_prefix_tokens(STABLE + [("question one", 50)], STABLE + [("question two", 50)]))
    print(shared_prefix_tokens([("time: 10:01", 10)] + STABLE + [("question one", 50)],
                               [("time: 10:02", 10)] + STABLE + [("question two", 50)]))
    print("recall question 1:", expected_recall([10, 6, 4, 2]), expected_recall([10, 4, 2, 6]), expected_recall([4, 10, 6, 2]))
    base = 30_000 / 1e6 * 2
    print(f"recall question 2: plain {40 * base:.2f}, cached {1.25 * base + 39 * 0.1 * base:.3f}, every request a write {40 * 1.25 * base:.2f}")

@@step
{
  "stepNumber": 1,
  "title": "Select under a token budget",
  "instruction": "Implement pack_context(chunks, budget). Each chunk is a dict with an id, a size in tokens, and a relevance score. Sort the chunks by relevance divided by tokens, highest first, using the id to break ties. Then go through them in that order with a running total of tokens used, starting at 0. If adding a chunk keeps the total within the budget, add its id to the chosen list and add its tokens to the total. If it does not fit, skip it and carry on, because a smaller chunk later may still fit. Return a tuple of the chosen ids, in the order chosen, and the total tokens used. This is the value-density method from Section 2. [MOD-5.3]",
  "hintConceptual": "With limited space, the best items are the ones that give the most value for the room they take. Rank by that, and keep filling until nothing else fits.",
  "hintSyntax": "ranked = sorted(chunks, key=lambda chunk: (-chunk[\"relevance\"] / chunk[\"tokens\"], chunk[\"id\"]))\nchosen, used = [], 0\nfor chunk in ranked:\n    if used + chunk[\"tokens\"] <= budget:\n        chosen.append(chunk[\"id\"])\n        used += chunk[\"tokens\"]\nreturn chosen, used"
}
@@assert
assert pack_context(CHUNKS, 6000) == (["B", "D", "F", "G", "A"], 5800), f"Densest first, then the large relevant chunk that still fits, got {pack_context(CHUNKS, 6000)}"
assert pack_context(CHUNKS, 5000) == (["B", "D", "F", "G"], 2800), "A is skipped when it no longer fits, and nothing after it fits either"
assert pack_context(CHUNKS, 3200) == (["B", "D", "F", "G"], 2800), "Chunks that do not fit are skipped, not a reason to stop"
assert pack_context(CHUNKS, 1700) == (["B", "D", "F"], 1600), "G no longer fits in 1,700"
assert pack_context(CHUNKS, 100) == ([], 0), "With a budget smaller than every chunk nothing is chosen"
assert pack_context([], 6000) == ([], 0), "No chunks, nothing chosen"
assert pack_context([{"id": "y", "tokens": 100, "relevance": 5}, {"id": "x", "tokens": 100, "relevance": 5}], 100) == (["x"], 100), "Equal densities are ordered by id"
assert pack_context([{"id": "big", "tokens": 900, "relevance": 9}, {"id": "small", "tokens": 100, "relevance": 2}], 1000) == (["small", "big"], 1000), "A budget that is exactly filled is allowed"
assert len(CHUNKS) == 7 and CHUNKS[0]["id"] == "A", "The list passed in must not be reordered"
print("Step 1 passed: density packing fills 5,800 of 6,000 tokens with the most valuable chunks.")

@@step
{
  "stepNumber": 2,
  "title": "Put the best material at the ends",
  "instruction": "Implement order_for_recall(ids_by_relevance). The input is a list sorted from most relevant to least. Return a new list with the items at positions 0, 2, 4 and so on, in order, followed by the items at positions 1, 3, 5 and so on in reverse order. For [1, 2, 3, 4, 5] the result is [1, 3, 5, 4, 2]: the most relevant item is first, the second most relevant is last, and the least relevant is in the middle. This is Rule 2 from Section 2, the response to the finding that material in the middle of a long context is used least. [MOD-5.3]",
  "hintConceptual": "Deal the ranked items alternately to the front and the back of the line, so that the strongest end up at the two ends and the weakest meet in the middle.",
  "hintSyntax": "return ids_by_relevance[0::2] + ids_by_relevance[1::2][::-1]"
}
@@assert
assert order_for_recall([1, 2, 3, 4, 5]) == [1, 3, 5, 4, 2], f"Got {order_for_recall([1, 2, 3, 4, 5])}"
assert order_for_recall(["A", "D", "G", "B", "F"]) == ["A", "G", "F", "B", "D"], "The most relevant is first and the second most relevant is last"
assert order_for_recall([1, 2, 3, 4]) == [1, 3, 4, 2], "An even number of items"
assert order_for_recall([1, 2]) == [1, 2], "Two items stay as they are: one at each end"
assert order_for_recall([1]) == [1], "One item is unchanged"
assert order_for_recall([]) == [], "An empty list gives an empty list"
_ranked = [1, 2, 3, 4, 5, 6, 7]
assert order_for_recall(_ranked)[0] == 1 and order_for_recall(_ranked)[-1] == 2 and order_for_recall(_ranked)[3] == 7, "For seven items the least relevant is exactly in the middle"
assert _ranked == [1, 2, 3, 4, 5, 6, 7], "The list passed in must not be changed"
print("Step 2 passed: the most relevant chunks go first and last, and the least relevant to the middle.")

@@step
{
  "stepNumber": 3,
  "title": "Score an arrangement",
  "instruction": "Implement expected_recall(relevances, floor). relevances gives the relevance of each chunk in the order the chunks appear in the context. With n chunks, the weight of position i, counting from 0, is floor + (1 - floor) * abs(2 * i / (n - 1) - 1), which is 1 at both ends and equal to the floor at the exact centre. Return the sum of relevance times weight, divided by the sum of the relevances, rounded to 3 decimal places. Return 0.0 for an empty list and 1.0 for a list of one. This is the expected recall from Section 2. Compare descending order with the ends-first order from Step 2. [MOD-5.3]",
  "hintConceptual": "Give each position a score for how well material placed there is used, high at the ends and low in the middle. An arrangement is good when its important chunks sit on high-scoring positions.",
  "hintSyntax": "n = len(relevances)\nif n == 0:\n    return 0.0\nif n == 1:\n    return 1.0\nweights = [floor + (1 - floor) * abs(2 * i / (n - 1) - 1) for i in range(n)]\nreturn round(sum(r * w for r, w in zip(relevances, weights)) / sum(relevances), 3)"
}
@@assert
assert expected_recall([9, 8, 7, 6, 3]) == 0.745, f"Descending order scores 0.745, got {expected_recall([9, 8, 7, 6, 3])}"
assert expected_recall([9, 7, 3, 6, 8]) == 0.827, "Ends-first order scores 0.827"
assert expected_recall([3, 7, 9, 8, 6]) == 0.7, "With the best chunk in the middle the score is 0.7"
assert expected_recall([10, 6, 4, 2]) == 0.818 and expected_recall([10, 4, 2, 6]) == 0.891 and expected_recall([4, 10, 6, 2]) == 0.709, "Recall question 1: 0.818, 0.891, and 0.709"
assert expected_recall([5]) == 1.0, "A single chunk is fully used"
assert expected_recall([]) == 0.0, "No chunks, no recall"
assert expected_recall([4, 4]) == 1.0, "Two chunks are both at an end"
assert expected_recall([1, 1, 1], floor=1.0) == 1.0, "With a floor of 1 position does not matter: the floor argument must be used"
assert expected_recall([0, 10, 0], floor=0.4) == 0.4, "A chunk at the exact centre is weighted by the floor"
print("Step 3 passed: the same chunks score 0.745 in descending order and 0.827 ends-first.")

@@step
{
  "stepNumber": 4,
  "title": "Compact a history without losing pinned facts",
  "instruction": "Implement compact(messages, budget, summary_tokens). Each message is a dict with text, tokens, and pinned. Work on a copy of the list. Keep a count of removed messages. The current total is the tokens of the messages still kept, plus summary_tokens once at least one message has been removed. While the total is greater than the budget, find the first message that is not pinned and remove it. If there is none, stop. Remember the position of the first removal. Afterwards, if anything was removed, insert at that position a dict with the text '[summary of N earlier messages]', where N is the number removed, tokens equal to summary_tokens, and pinned True. Return the new list. This is compaction with pinning from Section 2. [MOD-5.3]",
  "hintConceptual": "Make room by folding the oldest disposable material into a short summary. Anything marked as essential is never touched, and the summary takes the place of what it replaced.",
  "hintSyntax": "kept, removed, position = list(messages), 0, None\n\ndef total():\n    return sum(message[\"tokens\"] for message in kept) + (summary_tokens if removed else 0)\n\nwhile total() > budget:\n    index = next((i for i, message in enumerate(kept) if not message[\"pinned\"]), None)\n    if index is None:\n        break\n    if position is None:\n        position = index\n    kept.pop(index)\n    removed += 1\nif removed:\n    kept.insert(position, {\"text\": f\"[summary of {removed} earlier messages]\", \"tokens\": summary_tokens, \"pinned\": True})\nreturn kept"
}
@@assert
_after = compact(HISTORY, 7000)
assert [message["text"] for message in _after] == ["SYSTEM: rules for the assistant", "USER GOAL: keep the total under the 40,000 budget cap", "[summary of 2 earlier messages]", "tool result: contents of file B", "assistant: analysis of file B", "user: latest question"], f"The two oldest unpinned messages are replaced by a summary after the pinned ones, got {[message['text'] for message in _after]}"
assert sum(message["tokens"] for message in _after) == 6900, f"The compacted history is 6,900 tokens, got {sum(message['tokens'] for message in _after)}"
assert _after[2] == {"text": "[summary of 2 earlier messages]", "tokens": 200, "pinned": True}, "The summary records how many messages it replaced, has summary_tokens tokens, and is pinned"
assert len(HISTORY) == 7 and HISTORY[2]["text"] == "tool result: contents of file A", "The original list must not be changed"
assert compact(HISTORY, 12000) == HISTORY, "A history already within budget is returned unchanged, with no summary"
_tight = compact(HISTORY, 1100)
assert [message["text"] for message in _tight] == ["SYSTEM: rules for the assistant", "USER GOAL: keep the total under the 40,000 budget cap", "[summary of 5 earlier messages]"], "With a very small budget every unpinned message is summarised, and the pinned ones remain"
assert sum(message["tokens"] for message in compact(HISTORY, 100)) == 1000, "When only pinned messages are left the loop stops, even if still over budget"
assert compact(HISTORY, 7000, summary_tokens=1000)[2]["text"] == "[summary of 3 earlier messages]", "The summary's own size counts toward the budget: a larger summary forces a third removal"
assert compact([], 100) == [], "An empty history stays empty"
print("Step 4 passed: 11,500 tokens become 6,900, and the pinned goal survives.")

@@step
{
  "stepNumber": 5,
  "title": "How much of a prompt can be cached?",
  "instruction": "Implement shared_prefix_tokens(first, second). Each prompt is a list of (text, tokens) segments. Go through the two lists together from the start. For each pair of segments, if the texts are equal, add the first segment's tokens to a running total. At the first pair whose texts differ, stop. Return the total. This is Rule 3 from Section 2: a cache matches a prompt from its beginning and stops at the first difference. Compare two requests that differ only in the final question with two that also begin with a different timestamp. [MOD-5.3]",
  "hintConceptual": "Lay the two prompts side by side and read from the top. Everything up to the first place they differ can be reused. Nothing after it can, however similar it is.",
  "hintSyntax": "shared = 0\nfor (text_a, tokens_a), (text_b, _) in zip(first, second):\n    if text_a != text_b:\n        break\n    shared += tokens_a\nreturn shared"
}
@@assert
assert shared_prefix_tokens(STABLE + [("question one", 50)], STABLE + [("question two", 50)]) == 30000, f"With stable material first, 30,000 tokens are shared, got {shared_prefix_tokens(STABLE + [('question one', 50)], STABLE + [('question two', 50)])}"
assert shared_prefix_tokens([("time: 10:01", 10)] + STABLE, [("time: 10:02", 10)] + STABLE) == 0, "A different first segment means nothing is shared"
assert shared_prefix_tokens(STABLE, STABLE) == 30000, "Identical prompts share everything"
assert shared_prefix_tokens(STABLE[:2] + [("other documents", 25000)] + STABLE[2:], STABLE) == 5000, "Sharing stops at the first difference, even if later segments match"
assert shared_prefix_tokens(STABLE, STABLE[:1]) == 2000, "When one prompt is shorter, only the common part is counted"
assert shared_prefix_tokens([], STABLE) == 0, "An empty prompt shares nothing"
assert shared_prefix_tokens([("a", 5), ("b", 7)], [("a", 5), ("b", 7), ("c", 9)]) == 12, "A prompt that extends another shares the whole of the shorter one"
print("Step 5 passed: 30,000 tokens are reusable with stable material first, and none with a timestamp at the top.")
