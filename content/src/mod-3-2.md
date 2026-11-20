@@meta
{
  "moduleId": "MOD-3.2",
  "slug": "mod-3-2",
  "unitId": "UNIT-3",
  "unitTitle": "Unit 3: Mastering Claude & Gemini",
  "title": "Claude Projects",
  "difficulty": "Foundational",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "What are projects?", "source": "Claude Help Center", "url": "https://support.claude.com/en/articles/9517075-what-are-projects" },
    { "title": "Retrieval augmented generation (RAG) for projects", "source": "Claude Help Center", "url": "https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects" },
    { "title": "Prompt caching", "source": "Anthropic Docs", "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-caching" },
    { "title": "Claude pricing and plans", "source": "Anthropic", "url": "https://claude.com/pricing" },
    { "title": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", "source": "arXiv", "url": "https://arxiv.org/abs/2005.11401" }
  ],
  "videoLibrary": [
    {
      "id": "VID-3.2-1",
      "title": "How to Use Claude Projects (Full Tutorial)",
      "creator": "Kevin Stratvert",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=w7_yWjYyxjE",
      "timingInstruction": "Watch after reading Section 1 to see a project being created",
      "keyTakeaway": "A click-by-click tour of creating a project, writing its instructions, and adding knowledge files, which makes the three parts described in this chapter concrete."
    },
    {
      "id": "VID-3.2-2",
      "title": "What is Retrieval-Augmented Generation (RAG)?",
      "creator": "IBM Technology",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=T-D1OfcDW1M",
      "timingInstruction": "Watch after reading Section 2 (the two ways knowledge reaches the model)",
      "keyTakeaway": "A short whiteboard explanation of retrieval: fetch the relevant passages first, then let the model answer from them. This is what a project does when its knowledge is too large to load whole."
    },
    {
      "id": "VID-3.2-3",
      "title": "Getting started with projects in Claude.ai",
      "creator": "Anthropic",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=GJ5jTgcbRHA",
      "timingInstruction": "Optional recap after Section 4, to see projects next to the other app features",
      "keyTakeaway": "Anthropic's own guide to setting up Claude Projects."
    },
    {
      "id": "VID-3.2-4",
      "title": "Building with the Claude API",
      "creator": "Anthropic",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/building-with-the-claude-api",
      "timingInstruction": "Take the prompt caching and retrieval lessons after finishing the lab",
      "keyTakeaway": "Anthropic's developer course covers prompt caching and retrieval in code, which are the two mechanisms this chapter's lab models by hand."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Project Knowledge, Retrieval, and Caching",
    "context": "A small agency is setting up one Claude project per client and wants to understand what happens to the documents it uploads. You will build the pieces a project relies on: a token estimate for the knowledge base, the rule that decides between loading everything and retrieving passages, a keyword retriever, and a cost model for a cached block of knowledge.",
    "language": "python"
  }
}

@@reading
# Claude Projects

A plain chat starts empty. Every time you open a new one, you explain again who the client is, what tone to use, and which documents matter. A **project** removes that repetition. It is a named workspace that holds a standing set of instructions and a shelf of documents, and every chat started inside it begins with both already in place.

This chapter explains what a project contains, how its documents reach the model, what that costs, and how to organise projects so they stay useful. Product details are dated: figures here are from Anthropic's help pages and documentation in November 2026. The mechanisms underneath, a fixed block of context, retrieval when that block is too big, and caching of repeated text, are stable ideas that every assistant with a similar feature uses.

## 1. First-Principles Mental Model & Intuition

### The problem: a stateless model and a repetitive user

Module 1.4 showed that the model itself remembers nothing between requests. The application gives the appearance of memory by sending the earlier conversation again with each new message. A new chat has no earlier conversation, so it knows nothing about your work.

For one-off questions that is fine. For recurring work it is a tax. A consultant with three clients, a student with four courses, a developer with two codebases: each of them would otherwise paste the same background into chat after chat, and each time would paste a slightly different version of it.

### The analogy: a project room

Picture an office that gives every piece of ongoing work its own room.

- On the **wall** is a standing brief: who the client is, what the deliverables are, the house style, the things never to do. Anyone who walks in reads it first. These are the **project instructions**.
- On the **shelf** are reference binders: the contract, the brand guide, last quarter's report, the product catalogue. These are the **project knowledge**.
- On the **table** are separate working sessions, each about one task. These are the **chats** inside the project.

```text
+--------------------------- PROJECT: "Acme rebrand" ---------------------------+
|                                                                               |
|   INSTRUCTIONS (the wall)            KNOWLEDGE (the shelf)                    |
|   "You are helping with Acme's       brand-guide.pdf                          |
|    rebrand. British spelling.        contract-2026.docx                       |
|    Never promise delivery dates."    q3-report.pdf                            |
|                                      product-catalogue.csv                    |
|                                                                               |
|   CHATS (the table)                                                           |
|   [Draft launch email]   [Summarise Q3 report]   [Tagline ideas]              |
|                                                                               |
+-------------------------------------------------------------------------------+
        every chat starts with the wall and the shelf already in the room
```

Two properties of the room matter.

**Everything in the room is available to every session.** You do not re-attach the brand guide to each chat. It is on the shelf.

