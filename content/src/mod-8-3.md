@@meta
{
  "moduleId": "MOD-8.3",
  "slug": "mod-8-3",
  "unitId": "UNIT-8",
  "unitTitle": "Unit 8: Build Your Own AI Agents",
  "title": "LLM + Tools + Memory",
  "difficulty": "Intermediate",
  "estimatedMinutes": 95,
  "citations": [
    { "title": "Cognitive Architectures for Language Agents (CoALA)", "source": "arXiv (Sumers et al., 2023)", "url": "https://arxiv.org/abs/2309.02427" },
    { "title": "Generative Agents: Interactive Simulacra of Human Behavior", "source": "arXiv (Park et al., 2023)", "url": "https://arxiv.org/abs/2304.03442" },
    { "title": "Lost in the Middle: How Language Models Use Long Contexts", "source": "arXiv (Liu et al., 2023)", "url": "https://arxiv.org/abs/2307.03172" },
    { "title": "Memory tool", "source": "Claude Docs", "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool" },
    { "title": "Tool use with Claude", "source": "Claude Docs", "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview" }
  ],
  "videoLibrary": [
    {
      "id": "VID-8.3-1",
      "title": "What is Tool Calling? Connecting LLMs to Your Data",
      "creator": "IBM Technology",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=h8gMhXYAv1k",
      "timingInstruction": "Watch after reading Section 1, before the tools part of Section 2",
      "keyTakeaway": "How a model asks the application to run a tool and uses the result, rather than running anything itself."
    },
    {
      "id": "VID-8.3-2",
      "title": "AI Agent Memory Explained: Short Term, Long Term, Episodic",
      "creator": "Agent Engineering",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=Mxso0FUP_Ns",
      "timingInstruction": "Watch after the memory types table in Section 2, before Step 3 of the lab",
      "keyTakeaway": "The kinds of agent memory and where each one lives."
    },
    {
      "id": "VID-8.3-3",
      "title": "What is AI agent memory? Short-term memory vs. long-term memory",
      "creator": "Elastic",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=N--Uo8VCgyI",
      "timingInstruction": "Watch after the lab, as a short recap of the distinction between context and stored memory",
      "keyTakeaway": "Short-term memory is the context window; long-term memory is an external store the agent reads and writes."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Trim Context, Compact History, Store Facts, Recall Episodes, Decide What to Remember",
    "context": "The tool shop's restock agent works across many conversations and must remember supplier facts and lessons from past runs without bloating its context or storing anything it should not. You will trim a conversation to a token budget without splitting tool calls from their results, compact old history into a summary, keep a fact store where newer facts win, recall relevant past episodes, and filter candidate memories for secrets, personal data, low confidence, and duplicates.",
    "language": "python"
  }
}

@@reading
# LLM + Tools + Memory

An agent is often summarised as three things: a language model that reasons, tools that let it act and observe, and memory that lets it keep what it learns. Module 8.2 described the architecture around them. This chapter looks at each of the three more closely: what a language model can and cannot do as the reasoning engine, why tools are its hands and eyes, and the different kinds of memory an agent needs, from the context window it works in right now to the facts and experiences it keeps between runs.

Memory is where most agent designs go wrong. Keep too little, and the agent forgets the task or repeats yesterday's mistakes. Keep too much, and the context fills with noise, costs climb, and the model misses what matters. Store the wrong things, and the agent's memory becomes a store of secrets and personal data. The lab builds the mechanics that prevent all three.

## 1. First-Principles Mental Model & Intuition

### A consultant with a notepad, a phone, and a filing cabinet

Picture a consultant working on a client problem. Their **mind** reasons, but knows only what they learned before the engagement and what is in front of them now. Their **phone** lets them call people and look things up: their hands and eyes in the world. Their **notepad** holds what they are working on at this moment: limited space, so old notes get summarised or torn off. Their **filing cabinet** holds what they will need again: facts about the client, records of past engagements, and lessons learned.

```text
   MODEL (the mind)          reasons over whatever is in the context window
        |
        |  reads and writes
        v
   CONTEXT WINDOW (notepad)  system prompt, task, recent messages, tool results    short-term, limited
        |
        |  tool calls                         recall / store
        v                                          |
   TOOLS (phone)                             LONG-TERM MEMORY (filing cabinet)
   look up, compute, act                      semantic: facts       "Acme Saws needs PO numbers"
                                              episodic: past runs   "Last restock: checked reorder levels"
                                              procedural: how-to    prompts and skills
```

### What each part contributes

| Part | Gives the agent | Lacks on its own |
|---|---|---|
| Model | Reasoning, language, planning | Current facts, memory between calls, reliable arithmetic |
| Tools | Fresh data, calculation, actions | Judgement about when to use them |
| Context window | Everything the model can see now | Persistence, unlimited space |
| Long-term memory | Knowledge across runs | Relevance unless retrieved well |

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### The model as reasoning engine, and its limits

A language model is a remarkable reasoning engine with well-known limits, each of which an agent design must work around:

| Limit | Consequence | Workaround |
|---|---|---|
| Knowledge cutoff | Does not know recent facts | Tools that fetch current data |
| No memory between calls | Every call starts fresh | The application resends history; long-term stores |
| Unreliable exact calculation | Small arithmetic errors | Calculation tools, code |
| Fluent mistakes | Confident wrong answers | Grounding in tool results, checks |
| Finite context | Cannot see everything at once | Retrieval, trimming, summaries |

The design principle is to let the model do what it is good at, deciding, interpreting, writing, and give everything else to tools and code.

### Tools: hands and eyes

A tool is a function the application exposes to the model with a name, a description, and an input schema. The model never runs anything itself: it asks for a tool call, the application runs the code, and the result comes back as the next message, the loop of Module 8.1. Tools come in three broad kinds:

| Kind | Examples | Risk |
|---|---|---|
| Read | Stock lookup, search, read a file | Low; can still leak data |
| Compute | Calculator, code execution, date arithmetic | Low |
| Act | Place an order, send an email, update a record | High; needs limits and approval |

Modules 8.4 and 8.5 cover defining and designing tools. For this chapter, the key point is that tool results are the agent's evidence: they enter the context window, take up space there, and are resent on every later turn.

### Short-term memory: the context window

Everything the model knows during a run is in its **context window**: the system prompt, the task, and the history of messages, tool calls, and results. It is large on current models but not free: Module 8.1 showed that input tokens grow with the square of the number of turns. Size is not the only problem. Research by Liu and colleagues, "Lost in the Middle", found that models use information at the beginning and end of a long context more reliably than information in the middle. A bloated context is both expensive and less effective.

Two techniques keep the context under control.

**Trimming** drops the oldest messages when the history passes a budget, with two rules that matter:

1. **Pin what must never be lost:** the system prompt and the original task. An agent that trims away its task statement carries on working without knowing what it was asked to do.
2. **Never split a tool call from its result.** APIs require each tool result to follow the call that produced it, and a result without its call, or a call without its result, confuses the model or is rejected outright. Calls and results are trimmed as pairs.

**Compaction** replaces old messages with a short summary, keeping recent messages verbatim. It preserves the gist of earlier work, which trimming throws away, at the cost of a summarisation call. The same pair rule applies at the boundary: the cut between summarised and kept messages must not fall between a call and its result. Some model platforms now provide compaction as a built-in feature for very long conversations.

### Long-term memory and its kinds

The CoALA framework, "Cognitive Architectures for Language Agents" by Sumers and colleagues, borrows from cognitive science to organise agent memory:

| Kind | Holds | Example | Typical store |
|---|---|---|---|
| Working | The current context | This conversation | The context window |
| Semantic | Facts about the world | "Acme Saws needs a PO number on every order" | Key-value store, database, documents |
| Episodic | Records of past experiences | "On day 12, restocked chisels; lesson: check reorder level" | Log of runs with outcomes |
| Procedural | How to do things | System prompts, skills, code | Files, prompt library |

Long-term memory lives outside the model and is read and written through tools or by the controller. Anthropic's memory tool documentation, for instance, describes a tool through which the model creates, reads, and updates files in a memory directory that persists between conversations, with the application deciding where and how those files are stored.

### Writing facts: newer wins, history kept

Semantic memory must handle facts that change. A supplier's lead time was five days in October and three days now. The rule is simple: store each fact with its **source** and **timestamp**; a newer fact replaces an older one, and the older value goes into a history list rather than being lost; an older fact arriving late must not overwrite a newer one. Keeping the source means the agent can say where it learned something, and the history allows auditing and correction.

### Recalling episodes: relevance and recency

An agent cannot read all its past episodes on every run; it must **recall** the few most relevant. The Generative Agents paper by Park and colleagues scored memories by a combination of **relevance** to the current situation, **recency**, and **importance**. A simple version scores each episode by the number of meaningful words it shares with the current task, ignoring common filler words, and breaks ties by recency, returning the top few. Production systems usually measure relevance with embeddings instead of shared words, as Modules 8.7 and 8.8 explain.

### Deciding what to remember

The most neglected memory question is what *not* to store. Anything written to memory will be read back into future contexts, possibly in different conversations, possibly shown to different people. A memory **write policy** filters candidates:

| Reject | Why |
|---|---|
| Secrets: API keys, passwords, card numbers | Memory is not a credential store; Module 7.15 |
| Personal data not needed for the business purpose | Privacy law and trust; data minimisation |
| Low-confidence guesses | They become "facts" when recalled later |
| Duplicates | Clutter and wasted context |

A policy written in code is applied every time; asking the model to "only remember important things" is not.

### Complexity

Trimming and compaction are linear in the number of messages. Fact storage is a constant-time dictionary update. Episode recall is linear in the number of episodes times the words compared. The write policy is linear in the candidate's length.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, trimming to a budget with pinned messages and intact pairs.

```python
import math
import re

def tokens(text):
    return math.ceil(len(text) / 4)

HISTORY = [{"role": "system", "content": "You are the restock agent for Tidy Tools."},
           {"role": "user", "content": "Restock saws and chisels for next week, please."},
           {"role": "assistant", "content": "call stock(SAW-3)", "pair": 1},
           {"role": "tool", "content": "SAW-3: 0 in stock", "pair": 1},
           {"role": "assistant", "content": "call stock(CHI-6)", "pair": 2},
           {"role": "tool", "content": "CHI-6: 5 in stock, reorder level 10", "pair": 2},
           {"role": "user", "content": "Also check hammers."}]

def trim_history(messages, budget):
    first_user = next((i for i, m in enumerate(messages) if m["role"] == "user"), None)
    pinned = [m for i, m in enumerate(messages) if m["role"] == "system" or i == first_user]
    rest = [m for i, m in enumerate(messages) if not (m["role"] == "system" or i == first_user)]
    used = sum(tokens(m["content"]) for m in pinned)
    groups, i = [], 0
    while i < len(rest):
        group = [rest[i]]
        while rest[i].get("pair") is not None and i + 1 < len(rest) and rest[i + 1].get("pair") == rest[i]["pair"]:
            i += 1
            group.append(rest[i])
        groups.append(group)
        i += 1
    kept = []
    for group in reversed(groups):
        cost = sum(tokens(m["content"]) for m in group)
        if used + cost > budget:
            break
        kept = group + kept
        used += cost
    return pinned + kept, used

print([tokens(m["content"]) for m in HISTORY])
for budget in (200, 50, 40, 22):
    kept, used = trim_history(HISTORY, budget)
    print(budget, used, [m["content"][:10] for m in kept])
```

- **Tokens are estimated as characters divided by four.** A rough rule for English; real systems count with the provider's tokenizer.
- **The system prompt and the first user message are pinned.** They are always kept, even if together they exceed the budget, because without them the agent has no role and no task.
- **Messages sharing a pair number form one group.** A tool call and its result are kept or dropped together.
- **Groups are kept from the newest backwards until the budget is reached.** Recent context matters most for the next step.
- **With a budget of 200 everything fits, 52 tokens. With 50, the first stock lookup is dropped as a pair, leaving 42.** With 40, only the pinned messages and the latest user message fit, 28 tokens; the CHI-6 pair would take it to 42.
- **With 22, the pinned messages alone use 23.** They are kept anyway, and the used figure reports the overrun honestly.

Next, compacting old history.

```python
def compact(messages, keep_last, summarise):
    system = [m for m in messages if m["role"] == "system"]
    rest = [m for m in messages if m["role"] != "system"]
    start = len(rest) - keep_last
    if start <= 0:
        return messages
    while start > 0 and rest[start].get("pair") is not None and rest[start - 1].get("pair") == rest[start]["pair"]:
        start -= 1
    summary = {"role": "user", "content": "Summary of earlier work: " + summarise(rest[:start])}
    return system + [summary] + rest[start:]

tool_results = lambda messages: "; ".join(m["content"] for m in messages if m["role"] == "tool")
print([m["content"] for m in compact(HISTORY, 2, tool_results)])
print([m["content"] for m in compact(HISTORY, 1, tool_results)])
```

- **The newest messages are kept verbatim; older ones become a summary message.** The summariser here just joins tool results; in practice it is a model call asked to keep facts, decisions, and open questions.
- **The cut never splits a pair.** Asking to keep the last 2 messages would separate the CHI-6 call from its result, so the boundary moves back one message and keeps both.
- **Keeping only the last message summarises both lookups.** The summary carries "SAW-3: 0 in stock; CHI-6: 5 in stock, reorder level 10" forward in one line.
- **The original task is inside the summarised part here.** A production summariser must always restate the task; pinning it, as in trimming, is safer still.

Then, facts and episodes.

```python
def remember_fact(store, key, value, source, when):
    old = store.get(key)
    if old and old["updated"] > when:
        return store[key], False
    history = old["history"] + [(old["value"], old["updated"])] if old else []
    store[key] = {"value": value, "source": source, "updated": when, "history": history}
    return store[key], True

facts = {}
print(remember_fact(facts, "supplier:SAW-3", "Acme Saws, 5-day lead time", "supplier email", "2026-11-02"))
print(remember_fact(facts, "supplier:SAW-3", "Acme Saws, 3-day lead time", "supplier portal", "2026-11-14"))
print(remember_fact(facts, "supplier:SAW-3", "Acme Saws, 7-day lead time", "old note", "2026-10-01")[1])

WORD = re.compile(r"[a-z0-9]+")
FILLER = {"a", "an", "the", "and", "to", "for", "of", "next", "wants", "customer", "week"}

def recall(episodes, query, k=2):
    wanted = set(WORD.findall(query.lower())) - FILLER
    scored = []
    for episode in episodes:
        words = set(WORD.findall((episode["task"] + " " + " ".join(episode["tags"])).lower())) - FILLER
        overlap = len(wanted & words)
        if overlap:
            scored.append((overlap, episode["day"], episode["id"]))
    scored.sort(key=lambda item: (-item[0], -item[1]))
    return [item[2] for item in scored[:k]]

EPISODES = [{"id": "e1", "day": 3, "task": "Restock saws from Acme", "tags": ["restock", "supplier"], "lesson": "Acme needs PO numbers"},
            {"id": "e2", "day": 9, "task": "Refund a damaged chisel order", "tags": ["refund"], "lesson": "Ask for photos first"},
            {"id": "e3", "day": 12, "task": "Restock chisels and saws", "tags": ["restock"], "lesson": "Check the reorder level"},
            {"id": "e4", "day": 14, "task": "Answer a delivery question", "tags": ["delivery"], "lesson": "Use the eta tool"}]
print(recall(EPISODES, "restock saws next week"), recall(EPISODES, "customer wants a refund"), recall(EPISODES, "printer jam"))
```

- **Facts are stored with their source and date.** ISO dates compare correctly as text.
- **A newer fact replaces the old one, which moves into history.** The lead time is now 3 days from the supplier portal, with the 5-day figure kept for reference.
- **An older fact arriving late is refused.** The note from October does not overwrite November's fact.
- **Recall scores episodes by shared meaningful words.** Filler words such as "a" and "the" are removed first, or every episode would match every query.
- **"Restock saws" recalls e3 and e1.** Both share "restock" and "saws"; e3 is more recent, so it comes first.
- **"Customer wants a refund" recalls only e2, and "printer jam" nothing.** An empty recall is the right answer when nothing relevant exists.

Finally, the write policy.

```python
SECRET = re.compile(r"(sk-[A-Za-z0-9_-]{8,}|\b\d{13,19}\b|password)", re.IGNORECASE)
EMAIL = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")

def should_remember(candidate, existing, min_confidence=0.8):
    text = candidate["text"]
    if SECRET.search(text):
        return False, "secret"
    if EMAIL.search(text) and not candidate.get("about_business"):
        return False, "personal_data"
    if candidate["confidence"] < min_confidence:
        return False, "low_confidence"
    if text.strip().lower() in {entry.strip().lower() for entry in existing}:
        return False, "duplicate"
    return True, None

EXISTING = ["Acme Saws requires a PO number on every order."]
for candidate in [{"text": "Acme Saws lead time is 3 working days.", "confidence": 0.9},
                  {"text": "API key sk-live-4f9a8b7c6d5e for the supplier portal", "confidence": 0.99},
                  {"text": "Customer priya@example.com likes weekend delivery", "confidence": 0.9},
                  {"text": "orders@acme-saws.example handles purchase orders", "confidence": 0.95, "about_business": True},
                  {"text": "The warehouse might close early on Fridays", "confidence": 0.5},
                  {"text": "acme saws requires a PO number on every order.", "confidence": 0.9}]:
    print(should_remember(candidate, EXISTING))
```

- **A stable, confident business fact is accepted.**
- **Anything that looks like a secret is rejected first.** API keys, long digit strings that may be card numbers, and passwords never enter memory.
- **A customer's email address is personal data and is rejected.** A supplier's order address, marked as being about the business, is accepted.
- **A guess at 0.5 confidence is rejected.** Stored, it would come back later looking like a fact.
- **A duplicate differing only in capitals is rejected.**

**Complexity.** `trim_history` and `compact` are linear in the messages. `remember_fact` is constant time. `recall` is linear in the episodes times their words. `should_remember` is linear in the text length plus the existing memories.

### A memory design for the restock agent

```text
WORKING      context: system prompt + task pinned; tool call/result pairs; budget 40,000 tokens
             compaction above 30,000 tokens: summary of facts found, decisions, open questions
SEMANTIC     supplier facts keyed "supplier:SKU"; value, source, date; newer wins; history kept
EPISODIC     one record per run: task, outcome, lesson, tags, day; recall top 3 by relevance and recency
PROCEDURAL   system prompt and restock checklist in version control
WRITE POLICY no secrets, no customer personal data, confidence >= 0.8, no duplicates
REVIEW       monthly: delete stale facts, check lessons still hold
```

### Memory failure modes

| Symptom | Likely cause |
|---|---|
| Agent forgets its task mid-run | Task not pinned during trimming |
| API rejects the conversation | Tool call separated from its result |
| Agent repeats a past mistake | Lessons not stored, or not recalled |
| Agent states an outdated fact | Old fact overwrote a newer one, or no dates kept |
| Secrets appear in later conversations | No write policy |
| Long runs get worse, not better | Context bloated; information lost in the middle |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Trimming away the task.** Oldest-first trimming deletes the original request. Pin it.

**Splitting call and result.** Many APIs reject a tool result without its call. Trim and compact in pairs.

**Summaries that drop decisions.** A summary of "what happened" without "what we decided" leads to repeated work. Ask the summariser for facts, decisions, and open questions.

**Memory as a dumping ground.** Storing everything makes recall noisy and expensive. Write only what will be useful again.

**No timestamps.** Without dates, an agent cannot tell a current fact from a stale one.

**Secrets in memory.** A key mentioned once and stored becomes visible in every later context. Filter before writing.

**Personal data across users.** Memory shared between conversations must never carry one customer's details into another's.

**Trusting recalled facts blindly.** A remembered fact may be wrong or outdated. Prefer a fresh tool lookup when the fact matters.

**Keyword recall missing synonyms.** "Restock" will not find "replenish". Use embeddings for recall at scale.

**Huge tool outputs.** A 5,000-line tool result fills the context and is resent every turn. Return summaries and let the agent ask for detail.

**Letting the model decide what to remember, unchecked.** Model judgement plus a code policy is safer than either alone.

**Never cleaning memory.** Stale lessons and facts accumulate. Review and expire them.

## 5. Active Recall Check & Synthesis Summary

**Summary.** An agent combines a language model as reasoning engine, which lacks current knowledge, memory between calls, and reliable arithmetic, with tools that fetch, compute, and act, and memory of several kinds. Short-term or working memory is the context window, which grows every turn and is used less reliably in the middle, so it is managed by trimming, which keeps the system prompt and original task pinned, drops the oldest material first, and never separates a tool call from its result, and by compaction, which replaces older messages with a summary at a boundary that also respects pairs. Long-term memory, organised in the CoALA framework as semantic facts, episodic records of past runs, and procedural knowledge, lives outside the model and is accessed through tools or the controller. Facts are stored with source and date, newer facts replace older ones while history is kept, and late-arriving older facts are refused. Episodes are recalled by relevance, here shared meaningful words, and recency, as in the Generative Agents work. A write policy in code rejects secrets, unnecessary personal data, low-confidence guesses, and duplicates before anything is remembered.

**Question 1.** An agent's context budget is 30 tokens. Its history is the system prompt (11 tokens), the task (12 tokens), a stock lookup call and result (5 and 5), another call and result (5 and 9), and a final user message (5). Using `trim_history`, what is kept and what is the reported usage? What would an unpinned, oldest-first trim have dropped, and why does that matter?

<details>
<summary>View Answer</summary>

The pinned messages, the system prompt and the task, cost 11 + 12 = 23 tokens and are kept regardless. Working backwards from the newest group: the final user message costs 5, bringing usage to 28, within 30, so it is kept; the second call and result together cost 14, which would make 42, over budget, so trimming stops there, and the first pair, older still, is not considered. The kept history is the system prompt, the task, and "Also check hammers", with a reported usage of 28 tokens. An unpinned, oldest-first trim would have dropped the task message first, since it is the oldest non-system message, keeping tool results instead. The agent would then still see "Also check hammers" but not the original request to restock saws and chisels, so it might check hammers and stop, or report on stock without placing the orders it was asked for, doing exactly the wrong work while appearing to function normally.

</details>

**Question 2.** The fact store holds "supplier:SAW-3" as "5-day lead time" from a supplier email dated 2026-11-02. Three updates arrive in this order: "3-day lead time" from the supplier portal dated 2026-11-14; "7-day lead time" from an old note dated 2026-10-01; "4-day lead time" from a phone call dated 2026-11-14. Using `remember_fact`, give the final value and history, and explain one weakness the third update reveals.

<details>
<summary>View Answer</summary>

The first update, dated 2026-11-14, is newer than 2026-11-02, so it is stored: value "3-day lead time" from the supplier portal, with history containing the 5-day value and its date. The second, dated 2026-10-01, is older than the stored 2026-11-14, so it is refused and nothing changes. The third, dated 2026-11-14, is not older than the stored date, since the check refuses only strictly older facts, so it replaces the portal's value: the final value is "4-day lead time" from the phone call, dated 2026-11-14, with history holding the 5-day value from 2026-11-02 and the 3-day value from 2026-11-14. The weakness is that two facts with the same date conflict, and the rule silently lets the last one win, even though a supplier portal is probably more authoritative than a phone call recorded in a note. Remedies include storing full timestamps rather than dates, ranking sources by reliability so a less trusted source cannot overwrite a more trusted one on the same day, and flagging conflicting same-day facts for a person to resolve.

</details>

**Question 3.** For each candidate memory, state what `should_remember` returns and whether you agree: (a) "Supplier portal password is Tidy2026!" with confidence 1.0; (b) "Order A1234 was refunded because the saw arrived bent" with confidence 0.95; (c) "Customer sam@gym.example prefers phone calls" with confidence 0.9; (d) "Acme Saws closes on bank holidays" with confidence 0.7.

<details>
<summary>View Answer</summary>

(a) The word "password" matches the secret pattern, so it is rejected as "secret", correctly: credentials belong in a credential store, as Module 7.15 explained, and anything in memory can surface in later contexts or logs. (b) It contains no secret pattern, no email address, its confidence 0.95 is above 0.8, and it is not a duplicate, so it is accepted. That seems reasonable as an episodic lesson, though it is arguably better stored in the order system, the source of truth, than in agent memory, and if it named the customer it would need the same care as (c). (c) The email address matches and the candidate is not marked as being about the business, so it is rejected as "personal_data". That is the cautious default, but a customer's contact preference may be legitimate business data; if so, it belongs in the CRM under that customer's record with proper access controls, not in a shared agent memory that other conversations could read. (d) Its confidence 0.7 is below 0.8, so it is rejected as "low_confidence", which is right: a guess about opening hours, stored, would come back later looking like a fact. The better route is to confirm it through a tool or the supplier and store it with that source.

</details>

@@starter
"""
Lab: Trim Context, Compact History, Store Facts, Recall Episodes, Decide What to Remember
Standard library only. No network calls. Complete the TODO in each step, then press "Run & Verify Step".
"""
import math
import re

HISTORY = [{"role": "system", "content": "You are the restock agent for Tidy Tools."},
           {"role": "user", "content": "Restock saws and chisels for next week, please."},
           {"role": "assistant", "content": "call stock(SAW-3)", "pair": 1},
           {"role": "tool", "content": "SAW-3: 0 in stock", "pair": 1},
           {"role": "assistant", "content": "call stock(CHI-6)", "pair": 2},
           {"role": "tool", "content": "CHI-6: 5 in stock, reorder level 10", "pair": 2},
           {"role": "user", "content": "Also check hammers."}]
EPISODES = [{"id": "e1", "day": 3, "task": "Restock saws from Acme", "tags": ["restock", "supplier"], "lesson": "Acme needs PO numbers"},
            {"id": "e2", "day": 9, "task": "Refund a damaged chisel order", "tags": ["refund"], "lesson": "Ask for photos first"},
            {"id": "e3", "day": 12, "task": "Restock chisels and saws", "tags": ["restock"], "lesson": "Check the reorder level"},
            {"id": "e4", "day": 14, "task": "Answer a delivery question", "tags": ["delivery"], "lesson": "Use the eta tool"}]
WORD = re.compile(r"[a-z0-9]+")
FILLER = {"a", "an", "the", "and", "to", "for", "of", "next", "wants", "customer", "week"}
SECRET = re.compile(r"(sk-[A-Za-z0-9_-]{8,}|\b\d{13,19}\b|password)", re.IGNORECASE)
EMAIL = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")


def tokens(text):
    """Given: a rough estimate, characters divided by four, rounded up."""
    return math.ceil(len(text) / 4)


# ---------------------------------------------------------------- Step 1
def trim_history(messages, budget):
    """Pinned = system messages and the first user message (always kept). Group the rest so consecutive messages with
    the same non-None "pair" stay together. From the newest group backwards, keep groups while used + cost <= budget;
    stop at the first that does not fit. Return (pinned + kept groups in original order, tokens used)."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def compact(messages, keep_last, summarise):
    """System messages stay. Of the rest, the last keep_last are kept, moving the boundary back while it would split a
    pair. If nothing is older, return messages unchanged. Otherwise return system + [{"role": "user", "content":
    "Summary of earlier work: " + summarise(older messages)}] + kept."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def remember_fact(store, key, value, source, when):
    """If an existing entry is newer (its "updated" > when), return (existing, False). Otherwise store {"value", "source",
    "updated": when, "history": old history + [(old value, old updated)] or []} and return (entry, True)."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def recall(episodes, query, k=2):
    """Query words and episode words (task plus tags) via WORD on lower-case text, minus FILLER. Score = overlap count.
    Keep episodes with overlap, sorted by overlap descending then day descending. Return the first k ids."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def should_remember(candidate, existing, min_confidence=0.8):
    """In order: SECRET match -> (False, "secret"); EMAIL match unless about_business -> (False, "personal_data");
    confidence below min -> (False, "low_confidence"); stripped lower-case text equal to an existing one ->
    (False, "duplicate"); otherwise (True, None)."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("trim  :", trim_history(HISTORY, 200))
    print("recall:", recall(EPISODES, "restock saws"))

@@solution
"""
Lab solution: Trim Context, Compact History, Store Facts, Recall Episodes, Decide What to Remember
Standard library only. No network calls.
"""
import math
import re

HISTORY = [{"role": "system", "content": "You are the restock agent for Tidy Tools."},
           {"role": "user", "content": "Restock saws and chisels for next week, please."},
           {"role": "assistant", "content": "call stock(SAW-3)", "pair": 1},
           {"role": "tool", "content": "SAW-3: 0 in stock", "pair": 1},
           {"role": "assistant", "content": "call stock(CHI-6)", "pair": 2},
           {"role": "tool", "content": "CHI-6: 5 in stock, reorder level 10", "pair": 2},
           {"role": "user", "content": "Also check hammers."}]
EPISODES = [{"id": "e1", "day": 3, "task": "Restock saws from Acme", "tags": ["restock", "supplier"], "lesson": "Acme needs PO numbers"},
            {"id": "e2", "day": 9, "task": "Refund a damaged chisel order", "tags": ["refund"], "lesson": "Ask for photos first"},
            {"id": "e3", "day": 12, "task": "Restock chisels and saws", "tags": ["restock"], "lesson": "Check the reorder level"},
            {"id": "e4", "day": 14, "task": "Answer a delivery question", "tags": ["delivery"], "lesson": "Use the eta tool"}]
WORD = re.compile(r"[a-z0-9]+")
FILLER = {"a", "an", "the", "and", "to", "for", "of", "next", "wants", "customer", "week"}
SECRET = re.compile(r"(sk-[A-Za-z0-9_-]{8,}|\b\d{13,19}\b|password)", re.IGNORECASE)
EMAIL = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")


def tokens(text):
    """Given: a rough estimate, characters divided by four, rounded up."""
    return math.ceil(len(text) / 4)


# ---------------------------------------------------------------- Step 1
def trim_history(messages, budget):
    """Pin the role and the task; drop the oldest first; never split a tool call from its result."""
    first_user = next((i for i, m in enumerate(messages) if m["role"] == "user"), None)
    pinned = [m for i, m in enumerate(messages) if m["role"] == "system" or i == first_user]
    rest = [m for i, m in enumerate(messages) if not (m["role"] == "system" or i == first_user)]
    used = sum(tokens(m["content"]) for m in pinned)
    groups, i = [], 0
    while i < len(rest):
        group = [rest[i]]
        while rest[i].get("pair") is not None and i + 1 < len(rest) and rest[i + 1].get("pair") == rest[i]["pair"]:
            i += 1
            group.append(rest[i])
        groups.append(group)
        i += 1
    kept = []
    for group in reversed(groups):
        cost = sum(tokens(m["content"]) for m in group)
        if used + cost > budget:
            break
        kept = group + kept
        used += cost
    return pinned + kept, used


# ---------------------------------------------------------------- Step 2
def compact(messages, keep_last, summarise):
    """Summarise the old, keep the recent verbatim, and cut only between pairs."""
    system = [m for m in messages if m["role"] == "system"]
    rest = [m for m in messages if m["role"] != "system"]
    start = len(rest) - keep_last
    if start <= 0:
        return messages
    while start > 0 and rest[start].get("pair") is not None and rest[start - 1].get("pair") == rest[start]["pair"]:
        start -= 1
    summary = {"role": "user", "content": "Summary of earlier work: " + summarise(rest[:start])}
    return system + [summary] + rest[start:]


# ---------------------------------------------------------------- Step 3
def remember_fact(store, key, value, source, when):
    """Newer wins, history is kept, and a late-arriving older fact is refused."""
    old = store.get(key)
    if old and old["updated"] > when:
        return store[key], False
    history = old["history"] + [(old["value"], old["updated"])] if old else []
    store[key] = {"value": value, "source": source, "updated": when, "history": history}
    return store[key], True


# ---------------------------------------------------------------- Step 4
def recall(episodes, query, k=2):
    """Relevance first, recency second; nothing relevant means nothing recalled."""
    wanted = set(WORD.findall(query.lower())) - FILLER
    scored = []
    for episode in episodes:
        words = set(WORD.findall((episode["task"] + " " + " ".join(episode["tags"])).lower())) - FILLER
        overlap = len(wanted & words)
        if overlap:
            scored.append((overlap, episode["day"], episode["id"]))
    scored.sort(key=lambda item: (-item[0], -item[1]))
    return [item[2] for item in scored[:k]]


# ---------------------------------------------------------------- Step 5
def should_remember(candidate, existing, min_confidence=0.8):
    """A write policy in code: no secrets, no unneeded personal data, no guesses, no duplicates."""
    text = candidate["text"]
    if SECRET.search(text):
        return False, "secret"
    if EMAIL.search(text) and not candidate.get("about_business"):
        return False, "personal_data"
    if candidate["confidence"] < min_confidence:
        return False, "low_confidence"
    if text.strip().lower() in {entry.strip().lower() for entry in existing}:
        return False, "duplicate"
    return True, None


if __name__ == "__main__":
    for budget in (200, 50, 40, 30, 22):
        kept, used = trim_history(HISTORY, budget)
        print(budget, used, len(kept))
    joiner = lambda messages: "; ".join(m["content"] for m in messages if m["role"] == "tool")
    print([m["content"] for m in compact(HISTORY, 2, joiner)])
    store = {}
    for value, source, when in [("3-day lead time", "supplier portal", "2026-11-14"), ("7-day lead time", "old note", "2026-10-01"), ("4-day lead time", "phone call", "2026-11-14")]:
        remember_fact(store, "supplier:SAW-3", value, source, when)
    print(store)
    print(recall(EPISODES, "restock saws next week"), recall(EPISODES, "customer wants a refund"))

@@step
{
  "stepNumber": 1,
  "title": "Trim the context to a budget",
  "instruction": "Implement trim_history(messages, budget). Pin the system messages and the first user message; they are always kept. Group the remaining messages so that consecutive messages with the same pair number stay together. Starting from the newest group, keep groups while the tokens used, counted with tokens(), stay within the budget, and stop at the first group that does not fit. Return the pinned messages followed by the kept groups in their original order, and the tokens used. Trim HISTORY to several budgets. This is trimming from Section 2. [MOD-8.3]",
  "hintConceptual": "Tearing pages off a full notepad: never the first page, which has the assignment on it, always the oldest pages after that, and never half of a phone call's notes.",
  "hintSyntax": "first_user = next((i for i, m in enumerate(messages) if m[\"role\"] == \"user\"), None)\npinned = [m for i, m in enumerate(messages) if m[\"role\"] == \"system\" or i == first_user]\nrest = [m for i, m in enumerate(messages) if not (m[\"role\"] == \"system\" or i == first_user)]\nused = sum(tokens(m[\"content\"]) for m in pinned)\ngroups, i = [], 0\nwhile i < len(rest):\n    group = [rest[i]]\n    while rest[i].get(\"pair\") is not None and i + 1 < len(rest) and rest[i + 1].get(\"pair\") == rest[i][\"pair\"]:\n        i += 1\n        group.append(rest[i])\n    groups.append(group)\n    i += 1\nkept = []\nfor group in reversed(groups):\n    cost = sum(tokens(m[\"content\"]) for m in group)\n    if used + cost > budget:\n        break\n    kept = group + kept\n    used += cost\nreturn pinned + kept, used"
}
@@assert
_full = trim_history(HISTORY, 200)
assert _full is not None and _full == (HISTORY, 52), f"Everything fits in 200, got {_full}"
_k50, _u50 = trim_history(HISTORY, 50)
assert _u50 == 42 and [m["content"] for m in _k50] == [HISTORY[0]["content"], HISTORY[1]["content"], "call stock(CHI-6)", "CHI-6: 5 in stock, reorder level 10", "Also check hammers."], "The oldest pair is dropped as a unit"
_k40, _u40 = trim_history(HISTORY, 40)
assert _u40 == 28 and [m["content"] for m in _k40] == [HISTORY[0]["content"], HISTORY[1]["content"], "Also check hammers."], "Pinned task kept; the CHI-6 pair does not fit"
assert trim_history(HISTORY, 30)[1] == 28 and trim_history(HISTORY, 22) == ([HISTORY[0], HISTORY[1]], 23), "Pinned messages are kept even over budget"
assert sum(1 for m in _k50 if m.get("pair") == 1) == 0 and sum(1 for m in _k50 if m.get("pair") == 2) == 2, "Pairs are kept or dropped whole"
print("Step 1 passed: the task stays pinned, and tool calls leave with their results.")

@@step
{
  "stepNumber": 2,
  "title": "Compact old history into a summary",
  "instruction": "Implement compact(messages, keep_last, summarise). Keep the system messages. Of the rest, plan to keep the last keep_last messages, but move the boundary earlier while it would separate two messages with the same pair number. If no messages would be summarised, return the messages unchanged. Otherwise return the system messages, then a user message reading 'Summary of earlier work: ' followed by summarise of the older messages, then the kept messages. Compact HISTORY keeping two messages and keeping one. This is compaction from Section 2. [MOD-8.3]",
  "hintConceptual": "Rewriting the oldest pages of the notepad as one summary line at the top, while copying the most recent notes over word for word, and not cutting a phone call's notes in half.",
  "hintSyntax": "system = [m for m in messages if m[\"role\"] == \"system\"]\nrest = [m for m in messages if m[\"role\"] != \"system\"]\nstart = len(rest) - keep_last\nif start <= 0:\n    return messages\nwhile start > 0 and rest[start].get(\"pair\") is not None and rest[start - 1].get(\"pair\") == rest[start][\"pair\"]:\n    start -= 1\nsummary = {\"role\": \"user\", \"content\": \"Summary of earlier work: \" + summarise(rest[:start])}\nreturn system + [summary] + rest[start:]"
}
@@assert
_join = lambda ms: "; ".join(m["content"] for m in ms if m["role"] == "tool")
_c2 = compact(HISTORY, 2, _join)
assert _c2 is not None and [m["content"] for m in _c2] == [HISTORY[0]["content"], "Summary of earlier work: SAW-3: 0 in stock", "call stock(CHI-6)", "CHI-6: 5 in stock, reorder level 10", "Also check hammers."], f"The boundary moves back to keep the pair, got {_c2}"
_c1 = compact(HISTORY, 1, _join)
assert [m["content"] for m in _c1] == [HISTORY[0]["content"], "Summary of earlier work: SAW-3: 0 in stock; CHI-6: 5 in stock, reorder level 10", "Also check hammers."], "Keeping one message summarises both lookups"
assert compact(HISTORY, 10, _join) == HISTORY and compact(HISTORY, 5, _join) == HISTORY[:1] + [{"role": "user", "content": "Summary of earlier work: "}] + HISTORY[2:], "Nothing to summarise returns the original; an old message with no tool results gives an empty summary"
print("Step 2 passed: old lookups become one summary line, and the CHI-6 pair stays whole.")

@@step
{
  "stepNumber": 3,
  "title": "Store facts where newer wins",
  "instruction": "Implement remember_fact(store, key, value, source, when). If the key exists and its stored date is later than when, return the existing entry and False. Otherwise store a new entry with the value, source, date, and a history made of the old entry's history plus its value and date, or an empty list if there was none; return the new entry and True. Record three updates to a supplier's lead time. This is writing facts from Section 2. [MOD-8.3]",
  "hintConceptual": "A filing card for each supplier: write the new detail on top with its date and where it came from, move the old detail to the back of the card, and ignore a note that turns out to be older than what is already written.",
  "hintSyntax": "old = store.get(key)\nif old and old[\"updated\"] > when:\n    return store[key], False\nhistory = old[\"history\"] + [(old[\"value\"], old[\"updated\"])] if old else []\nstore[key] = {\"value\": value, \"source\": source, \"updated\": when, \"history\": history}\nreturn store[key], True"
}
@@assert
_store = {}
_first = remember_fact(_store, "supplier:SAW-3", "5-day lead time", "supplier email", "2026-11-02")
assert _first == ({"value": "5-day lead time", "source": "supplier email", "updated": "2026-11-02", "history": []}, True), f"The first fact, got {_first}"
assert remember_fact(_store, "supplier:SAW-3", "3-day lead time", "supplier portal", "2026-11-14")[1] is True and _store["supplier:SAW-3"]["history"] == [("5-day lead time", "2026-11-02")], "Newer wins; the old value moves to history"
assert remember_fact(_store, "supplier:SAW-3", "7-day lead time", "old note", "2026-10-01")[1] is False and _store["supplier:SAW-3"]["value"] == "3-day lead time", "An older fact is refused"
remember_fact(_store, "supplier:SAW-3", "4-day lead time", "phone call", "2026-11-14")
assert _store["supplier:SAW-3"]["value"] == "4-day lead time" and len(_store["supplier:SAW-3"]["history"]) == 2, "The second recall question: a same-day fact replaces the stored one"
print("Step 3 passed: the 3-day lead time replaces the 5-day one, and the October note is refused.")

@@step
{
  "stepNumber": 4,
  "title": "Recall relevant episodes",
  "instruction": "Implement recall(episodes, query, k). Take the lower-case words of the query, and of each episode's task plus its tags, using WORD and removing FILLER. Score each episode by the number of shared words, keep those with at least one, sort by score from highest and then by day from latest, and return the first k IDs. Recall for a restock question, a refund question, and an unrelated one. This is recalling episodes from Section 2. [MOD-8.3]",
  "hintConceptual": "Before a new job, flick through the files of past jobs and pull out the two that most resemble it, preferring recent ones when two are equally similar, and pull out nothing if nothing is similar.",
  "hintSyntax": "wanted = set(WORD.findall(query.lower())) - FILLER\nscored = []\nfor episode in episodes:\n    words = set(WORD.findall((episode[\"task\"] + \" \" + \" \".join(episode[\"tags\"])).lower())) - FILLER\n    overlap = len(wanted & words)\n    if overlap:\n        scored.append((overlap, episode[\"day\"], episode[\"id\"]))\nscored.sort(key=lambda item: (-item[0], -item[1]))\nreturn [item[2] for item in scored[:k]]"
}
@@assert
assert recall(EPISODES, "restock saws next week") == ["e3", "e1"], f"Two restock episodes, newest first, got {recall(EPISODES, 'restock saws next week')}"
assert recall(EPISODES, "customer wants a refund") == ["e2"] and recall(EPISODES, "printer jam") == [], "Filler words do not match everything; unrelated queries recall nothing"
assert recall(EPISODES, "restock from Acme supplier") == ["e1", "e3"] and recall(EPISODES, "restock", k=1) == ["e3"], "Relevance beats recency; k limits the result"
assert recall([], "anything") == [], "No episodes, nothing recalled"
print("Step 4 passed: the restock question recalls e3 then e1, and the printer jam recalls nothing.")

@@step
{
  "stepNumber": 5,
  "title": "Decide what to remember",
  "instruction": "Implement should_remember(candidate, existing, min_confidence). Check in order: a SECRET match gives False and 'secret'; an EMAIL match, unless the candidate is about the business, gives False and 'personal_data'; a confidence below the minimum gives False and 'low_confidence'; text equal to an existing memory after stripping and lower-casing gives False and 'duplicate'; otherwise True and None. Filter six candidate memories. This is the write policy from Section 2. [MOD-8.3]",
  "hintConceptual": "The filing clerk's rules: no passwords in the cabinet, no customers' private details, no rumours, and no second copy of a card that is already filed.",
  "hintSyntax": "text = candidate[\"text\"]\nif SECRET.search(text):\n    return False, \"secret\"\nif EMAIL.search(text) and not candidate.get(\"about_business\"):\n    return False, \"personal_data\"\nif candidate[\"confidence\"] < min_confidence:\n    return False, \"low_confidence\"\nif text.strip().lower() in {entry.strip().lower() for entry in existing}:\n    return False, \"duplicate\"\nreturn True, None"
}
@@assert
_existing = ["Acme Saws requires a PO number on every order."]
_cases = [({"text": "Acme Saws lead time is 3 working days.", "confidence": 0.9}, (True, None)),
          ({"text": "API key sk-live-4f9a8b7c6d5e for the supplier portal", "confidence": 0.99}, (False, "secret")),
          ({"text": "Customer priya@example.com likes weekend delivery", "confidence": 0.9}, (False, "personal_data")),
          ({"text": "orders@acme-saws.example handles purchase orders", "confidence": 0.95, "about_business": True}, (True, None)),
          ({"text": "The warehouse might close early on Fridays", "confidence": 0.5}, (False, "low_confidence")),
          ({"text": "acme saws requires a PO number on every order. ", "confidence": 0.9}, (False, "duplicate"))]
for _candidate, _expected in _cases:
    assert should_remember(_candidate, _existing) == _expected, f"{_candidate['text']} should give {_expected}, got {should_remember(_candidate, _existing)}"
assert should_remember({"text": "Supplier portal password is Tidy2026!", "confidence": 1.0}, []) == (False, "secret") and should_remember({"text": "Card 4111111111111111 on file", "confidence": 1.0}, []) == (False, "secret"), "Passwords and card-like numbers are secrets"
assert should_remember({"text": "x", "confidence": 0.8}, []) == (True, None), "The confidence threshold is inclusive"
print("Step 5 passed: the lead time is remembered; the key, the customer email, the guess, and the duplicate are not.")
