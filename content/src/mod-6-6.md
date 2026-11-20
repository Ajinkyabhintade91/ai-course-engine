@@meta
{
  "moduleId": "MOD-6.6",
  "slug": "mod-6-6",
  "unitId": "UNIT-6",
  "unitTitle": "Unit 6: AI Content Creation Masterclass",
  "title": "AI Scripts",
  "difficulty": "Foundational",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "Measure key moments for audience retention", "source": "YouTube Help", "url": "https://support.google.com/youtube/answer/9314415" },
    { "title": "Flesch-Kincaid readability tests", "source": "Wikipedia", "url": "https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests" },
    { "title": "Does Writing with Language Models Reduce Content Diversity?", "source": "arXiv", "url": "https://arxiv.org/abs/2309.05196" },
    { "title": "Delving into LLM-assisted writing in biomedical publications through excess vocabulary", "source": "arXiv", "url": "https://arxiv.org/abs/2406.07016" },
    { "title": "Generative AI enhances individual creativity but reduces the collective diversity of novel content", "source": "Science Advances", "url": "https://www.science.org/doi/10.1126/sciadv.adn5290" }
  ],
  "videoLibrary": [
    {
      "id": "VID-6.6-1",
      "title": "How To Write A Killer Script That Keeps Viewers Hooked",
      "creator": "Kallaway",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=7I50PECz7SU",
      "timingInstruction": "Watch after reading Section 2 (hook, promise, body, call to action), and note how the video's own opening follows the structure it teaches",
      "keyTakeaway": "A working creator's method for outlining a script, building the opening, and ordering the points so that viewers keep watching."
    },
    {
      "id": "VID-6.6-2",
      "title": "How to Script a YouTube Video That Keep 'Em hooked",
      "creator": "The Futur",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=Yv8lpauoBYo",
      "timingInstruction": "Watch after reading Section 1, for the argument that the first half-minute decides whether the rest is seen",
      "keyTakeaway": "Makes the case that a long video is lost or won in its opening, and shows how to plan that opening deliberately."
    },
    {
      "id": "VID-6.6-3",
      "title": "How To Make A Good YouTube Hook That Matches (Title & Thumbnail)",
      "creator": "Video Marketing Masterminds",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=W0qNuSi92aY",
      "timingInstruction": "Watch before Module 6.7, since it connects the opening line of a script to the title and thumbnail that brought the viewer there",
      "keyTakeaway": "Shows why a hook has to deliver on the promise made by the title and thumbnail, which is also the advice of the platform's own guidance."
    },
    {
      "id": "VID-6.6-4",
      "title": "AI for Content Creation",
      "creator": "SkillsBooster Academy",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/specializations/generative-ai-for-content-creation",
      "timingInstruction": "Take the writing course of this specialization after completing the lab",
      "keyTakeaway": "Guided practice in drafting and refining written content with generative AI across several formats."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Structure, Timing, Readability, Rhythm, and Retention",
    "context": "A woodworking channel drafts its scripts with AI, and they come out fluent, generic, and slow to start. You will build a check of a script's structure, a timeline of when each part lands, a readability score, a measure of sentence rhythm, and a reader of the audience retention curve that shows where viewers leave.",
    "language": "python"
  }
}

@@reading
# AI Scripts

Everything else in this unit hangs on the script. The voice reads it, the avatar speaks it, the video illustrates it, and the thumbnail promises it. A strong script survives plain production. No production saves a weak one.

A language model will write a script on any subject in seconds. It will be grammatical, well organised, and about as memorable as a terms-of-service page. The reason is the one Module 5.1 gave: a model asked for a script with nothing else produces the most probable script, which is the average of all scripts. This chapter is about getting past the average. It covers the structure that holds attention, how to prompt for a draft that sounds like you, and the editing that turns a draft into something worth watching.

## 1. First-Principles Mental Model & Intuition

### The viewer with a thumb on the screen

A reader of a book has paid for it and sat down. A viewer of online video has done neither. They arrived a second ago, something else is one flick of the thumb away, and they are deciding continuously whether to stay.

A script for that viewer is not an essay read aloud. It is a series of reasons to keep watching, delivered in order.

- In the first seconds: a reason to stay for the next ten.
- In the first half-minute: a reason to stay for the rest.
- Throughout: evidence that the promise is being kept.
- At the end: one thing to do next.

Those four are the **hook**, the **promise**, the **body**, and the **call to action**.

### The shape of a script

```text
   0 s        5 s             15 s                                          end
   |----------|----------------|---------------------------------------------|
   |  HOOK    |   PROMISE      |   BODY                              | CALL  |
   |          |                |   point - point - point             | TO    |
   | why      | what you get   |   each one delivers part of         | ACTION|
   | look     | and why        |   the promise, and sets up          | one   |
   | at all   | stay           |   the next                          | ask   |
   |----------|----------------|---------------------------------------------|

   viewers
   still       100% --\
   watching            \__ steep drop in the first seconds
                          \_______
                                  \____________ gentle decline
                                               \______________________
```

The curve under the diagram is the one every video has. A large share of viewers leave at once, and the rest drift away slowly. The opening decides how far the curve falls. The body decides how fast it declines afterwards.

### What a model gives you, and what it cannot

| A model supplies readily | Only you can supply |
|---|---|
| A structure | A reason anyone should care |
| Fluent sentences | What happened to you |
| Ten alternative openings | Which one is true to the video |
| Transitions and summaries | A real number, name, or example |
| A competent average | A point of view |

The right-hand column is the script. The left-hand column is help with writing it down.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### The four parts

**The hook** is the first sentence or two. Its only job is to earn the next few seconds. It works by opening a question in the viewer's mind: a surprising fact, a problem they have, a result they want, a claim they doubt. It must connect to the title and thumbnail that brought them, because a viewer who clicked on one thing and hears about another leaves. YouTube's own guidance on audience retention says the same: make the opening match what the title and thumbnail promised.

**The promise** says what the viewer will get and why it is worth their time. "In ten minutes this chisel will be sharp enough to shave with, and I will show you the mistake that ruined my first three." It turns a moment of curiosity into a reason to stay.

**The body** keeps the promise, in parts. Each point should deliver something and lead to the next. One idea per video is the usual rule, with three to five points that serve it.

**The call to action** is the one thing you ask the viewer to do: watch the next video, try the method, subscribe. One ask. Four asks are none.

### Older names for the same shape

Advertising has taught structures like this for over a century.

| Formula | Steps | Fits |
|---|---|---|
| **AIDA** | Attention, Interest, Desire, Action | Anything persuasive. Attributed to the advertising writer E. St. Elmo Lewis around 1900 |
| **Problem, agitate, solve** | Name the problem, make it felt, give the answer | How-to and product content |
| **Hook, promise, payoff** | The shape in this chapter | Most online video |

They agree on the essentials: get attention, give a reason to continue, deliver, ask.

One device deserves a note. An **open loop** is a question raised early and answered later: "the mistake that ruined my first three chisels" is not explained until the third point. Creators often justify it by the Zeigarnik effect, a 1927 finding that unfinished tasks are remembered better than finished ones. Later attempts to reproduce that finding have had mixed results, so treat the open loop as a craft technique that storytellers have always used, and not as a law of psychology. It has one rule: close every loop you open. A promise not kept costs more trust than it bought attention.

