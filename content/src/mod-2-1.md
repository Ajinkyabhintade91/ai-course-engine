@@meta
{
  "moduleId": "MOD-2.1",
  "slug": "mod-2-1",
  "unitId": "UNIT-2",
  "unitTitle": "Unit 2: Mastering ChatGPT",
  "title": "ChatGPT Introduction",
  "difficulty": "Foundational",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "ChatGPT plans and pricing", "source": "OpenAI", "url": "https://chatgpt.com/pricing/" },
    { "title": "Data controls FAQ", "source": "OpenAI Help Center", "url": "https://help.openai.com/en/articles/7730893-data-controls-faq" },
    { "title": "How your data is used to improve model performance", "source": "OpenAI Help Center", "url": "https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance" },
    { "title": "Compaction (context management)", "source": "OpenAI Docs", "url": "https://developers.openai.com/api/docs/guides/compaction" },
    { "title": "Create a model response (API reference)", "source": "OpenAI Docs", "url": "https://developers.openai.com/api/reference/python/resources/responses/methods/create" },
    { "title": "Introducing ChatGPT Go", "source": "OpenAI", "url": "https://openai.com/index/introducing-chatgpt-go/" }
  ],
  "videoLibrary": [
    {
      "id": "VID-2.1-1",
      "title": "How I use LLMs",
      "creator": "Andrej Karpathy",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=EWvNQjAaOHw",
      "timingInstruction": "Watch the first 30 minutes after reading Section 1",
      "keyTakeaway": "A practical tour of the ChatGPT interface by someone who helped build these models: what a chat really is, when to start a new one, and how plans and models relate."
    },
    {
      "id": "VID-2.1-2",
      "title": "ChatGPT Tutorial for Beginners: How to Actually Get Work Done with AI",
      "creator": "Kevin Stratvert",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=poM2n8fBcag",
      "timingInstruction": "Watch after reading Section 2 (the product surface)",
      "keyTakeaway": "A recent click-through of the main features for complete beginners. Use it to match each feature named in this chapter to what it looks like on screen."
    },
    {
      "id": "VID-2.1-3",
      "title": "Get started with ChatGPT Work",
      "creator": "OpenAI",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=GphgJjaKKhw",
      "timingInstruction": "Optional: the section on the conversation format and context window pairs with Section 2",
      "keyTakeaway": "OpenAI's own walkthrough of getting started with ChatGPT for work."
    },
    {
      "id": "VID-2.1-4",
      "title": "Prompt Engineering for ChatGPT",
      "creator": "Vanderbilt University",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/prompt-engineering",
      "timingInstruction": "Start after finishing this module and continue alongside Unit 2",
      "keyTakeaway": "A beginner-level course that builds systematic prompting habits in ChatGPT, taught through reusable prompt patterns."
    },
    {
      "id": "VID-2.1-5",
      "title": "Generative AI for Everyone",
      "creator": "DeepLearning.AI (Andrew Ng)",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/generative-ai-for-everyone",
      "timingInstruction": "Optional background if you skipped it in Unit 1",
      "keyTakeaway": "Explains what chat assistants are good and bad at in everyday work, without tying the lessons to one product's menus."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Assemble a Chat Request the Way an App Does",
    "context": "Your team is building a small internal chat tool on top of a language-model API and users complain that it 'forgets' things in long conversations. You will write the code that assembles each request, estimates its size, trims old turns to fit a budget while protecting the instructions and the newest message, and computes how much of a context window is really available for input.",
    "language": "python"
  }
}

@@reading
# ChatGPT Introduction

ChatGPT opened to the public on 30 November 2022 as a "research preview" and reached an estimated hundred million users within two months, faster than any consumer application before it. It is now used by several hundred million people every week. Most of them use a small fraction of what it can do, and few understand what happens when they press Enter. This chapter gives you both: a map of the product, and an accurate model of how a conversation is put together behind the screen. That second part is what turns a casual user into a skilled one.

A note on shelf life. Plans, prices, limits, and feature names in ChatGPT change every few months. Where this chapter states a specific figure it also says "at the time of writing", which means November 2026. The concepts will last. Check the pricing page linked in the citations for the numbers.

## 1. First-Principles Mental Model & Intuition

### ChatGPT is an application, not a model

