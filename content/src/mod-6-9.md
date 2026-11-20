@@meta
{
  "moduleId": "MOD-6.9",
  "slug": "mod-6-9",
  "unitId": "UNIT-6",
  "unitTitle": "Unit 6: AI Content Creation Masterclass",
  "title": "Instagram Carousels",
  "difficulty": "Foundational",
  "estimatedMinutes": 85,
  "citations": [
    { "title": "Instagram for Creators", "source": "Instagram", "url": "https://creators.instagram.com/" },
    { "title": "Understanding Success Criterion 1.4.3: Contrast (Minimum)", "source": "W3C Web Accessibility Initiative", "url": "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" },
    { "title": "Instagram chief shares insights into its algorithms and creator monetization", "source": "Social Media Today", "url": "https://www.socialmediatoday.com/news/instagram-chief-shares-insights-into-its-algorithms-creator-monetization/718540/" },
    { "title": "Instagram restricts reach of content aggregators in new crackdown", "source": "TechCrunch", "url": "https://techcrunch.com/2026/04/30/instagram-restricts-reach-of-content-aggregators-in-new-crackdown/" }
  ],
  "videoLibrary": [
    {
      "id": "VID-6.9-1",
      "title": "My 5-Min Process of Turning a Blog Post into a Carousel",
      "creator": "Poulomi Basu - BrandAI Growth Systems",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=SA5Oumoz64s",
      "timingInstruction": "Watch after reading Section 2 (repurposing an article into slides), and compare the process with the lab's outline step",
      "keyTakeaway": "Shows an article turned into slide copy with a chat model and then into designed slides from a template, the repurposing route this chapter recommends."
    },
    {
      "id": "VID-6.9-2",
      "title": "ChatGPT + Canva = Your New IG Carousel Creation Flow",
      "creator": "TechMarketer",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=qD8CGST4zYw",
      "timingInstruction": "Watch after reading Section 1, to see a full carousel workflow from copy to design",
      "keyTakeaway": "A complete flow that drafts the copy with a model and fills a design template with it, the division of labour between writing and layout."
    },
    {
      "id": "VID-6.9-3",
      "title": "Make Instagram Carousels with Canva & ChatGPT",
      "creator": "Carrie J Little, BS, MS",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=8Uyvq5B3XbY",
      "timingInstruction": "Watch after completing the lab, as a second example of the template-and-batch approach; note that tool screens date quickly",
      "keyTakeaway": "Another worked example of pairing a model for the words with a template for the design, useful for seeing the same method done a different way."
    },
    {
      "id": "VID-6.9-4",
      "title": "Meta Social Media Marketing Professional Certificate",
      "creator": "Meta",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/professional-certificates/facebook-social-media-marketing",
      "timingInstruction": "Take the course on creating content after Section 4",
      "keyTakeaway": "The platform owner's own training on planning and producing posts for its feeds, including multi-image formats."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Outline, Plan, Fit the Text, Read the Swipes, Compare Formats",
    "context": "A woodworking shop wants to turn each of its articles into an Instagram carousel without designing every slide by hand. You will build a converter from an article's headings to slide copy, a planner that adds a cover and an ending, a font sizer that makes the text fit the slide, a reader of how far people swipe, and a comparison of carousels with other formats by saves and shares.",
    "language": "python"
  }
}

@@reading
# Instagram Carousels

A carousel is a post of several images that the viewer swipes through, one at a time. On Instagram it is the format closest to a small booklet: a cover, a few pages, and a back page that tells you what to do next.

Carousels suit exactly the kind of material that Reels handle badly: steps to follow, lists to keep, comparisons to study, and ideas that a reader wants to take in at their own pace. They are also the format most easily made with AI, because their raw material is text, and turning an article or a video transcript into a set of slides is a job that a model and a design template can do most of. This chapter covers how a carousel is structured, how to make one from material you already have, and how to tell whether it worked.

## 1. First-Principles Mental Model & Intuition

### A booklet that has to sell its own first page

A pamphlet handed out in the street has one job before any other: to be opened. Its cover says what is inside and why you would want it. Each page then delivers one thing, and leads you to turn to the next. The back page says what to do now.

A carousel is that pamphlet. The cover is the first slide, which appears in the feed like any other post and decides whether anyone swipes. Each later slide must earn the swipe after it. The last slide asks for one thing.

### The difference from a Reel

| | A Reel | A carousel |
|---|---|---|
| Pace | Set by the video | Set by the reader |
| Sound | Often off | Never needed |
| Best for | Showing a process or a moment | Steps, lists, reference, comparison |
| Revisited | Rewatched once | Saved and returned to |
| Made from | Footage | Text and images |

That fourth row is the useful one. People save carousels they want to come back to: a checklist, a set of steps, a cheat sheet. Module 6.8 showed that saves per reach is the measure of whether something has lasting value. A good carousel is built to be saved.

### The shape

```text
   SLIDE 1         SLIDES 2 TO n-1                      SLIDE n
   +--------+      +--------+   +--------+   +--------+     +--------+
   | COVER  |  ->  | one    |-> | one    |-> | one    | ->  | ONE    |
   | the    |      | idea   |   | idea   |   | idea   |     | ASK    |
   | payoff |      | per    |   | per    |   | per    |     | save,  |
   | + swipe|      | slide  |   | slide  |   | slide  |     | share, |
   | cue    |      |        |   |        |   |        |     | follow |
   +--------+      +--------+   +--------+   +--------+     +--------+

   readers drop away at every swipe: each slide must give a reason for the next
```

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### The format

As with every specification in this unit, the app is the authority and the details change. At the time of writing (November 2026), a carousel can hold up to 20 slides, raised from an earlier limit of 10, and mix photographs and short videos. The supported shapes are square (1:1), portrait (4:5, which is 1080 by 1350 pixels), and a taller 3:4 that matches the profile grid. The first slide's shape is applied to the rest, so all slides should be designed at one size. Alt text, the description read aloud by screen readers, can be added to each image and should be.

Portrait slides take up more of the screen than square ones, and are the usual choice for text-led carousels.

### The cover

The cover does the work of the thumbnail in Module 6.7 and the hook in Module 6.6.

| A cover needs | Because |
|---|---|
| The payoff, stated | The reader must know what they get for swiping |
| Few words, large | It is seen small in a feed, among photographs |
| Contrast | The same 4.5 floor as any text |
| A cue to swipe | An arrow or "swipe" tells a scrolling reader there is more |
| A reason to save | "The five steps", "the checklist", "the cheat sheet" signals reference |

### One idea per slide

Each slide makes one point, in as few words as it needs. There is no fixed rule, and a common working range is under forty words a slide, with a heading of a few words and a line or two beneath. A slide crowded with text is skipped, and so is everything after it.

The slides should run in an order that pulls the reader forward: steps in sequence, a list building to its best item, a problem followed by its solution. The penultimate slide is a good place for a summary, because a reader who reached it has absorbed the parts and will save the whole.

### Attrition

Not everyone who sees the cover reaches the end. If a fraction $k$ of readers who see one slide go on to the next, and that fraction is about the same at every swipe, then the share who reach slide $n$ is

$$
k^{\,n - 1}
$$

At $k = 0.9$, about two thirds of readers reach slide 5, half reach slide 8, and only about one in seven reaches slide 20. At $k = 0.95$, the figures are 81, 70, and 38 percent.

| Slides | Reach the end, $k = 0.90$ | Reach the end, $k = 0.95$ |
|---|---|---|
| 5 | 66 percent | 81 percent |
| 8 | 48 percent | 70 percent |
| 10 | 39 percent | 63 percent |
| 20 | 14 percent | 38 percent |

This is the compounding of Module 2.12, applied to attention. Two lessons follow. Every extra slide costs readers at the end, so a carousel should be as long as the material needs and no longer. And whatever is on the last slide, the ask, is seen by the fewest people, so the most important content should not be held back to the end.

Where your analytics show how many people reached each slide, the curve shows exactly where interest fell, in the same way the retention graph of Module 6.6 does for video. The first swipe always loses the most. The useful question is which later slide lost more than its neighbours.

### Distribution

Instagram has not published how carousels are ranked, and claims about it should be treated with care. Two things are reasonably established. Its head has named watch time, likes per reach, and sends per reach as leading signals across the app, which in a carousel correspond to swiping through, liking, and sharing. And the platform's 2026 restrictions on recycled content apply here as everywhere: slides copied from other accounts are treated as unoriginal.

A widely repeated claim is that a carousel that was not swiped may be shown again later, starting from a different slide. It is plausible and not confirmed by a primary source, so design each slide to make sense on its own as well as in sequence, which is good practice whether or not the claim is true.

Third-party studies of millions of posts in 2025 have generally reported carousels with engagement rates similar to or a little above those of Reels, and well above single images, while Reels reach more people. Such studies are produced by analytics firms, measure engagement in different ways, and should be read as broad patterns. The comparison that matters is between your own posts, using rates and not raw counts, as Module 6.1 did for pillars.

### Making carousels with AI

The carousel is the most automatable format in this unit, because its parts separate cleanly.

| Part | AI does | You do |
|---|---|---|
| Source | Summarises an article or transcript into points | Choose the material worth turning into slides |
| Structure | Proposes a cover, a slide per point, and an ending | Decide the order and the payoff |
| Copy | Drafts a heading and a line for each slide, in your voice | Cut, correct, and make it specific |
| Design | Fills a template with the copy, slide by slide | Make the template once, carefully |
| Images | Generates illustrations or backgrounds | Prefer your own photographs where they exist |
| Checks | Can measure contrast and text size | Read every slide on a phone |

The design step deserves emphasis. Design tools can fill a template from a list of text, producing a slide for each row. That makes the template the investment: a layout with a fixed grid, margins, fonts, and colours, designed once with care and reused for every carousel. Consistency across posts comes from the template, and so does speed.

The most valuable source of carousels is your own long material. An article already has headings, which are slides waiting to be cut out. A video transcript has steps. Module 6.12 builds this into an automated pipeline. Here the point is simpler: repurposing what you have made is faster than starting again, and it is original, which matters to the platform.

### Legibility on a phone

A slide 1080 pixels wide is shown on a phone about 390 points wide, roughly a third of its designed size. Text designed at 36 pixels appears at about 13. That puts a floor under the type size, and with the margins needed to keep text clear of the screen edges, it limits how many words fit.

Fitting text is a search: start at the largest size, wrap the words into lines that fit the width, and reduce the size until the text fits in the lines allowed. If it does not fit at the smallest acceptable size, the answer is fewer words, not smaller type. The lab builds the search.

The contrast rule of Module 6.7 applies to every slide: at least 4.5 between text and background.

### Complexity

Outlining and planning are linear in the length of the article. Fitting a font tries a handful of sizes, each a pass over the words. Reading the swipe curve and comparing formats are linear in their inputs.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, an article becomes slides.

```python
ARTICLE = """# Sharpen a chisel in ten minutes
A blunt chisel tears the wood. Most people blame the chisel. The problem is almost always the edge.
## Flatten the back
Rub the back of the chisel on the coarse stone for twenty strokes. A flat back is the foundation of a sharp edge.
## Set the bevel
Hold the bevel at twenty-five degrees. Lock your wrists and move from the shoulders. Do not rock the blade.
## Remove the burr
Turn the chisel over and take two light strokes on the back. The burr should come away as a thin wire.
## Strop on leather
Finish with ten pulls on an old leather belt, edge trailing. Test on end grain.
## The mistake to avoid
Rocking the blade rounds the edge. It ruined my first three chisels."""

def outline_slides(markdown, max_words=30):
    slides, heading, body = [], None, []

    def finish():
        if heading is not None:
            words = " ".join(body).split()
            slides.append({"heading": heading, "text": " ".join(words[:max_words]), "cut": max(0, len(words) - max_words)})

    for line in markdown.splitlines():
        if line.startswith("#"):
            finish()
            heading, body = line.lstrip("#").strip(), []
        elif line.strip():
            body.append(line.strip())
    finish()
    return slides

SLIDES = outline_slides(ARTICLE)
for slide in SLIDES:
    print(slide["heading"], "|", len(slide["text"].split()), "words |", slide["cut"], "cut")
```

- **Each heading starts a slide.** The lines beneath it, up to the next heading, are its text. The markers of the heading level are stripped.
- **The text is capped at a number of words.** Anything over the cap is cut, and the number cut is recorded, so that a person can see where the article said more than a slide can hold.
- **The article gives six slides.** The title section and five steps, each between 12 and 23 words. Nothing was cut, because the article was written in short sections.
- **This is the structure doing the work.** A well-headed article is most of a carousel already. An article without headings would need a model to propose them first, which is the summarising step in Section 2's table.
- **The copy is the article's, not a model's.** That keeps it accurate and in the shop's voice. A model would be used here to shorten, not to invent.

Next, a cover and an ending.

```python
def carousel_plan(slides, cover, cta, limit=20):
    plan = [{"role": "cover", "heading": cover, "text": ""}]
    plan += [{"role": "content", "heading": slide["heading"], "text": slide["text"]} for slide in slides]
    plan.append({"role": "cta", "heading": cta, "text": ""})
    if len(plan) > limit:
        raise ValueError(f"{len(plan)} slides is over the limit of {limit}")
    return plan

PLAN = carousel_plan(SLIDES[1:], "4 POUND CHISEL TO RAZOR SHARP", "Save this for your next sharpening session")
print(len(PLAN), [slide["role"] for slide in PLAN])
print(round(0.9 ** (len(PLAN) - 1), 2), round(0.95 ** (len(PLAN) - 1), 2))
```

- **The plan wraps the content in a cover and an ask.** The cover states the payoff. The ask is a single request.
- **The article's own title section is left out.** Its job, introducing the subject, is done better by a cover that states the result.
- **The five steps become slides 2 to 6.** The carousel has seven slides.
- **A plan over the platform's limit raises an error.** Twenty slides at the time of writing. The error gives the slide count and the limit.
- **At a 90 percent swipe rate, 53 percent of readers reach the seventh slide.** At 95 percent, 74 percent. The ask on the last slide is seen by about half the audience. That is why the steps, and not the ask, carry the value.

Then, making the text fit.

```python
def wrap_lines(text, size, width_px, char_width=0.55):
    per_line = int(width_px // (size * char_width))
    words = text.split()
    if any(len(word) > per_line for word in words):
        return None
    lines, current = 0, 0
    for word in words:
        if current and current + 1 + len(word) <= per_line:
            current += 1 + len(word)
        else:
            lines += 1 if current else 0
            current = len(word)
    return lines + (1 if current else 0)

def fit_font(text, width_px, max_lines, max_size=96, min_size=36):
    for size in range(max_size, min_size - 1, -4):
        lines = wrap_lines(text, size, width_px)
        if lines is not None and lines <= max_lines:
            return {"size": size, "lines": lines}
    return None

STEP = "Hold the bevel at twenty-five degrees. Lock your wrists and move from the shoulders. Do not rock the blade."
print(fit_font("4 POUND CHISEL TO RAZOR SHARP", 940, 3), fit_font("4 POUND CHISEL TO RAZOR SHARP", 940, 1))
print(fit_font(STEP, 940, 6), fit_font(STEP, 940, 4), fit_font(STEP, 940, 2))
```

- **`wrap_lines` estimates how many lines a text needs at a given size.** It assumes an average character is a little over half as wide as the font is tall, a fair estimate for most sans-serif fonts. It fills each line with whole words until the next will not fit.
- **A word longer than a whole line makes the size impossible.** The function returns nothing for that size.
- **`fit_font` tries sizes from 96 pixels down to 36, in steps of 4.** It returns the first, which is the largest, at which the text fits in the lines allowed. The width of 940 pixels is a 1080-pixel slide with 70 pixels of margin each side.
- **The cover fits at 96 pixels on two lines.** Forced onto one line, it needs 56.
- **The step text fits at 84 pixels on six lines, or 56 on four.** Larger type with more lines, or smaller type with fewer: a design choice.
- **On two lines it cannot fit at all, and the function says so.** The floor of 36 pixels is about 13 points on a phone. Below it, the slide is unreadable, so the answer is to cut the words.

Finally, the swipe curve, and a comparison of formats.

```python
def swipe_report(reached):
    if not reached or reached[0] == 0:
        return None
    curve = [round(count / reached[0], 3) for count in reached]
    drops = [reached[index] - reached[index + 1] for index in range(1, len(reached) - 1)]
    worst = (max(range(len(drops)), key=lambda index: drops[index]) + 2) if drops else None
    return {"curve": curve, "completion": curve[-1], "worst_after_slide": worst}

def compare_formats(posts):
    totals = {}
    for post in posts:
        total = totals.setdefault(post["format"], {"reach": 0, "saves": 0, "shares": 0, "posts": 0})
        for key in ("reach", "saves", "shares"):
            total[key] += post[key]
        total["posts"] += 1
    return {name: {"saves_per_reach": round(total["saves"] / total["reach"], 4) if total["reach"] else 0.0,
                   "shares_per_reach": round(total["shares"] / total["reach"], 4) if total["reach"] else 0.0,
                   "posts": total["posts"]}
            for name, total in sorted(totals.items())}

print(swipe_report([1000, 820, 700, 640, 600, 560, 540, 500]))
POSTS = [
    {"format": "carousel", "reach": 4000, "saves": 160, "shares": 40},
    {"format": "carousel", "reach": 6000, "saves": 210, "shares": 66},
    {"format": "reel", "reach": 12000, "saves": 120, "shares": 96},
    {"format": "reel", "reach": 9000, "saves": 72, "shares": 45},
    {"format": "image", "reach": 3000, "saves": 15, "shares": 6},
]
print(compare_formats(POSTS))
```

- **`swipe_report` divides each slide's count by the cover's.** The curve starts at 1 and falls with each swipe.
- **Half the readers reached the eighth slide.** The completion is 0.5.
- **The worst drop after the first swipe is after slide 2.** 120 readers left between slides 2 and 3, against 60 or fewer at each later swipe. The first swipe, which lost 180, always loses the most and is left out of the comparison.
- **The report names the slide to fix.** Slide 2 is where the carousel lost people it had already won. It might be too dense, or a weak start to the steps.
- **`compare_formats` pools posts by format and divides by reach.** It reports saves and shares per person reached.
- **Carousels are saved at 3.7 percent of reach, Reels at 0.9, and the single image at 0.5.** Carousels are kept at four times the rate of Reels.
- **Reels reached far more people.** 21,000 against 10,000 for two posts each. The two formats do different jobs: Reels to be found, carousels to be kept. A content plan uses both, which is why Module 6.1's calendar mixes formats.

**Complexity.** `outline_slides`, `carousel_plan`, `swipe_report`, and `compare_formats` are linear in their inputs. `fit_font` tries at most sixteen sizes, each a pass over the words.

### A carousel brief

```text
SOURCE:      [article / transcript / notes]       SAVE-WORTHY BECAUSE: [what the reader keeps]
COVER:       [the payoff, at most 7 words]  + swipe cue
SLIDES:      one idea each, heading of at most 5 words, at most 40 words of text
ORDER:       [steps in sequence / building to the best item / problem then solution]
SUMMARY:     the penultimate slide gathers it all
LAST SLIDE:  one ask: [save / share with ___ / follow for ___]
SIZE:        1080 x 1350, margins of 70 px, type at least 36 px, contrast at least 4.5
TEMPLATE:    [name], fonts [___], colours [___]
ALT TEXT:    written for every slide
```

### Checking a carousel before posting

| Check | Pass |
|---|---|
| The cover in the feed, at real size | The payoff is readable and the swipe cue visible |
| Each slide alone | It makes sense without the slide before |
| Words per slide | Under about 40, with a short heading |
| Type and contrast | At least 36 pixels designed, at least 4.5 contrast |
| Facts | Every number checked against the source |
| The order | Each slide gives a reason to see the next |
| The end | One ask, and the value is not held back for it |
| Alt text | Present on every slide |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**A cover that is a title, not a payoff.** "Chisel sharpening" says what the topic is. "From four-pound junk to razor sharp in ten minutes" says what the reader gets. Only the second earns a swipe.

**Walls of text.** A slide with a paragraph on it is skipped, and so is the rest of the carousel. If a slide needs more words than fit at a readable size, it is two slides, or the point needs cutting.

**Too many slides.** Twenty slides are allowed and rarely needed. Each one loses readers. Use as many as the material requires.

**Holding the value back.** "The best tip is on the last slide" is seen by the fewest people. Give value from the second slide on, and let the ask follow.

**Slides that only work in sequence.** If a carousel may be shown starting partway through, and a reader may stop anywhere, each slide should stand alone.

**Inconsistent design.** Different fonts, margins, and colours on each slide look careless and slow the reader down. One template, used every time.

**Generic AI imagery.** Glossy generated illustrations on every slide make a carousel look like everyone else's. A real photograph of the step being described is clearer and more convincing.

**Copy straight from the model.** Slide copy drafted by a model needs the same edit as any script: cut, make it specific, check the numbers. A carousel of plausible generalities is not saved.

**Text that is too small.** Designed on a large monitor, a slide looks fine. On a phone, at a third of the size, it is unreadable. Check on a phone before posting.

**Cropped slides.** Designing the first slide square and the rest portrait, or the reverse, means the platform crops some of them. Design every slide at one size.

**No alt text.** Screen readers cannot read text inside an image. A line of alt text per slide makes the carousel usable by people who cannot see it, and costs a minute.

**Copying other accounts' carousels.** Reposting someone else's slides, even with credit, is the recycled content that the platform restricts. Turn your own material into slides.

**Making every carousel from scratch.** The template and the repurposing route are what make carousels fast. An article published on Tuesday is a carousel on Thursday.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A carousel is a booklet in a feed: a cover that states the payoff and invites a swipe, one idea per slide, and a single ask at the end. It suits steps, lists, comparisons, and reference, and is built to be saved, which makes saves per reach its key measure. At the time of writing it can hold up to 20 slides, with the first slide's shape applied to all. Readers drop away at every swipe, so if a share $k$ continue each time, $k^{n-1}$ reach slide $n$: every extra slide costs readers, and the ask on the last slide is seen by the fewest. The format is the easiest in the unit to make with AI, because its parts separate: source material, especially your own articles and transcripts, becomes points, a model drafts or shortens the copy, and a template designed once is filled slide by slide. Text must fit at a readable size, at least about 36 designed pixels on a 1080-pixel slide, with contrast of at least 4.5, and the answer to text that does not fit is fewer words. Analytics show where readers stopped and how carousels compare with other formats: typically fewer people reached than Reels, and more of them keeping it.

**Question 1.** A carousel has 12 slides, and about 92 percent of readers continue at each swipe. What share reach the last slide? If the carousel were cut to 7 slides, what share would reach the end? The creator wants to put the most useful tip on the last slide "to reward people who stay". What would you advise?

<details>
<summary>View Answer</summary>

With 12 slides there are 11 swipes from the cover to the last slide, so the share who reach it is 0.92 to the power 11. Squaring repeatedly: 0.92 squared is 0.8464, to the fourth is about 0.7164, to the eighth about 0.5132, and multiplying by 0.92 cubed, which is about 0.7787, gives about 0.40. So about 40 percent reach the last slide. With 7 slides there are 6 swipes: 0.92 to the sixth is 0.7164 times 0.8464, about 0.61, so about 61 percent would reach the end. Cutting five slides raises the share who see the ending by half. On the plan to put the best tip last, I would advise against it. On the 12-slide version, 60 percent of the people who opened the carousel would never see the tip, and those who leave early are judging the carousel on the weaker material they did see, which makes them less likely to save or share it. The reward argument also points the wrong way: the readers most likely to stay are the ones already engaged, who need the least persuading. The better structure is to give the most useful tip early, by the second or third slide, so that every reader gets real value and has a reason to save, to let the later slides add to it, to use the penultimate slide for a summary worth keeping, and to keep the last slide for one ask. If the carousel has twelve slides only because there are twelve tips, it may be two carousels.

</details>

**Question 2.** A slide's text is 30 words, and the creator wants it on at most three lines on a 1080-pixel-wide slide with 70 pixels of margin each side. Using the font-fitting method of this chapter, explain what will happen and what to do. Why is shrinking the font below about 36 pixels not an acceptable fix?

<details>
<summary>View Answer</summary>

The usable width is 1080 minus 140, which is 940 pixels. The fitting method tries sizes from 96 pixels downwards and, at each, estimates how many characters fit on a line: 940 divided by 0.55 times the size. Thirty words of ordinary prose run to around 170 to 190 characters with spaces. At 36 pixels a line holds about 940 divided by 19.8, which is 47 characters, so three lines hold at most about 141 characters, and in practice fewer, because lines break between words. The text will not fit on three lines at any size down to 36 pixels, and the method will report that it cannot be done. What to do is reduce the words. Thirty words is a paragraph on a slide, and the point can almost always be made in fifteen to twenty: keep the instruction and the number, cut the explanation, or move the explanation onto a second slide. Alternatively allow more lines, which at a smaller but readable size is acceptable for a step-by-step slide, though not for a cover. Shrinking the type below about 36 pixels is not a fix because of the size at which the slide is seen. A 1080-pixel slide is shown on a phone at roughly a third of that width, so 36 designed pixels appears at about 13, which is near the limit of comfortable reading, and anything smaller is too small for many readers, especially in a feed where people do not stop to squint. Text that cannot be read has not been fitted, it has been hidden.

</details>

**Question 3.** An account posts two carousels and two Reels a week. Over a month the carousels average a reach of 4,000 with 150 saves and 35 shares, and the Reels a reach of 11,000 with 100 saves and 80 shares. The owner proposes dropping carousels because they "reach less than a third as many people". Compute the rates, and argue for or against the proposal.

<details>
<summary>View Answer</summary>

The carousels are saved at 150 divided by 4,000, which is 3.75 percent of reach, and shared at 35 divided by 4,000, which is 0.875 percent. The Reels are saved at 100 divided by 11,000, about 0.91 percent, and shared at 80 divided by 11,000, about 0.73 percent. The owner is nearly right about reach: 4,000 against 11,000 is a little over a third, 36 percent, not less than a third. Per person reached, though, the carousels are saved four times as often and shared slightly more often. In absolute numbers a carousel produces 150 saves against a Reel's 100, so more saves in total from far fewer people. I would argue against dropping them. The two formats do different jobs. Reels are better at being found by people who do not follow the account, which their reach reflects. Carousels are better at being kept, and a save means a reader expects to return, which is the strongest sign of lasting value and a reason to follow the account that made it. An account that posts only Reels will be seen more and kept less. A sounder plan is to use each for its job: Reels to reach new people, carousels to give them something worth saving, and links between them, such as a Reel showing a process that points to the carousel with the steps. The owner could also test the proposal properly instead of deciding on reach alone: watch follows per reach for both formats over a few months, since that is closer to what the account wants than reach.

</details>

@@starter
"""
Lab: Outline, Plan, Fit the Text, Read the Swipes, Compare Formats
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""

ARTICLE = """# Sharpen a chisel in ten minutes
A blunt chisel tears the wood. Most people blame the chisel. The problem is almost always the edge.
## Flatten the back
Rub the back of the chisel on the coarse stone for twenty strokes. A flat back is the foundation of a sharp edge.
## Set the bevel
Hold the bevel at twenty-five degrees. Lock your wrists and move from the shoulders. Do not rock the blade.
## Remove the burr
Turn the chisel over and take two light strokes on the back. The burr should come away as a thin wire.
## Strop on leather
Finish with ten pulls on an old leather belt, edge trailing. Test on end grain.
## The mistake to avoid
Rocking the blade rounds the edge. It ruined my first three chisels."""

STEP = "Hold the bevel at twenty-five degrees. Lock your wrists and move from the shoulders. Do not rock the blade."

POSTS = [
    {"format": "carousel", "reach": 4000, "saves": 160, "shares": 40},
    {"format": "carousel", "reach": 6000, "saves": 210, "shares": 66},
    {"format": "reel", "reach": 12000, "saves": 120, "shares": 96},
    {"format": "reel", "reach": 9000, "saves": 72, "shares": 45},
    {"format": "image", "reach": 3000, "saves": 15, "shares": 6},
]


def wrap_lines(text, size, width_px, char_width=0.55):
    """Provided helper: an estimate of how many lines the text needs at a font size of
    `size` pixels in a box `width_px` wide, assuming an average character is char_width times
    the size. Returns None if a single word is longer than a whole line."""
    per_line = int(width_px // (size * char_width))
    words = text.split()
    if any(len(word) > per_line for word in words):
        return None
    lines, current = 0, 0
    for word in words:
        if current and current + 1 + len(word) <= per_line:
            current += 1 + len(word)
        else:
            lines += 1 if current else 0
            current = len(word)
    return lines + (1 if current else 0)


# ---------------------------------------------------------------- Step 1
def outline_slides(markdown, max_words=30):
    """Turn a Markdown article into slides. A line starting with "#" starts a new slide whose
    heading is the line with the leading "#" characters and surrounding spaces removed.
    Non-blank lines after it, stripped, are its body. Lines before the first heading are ignored.
    For each slide: words = the body lines joined with spaces, split on white space;
        {"heading": ..., "text": the first max_words words joined with spaces,
         "cut": how many words were beyond max_words (0 if none)}
    Return the list of slides in order."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def carousel_plan(slides, cover, cta, limit=20):
    """Wrap content slides in a cover and an ending:
        [{"role": "cover", "heading": cover, "text": ""}]
        + one {"role": "content", "heading": ..., "text": ...} per slide, in order
        + [{"role": "cta", "heading": cta, "text": ""}]
    If the plan has more than `limit` slides, raise ValueError. Return the plan."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def fit_font(text, width_px, max_lines, max_size=96, min_size=36):
    """Try sizes from max_size down to min_size in steps of 4. Return
    {"size": size, "lines": lines} for the first size at which wrap_lines(text, size, width_px)
    is not None and is at most max_lines. If no size works, return None."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def swipe_report(reached):
    """reached[i] is how many readers reached slide i + 1. If the list is empty or the first
    count is 0, return None. Otherwise return
        {"curve": each count / reached[0], rounded to 3 places,
         "completion": the last value of the curve,
         "worst_after_slide": the slide number after which the most readers left, ignoring the
                              first swipe (from slide 1 to slide 2); among equal drops the
                              earliest; None if there are fewer than 3 slides}
    The drop after slide s (counting from 1) is reached[s - 1] - reached[s]."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def compare_formats(posts):
    """Pool posts by "format", adding up reach, saves, and shares, and counting posts. Return a
    dict, with formats in alphabetical order, mapping each format to
        {"saves_per_reach": saves / reach rounded to 4 places,
         "shares_per_reach": shares / reach rounded to 4 places,
         "posts": the number of posts}
    Use 0.0 for the rates if the reach is 0."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("slides :", outline_slides(ARTICLE))
    print("plan   :", carousel_plan([{"heading": "A", "text": "a"}], "Cover", "Save this"))
    print("font   :", fit_font(STEP, 940, 6))
    print("swipes :", swipe_report([1000, 820, 700, 640, 600, 560, 540, 500]))
    print("formats:", compare_formats(POSTS))

@@solution
"""
Lab solution: Outline, Plan, Fit the Text, Read the Swipes, Compare Formats
Standard library only.
"""

ARTICLE = """# Sharpen a chisel in ten minutes
A blunt chisel tears the wood. Most people blame the chisel. The problem is almost always the edge.
## Flatten the back
Rub the back of the chisel on the coarse stone for twenty strokes. A flat back is the foundation of a sharp edge.
## Set the bevel
Hold the bevel at twenty-five degrees. Lock your wrists and move from the shoulders. Do not rock the blade.
## Remove the burr
Turn the chisel over and take two light strokes on the back. The burr should come away as a thin wire.
## Strop on leather
Finish with ten pulls on an old leather belt, edge trailing. Test on end grain.
## The mistake to avoid
Rocking the blade rounds the edge. It ruined my first three chisels."""

STEP = "Hold the bevel at twenty-five degrees. Lock your wrists and move from the shoulders. Do not rock the blade."

POSTS = [
    {"format": "carousel", "reach": 4000, "saves": 160, "shares": 40},
    {"format": "carousel", "reach": 6000, "saves": 210, "shares": 66},
    {"format": "reel", "reach": 12000, "saves": 120, "shares": 96},
    {"format": "reel", "reach": 9000, "saves": 72, "shares": 45},
    {"format": "image", "reach": 3000, "saves": 15, "shares": 6},
]


def wrap_lines(text, size, width_px, char_width=0.55):
    """Provided helper: an estimate of how many lines the text needs at a font size of
    `size` pixels in a box `width_px` wide, assuming an average character is char_width times
    the size. Returns None if a single word is longer than a whole line."""
    per_line = int(width_px // (size * char_width))
    words = text.split()
    if any(len(word) > per_line for word in words):
        return None
    lines, current = 0, 0
    for word in words:
        if current and current + 1 + len(word) <= per_line:
            current += 1 + len(word)
        else:
            lines += 1 if current else 0
            current = len(word)
    return lines + (1 if current else 0)


# ---------------------------------------------------------------- Step 1
def outline_slides(markdown, max_words=30):
    """A well-headed article is most of a carousel already. The number of words cut is
    reported, so a person can see where the article said more than a slide can hold."""
    slides, heading, body = [], None, []

    def finish():
        if heading is not None:
            words = " ".join(body).split()
            slides.append({"heading": heading, "text": " ".join(words[:max_words]), "cut": max(0, len(words) - max_words)})

    for line in markdown.splitlines():
        if line.startswith("#"):
            finish()
            heading, body = line.lstrip("#").strip(), []
        elif line.strip():
            body.append(line.strip())
    finish()
    return slides


# ---------------------------------------------------------------- Step 2
def carousel_plan(slides, cover, cta, limit=20):
    """A cover that states the payoff, one idea per slide, and one ask, which is seen by the
    fewest readers and so must not be where the value is."""
    plan = [{"role": "cover", "heading": cover, "text": ""}]
    plan += [{"role": "content", "heading": slide["heading"], "text": slide["text"]} for slide in slides]
    plan.append({"role": "cta", "heading": cta, "text": ""})
    if len(plan) > limit:
        raise ValueError(f"{len(plan)} slides is over the limit of {limit}")
    return plan


# ---------------------------------------------------------------- Step 3
def fit_font(text, width_px, max_lines, max_size=96, min_size=36):
    """The largest size at which the text fits. If nothing fits above the floor, the answer
    is fewer words, not smaller type."""
    for size in range(max_size, min_size - 1, -4):
        lines = wrap_lines(text, size, width_px)
        if lines is not None and lines <= max_lines:
            return {"size": size, "lines": lines}
    return None


# ---------------------------------------------------------------- Step 4
def swipe_report(reached):
    """The first swipe always loses the most. The slide to fix is the later one that lost
    more than its neighbours."""
    if not reached or reached[0] == 0:
        return None
    curve = [round(count / reached[0], 3) for count in reached]
    drops = [reached[index] - reached[index + 1] for index in range(1, len(reached) - 1)]
    worst = (max(range(len(drops)), key=lambda index: drops[index]) + 2) if drops else None
    return {"curve": curve, "completion": curve[-1], "worst_after_slide": worst}


# ---------------------------------------------------------------- Step 5
def compare_formats(posts):
    """Reels to be found, carousels to be kept. Rates per person reached let formats with
    very different reach be compared."""
    totals = {}
    for post in posts:
        total = totals.setdefault(post["format"], {"reach": 0, "saves": 0, "shares": 0, "posts": 0})
        for key in ("reach", "saves", "shares"):
            total[key] += post[key]
        total["posts"] += 1
    return {name: {"saves_per_reach": round(total["saves"] / total["reach"], 4) if total["reach"] else 0.0,
                   "shares_per_reach": round(total["shares"] / total["reach"], 4) if total["reach"] else 0.0,
                   "posts": total["posts"]}
            for name, total in sorted(totals.items())}


if __name__ == "__main__":
    slides = outline_slides(ARTICLE)
    for slide in slides:
        print(slide["heading"], "|", len(slide["text"].split()), "words |", slide["cut"], "cut")

    plan = carousel_plan(slides[1:], "4 POUND CHISEL TO RAZOR SHARP", "Save this for your next sharpening session")
    print(len(plan), [slide["role"] for slide in plan])
    print(round(0.9 ** (len(plan) - 1), 2), round(0.95 ** (len(plan) - 1), 2))
    print([round(0.9 ** (n - 1), 3) for n in (5, 8, 10, 20)], [round(0.95 ** (n - 1), 3) for n in (5, 8, 10, 20)])

    print(fit_font("4 POUND CHISEL TO RAZOR SHARP", 940, 3), fit_font("4 POUND CHISEL TO RAZOR SHARP", 940, 1))
    print(fit_font(STEP, 940, 6), fit_font(STEP, 940, 4), fit_font(STEP, 940, 2))

    print(swipe_report([1000, 820, 700, 640, 600, 560, 540, 500]))
    print(compare_formats(POSTS))
    print(round(0.92 ** 11, 3), round(0.92 ** 6, 3), round(150 / 4000, 4), round(100 / 11000, 4), round(35 / 4000, 4), round(80 / 11000, 4))

@@step
{
  "stepNumber": 1,
  "title": "Turn an article into slides",
  "instruction": "Implement outline_slides(markdown, max_words). Go through the article line by line. A line that starts with '#' begins a new slide: its heading is the line with the leading '#' characters removed and the surrounding spaces stripped. Every non-blank line after it, stripped, belongs to that slide's body, until the next heading. Lines before the first heading are ignored. For each slide, join its body lines with spaces and split into words. Record a dict with 'heading'; 'text', the first max_words words joined with single spaces; and 'cut', the number of words beyond max_words, or 0. Return the slides in order. Run it on ARTICLE. This is the repurposing step from Section 2: a well-headed article is most of a carousel already. [MOD-6.9]",
  "hintConceptual": "An article with headings is already divided into pages. Each heading is the top of a slide, and the paragraph under it is what goes on the slide, trimmed to what fits.",
  "hintSyntax": "slides, heading, body = [], None, []\n\ndef finish():\n    if heading is not None:\n        words = \" \".join(body).split()\n        slides.append({\"heading\": heading, \"text\": \" \".join(words[:max_words]), \"cut\": max(0, len(words) - max_words)})\n\nfor line in markdown.splitlines():\n    if line.startswith(\"#\"):\n        finish()\n        heading, body = line.lstrip(\"#\").strip(), []\n    elif line.strip():\n        body.append(line.strip())\nfinish()\nreturn slides"
}
@@assert
_slides = outline_slides(ARTICLE)
assert _slides is not None and [slide["heading"] for slide in _slides] == ["Sharpen a chisel in ten minutes", "Flatten the back", "Set the bevel", "Remove the burr", "Strop on leather", "The mistake to avoid"], f"Six slides, one per heading, got {_slides}"
assert [len(slide["text"].split()) for slide in _slides] == [18, 23, 19, 21, 15, 12] and all(slide["cut"] == 0 for slide in _slides), "Every section fits in 30 words, so nothing is cut"
assert _slides[2]["text"] == STEP, "The slide text is the section's text, joined with single spaces"
_short = outline_slides(ARTICLE, max_words=10)
assert _short[1]["text"] == "Rub the back of the chisel on the coarse stone" and _short[1]["cut"] == 13, "Text over the limit is cut, and the number of words cut is recorded"
assert outline_slides("Intro text with no heading.\n# Only\nOne line.\n\n   \nTwo line.") == [{"heading": "Only", "text": "One line. Two line.", "cut": 0}], "Lines before the first heading are ignored, and blank lines are skipped"
assert outline_slides("### Deep heading  \n# Next\n") == [{"heading": "Deep heading", "text": "", "cut": 0}, {"heading": "Next", "text": "", "cut": 0}], "Any number of '#' characters starts a slide, and a heading with no body gives empty text"
assert outline_slides("") == [] and outline_slides("No headings at all.") == [], "No headings, no slides"
print("Step 1 passed: the article's six sections become six slides of 12 to 23 words.")

@@step
{
  "stepNumber": 2,
  "title": "Add a cover and an ending",
  "instruction": "Implement carousel_plan(slides, cover, cta, limit). Build a list starting with a dict whose 'role' is 'cover', 'heading' is the cover text, and 'text' is empty. Add one dict per slide with 'role' set to 'content' and the slide's 'heading' and 'text'. End with a dict whose 'role' is 'cta', 'heading' is the call to action, and 'text' is empty. If the plan has more than limit slides, raise ValueError. Return the plan. Plan a carousel from the five steps of the article, leaving out its title section. This is the structure from Section 1: a cover with the payoff, one idea per slide, and one ask. [MOD-6.9]",
  "hintConceptual": "A booklet has a front cover, its pages, and a back cover. The covers are not pages of the content: they are what makes someone open it, and what they do when they close it.",
  "hintSyntax": "plan = [{\"role\": \"cover\", \"heading\": cover, \"text\": \"\"}]\nplan += [{\"role\": \"content\", \"heading\": slide[\"heading\"], \"text\": slide[\"text\"]} for slide in slides]\nplan.append({\"role\": \"cta\", \"heading\": cta, \"text\": \"\"})\nif len(plan) > limit:\n    raise ValueError(f\"{len(plan)} slides is over the limit of {limit}\")\nreturn plan"
}
@@assert
_steps = [{"heading": heading, "text": "t"} for heading in ("Flatten the back", "Set the bevel", "Remove the burr", "Strop on leather", "The mistake to avoid")]
_plan = carousel_plan(_steps, "4 POUND CHISEL TO RAZOR SHARP", "Save this for your next sharpening session")
assert _plan is not None and len(_plan) == 7 and [slide["role"] for slide in _plan] == ["cover", "content", "content", "content", "content", "content", "cta"], f"A cover, five steps, and an ask, got {_plan}"
assert _plan[0] == {"role": "cover", "heading": "4 POUND CHISEL TO RAZOR SHARP", "text": ""} and _plan[-1] == {"role": "cta", "heading": "Save this for your next sharpening session", "text": ""}, "The cover and the ask have headings and no body"
assert _plan[1] == {"role": "content", "heading": "Flatten the back", "text": "t"}, "Content slides keep their heading and text, and only those keys"
assert carousel_plan([], "C", "A") == [{"role": "cover", "heading": "C", "text": ""}, {"role": "cta", "heading": "A", "text": ""}], "With no content there are still a cover and an ask"
assert len(carousel_plan([{"heading": "h", "text": "t"}] * 18, "C", "A")) == 20, "Eighteen content slides make exactly twenty, which is allowed"
def _refuses(count, limit=20):
    try:
        carousel_plan([{"heading": "h", "text": "t"}] * count, "C", "A", limit=limit)
    except ValueError:
        return True
    return False
assert _refuses(19) and _refuses(9, limit=10) and not _refuses(8, limit=10), "A plan over the limit raises ValueError, and the limit is an argument"
print("Step 2 passed: five steps become a seven-slide carousel with a cover and one ask.")

@@step
{
  "stepNumber": 3,
  "title": "Make the text fit",
  "instruction": "Implement fit_font(text, width_px, max_lines, max_size, min_size). Try font sizes from max_size down to min_size inclusive, in steps of 4. For each size, ask the provided helper wrap_lines(text, size, width_px) how many lines the text needs; it returns None if a single word cannot fit on a line. Return a dict with 'size' and 'lines' for the first size, which is the largest, where the result is not None and is at most max_lines. If no size works, return None. Fit the cover text and the bevel step into a width of 940 pixels with various line limits. This is the search for legible type from Section 2: if nothing fits above the floor, the answer is fewer words. [MOD-6.9]",
  "hintConceptual": "A sign-writer starts with the biggest letters the board will take and works down until the words fit. If they only fit in letters too small to read from the road, the sign needs fewer words.",
  "hintSyntax": "for size in range(max_size, min_size - 1, -4):\n    lines = wrap_lines(text, size, width_px)\n    if lines is not None and lines <= max_lines:\n        return {\"size\": size, \"lines\": lines}\nreturn None"
}
@@assert
assert fit_font("4 POUND CHISEL TO RAZOR SHARP", 940, 3) == {"size": 96, "lines": 2}, f"The cover fits at the largest size on two lines, got {fit_font('4 POUND CHISEL TO RAZOR SHARP', 940, 3)}"
assert fit_font("4 POUND CHISEL TO RAZOR SHARP", 940, 1) == {"size": 56, "lines": 1}, "Forced onto one line, the cover needs 56 pixels"
assert fit_font(STEP, 940, 6) == {"size": 84, "lines": 6} and fit_font(STEP, 940, 4) == {"size": 56, "lines": 4}, "More lines allow larger type"
assert fit_font(STEP, 940, 2) is None, "On two lines the step cannot fit above the floor of 36 pixels"
assert fit_font(STEP, 940, 2, min_size=20) == {"size": 28, "lines": 2}, "Only by going below the floor would it fit, which the default forbids"
assert fit_font("Supercalifragilisticexpialidocious", 400, 3) is None, "A word too long for a line at every size cannot be fitted"
assert fit_font("Hi", 940, 1, max_size=100, min_size=60) == {"size": 100, "lines": 1}, "The size range is an argument"
assert fit_font("", 940, 1) == {"size": 96, "lines": 0}, "Empty text fits at the largest size, on no lines"
print("Step 3 passed: the cover fits at 96 pixels, and the step will not go on two lines at a readable size.")

@@step
{
  "stepNumber": 4,
  "title": "Read how far people swiped",
  "instruction": "Implement swipe_report(reached). The list gives how many readers reached each slide, starting with the cover. If it is empty or the first count is 0, return None. The curve is each count divided by the first, rounded to 3 decimal places. The completion is the last value of the curve. For the worst drop, ignore the first swipe, from slide 1 to slide 2, which always loses the most; among the later swipes, find the one where the most readers left, and report the number of the slide they left after, counting slides from 1. Among equal drops, take the earliest. If there are fewer than 3 slides, the worst drop is None. Return a dict with 'curve', 'completion', and 'worst_after_slide'. This is the attrition reading from Section 2. [MOD-6.9]",
  "hintConceptual": "A guided tour loses some visitors at every room. The first room always loses the most. The room worth looking at is the later one where more people slipped away than at the rooms either side of it.",
  "hintSyntax": "if not reached or reached[0] == 0:\n    return None\ncurve = [round(count / reached[0], 3) for count in reached]\ndrops = [reached[index] - reached[index + 1] for index in range(1, len(reached) - 1)]\nworst = (max(range(len(drops)), key=lambda index: drops[index]) + 2) if drops else None\nreturn {\"curve\": curve, \"completion\": curve[-1], \"worst_after_slide\": worst}"
}
@@assert
_report = swipe_report([1000, 820, 700, 640, 600, 560, 540, 500])
assert _report == {"curve": [1.0, 0.82, 0.7, 0.64, 0.6, 0.56, 0.54, 0.5], "completion": 0.5, "worst_after_slide": 2}, f"Half reached the end, and slide 2 lost the most after the first swipe, got {_report}"
assert swipe_report([500, 300, 290, 200, 190])["worst_after_slide"] == 3, "The first swipe's loss of 200 is ignored, and the 90 lost after slide 3 is the worst"
assert swipe_report([100, 90, 80, 70])["worst_after_slide"] == 2, "Equal drops report the earliest"
assert swipe_report([100, 60]) == {"curve": [1.0, 0.6], "completion": 0.6, "worst_after_slide": None}, "With two slides there is no later swipe to compare"
assert swipe_report([300, 200, 100]) == {"curve": [1.0, 0.667, 0.333], "completion": 0.333, "worst_after_slide": 2}, "The curve is rounded to 3 places"
assert swipe_report([]) is None and swipe_report([0, 0, 0]) is None, "No data, or no readers, gives no report"
assert swipe_report([100]) == {"curve": [1.0], "completion": 1.0, "worst_after_slide": None}, "A single slide is complete by definition"
print("Step 4 passed: half the readers finished, and slide 2 is the one to fix.")

@@step
{
  "stepNumber": 5,
  "title": "Compare formats by what people keep",
  "instruction": "Implement compare_formats(posts). Each post has a 'format', a 'reach', and counts of 'saves' and 'shares'. Pool the posts by format, adding up the reach, saves, and shares, and counting the posts. Return a dict with the formats in alphabetical order, mapping each to a dict with 'saves_per_reach' and 'shares_per_reach', each the pooled count divided by the pooled reach and rounded to 4 decimal places, or 0.0 if the reach is 0; and 'posts', the number of posts. Run it on POSTS. This is the comparison of formats from Section 2: carousels are built to be saved. [MOD-6.9]",
  "hintConceptual": "A library counts how often each kind of book is borrowed, and divides by how many were on the shelf. The kind that is borrowed most per copy is the kind readers want to keep.",
  "hintSyntax": "totals = {}\nfor post in posts:\n    total = totals.setdefault(post[\"format\"], {\"reach\": 0, \"saves\": 0, \"shares\": 0, \"posts\": 0})\n    for key in (\"reach\", \"saves\", \"shares\"):\n        total[key] += post[key]\n    total[\"posts\"] += 1\nreturn {name: {\"saves_per_reach\": round(total[\"saves\"] / total[\"reach\"], 4) if total[\"reach\"] else 0.0,\n               \"shares_per_reach\": round(total[\"shares\"] / total[\"reach\"], 4) if total[\"reach\"] else 0.0,\n               \"posts\": total[\"posts\"]}\n        for name, total in sorted(totals.items())}"
}
@@assert
_formats = compare_formats(POSTS)
assert _formats == {"carousel": {"saves_per_reach": 0.037, "shares_per_reach": 0.0106, "posts": 2}, "image": {"saves_per_reach": 0.005, "shares_per_reach": 0.002, "posts": 1}, "reel": {"saves_per_reach": 0.0091, "shares_per_reach": 0.0067, "posts": 2}}, f"Carousels are saved at 3.7 percent of reach, got {_formats}"
assert list(_formats) == ["carousel", "image", "reel"], "Formats are in alphabetical order"
assert _formats["carousel"]["saves_per_reach"] > 4 * _formats["reel"]["saves_per_reach"], "Carousels are saved at more than four times the rate of Reels"
_recall = compare_formats([{"format": "carousel", "reach": 4000, "saves": 150, "shares": 35}, {"format": "reel", "reach": 11000, "saves": 100, "shares": 80}])
assert _recall == {"carousel": {"saves_per_reach": 0.0375, "shares_per_reach": 0.0088, "posts": 1}, "reel": {"saves_per_reach": 0.0091, "shares_per_reach": 0.0073, "posts": 1}}, "The numbers from the third recall question"
assert compare_formats([{"format": "a", "reach": 1000, "saves": 10, "shares": 0}, {"format": "a", "reach": 9000, "saves": 10, "shares": 0}])["a"]["saves_per_reach"] == 0.002, "Posts are pooled before dividing: 20 saves on 10,000 reach, not the average of two rates"
assert compare_formats([{"format": "x", "reach": 0, "saves": 0, "shares": 0}]) == {"x": {"saves_per_reach": 0.0, "shares_per_reach": 0.0, "posts": 1}}, "No reach gives zero rates and no division by zero"
assert compare_formats([]) == {}, "No posts, no formats"
print("Step 5 passed: carousels reach fewer people than Reels and are kept four times as often.")
