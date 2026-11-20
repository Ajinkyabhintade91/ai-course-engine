@@meta
{
  "moduleId": "MOD-7.5",
  "slug": "mod-7-5",
  "unitId": "UNIT-7",
  "unitTitle": "Unit 7: AI Automation Masterclass",
  "title": "JSON Fundamentals",
  "difficulty": "Foundational",
  "estimatedMinutes": 80,
  "citations": [
    { "title": "RFC 9535: JSONPath: Query Expressions for JSON", "source": "IETF", "url": "https://www.rfc-editor.org/rfc/rfc9535.html" },
    { "title": "RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format", "source": "IETF", "url": "https://www.rfc-editor.org/rfc/rfc8259" },
    { "title": "jq Manual", "source": "jq", "url": "https://jqlang.github.io/jq/manual/" },
    { "title": "JMESPath Specification", "source": "JMESPath", "url": "https://jmespath.org/specification.html" },
    { "title": "Data structure", "source": "n8n Docs", "url": "https://docs.n8n.io/data/data-structure/" }
  ],
  "videoLibrary": [
    {
      "id": "VID-7.5-1",
      "title": "Learn JSON - Full Crash Course for Beginners",
      "creator": "freeCodeCamp.org",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=GpOO5iKzOmY",
      "timingInstruction": "Watch first if JSON syntax is new to you, before Section 2",
      "keyTakeaway": "A full beginner course on JSON syntax and structure."
    },
    {
      "id": "VID-7.5-2",
      "title": "Master JSON & Data Transformation in 19 Minutes (Most Valuable n8n Skill)",
      "creator": "Michele Torti",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=FMP7Hegx1tk",
      "timingInstruction": "Watch after reading Section 2, to see nested JSON read and transformed in code",
      "keyTakeaway": "Transforming JSON data inside an automation tool."
    },
    {
      "id": "VID-7.5-3",
      "title": "Learn JSON: Everything you need to know in 12 minutes [Python & JavaScript examples included]",
      "creator": "Code First with Hala",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=j_qJUGnd_sc",
      "timingInstruction": "Watch after completing the lab, paying attention to how fields from one node are referenced in the next",
      "keyTakeaway": "Reading and writing JSON from Python and JavaScript."
    },
    {
      "id": "VID-7.5-4",
      "title": "Workflow Automation with n8n: Logic, Data & Error Handling",
      "creator": "LearnKartS",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/workflow-automation-n8n",
      "timingInstruction": "Take the module on data handling after this chapter",
      "keyTakeaway": "Covers the data side of workflows, JSON items, mapping, and transformation, inside a workflow tool."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Paths, Split Out, Map Fields, Check Types, and Diff",
    "context": "A shop's automations receive orders as nested JSON from its web store and must send flat rows to a spreadsheet and clean records to an accounting system. You will build a reader for path expressions, a step that turns one order into one row per item, a field mapper, a type checker for incoming data, and a diff that says what changed between two versions of a record.",
    "language": "python"
  }
}

@@reading
# JSON Fundamentals

Every step of an automation passes data to the next, and almost all of that data is JSON. A webhook's payload is JSON. An API's response is JSON. The items that flow between nodes in a workflow tool are JSON. A language model's structured output is JSON.

Module 5.10 covered the format itself: its six kinds of value, its strict syntax, parsing it safely, and putting it into prompts. This chapter is about working with it inside automations. That means reaching into nested data to get one field, reshaping it, so that one order becomes three spreadsheet rows, renaming and filling fields so that one system's output matches another's input, checking that incoming data has the shape you expect, and seeing what changed between two versions of a record.

## 1. First-Principles Mental Model & Intuition

### A filing cabinet with drawers inside drawers

Picture an order as a filing cabinet. The top drawer is labelled "customer". Inside it is a folder called "address", and inside that a card that says "city: Leeds". Another drawer, "items", holds a row of numbered folders, one per product.

To find the city, you say: cabinet, customer drawer, address folder, city card. To find the second product's name: cabinet, items drawer, folder number 1 (counting from zero), name card. That set of directions is a **path**, and almost every automation tool lets you write one to pick out a field.

```text
   {                                         $                        the whole order
     "id": "A1234",                          $.id                     "A1234"
     "customer": {                           $.customer               an object
       "name": "Priya Shah",                 $.customer.name          "Priya Shah"
       "address": {
         "city": "Leeds"                     $.customer.address.city  "Leeds"
       }
     },
     "items": [                              $.items                  an array
       {"sku": "HAM-1", "qty": 2},           $.items[0].sku           "HAM-1"
       {"sku": "SAW-3", "qty": 1},           $.items[*].qty           every item's qty
       {"sku": "CHI-6", "qty": 3}            $.items[-1].qty          the last item's qty
     ]
   }
```

### The three things automations do to JSON

| Operation | Example |
|---|---|
| **Read** a field | The customer's email, to send a confirmation |
| **Reshape** the data | One order with three items becomes three rows in a spreadsheet |
| **Check** the data | Is the total a number? Is the email present? |

Most bugs in automations are one of these done wrongly: a path that points at nothing, a reshape that loses a field, or a check that was never made.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Paths

A path is a sequence of steps from the top of a document to the values you want. A standard syntax for this, **JSONPath**, was published by the IETF as RFC 9535 in 2024, after years in which many tools used slightly different versions of it.

| Piece | Means | Example |
|---|---|---|
| `$` | The root: the whole document | `$` |
| `.name` | A member of an object | `$.customer` |
| `[n]` | An element of an array, counting from 0 | `$.items[0]` |
| `[-n]` | Counting from the end | `$.items[-1]` is the last |
| `[*]` or `.*` | Every element, or every member | `$.items[*].sku` |
| `..name` | Every member called `name`, at any depth | `$..sku` |

A path can return **zero, one, or many values**. `$.items[0].sku` returns one. `$.items[*].sku` returns one per item. `$.coupon`, on an order with no coupon, returns none. That last case is the source of a great deal of trouble: an automation that reads a missing field gets nothing, and passes nothing along, and the next step writes a blank, or fails, depending on the tool.

Workflow tools write paths in their own styles. n8n uses JavaScript-like expressions such as `{{ $json.customer.address.city }}`. Make lets you click fields in a panel, which inserts a reference. Zapier offers fields from earlier steps in a menu. Underneath, each is a path. Two further languages are worth knowing for heavier work: **JMESPath**, which several cloud tools use, and **jq**, a command-line program for filtering and transforming JSON that is the standard tool for exploring an API's response by hand.

### Arrays and items

The most important reshaping in automation is between **one record with a list inside it** and **many records**.

```text
   ONE ORDER, THREE ITEMS                      THREE ROWS
   {"id": "A1234",                             {"order_id": "A1234", "city": "Leeds", "sku": "HAM-1", "qty": 2}
    "city": "Leeds",            split out      {"order_id": "A1234", "city": "Leeds", "sku": "SAW-3", "qty": 1}
    "items": [3 items]}       ------------>    {"order_id": "A1234", "city": "Leeds", "sku": "CHI-6", "qty": 3}

                              <------------
                                aggregate
```

**Splitting out** turns each element of an array into its own record, copying across the parent fields each row needs, here the order ID and the city. Spreadsheets, databases, and accounting systems usually want one row per line item. **Aggregating** is the reverse: many records collected into one with a list.

This reshaping matters for two reasons. Downstream systems need the right shape, and, as Module 7.2 explained, a workflow step runs once per item. Splitting an order into three items means the next step runs three times, which is exactly right for "add a row per product" and exactly wrong for "send the customer a confirmation", which should run once per order.

### Mapping fields

Two systems rarely use the same names. The shop calls it `email`, the CRM calls it `Email Address`, the accounting system calls it `contact_email`. **Mapping** renames fields from one system's vocabulary to another's, and often supplies a default for any field the target requires that the source does not have.

A mapping is best written as data, a table from source names to target names, not scattered through a workflow's steps. Then when a field is renamed, there is one place to change it.

### Types

JSON has six kinds of value, and a system expecting one will misbehave when given another. The commonest mismatches in automation:

| Expected | Received | Typical cause |
|---|---|---|
| Number `42.5` | String `"42.5"` | A form or spreadsheet that stores everything as text |
| Boolean `true` | String `"true"` or `"yes"` | The same |
| String `"A1234"` | Number `1234` | An ID that happens to look numeric |
| A value | `null` or missing | An optional field left empty |
| An array | A single object | A source that returns a list only when there is more than one |

A check at the entry to an automation, for each field the workflow needs, catches these before they cause harm downstream. JSON Schema, introduced in Module 5.10, is the full standard for such checks. For most workflows, a simple list of required fields and their types catches the commonest problems.

One trap deserves its own mention. In many languages, including Python, `true` is also counted as the integer 1, so a naive check for "is this a number?" accepts `true`. A type check must test for booleans before numbers.

### What changed

Automations often need to know not just what a record is, but what changed: an order's status moved from paid to shipped, a customer's address changed, a field was removed. A **diff** compares two versions of a document and lists the differences by path.

| Change | Meaning |
|---|---|
| Added | The field exists in the new version only |
| Removed | The field exists in the old version only |
| Changed | The field exists in both with different values |

Diffs drive automations of the form "when the status changes, notify someone", and they are the quickest way to debug "it worked yesterday": compare yesterday's payload with today's.

### Transformation as a pipeline

Real reshaping is a sequence of small operations: pick fields, split arrays, rename, convert types, fill defaults, filter. Doing them as separate, named steps makes each one testable, and makes the overall transformation readable. A single enormous expression that does everything at once is fast to write and impossible to debug.

### Complexity

Reading a path visits only the nodes along it, though a wildcard visits every element at its level. Splitting out is linear in the number of items. A diff visits every field of both documents.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, reading paths.

```python
import json
import re

ORDER = {
    "id": "A1234",
    "customer": {"name": "Priya Shah", "email": "priya@example.com", "address": {"city": "Leeds", "postcode": "LS1 4AP"}},
    "items": [{"sku": "HAM-1", "name": "Claw hammer", "qty": 2, "price": 14.5},
              {"sku": "SAW-3", "name": "Tenon saw", "qty": 1, "price": 22.0},
              {"sku": "CHI-6", "name": "Bevel chisel", "qty": 3, "price": 11.0}],
    "paid": True, "notes": None,
}

TOKEN = re.compile(r"\.([A-Za-z_][A-Za-z0-9_]*)|\[(\*|-?\d+)\]")

def get_path(data, path):
    if not path.startswith("$"):
        raise ValueError("a path starts with $")
    current, rest, position = [data], path[1:], 0
    while position < len(rest):
        match = TOKEN.match(rest, position)
        if not match:
            raise ValueError("cannot read path at: " + rest[position:])
        name, index = match.groups()
        found = []
        for node in current:
            if name is not None:
                if isinstance(node, dict) and name in node:
                    found.append(node[name])
            elif index == "*":
                if isinstance(node, list):
                    found.extend(node)
                elif isinstance(node, dict):
                    found.extend(node.values())
            elif isinstance(node, list) and -len(node) <= int(index) < len(node):
                found.append(node[int(index)])
        current, position = found, match.end()
    return current

for path in ("$.customer.address.city", "$.items[0].sku", "$.items[-1].name", "$.items[*].qty", "$.coupon", "$.notes"):
    print(path, get_path(ORDER, path))
```

- **The path is read one step at a time.** A pattern recognises either a dot and a name, or square brackets with a star or a whole number.
- **The function always works on a list of current values.** It starts with the whole document, and each step replaces the list with what that step finds in each current value.
- **`$.customer.address.city` finds one value, "Leeds".**
- **`$.items[-1].name` counts from the end and finds "Bevel chisel".**
- **`$.items[*].qty` finds three values.** The star expands the array, and the next step reads `qty` from each element.
- **`$.coupon` finds nothing: an empty list.** The order has no coupon. A workflow must decide what to do with no value, because the next step will receive nothing.
- **`$.notes` finds one value, which is `null`.** "Present and empty" is different from "absent", and the result shows it: one value of None, not zero values.
- **The function implements a subset of RFC 9535.** It has no `.*` wildcard, no descendant search, and no filters, and it refuses what it cannot read instead of guessing.

Next, splitting an order into rows.

```python
def split_items(order, parent_fields):
    rows = []
    for item in order.get("items", []):
        row = {f"order_{name}": order.get(name) for name in parent_fields}
        row.update(item)
        row["line_total"] = round(item["qty"] * item["price"], 2)
        rows.append(row)
    return rows

rows = split_items(ORDER, ["id", "paid"])
for row in rows:
    print(row)
print(round(sum(row["line_total"] for row in rows), 2))
```

- **Each element of the items array becomes its own row.** Three items, three rows.
- **The parent fields each row needs are copied in, with a prefix.** Every row carries `order_id` and `order_paid`, so a spreadsheet row can be traced back to its order.
- **Each item's own fields follow, and a computed line total is added.** Two hammers at 14.50 is 29.00.
- **The line totals add up to 84.00.** A check like this, that the parts sum to the whole, is worth adding wherever a split happens.
- **The prefix avoids collisions.** Both the order and its items might have a field called `id`. Without a prefix, one would silently overwrite the other.
- **The next step now runs three times.** Right for adding rows, wrong for sending a confirmation, which belongs before the split.

Then, mapping and type checking.

```python
def map_fields(record, mapping, defaults=None):
    mapped = {mapping.get(name, name): value for name, value in record.items()}
    for name, value in (defaults or {}).items():
        mapped.setdefault(name, value)
    return mapped

TYPES = {"string": str, "integer": int, "number": (int, float), "boolean": bool, "null": type(None), "object": dict, "array": list}

def check_types(record, schema):
    problems = []
    for field, expected in schema.items():
        if field not in record:
            problems.append(f"missing:{field}")
            continue
        value, allowed = record[field], expected if isinstance(expected, list) else [expected]
        if isinstance(value, bool):
            ok = "boolean" in allowed
        else:
            ok = any(isinstance(value, TYPES[kind]) for kind in allowed if kind != "boolean")
        if not ok:
            problems.append(f"type:{field}")
    return problems

print(map_fields({"Email": "priya@example.com", "Name": "Priya Shah"}, {"Email": "contact_email", "Name": "contact_name"}, {"country": "GB"}))
SCHEMA = {"id": "string", "paid": "boolean", "notes": ["string", "null"], "items": "array", "total": "number"}
print(check_types(ORDER, SCHEMA))
print(check_types({"id": 1234, "paid": "yes", "notes": None, "items": [], "total": True}, SCHEMA))
```

- **`map_fields` renames by a table.** Fields not in the table keep their names. Defaults fill any field the target needs that is still missing, without overwriting one that is present.
- **The CRM's names replace the form's.** "Email" becomes "contact_email", and the country, which the form never asked for, is filled with "GB".
- **`check_types` reports missing fields and wrong types.** A field may allow more than one type: the notes can be a string or null.
- **The real order is missing a `total`.** The check catches it at the door.
- **The bad record fails three checks.** The ID is a number where a string was expected, "yes" is not a boolean, and `true` is not a number.
- **Booleans are tested first.** In Python, `True` counts as an integer. Without the separate test, `True` would pass as a number, which is the trap described in Section 2.

Finally, what changed.

```python
def diff(old, new, prefix="$"):
    changes = []
    for key in sorted(set(old) | set(new)):
        path = f"{prefix}.{key}"
        if key not in old:
            changes.append(("added", path))
        elif key not in new:
            changes.append(("removed", path))
        elif isinstance(old[key], dict) and isinstance(new[key], dict):
            changes += diff(old[key], new[key], path)
        elif old[key] != new[key]:
            changes.append(("changed", path))
    return changes

updated = json.loads(json.dumps(ORDER))
updated["customer"]["address"]["city"] = "York"
updated["paid"] = False
del updated["notes"]
updated["coupon"] = "SPRING"
print(diff(ORDER, updated))
```

- **`diff` walks the keys of both versions in sorted order.** Each key is added, removed, changed, or the same.
- **Nested objects are compared recursively.** The city change is reported with its full path, `$.customer.address.city`.
- **The copy is made by writing the order to JSON and reading it back.** That produces a completely separate document, so changing the copy does not change the original.
- **Four changes are found.** A coupon was added, the city changed, the notes were removed, and `paid` changed.
- **Arrays are compared as whole values.** If any item changed, the whole items list is reported as changed. Comparing array elements one by one needs a way to match them, by SKU for example, which is the key-based merge of Module 7.2.

**Complexity.** `get_path` is linear in the nodes it visits. `split_items` and `map_fields` are linear in their input. `check_types` is linear in the schema, and `diff` in the total size of both documents.

### Mapping a source to a target

```text
SOURCE        [system and event, e.g. web store, order.paid]
TARGET        [system and action, e.g. accounting, create invoice]

TARGET FIELD          FROM (path)                     TYPE      IF MISSING
invoice_number        $.id                            string    stop: required
customer_email        $.customer.email                string    stop: required
city                  $.customer.address.city         string    "unknown"
lines                 $.items[*]  (split out)         array     stop: required
line.amount           qty x price                     number    computed
paid                  $.paid                          boolean   false
```

### Debugging a field that comes through empty

| Check | How |
|---|---|
| Is the field in the payload at all? | Look at the raw JSON of a real run |
| Is the path right? | Count the levels. Arrays need an index or a star |
| Is it named exactly that? | Case and spelling: `Email` is not `email` |
| Is it null rather than absent? | Both look empty in many tools |
| Is it inside an array that was split? | After a split, the path to it changes |
| Did the source change its format? | Diff today's payload against an older one |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Paths that assume one element.** `$.items[0].sku` works for single-item orders, and silently ignores the second and third items of every other order. If the list can have several elements, handle all of them.

**Missing versus null.** A field that is absent and a field that is `null` look identical in many tool interfaces and behave differently in code. Decide which you expect and check for it.

**Numbers as strings.** A total of `"42.50"` sorts and adds as text. Spreadsheet and form sources are the usual culprits. Convert at the entry, once.

**IDs as numbers.** Order "00123" becomes 123 when something treats it as a number, and no longer matches. Keep identifiers as strings, as Module 5.10 advised.

**Splitting too early.** Splitting an order into items before the "send confirmation" step sends one email per item. Put once-per-order steps before the split, or aggregate back first.

**Field name collisions.** Copying parent fields into item rows can overwrite an item field of the same name. Prefix the parent's fields.

**Mappings buried in steps.** Field renames spread across a dozen steps are impossible to update when a system changes a name. Keep the mapping in one place.

**No check at the entry.** An automation that assumes the payload is well formed fails three steps later with a confusing error. Check the fields you need at the start, and stop with a clear message.

**Arrays that are sometimes objects.** Some sources return a list when there are several values and a single object when there is one. Normalise to a list before doing anything else.

**Dates as free text.** "03/04/2026" and "2026-04-03" are the same day in different orders. Insist on one format, ideally ISO 8601, at the entry.

**Large payloads passed everywhere.** Carrying a full API response through every step bloats logs and costs memory. Pick the fields you need early.

**No sample payloads saved.** When a source changes its format, the fastest diagnosis is a diff against a known good payload. Keep one.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Automations pass JSON between every step, and working with it means reading fields, reshaping data, checking it, and comparing versions. A path, standardised as JSONPath in RFC 9535, walks from the root `$` through member names, array indexes counting from zero or from the end, and wildcards, and can return zero, one, or many values, with "missing" and "null" being different results. The most common reshaping splits a record containing a list into one record per element, copying the parent fields each row needs under prefixed names, and aggregating does the reverse; since a step runs once per item, where the split happens decides how often later steps run. Mapping renames fields from one system's vocabulary to another's and fills required defaults, and is best kept as a single table. Type checks at the entry catch numbers stored as text, identifiers turned into numbers, missing fields, and booleans that some languages also count as numbers. A diff lists what was added, removed, and changed by path, which drives change-based automations and debugging. Transformations are clearest as a sequence of small named steps.

**Question 1.** Given an order with three items, what do these paths return: `$.items[1].qty`, `$.items[-1].sku`, `$.items[*].price`, `$.customer.phone` when the customer has no phone, and `$.notes` when notes is null? Which results would make a "send SMS to `$.customer.phone`" step misbehave, and how should the workflow handle it?

<details>
<summary>View Answer</summary>

`$.items[1].qty` returns one value: the quantity of the second item, since indexes count from zero. `$.items[-1].sku` returns one value: the SKU of the last item, here the third. `$.items[*].price` returns three values, one price per item. `$.customer.phone` returns nothing at all, an empty result, because the field is absent. `$.notes` returns one value, which is null: the field is present and empty. The SMS step is affected by the phone result. Given no value, different tools behave differently: some skip the step, some fail it, and some send the request with an empty phone number, which the SMS service then rejects, or worse, which reaches a default number configured somewhere. Each of those outcomes is a surprise in production. The workflow should handle it explicitly, before the SMS step: check whether the phone path returns a value, and branch. If there is a phone number, check its format and send. If not, take a defined alternative, such as sending an email instead, or recording that no SMS was possible, so the absence is visible. The same check should treat a null phone the same way as a missing one, since for this purpose both mean "no number".

</details>

**Question 2.** An order arrives with fields `id`, `customer_email`, and an `items` array of four products. The workflow splits the items out, adds a spreadsheet row for each, sends the customer a confirmation email, and posts the order to the accounting system. As built, the customer receives four emails and accounting receives four orders. Explain why, and how to restructure the workflow.

<details>
<summary>View Answer</summary>

After the split, the workflow carries four items instead of one order: each item is a separate record, with the parent fields copied in. Every step after the split runs once per item. Adding a spreadsheet row per product is meant to run four times, so it is right. Sending the confirmation and posting to accounting are meant to run once per order, but they come after the split and so also run four times: four emails, each probably mentioning one product, and four accounting entries, each perhaps for one line or each for the whole order, which would quadruple the revenue recorded. The fix is to put each step where its multiplicity is right. The order-level steps, sending the confirmation and posting to accounting, should run before the split, on the single order record, using the items array as it is. The item-level step, adding spreadsheet rows, runs after the split. If the order-level steps must come after something item-level, the items should be aggregated back into one record first. As a safeguard, the accounting post should carry the order ID as an idempotency key, or check for an existing entry, so that any duplicate run is rejected, and the confirmation step should be tested with a multi-item order, since a single-item test would not have revealed the problem.

</details>

**Question 3.** A form sends `{"qty": "3", "price": "11.00", "gift": "yes", "order_ref": 123}` and the target system expects qty as an integer, price as a number, gift as a boolean, and order_ref as a string matching orders like "000123". List the type problems, the risk each causes if not caught, and the conversions you would apply. Why should a check for "is a number" not accept `true`?

<details>
<summary>View Answer</summary>

There are four problems. The qty "3" is a string where an integer is expected. If not caught, it may be concatenated instead of added, so three plus one becomes "31", or rejected by the target. The fix is to convert it to the integer 3, and to reject the record if the text is not a whole number. The price "11.00" is a string where a number is expected. Sums and comparisons would treat it as text, so "11.00" sorts before "9.00". The fix is to convert it to a number, and for money preferably to an integer number of pence, 1100, as Module 5.10 advised, to avoid floating-point errors. The gift "yes" is a string where a boolean is expected. Some systems treat any non-empty string as true, so "no" would also count as true. The fix is an explicit mapping of the accepted words, yes, true, 1 to true and no, false, 0 to false, rejecting anything else. The order_ref 123 is a number where a string is expected, and the leading zeros of "000123" have already been lost, so it no longer matches the order it refers to. The fix is to treat identifiers as strings throughout, and here to restore the padding to the known width, "000123", only if the format is certain, ideally fixing the form so it sends a string in the first place. A "number" check should not accept true because in Python and several other languages the boolean true is also the integer 1. A check that only asks "is this an integer or float?" would let a gift flag, or any boolean, through as a quantity or price of 1, a silent and baffling error. The check must test for booleans first and reject them where a number is required.

</details>

@@starter
"""
Lab: Paths, Split Out, Map Fields, Check Types, and Diff
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import json
import re

ORDER = {
    "id": "A1234",
    "customer": {"name": "Priya Shah", "email": "priya@example.com", "address": {"city": "Leeds", "postcode": "LS1 4AP"}},
    "items": [{"sku": "HAM-1", "name": "Claw hammer", "qty": 2, "price": 14.5},
              {"sku": "SAW-3", "name": "Tenon saw", "qty": 1, "price": 22.0},
              {"sku": "CHI-6", "name": "Bevel chisel", "qty": 3, "price": 11.0}],
    "paid": True, "notes": None,
}

TOKEN = re.compile(r"\.([A-Za-z_][A-Za-z0-9_]*)|\[(\*|-?\d+)\]")

TYPES = {"string": str, "integer": int, "number": (int, float), "boolean": bool, "null": type(None), "object": dict, "array": list}


# ---------------------------------------------------------------- Step 1
def get_path(data, path):
    """A subset of JSONPath. The path must start with "$", or raise ValueError. Keep a list of
    current values, starting with [data]. Read the rest of the path with TOKEN.match(rest, pos):
        ".name"  -> for each current value that is a dict containing name, take value[name]
        "[*]"    -> for each list, take all its elements; for each dict, all its values
        "[n]"    -> for each list where -len <= n < len, take element n
    Anything TOKEN cannot match raises ValueError. Return the final list of values."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def split_items(order, parent_fields):
    """One row per element of order["items"] (none if there are no items). Each row is:
        {"order_" + name: order.get(name) for each name in parent_fields}
        then the item's own fields
        then "line_total": round(item["qty"] * item["price"], 2)
    Return the rows in order."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def map_fields(record, mapping, defaults=None):
    """Return a new dict where each field is renamed by `mapping` (fields not in the mapping
    keep their names). Then, for each (name, value) in defaults, add it only if the name is
    not already present. The record must not be modified."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def check_types(record, schema):
    """schema maps a field to a type name from TYPES, or a list of allowed type names.
    For each field, in schema order:
        "missing:" + field   if the field is not in the record
        "type:" + field      if its value has none of the allowed types
    A bool value matches only "boolean" (never "integer" or "number"); any other value matches
    a type if isinstance(value, TYPES[type]). Return the list of problems."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def diff(old, new, prefix="$"):
    """Compare two dicts. For each key in sorted(set(old) | set(new)), with path prefix + "." + key:
        only in new                      -> ("added", path)
        only in old                      -> ("removed", path)
        both dicts                       -> the changes found by diff(old[key], new[key], path)
        different values                 -> ("changed", path)
    Return the list of changes in that order."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("path :", get_path(ORDER, "$.items[*].qty"))
    print("split:", split_items(ORDER, ["id"]))
    print("map  :", map_fields({"Email": "a@b.c"}, {"Email": "contact_email"}, {"country": "GB"}))
    print("types:", check_types(ORDER, {"id": "string", "total": "number"}))
    print("diff :", diff({"a": 1, "b": 2}, {"a": 1, "b": 3, "c": 4}))

@@solution
"""
Lab solution: Paths, Split Out, Map Fields, Check Types, and Diff
Standard library only.
"""
import json
import re

ORDER = {
    "id": "A1234",
    "customer": {"name": "Priya Shah", "email": "priya@example.com", "address": {"city": "Leeds", "postcode": "LS1 4AP"}},
    "items": [{"sku": "HAM-1", "name": "Claw hammer", "qty": 2, "price": 14.5},
              {"sku": "SAW-3", "name": "Tenon saw", "qty": 1, "price": 22.0},
              {"sku": "CHI-6", "name": "Bevel chisel", "qty": 3, "price": 11.0}],
    "paid": True, "notes": None,
}

TOKEN = re.compile(r"\.([A-Za-z_][A-Za-z0-9_]*)|\[(\*|-?\d+)\]")

TYPES = {"string": str, "integer": int, "number": (int, float), "boolean": bool, "null": type(None), "object": dict, "array": list}


# ---------------------------------------------------------------- Step 1
def get_path(data, path):
    """A path can find zero, one, or many values, and 'absent' (no value) is different from
    'null' (one value that is None). A workflow must decide what to do with each."""
    if not path.startswith("$"):
        raise ValueError("a path starts with $")
    current, rest, position = [data], path[1:], 0
    while position < len(rest):
        match = TOKEN.match(rest, position)
        if not match:
            raise ValueError("cannot read path at: " + rest[position:])
        name, index = match.groups()
        found = []
        for node in current:
            if name is not None:
                if isinstance(node, dict) and name in node:
                    found.append(node[name])
            elif index == "*":
                if isinstance(node, list):
                    found.extend(node)
                elif isinstance(node, dict):
                    found.extend(node.values())
            elif isinstance(node, list) and -len(node) <= int(index) < len(node):
                found.append(node[int(index)])
        current, position = found, match.end()
    return current


# ---------------------------------------------------------------- Step 2
def split_items(order, parent_fields):
    """One record with a list becomes one record per element. Every later step then runs
    once per row, which is right for rows and wrong for anything once-per-order."""
    rows = []
    for item in order.get("items", []):
        row = {f"order_{name}": order.get(name) for name in parent_fields}
        row.update(item)
        row["line_total"] = round(item["qty"] * item["price"], 2)
        rows.append(row)
    return rows


# ---------------------------------------------------------------- Step 3
def map_fields(record, mapping, defaults=None):
    """The mapping is data, in one place, so a renamed field is changed once. Defaults fill
    what the target needs without overwriting what the source sent."""
    mapped = {mapping.get(name, name): value for name, value in record.items()}
    for name, value in (defaults or {}).items():
        mapped.setdefault(name, value)
    return mapped


# ---------------------------------------------------------------- Step 4
def check_types(record, schema):
    """Checked at the door, so that a bad payload stops with a clear message instead of
    failing three steps later. Booleans first: in Python, True is also an integer."""
    problems = []
    for field, expected in schema.items():
        if field not in record:
            problems.append(f"missing:{field}")
            continue
        value, allowed = record[field], expected if isinstance(expected, list) else [expected]
        if isinstance(value, bool):
            ok = "boolean" in allowed
        else:
            ok = any(isinstance(value, TYPES[kind]) for kind in allowed if kind != "boolean")
        if not ok:
            problems.append(f"type:{field}")
    return problems


# ---------------------------------------------------------------- Step 5
def diff(old, new, prefix="$"):
    """What changed, by path. It drives 'when the status changes' automations, and it is the
    fastest way to answer 'it worked yesterday'."""
    changes = []
    for key in sorted(set(old) | set(new)):
        path = f"{prefix}.{key}"
        if key not in old:
            changes.append(("added", path))
        elif key not in new:
            changes.append(("removed", path))
        elif isinstance(old[key], dict) and isinstance(new[key], dict):
            changes += diff(old[key], new[key], path)
        elif old[key] != new[key]:
            changes.append(("changed", path))
    return changes


if __name__ == "__main__":
    for path in ("$.customer.address.city", "$.items[0].sku", "$.items[-1].name", "$.items[*].qty", "$.coupon", "$.notes"):
        print(path, get_path(ORDER, path))

    rows = split_items(ORDER, ["id", "paid"])
    for row in rows:
        print(row)
    print(round(sum(row["line_total"] for row in rows), 2))

    print(map_fields({"Email": "priya@example.com", "Name": "Priya Shah"}, {"Email": "contact_email", "Name": "contact_name"}, {"country": "GB"}))
    schema = {"id": "string", "paid": "boolean", "notes": ["string", "null"], "items": "array", "total": "number"}
    print(check_types(ORDER, schema))
    print(check_types({"id": 1234, "paid": "yes", "notes": None, "items": [], "total": True}, schema))

    updated = json.loads(json.dumps(ORDER))
    updated["customer"]["address"]["city"] = "York"
    updated["paid"] = False
    del updated["notes"]
    updated["coupon"] = "SPRING"
    print(diff(ORDER, updated))
    print(check_types({"qty": "3", "price": "11.00", "gift": "yes", "order_ref": 123}, {"qty": "integer", "price": "number", "gift": "boolean", "order_ref": "string"}))

@@step
{
  "stepNumber": 1,
  "title": "Read values with a path",
  "instruction": "Implement get_path(data, path). If the path does not start with '$', raise ValueError. Keep a list of current values, starting with a list containing the whole document. Read the rest of the path piece by piece with TOKEN.match(rest, position); if nothing matches at the current position, raise ValueError. For a '.name' piece, collect value[name] from each current value that is a dict containing that name. For '[*]', collect every element of each current list and every value of each current dict. For '[n]', collect element n of each current list where n is between minus the length and the length minus one. Replace the current values with what was collected and continue after the match. Return the final list. Read the city, the first SKU, the last item's name, every quantity, a missing coupon, and the null notes. This is the path syntax from Section 2, a subset of RFC 9535. [MOD-7.5]",
  "hintConceptual": "Directions through a building: from the entrance, take the customer corridor, then the address room, then the city drawer. A star means 'every door on this corridor'. If a door does not exist, you come back empty-handed.",
  "hintSyntax": "if not path.startswith(\"$\"):\n    raise ValueError(\"a path starts with $\")\ncurrent, rest, position = [data], path[1:], 0\nwhile position < len(rest):\n    match = TOKEN.match(rest, position)\n    if not match:\n        raise ValueError(\"cannot read path at: \" + rest[position:])\n    name, index = match.groups()\n    found = []\n    for node in current:\n        if name is not None:\n            if isinstance(node, dict) and name in node:\n                found.append(node[name])\n        elif index == \"*\":\n            if isinstance(node, list):\n                found.extend(node)\n            elif isinstance(node, dict):\n                found.extend(node.values())\n        elif isinstance(node, list) and -len(node) <= int(index) < len(node):\n            found.append(node[int(index)])\n    current, position = found, match.end()\nreturn current"
}
@@assert
assert get_path(ORDER, "$.customer.address.city") == ["Leeds"], f"A nested field is one value, got {get_path(ORDER, '$.customer.address.city')}"
assert get_path(ORDER, "$.items[0].sku") == ["HAM-1"] and get_path(ORDER, "$.items[-1].name") == ["Bevel chisel"], "Indexes count from zero, and negative indexes from the end"
assert get_path(ORDER, "$.items[*].qty") == [2, 1, 3] and get_path(ORDER, "$.items[*].price") == [14.5, 22.0, 11.0], "A star expands the array"
assert get_path(ORDER, "$.coupon") == [] and get_path(ORDER, "$.items[9]") == [] and get_path(ORDER, "$.items[-4]") == [], "A missing field or an index out of range finds nothing"
assert get_path(ORDER, "$.notes") == [None], "A null field is one value, None, which is not the same as nothing"
assert get_path(ORDER, "$") == [ORDER] and get_path(ORDER, "$.customer.address[*]") == ["Leeds", "LS1 4AP"], "The root is the whole document, and a star on an object gives its values"
assert get_path(ORDER, "$.id.length") == [] and get_path(ORDER, "$.customer[0]") == [], "A name on a string, or an index on an object, finds nothing"
def _refuses(path):
    try:
        get_path(ORDER, path)
    except ValueError:
        return True
    return False
assert _refuses("customer.name") and _refuses("$..sku") and _refuses("$.items[a]"), "A path not starting with $, or with syntax this subset does not support, raises ValueError"
print("Step 1 passed: one city, three quantities, no coupon, and a null that is still one value.")

@@step
{
  "stepNumber": 2,
  "title": "Split an order into rows",
  "instruction": "Implement split_items(order, parent_fields). For each element of the order's 'items' list, or none if there is no such list, build a row: first a field 'order_' followed by each name in parent_fields, holding the order's value for that name, or None if absent; then all the item's own fields; then 'line_total', the item's qty times its price, rounded to 2 decimal places. Return the rows in order. Split ORDER with the parent fields 'id' and 'paid', and check that the line totals add up. This is the split-out reshaping from Section 2. [MOD-7.5]",
  "hintConceptual": "Tearing a multi-item receipt into one slip per item, and writing the receipt number and the date on every slip so that each can still be traced.",
  "hintSyntax": "rows = []\nfor item in order.get(\"items\", []):\n    row = {f\"order_{name}\": order.get(name) for name in parent_fields}\n    row.update(item)\n    row[\"line_total\"] = round(item[\"qty\"] * item[\"price\"], 2)\n    rows.append(row)\nreturn rows"
}
@@assert
_rows = split_items(ORDER, ["id", "paid"])
assert _rows is not None and len(_rows) == 3, f"Three items become three rows, got {_rows}"
assert _rows[0] == {"order_id": "A1234", "order_paid": True, "sku": "HAM-1", "name": "Claw hammer", "qty": 2, "price": 14.5, "line_total": 29.0}, "Parent fields are prefixed and come first, then the item, then the line total"
assert [row["line_total"] for row in _rows] == [29.0, 22.0, 33.0] and round(sum(row["line_total"] for row in _rows), 2) == 84.0, "The line totals add up to 84"
assert split_items(ORDER, ["coupon"])[0]["order_coupon"] is None, "A missing parent field is copied as None"
assert split_items({"id": "B1", "items": []}, ["id"]) == [] and split_items({"id": "B2"}, ["id"]) == [], "No items, no rows"
assert split_items({"id": "X", "items": [{"id": "line-1", "qty": 3, "price": 0.1}]}, ["id"]) == [{"order_id": "X", "id": "line-1", "qty": 3, "price": 0.1, "line_total": 0.3}], "The prefix stops the order's id overwriting the item's, and totals are rounded"
assert ORDER["items"][0] == {"sku": "HAM-1", "name": "Claw hammer", "qty": 2, "price": 14.5}, "The order itself is not modified"
print("Step 2 passed: one order becomes three traceable rows whose totals add up to 84.")

@@step
{
  "stepNumber": 3,
  "title": "Map fields between systems",
  "instruction": "Implement map_fields(record, mapping, defaults). Build a new dict in which each field of the record is renamed according to the mapping, keeping its own name if the mapping does not mention it. Then, for each name and value in defaults, if given, add it only if that name is not already present. Do not modify the record. Map a form submission to a CRM's field names, filling a country default. This is field mapping from Section 2. [MOD-7.5]",
  "hintConceptual": "Copying a form onto another company's form: same information, their box labels. Where their form has a box yours did not, fill in the agreed default, but never cross out something you already have.",
  "hintSyntax": "mapped = {mapping.get(name, name): value for name, value in record.items()}\nfor name, value in (defaults or {}).items():\n    mapped.setdefault(name, value)\nreturn mapped"
}
@@assert
_form = {"Email": "priya@example.com", "Name": "Priya Shah"}
assert map_fields(_form, {"Email": "contact_email", "Name": "contact_name"}, {"country": "GB"}) == {"contact_email": "priya@example.com", "contact_name": "Priya Shah", "country": "GB"}, f"Renamed, with a default added, got {map_fields(_form, {'Email': 'contact_email', 'Name': 'contact_name'}, {'country': 'GB'})}"
assert _form == {"Email": "priya@example.com", "Name": "Priya Shah"}, "The record is not modified"
assert map_fields({"qty": 1, "Email": "a"}, {"Email": "email"}) == {"qty": 1, "email": "a"}, "Fields not in the mapping keep their names, and defaults are optional"
assert map_fields({"country": "FR"}, {}, {"country": "GB"}) == {"country": "FR"}, "A default never overwrites a value that is present"
assert map_fields({"Country": "FR"}, {"Country": "country"}, {"country": "GB"}) == {"country": "FR"}, "Defaults are applied after renaming"
assert map_fields({}, {"a": "b"}, {"x": 0}) == {"x": 0}, "An empty record gets only the defaults"
print("Step 3 passed: the form's fields carry the CRM's names, and the missing country is filled.")

@@step
{
  "stepNumber": 4,
  "title": "Check the types at the door",
  "instruction": "Implement check_types(record, schema). The schema maps each field to a type name from TYPES, or to a list of allowed type names. For each field, in the schema's order, report 'missing:' and the field if the record lacks it. Otherwise, if the value is a boolean, it is acceptable only if 'boolean' is allowed; any other value is acceptable if it is an instance of any allowed type other than 'boolean'. If it is not acceptable, report 'type:' and the field. Return the problems. Check ORDER, then a record with a numeric ID, a 'yes' for a boolean, and true for a total. This is the type check from Section 2, including its trap: in Python, True is also an integer. [MOD-7.5]",
  "hintConceptual": "A clerk at the door checks that each box on the form has the right kind of answer: a date where a date belongs, a number where a number belongs, and does not accept a tick in the box for the number of children.",
  "hintSyntax": "problems = []\nfor field, expected in schema.items():\n    if field not in record:\n        problems.append(f\"missing:{field}\")\n        continue\n    value, allowed = record[field], expected if isinstance(expected, list) else [expected]\n    if isinstance(value, bool):\n        ok = \"boolean\" in allowed\n    else:\n        ok = any(isinstance(value, TYPES[kind]) for kind in allowed if kind != \"boolean\")\n    if not ok:\n        problems.append(f\"type:{field}\")\nreturn problems"
}
@@assert
_schema = {"id": "string", "paid": "boolean", "notes": ["string", "null"], "items": "array", "total": "number"}
assert check_types(ORDER, _schema) == ["missing:total"], f"The order lacks a total, got {check_types(ORDER, _schema)}"
assert check_types({"id": 1234, "paid": "yes", "notes": None, "items": [], "total": True}, _schema) == ["type:id", "type:paid", "type:total"], "A numeric id, a 'yes', and a boolean total are all wrong"
assert check_types({"total": 1}, {"total": "number"}) == [] and check_types({"total": 1.5}, {"total": "integer"}) == ["type:total"], "An integer is a number, and a float is not an integer"
assert check_types({"flag": True}, {"flag": "integer"}) == ["type:flag"] and check_types({"flag": False}, {"flag": ["integer", "number"]}) == ["type:flag"], "A boolean never counts as a number"
assert check_types({"notes": "x"}, {"notes": ["string", "null"]}) == [] and check_types({"notes": 3}, {"notes": ["string", "null"]}) == ["type:notes"], "A field may allow several types"
_converted = check_types({"qty": "3", "price": "11.00", "gift": "yes", "order_ref": 123}, {"qty": "integer", "price": "number", "gift": "boolean", "order_ref": "string"})
assert _converted == ["type:qty", "type:price", "type:gift", "type:order_ref"], "The form submission from the third recall question fails all four checks"
assert check_types({}, {}) == [] and check_types({"a": {}}, {"a": "object", "b": "array"}) == ["missing:b"], "Objects are recognised, and problems follow the schema's order"
print("Step 4 passed: the missing total is caught, and true is not accepted as a number.")

@@step
{
  "stepNumber": 5,
  "title": "Find what changed",
  "instruction": "Implement diff(old, new, prefix). Go through every key of either dict, in sorted order, with the path prefix followed by a full stop and the key. If the key is only in new, record ('added', path). If it is only in old, record ('removed', path). If both values are dicts, add the changes found by calling diff on them with this path as the prefix. Otherwise, if the values differ, record ('changed', path). Return the list of changes. Compare ORDER with a copy whose city, payment status, notes, and coupon have been changed. This is the diff from Section 2. [MOD-7.5]",
  "hintConceptual": "Spot the difference between two pictures: go over both systematically, noting what appeared, what vanished, and what looks different, and look inside every box rather than just at its lid.",
  "hintSyntax": "changes = []\nfor key in sorted(set(old) | set(new)):\n    path = f\"{prefix}.{key}\"\n    if key not in old:\n        changes.append((\"added\", path))\n    elif key not in new:\n        changes.append((\"removed\", path))\n    elif isinstance(old[key], dict) and isinstance(new[key], dict):\n        changes += diff(old[key], new[key], path)\n    elif old[key] != new[key]:\n        changes.append((\"changed\", path))\nreturn changes"
}
@@assert
_updated = json.loads(json.dumps(ORDER))
_updated["customer"]["address"]["city"] = "York"
_updated["paid"] = False
del _updated["notes"]
_updated["coupon"] = "SPRING"
assert diff(ORDER, _updated) == [("added", "$.coupon"), ("changed", "$.customer.address.city"), ("removed", "$.notes"), ("changed", "$.paid")], f"Four changes, with full paths, got {diff(ORDER, _updated)}"
assert ORDER["customer"]["address"]["city"] == "Leeds", "The original is untouched, because the copy was made through JSON"
assert diff(ORDER, json.loads(json.dumps(ORDER))) == [], "Identical documents have no differences"
_items = json.loads(json.dumps(ORDER))
_items["items"][1]["qty"] = 2
assert diff(ORDER, _items) == [("changed", "$.items")], "Arrays are compared as whole values"
assert diff({"a": {"b": 1}}, {"a": 5}) == [("changed", "$.a")] and diff({}, {"x": {"y": 1}}) == [("added", "$.x")], "A dict replaced by another type is a change, and a new nested object is one addition"
assert diff({"a": 1}, {"a": 1}, prefix="root") == [] and diff({"a": 1}, {"a": 2}, prefix="root") == [("changed", "root.a")], "The prefix is an argument"
print("Step 5 passed: a coupon added, the city changed, the notes removed, and the payment status changed.")
