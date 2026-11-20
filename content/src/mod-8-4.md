@@meta
{
  "moduleId": "MOD-8.4",
  "slug": "mod-8-4",
  "unitId": "UNIT-8",
  "unitTitle": "Unit 8: Build Your Own AI Agents",
  "title": "Function Calling",
  "difficulty": "Intermediate",
  "estimatedMinutes": 95,
  "citations": [
    { "title": "Tool use with Claude", "source": "Claude Docs", "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview" },
    { "title": "Structured outputs", "source": "Claude Docs", "url": "https://platform.claude.com/docs/en/build-with-claude/structured-outputs" },
    { "title": "JSON Schema: Getting Started Step-By-Step", "source": "json-schema.org", "url": "https://json-schema.org/learn/getting-started-step-by-step" },
    { "title": "Toolformer: Language Models Can Teach Themselves to Use Tools", "source": "arXiv (Schick et al., 2023)", "url": "https://arxiv.org/abs/2302.04761" }
  ],
  "videoLibrary": [
    {
      "id": "VID-8.4-1",
      "title": "How does OpenAI Function Calling work?",
      "creator": "Learn Data with Mark",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=Qor2VZoBib0",
      "timingInstruction": "Watch after reading Section 1, to see the request and response shapes on another provider",
      "keyTakeaway": "Function calling works the same way across providers: a schema in, a structured call out, a result back."
    },
    {
      "id": "VID-8.4-2",
      "title": "What is JSON Schema",
      "creator": "Automation Step by Step",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=kK-_gL7Vsc0",
      "timingInstruction": "Watch before the JSON Schema part of Section 2 if schemas are new to you",
      "keyTakeaway": "Types, required fields, and constraints: the vocabulary every tool definition is written in."
    },
    {
      "id": "VID-8.4-3",
      "title": "LLM Function Calling - AI Tools Deep Dive",
      "creator": "Adam Lucek",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=gMeTK6zzaO4",
      "timingInstruction": "Watch after the lab, for a deeper look at parallel calls and error handling in practice",
      "keyTakeaway": "How models choose functions, how arguments are generated, and how results flow back into the conversation."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Define Tools, Validate Arguments, Read Calls, Return Results, Handle Stop Reasons",
    "context": "The tool shop's restock agent calls a stock lookup and a purchase-order function through a model API. You will write strict tool definitions with JSON Schema, validate the arguments the model produces before running anything, extract tool calls from a response, run parallel calls and return every result in one message with errors marked, and decide what the loop does for each stop reason.",
    "language": "python"
  }
}

@@reading
# Function Calling

Function calling, also called tool use or tool calling, is the mechanism that turns a language model from a text generator into the reasoning engine of an agent. The application describes some functions; the model, when it decides one is needed, returns a structured request to call it with particular arguments; the application runs the function and returns the result; the model continues. The model never executes anything itself. It only asks.

Module 8.3 described tools as an agent's hands and eyes. This chapter is about the precise mechanics: how a function is described with JSON Schema, what a call looks like when it comes back, how arguments are validated, how several calls in one response are handled, how errors are returned so the model can recover, and how to steer whether the model calls a tool at all. Modules 7.10 and 8.1 showed the request and the loop; this chapter fills in the tool-specific details, using Anthropic's Messages API as the worked example. Other providers use slightly different field names for the same ideas.

## 1. First-Principles Mental Model & Intuition

### A restaurant order slip

A waiter cannot cook, but can take an order. The kitchen gives the waiter a menu: each dish's name, what it is, and the choices that must be made, which side, how it should be cooked. The waiter writes an order slip in the kitchen's format, the kitchen cooks, and the dish comes back to the table with the slip's number on it, so it reaches the right diner.

```text
   APPLICATION                               MODEL
   tools: [ {name, description,               reads the conversation and the menu of tools
             input_schema} ]   ------------>
                                              decides: "I need check_stock for SAW-3 and CHI-6"
                               <------------  stop_reason: "tool_use"
                                              content: [ text,
                                                         tool_use {id: toolu_01, name: check_stock, input: {sku: SAW-3}},
                                                         tool_use {id: toolu_02, name: check_stock, input: {sku: CHI-6}} ]
   validate each input
   run each function
   reply with ONE user message:
     [ tool_result {tool_use_id: toolu_01, content: SAW-3 result},
       tool_result {tool_use_id: toolu_02, content: CHI-6 result} ]   ------------>
                                              continues, perhaps calls more tools, or answers
```

The menu is the tool definitions, the order slip is the `tool_use` block, the slip number is its `id`, and the dish arriving at the table is the `tool_result` that carries the same id back.

### The vocabulary

| Term | Meaning |
|---|---|
| Tool definition | Name, description, and input schema of a function the model may call |
| `input_schema` | A JSON Schema describing the arguments |
| `tool_use` block | The model's request: an id, a tool name, and input arguments |
| `tool_result` block | The application's reply: the matching `tool_use_id` and the content |
| `is_error` | Marks a result as a failure the model should react to |
| `tool_choice` | Steers whether and which tool is used |
| Parallel tool use | Several `tool_use` blocks in one response |

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Describing a function with JSON Schema

A tool definition has three parts. The **name** is what the model calls. The **description** tells the model what the tool does, when to use it, and what it returns, and is the single most important factor in whether the model uses the tool well; Module 8.5 is devoted to writing it. The **input schema** is a JSON Schema object, the standard Module 5.10 introduced, describing each argument:

```text
   {"name": "create_purchase_order",
    "description": "Create a purchase order with a supplier. Use only after checking stock. Returns the PO number.",
    "strict": true,
    "input_schema": {
        "type": "object",
        "properties": {
            "sku":      {"type": "string",  "description": "Product code, for example SAW-3"},
            "quantity": {"type": "integer", "description": "Units to order, 1 to 500", "minimum": 1, "maximum": 500},
            "priority": {"type": "string",  "description": "standard or express", "enum": ["standard", "express"]}},
        "required": ["sku", "quantity"],
        "additionalProperties": false}}
```

The schema vocabulary that matters most for tools:

| Keyword | Means |
|---|---|
| `type` | string, integer, number, boolean, array, object |
| `properties` | The arguments, each with its own schema and description |
| `required` | Which arguments must be present |
| `enum` | The only allowed values |
| `minimum`, `maximum` | Numeric bounds |
| `additionalProperties: false` | No arguments beyond those listed |

Every argument gets its own description, with an example where the format is not obvious. "Product code, for example SAW-3" prevents a model from passing "tenon saw".

### Strict mode

Models usually produce arguments that match the schema, but not always: a number as a string, a missing field, an invented extra argument. Anthropic's API offers **strict tool use**, set with `"strict": true` on the tool definition, which constrains generation so the input validates against the schema; the documentation requires `additionalProperties: false` and a `required` list for this. Other providers have equivalent options.

Strict mode guarantees the *shape*, not the *sense*: a valid quantity of 500 can still be a mistake, and a product code can be well formed and not exist. Validating in the application remains essential, and not every deployment can use strict mode. Validation is cheap, and it is the last line of defence before a function with real effects runs.

### Reading calls from a response

When the model wants tools, the response has `stop_reason` set to `tool_use`, and its `content` list contains `tool_use` blocks, possibly alongside text in which the model explains what it is doing. Each block has:

| Field | Purpose |
|---|---|
| `id` | A unique identifier, such as `toolu_01`, to be echoed back |
| `name` | Which tool |
| `input` | The arguments, already parsed as a JSON object |

The application iterates over the content, collects the `tool_use` blocks, and ignores the rest for execution purposes. Text blocks are not tool calls, however much they sound like one.

### Parallel calls

A single response may contain several `tool_use` blocks: "check stock for SAW-3 and CHI-6" becomes two calls at once. The application can run them concurrently if they are independent, and must then return **all** the results in **one** user message, one `tool_result` per call, each with the matching `tool_use_id`. Anthropic's tool-use guidance warns that splitting results across several messages teaches the model to stop making parallel calls. A failed call does not get dropped: it gets a result with `is_error` set, so every call has an answer.

Parallel calls save turns, and since Module 8.1 showed that turns drive quadratic context growth, fewer turns means substantially fewer tokens. Where calls must be sequential, for example "check stock, then order the shortfall", the model makes them across turns.

### Returning errors

When a tool fails, the result says so:

```text
   {"type": "tool_result", "tool_use_id": "toolu_03", "content": "Invalid input: quantity must be at most 500", "is_error": true}
```

The model reads the error and can try again with corrected arguments, choose another tool, or tell the user. Three kinds of error are worth distinguishing in the message:

| Kind | Example message | What the model can do |
|---|---|---|
| Invalid input | "quantity must be at most 500" | Fix the arguments |
| Not found | "No product with code PLN-9" | Ask, search, or choose another code |
| Unavailable | "Stock service timed out; try again shortly" | Retry or report |

A raw exception, such as `KeyError: 'PLN-9'`, is better than nothing but less useful than a message written for the model; Module 8.5 returns to this.

### Steering: tool_choice

The `tool_choice` parameter steers tool use:

| Value | Effect |
|---|---|
| `{"type": "auto"}` | The model decides whether to call a tool; the default when tools are given |
| `{"type": "any"}` | The model must call some tool |
| `{"type": "tool", "name": "check_stock"}` | The model must call this tool |
| `{"type": "none"}` | No tools this turn |

Any of them can add `"disable_parallel_tool_use": true` to allow at most one call per response. At the time of writing (November 2026), some of Anthropic's newest models reject the forcing options, `any` and `tool`, and the recommended approach for them is `auto`, an instruction in the prompt naming the tool to use, strict mode for valid arguments, and a check in code that a call was actually made, retrying if it was not. Checking the provider's current documentation for the model in use is part of the work.

### Stop reasons in a tool loop

The loop decides its next move from `stop_reason`, the field Module 7.10 introduced:

| `stop_reason` | Next move |
|---|---|
| `tool_use` | Run the calls, return the results, call the model again |
| `end_turn` | The model has answered; finish, unless a tool call was required and none was made |
| `max_tokens` | The response was cut off, possibly mid-call; raise the limit or fail the step |
| `pause_turn` | A long server-side step paused; send the conversation back to continue |
| `refusal` | The model declined; stop and route to a person |

### Complexity

Building a definition is linear in the number of arguments. Validation is linear in the arguments. Extracting calls is linear in the content blocks. Running calls is linear in the number of calls, plus each tool's own cost; concurrent execution reduces wall-clock time to roughly the slowest call.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, building strict tool definitions.

```python
import json

TYPES = {"string": str, "integer": int, "number": (int, float), "boolean": bool, "array": list, "object": dict}

def tool_schema(name, description, params):
    properties, required = {}, []
    for param in params:
        spec = {"type": param["type"], "description": param["description"]}
        for extra in ("enum", "minimum", "maximum"):
            if extra in param:
                spec[extra] = param[extra]
        properties[param["name"]] = spec
        if param.get("required", True):
            required.append(param["name"])
    return {"name": name, "description": description, "strict": True,
            "input_schema": {"type": "object", "properties": properties, "required": required, "additionalProperties": False}}

ORDER = tool_schema("create_purchase_order", "Create a purchase order with a supplier. Use only after checking stock. Returns the PO number.",
                    [{"name": "sku", "type": "string", "description": "Product code, for example SAW-3"},
                     {"name": "quantity", "type": "integer", "description": "Units to order, 1 to 500", "minimum": 1, "maximum": 500},
                     {"name": "priority", "type": "string", "description": "standard or express", "enum": ["standard", "express"], "required": False}])
CHECK = tool_schema("check_stock", "Look up units on hand for a product code. Returns the code and the number on hand.",
                    [{"name": "sku", "type": "string", "description": "Product code, for example SAW-3"}])
print(ORDER["input_schema"]["required"], ORDER["input_schema"]["properties"]["quantity"])
```

- **Each parameter becomes a property with a type and a description.** Optional constraints, `enum`, `minimum`, and `maximum`, are copied when given.
- **Parameters are required unless marked otherwise.** `priority` is optional, so `required` lists only `sku` and `quantity`.
- **`additionalProperties` is false and `strict` is true.** The model may not invent extra arguments, and the API can enforce the schema.
- **The descriptions carry the rules a model needs.** "Use only after checking stock" and the example product code are guidance in the place the model reads.

Next, validating arguments before running anything.

```python
def validate_args(schema, args):
    spec_all = schema["input_schema"]
    if not isinstance(args, dict):
        return ["input must be an object"]
    errors = [f"missing:{name}" for name in spec_all["required"] if name not in args]
    for key, value in args.items():
        if key not in spec_all["properties"]:
            if spec_all.get("additionalProperties") is False:
                errors.append(f"unexpected:{key}")
            continue
        spec = spec_all["properties"][key]
        not_bool = not isinstance(value, bool) if spec["type"] in ("integer", "number") else True
        if not (not_bool and isinstance(value, TYPES[spec["type"]])):
            errors.append(f"type:{key}")
            continue
        if "enum" in spec and value not in spec["enum"]:
            errors.append(f"enum:{key}")
        if "minimum" in spec and value < spec["minimum"]:
            errors.append(f"minimum:{key}")
        if "maximum" in spec and value > spec["maximum"]:
            errors.append(f"maximum:{key}")
    return errors

print(validate_args(ORDER, {"sku": "SAW-3", "quantity": 10}))
print(validate_args(ORDER, {"sku": "SAW-3", "quantity": "10", "priority": "urgent", "note": "rush"}))
print(validate_args(ORDER, {"quantity": 0}), validate_args(ORDER, {"sku": "SAW-3", "quantity": True}))
```

- **Missing required arguments are reported first.** A purchase order without a product code is refused.
- **Unexpected arguments are reported when the schema forbids them.** The model's invented "note" is caught.
- **Types are checked, with booleans excluded from numbers.** "10" as text and `True` as a quantity both fail, the trap from Module 7.5.
- **Constraints are checked only once the type is right.** An unknown priority and a quantity of 0 are each reported.
- **Valid input produces an empty list.** Only then does the function run.

Then, reading calls and returning results.

```python
RESPONSE = {"stop_reason": "tool_use", "content": [
    {"type": "text", "text": "I'll check both products."},
    {"type": "tool_use", "id": "toolu_01", "name": "check_stock", "input": {"sku": "SAW-3"}},
    {"type": "tool_use", "id": "toolu_02", "name": "check_stock", "input": {"sku": "CHI-6"}}]}

def tool_calls(response):
    return [(block["id"], block["name"], block["input"]) for block in response["content"] if block["type"] == "tool_use"]

STOCK = {"SAW-3": 0, "CHI-6": 5}
REGISTRY = {"check_stock": (CHECK, lambda sku: {"sku": sku, "on_hand": STOCK[sku]}),
            "create_purchase_order": (ORDER, lambda sku, quantity, priority="standard": f"PO-{sku}-{quantity}")}

def run_calls(calls, registry):
    results = []
    for call_id, name, args in calls:
        if name not in registry:
            results.append({"type": "tool_result", "tool_use_id": call_id, "content": f"Unknown tool {name}.", "is_error": True})
            continue
        schema, function = registry[name]
        errors = validate_args(schema, args)
        if errors:
            results.append({"type": "tool_result", "tool_use_id": call_id, "content": "Invalid input: " + ", ".join(errors), "is_error": True})
            continue
        try:
            results.append({"type": "tool_result", "tool_use_id": call_id, "content": json.dumps(function(**args))})
        except Exception as error:
            results.append({"type": "tool_result", "tool_use_id": call_id, "content": f"{type(error).__name__}: {error}", "is_error": True})
    return {"role": "user", "content": results}

print(tool_calls(RESPONSE))
print(run_calls(tool_calls(RESPONSE), REGISTRY))
print(run_calls([("toolu_03", "create_purchase_order", {"sku": "SAW-3", "quantity": 900}),
                 ("toolu_04", "check_stock", {"sku": "PLN-9"}), ("toolu_05", "refund", {})], REGISTRY))
```

- **Only `tool_use` blocks are calls.** The text block, "I'll check both products", is skipped.
- **Two parallel calls come back as two results in one user message.** Each result echoes its call's id, so the model can match them.
- **Every call gets a result, even when it fails.** An oversized quantity, an unknown product, and an unknown tool each produce a result with `is_error` set.
- **Validation errors are named.** "Invalid input: maximum:quantity" tells the model which constraint failed; a friendlier message is better still, as Section 2 shows.
- **Results are JSON text.** Structured data is easy for the model to read and for logs to search.

Finally, deciding the next move.

```python
def next_action(response, expected_tool=False):
    reason = response["stop_reason"]
    if reason == "tool_use":
        return "run_tools"
    if reason == "end_turn":
        return "retry_no_tool" if expected_tool and not tool_calls(response) else "finish"
    if reason == "max_tokens":
        return "raise_max_tokens"
    if reason == "refusal":
        return "stop_refused"
    if reason == "pause_turn":
        return "continue"
    return "unknown"

print(next_action(RESPONSE), next_action({"stop_reason": "end_turn", "content": [{"type": "text", "text": "Done."}]}))
print(next_action({"stop_reason": "end_turn", "content": []}, expected_tool=True), next_action({"stop_reason": "max_tokens", "content": []}))
```

- **Tool use means run the calls and continue the loop.**
- **End of turn means finish, unless a tool call was required and none came.** With `auto` steering, a model can answer without calling the tool it was told to use; the loop retries with a firmer instruction instead of accepting an unchecked answer.
- **A cut-off response is not finished.** A response stopped at `max_tokens` may contain half a tool call; the step needs a higher limit.
- **A refusal stops the run for a person to review.** Unknown reasons are surfaced, not silently ignored.

**Complexity.** `tool_schema` and `validate_args` are linear in the arguments. `tool_calls` is linear in the content blocks. `run_calls` is linear in the calls plus their own work. `next_action` is constant.

### A tool definition checklist

```text
NAME          verb_noun, unique, stable: check_stock, create_purchase_order
DESCRIPTION   what it does, when to use it, when not to, what it returns, side effects
ARGUMENTS     each with type and description; examples for formats; enums for fixed choices
CONSTRAINTS   minimum and maximum for numbers; required list; additionalProperties false
STRICT        strict: true where the model and account support it
VALIDATION    in code, before running, every time
ERRORS        is_error with a message the model can act on
IDS           every tool_use answered by exactly one tool_result with the same id, in one message
```

### Message sequence for one round

| Turn | Role | Content |
|---|---|---|
| 1 | user | "Check saws and chisels and order what is short." |
| 2 | assistant | text plus two `tool_use` blocks, stop_reason `tool_use` |
| 3 | user | two `tool_result` blocks with matching ids |
| 4 | assistant | `tool_use` for create_purchase_order, stop_reason `tool_use` |
| 5 | user | one `tool_result` with the PO number |
| 6 | assistant | final text, stop_reason `end_turn` |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Running unvalidated arguments.** Strict mode guarantees shape, not sense, and is not always available. Validate in code.

**Dropping failed calls.** A call with no result confuses the model and may be rejected by the API. Answer every call, with `is_error` if needed.

**Results in separate messages.** Splitting parallel results across messages discourages parallel calls. One message, all results.

**Mismatched ids.** A result with the wrong `tool_use_id` attaches to the wrong call. Echo the id exactly.

**Treating text as a call.** "I will now check the stock" in a text block is not a tool call. Only `tool_use` blocks run.

**Vague argument descriptions.** "sku: string" invites guesses. Give the format and an example.

**Numbers as strings and booleans as numbers.** The Module 7.5 traps apply to model-generated arguments too.

**Forcing a tool where the model rejects forcing.** Some current models refuse `any` and `tool`. Use `auto`, prompt for the tool, and check a call was made.

**Ignoring max_tokens stops.** A truncated response may hold an incomplete call. Do not run it.

**Huge results.** A tool returning thousands of rows fills the context. Return what the model needs, summarised, with a way to ask for more.

**Too many similar tools.** Overlapping tools make the model guess. Module 8.5 covers tool design.

**Side effects without approval.** Calling a purchase-order function is an action; Module 8.11 puts approval in front of it.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Function calling lets a model request that the application run a function: the application sends tool definitions, each with a name, a description, and an `input_schema` written in JSON Schema with types, descriptions, required fields, enums, numeric bounds, and `additionalProperties: false`; the model responds with `stop_reason` `tool_use` and `tool_use` blocks carrying an id, a tool name, and parsed input; the application validates the input, runs the function, and replies with `tool_result` blocks echoing each id, marking failures with `is_error` and a message the model can act on. Strict mode constrains arguments to the schema but does not make them sensible, so validation in code remains essential. Several calls in one response are parallel calls, run independently and answered together in a single user message, which saves turns and tokens. `tool_choice` steers use, `auto`, `any`, a named tool, or `none`, optionally disabling parallel calls; some current models reject forcing, so the robust pattern is `auto`, a prompt naming the tool, strict mode, and a check that a call was made. The loop's next move follows `stop_reason`: run tools, finish, raise the token limit, continue a paused turn, or stop on refusal.

**Question 1.** A model returns `{"sku": "saw", "quantity": "12", "rush": true}` for `create_purchase_order`. List what `validate_args` reports, what the tool result should contain, and two changes to the tool definition that would make this less likely.

<details>
<summary>View Answer</summary>

`validate_args` checks required arguments first: `sku` and `quantity` are both present, so nothing is missing. Then each argument: `sku` is a string, so its type passes, although "saw" is not a real product code, which the schema cannot detect; `quantity` is the text "12", not an integer, so it reports `type:quantity`; `rush` is not in the schema and `additionalProperties` is false, so it reports `unexpected:rush`. The tool result should not run the function, but return a result with the matching `tool_use_id`, `is_error` set to true, and content such as "Invalid input: type:quantity, unexpected:rush", or better, a friendlier explanation such as "quantity must be a whole number, not text; rush is not an option, use priority: express". When the model retries, the product code should then be checked by the function itself, which should return a clear "No product with code saw; use a code such as SAW-3" error. Changes to the definition: describe `sku` with its format and an example, "Product code, for example SAW-3; use check_stock to find codes", so the model passes a code rather than a name; and confirm that strict mode, already set on this tool, is supported by the model and account in use, because where it is unavailable the string quantity and the invented `rush` argument reach the application and only validation catches them. Mentioning in the description that urgent orders use `priority: express` also gives the model the right way to express what it wanted.

</details>

**Question 2.** A model asks for three tools in one response: `check_stock` for SAW-3, `check_stock` for PLN-9, which does not exist, and `create_purchase_order` with quantity 20. The developer runs the first and third, skips the second because it failed, and sends each result in its own user message. Identify the problems and describe the correct reply.

<details>
<summary>View Answer</summary>

There are three problems. First, the failed call is dropped: every `tool_use` must receive a `tool_result` with its id, so skipping one leaves the model with a call that was never answered, which confuses it and can be rejected by the API. The correct reply gives it a result with `is_error` true and a message such as "No product with code PLN-9", so the model can correct the code or ask. Second, sending each result in its own message breaks the protocol: results for parallel calls belong together in one user message, and Anthropic's guidance warns that splitting them teaches the model to stop making parallel calls. Third, running the purchase order in the same batch as the stock checks is risky: the order was presumably meant to follow from the stock levels, and an action with side effects should be validated, and in most designs approved, before it runs; arguably the model should not have requested it in parallel with the lookups it depends on, and the system prompt or tool description should say "Use only after checking stock". The correct reply is a single user message with three `tool_result` blocks, for toolu ids in the same order, two with content and one with `is_error`, and, if the order step requires approval, its result saying it is awaiting approval rather than silently placing it.

</details>

**Question 3.** An agent built on a model that rejects forced tool choice must always call `classify_ticket` before replying. Describe how to make this reliable, including what the loop does when the model answers without calling the tool, and what `next_action` returns in each case.

<details>
<summary>View Answer</summary>

Because forcing with `any` or a named tool returns an error on that model, the request uses `tool_choice` `auto`, and the system prompt states the rule explicitly: "Always call classify_ticket first, before writing any reply". The tool definition sets `strict: true`, so when the call is made its arguments match the schema. The tool's description says what it is for, so the model connects it with the instruction. The loop then checks the outcome in code. If the response's `stop_reason` is `tool_use` and it contains a `classify_ticket` call, `next_action` returns "run_tools", the call is validated and run, and the result is returned. If the model answers directly, with `stop_reason` `end_turn` and no tool calls, `next_action` with `expected_tool` set returns "retry_no_tool": the loop discards that answer and calls again, adding a short, firmer reminder, for example a user or system message saying the classification step is required, up to a small number of retries, after which the ticket is routed to a person. If the model makes a different tool call, the loop can return that call's result and repeat the reminder. This is the pattern the provider's guidance recommends for models without forcing: steer with the prompt, guarantee shape with strict mode, and verify in code that the required call happened.

</details>

@@starter
"""
Lab: Define Tools, Validate Arguments, Read Calls, Return Results, Handle Stop Reasons
Standard library only. No network calls: responses are recorded examples. Complete each TODO, then press "Run & Verify Step".
"""
import json

TYPES = {"string": str, "integer": int, "number": (int, float), "boolean": bool, "array": list, "object": dict}
STOCK = {"SAW-3": 0, "CHI-6": 5}
RESPONSE = {"stop_reason": "tool_use", "content": [
    {"type": "text", "text": "I'll check both products."},
    {"type": "tool_use", "id": "toolu_01", "name": "check_stock", "input": {"sku": "SAW-3"}},
    {"type": "tool_use", "id": "toolu_02", "name": "check_stock", "input": {"sku": "CHI-6"}}]}
ORDER = {"name": "create_purchase_order", "description": "Create a purchase order with a supplier. Use only after checking stock. Returns the PO number.", "strict": True,
         "input_schema": {"type": "object", "properties": {
             "sku": {"type": "string", "description": "Product code, for example SAW-3"},
             "quantity": {"type": "integer", "description": "Units to order, 1 to 500", "minimum": 1, "maximum": 500},
             "priority": {"type": "string", "description": "standard or express", "enum": ["standard", "express"]}},
             "required": ["sku", "quantity"], "additionalProperties": False}}
CHECK = {"name": "check_stock", "description": "Look up units on hand for a product code. Returns the code and the number on hand.", "strict": True,
         "input_schema": {"type": "object", "properties": {"sku": {"type": "string", "description": "Product code, for example SAW-3"}},
                          "required": ["sku"], "additionalProperties": False}}


# ---------------------------------------------------------------- Step 1
def tool_schema(name, description, params):
    """Each param: name, type, description, optional enum/minimum/maximum, optional required (default True).
    Return {"name", "description", "strict": True, "input_schema": {"type": "object", "properties": {name: {"type",
    "description", plus any of enum, minimum, maximum}}, "required": [names in order], "additionalProperties": False}}."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def validate_args(schema, args):
    """Not a dict -> ["input must be an object"]. Then "missing:NAME" for each required name absent (in required order);
    then for each argument in order: not in properties -> "unexpected:NAME" if additionalProperties is False; wrong type
    (TYPES; booleans never count as integer or number) -> "type:NAME" and skip its other checks; then "enum:NAME",
    "minimum:NAME", "maximum:NAME" as they apply. Return the list."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def tool_calls(response):
    """[(id, name, input)] for each content block whose type is "tool_use", in order."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def run_calls(calls, registry):
    """registry: name -> (schema, function). For each (id, name, args): unknown name -> result "Unknown tool NAME." with
    is_error; validate_args errors -> "Invalid input: " + errors joined by ", " with is_error; exception -> "Type: message"
    with is_error; success -> content json.dumps(result) without is_error. Each result is {"type": "tool_result",
    "tool_use_id": id, "content": text}. Return {"role": "user", "content": [all results]}."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def next_action(response, expected_tool=False):
    """stop_reason tool_use -> "run_tools"; end_turn -> "retry_no_tool" if expected_tool and there are no tool calls, else
    "finish"; max_tokens -> "raise_max_tokens"; refusal -> "stop_refused"; pause_turn -> "continue"; else "unknown"."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("calls :", tool_calls(RESPONSE))
    print("next  :", next_action(RESPONSE))

@@solution
"""
Lab solution: Define Tools, Validate Arguments, Read Calls, Return Results, Handle Stop Reasons
Standard library only. No network calls: responses are recorded examples.
"""
import json

TYPES = {"string": str, "integer": int, "number": (int, float), "boolean": bool, "array": list, "object": dict}
STOCK = {"SAW-3": 0, "CHI-6": 5}
RESPONSE = {"stop_reason": "tool_use", "content": [
    {"type": "text", "text": "I'll check both products."},
    {"type": "tool_use", "id": "toolu_01", "name": "check_stock", "input": {"sku": "SAW-3"}},
    {"type": "tool_use", "id": "toolu_02", "name": "check_stock", "input": {"sku": "CHI-6"}}]}
ORDER = {"name": "create_purchase_order", "description": "Create a purchase order with a supplier. Use only after checking stock. Returns the PO number.", "strict": True,
         "input_schema": {"type": "object", "properties": {
             "sku": {"type": "string", "description": "Product code, for example SAW-3"},
             "quantity": {"type": "integer", "description": "Units to order, 1 to 500", "minimum": 1, "maximum": 500},
             "priority": {"type": "string", "description": "standard or express", "enum": ["standard", "express"]}},
             "required": ["sku", "quantity"], "additionalProperties": False}}
CHECK = {"name": "check_stock", "description": "Look up units on hand for a product code. Returns the code and the number on hand.", "strict": True,
         "input_schema": {"type": "object", "properties": {"sku": {"type": "string", "description": "Product code, for example SAW-3"}},
                          "required": ["sku"], "additionalProperties": False}}


# ---------------------------------------------------------------- Step 1
def tool_schema(name, description, params):
    """A strict definition: typed, described arguments; required list; no extras."""
    properties, required = {}, []
    for param in params:
        spec = {"type": param["type"], "description": param["description"]}
        for extra in ("enum", "minimum", "maximum"):
            if extra in param:
                spec[extra] = param[extra]
        properties[param["name"]] = spec
        if param.get("required", True):
            required.append(param["name"])
    return {"name": name, "description": description, "strict": True,
            "input_schema": {"type": "object", "properties": properties, "required": required, "additionalProperties": False}}


# ---------------------------------------------------------------- Step 2
def validate_args(schema, args):
    """Strict mode guarantees shape where available; this check runs everywhere, every time."""
    spec_all = schema["input_schema"]
    if not isinstance(args, dict):
        return ["input must be an object"]
    errors = [f"missing:{name}" for name in spec_all["required"] if name not in args]
    for key, value in args.items():
        if key not in spec_all["properties"]:
            if spec_all.get("additionalProperties") is False:
                errors.append(f"unexpected:{key}")
            continue
        spec = spec_all["properties"][key]
        not_bool = not isinstance(value, bool) if spec["type"] in ("integer", "number") else True
        if not (not_bool and isinstance(value, TYPES[spec["type"]])):
            errors.append(f"type:{key}")
            continue
        if "enum" in spec and value not in spec["enum"]:
            errors.append(f"enum:{key}")
        if "minimum" in spec and value < spec["minimum"]:
            errors.append(f"minimum:{key}")
        if "maximum" in spec and value > spec["maximum"]:
            errors.append(f"maximum:{key}")
    return errors


# ---------------------------------------------------------------- Step 3
def tool_calls(response):
    """Only tool_use blocks are calls; text that sounds like a call is not one."""
    return [(block["id"], block["name"], block["input"]) for block in response["content"] if block["type"] == "tool_use"]


# ---------------------------------------------------------------- Step 4
def run_calls(calls, registry):
    """Every call answered, errors marked, all results in one user message."""
    results = []
    for call_id, name, args in calls:
        if name not in registry:
            results.append({"type": "tool_result", "tool_use_id": call_id, "content": f"Unknown tool {name}.", "is_error": True})
            continue
        schema, function = registry[name]
        errors = validate_args(schema, args)
        if errors:
            results.append({"type": "tool_result", "tool_use_id": call_id, "content": "Invalid input: " + ", ".join(errors), "is_error": True})
            continue
        try:
            results.append({"type": "tool_result", "tool_use_id": call_id, "content": json.dumps(function(**args))})
        except Exception as error:
            results.append({"type": "tool_result", "tool_use_id": call_id, "content": f"{type(error).__name__}: {error}", "is_error": True})
    return {"role": "user", "content": results}


# ---------------------------------------------------------------- Step 5
def next_action(response, expected_tool=False):
    """The loop follows stop_reason, and verifies a required call actually happened."""
    reason = response["stop_reason"]
    if reason == "tool_use":
        return "run_tools"
    if reason == "end_turn":
        return "retry_no_tool" if expected_tool and not tool_calls(response) else "finish"
    if reason == "max_tokens":
        return "raise_max_tokens"
    if reason == "refusal":
        return "stop_refused"
    if reason == "pause_turn":
        return "continue"
    return "unknown"


if __name__ == "__main__":
    print(validate_args(ORDER, {"sku": "saw", "quantity": "12", "rush": True}))
    registry = {"check_stock": (CHECK, lambda sku: {"sku": sku, "on_hand": STOCK[sku]}),
                "create_purchase_order": (ORDER, lambda sku, quantity, priority="standard": f"PO-{sku}-{quantity}")}
    print(run_calls(tool_calls(RESPONSE), registry))
    print(run_calls([("toolu_03", "check_stock", {"sku": "PLN-9"})], registry))
    print(next_action({"stop_reason": "end_turn", "content": [{"type": "text", "text": "Hello"}]}, expected_tool=True))

@@step
{
  "stepNumber": 1,
  "title": "Write a strict tool definition",
  "instruction": "Implement tool_schema(name, description, params). For each parameter build a property with its type and description, copying enum, minimum, and maximum when present, and add its name to the required list unless it is marked required False. Return a definition with the name, the description, strict True, and an input_schema of type object with the properties, the required list, and additionalProperties False. Build the purchase-order and stock-check tools and compare them with ORDER and CHECK. This is describing a function from Section 2. [MOD-8.4]",
  "hintConceptual": "Writing a dish on the menu: its name, what it is, and every choice the diner must make, with the options spelled out and nothing extra allowed on the order slip.",
  "hintSyntax": "properties, required = {}, []\nfor param in params:\n    spec = {\"type\": param[\"type\"], \"description\": param[\"description\"]}\n    for extra in (\"enum\", \"minimum\", \"maximum\"):\n        if extra in param:\n            spec[extra] = param[extra]\n    properties[param[\"name\"]] = spec\n    if param.get(\"required\", True):\n        required.append(param[\"name\"])\nreturn {\"name\": name, \"description\": description, \"strict\": True,\n        \"input_schema\": {\"type\": \"object\", \"properties\": properties, \"required\": required, \"additionalProperties\": False}}"
}
@@assert
_order = tool_schema("create_purchase_order", "Create a purchase order with a supplier. Use only after checking stock. Returns the PO number.",
                     [{"name": "sku", "type": "string", "description": "Product code, for example SAW-3"},
                      {"name": "quantity", "type": "integer", "description": "Units to order, 1 to 500", "minimum": 1, "maximum": 500},
                      {"name": "priority", "type": "string", "description": "standard or express", "enum": ["standard", "express"], "required": False}])
assert _order == ORDER, f"The purchase-order tool matches ORDER, got {_order}"
assert tool_schema("check_stock", "Look up units on hand for a product code. Returns the code and the number on hand.", [{"name": "sku", "type": "string", "description": "Product code, for example SAW-3"}]) == CHECK, "The stock tool matches CHECK"
assert tool_schema("ping", "Check the service is up.", []) == {"name": "ping", "description": "Check the service is up.", "strict": True, "input_schema": {"type": "object", "properties": {}, "required": [], "additionalProperties": False}}, "A tool with no arguments"
print("Step 1 passed: strict definitions with typed, described, bounded arguments.")

@@step
{
  "stepNumber": 2,
  "title": "Validate the model's arguments",
  "instruction": "Implement validate_args(schema, args). If args is not a dict, return ['input must be an object']. Report 'missing:' for each required argument that is absent, in the required list's order. Then, for each argument in order: if it is not a property, report 'unexpected:' when additional properties are forbidden; if its type is wrong, using TYPES and never accepting a boolean as an integer or number, report 'type:' and skip its other checks; otherwise report 'enum:', 'minimum:', and 'maximum:' as they apply. Return the errors. Validate good and bad purchase orders. This is validation from Section 2. [MOD-8.4]",
  "hintConceptual": "The kitchen checks each order slip before cooking: every required choice made, nothing ordered that is not on the menu, quantities written as numbers, and choices from the listed options only.",
  "hintSyntax": "spec_all = schema[\"input_schema\"]\nif not isinstance(args, dict):\n    return [\"input must be an object\"]\nerrors = [f\"missing:{name}\" for name in spec_all[\"required\"] if name not in args]\nfor key, value in args.items():\n    if key not in spec_all[\"properties\"]:\n        if spec_all.get(\"additionalProperties\") is False:\n            errors.append(f\"unexpected:{key}\")\n        continue\n    spec = spec_all[\"properties\"][key]\n    not_bool = not isinstance(value, bool) if spec[\"type\"] in (\"integer\", \"number\") else True\n    if not (not_bool and isinstance(value, TYPES[spec[\"type\"]])):\n        errors.append(f\"type:{key}\")\n        continue\n    if \"enum\" in spec and value not in spec[\"enum\"]:\n        errors.append(f\"enum:{key}\")\n    if \"minimum\" in spec and value < spec[\"minimum\"]:\n        errors.append(f\"minimum:{key}\")\n    if \"maximum\" in spec and value > spec[\"maximum\"]:\n        errors.append(f\"maximum:{key}\")\nreturn errors"
}
@@assert
assert validate_args(ORDER, {"sku": "SAW-3", "quantity": 10}) == [] and validate_args(ORDER, {"sku": "SAW-3", "quantity": 500, "priority": "express"}) == [], f"Valid orders pass, got {validate_args(ORDER, {'sku': 'SAW-3', 'quantity': 10})}"
assert validate_args(ORDER, {"sku": "SAW-3", "quantity": "10", "priority": "urgent", "note": "rush"}) == ["type:quantity", "enum:priority", "unexpected:note"], "Type, enum, and extra argument"
assert validate_args(ORDER, {"quantity": 0}) == ["missing:sku", "minimum:quantity"] and validate_args(ORDER, {"sku": "SAW-3", "quantity": 501}) == ["maximum:quantity"], "Missing and bounds"
assert validate_args(ORDER, {"sku": "SAW-3", "quantity": True}) == ["type:quantity"] and validate_args(ORDER, ["SAW-3", 10]) == ["input must be an object"], "Booleans are not integers; input must be an object"
assert validate_args(ORDER, {"sku": "saw", "quantity": "12", "rush": True}) == ["type:quantity", "unexpected:rush"], "The first recall question"
print("Step 2 passed: the string quantity, the unknown priority, and the invented note are all caught.")

@@step
{
  "stepNumber": 3,
  "title": "Read the calls from a response",
  "instruction": "Implement tool_calls(response). Return a list of id, name, and input for each content block whose type is tool_use, in order, ignoring every other kind of block. Read the two parallel stock checks from RESPONSE. This is reading calls from Section 2. [MOD-8.4]",
  "hintConceptual": "Sorting the order slips from the waiter's notebook: only the slips go to the kitchen, not the notes the waiter scribbled about the table.",
  "hintSyntax": "return [(block[\"id\"], block[\"name\"], block[\"input\"]) for block in response[\"content\"] if block[\"type\"] == \"tool_use\"]"
}
@@assert
assert tool_calls(RESPONSE) == [("toolu_01", "check_stock", {"sku": "SAW-3"}), ("toolu_02", "check_stock", {"sku": "CHI-6"})], f"Two parallel calls, got {tool_calls(RESPONSE)}"
assert tool_calls({"stop_reason": "end_turn", "content": [{"type": "text", "text": "I will now call check_stock."}]}) == [], "Text that sounds like a call is not one"
assert tool_calls({"content": []}) == [] and tool_calls({"content": [{"type": "thinking", "thinking": ""}, {"type": "tool_use", "id": "t", "name": "n", "input": {}}]}) == [("t", "n", {})], "Other block types are ignored"
print("Step 3 passed: two calls found, and the text block ignored.")

@@step
{
  "stepNumber": 4,
  "title": "Run calls and return every result",
  "instruction": "Implement run_calls(calls, registry), using validate_args from Step 2. The registry maps a tool name to its schema and function. For each call, produce one tool_result with the call's id: an unknown tool gives 'Unknown tool NAME.' with is_error; validation errors give 'Invalid input: ' and the errors joined by commas and spaces, with is_error; an exception gives its type and message with is_error; success gives the result as JSON text with no is_error key. Return a single user message holding all the results. Run the two stock checks, then three calls that fail in different ways. These are parallel calls and error returns from Section 2. [MOD-8.4]",
  "hintConceptual": "Every slip comes back from the kitchen with an answer pinned to it, the dish or a note saying why it could not be made, and they all go out to the table together.",
  "hintSyntax": "results = []\nfor call_id, name, args in calls:\n    if name not in registry:\n        results.append({\"type\": \"tool_result\", \"tool_use_id\": call_id, \"content\": f\"Unknown tool {name}.\", \"is_error\": True})\n        continue\n    schema, function = registry[name]\n    errors = validate_args(schema, args)\n    if errors:\n        results.append({\"type\": \"tool_result\", \"tool_use_id\": call_id, \"content\": \"Invalid input: \" + \", \".join(errors), \"is_error\": True})\n        continue\n    try:\n        results.append({\"type\": \"tool_result\", \"tool_use_id\": call_id, \"content\": json.dumps(function(**args))})\n    except Exception as error:\n        results.append({\"type\": \"tool_result\", \"tool_use_id\": call_id, \"content\": f\"{type(error).__name__}: {error}\", \"is_error\": True})\nreturn {\"role\": \"user\", \"content\": results}"
}
@@assert
_registry = {"check_stock": (CHECK, lambda sku: {"sku": sku, "on_hand": STOCK[sku]}),
             "create_purchase_order": (ORDER, lambda sku, quantity, priority="standard": f"PO-{sku}-{quantity}")}
_calls = [("toolu_01", "check_stock", {"sku": "SAW-3"}), ("toolu_02", "check_stock", {"sku": "CHI-6"})]
_reply = run_calls(_calls, _registry)
assert _reply == {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "toolu_01", "content": "{\"sku\": \"SAW-3\", \"on_hand\": 0}"},
                                              {"type": "tool_result", "tool_use_id": "toolu_02", "content": "{\"sku\": \"CHI-6\", \"on_hand\": 5}"}]}, f"Two results in one message, got {_reply}"
_bad = run_calls([("toolu_03", "create_purchase_order", {"sku": "SAW-3", "quantity": 900}), ("toolu_04", "check_stock", {"sku": "PLN-9"}), ("toolu_05", "refund", {})], _registry)
assert [(r["tool_use_id"], r["content"], r.get("is_error")) for r in _bad["content"]] == [("toolu_03", "Invalid input: maximum:quantity", True), ("toolu_04", "KeyError: 'PLN-9'", True), ("toolu_05", "Unknown tool refund.", True)], "Every failure is answered and marked"
_ran = []
run_calls([("t", "create_purchase_order", {"sku": "SAW-3"})], {"create_purchase_order": (ORDER, lambda **kw: _ran.append(kw))})
assert _ran == [] and run_calls([], _registry) == {"role": "user", "content": []}, "Invalid input never runs the function"
print("Step 4 passed: both stock checks answered together, and every failure is marked as an error.")

@@step
{
  "stepNumber": 5,
  "title": "Choose the next move from the stop reason",
  "instruction": "Implement next_action(response, expected_tool), using tool_calls from Step 3. Return 'run_tools' for tool_use. For end_turn return 'retry_no_tool' when a tool call was expected and the response has none, otherwise 'finish'. Return 'raise_max_tokens' for max_tokens, 'stop_refused' for refusal, 'continue' for pause_turn, and 'unknown' for anything else. Check each case. This is the stop-reason table from Section 2. [MOD-8.4]",
  "hintConceptual": "When the waiter comes back to the pass: an order slip means cook, a finished conversation means clear the table, unless the diner was supposed to order and did not, and a slip torn in half means ask again.",
  "hintSyntax": "reason = response[\"stop_reason\"]\nif reason == \"tool_use\":\n    return \"run_tools\"\nif reason == \"end_turn\":\n    return \"retry_no_tool\" if expected_tool and not tool_calls(response) else \"finish\"\nif reason == \"max_tokens\":\n    return \"raise_max_tokens\"\nif reason == \"refusal\":\n    return \"stop_refused\"\nif reason == \"pause_turn\":\n    return \"continue\"\nreturn \"unknown\""
}
@@assert
assert next_action(RESPONSE) == "run_tools" and next_action({"stop_reason": "end_turn", "content": [{"type": "text", "text": "Done."}]}) == "finish", "Run tools, or finish"
assert next_action({"stop_reason": "end_turn", "content": [{"type": "text", "text": "Hello"}]}, expected_tool=True) == "retry_no_tool", "A required call that did not happen is retried"
assert next_action({"stop_reason": "max_tokens", "content": []}) == "raise_max_tokens" and next_action({"stop_reason": "refusal", "content": []}) == "stop_refused", "Truncation and refusal"
assert next_action({"stop_reason": "pause_turn", "content": []}) == "continue" and next_action({"stop_reason": "something_new", "content": []}) == "unknown", "Paused turns continue; unknown reasons are surfaced"
print("Step 5 passed: tool use runs tools, and an answer without the required call is retried.")
