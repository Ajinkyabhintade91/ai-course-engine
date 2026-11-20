@@meta
{
  "moduleId": "MOD-7.1",
  "slug": "mod-7-1",
  "unitId": "UNIT-7",
  "unitTitle": "Unit 7: AI Automation Masterclass",
  "title": "What is Automation?",
  "difficulty": "Foundational",
  "estimatedMinutes": 80,
  "citations": [
    { "title": "Is It Worth the Time? (xkcd 1205)", "source": "xkcd", "url": "https://xkcd.com/1205/" },
    { "title": "Generative AI at Work", "source": "National Bureau of Economic Research", "url": "https://www.nber.org/papers/w31161" },
    { "title": "The economic potential of generative AI: The next productivity frontier", "source": "McKinsey Global Institute", "url": "https://www.mckinsey.com/mgi/our-research/the-economic-potential-of-generative-ai-the-next-productivity-frontier/" },
    { "title": "Agentic automation", "source": "UiPath", "url": "https://uipath.com/automation/agentic-automation" },
    { "title": "Building effective agents", "source": "Anthropic Engineering", "url": "https://www.anthropic.com/engineering/building-effective-agents" }
  ],
  "videoLibrary": [
    {
      "id": "VID-7.1-1",
      "title": "Workflow Automation Explained | Boost Productivity Without Writing Code",
      "creator": "Wrike",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=oqv1JA4j45Y",
      "timingInstruction": "Watch after reading Section 1, for a short picture of triggers, rules, and repeatable processes in a business setting",
      "keyTakeaway": "A plain account of what workflow automation is and the kind of routine work it removes."
    },
    {
      "id": "VID-7.1-2",
      "title": "What is Business Process Automation? Pros, Cons, Myths & Tips",
      "creator": "airSlate",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=MM20QXEGdAc",
      "timingInstruction": "Watch after reading Section 2 (classic automation and AI automation), to see where agents sit at the far end of the range",
      "keyTakeaway": "What business process automation is, with its benefits and common misconceptions."
    },
    {
      "id": "VID-7.1-3",
      "title": "80% of AI Automation Basics in Just 29 Minutes",
      "creator": "Nick Saraev",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=4PZYb86j4wg",
      "timingInstruction": "Watch after completing the lab, as a look ahead to the agentic workflows of Unit 8",
      "keyTakeaway": "Core automation concepts: triggers, actions, and where AI fits."
    },
    {
      "id": "VID-7.1-4",
      "title": "Generative AI Automation Tools and Applications",
      "creator": "Edureka",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/generative-ai-automation-tools-and-applications",
      "timingInstruction": "Take alongside the first half of this unit, as a survey of the automation tools it covers",
      "keyTakeaway": "An overview of AI automation tools and where they are applied, including the workflow platforms of later chapters."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Is It Worth It, What First, Which Kind, Rules, and Errors",
    "context": "A small online tool shop spends hours each week on routine work and wants to know what to automate first and how. You will build a calculator of whether an automation pays for itself, a ranking of tasks by the time they cost, a rule for choosing between classic automation and AI, a tiny rule engine of triggers, conditions, and actions, and a comparison of the errors made by people and by automations.",
    "language": "python"
  }
}

@@reading
# What is Automation?

This unit is about making computers do the routine work of a business: copying data between systems, sending the right email at the right moment, filing, summarising, alerting. Some of it has been automated for decades with fixed rules. What has changed is that language models can now handle work that rules never could, such as reading an email and deciding what it is about.

The unit runs from the ideas to the tools to six complete projects. This first chapter sets up the questions that every automation should answer before it is built. What exactly is being automated? Is it worth it? Should the logic be rules, AI, or a person with AI to help? And what happens when it goes wrong?

## 1. First-Principles Mental Model & Intuition

### A thermostat, a clerk, and a manager

Three ways of getting a routine job done show the range.

A **thermostat** follows a rule: when the room is below 19 degrees, turn on the heating. It never gets tired or distracted, and it never handles anything its rule did not foresee. That is classic automation.

A **clerk** reads each incoming letter, decides what it is about, and puts it in the right tray. Clerks handle variety that no rule can describe in advance. They also make mistakes, and their work costs time. Much of what language models now automate is clerical work of this kind.

A **manager** decides what to do when something unusual happens, and answers for it. That work stays with people, though AI can prepare it.

Most real processes mix all three: rules for what is predictable, judgement for what varies, and a person for what matters.

### The parts of an automation

```text
   TRIGGER  ------>  CONDITIONS  ------>  ACTIONS  ------>  RECORD
   something         is this a case       do the work:      what happened,
   happens:          we act on?           copy, send,       so that it can
   an order,         country = GB,        file, notify,     be checked and
   an email,         total over 200       summarise         undone
   9 am Monday
```

Every automation in this unit, from a two-step rule to an AI agent, has these four parts. Later chapters give each of them a chapter: triggers and actions in Module 7.6, the data that passes between them in Module 7.5, and the record and what happens on failure in Module 7.14.

### The first question is not "how"

People new to automation start with a tool and look for something to automate. The order that works is the reverse:

1. Write down the process as it is actually done today.
2. Measure it: how often, how long, how often it goes wrong.
3. Decide whether it is worth automating, and which parts.
4. Only then choose rules, AI, or a person, and a tool.

A process that is unclear when done by hand becomes a mess when automated. A common saying among automation builders is to automate a process that works, not one that is broken.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Automation defined

Automation is the performance of a repeatable process by a machine, started by a trigger and governed by explicit logic. Three properties separate it from simply using software.

| Property | Meaning |
|---|---|
| **Triggered** | It starts by itself when something happens or at a set time |
| **Repeatable** | The same kind of input is handled the same way every time |
| **Unattended** | It runs without someone driving each step |

A spreadsheet formula is not automation in this sense, because someone has to open the spreadsheet. A rule that adds every new order to the spreadsheet automatically is.

### What to automate

Three measurements decide most cases.

**Frequency.** How often the task happens. Something done once a year rarely repays the work of automating it.

**Time.** How long it takes each time, including the time spent switching to it and back.

**Error rate and cost.** How often it goes wrong when done by hand, and how long a mistake takes to find and fix. Copying a figure between systems is quick until the figure is wrong and someone spends half an hour tracing why an invoice does not balance.

Together they give the hours a task costs in a year:

$$
\text{hours per year} = \frac{n \times (t + e \times f)}{60}
$$

where $n$ is the number of times a year, $t$ the minutes each time, $e$ the error rate, and $f$ the minutes to fix an error. Ranking tasks by this figure shows where automation pays most. Section 3 ranks four tasks from a tool shop and finds that copying invoices, a four-minute job, costs more hours than a weekly report that takes three quarters of an hour, because it happens twenty-three times as often.

### Is it worth it?

A well-known chart from the webcomic xkcd, titled "Is It Worth the Time?", tabulates how long you can spend making a routine task faster before you have spent more time than you will save, over five years. Shaving one minute off something done daily is worth about a day of effort. Shaving one minute off something done weekly is worth about four hours.

The arithmetic behind it is the same for any automation. Over a horizon of $Y$ years, a task done $n$ times a year that the automation saves $s$ minutes on saves

$$
\text{hours saved} = \frac{s \times n \times Y}{60}
$$

against a cost of the hours to build it, $B$, plus the hours to maintain it, $M$ a year:

$$
\text{hours spent} = B + M \times Y
$$

The automation pays for itself after

$$
\text{payback months} = \frac{B}{\dfrac{s \times n}{60 \times 12} - \dfrac{M}{12}}
$$

provided the monthly saving is larger than the monthly maintenance. If it is not, the automation never pays back, however long it runs.

Maintenance is the term people forget. Every automation breaks sometimes: an app changes its interface, a password expires, a supplier changes the format of their invoices. A task that saves two minutes fifty times a year, and takes three hours a year to keep running, loses time forever.

### Classic automation and AI automation

| | Classic, rule-based automation | AI automation |
|---|---|---|
| Logic | Explicit rules written in advance | A model's judgement, guided by a prompt |
| Input | Structured: fields, forms, numbers | Unstructured too: emails, documents, images |
| Behaviour | The same every time | Usually right, sometimes not |
| When it fails | Predictably, on cases the rules did not cover | Unpredictably, with a plausible wrong answer |
| Cost per run | Nearly nothing | A model call, cents or fractions of a cent |
| Example | Copy each new order into the accounts | Read each customer email and decide its category |

The table points to the practical rule. **Use rules wherever rules can do the job.** They are cheaper, faster, and predictable. Use AI for the steps that rules cannot express, mostly reading and writing language, and put a check around it.

The vendors who built their businesses on rule-based software robots, an approach called robotic process automation, now describe a range that runs from fixed robots through AI-assisted steps to autonomous agents, and say plainly that the rule-based robots are not going away. Anthropic's guidance on building with language models makes a similar point from the other side: use the simplest arrangement that works, and add autonomy only when it is needed.

### Choosing an approach

| The task | Approach |
|---|---|
| Structured input, clear rules | Classic automation |
| Unstructured input, low stakes, easily undone | AI automation |
| Unstructured input, low stakes, hard to undo | AI automation, with a person reviewing before it acts |
| High stakes, whatever the input | AI prepares, a person decides |

"Hard to undo" covers sending an email, paying money, deleting records, or publishing. Module 6.12 built an approval gate for exactly that reason. "High stakes" covers anything where a wrong decision harms someone: a refund refused, a complaint mishandled, a legal notice ignored.

### What the evidence says

Studies of AI in real work suggest large gains from automating the right parts. A study of more than five thousand customer support agents, by Brynjolfsson, Li, and Raymond, found that giving them an AI assistant raised the number of issues resolved per hour by 14 percent on average, and by 34 percent for the newest and least experienced agents, with little effect for the most experienced. The finding has a lesson for automation design: AI raised the floor more than the ceiling, by supplying the know-how that experienced people already had.

Estimates of the economic potential are large and uncertain. A 2023 analysis by McKinsey put the value of generative AI across the use cases it studied at trillions of dollars a year, concentrated in customer operations, marketing and sales, software, and research. Treat such figures as a sign of where the opportunities are, not as a forecast for any one business.

### Errors

An automation changes the errors a process makes. A person copying invoices makes occasional slips. An automation copying them makes none of those, and instead fails in new ways: every invoice at once, when the supplier changes their format.

If a task runs $n$ times, with a human error rate $h$ and an automated error rate $a$, and a review step catches a share $c$ of the automated errors, the expected errors are:

$$
\text{manual} = n\,h \qquad \text{automated} = n\,a\,(1 - c)
$$

For a rule copying 1,200 invoices, with a person wrong 3 percent of the time and the rule 0.2 percent, automation cuts the errors from 36 to 2.4. For an AI drafting 600 replies, wrong 5 percent of the time against a person's 1 percent, automation raises them from 6 to 30, and only a review that catches 90 percent brings them down to 3. AI automation without review can make a process worse, faster.

### Complexity

Ranking tasks and computing payback are linear in the number of tasks. A rule engine checks each rule once per event. The cost that matters is the build and maintenance time, which the payback formula makes visible.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, whether an automation pays.

```python
def worth_it(minutes_saved_per_run, runs_per_year, build_hours, maintain_hours_per_year=0.0, horizon_years=5):
    saved = minutes_saved_per_run * runs_per_year * horizon_years / 60
    cost = build_hours + maintain_hours_per_year * horizon_years
    monthly_net = minutes_saved_per_run * runs_per_year / 60 / 12 - maintain_hours_per_year / 12
    payback = round(build_hours / monthly_net, 1) if monthly_net > 0 else None
    return {"saved_hours": round(saved, 1), "cost_hours": round(cost, 1), "net_hours": round(saved - cost, 1), "payback_months": payback}

print(worth_it(1, 365, 0))
print(worth_it(5, 250, 20, maintain_hours_per_year=4))
print(worth_it(30, 12, 20, maintain_hours_per_year=2))
print(worth_it(2, 50, 10, maintain_hours_per_year=3))
```

- **The first line is the xkcd example.** A minute saved every day for five years is 30.4 hours, a little over a day of work. With no build cost it is all profit.
- **Five minutes saved on 250 working days, for 20 hours of building and 4 a year of upkeep, saves 104 hours and costs 40.** It pays back in about fourteen months and is worth doing.
- **Half an hour saved once a month exactly breaks even.** It saves 30 hours over five years and costs 30. The payback is sixty months: the whole horizon.
- **Two minutes saved fifty times a year never pays back.** The saving of about 1.7 hours a year is less than the three hours a year of upkeep alone. The function reports no payback at all.
- **Maintenance is what decides the marginal cases.** An automation with no upkeep cost is rare. Estimate it honestly, or the arithmetic flatters every idea.

Next, which tasks first.

```python
TASKS = [
    {"name": "copy invoices into the ledger", "runs_per_year": 1200, "minutes": 4, "error_rate": 0.03, "fix_minutes": 30},
    {"name": "weekly sales report", "runs_per_year": 52, "minutes": 45, "error_rate": 0.05, "fix_minutes": 60},
    {"name": "reply to supplier emails", "runs_per_year": 600, "minutes": 6, "error_rate": 0.01, "fix_minutes": 20},
    {"name": "annual stock take", "runs_per_year": 1, "minutes": 480, "error_rate": 0.1, "fix_minutes": 240},
]

def task_hours(task):
    return round(task["runs_per_year"] * (task["minutes"] + task["error_rate"] * task["fix_minutes"]) / 60, 1)

def rank_tasks(tasks):
    return sorted(((task["name"], task_hours(task)) for task in tasks), key=lambda row: (-row[1], row[0]))

for name, hours in rank_tasks(TASKS):
    print(f"{hours:>6} h  {name}")
```

- **Each task's yearly hours include its errors.** The time to do it, plus the expected number of mistakes times the time to fix one.
- **Copying invoices comes first at 98 hours.** Four minutes each, 1,200 times, plus 36 mistakes a year at half an hour each. Eighteen of its 98 hours are spent fixing errors.
- **Supplier emails are second at 62 hours.** Short and frequent.
- **The weekly report is third at 41.6 hours.** It feels like the biggest chore, because it is the longest task done every week. It is not the biggest cost.
- **The stock take is last at 8.4 hours.** Long and unpleasant, and once a year. It is the classic thing people want to automate and the one that pays least.

Then, which kind of automation.

```python
def choose_approach(task):
    if task["structured_input"] and task["rules_clear"]:
        return "classic automation"
    if task["stakes"] == "high":
        return "AI assists a person"
    if task["reversible"]:
        return "AI automation"
    return "AI automation with review"

print(choose_approach({"structured_input": True, "rules_clear": True, "stakes": "high", "reversible": False}))
print(choose_approach({"structured_input": False, "rules_clear": False, "stakes": "high", "reversible": True}))
print(choose_approach({"structured_input": False, "rules_clear": True, "stakes": "low", "reversible": True}))
print(choose_approach({"structured_input": False, "rules_clear": False, "stakes": "low", "reversible": False}))
```

- **Rules come first.** If the input is structured and the rules are clear, classic automation is right whatever the stakes. Copying an invoice's total into the ledger is high stakes and needs no AI at all.
- **High stakes with unstructured input means AI assists and a person decides.** A complaint threatening legal action can be summarised by a model. A person replies.
- **Low stakes and easily undone means AI can act alone.** Tagging an email with a category that someone can change in a click.
- **Low stakes and hard to undo means AI with review.** Drafting a reply to a supplier is low stakes, and sending it cannot be undone, so a person approves before it goes.
- **The order of the questions is the point.** "Can rules do it?" is asked before AI is considered.

Finally, a rule engine and the error comparison.

```python
RULES = [
    {"when": "order.created", "if": {"country": "GB"}, "then": "send UK delivery email"},
    {"when": "order.created", "if": {"total_over": 200}, "then": "notify owner of large order"},
    {"when": "order.created", "if": {}, "then": "add row to orders sheet"},
    {"when": "order.refunded", "if": {}, "then": "update stock"},
]

def matches(conditions, data):
    for key, value in conditions.items():
        if key.endswith("_over"):
            if not data.get(key[:-5], 0) > value:
                return False
        elif data.get(key) != value:
            return False
    return True

def run_rules(event, data, rules):
    return [rule["then"] for rule in rules if rule["when"] == event and matches(rule["if"], data)]

def expected_errors(runs, human_error, automated_error, review_catch=0.0):
    return {"manual": round(runs * human_error, 1), "automated": round(runs * automated_error * (1 - review_catch), 1)}

print(run_rules("order.created", {"country": "GB", "total": 240}, RULES))
print(run_rules("order.created", {"country": "FR", "total": 90}, RULES))
print(run_rules("order.shipped", {}, RULES))
print(expected_errors(1200, 0.03, 0.002), expected_errors(600, 0.01, 0.05), expected_errors(600, 0.01, 0.05, review_catch=0.9))
```

- **Each rule is a trigger, conditions, and an action.** The structure from Section 1, written as data.
- **Conditions are field values to match, or a field that must be over a number.** A key ending in "_over" compares the field named before it. An empty set of conditions always matches.
- **A UK order of 240 pounds fires three actions.** The delivery email, the large-order alert, and the spreadsheet row.
- **A French order of 90 fires only the row.** It is neither British nor large.
- **An event no rule listens for fires nothing.** That is correct, and also the silent failure to watch for: a rule that should have fired and did not.
- **The error comparison shows both directions.** Rules copying invoices cut errors from 36 to 2.4 a year. AI drafting replies raises them from 6 to 30. With a review catching nine in ten, they fall to 3.

**Complexity.** `worth_it` and `choose_approach` are constant time. `rank_tasks` sorts the tasks. `run_rules` checks every rule against each event.

### A one-page automation brief

```text
PROCESS:      [name]           OWNER: [who answers for it]
TODAY:        [steps as done by hand, numbered]
MEASURED:     [runs a year]  x  [minutes each]   errors: [rate], [minutes to fix]
WORTH IT?     build [hours], upkeep [hours a year], payback [months]
APPROACH:     [rules / AI / AI with review / AI assists a person], and why
TRIGGER:      [what starts it]       CONDITIONS: [which cases]
ACTIONS:      [what it does]         HARD TO UNDO: [which actions need approval]
ON FAILURE:   [who is told, how, and what is retried]
RECORD:       [where each run is logged]
```

### Signs a process is not ready

| Sign | Do first |
|---|---|
| Two people do it two different ways | Agree one way |
| Nobody can say how often it goes wrong | Measure it for a month |
| The rules have many unwritten exceptions | Write them down |
| It changes every few weeks | Wait until it settles |
| Nobody owns the result | Name an owner |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Starting from the tool.** "We bought an automation platform, what should we automate?" leads to automating whatever is easiest to connect, not what costs most. Start from the process list and the hours.

**Automating a broken process.** A process with unclear steps and unwritten exceptions becomes an automation that fails on the exceptions, silently. Fix the process by hand first.

**Forgetting maintenance.** Every connection breaks eventually: an expired credential, a changed form, a renamed column. Count upkeep in the business case, and give every automation an owner.

**AI where a rule would do.** Sending every order through a language model to decide whether it is over 200 pounds is slow, costly, and occasionally wrong. Use a comparison.

**Rules where AI is needed.** Endless keyword rules to sort customer emails grow into an unmaintainable list that still misses half the cases. That is the job a language model does well.

**No review on irreversible actions.** An AI that sends emails, issues refunds, or deletes records without a person in the loop will eventually do one of those things wrongly, at scale.

**Silent failure.** An automation that stops running looks exactly like one that has nothing to do. Make it report: a daily count, an alert on errors, a check that it ran.

**One giant automation.** A single workflow with forty steps that does everything is impossible to debug. Small automations with clear inputs and outputs, joined together, are easier to understand and repair.

**Automating the annual job first.** The stock take is painful and memorable, and automating it saves a few hours a year. The four-minute task done every day is the one that matters.

**Measuring nothing afterwards.** Without a before and after, nobody knows whether the automation saved time or simply moved the work to fixing it. Measure both.

**Trusting averages for AI.** An AI step that is right 95 percent of the time is wrong once in twenty runs. On 600 runs a year, that is 30 mistakes. Multiply before deciding whether a review is needed.

**Removing the person who knew how it worked.** When an automation fails, someone must be able to do the job by hand. Keep the written process and the knowledge.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Automation is a repeatable process performed by a machine, started by a trigger and governed by explicit logic, and every automation has the same four parts: a trigger, conditions, actions, and a record. Before building one, write down and measure the process: a task costs $n(t + ef)/60$ hours a year, counting the time to fix its errors, and ranking tasks by that figure shows where to start, which is usually a short frequent task and not a long rare one. An automation saving $s$ minutes on $n$ runs a year pays back its build time $B$ after $B$ divided by the monthly saving net of maintenance, and never pays back if maintenance exceeds the saving. Classic, rule-based automation suits structured input and clear rules, and is cheap and predictable. AI automation handles unstructured input such as language, with plausible and occasional errors, so the choice of approach asks first whether rules can do it, then how high the stakes are and whether the action can be undone. Automation changes errors more than it removes them: rules cut slips and fail all at once on change, and AI without review can raise the error count, so review on irreversible actions is essential.

**Question 1.** A task takes 3 minutes, is done 1,000 times a year, and goes wrong 2 percent of the time, each mistake taking 45 minutes to fix. How many hours does it cost a year? An automation would take 30 hours to build and 6 hours a year to maintain, and would remove the task entirely, including its errors. What is the payback period, and what is the net saving over five years?

<details>
<summary>View Answer</summary>

Each run costs 3 minutes plus the expected fixing time, 0.02 times 45, which is 0.9 minutes, so 3.9 minutes. Over 1,000 runs that is 3,900 minutes, or 65 hours a year. If the automation removes the task and its errors, it saves 3.9 minutes a run, 65 hours a year. The monthly saving is 65 divided by 12, about 5.42 hours, and the monthly maintenance is 6 divided by 12, 0.5 hours, leaving a net of about 4.92 hours a month. The build cost of 30 hours is recovered after 30 divided by 4.92, about 6.1 months. Over five years the automation saves 65 times 5, which is 325 hours, and costs 30 to build plus 6 times 5, which is 30, to maintain: 60 hours in all. The net saving is 265 hours, more than six working weeks. Two cautions apply. The assumption that the automation removes every error is generous: it will have failures of its own, so its error rate and the time to deal with its failures belong in the estimate. And the maintenance estimate should be checked after the first year, since it is the figure most often underestimated.

</details>

**Question 2.** For each of these, choose an approach using this chapter's rule and say why: (a) copying the total of each paid order from the shop into the accounting system; (b) sorting incoming customer emails into "order question", "return", "complaint", and "other", where staff can re-sort with one click; (c) replying to customers who ask about the status of a return; (d) deciding whether to grant a refund to a customer who says the product injured them.

<details>
<summary>View Answer</summary>

For (a), the input is structured, a number in a known field, and the rule is clear, so classic automation is right. It is high stakes, since accounts must be accurate, but that argues for rules and against AI: a rule copies the number exactly every time, and a language model could misread or mistype it. For (b), the input is unstructured text and no fixed set of keywords sorts it well, so rules are a poor fit. The stakes are low and the action is easily undone, since a member of staff can re-sort a misfiled email with one click, so AI automation without review is reasonable, with a check of its accuracy now and then. For (c), the input is unstructured, the stakes are low, but sending a reply cannot be undone: a wrong or badly worded reply reaches the customer. That calls for AI automation with review, where the model looks up the return and drafts the reply and a person approves it before it is sent. Once the drafts are reliably right, the review might be reduced to a sample, but that is a later decision based on measured accuracy. For (d), the stakes are high: an injury claim may have legal and safety consequences, and a wrong decision harms the customer or the business. AI should assist a person, perhaps by summarising the history and the claim, and a person decides and replies, with the case escalated according to the business's procedure for injuries.

</details>

**Question 3.** A business automates its supplier email replies with an AI that is wrong 4 percent of the time, replacing a person who was wrong 1 percent of the time. It handles 800 emails a year. Compare the expected errors with no review and with a review that catches 85 percent of the AI's mistakes. What would justify the automation, and what would you measure after launching it?

<details>
<summary>View Answer</summary>

By hand, 800 emails at a 1 percent error rate give 8 errors a year. The AI without review, at 4 percent, gives 32 errors, four times as many. With a review that catches 85 percent of the AI's mistakes, 15 percent get through, so 800 times 0.04 times 0.15, which is 4.8 errors a year, fewer than by hand. So the automation is only better with review. What justifies it is time, provided the review is much quicker than writing. If writing a reply by hand takes six minutes and reviewing a draft takes one, the 800 emails cost 80 hours by hand and about 13 hours of review plus whatever time is spent fixing the drafts that fail review, so the automation could save most of the hours and reduce the errors at the same time. It is not justified if the review is rushed, which lowers the catch rate and the protection with it, or if fixing rejected drafts takes as long as writing from scratch. After launch I would measure the share of drafts approved without edits, the share edited, and the share rejected, the minutes spent per email, and the errors that reach suppliers, from complaints and corrections. I would compare all of these with the figures by hand. If the approval rate is high and stable over a couple of months, the review might be reduced to a sample for routine emails. If it is low, the prompt, the examples, or the information given to the model needs work, or the task is not yet suited to automation.

</details>

@@starter
"""
Lab: Is It Worth It, What First, Which Kind, Rules, and Errors
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""

TASKS = [
    {"name": "copy invoices into the ledger", "runs_per_year": 1200, "minutes": 4, "error_rate": 0.03, "fix_minutes": 30},
    {"name": "weekly sales report", "runs_per_year": 52, "minutes": 45, "error_rate": 0.05, "fix_minutes": 60},
    {"name": "reply to supplier emails", "runs_per_year": 600, "minutes": 6, "error_rate": 0.01, "fix_minutes": 20},
    {"name": "annual stock take", "runs_per_year": 1, "minutes": 480, "error_rate": 0.1, "fix_minutes": 240},
]

RULES = [
    {"when": "order.created", "if": {"country": "GB"}, "then": "send UK delivery email"},
    {"when": "order.created", "if": {"total_over": 200}, "then": "notify owner of large order"},
    {"when": "order.created", "if": {}, "then": "add row to orders sheet"},
    {"when": "order.refunded", "if": {}, "then": "update stock"},
]


# ---------------------------------------------------------------- Step 1
def worth_it(minutes_saved_per_run, runs_per_year, build_hours, maintain_hours_per_year=0.0, horizon_years=5):
    """saved  = minutes_saved_per_run * runs_per_year * horizon_years / 60
    cost   = build_hours + maintain_hours_per_year * horizon_years
    monthly_net = minutes_saved_per_run * runs_per_year / 60 / 12 - maintain_hours_per_year / 12
    payback = build_hours / monthly_net rounded to 1 place, or None if monthly_net <= 0
    Return {"saved_hours", "cost_hours", "net_hours" (saved - cost), all rounded to 1 place,
            "payback_months": payback}."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def rank_tasks(tasks):
    """A task's yearly hours = runs_per_year * (minutes + error_rate * fix_minutes) / 60,
    rounded to 1 place. Return a list of (name, hours), sorted by hours from highest to
    lowest, ties in alphabetical order of name."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def choose_approach(task):
    """task has structured_input (bool), rules_clear (bool), stakes ("high" or "low"),
    reversible (bool). Return the first that applies:
        structured_input and rules_clear  -> "classic automation"
        stakes == "high"                  -> "AI assists a person"
        reversible                        -> "AI automation"
        otherwise                         -> "AI automation with review"
    """
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def run_rules(event, data, rules):
    """Each rule is {"when": event name, "if": conditions, "then": action}. A rule fires if its
    "when" equals the event and every condition holds:
        a key ending in "_over" (e.g. "total_over": 200) holds if data[field] > value, where field
        is the key without "_over" (a missing field counts as 0)
        any other key holds if data.get(key) == value
    An empty set of conditions always holds. Return the actions of the rules that fire, in order."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def expected_errors(runs, human_error, automated_error, review_catch=0.0):
    """Return {"manual": runs * human_error,
               "automated": runs * automated_error * (1 - review_catch)}, each rounded to 1 place."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("worth   :", worth_it(5, 250, 20, maintain_hours_per_year=4))
    print("rank    :", rank_tasks(TASKS))
    print("approach:", choose_approach({"structured_input": False, "rules_clear": False, "stakes": "low", "reversible": False}))
    print("rules   :", run_rules("order.created", {"country": "GB", "total": 240}, RULES))
    print("errors  :", expected_errors(600, 0.01, 0.05, review_catch=0.9))

@@solution
"""
Lab solution: Is It Worth It, What First, Which Kind, Rules, and Errors
Standard library only.
"""

TASKS = [
    {"name": "copy invoices into the ledger", "runs_per_year": 1200, "minutes": 4, "error_rate": 0.03, "fix_minutes": 30},
    {"name": "weekly sales report", "runs_per_year": 52, "minutes": 45, "error_rate": 0.05, "fix_minutes": 60},
    {"name": "reply to supplier emails", "runs_per_year": 600, "minutes": 6, "error_rate": 0.01, "fix_minutes": 20},
    {"name": "annual stock take", "runs_per_year": 1, "minutes": 480, "error_rate": 0.1, "fix_minutes": 240},
]

RULES = [
    {"when": "order.created", "if": {"country": "GB"}, "then": "send UK delivery email"},
    {"when": "order.created", "if": {"total_over": 200}, "then": "notify owner of large order"},
    {"when": "order.created", "if": {}, "then": "add row to orders sheet"},
    {"when": "order.refunded", "if": {}, "then": "update stock"},
]


# ---------------------------------------------------------------- Step 1
def worth_it(minutes_saved_per_run, runs_per_year, build_hours, maintain_hours_per_year=0.0, horizon_years=5):
    """Maintenance is the term people forget, and it decides the marginal cases: if it
    exceeds the monthly saving, the automation never pays back."""
    saved = minutes_saved_per_run * runs_per_year * horizon_years / 60
    cost = build_hours + maintain_hours_per_year * horizon_years
    monthly_net = minutes_saved_per_run * runs_per_year / 60 / 12 - maintain_hours_per_year / 12
    payback = round(build_hours / monthly_net, 1) if monthly_net > 0 else None
    return {"saved_hours": round(saved, 1), "cost_hours": round(cost, 1), "net_hours": round(saved - cost, 1), "payback_months": payback}


# ---------------------------------------------------------------- Step 2
def rank_tasks(tasks):
    """The short frequent task usually costs more than the long rare one, especially once
    the time spent fixing its mistakes is counted."""
    def hours(task):
        return round(task["runs_per_year"] * (task["minutes"] + task["error_rate"] * task["fix_minutes"]) / 60, 1)
    return sorted(((task["name"], hours(task)) for task in tasks), key=lambda row: (-row[1], row[0]))


# ---------------------------------------------------------------- Step 3
def choose_approach(task):
    """Rules are asked about first: they are cheaper, faster, and predictable. Then the stakes,
    then whether the action can be undone."""
    if task["structured_input"] and task["rules_clear"]:
        return "classic automation"
    if task["stakes"] == "high":
        return "AI assists a person"
    if task["reversible"]:
        return "AI automation"
    return "AI automation with review"


# ---------------------------------------------------------------- Step 4
def run_rules(event, data, rules):
    """Trigger, conditions, action: the anatomy of every automation in this unit, as data."""
    def matches(conditions):
        for key, value in conditions.items():
            if key.endswith("_over"):
                if not data.get(key[:-5], 0) > value:
                    return False
            elif data.get(key) != value:
                return False
        return True
    return [rule["then"] for rule in rules if rule["when"] == event and matches(rule["if"])]


# ---------------------------------------------------------------- Step 5
def expected_errors(runs, human_error, automated_error, review_catch=0.0):
    """Automation changes errors more than it removes them. AI without review can make a
    process worse, faster."""
    return {"manual": round(runs * human_error, 1), "automated": round(runs * automated_error * (1 - review_catch), 1)}


if __name__ == "__main__":
    print(worth_it(1, 365, 0))
    print(worth_it(5, 250, 20, maintain_hours_per_year=4))
    print(worth_it(30, 12, 20, maintain_hours_per_year=2))
    print(worth_it(2, 50, 10, maintain_hours_per_year=3))
    print(round(1 * 52 * 5 / 60, 1))

    for name, hours in rank_tasks(TASKS):
        print(f"{hours:>6} h  {name}")

    print(choose_approach({"structured_input": True, "rules_clear": True, "stakes": "high", "reversible": False}))
    print(choose_approach({"structured_input": False, "rules_clear": False, "stakes": "high", "reversible": True}))
    print(choose_approach({"structured_input": False, "rules_clear": True, "stakes": "low", "reversible": True}))
    print(choose_approach({"structured_input": False, "rules_clear": False, "stakes": "low", "reversible": False}))

    print(run_rules("order.created", {"country": "GB", "total": 240}, RULES))
    print(run_rules("order.created", {"country": "FR", "total": 90}, RULES))
    print(run_rules("order.shipped", {}, RULES))
    print(expected_errors(1200, 0.03, 0.002), expected_errors(600, 0.01, 0.05), expected_errors(600, 0.01, 0.05, review_catch=0.9))

    print(rank_tasks([{"name": "q1", "runs_per_year": 1000, "minutes": 3, "error_rate": 0.02, "fix_minutes": 45}]))
    print(worth_it(3.9, 1000, 30, maintain_hours_per_year=6))
    print(expected_errors(800, 0.01, 0.04), expected_errors(800, 0.01, 0.04, review_catch=0.85))

@@step
{
  "stepNumber": 1,
  "title": "Does it pay for itself?",
  "instruction": "Implement worth_it(minutes_saved_per_run, runs_per_year, build_hours, maintain_hours_per_year, horizon_years). The hours saved over the horizon are the minutes saved per run times the runs per year times the years, divided by 60. The hours spent are the build hours plus the maintenance hours per year times the years. The monthly net saving is the minutes saved per run times the runs per year divided by 60 and by 12, minus the maintenance hours divided by 12. The payback in months is the build hours divided by the monthly net saving, rounded to 1 decimal place, or None if the monthly net saving is zero or less. Return a dict with 'saved_hours', 'cost_hours', and 'net_hours' (saved minus cost), each rounded to 1 place, and 'payback_months'. Try the xkcd case of one minute a day, then an automation that never pays back. These are the formulas from Section 2. [MOD-7.1]",
  "hintConceptual": "A machine that costs a day to build and an hour a month to look after is worth it only if it saves more than an hour a month, and it pays back once the monthly surplus has covered the day.",
  "hintSyntax": "saved = minutes_saved_per_run * runs_per_year * horizon_years / 60\ncost = build_hours + maintain_hours_per_year * horizon_years\nmonthly_net = minutes_saved_per_run * runs_per_year / 60 / 12 - maintain_hours_per_year / 12\npayback = round(build_hours / monthly_net, 1) if monthly_net > 0 else None\nreturn {\"saved_hours\": round(saved, 1), \"cost_hours\": round(cost, 1), \"net_hours\": round(saved - cost, 1), \"payback_months\": payback}"
}
@@assert
assert worth_it(1, 365, 0) == {"saved_hours": 30.4, "cost_hours": 0, "net_hours": 30.4, "payback_months": 0.0}, f"A minute a day for five years is 30.4 hours, got {worth_it(1, 365, 0)}"
assert worth_it(5, 250, 20, maintain_hours_per_year=4) == {"saved_hours": 104.2, "cost_hours": 40, "net_hours": 64.2, "payback_months": 14.3}, "Five minutes on 250 days pays back in about 14 months"
assert worth_it(30, 12, 20, maintain_hours_per_year=2) == {"saved_hours": 30.0, "cost_hours": 30, "net_hours": 0.0, "payback_months": 60.0}, "Half an hour a month breaks even over exactly five years"
assert worth_it(2, 50, 10, maintain_hours_per_year=3)["payback_months"] is None and worth_it(2, 50, 10, maintain_hours_per_year=3)["net_hours"] == -16.7, "Upkeep larger than the saving never pays back"
assert worth_it(3.9, 1000, 30, maintain_hours_per_year=6) == {"saved_hours": 325.0, "cost_hours": 60, "net_hours": 265.0, "payback_months": 6.1}, "The numbers from the first recall question"
assert worth_it(1, 52, 0, horizon_years=5)["saved_hours"] == 4.3, "A minute a week for five years is about four hours"
assert worth_it(10, 100, 5, horizon_years=1)["saved_hours"] == 16.7, "The horizon is an argument"
print("Step 1 passed: a minute a day is worth a day, and upkeep larger than the saving never pays back.")

@@step
{
  "stepNumber": 2,
  "title": "Rank tasks by what they cost",
  "instruction": "Implement rank_tasks(tasks). For each task, its yearly hours are the runs per year times the sum of the minutes it takes and the error rate times the minutes to fix an error, divided by 60, rounded to 1 decimal place. Return a list of tuples of the task's name and its hours, sorted from the most hours to the fewest, with ties broken by name in alphabetical order. Rank TASKS. This is the formula for hours per year from Section 2. [MOD-7.1]",
  "hintConceptual": "A dripping tap wastes more water than the occasional burst pipe, because it never stops. Add up each task's time across the whole year, including the time spent cleaning up after it.",
  "hintSyntax": "def hours(task):\n    return round(task[\"runs_per_year\"] * (task[\"minutes\"] + task[\"error_rate\"] * task[\"fix_minutes\"]) / 60, 1)\nreturn sorted(((task[\"name\"], hours(task)) for task in tasks), key=lambda row: (-row[1], row[0]))"
}
@@assert
_ranked = rank_tasks(TASKS)
assert _ranked == [("copy invoices into the ledger", 98.0), ("reply to supplier emails", 62.0), ("weekly sales report", 41.6), ("annual stock take", 8.4)], f"Invoices first at 98 hours, the stock take last, got {_ranked}"
assert rank_tasks([{"name": "q1", "runs_per_year": 1000, "minutes": 3, "error_rate": 0.02, "fix_minutes": 45}]) == [("q1", 65.0)], "The numbers from the first recall question"
assert rank_tasks([{"name": "a", "runs_per_year": 60, "minutes": 1, "error_rate": 0, "fix_minutes": 0}]) == [("a", 1.0)], "Sixty one-minute runs with no errors is one hour"
assert rank_tasks([{"name": "b", "runs_per_year": 60, "minutes": 1, "error_rate": 0, "fix_minutes": 0}, {"name": "a", "runs_per_year": 30, "minutes": 2, "error_rate": 0, "fix_minutes": 0}]) == [("a", 1.0), ("b", 1.0)], "Ties are ordered by name"
assert rank_tasks([{"name": "e", "runs_per_year": 100, "minutes": 0, "error_rate": 0.5, "fix_minutes": 12}]) == [("e", 10.0)], "Errors alone can make a task costly"
assert rank_tasks([]) == [], "No tasks, no ranking"
print("Step 2 passed: the four-minute invoice task costs more than the weekly report.")

@@step
{
  "stepNumber": 3,
  "title": "Choose the kind of automation",
  "instruction": "Implement choose_approach(task). The task has 'structured_input' and 'rules_clear', both true or false; 'stakes', either 'high' or 'low'; and 'reversible', true or false. Return the first that applies: 'classic automation' if the input is structured and the rules are clear; 'AI assists a person' if the stakes are high; 'AI automation' if the action is reversible; otherwise 'AI automation with review'. Try the four tasks of the second recall question. This is the table of approaches from Section 2, and its order matters: rules are considered before AI. [MOD-7.1]",
  "hintConceptual": "First ask whether a simple instruction sheet would do. Only if not, ask how much harm a wrong answer causes, and whether it can be taken back.",
  "hintSyntax": "if task[\"structured_input\"] and task[\"rules_clear\"]:\n    return \"classic automation\"\nif task[\"stakes\"] == \"high\":\n    return \"AI assists a person\"\nif task[\"reversible\"]:\n    return \"AI automation\"\nreturn \"AI automation with review\""
}
@@assert
_copy = {"structured_input": True, "rules_clear": True, "stakes": "high", "reversible": False}
_sort = {"structured_input": False, "rules_clear": False, "stakes": "low", "reversible": True}
_reply = {"structured_input": False, "rules_clear": False, "stakes": "low", "reversible": False}
_injury = {"structured_input": False, "rules_clear": False, "stakes": "high", "reversible": True}
assert choose_approach(_copy) == "classic automation", f"Copying a total is a job for rules, even though it is high stakes, got {choose_approach(_copy)}"
assert choose_approach(_sort) == "AI automation", "Sorting emails that can be re-sorted in a click"
assert choose_approach(_reply) == "AI automation with review", "A reply cannot be unsent, so a person reviews it"
assert choose_approach(_injury) == "AI assists a person", "A high-stakes decision stays with a person"
assert choose_approach({"structured_input": True, "rules_clear": False, "stakes": "low", "reversible": True}) == "AI automation", "Structured input with unclear rules is not enough for classic automation"
assert choose_approach({"structured_input": False, "rules_clear": True, "stakes": "high", "reversible": False}) == "AI assists a person", "Clear rules on unstructured input still need judgement when stakes are high"
print("Step 3 passed: rules first, then stakes, then whether it can be undone.")

@@step
{
  "stepNumber": 4,
  "title": "A tiny rule engine",
  "instruction": "Implement run_rules(event, data, rules). Each rule is a dict with 'when', an event name; 'if', a dict of conditions; and 'then', an action. A rule fires if its 'when' equals the event and every condition holds. A condition whose key ends in '_over', such as 'total_over', holds if the data's value for the field named without that ending is greater than the condition's value, counting a missing field as 0. Any other condition holds if the data's value for that key equals the condition's value. An empty set of conditions always holds. Return the actions of the rules that fire, in the order of the rules. Run it on a British order of 240 and a French order of 90. This is the trigger, conditions, and action structure from Section 1. [MOD-7.1]",
  "hintConceptual": "A set of house rules on a noticeboard: when the doorbell rings, if it is the post, take it in; if it is after nine, check the camera first. Read down the list and do every one that applies.",
  "hintSyntax": "def matches(conditions):\n    for key, value in conditions.items():\n        if key.endswith(\"_over\"):\n            if not data.get(key[:-5], 0) > value:\n                return False\n        elif data.get(key) != value:\n            return False\n    return True\nreturn [rule[\"then\"] for rule in rules if rule[\"when\"] == event and matches(rule[\"if\"])]"
}
@@assert
assert run_rules("order.created", {"country": "GB", "total": 240}, RULES) == ["send UK delivery email", "notify owner of large order", "add row to orders sheet"], f"A large British order fires three actions, got {run_rules('order.created', {'country': 'GB', 'total': 240}, RULES)}"
assert run_rules("order.created", {"country": "FR", "total": 90}, RULES) == ["add row to orders sheet"], "A small French order fires only the row"
assert run_rules("order.created", {"country": "GB", "total": 200}, RULES) == ["send UK delivery email", "add row to orders sheet"], "Over means strictly greater: 200 is not over 200"
assert run_rules("order.refunded", {"total": 999}, RULES) == ["update stock"] and run_rules("order.shipped", {}, RULES) == [], "Rules fire only for their own event"
assert run_rules("order.created", {"country": "GB"}, RULES) == ["send UK delivery email", "add row to orders sheet"], "A missing field counts as 0 for an over condition"
_two = [{"when": "e", "if": {"a": 1, "b_over": 5}, "then": "both"}]
assert run_rules("e", {"a": 1, "b": 6}, _two) == ["both"] and run_rules("e", {"a": 1, "b": 5}, _two) == [] and run_rules("e", {"a": 2, "b": 6}, _two) == [], "Every condition must hold"
assert run_rules("order.created", {}, []) == [], "No rules, no actions"
print("Step 4 passed: a British order of 240 fires three actions, and a French order of 90 fires one.")

@@step
{
  "stepNumber": 5,
  "title": "Compare the errors",
  "instruction": "Implement expected_errors(runs, human_error, automated_error, review_catch). The expected errors by hand are the runs times the human error rate. The expected errors of the automation are the runs times its error rate times one minus the share of its errors that a review catches. Return a dict with 'manual' and 'automated', each rounded to 1 decimal place. Compare rules copying 1,200 invoices, then AI drafting 600 replies with no review and with a review that catches 90 percent. This is the error comparison from Section 2. [MOD-7.1]",
  "hintConceptual": "A careful person slips now and then. A machine never slips, and when it is wrong it is wrong the same way every time it runs. A second pair of eyes catches most, not all, of what gets through.",
  "hintSyntax": "return {\"manual\": round(runs * human_error, 1), \"automated\": round(runs * automated_error * (1 - review_catch), 1)}"
}
@@assert
assert expected_errors(1200, 0.03, 0.002) == {"manual": 36.0, "automated": 2.4}, f"Rules copying invoices cut errors from 36 to 2.4, got {expected_errors(1200, 0.03, 0.002)}"
assert expected_errors(600, 0.01, 0.05) == {"manual": 6.0, "automated": 30.0}, "AI without review makes five times as many errors as the person"
assert expected_errors(600, 0.01, 0.05, review_catch=0.9) == {"manual": 6.0, "automated": 3.0}, "A review catching nine in ten brings the AI below the person"
assert expected_errors(800, 0.01, 0.04) == {"manual": 8.0, "automated": 32.0} and expected_errors(800, 0.01, 0.04, review_catch=0.85) == {"manual": 8.0, "automated": 4.8}, "The numbers from the third recall question"
assert expected_errors(100, 0.02, 0.02, review_catch=1.0) == {"manual": 2.0, "automated": 0.0}, "A perfect review catches every error"
assert expected_errors(0, 0.5, 0.5) == {"manual": 0.0, "automated": 0.0}, "No runs, no errors"
print("Step 5 passed: rules cut errors, and AI needs review to beat a careful person.")