**The sessions are separate from each other.** The chat that drafted the launch email does not automatically know what was said in the chat about taglines. What they share is the wall and the shelf. If a decision made in one chat should bind the others, write it on the wall by adding it to the instructions, or put it on the shelf as a short document. Memory features can soften this separation, and at the time of writing Claude keeps a separate memory for each project, but the dependable way to carry a decision forward is still to write it down where every chat will read it.

### Three layers of standing context

You have now met three places to put instructions. They stack.

| Layer | Scope | Typical content |
|---|---|---|
| Profile preferences (Module 3.1) | Every chat you have | Who you are, how you like answers |
| Project instructions | Every chat in one project | The client, the goal, the rules for this work |
| The message | One turn | The task in front of you |

A good rule is to put each fact at the narrowest layer where it is always true. "I prefer short answers" is true everywhere, so it belongs in the profile. "This client uses British spelling" is true for one project. "Make this paragraph shorter" is true for one message.

If you used custom GPTs in Module 2.6, the structure is familiar: instructions plus knowledge files. The difference is one of emphasis. A custom GPT is packaged as a tool to be published and reused by others. A project is a workspace for your own continuing work, with its chats kept together.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### What the model actually receives

On every turn in a project chat, the application assembles one long input and sends it to the model:

```text
+----------------------------------------------------------+
| Product system prompt        (written by Anthropic)      |
| Profile preferences          (yours, all chats)          |
| Project instructions         (this project)              |
| Project knowledge            (whole, or retrieved parts) |   <- this chapter
| Conversation so far          (this chat only)            |
| Your new message                                         |
+----------------------------------------------------------+
                      |
                      v
                   MODEL  --->  answer
```

Everything in that stack costs tokens on every turn. That one fact explains most of what follows: why the amount of knowledge matters, why very large knowledge bases switch to retrieval, and why caching matters.

### Measuring a knowledge base

Module 1.9 introduced tokens. For English prose a serviceable estimate is four characters per token:

$$
T \approx \left\lceil \frac{\text{characters}}{4} \right\rceil
$$

A 200,000-character staff handbook is therefore about 50,000 tokens. The estimate is rough. Code, tables, and languages other than English produce more tokens per character. It is accurate enough to decide which regime you are in.

Let $W$ be the model's context window, $K$ the tokens of project knowledge, and $R$ a reserve for everything else in the stack: instructions, the conversation, and the answer still to be written. The whole knowledge base can be loaded only if

$$
K + R \le W
$$

With a window of one million tokens and a reserve of 200,000, a 50,000-token handbook fits with room to spare. An archive of four million characters, about one million tokens, does not.

### Two ways knowledge reaches the model

**Full-context mode.** When the knowledge fits, the application places all of it in the input on every turn. The model can see every page at once. It can compare the contract with the report, notice a contradiction between two documents, or summarise the whole shelf.

**Retrieval mode.** When the knowledge is too large, the application switches to **retrieval-augmented generation**, usually shortened to RAG. The documents are split into passages and indexed in advance. On each turn, a search step finds the passages most relevant to your message, and only those are placed in the input.

```text
INDEXING (once, when files are added)
  documents --> split into chunks --> index

EACH TURN
  your message --> search the index --> top k chunks --+
                                                       v
            instructions + [k chunks] + conversation + message --> MODEL
```

According to Anthropic's help pages at the time of writing, this switch happens automatically on paid plans as a project's knowledge approaches the context limit, it raises the amount a project can hold by up to ten times, and the interface shows an indicator when it is active. You do not choose the mode. You influence it only through how much you upload.

The two modes behave differently, and knowing which one you are in tells you what kinds of question will work.

| | Full-context | Retrieval |
|---|---|---|
| What the model sees | Every document, every turn | A few passages chosen by a search |
| Tokens per turn | All of $K$ | About $k \times s$ for $k$ chunks of size $s$ |
| Good at | Whole-document summaries, comparisons, spotting contradictions | Specific look-ups in a large collection |
| Weak at | Nothing structural, but large inputs use more of your allowance | Questions about "everything", and questions whose wording differs from the documents |
| Fails by | Attention thinning over very long input (Module 1.9) | The search missing a passage that mattered |

### How retrieval chooses passages

A retriever needs a **score** that says how relevant a chunk is to a query. The simplest is word overlap. Let $q$ be the set of meaningful words in the query and $c$ the set in a chunk:

$$
\text{score}(q, c) = |q \cap c|
$$

The chunks are sorted by score and the top $k$ are returned. Production systems use something better. They convert the query and each chunk into vectors, called embeddings, in which texts of similar meaning lie close together, and they rank by the cosine of the angle between vectors:

$$
\text{sim}(\mathbf{q}, \mathbf{c}) = \frac{\mathbf{q} \cdot \mathbf{c}}{\lVert \mathbf{q} \rVert \, \lVert \mathbf{c} \rVert}
$$

Embeddings match "money back" to a passage about "refunds", which word overlap cannot do. Many systems combine both methods. The principle is the same in either case: a ranking function chooses what the model is allowed to see, and anything it does not choose might as well not exist for that turn.

That has a measurable consequence. Suppose an answer needs facts from $m$ separate passages, and the retriever finds each needed passage with probability $r$, independently. The chance that all of them arrive is

