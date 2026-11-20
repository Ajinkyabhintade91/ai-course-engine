@@meta
{
  "moduleId": "MOD-7.8",
  "slug": "mod-7-8",
  "unitId": "UNIT-7",
  "unitTitle": "Unit 7: AI Automation Masterclass",
  "title": "Make Introduction",
  "difficulty": "Intermediate",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "Operations", "source": "Make Help Center", "url": "https://help.make.com/operations" },
    { "title": "Introducing credits: new billing unit live in Make", "source": "Make Help Center", "url": "https://help.make.com/introducing-credits-new-billing-unit-live-in-make" },
    { "title": "Iterator", "source": "Make Help Center", "url": "https://help.make.com/iterator" },
    { "title": "Aggregator", "source": "Make Help Center", "url": "https://help.make.com/aggregator" },
    { "title": "Router", "source": "Make Help Center", "url": "https://help.make.com/router" },
    { "title": "Error handlers", "source": "Make Help Center", "url": "https://help.make.com/error-handlers" },
    { "title": "Retry error handler", "source": "Make Help Center", "url": "https://help.make.com/retry-error-handler" }
  ],
  "videoLibrary": [
    {
      "id": "VID-7.8-1",
      "title": "Make.com Automation Tutorial for Beginners",
      "creator": "Kevin Stratvert",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=JSA2oezQWOU",
      "timingInstruction": "Watch after reading Section 1, to see scenarios, modules, and the scenario builder",
      "keyTakeaway": "A beginner walkthrough of scenarios, modules, and runs in Make."
    },
    {
      "id": "VID-7.8-2",
      "title": "Understanding bundles",
      "creator": "Make",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=AVkENE-gHFs",
      "timingInstruction": "Watch after reading the bundles and operations part of Section 2, before the lab",
      "keyTakeaway": "Make's own explanation of bundles, the unit that multiplies operations through a scenario."
    },
    {
      "id": "VID-7.8-3",
      "title": "Generative AI Automation: Tools and Applications",
      "creator": "Edureka",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/generative-ai-automation-tools-and-applications",
      "timingInstruction": "Take after this chapter for guided practice building AI automations, including with Make.com",
      "keyTakeaway": "Applies AI steps inside business automations built with tools including Make.com and Google Sheets."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Operations, Aggregators, Mapping, Credits, and Error Handlers",
    "context": "A marketing team's Make bill doubled after a busy month, and the team lead wants to understand why before redesigning their scenarios. You will count operations through triggers, iterators, filters, and aggregators, build a grouping aggregator, map fields with Make-style references and functions, estimate monthly credits including empty checks, and model what each error handler does to a run.",
    "language": "python"
  }
}

@@reading
# Make Introduction

Make (formerly Integromat) is a visual automation platform in which you build **scenarios** by placing **modules** on a canvas and connecting them. It sits in the middle of the market: more visual and more flexible with data than Zapier, less code-centred than n8n, and fully hosted.

Make has a reputation for being the tool where you can see your data. Every run shows, above each module, how many times it ran and what passed through it. That visibility is the key to the two things this chapter teaches: how data moves through a scenario, in **bundles**, and how that movement turns into the **credits** you pay for. Get the first right and the second follows. Get it wrong and a scenario that does one simple job can cost ten times what it should.

## 1. First-Principles Mental Model & Intuition

### A bucket brigade

Imagine a line of people passing buckets from a well to a fire. The first person draws water; each person after that takes a bucket, does something to it, and passes it on. The work done is counted in **buckets handled**: if ten buckets come out of the well, every person in the line handles ten buckets.

Make works the same way. The trigger draws data from somewhere and produces **bundles**, one per record: one per new email, one per row, one per contact. Every module after it handles each bundle separately. Each time a module runs, that is an **operation**, and each operation uses **credits**.

```text
   Watch New Rows ---> Create Document ---> Download ---> Send Email
   1 operation         10 operations        10            10            = 31 operations
   (one check,
    10 new rows =
    10 bundles)
```

This example comes from Make's own documentation of operations: a trigger that finds ten new form responses, followed by three modules, uses 31 operations, one for the check and ten for each module.

### The pieces on the canvas

| Make term | What it is | General term |
|---|---|---|
| **Scenario** | A complete automation | Workflow |
| **Module** | One step: a trigger, action, search, or tool | Node, step |
| **Bundle** | One record passing through | Item |
| **Operation** | One run of one module | Step execution |
| **Credit** | The unit you buy; most operations cost one | Task, billing unit |
| **Router** | A module that splits the flow into routes | Path, branch |
| **Filter** | A condition on the link between two modules | Filter |
| **Iterator** | Turns one bundle holding an array into many bundles | Split out |
| **Aggregator** | Turns many bundles into one | Aggregate |

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Bundles multiply operations

Make's documentation states the rule plainly: modules process each bundle separately, so each bundle triggers its own module run. A trigger module is the exception: it runs once per check, however many bundles it returns.

For a straight-line scenario of a trigger and $m$ further modules, a run that brings in $b$ bundles uses

$$\text{operations} = 1 + m \times b$$

so the ten-response example is $1 + 3 \times 10 = 31$. The multiplier is $b$, and anything that changes the number of bundles changes the cost of everything after it.

### Iterators multiply; aggregators divide

An **iterator** takes a bundle containing an array, such as an email with three attachments, or an order with four line items, and outputs one bundle per element. It is the "split out" of Module 7.5. The iterator itself is a module run for each bundle it receives, and every module after it now runs once per element.

An **aggregator** does the reverse: it collects the bundles produced since a chosen **source module**, usually an iterator or a search, and outputs one bundle. Make has several:

| Aggregator | Outputs |
|---|---|
| Array aggregator | One bundle containing an array of the collected bundles, or of chosen fields |
| Text aggregator | One bundle with text built from each bundle, for example one line per contact |
| Numeric aggregator | One bundle with a sum, average, count, minimum, or maximum |
| Table aggregator | One bundle with the rows formatted as a table |

