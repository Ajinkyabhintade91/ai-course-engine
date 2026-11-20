@@meta
{
  "moduleId": "MOD-8.5",
  "slug": "mod-8-5",
  "unitId": "UNIT-8",
  "unitTitle": "Unit 8: Build Your Own AI Agents",
  "title": "Tool Calling",
  "difficulty": "Intermediate",
  "estimatedMinutes": 95,
  "citations": [
    { "title": "Writing effective tools for agents, with agents", "source": "Anthropic Engineering", "url": "https://www.anthropic.com/engineering/writing-tools-for-agents" },
    { "title": "Function calling", "source": "OpenAI Platform Docs", "url": "https://platform.openai.com/docs/guides/function-calling" },
    { "title": "Tool use with Claude", "source": "Claude Docs", "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview" },
    { "title": "concurrent.futures: Launching parallel tasks", "source": "Python Documentation", "url": "https://docs.python.org/3/library/concurrent.futures.html" },
    { "title": "shlex: Simple lexical analysis", "source": "Python Documentation", "url": "https://docs.python.org/3/library/shlex.html" }
  ],
  "videoLibrary": [
    {
      "id": "VID-8.5-1",
      "title": "Writing effective tools for AI agents (feat. Anthropic)",
      "creator": "AI Papers",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=07Ugw2WTjFk",
      "timingInstruction": "Watch after reading Section 1, before the tool design principles in Section 2",
      "keyTakeaway": "Tools designed for agents differ from APIs designed for programs: fewer, higher-level, clearly described, and context-efficient."
    },
    {
      "id": "VID-8.5-2",
      "title": "5 Best Practices for Building AI Agent Skills",
      "creator": "IBM Technology",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=qYNs80FKIVc",
      "timingInstruction": "Watch after the granularity part of Section 2",
      "keyTakeaway": "Packaging capabilities so an agent can find and use them reliably."
    },
    {
      "id": "VID-8.5-3",
      "title": "Agent Sandboxing : How Do You Safely Let AI Run Code",
      "creator": "Kernel Cast",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=m30BbvHt-i8",
      "timingInstruction": "Watch after the safe execution part of Section 2, before Step 4 of the lab",
      "keyTakeaway": "Why commands from a model are untrusted input, and how isolation and allowlists contain them."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Convert Between Providers, Find Confusable Tools, Add Timeouts, Allowlist Commands, Make Actions Idempotent",
    "context": "The tool shop's agent will run on more than one model provider, call slow supplier systems, run a few shell commands over its own report files, and place purchase orders that must never be duplicated by retries. You will convert tool definitions between two providers' formats, flag tools whose descriptions are confusingly similar, wrap calls in a timeout, allow only safe commands, and make an action tool idempotent.",
    "language": "python"
  }
}

@@reading
# Tool Calling

Module 8.4 covered the mechanics of function calling: schemas in, structured calls out, results back. This chapter is about the craft: designing tools an agent can actually use well, and running them safely. The difference is large. Two agents with the same model and the same task can perform very differently depending only on how their tools are named, described, divided up, and implemented. Anthropic's engineering article "Writing effective tools for agents" makes this its central point: tools are a contract between deterministic systems and non-deterministic agents, and they deserve the same care as the prompt.

The chapter covers how tool use looks across providers, the design principles that make tools easy to choose and use correctly, and the runtime safeguards every tool needs: validation, timeouts, sandboxing for anything that executes commands, and idempotency for anything with side effects.

## 1. First-Principles Mental Model & Intuition

### Tools for a new colleague, not for a program

Imagine equipping a capable new colleague who has never seen your systems. Handing them the raw database and fifty internal API endpoints would overwhelm them; they would pick the wrong endpoint, pull far too much data, and misread cryptic error codes. A good manager instead gives them a handful of clear tools: "search customers by name or email", "show this customer's recent orders", "create a purchase order", each with instructions written for a person, and errors that say what to do next.

```text
   DESIGNED FOR PROGRAMS                        DESIGNED FOR AN AGENT
   GET /v2/inv/items?f=sku&q=SAW-3              check_stock(sku)
   GET /v2/inv/items (all 40,000 rows)          search_products(query, limit=10)
   POST /v2/po {..42 fields..}                  create_purchase_order(sku, quantity, priority)
   error: 422 E_INV_SKU                         error: "No product with code SAW3. Codes look like SAW-3;
                                                        use search_products to find one."
```

Programs are told exactly which endpoint to call; agents have to choose. Every tool definition is part of the agent's prompt, read on every turn, and every result lands in its context. Good tools make the right choice obvious, the right call easy, and the result compact.

### What a well-designed tool has

| Property | Why it matters to an agent |
|---|---|
| A clear, distinct name | The model chooses by name and description |
| A description written like documentation for a new colleague | It is the instruction for when and how to use the tool |
| The right granularity | Too fine means many calls; too coarse means confusing parameters |
| Compact, relevant output | Results fill the context and are resent every turn |
| Helpful errors | The agent can correct itself instead of guessing |
| Safe execution | Arguments come from a model and must be treated as untrusted |

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Tool use across providers

Every major model provider supports tool use with the same underlying idea and slightly different shapes:

| Concept | Anthropic Messages API | OpenAI function calling |
|---|---|---|
| Tool definition | `{name, description, input_schema}` | `{type: "function", function: {name, description, parameters}}` |
| Schema | JSON Schema in `input_schema` | JSON Schema in `parameters` |
| Strict arguments | `strict: true` on the tool | `strict: true` on the function |
| Model's call | `tool_use` content block with `id`, `name`, `input` | a tool call with an id, a function name, and arguments |
| Result | `tool_result` block with `tool_use_id` | a tool message referencing the call id |

Because the schema is plain JSON Schema in both, a tool written once can be converted mechanically between formats. Keeping a single source definition and converting it at the edge avoids two copies drifting apart. Frameworks and the Model Context Protocol, Module 8.6, take the same approach.

### Choosing what to build

Anthropic's article recommends building a few thoughtful tools targeting specific high-impact workflows rather than wrapping every API endpoint, and gives an example: instead of a `list_contacts` tool that returns everyone, provide `search_contacts` or `message_contact`. Tools can **consolidate** several operations: one call that looks up a customer and returns their recent orders saves the agent two calls and the reasoning between them.

The trade-off is granularity:

| Too fine | Right-sized | Too coarse |
|---|---|---|
| `get_item`, `get_price`, `get_stock` for one product | `check_product(sku)` returning name, price, stock | `manage_inventory(action, options)` with a dozen modes |
| Many calls, many turns | One call for the common question | Confusing parameters, more errors |

### Names, namespaces, and confusable tools

When an agent has many tools, especially from several systems, names must make boundaries clear. The same article describes **namespacing**, grouping tools under common prefixes by service or resource, for example `asana_search` and `jira_search`, and notes that the choice of naming scheme measurably affects tool-use performance.

A related problem is **confusable tools**: two tools whose descriptions overlap so much that the model cannot tell when to use which, such as `get_stock` and `check_inventory`. A simple check measures the overlap of the meaningful words in two descriptions with the **Jaccard similarity**,

$$J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$

where $A$ and $B$ are the sets of words. A high score flags a pair for a person to merge, rename, or rewrite with distinguishing details ("use for current shelf stock" versus "use for stock arriving from suppliers").

### Descriptions as prompts

A tool description is prompt text, and Module 5.13 showed how to write it: what the tool does, when to use it and when not to, what each argument means with an example, what it returns, and any side effects. Anthropic's article stresses describing tools as you would to a new team member, making implicit context explicit, and using unambiguous parameter names, `user_id` rather than `user`. Small refinements to descriptions produced large improvements in its evaluations.

### Output: context-efficient by design

Tool results enter the context and, as Module 8.1 showed, are resent on every later turn. Anthropic's article recommends pagination, range selection, filtering, or truncation with sensible defaults for any tool response that could be large, and notes that Claude Code restricts tool responses to 25,000 tokens by default. When output is truncated, the result should say so and suggest a narrower query, steering the agent towards efficient behaviour.

### Errors that teach

The same article recommends error responses that clearly communicate specific and actionable improvements, rather than opaque error codes or tracebacks. Compare:

| Unhelpful | Helpful |
|---|---|
| `KeyError: 'SAW3'` | "No product with code SAW3. Codes look like SAW-3; use search_products to find one." |
| `422` | "quantity must be between 1 and 500; you sent 900." |
| `Timeout` | "The supplier system did not respond within 10 seconds. Try again shortly, or use cached_stock for an estimate." |

A helpful error often turns a failed step into a corrected one on the next turn, instead of a stuck loop.

### Timeouts

Tools call slow things: supplier APIs, databases, web pages. A tool that hangs stalls the whole agent. Every tool call needs a **timeout**, after which the agent receives an error it can act on. In Python, running the tool in a worker thread and waiting for its result with a time limit, through the standard library's `concurrent.futures`, gives a simple timeout. One caveat: a thread cannot be forcibly stopped, so the timed-out work may continue in the background; for work that must truly stop, run it in a separate process or a service with its own timeout.

### Safe execution: untrusted arguments

Arguments come from a model, and a model can be manipulated by text it reads, the prompt injection problem Module 8.14 covers. So tool arguments are **untrusted input**, like data from a web form. For ordinary tools, schema validation and business checks handle this. For tools that execute commands or code, the stakes are higher: Anthropic's tool-use guidance for its bash tool says commands are untrusted model output, to be run in an isolated environment with an **allowlist** of permitted executables, shell operators such as `&&`, `|`, `;`, backticks, and `$()` rejected, timeouts and resource limits set, and every command logged; it adds that a blocklist is not sufficient.

An allowlist check parses the command without a shell, with Python's `shlex`, rejects any shell operator, accepts only listed programs and listed flags, and rejects paths that climb out of the working directory. Isolation, running the command in a container or sandbox with no network and no credentials, is the second layer, because no check is perfect.

### Idempotent actions

Agents retry. A model may call the same tool twice, a loop may re-run a step after a timeout, a checkpoint may be resumed. For read-only tools that is harmless; for actions it duplicates orders, emails, and payments. The defence is the idempotency key of Modules 7.6 and 7.14: derive a key from the tool name and its arguments, record each completed action in a ledger, and when the same key arrives again, return the recorded result without acting again. Where the downstream API supports idempotency keys, as payment APIs often do, pass the key through as well.

The key must be built from canonical arguments, with keys sorted, so that `{"sku": "SAW-3", "quantity": 10}` and `{"quantity": 10, "sku": "SAW-3"}` produce the same key. Whether two identical requests are really a duplicate is a business decision: two orders for 10 saws on different days may both be wanted, so ledgers often include a time window or a request ID.

### Complexity

Converting a definition is linear in its size. Checking tools pairwise for confusability is quadratic in the number of tools, fine for the dozens an agent has. A timeout adds constant overhead. Command checking is linear in the command length. Idempotency is a hash and a dictionary lookup.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, converting between provider formats.

```python
import hashlib
import json
import re
import shlex
import time
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FutureTimeout

def to_openai(tool):
    function = {"name": tool["name"], "description": tool["description"], "parameters": tool["input_schema"]}
    if tool.get("strict"):
        function["strict"] = True
    return {"type": "function", "function": function}

def to_anthropic(tool):
    function = tool["function"]
    converted = {"name": function["name"], "description": function["description"], "input_schema": function["parameters"]}
    if function.get("strict"):
        converted["strict"] = True
    return converted

CHECK = {"name": "check_stock", "description": "Look up units on hand for a product code.", "strict": True,
         "input_schema": {"type": "object", "properties": {"sku": {"type": "string", "description": "Product code, for example SAW-3"}},
                          "required": ["sku"], "additionalProperties": False}}
print(to_openai(CHECK))
print(to_anthropic(to_openai(CHECK)) == CHECK)
```

- **The schema moves unchanged; only the wrapping differs.** `input_schema` becomes `parameters` inside a `function` object with a `type` of "function".
- **The strict flag is carried across.** It is omitted when not set, rather than set to false, so the output matches the provider's defaults.
- **Converting there and back returns the original.** A round-trip test is the simplest guarantee that a converter loses nothing.

Next, finding confusable tools.

```python
WORD = re.compile(r"[a-z]+")
STOP = {"a", "an", "the", "of", "for", "to", "and", "or", "in", "on", "by", "with", "use", "this", "returns", "return"}

def words(text):
    return set(WORD.findall(text.lower())) - STOP

def confusable(tools, threshold=0.5):
    pairs = []
    for i in range(len(tools)):
        for j in range(i + 1, len(tools)):
            a, b = words(tools[i]["description"]), words(tools[j]["description"])
            score = len(a & b) / len(a | b) if a | b else 0
            if score >= threshold:
                pairs.append((tools[i]["name"], tools[j]["name"], round(score, 2)))
    return pairs

TOOLSET = [{"name": "get_stock", "description": "Get the stock level for a product."},
           {"name": "check_inventory", "description": "Check the stock level of a product."},
           {"name": "create_purchase_order", "description": "Create a purchase order with a supplier for a product."},
           {"name": "get_supplier", "description": "Get the supplier details for a product."}]
print(confusable(TOOLSET))
```

- **Descriptions are reduced to meaningful words.** Filler such as "the" and "for" is removed before comparing.
- **Every pair of tools is compared with the Jaccard similarity.** Shared words divided by all distinct words.
- **`get_stock` and `check_inventory` score 0.6 and are flagged.** They share "stock", "level", and "product" out of five distinct words; a model will struggle to choose between them.
- **The other pairs stay below the threshold.** "Product" alone is not enough to confuse tools that otherwise differ.
- **The fix is a person's decision.** Merge the two, or rewrite each description to say what makes it different.

Then, timeouts.

```python
POOL = ThreadPoolExecutor(max_workers=4)

def call_with_timeout(function, args, seconds):
    future = POOL.submit(function, **args)
    try:
        return {"ok": True, "result": future.result(timeout=seconds)}
    except FutureTimeout:
        return {"ok": False, "error": f"timed out after {seconds} seconds"}
    except Exception as error:
        return {"ok": False, "error": f"{type(error).__name__}: {error}"}

def slow(seconds):
    time.sleep(seconds)
    return "done"

print(call_with_timeout(slow, {"seconds": 0.01}, 0.5))
print(call_with_timeout(slow, {"seconds": 0.3}, 0.05))
print(call_with_timeout(lambda: 1 / 0, {}, 1))
```

- **The tool runs in a worker thread, and the caller waits at most the timeout.**
- **A fast call returns its result.**
- **A slow call returns an error the agent can act on.** The 0.3-second call is abandoned after 0.05 seconds; in production, the message would also suggest what to do next.
- **Exceptions become errors too.** Nothing escapes to crash the loop.
- **The abandoned work keeps running in its thread.** Threads cannot be killed; for work that must stop, use a separate process.

Then, allowlisting commands.

```python
OPERATORS = re.compile(r"[;&|`$<>]")