The single most useful distinction in this unit is between the **model** and the **product**.

The model is the neural network described in Unit 1: a function that reads tokens and predicts the next one. It has no memory between calls, no access to the internet, and no ability to do anything except produce text.

ChatGPT is a software application built around that model. The application is what gives you a chat history, a file-upload button, web search, image generation, voice, memory, and the rest. When ChatGPT "searches the web", the application runs a search and hands the model the results. When it "remembers" your name, the application stored a note and slipped it into the conversation. The model contributes the intelligence. The application contributes everything else.

```text
 +--------------------------------------------------------------+
 |                    ChatGPT  (the application)                |
 |                                                              |
 |  chat history   projects   memory   file storage   settings  |
 |                                                              |
 |  tools:  web search | code execution | image generation |    |
 |          file reading | connectors to your apps              |
 |                                                              |
 |        +-------------------------------------------+         |
 |        |   the MODEL  (stateless text predictor)   |         |
 |        +-------------------------------------------+         |
 +--------------------------------------------------------------+
```

Once you see this, many puzzles dissolve. Why did it not know today's news? The search tool was not used. Why did it forget what you said an hour ago? The application left it out of the text it sent. Why does the same model behave differently in another app? Different application, different instructions.

### The expert with a notepad

Here is a picture to carry through the unit. Imagine an expert who has perfect recall of everything they ever studied and no memory at all of your previous conversations. Each time you speak, an assistant hands the expert a **notepad**. The notepad contains, from top to bottom:

1. standing instructions about how to behave,
2. a few notes about you,
3. the transcript of this conversation so far,
4. a list of tools the expert may ask the assistant to use,
5. your newest message.

The expert reads the entire notepad from the top, writes a reply, and hands it back. Then the expert forgets everything. Next turn, the assistant hands over a fresh notepad with one more exchange added.

Three consequences follow.

- **The notepad has a fixed size.** That size is the context window. When the conversation outgrows it, the assistant must leave something out, and what is left out no longer exists for the expert.
- **Everything on the notepad affects the answer.** A long, wandering conversation fills the notepad with material that distracts from your current question.
- **Each turn re-reads everything.** Long conversations get slower and use up your allowance faster.

This is why the most common piece of advice from experienced users is so simple: **start a new chat when you change topic.**

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### The product surface

These are the main parts of ChatGPT. Availability and limits vary by plan.

| Feature | What it is | When to reach for it |
|---|---|---|
| Chat | A single conversation thread | Any one-off question or task |
| Projects | A workspace that groups related chats, files, and instructions | Ongoing work: a client, a course, a codebase |
| Canvas | A side-by-side editor for a document or code file | Drafting and revising something longer than a reply |
| Search | Live web results with links to sources | Anything recent, or anything you need to verify |
| File uploads | Attach documents, spreadsheets, images, PDFs | Working from your own material |
| Data analysis | The model writes and runs code on your files | Spreadsheets, charts, calculations |
| Image generation | Create and edit images from a description | Illustrations, mock-ups, diagrams |
| Voice | Spoken conversation | Hands-free use, language practice, talking through ideas |
| Deep research | A longer autonomous investigation that returns a cited report | Questions that need many sources |
| Tasks | Prompts that run on a schedule | Recurring summaries and reminders |
| Agent mode | The model operates a browser and tools to complete multi-step jobs | Chores that involve several sites or steps |
| Apps and connectors | Links to services such as cloud storage, email, and calendars | Bringing your own data into a chat |
| Custom GPTs | Reusable assistants with their own instructions and files | Repeating the same kind of task |
| Memory | Notes about you carried across conversations | Preferences you do not want to restate |
| Temporary chat | A conversation that is not saved and does not use or create memories | Sensitive or one-off questions |

Later modules in this unit cover most of these one at a time. For now, the table is a menu: know what exists, so you recognise the right tool when a task calls for it.

### Plans

At the time of writing OpenAI offers the following consumer and organisation plans. Prices are for the United States.