An aggregator can also **group by** a value: instead of one output bundle, it outputs one per distinct value, for example one bundle per sales owner holding that owner's leads. Make's documentation notes a subtlety: modules after the aggregator cannot see the individual bundles that were aggregated, only what the aggregator outputs. Anything needed later must be included in the aggregated fields.

The cost effect is large. Make's documentation gives the example of a scenario that emails a manager once for each new contact. Ten contacts make $1 + 10 = 11$ operations. Adding a text aggregator to combine the contacts into one email makes it $1 + 1 + 1 = 3$: one check, one aggregation, one email. And the manager receives one useful message instead of ten.

```text
   BEFORE   Watch rows (1) --> Send email (10)                           = 11
   AFTER    Watch rows (1) --> Text aggregator (1) --> Send email (1)    =  3
```

### Filters and routers

A **filter** sits on the link between two modules. Bundles that meet its conditions pass; others stop there and do not reach the following modules. Since operations count module runs, a filter placed early saves every operation after it, which is why filters belong as close to the trigger as possible.

A **router** splits the flow into routes, each usually starting with a filter. Make's router sends a bundle down every route whose filter it passes, in the order the routes are set, and a **fallback route** handles bundles that fit no other route. This is the every-matching-path behaviour described in Module 7.6, with the same warning: overlapping conditions mean one bundle takes several routes.

### Mapping

To use data from an earlier module, you **map** it: click a field in the panel, and Make inserts a reference to that module's output. References name the module by its **number** on the canvas, so `1.email` means "the email field from module 1". Fields can be nested, `1.company.name`, and wrapped in **functions**: `lower(1.email)`, `trim(1.name)`, `upper(1.company.name)`, and many more for text, numbers, dates, and arrays.

Two properties of mapping matter in practice. First, the reference is by module number, so cloning or rebuilding a module can break mappings that point at it. Second, a mapped field that is empty for a particular bundle is simply empty: the email goes out with a blank where the name should be. As with n8n's expressions in Module 7.7, the remedy is a filter or a default before the step that uses the field.

### Credits and plans

In August 2025, Make renamed its billing unit from operations to **credits**. Its announcement explains that existing operations were converted one-for-one, and that for ordinary modules, including calls to third-party AI apps such as OpenAI or Claude, one operation still uses one credit. Make's own built-in AI features may use more, because their credit use follows the AI provider's token costs. Operations remain the name for module runs; credits are what you buy and spend.

Make's plans are sold by monthly credit allowance; at the time of writing (November 2026), the free plan includes 1,000 credits a month, and paid plans scale up from there with the price per credit varying by plan. Because cost is per module run, the levers are clear:

| Lever | Effect |
|---|---|
| Filter early | Stopped bundles cost nothing further |
| Aggregate before actions that could handle many records at once | One run instead of many |
| Use webhooks instead of frequent schedules | Fewer empty checks |
| Search once, not per bundle | One lookup instead of many |
| Avoid an iterator followed by an aggregator when the app can take an array | Two fewer modules per run |

The third lever deserves a number. A scheduled trigger that checks every 15 minutes runs $4 \times 24 \times 30 = 2880$ times a month, and each check is one operation even when it finds nothing, since a trigger is a module run "to check for new data". If only 300 of those checks find anything, 2,580 credits a month are spent finding nothing. Instant triggers, webhooks, run only when there is something to do.

### Error handlers

When a module fails, for example an API returns an error, Make's default behaviour is to stop the run, and a scheduled scenario that keeps failing can be switched off automatically. You can attach an **error handler** to a module to choose a different behaviour. The Help Center describes five:

| Handler | The failed bundle | Remaining bundles | Run is marked |
|---|---|---|---|
| **Skip** | Dropped | Processed | Success |
| **Resume** | Replaced with a substitute output you define | Processed | Success |
| **Retry** | Stored as an incomplete execution, retried automatically or by hand | Processed | Warning |
| **Commit** | Stops the run, keeping changes made so far | Not processed | Success |
| **Rollback** | Stops the run and reverts changes in modules that support transactions | Not processed | Error |

Older tutorials use the names Ignore and Break for what the Help Center now calls Skip and Retry.

Choosing a handler is choosing what failure means for the business. Skip suits data where an occasional loss does not matter, and is dangerous anywhere else, because it hides failures behind a "success" status. Retry suits temporary problems, a service that is briefly down, since the incomplete execution keeps the data and the rest of the flow. Rollback matters only where modules are transactional, marked "ACID" in Make, such as databases and Make's data stores. It cannot unsend an email or undelete a file. Module 7.14 returns to failure handling across tools.

### Complexity

Operations grow with the number of bundles times the number of modules they pass through. Iterators multiply the bundle count by the array length; aggregators reduce it to one per group. Monthly credits are approximately checks times trigger cost plus, for each run with data, the operations that data causes.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, counting operations.

```python
def operations(scenario, trigger_bundles):
    per_step, bundles = [], 0
    for step in scenario:
        kind = step[0]
        if kind == "trigger":
            ops, bundles = 1, trigger_bundles
        elif kind == "module":
            ops = bundles
        elif kind == "iterator":
            ops, bundles = bundles, bundles * step[1]
        elif kind == "aggregator":
            ops = bundles = (1 if bundles else 0)
        elif kind == "filter":
            ops, bundles = 0, min(bundles, step[1])
        else:
            raise ValueError("unknown step: " + kind)
        per_step.append(ops)
    return sum(per_step), per_step

FORM = [("trigger",), ("module",), ("module",), ("module",)]
EACH = [("trigger",), ("module",)]
COMBINED = [("trigger",), ("aggregator",), ("module",)]
ORDERS = [("trigger",), ("iterator", 3), ("filter", 20), ("module",), ("aggregator",), ("module",)]
print(operations(FORM, 10), operations(EACH, 10), operations(COMBINED, 10))
print(operations(ORDERS, 4), operations(ORDERS, 10), operations(ORDERS, 0))
```