$$
P(\text{all found}) = r^{m}
$$

With $r = 0.9$, a question needing one passage succeeds 90 percent of the time. A question needing three succeeds $0.9^{3} = 0.729$ of the time, about 73 percent. Broad questions degrade fastest in retrieval mode, and "summarise everything" is the broadest question there is.

### The cost of repeated context, and caching

In full-context mode the same knowledge is sent on every turn. Through the API you would pay for it every time. Let $P$ be the tokens in that repeated prefix, $p$ the price per token, and $n$ the number of requests. Without caching:

$$
C_{\text{plain}} = n \cdot P \cdot p
$$

**Prompt caching** lets the provider store the processed prefix and reuse it. At the time of writing, Anthropic's documentation prices this with two multipliers on the normal input price: writing a prefix to the cache costs 1.25 times as much as sending it normally, and reading it back costs 0.1 times as much by default. For $n$ requests that all arrive while the cache is alive:

$$
C_{\text{cached}} = 1.25\,P\,p + (n - 1) \cdot 0.1\,P\,p
$$

Dividing one by the other gives the fraction of the plain cost you pay:

$$
\frac{C_{\text{cached}}}{C_{\text{plain}}} = \frac{1.25 + 0.1\,(n - 1)}{n}
$$

| Requests $n$ | Ratio | Meaning |
|---|---|---|
| 1 | 1.25 | A single request costs 25 percent more |
| 2 | 0.675 | Already cheaper: break-even is the second request |
| 10 | 0.215 | About 78 percent saved |
| 100 | 0.1115 | Approaching the limit of 90 percent saved |

For the 50,000-token handbook at USD 2 per million input tokens, one plain request costs USD 0.10 for the prefix. Ten plain requests cost USD 1.00. With caching, the first costs USD 0.125 and each of the next nine costs USD 0.01, for a total of USD 0.215.

The cache does not live forever. The default lifetime is five minutes, refreshed each time the cached prefix is read. A one-hour lifetime is available at a higher write price of twice the normal input price. This produces a trap. If four requests arrive ten minutes apart with the five-minute lifetime, every one of them finds the cache expired and pays the write price: $4 \times 0.125$ is USD 0.50, which is worse than the USD 0.40 with no caching at all. With the one-hour lifetime the same four requests cost $0.20 + 3 \times 0.01$, or USD 0.23.

In the Claude apps you do not manage any of this yourself. You pay a subscription, and the cost of a message is counted against your usage allowance as Module 3.1 described. The arithmetic still shapes your experience. A project with a large knowledge base makes every message in it heavier, and repeated context is cheaper to serve when it is stable and identical from turn to turn. Editing the knowledge or instructions changes the prefix, so the next message cannot reuse the earlier cache.

### Complexity

Full-context mode sends $O(K)$ tokens per turn regardless of the question. Retrieval sends $O(k \cdot s)$, which is independent of the size of the collection. That is the reason it scales. The search itself costs $O(N)$ for a naive scan over $N$ chunks, and well under that with an index.

## 3. Production-Grade Implementation & Annotated Walkthrough

No code is needed to use a project. Writing the mechanism out in a few lines is the quickest way to stop treating it as a black box. First, sizing the knowledge and choosing the mode.

```python
import math

def estimate_tokens(text):
    return math.ceil(len(text) / 4)

def choose_mode(knowledge_tokens, window, reserve):
    return "full-context" if knowledge_tokens + reserve <= window else "retrieval"

handbook = "x" * 200_000            # stands in for a 200,000-character handbook
archive = "x" * 4_000_000           # a 4,000,000-character document archive
for name, text in [("handbook", handbook), ("archive", archive)]:
    tokens = estimate_tokens(text)
    print(f"{name:>9}: {tokens:>9,} tokens -> {choose_mode(tokens, 1_000_000, 200_000)}")
```

- **`math.ceil` rounds up.** A three-character note is one token, not zero. Rounding down would make small files free, and estimates used for limits should err on the high side.
- **The reserve is explicit.** The knowledge does not get the whole window. Instructions, the conversation, and the answer need space too. Naming the reserve as a parameter forces whoever calls the function to decide how much.
- **The comparison uses `<=`.** A knowledge base that exactly fills the remaining space still fits. Boundary behaviour is where budget code most often goes wrong, so it is stated and tested.
- **The output is the decision.** The handbook comes to 50,000 tokens and loads whole. The archive comes to 1,000,000 tokens and must be retrieved from.

Next, a small retriever.

```python
STOPWORDS = {"a", "an", "and", "are", "can", "do", "for", "get", "how", "i", "in", "is",
             "my", "of", "the", "to", "what"}

def keywords(text):
    words = {word.strip(".,;:!?()\"'").lower() for word in text.split()}
    return words - STOPWORDS - {""}

def retrieve(chunks, query, k):
    wanted = keywords(query)
    scored = [(len(wanted & keywords(chunk)), index, chunk) for index, chunk in enumerate(chunks)]
    hits = sorted((item for item in scored if item[0] > 0), key=lambda item: (-item[0], item[1]))
    return [chunk for _, _, chunk in hits[:k]]

policy = [
    "Refunds are issued within 14 days of a return request.",
    "Standard shipping takes 3 to 5 working days.",
    "Refunds for damaged items include the original shipping cost.",
    "Support hours are 9am to 6pm Monday to Friday.",
]
print(retrieve(policy, "How long do refunds take for damaged items?", 2))
print(retrieve(policy, "Can I get my money back?", 2))
```

