@@meta
{
  "moduleId": "MOD-7.7",
  "slug": "mod-7-7",
  "unitId": "UNIT-7",
  "unitTitle": "Unit 7: AI Automation Masterclass",
  "title": "n8n Introduction",
  "difficulty": "Intermediate",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "Understand n8n's data structure", "source": "n8n Docs", "url": "https://docs.n8n.io/data/data-structure/" },
    { "title": "Using the Code node", "source": "n8n Docs", "url": "https://docs.n8n.io/code/code-node/" },
    { "title": "Expressions", "source": "n8n Docs", "url": "https://docs.n8n.io/code/expressions/" },
    { "title": "Export and import workflows", "source": "n8n Docs", "url": "https://docs.n8n.io/workflows/export-import/" },
    { "title": "Data pinning", "source": "n8n Docs", "url": "https://docs.n8n.io/data/data-pinning/" },
    { "title": "n8n Pricing", "source": "n8n", "url": "https://n8n.io/pricing/" },
    { "title": "Sustainable Use License", "source": "n8n GitHub repository", "url": "https://github.com/n8n-io/n8n/blob/master/LICENSE.md" }
  ],
  "videoLibrary": [
    {
      "id": "VID-7.7-1",
      "title": "n8n Quick Start Tutorial: Build Your First Workflow [2025]",
      "creator": "n8n",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=4cQWJViybAQ",
      "timingInstruction": "Watch after reading Section 1, to see the editor, nodes, and connections before the theory",
      "keyTakeaway": "n8n's official quick start: building a first workflow."
    },
    {
      "id": "VID-7.7-2",
      "title": "How to Import, Export, and Debug n8n Workflows (Beginner Tutorial)",
      "creator": "Skillet AI",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=GBzr0Cfy0T0",
      "timingInstruction": "Watch after the lab, alongside Step 5 on safe exports",
      "keyTakeaway": "Workflows are JSON files: how they move between instances, and how to reconnect credentials and debug after an import."
    },
    {
      "id": "VID-7.7-3",
      "title": "N8N Full Course 2026 | 4 Hours",
      "creator": "Anaam Rasool",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=D2hL82o5FLA",
      "timingInstruction": "Use as a reference after this chapter, dipping into the sections on expressions and the Code node",
      "keyTakeaway": "A long hands-on tour covering many nodes, expressions, and AI integrations."
    },
    {
      "id": "VID-7.7-4",
      "title": "n8n for AI Agents, APIs, and Workflow Automation",
      "creator": "KodeKloud",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/n8n-ai-agents-apis-workflow-automation",
      "timingInstruction": "Take after this chapter for structured practice with APIs and AI nodes in n8n",
      "keyTakeaway": "A guided course on building API-driven and AI-driven workflows in n8n."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Items, Expressions, Run Modes, Execution Pricing, and Safe Exports",
    "context": "A consultancy is adopting n8n and wants its team to understand what happens under the editor before they build client workflows. You will model n8n's item format, a small expression renderer, the two Code node run modes, execution-based plan selection, and a scan that stops a workflow being shared with secrets or customer data inside it.",
    "language": "python"
  }
}

@@reading
# n8n Introduction

n8n (pronounced "n-eight-n", short for "nodemation") is a workflow automation tool that sits between the no-code tools and writing everything yourself. You build workflows by connecting nodes on a canvas, like Make or Zapier, but you can drop into JavaScript or Python at any step, call any API with a generic HTTP node, and run the whole thing on your own server.

This chapter explains the concepts n8n is built on, nodes, connections, items, expressions, and credentials; how it is licensed and priced, which differs from the other tools in ways that matter for cost; and how to build a first workflow with an AI step. The lab models the parts that trip people up most: the shape of the data between nodes, expressions, how often code runs, and what a workflow file contains when you share it.

## 1. First-Principles Mental Model & Intuition

### A production line of trays

Picture a factory line. Each station does one job: one stamps an address, one weighs the parcel, one prints a label. Between stations runs a conveyor carrying **trays**, and each tray holds one thing being worked on.

In n8n, the stations are **nodes**, the conveyors are **connections**, and the trays are **items**. A node receives a list of items, does its job to each one, or to all of them together, and passes a list of items on.

```text
   [Webhook]  --->  [HTTP Request]  --->  [Code]  --->  [OpenAI]  --->  [Slack]
   trigger          get order lines       add up total  summarise       post message
   1 item           3 items               1 item        1 item          1 message

   every arrow carries a LIST of items, each one shaped as  {json: {fields}}
```

Three facts follow from this picture, and most n8n confusion comes from forgetting one of them.

1. **Data between nodes is always a list.** Even one record is a list of one.
2. **Most nodes run once per item.** Three items into a Slack node means three messages.
3. **Each node can see the output of earlier nodes,** not just the one before it, through expressions.

### What else is on the canvas

| Concept | What it is |
|---|---|
| **Trigger node** | Starts the workflow: a schedule, a webhook, an app event, a form, a chat message, or a manual click |
| **Regular node** | Does something: an app action, an HTTP request, a transformation, an AI call |
| **Connection** | Carries items from one node's output to another's input |
| **Expression** | A small piece of JavaScript in double braces that fills a field from the data |
| **Credential** | Stored login details for a service, kept apart from the workflow and referred to by name |
| **Execution** | One run of the whole workflow, from trigger to end |

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Items

n8n's documentation is precise about the format: all data passed between nodes is an array of objects, and each object wraps its data under the key `json`, with an optional second key, `binary`, for files.

```text
   [
     { "json":   { "name": "Priya", "order": { "id": "A1234", "total": 84.0 } } },
     { "json":   { "name": "Ben",   "order": { "id": "A1235", "total": 22.0 } },
       "binary": { "invoice": { "fileName": "A1235.pdf", "mimeType": "application/pdf", "data": "base64 text" } } }
   ]
```

The `json` part holds ordinary JSON, as in Module 7.5. The `binary` part holds files, each with its data encoded as base64 text and, ideally, a file name and MIME type. Keeping files separate from the JSON means a node that only reads fields need not carry file contents around.