- **A scenario is a list of steps, and the function tracks how many bundles are flowing.** Each step reports its operations and may change the bundle count.
- **The trigger is one operation per check, whatever it returns.** It sets the bundle count to what it found.
- **A module runs once per bundle.** The form example gives 1 + 10 + 10 + 10 = 31, matching Make's documentation.
- **An iterator runs once per bundle it receives and multiplies the bundles by the array length.** The orders scenario models three line items per order.
- **A filter costs nothing and caps the bundles that pass.** In this model, "at most 20 lines pass", standing in for a condition such as "only lines that need restocking". It is a condition on a link, not a module.
- **An aggregator runs once and outputs one bundle,** unless nothing reached it.
- **The email-per-contact design costs 11 and the aggregated design 3.** That is Make's own optimisation example, reproduced.
- **Four orders cost 19 operations: 1, 4, 0, 12, 1, 1.** Ten orders cost 33, because the filter caps the lines at 20. A check that finds nothing costs 1.

Next, grouping with an aggregator.

```python
def aggregate(bundles, group_by, field):
    groups = {}
    for bundle in bundles:
        groups.setdefault(bundle.get(group_by), []).append(bundle.get(field))
    return [{"key": key, "array": values} for key, values in groups.items()]

LEADS = [{"email": "a@x.com", "owner": "Sam", "company": "Acme"},
         {"email": "b@y.com", "owner": "Ria", "company": "Bolt"},
         {"email": "c@z.com", "owner": "Sam", "company": "Cog"}]
print(aggregate(LEADS, "owner", "company"))
```

- **Bundles are grouped by the value of one field, in the order each value first appears.** Sam's group comes first because Sam owns the first lead.
- **Each group keeps only the chosen field.** As Make's documentation warns, anything not aggregated is not available afterwards.
- **Three leads become two bundles.** The email module now runs twice instead of three times, though the aggregator itself costs one operation, so the total is unchanged here; the gain is one message per owner instead of one per lead.

Then, mapping with module numbers and functions.

```python
import re

TOKEN = re.compile(r"\{\{(.*?)\}\}")
FUNCTIONS = {"lower": str.lower, "upper": str.upper, "trim": str.strip}
REFERENCE = re.compile(r"^(\d+)\.([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)$")

def evaluate(expression, outputs):
    expression = expression.strip()
    call = re.match(r"^([a-z]+)\((.*)\)$", expression)
    if call:
        if call.group(1) not in FUNCTIONS:
            raise ValueError("unknown function: " + call.group(1))
        inner = evaluate(call.group(2), outputs)
        return None if inner is None else FUNCTIONS[call.group(1)](str(inner))
    reference = REFERENCE.match(expression)
    if not reference:
        raise ValueError("cannot read: " + expression)
    value = outputs.get(int(reference.group(1)))
    for name in reference.group(2).split("."):
        if isinstance(value, dict) and name in value:
            value = value[name]
        else:
            return None
    return value

def map_text(template, outputs):
    missing = []
    def replace(match):
        value = evaluate(match.group(1), outputs)
        if value is None:
            missing.append(match.group(1).strip())
            return ""
        return str(value)
    return TOKEN.sub(replace, template), missing

OUTPUTS = {1: {"email": "  Ravi@Acme.CO.UK ", "name": "Ravi", "company": {"name": "Acme Tools"}}, 3: {"deal": {"amount": 4800}}}
print(map_text("To: {{trim(lower(1.email))}} | {{upper(1.company.name)}} | {{3.deal.amount}} | {{1.phone}} | {{2.id}}", OUTPUTS))
```

- **`outputs` holds each module's output bundle, keyed by module number.** Module 1 is the trigger, module 3 a CRM search.
- **A reference is a module number and a path.** `3.deal.amount` reads the amount from module 3's output.
- **Functions wrap references, and can nest.** `trim(lower(1.email))` lowercases the email, then trims the spaces: `ravi@acme.co.uk`.
- **An unknown function or unreadable reference is an error,** caught while building rather than at run time.
- **Missing values render empty and are reported.** `1.phone` is not in the bundle, and module 2 produced nothing; both appear in the missing list.

Finally, monthly credits and error handlers.

```python
def monthly_credits(scenario, checks, runs_with_data, bundles_per_run):
    empty = checks - runs_with_data
    return empty * operations(scenario, 0)[0] + runs_with_data * operations(scenario, bundles_per_run)[0]

print(monthly_credits(EACH, 2880, 300, 4), monthly_credits(COMBINED, 2880, 300, 4), monthly_credits(COMBINED, 720, 300, 4))

def run_with_handler(bundles, failing, handler, substitute=None):
    done, stored = [], []
    for bundle in bundles:
        if bundle not in failing:
            done.append(bundle)
        elif handler is None:
            return {"processed": done, "stored": stored, "status": "error"}
        elif handler == "skip":
            continue
        elif handler == "resume":
            done.append(substitute)
        elif handler == "retry":
            stored.append(bundle)
        elif handler == "commit":
            return {"processed": done, "stored": stored, "status": "success"}
        elif handler == "rollback":
            return {"processed": [], "stored": stored, "status": "error"}
        else:
            raise ValueError("unknown handler: " + handler)
    return {"processed": done, "stored": stored, "status": "warning" if stored else "success"}

for handler in (None, "skip", "resume", "retry", "commit", "rollback"):
    print(handler, run_with_handler(["o1", "o2", "o3", "o4"], {"o2"}, handler, "o2-default"))
```

- **`monthly_credits` charges empty checks and runs with data separately.** An empty check costs what the scenario costs with zero bundles, one credit for the trigger.
- **Checking every 15 minutes, 2,880 times, with 300 checks finding four records each:** the per-record email design uses 4,080 credits, the aggregated design 3,480. Most of both is the 2,580 empty checks.
- **Checking hourly instead, 720 times, the aggregated design uses 1,320.** The schedule, not the design, was the bigger lever here. A webhook would remove the empty checks entirely.
- **`run_with_handler` processes four bundles, of which o2 fails.**
- **No handler: the run stops after o1 with an error.** o3 and o4 are never processed.
- **Skip: o1, o3, and o4 are processed and the run is a "success".** o2 is gone, and nothing in the status says so.
- **Resume: o2 is replaced with the substitute, and everything continues.**
- **Retry: o2 is stored as an incomplete execution, the rest continue, and the run is marked with a warning.** The data is kept for a later attempt.
- **Commit: the run stops after o1, keeping what was processed, and is marked success.** Rollback stops and reverts, which in this model empties the processed list; in Make that only applies to transactional modules.