| Plan | Price | Who it suits |
|---|---|---|
| Free | USD 0 | Trying it out; light everyday use with a smaller model and tight limits on advanced features |
| Go | About USD 8 per month | More messages, uploads, and memory than Free at a low price |
| Plus | USD 20 per month | Regular individual use: larger models, reasoning modes, custom GPTs, higher limits |
| Pro | From USD 100 per month, in tiers | Heavy professional use: the highest limits and the most capable reasoning modes |
| Business | About USD 25 per user per month, less on annual billing | Teams: a shared workspace, admin controls, and business data excluded from training by default |
| Enterprise and Edu | Negotiated | Large organisations: security integration, compliance controls, audit logs |

Plans differ along four axes: **which models** you can use, **how many messages** you can send before being slowed or moved to a smaller model, **which tools** are included, and **how large the context window is**. The published context sizes at the time of writing illustrate the last point. On the standard fast mode they range from roughly 27 thousand tokens on Free, to about 54 thousand on Go and Plus, to about 128 thousand on Pro, with reasoning modes on paid plans given several times more. The exact figures will change. The pattern, that a higher plan buys a bigger notepad, has been stable.

### How a conversation is assembled

When you send a message, the application builds one long sequence and sends it to the model. The parts are labelled by **role**.

```text
 +---------------------------------------------------------------------+
 | SYSTEM      OpenAI's instructions for the product: identity, rules, |
 |             today's date, descriptions of available tools           |
 +---------------------------------------------------------------------+
 | (inserted)  your custom instructions, saved memories, project       |
 |             instructions and relevant project files                 |
 +---------------------------------------------------------------------+
 | USER        your first message                                      |
 | ASSISTANT   the model's first reply                                 |
 | USER        your second message                                     |
 | ASSISTANT   tool call: search("...")                                |
 | TOOL        search results returned by the application              |
 | ASSISTANT   the reply written from those results                    |
 |   ...                                                               |
 +---------------------------------------------------------------------+
 | USER        your newest message                                     |
 +---------------------------------------------------------------------+
        the model reads ALL of this, top to bottom, on EVERY turn
```

Three roles carry most of the weight.

- **System** messages come from whoever built the application. They rank highest. In ChatGPT you never see them, and they are long.
- **User** messages are what you type.
- **Assistant** messages are the model's earlier replies, fed back in so it can see what it said.

A fourth kind of entry holds the results of tools. Notice what this structure implies. The model's "memory" of the conversation is nothing more than the text of earlier turns being resent. And the hidden instructions and inserted notes occupy part of the context before you have typed a word.

### The arithmetic of the context window

Let $W$ be the context window in tokens. Not all of it is available for your material. Some is reserved for the reply, and some is consumed by the system instructions, memories, and tool descriptions. The space left for conversation and documents is:

$$
\text{usable input} = W - R_{\text{reply}} - S_{\text{system}} - M_{\text{memory and tools}}
$$

With a 54,000-token window, 4,000 tokens reserved for the reply, 3,000 for system instructions, and 1,000 for memories and tool descriptions, the usable input is $54{,}000 - 4{,}000 - 3{,}000 - 1{,}000 = 46{,}000$ tokens. Those overhead figures are illustrative. The point is that the advertised window and the space you can fill are different numbers.

For planning, a common rule of thumb for English text is about four characters per token:

$$
\text{tokens} \approx \frac{\text{characters}}{4}
$$

so 46,000 tokens is on the order of 184,000 characters, or very roughly 30,000 words. As Module 1.9 explained, this estimate is poor for other languages, code, and tables.

**What happens when the conversation does not fit.** An application has three options.

1. **Refuse.** Report an error and make the user start again.
2. **Truncate.** Drop the oldest turns. Simple, and the model then has no trace of them.
3. **Compact.** Replace older turns with a short summary. More of the gist survives, though any specific detail may be lost in the summarising.

OpenAI's developer documentation describes exactly these choices for people building their own applications on its API: a request that exceeds the window fails by default, an older setting drops items from the start of the conversation, and the currently recommended approach is compaction once the conversation crosses a threshold. How the ChatGPT application itself manages long conversations is not publicly specified in detail. From the user's side the effect is familiar: in a very long chat, early instructions and facts quietly stop being followed.

**Cost of length.** Because the whole history is resent each turn, a conversation of $n$ turns averaging $k$ tokens each sends roughly $k(1 + 2 + \dots + n) = \dfrac{k\,n\,(n+1)}{2}$ tokens in total. The work grows with the square of the conversation length. A chat ten times longer costs about a hundred times more to process, which is one reason message limits bite sooner in long threads.