- **`keywords` normalises before comparing.** It lowercases, strips punctuation, and drops common words that carry no topic. Without that step, "Refunds" and "refunds." would count as different words.
- **Each chunk gets a tuple of score, position, and text.** Keeping the position lets ties be broken by original order, which makes the output deterministic. A retriever that returns different passages for the same question on different runs is very hard to debug.
- **Chunks with a score of zero are dropped.** Returning irrelevant passages just to fill $k$ slots puts distracting text in front of the model. An empty result is more honest, and the application can tell the model that nothing was found.
- **The first query works.** It shares three words with the passage about damaged items and one with the general refund passage, so those two are returned in that order.
- **The second query returns nothing.** "Money back" means "refund" to a person and shares no word with any passage. This is the vocabulary gap that embeddings exist to close. It is also why, in retrieval mode, a question phrased in the documents' own terms does better.

Finally, the cost of a cached prefix when requests arrive over time.

```python
def prefix_cost(times, prefix_tokens, price_per_mtok, ttl=5, write_mult=1.25, read_mult=0.1):
    base = prefix_tokens / 1e6 * price_per_mtok
    total, last = 0.0, None
    for moment in times:
        alive = last is not None and moment - last <= ttl
        total += base * (read_mult if alive else write_mult)
        last = moment
    return total

steady = list(range(10))                    # one request a minute for ten minutes
sparse = [0, 10, 20, 30]                    # one request every ten minutes
print(f"plain, 10 requests      : USD {10 * 0.10:.3f}")
print(f"cached, 1 minute apart  : USD {prefix_cost(steady, 50_000, 2.0):.3f}")
print(f"cached, 10 minutes apart: USD {prefix_cost(sparse, 50_000, 2.0):.3f}  (plain would be USD 0.400)")
print(f"1-hour cache, 10 apart  : USD {prefix_cost(sparse, 50_000, 2.0, ttl=60, write_mult=2.0):.3f}")
```

- **`base` is the plain cost of sending the prefix once.** Every other figure is a multiple of it, which keeps the pricing rule in one visible place.
- **`alive` compares with the previous request, not the first.** Each read refreshes the lifetime, so a steady stream of requests keeps the cache warm indefinitely. Comparing with the time of the original write would wrongly expire a cache that is in constant use.
- **The multipliers and the lifetime are parameters.** They are the provider's current prices, and they will change. The one-hour option is the same function called with different numbers.
- **The four printed lines tell the story.** Steady use costs USD 0.215 against USD 1.000 plain. Sparse use with the short lifetime costs USD 0.500, more than not caching. The longer lifetime brings sparse use down to USD 0.230.

**Complexity.** `estimate_tokens` is linear in the text length only because computing a length may be, and `choose_mode` is constant time. `retrieve` is linear in the total text of the chunks, plus a sort of the matching ones. `prefix_cost` is linear in the number of requests.

### A project instruction template

The instructions are a prompt, and everything in Module 2.5 applies. A structure that holds up well:

```text
ROLE AND GOAL
You are helping me with [the work]. The goal of this project is [outcome].

AUDIENCE AND TONE
Outputs are read by [who]. Write in [tone]. Use [spelling or language].

HOW TO USE THE KNOWLEDGE
Treat the files in this project as the source of truth for facts about [topic].
When you use a fact from a file, name the file. If the files do not contain the
answer, say so plainly and do not guess.

RULES
- Always: [two or three things]
- Never: [two or three things]

DEFAULT OUTPUT
Unless I ask otherwise, respond with [format and length].
```

The third block matters most. Telling the model to name its source makes checking quick, and telling it what to do when the files are silent removes the most common cause of invented answers in a project.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Uploading everything is the commonest mistake.** A shelf with forty files, half of them out of date, gives worse answers than a shelf with six good ones. Every extra document either dilutes attention in full-context mode or competes in the search in retrieval mode. Curate. If you would not hand a file to a new colleague on their first day, leave it out.

**Old versions poison the well.** Two drafts of the same policy with different numbers in them produce confident answers from the wrong one. When a document changes, replace it. Do not add the new version beside the old.

**In retrieval mode, "summarise all of this" stops working.** The model receives a handful of passages and summarises those, and nothing in the answer tells you the rest was never read. Watch for the indicator that retrieval is active. When it is, ask about one document by name, or ask narrower questions and combine the answers yourself.

**"It says that is not in the documents, and it is."** In retrieval mode this is usually a wording mismatch between the question and the text. Rephrase using the document's own terms, name the file, or quote a nearby heading.

**Scanned pages and complicated layouts lose information.** A PDF that is really a photograph of a page contains no text unless it is processed as an image. Tables, multi-column layouts, and footnotes are often scrambled when text is extracted. For anything that matters, open a chat and ask for a specific figure you can check against the original before trusting the file.

**Give files names that say what they are.** `contract-acme-2026-signed.pdf` is easier to refer to in a message, and easier for a person to audit, than `scan0043.pdf`. A short index document listing each file and what it is for helps the model and helps the colleague who inherits the project.