### Timing

Module 6.4 gave the arithmetic: at about 150 words a minute, a script of $w$ words lasts $w / 150 \times 60$ seconds. That makes the structure a word budget.

| Part | By when | Words at 150 a minute |
|---|---|---|
| Hook | 5 seconds | About 13 |
| Hook and promise together | 15 seconds | About 38 |
| A 60-second short, in total | 60 seconds | 150 |
| A 5-minute video | 300 seconds | 750 |

The first two rows are the discipline. An opening of "Hello everyone and welcome back to the channel, my name is Sam and today we have a really exciting video for you" is 22 words, and nine seconds, of nothing.

### What retention data shows

The platform tells you where a script failed. YouTube's analytics show an **audience retention** graph: the percentage of viewers still watching at each moment. Its help pages name the features to look for.

| Feature | What it means |
|---|---|
| **Intro** | The share still watching after 30 seconds. A low figure points at the hook, or at a mismatch with the title and thumbnail |
| **Gradual decline** | Normal. Every video has it |
| **Dips** | Viewers skipping or leaving at that point |
| **Spikes** | Parts being rewatched or shared, which may be the best moment, or a confusing one |
| **Top moments** | Stretches where almost nobody leaves |

If retention is recorded at evenly spaced moments as $r_{0}, r_{1}, \dots, r_{n}$, the average percentage of the video that viewers watched is the area under the curve divided by its length:

$$
\text{average viewed} = \frac{1}{n} \sum_{i=0}^{n-1} \frac{r_{i} + r_{i+1}}{2}
$$

The single most useful reading is the largest drop after the opening. Find the moment, open the script at that line, and you will usually see the cause: a tangent, a slow explanation, a sponsor message, a promise that had just been fulfilled so that nothing held the viewer.

### Why AI drafts sound alike

There is evidence for what every reader suspects. A study titled "Does Writing with Language Models Reduce Content Diversity?" had people write essays with and without a model's help. With a chat-tuned model's suggestions, different authors' essays became measurably more alike, and the effect came mostly from the text the model supplied. A study in Science Advances found that stories written with AI-generated ideas were judged more creative individually, and were more similar to one another as a group.

Traces of this can be counted. An analysis of over 15 million biomedical abstracts found that certain words surged after chat models arrived, and estimated from that excess that at least 13.5 percent of abstracts in 2024 had been processed with one. The words themselves became a running joke, "delve" above all.

For a script, the tells are familiar.

| Tell | Example |
|---|---|
| A scene-setting opener | "In today's fast-paced world" |
| The audience named in pairs | "Whether you are a beginner or an experienced woodworker" |
| Abstract nouns | "fundamental principles", "methodologies", "craftsmanship" |
| Promises of a journey | "we will delve into", "let us explore" |
| Sentences of even length | Twenty words, then twenty-four, then twenty |
| Nothing that could be checked | No number, no name, no event |

The last row is the deepest. A model does not know what happened in your workshop. Left to itself, it writes around that gap with generalities.

### Prompting for a draft in your own voice

The prompt has to supply what the model lacks.

| Supply | Because |
|---|---|
| Two or three of your own transcripts | Examples carry voice better than any description, as Module 5.4 showed |
| Your voice guide | The rules from Module 6.1 |
| The raw material: your story, numbers, examples | The model cannot invent your experience, and must not |
| The viewer and what they already know | It sets the level |
| The structure and the word budget | Hook by 13 words, promise by 38, total length |
| The rules of the ear | Short sentences, numbers as words, from Module 6.4 |
| What to avoid | The stock phrases above |

And ask for the work in stages, which Module 5.6 recommended for anything with distinct steps: an outline first, which you correct. Then several hooks, of which you choose one. Then the draft.

### Measuring a draft

Two simple measures catch a great deal.

**Readability.** The Flesch Reading Ease score rates text by sentence length and word length:

$$
\text{FRE} = 206.835 - 1.015 \left( \frac{\text{words}}{\text{sentences}} \right) - 84.6 \left( \frac{\text{syllables}}{\text{words}} \right)
$$

| Score | Reads as |
|---|---|
| 90 to 100 | Very easy |
| 60 to 70 | Plain English |
| 30 to 50 | Difficult |
| 0 to 30 | Very difficult |

Speech should score high. A listener gets one pass, so a script wants to sit well above the level of written prose.

**Rhythm.** Good spoken writing varies its sentence lengths. A short sentence lands. A longer one carries the listener through an explanation and sets up the next short one. If the lengths of the sentences are $l_{1}, \dots, l_{k}$ with mean $\bar{l}$, their spread is the standard deviation

$$
s = \sqrt{\frac{1}{k} \sum_{i=1}^{k} (l_{i} - \bar{l})^{2}}
$$

A draft whose sentences are all about the same length has a small spread, and sounds like a drone.

Neither number measures whether a script is good. A script can be easy, rhythmic, and empty. They measure two ways of being bad that are cheap to detect.

### Editing passes

Editing an AI draft is several passes, each with one aim.

1. **Cut the opening.** The first paragraph of most drafts is preamble. Delete it and see whether anything is lost.
2. **Make it specific.** For every general claim, add a number, a name, or an example of your own, or delete the claim.
3. **Check the facts.** Every figure and every statement about the world, against a source.
4. **Read it aloud.** Mark every place you stumble, run out of breath, or feel bored.
5. **Fix the rhythm.** Break long sentences. Put a short one after a long one.
6. **Rewrite the hook last.** Only when the body exists do you know what you are promising.

A useful expectation is that a third of the draft goes. If you cut nothing, you edited nothing.

### Complexity

Every measure in the lab is linear in the length of the script. The costly resource is the viewer's attention, which is spent fastest in the first fifteen seconds.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, the structure of a script and when each part lands.

```python
import re

SCRIPT = {
    "hook": "This chisel cost four pounds and could not cut butter.",
    "promise": "In ten minutes it will shave the hair off my arm, and I will show you the one mistake to avoid.",
    "body": [
        "Flatten the back on the coarse stone. Twenty strokes. If the back is not flat, nothing else you do will matter.",
        "Set the bevel at twenty-five degrees. Lock your wrists and move from the shoulders.",
        "Here is the mistake. I used to rock the blade, and it rounds the edge. Keep it flat and slow.",
        "Finish on the leather. Ten pulls, edge trailing.",
    ],
    "cta": ["Try it on one chisel tonight and tell me in the comments how it went."],
}
WEAK = {
    "hook": "Hello everyone and welcome back to the channel, my name is Sam and today we have a really exciting video for you.",
    "promise": "",
    "body": ["one", "two", "three", "four", "five", "six", "seven"],
    "cta": ["Like the video.", "Subscribe.", "Hit the bell.", "Follow me on three other platforms."],
}

def structure_problems(script, hook_words=13, promise_by_words=38, max_points=5):
    problems = []
    hook, promise = len(script.get("hook", "").split()), len(script.get("promise", "").split())
    if hook == 0:
        problems.append("no-hook")
    elif hook > hook_words:
        problems.append("hook-too-long")
    if promise == 0:
        problems.append("no-promise")
    elif hook + promise > promise_by_words:
        problems.append("promise-late")
    points = len(script.get("body", []))
    if points == 0:
        problems.append("no-body")
    elif points > max_points:
        problems.append("too-many-points")
    asks = len(script.get("cta", []))
    if asks == 0:
        problems.append("no-cta")
    elif asks > 1:
        problems.append("multiple-ctas")
    return problems

def section_times(script, wpm=150):
    parts = [("hook", script.get("hook", "")), ("promise", script.get("promise", ""))]
    parts += [(f"point {number}", point) for number, point in enumerate(script.get("body", []), start=1)]
    parts += [("cta", " ".join(script.get("cta", [])))]
    rows, clock = [], 0.0
    for name, text in parts:
        seconds = round(len(text.split()) / wpm * 60, 1)
        rows.append((name, round(clock, 1), seconds))
        clock += seconds
    return rows

print(structure_problems(SCRIPT))
print(structure_problems(WEAK))
for name, start, seconds in section_times(SCRIPT):
    print(f"{name:<8} starts {start:>5}  lasts {seconds}")
```