### Data controls

What happens to your conversations depends on your plan and settings. At the time of writing:

- On consumer plans (Free, Go, Plus, Pro), a setting called "Improve the model for everyone" is switched on by default, which permits your conversations to be used in training future models. You can switch it off in the data controls settings and keep your chat history.
- Switching it off does not delete existing chats. Deleting is a separate action.
- A **Temporary Chat** is not saved to your history, does not read or create memories, and is not used for training. OpenAI states that it may keep a copy for a limited period, up to 30 days, for safety monitoring.
- Giving thumbs-up or thumbs-down feedback on a reply can send that conversation to OpenAI for review even if you opted out of training.
- Business, Enterprise, and Edu workspaces, and the developer API, are not used for training by default.

The practical rule: do not paste confidential client material into a personal account without checking these settings and your client's requirements first.

## 3. Production-Grade Implementation & Annotated Walkthrough

The assembly step is easy to reproduce. This standard-library program builds the list of messages an application would send, estimates its size, and trims it to a budget.

```python
import math

def build_messages(system, history, user_message):
    """Assemble one request: system instructions, prior turns, then the new message."""
    return [{"role": "system", "content": system}] + list(history) + [{"role": "user", "content": user_message}]

def estimate_tokens(text):
    """Rule of thumb for English: about 4 characters per token."""
    return math.ceil(len(text) / 4)

def total_tokens(messages):
    return sum(estimate_tokens(m["content"]) for m in messages)

def trim_history(messages, budget):
    """Drop the OLDEST turns until the request fits. Never drop the system message
    (first) or the newest user message (last)."""
    system, middle, newest = messages[0], list(messages[1:-1]), messages[-1]
    while middle and total_tokens([system] + middle + [newest]) > budget:
        middle.pop(0)
    return [system] + middle + [newest]

history = [
    {"role": "user", "content": "My order number is 88213 and I ordered a blue kettle."},
    {"role": "assistant", "content": "Thanks. I can see order 88213 for a blue kettle."},
    {"role": "user", "content": "It arrived with a cracked lid. What are my options?"},
    {"role": "assistant", "content": "You can have a replacement lid, a full replacement, or a refund."},
]
request = build_messages("You are a polite support agent.", history, "Go with the refund. What was my order number?")

print(len(request), "messages,", total_tokens(request), "estimated tokens")
for budget in (100, 55):
    kept = trim_history(request, budget)
    visible = any("88213" in m["content"] for m in kept)
    print(f"budget {budget}: {len(kept)} messages kept, order number visible: {visible}")
```

Line by line:

- **`build_messages` returns a new list.** `list(history)` copies the history, so the caller's list is not altered. Each message is a small dictionary with a `role` and `content`, which is the shape every chat API uses.
- **The system message is always first and the new user message always last.** Position carries meaning: the model is trained to treat the first block as standing instructions and the last as what it must respond to.
- **`estimate_tokens` rounds up.** A message of one character still costs a token. Real applications call the provider's tokenizer for an exact count. The estimate is good enough to make decisions with a safety margin.
- **`trim_history` protects two messages.** Dropping the system message would strip the application of its instructions. Dropping the newest message would leave nothing to answer. Everything in between is expendable, oldest first.
- **`while middle and ...` stops when nothing is left to drop.** If the system message and the newest message alone exceed the budget, the function returns them anyway. Sending a slightly oversized request and handling the error is better than sending nothing.
- **The output shows the failure users complain about.** At a budget of 100 everything fits and the order number is visible. At 55 the earliest turns are dropped, and the question "what was my order number?" can no longer be answered from the context. The model did not forget. The application stopped telling it.

A practical refinement is to keep turns in pairs. Dropping a user message and keeping the assistant's reply to it leaves a confusing fragment:

```python
def trim_pairs(messages, budget):
    """Like trim_history, but removes the oldest user+assistant pair together."""
    system, middle, newest = messages[0], list(messages[1:-1]), messages[-1]
    while len(middle) >= 2 and total_tokens([system] + middle + [newest]) > budget:
        del middle[:2]
    return [system] + middle + [newest]
```

And the context-window arithmetic:

```python
def usable_input(context_window, reserved_reply, system_tokens, memory_tokens):
    """Tokens left for conversation and documents. Never negative."""
    return max(0, context_window - reserved_reply - system_tokens - memory_tokens)

print(usable_input(54_000, 4_000, 3_000, 1_000))      # 46000
print(usable_input(8_000, 4_000, 3_000, 2_000))       # 0, not -1000
```

The `max(0, ...)` guard matters. A negative budget passed into a trimming loop is the kind of bug that surfaces only in production, on the one configuration nobody tested.

**Complexity.** Assembling a request is linear in the number of messages. The simple trimming loop recomputes the total after each removal, so in the worst case it is quadratic in the number of messages, which is irrelevant for a chat of dozens of turns and worth improving with a running total for thousands.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Start a new chat for a new topic.** This is the most repeated advice among heavy users, and the notepad model explains why. Old material competes with your current question for the model's attention, uses up the context window, and makes every turn slower and more costly against your limits.

**Long chats degrade quietly.** There is no warning when early content is dropped or summarised. The symptoms are instructions being ignored, facts being "forgotten", and answers drifting. When you notice them, ask for a summary of what has been established, open a new chat, and paste the summary in.

**The context window is not the same as usable space.** Hidden instructions, memories, tool descriptions, and the reserve for the reply all come out of the total. Users are regularly surprised when a document that "should fit" does not.

**Feature names and limits move constantly.** Tutorials more than a few months old often describe menus and limits that no longer exist. When a guide and your screen disagree, trust your screen and the current pricing page.

**Know which model you are on.** The application may route you to a smaller model when you reach a limit, sometimes with only a small notice. If answer quality drops suddenly in the middle of a session, check the model indicator.

**Search has to actually run.** If you need current information, turn search on or ask for it explicitly, and check that the reply shows sources. Without it you get the model's memory, with its cutoff date, delivered with the same confidence.

**Uploading a file is not the same as the model reading all of it.** Large files may be searched for relevant passages. Not all of the text is necessarily loaded. If an answer must reflect the entire document, say so, and check by asking about something specific from the middle.

**Opting out of training is not deletion, and feedback buttons are a side door.** People assume switching off the training setting removes their data or that it covers everything. It does neither. Read the data-controls page once, properly.

**Personal accounts and client data do not mix by default.** Consumer plans permit training use unless you switch it off, while business workspaces exclude it by default. Many organisations require the latter. Ask before you paste.

**Character-based token estimates are rough.** Four characters per token is fine for a quick plan in English and can be off by a factor of two or more for other languages, code, or data. When limits are tight, use an exact counter.

## 5. Active Recall Check & Synthesis Summary

**Summary.** ChatGPT is an application wrapped around a stateless language model. The application supplies history, files, tools, memory, and settings, and on every turn it assembles a single sequence, system instructions, inserted notes, the conversation so far, tool results, and your new message, which the model reads in full before replying. The context window caps that sequence, part of it is consumed before you type anything, and when a conversation outgrows it the application must refuse, truncate, or summarise. Plans differ in the models available, message limits, included tools, and context size. Data controls differ by plan too, with consumer plans permitting training use unless you opt out and business plans excluding it by default. The most valuable habits follow directly from the mechanics: keep chats focused, start fresh when the topic changes, turn on search when currency matters, and treat specific limits as things to look up.

**Question 1.** A user says, "ChatGPT forgot the instructions I gave it at the start of our conversation." Using the notepad model, explain what most likely happened and what the user should do.

<details>
<summary>View Answer</summary>

The model has no memory between turns. On each turn the application assembles the conversation and sends it, and the model sees only what is in that assembled text. In a long conversation the total exceeds the context window, so the application drops or summarises the oldest turns, which is where the user's instructions were. Once they are no longer in the text sent to the model, they do not exist for it. The user should start a new chat and restate the instructions, or put durable instructions somewhere the application always includes, such as custom instructions or a project's instructions, and keep individual chats shorter.

</details>

**Question 2.** A plan advertises a 128,000-token context window. A user tries to paste a 125,000-token document and ask a question about it, and it does not work as expected. Give the arithmetic reason, and name two alternatives.

<details>
<summary>View Answer</summary>