Writing a `json` wrapper around everything is tedious, so n8n helps: when a Code node returns plain objects, n8n adds the `json` key itself, and if it returns a single object instead of a list, n8n wraps it in a list. The lab's first step builds exactly that normalisation, because knowing the true shape matters the moment something goes wrong.

### Run once per item, or once for all

Most nodes run once for each incoming item. That is what makes "for each order line, add a spreadsheet row" a single node. It is also the source of the commonest surprise, the one Module 7.5 described for splitting: three items into an email node means three emails.

The **Code node** makes the choice explicit with two modes.

| Mode | The code runs | It sees | Use for |
|---|---|---|---|
| Run Once for All Items (default) | Once per execution | The whole list | Totals, sorting, grouping, removing duplicates |
| Run Once for Each Item | Once per item | One item at a time | Changing each record independently |

Adding a line total to each order line is per-item work. Adding up the order total is all-items work. Choosing wrongly gives either an error or a subtly wrong answer, for example a "total" that is just each line's own amount.

### Expressions

Fields in a node can be fixed text or **expressions**. An expression sits in double curly braces and is evaluated for each item:

| Expression | Gives |
|---|---|
| `{{ $json.name }}` | The `name` field of the current item |
| `{{ $json.order.total }}` | A nested field, by path, as in Module 7.5 |
| `{{ $json.order.total * 1.2 }}` | A calculation, since expressions are JavaScript |
| `{{ $('HTTP Request').item.json.status }}` | A field from an earlier node's matching item |
| `{{ $now }}` | The current date and time |

When an expression refers to a field that does not exist, JavaScript gives `undefined`, and the field ends up empty. The workflow carries on, and "Hi , your order is on its way" goes out. This is the quietest common failure in n8n, and the lab's renderer reports missing fields instead of hiding them.

Expressions can also refer to items in earlier nodes, not just the previous one. n8n tracks which output item came from which input item, called **item linking** or paired items, so that `$('Webhook').item` finds the webhook item that the current item descends from.

### Credentials

Credentials, API keys, OAuth connections, passwords, are stored separately from workflows, encrypted, and referred to by an ID and a name. A node says "use the credential called Example API", and the secret itself never appears in the workflow. This matters when workflows are exported, shared, or committed to version control, since the file carries the reference, not the secret. Module 7.15 covers credentials in depth.

The protection only works if you use it. A secret typed directly into a node, for instance as a header on an HTTP Request node, or pasted in with a cURL command that carried an `Authorization` header, is part of the workflow's parameters and travels with every export. n8n's documentation on exporting warns about exactly this case.

### Workflows are JSON files

A workflow is a JSON document: a list of nodes, each with a name, a type, and its parameters, plus the connections between them, and optionally **pinned data**. Pinning freezes a node's output so you can develop later steps without re-running earlier ones, which is useful, and it means real records, possibly customer data, are stored in the workflow. You can copy a workflow from the canvas and paste it into a chat, download it as a file, import one from a file or URL, or move workflows in bulk with the command-line tool or API.

### Self-hosted or cloud, and the licence

n8n is offered two ways.

| Option | You get | You handle |
|---|---|---|
| n8n Cloud | A hosted instance, updates, backups | Paying per plan |
| Self-hosted | The Community Edition free, on your own server or container | Installation, updates, security, backups, scaling |

n8n's licence is the **Sustainable Use License**, which the company calls "fair-code". The source is public and you can run, change, and self-host it for your own internal business purposes or for non-commercial use. What you cannot do without a commercial agreement is, broadly, sell n8n itself as a service to others. Building workflows for your own company is fine; building workflows for a client on their own n8n instance is generally fine; offering "hosted n8n" as your product is not. Read the licence before building a business on it, since it is not an open-source licence in the OSI sense.

### Pricing by execution

At the time of writing (November 2026), n8n's paid plans are priced by **workflow executions**, with unlimited steps per execution. The published annual-billing prices are:

| Plan | Price per month, billed annually | Executions per month | Hosting |
|---|---|---|---|
| Starter | EUR 20 | 2,500 | Hosted by n8n |
| Pro | EUR 50 | 10,000 | Hosted by n8n |
| Business | EUR 667 | 40,000 | Self-hosted |

This differs from tools that count every step. Module 7.8 covers Make's credits and Module 7.9 Zapier's tasks, both of which count actions inside a run. A workflow with eight steps that runs 2,000 times a month is 2,000 executions in n8n but up to 16,000 step-level units in a step-priced tool:

$$\text{step units} = \text{runs} \times \text{steps per run} = 2000 \times 8 = 16000$$

Long workflows therefore favour execution pricing, and very frequent, very short workflows narrow the gap. A schedule trigger every 15 minutes runs $4 \times 24 \times 30 = 2880$ times in a 30-day month, more than Starter's 2,500, whatever the workflow does, so polling-style schedules can push you up a plan on their own. The lab's plan chooser makes that visible.

### AI nodes

n8n has nodes for calling language models directly, and an **AI Agent** node that gives a model tools and memory, built on the LangChain library. A first AI workflow is usually: a trigger, a node that fetches or receives text, a model node with a prompt that uses expressions to insert the text, and a node that sends the result somewhere. Every rule from Unit 5 applies: the prompt is a template, the output format should be specified, and the output should be checked before it reaches a customer. Module 7.10 covers calling model APIs, and Unit 8 builds agents.

### Complexity

A node in per-item mode does work proportional to the number of items; in all-items mode, whatever its code does with the list. Expressions are evaluated once per item per field. Execution count, not node count, drives cloud cost.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, the item format.

```python
def to_items(output):
    if isinstance(output, dict):
        output = [output]
    items = []
    for entry in output:
        if not isinstance(entry, dict):
            raise TypeError("each item must be an object")
        if isinstance(entry.get("json"), dict):
            item = {"json": entry["json"]}
            if "binary" in entry:
                item["binary"] = entry["binary"]
            items.append(item)
        else:
            items.append({"json": entry})
    return items

print(to_items({"name": "Priya"}))
print(to_items([{"a": 1}, {"json": {"b": 2}}, {"json": {"c": 3}, "binary": {"invoice": {"fileName": "c.pdf"}}}]))
```