**Complexity.** `operations` is linear in the steps. `aggregate` is linear in the bundles. `evaluate` is linear in the expression and path. `monthly_credits` is two calls of `operations`. `run_with_handler` is linear in the bundles.

### Reading a scenario's cost from its run bubbles

| Bubble above module | Means | Ask |
|---|---|---|
| 1 on a trigger | One check | How often does it check? |
| Large number on an action | Ran once per bundle | Could an aggregator or bulk action do this once? |
| Same large number on every module | Bundles flowed all the way | Could a filter stop most of them early? |
| Iterator followed by large numbers | Array was split | Does the next app accept an array directly? |

### An efficient scenario, step by step

```text
1  Trigger      Webhook (instant), not a 1-minute schedule
2  Filter       Only records that need action, immediately after the trigger
3  Search       One lookup for shared data, before any iterator
4  Iterator     Only if per-element work is truly needed
5  Actions      Per element
6  Aggregator   Back to one bundle per group
7  Action       One summary message or bulk update
8  Handlers     Retry on calls to external services; no Skip on anything that matters
```

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**The schedule that eats the plan.** A 1-minute schedule is 43,200 checks a month before any work is done. Use webhooks or the longest acceptable interval.

**Filters after expensive modules.** A filter placed after a search or an AI call has already paid for them. Move it up.

**One email per record.** If someone receives one message per bundle, an aggregator is usually missing.

**Iterator then aggregator around nothing.** Splitting an array only to rebuild it costs operations and gains nothing. Map the array directly where possible.

**Aggregators that lose fields.** Fields not included in the aggregation are not available after it. Include everything later steps need.

**Wrong source module.** An aggregator's source module decides which bundles are collected. A wrong choice produces one bundle per record or one giant bundle.

**Overlapping router routes.** A bundle passes down every route whose filter it meets. Make conditions exclusive or use the fallback deliberately.

**Mappings broken by rebuilding.** References use module numbers. Rebuilding a module can leave mappings pointing at nothing.

**Skip hiding failures.** A run marked success while dropping bundles is the hardest failure to notice. Prefer Retry and alerts.

**Rollback expectations.** Rollback cannot undo emails, posts, or file deletions. Only ACID modules revert.

**Built-in AI credit surprises.** Make's own AI features bill by token use, not one credit per call. Check usage per scenario after enabling them.

**Not reading the History tab.** Every run's operations and bundles are recorded. A few minutes there explains most surprising bills.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Make builds scenarios from modules connected on a canvas, and data flows between them as bundles, one per record. Each module runs once per bundle it receives, and each run is an operation; the trigger runs once per check whatever it returns, so a straight scenario costs one plus the number of further modules times the number of bundles. Since August 2025 operations are paid for in credits, converted one-for-one, with ordinary modules, including third-party AI apps, costing one credit per operation and Make's built-in AI features costing by token use; the free plan includes 1,000 credits a month at the time of writing. Iterators split an array into bundles and multiply later operations; aggregators, array, text, numeric, and table, collapse bundles since a source module into one, or one per group, and are the main way to cut costs, as in Make's example of reducing 11 operations to 3. Filters sit on links and stop bundles before they cost anything further; routers send a bundle down every matching route, with a fallback for the rest. Mapping refers to earlier modules by number, with functions such as `lower` and `trim`, and empty values render as blanks. Frequent schedules spend credits on empty checks. Error handlers, Skip, Resume, Retry, Commit, and Rollback, decide what a failure does to the failed bundle, the remaining bundles, and the run's status.

**Question 1.** A scenario watches a Google Sheet for new rows every 15 minutes. For each new row it searches the CRM, uses an AI module to write a one-line summary, and posts a Slack message to the sales channel. On average 6 checks a day find rows, with 5 rows each. Estimate the monthly credits over 30 days, identify the biggest cost, and redesign the scenario to cut it, estimating the new total.

<details>
<summary>View Answer</summary>

Checks: every 15 minutes is 96 a day, 2,880 a month. Of these, 6 a day, 180 a month, find rows, and 2,700 find nothing. An empty check costs 1 credit, so empty checks cost 2,700. A check with 5 rows costs 1 for the trigger plus 5 each for the search, the AI module, and the Slack module: 1 + 15 = 16. Over 180 such runs that is 2,880. The total is 2,700 + 2,880 = 5,580 credits a month. The biggest single cost is the empty checks, nearly half the total, followed by the three per-row modules at 900 credits each. Redesign: replace the schedule with an instant trigger if the sheet is filled by a form or app that can send a webhook, removing the 2,700 empty checks. Keep the search and AI steps per row, since each row needs its own summary, but add a text aggregator before Slack so each run posts one message listing all its new rows. A run with data then costs 1 + 5 + 5 + 1 + 1 = 13, and with a webhook, the trigger fires per event rather than per check, so the cost depends on how the sheet is updated. Taking the 180 batches as 180 webhook runs, the total is about 180 times 13, or 2,340 credits, less than half the original. If a webhook is impossible, an hourly schedule, 720 checks with 540 empty, plus 180 runs at 13, gives 540 + 2,340 = 2,880. The sales channel also gets fewer, more useful messages.

</details>

**Question 2.** An order scenario uses an iterator to split each order's line items, updates stock for each line, and then sends the customer one confirmation email. A customer with a 4-line order received four confirmation emails. Explain why using bundles, and give two ways to fix it, saying which costs fewer operations.

<details>
<summary>View Answer</summary>