**One project per continuing job.** A single project called "Work" recreates the problem projects were meant to solve: instructions too general to help, and knowledge from one client bleeding into answers for another. A project per client, per course, or per codebase keeps the wall specific and the shelf relevant.

**Instructions grow until they contradict themselves.** Each bad answer tempts you to add a rule. After a few months the instructions say "be concise" in one place and "always explain your reasoning in full" in another. Review them the way you would review a document: read from the top, delete what no longer applies, and resolve conflicts.

**Chats in a project do not read each other.** People expect a new chat to know what was decided yesterday in another chat in the same project. Unless a memory or search feature surfaces it, it does not. Decisions that must persist go into the instructions or into a short decisions file on the shelf.

**A heavy project makes every message heavy.** If a project's knowledge is large and loaded whole, even "thanks, make it shorter" carries the entire shelf with it. People who hit their usage limit quickly often find the cause here. Keep reference-heavy projects for work that needs the references, and do casual follow-up in a lighter place.

**Shared projects share their shelf.** On team plans a project can be shared with colleagues, with view or edit permissions. Everything in the knowledge base is then available to everyone with access, through the model's answers if not directly. Do not put anything on a shared shelf that some members should not see.

**Test a project before relying on it.** Write five questions whose answers you know, including one whose answer is not in the files. Run them in fresh chats. A project that answers the first four correctly and says "the files do not cover this" for the fifth is ready. This is the test-set habit from Module 2.5 applied to a workspace.

**Free and paid plans differ.** At the time of writing, projects are available on every plan, with a small cap on the number of projects on the free tier, and the automatic expansion through retrieval is a paid feature. Check the current help pages before planning around a limit.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A project is a workspace with three parts: instructions that every chat in it reads first, a knowledge base of documents, and the chats themselves, which share the instructions and knowledge but not each other's conversations. Knowledge reaches the model in one of two ways. When it fits in the context window alongside a reserve for everything else, all of it is loaded on every turn, which allows whole-collection reasoning at the price of heavier messages. When it does not fit, the application retrieves only the passages a search judges relevant, which scales to much larger collections but can miss what matters, with the chance of a complete answer falling as $r^{m}$ when $m$ passages are needed. Repeated context is made affordable by caching, which costs a little more on the first request and a tenth as much afterwards, provided requests arrive before the cache expires. Good projects are narrow, curated, tested with known questions, and governed by instructions that say how to use the knowledge and what to do when it is silent.

**Question 1.** Through the API, an application sends an 80,000-token block of project knowledge at the start of every request, on a model priced at USD 2 per million input tokens. Compute the cost of that block for 20 requests without caching, with caching when all requests arrive within the cache lifetime, and with caching when the requests arrive ten minutes apart on a five-minute lifetime. Use a write multiplier of 1.25 and a read multiplier of 0.1.

<details>
<summary>View Answer</summary>

Sending the block once costs 80,000 divided by a million, times 2, which is USD 0.16. Without caching, 20 requests cost 20 times 0.16, or USD 3.20. With caching and all requests inside the lifetime, the first request writes the cache at 1.25 times 0.16, which is USD 0.20, and each of the other 19 reads it at 0.1 times 0.16, which is USD 0.016. Nineteen reads cost USD 0.304, so the total is USD 0.504, a saving of about 84 percent. If the requests arrive ten minutes apart with a five-minute lifetime, the cache has expired every time, so all 20 requests pay the write price: 20 times 0.20 is USD 4.00, which is 25 percent more than not caching at all. The lesson is that caching pays when the same prefix is reused quickly and often. For sparse traffic, choose a longer cache lifetime or do not cache.

</details>

**Question 2.** A project has switched to retrieval mode. A user asks a question whose answer depends on four separate passages in different documents. If the retriever finds each needed passage with probability 0.85, independently, how likely is a complete answer? Give three things the user can do to improve the odds.

<details>
<summary>View Answer</summary>

The chance that all four passages are retrieved is 0.85 to the fourth power. 0.85 squared is 0.7225, and squaring that gives about 0.522, so a complete answer arrives only a little more than half the time. The rest of the time the model answers from partial evidence, and the answer may read just as confidently. To improve the odds: first, split the question into narrower ones that each need a single passage, where the success rate is 85 percent per question, and combine the answers yourself. Second, phrase each question in the documents' own vocabulary and name the file, which raises the chance that the search finds the right passage. Third, reduce the knowledge base so it fits in the context window, by removing files the work does not need, so that the project returns to full-context mode and the model sees everything. Asking the model to name the file behind each fact also makes gaps visible.

</details>

**Question 3.** A freelancer keeps one project called "Clients" containing the contracts, brand guides, and meeting notes of three clients, with instructions that have grown to two pages. Answers sometimes use one client's tone for another and cite the wrong contract. Diagnose the problem using this chapter's model, and describe a better arrangement.

<details>
<summary>View Answer</summary>

