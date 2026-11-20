@@meta
{
  "moduleId": "MOD-6.1",
  "slug": "mod-6-1",
  "unitId": "UNIT-6",
  "unitTitle": "Unit 6: AI Content Creation Masterclass",
  "title": "The AI Content Creation Pipeline",
  "difficulty": "Foundational",
  "estimatedMinutes": 85,
  "citations": [
    { "title": "Disclosing use of altered or synthetic content", "source": "YouTube Help", "url": "https://support.google.com/youtube/answer/14328491" },
    { "title": "YouTube channel monetization policies (inauthentic content)", "source": "YouTube Help", "url": "https://support.google.com/youtube/answer/1311392" },
    { "title": "Spam policies for Google web search (scaled content abuse)", "source": "Google Search Central", "url": "https://developers.google.com/search/docs/essentials/spam-policies" },
    { "title": "Article 50: Transparency Obligations for Providers and Deployers of Certain AI Systems", "source": "EU Artificial Intelligence Act", "url": "https://artificialintelligenceact.eu/article/50/" },
    { "title": "Disclosures 101 for Social Media Influencers", "source": "U.S. Federal Trade Commission", "url": "https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers" },
    { "title": "Copyright and Artificial Intelligence, Part 2: Copyrightability", "source": "U.S. Copyright Office", "url": "https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf" }
  ],
  "videoLibrary": [
    {
      "id": "VID-6.1-1",
      "title": "My 2026 Content Workflow: AI Tools Every Creator Should Use",
      "creator": "Desmond Wong",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=gATNyR3BJT8",
      "timingInstruction": "Watch after reading Section 1, noting which stage of the pipeline each tool is used for",
      "keyTakeaway": "One creator's working pipeline from idea to published piece, showing where AI tools are slotted in and where the creator still makes the calls."
    },
    {
      "id": "VID-6.1-2",
      "title": "The BEST AI Tools for Content Creators | A 7 Figure Content Creator's AI Workflow | 2026",
      "creator": "Corporate Guy Turned YouTuber",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=ZmMmEwckd0g",
      "timingInstruction": "Watch after reading Section 2 (where AI helps and where judgement stays), and compare the workflow with the stage table",
      "keyTakeaway": "A second working example of a content workflow, useful for seeing which stages a full-time creator hands to AI and which are kept."
    },
    {
      "id": "VID-6.1-3",
      "title": "Content Creation With Generative AI",
      "creator": "Coursera",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/content-creation-with-generative-ai",
      "timingInstruction": "Take after completing the lab, for guided practice across the stages of this chapter",
      "keyTakeaway": "A structured course on using generative AI across the content workflow, from planning to drafting and refining."
    },
    {
      "id": "VID-6.1-4",
      "title": "Generative AI for Everyone",
      "creator": "DeepLearning.AI",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/generative-ai-for-everyone",
      "timingInstruction": "Take the lessons on what generative AI can and cannot do if the division of work in Section 2 is new to you",
      "keyTakeaway": "A grounding in which tasks generative AI does well, the reasoning behind assigning it some stages of a pipeline and not others."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Voice, Calendar, Disclosure, Bottleneck, and Results",
    "context": "A small woodworking shop wants to publish three pieces of content a week with AI help, without sounding like everyone else or breaking a platform rule. You will build a check of a draft against the shop's voice guide, a content calendar, a rule for when a piece needs an AI label, a finder for the stage that limits output, and a report of which topics the audience responds to.",
    "language": "python"
  }
}

@@reading
# The AI Content Creation Pipeline

This unit is about making things with AI: images, video, voice, scripts, thumbnails, and the posts and films built from them. Each later chapter takes one of those in turn. This chapter is the map. It lays out the stages every piece of content goes through, says what AI can do at each, and says what it cannot.

The reason to begin here is that tools are the easy part. Anyone can generate a script, a voice, and a video in an afternoon. The result is usually something nobody wants to watch, because the tools were given no idea worth making and no judgement about whether the output was any good. A pipeline is what puts the tools in their place.

## 1. First-Principles Mental Model & Intuition

### A small magazine

Picture a monthly magazine with a staff of six.

An editor decides what the issue will cover and what the magazine thinks about it. A writer drafts each piece. A photographer and a designer produce the pages. A subeditor checks the facts, cuts the waffle, and fixes the headline. Someone sends it to the printer and the newsstands. And every month, the editor reads the sales figures and the letters, and adjusts the next issue.

That is six jobs: **ideate, script, produce, edit, publish, analyse**. Every piece of content, from a film to a single post, passes through all six, even when one person does them all in an hour.

Now give that magazine AI. Four of the six desks get a fast, tireless junior who drafts, generates, transcribes, cuts, and counts. Output per person rises sharply.

The editor's chair does not change. Somebody still decides what is worth saying, whether it is true, whether it sounds like the magazine, and whether it should go out under the magazine's name. A magazine that hands that chair to the junior prints more pages and loses its readers.

### The pipeline

```text
   IDEATE  ->  SCRIPT  ->  PRODUCE  ->  EDIT  ->  PUBLISH  ->  ANALYSE
     |           |           |           |          |            |
   what and    words and   images,     cut,       post,        what
   why         structure   voice,      correct,   schedule,    worked,
                           video       polish     label        and why
     ^                                                           |
     +-----------------------------------------------------------+
                  what you learn changes what you make next

   AI is strongest in the middle.   Human judgement is strongest at the ends
                                    and at every hand-off between stages.
```

Two things in this picture matter for the whole unit. It is a loop: the last stage feeds the first. And the stages are not equally suited to AI. The middle, where material is produced and reshaped, is where AI saves the most time. The ends, where someone decides what to make and whether it is fit to publish, are where it is weakest.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### The six stages

| Stage | What happens | What AI does well | What stays with a person |
|---|---|---|---|
| **Ideate** | Choose a topic, an angle, and an audience | Lists options, finds questions people ask, shows gaps | Having a point of view. Knowing your audience. Choosing |
| **Script** | Outline, draft, and structure the piece | First drafts, outlines, alternative openings, rewrites | The argument, the stories that are yours, the facts |
| **Produce** | Make the images, voice, and video | Generates visuals, narration, avatars, music | Taste, real footage and experience, rights and consent |
| **Edit** | Cut, correct, caption, and package | Transcripts, captions, rough cuts, clips, title options | Pace, what to leave out, the final check for errors |
| **Publish** | Post, schedule, and label | Formats for each platform, schedules, descriptions | Timing, disclosure, replying to people |
| **Analyse** | Read the results and decide what to change | Summarises numbers, groups comments, spots patterns | Deciding what the numbers mean for next time |

The later chapters of this unit each sit in one or two columns of this table. Images, video, voice, and avatars belong to production. Scripts belong to the second stage. Thumbnails belong to editing and packaging. The final chapter automates the hand-offs.

### Where human judgement stays essential

Five things do not move to the model, however good the tools become.

**A point of view.** A model produces the average of what has been said on a topic. What an audience follows a person for is the part that is not average: an opinion, an experience, a way of seeing. Module 5.1 explained the mechanism. A prompt that supplies nothing specific gets the most probable answer.

**Truth.** Module 1.10 showed that models state false things fluently. Content published under your name is checked by you. A fabricated statistic in a script is the creator's error, not the tool's.

**Taste.** Choosing the one usable image from twenty, or cutting the paragraph that is true and dull, is a judgement about a particular audience. A model has no stake in the result.

**Relationships.** An audience is made of people. Replying to them, and noticing what they ask for, is the work that turns viewers into a following.

**Accountability and rights.** Someone answers for what is published: whether it is honest, whether it is labelled as the rules require, whether you had the right to use that voice, that face, that image.

### The sameness problem

When everyone uses the same models with the same short prompts, the output converges. Readers have a name for the result, and platforms have rules about it.

Google's search policies define **scaled content abuse** as producing many pages mainly to manipulate rankings and not to help people, and say this applies however the pages are made. Using generative AI is not a violation in itself. Using it to mass-produce pages that add nothing is.

YouTube's monetisation policy was updated in July 2025 to describe **inauthentic content**: mass-produced or repetitive material that looks as if it came from a template. Such content is not eligible to earn money. Content built with AI on generic templates, without original insight, falls under it.

The rules point the same way as the audience does. What is penalised is not the use of AI. It is content with nothing in it that came from a person. The defence is the editor's chair: an idea of your own at the start, and judgement at the end.

### Throughput: the stage that limits you

A pipeline produces as fast as its slowest stage. If stage $i$ takes $h_{i}$ hours per piece and you have $H_{i}$ hours a week for it, that stage can handle $H_{i} / h_{i}$ pieces a week, and the whole pipeline produces

$$
\text{pieces per week} = \min_{i} \frac{H_{i}}{h_{i}}
$$

The stage with the smallest ratio is the **bottleneck**. Speeding up any other stage changes nothing.

This has a consequence that surprises people. AI makes drafting and generating much faster, and those are rarely the bottleneck for long. Once a model can draft a script in a minute, the limit becomes how fast a person can review scripts. Section 3 works an example in which AI cuts scripting time by three quarters and output does not move at all, because reviewing was already the constraint.

So the honest question about any AI tool is not "does it make this stage faster?" It is "is this stage my bottleneck?"

### Quality across stages

Module 2.12 showed that errors compound through a staged process: if each stage passes clean work with probability $p$, six stages do so with probability $p^{6}$, which is about 0.74 at $p = 0.95$. The remedy there applies here: a check, or gate, at the hand-offs, with the strongest check earliest. In a content pipeline the gates that matter are a check of the idea before anything is made, a check of the facts before production, and a final review before publishing.

### Brand voice

A **voice** is the set of consistent choices that make writing recognisably yours. A model has no way to know yours unless it is told, and its default is the voice of everything it has read.

A voice guide that a model can follow has these parts.

| Part | Example |
|---|---|
| Who we are talking to | "Hobby woodworkers with a small shed and basic tools" |
| How we sound, in three words | "Plain, practical, dry" |
| What we do | "Speak to the reader as 'you'. Give measurements. Admit mistakes" |
| What we never do | "No hype words. At most one exclamation mark. No sentences over 20 words" |
| Words we use and avoid | "Say 'blunt', not 'suboptimal'" |
| Two or three samples of real writing | Paragraphs you wrote and liked |

The samples do the most. Module 5.4 explained why: examples show what description cannot. Paste them into the prompt, or into a project's instructions, every time.

Part of a guide can be checked by code: banned phrases, sentence length, exclamation marks, whether the reader is addressed. The rest, such as whether a piece is dry or merely flat, needs a reader. Section 3 builds the mechanical part.

### Consistency and the calendar

An audience returns for something it can expect. Three decisions create that expectation.

**Pillars.** Three to five recurring subjects that everything you publish falls under. They stop the weekly question of what to make, and they tell the audience what you are for.

**Formats.** A small set of repeatable shapes: a short video, a set of slides, a long film. Each has its own chapter later in this unit.

**Cadence.** How often, and on which days. A pace you can keep for a year is better than one you can keep for a month.

A **content calendar** is those three decisions written against dates. It is the plan the pipeline runs to. It also makes batching possible: scripting four pieces in one sitting and producing them in another is faster than making four pieces one at a time, because each kind of work is done once with its tools open.

### Disclosure and rights

Rules about AI-made content differ by platform and country and are changing. At the time of writing (November 2026), the main ones are these.

| Rule | What it requires |
|---|---|
| YouTube's disclosure rule | Creators must disclose realistic content that is altered or synthetic: a real person appearing to say or do something they did not, altered footage of a real event or place, or a realistic scene that did not happen. Not required for clearly unrealistic content, minor edits, or using AI to help with a script, ideas, a title, or a thumbnail |
| Labels on other platforms | The large social platforms attach AI labels, using a creator's disclosure and signals embedded in the file by AI tools |
| The EU's AI Act, Article 50 | Applies from August 2026. Those who publish deepfake image, audio, or video must disclose that it is artificially generated or manipulated, with a lighter duty for evidently artistic or satirical work |
| Advertising rules | In the United States, the Federal Trade Commission requires clear disclosure of any material connection to a brand, in the content itself, and bans fake reviews and testimonials, including AI-generated ones |
| Copyright | In the United States, material generated wholly by AI is not protected by copyright. Human selection, arrangement, and modification can be |

The pattern in the first row recurs across the others. Using AI to help you make something is generally unremarkable. Presenting something synthetic as real is where disclosure is required. The last row is a reason, beyond quality, to put real work of your own into what you publish: it is the part you own.

### Measuring

The simplest useful measure of a post is its **engagement rate**:

$$
\text{engagement rate} = \frac{\text{likes} + \text{comments} + \text{shares} + \text{saves}}{\text{reach}}
$$

where reach is the number of people who saw it. A rate allows a post seen by 2,000 people to be compared with one seen by 20,000. Grouping posts by pillar and comparing the rates tells you which subjects your audience responds to. Later chapters add the measures specific to each format.

### Complexity

Each function in the lab is linear in its input, or faster: the length of a draft, the number of days in a calendar, the number of stages, the number of posts. The quantity that matters in practice is hours per piece at the bottleneck stage.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, checking a draft against a voice guide.

```python
import datetime
import re

GUIDE = {
    "banned": ["game-changer", "unlock", "in today's fast-paced world", "delve"],
    "max_sentence_words": 20,
    "max_exclamations": 1,
    "direct_address": True,
}

def voice_check(text, guide):
    problems = []
    lowered = text.lower()
    problems += ["banned:" + phrase for phrase in guide.get("banned", []) if phrase.lower() in lowered]
    sentences = [sentence for sentence in re.split(r"[.!?]+", text) if sentence.strip()]
    long_ones = sum(1 for sentence in sentences if len(sentence.split()) > guide.get("max_sentence_words", 10 ** 9))
    if long_ones:
        problems.append(f"long-sentences:{long_ones}")
    marks = text.count("!")
    if marks > guide.get("max_exclamations", 10 ** 9):
        problems.append(f"exclamations:{marks}")
    if guide.get("direct_address") and not re.search(r"\byou(r)?\b", lowered):
        problems.append("no-direct-address")
    return problems

AI_DRAFT = ("In today's fast-paced world, sharpening tools is a game-changer! Unlock the full potential of every chisel "
            "in the workshop by following a carefully structured process that takes into account the angle, the grit, "
            "and the pressure applied! Results guaranteed!")
OURS = ("A blunt chisel tears the wood. You can fix that in ten minutes. Start with the coarse stone, "
        "keep the angle at 25 degrees, and finish on the fine side.")
print(voice_check(AI_DRAFT, GUIDE))
print(voice_check(OURS, GUIDE))
```

- **The guide is data.** Banned phrases, a limit on sentence length, a limit on exclamation marks, and whether the reader must be addressed directly. A different brand changes the dictionary, not the function.
- **Four checks, each from the voice guide table.** A banned phrase anywhere in the text. A count of sentences over the limit. A count of exclamation marks if there are too many. And whether "you" or "your" appears.
- **The generic draft has six findings.** Three banned phrases, one sentence of 28 words, three exclamation marks, and no direct address. It is what a model writes when given a topic and nothing else.
- **The shop's own paragraph has none.** Short sentences, a measurement, the reader addressed as "you".
- **The check is mechanical, and that is its limit.** It can tell that a draft breaks the rules. It cannot tell that a draft which keeps them is any good. It is a gate for the obvious faults, placed before a person reads.

Next, a content calendar.

```python
SLOTS = {0: "carousel", 2: "reel", 4: "long video"}        # Monday, Wednesday, Friday
PILLARS = ["how-to", "behind the scenes", "product", "customer story"]

def build_calendar(start, weeks, slots, pillars):
    first = datetime.date.fromisoformat(start)
    plan = []
    for offset in range(weeks * 7):
        day = first + datetime.timedelta(days=offset)
        if day.weekday() in slots:
            plan.append({"date": day.isoformat(), "format": slots[day.weekday()], "pillar": pillars[len(plan) % len(pillars)]})
    return plan

for row in build_calendar("2026-11-16", 2, SLOTS, PILLARS):
    print(row["date"], row["format"], "-", row["pillar"])
```

- **Slots map a day of the week to a format.** Monday is numbered 0. Here the shop posts a carousel on Mondays, a short video on Wednesdays, and a long video on Fridays.
- **Pillars rotate through the slots.** Each new slot takes the next pillar in the list, returning to the first after the last.
- **Two weeks give six slots.** The dates run from Monday 16 November to Friday 27 November.
- **Four pillars across three formats do not line up, on purpose.** The how-to pillar is a carousel in the first week and a short video in the second. Over twelve slots every pillar appears in every format, which shows which combination works.
- **The calendar is a plan to batch against.** All the scripts for a fortnight can be written in one sitting, because the list says what they are.

Then, when a piece needs a label.

```python
def disclosure(item):
    synthetic = set(item.get("uses", [])) & {"voice", "visuals", "face"}
    if not synthetic:
        return "no label: AI assisted the process only"
    if item.get("minor"):
        return "no label: minor edit"
    if not item.get("realistic"):
        return "no label: clearly not realistic"
    return "label: realistic synthetic " + ", ".join(sorted(synthetic))

print(disclosure({"uses": ["script", "ideas", "title"]}))
print(disclosure({"uses": ["visuals"], "realistic": False}))
print(disclosure({"uses": ["visuals"], "realistic": True, "minor": True}))
print(disclosure({"uses": ["voice", "face"], "realistic": True}))
```

- **The function encodes the pattern of the disclosure table.** It asks what the audience sees and hears, not which tools were used.
- **AI used for the script, the ideas, or the title needs no label.** None of that is synthetic media presented to the viewer.
- **A cartoon made with an image model needs none.** Nobody would take it for a recording of reality.
- **A minor edit needs none.** Colour correction and background blur are of this kind.
- **A realistic synthetic voice and face do.** The viewer could believe they are watching a real person speak.
- **This is a simplification of rules that change.** It is a prompt to check the platform's current policy. It is not a substitute for reading it, and some platforms make exceptions this function does not model, such as a creator cloning their own voice for a translated version.

Finally, the bottleneck, and what the audience responds to.

```python
def bottleneck(stages):
    capacity = {name: round(available / per_piece, 2) for name, per_piece, available in stages}
    slowest = min(capacity, key=capacity.get)
    return {"bottleneck": slowest, "per_week": capacity[slowest], "capacity": capacity}

BY_HAND = [("ideate", 0.5, 3), ("script", 2, 8), ("produce", 1.5, 6), ("edit", 2, 6), ("review", 1, 2), ("publish", 0.25, 1), ("analyse", 0.25, 1)]
WITH_AI = [("ideate", 0.25, 3), ("script", 0.5, 8), ("produce", 1.5, 6), ("edit", 1, 6), ("review", 1, 2), ("publish", 0.25, 1), ("analyse", 0.25, 1)]
MORE_REVIEW = [stage if stage[0] != "review" else ("review", 1, 4) for stage in WITH_AI]
for plan in (BY_HAND, WITH_AI, MORE_REVIEW):
    result = bottleneck(plan)
    print(result["bottleneck"], result["per_week"], result["capacity"]["script"])

def pillar_report(posts):
    totals = {}
    for post in posts:
        total = totals.setdefault(post["pillar"], {"reach": 0, "actions": 0, "posts": 0})
        total["reach"] += post["reach"]
        total["actions"] += post["likes"] + post["comments"] + post["shares"] + post["saves"]
        total["posts"] += 1
    rows = [(name, round(total["actions"] / total["reach"], 3) if total["reach"] else 0.0, total["posts"]) for name, total in totals.items()]
    return sorted(rows, key=lambda row: (-row[1], row[0]))

POSTS = [
    {"pillar": "how-to", "reach": 4000, "likes": 220, "comments": 30, "shares": 60, "saves": 170},
    {"pillar": "how-to", "reach": 6000, "likes": 300, "comments": 45, "shares": 95, "saves": 280},
    {"pillar": "product", "reach": 5000, "likes": 110, "comments": 10, "shares": 8, "saves": 22},
    {"pillar": "product", "reach": 3000, "likes": 70, "comments": 4, "shares": 5, "saves": 11},
    {"pillar": "behind the scenes", "reach": 2500, "likes": 190, "comments": 40, "shares": 12, "saves": 8},
]
print(pillar_report(POSTS))
```

- **Each stage is a name, the hours one piece takes, and the hours available each week.** Dividing the second into the third gives the stage's capacity in pieces per week. The list has seven entries, because the final review, which the stage table places inside editing, is counted separately here.
- **By hand, the shop's limit is review, at two pieces a week.** Scripting could manage four and editing three. The owner has two hours a week for final checks, at an hour each, and that is the constraint.
- **With AI, scripting capacity rises from 4 to 16 pieces a week, and output stays at two.** The tool made a stage that was not the bottleneck four times faster. Nothing more is published.
- **Doubling review time doubles output, to four a week.** The limit is then four, shared by production, publishing, and analysis, and the function reports production because it comes first in the list. That is where the next hour, or the next tool, should go.
- **`pillar_report` adds up reach and interactions for each pillar and divides.** It pools the posts before dividing, so a post with large reach counts for more than a small one.
- **How-to content has an engagement rate of 0.12, and product posts 0.03.** Behind-the-scenes posts are at 0.10, from a single post. The audience is saying what it comes for.
- **The report is where the loop closes.** The next calendar should carry more how-to pieces. One post is too few to judge the behind-the-scenes pillar, so it earns another try and not a conclusion.

**Complexity.** `voice_check` is linear in the draft. `build_calendar` is linear in the number of days. `disclosure` is constant time. `bottleneck` and `pillar_report` are linear in the stages and the posts.

### A one-page pipeline

```text
IDEATE    Pillar: [which]        Angle: [what we think, in one sentence]
          Gate: would our audience care, and do we have something of our own to say?

SCRIPT    AI: outline and first draft, from our notes and voice samples
          Gate: every fact checked against a source. Voice check passed.

PRODUCE   AI: [images / voice / video], recorded footage where it matters
          Gate: rights and consent for every voice, face, and image.

EDIT      AI: transcript, captions, rough cut, title options
          Gate: final review by a person. Would we watch this?

PUBLISH   Format for the platform. Label if realistic synthetic media. Disclose any sponsor.

ANALYSE   After 7 days: reach, engagement rate, comments. One thing to change next time.
```

### Deciding what to hand to AI

| Hand over | Keep |
|---|---|
| Outlines and first drafts | The idea and the opinion |
| Variations: ten titles, five openings | Choosing among them |
| Transcripts, captions, translations | Checking names, numbers, and claims |
| Rough cuts and clips from long recordings | The final cut |
| Reformatting one piece for another platform | Deciding whether it belongs there |
| Summaries of comments and numbers | Deciding what to do about them |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Starting with the tool.** "What can I make with this video generator?" leads to content about nothing. Start with what you have to say and to whom, then choose the tools the piece needs.

**Automating the idea.** Asking a model for "ten viral content ideas" returns the ten ideas everyone else was given. Use the model to expand, challenge, and organise ideas that came from your own work, your customers' questions, and your comments.

**Publishing the first draft.** A model's first draft is fluent and generic. The work that makes it worth reading, cutting a third, adding the specific example, removing the stock phrases, is the edit. Budget more time for it than for the drafting.

**Speeding up the wrong stage.** A new tool makes scripting ten times faster and output does not change, because review, or filming, was the limit. Find the bottleneck before buying anything.

**No fact check.** Invented statistics, misattributed quotes, and features a product does not have all read perfectly well. Every number and name in a script is checked against a source before production, when fixing it is still cheap.

**No voice guide.** Without one, every piece sounds like the model, and so like every other account using it. Write the guide once, with samples, and include it every time.

**Volume over quality.** Daily posts of nothing in particular train an audience to scroll past, and are what platform policies on mass-produced content are aimed at. Fewer pieces with something in them outperform more pieces with nothing.

**Inconsistent pillars.** An account that covers woodworking, then cryptocurrency, then recipes gives nobody a reason to follow. Choose a few subjects and stay with them long enough to learn what works.

**Skipping the analysis.** Publishing and moving on means every piece is a first attempt. Ten minutes a week with the numbers, ending in one decision, is what makes the pipeline a loop.

**Reading too much into one post.** A single piece that did well, or badly, is mostly chance. Module 5.9 made the point for prompts, and it holds for posts: compare groups, not single results.

**Not labelling.** Realistic synthetic footage of a real person, published without the platform's label, risks removal and penalties, and costs trust when the audience notices. When in doubt, label.

**Using what you have no right to.** A cloned voice, a celebrity's likeness, a brand's character, or a song, generated in seconds, is still someone else's. The chapters on voice, avatars, and images return to consent and licensing.

**A pipeline too heavy to run.** Seven tools, four approvals, and a spreadsheet for a weekly post will be abandoned in a month. Begin with the simplest version that has an idea gate and a final review, and add only what a real problem calls for.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Every piece of content passes through six stages: ideate, script, produce, edit, publish, and analyse, with the last feeding the first. AI is strongest in the middle, drafting, generating, transcribing, and cutting, and weakest at the ends, where someone must decide what is worth making and whether it is fit to publish. A point of view, truth, taste, relationships with the audience, and accountability stay with a person. Content with nothing of a person in it is what readers reject and what platform policies on scaled and inauthentic content penalise. Output is set by the slowest stage, $\min_{i} H_{i}/h_{i}$, so a tool helps only if it speeds up the bottleneck, which after adopting AI is usually human review. A voice guide with samples keeps the work recognisably yours, and pillars, formats, and a cadence, written into a calendar, keep it consistent and allow batching. Realistic synthetic media presented as real must be disclosed, sponsorship must be disclosed, and work generated wholly by AI may not be yours to own. Measuring engagement rate by pillar closes the loop.

**Question 1.** A creator's weekly hours and time per piece are: scripting 2 hours per piece with 8 hours available, filming 1.5 hours with 6 available, editing 2 hours with 6 available, and final review 1 hour with 2 available. How many pieces a week can be produced, and what limits it? An AI tool cuts scripting to half an hour and editing to one hour. What is the new output? What should the creator do to publish more?

<details>
<summary>View Answer</summary>

Each stage's capacity is its available hours divided by the hours per piece. Scripting can handle 8 divided by 2, which is 4 pieces a week. Filming can handle 6 divided by 1.5, which is 4. Editing can handle 6 divided by 2, which is 3. Review can handle 2 divided by 1, which is 2. The pipeline produces the smallest of these, so two pieces a week, and the limit is the final review. With the AI tool, scripting capacity becomes 8 divided by 0.5, which is 16, and editing becomes 6 divided by 1, which is 6. Filming is still 4 and review is still 2. The output is unchanged at two pieces a week. The tool made two stages much faster, and neither was the constraint. To publish more, the creator has to raise the capacity of review. They could give it more hours, since the hours saved in scripting and editing are now free: moving two of them to review gives 4 hours and a capacity of 4. They could also make each review faster without making it worse, for example with a checklist and with mechanical checks for the voice guide and for unverified numbers, so that the hour is spent on judgement. With review at 4 a week, the limit becomes filming, also at 4, and the next improvement has to be made there. What the creator should not do is skip the review to keep up with the faster drafting. The review is where errors and generic material are caught, and removing it raises output only by lowering what the output is worth.

</details>

**Question 2.** A shop publishes three kinds of piece this month: a tutorial whose script and title were drafted with AI and which was filmed in the workshop; an animated explainer made entirely with an image and video model in a cartoon style; and a short video in which a realistic AI-generated presenter, who does not exist, reviews the shop's chisels as if she had used them. For each, say whether a label is needed under the pattern described in this chapter, and identify any other problem.

<details>
<summary>View Answer</summary>

The tutorial needs no label for synthetic content. AI helped with the script and the title, which is assistance with the process. What the viewer sees and hears is real footage of a real workshop. The obligation here is the ordinary one: the facts in the AI-drafted script must have been checked. The animated explainer was made entirely with AI and still needs no label under the rule as described, because the test is whether a viewer could take it for reality, and a cartoon is clearly not a recording of real events. Some platforms may attach an AI label automatically from signals embedded by the tools, which is harmless. The third piece needs a label: it shows a realistic person, generated by AI, speaking as though she were real, which is exactly what the disclosure rules cover, and in the European Union Article 50 of the AI Act would require it to be disclosed as artificially generated. It also has a second and more serious problem that a label does not cure. The presenter claims to have used the chisels, and she has not, because she does not exist. That is a fabricated testimonial for the shop's own product. Consumer protection rules in the United States ban fake reviews and testimonials, including AI-generated ones, and an endorsement must reflect real experience. The shop could keep the format honestly by having the presenter clearly introduced as the shop's AI presenter, describing the product's features without claiming personal use, or by filming a real customer.

</details>

**Question 3.** An account that posts AI-drafted pieces every day has seen its reach fall for three months. The posts are grammatical, cover trending topics, and are published on schedule. Using the ideas of this chapter, give the likely causes and a plan to fix it.

<details>
<summary>View Answer</summary>

The likely cause is that the posts contain nothing that came from a person. Topics chosen because they are trending, and drafted by a model from a short prompt, come out as the average of what has been said about them, the same piece that many other accounts are publishing that day. Audiences scroll past what they have effectively seen before, and the ranking systems register that they do. Daily volume makes it worse, since it teaches followers that the account's posts can be skipped, and it is the pattern that platform policies on mass-produced content describe. Trending topics also mean there are no stable pillars, so nobody knows what the account is for. A fall over three months is long enough that it is not chance. The plan follows the pipeline. At the idea stage, choose three or four pillars tied to what the account's owner knows from experience, and require each piece to have an angle of its own, one sentence saying what we think, before anything is drafted. At the script stage, write a voice guide with samples and give it to the model every time, feed it the owner's own notes and examples as raw material, check every fact, and edit hard. Cut the cadence to what allows that, perhaps three pieces a week, and put the saved hours into the edit and review. At the analysis stage, compute engagement rate by pillar each week, compare groups of posts and not single ones, and move the calendar towards what the audience responds to. And reply to comments, since the questions people ask are the best source of the next idea. The test of the plan is whether engagement rate per post rises over the following two months, even though the number of posts has fallen.

</details>

@@starter
"""
Lab: Voice, Calendar, Disclosure, Bottleneck, and Results
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import datetime
import re

GUIDE = {
    "banned": ["game-changer", "unlock", "in today's fast-paced world", "delve"],
    "max_sentence_words": 20,
    "max_exclamations": 1,
    "direct_address": True,
}

AI_DRAFT = ("In today's fast-paced world, sharpening tools is a game-changer! Unlock the full potential of every chisel "
            "in the workshop by following a carefully structured process that takes into account the angle, the grit, "
            "and the pressure applied! Results guaranteed!")

OURS = ("A blunt chisel tears the wood. You can fix that in ten minutes. Start with the coarse stone, "
        "keep the angle at 25 degrees, and finish on the fine side.")

SLOTS = {0: "carousel", 2: "reel", 4: "long video"}        # weekday number -> format (Monday is 0)
PILLARS = ["how-to", "behind the scenes", "product", "customer story"]

BY_HAND = [("ideate", 0.5, 3), ("script", 2, 8), ("produce", 1.5, 6), ("edit", 2, 6), ("review", 1, 2), ("publish", 0.25, 1), ("analyse", 0.25, 1)]
WITH_AI = [("ideate", 0.25, 3), ("script", 0.5, 8), ("produce", 1.5, 6), ("edit", 1, 6), ("review", 1, 2), ("publish", 0.25, 1), ("analyse", 0.25, 1)]

POSTS = [
    {"pillar": "how-to", "reach": 4000, "likes": 220, "comments": 30, "shares": 60, "saves": 170},
    {"pillar": "how-to", "reach": 6000, "likes": 300, "comments": 45, "shares": 95, "saves": 280},
    {"pillar": "product", "reach": 5000, "likes": 110, "comments": 10, "shares": 8, "saves": 22},
    {"pillar": "product", "reach": 3000, "likes": 70, "comments": 4, "shares": 5, "saves": 11},
    {"pillar": "behind the scenes", "reach": 2500, "likes": 190, "comments": 40, "shares": 12, "saves": 8},
]


# ---------------------------------------------------------------- Step 1
def voice_check(text, guide):
    """Return a list of problems, in this order:
        "banned:" + phrase      for each phrase in guide["banned"] found in the text, ignoring case
        "long-sentences:" + N   if N > 0 sentences have more words than guide["max_sentence_words"]
                                (split the text into sentences with re.split(r"[.!?]+", text),
                                 ignoring blank pieces)
        "exclamations:" + N     if the number N of "!" characters is above guide["max_exclamations"]
        "no-direct-address"     if guide["direct_address"] is true and the lowercase text contains
                                neither "you" nor "your" as a whole word (re.search(r"\\byou(r)?\\b", ...))
    A key missing from the guide means that check is skipped."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def build_calendar(start, weeks, slots, pillars):
    """start is an ISO date string such as "2026-11-16". Go through weeks * 7 consecutive days
    from that date. For each day whose weekday() number is a key of slots, add
        {"date": the day's ISO string, "format": slots[weekday], "pillar": the next pillar}
    where pillars are taken in order and repeat from the start. Return the list."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def disclosure(item):
    """item may have "uses" (a list of what AI was used for), "realistic" and "minor" (booleans).
    Synthetic media is any of "voice", "visuals", "face" in item["uses"]. Return:
        "no label: AI assisted the process only"   if there is no synthetic media
        "no label: minor edit"                     otherwise, if item["minor"] is true
        "no label: clearly not realistic"          otherwise, if item["realistic"] is not true
        "label: realistic synthetic " + the synthetic kinds, sorted and joined with ", "
    """
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def bottleneck(stages):
    """stages is a list of (name, hours per piece, hours available per week).
    capacity of a stage = hours available / hours per piece, rounded to 2 places.
    Return {"bottleneck": the name with the smallest capacity (the first, if tied),
            "per_week": that capacity, "capacity": {name: capacity for every stage}}."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def pillar_report(posts):
    """For each pillar, add up reach, the interactions (likes + comments + shares + saves),
    and the number of posts. The engagement rate is interactions / reach, rounded to 3 places,
    or 0.0 if the reach is 0. Return a list of (pillar, rate, number of posts), sorted by rate
    from highest to lowest, with ties in alphabetical order of pillar."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("voice    :", voice_check(AI_DRAFT, GUIDE))
    print("calendar :", build_calendar("2026-11-16", 1, SLOTS, PILLARS))
    print("label    :", disclosure({"uses": ["voice", "face"], "realistic": True}))
    print("limit    :", bottleneck(WITH_AI))
    print("results  :", pillar_report(POSTS))

@@solution
"""
Lab solution: Voice, Calendar, Disclosure, Bottleneck, and Results
Standard library only.
"""
import datetime
import re

GUIDE = {
    "banned": ["game-changer", "unlock", "in today's fast-paced world", "delve"],
    "max_sentence_words": 20,
    "max_exclamations": 1,
    "direct_address": True,
}

AI_DRAFT = ("In today's fast-paced world, sharpening tools is a game-changer! Unlock the full potential of every chisel "
            "in the workshop by following a carefully structured process that takes into account the angle, the grit, "
            "and the pressure applied! Results guaranteed!")

OURS = ("A blunt chisel tears the wood. You can fix that in ten minutes. Start with the coarse stone, "
        "keep the angle at 25 degrees, and finish on the fine side.")

SLOTS = {0: "carousel", 2: "reel", 4: "long video"}        # weekday number -> format (Monday is 0)
PILLARS = ["how-to", "behind the scenes", "product", "customer story"]

BY_HAND = [("ideate", 0.5, 3), ("script", 2, 8), ("produce", 1.5, 6), ("edit", 2, 6), ("review", 1, 2), ("publish", 0.25, 1), ("analyse", 0.25, 1)]
WITH_AI = [("ideate", 0.25, 3), ("script", 0.5, 8), ("produce", 1.5, 6), ("edit", 1, 6), ("review", 1, 2), ("publish", 0.25, 1), ("analyse", 0.25, 1)]

POSTS = [
    {"pillar": "how-to", "reach": 4000, "likes": 220, "comments": 30, "shares": 60, "saves": 170},
    {"pillar": "how-to", "reach": 6000, "likes": 300, "comments": 45, "shares": 95, "saves": 280},
    {"pillar": "product", "reach": 5000, "likes": 110, "comments": 10, "shares": 8, "saves": 22},
    {"pillar": "product", "reach": 3000, "likes": 70, "comments": 4, "shares": 5, "saves": 11},
    {"pillar": "behind the scenes", "reach": 2500, "likes": 190, "comments": 40, "shares": 12, "saves": 8},
]


# ---------------------------------------------------------------- Step 1
def voice_check(text, guide):
    """A gate for the obvious faults, placed before a person reads. It can tell that a
    draft breaks the rules. It cannot tell that a draft which keeps them is any good."""
    problems = []
    lowered = text.lower()
    problems += ["banned:" + phrase for phrase in guide.get("banned", []) if phrase.lower() in lowered]
    sentences = [sentence for sentence in re.split(r"[.!?]+", text) if sentence.strip()]
    long_ones = sum(1 for sentence in sentences if len(sentence.split()) > guide.get("max_sentence_words", 10 ** 9))
    if long_ones:
        problems.append(f"long-sentences:{long_ones}")
    marks = text.count("!")
    if marks > guide.get("max_exclamations", 10 ** 9):
        problems.append(f"exclamations:{marks}")
    if guide.get("direct_address") and not re.search(r"\byou(r)?\b", lowered):
        problems.append("no-direct-address")
    return problems


# ---------------------------------------------------------------- Step 2
def build_calendar(start, weeks, slots, pillars):
    """Pillars, formats, and cadence written against dates: the plan the pipeline runs to,
    and the list that makes batching possible."""
    first = datetime.date.fromisoformat(start)
    plan = []
    for offset in range(weeks * 7):
        day = first + datetime.timedelta(days=offset)
        if day.weekday() in slots:
            plan.append({"date": day.isoformat(), "format": slots[day.weekday()], "pillar": pillars[len(plan) % len(pillars)]})
    return plan


# ---------------------------------------------------------------- Step 3
def disclosure(item):
    """Asks what the audience sees and hears, not which tools were used. A simplification of
    rules that change: a prompt to check the platform's current policy, not a substitute."""
    synthetic = set(item.get("uses", [])) & {"voice", "visuals", "face"}
    if not synthetic:
        return "no label: AI assisted the process only"
    if item.get("minor"):
        return "no label: minor edit"
    if not item.get("realistic"):
        return "no label: clearly not realistic"
    return "label: realistic synthetic " + ", ".join(sorted(synthetic))


# ---------------------------------------------------------------- Step 4
def bottleneck(stages):
    """A pipeline produces as fast as its slowest stage. Speeding up any other stage
    changes nothing, which is the question to ask of every tool."""
    capacity = {name: round(available / per_piece, 2) for name, per_piece, available in stages}
    slowest = min(capacity, key=capacity.get)
    return {"bottleneck": slowest, "per_week": capacity[slowest], "capacity": capacity}


# ---------------------------------------------------------------- Step 5
def pillar_report(posts):
    """Where the loop closes: what the audience responded to decides the next calendar.
    Pooled per pillar, so a large post counts for more than a small one."""
    totals = {}
    for post in posts:
        total = totals.setdefault(post["pillar"], {"reach": 0, "actions": 0, "posts": 0})
        total["reach"] += post["reach"]
        total["actions"] += post["likes"] + post["comments"] + post["shares"] + post["saves"]
        total["posts"] += 1
    rows = [(name, round(total["actions"] / total["reach"], 3) if total["reach"] else 0.0, total["posts"]) for name, total in totals.items()]
    return sorted(rows, key=lambda row: (-row[1], row[0]))


if __name__ == "__main__":
    print(voice_check(AI_DRAFT, GUIDE))
    print(voice_check(OURS, GUIDE))
    print(max(len(sentence.split()) for sentence in re.split(r"[.!?]+", AI_DRAFT)))

    for row in build_calendar("2026-11-16", 2, SLOTS, PILLARS):
        print(row["date"], row["format"], "-", row["pillar"])

    print(disclosure({"uses": ["script", "ideas", "title"]}))
    print(disclosure({"uses": ["visuals"], "realistic": False}))
    print(disclosure({"uses": ["visuals"], "realistic": True, "minor": True}))
    print(disclosure({"uses": ["voice", "face"], "realistic": True}))

    more_review = [stage if stage[0] != "review" else ("review", 1, 4) for stage in WITH_AI]
    for plan in (BY_HAND, WITH_AI, more_review):
        result = bottleneck(plan)
        print(result["bottleneck"], result["per_week"], result["capacity"]["script"])
    print(bottleneck([("script", 2, 8), ("film", 1.5, 6), ("edit", 2, 6), ("review", 1, 2)]))
    print(bottleneck([("script", 0.5, 8), ("film", 1.5, 6), ("edit", 1, 6), ("review", 1, 2)]))

    print(pillar_report(POSTS))
    print(round(0.95 ** 6, 3))

@@step
{
  "stepNumber": 1,
  "title": "Check a draft against the voice guide",
  "instruction": "Implement voice_check(text, guide). Return a list of problems in this order. For each phrase in the guide's 'banned' list that appears in the text, ignoring case, add 'banned:' followed by the phrase. Split the text into sentences with re.split(r\"[.!?]+\", text), ignoring blank pieces, and count those with more words than the guide's 'max_sentence_words'; if the count is above zero, add 'long-sentences:' followed by the count. Count the exclamation marks; if there are more than the guide's 'max_exclamations', add 'exclamations:' followed by the count. If the guide's 'direct_address' is true and the lowercase text contains neither 'you' nor 'your' as a whole word, add 'no-direct-address'. A key missing from the guide means that check is skipped. Run it on AI_DRAFT and on OURS. This is the mechanical part of the voice guide from Section 2. [MOD-6.1]",
  "hintConceptual": "A subeditor's first pass looks for house-style offences that need no judgement: a forbidden phrase, a sentence that runs on, too much excitement, and whether the reader is spoken to at all.",
  "hintSyntax": "problems = []\nlowered = text.lower()\nproblems += [\"banned:\" + phrase for phrase in guide.get(\"banned\", []) if phrase.lower() in lowered]\nsentences = [sentence for sentence in re.split(r\"[.!?]+\", text) if sentence.strip()]\nlong_ones = sum(1 for sentence in sentences if len(sentence.split()) > guide.get(\"max_sentence_words\", 10 ** 9))\nif long_ones:\n    problems.append(f\"long-sentences:{long_ones}\")\nmarks = text.count(\"!\")\nif marks > guide.get(\"max_exclamations\", 10 ** 9):\n    problems.append(f\"exclamations:{marks}\")\nif guide.get(\"direct_address\") and not re.search(r\"\\byou(r)?\\b\", lowered):\n    problems.append(\"no-direct-address\")\nreturn problems"
}
@@assert
assert voice_check(AI_DRAFT, GUIDE) == ["banned:game-changer", "banned:unlock", "banned:in today's fast-paced world", "long-sentences:1", "exclamations:3", "no-direct-address"], f"The generic draft has six findings, got {voice_check(AI_DRAFT, GUIDE)}"
assert voice_check(OURS, GUIDE) == [], f"The shop's own paragraph has none, got {voice_check(OURS, GUIDE)}"
assert voice_check("Your saw is blunt. Fix it!", GUIDE) == [], "One exclamation mark is within the limit, and 'your' counts as direct address"
assert voice_check("You should DELVE into this.", GUIDE) == ["banned:delve"], "Banned phrases are found whatever the case"
assert voice_check("The youth sharpened a tool.", GUIDE) == ["no-direct-address"], "Whole words only: 'youth' is not 'you'"
assert voice_check("You will see. " + "word " * 21 + ". And " + "word " * 25 + ".", GUIDE) == ["long-sentences:2"], "Each sentence over the limit is counted"
assert voice_check("Wow! Great! Buy now!", {"max_exclamations": 2}) == ["exclamations:3"], "Checks whose key is missing from the guide are skipped"
assert voice_check(AI_DRAFT, {}) == [] and voice_check("", GUIDE) == ["no-direct-address"], "An empty guide checks nothing, and an empty text addresses nobody"
print("Step 1 passed: three banned phrases, a 28-word sentence, three exclamation marks, and no 'you'.")

@@step
{
  "stepNumber": 2,
  "title": "Build a content calendar",
  "instruction": "Implement build_calendar(start, weeks, slots, pillars). The start is an ISO date string, which datetime.date.fromisoformat turns into a date. Go through weeks times 7 consecutive days beginning with the start date, adding datetime.timedelta(days=offset) for each. For each day whose weekday() number is a key in slots, append a dict with 'date', the day's isoformat(); 'format', the slot's value; and 'pillar', the next pillar in the list, which is pillars[number of entries so far, modulo the number of pillars]. Return the list. Build two weeks from Monday 16 November 2026 with SLOTS and PILLARS. This is the calendar from Section 2: pillars, formats, and cadence written against dates. [MOD-6.1]",
  "hintConceptual": "A rota on the wall: certain days of the week have a job, and the subjects take turns in a fixed order, starting again when the list runs out.",
  "hintSyntax": "first = datetime.date.fromisoformat(start)\nplan = []\nfor offset in range(weeks * 7):\n    day = first + datetime.timedelta(days=offset)\n    if day.weekday() in slots:\n        plan.append({\"date\": day.isoformat(), \"format\": slots[day.weekday()], \"pillar\": pillars[len(plan) % len(pillars)]})\nreturn plan"
}
@@assert
_plan = build_calendar("2026-11-16", 2, SLOTS, PILLARS)
assert _plan is not None and len(_plan) == 6, f"Two weeks with three slots a week is six entries, got {_plan}"
assert [row["date"] for row in _plan] == ["2026-11-16", "2026-11-18", "2026-11-20", "2026-11-23", "2026-11-25", "2026-11-27"], "Mondays, Wednesdays, and Fridays, as ISO dates"
assert [row["format"] for row in _plan] == ["carousel", "reel", "long video", "carousel", "reel", "long video"], "The format comes from the day of the week"
assert [row["pillar"] for row in _plan] == ["how-to", "behind the scenes", "product", "customer story", "how-to", "behind the scenes"], "Pillars rotate in order and start again after the last"
assert _plan[0] == {"date": "2026-11-16", "format": "carousel", "pillar": "how-to"}, "Each entry has a date, a format, and a pillar"
assert build_calendar("2026-11-18", 1, SLOTS, PILLARS) == [{"date": "2026-11-18", "format": "reel", "pillar": "how-to"}, {"date": "2026-11-20", "format": "long video", "pillar": "behind the scenes"}, {"date": "2026-11-23", "format": "carousel", "pillar": "product"}], "A week is seven days from the start date, whatever day that is"
assert build_calendar("2026-11-16", 1, {6: "newsletter"}, ["only"]) == [{"date": "2026-11-22", "format": "newsletter", "pillar": "only"}], "Sunday is weekday 6, and a single pillar repeats"
assert build_calendar("2026-11-16", 0, SLOTS, PILLARS) == [] and build_calendar("2026-11-16", 2, {}, PILLARS) == [], "No weeks or no slots gives an empty calendar"
assert len(build_calendar("2026-12-28", 1, SLOTS, PILLARS)) == 3 and build_calendar("2026-12-28", 1, SLOTS, PILLARS)[2]["date"] == "2027-01-01", "Dates carry over the end of the year"
print("Step 2 passed: six slots across two weeks, with four pillars taking turns.")

@@step
{
  "stepNumber": 3,
  "title": "Decide when a piece needs a label",
  "instruction": "Implement disclosure(item). The item is a dict that may have 'uses', a list of what AI was used for, and the booleans 'realistic' and 'minor'. Find the synthetic media: the members of 'uses' that are 'voice', 'visuals', or 'face'. If there are none, return 'no label: AI assisted the process only'. Otherwise, if 'minor' is true, return 'no label: minor edit'. Otherwise, if 'realistic' is not true, return 'no label: clearly not realistic'. Otherwise return 'label: realistic synthetic ' followed by the synthetic kinds, sorted and joined with a comma and a space. This encodes the pattern of the disclosure table in Section 2: the question is what the audience sees and hears, not which tools were used. It is a simplification of rules that change. [MOD-6.1]",
  "hintConceptual": "Nobody labels a film because the script was typed on a word processor. The question is whether the audience could mistake something made up for something recorded.",
  "hintSyntax": "synthetic = set(item.get(\"uses\", [])) & {\"voice\", \"visuals\", \"face\"}\nif not synthetic:\n    return \"no label: AI assisted the process only\"\nif item.get(\"minor\"):\n    return \"no label: minor edit\"\nif not item.get(\"realistic\"):\n    return \"no label: clearly not realistic\"\nreturn \"label: realistic synthetic \" + \", \".join(sorted(synthetic))"
}
@@assert
assert disclosure({"uses": ["voice", "face"], "realistic": True}) == "label: realistic synthetic face, voice", f"A realistic synthetic voice and face need a label, got {disclosure({'uses': ['voice', 'face'], 'realistic': True})}"
assert disclosure({"uses": ["script", "ideas", "title"]}) == "no label: AI assisted the process only", "AI help with the script, ideas, or title is not synthetic media"
assert disclosure({"uses": ["script", "ideas"], "realistic": True}) == "no label: AI assisted the process only", "Realistic footage with an AI-drafted script still needs no label"
assert disclosure({"uses": ["visuals"], "realistic": False}) == "no label: clearly not realistic" and disclosure({"uses": ["visuals"]}) == "no label: clearly not realistic", "A cartoon is not mistaken for reality, and a missing 'realistic' counts as not realistic"
assert disclosure({"uses": ["visuals"], "realistic": True, "minor": True}) == "no label: minor edit", "A minor edit, such as colour correction, needs no label"
assert disclosure({"uses": ["title", "visuals", "voice", "face", "script"], "realistic": True}) == "label: realistic synthetic face, visuals, voice", "The synthetic kinds are listed in sorted order, and other uses are left out"
assert disclosure({}) == "no label: AI assisted the process only", "An item with nothing in it has no synthetic media"
assert disclosure({"uses": ["voice"], "realistic": True, "minor": False}) == "label: realistic synthetic voice", "A realistic cloned voice alone needs a label"
print("Step 3 passed: the label depends on what the audience could mistake for real.")

@@step
{
  "stepNumber": 4,
  "title": "Find the bottleneck",
  "instruction": "Implement bottleneck(stages). Each stage is a tuple of a name, the hours one piece takes at that stage, and the hours available for it each week. A stage's capacity is the hours available divided by the hours per piece, rounded to 2 decimal places. Build a dict from each name to its capacity. The bottleneck is the name with the smallest capacity, and the first such name if several are equal, which is what min(capacity, key=capacity.get) gives. Return a dict with 'bottleneck', the name; 'per_week', its capacity; and 'capacity', the whole dict. Run it on BY_HAND and on WITH_AI and compare the output per week. This is the throughput formula from Section 2. [MOD-6.1]",
  "hintConceptual": "A convoy travels at the speed of its slowest lorry. Fitting a faster engine to any of the others changes nothing about when the convoy arrives.",
  "hintSyntax": "capacity = {name: round(available / per_piece, 2) for name, per_piece, available in stages}\nslowest = min(capacity, key=capacity.get)\nreturn {\"bottleneck\": slowest, \"per_week\": capacity[slowest], \"capacity\": capacity}"
}
@@assert
_by_hand = bottleneck(BY_HAND)
assert _by_hand is not None and _by_hand["bottleneck"] == "review" and _by_hand["per_week"] == 2.0, f"By hand, review limits the shop to two pieces a week, got {_by_hand}"
assert _by_hand["capacity"] == {"ideate": 6.0, "script": 4.0, "produce": 4.0, "edit": 3.0, "review": 2.0, "publish": 4.0, "analyse": 4.0}, "Each stage's capacity is its hours available divided by its hours per piece"
_with_ai = bottleneck(WITH_AI)
assert _with_ai["bottleneck"] == "review" and _with_ai["per_week"] == 2.0 and _with_ai["capacity"]["script"] == 16.0, "With AI, scripting capacity is 16 a week and output is still two"
_more = bottleneck([stage if stage[0] != "review" else ("review", 1, 4) for stage in WITH_AI])
assert _more["bottleneck"] == "produce" and _more["per_week"] == 4.0, "Doubling review hours doubles output, and the bottleneck moves to production"
assert bottleneck([("a", 1, 3), ("b", 2, 6), ("c", 1, 5)]) == {"bottleneck": "a", "per_week": 3.0, "capacity": {"a": 3.0, "b": 3.0, "c": 5.0}}, "When two stages tie, the first is reported"
assert bottleneck([("only", 3, 10)]) == {"bottleneck": "only", "per_week": 3.33, "capacity": {"only": 3.33}}, "Capacities are rounded to 2 places"
assert bottleneck([("script", 2, 8), ("film", 1.5, 6), ("edit", 2, 6), ("review", 1, 2)])["per_week"] == bottleneck([("script", 0.5, 8), ("film", 1.5, 6), ("edit", 1, 6), ("review", 1, 2)])["per_week"] == 2.0, "The numbers from the first recall question: faster scripting and editing do not raise output"
print("Step 4 passed: AI made scripting four times faster, and the shop still publishes two pieces a week.")

@@step
{
  "stepNumber": 5,
  "title": "Report results by pillar",
  "instruction": "Implement pillar_report(posts). Each post is a dict with a 'pillar', a 'reach', and counts of 'likes', 'comments', 'shares', and 'saves'. For each pillar, add up the reach, the interactions, which are the four counts together, and the number of posts. The pillar's engagement rate is its total interactions divided by its total reach, rounded to 3 decimal places, or 0.0 if the reach is 0. Return a list of tuples of the pillar, its rate, and its number of posts, sorted by rate from highest to lowest, with ties broken by the pillar's name in alphabetical order. Run it on POSTS. This is the engagement rate from Section 2, grouped by pillar, and it is where the pipeline's loop closes. [MOD-6.1]",
  "hintConceptual": "A shopkeeper counts, for each kind of thing in the window, how many passers-by stopped. The kinds people stop for get more of the window next month.",
  "hintSyntax": "totals = {}\nfor post in posts:\n    total = totals.setdefault(post[\"pillar\"], {\"reach\": 0, \"actions\": 0, \"posts\": 0})\n    total[\"reach\"] += post[\"reach\"]\n    total[\"actions\"] += post[\"likes\"] + post[\"comments\"] + post[\"shares\"] + post[\"saves\"]\n    total[\"posts\"] += 1\nrows = [(name, round(total[\"actions\"] / total[\"reach\"], 3) if total[\"reach\"] else 0.0, total[\"posts\"]) for name, total in totals.items()]\nreturn sorted(rows, key=lambda row: (-row[1], row[0]))"
}
@@assert
assert pillar_report(POSTS) == [("how-to", 0.12, 2), ("behind the scenes", 0.1, 1), ("product", 0.03, 2)], f"How-to leads at 0.12, and product trails at 0.03, got {pillar_report(POSTS)}"
_one = {"pillar": "a", "reach": 1000, "likes": 10, "comments": 5, "shares": 3, "saves": 2}
assert pillar_report([_one]) == [("a", 0.02, 1)], "Twenty interactions on a reach of 1,000 is a rate of 0.02"
_small = {"pillar": "a", "reach": 100, "likes": 50, "comments": 0, "shares": 0, "saves": 0}
assert pillar_report([_one, _small]) == [("a", 0.064, 2)], "Posts are pooled before dividing: 70 interactions on a reach of 1,100, not the average of 0.02 and 0.5"
_zero = {"pillar": "z", "reach": 0, "likes": 0, "comments": 0, "shares": 0, "saves": 0}
assert pillar_report([_zero, _one]) == [("a", 0.02, 1), ("z", 0.0, 1)], "A pillar with no reach has a rate of 0.0 and does not cause a division by zero"
_tie_b = dict(_one, pillar="b")
assert pillar_report([_tie_b, _one]) == [("a", 0.02, 1), ("b", 0.02, 1)], "Equal rates are ordered alphabetically by pillar"
assert pillar_report([]) == [], "No posts, no report"
assert [row[0] for row in pillar_report(POSTS + [dict(_one, pillar="product", reach=100, likes=400)])][0] == "how-to", "One unusual post moves its pillar's rate but is weighed with the others"
print("Step 5 passed: the audience responds to how-to content four times as much as to product posts.")