The iterator turns the order's one bundle into four, one per line item, and every module after it runs once per bundle. The stock update is meant to run per line, so four runs are right. The email module also comes after the iterator, so it also ran once per line, four times, sending four emails. Fix one: place an aggregator after the stock update, with the iterator as its source module, so the four line bundles are collected back into one, then send the email from that single bundle. That costs one extra operation for the aggregator and reduces the email to one: per order, 1 trigger, 1 iterator run, 4 stock updates, 1 aggregator, 1 email, totalling 8. Fix two: use a router immediately after the trigger, with one route iterating the lines and updating stock, and another route sending the email directly from the order bundle, before any iteration. That route costs 1 email and needs no aggregator: per order, 1 trigger, 1 router, 1 iterator, 4 stock updates, 1 email, totalling 8 if the router itself is counted as a module run, or 7 if it is not. So the router design costs 8 operations, or 7 if the router is not counted, against 8 for the aggregator design: it is never more expensive, and cheaper if routers are free. The router design is also clearer, since the email no longer depends on the stock branch, but it sends the email even if a stock update fails, which may or may not be desired. If the email must confirm successful stock updates, the aggregator design is the right one.

</details>

**Question 3.** A scenario writes payments to a database, then emails a receipt, then updates a spreadsheet. The database module occasionally fails for a few seconds. A colleague adds a Skip handler to the database module "so the scenario stops getting switched off". What can go wrong, which handler would you choose instead, and what would Rollback do and not do here?

<details>
<summary>View Answer</summary>

With Skip, a payment whose database write fails is dropped from the flow and the run is marked a success. The payment is never recorded, no receipt is sent, the spreadsheet is not updated, and nothing in the run's status suggests anything went wrong. The only trace is in the run's details, which nobody reads for successful runs. For payment data, silently losing records is the worst possible outcome. Since the failures are short and temporary, Retry is the better choice: the failed bundle is stored as an incomplete execution with its data and the remaining flow, the other payments carry on, the run is marked with a warning, and Make can retry automatically after an interval, such as 3 more attempts every 15 minutes, by which time the database is usually back. An alert on warnings, or on incomplete executions, should tell someone when automatic retries are exhausted. Rollback would stop the run and revert changes made by transactional modules, which here is the database write, if the database module supports transactions. It would not and could not unsend a receipt email already sent by an earlier run, or undo the spreadsheet module, which is not transactional. In this flow the database write is first, so on failure nothing else has happened yet in that bundle, and Rollback would mainly stop the remaining bundles from being processed in that run, marking it as an error. That is safer than Skip, but less useful than Retry, which actually gets the payment recorded.

</details>

@@starter
"""
Lab: Operations, Aggregators, Mapping, Credits, and Error Handlers
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import re

TOKEN = re.compile(r"\{\{(.*?)\}\}")
FUNCTIONS = {"lower": str.lower, "upper": str.upper, "trim": str.strip}
REFERENCE = re.compile(r"^(\d+)\.([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)$")

FORM = [("trigger",), ("module",), ("module",), ("module",)]
EACH = [("trigger",), ("module",)]
COMBINED = [("trigger",), ("aggregator",), ("module",)]
ORDERS = [("trigger",), ("iterator", 3), ("filter", 20), ("module",), ("aggregator",), ("module",)]


# ---------------------------------------------------------------- Step 1
def operations(scenario, trigger_bundles):
    """Walk the steps, tracking how many bundles flow. Per step:
        ("trigger",)        -> 1 operation; bundles become trigger_bundles
        ("module",)         -> one operation per bundle
        ("iterator", k)     -> one operation per bundle; bundles are multiplied by k
        ("aggregator",)     -> 1 operation and 1 bundle out, or 0 and 0 if no bundles arrive
        ("filter", cap)     -> 0 operations; bundles become min(bundles, cap)
    Any other kind raises ValueError. Return (total, list of operations per step)."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def aggregate(bundles, group_by, field):
    """Group bundles by bundle.get(group_by), in order of first appearance, collecting
    bundle.get(field) from each. Return [{"key": value, "array": [collected]}, one per group]."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def evaluate(expression, outputs):
    """outputs maps a module number to its output dict. Strip the expression, then:
    "name(inner)" -> name must be in FUNCTIONS (else ValueError); evaluate inner; None stays None,
                     otherwise apply the function to str(inner value)
    "N.a.b"       -> must match REFERENCE (else ValueError); start from outputs.get(N) and follow
                     the field names; return None if any is missing
    Return the value."""
    # TODO Step 3
    return None


def map_text(template, outputs):
    """Replace each {{ expression }} (TOKEN) with str(evaluate(expression, outputs)). A None value renders as ""
    and the stripped expression is added to a missing list. Return (text, missing)."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def monthly_credits(scenario, checks, runs_with_data, bundles_per_run):
    """Empty checks (checks - runs_with_data) each cost operations(scenario, 0); runs with data each
    cost operations(scenario, bundles_per_run). One operation is one credit. Return the total."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def run_with_handler(bundles, failing, handler, substitute=None):
    """Process bundles in order; those not in `failing` are added to processed. On a failing bundle:
        None        -> stop: {"processed": done so far, "stored": stored, "status": "error"}
        "skip"      -> drop it and continue
        "resume"    -> add `substitute` to processed and continue
        "retry"     -> add the bundle to stored and continue
        "commit"    -> stop: processed so far, status "success"
        "rollback"  -> stop: processed [], status "error"
        other       -> ValueError
    If the loop finishes: status "warning" if anything is stored, else "success"."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("ops   :", operations(FORM, 10))
    print("group :", aggregate([{"o": "Sam", "c": "Acme"}], "o", "c"))
    print("map   :", map_text("{{lower(1.email)}}", {1: {"email": "A@B.C"}}))
    print("credit:", monthly_credits(EACH, 2880, 300, 4))
    print("handle:", run_with_handler(["o1", "o2"], {"o2"}, "retry"))

@@solution
"""
Lab solution: Operations, Aggregators, Mapping, Credits, and Error Handlers
Standard library only.
"""
import re

TOKEN = re.compile(r"\{\{(.*?)\}\}")
FUNCTIONS = {"lower": str.lower, "upper": str.upper, "trim": str.strip}
REFERENCE = re.compile(r"^(\d+)\.([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)$")

FORM = [("trigger",), ("module",), ("module",), ("module",)]
EACH = [("trigger",), ("module",)]
COMBINED = [("trigger",), ("aggregator",), ("module",)]
ORDERS = [("trigger",), ("iterator", 3), ("filter", 20), ("module",), ("aggregator",), ("module",)]