- **A single object becomes a list of one.** n8n does the same when a Code node returns one object.
- **Plain objects are wrapped under `json`.** `{"a": 1}` becomes `{"json": {"a": 1}}`.
- **Items already in the right shape pass through,** keeping their `binary` part if they have one.
- **Anything that is not an object is refused.** A Code node that returns a list of strings is a mistake, and the error says so.

Next, expressions.

```python
import json
import re

EXPRESSION = re.compile(r"\{\{\s*\$json((?:\.[A-Za-z_][A-Za-z0-9_]*)+)\s*\}\}")

def render(template, item):
    missing = []
    def replace(match):
        value = item["json"]
        for name in match.group(1).split(".")[1:]:
            if isinstance(value, dict) and name in value:
                value = value[name]
            else:
                missing.append("$json" + match.group(1))
                return ""
        return value if isinstance(value, str) else json.dumps(value)
    return EXPRESSION.sub(replace, template), missing

item = {"json": {"name": "Priya", "order": {"id": "A1234", "total": 84.0}, "tags": ["vip"]}}
print(render("Hi {{ $json.name }}, order {{$json.order.id}} came to {{ $json.order.total }} {{ $json.tags }}", item))
print(render("Hi {{ $json.first_name }}!", item))
```

- **The pattern finds `{{ $json.path }}` with or without spaces.** It supports only field paths, the commonest kind of expression, not arbitrary JavaScript.
- **Each path is followed field by field.** Text is inserted as it is; numbers, lists, and objects are written as JSON, so the list of tags appears as `["vip"]`.
- **A missing field renders as empty, as in n8n, but is also reported.** "Hi !" is what a customer would receive; the list `['$json.first_name']` is what the builder needs to see.
- **The fix in a real workflow is a check before the message node.** An IF node testing that the field is not empty, or a default in the expression, such as `{{ $json.first_name || "there" }}`.

Then, the two run modes.

```python
def run_node(items, function, mode):
    if mode == "each":
        return [{"json": function(item["json"])} for item in items], len(items)
    if mode == "all":
        return to_items(function([item["json"] for item in items])), 1
    raise ValueError("mode is 'each' or 'all'")

lines = to_items([{"qty": 2, "price": 14.5}, {"qty": 1, "price": 22.0}, {"qty": 3, "price": 11.0}])
print(run_node(lines, lambda row: {**row, "line_total": row["qty"] * row["price"]}, "each"))
print(run_node(lines, lambda rows: {"total": sum(r["qty"] * r["price"] for r in rows), "lines": len(rows)}, "all"))
```

- **Each mode returns the output items and how many times the code ran.** The count is the point: it is how many emails, API calls, or model calls would happen.
- **Per-item mode runs three times and adds a line total to each line.** 29.0, 22.0, and 33.0.
- **All-items mode runs once and returns one item with the total, 84.0.** The function returned a single object, and `to_items` wrapped it.
- **The same order, two different shapes out.** Three items continue down the line in the first case, one in the second, which decides how often every later node runs.

Finally, pricing and safe exports.

```python
PLANS = [("Starter", 20, 2500), ("Pro", 50, 10000), ("Business", 667, 40000)]

def cheapest_plan(executions, plans):
    fitting = [plan for plan in plans if plan[2] >= executions]
    return min(fitting, key=lambda plan: plan[1])[0] if fitting else None

print(cheapest_plan(2000, PLANS), cheapest_plan(4 * 24 * 30, PLANS), cheapest_plan(50000, PLANS))

SECRET_NAMES = {"authorization", "api_key", "apikey", "x-api-key", "password", "token", "secret"}
SECRET_VALUE = re.compile(r"^(Bearer\s+\S+|sk-[A-Za-z0-9_-]{8,}|xox[bp]-\S+)")

def export_risks(workflow):
    risks = []
    def walk(value, node, path):
        if isinstance(value, dict):
            for key, inner in value.items():
                here = f"{path}.{key}"
                if isinstance(inner, str) and inner and (key.lower() in SECRET_NAMES or SECRET_VALUE.match(inner)):
                    risks.append((node, here))
                else:
                    walk(inner, node, here)
        elif isinstance(value, list):
            for index, inner in enumerate(value):
                here = f"{path}[{index}]"
                if isinstance(inner, str) and SECRET_VALUE.match(inner):
                    risks.append((node, here))
                else:
                    walk(inner, node, here)
    for node in workflow.get("nodes", []):
        walk(node.get("parameters", {}), node["name"], "parameters")
    for name, rows in (workflow.get("pinData") or {}).items():
        if rows:
            risks.append((name, "pinData"))
    return risks

WORKFLOW = {"name": "Orders to Slack", "nodes": [
    {"name": "Webhook", "type": "n8n-nodes-base.webhook", "parameters": {"path": "orders", "httpMethod": "POST"}},
    {"name": "Call API", "type": "n8n-nodes-base.httpRequest", "parameters": {"url": "https://api.example.com/v1/orders",
        "headerParameters": {"parameters": [{"name": "Authorization", "value": "Bearer sk-live-4f9a8b7c6d5e"}]}}},
    {"name": "Summarise", "type": "n8n-nodes-base.httpRequest", "parameters": {"url": "https://api.example.com/v1/summary",
        "authentication": "predefinedCredentialType"}, "credentials": {"httpHeaderAuth": {"id": "7", "name": "Example API"}}},
    {"name": "Post", "type": "n8n-nodes-base.slack", "parameters": {"text": "={{ $json.summary }}", "token": "xoxb-1234-abcd"}}],
    "pinData": {"Webhook": [{"json": {"email": "priya@example.com"}}]}}
print(export_risks(WORKFLOW))
```