- **A script is held as its four parts.** A hook, a promise, a list of body points, and a list of calls to action. Writing it this way forces the question of what each part is.
- **`structure_problems` checks the word budget from Section 2.** A hook over 13 words takes more than five seconds. A hook and promise over 38 words together means the promise arrives after fifteen seconds.
- **It also counts.** More than five points is too many for one video, and more than one call to action is too many for one ending.
- **The workshop script has no problems.** Its hook is 10 words and its promise 21, so the promise is complete by the 31st word.
- **The weak script has four.** A 22-word greeting for a hook, no promise at all, seven points, and four asks.
- **`section_times` lays the parts on a clock.** The hook lasts 4 seconds. The promise begins at 4 and ends at 12.4. The first point begins there.
- **The mistake promised in the opening is paid off at 26.4 seconds.** That is the open loop of Section 2: raised at the fourth second, closed at the third point. The whole script runs 43.6 seconds.

Next, readability.

```python
def syllables(word):
    word = re.sub(r"[^a-z]", "", word.lower())
    if not word:
        return 0
    count = len(re.findall(r"[aeiouy]+", word))
    if word.endswith("e") and not word.endswith("le") and count > 1:
        count -= 1
    return max(count, 1)

def sentences_of(text):
    return [sentence for sentence in re.split(r"[.!?]+", text) if sentence.strip()]

def flesch_reading_ease(text):
    sentences, words = sentences_of(text), re.findall(r"[A-Za-z']+", text)
    if not sentences or not words:
        return 0.0
    total_syllables = sum(syllables(word) for word in words)
    return round(206.835 - 1.015 * len(words) / len(sentences) - 84.6 * total_syllables / len(words), 1)

AI_DRAFT = ("In today's fast-paced world, maintaining the sharpness of your woodworking tools is an absolutely essential "
            "consideration for achieving professional results. In this comprehensive video, we will delve into the "
            "fundamental principles of chisel sharpening and explore a variety of techniques that can significantly enhance "
            "your craftsmanship. Whether you are a beginner or an experienced woodworker, understanding these methodologies "
            "will undoubtedly elevate the quality of your projects.")
EDITED = ("This chisel cost four pounds at a car boot sale. It could not cut butter. Ten minutes from now it will shave "
          "the hair off my arm. You need two stones and an old leather belt. I will show you the one mistake that ruined "
          "my first three chisels, so that you can skip it.")
print(syllables("chisel"), syllables("made"), syllables("table"), syllables("methodologies"))
print(flesch_reading_ease(AI_DRAFT), flesch_reading_ease(EDITED))
```

- **`syllables` estimates by counting groups of vowels.** A final silent "e" is not counted, except in endings such as "table". It is a rule of thumb, wrong on some words and close on average.
- **"chisel" has two, "made" one, "table" two, and "methodologies" five.** The estimate agrees with the ear on all four.
- **`flesch_reading_ease` is the formula from Section 2.** Words per sentence and syllables per word, each with its weight.
- **The AI draft scores 9.9.** That is in the "very difficult" band, the level of an academic paper. It has 67 words in three sentences, and averages more than two syllables a word.
- **The edited opening scores 95.7.** "Very easy". It has 55 words in five sentences, mostly of one syllable.
- **The two say roughly the same thing.** The second says it in words a listener can take in at speaking speed, and adds what the first lacked: a price, a place, a result, and a mistake.

Then, rhythm.

```python
def rhythm(text):
    lengths = [len(sentence.split()) for sentence in sentences_of(text)]
    if not lengths:
        return {"mean": 0.0, "spread": 0.0, "shortest": 0, "longest": 0}
    mean = sum(lengths) / len(lengths)
    spread = (sum((length - mean) ** 2 for length in lengths) / len(lengths)) ** 0.5
    return {"mean": round(mean, 1), "spread": round(spread, 1), "shortest": min(lengths), "longest": max(lengths)}

print(rhythm(AI_DRAFT))
print(rhythm(EDITED))
```

- **`rhythm` measures the lengths of the sentences.** Their mean, their spread as a standard deviation, and the shortest and longest.
- **The AI draft averages 22 words a sentence, with a spread of 2.8.** Its shortest sentence is 20 words and its longest 26. Three long sentences of nearly equal length.
- **The edited version averages 11 words, with a spread of 4.6.** Its shortest sentence is 5 words and its longest 19.
- **The contrast is the point.** "It could not cut butter" lands because it is five words after a ten-word sentence. A draft with no short sentences has nowhere to land anything.
- **A spread is not a target to maximise.** It is a symptom to check. A low spread with a high mean is the signature of a draft nobody has edited.

Finally, reading the retention curve.

```python
def retention_report(retention, step_seconds):
    if len(retention) < 2:
        return None
    intervals = len(retention) - 1
    average = sum((retention[index] + retention[index + 1]) / 2 for index in range(intervals)) / intervals
    drops = [retention[index] - retention[index + 1] for index in range(1, intervals)]
    intro_index = min(max(30 // step_seconds, 1), intervals)
    report = {"intro_retention": retention[intro_index], "average_viewed": round(average, 1), "worst_drop": None}
    if drops:
        worst = max(range(len(drops)), key=lambda index: drops[index]) + 1
        report["worst_drop"] = {"from_second": worst * step_seconds, "to_second": (worst + 1) * step_seconds, "lost": retention[worst] - retention[worst + 1]}
    return report

CURVE = [100, 71, 64, 60, 57, 55, 41, 39, 38, 36, 35, 34, 33]     # percent still watching, every 30 seconds
print(retention_report(CURVE, 30))
```

- **The curve is the percentage still watching, sampled every 30 seconds.** Thirteen points cover a six-minute video.
- **The intro retention is 71 percent.** That is the figure at 30 seconds. Twenty-nine percent of viewers left in the first half-minute.
- **The average viewed is 49.7 percent.** It is the area under the curve divided by its length, by the formula of Section 2. The typical viewer saw half the video.
- **The worst drop after the opening is between 150 and 180 seconds.** Fourteen points were lost in that half-minute, against two in each neighbouring interval.
- **The first interval is left out of the search.** The opening always has the largest fall, and it is reported separately as the intro. The question here is where the body failed.
- **The report tells you which line to read.** Open the script at two and a half minutes. Whatever is there, a digression, a sponsor read, a slow passage, is where to cut or rewrite, in this video and in the next.

**Complexity.** Each function makes a single pass over the script or the curve.

### A prompt for a first draft