# ---------------------------------------------------------------- Step 1
def operations(scenario, trigger_bundles):
    """Bundles multiply operations: every module runs once per bundle it receives, the
    trigger once per check. Iterators multiply, aggregators collapse, filters stop."""
    per_step, bundles = [], 0
    for step in scenario:
        kind = step[0]
        if kind == "trigger":
            ops, bundles = 1, trigger_bundles
        elif kind == "module":
            ops = bundles
        elif kind == "iterator":
            ops, bundles = bundles, bundles * step[1]
        elif kind == "aggregator":
            ops = bundles = (1 if bundles else 0)
        elif kind == "filter":
            ops, bundles = 0, min(bundles, step[1])
        else:
            raise ValueError("unknown step: " + kind)
        per_step.append(ops)
    return sum(per_step), per_step


# ---------------------------------------------------------------- Step 2
def aggregate(bundles, group_by, field):
    """Group by: one output bundle per distinct value. Only what is aggregated survives."""
    groups = {}
    for bundle in bundles:
        groups.setdefault(bundle.get(group_by), []).append(bundle.get(field))
    return [{"key": key, "array": values} for key, values in groups.items()]


# ---------------------------------------------------------------- Step 3
def evaluate(expression, outputs):
    """Module-number references with nested functions, as in Make's mapping panel."""
    expression = expression.strip()
    call = re.match(r"^([a-z]+)\((.*)\)$", expression)
    if call:
        if call.group(1) not in FUNCTIONS:
            raise ValueError("unknown function: " + call.group(1))
        inner = evaluate(call.group(2), outputs)
        return None if inner is None else FUNCTIONS[call.group(1)](str(inner))
    reference = REFERENCE.match(expression)
    if not reference:
        raise ValueError("cannot read: " + expression)
    value = outputs.get(int(reference.group(1)))
    for name in reference.group(2).split("."):
        if isinstance(value, dict) and name in value:
            value = value[name]
        else:
            return None
    return value


def map_text(template, outputs):
    """Empty mapped values render as blanks in Make; here they are also reported."""
    missing = []

    def replace(match):
        value = evaluate(match.group(1), outputs)
        if value is None:
            missing.append(match.group(1).strip())
            return ""
        return str(value)

    return TOKEN.sub(replace, template), missing


# ---------------------------------------------------------------- Step 4
def monthly_credits(scenario, checks, runs_with_data, bundles_per_run):
    """Empty checks are paid for too: a trigger is a module run to check for data."""
    empty = checks - runs_with_data
    return empty * operations(scenario, 0)[0] + runs_with_data * operations(scenario, bundles_per_run)[0]


# ---------------------------------------------------------------- Step 5
def run_with_handler(bundles, failing, handler, substitute=None):
    """What failure means: Skip hides it behind 'success'; Retry keeps the data and warns;
    Commit and Rollback stop the run; no handler stops it with an error."""
    done, stored = [], []
    for bundle in bundles:
        if bundle not in failing:
            done.append(bundle)
        elif handler is None:
            return {"processed": done, "stored": stored, "status": "error"}
        elif handler == "skip":
            continue
        elif handler == "resume":
            done.append(substitute)
        elif handler == "retry":
            stored.append(bundle)
        elif handler == "commit":
            return {"processed": done, "stored": stored, "status": "success"}
        elif handler == "rollback":
            return {"processed": [], "stored": stored, "status": "error"}
        else:
            raise ValueError("unknown handler: " + handler)
    return {"processed": done, "stored": stored, "status": "warning" if stored else "success"}


if __name__ == "__main__":
    print(operations(FORM, 10), operations(EACH, 10), operations(COMBINED, 10))
    print(operations(ORDERS, 4), operations(ORDERS, 10), operations(ORDERS, 0))
    leads = [{"email": "a@x.com", "owner": "Sam", "company": "Acme"},
             {"email": "b@y.com", "owner": "Ria", "company": "Bolt"},
             {"email": "c@z.com", "owner": "Sam", "company": "Cog"}]
    print(aggregate(leads, "owner", "company"))
    outputs = {1: {"email": "  Ravi@Acme.CO.UK ", "name": "Ravi", "company": {"name": "Acme Tools"}}, 3: {"deal": {"amount": 4800}}}
    print(map_text("To: {{trim(lower(1.email))}} | {{upper(1.company.name)}} | {{3.deal.amount}} | {{1.phone}} | {{2.id}}", outputs))
    print(monthly_credits(EACH, 2880, 300, 4), monthly_credits(COMBINED, 2880, 300, 4), monthly_credits(COMBINED, 720, 300, 4))
    sheet = [("trigger",), ("module",), ("module",), ("module",)]
    print("question 1:", monthly_credits(sheet, 2880, 180, 5))
    for handler in (None, "skip", "resume", "retry", "commit", "rollback"):
        print(handler, run_with_handler(["o1", "o2", "o3", "o4"], {"o2"}, handler, "o2-default"))

