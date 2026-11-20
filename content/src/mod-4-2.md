@@meta
{
  "moduleId": "MOD-4.2",
  "slug": "mod-4-2",
  "unitId": "UNIT-4",
  "unitTitle": "Unit 4: 100+ AI Tools Directory",
  "title": "The Directory",
  "difficulty": "Foundational",
  "estimatedMinutes": 100,
  "citations": [
    { "title": "OpenAI to discontinue Sora video app", "source": "Axios", "url": "https://www.axios.com/2026/03/24/openai-discontinue-sora-video-app" },
    { "title": "Announcing our company rebrand to Superhuman", "source": "Grammarly Blog", "url": "https://grammarly.com/blog/company/announcing-company-rebrand-to-superhuman" },
    { "title": "Migrate your Firebase Studio project", "source": "Firebase Docs", "url": "https://firebase.google.com/docs/studio/migrating-project" },
    { "title": "GitHub Copilot plans", "source": "GitHub", "url": "https://github.com/features/copilot/plans" },
    { "title": "Claude pricing and plans", "source": "Anthropic", "url": "https://claude.com/pricing" },
    { "title": "Artificial Analysis: independent analysis of AI models and providers", "source": "Artificial Analysis", "url": "https://artificialanalysis.ai" },
    { "title": "LMArena", "source": "LMArena", "url": "https://lmarena.ai" }
  ],
  "videoLibrary": [
    {
      "id": "VID-4.2-1",
      "title": "Every AI Tool You Need in 2026 — By Category",
      "creator": "Thetips4you",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=0Ba9-zDk2xQ",
      "timingInstruction": "Watch after reading Section 2 as a second opinion on the categories",
      "keyTakeaway": "A tour of tools arranged by category, useful for seeing several of the products in this directory on screen. Check each against the status notes here before relying on it."
    },
    {
      "id": "VID-4.2-2",
      "title": "7 AI Tools Every Beginner Should Try in 2026",
      "creator": "WealthTech Insights",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=LIqkwRXP07Y",
      "timingInstruction": "Optional; compare its seven with your own shortlist after Section 3",
      "keyTakeaway": "A short starting list for someone new, which is a good exercise in asking what job each tool is being recommended for."
    },
    {
      "id": "VID-4.2-3",
      "title": "Every AI Tool Explained in 6 Minutes (Beginner's Guide 2026)",
      "creator": "Patiently Explained",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=VaLwqzHdjVU",
      "timingInstruction": "Watch the sections on choosing between tools after reading Section 1",
      "keyTakeaway": "A quick map of the main AI tool categories covered by the directory."
    },
    {
      "id": "VID-4.2-4",
      "title": "Google AI Essentials",
      "creator": "Google",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/google-ai-essentials",
      "timingInstruction": "Take alongside Unit 4",
      "keyTakeaway": "A beginner course on using AI tools at work, with practice in matching a tool to a task."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: A Directory You Can Query and Keep Current",
    "context": "A team keeps its own short directory of AI tools and wants it to stay useful as products are renamed and closed. You will treat the directory as data and build the functions that keep it honest: a filter, a search, a check for entries that have not been verified recently, a resolver that follows a renamed tool to its current name, and a coverage report that shows gaps and overlaps in a chosen set.",
    "language": "python"
  }
}

@@reading
# The Directory

This chapter is a map of the AI tools worth knowing about in late 2026: more than 140 entries, arranged by the job each one does. It is meant to be consulted, not read from end to end. Find the category for your job, pick two or three candidates, and take them through the four stages of Module 4.1.

Every map has a date. This one was drawn in November 2026. Some entries will already be wrong when you read it, and Section 1 explains how to use a directory that you know is partly out of date.

## 1. First-Principles Mental Model & Intuition

### A map with a date on it

A street map shows roads, which change slowly. A directory of AI tools shows products, which change monthly. Between early 2025 and late 2026, the following happened to well-known tools.

| What happened | Example |
|---|---|
| **Closed** | OpenAI announced in March 2026 that it was ending its Sora video app. The Humane AI Pin was switched off in 2025 |
| **Renamed** | NotebookLM became Gemini Notebook in July 2026. The Windsurf code editor became Devin Desktop in June 2026 |
| **Acquired** | Windsurf was bought by Cognition in 2025. The maker of the Limitless recording pendant was bought by Meta, and sales stopped |
| **Reorganised** | The company behind Grammarly renamed itself Superhuman in October 2025 and now sells Grammarly, an email client, and a document tool together |
| **Replaced by a successor** | Google announced the closure of Firebase Studio and pointed users to other tools. Gems and custom GPTs are giving way to skills |
| **Changed its terms** | The music generators Suno and Udio reached agreements with record labels that alter what users may do with what they make |

So read every entry as a claim with an expiry date. The category structure will last. The jobs will last. The individual names are the perishable part.

### How to read an entry

Each row gives three things.

```text
   TOOL                 WHAT JOB IT DOES                        NOTES
   the product's name   one line, in terms of the task          maker, status changes, where the
                                                                course covers it
```

Prices are left out of the tables on purpose. They change faster than anything else, and a wrong price is worse than none. A short table of price points checked in November 2026 follows the directory, to give a sense of scale.

### The three layers, again

Module 4.1 pointed out that most tools are built on a few underlying models. Keep that in mind while browsing.

```text
   SPECIALISED APPS    most of the entries below: a workflow and an interface around a model
   ASSISTANTS          the first table: general tools that can attempt almost any of these jobs
   MODELS              the last tables: the engines, including ones you can run yourself
```

For any job, the general assistant you already use is a candidate. A specialised tool has to beat it by enough to justify a second subscription.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### How fast a directory decays

Suppose each entry has, independently, a probability $c$ per month of changing in a way that makes the entry wrong: closed, renamed, bought, or substantially repriced. After $t$ months the fraction of entries still accurate is

$$
A(t) = (1 - c)^{t}
$$

and in a directory of $n$ entries the expected number that have gone stale is

$$
n \cdot \bigl(1 - (1 - c)^{t}\bigr)
$$

The rate $c$ is not known. Taking 3 percent a month as an illustration, a directory of 146 entries loses about $146 \times 0.03 \approx 4.4$ entries a month, and after a year $0.97^{12} = 0.694$ of it is still right, which means about 45 entries are wrong. The examples in Section 1 suggest the true rate is at least of that order.

Two practical rules follow. Record the date each entry was last checked, and treat anything older than about three months as unverified. And before you depend on a tool, spend one minute confirming that it still exists under that name and still does that job.

### 1. General assistants

The tools that can attempt almost anything. Start here for any job.

| Tool | What job it does | Notes |
|---|---|---|
| ChatGPT | General assistant: writing, analysis, images, code, voice, and web search | OpenAI. Free tier. Unit 2 |
| Claude | General assistant, strong on writing, long documents, and code | Anthropic. Free tier. Unit 3 |
| Gemini | General assistant tied to Google Search and Google's apps | Google. Free tier. Modules 3.10 to 3.14 |
| Microsoft Copilot | General assistant built into Windows, Edge, and Microsoft 365 | Microsoft. Free tier |
| Meta AI | Assistant inside WhatsApp, Instagram, and Messenger | Meta |
| Grok | Assistant connected to the X social network | xAI |
| Perplexity | Answers questions by searching the web and citing sources | Also a research tool |
| Le Chat | General assistant from a European provider | Mistral AI |
| DeepSeek | General assistant with openly released reasoning models | DeepSeek |

### 2. Research and search

| Tool | What job it does | Notes |
|---|---|---|
| Gemini Notebook | Answers from your own documents, with citations to the passage | Google. Formerly NotebookLM. Module 3.14 |
| Elicit | Finds research papers and extracts their data into tables | For literature reviews |
| Consensus | Answers a question from peer-reviewed studies | |
| Scite | Shows whether later papers support or dispute a cited finding | |
| SciSpace | Explains papers and searches the literature | |
| Semantic Scholar | Free academic search with short summaries of papers | Allen Institute for AI |
| Research Rabbit | Maps related papers outward from a starting set | |
| Kagi | Paid search engine without advertising, with AI summaries | |
| You.com | Search engine and assistant combined | |

Every major assistant also has a deep research mode that produces a cited report over several minutes. Modules 2.7 and 3.12 cover them.

### 3. Writing and editing

| Tool | What job it does | Notes |
|---|---|---|
| Grammarly | Checks grammar and tone and rewrites text wherever you type | Its parent company is now called Superhuman. The product keeps its name |
| QuillBot | Paraphrases, summarises, and checks grammar | |
| DeepL Write | Polishes and rewrites text in several languages | From the translation company DeepL |
| Jasper | Marketing copy in a consistent brand voice | Aimed at marketing teams |
| Copy.ai | Sales and marketing text and repeatable workflows | |
| Writesonic | Search-optimised articles and marketing copy | |
| Sudowrite | An assistant for fiction writers | |
| Notion AI | Writing help and question answering inside a Notion workspace | Notion |

A general assistant with samples of your writing, set up as in Module 3.2, covers much of this category.

### 4. Productivity, notes, and meetings

| Tool | What job it does | Notes |
|---|---|---|
| Microsoft 365 Copilot | Assistant inside Word, Excel, PowerPoint, Outlook, and Teams | Microsoft |
| Gemini in Google Workspace | Assistant inside Gmail, Docs, Sheets, Slides, and Meet | Google. Module 3.13 |
| Otter | Records, transcribes, and summarises meetings | |
| Fireflies | A recorder that joins your calls and files the notes | |
| Fathom | Meeting notes and summaries | Known for a generous free plan |
| Granola | Meeting notes taken from your computer's audio, with no bot joining the call | |
| tl;dv | Records meetings and lets you clip and share moments | |
| Read AI | Meeting summaries with analytics on participation | |
| Motion | Plans your day by scheduling tasks into your calendar | |
| Reclaim | Protects time in your calendar for tasks and habits | |
| Superhuman Mail | An email client with AI drafting and triage | Same company as Grammarly |

A wearable recorder called Limitless was a popular entry in this category until its maker was acquired by Meta at the end of 2025 and sales ended.

### 5. Image generation and design

| Tool | What job it does | Notes |
|---|---|---|
| Midjourney | Highly stylised images from a text description | Subscription |
| ChatGPT image generation | Images made and edited by conversation, good at lettering | OpenAI. Module 2.9 |
| Gemini image generation | Images made and edited in Gemini, good at keeping a subject consistent | Google |
| Adobe Firefly | Image generation inside Adobe's applications | Adobe. Trained on licensed content |
| Stable Diffusion | Openly released image models that you can run yourself | Stability AI |
| FLUX | High-quality image models, some openly released | Black Forest Labs |
| Ideogram | Images with accurate text, for posters and logos | |
| Leonardo | Image generation with fine control, popular for design and game art | Part of Canva |
| Recraft | Vector graphics, icons, and brand-consistent illustration | |
| Canva Magic Studio | AI tools inside the Canva design editor | Canva |
| Krea | Real-time image generation and upscaling | |
| Freepik | A stock library with AI image and video generators | |

### 6. Video

| Tool | What job it does | Notes |
|---|---|---|
| Google Veo and Flow | Video clips with sound from text, and a filmmaking tool built on them | Google |
| Runway | Video generation and AI editing tools for creators | |
| Luma Dream Machine | Video from text and images | Luma AI |
| Kling | Video from text and images | Kuaishou |
| Pika | Short, playful video generation and effects | |
| HeyGen | Talking-avatar videos, and dubbing into other languages | |
| Synthesia | Avatar-presented training and corporate videos | |
| Descript | Edits video and audio by editing the transcript | |
| CapCut | A video editor with AI captions, effects, and templates | ByteDance |
| Opus Clip | Cuts long videos into short clips for social media | |
| InVideo | Turns a script or prompt into an edited video | |

OpenAI's Sora, which was the best-known name in this category, is not listed: OpenAI announced the closure of the Sora app in March 2026.

### 7. Audio, voice, and music

| Tool | What job it does | Notes |
|---|---|---|
| ElevenLabs | Lifelike speech from text, voice cloning, and dubbing | |
| Murf | Voiceovers for videos and presentations | |
| Suno | Complete songs from a text description | Agreements with record labels are changing its terms |
| Udio | Songs from a text description | Moving to a licensed model after settling with labels |
| Adobe Podcast | Cleans up recorded speech | Adobe |
| Krisp | Removes background noise from calls, and takes meeting notes | |

For music in particular, read the current terms on ownership and commercial use before publishing anything.

### 8. Presentations and visuals

| Tool | What job it does | Notes |
|---|---|---|
| Gamma | Presentations, documents, and simple web pages from a prompt | |
| Beautiful.ai | Slides that arrange themselves as you add content | |
| Pitch | A collaborative presentation tool with AI drafting | |
| Napkin | Turns a passage of text into diagrams and visuals | |

PowerPoint, Google Slides, and Canva each have their own built-in generators, listed above under their parent products. Tome, once a leading name here, left presentations and was wound down.

### 9. Coding assistants and editors

| Tool | What job it does | Notes |
|---|---|---|
| GitHub Copilot | Code completion, chat, and a coding agent, in your editor and on GitHub | GitHub, part of Microsoft. Free tier |
| Cursor | A code editor built around AI, with agents | Anysphere |
| Claude Code | A coding agent in the terminal, editor, desktop app, and web | Anthropic. Module 3.4 |
| OpenAI Codex | A coding agent in the cloud, the terminal, and the editor | OpenAI |
| Devin Desktop | An agentic code editor | Cognition. Formerly Windsurf, and before that Codeium |
| Gemini CLI | An open-source coding agent for the terminal | Google |
| Google Antigravity | A development environment built around agents | Google |
| JetBrains AI | An assistant inside the JetBrains editors | JetBrains |
| Tabnine | Code completion with an emphasis on privacy and private deployment | |
| Amazon Q Developer | A coding assistant for people building on AWS | AWS |
| Kiro | An editor that works from written specifications | AWS |
| Zed | A fast open-source editor with AI built in | |
| Cline | An open-source coding agent for VS Code that uses your own API key | |
| Aider | An open-source pair programmer in the terminal | |
| Continue | An open-source assistant for editors that works with any model | |

Unit 9 covers coding with AI in depth.

### 10. App builders

Tools that build a working application from a description, for people who do not write code.

| Tool | What job it does | Notes |
|---|---|---|
| Lovable | Builds a full web application from a conversation | |
| Bolt.new | Builds and runs web applications in the browser from a prompt | StackBlitz |
| v0 | Generates interfaces and applications from prompts | Vercel |
| Replit | Builds, runs, and hosts applications from chat, in the browser | |
| Base44 | Builds applications with a built-in database from prompts | Part of Wix |
| Devin | An autonomous software agent you delegate tasks to | Cognition |

Google's Firebase Studio belonged here. Google has announced its closure, with a final shutdown date in March 2027, and directs users to other tools.

### 11. Automation and workflow

| Tool | What job it does | Notes |
|---|---|---|
| Zapier | Connects thousands of applications, with AI steps and agents | |
| Make | A visual builder for multi-step automations | |
| n8n | Workflow automation that you can host yourself, with AI nodes | Unit 7 |
| Microsoft Power Automate | Automation across Microsoft 365 and business systems | Microsoft |
| IFTTT | Simple "if this, then that" automations for individuals | |
| Relay.app | Automations with steps that wait for a person's approval | |
| Lindy | No-code AI assistants for email, scheduling, and support | |
| Gumloop | Drag-and-drop AI workflows | |
| Activepieces | An open-source automation platform | |

### 12. Agent platforms and frameworks

For people building their own agents. Unit 8 covers this.

| Tool | What job it does | Notes |
|---|---|---|
| OpenAI Agents SDK and AgentKit | Building blocks and visual tools for agents | OpenAI |
| Claude Agent SDK | The agent loop behind Claude Code, as a library | Anthropic |
| LangChain and LangGraph | An open-source framework for model-driven applications and agents | |
| CrewAI | A framework for teams of agents with assigned roles | |
| Microsoft Agent Framework | An open-source framework for agents | Microsoft. Successor to AutoGen and Semantic Kernel |
| LlamaIndex | A framework for agents that work over your documents and data | |
| Google Agent Development Kit | An open-source toolkit for building agents | Google |
| Microsoft Copilot Studio | A low-code builder for business agents | Microsoft |
| Dify | An open-source platform for building AI applications visually | |

### 13. Data and analysis

| Tool | What job it does | Notes |
|---|---|---|
| Julius | Chat with a spreadsheet or dataset and get charts | |
| Hex | Collaborative data notebooks with AI assistance | |
| Microsoft Power BI | Business dashboards that answer questions in plain language | Microsoft |
| Tableau | Data visualisation with AI assistance | Salesforce |

The general assistants analyse uploaded files directly, as Module 2.8 showed, and Excel and Google Sheets have built-in assistants listed under category 4. For most people those come first.

### 14. Customer support, sales, and marketing

| Tool | What job it does | Notes |
|---|---|---|
| Intercom Fin | An AI agent that answers customer support questions | Intercom |
| Zendesk AI | AI agents and assistance inside a help desk | Zendesk |
| HubSpot Breeze | AI features and agents across a customer database | HubSpot |
| Salesforce Agentforce | Agents that work inside Salesforce | Salesforce |
| Clay | Gathers and enriches data about sales prospects | |
| Apollo | A database of prospects with outreach tools | |
| Surfer | Optimises articles to rank in search engines | |
| Semrush | A marketing toolkit for search and AI visibility | |

### 15. Running models locally

Tools that run a model on your own computer, so that nothing leaves it. Unit 10 covers this.

| Tool | What job it does | Notes |
|---|---|---|
| Ollama | Runs open models on your own computer with one command | Also offers hosted models |
| LM Studio | A desktop application for downloading and chatting with local models | |
| Jan | An open-source desktop application for local models | |
| GPT4All | A local chat application | Nomic |
| llama.cpp | The open-source engine that many local tools are built on | |
| Open WebUI | A chat interface you host yourself, for local or remote models | |
| AnythingLLM | A local application for chatting with your own documents | |
| Hugging Face | The hub where open models and datasets are published | |
| vLLM | A server for running open models for many users at once | |

### 16. Open model families

The engines you can download. Module 1.7 explained the difference between open and closed models.

| Family | From | Notes |
|---|---|---|
| Llama | Meta | Widely used. Its licence has conditions |
| Gemma | Google | Small models designed for modest hardware |
| Mistral | Mistral AI | A mix of open and commercial models |
| Qwen | Alibaba | A large family, including coding and vision models |
| DeepSeek | DeepSeek | Open reasoning models |
| Phi | Microsoft | Small models for devices |
| gpt-oss | OpenAI | Open-weight models released in 2025 |

### 17. Model access and infrastructure

What developers, and the tools in the categories above, are built on.

| Tool | What job it does | Notes |
|---|---|---|
| OpenAI API | Programmatic access to OpenAI's models | Billed by usage |
| Claude API | Programmatic access to Anthropic's models | Billed by usage |
| Gemini API and Google AI Studio | Programmatic access to Google's models, with a browser workbench | Free tier. Module 3.10 |
| OpenRouter | One account and interface for models from many providers | |
| Together AI | Hosted open models, billed by usage | |
| Amazon Bedrock | Many providers' models through AWS | AWS |
| Azure AI Foundry | Models and agent tools through Microsoft's cloud | Microsoft |
| Pinecone | A database for the embeddings used in retrieval | |
| Supabase | A database and backend service with support for embeddings | |

### Price points, for a sense of scale

These figures were checked on the vendors' own pages in November 2026. They illustrate typical levels and will change.

| Product | Entry-level paid plan | Higher tiers |
|---|---|---|
| Claude | Pro at USD 20 a month, or USD 17 a month billed annually | Max at USD 100, Ultra at USD 200 |
| GitHub Copilot | Pro at USD 10 a month | Pro+ at USD 39, Max at USD 100 |
| Replit | Core at USD 20 a month | Pro at USD 100 |
| Zapier | Paid plans from about USD 30 a month | Team plans from about USD 100 |
| Ollama | Free on your own computer | Hosted plans from USD 20 a month |

The pattern is consistent across the industry. A standard plan for an individual costs about USD 20 a month, and a premium tier for heavy use costs USD 100 to 250. Five standard plans add up to the price of an entry premium tier, which is why overlap matters, as Module 4.3 discusses.

### Independent comparisons

For choosing between models, two public resources are more useful than any ranked list of tools.

| Resource | What it measures |
|---|---|
| Artificial Analysis | Independent measurements of models' quality, speed, and price, across providers |
| LMArena | Rankings from blind, side-by-side comparisons voted on by users |

Both rank models, not products, and a benchmark position is an average over tasks that may not resemble yours. Use them to draw up a shortlist and your own trial to decide.

### Complexity

Looking up a category is immediate. Keeping a directory current costs effort in proportion to its size and its rate of change, $n \cdot c$ entries a month. This is the argument for a short personal directory of the tools you use, which is the subject of the lab.

## 3. Production-Grade Implementation & Annotated Walkthrough

A directory is data, and data can be queried and checked. Here is a small one, with the fields that keep it honest.

```python
from datetime import date

def entry(name, category, job, free, status="active", replaced_by=None, checked="2026-11-01"):
    return {"name": name, "category": category, "job": job, "free": free,
            "status": status, "replaced_by": replaced_by, "checked": checked}

DIRECTORY = [
    entry("ChatGPT", "assistant", "general assistant for writing analysis images and code", True, checked="2026-11-10"),
    entry("Claude", "assistant", "general assistant for writing long documents and code", True, checked="2026-11-10"),
    entry("Gemini Notebook", "research", "answers from your own documents with citations", True, checked="2026-10-02"),
    entry("NotebookLM", "research", "answers from your own documents with citations", True, "renamed", "Gemini Notebook", "2026-07-20"),
    entry("Elicit", "research", "finds research papers and extracts data into tables", True, checked="2026-05-01"),
    entry("Grammarly", "writing", "checks grammar and tone and rewrites text", True, checked="2026-09-15"),
    entry("Otter", "meetings", "records transcribes and summarises meetings", True, checked="2026-03-12"),
    entry("Granola", "meetings", "meeting notes from your computer audio without a bot", False, checked="2026-08-30"),
    entry("Midjourney", "image", "stylised images from a text description", False, checked="2026-06-18"),
    entry("Sora", "video", "video clips from a text description", False, "closed", None, "2026-04-27"),
    entry("Runway", "video", "video generation and editing tools", True, checked="2026-09-01"),
    entry("Codeium", "coding", "code completion in your editor", True, "renamed", "Windsurf", "2025-01-10"),
    entry("Windsurf", "coding", "agentic code editor", True, "renamed", "Devin Desktop", "2026-06-05"),
    entry("Devin Desktop", "coding", "agentic code editor", True, checked="2026-10-20"),
    entry("n8n", "automation", "workflow automation you can host yourself", True, checked="2026-10-28"),
    entry("Ollama", "local", "run open models on your own computer", True, checked="2026-11-01"),
]

def find_tools(directory, category=None, free_only=False):
    return [tool["name"] for tool in directory
            if tool["status"] == "active"
            and (category is None or tool["category"] == category)
            and (not free_only or tool["free"])]

def search(directory, query):
    wanted = set(query.lower().split())
    scored = []
    for tool in directory:
        words = set((tool["name"] + " " + tool["job"]).lower().split())
        hits = len(wanted & words)
        if hits:
            scored.append((-hits, tool["name"]))
    return [name for _, name in sorted(scored)]

print(find_tools(DIRECTORY, "meetings"), find_tools(DIRECTORY, "meetings", free_only=True), find_tools(DIRECTORY, "video"))
print(search(DIRECTORY, "meeting notes"))
print(search(DIRECTORY, "notebooklm"))
```

- **Each entry records its status and the date it was checked.** A plain list of names goes out of date silently. With these two fields the directory can tell you which of its own entries to distrust.
- **`find_tools` returns only active tools.** A closed product is kept in the data, because people will still look for it, and is never offered as a recommendation. The video category returns Runway alone.
- **The filters combine.** Asking for free meeting tools drops Granola, which has no free plan in this data.
- **`search` ranks by the number of matching words.** Scores are stored as negative numbers so that an ordinary sort puts the best matches first and breaks ties alphabetically.
- **Search covers every status.** Looking for "notebooklm" finds the old entry. Someone following a year-old tutorial will search by the old name, and the next function tells them where it went.

Next, keeping it current.

```python
def stale_entries(directory, today, max_age_days=90):
    old = [((today - date.fromisoformat(tool["checked"])).days, tool["name"])
           for tool in directory if tool["status"] == "active"]
    return [name for age, name in sorted(old, reverse=True) if age > max_age_days]

def resolve(name, directory):
    by_name = {tool["name"]: tool for tool in directory}
    for _ in range(len(directory) + 1):
        tool = by_name.get(name)
        if tool is None or tool["status"] == "closed":
            return None
        if tool["status"] == "active":
            return name
        name = tool["replaced_by"]
    return None

TODAY = date(2026, 11, 15)
print(stale_entries(DIRECTORY, TODAY))
for old_name in ("Codeium", "NotebookLM", "Sora", "Claude", "Rewind"):
    print(f"{old_name:<11} -> {resolve(old_name, DIRECTORY)}")
print(f"entries changing per month at 3%: {146 * 0.03:.1f}; still accurate after a year: {0.97 ** 12:.3f}; "
      f"expected stale: {146 * (1 - 0.97 ** 12):.0f}")
```

- **`stale_entries` reports active tools not checked within the limit.** Dates are compared as real dates. Three entries are more than ninety days old, listed oldest first: Otter, Elicit, and Midjourney. They may be perfectly fine. Nobody has confirmed it recently.
- **Closed and renamed entries are not reported as stale.** There is nothing to re-check about a product that no longer exists under that name.
- **`resolve` follows the chain of renames.** Codeium became Windsurf, and Windsurf became Devin Desktop. The function walks from one to the next until it reaches an active entry.
- **Three ways to end.** An active tool returns its current name. A closed tool, or a name the directory has never heard of, returns `None`. The caller can tell "use this instead" from "this is gone".
- **The loop is bounded.** If two entries ever pointed at each other by mistake, an unbounded loop would never finish. Limiting the number of hops to the size of the directory guarantees an answer.
- **The last line is the decay arithmetic from Section 2.** About four entries a month, and about 45 wrong after a year.

Finally, checking a chosen set of tools against the jobs you need done.

```python
def coverage(jobs, chosen, directory):
    by_name = {tool["name"]: tool for tool in directory}
    report = {job: [] for job in jobs}
    for name in chosen:
        tool = by_name.get(name)
        if tool and tool["status"] == "active" and tool["category"] in report:
            report[tool["category"]].append(name)
    return report

for job, tools in coverage(["assistant", "meetings", "video", "research"], ["ChatGPT", "Claude", "Otter", "Sora"], DIRECTORY).items():
    state = "GAP" if not tools else ("OVERLAP" if len(tools) > 1 else "ok")
    print(f"{job:<10} {state:<8} {tools}")
```

- **The report starts with every job and an empty list.** A job that no chosen tool covers still appears, with nothing beside it. Gaps are visible because the jobs, not the tools, define the rows.
- **Only active tools count.** Sora was chosen for video and has closed, so video shows as a gap. A subscription list that still includes a dead product is exactly the kind of thing this catches.
- **Two assistants is an overlap.** ChatGPT and Claude both cover the same job. That may be deliberate. It should be a decision and not an accident, which is the theme of Module 4.3.

**Complexity.** `find_tools`, `search`, and `coverage` are linear in the size of the directory. `stale_entries` adds a sort. `resolve` takes at most as many steps as there are entries.

### From the directory to a shortlist

A procedure that takes ten minutes:

1. **Write the job** as a sentence, as in Module 4.1.
2. **Find the category.** Read the table.
3. **Ask whether your assistant already does it.** Try once with a good prompt.
4. **Pick two candidates**, no more. Prefer ones whose maker you can identify and whose data terms you can find.
5. **Confirm they still exist** under that name and do that job. One search each.
6. **Run the four stages** of Module 4.1 on the two.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Collecting is not using.** Reading a directory produces a feeling of progress and a list of sign-ups. The measure of this chapter is one job done better, with one tool.

**The assistant you have is usually the first answer.** For writing, summarising, analysis, and simple images, a general assistant with a good prompt and the right files is competitive with most specialised tools. Reach for a specialist when the job needs something an assistant cannot do: joining a call, editing a timeline, running on a schedule, connecting two systems.

**Meeting recorders raise questions of consent.** Recording a call may require the agreement of everyone on it, by law or by courtesy, and a bot that joins automatically can record meetings you did not intend. Tell participants, and check your organisation's policy.

**Generated images, video, and music come with terms.** Who owns the output, whether you may use it commercially, and whether it may show real people or brands vary by tool and plan and have been changing through lawsuits and settlements. Read the current terms before anything is published or sold.

**App builders get you to a demonstration quickly.** A working prototype in an afternoon is real. A product that handles payments, personal data, and many users safely is a different matter, as Module 3.8 explained. Have anything public reviewed by someone who can.

**Automation multiplies mistakes.** A workflow that sends a wrong email once is an error. One that sends it to four hundred customers is an incident. Test with a single record and keep a person in the loop for anything that reaches outside the company.

**Local tools trade convenience for control.** Running a model yourself keeps data on your machine and costs nothing per use. The models that fit on an ordinary computer are less capable than the hosted frontier ones, and setup takes effort. Unit 10 covers when it is worth it.

**Open source does not mean no cost.** A self-hosted tool has no subscription and does have a server to run, updates to apply, and someone's time to maintain it.

**"Free tier" is a moving target.** Free allowances are reduced, and free plans often permit your inputs to be used for training. A workflow built on a free tier should have a plan for the day the allowance changes.

**A famous name is not a safe bet.** The best-known video generator, a celebrated presentation tool, and a much-hyped wearable all appear in this chapter as closures. Size and publicity do not protect a product. Keep your own copies of what you make.

**Rankings of tools are mostly advertising.** As Module 4.1 warned, many "best of" pages are paid placements. This directory is not a ranking. The order within each table carries no meaning.

**Renamed tools break tutorials.** Instructions for NotebookLM, Windsurf, or Gems still describe working products under new names, or under successors. When a tutorial's screen does not match yours, check for a rename before giving up.

## 5. Active Recall Check & Synthesis Summary

**Summary.** The directory lists more than 140 tools in seventeen categories arranged by job, from general assistants through research, writing, meetings, images, video, audio, presentations, coding, app building, automation, agents, data, business functions, local models, open model families, and infrastructure. Most entries are specialised applications built on a few underlying models, so the general assistant you already use is a candidate for almost every job. The entries are perishable: products close, are renamed, are bought, and change their terms, and if each entry has probability $c$ per month of changing, only $(1 - c)^t$ of a directory is still right after $t$ months. A useful directory therefore records each entry's status, its successor if it has one, and the date it was last checked. The way to use this chapter is to find the category for a stated job, shortlist two candidates, confirm they still exist, and take them through the four stages of Module 4.1.

**Question 1.** A company keeps a directory of 120 AI tools. Assume each entry has a 4 percent chance per month of becoming wrong. How many entries are expected to be stale after 6 months and after 12? The company can afford to re-check 20 entries a month. What should it do?

<details>
<summary>View Answer</summary>

After 6 months the fraction still accurate is 0.96 to the sixth power, about 0.783, so about 21.7 percent of entries, or 26 of the 120, are expected to be wrong. After 12 months the fraction accurate is 0.96 to the twelfth, about 0.613, so about 46 entries are expected to be wrong. Each month about 4.8 entries go stale, which is 120 times 0.04. Re-checking 20 a month means each entry is visited every six months, by which time roughly a fifth of them are out of date. That is too slow to keep the whole directory reliable. The company has three options, and should combine them. First, shrink the directory to the tools actually in use or under serious consideration: forty entries can be checked every two months with the same effort. Second, prioritise: check the tools that work depends on monthly, and the rest only when someone proposes to adopt them. Third, record the date of the last check on every entry and treat anything older than about three months as unverified, so that readers know which entries to confirm for themselves. The underlying point is that the cost of maintaining a directory grows with its size, so a short one that is right is worth more than a long one that is not.

</details>

**Question 2.** A colleague is following a tutorial from early 2025 that tells them to install "Codeium" and to store their research in "NotebookLM". Neither name appears in the current products they can find. Using this chapter, explain what has happened to each and what your colleague should do. What does the example show about how a directory should store its data?

<details>
<summary>View Answer</summary>

Both products have been renamed, and one more than once. Codeium's editor became Windsurf, Windsurf was acquired by Cognition in 2025, and in June 2026 it was renamed Devin Desktop, so the current product is two renames away from the name in the tutorial. NotebookLM was renamed Gemini Notebook in July 2026, and Google says existing notebooks and links continue to work. The colleague should install the current products and expect the screens, menus, and plan names to differ from the tutorial, particularly for the code editor, which has changed owner and pricing as well as name. For the notebook the steps will be close to the tutorial's. If a tool had been closed and not renamed, as Sora was, there would be no current version to find, and the colleague would need a different tool for the job. The example shows that a directory should keep old names and not delete them. An entry for a renamed product should record its status and the name that replaced it, so that a search by the old name succeeds and can be followed, through as many steps as necessary, to the current one. An entry for a closed product should say that it is closed, so that the search ends with a clear answer. A directory that lists only what currently exists cannot help someone holding an old name.

</details>

**Question 3.** A two-person consultancy wants to produce a monthly podcast: record a conversation, clean the audio, produce a transcript and show notes, make a cover image, and cut two short video clips for social media. Using the directory, propose the smallest reasonable set of tools, say which jobs your existing general assistant can do, and name two things to check before publishing.

<details>
<summary>View Answer</summary>

Start from the jobs and ask which need a specialist. Cleaning recorded speech is a specialised audio job: a tool from the audio category such as Adobe Podcast does it. Editing the recording and cutting clips is where a transcript-based editor such as Descript earns its place, because it covers three of the jobs at once: it transcribes, it lets you edit the audio by editing the text, and it can export short video clips. A dedicated clipping tool such as Opus Clip is an alternative for the last step and is unnecessary if the editor's clips are good enough. The transcript's show notes, titles, and episode description are writing jobs that the general assistant already in use can do from the transcript with a good prompt. The cover image can also be made in the general assistant, with ChatGPT's or Gemini's image generation, so no separate image subscription is needed. The smallest reasonable set is therefore one editor, possibly one audio clean-up tool if the editor's own is not good enough, and the assistant the consultancy already has. Before publishing, two things need checking. First, consent: everyone recorded must have agreed to the recording and to publication. Second, the terms for generated material: confirm that the plan in use permits commercial use of the cover image and any generated music or voice, and that the image does not depict a real person or a brand. Both candidates should also be confirmed as still operating under those names.

</details>

@@starter
"""
Lab: A Directory You Can Query and Keep Current
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".

Each entry is a dict: name, category, job, free (True/False), status ("active", "renamed",
or "closed"), replaced_by (a name or None), and checked (the date it was last verified).
"""
from datetime import date


def entry(name, category, job, free, status="active", replaced_by=None, checked="2026-11-01"):
    """Provided helper: build one directory entry."""
    return {"name": name, "category": category, "job": job, "free": free,
            "status": status, "replaced_by": replaced_by, "checked": checked}


DIRECTORY = [
    entry("ChatGPT", "assistant", "general assistant for writing analysis images and code", True, checked="2026-11-10"),
    entry("Claude", "assistant", "general assistant for writing long documents and code", True, checked="2026-11-10"),
    entry("Gemini Notebook", "research", "answers from your own documents with citations", True, checked="2026-10-02"),
    entry("NotebookLM", "research", "answers from your own documents with citations", True, "renamed", "Gemini Notebook", "2026-07-20"),
    entry("Elicit", "research", "finds research papers and extracts data into tables", True, checked="2026-05-01"),
    entry("Grammarly", "writing", "checks grammar and tone and rewrites text", True, checked="2026-09-15"),
    entry("Otter", "meetings", "records transcribes and summarises meetings", True, checked="2026-03-12"),
    entry("Granola", "meetings", "meeting notes from your computer audio without a bot", False, checked="2026-08-30"),
    entry("Midjourney", "image", "stylised images from a text description", False, checked="2026-06-18"),
    entry("Sora", "video", "video clips from a text description", False, "closed", None, "2026-04-27"),
    entry("Runway", "video", "video generation and editing tools", True, checked="2026-09-01"),
    entry("Codeium", "coding", "code completion in your editor", True, "renamed", "Windsurf", "2025-01-10"),
    entry("Windsurf", "coding", "agentic code editor", True, "renamed", "Devin Desktop", "2026-06-05"),
    entry("Devin Desktop", "coding", "agentic code editor", True, checked="2026-10-20"),
    entry("n8n", "automation", "workflow automation you can host yourself", True, checked="2026-10-28"),
    entry("Ollama", "local", "run open models on your own computer", True, checked="2026-11-01"),
]

TODAY = date(2026, 11, 15)


# ---------------------------------------------------------------- Step 1
def find_tools(directory, category=None, free_only=False):
    """Return the names, in directory order, of the tools that
         - have status "active", and
         - are in `category` (any category if category is None), and
         - are free (only checked when free_only is True)."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def search(directory, query):
    """Rank tools by how many words of the query appear in their name and job.
    Compare whole words in lowercase: split the query, and split name + " " + job.
    Include every status. Leave out tools with no matching word.
    Return the names, most matches first, and alphabetically for equal matches."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def stale_entries(directory, today, max_age_days=90):
    """Return the names of the ACTIVE tools whose checked date is MORE than max_age_days
    before `today`, oldest first. today is a datetime.date; checked is a string such as
    "2026-05-01", which date.fromisoformat converts to a date."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def resolve(name, directory):
    """Follow renames to the tool's current name.
       - If the name is not in the directory, or the tool is "closed", return None.
       - If the tool is "active", return its name.
       - If it is "renamed", continue with the name in replaced_by.
    Make at most len(directory) + 1 hops, and return None if no answer is reached."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def coverage(jobs, chosen, directory):
    """jobs is a list of categories you need covered. chosen is a list of tool names.
    Return a dict with every job as a key, in the order given, mapped to the list of chosen
    tools (in the order chosen) that are in the directory, are "active", and belong to that
    category. A job with no such tool maps to an empty list."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("find    :", find_tools(DIRECTORY, "meetings"))
    print("search  :", search(DIRECTORY, "meeting notes"))
    print("stale   :", stale_entries(DIRECTORY, TODAY))
    print("resolve :", resolve("Codeium", DIRECTORY))
    print("coverage:", coverage(["assistant", "video"], ["ChatGPT", "Claude", "Sora"], DIRECTORY))

@@solution
"""
Lab solution: A Directory You Can Query and Keep Current
Standard library only.

Each entry is a dict: name, category, job, free (True/False), status ("active", "renamed",
or "closed"), replaced_by (a name or None), and checked (the date it was last verified).
"""
from datetime import date


def entry(name, category, job, free, status="active", replaced_by=None, checked="2026-11-01"):
    """Provided helper: build one directory entry."""
    return {"name": name, "category": category, "job": job, "free": free,
            "status": status, "replaced_by": replaced_by, "checked": checked}


DIRECTORY = [
    entry("ChatGPT", "assistant", "general assistant for writing analysis images and code", True, checked="2026-11-10"),
    entry("Claude", "assistant", "general assistant for writing long documents and code", True, checked="2026-11-10"),
    entry("Gemini Notebook", "research", "answers from your own documents with citations", True, checked="2026-10-02"),
    entry("NotebookLM", "research", "answers from your own documents with citations", True, "renamed", "Gemini Notebook", "2026-07-20"),
    entry("Elicit", "research", "finds research papers and extracts data into tables", True, checked="2026-05-01"),
    entry("Grammarly", "writing", "checks grammar and tone and rewrites text", True, checked="2026-09-15"),
    entry("Otter", "meetings", "records transcribes and summarises meetings", True, checked="2026-03-12"),
    entry("Granola", "meetings", "meeting notes from your computer audio without a bot", False, checked="2026-08-30"),
    entry("Midjourney", "image", "stylised images from a text description", False, checked="2026-06-18"),
    entry("Sora", "video", "video clips from a text description", False, "closed", None, "2026-04-27"),
    entry("Runway", "video", "video generation and editing tools", True, checked="2026-09-01"),
    entry("Codeium", "coding", "code completion in your editor", True, "renamed", "Windsurf", "2025-01-10"),
    entry("Windsurf", "coding", "agentic code editor", True, "renamed", "Devin Desktop", "2026-06-05"),
    entry("Devin Desktop", "coding", "agentic code editor", True, checked="2026-10-20"),
    entry("n8n", "automation", "workflow automation you can host yourself", True, checked="2026-10-28"),
    entry("Ollama", "local", "run open models on your own computer", True, checked="2026-11-01"),
]

TODAY = date(2026, 11, 15)


# ---------------------------------------------------------------- Step 1
def find_tools(directory, category=None, free_only=False):
    """Closed and renamed products stay in the data, because people still look for them,
    and are never offered as a recommendation."""
    return [tool["name"] for tool in directory
            if tool["status"] == "active"
            and (category is None or tool["category"] == category)
            and (not free_only or tool["free"])]


# ---------------------------------------------------------------- Step 2
def search(directory, query):
    """Search covers every status, so that a search by an old name succeeds and can be
    followed with resolve(). Negative scores make an ordinary sort put the best first."""
    wanted = set(query.lower().split())
    scored = []
    for tool in directory:
        words = set((tool["name"] + " " + tool["job"]).lower().split())
        hits = len(wanted & words)
        if hits:
            scored.append((-hits, tool["name"]))
    return [name for _, name in sorted(scored)]


# ---------------------------------------------------------------- Step 3
def stale_entries(directory, today, max_age_days=90):
    """An old entry may be perfectly fine. Nobody has confirmed it recently, and the
    directory should say so."""
    old = [((today - date.fromisoformat(tool["checked"])).days, tool["name"])
           for tool in directory if tool["status"] == "active"]
    return [name for age, name in sorted(old, reverse=True) if age > max_age_days]


# ---------------------------------------------------------------- Step 4
def resolve(name, directory):
    """Follow the chain of renames. The hop limit guarantees an answer even if two
    entries point at each other by mistake."""
    by_name = {tool["name"]: tool for tool in directory}
    for _ in range(len(directory) + 1):
        tool = by_name.get(name)
        if tool is None or tool["status"] == "closed":
            return None
        if tool["status"] == "active":
            return name
        name = tool["replaced_by"]
    return None


# ---------------------------------------------------------------- Step 5
def coverage(jobs, chosen, directory):
    """The jobs define the rows, so a job nothing covers is visible as an empty list."""
    by_name = {tool["name"]: tool for tool in directory}
    report = {job: [] for job in jobs}
    for name in chosen:
        tool = by_name.get(name)
        if tool and tool["status"] == "active" and tool["category"] in report:
            report[tool["category"]].append(name)
    return report


if __name__ == "__main__":
    print(find_tools(DIRECTORY, "meetings"), find_tools(DIRECTORY, "meetings", free_only=True), find_tools(DIRECTORY, "video"))
    print(search(DIRECTORY, "meeting notes"))
    print(search(DIRECTORY, "notebooklm"))

    print(stale_entries(DIRECTORY, TODAY))
    for old_name in ("Codeium", "NotebookLM", "Sora", "Claude", "Rewind"):
        print(f"{old_name:<11} -> {resolve(old_name, DIRECTORY)}")
    print(f"entries changing per month at 3%: {146 * 0.03:.1f}; still accurate after a year: {0.97 ** 12:.3f}; "
          f"expected stale: {146 * (1 - 0.97 ** 12):.0f}")

    for job, tools in coverage(["assistant", "meetings", "video", "research"], ["ChatGPT", "Claude", "Otter", "Sora"], DIRECTORY).items():
        state = "GAP" if not tools else ("OVERLAP" if len(tools) > 1 else "ok")
        print(f"{job:<10} {state:<8} {tools}")
    print(f"recall question 1: {120 * (1 - 0.96 ** 6):.1f} stale after 6 months, {120 * (1 - 0.96 ** 12):.1f} after 12, {120 * 0.04:.1f} a month")

@@step
{
  "stepNumber": 1,
  "title": "Filter the directory",
  "instruction": "Implement find_tools(directory, category, free_only). Return the names of the tools, in the order they appear in the directory, that meet all three conditions: the status is 'active'; the category equals the one asked for, or any category if category is None; and, only when free_only is True, the tool's free field is true. Closed and renamed products remain in the data so that people can look them up, and must never be returned here. Try the 'video' category: one of its two entries has closed. [MOD-4.2]",
  "hintConceptual": "A recommendation list should contain only things that still exist, in the aisle you asked about, and within your budget if you said so.",
  "hintSyntax": "return [tool[\"name\"] for tool in directory\n        if tool[\"status\"] == \"active\"\n        and (category is None or tool[\"category\"] == category)\n        and (not free_only or tool[\"free\"])]"
}
@@assert
assert find_tools(DIRECTORY, "meetings") == ["Otter", "Granola"], f"Two active meeting tools, in directory order, got {find_tools(DIRECTORY, 'meetings')}"
assert find_tools(DIRECTORY, "meetings", free_only=True) == ["Otter"], "Granola has no free plan in this data"
assert find_tools(DIRECTORY, "video") == ["Runway"], "Sora is closed and must not be returned"
assert find_tools(DIRECTORY, "coding") == ["Devin Desktop"], "Codeium and Windsurf are renamed entries, not active tools"
assert find_tools(DIRECTORY, "research") == ["Gemini Notebook", "Elicit"], "The renamed NotebookLM entry is not returned"
assert len(find_tools(DIRECTORY)) == 12, f"With no category, every active tool is returned: 12 of the 16 entries, got {len(find_tools(DIRECTORY))}"
assert find_tools(DIRECTORY, free_only=True) == ["ChatGPT", "Claude", "Gemini Notebook", "Elicit", "Grammarly", "Otter", "Runway", "Devin Desktop", "n8n", "Ollama"], "free_only works without a category"
assert find_tools(DIRECTORY, "presentations") == [], "A category with no entries gives an empty list"
assert find_tools([], "video") == [], "An empty directory gives an empty list"
print("Step 1 passed: only active tools are offered, and filters combine.")

@@step
{
  "stepNumber": 2,
  "title": "Search by what a tool does",
  "instruction": "Implement search(directory, query). Split the lowercased query into a set of words. For each tool, of any status, build the set of lowercased words in its name followed by a space and its job. The score is the number of query words in that set. Leave out tools that score zero. Return the names ordered by score, highest first, and alphabetically among equal scores. A convenient way is to collect tuples of (negative score, name) and sort them. Search includes renamed and closed entries on purpose: try the query 'notebooklm'. [MOD-4.2]",
  "hintConceptual": "Count how many of the words someone typed appear in each tool's name or description, and list the tools from most matches to fewest. Old names must still be findable.",
  "hintSyntax": "wanted = set(query.lower().split())\nscored = []\nfor tool in directory:\n    words = set((tool[\"name\"] + \" \" + tool[\"job\"]).lower().split())\n    hits = len(wanted & words)\n    if hits:\n        scored.append((-hits, tool[\"name\"]))\nreturn [name for _, name in sorted(scored)]"
}
@@assert
assert search(DIRECTORY, "meeting notes") == ["Granola"], f"Only Granola's description contains the words 'meeting' and 'notes', got {search(DIRECTORY, 'meeting notes')}"
assert search(DIRECTORY, "notebooklm") == ["NotebookLM"], "A renamed entry is still found by its old name, ignoring case"
assert search(DIRECTORY, "agentic code editor") == ["Devin Desktop", "Windsurf", "Codeium", "ChatGPT", "Claude"], "Three matching words outrank two, two outrank one, and equal scores are alphabetical"
assert search(DIRECTORY, "documents") == ["Claude", "Gemini Notebook", "NotebookLM"], "Equal scores are returned alphabetically"
assert search(DIRECTORY, "video") == ["Runway", "Sora"], "Closed tools are included in search results"
assert search(DIRECTORY, "quantum teleportation") == [], "No matching word, no results"
assert search(DIRECTORY, "meetings") == ["Otter"], "Whole words are compared: 'meetings' matches Otter's description and not 'meeting'"
assert search([], "anything") == [], "An empty directory gives no results"
print("Step 2 passed: search ranks by matching words and still finds renamed and closed tools.")

@@step
{
  "stepNumber": 3,
  "title": "Which entries need re-checking?",
  "instruction": "Implement stale_entries(directory, today, max_age_days). Consider only tools whose status is 'active'. For each, convert its checked string to a date with date.fromisoformat and compute its age in days as (today - checked).days. Return the names of those whose age is more than max_age_days, ordered from the oldest check to the most recent. This is the three-month rule from Section 2: an old entry may be fine, but nobody has confirmed it recently. With TODAY as 15 November 2026, three tools are overdue. [MOD-4.2]",
  "hintConceptual": "Every entry carries the date someone last looked. Work out how long ago that was, and list the ones that have gone too long, starting with the most neglected.",
  "hintSyntax": "old = [((today - date.fromisoformat(tool[\"checked\"])).days, tool[\"name\"])\n       for tool in directory if tool[\"status\"] == \"active\"]\nreturn [name for age, name in sorted(old, reverse=True) if age > max_age_days]"
}
@@assert
assert stale_entries(DIRECTORY, TODAY) == ["Otter", "Elicit", "Midjourney"], f"Three active tools were last checked more than 90 days ago, oldest first, got {stale_entries(DIRECTORY, TODAY)}"
assert "Codeium" not in stale_entries(DIRECTORY, TODAY) and "Sora" not in stale_entries(DIRECTORY, TODAY), "Renamed and closed entries are not reported"
assert stale_entries(DIRECTORY, TODAY, max_age_days=60) == ["Otter", "Elicit", "Midjourney", "Granola", "Runway", "Grammarly"], "The max_age_days argument must be used"
assert stale_entries(DIRECTORY, TODAY, max_age_days=1000) == [], "With a very long limit nothing is stale"
assert stale_entries(DIRECTORY, date(2026, 11, 2)) == ["Otter", "Elicit", "Midjourney"], "The today argument must be used"
assert stale_entries([entry("X", "c", "j", True, checked="2026-08-17")], TODAY) == [], "Exactly 90 days old is not MORE than 90"
assert stale_entries([entry("X", "c", "j", True, checked="2026-08-16")], TODAY) == ["X"], "Ninety-one days old is stale"
assert stale_entries([], TODAY) == [], "An empty directory has nothing stale"
print("Step 3 passed: Otter, Elicit, and Midjourney have not been checked for more than 90 days.")

@@step
{
  "stepNumber": 4,
  "title": "Follow a renamed tool to its current name",
  "instruction": "Implement resolve(name, directory). Build a dict from each tool's name to its entry. Then repeat, at most len(directory) + 1 times: look the name up. If it is not in the directory, or the tool's status is 'closed', return None. If the status is 'active', return the name. Otherwise the tool has been renamed, so continue with the name in its replaced_by field. If the loop ends without an answer, return None. The limit on hops guarantees the function finishes even if two entries point at each other by mistake. Try 'Codeium', which is two renames away from its current name. [MOD-4.2]",
  "hintConceptual": "An old name is a forwarding address. Keep following the forwarding until you reach something that exists today, or learn that the trail ends. Do not follow it forever.",
  "hintSyntax": "by_name = {tool[\"name\"]: tool for tool in directory}\nfor _ in range(len(directory) + 1):\n    tool = by_name.get(name)\n    if tool is None or tool[\"status\"] == \"closed\":\n        return None\n    if tool[\"status\"] == \"active\":\n        return name\n    name = tool[\"replaced_by\"]\nreturn None"
}
@@assert
assert resolve("Codeium", DIRECTORY) == "Devin Desktop", f"Codeium became Windsurf, which became Devin Desktop, got {resolve('Codeium', DIRECTORY)}"
assert resolve("Windsurf", DIRECTORY) == "Devin Desktop", "One rename is followed"
assert resolve("NotebookLM", DIRECTORY) == "Gemini Notebook", "NotebookLM is now Gemini Notebook"
assert resolve("Claude", DIRECTORY) == "Claude", "An active tool resolves to itself"
assert resolve("Sora", DIRECTORY) is None, "A closed tool has no current name"
assert resolve("Rewind", DIRECTORY) is None, "A name the directory does not contain resolves to None"
_loop = [entry("A", "c", "j", True, "renamed", "B"), entry("B", "c", "j", True, "renamed", "A")]
assert resolve("A", _loop) is None, "Two entries that point at each other must not loop forever"
_dead_end = [entry("Old", "c", "j", True, "renamed", "Gone"), entry("Gone", "c", "j", True, "closed")]
assert resolve("Old", _dead_end) is None, "A rename that leads to a closed product resolves to None"
assert resolve("Old", [entry("Old", "c", "j", True, "renamed", "Missing")]) is None, "A rename that points outside the directory resolves to None"
print("Step 4 passed: Codeium resolves to Devin Desktop, and Sora resolves to nothing.")

@@step
{
  "stepNumber": 5,
  "title": "Gaps and overlaps in a chosen set",
  "instruction": "Implement coverage(jobs, chosen, directory). jobs is a list of categories you need covered, and chosen is a list of tool names. Start a report dict with every job as a key, in the order given, each mapped to an empty list. Then go through the chosen names in order. If the name is in the directory, the tool's status is 'active', and its category is one of the jobs, append the name to that job's list. Return the report. A job left with an empty list is a gap, and a job with more than one tool is an overlap. Try it with a set that includes Sora, which has closed. [MOD-4.2]",
  "hintConceptual": "Lay out the jobs first, then sort your tools under them. Jobs with nothing under them and jobs with too much under them both stand out, which is the point.",
  "hintSyntax": "by_name = {tool[\"name\"]: tool for tool in directory}\nreport = {job: [] for job in jobs}\nfor name in chosen:\n    tool = by_name.get(name)\n    if tool and tool[\"status\"] == \"active\" and tool[\"category\"] in report:\n        report[tool[\"category\"]].append(name)\nreturn report"
}
@@assert
_report = coverage(["assistant", "meetings", "video", "research"], ["ChatGPT", "Claude", "Otter", "Sora"], DIRECTORY)
assert _report == {"assistant": ["ChatGPT", "Claude"], "meetings": ["Otter"], "video": [], "research": []}, f"Two assistants overlap, video and research are gaps, got {_report}"
assert list(_report) == ["assistant", "meetings", "video", "research"], "The jobs keep the order in which they were given"
assert coverage(["coding"], ["Windsurf", "Devin Desktop"], DIRECTORY) == {"coding": ["Devin Desktop"]}, "A renamed entry does not count as covering a job"
assert coverage(["image"], ["Midjourney", "Unknown Tool"], DIRECTORY) == {"image": ["Midjourney"]}, "A name that is not in the directory is ignored without an error"
assert coverage(["meetings"], ["Granola", "Otter", "ChatGPT"], DIRECTORY) == {"meetings": ["Granola", "Otter"]}, "Tools are listed in the order chosen, and tools for other jobs are left out"
assert coverage([], ["ChatGPT"], DIRECTORY) == {}, "With no jobs the report is empty"
assert coverage(["video", "local"], [], DIRECTORY) == {"video": [], "local": []}, "With no tools chosen every job is a gap"
print("Step 5 passed: the report shows an overlap in assistants and gaps in video and research.")