- **2,000 executions fit Starter.** The eight steps in each do not matter under execution pricing.
- **A 15-minute schedule needs Pro.** 2,880 executions a month exceed Starter's 2,500, even if most runs find nothing to do.
- **50,000 executions fit no listed plan.** The function returns None, which means "talk to sales or self-host", not "free".
- **`export_risks` walks every node's parameters.** It flags fields whose names suggest secrets and values that look like bearer tokens, `sk-` keys, or Slack tokens, wherever they sit.
- **Three risks are found.** The Authorization header typed into "Call API", which is the cURL-import case; the Slack token typed into "Post"; and pinned data on "Webhook", which holds a real customer's email address.
- **"Summarise" is clean.** It refers to a stored credential by ID and name, which is the right way, and the reference is not a secret.
- **A scan is a safety net, not a guarantee.** It catches the common shapes. Secrets in unusual fields or formats can slip through, so the habit that matters is never typing secrets into nodes.

**Complexity.** `to_items` and `run_node` are linear in the items, `render` in the template and path lengths, and `export_risks` in the size of the workflow file.

### A first AI workflow

```text
1  Trigger        Gmail trigger: new email with label "support"          (or a webhook from a form)
2  Prepare        Set node: subject, body (first 4,000 characters), sender
3  Model          AI model node, prompt template:
                    "Classify this email as billing, technical, or other.
                     Reply only with JSON: {\"category\": string, \"summary\": string}.
                     Email subject: {{ $json.subject }}  Body: {{ $json.body }}"
4  Parse/check    Code node (each item): parse JSON, check category is one of the three
5  Route          Switch node on {{ $json.category }}, with a fallback output
6  Act            Slack message to the right channel, with the summary and a link
7  Errors         Error workflow: notify the builder if any node fails
```

### n8n terms against the general terms

| n8n | General term from this unit |
|---|---|
| Workflow | Workflow, scenario, Zap |
| Node | Step, module, action |
| Item | Record, bundle |
| Expression | Field mapping |
| Execution | Run, which is also what n8n bills |
| Credential | Connection, stored secret |
| Pinned data | Saved sample payload |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**One email per item.** A node after a split runs once per item. Put once-per-run actions before the split, or aggregate first.

**Empty expressions that send anyway.** A misspelled field renders as nothing. Test with real data and add checks before messages go out.

**Wrong Code node mode.** A total computed in per-item mode is just each line. Decide whether the job is per item or for all.

**Referring to the wrong earlier node.** `$('Node Name')` depends on the name. Renaming a node breaks expressions that refer to it in some cases; check after renaming.

**Secrets typed into nodes.** They travel with exports and appear in screenshots. Always use credentials.

**Pinned customer data.** Pinned data is saved with the workflow. Unpin it, or use fake data, before sharing.

**Imported workflows without credentials.** Credentials are not part of the file. After importing, every node that needs one must be pointed at a credential in your instance.

**Schedules that eat executions.** A trigger every minute is 43,200 executions a month. Use webhooks where you can.

**Self-hosting without backups.** A self-hosted instance holds all workflows and credentials. Back up its database and its encryption key, without which stored credentials cannot be decrypted.

**Updating self-hosted instances blindly.** Major versions change behaviour. Read the release notes and test on a copy first.

**Treating the licence as open source.** It is source-available with limits. Check it before offering n8n-based services commercially.

**Very large binary data in memory.** Big files passed between nodes can exhaust memory on small servers. n8n can be configured to keep binary data on disk.

## 5. Active Recall Check & Synthesis Summary

**Summary.** n8n is a node-based workflow tool that adds code steps, a generic HTTP node, and self-hosting to the visual approach of other tools. Data between nodes is always a list of items, each wrapping its data under `json` and optionally files under `binary`; a Code node may return plain objects and n8n wraps them. Most nodes run once per item, so the number of items decides how many emails or API calls happen; the Code node's two modes, once for all items, the default, and once for each item, make the choice explicit. Expressions in double braces insert data, such as `{{ $json.order.total }}`, and can reach earlier nodes; a missing field quietly renders as empty. Credentials are stored apart from workflows and referred to by ID, so secrets stay out of exported JSON unless typed into nodes, and pinned data saves real records into the file. n8n can be used in the cloud or self-hosted under the Sustainable Use License, which allows internal and non-commercial use but not reselling n8n as a service. Paid plans are priced by executions with unlimited steps, at the time of writing EUR 20 for 2,500 and EUR 50 for 10,000 on n8n's cloud, and EUR 667 for 40,000 self-hosted, a month billed annually, which favours long workflows and penalises frequent schedules. AI nodes call models and build agents, with all of Unit 5's prompt practice applying.

**Question 1.** A workflow receives a webhook with an order containing four line items, uses a Split Out node to split them into four items, then runs a Code node that computes `order_total = qty * price`, then an email node sends `Your order total is {{ $json.order_total }}`. Describe exactly what the customer receives, and explain how to fix the workflow using what you know about items and the Code node's modes.

<details>
<summary>View Answer</summary>

After the split there are four items, one per line. The Code node, as written, computes `qty * price` for each line, so the field called `order_total` is in fact each line's own total, and it ends up on four separate items. The email node runs once per item, so the customer receives four emails, each claiming a different "order total", none of which is the real total. Two mistakes combine: a per-line calculation is being treated as an order-level figure, and an order-level action is placed after the split. The fix: compute the total over all lines in one place, either by running the Code node in "Run Once for All Items" mode, which sees all four items and returns a single item with the sum, or by computing the total from the original order before the split. Then send the email from that single item, so the email node runs exactly once. If per-line processing is also needed, for example adding spreadsheet rows, keep it on a separate branch after the split, so the email branch carries one item and the rows branch carries four. Testing with a multi-line order, not a single-line one, would have revealed the problem immediately.

</details>

**Question 2.** A team estimates that their n8n Cloud workflows will run as follows: an order workflow of 12 steps triggered by webhook about 1,500 times a month, and an inbox check of 3 steps on a 10-minute schedule. Which plan do they need under execution pricing, and what would the same usage be in step-level units? What change would reduce their plan?

<details>
<summary>View Answer</summary>