@@step
{
  "stepNumber": 1,
  "title": "Count operations through a scenario",
  "instruction": "Implement operations(scenario, trigger_bundles). Track how many bundles are flowing, starting from none. A trigger step costs 1 operation and sets the bundles to trigger_bundles. A module step costs one operation per bundle. An iterator step, written with its array length k, costs one operation per bundle and multiplies the bundles by k. An aggregator step costs 1 operation and leaves 1 bundle, or 0 and 0 if no bundles reach it. A filter step, written with a cap, costs nothing and limits the bundles to at most the cap. Raise ValueError for any other kind. Return the total and the list of operations per step. Reproduce Make's documented examples, 31 operations for the form scenario and 11 against 3 for the aggregator optimisation, as in Section 2. [MOD-7.8]",
  "hintConceptual": "A bucket brigade: the well is drawn once per trip, every person handles every bucket, a splitter pours one bucket into several cups, a collector pours cups back into one bucket, and a sieve lets only some through for free.",
  "hintSyntax": "per_step, bundles = [], 0\nfor step in scenario:\n    kind = step[0]\n    if kind == \"trigger\":\n        ops, bundles = 1, trigger_bundles\n    elif kind == \"module\":\n        ops = bundles\n    elif kind == \"iterator\":\n        ops, bundles = bundles, bundles * step[1]\n    elif kind == \"aggregator\":\n        ops = bundles = (1 if bundles else 0)\n    elif kind == \"filter\":\n        ops, bundles = 0, min(bundles, step[1])\n    else:\n        raise ValueError(\"unknown step: \" + kind)\n    per_step.append(ops)\nreturn sum(per_step), per_step"
}
@@assert
assert operations(FORM, 10) == (31, [1, 10, 10, 10]), f"Make's form example is 31 operations, got {operations(FORM, 10)}"
assert operations(EACH, 10) == (11, [1, 10]) and operations(COMBINED, 10) == (3, [1, 1, 1]), "An aggregator turns 11 operations into 3"
assert operations(ORDERS, 4) == (19, [1, 4, 0, 12, 1, 1]), f"Four orders of three lines, got {operations(ORDERS, 4)}"
assert operations(ORDERS, 10) == (33, [1, 10, 0, 20, 1, 1]), "The filter caps the lines at 20"
assert operations(ORDERS, 0) == (1, [1, 0, 0, 0, 0, 0]) and operations(COMBINED, 0) == (1, [1, 0, 0]), "An empty check costs one operation"
try:
    operations([("trigger",), ("router",)], 1)
    raise AssertionError("An unknown step must raise ValueError")
except ValueError:
    pass
print("Step 1 passed: 31 operations for the form, and 11 down to 3 with an aggregator.")

@@step
{
  "stepNumber": 2,
  "title": "Aggregate with group by",
  "instruction": "Implement aggregate(bundles, group_by, field). Group the bundles by the value of the group_by field, using get so a missing value groups under None, keeping groups in the order each value first appears, and collect the chosen field from each bundle into its group's array. Return a list of dicts with 'key' and 'array', one per group. Group three leads by owner. This is the array aggregator with group by from Section 2. [MOD-7.8]",
  "hintConceptual": "Sorting the post into pigeonholes by name: one pigeonhole per person, opened the first time their name appears, and only the part of each letter you were asked to keep goes in.",
  "hintSyntax": "groups = {}\nfor bundle in bundles:\n    groups.setdefault(bundle.get(group_by), []).append(bundle.get(field))\nreturn [{\"key\": key, \"array\": values} for key, values in groups.items()]"
}
@@assert
_leads = [{"email": "a@x.com", "owner": "Sam", "company": "Acme"}, {"email": "b@y.com", "owner": "Ria", "company": "Bolt"}, {"email": "c@z.com", "owner": "Sam", "company": "Cog"}]
assert aggregate(_leads, "owner", "company") == [{"key": "Sam", "array": ["Acme", "Cog"]}, {"key": "Ria", "array": ["Bolt"]}], f"Two groups in order of first appearance, got {aggregate(_leads, 'owner', 'company')}"
assert aggregate(_leads, "owner", "email")[1] == {"key": "Ria", "array": ["b@y.com"]}, "Only the chosen field is collected"
assert aggregate([{"owner": "Sam"}, {"company": "X"}], "owner", "company") == [{"key": "Sam", "array": [None]}, {"key": None, "array": ["X"]}], "Missing values become None"
assert aggregate([], "owner", "company") == [], "No bundles, no groups"
assert len(aggregate(_leads, "email", "company")) == 3, "Grouping by a unique field gives one group per bundle"
print("Step 2 passed: three leads become two bundles, one per owner.")

@@step
{
  "stepNumber": 3,
  "title": "Map fields with module references and functions",
  "instruction": "Implement evaluate(expression, outputs) and map_text(template, outputs). In evaluate, strip the expression. If it looks like name(inner), check the name is in FUNCTIONS, raising ValueError if not, evaluate the inner expression, and apply the function to its text form unless it is None. Otherwise it must match REFERENCE, a module number then a dotted path, or raise ValueError; start from that module's output and follow the path, returning None if any field is missing. In map_text, replace every {{ expression }} with the text of its value; a None value becomes an empty string and its stripped expression is added to a missing list. Return the text and the list. Map an email, a nested company name, a deal amount, and two missing values. This is Make-style mapping from Section 2. [MOD-7.8]",
  "hintConceptual": "Each blank on the form says which earlier station to fetch from and which drawer to open, sometimes with an instruction like 'write it in lower case'. If the station or drawer is empty, leave the blank empty, and note it down.",
  "hintSyntax": "expression = expression.strip()\ncall = re.match(r\"^([a-z]+)\\((.*)\\)$\", expression)\nif call:\n    if call.group(1) not in FUNCTIONS:\n        raise ValueError(\"unknown function: \" + call.group(1))\n    inner = evaluate(call.group(2), outputs)\n    return None if inner is None else FUNCTIONS[call.group(1)](str(inner))\nreference = REFERENCE.match(expression)\nif not reference:\n    raise ValueError(\"cannot read: \" + expression)\nvalue = outputs.get(int(reference.group(1)))\nfor name in reference.group(2).split(\".\"):\n    if isinstance(value, dict) and name in value:\n        value = value[name]\n    else:\n        return None\nreturn value\n\n# map_text\nmissing = []\n\ndef replace(match):\n    value = evaluate(match.group(1), outputs)\n    if value is None:\n        missing.append(match.group(1).strip())\n        return \"\"\n    return str(value)\n\nreturn TOKEN.sub(replace, template), missing"
}
@@assert
_outputs = {1: {"email": "  Ravi@Acme.CO.UK ", "name": "Ravi", "company": {"name": "Acme Tools"}}, 3: {"deal": {"amount": 4800}}}
_mapped = map_text("To: {{trim(lower(1.email))}} | {{upper(1.company.name)}} | {{3.deal.amount}} | {{1.phone}} | {{2.id}}", _outputs)
assert _mapped == ("To: ravi@acme.co.uk | ACME TOOLS | 4800 |  | ", ["1.phone", "2.id"]), f"Functions, nested paths, and missing values, got {_mapped}"
assert evaluate(" 3.deal.amount ", _outputs) == 4800 and evaluate("upper(3.deal.amount)", _outputs) == "4800", "Values keep their type unless a function converts them"
assert evaluate("lower(1.missing)", _outputs) is None and evaluate("1.name.first", _outputs) is None, "Missing stays None through functions and non-objects"
assert map_text("Plain text", _outputs) == ("Plain text", []) and map_text("{{ 1.name }}", _outputs) == ("Ravi", []), "Spaces inside braces are allowed"
for _bad in ("title(1.name)", "email", "1.", "$json.name"):
    try:
        evaluate(_bad, _outputs)
        raise AssertionError(f"{_bad} must raise ValueError")
    except ValueError:
        pass