def safe_command(command, allowlist):
    if OPERATORS.search(command):
        return False, "shell operator"
    try:
        parts = shlex.split(command)
    except ValueError:
        return False, "unparseable"
    if not parts:
        return False, "empty"
    if parts[0] not in allowlist:
        return False, "not allowed: " + parts[0]
    for argument in parts[1:]:
        if argument.startswith("-") and argument not in allowlist[parts[0]]:
            return False, "flag not allowed: " + argument
        if ".." in argument or argument.startswith("/"):
            return False, "path not allowed: " + argument
    return True, parts

ALLOWLIST = {"ls": {"-l"}, "grep": {"-n", "-i"}, "wc": {"-l"}}
for command in ["ls -l reports", "grep -n SAW-3 stock.csv", "rm -rf /", "ls; rm stock.csv",
                "grep -n SAW ../secrets.env", "grep -r SAW .", "wc -l $(ls)", "grep -n 'unterminated"]:
    print(command, safe_command(command, ALLOWLIST))
```

- **Shell operators are rejected before anything else.** `;`, `&`, `|`, backticks, `$`, and redirections cannot chain or substitute commands.
- **The command is split by `shlex`, not run through a shell.** Quoting is handled correctly, and a broken quote is "unparseable".
- **Only listed programs run, with only listed flags.** `rm` is not allowed at all; `grep -r` is refused because recursive search was not permitted.
- **Paths that climb out or start at the root are rejected.** `../secrets.env` never reaches `grep`.
- **This is one layer.** The allowed commands should still run in an isolated environment, with a timeout and a log.

Finally, idempotent actions.

```python
def call_once(name, args, ledger, function):
    key = hashlib.sha256(json.dumps([name, args], sort_keys=True).encode()).hexdigest()[:16]
    if key in ledger:
        return ledger[key], True
    result = function(**args)
    ledger[key] = result
    return result, False