The order workflow uses 1,500 executions a month. The inbox check runs every 10 minutes: 6 an hour, 144 a day, and 4,320 in a 30-day month. Together that is 5,820 executions, which exceeds Starter's 2,500 and fits Pro's 10,000, so they need Pro at EUR 50 a month on annual billing. In step-level units, the order workflow is 1,500 times 12, or 18,000, and the inbox check 4,320 times 3, or 12,960, a total of 30,960, though in step-priced tools a run that stops at a filter often uses fewer units. Under execution pricing the long order workflow is cheap, and it is the short, frequent schedule that drives the plan: 4,320 of the 5,820 executions are inbox checks, most of which probably find nothing. Replacing the schedule with an event trigger, a Gmail trigger, or a push notification if the mail system supports it, so the workflow runs only when mail arrives, would cut those executions to the number of relevant emails. If that number is under about 1,000 a month, the total falls under 2,500 and Starter would do. Running the check every 60 minutes instead, if the delay is acceptable, would cut it to 720, for a total of 2,220, which fits Starter; every 30 minutes gives 1,440 and a total of 2,940, which still needs Pro.

</details>

**Question 3.** A colleague wants to post an n8n workflow JSON on a public forum to ask for help. It contains an HTTP Request node imported from a cURL command, a Slack node, a node that uses a stored OpenAI credential, and pinned data from a test run against real orders. What could leak, what is safe, and what should they do before posting?

<details>
<summary>View Answer</summary>

What can leak: the HTTP Request node imported from cURL is likely to carry the original command's headers, so if it had an Authorization header or an API key, that secret is now a parameter of the node and is in the JSON. The Slack node may contain a token if one was typed into a field instead of using a credential. The pinned data contains whatever the test run returned, real orders with customer names, emails, and addresses, which is personal data and should never be posted publicly. The URLs and parameters may also reveal internal hostnames or account identifiers. What is safe: the node that uses a stored OpenAI credential contains only a reference, an ID and a name, not the key itself, because credentials are stored separately and encrypted. Before posting, they should unpin or replace the pinned data with fake records; move any secret in node parameters into a proper credential, and, because a secret that has been in a file shared anywhere should be treated as exposed, rotate any key that was ever in the JSON; check URLs for anything internal; and run a scan like the lab's, then read the file through by eye. Finally, they should post only the nodes relevant to the question. Once posted, a secret cannot be recalled, so rotation is the only remedy if one slips through.

</details>

@@starter
"""
Lab: Items, Expressions, Run Modes, Execution Pricing, and Safe Exports
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import json
import re

EXPRESSION = re.compile(r"\{\{\s*\$json((?:\.[A-Za-z_][A-Za-z0-9_]*)+)\s*\}\}")
PLANS = [("Starter", 20, 2500), ("Pro", 50, 10000), ("Business", 667, 40000)]
SECRET_NAMES = {"authorization", "api_key", "apikey", "x-api-key", "password", "token", "secret"}
SECRET_VALUE = re.compile(r"^(Bearer\s+\S+|sk-[A-Za-z0-9_-]{8,}|xox[bp]-\S+)")

WORKFLOW = {"name": "Orders to Slack", "nodes": [
    {"name": "Webhook", "type": "n8n-nodes-base.webhook", "parameters": {"path": "orders", "httpMethod": "POST"}},
    {"name": "Call API", "type": "n8n-nodes-base.httpRequest", "parameters": {"url": "https://api.example.com/v1/orders",
        "headerParameters": {"parameters": [{"name": "Authorization", "value": "Bearer sk-live-4f9a8b7c6d5e"}]}}},
    {"name": "Summarise", "type": "n8n-nodes-base.httpRequest", "parameters": {"url": "https://api.example.com/v1/summary",
        "authentication": "predefinedCredentialType"}, "credentials": {"httpHeaderAuth": {"id": "7", "name": "Example API"}}},
    {"name": "Post", "type": "n8n-nodes-base.slack", "parameters": {"text": "={{ $json.summary }}", "token": "xoxb-1234-abcd"}}],
    "pinData": {"Webhook": [{"json": {"email": "priya@example.com"}}]}}


# ---------------------------------------------------------------- Step 1
def to_items(output):
    """Normalise a node's output to n8n items. A single dict becomes a list of one. For each entry:
    not a dict -> raise TypeError; has a "json" key holding a dict -> keep {"json": that} plus its
    "binary" key if present; otherwise -> {"json": entry}. Return the list."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def render(template, item):
    """Replace each {{ $json.a.b }} (EXPRESSION) by following the path in item["json"].
    A string is inserted as it is; any other value as json.dumps(value). A path that cannot be
    followed renders as "" and "$json.a.b" (the path as written after $json) is appended to a list
    of missing paths. Return (text, missing)."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def run_node(items, function, mode):
    """mode "each": call function(item["json"]) for every item, return ([{"json": result}, one per
    item], number of items). mode "all": call function once with the list of every item's json,
    return (to_items(result), 1). Any other mode raises ValueError."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def executions_per_month(every_minutes, days=30):
    """Executions of a schedule trigger that fires every `every_minutes` minutes for `days` days:
    (24 * 60 // every_minutes) * days."""
    # TODO Step 4
    return None


def cheapest_plan(executions, plans):
    """plans: (name, monthly price, executions included). Return the name of the cheapest plan whose
    included executions are at least `executions`, or None if none is big enough."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def export_risks(workflow):
    """Walk each node's "parameters" (dicts and lists, to any depth), with paths like
    "parameters.headerParameters.parameters[0].value". Flag (node name, path) for a non-empty string
    under a key whose lower-case name is in SECRET_NAMES, or any string matching SECRET_VALUE (in a
    dict or a list). Do not descend into flagged values. After all nodes, flag (node name, "pinData")
    for every entry of workflow["pinData"] that holds at least one row. Return the list in that order."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("items:", to_items({"name": "Priya"}))
    print("expr :", render("Hi {{ $json.name }}", {"json": {"name": "Priya"}}))
    print("mode :", run_node([{"json": {"n": 1}}], lambda j: j, "each"))
    print("plan :", cheapest_plan(executions_per_month(15), PLANS))
    print("risks:", export_risks(WORKFLOW))