The project breaks the rule of putting each fact at the narrowest layer where it is always true. Tone, spelling, and contract terms are true for one client, but they sit in a project shared by three, so every chat receives all three sets of rules and all three shelves of documents. In full-context mode the model sees three brand guides at once and must guess which applies. In retrieval mode a search for "payment terms" can return a passage from any of the three contracts. The long instructions make it worse, because rules written for one client conflict with rules for another. The better arrangement is one project per client. Each has short instructions naming the client, the audience, the tone, and how to use the knowledge, and a shelf holding only that client's current documents, with old versions removed. Preferences that apply to all the freelancer's work, such as a liking for short answers, move up to the profile. Each project is then tested with a handful of questions with known answers, including one that the files do not answer.

</details>

@@starter
"""
Lab: Project Knowledge, Retrieval, and Caching
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import math

STOPWORDS = {"a", "an", "and", "are", "can", "do", "for", "get", "how", "i", "in", "is",
             "my", "of", "the", "to", "what"}

POLICY = [
    "Refunds are issued within 14 days of a return request.",
    "Standard shipping takes 3 to 5 working days.",
    "Refunds for damaged items include the original shipping cost.",
    "Support hours are 9am to 6pm Monday to Friday.",
]


def keywords(text):
    """Provided helper: the set of meaningful lowercase words in a text."""
    words = {word.strip(".,;:!?()\"'").lower() for word in text.split()}
    return words - STOPWORDS - {""}


# ---------------------------------------------------------------- Step 1
def estimate_tokens(text):
    """Estimate tokens as the number of characters divided by 4, rounded UP."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def choose_mode(knowledge_tokens, window, reserve):
    """Return "full-context" if knowledge_tokens + reserve <= window, else "retrieval"."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def chunk_words(text, size):
    """Split text into chunks of at most `size` words each.
    Return a list of strings, each the words of one chunk joined by single spaces."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def retrieve(chunks, query, k):
    """Score each chunk by how many keywords it shares with the query.
    Return the texts of the top k chunks with a score above zero,
    highest score first, ties in original order."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def prefix_cost(times, prefix_tokens, price_per_mtok, ttl=5, write_mult=1.25, read_mult=0.1):
    """Cost in USD of a repeated prefix over requests at the given times (in minutes, ascending).
    base = prefix_tokens / 1e6 * price_per_mtok
    The first request pays base * write_mult.
    A later request pays base * read_mult if it arrives within ttl minutes of the PREVIOUS
    request, otherwise it pays base * write_mult again."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("tokens   :", estimate_tokens("x" * 200_000))
    print("mode     :", choose_mode(50_000, 1_000_000, 200_000))
    print("chunks   :", chunk_words("one two three four five", 2))
    print("retrieved:", retrieve(POLICY, "How long do refunds take for damaged items?", 2))
    print("cost     :", prefix_cost(list(range(10)), 50_000, 2.0))

@@solution
"""
Lab solution: Project Knowledge, Retrieval, and Caching
Standard library only.
"""
import math

STOPWORDS = {"a", "an", "and", "are", "can", "do", "for", "get", "how", "i", "in", "is",
             "my", "of", "the", "to", "what"}

POLICY = [
    "Refunds are issued within 14 days of a return request.",
    "Standard shipping takes 3 to 5 working days.",
    "Refunds for damaged items include the original shipping cost.",
    "Support hours are 9am to 6pm Monday to Friday.",
]


def keywords(text):
    """Provided helper: the set of meaningful lowercase words in a text."""
    words = {word.strip(".,;:!?()\"'").lower() for word in text.split()}
    return words - STOPWORDS - {""}


# ---------------------------------------------------------------- Step 1
def estimate_tokens(text):
    """Four characters per token is a rough rule for English prose.
    Rounding up means a short note never counts as zero."""
    return math.ceil(len(text) / 4)


# ---------------------------------------------------------------- Step 2
def choose_mode(knowledge_tokens, window, reserve):
    """The knowledge shares the window with instructions, conversation, and the answer.
    The reserve is that shared space. A knowledge base that exactly fits still fits."""
    return "full-context" if knowledge_tokens + reserve <= window else "retrieval"


# ---------------------------------------------------------------- Step 3
def chunk_words(text, size):
    """Fixed-size chunks by word count. Real systems split on headings and paragraphs
    and overlap neighbouring chunks, but the idea is the same."""
    words = text.split()
    return [" ".join(words[start:start + size]) for start in range(0, len(words), size)]


# ---------------------------------------------------------------- Step 4
def retrieve(chunks, query, k):
    """Keyword-overlap retrieval. The position is kept so ties break in original order,
    which makes the result deterministic. Chunks that share nothing are never returned."""
    wanted = keywords(query)
    scored = [(len(wanted & keywords(chunk)), index, chunk) for index, chunk in enumerate(chunks)]
    hits = sorted((item for item in scored if item[0] > 0), key=lambda item: (-item[0], item[1]))
    return [chunk for _, _, chunk in hits[:k]]


# ---------------------------------------------------------------- Step 5
def prefix_cost(times, prefix_tokens, price_per_mtok, ttl=5, write_mult=1.25, read_mult=0.1):
    """Each read refreshes the cache lifetime, so the comparison is with the previous
    request, not with the original write. The multipliers are a dated snapshot of prices."""
    base = prefix_tokens / 1e6 * price_per_mtok
    total, last = 0.0, None
    for moment in times:
        alive = last is not None and moment - last <= ttl
        total += base * (read_mult if alive else write_mult)
        last = moment
    return total