print("Step 3 passed: trim(lower(1.email)) gives ravi@acme.co.uk, and two empty mappings are reported.")

@@step
{
  "stepNumber": 4,
  "title": "Estimate monthly credits",
  "instruction": "Implement monthly_credits(scenario, checks, runs_with_data, bundles_per_run). The empty checks are the checks minus the runs with data, and each costs what operations gives for the scenario with zero bundles. Each run with data costs what operations gives for the scenario with bundles_per_run bundles. Count one credit per operation and return the total. Compare the per-record and aggregated designs on a 15-minute schedule, then the aggregated design checked hourly. This is the credit arithmetic from Section 2. [MOD-7.8]",
  "hintConceptual": "A phone bill where every time you check the letterbox costs a coin, even when it is empty, and every letter you handle costs coins too. Add the two piles.",
  "hintSyntax": "empty = checks - runs_with_data\nreturn empty * operations(scenario, 0)[0] + runs_with_data * operations(scenario, bundles_per_run)[0]"
}
@@assert
_each = [("trigger",), ("module",)]
_combined = [("trigger",), ("aggregator",), ("module",)]
assert monthly_credits(_each, 2880, 300, 4) == 4080, f"Per-record emails on a 15-minute schedule, got {monthly_credits(_each, 2880, 300, 4)}"
assert monthly_credits(_combined, 2880, 300, 4) == 3480 and monthly_credits(_combined, 720, 300, 4) == 1320, "Aggregating saves 600; checking hourly saves far more"
_sheet = [("trigger",), ("module",), ("module",), ("module",)]
assert monthly_credits(_sheet, 2880, 180, 5) == 5580, "The first recall question's scenario uses 5,580 credits"
assert monthly_credits(_sheet, 180, 180, 5) == 2880 and monthly_credits(_sheet, 100, 0, 5) == 100, "Without empty checks only runs with data cost; with no data only checks cost"
print("Step 4 passed: 4,080 against 3,480 credits, and 1,320 once the schedule is hourly.")

@@step
{
  "stepNumber": 5,
  "title": "Model the error handlers",
  "instruction": "Implement run_with_handler(bundles, failing, handler, substitute). Process the bundles in order, adding each one not in failing to a processed list. On a failing bundle: with no handler, stop and return the processed list so far, the stored list, and status 'error'; with 'skip', drop it and continue; with 'resume', add the substitute and continue; with 'retry', add the bundle to a stored list and continue; with 'commit', stop and return the processed list so far with status 'success'; with 'rollback', stop and return an empty processed list with status 'error'; any other handler raises ValueError. If every bundle is handled, return status 'warning' if anything is stored, otherwise 'success'. Run four orders, one failing, through every handler. These are the five handlers from Section 2. [MOD-7.8]",
  "hintConceptual": "Four letters, one undeliverable. You can bin it and say all went well, put a placeholder in its place, keep it in a tray to try again tomorrow, stop for the day keeping what was delivered, or stop and recall everything that can be recalled.",
  "hintSyntax": "done, stored = [], []\nfor bundle in bundles:\n    if bundle not in failing:\n        done.append(bundle)\n    elif handler is None:\n        return {\"processed\": done, \"stored\": stored, \"status\": \"error\"}\n    elif handler == \"skip\":\n        continue\n    elif handler == \"resume\":\n        done.append(substitute)\n    elif handler == \"retry\":\n        stored.append(bundle)\n    elif handler == \"commit\":\n        return {\"processed\": done, \"stored\": stored, \"status\": \"success\"}\n    elif handler == \"rollback\":\n        return {\"processed\": [], \"stored\": stored, \"status\": \"error\"}\n    else:\n        raise ValueError(\"unknown handler: \" + handler)\nreturn {\"processed\": done, \"stored\": stored, \"status\": \"warning\" if stored else \"success\"}"
}
@@assert
_orders = ["o1", "o2", "o3", "o4"]
assert run_with_handler(_orders, {"o2"}, None) == {"processed": ["o1"], "stored": [], "status": "error"}, f"No handler stops the run, got {run_with_handler(_orders, {'o2'}, None)}"
assert run_with_handler(_orders, {"o2"}, "skip") == {"processed": ["o1", "o3", "o4"], "stored": [], "status": "success"}, "Skip drops the bundle and still reports success"
assert run_with_handler(_orders, {"o2"}, "resume", "o2-default")["processed"] == ["o1", "o2-default", "o3", "o4"], "Resume substitutes and continues"
assert run_with_handler(_orders, {"o2", "o4"}, "retry") == {"processed": ["o1", "o3"], "stored": ["o2", "o4"], "status": "warning"}, "Retry stores failures, continues, and warns"
assert run_with_handler(_orders, {"o3"}, "commit") == {"processed": ["o1", "o2"], "stored": [], "status": "success"}, "Commit stops but keeps what was done"
assert run_with_handler(_orders, {"o3"}, "rollback") == {"processed": [], "stored": [], "status": "error"}, "Rollback stops and reverts"
assert run_with_handler(_orders, set(), None)["status"] == "success" and run_with_handler([], {"x"}, "skip")["status"] == "success", "No failures means success"
try:
    run_with_handler(_orders, {"o1"}, "break")
    raise AssertionError("An unknown handler must raise ValueError")
except ValueError:
    pass
print("Step 5 passed: Skip hides the failure behind 'success', and Retry keeps it with a warning.")