@@solution
"""
Lab solution: Items, Expressions, Run Modes, Execution Pricing, and Safe Exports
Standard library only.
"""
import json
import re

EXPRESSION = re.compile(r"\{\{\s*\$json((?:\.[A-Za-z_][A-Za-z0-9_]*)+)\s*\}\}")
PLANS = [("Starter", 20, 2500), ("Pro", 50, 10000), ("Business", 667, 40000)]
SECRET_NAMES = {"authorization", "api_key", "apikey", "x-api-key", "password", "token", "secret"}
SECRET_VALUE = re.compile(r"^(Bearer\s+\S+|sk-[A-Za-z0-9_-]{8,}|xox[bp]-\S+)")

WORKFLOW = {"name": "Orders to Slack", "nodes": [
    {"name": "Webhook", "type": "n8n-nodes-base.webhook", "parameters": {"path": "orders", "httpMethod": "POST"}},
    {"name": "Call API", "type": "n8n-nodes-base.httpRequest", "parameters": {"url": "https://api.example.com/v1/orders",
        "headerParameters": {"parameters": [{"name": "Authorization", "value": "Bearer sk-live-4f9a8b7c6d5e"}]}}},
    {"name": "Summarise", "type": "n8n-nodes-base.httpRequest", "parameters": {"url": "https://api.example.com/v1/summary",
        "authentication": "predefinedCredentialType"}, "credentials": {"httpHeaderAuth": {"id": "7", "name": "Example API"}}},
    {"name": "Post", "type": "n8n-nodes-base.slack", "parameters": {"text": "={{ $json.summary }}", "token": "xoxb-1234-abcd"}}],
    "pinData": {"Webhook": [{"json": {"email": "priya@example.com"}}]}}


# ---------------------------------------------------------------- Step 1
def to_items(output):
    """Data between nodes is always a list of items, each a dict with a "json" key. n8n adds the wrapping for
    a Code node that returns plain objects, and so does this."""
    if isinstance(output, dict):
        output = [output]
    items = []
    for entry in output:
        if not isinstance(entry, dict):
            raise TypeError("each item must be an object")
        if isinstance(entry.get("json"), dict):
            item = {"json": entry["json"]}
            if "binary" in entry:
                item["binary"] = entry["binary"]
            items.append(item)
        else:
            items.append({"json": entry})
    return items


# ---------------------------------------------------------------- Step 2
def render(template, item):
    """A missing field renders as empty, as in n8n, and is reported, unlike in n8n."""
    missing = []

    def replace(match):
        value = item["json"]
        for name in match.group(1).split(".")[1:]:
            if isinstance(value, dict) and name in value:
                value = value[name]
            else:
                missing.append("$json" + match.group(1))
                return ""
        return value if isinstance(value, str) else json.dumps(value)

    return EXPRESSION.sub(replace, template), missing


# ---------------------------------------------------------------- Step 3
def run_node(items, function, mode):
    """The second value is how many times the code ran: how many emails, API calls, or model
    calls a node in this position would make."""
    if mode == "each":
        return [{"json": function(item["json"])} for item in items], len(items)
    if mode == "all":
        return to_items(function([item["json"] for item in items])), 1
    raise ValueError("mode is 'each' or 'all'")