if __name__ == "__main__":
    for name, characters in [("handbook", 200_000), ("archive", 4_000_000)]:
        tokens = estimate_tokens("x" * characters)
        print(f"{name:>9}: {tokens:>9,} tokens -> {choose_mode(tokens, 1_000_000, 200_000)}")

    text = "Refunds are issued within 14 days. Shipping takes 3 to 5 working days. Support is open on weekdays."
    for chunk in chunk_words(text, 6):
        print("chunk:", chunk)

    print(retrieve(POLICY, "How long do refunds take for damaged items?", 2))
    print(retrieve(POLICY, "Can I get my money back?", 2))

    steady, sparse = list(range(10)), [0, 10, 20, 30]
    print(f"plain, 10 requests      : USD {10 * 0.10:.3f}")
    print(f"cached, 1 minute apart  : USD {prefix_cost(steady, 50_000, 2.0):.3f}")
    print(f"cached, 10 minutes apart: USD {prefix_cost(sparse, 50_000, 2.0):.3f}")
    print(f"1-hour cache, 10 apart  : USD {prefix_cost(sparse, 50_000, 2.0, ttl=60, write_mult=2.0):.3f}")
    print(f"recall question 1       : USD {prefix_cost(list(range(20)), 80_000, 2.0):.3f} cached, "
          f"USD {prefix_cost([10 * i for i in range(20)], 80_000, 2.0):.3f} when every request misses")

@@step
{
  "stepNumber": 1,
  "title": "Estimate the size of the knowledge",
  "instruction": "Implement estimate_tokens(text). Return the number of characters in the text divided by 4, rounded up to a whole number with math.ceil. This is the rule of thumb from Section 2 for English prose. Rounding up matters: a three-character note must count as one token, not zero. [MOD-3.2]",
  "hintConceptual": "A token is roughly four characters of English. You want a whole number, and an estimate used for a limit should err on the high side.",
  "hintSyntax": "return math.ceil(len(text) / 4)"
}
@@assert
assert estimate_tokens("abcd") == 1, f"Four characters is one token, got {estimate_tokens('abcd')}"
assert estimate_tokens("abcde") == 2, "Five characters rounds UP to two tokens"
assert estimate_tokens("abc") == 1, "Three characters rounds up to one token, not down to zero"
assert estimate_tokens("") == 0, "An empty text is zero tokens"
assert estimate_tokens("x" * 200_000) == 50_000, "A 200,000-character handbook is about 50,000 tokens"
assert isinstance(estimate_tokens("hello world"), int), "The estimate must be a whole number"
print("Step 1 passed: a 200,000-character handbook is about 50,000 tokens.")

@@step
{
  "stepNumber": 2,
  "title": "Full context or retrieval?",
  "instruction": "Implement choose_mode(knowledge_tokens, window, reserve). The knowledge must share the context window with the instructions, the conversation, and the answer, which together are the reserve. Return the string 'full-context' if knowledge_tokens plus reserve is less than or equal to window. Otherwise return 'retrieval'. This is the inequality K + R <= W from Section 2. [MOD-3.2]",
  "hintConceptual": "Everything has to fit in one window. If the documents plus the space kept back for everything else fit, load them all. If not, the application has to search and load only parts.",
  "hintSyntax": "return \"full-context\" if knowledge_tokens + reserve <= window else \"retrieval\""
}
@@assert
assert choose_mode(50_000, 1_000_000, 200_000) == "full-context", "A 50,000-token handbook fits in a 1M window with a 200K reserve"
assert choose_mode(1_000_000, 1_000_000, 200_000) == "retrieval", "A 1M-token archive cannot fit beside a 200K reserve"
assert choose_mode(800_000, 1_000_000, 200_000) == "full-context", "Knowledge that exactly fills the remaining space still fits (use <=)"
assert choose_mode(800_001, 1_000_000, 200_000) == "retrieval", "One token over the limit switches to retrieval"
assert choose_mode(0, 1000, 1000) == "full-context", "An empty knowledge base fits"
assert choose_mode(150_000, 200_000, 60_000) == "retrieval", "The window and reserve arguments must be used, not fixed numbers"
print("Step 2 passed: the handbook loads whole and the archive switches to retrieval.")

@@step
{
  "stepNumber": 3,
  "title": "Split documents into chunks",
  "instruction": "Implement chunk_words(text, size). Split the text into words with text.split(), then group them into consecutive chunks of at most size words. Return a list of strings, each one the words of a chunk joined with single spaces. The last chunk may be shorter. An empty text gives an empty list. Chunking is the indexing step in the retrieval diagram in Section 2. [MOD-3.2]",
  "hintConceptual": "Walk through the list of words in jumps of `size`. Each jump starts a new chunk that takes the next `size` words, or whatever is left at the end.",
  "hintSyntax": "words = text.split()\nreturn [\" \".join(words[start:start + size]) for start in range(0, len(words), size)]"
}
@@assert
assert chunk_words("one two three four five", 2) == ["one two", "three four", "five"], f"Five words in chunks of two, got {chunk_words('one two three four five', 2)}"
assert chunk_words("one two three four", 2) == ["one two", "three four"], "Four words make exactly two chunks of two"
assert chunk_words("one two three", 5) == ["one two three"], "A text shorter than the chunk size is one chunk"
assert chunk_words("", 3) == [], "An empty text has no chunks"
assert chunk_words("a  b\n c", 1) == ["a", "b", "c"], "Split on any whitespace, and join with single spaces"
assert len(chunk_words(" ".join(["w"] * 1000), 100)) == 10, "1,000 words in chunks of 100 make 10 chunks"
print("Step 3 passed: documents are split into fixed-size chunks ready for indexing.")