```text
You are helping me draft a video script. I will edit it heavily.

MY VOICE: here are two transcripts of videos I wrote myself.
[paste two transcripts]

THIS VIDEO: [title], for [who is watching and what they already know].
MY MATERIAL, which you must use and must not add to:
- [what happened, with the real numbers and names]
- [the point I want to make]
- [the mistake, the example, the result]

STRUCTURE
- Hook: at most 13 words. It must match the title.
- Promise: complete within the first 38 words.
- Body: [3] points, one idea each. Raise [the mistake] early and explain it in point [3].
- One call to action: [what].
- Total: about [450] words.

RULES: written to be spoken. Short sentences of varied length. Numbers as words.
No scene-setting opener, no "whether you are", no "delve", "unlock", or "journey".
Do not invent facts, figures, or anecdotes. Where you need one, write [NEEDED: what].

First give me an outline and five alternative hooks. Wait for my choice before drafting.
```

### The editing passes, as a checklist

| Pass | Question | Done when |
|---|---|---|
| Cut | Does the video start at the first sentence? | Deleting the opening line loses something |
| Specific | Could anyone have written this sentence? | Each claim has a number, name, or example of yours |
| True | Where did this fact come from? | Every figure has a source |
| Ear | Can I say it in one breath? | Read aloud without stumbling |
| Rhythm | Is there a short sentence nearby? | Long and short alternate |
| Hook | Does it match the title and the body? | Rewritten after everything else |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**The greeting.** "Hey guys, welcome back to the channel" spends the most valuable seconds of the video on nothing. Start with the hook. Introduce yourself later, briefly, if at all.

**A hook the video does not pay off.** An exaggerated opening gets the first ten seconds and loses the viewer at the moment they realise the video is about something milder. Retention falls, and so does trust in the next title.

**The title, the thumbnail, and the opening saying three different things.** The viewer clicked on a promise. The first sentence should confirm they are in the right place.

**Asking a model for "a script about X".** With no material of yours, you get the average script about X. Give it your story, your numbers, and your transcripts, or expect to rewrite everything.

**Invented anecdotes and statistics.** A model asked for a compelling script will supply a compelling customer story and a persuasive percentage, both made up. Tell it not to, give it a marker for gaps, and check every fact that remains.

**Keeping the first paragraph.** The opening of an AI draft is nearly always preamble. Delete it before reading the rest.

**Writing for the page.** Long sentences, brackets, and abstract nouns read acceptably and sound terrible. Read the script aloud, every time.

**Too many ideas.** A script that covers seven tips gives each one twenty seconds and leaves the viewer with none. One idea, three to five points.

**Loops left open.** "I will tell you the secret at the end" followed by no secret, or a trivial one, is remembered. Close what you open.

**Several calls to action.** Like, subscribe, comment, follow, and buy, in one breath, is a list the viewer ignores whole. Choose the one that matters for this video.

**Never looking at retention.** The graph shows the second at which the script lost people. Ten minutes with it after each video improves the next script more than any formula.

**Optimising a score.** A script can be tuned to a readability target and a rhythm figure and still say nothing. The measures catch two faults. They do not detect a point of view.

**Sounding like everyone else.** A channel whose scripts are unedited model output is competing with every other such channel on identical ground. What you add, the specific and the personal, is the only part that cannot be copied.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A script for online video is a sequence of reasons to keep watching: a hook that earns the next seconds and matches the title and thumbnail, a promise that gives a reason to stay, a body that delivers it in a few points, and one call to action. At 150 words a minute the structure is a word budget, with the hook in about 13 words and the promise complete by about 38. A model drafts the average script, and research confirms that writing with models makes texts more alike, so the draft must be given what only the creator has: transcripts for voice, real material, and a structure, with the work requested in stages. Editing is a series of passes: cut the opening, make every claim specific, check the facts, read aloud, fix the rhythm, and rewrite the hook last. Readability, $206.835 - 1.015(\text{words}/\text{sentences}) - 84.6(\text{syllables}/\text{words})$, and the spread of sentence lengths catch a draft that is hard to follow or monotonous, without measuring whether it is good. The audience retention curve then shows where the script lost people, and the largest drop after the opening names the line to fix.

**Question 1.** A script opens with a 20-word hook followed by a 30-word promise. At 150 words a minute, when does the hook end and when is the promise complete? Compare both with the budget in this chapter and say what to do. The video's retention curve, sampled every 30 seconds, is 100, 58, 52, 49, 47, 30, 28. What is the intro retention, where is the worst drop after the opening, and what would you look at?

<details>
<summary>View Answer</summary>

At 150 words a minute, one word takes 0.4 seconds. The 20-word hook ends at 8 seconds, against a budget of about 5 seconds, or 13 words. The promise adds 30 words, so it is complete at the 50th word, which is 20 seconds, against a budget of 15 seconds, or about 38 words. Both overrun. The hook should be cut by a third, to its single strongest sentence, and the promise tightened so that the two together come in under 38 words. Usually the hook can lose its lead-in and the promise its second clause. On the retention curve, the intro retention is the value at 30 seconds: 58 percent, so 42 percent of viewers left in the first half-minute, which fits a slow opening. After that the intervals lose 6, 3, 2, 17, and 2 points. The worst drop is the 17 points between 120 and 150 seconds, far out of line with its neighbours. I would open the script at the two-minute mark and read what is said there. Common causes are a digression away from the promise, a long explanation with nothing to look at, a sponsor message, or the moment the promised payoff was delivered, after which viewers had what they came for. If it is the last, the fix is structural: do not complete the promise so early, or follow it at once with a reason to stay. The same reading should then shape the next script, since the cause tends to recur.

</details>

**Question 2.** A creator gives a model the prompt "Write a 3-minute YouTube script about sharpening chisels" and gets a script that begins "In today's fast-paced world, keeping your tools sharp is more important than ever." Explain why the result is generic, and rewrite the request so that the draft could only have come from this creator.

<details>
<summary>View Answer</summary>

The prompt contains a topic and a length and nothing else. A model completes it with the most probable script on that topic, which is the average of the many it has seen, opening with the most common kind of opener. It has no knowledge of this creator's voice, audience, experience, or opinion, so it cannot include them, and it fills the space with general statements that would be equally true in anyone's video. Research on writing with language models finds the same effect at scale: texts written with a model's help become more similar to each other, mainly through the text the model contributes. The rewritten request supplies what was missing. It would paste two transcripts of videos the creator wrote unaided, so that the model has examples of the voice, and the creator's voice guide. It would state who is watching: hobby woodworkers with basic tools who have never sharpened anything. It would give the material and forbid additions: the chisel bought for four pounds at a car boot sale, that it could not cut butter, the two stones and the leather belt used, the 25-degree bevel, the mistake of rocking the blade that ruined three earlier chisels, and the result of shaving hair off the arm. It would set the structure and the budget: a hook of at most 13 words that matches the title, the promise complete within 38 words, three points with the mistake raised early and explained in the third, one call to action, about 450 words for three minutes. It would give the rules of the ear and a list of phrases to avoid, and tell the model to mark any gap instead of inventing a fact. And it would ask for an outline and five hooks first, so that the creator chooses the direction before a word of the draft is written.

</details>

**Question 3.** Two openings for the same video have Flesch Reading Ease scores of 12 and 94, and sentence-length spreads of 2 and 5. Say what each measure indicates and which opening is likely to work better aloud. Then give two reasons why a script could score 94 with a healthy spread and still fail.