# ---------------------------------------------------------------- Step 4
def executions_per_month(every_minutes, days=30):
    """A schedule costs executions whether or not it finds work."""
    return (24 * 60 // every_minutes) * days


def cheapest_plan(executions, plans):
    """Execution pricing ignores the number of steps in each run."""
    fitting = [plan for plan in plans if plan[2] >= executions]
    return min(fitting, key=lambda plan: plan[1])[0] if fitting else None


# ---------------------------------------------------------------- Step 5
def export_risks(workflow):
    """Credential references are safe to share; secrets typed into parameters and pinned real
    data are not. A scan catches common shapes, not every possible secret."""
    risks = []

    def walk(value, node, path):
        if isinstance(value, dict):
            for key, inner in value.items():
                here = f"{path}.{key}"
                if isinstance(inner, str) and inner and (key.lower() in SECRET_NAMES or SECRET_VALUE.match(inner)):
                    risks.append((node, here))
                else:
                    walk(inner, node, here)
        elif isinstance(value, list):
            for index, inner in enumerate(value):
                here = f"{path}[{index}]"
                if isinstance(inner, str) and SECRET_VALUE.match(inner):
                    risks.append((node, here))
                else:
                    walk(inner, node, here)

    for node in workflow.get("nodes", []):
        walk(node.get("parameters", {}), node["name"], "parameters")
    for name, rows in (workflow.get("pinData") or {}).items():
        if rows:
            risks.append((name, "pinData"))
    return risks


if __name__ == "__main__":
    print(to_items([{"a": 1}, {"json": {"b": 2}}, {"json": {"c": 3}, "binary": {"invoice": {"fileName": "c.pdf"}}}]))
    item = {"json": {"name": "Priya", "order": {"id": "A1234", "total": 84.0}, "tags": ["vip"]}}
    print(render("Hi {{ $json.name }}, order {{$json.order.id}} came to {{ $json.order.total }} {{ $json.tags }}", item))
    print(render("Hi {{ $json.first_name }}!", item))
    lines = to_items([{"qty": 2, "price": 14.5}, {"qty": 1, "price": 22.0}, {"qty": 3, "price": 11.0}])
    print(run_node(lines, lambda row: {**row, "line_total": row["qty"] * row["price"]}, "each"))
    print(run_node(lines, lambda rows: {"total": sum(r["qty"] * r["price"] for r in rows), "lines": len(rows)}, "all"))
    for minutes in (1, 10, 15, 60):
        runs = executions_per_month(minutes)
        print(minutes, runs, cheapest_plan(runs, PLANS))
    print(cheapest_plan(1500 + executions_per_month(10), PLANS))
    print(export_risks(WORKFLOW))

@@step
{
  "stepNumber": 1,
  "title": "Normalise node output to items",
  "instruction": "Implement to_items(output). If the output is a single dict, treat it as a list of one. For each entry, raise TypeError if it is not a dict. If it has a 'json' key holding a dict, keep an item with that 'json' value, plus its 'binary' value if it has one. Otherwise wrap the entry itself as the 'json' value. Return the list of items. This is n8n's data structure from Section 2, including the wrapping n8n does for Code nodes that return plain objects. [MOD-7.7]",
  "hintConceptual": "Every parcel on the conveyor must sit in a tray labelled 'json'. Loose parcels get put in a tray; parcels already in trays stay as they are, with any attached envelope of files; and something that is not a parcel at all stops the line.",
  "hintSyntax": "if isinstance(output, dict):\n    output = [output]\nitems = []\nfor entry in output:\n    if not isinstance(entry, dict):\n        raise TypeError(\"each item must be an object\")\n    if isinstance(entry.get(\"json\"), dict):\n        item = {\"json\": entry[\"json\"]}\n        if \"binary\" in entry:\n            item[\"binary\"] = entry[\"binary\"]\n        items.append(item)\n    else:\n        items.append({\"json\": entry})\nreturn items"
}
@@assert
assert to_items({"name": "Priya"}) == [{"json": {"name": "Priya"}}], f"A single object becomes a list of one item, got {to_items({'name': 'Priya'})}"
_mixed = to_items([{"a": 1}, {"json": {"b": 2}}, {"json": {"c": 3}, "binary": {"invoice": {"fileName": "c.pdf"}}}])
assert _mixed == [{"json": {"a": 1}}, {"json": {"b": 2}}, {"json": {"c": 3}, "binary": {"invoice": {"fileName": "c.pdf"}}}], "Plain objects are wrapped, items pass through with their binary part"
assert to_items([{"json": "text"}]) == [{"json": {"json": "text"}}], "A 'json' key that is not an object is just a field"
assert to_items([{"json": {"x": 1}, "extra": 5}]) == [{"json": {"x": 1}}] and to_items([]) == [], "Only json and binary are kept, and no output is no items"
try:
    to_items(["a", "b"])
    raise AssertionError("A list of strings must raise TypeError")
except TypeError:
    pass
print("Step 1 passed: plain objects are wrapped under json, and files ride along under binary.")

@@step
{
  "stepNumber": 2,
  "title": "Render expressions and report missing fields",
  "instruction": "Implement render(template, item). Replace each match of EXPRESSION, such as '{{ $json.order.id }}', by following the field names after $json through item['json']. Insert a string value as it is and any other value as json.dumps of it. If any field along the path is missing, or the value is not a dict where a field is needed, insert an empty string and add '$json' followed by the path as written, for example '$json.first_name', to a list of missing paths. Return the text and that list. Render a greeting, a nested order ID, a number, a list, and a misspelled field. This is the expression behaviour from Section 2. [MOD-7.7]",
  "hintConceptual": "A mail-merge letter: each blank names a field on the customer's card. Fill in what the card has. Where the card has no such field, leave the blank empty as the tool would, but write the field's name on a sticky note for the builder.",
  "hintSyntax": "missing = []\n\ndef replace(match):\n    value = item[\"json\"]\n    for name in match.group(1).split(\".\")[1:]:\n        if isinstance(value, dict) and name in value:\n            value = value[name]\n        else:\n            missing.append(\"$json\" + match.group(1))\n            return \"\"\n    return value if isinstance(value, str) else json.dumps(value)\n\nreturn EXPRESSION.sub(replace, template), missing"
}
@@assert
_item = {"json": {"name": "Priya", "order": {"id": "A1234", "total": 84.0}, "tags": ["vip"]}}
_text = render("Hi {{ $json.name }}, order {{$json.order.id}} came to {{ $json.order.total }} {{ $json.tags }}", _item)
assert _text == ('Hi Priya, order A1234 came to 84.0 ["vip"]', []), f"Fields by path, numbers and lists as JSON, got {_text}"
assert render("Hi {{ $json.first_name }}!", _item) == ("Hi !", ["$json.first_name"]), "A missing field renders empty and is reported"
assert render("{{ $json.order.id.code }} {{ $json.name.first }}", _item) == (" ", ["$json.order.id.code", "$json.name.first"]), "A path through a non-object is missing"
assert render("No expressions here.", _item) == ("No expressions here.", []) and render("{{ $json.nothing }}", {"json": {}})[1] == ["$json.nothing"], "Plain text is unchanged"
assert render("{{ $json.flag }} {{ $json.none }}", {"json": {"flag": True, "none": None}}) == ("true null", []), "A present null is not missing, and JSON spellings are used"
print("Step 2 passed: 'Hi Priya' renders, and '$json.first_name' is reported instead of silently sending 'Hi !'.")

@@step
{
  "stepNumber": 3,
  "title": "Run code once per item or once for all",
  "instruction": "Implement run_node(items, function, mode). In mode 'each', call the function with each item's json and return a list of {'json': result}, one per item, together with the number of items. In mode 'all', call the function once with the list of every item's json, normalise the result with to_items, and return it together with 1. Raise ValueError for any other mode. Add a line total to each of three order lines, then compute the order total once. These are the Code node's two modes from Section 2. [MOD-7.7]",
  "hintConceptual": "A worker at a station can handle each tray as it passes, three trays, three jobs, or take the whole batch at once and hand back a single summary tray. The count of jobs is what the next stations, and your bill, will feel.",
  "hintSyntax": "if mode == \"each\":\n    return [{\"json\": function(item[\"json\"])} for item in items], len(items)\nif mode == \"all\":\n    return to_items(function([item[\"json\"] for item in items])), 1\nraise ValueError(\"mode is 'each' or 'all'\")"
}
@@assert
_lines = [{"json": {"qty": 2, "price": 14.5}}, {"json": {"qty": 1, "price": 22.0}}, {"json": {"qty": 3, "price": 11.0}}]
_each = run_node(_lines, lambda row: {**row, "line_total": row["qty"] * row["price"]}, "each")
assert _each is not None and _each[1] == 3 and [i["json"]["line_total"] for i in _each[0]] == [29.0, 22.0, 33.0], f"Per item: three runs and three line totals, got {_each}"
_all = run_node(_lines, lambda rows: {"total": sum(r["qty"] * r["price"] for r in rows), "lines": len(rows)}, "all")
assert _all == ([{"json": {"total": 84.0, "lines": 3}}], 1), "For all items: one run and one item with the total"
assert run_node(_lines, lambda rows: rows[:2], "all") == ([_lines[0], _lines[1]], 1), "All-items mode can return several items"
assert run_node([], lambda row: row, "each") == ([], 0) and _lines[0] == {"json": {"qty": 2, "price": 14.5}}, "No items means no runs, and inputs are not modified"
try:
    run_node(_lines, lambda row: row, "batch")
    raise AssertionError("An unknown mode must raise ValueError")
except ValueError:
    pass
print("Step 3 passed: three runs give three line totals; one run gives the order total of 84.")

@@step
{
  "stepNumber": 4,
  "title": "Choose a plan by executions",
  "instruction": "Implement executions_per_month(every_minutes, days=30): the number of runs per day, 24 times 60 divided by the interval using whole-number division, times the number of days. Then implement cheapest_plan(executions, plans), where each plan is a name, a monthly price, and the executions included: return the name of the cheapest plan that includes at least that many executions, or None if no plan is big enough. Check schedules of 1, 10, 15, and 60 minutes against PLANS, which holds the published n8n Cloud prices from Section 2. [MOD-7.7]",
  "hintConceptual": "Count how often the alarm rings in a month, then pick the cheapest phone contract whose allowance covers that many calls. How long each call lasts does not matter on this contract.",
  "hintSyntax": "return (24 * 60 // every_minutes) * days\n\n# cheapest_plan\nfitting = [plan for plan in plans if plan[2] >= executions]\nreturn min(fitting, key=lambda plan: plan[1])[0] if fitting else None"
}
@@assert
assert executions_per_month(15) == 2880 and executions_per_month(10) == 4320 and executions_per_month(60) == 720, f"Every 15, 10, and 60 minutes, got {executions_per_month(15)}, {executions_per_month(10)}, {executions_per_month(60)}"
assert executions_per_month(1) == 43200 and executions_per_month(60, days=31) == 744, "Every minute, and a 31-day month"
assert cheapest_plan(2000, PLANS) == "Starter" and cheapest_plan(2500, PLANS) == "Starter", "2,000 and exactly 2,500 fit Starter"
assert cheapest_plan(executions_per_month(15), PLANS) == "Pro", "A 15-minute schedule alone needs Pro"
assert cheapest_plan(1500 + executions_per_month(10), PLANS) == "Pro" and cheapest_plan(executions_per_month(1), PLANS) is None, "Question 2's 5,820 needs Pro; every minute, 43,200, fits no listed plan"
assert cheapest_plan(50000, PLANS) is None and cheapest_plan(10, [("B", 9, 100), ("A", 5, 100)]) == "A", "Nothing fits 50,000, and the cheapest fitting plan wins"
print("Step 4 passed: a 15-minute schedule is 2,880 executions a month, which needs Pro on its own.")

@@step
{
  "stepNumber": 5,
  "title": "Scan a workflow before sharing it",
  "instruction": "Implement export_risks(workflow). For each node, walk its 'parameters' through dicts and lists to any depth, building paths such as 'parameters.headerParameters.parameters[0].value'. Flag the node name and path for a non-empty string stored under a key whose lower-case name is in SECRET_NAMES, and for any string, in a dict or a list, that matches SECRET_VALUE. Then, for each entry of the workflow's 'pinData' that holds at least one row, flag the node name and 'pinData'. Scan WORKFLOW and check that the stored credential reference is not flagged. This is the safe-export check from Section 2. [MOD-7.7]",
  "hintConceptual": "Before posting a photo of your desk online, sweep it for anything with a password on it, sticky notes, open letters, and customer files. The locked drawer labelled 'Example API' is fine to show; its contents are not in the picture.",
  "hintSyntax": "risks = []\n\ndef walk(value, node, path):\n    if isinstance(value, dict):\n        for key, inner in value.items():\n            here = f\"{path}.{key}\"\n            if isinstance(inner, str) and inner and (key.lower() in SECRET_NAMES or SECRET_VALUE.match(inner)):\n                risks.append((node, here))\n            else:\n                walk(inner, node, here)\n    elif isinstance(value, list):\n        for index, inner in enumerate(value):\n            here = f\"{path}[{index}]\"\n            if isinstance(inner, str) and SECRET_VALUE.match(inner):\n                risks.append((node, here))\n            else:\n                walk(inner, node, here)\n\nfor node in workflow.get(\"nodes\", []):\n    walk(node.get(\"parameters\", {}), node[\"name\"], \"parameters\")\nfor name, rows in (workflow.get(\"pinData\") or {}).items():\n    if rows:\n        risks.append((name, \"pinData\"))\nreturn risks"
}
@@assert
_risks = export_risks(WORKFLOW)
assert _risks == [("Call API", "parameters.headerParameters.parameters[0].value"), ("Post", "parameters.token"), ("Webhook", "pinData")], f"A typed-in header, a typed-in token, and pinned data, got {_risks}"
assert not any(node == "Summarise" for node, _ in _risks), "A stored credential reference is not a secret"
assert export_risks({"nodes": [{"name": "N", "parameters": {"password": ""}}], "pinData": {"N": []}}) == [], "Empty values and empty pinned data are not risks"
assert export_risks({"nodes": [{"name": "N", "parameters": {"headers": ["sk-abcdefgh1234", "plain"]}}]}) == [("N", "parameters.headers[0]")], "A key-shaped string in a list is flagged"
assert export_risks({"nodes": [{"name": "N", "parameters": {"API_KEY": "abc"}}, {"name": "M"}]}) == [("N", "parameters.API_KEY")], "Key names are compared in lower case, and a node with no parameters is fine"
print("Step 5 passed: the typed-in header, the Slack token, and the pinned customer email are caught; the credential reference is not.")