ledger, placed = {}, []
def purchase_order(sku, quantity):
    placed.append((sku, quantity))
    return f"PO-{len(placed):04d}"

print(call_once("create_purchase_order", {"sku": "SAW-3", "quantity": 10}, ledger, purchase_order))
print(call_once("create_purchase_order", {"quantity": 10, "sku": "SAW-3"}, ledger, purchase_order))
print(call_once("create_purchase_order", {"sku": "SAW-3", "quantity": 12}, ledger, purchase_order), placed)
```

- **The key is a hash of the tool name and canonical arguments.** Sorted keys make argument order irrelevant.
- **The first call places PO-0001.** It is recorded in the ledger.
- **The retry, with arguments in a different order, returns PO-0001 without placing another order.** The second value, True, says it was a repeat.
- **A different quantity is a different action.** PO-0002 is placed, and only two orders exist.
- **The ledger must be durable in production.** A dictionary in memory forgets on restart, the same lesson as Module 7.6.

**Complexity.** The converters are linear in the definition. `confusable` is quadratic in the number of tools times their description length. `call_with_timeout` adds constant overhead. `safe_command` is linear in the command. `call_once` hashes the arguments, linear in their size.

### A tool review checklist

```text
NEED          does an existing tool already do this? could two tools be consolidated?
NAME          verb_noun, namespaced if many systems: shop_check_stock, supplier_create_order
DESCRIPTION   written for a new colleague: when to use, when not, arguments with examples, returns, side effects
OVERLAP       Jaccard against every other description below 0.5, or a distinguishing sentence added
OUTPUT        bounded: limit, pagination, or truncation with a note and a narrower-query suggestion
ERRORS        specific, actionable, with an example of correct input
TIMEOUT       set, with a message saying what to try next
SAFETY        validation; commands allowlisted and sandboxed; no credentials in the sandbox
SIDE EFFECTS  idempotency key; approval where needed (Module 8.11)
```

### Read, compute, act: the safety ladder

| Tool kind | Minimum safeguards |
|---|---|
| Read | Validation, timeout, bounded output, access only to permitted data |
| Compute or execute | All of the above, plus allowlist, sandbox, resource limits, logging |
| Act | All of the above that apply, plus idempotency and, for consequential actions, human approval |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Wrapping every endpoint.** Fifty thin tools overwhelm the model. Build a few tools around real workflows.

**Two tools that sound the same.** The model picks one at random. Merge them or describe the difference.

**Names that hide meaning.** `proc_req` tells the model nothing. Use plain verb-noun names.

**Unbounded results.** A tool that returns every order fills the context. Default to a small limit with a way to ask for more.

**Silent truncation.** Cutting output without saying so leads the agent to conclusions from partial data. Say it was truncated.

**Tracebacks as errors.** `KeyError: 'SAW3'` is a clue, not an instruction. Write errors that say what to do.

**No timeouts.** One hanging supplier call stalls the agent indefinitely.

**Blocklists for commands.** There is always another dangerous command. Allowlist instead, and sandbox.

**Credentials inside the sandbox.** A command tool that can read environment variables can leak keys. Keep secrets out of the execution environment.

**Retrying actions blindly.** A retried purchase order is a second purchase order without an idempotency key.

**Maintaining two definitions for two providers.** They drift. Keep one source and convert.

**Never testing tools with the agent.** Anthropic's article recommends evaluating tools with realistic agent tasks and refining them from the transcripts; tools that look fine to people can confuse models.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Tool calling works the same way across providers, a JSON Schema definition, a structured call with an id, a result referencing it, with different wrappers, so a single source definition can be converted mechanically between formats. Tools for agents should be designed for a capable newcomer rather than a program: a few tools built around high-impact workflows, consolidating related operations, with clear verb-noun names, namespaces when there are many systems, and descriptions written as prompts that say when to use the tool, what its arguments mean with examples, what it returns, and its side effects. Confusable tools, detectable by the Jaccard similarity of their descriptions, should be merged or differentiated. Results should be context-efficient, with limits, pagination, or truncation that says so, and errors should be specific and actionable rather than tracebacks. At run time every tool needs validation and a timeout; tools that execute commands treat arguments as untrusted, parse without a shell, reject shell operators, allow only listed programs, flags, and paths, and run sandboxed without credentials; and action tools use idempotency keys built from canonical arguments, recorded in a durable ledger, so retries never repeat side effects.

**Question 1.** An agent has these tools: `get_order` ("Get an order by id"), `fetch_order_details` ("Fetch the details of an order by its id"), `list_all_orders` ("Return every order in the system"), and `update_order` ("Update an order", with a free-form `changes` object). Identify the design problems and propose a better toolset.

<details>
<summary>View Answer</summary>

`get_order` and `fetch_order_details` overlap almost completely: both take an order id and return the order, so the model will choose between them arbitrarily, and a confusability check at a threshold of 0.3 flags them at 0.33. `list_all_orders` returns everything, which could be thousands of orders, filling the context and costing tokens on every later turn, and the agent rarely needs all orders, it needs the ones matching some condition. `update_order` with a free-form `changes` object is too coarse: the model has to guess field names and formats, cannot see what is allowed, and a single tool can make any change, including risky ones such as altering prices or addresses, with no specific validation. A better set: one `get_order(order_id)` with a description saying it returns the order's status, items, totals, and shipping details, replacing both lookups; `search_orders(customer_email, status, date_from, date_to, limit=10)`, returning a compact summary of matching orders with pagination and a note when results are truncated; and specific action tools such as `update_shipping_address(order_id, address)` and `cancel_order(order_id, reason)`, each with a strict schema, validation, an idempotency key, and approval for consequential changes. Names could be namespaced, for example `shop_get_order`, if the agent also uses tools from other systems.

</details>

**Question 2.** For each command, state what `safe_command` with the lab's allowlist returns and why: (a) `wc -l stock.csv`; (b) `grep -i saw stock.csv && rm stock.csv`; (c) `ls -la`; (d) `grep -n SAW /etc/passwd`; (e) `python script.py`. Then explain why the check is not enough on its own.

<details>
<summary>View Answer</summary>

(a) Allowed: no shell operators, `wc` is listed, `-l` is an allowed flag for it, and `stock.csv` is a plain relative path, so it returns True with the parts `wc`, `-l`, `stock.csv`. (b) Refused as "shell operator": the `&` characters of `&&` are caught before parsing, so the attempt to chain a deletion never runs. (c) Refused as "flag not allowed: -la": `ls` is listed, but only with `-l`, and the combined flag `-la` is not in its allowed set; the allowlist is exact, which is deliberate. (d) Refused as "path not allowed: /etc/passwd": the argument starts with a slash, an absolute path outside the working directory. (e) Refused as "not allowed: python": arbitrary interpreters would let a model run any code, so they are not on the list. The check is not enough because no static check can anticipate everything: an allowed program might have dangerous options added later to the allowlist, a file inside the working directory might be a link pointing elsewhere, an allowed command might read sensitive files that happen to sit in the directory, and new bypasses are found over time. So allowed commands must still run in an isolated environment, a container or sandbox with no network access and no credentials, with timeouts and resource limits, and every command logged, as Anthropic's guidance for command tools advises.

</details>

**Question 3.** An agent places purchase orders through `call_once`. Describe what happens in each case and whether it is the desired behaviour: (a) the model calls `create_purchase_order` with SAW-3 and 10, the call times out after the supplier actually created the order, and the loop retries the same call; (b) the model legitimately needs a second order for SAW-3 and 10 a week later; (c) the agent restarts between the first call and a retry, with the ledger held in memory.

<details>
<summary>View Answer</summary>

(a) This depends on where the timeout happened. If the first call completed and its result was recorded in the ledger before the timeout was reported, the retry finds the key and returns the recorded result without placing another order, as desired. But if the supplier created the order and the call timed out before `call_once` recorded it, the ledger has no entry, and the retry creates a second order. That is the gap a downstream idempotency key closes: passing the same key to the supplier's API, if it supports one, lets the supplier recognise the retry and return the original order. Without that, the tool should check the supplier for a recent matching order before creating a new one. (b) The arguments are identical, so the key is identical and `call_once` returns the old result without ordering, which is wrong: a genuine new order is blocked as a duplicate. The fix is to include something that distinguishes genuine repeats from retries, such as a request id generated once per intended order, or a time window, so a week-later order gets a new key. (c) With an in-memory ledger, the restart erases it, and the retry after the restart creates a duplicate order. The ledger must be durable, a database table or the workflow tool's data store, written before the result is returned, ideally in the same transaction as recording the order, which is the lesson of Modules 7.6 and 7.14 applied to agent tools.

</details>

@@starter
"""
Lab: Convert Between Providers, Find Confusable Tools, Add Timeouts, Allowlist Commands, Make Actions Idempotent
Standard library only. No network calls. Complete the TODO in each step, then press "Run & Verify Step".
"""
import hashlib
import json
import re
import shlex
import time
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FutureTimeout

CHECK = {"name": "check_stock", "description": "Look up units on hand for a product code.", "strict": True,
         "input_schema": {"type": "object", "properties": {"sku": {"type": "string", "description": "Product code, for example SAW-3"}},
                          "required": ["sku"], "additionalProperties": False}}
WORD = re.compile(r"[a-z]+")
STOP = {"a", "an", "the", "of", "for", "to", "and", "or", "in", "on", "by", "with", "use", "this", "returns", "return"}
POOL = ThreadPoolExecutor(max_workers=4)
OPERATORS = re.compile(r"[;&|`$<>]")
ALLOWLIST = {"ls": {"-l"}, "grep": {"-n", "-i"}, "wc": {"-l"}}