The advertised window must hold everything: the application's system instructions, any memories and tool descriptions, the document, the question, and the space reserved for the reply. Usable input equals the window minus the reply reserve minus the system and memory overhead. If those take, say, 8,000 tokens together, only about 120,000 are available, and a 125,000-token document does not fit, so part of it is cut off or it is handled by searching passages instead of loading the whole text. Alternatives include uploading the file so the application retrieves relevant sections, splitting the document and working through it in parts, using a mode or plan with a larger window, or asking about specific sections.

</details>

**Question 3.** A freelance consultant wants to paste a client's unreleased financial report into ChatGPT on a personal Plus account. What should they check first, and what would you advise?

<details>
<summary>View Answer</summary>

They should check three things. First, the account's data controls: on consumer plans conversations may be used to improve models unless that setting is switched off. Second, what the client's contract or policy permits, since many organisations forbid sending confidential material to consumer AI services regardless of settings. Third, what else leaves the conversation: feedback buttons can submit a conversation for review, and memory may store details from it. Sound advice is to get the client's permission in writing, switch off training use or use a temporary chat at minimum, prefer a business workspace where data is excluded from training by default, and remove or mask details that are not needed for the task. If in doubt, do not paste it.

</details>

@@starter
"""
Lab: Assemble a Chat Request the Way an App Does
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".

A message is a dict:  {"role": "system" | "user" | "assistant", "content": "..."}
"""
import math

HISTORY = [
    {"role": "user", "content": "My order number is 88213 and I ordered a blue kettle."},
    {"role": "assistant", "content": "Thanks. I can see order 88213 for a blue kettle."},
    {"role": "user", "content": "It arrived with a cracked lid. What are my options?"},
    {"role": "assistant", "content": "You can have a replacement lid, a full replacement, or a refund."},
]


# ---------------------------------------------------------------- Step 1
def build_messages(system, history, user_message):
    """Return the list of messages for one request, in this order:
       1. a system message containing `system`
       2. every message in `history`, unchanged and in order
       3. a user message containing `user_message`
    Do not modify the `history` list that was passed in."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def estimate_tokens(text):
    """Estimate tokens as characters / 4, rounded UP (math.ceil). Empty text is 0."""
    # TODO Step 2a
    return None


def total_tokens(messages):
    """Sum of estimate_tokens(message["content"]) over all messages."""
    # TODO Step 2b
    return None


# ---------------------------------------------------------------- Step 3
def trim_history(messages, budget):
    """Return a new list that fits within `budget` tokens if possible.

    Always keep the first message (system) and the last message (newest user turn).
    While the total is over budget and there are messages in between, remove the
    OLDEST in-between message. If only the first and last remain, return them even
    if they are still over budget.
    """
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def usable_input(context_window, reserved_reply, system_tokens, memory_tokens):
    """Tokens left for conversation and documents:
       context_window - reserved_reply - system_tokens - memory_tokens, never below 0."""
    # TODO Step 4
    return None


if __name__ == "__main__":
    request = build_messages("You are a polite support agent.", HISTORY, "What was my order number?")
    print("messages      :", request)
    print("tokens        :", total_tokens(request) if request else None)
    print("trimmed       :", trim_history(request, 40) if request else None)
    print("usable input  :", usable_input(54_000, 4_000, 3_000, 1_000))

@@solution
"""
Lab solution: Assemble a Chat Request the Way an App Does
Standard library only.

