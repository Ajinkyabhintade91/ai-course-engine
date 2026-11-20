@@meta
{
  "moduleId": "MOD-6.8",
  "slug": "mod-6-8",
  "unitId": "UNIT-6",
  "unitTitle": "Unit 6: AI Content Creation Masterclass",
  "title": "Instagram Reels",
  "difficulty": "Foundational",
  "estimatedMinutes": 85,
  "citations": [
    { "title": "Instagram for Creators", "source": "Instagram", "url": "https://creators.instagram.com/" },
    { "title": "Instagram puts new limits on undisclosed AI profiles", "source": "TechCrunch", "url": "https://techcrunch.com/2026/08/31/instagram-puts-new-limits-on-undisclosed-ai-profiles/" },
    { "title": "Instagram restricts reach of content aggregators in new crackdown", "source": "TechCrunch", "url": "https://techcrunch.com/2026/04/30/instagram-restricts-reach-of-content-aggregators-in-new-crackdown/" },
    { "title": "Instagram chief shares insights into its algorithms and creator monetization", "source": "Social Media Today", "url": "https://www.socialmediatoday.com/news/instagram-chief-shares-insights-into-its-algorithms-creator-monetization/718540/" },
    { "title": "Verizon Media and Publicis Media find viewers want captions", "source": "3Play Media", "url": "https://www.3playmedia.com/blog/verizon-media-and-publicis-media-find-viewers-want-captions/" }
  ],
  "videoLibrary": [
    {
      "id": "VID-6.8-1",
      "title": "How to Make Instagram Reels - Complete Tutorial",
      "creator": "Howfinity",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=K5lxkxqNLOA",
      "timingInstruction": "Watch before Section 2 if you have never made a Reel, to see the app's own tools from recording to posting",
      "keyTakeaway": "A start-to-finish tour of making a Reel inside the Instagram app, the baseline that AI tools then speed up."
    },
    {
      "id": "VID-6.8-2",
      "title": "How to Make Instagram Reels (Film & Edit - Full Beginner’s Tutorial!)",
      "creator": "Later",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=cmnFelpvw7c",
      "timingInstruction": "Watch after reading Section 2 (structure, captions, and safe zones), noting where text is placed on screen",
      "keyTakeaway": "A scheduling company's beginner tutorial on filming and editing a Reel, with practical attention to framing, text, and timing."
    },
    {
      "id": "VID-6.8-3",
      "title": "How to Create Viral Instagram Reels 2026 (Complete Walkthrough)",
      "creator": "Stellar Media",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=sx3D1HHwGmE",
      "timingInstruction": "Watch after completing the lab, and test its claims about what the ranking system rewards against the signals named in Section 2",
      "keyTakeaway": "A current creator's walkthrough, useful as an example of advice to check against what Instagram itself has said."
    },
    {
      "id": "VID-6.8-4",
      "title": "Meta Social Media Marketing Professional Certificate",
      "creator": "Meta",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/professional-certificates/facebook-social-media-marketing",
      "timingInstruction": "Take the courses on content and measurement after Section 4, for the platform owner's own account of its formats and metrics",
      "keyTakeaway": "Meta's own training on creating content for its platforms and reading the results, the fuller version of this chapter's analytics."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Fit the Script, Time the Captions, Place the Text, Read the Numbers, Batch the Work",
    "context": "A woodworking shop wants to post three Reels a week and has forty minutes of sharpening footage and a script that runs too long. You will build a cutter that trims a script to a time limit by priority, a generator of timed caption cues, a check that on-screen text stays out from under the interface, the ratios that say whether a Reel worked, and a comparison of making Reels one at a time with making them in batches.",
    "language": "python"
  }
}

@@reading
# Instagram Reels

A Reel is a short vertical video, shown full-screen, to someone who did not ask for it. That last clause is what makes short-form video different from everything in the previous chapters. Nobody clicked. There was no title and no thumbnail. The video simply began, in a stream of others, and the viewer's thumb is already moving.

This chapter applies the unit's methods to that format: how a short video is structured to survive the first second, how AI tools speed up the route from idea to captioned clip, and how to read the numbers that say whether to make more like it. Instagram is the example. The same method serves the short-video feeds of other platforms, which differ in detail and not in kind.

## 1. First-Principles Mental Model & Intuition

### The swipe is free

To watch a long video, a person chooses it. To leave a Reel, a person does nothing more than what they were already doing. Staying is the decision. Leaving is the default.

Three consequences shape the format.

**The first frame is the thumbnail.** There is no separate picture to earn a click. Whatever is on screen in the first half-second, with whatever words are on it, has to do the job that Module 6.7 gave to a thumbnail and Module 6.6 gave to a hook, at once.

**The sound may be off.** Many people watch in public with the volume down. A Reel that needs its audio to make sense has lost them before it starts. The words must be on the screen.

**It plays again.** When a Reel ends, it restarts. A video short enough and tight enough to be watched twice counts for more than one watched once.

### The shape of a Reel

```text
   0 s      2 s                                             25 s    30 s
   |--------|-----------------------------------------------|--------|
   | HOOK   |  PAYOFF, IN STEPS                             | END    |---+
   | motion |  one idea, shown not described                | one    |   |
   | + text |  a cut or a change every few seconds          | ask    |   |
   |--------|-----------------------------------------------|--------|   |
       ^                                                                 |
       +------------------------- loops back to the start ---------------+

   ON SCREEN THROUGHOUT:  captions, in the middle of the frame, clear of the
                          interface at the top, bottom, and sides
```

It is the script structure of Module 6.6, compressed. The hook and the promise merge into the first two seconds. The body is one idea. The call to action is a single line, or is left out so that the end runs cleanly into the beginning.

### What AI changes

Short video is cheap to watch and laborious to make. A thirty-second Reel can take two hours: scripting, filming, cutting pauses, adding captions, choosing a cover. Most of that labour is mechanical, and it is where AI tools now do the most: drafting a script from notes, removing silences, generating captions from the audio, and cutting short clips out of a long recording.

What stays, as Module 6.1 said, is the idea and the judgement. A tool can find the thirty most "engaging" seconds of your video by its own measure. Whether those seconds say anything is still your call.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### The format

Specifications change, and the app is the authority. At the time of writing (November 2026), these are the working facts.

| Property | Value |
|---|---|
| Shape | Vertical, 9:16 |
| Resolution | 1080 by 1920 pixels |
| Length | Up to about three minutes. Most successful Reels are far shorter |
| Sound | Often watched muted, so captions are needed |
| Cover | A chosen frame or an uploaded image, cropped for the profile grid |

The length limit has risen over the years, and the reasoning has not changed. A viewer's patience is measured in seconds. Use the length the idea needs and no more.

### Safe zones

The interface is drawn over the video: the account name and caption at the bottom, buttons down the right, and status elements at the top. Text placed under them cannot be read.

Meta's guidance for Reels advertisements gives margins to keep clear, and they are a sound default for any Reel: about 14 percent of the height at the top, 35 percent at the bottom, and 6 percent of the width at each side. On a frame of 1080 by 1920:

| Edge | Keep clear | Safe area runs |
|---|---|---|
| Top | 14 percent, about 269 pixels | From 269 pixels down |
| Bottom | 35 percent, 672 pixels | To 1,248 pixels |
| Sides | 6 percent, about 65 pixels each | From 65 to 1,015 pixels across |

The safe area is roughly the middle half of the screen. Captions and titles belong there. The exact overlays vary by device and change with app updates, so check a draft on a phone before posting.

### Structure and length

At about 150 spoken words a minute, a Reel's length is a word count.

| Length | Words | Suits |
|---|---|---|
| 7 to 10 seconds | 20 to 25 | A single visual moment, built to loop |
| 15 to 30 seconds | 40 to 75 | One tip, one result, one idea |
| 45 to 60 seconds | 110 to 150 | A short process in steps |
| Over 60 seconds | Over 150 | A story strong enough to hold attention |

The discipline is cutting. A script written at 40 seconds for a 30-second idea is cut by priority: every line is marked as essential, useful, or decoration, and the decoration goes first. The lab builds this.

Three devices are particular to the format.

**A visual hook.** Motion or a striking image in the first frame, with a line of on-screen text that says what the viewer will get.

**A change every few seconds.** A cut, a new angle, a caption, a zoom. Each is a small reason to keep watching.

**A loop.** An ending that leads back into the opening, in picture or in words, so that the replay feels like a continuation.

### What the ranking system looks at

Instagram does not publish a formula, and anyone who claims to know one is guessing. Its head has, however, described the signals that matter most for Reels in public, and they are consistent with one another: **how long people watch**, **likes relative to reach**, and **sends relative to reach**, a send being a viewer sharing the Reel privately with someone. He has singled out sends as especially important for reaching people who do not already follow an account.

These suggest measures you can compute for your own Reels. For a Reel of length $d$ with average watch time $w$:

$$
\text{watch ratio} = \frac{w}{d}
$$

A ratio near 1 means most viewers reach the end. A ratio above 1 means it is being rewatched. And for any action, relative to the number of accounts reached:

$$
\text{rate} = \frac{\text{actions}}{\text{reach}}
$$

Sends per reach measures whether people thought of someone who should see it. Saves per reach measures whether they want it again. Follows per reach measures whether they want more from you. A Reel can score high on one and low on the others, and the pattern says what kind of Reel it was.

Compare your Reels with each other, on the same measures, as Module 6.1 advised for pillars. A rate that is good on one account is poor on another.

### Originality

Instagram has moved against recycled content. In 2026 it restricted the reach of accounts that mainly repost other people's videos, and it has long discouraged videos carrying another app's watermark. Adding a watermark, changing the speed, or reposting with a credit does not make a video original. Adding your own commentary or substantial editing can.

The practical rule for a workflow full of AI tools: the material should be yours. Clips cut from your own long videos are original. A feed of generated or scraped clips is what the platform is reducing.

### AI labels

Instagram labels AI-generated content, from creators' own disclosures and from signals that AI tools embed in files, as Module 6.1 described. In August 2026 it went further for accounts: a profile that presents an AI-generated person must carry a label saying so, or risk reduced reach. Using AI to edit photographs, polish captions, or make graphics does not require it.

The pattern is the one this unit keeps meeting. AI as a tool behind the work is unremarkable. A synthetic person or scene presented as real must be declared.

### Captions

Burned-in captions serve the viewer with the sound off, the viewer who is hard of hearing, and the viewer who reads faster than they listen. A widely cited survey of American consumers in 2019 found that about seven in ten watched video with the sound off in public places, and that most said they were more likely to watch to the end with captions. The survey is old and was commissioned by media companies, so treat the figures as indicative. The practice it supports is now standard.

Good captions have a few words at a time, appear in step with the voice, sit in the safe area, and have the contrast that Module 6.7 measured. At 150 words a minute, each word takes 0.4 seconds, so a cue of four words is on screen for 1.6 seconds.

### The AI workflow

| Stage | By hand | With AI |
|---|---|---|
| Idea | A list of what customers ask | A model groups the questions and suggests angles |
| Script | Written and timed | Drafted from your notes and cut to length, in your voice |
| Footage | Filmed, or found in old recordings | Short clips proposed from long videos automatically |
| Edit | Pauses cut one by one | Silences and filler words removed in one pass |
| Captions | Typed and timed | Generated from the audio, then corrected |
| Cover and text | Designed | Drafted, then checked for contrast and safe zones |
| Translation | Rarely done | Captions, and increasingly voices, in other languages |

Editing apps of several kinds now do this: general mobile editors, editors that work from a transcript, tools that clip long videos into short ones, and Instagram's own editing app. Each automates the mechanical steps. Each needs its output checked, above all the captions, where a misheard name or number is common.

### Batching and cadence

Each stage of production has a set-up cost, such as lighting a bench or opening an editing project, and a cost per Reel. If stage $i$ takes $s_{i}$ minutes to set up and $e_{i}$ minutes per Reel, then making $n$ Reels one at a time costs

$$
n \sum_{i} (s_{i} + e_{i})
$$

and making them in batches, doing each stage once for all of them, costs

$$
\sum_{i} s_{i} + n \sum_{i} e_{i}
$$

The saving is $(n - 1) \sum_{i} s_{i}$: every set-up after the first. It is why creators who post often script on one day, film on another, and edit on a third.

On how often to post, Instagram has given no number, and the confident figures online are opinion. The principle from Module 6.1 holds: a pace you can sustain, with each Reel having something in it, beats a burst. Batching is what makes a steady pace possible.

### Complexity

Every calculation in the lab is linear in the length of a script or the number of Reels. The quantity being spent is production minutes per Reel, most of which are set-up and mechanical editing.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, cutting a script to length.

```python
LINES = [
    ("This chisel cost four pounds and could not cut butter.", 1),
    ("I found it at a car boot sale under a pile of spanners.", 3),
    ("Ten minutes later it shaved the hair off my arm.", 1),
    ("You need two stones and an old leather belt.", 2),
    ("Flatten the back first, twenty strokes on the coarse stone.", 1),
    ("My grandfather taught me this when I was nine.", 3),
    ("Hold the bevel at twenty-five degrees and do not rock the blade.", 1),
    ("Rocking it is the mistake that ruined my first three chisels.", 2),
    ("Finish with ten pulls on the leather.", 1),
    ("Try it tonight and send this to someone with a blunt chisel.", 1),
]

def seconds_of(lines, wpm=150):
    return round(sum(len(text.split()) for text, _ in lines) / wpm * 60, 1)

def fit_script(lines, max_seconds, wpm=150):
    kept = list(lines)
    for priority in (3, 2):
        for index in range(len(kept) - 1, -1, -1):
            if seconds_of(kept, wpm) <= max_seconds:
                break
            if kept[index][1] == priority:
                del kept[index]
    seconds = seconds_of(kept, wpm)
    return {"lines": [text for text, _ in kept], "seconds": seconds, "fits": seconds <= max_seconds}

print(seconds_of(LINES))
for limit in (30, 25, 20):
    result = fit_script(LINES, limit)
    print(limit, result["seconds"], result["fits"], len(result["lines"]))
```

- **Each line carries a priority.** 1 is essential, 2 is useful, 3 is decoration. Deciding these is the editorial work. The function only applies the decision.
- **The full script runs 41.2 seconds.** Ten lines, 103 words.
- **`fit_script` removes decoration first, from the end backwards.** Then, if needed, the useful lines. It stops as soon as the script fits. Essential lines are never removed.
- **For a 30-second Reel, seven lines remain, at 28.0 seconds.** The car boot sale, the grandfather, and the remark about ruined chisels are gone. The steps and the result remain.
- **For 25 seconds, six lines remain, at 24.4.** The line about the stones and the belt is cut as well.
- **For 20 seconds, it cannot be done.** The six essential lines take 24.4 seconds, and the result is marked as not fitting. The function reports that honestly. The remedy is a decision: a longer Reel, or a smaller idea.

Next, captions, and where to put them.

```python
def caption_cues(text, wpm=150, max_words=4):
    words, per_word = text.split(), 60 / wpm
    cues = []
    for start in range(0, len(words), max_words):
        chunk = words[start:start + max_words]
        cues.append((round(start * per_word, 2), round((start + len(chunk)) * per_word, 2), " ".join(chunk)))
    return cues

def in_safe_zone(box, width=1080, height=1920, top=0.14, bottom=0.35, side=0.06):
    left, upper, right, lower = box
    return (left >= width * side and right <= width * (1 - side)
            and upper >= height * top and lower <= height * (1 - bottom))

for cue in caption_cues("This chisel cost four pounds and could not cut butter."):
    print(cue)
print(in_safe_zone((100, 400, 980, 700)), in_safe_zone((100, 100, 980, 300)), in_safe_zone((100, 1300, 980, 1500)), in_safe_zone((20, 400, 980, 700)))
```

- **`caption_cues` splits the words into groups and times each group.** At 150 words a minute a word takes 0.4 seconds, so each cue starts where the previous one ended.
- **The opening line becomes three cues.** "This chisel cost four" from 0 to 1.6 seconds, "pounds and could not" from 1.6 to 3.2, and "cut butter." from 3.2 to 4.0.
- **Four words is a choice.** Fewer words per cue read faster and feel more energetic. More are calmer and risk running past the safe area.
- **These timings assume an even pace.** Real caption tools time each word from the audio. The estimate is for planning, and for checking a tool's output for sense.
- **`in_safe_zone` tests a rectangle against the margins from Section 2.** The box is given as left, top, right, and bottom, in pixels.
- **A caption across the middle of the frame is safe.** The first box passes.
- **The other three fail.** One is too near the top, under the status elements. One is too low, under the account name and caption. One starts 20 pixels from the left edge, inside the side margin.

Then, reading a Reel's results.

```python
def reel_metrics(stats):
    reach = stats["reach"]
    def per_reach(key):
        return round(stats[key] / reach, 4) if reach else 0.0
    return {
        "watch_ratio": round(stats["average_watch_seconds"] / stats["length_seconds"], 2) if stats["length_seconds"] else 0.0,
        "likes_per_reach": per_reach("likes"), "sends_per_reach": per_reach("sends"),
        "saves_per_reach": per_reach("saves"), "follows_per_reach": per_reach("follows"),
    }

TUTORIAL = {"length_seconds": 28, "average_watch_seconds": 21.0, "reach": 12000, "likes": 540, "sends": 180, "saves": 300, "follows": 36}
RAMBLE = {"length_seconds": 75, "average_watch_seconds": 18.0, "reach": 15000, "likes": 600, "sends": 45, "saves": 60, "follows": 9}
LOOP = {"length_seconds": 9, "average_watch_seconds": 11.7, "reach": 8000, "likes": 400, "sends": 40, "saves": 16, "follows": 4}
for name, stats in (("tutorial", TUTORIAL), ("ramble", RAMBLE), ("loop", LOOP)):
    print(name, reel_metrics(stats))
```

- **`reel_metrics` turns raw counts into ratios.** The watch ratio divides the average watch time by the length. Every other figure is divided by reach.
- **The tutorial has a watch ratio of 0.75.** Viewers watched three quarters of it on average. Its sends, at 1.5 percent of reach, and saves, at 2.5 percent, are the highest of the three.
- **The ramble reached the most people and did the least with them.** Its watch ratio is 0.24: people left after 18 of its 75 seconds. Sends are a fifth of the tutorial's and saves a sixth.
- **The loop has a watch ratio of 1.3.** It was watched more than once on average. It was also liked at the highest rate.
- **The loop was barely sent, saved, or followed.** It was pleasant to watch twice and gave nobody a reason to keep it or to want more.
- **The pattern is the reading.** High saves and sends mark something useful. A high watch ratio with little else marks something merely watchable. Which one you want depends on what the account is for.

Finally, the case for batching.

```python
def batch_time(stages, count):
    one_by_one = count * sum(setup + each for _, setup, each in stages)
    batched = sum(setup + count * each for _, setup, each in stages)
    return {"one_by_one": one_by_one, "batched": batched, "saved": one_by_one - batched}

STAGES = [("script", 10, 15), ("film", 20, 8), ("edit", 10, 20), ("captions and cover", 5, 7), ("post", 5, 3)]
print(batch_time(STAGES, 1), batch_time(STAGES, 4), batch_time(STAGES, 8))
```

- **Each stage has a set-up time and a time per Reel, in minutes.** Filming takes 20 minutes to set up and 8 minutes a Reel.
- **One Reel takes 103 minutes either way.** There is nothing to batch.
- **Four Reels one at a time take 412 minutes, and batched take 262.** The saving of 150 minutes is three repeats of the 50 minutes of set-up.
- **Eight Reels save 350 minutes.** Nearly six hours, from doing each kind of work in one sitting.
- **The set-up is what AI tools do not remove.** They cut the per-Reel time: captions in a minute instead of seven. Batching cuts the rest. The two together are what make three Reels a week practical for one person.

**Complexity.** `fit_script` rechecks the length after each removal, which is quadratic in the number of lines and immaterial for a script. The other functions are linear.

### A Reel on one page

```text
IDEA:        [one sentence. If it needs "and", it is two Reels]
FIRST FRAME: [what is moving]  +  on-screen text: [at most 6 words]
SCRIPT:      [lines marked 1 essential, 2 useful, 3 decoration]   TARGET: [30] s = [75] words
CHANGES:     a cut, caption, or new angle at least every [3] seconds
CAPTIONS:    [4] words per cue, in the safe area, contrast at least 4.5
ENDING:      [one ask, or a line that loops to the start]
COVER:       [frame or image], readable in the profile grid
ORIGINAL:    [my own footage / my own long video, clipped]     AI LABEL: [needed? why]
```

### Reading the numbers after a week

| If you see | It suggests | Try next |
|---|---|---|
| A low watch ratio | The opening or the pace lost them | A stronger first frame. Cut harder |
| A watch ratio above 1, little else | Watchable, and not useful | Add something worth saving or sending |
| High saves | A reference people want to keep | More of this, perhaps as a carousel too |
| High sends | It made people think of someone | Study what made it shareable |
| High reach, few follows | Seen and forgotten | Make clear who you are and what you post |
| Everything low | The idea, more than the execution | A different idea |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**A slow start.** A logo, a greeting, or a second of nothing before the action begins is a second in which the viewer has already swiped. Begin on the movement.

**No text on screen.** A Reel that depends on its audio is silent to a large part of its audience. Put the hook in words in the first frame, and caption the rest.

**Text under the interface.** Captions at the very bottom are covered by the account name and description. Titles at the very top sit under the status bar. Keep text in the middle band and check on a phone.

**Uncorrected automatic captions.** Speech recognition mishears names, numbers, and trade terms. A wrong caption is read by everyone with the sound off. Read every cue.

**Two ideas in one Reel.** Thirty seconds holds one idea. A second idea is a second Reel.

**Cutting a long video down by trimming the end.** The first thirty seconds of a ten-minute video are its introduction, not its best moment. Find the moment, and build the Reel around it.

**Trusting an automatic clipper's choice.** Tools that pick "the most engaging" segment are guessing from pace and words. Their suggestions are a shortlist to choose from.

**Other apps' watermarks.** A video exported with another platform's mark on it is treated as recycled. Export clean files and upload them natively.

**Reposting other people's clips.** Aggregated content is having its reach restricted. Commentary and real editing can make a video yours. A credit does not.

**Chasing a formula.** Advice of the form "post at 6 pm" or "use five hashtags" is folklore, and it changes monthly. What Instagram's head has actually named is watch time and the rates of likes and sends. Make things people finish and pass on.

**Judging by views.** Views count the times a Reel started to play. They say little about whether it worked. Read the watch ratio and the rates per reach.

**One Reel as a verdict.** Reach varies enormously between Reels for reasons that have nothing to do with quality. Compare groups of similar Reels, not single ones.

**A burst and then silence.** Seven Reels in a week followed by a month of nothing loses the audience the burst found. Batch the work and release it steadily.

**An undeclared AI presenter.** An account fronted by a generated person must be labelled as such under Instagram's rules, and viewers who feel fooled do not return.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A Reel is shown to someone who did not choose it, so staying is the decision and leaving is the default. The first frame does the work of a thumbnail and a hook, the words must be on screen because the sound is often off, and a tight ending loops into the start. The format is vertical, 1080 by 1920, with text kept clear of the interface: about 14 percent at the top, 35 percent at the bottom, and 6 percent at each side. At 150 words a minute a 30-second Reel is 75 words, and a script is cut to length by priority. Instagram's head has named watch time, likes per reach, and sends per reach as leading signals, which suggests measuring each Reel by its watch ratio $w/d$ and by sends, saves, and follows per reach, and comparing Reels with one another. Original material is favoured, recycled and watermarked clips are restricted, and AI-generated people must be labelled. AI tools remove much of the mechanical work of scripting, cutting, clipping, and captioning, with captions always corrected by hand. Batching saves every set-up after the first, $(n-1)\sum s_{i}$, and makes a steady pace possible.

**Question 1.** A script for a Reel has these lines, with word counts and priorities: 12 words (priority 1), 14 words (3), 10 words (1), 9 words (2), 13 words (1), 11 words (2), 11 words (1). How long does it run at 150 words a minute? Cut it to fit 25 seconds, removing decoration first and then useful lines, each from the end backwards. What remains, and how long is it? Could it be cut to 15 seconds?

<details>
<summary>View Answer</summary>

The seven lines total 80 words. At 150 words a minute, each word takes 0.4 seconds, so the script runs 32 seconds, seven over the target. Decoration goes first. There is one priority 3 line, of 14 words, and removing it leaves 66 words, which is 26.4 seconds. That is still over 25, so the useful lines are next, from the end backwards. The last priority 2 line is the one of 11 words, and removing it leaves 55 words, which is 22 seconds. The script now fits, so cutting stops, and the earlier priority 2 line of 9 words is kept. Five lines remain, of 12, 10, 9, 13, and 11 words, running 22 seconds. To reach 15 seconds, the remaining priority 2 line could also go, leaving the four essential lines: 12 plus 10 plus 13 plus 11 is 46 words, or 18.4 seconds. That is the least the script can be without losing something marked essential, and it is over 15 seconds. So the answer is no. The honest options are to make the Reel about 18 seconds long, to reconsider whether all four essential lines really are essential, or to recognise that the idea is too large for 15 seconds and choose a smaller one. Speeding up the delivery to squeeze it in would defeat the purpose of the cut.

</details>

**Question 2.** Two Reels on the same account: the first is 20 seconds long with an average watch time of 24 seconds, a reach of 10,000, 600 likes, 30 sends, and 20 saves. The second is 40 seconds long with an average watch time of 26 seconds, a reach of 6,000, 240 likes, 150 sends, and 240 saves. Compute the watch ratio and the rates per reach for each, and say what kind of Reel each is and which you would make more of.

<details>
<summary>View Answer</summary>

For the first Reel, the watch ratio is 24 divided by 20, which is 1.2: on average it was watched more than once. Likes per reach are 600 divided by 10,000, or 6 percent. Sends per reach are 0.3 percent and saves per reach 0.2 percent. For the second, the watch ratio is 26 divided by 40, which is 0.65: viewers watched about two thirds of it. Likes per reach are 240 divided by 6,000, or 4 percent. Sends per reach are 150 divided by 6,000, which is 2.5 percent, and saves per reach are 4 percent. The first Reel is entertainment. It is short, it loops, people let it play again, and they like it at a high rate. They hardly ever send it to anyone or keep it. It was seen and enjoyed and left no trace. The second is useful. Fewer people finished it and fewer liked it, yet it was sent at more than eight times the rate and saved at twenty times the rate. People kept it for later and thought of someone who needed it. Which to make more of depends on the account's purpose, and for most accounts that exist to build an audience for a skill, a product, or a service, it is the second. Sends are a signal that Instagram's head has singled out for reaching people beyond existing followers, and saves indicate lasting value. The first Reel's wider reach is real, and worth learning from: its opening and its loop clearly work. The best next Reel would put the second's substance behind the first's opening.

</details>

**Question 3.** A creator makes five Reels a week. The stages are scripting (10 minutes of set-up, 12 per Reel), filming (25 set-up, 10 per Reel), editing (10 set-up, 25 per Reel), and captions and posting (5 set-up, 8 per Reel). Compare the weekly time working one Reel at a time with working in batches. An AI editing tool then cuts editing to 10 minutes per Reel and captions and posting to 3. What is the batched time now, and which change saved more?

<details>
<summary>View Answer</summary>

The set-up times total 10 plus 25 plus 10 plus 5, which is 50 minutes, and the per-Reel times total 12 plus 10 plus 25 plus 8, which is 55 minutes. Working one Reel at a time, each Reel costs the set-up and the per-Reel time of every stage, 105 minutes, so five cost 525 minutes, or eight and three quarter hours. Working in batches, each set-up is paid once: 50 minutes, plus five times 55, which is 275, for a total of 325 minutes. Batching saves 200 minutes, which is four repeats of the 50 minutes of set-up. With the AI tool, the per-Reel times become 12, 10, 10, and 3, a total of 35 minutes. The batched time is then 50 plus five times 35, which is 225 minutes, a further saving of 100 minutes. So batching saved 200 minutes and the tool saved 100: on these figures the change in how the work is organised was worth twice the change in tooling, and cost nothing. The two also combine. Had the creator adopted the tool and gone on working one Reel at a time, the week would take five times 85, which is 425 minutes, so the tool alone saves 100 and leaves the 200 minutes of repeated set-up untouched. Together they take the week from 525 minutes to 225. One caution applies to the tool's figure. The three minutes for captions assumes the generated captions are read and corrected, and that check should not be skipped to save a little more.

</details>

@@starter
"""
Lab: Fit the Script, Time the Captions, Place the Text, Read the Numbers, Batch the Work
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""

# Each line of the script has a priority: 1 essential, 2 useful, 3 decoration.
LINES = [
    ("This chisel cost four pounds and could not cut butter.", 1),
    ("I found it at a car boot sale under a pile of spanners.", 3),
    ("Ten minutes later it shaved the hair off my arm.", 1),
    ("You need two stones and an old leather belt.", 2),
    ("Flatten the back first, twenty strokes on the coarse stone.", 1),
    ("My grandfather taught me this when I was nine.", 3),
    ("Hold the bevel at twenty-five degrees and do not rock the blade.", 1),
    ("Rocking it is the mistake that ruined my first three chisels.", 2),
    ("Finish with ten pulls on the leather.", 1),
    ("Try it tonight and send this to someone with a blunt chisel.", 1),
]

TUTORIAL = {"length_seconds": 28, "average_watch_seconds": 21.0, "reach": 12000, "likes": 540, "sends": 180, "saves": 300, "follows": 36}
RAMBLE = {"length_seconds": 75, "average_watch_seconds": 18.0, "reach": 15000, "likes": 600, "sends": 45, "saves": 60, "follows": 9}
LOOP = {"length_seconds": 9, "average_watch_seconds": 11.7, "reach": 8000, "likes": 400, "sends": 40, "saves": 16, "follows": 4}

# (stage, set-up minutes, minutes per Reel)
STAGES = [("script", 10, 15), ("film", 20, 8), ("edit", 10, 20), ("captions and cover", 5, 7), ("post", 5, 3)]


def seconds_of(lines, wpm=150):
    """Provided helper: how long a list of (text, priority) lines takes to say, in seconds."""
    return round(sum(len(text.split()) for text, _ in lines) / wpm * 60, 1)


# ---------------------------------------------------------------- Step 1
def fit_script(lines, max_seconds, wpm=150):
    """Cut a script to a time limit. Start with a copy of the lines. First for priority 3,
    then for priority 2: go through the kept lines from the LAST to the first; if
    seconds_of(kept, wpm) is already at or under max_seconds, stop this pass; otherwise, if
    the line has that priority, remove it. Priority 1 lines are never removed.
    Return {"lines": the kept texts in order, "seconds": seconds_of the kept lines,
            "fits": whether that is at or under max_seconds}."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def caption_cues(text, wpm=150, max_words=4):
    """Split the text into caption cues of at most max_words words, in order. One word takes
    60 / wpm seconds. A cue whose first word is word number `start` (counting from 0) and
    which has k words is the tuple
        (round(start * per_word, 2), round((start + k) * per_word, 2), the words joined by spaces)
    Return the list of cues."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def in_safe_zone(box, width=1080, height=1920, top=0.14, bottom=0.35, side=0.06):
    """box is (left, upper, right, lower) in pixels, measured from the top-left corner.
    Return True only if the whole box is inside the safe area:
        left >= width * side          right <= width * (1 - side)
        upper >= height * top         lower <= height * (1 - bottom)
    """
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def reel_metrics(stats):
    """stats has length_seconds, average_watch_seconds, reach, likes, sends, saves, follows.
    Return {"watch_ratio": average_watch_seconds / length_seconds, rounded to 2 places,
            "likes_per_reach", "sends_per_reach", "saves_per_reach", "follows_per_reach":
            each count / reach, rounded to 4 places}.
    Use 0.0 for the watch ratio if the length is 0, and for the rates if the reach is 0."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def batch_time(stages, count):
    """stages is a list of (name, set-up minutes, minutes per Reel).
        one_by_one = count * the sum over stages of (set-up + per Reel)
        batched    = the sum over stages of (set-up + count * per Reel)
    Return {"one_by_one": ..., "batched": ..., "saved": one_by_one - batched}."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("fit     :", fit_script(LINES, 30))
    print("cues    :", caption_cues("This chisel cost four pounds and could not cut butter."))
    print("safe    :", in_safe_zone((100, 400, 980, 700)), in_safe_zone((100, 100, 980, 300)))
    print("metrics :", reel_metrics(TUTORIAL))
    print("batch   :", batch_time(STAGES, 4))

@@solution
"""
Lab solution: Fit the Script, Time the Captions, Place the Text, Read the Numbers, Batch the Work
Standard library only.
"""

# Each line of the script has a priority: 1 essential, 2 useful, 3 decoration.
LINES = [
    ("This chisel cost four pounds and could not cut butter.", 1),
    ("I found it at a car boot sale under a pile of spanners.", 3),
    ("Ten minutes later it shaved the hair off my arm.", 1),
    ("You need two stones and an old leather belt.", 2),
    ("Flatten the back first, twenty strokes on the coarse stone.", 1),
    ("My grandfather taught me this when I was nine.", 3),
    ("Hold the bevel at twenty-five degrees and do not rock the blade.", 1),
    ("Rocking it is the mistake that ruined my first three chisels.", 2),
    ("Finish with ten pulls on the leather.", 1),
    ("Try it tonight and send this to someone with a blunt chisel.", 1),
]

TUTORIAL = {"length_seconds": 28, "average_watch_seconds": 21.0, "reach": 12000, "likes": 540, "sends": 180, "saves": 300, "follows": 36}
RAMBLE = {"length_seconds": 75, "average_watch_seconds": 18.0, "reach": 15000, "likes": 600, "sends": 45, "saves": 60, "follows": 9}
LOOP = {"length_seconds": 9, "average_watch_seconds": 11.7, "reach": 8000, "likes": 400, "sends": 40, "saves": 16, "follows": 4}

# (stage, set-up minutes, minutes per Reel)
STAGES = [("script", 10, 15), ("film", 20, 8), ("edit", 10, 20), ("captions and cover", 5, 7), ("post", 5, 3)]


def seconds_of(lines, wpm=150):
    """Provided helper: how long a list of (text, priority) lines takes to say, in seconds."""
    return round(sum(len(text.split()) for text, _ in lines) / wpm * 60, 1)


# ---------------------------------------------------------------- Step 1
def fit_script(lines, max_seconds, wpm=150):
    """Marking each line essential, useful, or decoration is the editorial work. The function
    only applies the decision, and says so honestly when the essentials alone do not fit."""
    kept = list(lines)
    for priority in (3, 2):
        for index in range(len(kept) - 1, -1, -1):
            if seconds_of(kept, wpm) <= max_seconds:
                break
            if kept[index][1] == priority:
                del kept[index]
    seconds = seconds_of(kept, wpm)
    return {"lines": [text for text, _ in kept], "seconds": seconds, "fits": seconds <= max_seconds}


# ---------------------------------------------------------------- Step 2
def caption_cues(text, wpm=150, max_words=4):
    """A Reel that needs its audio is silent to much of its audience. These timings assume
    an even pace: real tools time each word from the audio, and their output still needs reading."""
    words, per_word = text.split(), 60 / wpm
    cues = []
    for start in range(0, len(words), max_words):
        chunk = words[start:start + max_words]
        cues.append((round(start * per_word, 2), round((start + len(chunk)) * per_word, 2), " ".join(chunk)))
    return cues


# ---------------------------------------------------------------- Step 3
def in_safe_zone(box, width=1080, height=1920, top=0.14, bottom=0.35, side=0.06):
    """The interface is drawn over the video. Text under it cannot be read, so it belongs in
    the middle band. The margins are a default: check a draft on a phone."""
    left, upper, right, lower = box
    return (left >= width * side and right <= width * (1 - side)
            and upper >= height * top and lower <= height * (1 - bottom))


# ---------------------------------------------------------------- Step 4
def reel_metrics(stats):
    """Raw counts depend on how many people were shown the Reel. Ratios can be compared, and
    the pattern across them says what kind of Reel it was."""
    reach = stats["reach"]

    def per_reach(key):
        return round(stats[key] / reach, 4) if reach else 0.0

    return {
        "watch_ratio": round(stats["average_watch_seconds"] / stats["length_seconds"], 2) if stats["length_seconds"] else 0.0,
        "likes_per_reach": per_reach("likes"), "sends_per_reach": per_reach("sends"),
        "saves_per_reach": per_reach("saves"), "follows_per_reach": per_reach("follows"),
    }


# ---------------------------------------------------------------- Step 5
def batch_time(stages, count):
    """Batching saves every set-up after the first. AI tools cut the time per Reel. The
    two together are what make a steady pace practical for one person."""
    one_by_one = count * sum(setup + each for _, setup, each in stages)
    batched = sum(setup + count * each for _, setup, each in stages)
    return {"one_by_one": one_by_one, "batched": batched, "saved": one_by_one - batched}


if __name__ == "__main__":
    print(seconds_of(LINES), sum(len(text.split()) for text, _ in LINES))
    for limit in (30, 25, 20):
        result = fit_script(LINES, limit)
        print(limit, result["seconds"], result["fits"], len(result["lines"]))

    for cue in caption_cues("This chisel cost four pounds and could not cut butter."):
        print(cue)
    print(in_safe_zone((100, 400, 980, 700)), in_safe_zone((100, 100, 980, 300)), in_safe_zone((100, 1300, 980, 1500)), in_safe_zone((20, 400, 980, 700)))
    print(round(1080 * 0.06), round(1080 * 0.94), round(1920 * 0.14), round(1920 * 0.65))

    for name, stats in (("tutorial", TUTORIAL), ("ramble", RAMBLE), ("loop", LOOP)):
        print(name, reel_metrics(stats))

    print(batch_time(STAGES, 1), batch_time(STAGES, 4), batch_time(STAGES, 8))
    recall = [("a", 1)] * 0
    lines = [(" ".join(["w"] * count), priority) for count, priority in ((12, 1), (14, 3), (10, 1), (9, 2), (13, 1), (11, 2), (11, 1))]
    print(seconds_of(lines), fit_script(lines, 25)["seconds"], len(fit_script(lines, 25)["lines"]), fit_script(lines, 15)["seconds"], fit_script(lines, 15)["fits"])
    weekly = [("script", 10, 12), ("film", 25, 10), ("edit", 10, 25), ("captions and post", 5, 8)]
    with_tool = [("script", 10, 12), ("film", 25, 10), ("edit", 10, 10), ("captions and post", 5, 3)]
    print(batch_time(weekly, 5), batch_time(with_tool, 5))

@@step
{
  "stepNumber": 1,
  "title": "Cut a script to length by priority",
  "instruction": "Implement fit_script(lines, max_seconds, wpm). Each line is a tuple of its text and a priority: 1 essential, 2 useful, 3 decoration. Start with a copy of the list. First for priority 3 and then for priority 2, go through the kept lines from the last to the first. Before looking at each line, check the provided helper seconds_of(kept, wpm): if it is at or under max_seconds, stop this pass. Otherwise, if the line has the priority being removed, delete it. Priority 1 lines are never removed. Return a dict with 'lines', the kept texts in their original order; 'seconds', the length of the kept lines; and 'fits', whether that length is at or under max_seconds. Cut LINES to 30, 25, and 20 seconds. This is the cutting method from Section 2. [MOD-6.8]",
  "hintConceptual": "Packing a small bag for a trip: the things you could do without come out first, then the things that are merely handy. You stop as soon as it closes. If it will not close with only the essentials in it, you need a bigger bag or a shorter trip.",
  "hintSyntax": "kept = list(lines)\nfor priority in (3, 2):\n    for index in range(len(kept) - 1, -1, -1):\n        if seconds_of(kept, wpm) <= max_seconds:\n            break\n        if kept[index][1] == priority:\n            del kept[index]\nseconds = seconds_of(kept, wpm)\nreturn {\"lines\": [text for text, _ in kept], \"seconds\": seconds, \"fits\": seconds <= max_seconds}"
}
@@assert
_thirty = fit_script(LINES, 30)
assert _thirty is not None and _thirty["seconds"] == 28.0 and _thirty["fits"] is True and len(_thirty["lines"]) == 7, f"Cut to 30 seconds, seven lines remain at 28.0 seconds, got {_thirty}"
assert "I found it at a car boot sale under a pile of spanners." not in _thirty["lines"] and "My grandfather taught me this when I was nine." not in _thirty["lines"], "Both decoration lines are removed first"
assert "Rocking it is the mistake that ruined my first three chisels." not in _thirty["lines"] and "You need two stones and an old leather belt." in _thirty["lines"], "Useful lines are removed from the end backwards, and only as many as needed"
assert _thirty["lines"][0] == LINES[0][0] and _thirty["lines"][-1] == LINES[-1][0], "The kept lines stay in their original order"
assert fit_script(LINES, 60) == {"lines": [text for text, _ in LINES], "seconds": 41.2, "fits": True}, "A script that already fits is returned whole"
assert fit_script(LINES, 40)["seconds"] == 37.6 and len(fit_script(LINES, 40)["lines"]) == 9, "For 40 seconds, removing the last decoration line is enough"
_twenty = fit_script(LINES, 20)
assert _twenty["seconds"] == 24.4 and _twenty["fits"] is False and len(_twenty["lines"]) == 6, "The six essential lines take 24.4 seconds, so 20 cannot be met, and the result says so"
assert len(LINES) == 10, "The original list is not modified"
assert fit_script([], 10) == {"lines": [], "seconds": 0.0, "fits": True}, "An empty script fits"
print("Step 1 passed: for 30 seconds, the decoration and one useful line go, and the steps remain.")

@@step
{
  "stepNumber": 2,
  "title": "Time the captions",
  "instruction": "Implement caption_cues(text, wpm, max_words). Split the text into words. One word takes 60 divided by wpm seconds. Take the words in groups of at most max_words, in order. For a group whose first word is word number start, counting from 0, and which has k words, the cue is a tuple of the start time, which is start times the time per word, rounded to 2 decimal places; the end time, which is start plus k, times the time per word, rounded to 2 places; and the words joined with spaces. Return the list of cues. Build the cues for the hook line at 150 words per minute and four words per cue. This is the caption timing from Section 2. [MOD-6.8]",
  "hintConceptual": "Subtitles show a few words at a time, each group appearing as it is spoken and giving way to the next. If every word takes the same time, the timing is just counting words.",
  "hintSyntax": "words, per_word = text.split(), 60 / wpm\ncues = []\nfor start in range(0, len(words), max_words):\n    chunk = words[start:start + max_words]\n    cues.append((round(start * per_word, 2), round((start + len(chunk)) * per_word, 2), \" \".join(chunk)))\nreturn cues"
}
@@assert
_cues = caption_cues("This chisel cost four pounds and could not cut butter.")
assert _cues == [(0.0, 1.6, "This chisel cost four"), (1.6, 3.2, "pounds and could not"), (3.2, 4.0, "cut butter.")], f"Three cues, the last with two words, got {_cues}"
assert all(_cues[index][1] == _cues[index + 1][0] for index in range(len(_cues) - 1)), "Each cue starts where the previous one ended"
assert caption_cues("one two three four five six", max_words=2) == [(0.0, 0.8, "one two"), (0.8, 1.6, "three four"), (1.6, 2.4, "five six")], "The number of words per cue is an argument"
assert caption_cues("one two three", wpm=120, max_words=3) == [(0.0, 1.5, "one two three")], "At 120 words a minute a word takes half a second"
assert caption_cues("one") == [(0.0, 0.4, "one")] and caption_cues("") == [], "A single word is one cue, and empty text gives none"
assert len(caption_cues(" ".join(text for text, _ in LINES))) == 26, "The full 103-word script needs 26 cues of four words"
assert caption_cues("a  b\n c") == [(0.0, 1.2, "a b c")], "Extra spaces and line breaks between words are ignored"
print("Step 2 passed: the hook becomes three cues, on screen from 0 to 4 seconds.")

@@step
{
  "stepNumber": 3,
  "title": "Keep text out from under the interface",
  "instruction": "Implement in_safe_zone(box, width, height, top, bottom, side). The box is a tuple of left, upper, right, and lower edges in pixels, measured from the top-left corner of the frame. Return True only if the whole box lies inside the safe area: its left edge is at least width times side, its right edge is at most width times (1 minus side), its upper edge is at least height times top, and its lower edge is at most height times (1 minus bottom). Otherwise return False. Test a caption across the middle of a 1080 by 1920 frame, one near the top, one near the bottom, and one too close to the left edge. These are the margins from the safe-zone table in Section 2. [MOD-6.8]",
  "hintConceptual": "A notice pinned to a board is only readable if no part of it is under the frame. Check all four edges of the notice against the four edges of the clear area.",
  "hintSyntax": "left, upper, right, lower = box\nreturn (left >= width * side and right <= width * (1 - side)\n        and upper >= height * top and lower <= height * (1 - bottom))"
}
@@assert
assert in_safe_zone((100, 400, 980, 700)) is True, f"A caption across the middle of the frame is safe, got {in_safe_zone((100, 400, 980, 700))}"
assert in_safe_zone((100, 100, 980, 300)) is False, "A box starting 100 pixels from the top is under the top 14 percent, about 269 pixels"
assert in_safe_zone((100, 1300, 980, 1500)) is False, "A box ending at 1,500 pixels is below the safe limit of 1,248"
assert in_safe_zone((20, 400, 980, 700)) is False and in_safe_zone((100, 400, 1060, 700)) is False, "A box inside either 6 percent side margin is not safe"
assert in_safe_zone((100, 300, 980, 1200)) is True and in_safe_zone((100, 300, 980, 1300)) is False, "The lower edge decides: 1,200 is inside and 1,300 is not"
assert in_safe_zone((100, 400, 980, 700), top=0.25) is False and in_safe_zone((100, 400, 980, 700), bottom=0.7) is False, "The margins are arguments"
assert in_safe_zone((50, 50, 950, 950), width=1000, height=1000, top=0.05, bottom=0.05, side=0.05) is True, "The frame size is an argument, and a box exactly on the margins is inside"
assert in_safe_zone((0, 0, 1080, 1920)) is False, "The whole frame is not safe"
print("Step 3 passed: text in the middle band is clear, and text near any edge is covered.")

@@step
{
  "stepNumber": 4,
  "title": "Read a Reel's numbers",
  "instruction": "Implement reel_metrics(stats). The stats dict has length_seconds, average_watch_seconds, reach, likes, sends, saves, and follows. Return a dict with 'watch_ratio', the average watch time divided by the length, rounded to 2 decimal places, or 0.0 if the length is 0; and 'likes_per_reach', 'sends_per_reach', 'saves_per_reach', and 'follows_per_reach', each the count divided by the reach, rounded to 4 decimal places, or 0.0 if the reach is 0. Compute the metrics for TUTORIAL, RAMBLE, and LOOP and compare the patterns. These are the measures from Section 2, built on the signals Instagram's head has named. [MOD-6.8]",
  "hintConceptual": "A shop with more passers-by sells more of everything. To compare two shops fairly you ask what share of the people who walked past came in, bought, and told a friend.",
  "hintSyntax": "reach = stats[\"reach\"]\n\ndef per_reach(key):\n    return round(stats[key] / reach, 4) if reach else 0.0\n\nreturn {\n    \"watch_ratio\": round(stats[\"average_watch_seconds\"] / stats[\"length_seconds\"], 2) if stats[\"length_seconds\"] else 0.0,\n    \"likes_per_reach\": per_reach(\"likes\"), \"sends_per_reach\": per_reach(\"sends\"),\n    \"saves_per_reach\": per_reach(\"saves\"), \"follows_per_reach\": per_reach(\"follows\"),\n}"
}
@@assert
assert reel_metrics(TUTORIAL) == {"watch_ratio": 0.75, "likes_per_reach": 0.045, "sends_per_reach": 0.015, "saves_per_reach": 0.025, "follows_per_reach": 0.003}, f"The tutorial is watched three quarters through and is sent and saved most, got {reel_metrics(TUTORIAL)}"
assert reel_metrics(RAMBLE) == {"watch_ratio": 0.24, "likes_per_reach": 0.04, "sends_per_reach": 0.003, "saves_per_reach": 0.004, "follows_per_reach": 0.0006}, "The ramble reached the most people and held them least"
assert reel_metrics(LOOP) == {"watch_ratio": 1.3, "likes_per_reach": 0.05, "sends_per_reach": 0.005, "saves_per_reach": 0.002, "follows_per_reach": 0.0005}, "The loop is rewatched, with a ratio above 1, and little else"
assert reel_metrics(TUTORIAL)["sends_per_reach"] == 5 * reel_metrics(RAMBLE)["sends_per_reach"], "The tutorial is sent at five times the rate of the ramble"
_first = reel_metrics({"length_seconds": 20, "average_watch_seconds": 24, "reach": 10000, "likes": 600, "sends": 30, "saves": 20, "follows": 0})
_second = reel_metrics({"length_seconds": 40, "average_watch_seconds": 26, "reach": 6000, "likes": 240, "sends": 150, "saves": 240, "follows": 0})
assert (_first["watch_ratio"], _first["sends_per_reach"], _first["saves_per_reach"]) == (1.2, 0.003, 0.002) and (_second["watch_ratio"], _second["sends_per_reach"], _second["saves_per_reach"]) == (0.65, 0.025, 0.04), "The numbers from the second recall question"
_zero = reel_metrics({"length_seconds": 0, "average_watch_seconds": 0, "reach": 0, "likes": 0, "sends": 0, "saves": 0, "follows": 0})
assert _zero == {"watch_ratio": 0.0, "likes_per_reach": 0.0, "sends_per_reach": 0.0, "saves_per_reach": 0.0, "follows_per_reach": 0.0}, "No length and no reach give zeros, with no division by zero"
print("Step 4 passed: the tutorial is saved and sent, and the loop is only rewatched.")

@@step
{
  "stepNumber": 5,
  "title": "Compare one at a time with batching",
  "instruction": "Implement batch_time(stages, count). Each stage is a tuple of a name, the set-up time in minutes, and the time per Reel in minutes. Working one Reel at a time, every Reel pays every set-up: the total is count times the sum over the stages of the set-up plus the per-Reel time. Working in batches, each set-up is paid once: the total is the sum over the stages of the set-up plus count times the per-Reel time. Return a dict with 'one_by_one', 'batched', and 'saved', which is the difference. Compare 1, 4, and 8 Reels with STAGES. This is the batching formula from Section 2. [MOD-6.8]",
  "hintConceptual": "Baking twelve loaves one after another, heating the oven and washing up each time, takes far longer than heating the oven once. The time each loaf spends baking is the same either way.",
  "hintSyntax": "one_by_one = count * sum(setup + each for _, setup, each in stages)\nbatched = sum(setup + count * each for _, setup, each in stages)\nreturn {\"one_by_one\": one_by_one, \"batched\": batched, \"saved\": one_by_one - batched}"
}
@@assert
assert batch_time(STAGES, 4) == {"one_by_one": 412, "batched": 262, "saved": 150}, f"Four Reels: 412 minutes one at a time, 262 batched, got {batch_time(STAGES, 4)}"
assert batch_time(STAGES, 1) == {"one_by_one": 103, "batched": 103, "saved": 0}, "One Reel takes the same time either way"
assert batch_time(STAGES, 8) == {"one_by_one": 824, "batched": 474, "saved": 350}, "Eight Reels save 350 minutes"
assert batch_time(STAGES, 4)["saved"] == 3 * sum(setup for _, setup, _ in STAGES), "The saving is every set-up after the first"
_weekly = [("script", 10, 12), ("film", 25, 10), ("edit", 10, 25), ("captions and post", 5, 8)]
_with_tool = [("script", 10, 12), ("film", 25, 10), ("edit", 10, 10), ("captions and post", 5, 3)]
assert batch_time(_weekly, 5) == {"one_by_one": 525, "batched": 325, "saved": 200} and batch_time(_with_tool, 5) == {"one_by_one": 425, "batched": 225, "saved": 200}, "The numbers from the third recall question"
assert batch_time(STAGES, 0) == {"one_by_one": 0, "batched": 50, "saved": -50}, "With no Reels, setting up is pure cost"
assert batch_time([], 5) == {"one_by_one": 0, "batched": 0, "saved": 0}, "No stages, no time"
print("Step 5 passed: four Reels take 412 minutes one at a time and 262 in batches.")