<details>
<summary>View Answer</summary>

The Flesch Reading Ease score falls as sentences get longer and as words get longer. A score of 12 is in the "very difficult" band, which means long sentences built from words of several syllables, the texture of an academic abstract. A score of 94 is "very easy": short sentences of mostly one-syllable words. The spread is the standard deviation of the sentence lengths in words. A spread of 2 means every sentence is close to the same length, and combined with a score of 12, they are all long. A spread of 5 means the lengths vary, with short sentences among longer ones. Aloud, the second opening is very likely to work better. A listener hears each sentence once at the speaker's pace, cannot look back, and loses the thread of a 25-word sentence full of abstract nouns. Short common words are taken in at speaking speed, and a short sentence after a longer one gives emphasis and a place to breathe. The first opening would sound like a document being read out. Even so, a script can pass both tests and fail, for at least two reasons. It may have nothing in it: easy, rhythmic sentences that state what everyone knows, with no number, no example, and no point of view, hold nobody. The measures look at the form of sentences and cannot see whether anything is being said. And it may be badly structured: a simple, varied opening that spends fifteen seconds on a greeting, makes no promise, or does not match the title and thumbnail will lose viewers at once however readable it is. It could also be untrue, which no formula detects. The measures catch two cheap faults. The rest is the edit.

</details>

@@starter
"""
Lab: Structure, Timing, Readability, Rhythm, and Retention
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import re

SCRIPT = {
    "hook": "This chisel cost four pounds and could not cut butter.",
    "promise": "In ten minutes it will shave the hair off my arm, and I will show you the one mistake to avoid.",
    "body": [
        "Flatten the back on the coarse stone. Twenty strokes. If the back is not flat, nothing else you do will matter.",
        "Set the bevel at twenty-five degrees. Lock your wrists and move from the shoulders.",
        "Here is the mistake. I used to rock the blade, and it rounds the edge. Keep it flat and slow.",
        "Finish on the leather. Ten pulls, edge trailing.",
    ],
    "cta": ["Try it on one chisel tonight and tell me in the comments how it went."],
}

WEAK = {
    "hook": "Hello everyone and welcome back to the channel, my name is Sam and today we have a really exciting video for you.",
    "promise": "",
    "body": ["one", "two", "three", "four", "five", "six", "seven"],
    "cta": ["Like the video.", "Subscribe.", "Hit the bell.", "Follow me on three other platforms."],
}

AI_DRAFT = ("In today's fast-paced world, maintaining the sharpness of your woodworking tools is an absolutely essential "
            "consideration for achieving professional results. In this comprehensive video, we will delve into the "
            "fundamental principles of chisel sharpening and explore a variety of techniques that can significantly enhance "
            "your craftsmanship. Whether you are a beginner or an experienced woodworker, understanding these methodologies "
            "will undoubtedly elevate the quality of your projects.")

EDITED = ("This chisel cost four pounds at a car boot sale. It could not cut butter. Ten minutes from now it will shave "
          "the hair off my arm. You need two stones and an old leather belt. I will show you the one mistake that ruined "
          "my first three chisels, so that you can skip it.")

CURVE = [100, 71, 64, 60, 57, 55, 41, 39, 38, 36, 35, 34, 33]     # percent still watching, every 30 seconds


def syllables(word):
    """Provided helper: an estimate of the syllables in a word, by counting groups of vowels,
    with a final silent "e" not counted (except in endings such as "table")."""
    word = re.sub(r"[^a-z]", "", word.lower())
    if not word:
        return 0
    count = len(re.findall(r"[aeiouy]+", word))
    if word.endswith("e") and not word.endswith("le") and count > 1:
        count -= 1
    return max(count, 1)


def sentences_of(text):
    """Provided helper: the sentences of a text, split at full stops, exclamation marks, and
    question marks, with blank pieces removed."""
    return [sentence for sentence in re.split(r"[.!?]+", text) if sentence.strip()]


# ---------------------------------------------------------------- Step 1
def structure_problems(script, hook_words=13, promise_by_words=38, max_points=5):
    """script is {"hook": text, "promise": text, "body": list of points, "cta": list of asks}.
    Count words by splitting on white space. Report, in this order:
        "no-hook"          if the hook has no words;  otherwise "hook-too-long" if it has more than hook_words
        "no-promise"       if the promise has no words;  otherwise "promise-late" if the hook and
                           promise together have more than promise_by_words
        "no-body"          if there are no body points;  otherwise "too-many-points" if more than max_points
        "no-cta"           if there are no asks;  otherwise "multiple-ctas" if more than one
    Missing keys count as empty."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def section_times(script, wpm=150):
    """Lay the parts of the script on a clock. The parts, in order, are:
        ("hook", the hook), ("promise", the promise),
        ("point 1", first body point), ("point 2", second), and so on,
        ("cta", the asks joined with a space)
    For each part: seconds = round(number of words / wpm * 60, 1). Record the tuple
    (name, start rounded to 1 place, seconds), then advance the clock by seconds.
    Return the list of tuples."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def flesch_reading_ease(text):
    """sentences = sentences_of(text);  words = re.findall(r"[A-Za-z']+", text)
    If there are no sentences or no words, return 0.0. Otherwise return
        206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
    rounded to 1 place, where syllables is the sum of syllables(word) over the words."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def rhythm(text):
    """lengths = the number of whitespace-separated words in each sentence of sentences_of(text).
    Return {"mean": mean length rounded to 1 place,
            "spread": the standard deviation rounded to 1 place, which is
                      the square root of the average of (length - mean) squared,
            "shortest": the smallest length, "longest": the largest}.
    If there are no sentences, return 0.0, 0.0, 0, 0 for the four values."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def retention_report(retention, step_seconds):
    """retention is the percentage still watching at evenly spaced moments, starting at 100
    at time 0. If it has fewer than 2 points, return None. With intervals = len(retention) - 1:
        average_viewed  = the average over the intervals of (retention[i] + retention[i + 1]) / 2,
                          rounded to 1 place
        intro_retention = retention[k], where k = 30 // step_seconds, kept between 1 and intervals
        worst_drop      = among the intervals starting at index 1 or later, the first one with the
                          largest fall retention[i] - retention[i + 1], as
                          {"from_second": i * step_seconds, "to_second": (i + 1) * step_seconds, "lost": the fall}
                          or None if there is only one interval
    Return {"intro_retention": ..., "average_viewed": ..., "worst_drop": ...} with those three values."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("structure:", structure_problems(WEAK))
    print("times    :", section_times(SCRIPT))
    print("ease     :", flesch_reading_ease(AI_DRAFT), flesch_reading_ease(EDITED))
    print("rhythm   :", rhythm(AI_DRAFT), rhythm(EDITED))
    print("retention:", retention_report(CURVE, 30))

@@solution
"""
Lab solution: Structure, Timing, Readability, Rhythm, and Retention
Standard library only.
"""
import re