A message is a dict:  {"role": "system" | "user" | "assistant", "content": "..."}
"""
import math

HISTORY = [
    {"role": "user", "content": "My order number is 88213 and I ordered a blue kettle."},
    {"role": "assistant", "content": "Thanks. I can see order 88213 for a blue kettle."},
    {"role": "user", "content": "It arrived with a cracked lid. What are my options?"},
    {"role": "assistant", "content": "You can have a replacement lid, a full replacement, or a refund."},
]


# ---------------------------------------------------------------- Step 1
def build_messages(system, history, user_message):
    """One request = standing instructions + everything said so far + the new message.

    The model is stateless: this list is ALL it will know about the conversation.
    list(history) copies the caller's list so it is never modified.
    """
    return ([{"role": "system", "content": system}]
            + list(history)
            + [{"role": "user", "content": user_message}])


# ---------------------------------------------------------------- Step 2
def estimate_tokens(text):
    """About 4 characters per token for English. Rounds up: one character still costs a token."""
    return math.ceil(len(text) / 4)


def total_tokens(messages):
    """The size of the whole request. This, not the last message, is what must fit."""
    return sum(estimate_tokens(message["content"]) for message in messages)


# ---------------------------------------------------------------- Step 3
def trim_history(messages, budget):
    """Truncation: the simplest way to make an oversized conversation fit.

    The system message carries the app's instructions and the newest message is what
    must be answered, so both are protected. Everything else goes, oldest first.
    Whatever is dropped no longer exists as far as the model is concerned.
    """
    system = messages[0]
    middle = list(messages[1:-1])
    newest = messages[-1]
    while middle and total_tokens([system] + middle + [newest]) > budget:
        middle.pop(0)
    return [system] + middle + [newest]


# ---------------------------------------------------------------- Step 4
def usable_input(context_window, reserved_reply, system_tokens, memory_tokens):
    """The advertised window minus everything that is spoken for. Never negative."""
    return max(0, context_window - reserved_reply - system_tokens - memory_tokens)


if __name__ == "__main__":
    request = build_messages("You are a polite support agent.", HISTORY,
                             "Go with the refund. What was my order number?")
    print(len(request), "messages,", total_tokens(request), "estimated tokens")
    for budget in (100, 55):
        kept = trim_history(request, budget)
        visible = any("88213" in m["content"] for m in kept)
        print(f"budget {budget}: {len(kept)} messages kept ({total_tokens(kept)} tokens), "
              f"order number visible: {visible}")

    print("usable input, 54K window :", usable_input(54_000, 4_000, 3_000, 1_000))
    print("usable input, 8K window  :", usable_input(8_000, 4_000, 3_000, 2_000))

@@step
{
  "stepNumber": 1,
  "title": "Assemble the request",
  "instruction": "Implement build_messages(system, history, user_message). Return a new list containing a system message with the given text, then every message from history in order, then a user message with the new text. Each message is a dict with the keys 'role' and 'content'. Do not change the history list that was passed in. This list is the entire 'notepad' from Section 1: the model will know nothing about the conversation beyond what is in it. [MOD-2.1]",
  "hintConceptual": "The model has no memory between turns, so every request must carry the standing instructions, everything said so far, and the new question, in that order.",
  "hintSyntax": "return [{\"role\": \"system\", \"content\": system}] + list(history) + [{\"role\": \"user\", \"content\": user_message}]"
}
@@assert
_h = [{"role": "user", "content": "hi"}, {"role": "assistant", "content": "hello"}]
_m = build_messages("Be brief.", _h, "What is 2+2?")
assert isinstance(_m, list) and len(_m) == 4, "With 2 history messages the request must contain 4 messages"
assert _m[0] == {"role": "system", "content": "Be brief."}, "The first message must be the system message"
assert _m[1:3] == _h, "History must appear unchanged and in order after the system message"
assert _m[-1] == {"role": "user", "content": "What is 2+2?"}, "The last message must be the new user message"
assert _h == [{"role": "user", "content": "hi"}, {"role": "assistant", "content": "hello"}], "The history list passed in must not be modified"
assert build_messages("S", [], "Q") == [{"role": "system", "content": "S"}, {"role": "user", "content": "Q"}], "With no history there are exactly two messages"
_m.append("x")
assert len(_h) == 2, "Changing the returned list must not change the caller's history (return a new list)"
print("Step 1 passed: you built the notepad the model reads on every turn.")

@@step
{
  "stepNumber": 2,
  "title": "Estimate the size of a request",
  "instruction": "Implement estimate_tokens(text) as the number of characters divided by 4, rounded up with math.ceil, so that an empty string is 0 and a single character is 1. Then implement total_tokens(messages) as the sum of estimate_tokens over each message's 'content'. The total for the whole list is what must fit in the context window, which is why a short new message can still fail in a long conversation. [MOD-2.1]",
  "hintConceptual": "English text averages about four characters per token. Round up so that small pieces of text are never counted as free. The request's size is the sum over everything in it, including the system message.",
  "hintSyntax": "# estimate_tokens\nreturn math.ceil(len(text) / 4)\n\n# total_tokens\nreturn sum(estimate_tokens(message[\"content\"]) for message in messages)"
}
@@assert
assert estimate_tokens("") == 0, "Empty text is 0 tokens"
assert estimate_tokens("a") == 1, "One character rounds up to 1 token"
assert estimate_tokens("abcd") == 1 and estimate_tokens("abcde") == 2, "4 characters is 1 token; 5 characters rounds up to 2"
assert estimate_tokens("x" * 400) == 100, "400 characters is 100 tokens"
assert isinstance(estimate_tokens("hello"), int), "estimate_tokens must return an integer"
_msgs = [{"role": "system", "content": "x" * 40}, {"role": "user", "content": "y" * 9}, {"role": "assistant", "content": ""}]
assert total_tokens(_msgs) == 13, "10 + 3 + 0 tokens = 13"
assert total_tokens([]) == 0, "An empty request is 0 tokens"
print("Step 2 passed: you can measure a request before sending it.")

@@step
{
  "stepNumber": 3,
  "title": "Trim old turns to fit the budget",
  "instruction": "Implement trim_history(messages, budget). Keep the first message (the system message) and the last message (the newest user turn) no matter what. While the total token estimate is above the budget and there are still messages between those two, remove the oldest in-between message. Return the result as a new list. If only the first and last messages remain, return them even when they are still over budget. This is truncation, the simplest strategy from Section 2, and it is why long chats 'forget' their beginnings. [MOD-2.1]",
  "hintConceptual": "The standing instructions and the question being asked are the two things the model cannot do without. Everything in between is expendable, and the oldest material is sacrificed first.",
  "hintSyntax": "system = messages[0]\nmiddle = list(messages[1:-1])\nnewest = messages[-1]\nwhile middle and total_tokens([system] + middle + [newest]) > budget:\n    middle.pop(0)\nreturn [system] + middle + [newest]"
}
@@assert
def _msg(role, n):
    return {"role": role, "content": "x" * (4 * n)}

_conv = [_msg("system", 10), _msg("user", 20), _msg("assistant", 20), _msg("user", 20), _msg("assistant", 20), _msg("user", 5)]
assert trim_history(_conv, 1000) == _conv, "When everything fits nothing is removed"
_t = trim_history(_conv, 60)
assert _t == [_conv[0], _conv[3], _conv[4], _conv[5]], "With a budget of 60 the two oldest turns are dropped (10 + 20 + 20 + 5 = 55)"
assert trim_history(_conv, 35) == [_conv[0], _conv[4], _conv[5]], "With a budget of 35 only the most recent in-between message survives"
assert trim_history(_conv, 1) == [_conv[0], _conv[5]], "The system message and the newest message are kept even if they exceed the budget"
assert len(_conv) == 6, "trim_history must not modify the list passed in"
assert trim_history([_msg("system", 3), _msg("user", 3)], 100) == [_msg("system", 3), _msg("user", 3)], "A request with nothing in between is returned as is"
print("Step 3 passed: the oldest turns go first, and the model never knows they existed.")

@@step
{
  "stepNumber": 4,
  "title": "How much of the window can you really use?",
  "instruction": "Implement usable_input(context_window, reserved_reply, system_tokens, memory_tokens). Return the context window minus the space reserved for the reply, minus the system instructions, minus the memory and tool overhead. If the result would be negative, return 0. This is the formula from Section 2 that explains why an advertised context size and the amount of your own material that fits are different numbers. [MOD-2.1]",
  "hintConceptual": "The window is shared. The reply needs room, the hidden instructions take room, and inserted memories take room. What is left is yours, and it can never be less than nothing.",
  "hintSyntax": "return max(0, context_window - reserved_reply - system_tokens - memory_tokens)"
}
@@assert
assert usable_input(54_000, 4_000, 3_000, 1_000) == 46_000, "54,000 - 4,000 - 3,000 - 1,000 = 46,000"
assert usable_input(128_000, 8_000, 3_000, 2_000) == 115_000, "128,000 - 8,000 - 3,000 - 2,000 = 115,000"
assert usable_input(8_000, 4_000, 3_000, 2_000) == 0, "A negative result must be returned as 0"
assert usable_input(10_000, 0, 0, 0) == 10_000, "With no overhead the whole window is usable"
assert usable_input(5_000, 2_000, 2_000, 1_000) == 0, "Exactly used up leaves 0"
print("Step 4 passed: a 54K window leaves about 46K for your own material.")