@@step
{
  "stepNumber": 4,
  "title": "Retrieve the most relevant chunks",
  "instruction": "Implement retrieve(chunks, query, k). Use the provided keywords() helper on the query and on each chunk. A chunk's score is the number of keywords it shares with the query. Return a list of the chunk texts with a score above zero, sorted from highest score to lowest, with ties kept in their original order, cut to at most k items. This is the score from Section 2. Try the query 'Can I get my money back?' afterwards to see the vocabulary gap. [MOD-3.2]",
  "hintConceptual": "Score every chunk, throw away the ones that share nothing with the question, then sort. Keep each chunk's position so that equal scores come out in the order they went in.",
  "hintSyntax": "wanted = keywords(query)\nscored = [(len(wanted & keywords(chunk)), index, chunk) for index, chunk in enumerate(chunks)]\nhits = sorted((item for item in scored if item[0] > 0), key=lambda item: (-item[0], item[1]))\nreturn [chunk for _, _, chunk in hits[:k]]"
}
@@assert
_top = retrieve(POLICY, "How long do refunds take for damaged items?", 2)
assert _top == [POLICY[2], POLICY[0]], f"The damaged-items passage (3 shared words) comes first, then the general refund passage, got {_top}"
assert retrieve(POLICY, "How long do refunds take for damaged items?", 1) == [POLICY[2]], "k=1 returns only the best chunk"
assert retrieve(POLICY, "Can I get my money back?", 2) == [], "A query sharing no keyword with any chunk returns an empty list"
assert retrieve(POLICY, "What are the support hours?", 3) == [POLICY[3]], "Only chunks with a score above zero are returned, even if k is larger"
assert retrieve(POLICY, "shipping", 5) == [POLICY[1], POLICY[2]], "Equal scores keep their original order"
assert retrieve(["Alpha beta.", "BETA gamma!"], "beta", 5) == ["Alpha beta.", "BETA gamma!"], "Matching ignores case and punctuation: use keywords()"
assert retrieve([], "anything", 3) == [], "No chunks, no results"
print("Step 4 passed: the retriever finds the refund passages and returns nothing for 'money back'.")

@@step
{
  "stepNumber": 5,
  "title": "The cost of a cached prefix",
  "instruction": "Implement prefix_cost(times, prefix_tokens, price_per_mtok, ttl, write_mult, read_mult). First compute base = prefix_tokens / 1e6 * price_per_mtok, the plain cost of sending the prefix once. Walk through the request times in order. The first request pays base times write_mult. Each later request pays base times read_mult if it arrives within ttl minutes of the previous request (difference less than or equal to ttl), otherwise it pays base times write_mult again. Return the total. Compare against the previous request, not the first: every read refreshes the cache. [MOD-3.2]",
  "hintConceptual": "The cache stays alive as long as requests keep arriving close together. A gap longer than the lifetime means the next request has to pay to write it again.",
  "hintSyntax": "base = prefix_tokens / 1e6 * price_per_mtok\ntotal, last = 0.0, None\nfor moment in times:\n    alive = last is not None and moment - last <= ttl\n    total += base * (read_mult if alive else write_mult)\n    last = moment\nreturn total"
}
@@assert
assert abs(prefix_cost(list(range(10)), 50_000, 2.0) - 0.215) < 1e-9, f"Ten requests a minute apart cost USD 0.215, got {prefix_cost(list(range(10)), 50_000, 2.0)}"
assert abs(prefix_cost([0], 50_000, 2.0) - 0.125) < 1e-9, "A single request pays the write price: 1.25 times USD 0.10"
assert prefix_cost([], 50_000, 2.0) == 0, "No requests cost nothing"
assert abs(prefix_cost([0, 10, 20, 30], 50_000, 2.0) - 0.5) < 1e-9, "Requests 10 minutes apart on a 5-minute lifetime all pay the write price"
assert abs(prefix_cost([0, 10, 20, 30], 50_000, 2.0, ttl=60, write_mult=2.0) - 0.23) < 1e-9, "With a 1-hour lifetime at a 2x write price the same requests cost USD 0.23"
assert abs(prefix_cost([0, 5], 50_000, 2.0) - 0.135) < 1e-9, "A request exactly ttl minutes later still reads the cache (use <=)"
assert abs(prefix_cost([0, 4, 8, 12], 50_000, 2.0) - 0.155) < 1e-9, "Each read refreshes the lifetime: compare with the PREVIOUS request, not the first"
assert abs(prefix_cost(list(range(20)), 80_000, 2.0) - 0.504) < 1e-9, "Recall question 1: 20 requests on an 80,000-token prefix cost USD 0.504"
print("Step 5 passed: steady traffic costs USD 0.215 cached against USD 1.00 plain, and sparse traffic can cost more than not caching.")