SCRIPT = {
    "hook": "This chisel cost four pounds and could not cut butter.",
    "promise": "In ten minutes it will shave the hair off my arm, and I will show you the one mistake to avoid.",
    "body": [
        "Flatten the back on the coarse stone. Twenty strokes. If the back is not flat, nothing else you do will matter.",
        "Set the bevel at twenty-five degrees. Lock your wrists and move from the shoulders.",
        "Here is the mistake. I used to rock the blade, and it rounds the edge. Keep it flat and slow.",
        "Finish on the leather. Ten pulls, edge trailing.",
    ],
    "cta": ["Try it on one chisel tonight and tell me in the comments how it went."],
}

WEAK = {
    "hook": "Hello everyone and welcome back to the channel, my name is Sam and today we have a really exciting video for you.",
    "promise": "",
    "body": ["one", "two", "three", "four", "five", "six", "seven"],
    "cta": ["Like the video.", "Subscribe.", "Hit the bell.", "Follow me on three other platforms."],
}

AI_DRAFT = ("In today's fast-paced world, maintaining the sharpness of your woodworking tools is an absolutely essential "
            "consideration for achieving professional results. In this comprehensive video, we will delve into the "
            "fundamental principles of chisel sharpening and explore a variety of techniques that can significantly enhance "
            "your craftsmanship. Whether you are a beginner or an experienced woodworker, understanding these methodologies "
            "will undoubtedly elevate the quality of your projects.")

EDITED = ("This chisel cost four pounds at a car boot sale. It could not cut butter. Ten minutes from now it will shave "
          "the hair off my arm. You need two stones and an old leather belt. I will show you the one mistake that ruined "
          "my first three chisels, so that you can skip it.")

CURVE = [100, 71, 64, 60, 57, 55, 41, 39, 38, 36, 35, 34, 33]     # percent still watching, every 30 seconds


def syllables(word):
    """Provided helper: an estimate of the syllables in a word, by counting groups of vowels,
    with a final silent "e" not counted (except in endings such as "table")."""
    word = re.sub(r"[^a-z]", "", word.lower())
    if not word:
        return 0
    count = len(re.findall(r"[aeiouy]+", word))
    if word.endswith("e") and not word.endswith("le") and count > 1:
        count -= 1
    return max(count, 1)


def sentences_of(text):
    """Provided helper: the sentences of a text, split at full stops, exclamation marks, and
    question marks, with blank pieces removed."""
    return [sentence for sentence in re.split(r"[.!?]+", text) if sentence.strip()]


# ---------------------------------------------------------------- Step 1
def structure_problems(script, hook_words=13, promise_by_words=38, max_points=5):
    """The structure is a word budget: the hook in about five seconds, the promise complete
    by fifteen, a handful of points, and one thing to ask for."""
    problems = []
    hook, promise = len(script.get("hook", "").split()), len(script.get("promise", "").split())
    if hook == 0:
        problems.append("no-hook")
    elif hook > hook_words:
        problems.append("hook-too-long")
    if promise == 0:
        problems.append("no-promise")
    elif hook + promise > promise_by_words:
        problems.append("promise-late")
    points = len(script.get("body", []))
    if points == 0:
        problems.append("no-body")
    elif points > max_points:
        problems.append("too-many-points")
    asks = len(script.get("cta", []))
    if asks == 0:
        problems.append("no-cta")
    elif asks > 1:
        problems.append("multiple-ctas")
    return problems


# ---------------------------------------------------------------- Step 2
def section_times(script, wpm=150):
    """When each part lands. A loop opened in the promise can be followed to the second at
    which the body closes it."""
    parts = [("hook", script.get("hook", "")), ("promise", script.get("promise", ""))]
    parts += [(f"point {number}", point) for number, point in enumerate(script.get("body", []), start=1)]
    parts += [("cta", " ".join(script.get("cta", [])))]
    rows, clock = [], 0.0
    for name, text in parts:
        seconds = round(len(text.split()) / wpm * 60, 1)
        rows.append((name, round(clock, 1), seconds))
        clock += seconds
    return rows


# ---------------------------------------------------------------- Step 3
def flesch_reading_ease(text):
    """Long sentences and long words lower the score. Speech should score high, because a
    listener gets one pass. It measures form, not whether anything is being said."""
    sentences, words = sentences_of(text), re.findall(r"[A-Za-z']+", text)
    if not sentences or not words:
        return 0.0
    total_syllables = sum(syllables(word) for word in words)
    return round(206.835 - 1.015 * len(words) / len(sentences) - 84.6 * total_syllables / len(words), 1)


# ---------------------------------------------------------------- Step 4
def rhythm(text):
    """A low spread with a high mean is the signature of a draft nobody has edited: every
    sentence long, and none short enough to land anything."""
    lengths = [len(sentence.split()) for sentence in sentences_of(text)]
    if not lengths:
        return {"mean": 0.0, "spread": 0.0, "shortest": 0, "longest": 0}
    mean = sum(lengths) / len(lengths)
    spread = (sum((length - mean) ** 2 for length in lengths) / len(lengths)) ** 0.5
    return {"mean": round(mean, 1), "spread": round(spread, 1), "shortest": min(lengths), "longest": max(lengths)}


