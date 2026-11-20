@@meta
{
  "moduleId": "MOD-7.6",
  "slug": "mod-7-6",
  "unitId": "UNIT-7",
  "unitTitle": "Unit 7: AI Automation Masterclass",
  "title": "Triggers and Actions",
  "difficulty": "Foundational",
  "estimatedMinutes": 85,
  "citations": [
    { "title": "crontab(5): tables for driving cron", "source": "Linux man-pages", "url": "https://man7.org/linux/man-pages/man5/crontab.5.html" },
    { "title": "Zapier polling trigger deduplication: Implementation guide", "source": "Zapier Docs", "url": "https://docs.zapier.com/platform/build/deduplication" },
    { "title": "How Zapier triggers work", "source": "Zapier Help", "url": "https://help.zapier.com/hc/en-us/articles/8496181445261-How-Zapier-triggers-work" },
    { "title": "Schedule a scenario", "source": "Make Help Center", "url": "https://help.make.com/schedule-a-scenario" },
    { "title": "Schedule Trigger node", "source": "n8n Docs", "url": "https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger/" },
    { "title": "Idempotent requests", "source": "Stripe API Reference", "url": "https://docs.stripe.com/api/idempotent_requests" }
  ],
  "videoLibrary": [
    {
      "id": "VID-7.6-1",
      "title": "A complete beginners guide to Zapier",
      "creator": "MinorCo",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=VkzZqLSt2hs",
      "timingInstruction": "Watch after reading Section 1, to see a trigger and its actions configured in a real tool",
      "keyTakeaway": "One trigger starts the run, and each action works with data the earlier steps produced."
    },
    {
      "id": "VID-7.6-2",
      "title": "Event-Driven Architecture: Explained in 7 Minutes!",
      "creator": "Alex Hyett",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=gOuAqRaDdHA",
      "timingInstruction": "Watch after reading Section 2, paying attention to the scheduling settings, filters, and router",
      "keyTakeaway": "The event-driven model behind triggers, in plain terms."
    },
    {
      "id": "VID-7.6-3",
      "title": "Automation for Beginners (What is Trigger and Action)",
      "creator": "Pabbly",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=KbiH_JBXrKI",
      "timingInstruction": "Watch the opening comparison of webhooks and polling after the lab",
      "keyTakeaway": "Triggers and actions demonstrated in a no-code tool."
    },
    {
      "id": "VID-7.6-4",
      "title": "Operationalizing No-Code AI with Zapier Automation and Plans",
      "creator": "Board Infinity",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/operationalizing-no-code-ai-with-zapier-automation-and-plans",
      "timingInstruction": "Take after this chapter, as a guided build of triggers, filters, and paths",
      "keyTakeaway": "Applies triggers, filters, and multi-step paths to business workflows with plan limits in view."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Schedules, Polling, Filters, Paths, and Run-Once Keys",
    "context": "A small agency is moving its manual routines into an automation tool: a weekday morning report, a form that is checked for new leads, and payment events that sometimes arrive twice. You will build the pieces underneath those triggers and actions, a schedule reader, a polling step that only passes new records, a filter, a router with a fallback, and a run-once key that stops duplicates.",
    "language": "python"
  }
}

@@reading
# Triggers and Actions

Every automation answers two questions. When does it run? And what does it do? The first is the **trigger**, the second the **actions**. Module 7.2 described a workflow as a trigger followed by steps, and Modules 7.3 and 7.4 explained the two ways one system learns about another's events: asking, through an API, and being told, through a webhook.

This chapter looks closely at both halves. It covers the kinds of trigger and how each one decides that "something happened"; the kinds of step that follow, actions, searches, filters, and paths; and the problem that sits between them, making sure that one real event leads to exactly one run, no matter how the trigger behaves.

## 1. First-Principles Mental Model & Intuition

### A doorbell, an alarm clock, and a letterbox

There are three ways to know that it is time to do something.

An **alarm clock** goes off at a set time, whether or not anything has happened. "Every weekday at nine, send the sales report" is an alarm clock. This is a **schedule trigger**.

A **doorbell** rings the moment someone arrives. You do nothing until it rings, and then you act at once. A webhook is a doorbell: the other system calls you when the event happens. This is an **instant trigger**.

A **letterbox** you check every so often. Each time, you look for post that was not there last time, and act on what is new. This is a **polling trigger**: the automation tool asks the other system, on a timer, "what is there now?", and compares the answer with what it has already seen.

```text
   SCHEDULE                 INSTANT (WEBHOOK)            POLLING
   clock reaches 09:00      other system calls in        timer fires, ask "what is there?"
         |                         |                              |
         v                         v                              v
      run once                run once per call          compare with items already seen
                                                                  |
                                                         run once per NEW item
```

Workflow tools add a fourth name, the **app event trigger**: "new row in Google Sheets", "new email in Gmail". It is not a fourth mechanism. Underneath, each one is either a webhook, where the app supports them, or polling, where it does not. Knowing which matters, because it decides how quickly the trigger fires and how it can fail.

### After the trigger: steps

Once a run starts, it passes through steps, each of which is one of four kinds.

| Step | Does | Example |
|---|---|---|
| **Action** | Changes something somewhere | Send an email, create a row, post a message |
| **Search** | Looks something up without changing it | Find the customer by email |
| **Filter** | Lets the run continue or stops it | Only continue if the order is over 100 |
| **Path** (or router) | Sends the run down one or more branches | Big companies to sales, others to the newsletter |

An action is the only kind that changes the world. That makes it the kind that must not happen twice by accident, which is the problem Section 2 ends with.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Schedule triggers and cron

Most tools offer simple schedules in their interface: every 15 minutes, every day at a time, every Monday. Underneath, and in many tools directly, schedules are written as **cron expressions**, a format from the Unix `cron` program that has become the common language of schedules. n8n's Schedule Trigger node accepts them, as do servers, cloud schedulers, and CI systems.

A cron expression has five fields, separated by spaces:

```text
   +------------- minute        0-59
   | +----------- hour          0-23
   | | +--------- day of month  1-31
   | | | +------- month         1-12
   | | | | +----- day of week   0-6  (0 is Sunday; many systems also accept 7, the lab only 0-6)
   | | | | |
   0 9 * * 1-5        09:00 on Monday to Friday
```

Each field can hold:

| Form | Meaning | Example in the minute field |
|---|---|---|
| `*` | Every value | Every minute |
| `n` | That value | `30` is at half past |
| `a-b` | A range | `0-14` is the first quarter hour |
| `a,b,c` | A list | `0,30` is on the hour and the half hour |
| `*/n` | Every n-th value, from the lowest | `*/15` is 0, 15, 30, 45 |
| `a-b/n` | Every n-th value in a range | `9-17/2` in the hour field is 9, 11, 13, 15, 17 |

A time matches the expression when every field matches. There is one famous exception, written into the crontab manual: when **both** day of month and day of week are restricted, that is, neither is a star, a day matches if **either** one matches. So `0 6 1 * 1` does not mean "6 a.m. on the 1st if it is a Monday". It means "6 a.m. on the 1st of every month, and also 6 a.m. every Monday". The lab checks this rule, because it surprises people every year.

Two other traps belong to schedules. The first is the **time zone**: a schedule runs in some zone, the server's, the account's, or one you choose, and "9 a.m." in the wrong one is 9 a.m. for someone else. The second is **daylight saving time**: on the night the clocks change, a 1:30 a.m. job may run twice or not at all, depending on the scheduler. Schedules that matter should avoid the hour around 1 to 3 a.m. local time, or run in UTC.

### Polling and deduplication

A polling trigger repeats the same request on a timer and must turn a series of snapshots into a stream of "new item" events. The method, described in Zapier's developer documentation, is straightforward:

1. Ask the API for the most recent items, newest first.
2. Look at each item's **primary key**, by default its `id` field.
3. Any key not seen before is a new item, and starts a run.
4. Remember every key seen.

```text
   poll at 09:00   returns  r3 r2 r1         seen: {}            baseline: record, run nothing
   poll at 09:15   returns  r5 r4 r3         seen: {r1 r2 r3}    new: r5, r4  -> two runs
   poll at 09:30   returns  r5 r4 r3         seen: {r1..r5}      new: none    -> no runs
```

The first poll is a **baseline**. When a polling automation is first switched on, the items already in the app are old news, and a common design, used in the lab, records them without starting runs. Otherwise turning on a "new lead" automation would email every lead you have ever had.

This method has consequences worth knowing.

| Consequence | Why |
|---|---|
| Delay of up to one interval | A new item waits for the next poll |
| Only new keys trigger | An edited item keeps its key, so edits do not trigger |
| Items can be missed | If more new items arrive between polls than one page returns |
| Each poll costs a request | Even when nothing is new, as Module 7.4 computed |

To trigger on **updates** instead of new items, the documented trick is to make the key change when the item changes: combine the ID with the time it was last updated, so `r3` updated at 10:02 has the key `r3-10:02`, which has not been seen before.

The polling interval depends on the tool and, often, on the plan. At the time of writing (November 2026), Zapier's polling interval ranges from 15 minutes on the free plan to 1 or 2 minutes on paid ones, and Make's scheduled scenarios default to 15 minutes but can be set by the user. A polling trigger is therefore never instant, and the plan you pay for decides how close to instant it gets.

### Filters

A filter is a set of conditions, and the run continues only if they hold. Conditions compare a field with a value using an operator.

| Operator | True when | Trap |
|---|---|---|
| equals | The field is exactly the value | "Paid" is not "paid" |
| not equals | The field differs | A missing field differs from everything |
| contains | The text includes the value | Usually case-insensitive in tools; check |
| greater than | The number is larger | A number stored as text may not compare as a number |
| exists | The field is present and not empty | Empty text often counts as "not existing" |

Most tools combine conditions with **AND** within a group and allow several groups joined with **OR**. A filter is the cheapest step in an automation: stopping an unwanted run early costs nothing further. On some platforms, filters do not even count towards the usage you pay for, which Module 7.9 covers for Zapier.

### Paths and routers

A path step sends the run down branches, each with its own conditions. Tools differ in one important respect: whether **every** matching branch runs, or only the **first**.

| Behaviour | Where you meet it |
|---|---|
| Every branch whose conditions match runs | Zapier Paths, Make routers |
| The first matching branch runs | n8n's Switch node in its default mode, if-else chains in code |
| A fallback branch runs only if no other matches | Make's fallback route, the "otherwise" branch in many tools |

The difference matters as soon as conditions overlap. A lead from a big company who came through a webinar matches both "big companies to sales" and "webinar attendees to the nurture sequence". If every matching path runs, the lead gets both; if only the first runs, they get whichever was listed first. Neither is wrong, but the builder must know which the tool does, and should design conditions that either never overlap or overlap on purpose.

A **fallback** branch catches records no condition matches. Without one, such records silently do nothing, which is the hardest kind of failure to notice.

### One event, exactly one run

The final problem is duplicates. One real event can reach an automation more than once:

| Cause | Example |
|---|---|
| Webhook retries | The sender did not get a 2xx in time and sent again, as in Module 7.4 |
| Overlapping triggers | Both a webhook and a polling trigger watch the same thing |
| Manual re-runs | Someone replays a failed run that had partly succeeded |
| Double submission | A customer presses Submit twice |

Delivery systems almost all promise **at least once**, not exactly once. The receiving side has to make its effect happen once, which is called being **idempotent**. The method is an **idempotency key**: a value that is the same for every copy of one event and different for different events. Before acting, check whether the key has been processed; if so, skip.

The key must be built from the fields that identify the **event**, not the delivery. An order being paid is identified by the order ID and the new status. The time the webhook was sent is a property of the delivery: a retry has a different send time. Including it in the key makes every retry look new, which defeats the purpose.

```text
   KEY FROM (order, status)            KEY FROM (order, status, sent_at)
   A1 paid  09:00:01   -> run          A1 paid  09:00:01   -> run
   A1 paid  09:00:31   -> skip         A1 paid  09:00:31   -> run   (duplicate charge email)
   A2 paid  09:02:00   -> run          A2 paid  09:02:00   -> run
   A1 shipped 11:00    -> run          A1 shipped 11:00    -> run
```

The key is often a hash of the chosen fields: write them in a fixed order, as canonical JSON with sorted keys, and take a digest, so the key has a fixed length whatever the fields contain. Payment APIs take the same idea in the other direction: Stripe accepts an `Idempotency-Key` header on requests, so that a client retrying a payment request does not charge twice.

### Complexity

Checking whether a time matches a cron expression is constant work per field. A poll compares each returned item with a set of seen keys, linear in the page size. A filter is linear in its conditions, and a router in its branches times their conditions. An idempotency check is one set lookup per event.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, a schedule reader.

```python
from datetime import datetime, timedelta

def parse_field(text, low, high):
    values = set()
    for part in text.split(","):
        step = 1
        if "/" in part:
            part, step_text = part.split("/")
            step = int(step_text)
            if step < 1:
                raise ValueError("a step must be at least 1")
        if part == "*":
            start, end = low, high
        elif "-" in part:
            first, last = part.split("-")
            start, end = int(first), int(last)
        else:
            start = end = int(part)
        if not (low <= start <= end <= high):
            raise ValueError("out of range: " + text)
        values.update(range(start, end + 1, step))
    return values

def cron_matches(expression, when):
    fields = expression.split()
    if len(fields) != 5:
        raise ValueError("a cron expression has five fields")
    minute, hour, day, month, weekday = fields
    if when.minute not in parse_field(minute, 0, 59) or when.hour not in parse_field(hour, 0, 23):
        return False
    if when.month not in parse_field(month, 1, 12):
        return False
    day_ok = when.day in parse_field(day, 1, 31)
    weekday_ok = (when.weekday() + 1) % 7 in parse_field(weekday, 0, 6)
    if day != "*" and weekday != "*":
        return day_ok or weekday_ok
    return day_ok and weekday_ok

def next_runs(expression, after, count):
    runs, moment = [], after.replace(second=0, microsecond=0) + timedelta(minutes=1)
    while len(runs) < count:
        if cron_matches(expression, moment):
            runs.append(moment)
        moment += timedelta(minutes=1)
    return runs

start = datetime(2026, 11, 16, 8, 30)
print([run.strftime("%a %d %H:%M") for run in next_runs("0 9 * * 1-5", start, 6)])
print([run.strftime("%a %d %H:%M") for run in next_runs("*/15 9-10 * * *", start, 5)])
print([run.strftime("%a %d %b %H:%M") for run in next_runs("0 6 1 * 1", start, 4)])
```

- **`parse_field` turns one field into the set of values it allows.** It handles stars, single values, ranges, lists, and steps, and refuses values outside the field's range.
- **`cron_matches` checks a time against all five fields.** Python counts weekdays from Monday as 0, cron from Sunday as 0, so the weekday is shifted by one.
- **The day rule is implemented exactly.** If both day fields are restricted, either may match. Otherwise both must.
- **`next_runs` steps forward a minute at a time.** It is the simplest correct method, fine for a few runs ahead, and is how you check a schedule before trusting it.
- **The weekday report runs Monday to Friday at nine, then skips to the next Monday.** Starting from Monday 16 November 2026 at 08:30, the runs are the 16th to the 20th, then the 23rd.
- **`*/15 9-10` runs every quarter hour from 9:00.** The first five are 9:00, 9:15, 9:30, 9:45, and 10:00.
- **`0 6 1 * 1` shows the day rule.** It runs on Mondays 23 and 30 November, then on Tuesday 1 December because it is the 1st, then on Monday 7 December. Anyone who meant "the 1st, if it is a Monday" now knows otherwise.

Next, polling with a baseline.

```python
def poll_new(fetched, seen):
    keys = {item["id"] for item in fetched}
    if seen is None:
        return [], keys
    new = [item for item in fetched if item["id"] not in seen]
    return new, seen | keys

first = [{"id": "r3", "name": "Asha"}, {"id": "r2", "name": "Ben"}, {"id": "r1", "name": "Cal"}]
second = [{"id": "r5", "name": "Dee"}, {"id": "r4", "name": "Eli"}, {"id": "r3", "name": "Asha"}]
new, seen = poll_new(first, None)
print(new, sorted(seen))
new, seen = poll_new(second, seen)
print([item["id"] for item in new], sorted(seen))
new, seen = poll_new(second, seen)
print(new)
```

- **`seen` of None means "this is the first poll".** The items are recorded and nothing runs. That is the baseline.
- **The second poll returns two new items, r5 and r4.** r3 was there before and is ignored, although it came back again.
- **The third poll, returning the same page, finds nothing new.** The automation does not run, but the request was still made.
- **New items are returned newest first, as the API listed them.** Some tools process them oldest first instead, which matters if the order of runs matters.
- **Only the key is compared.** If Asha's record were edited, its key would be unchanged and no run would start, which is the "edits do not trigger" consequence from Section 2.

Then filters and paths.

```python
OPERATORS = {
    "equals": lambda field, value: field == value,
    "not_equals": lambda field, value: field != value,
    "contains": lambda field, value: isinstance(field, str) and value.lower() in field.lower(),
    "greater_than": lambda field, value: isinstance(field, (int, float)) and not isinstance(field, bool) and field > value,
    "exists": lambda field, value: field not in (None, ""),
}

def passes(record, conditions):
    for name, operator, value in conditions:
        if operator not in OPERATORS:
            raise ValueError("unknown operator: " + operator)
        if not OPERATORS[operator](record.get(name), value):
            return False
    return True

def route(record, paths, fallback="fallback"):
    matched = [name for name, conditions in paths if passes(record, conditions)]
    return matched or [fallback]

lead = {"email": "ravi@acme.co.uk", "company": "Acme Tools", "employees": 240, "source": "webinar", "phone": ""}
PATHS = [("sales", [("employees", "greater_than", 200)]),
         ("nurture", [("source", "equals", "webinar")]),
         ("partners", [("email", "contains", "partner")])]
print(passes(lead, [("employees", "greater_than", 50), ("email", "contains", "@")]))
print(passes(lead, [("phone", "exists", None)]), passes({"employees": "240"}, [("employees", "greater_than", 50)]))
print(route(lead, PATHS), route({"employees": 12, "source": "ad", "email": "x@y.z"}, PATHS))
```

- **The operators are a table.** Adding one means adding a line, and an unknown operator raises an error instead of being silently treated as false.
- **All conditions must hold.** This is AND logic, the default within a filter group in most tools.
- **The lead passes "more than 50 employees and the email contains an @".**
- **An empty phone does not exist.** Empty text counts as missing, which is usually what a builder means by "has a phone".
- **The text "240" is not greater than 50.** The comparison only accepts real numbers, the "number stored as text" trap from Module 7.5. Convert at the entry.
- **The lead matches two paths, sales and nurture.** `route` runs every matching branch, the Zapier and Make behaviour. A first-match router would return only sales.
- **A small lead from an ad matches nothing and goes to the fallback.** Nothing is silently dropped.

Finally, the run-once key.

```python
import hashlib
import json

def event_key(event, fields):
    picked = {name: event.get(name) for name in fields}
    canonical = json.dumps(picked, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:16]

def run_once(events, fields, processed):
    done, skipped = [], 0
    for event in events:
        key = event_key(event, fields)
        if key in processed:
            skipped += 1
            continue
        processed.add(key)
        done.append(event)
    return done, skipped

EVENTS = [{"order": "A1", "status": "paid", "sent_at": "09:00:01"},
          {"order": "A1", "status": "paid", "sent_at": "09:00:31"},
          {"order": "A2", "status": "paid", "sent_at": "09:02:00"},
          {"order": "A1", "status": "shipped", "sent_at": "11:00:00"}]
print(event_key(EVENTS[0], ["order", "status"]))
print(run_once(EVENTS, ["order", "status"], set())[1], run_once(EVENTS, ["order", "status", "sent_at"], set())[1])
```

- **`event_key` hashes only the fields that identify the event.** Sorted keys and fixed separators make the JSON canonical, so the same fields always give the same key.
- **The key is 16 hexadecimal characters of a SHA-256 digest.** For A1 paid it is `52df2f1b464d5b52`. Sixteen characters is plenty for one automation's history, and short enough to store and read.
- **The retry of "A1 paid" is skipped.** Three events run, one is skipped.
- **Including `sent_at` skips nothing.** The retry has a different send time, so it looks new, and the customer gets two "payment received" emails. The diagram in Section 2 shows the same two outcomes.
- **"A1 shipped" runs.** Same order, different event, different key.
- **`processed` must be stored somewhere durable in real use.** A set in memory forgets everything on restart, and a retry after a restart would run again. Workflow tools offer a data store or table for this, and Module 7.12 uses a spreadsheet.

**Complexity.** `cron_matches` is constant work, and `next_runs` is linear in the minutes it steps through. `poll_new` is linear in the page. `passes` is linear in the conditions, `route` in the total conditions across paths, and `run_once` in the events.

### A trigger decision table

| Need | Trigger | Why |
|---|---|---|
| A report at a fixed time | Schedule | Time is the event |
| React within seconds | Webhook | Push is immediate |
| The app offers no webhooks | Polling | The only way to notice changes |
| Notice edits, not just new items | Polling with an updated-time key, or a webhook for updates | Plain polling ignores edits |
| A button a person presses | Manual or form trigger | A human is the event |

### A run-once checklist

```text
EVENT IDENTITY     which fields name the event, not the delivery?
KEY                hash of those fields, canonical JSON, sorted keys
STORE              where processed keys are kept, and for how long
CHECK              before the first action that changes anything
RECORD             after success, or with a "started" marker for long runs
OVERLAP            no second trigger watching the same events
```

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**The day-of-week surprise.** A cron expression restricting both day fields runs on either. Check every schedule with a "next runs" preview before trusting it.

**The wrong time zone.** A schedule set while travelling, or on a server in UTC, runs at the wrong local hour. State the zone in the workflow's description.

**Daylight saving nights.** Jobs between 1 and 3 a.m. may run twice or not at all on the change nights. Move them, or run in UTC.

**Turning on a polling trigger floods the workflow.** If the tool does not take a baseline, every existing record looks new. Test with a copy first, or check the tool's behaviour.

**Edits that never trigger.** A "new item" polling trigger ignores updates. Use an updated-item trigger, or a key built from the ID and the update time.

**Missed items under load.** If fifty new items arrive between polls and the API returns twenty per page, thirty may never be seen. Shorten the interval or use webhooks.

**Two triggers, one event.** A webhook and a polling trigger on the same source both fire. Choose one.

**Filters that compare text with numbers.** "240" greater than 50 can be false, or compare as text. Convert types first.

**Overlapping paths.** If every matching path runs, a record can go down two branches. Make conditions exclusive, or make the overlap deliberate.

**No fallback branch.** Records that match no path vanish without a trace. Always route the rest somewhere, even if only to a log.

**Idempotency keys that include delivery fields.** Timestamps of sending, delivery IDs, and attempt numbers change on retries. Build keys from the event.

**Keys kept in memory.** A restart forgets them. Store them durably, with an expiry, like Stripe's keys, which can be pruned after 24 hours or more.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A trigger decides when a run starts and actions decide what it does. Schedule triggers fire at times written as five-field cron expressions, minute, hour, day of month, month, and day of week, with stars, values, ranges, lists, and steps, and one rule that surprises people: when both day fields are restricted, a day matching either one counts. Time zones and daylight saving change when schedules really run. Instant triggers are webhooks, pushed by the source. Polling triggers ask on a timer and compare each item's primary key, by default its `id`, with the keys already seen, so only new items start runs; a first poll is best treated as a baseline, edits do not trigger unless the key includes the update time, and the interval, set by tool and plan, bounds the delay. App event triggers are one of these underneath. After the trigger come actions, which change things, searches, which look things up, filters, which stop unwanted runs, and paths, which branch; tools differ on whether every matching path runs or only the first, and a fallback catches the rest. Since delivery is at least once, actions must be protected with an idempotency key built from the fields that identify the event, never the delivery, stored durably and checked before anything changes.

**Question 1.** A team wants a backup job "at 2:30 a.m. on the first day of each month, but only if it is a Sunday" and writes `30 2 1 * 0`. What does that expression actually do, how many times would it run in a 30-day month starting on a Wednesday, and what two further risks does the 2:30 a.m. time carry? How could they get the behaviour they wanted?

<details>
<summary>View Answer</summary>

Because both the day-of-month field (1) and the day-of-week field (0, Sunday) are restricted, cron runs the job on any day matching either: at 2:30 a.m. on the 1st of every month, whatever weekday it is, and at 2:30 a.m. on every Sunday. In a 30-day month starting on Wednesday the 1st, the Sundays are the 5th, 12th, 19th, and 26th, so the job runs five times: once on the 1st and four times on Sundays, instead of zero times, since the 1st is not a Sunday. The two further risks of 2:30 a.m. are the time zone and daylight saving. The job runs in whatever zone the scheduler uses, which may not be the team's. And in many zones the clocks jump forward from 2:00 to 3:00 or back from 2:00 to 1:00 at that hour on the change nights, so a 2:30 job may be skipped entirely or run twice, depending on the scheduler. To get "the 1st only if it is a Sunday", standard cron cannot express it in one expression. The usual method is to schedule `30 2 1 * *`, every 1st, and have the first step check the weekday and stop unless it is Sunday, which is a filter after a schedule trigger. Or schedule every Sunday and check that the date is the 1st. Moving the time out of the 1 to 3 a.m. window, or running the scheduler in UTC, removes the daylight saving risk.

</details>

**Question 2.** A "new lead" automation polls a CRM every 15 minutes. The API returns the 20 most recent leads, newest first, keyed by `id`. Describe what happens (a) when the automation is first switched on with 400 existing leads, if the tool takes a baseline and if it does not; (b) when a salesperson edits an existing lead's phone number; (c) during a webinar that adds 45 leads in ten minutes. What would you change for each?

<details>
<summary>View Answer</summary>

(a) With a baseline, the first poll records the IDs of the 20 leads it can see and starts no runs. Afterwards, only leads with new IDs start runs, which is correct. Without a baseline, the first poll sees 20 unseen IDs and starts 20 runs, so 20 old leads get the welcome email; only the 20 leads on the first page are affected, since the other 380 are never returned, but those 20 people are still emailed wrongly. The fix is to check the tool's behaviour, or to test against a copy before switching on. (b) The edit does not change the lead's ID, and the polling trigger compares only IDs, so nothing happens. If phone changes should start a run, use an "updated lead" trigger, or build the key from the ID and the last-updated time, so each edit produces a new key; or, better, use a webhook for updates if the CRM offers one. (c) Between two polls 15 minutes apart, up to 45 new leads arrive, but the API returns only the 20 most recent. The poll sees 20 new IDs and starts 20 runs. The other 25 were never in any returned page and are missed for good. Fixes: poll more often, so fewer leads arrive between polls; page through results until reaching an ID already seen; or switch to a webhook, which reports every lead as it is created.

</details>

**Question 3.** A payment webhook sometimes arrives twice. The automation sends a "thank you" email and creates an invoice. A colleague proposes the idempotency key `order_id + delivery_id + status`. Explain what will happen with this key, propose a better one, and say where the key should be checked and stored. What extra problem appears if the email step succeeds and the invoice step then fails?

<details>
<summary>View Answer</summary>

The delivery ID identifies one delivery, not the event, and a retry is a new delivery with a new delivery ID. With this key, every retry produces a different key, so every duplicate passes the check: the customer gets two thank-you emails and two invoices are created. The key would only catch the case of the very same delivery being processed twice. A better key is built from what identifies the event, here the order ID and the new status, for example a hash of the canonical JSON of those two fields. Then the retry of "order A1 paid" has the same key and is skipped, while "order A1 refunded" later gets a different key and runs. The key should be checked before the first action that changes anything, before the email is sent, and recorded in durable storage, a database, the workflow tool's data store, or a sheet, not memory, with an expiry long enough to cover the sender's retry window. The partial-failure problem: if the email is sent and the invoice step fails, the run as a whole failed. If the key was recorded at the start, a retry will be skipped and the invoice never created. If the key is recorded only at the end, a retry will run again and send a second email. The usual remedies are to record progress per step, so a retry resumes after the email, or to make each action idempotent on its own: pass the key to the invoicing API as its idempotency key, so a repeated create returns the existing invoice, and check a "thank-you sent" marker before emailing.

</details>

@@starter
"""
Lab: Schedules, Polling, Filters, Paths, and Run-Once Keys
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import hashlib
import json
from datetime import datetime, timedelta

OPERATORS = {
    "equals": lambda field, value: field == value,
    "not_equals": lambda field, value: field != value,
    "contains": lambda field, value: isinstance(field, str) and value.lower() in field.lower(),
    "greater_than": lambda field, value: isinstance(field, (int, float)) and not isinstance(field, bool) and field > value,
    "exists": lambda field, value: field not in (None, ""),
}


def parse_field(text, low, high):
    """Given: the set of values one cron field allows (stars, values, ranges, lists, steps)."""
    values = set()
    for part in text.split(","):
        step = 1
        if "/" in part:
            part, step_text = part.split("/")
            step = int(step_text)
            if step < 1:
                raise ValueError("a step must be at least 1")
        if part == "*":
            start, end = low, high
        elif "-" in part:
            first, last = part.split("-")
            start, end = int(first), int(last)
        else:
            start = end = int(part)
        if not (low <= start <= end <= high):
            raise ValueError("out of range: " + text)
        values.update(range(start, end + 1, step))
    return values


# ---------------------------------------------------------------- Step 1
def cron_matches(expression, when):
    """Five fields: minute (0-59), hour (0-23), day (1-31), month (1-12), weekday (0-6, Sunday is 0).
    Raise ValueError unless there are exactly five fields. Use parse_field for each.
    The weekday of a datetime in cron numbering is (when.weekday() + 1) % 7.
    Minute, hour, and month must all match. If both the day and weekday fields are not "*",
    the day matches when EITHER matches; otherwise both must match. Return True or False."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def poll_new(fetched, seen):
    """fetched: items (dicts with an "id"), newest first. seen: a set of ids, or None on the first poll.
    First poll (seen is None): return ([], set of the fetched ids) as a baseline.
    Otherwise: return (the fetched items whose id is not in seen, in their order,
                       seen together with all fetched ids as a new set). Do not modify seen."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def passes(record, conditions):
    """conditions: a list of (field, operator, value). Every condition must hold, using
    OPERATORS[operator](record.get(field), value). An operator not in OPERATORS raises ValueError.
    An empty list of conditions passes."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def route(record, paths, fallback="fallback"):
    """paths: a list of (name, conditions). Return the names of EVERY path whose conditions the
    record passes, in order. If none match, return [fallback]."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def event_key(event, fields):
    """The first 16 hex characters of the SHA-256 of
    json.dumps({name: event.get(name) for name in fields}, sort_keys=True, separators=(",", ":"))."""
    # TODO Step 5
    return None


def run_once(events, fields, processed):
    """For each event: if its event_key is in processed, count it as skipped; otherwise add the key
    to processed and keep the event. Return (kept events, number skipped)."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("cron :", cron_matches("0 9 * * 1-5", datetime(2026, 11, 16, 9, 0)))
    print("poll :", poll_new([{"id": "r1"}], None))
    print("pass :", passes({"n": 5}, [("n", "greater_than", 3)]))
    print("route:", route({"n": 5}, [("big", [("n", "greater_than", 3)])]))
    print("once :", run_once([{"a": 1}, {"a": 1}], ["a"], set()))

@@solution
"""
Lab solution: Schedules, Polling, Filters, Paths, and Run-Once Keys
Standard library only.
"""
import hashlib
import json
from datetime import datetime, timedelta

OPERATORS = {
    "equals": lambda field, value: field == value,
    "not_equals": lambda field, value: field != value,
    "contains": lambda field, value: isinstance(field, str) and value.lower() in field.lower(),
    "greater_than": lambda field, value: isinstance(field, (int, float)) and not isinstance(field, bool) and field > value,
    "exists": lambda field, value: field not in (None, ""),
}


def parse_field(text, low, high):
    """Given: the set of values one cron field allows (stars, values, ranges, lists, steps)."""
    values = set()
    for part in text.split(","):
        step = 1
        if "/" in part:
            part, step_text = part.split("/")
            step = int(step_text)
            if step < 1:
                raise ValueError("a step must be at least 1")
        if part == "*":
            start, end = low, high
        elif "-" in part:
            first, last = part.split("-")
            start, end = int(first), int(last)
        else:
            start = end = int(part)
        if not (low <= start <= end <= high):
            raise ValueError("out of range: " + text)
        values.update(range(start, end + 1, step))
    return values


# ---------------------------------------------------------------- Step 1
def cron_matches(expression, when):
    """The crontab rule: if both day fields are restricted, either may match. It is the most
    surprising line in any schedule, so preview the next runs before trusting one."""
    fields = expression.split()
    if len(fields) != 5:
        raise ValueError("a cron expression has five fields")
    minute, hour, day, month, weekday = fields
    if when.minute not in parse_field(minute, 0, 59) or when.hour not in parse_field(hour, 0, 23):
        return False
    if when.month not in parse_field(month, 1, 12):
        return False
    day_ok = when.day in parse_field(day, 1, 31)
    weekday_ok = (when.weekday() + 1) % 7 in parse_field(weekday, 0, 6)
    if day != "*" and weekday != "*":
        return day_ok or weekday_ok
    return day_ok and weekday_ok


def next_runs(expression, after, count):
    """A preview of the next runs, a minute at a time."""
    runs, moment = [], after.replace(second=0, microsecond=0) + timedelta(minutes=1)
    while len(runs) < count:
        if cron_matches(expression, moment):
            runs.append(moment)
        moment += timedelta(minutes=1)
    return runs


# ---------------------------------------------------------------- Step 2
def poll_new(fetched, seen):
    """The first poll is a baseline: existing records are old news. After that, only unseen
    primary keys start runs, so edits to a record never trigger."""
    keys = {item["id"] for item in fetched}
    if seen is None:
        return [], keys
    new = [item for item in fetched if item["id"] not in seen]
    return new, seen | keys


# ---------------------------------------------------------------- Step 3
def passes(record, conditions):
    """AND logic. An unknown operator is an error, never a silent False."""
    for name, operator, value in conditions:
        if operator not in OPERATORS:
            raise ValueError("unknown operator: " + operator)
        if not OPERATORS[operator](record.get(name), value):
            return False
    return True


# ---------------------------------------------------------------- Step 4
def route(record, paths, fallback="fallback"):
    """Every matching path runs, as in Zapier Paths and Make routers, and the fallback catches
    records that match nothing, so none vanish silently."""
    matched = [name for name, conditions in paths if passes(record, conditions)]
    return matched or [fallback]


# ---------------------------------------------------------------- Step 5
def event_key(event, fields):
    """Built from the fields that identify the EVENT. Delivery fields, such as the time sent,
    change on every retry and would make each duplicate look new."""
    picked = {name: event.get(name) for name in fields}
    canonical = json.dumps(picked, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:16]


def run_once(events, fields, processed):
    """In real use `processed` lives in durable storage, checked before the first action."""
    done, skipped = [], 0
    for event in events:
        key = event_key(event, fields)
        if key in processed:
            skipped += 1
            continue
        processed.add(key)
        done.append(event)
    return done, skipped


if __name__ == "__main__":
    start = datetime(2026, 11, 16, 8, 30)
    for expression in ("0 9 * * 1-5", "*/15 9-10 * * *", "0 6 1 * 1"):
        print(expression, [run.strftime("%a %d %b %H:%M") for run in next_runs(expression, start, 6)])

    first = [{"id": "r3", "name": "Asha"}, {"id": "r2", "name": "Ben"}, {"id": "r1", "name": "Cal"}]
    second = [{"id": "r5", "name": "Dee"}, {"id": "r4", "name": "Eli"}, {"id": "r3", "name": "Asha"}]
    new, seen = poll_new(first, None)
    print("baseline:", new, sorted(seen))
    new, seen = poll_new(second, seen)
    print("new:", [item["id"] for item in new])

    lead = {"email": "ravi@acme.co.uk", "company": "Acme Tools", "employees": 240, "source": "webinar", "phone": ""}
    paths = [("sales", [("employees", "greater_than", 200)]),
             ("nurture", [("source", "equals", "webinar")]),
             ("partners", [("email", "contains", "partner")])]
    print(route(lead, paths), route({"employees": 12, "source": "ad", "email": "x@y.z"}, paths))

    events = [{"order": "A1", "status": "paid", "sent_at": "09:00:01"},
              {"order": "A1", "status": "paid", "sent_at": "09:00:31"},
              {"order": "A2", "status": "paid", "sent_at": "09:02:00"},
              {"order": "A1", "status": "shipped", "sent_at": "11:00:00"}]
    print(event_key(events[0], ["order", "status"]))
    print(run_once(events, ["order", "status"], set())[1], run_once(events, ["order", "status", "sent_at"], set())[1])

@@step
{
  "stepNumber": 1,
  "title": "Read a cron schedule",
  "instruction": "Implement cron_matches(expression, when). Split the expression on whitespace and raise ValueError unless there are exactly five fields: minute, hour, day of month, month, and day of week. Use the given parse_field with the ranges 0-59, 0-23, 1-31, 1-12, and 0-6. Return False unless the minute, hour, and month all match. The cron weekday of a datetime is (when.weekday() + 1) % 7, since cron counts Sunday as 0. If both the day-of-month and day-of-week fields are something other than '*', the day matches when either matches; otherwise both must match. Check a weekday report, a quarter-hour schedule, and the surprising '0 6 1 * 1'. This is the cron format and the day rule from Section 2. [MOD-7.6]",
  "hintConceptual": "An alarm clock with five dials. Minute, hour, and month must all point at now. The two day dials are odd: if both are set, the alarm rings when either one agrees.",
  "hintSyntax": "fields = expression.split()\nif len(fields) != 5:\n    raise ValueError(\"a cron expression has five fields\")\nminute, hour, day, month, weekday = fields\nif when.minute not in parse_field(minute, 0, 59) or when.hour not in parse_field(hour, 0, 23):\n    return False\nif when.month not in parse_field(month, 1, 12):\n    return False\nday_ok = when.day in parse_field(day, 1, 31)\nweekday_ok = (when.weekday() + 1) % 7 in parse_field(weekday, 0, 6)\nif day != \"*\" and weekday != \"*\":\n    return day_ok or weekday_ok\nreturn day_ok and weekday_ok"
}
@@assert
_monday = datetime(2026, 11, 16, 9, 0)
assert cron_matches("0 9 * * 1-5", _monday) is True and cron_matches("0 9 * * 1-5", datetime(2026, 11, 21, 9, 0)) is False, "Weekdays at nine: Monday 16 November matches, Saturday 21 does not"
assert cron_matches("0 9 * * 1-5", datetime(2026, 11, 16, 9, 1)) is False and cron_matches("*/15 9-10 * * *", datetime(2026, 11, 16, 10, 45)) is True, "Minute and hour must match; */15 includes 45"
assert cron_matches("*/15 9-10 * * *", datetime(2026, 11, 16, 11, 0)) is False and cron_matches("0 0 * 12 *", datetime(2026, 11, 1, 0, 0)) is False, "Hour 11 is outside 9-10, and November is not December"
assert cron_matches("0 6 1 * 1", datetime(2026, 11, 23, 6, 0)) is True and cron_matches("0 6 1 * 1", datetime(2026, 12, 1, 6, 0)) is True, "With both day fields restricted, a Monday or the 1st matches"
assert cron_matches("0 6 1 * 1", datetime(2026, 11, 24, 6, 0)) is False, "A Tuesday that is not the 1st does not match"
assert cron_matches("0 6 1 * *", datetime(2026, 11, 23, 6, 0)) is False and cron_matches("0 6 * * 0", datetime(2026, 11, 22, 6, 0)) is True, "With one day field a star, both must match; Sunday is 0"
_runs = [t for t in (datetime(2026, 11, 16, 8, 30) + timedelta(minutes=m) for m in range(1, 60 * 24 * 8)) if cron_matches("0 9 * * 1-5", t)]
assert [t.day for t in _runs] == [16, 17, 18, 19, 20, 23], f"Six runs in the next eight days, got {[t.day for t in _runs]}"
try:
    cron_matches("0 9 * *", _monday)
    raise AssertionError("Four fields must raise ValueError")
except ValueError:
    pass
print("Step 1 passed: weekdays at nine, and 0 6 1 * 1 runs on Mondays and on the 1st.")

@@step
{
  "stepNumber": 2,
  "title": "Poll for new records",
  "instruction": "Implement poll_new(fetched, seen). The fetched items are dicts with an 'id', newest first. If seen is None, this is the first poll: return an empty list and the set of fetched ids, a baseline that starts no runs. Otherwise return the fetched items whose id is not in seen, in their original order, and a new set holding seen plus every fetched id. Do not modify the seen set you were given. Poll a lead list three times and check that only r5 and r4 count as new. This is polling with deduplication from Section 2. [MOD-7.6]",
  "hintConceptual": "Checking the letterbox: the first time, you just note what is already there. After that, you only open envelopes you have not seen before, and you keep a list of every envelope you have handled.",
  "hintSyntax": "keys = {item[\"id\"] for item in fetched}\nif seen is None:\n    return [], keys\nnew = [item for item in fetched if item[\"id\"] not in seen]\nreturn new, seen | keys"
}
@@assert
_first = [{"id": "r3", "name": "Asha"}, {"id": "r2", "name": "Ben"}, {"id": "r1", "name": "Cal"}]
_second = [{"id": "r5", "name": "Dee"}, {"id": "r4", "name": "Eli"}, {"id": "r3", "name": "Asha"}]
_result = poll_new(_first, None)
assert _result is not None and _result == ([], {"r1", "r2", "r3"}), f"The first poll is a baseline that runs nothing, got {_result}"
_new, _seen = poll_new(_second, _result[1])
assert [item["id"] for item in _new] == ["r5", "r4"] and _seen == {"r1", "r2", "r3", "r4", "r5"}, "Only unseen ids are new, newest first"
assert poll_new(_second, _seen) == ([], _seen), "Polling the same page again finds nothing new"
_kept = {"r1"}
poll_new([{"id": "r9"}], _kept)
assert _kept == {"r1"}, "The seen set passed in is not modified"
_edited = [{"id": "r3", "name": "Asha Patel"}]
assert poll_new(_edited, _seen)[0] == [], "An edited record keeps its id, so it does not trigger"
assert poll_new([], {"r1"}) == ([], {"r1"}) and poll_new([], None) == ([], set()), "An empty page changes nothing"
print("Step 2 passed: a baseline first, then only r5 and r4, and edits do not trigger.")

@@step
{
  "stepNumber": 3,
  "title": "Filter a record",
  "instruction": "Implement passes(record, conditions). Each condition is a tuple of field name, operator, and value. For each, raise ValueError if the operator is not in OPERATORS; otherwise call OPERATORS[operator] with record.get(field) and the value, and return False as soon as one fails. Return True if every condition holds, including when there are none. Check a lead against size, email, and phone conditions, and see that the text '240' is not greater than 50. This is the filter step from Section 2. [MOD-7.6]",
  "hintConceptual": "A bouncer with a checklist: go down the list, and the first rule that fails means no entry. An empty list lets everyone in. A rule written in a language the bouncer does not know is a mistake to report, not a reason to turn people away.",
  "hintSyntax": "for name, operator, value in conditions:\n    if operator not in OPERATORS:\n        raise ValueError(\"unknown operator: \" + operator)\n    if not OPERATORS[operator](record.get(name), value):\n        return False\nreturn True"
}
@@assert
_lead = {"email": "ravi@acme.co.uk", "company": "Acme Tools", "employees": 240, "source": "webinar", "phone": ""}
assert passes(_lead, [("employees", "greater_than", 50), ("email", "contains", "@")]) is True, "The lead passes size and email checks"
assert passes(_lead, [("employees", "greater_than", 50), ("source", "equals", "Webinar")]) is False, "Equals is exact, so 'Webinar' is not 'webinar'"
assert passes(_lead, [("phone", "exists", None)]) is False and passes(_lead, [("company", "exists", None)]) is True, "Empty text does not exist"
assert passes({"employees": "240"}, [("employees", "greater_than", 50)]) is False and passes({"vip": True}, [("vip", "greater_than", 0)]) is False, "Text and booleans are not numbers"
assert passes(_lead, [("company", "contains", "ACME")]) is True and passes(_lead, [("missing", "not_equals", "x")]) is True, "Contains ignores case; a missing field differs from everything"
assert passes(_lead, []) is True, "No conditions means pass"
try:
    passes(_lead, [("employees", "bigger", 5)])
    raise AssertionError("An unknown operator must raise ValueError")
except ValueError:
    pass
print("Step 3 passed: the lead passes, an empty phone does not exist, and '240' is not a number.")

@@step
{
  "stepNumber": 4,
  "title": "Route down paths with a fallback",
  "instruction": "Implement route(record, paths, fallback). The paths are a list of name and conditions pairs. Return the names of every path whose conditions the record passes, using passes, in the order the paths are listed. If no path matches, return a list holding only the fallback name. Route a large webinar lead, which matches two paths, and a small lead from an ad, which matches none. This is the every-matching-path behaviour of Zapier Paths and Make routers from Section 2. [MOD-7.6]",
  "hintConceptual": "A post room with labelled trays: a letter goes in every tray whose label fits it, and a letter that fits none goes in the 'other' tray instead of the bin.",
  "hintSyntax": "matched = [name for name, conditions in paths if passes(record, conditions)]\nreturn matched or [fallback]"
}
@@assert
_paths = [("sales", [("employees", "greater_than", 200)]), ("nurture", [("source", "equals", "webinar")]), ("partners", [("email", "contains", "partner")])]
_lead = {"email": "ravi@acme.co.uk", "company": "Acme Tools", "employees": 240, "source": "webinar", "phone": ""}
assert route(_lead, _paths) == ["sales", "nurture"], f"Every matching path runs, in order, got {route(_lead, _paths)}"
assert route({"employees": 12, "source": "ad", "email": "x@y.z"}, _paths) == ["fallback"], "A record matching nothing goes to the fallback"
assert route({"employees": 12, "source": "ad", "email": "x@y.z"}, _paths, fallback="log") == ["log"], "The fallback name is an argument"
assert route({"email": "sam@partner.io", "employees": 500, "source": "ad"}, _paths) == ["sales", "partners"], "Order follows the list of paths"
assert route({}, []) == ["fallback"] and route({"a": 1}, [("all", [])]) == ["all"], "No paths means the fallback, and a path with no conditions always matches"
print("Step 4 passed: the webinar lead goes to sales and nurture, and the small lead to the fallback.")

@@step
{
  "stepNumber": 5,
  "title": "Run each event once",
  "instruction": "Implement event_key(event, fields): build a dict of each named field and its value from the event (None if absent), write it with json.dumps using sort_keys=True and separators (',', ':'), and return the first 16 hexadecimal characters of its SHA-256 digest. Then implement run_once(events, fields, processed): for each event, if its key is already in the processed set, count it as skipped; otherwise add the key and keep the event. Return the kept events and the number skipped. Compare a key of order and status with one that also includes the send time. This is the idempotency key from Section 2. [MOD-7.6]",
  "hintConceptual": "A cloakroom ticket for each coat, numbered by the coat, not by the time you handed it in. If the same coat comes back with a different time, it still has the same ticket, so it is not hung twice.",
  "hintSyntax": "picked = {name: event.get(name) for name in fields}\ncanonical = json.dumps(picked, sort_keys=True, separators=(\",\", \":\"))\nreturn hashlib.sha256(canonical.encode(\"utf-8\")).hexdigest()[:16]\n\n# run_once\ndone, skipped = [], 0\nfor event in events:\n    key = event_key(event, fields)\n    if key in processed:\n        skipped += 1\n        continue\n    processed.add(key)\n    done.append(event)\nreturn done, skipped"
}
@@assert
_events = [{"order": "A1", "status": "paid", "sent_at": "09:00:01"}, {"order": "A1", "status": "paid", "sent_at": "09:00:31"},
           {"order": "A2", "status": "paid", "sent_at": "09:02:00"}, {"order": "A1", "status": "shipped", "sent_at": "11:00:00"}]
assert event_key(_events[0], ["order", "status"]) == "52df2f1b464d5b52", f"The key of A1 paid, got {event_key(_events[0], ['order', 'status'])}"
assert event_key(_events[0], ["order", "status"]) == event_key(_events[1], ["order", "status"]) == event_key({"status": "paid", "order": "A1"}, ["status", "order"]), "Same event, same key, in any field order"
assert event_key({"order": "A1"}, ["order", "status"]) == event_key({"order": "A1", "status": None}, ["order", "status"]), "A missing field counts as None"
_processed = set()
_done, _skipped = run_once(_events, ["order", "status"], _processed)
assert [(e["order"], e["status"]) for e in _done] == [("A1", "paid"), ("A2", "paid"), ("A1", "shipped")] and _skipped == 1, "The retry of A1 paid is skipped"
assert len(_processed) == 3 and run_once(_events, ["order", "status"], _processed) == ([], 4), "The processed set remembers, so replaying everything does nothing"
assert run_once(_events, ["order", "status", "sent_at"], set())[1] == 0, "A key with the send time lets the retry through"
print("Step 5 passed: the retried payment runs once, and a key with the send time would have let it through.")