def words(text):
    """Given: meaningful lower-case words of a description."""
    return set(WORD.findall(text.lower())) - STOP


# ---------------------------------------------------------------- Step 1
def to_openai(tool):
    """{"type": "function", "function": {"name", "description", "parameters": input_schema}} plus "strict": True inside
    function only when the tool has a true "strict"."""
    # TODO Step 1
    return None


def to_anthropic(tool):
    """The reverse: {"name", "description", "input_schema": parameters}, plus "strict": True only when set."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def confusable(tools, threshold=0.5):
    """For every pair (i < j), Jaccard = |A & B| / |A | B| of words(description) (0 if both empty). Return
    [(name_i, name_j, round(score, 2))] for pairs at or above threshold, in pair order."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def call_with_timeout(function, args, seconds):
    """Submit function(**args) to POOL; wait at most `seconds`. Success -> {"ok": True, "result"}; timeout ->
    {"ok": False, "error": "timed out after S seconds"}; exception -> {"ok": False, "error": "Type: message"}."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def safe_command(command, allowlist):
    """OPERATORS found -> (False, "shell operator"). shlex.split fails -> (False, "unparseable"). Empty -> (False, "empty").
    Program not in allowlist -> (False, "not allowed: PROG"). For each later argument: a flag (starts with "-") not in the
    program's set -> (False, "flag not allowed: ARG"); containing ".." or starting with "/" -> (False, "path not allowed:
    ARG"). Otherwise (True, parts)."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def call_once(name, args, ledger, function):
    """key = first 16 hex characters of sha256(json.dumps([name, args], sort_keys=True)). If the key is in the ledger,
    return (ledger[key], True). Otherwise run function(**args), store the result, and return (result, False)."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("openai :", to_openai(CHECK))
    print("command:", safe_command("ls -l reports", ALLOWLIST))

@@solution
"""
Lab solution: Convert Between Providers, Find Confusable Tools, Add Timeouts, Allowlist Commands, Make Actions Idempotent
Standard library only. No network calls.
"""
import hashlib
import json
import re
import shlex
import time
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FutureTimeout

CHECK = {"name": "check_stock", "description": "Look up units on hand for a product code.", "strict": True,
         "input_schema": {"type": "object", "properties": {"sku": {"type": "string", "description": "Product code, for example SAW-3"}},
                          "required": ["sku"], "additionalProperties": False}}
WORD = re.compile(r"[a-z]+")
STOP = {"a", "an", "the", "of", "for", "to", "and", "or", "in", "on", "by", "with", "use", "this", "returns", "return"}
POOL = ThreadPoolExecutor(max_workers=4)
OPERATORS = re.compile(r"[;&|`$<>]")
ALLOWLIST = {"ls": {"-l"}, "grep": {"-n", "-i"}, "wc": {"-l"}}


def words(text):
    """Given: meaningful lower-case words of a description."""
    return set(WORD.findall(text.lower())) - STOP


# ---------------------------------------------------------------- Step 1
def to_openai(tool):
    """One source definition, converted at the edge; the JSON Schema moves unchanged."""
    function = {"name": tool["name"], "description": tool["description"], "parameters": tool["input_schema"]}
    if tool.get("strict"):
        function["strict"] = True
    return {"type": "function", "function": function}


def to_anthropic(tool):
    """The reverse conversion; a round trip must return the original."""
    function = tool["function"]
    converted = {"name": function["name"], "description": function["description"], "input_schema": function["parameters"]}
    if function.get("strict"):
        converted["strict"] = True
    return converted


# ---------------------------------------------------------------- Step 2
def confusable(tools, threshold=0.5):
    """Overlapping descriptions make the model guess; flag them for a person to fix."""
    pairs = []
    for i in range(len(tools)):
        for j in range(i + 1, len(tools)):
            a, b = words(tools[i]["description"]), words(tools[j]["description"])
            score = len(a & b) / len(a | b) if a | b else 0
            if score >= threshold:
                pairs.append((tools[i]["name"], tools[j]["name"], round(score, 2)))
    return pairs


# ---------------------------------------------------------------- Step 3
def call_with_timeout(function, args, seconds):
    """A hanging tool must not stall the agent; note the abandoned thread keeps running."""
    future = POOL.submit(function, **args)
    try:
        return {"ok": True, "result": future.result(timeout=seconds)}
    except FutureTimeout:
        return {"ok": False, "error": f"timed out after {seconds} seconds"}
    except Exception as error:
        return {"ok": False, "error": f"{type(error).__name__}: {error}"}


# ---------------------------------------------------------------- Step 4
def safe_command(command, allowlist):
    """Commands are untrusted model output: allowlist, no shell operators, no escaping paths. Then sandbox."""
    if OPERATORS.search(command):
        return False, "shell operator"
    try:
        parts = shlex.split(command)
    except ValueError:
        return False, "unparseable"
    if not parts:
        return False, "empty"
    if parts[0] not in allowlist:
        return False, "not allowed: " + parts[0]
    for argument in parts[1:]:
        if argument.startswith("-") and argument not in allowlist[parts[0]]:
            return False, "flag not allowed: " + argument
        if ".." in argument or argument.startswith("/"):
            return False, "path not allowed: " + argument
    return True, parts


# ---------------------------------------------------------------- Step 5
def call_once(name, args, ledger, function):
    """Canonical arguments make the key; a repeat returns the recorded result instead of acting again."""
    key = hashlib.sha256(json.dumps([name, args], sort_keys=True).encode()).hexdigest()[:16]
    if key in ledger:
        return ledger[key], True
    result = function(**args)
    ledger[key] = result
    return result, False


if __name__ == "__main__":
    print(to_anthropic(to_openai(CHECK)) == CHECK)
    tools = [{"name": "get_order", "description": "Get an order by id"}, {"name": "fetch_order_details", "description": "Fetch the details of an order by its id"},
             {"name": "list_all_orders", "description": "Return every order in the system"}]
    print(confusable(tools))
    print(call_with_timeout(lambda seconds: time.sleep(seconds) or "done", {"seconds": 0.2}, 0.02))
    for command in ["wc -l stock.csv", "grep -i saw stock.csv && rm stock.csv", "ls -la", "grep -n SAW /etc/passwd", "python script.py"]:
        print(command, safe_command(command, ALLOWLIST))

@@step
{
  "stepNumber": 1,
  "title": "Convert definitions between providers",
  "instruction": "Implement to_openai(tool), wrapping the name, description, and input_schema as parameters inside a function object with type 'function', adding strict True inside the function only when the tool's strict is true. Then implement to_anthropic(tool), the reverse, producing name, description, and input_schema, with strict True only when set. Convert CHECK both ways and check the round trip. This is tool use across providers from Section 2. [MOD-8.5]",
  "hintConceptual": "The same recipe written on two restaurants' order forms: the ingredients and quantities are copied exactly; only the boxes they go in differ.",
  "hintSyntax": "function = {\"name\": tool[\"name\"], \"description\": tool[\"description\"], \"parameters\": tool[\"input_schema\"]}\nif tool.get(\"strict\"):\n    function[\"strict\"] = True\nreturn {\"type\": \"function\", \"function\": function}\n\n# to_anthropic\nfunction = tool[\"function\"]\nconverted = {\"name\": function[\"name\"], \"description\": function[\"description\"], \"input_schema\": function[\"parameters\"]}\nif function.get(\"strict\"):\n    converted[\"strict\"] = True\nreturn converted"
}
@@assert
_openai = to_openai(CHECK)
assert _openai == {"type": "function", "function": {"name": "check_stock", "description": "Look up units on hand for a product code.", "parameters": CHECK["input_schema"], "strict": True}}, f"The OpenAI shape, got {_openai}"
assert to_anthropic({"type": "function", "function": {"name": "check_stock", "description": "Look up units on hand for a product code.", "parameters": CHECK["input_schema"], "strict": True}}) == CHECK, "The reverse conversion"
_loose = {"name": "ping", "description": "Check the service.", "input_schema": {"type": "object", "properties": {}}}
assert "strict" not in to_openai(_loose)["function"] and to_anthropic(to_openai(_loose)) == _loose, "No strict flag unless set; round trips are exact"
print("Step 1 passed: the schema moves unchanged, and the round trip returns the original.")

@@step
{
  "stepNumber": 2,
  "title": "Flag confusable tools",
  "instruction": "Implement confusable(tools, threshold). For every pair of tools in order, compute the Jaccard similarity of the meaningful words of their descriptions, using the given words function: the size of the intersection divided by the size of the union, or 0 if both are empty. Return each pair at or above the threshold as the two names and the score rounded to 2 places. Check the shop's toolset and an order toolset. This is confusable tools from Section 2. [MOD-8.5]",
  "hintConceptual": "Two buttons on a control panel with nearly the same label will be pressed by mistake. Compare every pair of labels and flag the look-alikes.",
  "hintSyntax": "pairs = []\nfor i in range(len(tools)):\n    for j in range(i + 1, len(tools)):\n        a, b = words(tools[i][\"description\"]), words(tools[j][\"description\"])\n        score = len(a & b) / len(a | b) if a | b else 0\n        if score >= threshold:\n            pairs.append((tools[i][\"name\"], tools[j][\"name\"], round(score, 2)))\nreturn pairs"
}
@@assert
_toolset = [{"name": "get_stock", "description": "Get the stock level for a product."},
            {"name": "check_inventory", "description": "Check the stock level of a product."},
            {"name": "create_purchase_order", "description": "Create a purchase order with a supplier for a product."},
            {"name": "get_supplier", "description": "Get the supplier details for a product."}]
assert confusable(_toolset) == [("get_stock", "check_inventory", 0.6)], f"One confusable pair, got {confusable(_toolset)}"
_orders = [{"name": "get_order", "description": "Get an order by id"}, {"name": "fetch_order_details", "description": "Fetch the details of an order by its id"}, {"name": "list_all_orders", "description": "Return every order in the system"}]
assert confusable(_orders) == [] and confusable(_orders, threshold=0.3) == [("get_order", "fetch_order_details", 0.33)], "The first recall question: the lookups overlap at 0.33"
assert confusable(_toolset, threshold=0.3)[0] == ("get_stock", "check_inventory", 0.6) and len(confusable(_toolset, threshold=0.3)) > 1, "A lower threshold flags more"
assert confusable([{"name": "a", "description": "the"}, {"name": "b", "description": "of"}]) == [] and confusable([]) == [], "Empty word sets score zero"
print("Step 2 passed: get_stock and check_inventory overlap at 0.6.")

@@step
{
  "stepNumber": 3,
  "title": "Wrap tool calls in a timeout",
  "instruction": "Implement call_with_timeout(function, args, seconds). Submit the function with its arguments to POOL and wait for its result for at most the given seconds. Return ok True with the result on success; ok False with 'timed out after S seconds' on a timeout; and ok False with the exception's type, a colon and space, and its message on any other error. Time a fast call, a slow call, and a failing call. This is timeouts from Section 2. [MOD-8.5]",
  "hintConceptual": "Ringing a supplier with a kitchen timer running: if they answer in time, take the answer; if not, hang up and note that they did not answer.",
  "hintSyntax": "future = POOL.submit(function, **args)\ntry:\n    return {\"ok\": True, \"result\": future.result(timeout=seconds)}\nexcept FutureTimeout:\n    return {\"ok\": False, \"error\": f\"timed out after {seconds} seconds\"}\nexcept Exception as error:\n    return {\"ok\": False, \"error\": f\"{type(error).__name__}: {error}\"}"
}
@@assert
def _slow(seconds):
    time.sleep(seconds)
    return "done"
assert call_with_timeout(_slow, {"seconds": 0.01}, 1.0) == {"ok": True, "result": "done"}, "A fast call returns its result"
_start = time.time()
assert call_with_timeout(_slow, {"seconds": 0.5}, 0.05) == {"ok": False, "error": "timed out after 0.05 seconds"}, "A slow call times out"
assert time.time() - _start < 0.4, "The caller does not wait for the slow call to finish"
assert call_with_timeout(lambda: 1 / 0, {}, 1) == {"ok": False, "error": "ZeroDivisionError: division by zero"}, "Exceptions become errors"
assert call_with_timeout(lambda sku: {"sku": sku}, {"sku": "SAW-3"}, 1) == {"ok": True, "result": {"sku": "SAW-3"}}, "Arguments are passed by name"
print("Step 3 passed: the slow call is abandoned after 0.05 seconds with a usable error.")

@@step
{
  "stepNumber": 4,
  "title": "Allow only safe commands",
  "instruction": "Implement safe_command(command, allowlist). Reject any command containing a shell operator from OPERATORS. Split it with shlex.split, rejecting it as 'unparseable' if that fails and 'empty' if nothing remains. Reject a program not in the allowlist. For each later argument, reject a flag not in that program's allowed set, and reject any argument containing '..' or starting with '/'. Otherwise return True and the parts. Check the commands from Section 3 and the second recall question. This is safe execution from Section 2. [MOD-8.5]",
  "hintConceptual": "A doorman with a guest list: no one sneaks in hidden behind someone else, only named guests enter, each may bring only the items listed against their name, and nobody may wander off into the back rooms.",
  "hintSyntax": "if OPERATORS.search(command):\n    return False, \"shell operator\"\ntry:\n    parts = shlex.split(command)\nexcept ValueError:\n    return False, \"unparseable\"\nif not parts:\n    return False, \"empty\"\nif parts[0] not in allowlist:\n    return False, \"not allowed: \" + parts[0]\nfor argument in parts[1:]:\n    if argument.startswith(\"-\") and argument not in allowlist[parts[0]]:\n        return False, \"flag not allowed: \" + argument\n    if \"..\" in argument or argument.startswith(\"/\"):\n        return False, \"path not allowed: \" + argument\nreturn True, parts"
}
@@assert
assert safe_command("ls -l reports", ALLOWLIST) == (True, ["ls", "-l", "reports"]) and safe_command("grep -n SAW-3 stock.csv", ALLOWLIST) == (True, ["grep", "-n", "SAW-3", "stock.csv"]), "Allowed commands pass"
_refusals = {"rm -rf /": "not allowed: rm", "ls; rm stock.csv": "shell operator", "grep -n SAW ../secrets.env": "path not allowed: ../secrets.env",
             "grep -r SAW .": "flag not allowed: -r", "wc -l $(ls)": "shell operator", "grep -n 'unterminated": "unparseable", "   ": "empty",
             "grep -i saw stock.csv && rm stock.csv": "shell operator", "ls -la": "flag not allowed: -la", "grep -n SAW /etc/passwd": "path not allowed: /etc/passwd", "python script.py": "not allowed: python"}
for _command, _reason in _refusals.items():
    assert safe_command(_command, ALLOWLIST) == (False, _reason), f"{_command!r} should be refused as {_reason}, got {safe_command(_command, ALLOWLIST)}"
assert safe_command("grep -n 'tenon saw' stock.csv", ALLOWLIST) == (True, ["grep", "-n", "tenon saw", "stock.csv"]), "Quoted arguments are parsed, not run through a shell"
print("Step 4 passed: listed commands run; operators, unknown programs, flags, and escaping paths are refused.")

@@step
{
  "stepNumber": 5,
  "title": "Make an action idempotent",
  "instruction": "Implement call_once(name, args, ledger, function). Build the key as the first 16 hexadecimal characters of the SHA-256 of json.dumps of the name and arguments as a list, with sorted keys. If the key is in the ledger, return the stored result and True. Otherwise call the function with the arguments, store its result under the key, and return the result and False. Place an order, retry it with reordered arguments, and place a different one. This is idempotent actions from Section 2. [MOD-8.5]",
  "hintConceptual": "A numbered receipt book: before placing an order, look up the receipt for exactly this order; if it exists, hand back the same receipt instead of ordering again.",
  "hintSyntax": "key = hashlib.sha256(json.dumps([name, args], sort_keys=True).encode()).hexdigest()[:16]\nif key in ledger:\n    return ledger[key], True\nresult = function(**args)\nledger[key] = result\nreturn result, False"
}
@@assert
_ledger, _placed = {}, []
def _purchase(sku, quantity):
    _placed.append((sku, quantity))
    return f"PO-{len(_placed):04d}"
assert call_once("create_purchase_order", {"sku": "SAW-3", "quantity": 10}, _ledger, _purchase) == ("PO-0001", False), "The first call acts"
assert call_once("create_purchase_order", {"quantity": 10, "sku": "SAW-3"}, _ledger, _purchase) == ("PO-0001", True), "A retry with reordered arguments returns the recorded result"
assert call_once("create_purchase_order", {"sku": "SAW-3", "quantity": 12}, _ledger, _purchase) == ("PO-0002", False) and _placed == [("SAW-3", 10), ("SAW-3", 12)], "A different quantity is a different action; only two orders exist"
assert len(_ledger) == 2 and all(len(k) == 16 for k in _ledger), "Keys are 16 hexadecimal characters"
assert call_once("check_stock", {"sku": "SAW-3"}, {}, lambda sku: 0) == (0, False), "Any tool can be wrapped"
print("Step 5 passed: the retried order returns PO-0001 instead of placing a second one.")