# ---------------------------------------------------------------- Step 5
def retention_report(retention, step_seconds):
    """The curve shows the second at which the script lost people. The opening always has
    the largest fall, so it is reported separately and left out of the search."""
    if len(retention) < 2:
        return None
    intervals = len(retention) - 1
    average = sum((retention[index] + retention[index + 1]) / 2 for index in range(intervals)) / intervals
    drops = [retention[index] - retention[index + 1] for index in range(1, intervals)]
    intro_index = min(max(30 // step_seconds, 1), intervals)
    report = {"intro_retention": retention[intro_index], "average_viewed": round(average, 1), "worst_drop": None}
    if drops:
        worst = max(range(len(drops)), key=lambda index: drops[index]) + 1
        report["worst_drop"] = {"from_second": worst * step_seconds, "to_second": (worst + 1) * step_seconds, "lost": retention[worst] - retention[worst + 1]}
    return report


if __name__ == "__main__":
    print(structure_problems(SCRIPT), len(SCRIPT["hook"].split()), len(SCRIPT["promise"].split()))
    print(structure_problems(WEAK), len(WEAK["hook"].split()))
    for name, start, seconds in section_times(SCRIPT):
        print(f"{name:<8} starts {start:>5}  lasts {seconds}")
    print(round(sum(row[2] for row in section_times(SCRIPT)), 1))

    print(syllables("chisel"), syllables("made"), syllables("table"), syllables("methodologies"))
    for text in (AI_DRAFT, EDITED):
        words = re.findall(r"[A-Za-z']+", text)
        print(len(words), len(sentences_of(text)), round(sum(syllables(word) for word in words) / len(words), 2), flesch_reading_ease(text))

    print(rhythm(AI_DRAFT))
    print(rhythm(EDITED))

    print(retention_report(CURVE, 30))
    print(retention_report([100, 58, 52, 49, 47, 30, 28], 30), 20 * 0.4, 50 * 0.4)

@@step
{
  "stepNumber": 1,
  "title": "Check the structure",
  "instruction": "Implement structure_problems(script, hook_words, promise_by_words, max_points). The script is a dict with a 'hook' text, a 'promise' text, a 'body' list of points, and a 'cta' list of asks. Missing keys count as empty. Count words by splitting on white space. Report 'no-hook' if the hook has no words, and otherwise 'hook-too-long' if it has more than hook_words. Report 'no-promise' if the promise has no words, and otherwise 'promise-late' if the hook and the promise together have more than promise_by_words. Report 'no-body' if there are no body points, and otherwise 'too-many-points' if there are more than max_points. Report 'no-cta' if there are no asks, and otherwise 'multiple-ctas' if there is more than one. Return the list in that order. Run it on SCRIPT and on WEAK. This is the word budget from the timing table in Section 2. [MOD-6.6]",
  "hintConceptual": "A viewer gives you about five seconds to earn the next ten, and about fifteen to earn the rest. Count the words that have to fit into those seconds, and count how many things you are asking for at the end.",
  "hintSyntax": "problems = []\nhook, promise = len(script.get(\"hook\", \"\").split()), len(script.get(\"promise\", \"\").split())\nif hook == 0:\n    problems.append(\"no-hook\")\nelif hook > hook_words:\n    problems.append(\"hook-too-long\")\nif promise == 0:\n    problems.append(\"no-promise\")\nelif hook + promise > promise_by_words:\n    problems.append(\"promise-late\")\npoints = len(script.get(\"body\", []))\nif points == 0:\n    problems.append(\"no-body\")\nelif points > max_points:\n    problems.append(\"too-many-points\")\nasks = len(script.get(\"cta\", []))\nif asks == 0:\n    problems.append(\"no-cta\")\nelif asks > 1:\n    problems.append(\"multiple-ctas\")\nreturn problems"
}
@@assert
assert structure_problems(SCRIPT) == [], f"The workshop script has no structural problems, got {structure_problems(SCRIPT)}"
assert structure_problems(WEAK) == ["hook-too-long", "no-promise", "too-many-points", "multiple-ctas"], f"The weak script has four, got {structure_problems(WEAK)}"
assert structure_problems({}) == ["no-hook", "no-promise", "no-body", "no-cta"], "An empty script is missing all four parts"
_base = {"hook": "one two three", "promise": "four five six", "body": ["a"], "cta": ["b"]}
assert structure_problems(_base) == [], "A minimal complete script passes"
assert structure_problems(dict(_base, hook=" ".join(["w"] * 13))) == [] and structure_problems(dict(_base, hook=" ".join(["w"] * 14))) == ["hook-too-long"], "Thirteen words is within the hook budget and fourteen is over"
assert structure_problems(dict(_base, hook=" ".join(["w"] * 10), promise=" ".join(["w"] * 28))) == [] and structure_problems(dict(_base, hook=" ".join(["w"] * 10), promise=" ".join(["w"] * 29))) == ["promise-late"], "The hook and promise together may use 38 words"
assert structure_problems(dict(_base, body=["a"] * 5)) == [] and structure_problems(dict(_base, body=["a"] * 6)) == ["too-many-points"], "Five points is the limit"
assert structure_problems(_base, hook_words=2) == ["hook-too-long"] and structure_problems(dict(_base, cta=["a", "b"])) == ["multiple-ctas"], "The limits are arguments, and two asks are too many"
print("Step 1 passed: a 22-word greeting, no promise, seven points, and four asks are all reported.")

@@step
{
  "stepNumber": 2,
  "title": "When does each part land?",
  "instruction": "Implement section_times(script, wpm). Build the list of parts in order: the pair ('hook', the hook text); ('promise', the promise text); one pair for each body point, named 'point 1', 'point 2', and so on; and ('cta', the asks joined with a space). Keep a clock starting at 0.0. For each part, its duration is the number of words divided by wpm, times 60, rounded to 1 decimal place. Record a tuple of the name, the clock rounded to 1 place, and the duration. Then advance the clock by the duration. Return the list of tuples. Run it on SCRIPT and find when the mistake promised in the opening is explained. This is the timing arithmetic from Section 2. [MOD-6.6]",
  "hintConceptual": "A running order for a broadcast lists each item with the time it starts and how long it runs. Each start is the previous start plus the previous length.",
  "hintSyntax": "parts = [(\"hook\", script.get(\"hook\", \"\")), (\"promise\", script.get(\"promise\", \"\"))]\nparts += [(f\"point {number}\", point) for number, point in enumerate(script.get(\"body\", []), start=1)]\nparts += [(\"cta\", \" \".join(script.get(\"cta\", [])))]\nrows, clock = [], 0.0\nfor name, text in parts:\n    seconds = round(len(text.split()) / wpm * 60, 1)\n    rows.append((name, round(clock, 1), seconds))\n    clock += seconds\nreturn rows"
}
@@assert
_rows = section_times(SCRIPT)
assert _rows == [("hook", 0.0, 4.0), ("promise", 4.0, 8.4), ("point 1", 12.4, 8.4), ("point 2", 20.8, 5.6), ("point 3", 26.4, 8.0), ("point 4", 34.4, 3.2), ("cta", 37.6, 6.0)], f"Seven parts, each with its start and length, got {_rows}"
assert _rows[1][1] + _rows[1][2] == 12.4, "The promise is complete at 12.4 seconds, inside the 15-second budget"
assert [row for row in _rows if row[0] == "point 3"][0][1] == 26.4, "The mistake raised in the promise is explained from 26.4 seconds"
assert round(sum(row[2] for row in _rows), 1) == 43.6, "The script runs 43.6 seconds"
assert section_times(WEAK)[0] == ("hook", 0.0, 8.8) and section_times(WEAK)[1] == ("promise", 8.8, 0.0), "The weak script's greeting takes 8.8 seconds, and an empty promise takes none"
assert section_times({"hook": "a b c", "cta": ["d e", "f"]}) == [("hook", 0.0, 1.2), ("promise", 1.2, 0.0), ("cta", 1.2, 1.2)], "Missing parts count as empty, and several asks are joined into one part"
assert section_times({"hook": "a b c", "cta": ["d e", "f"]}, wpm=180) == [("hook", 0.0, 1.0), ("promise", 1.0, 0.0), ("cta", 1.0, 1.0)], "The speaking rate is an argument"
assert len(section_times(WEAK)) == 10, "Seven body points give ten parts in all"
print("Step 2 passed: the hook lasts 4 seconds, the promise is complete at 12.4, and the loop closes at 26.4.")

@@step
{
  "stepNumber": 3,
  "title": "Score readability",
  "instruction": "Implement flesch_reading_ease(text). Find the sentences with the provided helper sentences_of(text), and the words with re.findall(r\"[A-Za-z']+\", text). If there are no sentences or no words, return 0.0. Otherwise add up the provided helper syllables(word) over the words, and return 206.835 minus 1.015 times the words per sentence, minus 84.6 times the syllables per word, rounded to 1 decimal place. Score AI_DRAFT and EDITED. This is the Flesch Reading Ease formula from Section 2. A script, which is heard once, should score much higher than written prose. [MOD-6.6]",
  "hintConceptual": "Two things make speech hard to follow: sentences that go on too long, and words that take too long to say. The score takes off marks for both.",
  "hintSyntax": "sentences, words = sentences_of(text), re.findall(r\"[A-Za-z']+\", text)\nif not sentences or not words:\n    return 0.0\ntotal_syllables = sum(syllables(word) for word in words)\nreturn round(206.835 - 1.015 * len(words) / len(sentences) - 84.6 * total_syllables / len(words), 1)"
}
@@assert
assert flesch_reading_ease(AI_DRAFT) == 9.9, f"The AI draft scores 9.9, 'very difficult', got {flesch_reading_ease(AI_DRAFT)}"
assert flesch_reading_ease(EDITED) == 95.7, f"The edited opening scores 95.7, 'very easy', got {flesch_reading_ease(EDITED)}"
assert flesch_reading_ease("The cat sat on the mat.") == 116.1, "Six one-syllable words in one sentence: 206.835 - 6.09 - 84.6"
assert flesch_reading_ease("The cat sat. The dog ran.") == 119.2, "Shorter sentences score higher"
assert flesch_reading_ease("Methodologies significantly enhance craftsmanship.") < 0, "Four long words in one sentence can score below zero"
assert flesch_reading_ease("") == 0.0 and flesch_reading_ease("123 456.") == 0.0, "Text with no words scores 0.0 and does not divide by zero"
assert flesch_reading_ease(EDITED) - flesch_reading_ease(AI_DRAFT) > 80, "The edit moved the opening by more than 80 points"
print("Step 3 passed: the AI draft scores 9.9 and the edited opening 95.7.")

@@step
{
  "stepNumber": 4,
  "title": "Measure the rhythm",
  "instruction": "Implement rhythm(text). Take the sentences from the provided helper sentences_of(text) and find the number of whitespace-separated words in each. If there are no sentences, return a dict with 'mean' 0.0, 'spread' 0.0, 'shortest' 0, and 'longest' 0. Otherwise compute the mean length, and the spread, which is the standard deviation: the square root of the average of the squared differences between each length and the mean. Return a dict with 'mean' and 'spread', each rounded to 1 decimal place, and 'shortest' and 'longest', the smallest and largest lengths. Run it on AI_DRAFT and EDITED. This is the measure of sentence rhythm from Section 2. [MOD-6.6]",
  "hintConceptual": "A drummer who hits every beat the same is keeping time, not making music. Variety between long and short is what lets one sentence stand out.",
  "hintSyntax": "lengths = [len(sentence.split()) for sentence in sentences_of(text)]\nif not lengths:\n    return {\"mean\": 0.0, \"spread\": 0.0, \"shortest\": 0, \"longest\": 0}\nmean = sum(lengths) / len(lengths)\nspread = (sum((length - mean) ** 2 for length in lengths) / len(lengths)) ** 0.5\nreturn {\"mean\": round(mean, 1), \"spread\": round(spread, 1), \"shortest\": min(lengths), \"longest\": max(lengths)}"
}
@@assert
assert rhythm(AI_DRAFT) == {"mean": 22.0, "spread": 2.8, "shortest": 20, "longest": 26}, f"Three long sentences of nearly equal length, got {rhythm(AI_DRAFT)}"
assert rhythm(EDITED) == {"mean": 11.0, "spread": 4.6, "shortest": 5, "longest": 19}, f"Shorter and more varied, got {rhythm(EDITED)}"
assert rhythm("One two three. Four five six. Seven eight nine.") == {"mean": 3.0, "spread": 0.0, "shortest": 3, "longest": 3}, "Sentences of equal length have no spread"
assert rhythm("One. Two three four five six seven eight nine.") == {"mean": 4.5, "spread": 3.5, "shortest": 1, "longest": 8}, "Lengths of 1 and 8 have a mean of 4.5 and a spread of 3.5"
assert rhythm("Just one sentence here.") == {"mean": 4.0, "spread": 0.0, "shortest": 4, "longest": 4}, "A single sentence has no spread"
assert rhythm("") == {"mean": 0.0, "spread": 0.0, "shortest": 0, "longest": 0}, "No sentences gives zeros"
assert rhythm("Stop! Who goes there? A friend.")["shortest"] == 1 and rhythm("Stop! Who goes there? A friend.")["longest"] == 3, "Exclamation marks and question marks also end sentences"
print("Step 4 passed: the draft's sentences run 20 to 26 words, and the edit's run 5 to 19.")

@@step
{
  "stepNumber": 5,
  "title": "Read the retention curve",
  "instruction": "Implement retention_report(retention, step_seconds). The list holds the percentage still watching at evenly spaced moments, starting with 100 at time zero. If it has fewer than 2 points, return None. Let intervals be the number of points minus 1. The average viewed is the mean, over the intervals, of the average of each pair of neighbouring points, rounded to 1 decimal place. The intro retention is the point at index 30 // step_seconds, with that index kept between 1 and intervals. The worst drop is found among the intervals that start at index 1 or later: the first with the largest fall from one point to the next, given as a dict with 'from_second', 'to_second', and 'lost'. If there is only one interval, the worst drop is None. Return a dict with 'intro_retention', 'average_viewed', and 'worst_drop'. Run it on CURVE with a step of 30 seconds. This is how Section 2 reads the audience retention graph. [MOD-6.6]",
  "hintConceptual": "A teacher watching a lecture hall sees most of the leavers go in the first minute, which is expected. The useful question is when, after that, a whole row stood up at once, and what was being said.",
  "hintSyntax": "if len(retention) < 2:\n    return None\nintervals = len(retention) - 1\naverage = sum((retention[index] + retention[index + 1]) / 2 for index in range(intervals)) / intervals\ndrops = [retention[index] - retention[index + 1] for index in range(1, intervals)]\nintro_index = min(max(30 // step_seconds, 1), intervals)\nreport = {\"intro_retention\": retention[intro_index], \"average_viewed\": round(average, 1), \"worst_drop\": None}\nif drops:\n    worst = max(range(len(drops)), key=lambda index: drops[index]) + 1\n    report[\"worst_drop\"] = {\"from_second\": worst * step_seconds, \"to_second\": (worst + 1) * step_seconds, \"lost\": retention[worst] - retention[worst + 1]}\nreturn report"
}
@@assert
_report = retention_report(CURVE, 30)
assert _report == {"intro_retention": 71, "average_viewed": 49.7, "worst_drop": {"from_second": 150, "to_second": 180, "lost": 14}}, f"71 percent at 30 seconds, half the video watched, and a 14-point drop at two and a half minutes, got {_report}"
_recall = retention_report([100, 58, 52, 49, 47, 30, 28], 30)
assert _recall["intro_retention"] == 58 and _recall["worst_drop"] == {"from_second": 120, "to_second": 150, "lost": 17}, "The numbers from the first recall question"
assert retention_report([100, 90, 80, 70], 10)["intro_retention"] == 70 and retention_report([100, 90, 80, 70], 10)["worst_drop"] == {"from_second": 10, "to_second": 20, "lost": 10}, "With 10-second steps, 30 seconds is index 3, and equal drops report the first"
assert retention_report([100, 50], 30) == {"intro_retention": 50, "average_viewed": 75.0, "worst_drop": None}, "With one interval there is no drop after the opening"
assert retention_report([100, 80, 60], 60)["intro_retention"] == 80, "With steps longer than 30 seconds, the first point after the start is used"
assert retention_report([100, 80, 60], 10)["intro_retention"] == 60, "If the video is shorter than 30 seconds, the last point is used"
assert retention_report([100], 30) is None and retention_report([], 30) is None, "Fewer than two points gives no report"
assert retention_report([100, 60, 62, 61], 30)["worst_drop"] == {"from_second": 60, "to_second": 90, "lost": 1}, "A rise counts as a negative drop, and the largest fall after the opening is reported"
print("Step 5 passed: 29 percent left in the first half-minute, and the body lost 14 points at two and a half minutes.")
