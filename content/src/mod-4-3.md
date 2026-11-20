@@meta
{
  "moduleId": "MOD-4.3",
  "slug": "mod-4-3",
  "unitId": "UNIT-4",
  "unitTitle": "Unit 4: 100+ AI Tools Directory",
  "title": "Build Your Personal AI Stack",
  "difficulty": "Foundational",
  "estimatedMinutes": 80,
  "citations": [
    { "title": "The Impact of Generative AI on Work Productivity", "source": "Federal Reserve Bank of St. Louis", "url": "https://www.stlouisfed.org/on-the-economy/2025/feb/impact-generative-ai-work-productivity" },
    { "title": "Will AI Fix Work? (2023 Work Trend Index)", "source": "Microsoft", "url": "https://www.microsoft.com/en-us/worklab/work-trend-index/will-ai-fix-work" },
    { "title": "Subscription Service Statistics and Costs", "source": "C+R Research", "url": "https://www.crresearch.com/blog/true-cost-of-subscriptions" },
    { "title": "Experimental evidence on the productivity effects of generative artificial intelligence", "source": "Science", "url": "https://www.science.org/doi/10.1126/science.adh2586" },
    { "title": "Generative AI at Work", "source": "NBER Working Paper 31161", "url": "https://www.nber.org/papers/w31161" }
  ],
  "videoLibrary": [
    {
      "id": "VID-4.3-1",
      "title": "My AI Setup Feels Like Cheating (Here's All of It)",
      "creator": "Riley Brown",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=YT0u2eQ-Aj4",
      "timingInstruction": "Watch after reading Section 1; note how much one general assistant covers",
      "keyTakeaway": "One builder's complete personal AI stack, tool by tool."
    },
    {
      "id": "VID-4.3-2",
      "title": "These Are the Best AI Tools in 2026",
      "creator": "Dan Martell",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=aPSbZbOzB4s",
      "timingInstruction": "Watch after reading Section 2 (what the evidence says about time saved)",
      "keyTakeaway": "A business owner's shortlist of tools to compare against your own stack."
    },
    {
      "id": "VID-4.3-3",
      "title": "Generative AI for Everyone",
      "creator": "DeepLearning.AI",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/generative-ai-for-everyone",
      "timingInstruction": "Take the lessons on analysing a job into tasks before doing the lab",
      "keyTakeaway": "Teaches the task-by-task analysis of a job that the weekly audit in this chapter is built on."
    },
    {
      "id": "VID-4.3-4",
      "title": "Google AI Essentials",
      "creator": "Google",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/google-ai-essentials",
      "timingInstruction": "Optional, alongside Unit 4",
      "keyTakeaway": "Practice in applying AI tools to everyday work, useful for finding the tasks worth including in your audit."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Audit Your Week, Choose a Minimal Stack, and Cost It",
    "context": "A freelance consultant pays for six AI subscriptions and is not sure which are earning their keep. You will build the tools to find out: a weekly task audit, a report of overlapping subscriptions, a selector for the smallest set of tools that covers the jobs needed, a monthly value calculation for each tool, and the gap between what people think they spend and what they do.",
    "language": "python"
  }
}

@@reading
# Build Your Personal AI Stack

A **stack** is the small set of tools you actually use, week in and week out. The previous chapter listed more than 140 candidates. Most people need three or four. This chapter is about arriving at those few: starting from how your week is really spent, choosing the least that covers it, knowing what it costs, and revisiting the choice as tools and your work change.

The method is deliberately unglamorous. It consists of a list of what you do, some arithmetic, and a calendar reminder.

## 1. First-Principles Mental Model & Intuition

### A kitchen, not a gadget drawer

Two people equip a kitchen. One buys whatever looks clever: a spiraliser, an egg separator, a machine that makes one kind of dumpling. The other writes down what they cook in a normal week and buys a good knife, two pans, and a pot. The second kitchen is smaller, cheaper, and far more useful, because every item in it is used.

An AI stack built from a directory tends to become the gadget drawer. An AI stack built from your week becomes the kitchen.

```text
   START HERE                                          NOT HERE

   your week  -->  the jobs in it  -->  categories     a list of popular tools
        |                                    |               |
        v                                    v               v
   hours per job                    one tool per job    "this looks useful"
        |                                    |
        +----------> worth a tool? <---------+
```

### The shape of a sensible stack

Most working stacks have the same shape, whatever the profession.

```text
   +-----------------------------------------------------------+
   |  0 to 3 SPECIALISTS      only for jobs the layers below   |
   |                          cannot do, done every week       |
   +-----------------------------------------------------------+
   |  THE ASSISTANT WHERE     built into your office suite,    |
   |  YOU ALREADY WORK        if you have one                  |
   +-----------------------------------------------------------+
   |  ONE GENERAL ASSISTANT   the tool you learn properly      |
   +-----------------------------------------------------------+
```

The base is one general assistant that you know well, with its projects, saved instructions, and connections set up as in Units 2 and 3. Depth in one tool is worth more than acquaintance with five. The middle layer is the assistant built into the applications where your documents and mail already live, if your plan includes it. The top layer is specialists, and the rule for admission is strict: the job is one the lower layers cannot do, and you do it every week.

### Three rules

1. **One tool per job.** Two tools for the same job means paying twice and never mastering either.
2. **A tool must pay for itself.** In hours saved, measured, multiplied by what your hour is worth.
3. **Everything is reviewed.** A subscription with no review date is a subscription you will forget.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### The weekly task audit

Before choosing anything, write down what you do. For one ordinary week, list your recurring tasks, the hours each takes, and the category from Module 4.1 it belongs to.

| Task | Hours a week | Category |
|---|---|---|
| Reading and answering email | 8 | Email |
| Meetings | 9 | Meetings |
| Writing reports and proposals | 7 | Writing |
| Finding and checking information | 5 | Research |
| Spreadsheets and figures | 4 | Data |
| Slides | 3 | Slides |
| Administration | 4 | Other |

Most people are surprised by their own audit. Large surveys agree with it. Microsoft's 2023 Work Trend Index, using data from its own applications, reported that the average user spent 57 percent of their time communicating, in meetings, chat, and email, and 43 percent creating documents, spreadsheets, and presentations. The work people think of as their job is often the smaller part of their week.

The audit matters because of a simple rule, borrowed from computing, where it is called Amdahl's law. If a task takes a fraction $f$ of your week and a tool reduces the time it takes by a fraction $r$, the share of your week saved is

$$
\text{saving} = f \cdot r
$$

and over several tasks

$$
\text{hours saved} = \sum_i h_i \cdot r_i
$$

where $h_i$ is the hours spent on task $i$. A tool that makes report writing 40 percent faster, applied to 7 hours a week, saves $7 \times 0.4 = 2.8$ hours. The same 40 percent improvement applied to slides, at 3 hours a week, saves 1.2. A spectacular tool for a task you rarely do saves almost nothing. This is why the audit comes first: it tells you where an improvement would be worth having.

### What the evidence says about time saved

Vendors' claims about hours saved are advertising. Independent measurements are more modest and more useful.

| Study | What it found |
|---|---|
| Federal Reserve Bank of St. Louis, 2025, a survey of workers in the United States | People who used generative AI at work reported saving 5.4 percent of their work hours, about 2.2 hours in a 40-hour week. Averaged over all workers, users and non-users, the figure was 1.4 percent |
| Noy and Zhang, 2023, an experiment with professional writing tasks | Tasks were completed about 40 percent faster, and the quality of the output was rated about 18 percent higher |
| Brynjolfsson, Li, and Raymond, 2023, customer support agents | Productivity rose by about 14 percent on average, with the largest gains among the least experienced agents |
| A 2023 experiment with management consultants | Large gains on tasks within the technology's abilities, and worse performance on a task outside them |
| A 2025 study of Danish workers | Average time savings of about 3 percent, with no measurable effect on pay or hours |

Three lessons come out of these together.

**Gains are real and uneven.** A 40 percent saving on a writing task and a 3 percent saving across a whole job are both true. The first is one task. The second is a job, most of which is not that task. This is the $f \cdot r$ formula seen in the data.

**The technology has a jagged edge.** It is excellent at some tasks and poor at others that look similar, and you cannot tell which from the outside. On tasks beyond the edge, people using AI did worse.

**Averages are small.** The honest expectation for a well-chosen stack is a few hours a week. That is well worth having. It is not the transformation the advertising promises.

### Break-even for a subscription

A tool costing $p$ a month, for someone whose hour is worth $v$, pays for itself when it saves

$$
h_{\text{break-even}} = \frac{p}{v} \text{ hours a month}
$$

At USD 20 a month and USD 30 an hour, that is two thirds of an hour: forty minutes a month, or about ten minutes a week. For a tool that is used, this is a low bar, which is why a good general assistant is nearly always worth its price. For a tool that is not used, no bar is low enough.

The **net monthly value** of a tool is

$$
\text{net} = h_{\text{saved}} \cdot v - p
$$

A negative figure is a tool to cancel. The hours must be measured, as in the trial protocol of Module 4.1, and must include the time spent checking and correcting what the tool produced.

### Overlap

Tools are sold by feature, and features repeat. A general assistant drafts text. So does the writing tool. So does the assistant built into your word processor. If each tool $j$ covers a set of jobs $J_j$, a job is **overlapped** when more than one of your paid tools covers it:

$$
\text{overlapped}(x) \iff \bigl|\{\, j : x \in J_j \,\}\bigr| > 1
$$

Overlap is not always waste. You might keep two assistants because each is better at something. But it should be a decision. Unexamined, it is the main way stacks become expensive.

People are poor at knowing what they spend on subscriptions. In a 2022 survey by C+R Research, consumers in the United States estimated their monthly subscription spending at USD 86 on average. When they itemised it, the real figure was USD 219: a gap of USD 133 a month, two and a half times the guess. Forty-two percent had forgotten a subscription they were still paying for.

### Choosing the smallest stack

Given the jobs you need covered and the tools available, finding the fewest tools that cover every job is a classic problem called **set cover**. Finding the perfect answer is hard for large cases. A simple greedy method does well:

```text
repeat until every needed job is covered:
    choose the tool that covers the most jobs still uncovered
    (if several tie, the cheapest; if still tied, alphabetically)
```

The method tends to pick broad tools first, a general assistant or an office suite's assistant, and specialists only for what remains. That matches the shape of the stack in Section 1, and it explains it: breadth is what makes a base layer.

Two cautions. The method treats "covers the job" as yes or no, and a broad tool may cover a job badly. Coverage has to be confirmed by a trial. And the cheapest stack is not the goal. The goal is the stack with the best net value, which the greedy answer is a starting point for.

### Bundles

Before buying anything, check what you already have. Assistants are increasingly bundled into things people already pay for: office software, cloud storage plans, and phones and computers. Module 3.10 noted that Google's AI plans include storage, and Module 3.13 that Workspace plans include Gemini. Your employer may provide a licensed assistant. A tool that is already paid for, and already approved for your data, starts with a large advantage.

### Costing the whole stack

For a stack of tools with monthly prices $p_j$:

$$
\text{annual cost} = 12 \sum_j p_j
$$

At the time of writing, standard individual plans for the major assistants cost about USD 20 a month and premium tiers USD 100 to 250. Four standard subscriptions cost about USD 960 a year. One premium tier costs USD 1,200 to 3,000. Whether a premium tier is worth it depends on whether you hit the limits of the standard one in real work, which you can only learn by using it.

### Reviewing and evolving

A stack is not chosen once. Put a review in your calendar every three months and ask four questions of each tool.

| Question | Action if the answer is no |
|---|---|
| Did I use it in the last 30 days? | Cancel |
| Is its net value positive on measured hours? | Cancel, or move to a cheaper plan |
| Is it still the only tool I have for this job? | Remove the overlap |
| Has my work changed so that a different job now dominates? | Re-run the audit |

Outside the scheduled review, three events justify a change: a tool you depend on is closed or repriced, your work changes, or you repeatedly hit a limit. A new product launch is not on that list. Note it, and consider it at the next review.

### Complexity

The audit is a sum. The overlap report examines each tool's jobs once. The greedy cover makes at most as many passes as there are jobs. None of it needs a computer, which is the point: the discipline is in doing it, and it takes an hour a quarter.

## 3. Production-Grade Implementation & Annotated Walkthrough

The whole method fits in a few functions. First, the audit, and what a time saving is worth.

```python
WEEK = [
    ("Reading and answering email", 8, "email"),
    ("Client meetings", 6, "meetings"),
    ("Team meetings", 3, "meetings"),
    ("Writing reports", 5, "writing"),
    ("Writing proposals", 2, "writing"),
    ("Finding and checking information", 5, "research"),
    ("Spreadsheets and figures", 4, "data"),
    ("Slides", 3, "slides"),
    ("Administration", 4, "other"),
]

def task_audit(tasks):
    totals = {}
    for _, hours, category in tasks:
        totals[category] = totals.get(category, 0) + hours
    return sorted(totals.items(), key=lambda item: (-item[1], item[0]))

def hours_saved(audit, reductions):
    return round(sum(hours * reductions.get(category, 0) for category, hours in audit), 2)

audit = task_audit(WEEK)
total = sum(hours for _, hours in audit)
for category, hours in audit:
    print(f"{category:<10} {hours:>2} h  {hours / total:.0%}")
print("saved per week:", hours_saved(audit, {"writing": 0.4}), "| slides only:", hours_saved(audit, {"slides": 0.4}),
      "| writing, email, and meetings:", hours_saved(audit, {"writing": 0.4, "email": 0.25, "meetings": 0.15}))
```

- **Tasks are grouped by category.** Two kinds of meeting and two kinds of writing are added together, because a tool is chosen per category, not per task.
- **The result is sorted by hours.** The largest category comes first, with ties in alphabetical order. The top of this list is where to look for a tool.
- **Meetings and email take 17 of the 40 hours.** That is more than two fifths of the week before any "real work" starts, the pattern the surveys report.
- **`hours_saved` applies the formula from Section 2.** A 40 percent saving on writing is worth 2.8 hours a week. The same saving on slides is worth 1.2. Modest savings on the three largest categories together are worth 6.15.
- **A missing category saves nothing.** `reductions.get(category, 0)` means only the tasks a tool touches count.

Next, overlap, and the smallest stack that covers what is needed.

```python
STACK = {
    "Assistant Pro": {"price": 20, "jobs": {"writing", "research", "data", "images"}},
    "Meeting Notes": {"price": 15, "jobs": {"meetings"}},
    "Writing Helper": {"price": 12, "jobs": {"writing"}},
    "Research Finder": {"price": 20, "jobs": {"research"}},
    "Slide Maker": {"price": 10, "jobs": {"slides"}},
    "Office Suite AI": {"price": 30, "jobs": {"email", "writing", "slides", "data", "meetings"}},
}

def overlap_report(stack):
    covered = {}
    for name, tool in stack.items():
        for job in tool["jobs"]:
            covered.setdefault(job, []).append(name)
    return {job: sorted(names) for job, names in sorted(covered.items()) if len(names) > 1}

def minimal_stack(needs, tools):
    uncovered, chosen = set(needs), []
    while uncovered and tools:
        best = min(tools, key=lambda name: (-len(tools[name]["jobs"] & uncovered), tools[name]["price"], name))
        if not tools[best]["jobs"] & uncovered:
            break
        chosen.append(best)
        uncovered -= tools[best]["jobs"]
    return chosen, uncovered

for job, names in overlap_report(STACK).items():
    print(f"{job:<9} {names}")
chosen, missing = minimal_stack({"email", "meetings", "writing", "research", "slides"}, STACK)
print(chosen, "missing:", missing, "| monthly cost:", sum(STACK[name]["price"] for name in chosen),
      "against", sum(tool["price"] for tool in STACK.values()), "for all six")
```

- **`overlap_report` turns the question round.** The stack is stored by tool. The report is by job: for each job, which tools cover it. Only jobs with more than one tool are reported.
- **Five of the seven jobs are covered more than once.** Writing is covered by three subscriptions. This consultant is paying three companies to draft text.
- **`minimal_stack` is the greedy method.** At each step it picks the tool covering the most jobs still uncovered. The `min` with a three-part key does the tie-breaking in one expression: most new jobs first, written as a negative so that `min` finds the largest, then lowest price, then name.
- **The loop stops if nothing helps.** If there are no tools, or no tool covers any uncovered job, the function ends and returns what is missing. An honest "this need cannot be met" is better than an endless loop.
- **Two tools cover all five needs.** The office suite's assistant covers four jobs, and the general assistant picks up research. The cost is USD 50 a month against USD 107 for all six subscriptions.
- **Covered does not mean covered well.** The suite assistant "covers" meetings in this data. Whether its meeting notes are as good as the specialist's is a question for a trial, and the answer may put Meeting Notes back in the stack.

Finally, what each tool is worth, and the gap between guess and reality.

```python
USAGE = {
    "Assistant Pro": {"price": 20, "hours_saved": 6},
    "Meeting Notes": {"price": 15, "hours_saved": 2},
    "Writing Helper": {"price": 12, "hours_saved": 0.25},
    "Research Finder": {"price": 20, "hours_saved": 0.5},
    "Slide Maker": {"price": 10, "hours_saved": 1},
    "Office Suite AI": {"price": 30, "hours_saved": 3},
}

def monthly_net(usage, hourly_value):
    return {name: round(tool["hours_saved"] * hourly_value - tool["price"], 2) for name, tool in usage.items()}

def subscription_gap(guess, subscriptions):
    total = sum(subscriptions.values())
    return total, total - guess, round(total / guess, 2)

for name, net in monthly_net(USAGE, 30).items():
    print(f"{name:<16} {net:>7.2f}  {'keep' if net >= 0 else 'cancel'}")
print("break-even for a USD 20 tool at USD 30 an hour:", round(20 / 30 * 60), "minutes a month")
print(subscription_gap(86, {"itemised total from the survey": 219}))
print(subscription_gap(40, {name: tool["price"] for name, tool in USAGE.items()}))
```

- **`monthly_net` is hours saved times the value of an hour, minus the price.** The hours here are measured over a month, which is the hard part. The arithmetic is the easy part.
- **Two tools are losing money.** The writing helper saves a quarter of an hour a month and the research finder half an hour. Both are jobs the general assistant already covers, which is why they are barely used. They are the overlap, seen from the other side.
- **The general assistant earns the most by far.** Six hours a month at USD 30 is USD 180 of time for USD 20. This is typical: the base layer carries the stack.
- **The break-even is forty minutes a month.** Any tool you use at all clears it. The tools that fail are the ones you do not open.
- **`subscription_gap` reproduces the survey.** A guess of USD 86 against an itemised USD 219 is a gap of USD 133 and a ratio of 2.55. The consultant, guessing USD 40, is paying USD 107.

**Complexity.** `task_audit` and `monthly_net` are linear in the number of items. `overlap_report` is linear in the total number of jobs listed. `minimal_stack` makes at most one pass over the tools per job needed.

### A stack on one page

```text
MY WEEK         Top three categories by hours: ______, ______, ______
BASE            One general assistant: ______          Set up: profile, projects, connections
WHERE I WORK    Assistant in my office suite: ______   Included in a plan I already pay for? yes / no
SPECIALISTS     Job ______  ->  tool ______   (the base cannot do this because ______)
                Job ______  ->  tool ______
MONTHLY COST    ______      ANNUAL COST  ______
NEXT REVIEW     Date: ______     Cancel-by dates for anything on trial: ______
```

If the page will not fit your stack, the stack is too big.

### Three example stacks

| Who | Base | Where they work | Specialists |
|---|---|---|---|
| A student | One general assistant on its free or standard plan | The notebook tool for course material | None |
| A consultant | One general assistant, standard plan | The assistant in their office suite | A meeting notetaker |
| A small content business | One general assistant, standard plan | The design tool's built-in AI | A transcript-based video editor, and an automation tool |

Each has one tool per job, and none has more than five.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Paying for three assistants.** The commonest pattern among enthusiasts is a subscription to each major assistant "to compare". After the first month, most of the use goes to one. Pick it, and return to the others at the next review.

**Buying before auditing.** People choose tools for the work they wish they did. The audit shows the work they do. A video generator is exciting, and email takes eight hours a week.

**Trusting the estimate.** "It saves me hours" is a feeling. The studies in Section 2 found that reported savings are real and modest. Time three tasks with and without the tool before believing a number, yours or a vendor's.

**Counting the draft and not the checking.** A report drafted in a minute and verified for forty has taken forty-one. The jagged edge means some outputs need heavy correction. Savings are measured to the finished, checked result.

**The premium tier bought for one busy week.** A USD 200 plan is justified by hitting the standard plan's limits regularly in real work. If that happened once, wait.

**Forgetting what you pay for.** Subscriptions renew silently. Keep one list of every AI subscription, its price, and its renewal date, and look at it every quarter. The survey result, a real spend two and a half times the guess, applies to most people.

**Chasing every launch.** A new model or tool appears every week. Switching has a cost: setup, relearning, moving your material. Note the launch and evaluate it at the scheduled review, against what you have.

**No exit plan.** A stack built around one vendor's proprietary features, with all your material inside it, is expensive to leave. Keep your instructions, templates, and documents as ordinary files outside the tool, as Module 3.11 advised for skills.

**Ignoring what is already paid for.** People buy a separate assistant while their office suite, storage plan, or employer already provides one. Check bundles and employer licences first.

**Personal tools for work data.** A personal subscription used for an employer's or a client's confidential material may breach policy or contract, as Modules 3.13 and 4.1 discussed. The approved tool belongs in the stack even if it is not your favourite.

**Mistaking coverage for quality.** A broad tool that technically does a job may do it badly. If you do that job every day, the specialist may be worth its price. This is the one good reason for overlap, and it should be backed by a trial.

**A stack with no owner.** In a team, shared subscriptions that nobody reviews accumulate fastest of all. Give the list to one person and put the review in the calendar.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A personal AI stack is the small set of tools you use every week, and it is built from your work and not from a list of products. The first step is an audit of a normal week: tasks, hours, and categories. Because the time saved by a tool is the product of the share of your week a task takes and the fraction by which the tool shortens it, improvement is worth most where the hours are. Independent studies find real but modest gains, a few hours a week for users, concentrated in particular tasks. A sensible stack has one general assistant learned well, the assistant built into the applications you already use, and at most a few specialists for weekly jobs the others cannot do. A subscription pays for itself when the hours it saves, measured to the checked result, are worth more than its price. Overlap between tools is the main source of waste and should be a decision. The smallest set covering your needs can be found greedily, broad tools first. The stack is reviewed every quarter, and anything unused is cancelled.

**Question 1.** A marketing manager's week includes 10 hours of email, 8 of meetings, 9 of writing, 6 of analysis, 4 of slides, and 3 of other tasks. A writing tool promises to make writing 50 percent faster. A meeting notetaker would reduce meeting-related time by 20 percent. An email assistant would reduce email time by 15 percent. Compute the hours saved a week by each, and say which to try first if the manager can afford only one trial.

<details>
<summary>View Answer</summary>

The writing tool saves 9 hours times 0.5, which is 4.5 hours a week. The meeting notetaker saves 8 times 0.2, which is 1.6 hours. The email assistant saves 10 times 0.15, which is 1.5 hours. On the promised figures, the writing tool saves nearly three times as much as either of the others, so it is the one to try first. Three cautions apply. The 50 percent is a vendor's promise, and the independent evidence for writing tasks is nearer 40 percent in a controlled experiment and less in ordinary work, since the time saved must include reading and correcting the drafts. Even at 30 percent, though, the saving would be 2.7 hours, still the largest of the three, so the ranking is robust. Second, the manager's existing general assistant may already do the writing job with a good prompt and a few samples of their style, in which case no new tool is needed and the trial should compare the specialist against that. Third, email is the largest single category at 10 hours, so although the percentage reduction on offer is small, any better tool for it would be valuable, and it should be the next thing examined. The calculation shows why the audit comes first: a tool is worth the hours of the task multiplied by the reduction, and neither number alone decides it.

</details>

**Question 2.** A designer values their time at USD 40 an hour and pays for four tools: a general assistant at USD 20 that saves 5 hours a month, an image generator at USD 30 that saves 2 hours, a writing tool at USD 15 that saves 0.2 hours, and a presentation tool at USD 12 that saves 0.5 hours. Compute the net monthly value of each, the break-even hours for each, and say what the designer should do.

<details>
<summary>View Answer</summary>

The general assistant returns 5 times 40, which is USD 200, for USD 20: a net of USD 180. The image generator returns USD 80 for USD 30: a net of USD 50. The writing tool returns 0.2 times 40, which is USD 8, for USD 15: a net of minus USD 7. The presentation tool returns USD 20 for USD 12: a net of USD 8. The break-even hours are the price divided by 40: half an hour for the assistant, three quarters of an hour for the image generator, 0.375 hours, about 22 minutes, for the writing tool, and 0.3 hours, 18 minutes, for the presentation tool. The writing tool should be cancelled. It saves 12 minutes a month against a break-even of 22, almost certainly because the general assistant already does the same job, so it is overlap. The presentation tool is marginal: it clears its break-even by 12 minutes a month, and the designer should check whether the general assistant or the design software's built-in tools would do, and keep it only if the measured saving holds up. The general assistant and the image generator are clearly worth keeping. Cancelling the writing tool saves USD 180 a year, and the stack falls from four tools to three, or two.

</details>

**Question 3.** A team of six shares these subscriptions: two different general assistants, a meeting notetaker, a transcription service, a writing assistant, and an automation platform nobody has opened since March. Nobody knows the total cost. Describe a process to turn this into a deliberate stack, using the ideas in this chapter.

<details>
<summary>View Answer</summary>

Begin with what is being paid: list every subscription with its price, its renewal date, and who uses it. The survey evidence suggests the total will be much higher than anyone guesses. Then audit the work, not the tools: for one normal week, each person records their recurring tasks, hours, and categories, and the totals show where the team's time goes. Next, write an overlap report by job. The two general assistants cover the same jobs. The meeting notetaker and the transcription service both turn speech into text. The writing assistant overlaps with both general assistants. Each overlap needs a decision, and the default is one tool per job. For the assistants, compare them on the team's own tasks for two weeks, keep one as the base that everyone learns properly, and cancel the other unless a specific job justifies it. Keep whichever of the notetaker and the transcription service the team uses, since one almost certainly covers the other's job. Cancel the writing assistant unless a measured trial shows it beating the base assistant. Cancel the automation platform now: unused since March is the clearest signal there is. Check what the team's office suite already includes before renewing anything. Finally, give the list an owner, record the stack on one page with its monthly and annual cost, and schedule a review every three months that asks of each tool whether it was used in the last thirty days and whether its measured value exceeds its price.

</details>

@@starter
"""
Lab: Audit Your Week, Choose a Minimal Stack, and Cost It
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""

WEEK = [
    ("Reading and answering email", 8, "email"),
    ("Client meetings", 6, "meetings"),
    ("Team meetings", 3, "meetings"),
    ("Writing reports", 5, "writing"),
    ("Writing proposals", 2, "writing"),
    ("Finding and checking information", 5, "research"),
    ("Spreadsheets and figures", 4, "data"),
    ("Slides", 3, "slides"),
    ("Administration", 4, "other"),
]

STACK = {
    "Assistant Pro": {"price": 20, "jobs": {"writing", "research", "data", "images"}},
    "Meeting Notes": {"price": 15, "jobs": {"meetings"}},
    "Writing Helper": {"price": 12, "jobs": {"writing"}},
    "Research Finder": {"price": 20, "jobs": {"research"}},
    "Slide Maker": {"price": 10, "jobs": {"slides"}},
    "Office Suite AI": {"price": 30, "jobs": {"email", "writing", "slides", "data", "meetings"}},
}

USAGE = {
    "Assistant Pro": {"price": 20, "hours_saved": 6},
    "Meeting Notes": {"price": 15, "hours_saved": 2},
    "Writing Helper": {"price": 12, "hours_saved": 0.25},
    "Research Finder": {"price": 20, "hours_saved": 0.5},
    "Slide Maker": {"price": 10, "hours_saved": 1},
    "Office Suite AI": {"price": 30, "hours_saved": 3},
}


# ---------------------------------------------------------------- Step 1
def task_audit(tasks):
    """tasks is a list of (name, hours_per_week, category).
    Add up the hours for each category and return a list of (category, hours) pairs,
    sorted by hours from largest to smallest, and alphabetically for equal hours."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def hours_saved(audit, reductions):
    """audit is a list of (category, hours). reductions maps a category to the fraction
    of its time a tool removes (0.4 means 40 percent faster). A category that is not in
    reductions saves nothing. Return the total hours saved, rounded to 2 decimal places."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def overlap_report(stack):
    """stack maps a tool name to {"price": ..., "jobs": a set of jobs}.
    Return a dict mapping each job covered by MORE THAN ONE tool to the sorted list of
    those tools. The dict's keys are in alphabetical order."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def minimal_stack(needs, tools):
    """Greedy set cover. needs is a set of jobs; tools is like STACK.
    Start with uncovered = set(needs) and an empty chosen list. While any job is uncovered:
      - pick the tool that covers the most uncovered jobs; if several tie, the cheapest;
        if still tied, the first alphabetically
      - if even that tool covers no uncovered job, stop
      - otherwise add it to chosen and remove its jobs from uncovered
    Return (chosen, uncovered): the chosen names in the order picked, and the set of jobs
    that no tool covers."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def monthly_net(usage, hourly_value):
    """usage maps a tool name to {"price": ..., "hours_saved": hours saved in a month}.
    Return a dict mapping each name to hours_saved * hourly_value - price,
    rounded to 2 decimal places. A negative value is a tool to cancel."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    audit = task_audit(WEEK)
    print("audit   :", audit)
    print("saved   :", hours_saved(audit or [], {"writing": 0.4}))
    print("overlap :", overlap_report(STACK))
    print("minimal :", minimal_stack({"email", "meetings", "writing", "research", "slides"}, STACK))
    print("net     :", monthly_net(USAGE, 30))

@@solution
"""
Lab solution: Audit Your Week, Choose a Minimal Stack, and Cost It
Standard library only.
"""

WEEK = [
    ("Reading and answering email", 8, "email"),
    ("Client meetings", 6, "meetings"),
    ("Team meetings", 3, "meetings"),
    ("Writing reports", 5, "writing"),
    ("Writing proposals", 2, "writing"),
    ("Finding and checking information", 5, "research"),
    ("Spreadsheets and figures", 4, "data"),
    ("Slides", 3, "slides"),
    ("Administration", 4, "other"),
]

STACK = {
    "Assistant Pro": {"price": 20, "jobs": {"writing", "research", "data", "images"}},
    "Meeting Notes": {"price": 15, "jobs": {"meetings"}},
    "Writing Helper": {"price": 12, "jobs": {"writing"}},
    "Research Finder": {"price": 20, "jobs": {"research"}},
    "Slide Maker": {"price": 10, "jobs": {"slides"}},
    "Office Suite AI": {"price": 30, "jobs": {"email", "writing", "slides", "data", "meetings"}},
}

USAGE = {
    "Assistant Pro": {"price": 20, "hours_saved": 6},
    "Meeting Notes": {"price": 15, "hours_saved": 2},
    "Writing Helper": {"price": 12, "hours_saved": 0.25},
    "Research Finder": {"price": 20, "hours_saved": 0.5},
    "Slide Maker": {"price": 10, "hours_saved": 1},
    "Office Suite AI": {"price": 30, "hours_saved": 3},
}


# ---------------------------------------------------------------- Step 1
def task_audit(tasks):
    """A tool is chosen per category, so tasks are grouped. The top of the sorted list is
    where an improvement would be worth most."""
    totals = {}
    for _, hours, category in tasks:
        totals[category] = totals.get(category, 0) + hours
    return sorted(totals.items(), key=lambda item: (-item[1], item[0]))


# ---------------------------------------------------------------- Step 2
def hours_saved(audit, reductions):
    """Hours of the task times the fraction saved. A brilliant tool for a rare task
    saves almost nothing."""
    return round(sum(hours * reductions.get(category, 0) for category, hours in audit), 2)


# ---------------------------------------------------------------- Step 3
def overlap_report(stack):
    """The stack is stored by tool; the report is by job. Overlap should be a decision,
    never an accident."""
    covered = {}
    for name, tool in stack.items():
        for job in tool["jobs"]:
            covered.setdefault(job, []).append(name)
    return {job: sorted(names) for job, names in sorted(covered.items()) if len(names) > 1}


# ---------------------------------------------------------------- Step 4
def minimal_stack(needs, tools):
    """Greedy set cover: broad tools first, specialists for what remains. 'Covers the job'
    is yes or no here; whether it covers it well is a question for a trial."""
    uncovered, chosen = set(needs), []
    while uncovered and tools:
        best = min(tools, key=lambda name: (-len(tools[name]["jobs"] & uncovered), tools[name]["price"], name))
        if not tools[best]["jobs"] & uncovered:
            break
        chosen.append(best)
        uncovered -= tools[best]["jobs"]
    return chosen, uncovered


# ---------------------------------------------------------------- Step 5
def monthly_net(usage, hourly_value):
    """Measured hours, to the finished and checked result, times the value of an hour,
    minus the price."""
    return {name: round(tool["hours_saved"] * hourly_value - tool["price"], 2) for name, tool in usage.items()}


def subscription_gap(guess, subscriptions):
    """What people think they spend against what they do."""
    total = sum(subscriptions.values())
    return total, total - guess, round(total / guess, 2)


if __name__ == "__main__":
    audit = task_audit(WEEK)
    total = sum(hours for _, hours in audit)
    for category, hours in audit:
        print(f"{category:<10} {hours:>2} h  {hours / total:.0%}")
    print("saved per week:", hours_saved(audit, {"writing": 0.4}), "| slides only:", hours_saved(audit, {"slides": 0.4}),
          "| writing, email, and meetings:", hours_saved(audit, {"writing": 0.4, "email": 0.25, "meetings": 0.15}))

    for job, names in overlap_report(STACK).items():
        print(f"{job:<9} {names}")
    chosen, missing = minimal_stack({"email", "meetings", "writing", "research", "slides"}, STACK)
    print(chosen, "missing:", missing, "| monthly cost:", sum(STACK[name]["price"] for name in chosen),
          "against", sum(tool["price"] for tool in STACK.values()), "for all six")

    for name, net in monthly_net(USAGE, 30).items():
        print(f"{name:<16} {net:>7.2f}  {'keep' if net >= 0 else 'cancel'}")
    print("break-even for a USD 20 tool at USD 30 an hour:", round(20 / 30 * 60), "minutes a month")
    print(subscription_gap(86, {"itemised total from the survey": 219}))
    print(subscription_gap(40, {name: tool["price"] for name, tool in USAGE.items()}))
    print("recall question 1:", hours_saved([("writing", 9), ("meetings", 8), ("email", 10)], {"writing": 0.5}),
          hours_saved([("meetings", 8)], {"meetings": 0.2}), hours_saved([("email", 10)], {"email": 0.15}))
    print("recall question 2:", monthly_net({"assistant": {"price": 20, "hours_saved": 5}, "images": {"price": 30, "hours_saved": 2},
                                              "writing": {"price": 15, "hours_saved": 0.2}, "slides": {"price": 12, "hours_saved": 0.5}}, 40))

@@step
{
  "stepNumber": 1,
  "title": "Audit a week of work",
  "instruction": "Implement task_audit(tasks). Each task is a tuple (name, hours_per_week, category). Add up the hours for each category. Return a list of (category, hours) pairs sorted by hours from largest to smallest, with categories that have equal hours in alphabetical order. This is the weekly audit from Section 2. Run it on WEEK and look at which two categories come first: for most people they are not the work they think of as their job. [MOD-4.3]",
  "hintConceptual": "Group the tasks into the kinds of work they are, total each kind, and put the biggest first. That ordering is your shopping list.",
  "hintSyntax": "totals = {}\nfor _, hours, category in tasks:\n    totals[category] = totals.get(category, 0) + hours\nreturn sorted(totals.items(), key=lambda item: (-item[1], item[0]))"
}
@@assert
_audit = task_audit(WEEK)
assert _audit == [("meetings", 9), ("email", 8), ("writing", 7), ("research", 5), ("data", 4), ("other", 4), ("slides", 3)], f"Categories are totalled and sorted by hours, ties alphabetical, got {_audit}"
assert sum(hours for _, hours in _audit) == 40, "The week's hours are all accounted for"
assert task_audit([("a", 2, "x"), ("b", 3, "x")]) == [("x", 5)], "Tasks in the same category are added together"
assert task_audit([("a", 1, "zebra"), ("b", 1, "apple")]) == [("apple", 1), ("zebra", 1)], "Equal hours are ordered alphabetically"
assert task_audit([("a", 1.5, "x"), ("b", 4, "y")]) == [("y", 4), ("x", 1.5)], "Part hours are allowed"
assert task_audit([]) == [], "No tasks, no audit"
print("Step 1 passed: meetings and email, 17 of the 40 hours, top the list.")

@@step
{
  "stepNumber": 2,
  "title": "What is a time saving worth?",
  "instruction": "Implement hours_saved(audit, reductions). audit is a list of (category, hours) pairs. reductions maps a category to the fraction of its time that a tool removes, so 0.4 means the task takes 40 percent less time. For each category in the audit, multiply its hours by its reduction, using 0 for a category that is not in reductions. Return the total, rounded to 2 decimal places. This is the formula from Section 2: hours saved is the sum of hours times reduction. Compare a 40 percent saving on writing with the same saving on slides. [MOD-4.3]",
  "hintConceptual": "A percentage saving only becomes hours once you multiply it by how much time the task takes. Do that for each kind of work a tool touches and add them up.",
  "hintSyntax": "return round(sum(hours * reductions.get(category, 0) for category, hours in audit), 2)"
}
@@assert
_a = [("meetings", 9), ("email", 8), ("writing", 7), ("research", 5), ("data", 4), ("other", 4), ("slides", 3)]
assert hours_saved(_a, {"writing": 0.4}) == 2.8, f"40 percent of 7 hours of writing is 2.8 hours, got {hours_saved(_a, {'writing': 0.4})}"
assert hours_saved(_a, {"slides": 0.4}) == 1.2, "The same saving on 3 hours of slides is 1.2 hours"
assert hours_saved(_a, {"writing": 0.4, "email": 0.25, "meetings": 0.15}) == 6.15, "Savings on several categories add up: 2.8 + 2.0 + 1.35"
assert hours_saved(_a, {}) == 0, "No tool, no saving"
assert hours_saved(_a, {"gardening": 0.9}) == 0, "A reduction for a category that is not in the week saves nothing"
assert hours_saved([("writing", 9)], {"writing": 0.5}) == 4.5, "Recall question 1: half of 9 hours"
assert hours_saved([("email", 10)], {"email": 0.15}) == 1.5, "Recall question 1: 15 percent of 10 hours"
assert hours_saved([], {"writing": 0.4}) == 0, "An empty audit saves nothing"
print("Step 2 passed: the same 40 percent saves 2.8 hours on writing and 1.2 on slides.")

@@step
{
  "stepNumber": 3,
  "title": "Find the overlap",
  "instruction": "Implement overlap_report(stack). stack maps a tool's name to a dict with a 'jobs' set. Build, for each job, the list of tools that cover it. Return a dict containing only the jobs covered by more than one tool, each mapped to the sorted list of those tools' names, with the jobs themselves in alphabetical order. This is the overlap definition from Section 2. Run it on STACK and count how many subscriptions cover writing. [MOD-4.3]",
  "hintConceptual": "Turn the list round: instead of asking what each tool does, ask who does each job. Any job with more than one name beside it is being paid for more than once.",
  "hintSyntax": "covered = {}\nfor name, tool in stack.items():\n    for job in tool[\"jobs\"]:\n        covered.setdefault(job, []).append(name)\nreturn {job: sorted(names) for job, names in sorted(covered.items()) if len(names) > 1}"
}
@@assert
_report = overlap_report(STACK)
assert _report == {"data": ["Assistant Pro", "Office Suite AI"], "meetings": ["Meeting Notes", "Office Suite AI"], "research": ["Assistant Pro", "Research Finder"], "slides": ["Office Suite AI", "Slide Maker"], "writing": ["Assistant Pro", "Office Suite AI", "Writing Helper"]}, f"Five jobs are covered more than once, got {_report}"
assert list(_report) == ["data", "meetings", "research", "slides", "writing"], "Jobs are in alphabetical order"
assert "email" not in _report and "images" not in _report, "Jobs covered by a single tool are not reported"
assert overlap_report({"A": {"price": 1, "jobs": {"x"}}, "B": {"price": 1, "jobs": {"y"}}}) == {}, "No shared jobs, no overlap"
assert overlap_report({"B": {"price": 1, "jobs": {"x"}}, "A": {"price": 1, "jobs": {"x"}}}) == {"x": ["A", "B"]}, "Tool names are sorted"
assert overlap_report({}) == {}, "An empty stack has no overlap"
print("Step 3 passed: writing is covered by three subscriptions.")

@@step
{
  "stepNumber": 4,
  "title": "The smallest stack that covers your needs",
  "instruction": "Implement minimal_stack(needs, tools). Keep a set of uncovered jobs, starting as a copy of needs, and a list of chosen tools. While any job is uncovered, pick the tool that covers the most uncovered jobs. If several tie, pick the cheapest of them, and if they still tie, the first alphabetically. If the best tool covers no uncovered job, stop. Otherwise add it to chosen and remove its jobs from the uncovered set. Return (chosen, uncovered). This is the greedy method from Section 2. For the five needs in the example it chooses two tools. [MOD-4.3]",
  "hintConceptual": "Keep asking: which single tool would knock the most items off my list of unmet needs? Take it, cross those needs off, and ask again. Stop when the list is empty or nothing left can help.",
  "hintSyntax": "uncovered, chosen = set(needs), []\nwhile uncovered and tools:\n    best = min(tools, key=lambda name: (-len(tools[name][\"jobs\"] & uncovered), tools[name][\"price\"], name))\n    if not tools[best][\"jobs\"] & uncovered:\n        break\n    chosen.append(best)\n    uncovered -= tools[best][\"jobs\"]\nreturn chosen, uncovered"
}
@@assert
_needs = {"email", "meetings", "writing", "research", "slides"}
assert minimal_stack(_needs, STACK) == (["Office Suite AI", "Assistant Pro"], set()), f"The suite assistant covers four needs and the general assistant the fifth, got {minimal_stack(_needs, STACK)}"
assert _needs == {"email", "meetings", "writing", "research", "slides"}, "The needs set passed in must not be changed: work on a copy"
assert minimal_stack({"meetings"}, STACK) == (["Meeting Notes"], set()), "When two tools cover one need each, the cheaper is chosen"
assert minimal_stack({"research"}, STACK) == (["Assistant Pro"], set()), "Equal coverage and equal price: the first alphabetically"
assert minimal_stack({"writing", "video"}, STACK) == (["Writing Helper"], {"video"}), "A need that no tool covers is returned as uncovered, and the loop stops"
assert minimal_stack(set(), STACK) == ([], set()), "With no needs nothing is chosen"
assert minimal_stack({"x"}, {}) == ([], {"x"}), "With no tools every need is uncovered, and there is no error"
assert minimal_stack({"images", "slides"}, STACK) == (["Slide Maker", "Assistant Pro"], set()), "Tools are listed in the order picked: equal coverage, so the cheaper first"
print("Step 4 passed: two tools cover all five needs.")

@@step
{
  "stepNumber": 5,
  "title": "What each tool is worth a month",
  "instruction": "Implement monthly_net(usage, hourly_value). usage maps a tool's name to a dict with its monthly 'price' and the 'hours_saved' in a month. For each tool compute hours_saved multiplied by hourly_value, minus the price, rounded to 2 decimal places. Return a dict from name to that net value. A negative value means the tool costs more than the time it saves. This is the net value formula from Section 2. Run it on USAGE at USD 30 an hour and see which two subscriptions are losing money. [MOD-4.3]",
  "hintConceptual": "Turn the time a tool saves into money at the value of your hour, then take away what the tool costs. What is left is what it is really worth to you each month.",
  "hintSyntax": "return {name: round(tool[\"hours_saved\"] * hourly_value - tool[\"price\"], 2) for name, tool in usage.items()}"
}
@@assert
_net = monthly_net(USAGE, 30)
assert _net == {"Assistant Pro": 160, "Meeting Notes": 45, "Writing Helper": -4.5, "Research Finder": -5, "Slide Maker": 20, "Office Suite AI": 60}, f"Net monthly values at USD 30 an hour, got {_net}"
assert sorted(name for name, value in _net.items() if value < 0) == ["Research Finder", "Writing Helper"], "Two tools cost more than the time they save"
assert monthly_net(USAGE, 60)["Writing Helper"] == 3, "The hourly_value argument must be used: at USD 60 an hour the writing helper just pays for itself"
_q2 = monthly_net({"assistant": {"price": 20, "hours_saved": 5}, "images": {"price": 30, "hours_saved": 2}, "writing": {"price": 15, "hours_saved": 0.2}, "slides": {"price": 12, "hours_saved": 0.5}}, 40)
assert _q2 == {"assistant": 180, "images": 50, "writing": -7, "slides": 8}, f"Recall question 2, got {_q2}"
assert monthly_net({"free tool": {"price": 0, "hours_saved": 1}}, 25) == {"free tool": 25}, "A free tool's net value is the whole of the time it saves"
assert monthly_net({}, 30) == {}, "An empty stack has no values"
print("Step 5 passed: the general assistant earns USD 160 a month and two tools lose money.")
