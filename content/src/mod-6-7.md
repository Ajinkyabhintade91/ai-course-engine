@@meta
{
  "moduleId": "MOD-6.7",
  "slug": "mod-6-7",
  "unitId": "UNIT-6",
  "unitTitle": "Unit 6: AI Content Creation Masterclass",
  "title": "AI Thumbnails",
  "difficulty": "Foundational",
  "estimatedMinutes": 85,
  "citations": [
    { "title": "Add video thumbnails on YouTube", "source": "YouTube Help", "url": "https://support.google.com/youtube/answer/72431" },
    { "title": "Test and compare thumbnails and titles", "source": "YouTube Help", "url": "https://support.google.com/youtube/answer/13861714" },
    { "title": "Impressions and click-through rate FAQs", "source": "YouTube Help", "url": "https://support.google.com/youtube/answer/7628154" },
    { "title": "Spam, deceptive practices, and scams policies", "source": "YouTube Help", "url": "https://support.google.com/youtube/answer/2801973" },
    { "title": "Understanding Success Criterion 1.4.3: Contrast (Minimum)", "source": "W3C Web Accessibility Initiative", "url": "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" },
    { "title": "Web Content Accessibility Guidelines 2.1: contrast ratio and relative luminance", "source": "W3C", "url": "https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio" }
  ],
  "videoLibrary": [
    {
      "id": "VID-6.7-1",
      "title": "Create Thumbnails That (actually) Get Clicks",
      "creator": "Meredith Marsh",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=sTltZgwwc4c",
      "timingInstruction": "Watch after reading Section 1, before the measurements in Section 2",
      "keyTakeaway": "A creator's account of what makes a thumbnail earn a click without resorting to arrows and exaggerated faces."
    },
    {
      "id": "VID-6.7-2",
      "title": "Thumbnails That Get MORE Clicks (Full Tutorial)",
      "creator": "Nari Media",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=QT5COtZC_hQ",
      "timingInstruction": "Watch after reading Section 2 (contrast, text, and composition), to see a thumbnail built step by step",
      "keyTakeaway": "A full design walkthrough, from concept to finished thumbnail, showing the choices about subject, text, and contrast."
    },
    {
      "id": "VID-6.7-3",
      "title": "Smart Thumbnails and Video Titles - Boosting Click-Through Rates with AI",
      "creator": "Mike Russell",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=WA31S0KWvK0",
      "timingInstruction": "Watch after Section 2's part on the title and thumbnail as a pair",
      "keyTakeaway": "Using AI to draft thumbnails and titles aimed at click-through rate."
    },
    {
      "id": "VID-6.7-4",
      "title": "Create and Publish Content for Your Audience with AI",
      "creator": "Adobe",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/create-and-publish-content-for-your-audience-with-ai",
      "timingInstruction": "Take after completing the lab, for practice designing and publishing visual content with AI design tools",
      "keyTakeaway": "Hands-on work producing and publishing designed content with generative tools, including the compositing steps this chapter describes."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Contrast, Size, Tests, Sample Size, and a Thumbnail Check",
    "context": "A woodworking channel makes its thumbnails with AI image tools and argues about which ones work. You will build the contrast calculation that says whether text can be read, a check of how large that text is when the thumbnail is shown small, a reading of a thumbnail test by watch time as well as clicks, the number of impressions needed to trust a difference, and a checklist that a thumbnail must pass before upload.",
    "language": "python"
  }
}

@@reading
# AI Thumbnails

A video is watched only if it is clicked, and it is clicked, or not, on the strength of a small picture and a line of text. The thumbnail and the title are the first two things a viewer sees and, for most of the people they are shown to, the last.

AI has made thumbnails quick to produce. An image model can generate a subject, remove a background, set a headline, and offer ten variations before a designer has opened a file. That has shifted the problem. Making a thumbnail is easy. Knowing whether it is any good is the skill. This chapter covers what makes a thumbnail work, in terms that can be measured, how to build one with AI tools without the usual flaws, and how to test thumbnails properly, which the platform now lets you do.

## 1. First-Principles Mental Model & Intuition

### A book cover the size of a stamp

In a shop, a book has a whole cover to persuade you. On a phone, a video has a picture about the width of a thumb, in a column of other pictures, seen for a fraction of a second while scrolling.

Three questions are settled in that fraction of a second, in this order.

1. **Can I see what this is?** If the picture does not resolve into a subject at a glance, it is passed over.
2. **Is it for me?** The subject and the few words tell the viewer whether this is their kind of thing.
3. **Do I want to know more?** Something is left open: a result, a contrast, a question.

Everything in thumbnail design serves one of those. Contrast and a single clear subject serve the first. The topic, shown and not described, serves the second. The gap between what the picture shows and what the video will explain serves the third.

### The thumbnail and the title are one thing

```text
   +---------------------------+
   |                           |     Title:  I Restored a Car Boot
   |   [ a rusty chisel beside |             Sale Bargain to Razor Sharp
   |     a gleaming one ]      |
   |                           |     The picture shows the result.
   |      4 POUND CHISEL       |     The text adds a fact the picture cannot.
   +---------------------------+     The title says what happened.

   Each of the three says something the other two do not.
```

A viewer reads the picture, then its text, then the title, as a single message. A thumbnail whose text repeats the title has used its few words to say nothing new.

### The promise

The thumbnail and title are a promise, and the video has to keep it. Module 6.6 made this point from the other side: the opening of a script must match what the viewer clicked on. A picture that earns the click and a video that does not deliver produces a viewer who leaves in ten seconds. The platform measures that, as Section 2 shows, and it counts against the video.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### What the platform asks for

At the time of writing (November 2026), YouTube's requirements for a custom thumbnail are these.

| Property | Requirement |
|---|---|
| Shape | 16:9 for ordinary videos |
| Size | A minimum width of 640 pixels. The recommended size has risen with screens, and is now far larger than the old 1280 by 720 |
| Format | JPG or PNG |
| File size | Up to 2 MB when uploading from a phone, and much more from a computer |
| Content | Must not be misleading. The platform's policies prohibit maliciously misleading thumbnails |

Design at 1280 by 720 or larger, in 16:9, and keep the file under 2 MB so that it uploads from anywhere.

### What makes a thumbnail work

Hard evidence on thumbnail design is thinner than the confident advice online suggests. Most published "rules" come from blog posts without data. What follows is the part that rests on something firmer: how vision works, what the platform says, and what can be measured.

| Principle | Reason |
|---|---|
| **One subject** | A small picture can show one thing clearly, or several things not at all |
| **High contrast** | Between subject and background, and between text and whatever is behind it |
| **Few words, large** | Three or four words at most. The thumbnail will be shown very small |
| **A face, where it is honest** | People look at faces and read emotion fast. Use a real expression connected to the video |
| **Something left open** | A before and after, an unexpected object, a result without its explanation |
| **Different from its neighbours** | It appears in a column of others. If they are all red and yellow, be something else |
| **Recognisably yours** | A consistent treatment tells returning viewers it is you |

### Contrast, measured

Whether text can be read against its background is not a matter of taste. The Web Content Accessibility Guidelines define a **contrast ratio** between two colours, based on how bright each appears to the eye.

First, each colour's **relative luminance**. For red, green, and blue values between 0 and 255, each channel is scaled to between 0 and 1 and adjusted for the way screens encode brightness:

$$
c_{\text{lin}} = \begin{cases} c / 12.92 & \text{if } c \le 0.03928 \\ \left( \dfrac{c + 0.055}{1.055} \right)^{2.4} & \text{otherwise} \end{cases}
$$

Then the three are combined with weights that reflect the eye's sensitivity, which is greatest for green:

$$
L = 0.2126\,R_{\text{lin}} + 0.7152\,G_{\text{lin}} + 0.0722\,B_{\text{lin}}
$$

The contrast ratio between a lighter colour with luminance $L_{1}$ and a darker one with $L_{2}$ is

$$
\text{ratio} = \frac{L_{1} + 0.05}{L_{2} + 0.05}
$$

It runs from 1, for identical colours, to 21, for white on black. The guidelines require at least 4.5 for ordinary text and at least 3 for large text.

| Pair | Ratio | Verdict |
|---|---|---|
| White on black | 21.0 | Maximum |
| Yellow on black | 15.6 | Excellent |
| Yellow on navy | 11.9 | Excellent |
| White on red | 4.9 | Passes |
| White on mid grey | 2.96 | Fails, just under the threshold for large text |
| White on sky blue | 1.7 | Unreadable |
| White on yellow | 1.4 | Unreadable |

The standard was written for web pages, and a thumbnail is not a web page, so treat the thresholds as a floor. The lesson of the table holds anywhere: white text on a bright sky, a favourite of generated images, cannot be read. The cure is a dark outline, a shadow, or a band of colour behind the words, so that the text is measured against that and not against the picture.

### Size, measured

A thumbnail is designed large and seen small. If a design $W$ pixels wide is shown at $w$ pixels, everything in it shrinks by $w / W$. Text that is $h$ pixels tall in the design appears at

$$
h \times \frac{w}{W}
$$

A thumbnail in a list of suggested videos may be shown about 168 pixels wide. From a 1280-pixel design, that is a factor of about 0.13. Lettering 60 pixels tall in the design becomes 8 pixels on screen, which is too small to read. To appear at 12 pixels, a common floor for legible text, it must be at least 92 pixels tall in the design, 91.4 exactly.

The practical test needs no arithmetic: shrink the thumbnail to the size of a postage stamp on your own screen, and see whether you can still read it and tell what it shows.

### Click-through rate, and why it is not the goal

The platform reports an **impressions click-through rate**: of the times the thumbnail was shown, the share that led to a view.

$$
\text{CTR} = \frac{\text{clicks}}{\text{impressions}}
$$

YouTube's own help pages say that half of all channels and videos have a rate between 2 and 10 percent, and that new videos and small channels vary more widely.

It is tempting to treat the click-through rate as the score. The platform does not. Its **Test and compare** feature, which lets a creator upload up to three thumbnails, titles, or combinations for one video and shows each to part of the audience, picks its winner by **watch time**, not clicks. The reason is the promise. A misleading thumbnail wins clicks and loses the viewers within seconds. A thumbnail that attracts fewer people who then stay is worth more, to the viewer and to the platform's recommendations.

So the measure to compare thumbnails on is watch time per impression:

$$
\frac{\text{watch time}}{\text{impressions}} = \text{CTR} \times \text{average watch time per view}
$$

A thumbnail can raise the first factor and lower the second. Only the product matters.

### How many impressions make a result

Suppose one thumbnail has a click-through rate of 4 percent and another 5 percent. Is the second better, or is that chance?

To detect a real difference between two rates $p_{1}$ and $p_{2}$ with the usual standards, a 5 percent risk of a false alarm and an 80 percent chance of detecting a true difference, each thumbnail needs about

$$
n = \frac{15.68 \; \bar{p}\,(1 - \bar{p})}{(p_{1} - p_{2})^{2}} \quad \text{impressions, where } \bar{p} = \frac{p_{1} + p_{2}}{2}
$$

For 4 percent against 5 percent that is about 6,700 impressions each. For 4 against 6 percent it is about 1,900. For 5 against 5.5 percent it is over 31,000.

This is the same reasoning about margins of error that Modules 5.7 and 5.9 applied to prompts, and it has the same moral. Large differences show up quickly. Small ones need more traffic than most videos get in their first days. A channel that swaps thumbnails after 300 impressions each and declares a winner is reading noise.

### Making thumbnails with AI

AI tools help at four points.

| Step | Tool | Watch for |
|---|---|---|
| **Concepts** | A chat model, given the title and the video's promise, for ten ideas | Ideas that describe a mood and not a picture |
| **The image** | An image model for the subject or the background, using the prompting of Module 5.11 | Generic results. A real frame from your video often beats a generated scene |
| **Cut-outs and clean-up** | Background removal, plus the inpainting and extension of Module 6.2 | Halos round hair and edges |
| **Text and layout** | A design tool, or a model that renders text well | Misspelt or garbled lettering |

Three cautions are specific to thumbnails. **Your face must stay your face.** Enhancement and regeneration drift towards a generic attractive person, and a viewer who knows you will sense that something is off. **Set the text yourself** when it matters. Generated lettering is much improved and still worth reading letter by letter. **Do not show what the video does not contain.** A generated explosion on a video with no explosion is the misleading thumbnail that the platform's policy and its watch-time test both punish.

The platform also offers its own AI assistance for thumbnails inside its creator tools. Features of this kind change often. The principles do not.

### Complexity

Each calculation here is constant time or linear in a handful of values. The scarce resource is impressions: a test consumes thousands of them per variant before it can say anything.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, contrast.

```python
import math

def relative_luminance(rgb):
    def linear(channel):
        c = channel / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    red, green, blue = (linear(value) for value in rgb)
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue

def contrast_ratio(colour_a, colour_b):
    first, second = relative_luminance(colour_a), relative_luminance(colour_b)
    return round((max(first, second) + 0.05) / (min(first, second) + 0.05), 2)

WHITE, BLACK, YELLOW, RED = (255, 255, 255), (0, 0, 0), (255, 221, 0), (220, 30, 30)
GREY, NAVY, SKY = (150, 150, 150), (10, 30, 80), (135, 206, 235)
print(contrast_ratio(WHITE, BLACK), contrast_ratio(YELLOW, BLACK), contrast_ratio(YELLOW, NAVY))
print(contrast_ratio(WHITE, RED), contrast_ratio(WHITE, GREY), contrast_ratio(WHITE, SKY), contrast_ratio(WHITE, YELLOW))
print(round(relative_luminance(YELLOW), 3), round(relative_luminance((128, 128, 128)), 3))
```

- **`relative_luminance` is the two formulas of Section 2.** Each channel is scaled, linearised, and weighted. Green counts for most and blue for least.
- **`contrast_ratio` puts the lighter colour on top.** It does not matter which colour is the text and which the background.
- **White on black is 21.0, the maximum.** Yellow on black is 15.59 and yellow on navy 11.86, both far above any threshold.
- **White on red is 4.94.** It passes the 4.5 threshold for ordinary text, with little to spare.
- **White on mid grey is 2.96, white on sky blue 1.74, and white on yellow 1.35.** None is readable at small sizes. The last two are the commonest mistakes in thumbnails: white words over a bright generated background.
- **Yellow's luminance is 0.73.** It is almost as bright as white, which is why yellow text needs a dark background and fails on a light one.
- **A mid grey of 128 has a luminance of only 0.216.** Brightness as numbers and brightness as seen are different scales, which is why the formula exists.

Next, how big the text is when the thumbnail is shown small.

```python
def text_at_size(text_px, design_width, display_width):
    return round(text_px * display_width / design_width, 1)

for text_px in (60, 120, 200):
    print(text_px, text_at_size(text_px, 1280, 320), text_at_size(text_px, 1280, 168))
print(math.ceil(12 * 1280 / 168))
```

- **The function scales the text by the same factor as the picture.** Display width divided by design width.
- **Lettering 60 pixels tall becomes 15 pixels at a width of 320, and 7.9 at 168.** Readable in a large feed, and lost in a list of suggestions.
- **At 120 pixels it is 30 and 15.8.** Comfortable at both sizes.
- **At 200 pixels it is 50 and 26.2.** That is a three-word headline filling much of the frame, which is what the thumbnails that work tend to look like.
- **For 12 pixels at the small size, the design needs 92 pixels.** That is about an eighth of the height of a 720-pixel thumbnail, for each line of text. It is why there is room for only a few words.

Then, reading a test.

```python
def compare_variants(variants):
    rows = []
    for name, numbers in variants.items():
        impressions = numbers["impressions"]
        rows.append({"name": name,
                     "ctr": round(numbers["clicks"] / impressions, 4) if impressions else 0.0,
                     "minutes_per_1000": round(numbers["watch_minutes"] / impressions * 1000, 1) if impressions else 0.0})
    total = sum(row["minutes_per_1000"] for row in rows)
    for row in rows:
        row["share"] = round(row["minutes_per_1000"] / total, 3) if total else 0.0
    return sorted(rows, key=lambda row: (-row["share"], row["name"]))

TEST = {
    "shock face": {"impressions": 5000, "clicks": 300, "watch_minutes": 450},
    "clean result": {"impressions": 5000, "clicks": 250, "watch_minutes": 800},
    "tool close-up": {"impressions": 5000, "clicks": 200, "watch_minutes": 560},
}
for row in compare_variants(TEST):
    print(row)
```

- **Each variant has impressions, clicks, and minutes watched.** The function computes the click-through rate and the watch time per thousand impressions.
- **The share is each variant's part of the total watch time per impression.** It is the kind of figure the platform's test reports.
- **The "shock face" thumbnail has the highest click-through rate, 6 percent, and comes last.** Its viewers watched an average of a minute and a half, because the video did not contain the drama the face promised. Its share of watch time is 24.9 percent.
- **The "clean result" thumbnail has a 5 percent rate and comes first, with 44.2 percent.** Fewer people clicked, and they stayed for more than three minutes each.
- **The tool close-up, at 4 percent, still beats the shock face.** A lower click rate with a kept promise outperformed a higher one without.
- **Ranked by clicks, the shock face would come first, where by watch time it comes last.** This is the single most important thing to understand about testing thumbnails.

Finally, how much traffic a test needs, and a check before upload.

```python
def impressions_needed(p1, p2):
    if p1 == p2:
        raise ValueError("the two rates are equal")
    mean = (p1 + p2) / 2
    return math.ceil(15.68 * mean * (1 - mean) / (p1 - p2) ** 2)

def thumbnail_lint(spec):
    problems = []
    if spec["width"] * 9 != spec["height"] * 16:
        problems.append("not-16:9")
    if spec["width"] < 1280:
        problems.append("too-small")
    if spec["file_mb"] > 2:
        problems.append("file-too-large")
    words = [word.strip(".,!?").lower() for word in spec["text"].split()]
    if len(words) > 4:
        problems.append("too-many-words")
    title_words = {word.strip(".,!?").lower() for word in spec["title"].split()}
    if words and sum(1 for word in words if word in title_words) * 2 > len(words):
        problems.append("repeats-title")
    if spec["contrast"] < 4.5:
        problems.append("low-contrast")
    if spec["text_px"] * 168 / spec["width"] < 12:
        problems.append("text-too-small")
    return problems

print(impressions_needed(0.04, 0.05), impressions_needed(0.04, 0.06), impressions_needed(0.05, 0.055))
GOOD = {"width": 1280, "height": 720, "file_mb": 0.8, "text": "4 POUND CHISEL",
        "title": "I Restored a Car Boot Sale Bargain to Razor Sharp", "contrast": 15.59, "text_px": 140}
WEAK = {"width": 1000, "height": 1000, "file_mb": 3.5, "text": "How to sharpen a chisel in ten minutes",
        "title": "How to Sharpen a Chisel in Ten Minutes", "contrast": 1.74, "text_px": 40}
print(thumbnail_lint(GOOD))
print(thumbnail_lint(WEAK))
```

- **`impressions_needed` is the sample-size formula from Section 2.** It returns the impressions each variant needs.
- **Telling 4 percent from 5 percent takes 6,739 impressions each.** Telling 4 from 6 takes 1,863. Telling 5 from 5.5 takes 31,200.
- **Halving the difference roughly quadruples the traffic needed.** The difference is squared in the formula. This is why only large effects are worth testing on a small channel.
- **`thumbnail_lint` runs seven checks.** Shape, size, file size, word count, overlap with the title, contrast, and the size of the text when shown 168 pixels wide.
- **The good thumbnail passes all seven.** Three words that do not appear in the title, yellow on black, lettering 140 pixels tall.
- **The weak one fails all seven.** It is square and small, the file is too large, it has eight words, every one of them is in the title, the text is white on sky blue, and at 40 pixels it would appear under 7 pixels tall.
- **Passing is a floor.** The checks say the thumbnail can be read. They do not say anyone will want to click it.

**Complexity.** Every function does a fixed amount of work, or one pass over a few values.

### A thumbnail brief

```text
VIDEO PROMISE:  [what the viewer gets, in one sentence]
TITLE:          [the title, which the thumbnail text must not repeat]
SUBJECT:        [the one thing in the picture]         FACE: [whose, and which real expression]
OPEN QUESTION:  [what the picture makes the viewer want to know]
TEXT:           [at most 4 words]     COLOURS: [text on background, contrast ratio]
SOURCE:         [frame from the video / photograph / generated image]
CHECKED AT:     [stamp size, in a row of competitors' thumbnails]
VARIANTS:       [A: ___   B: ___   C: ___   each a different idea, not a different shade]
TEST:           [run until each has enough impressions; judge by watch time]
```

### Before upload

| Check | Pass |
|---|---|
| Shrunk to stamp size | The subject and the words are still clear |
| Beside five competing thumbnails | It does not disappear among them |
| Text | Four words or fewer, none repeating the title, spelt correctly |
| Contrast | At least 4.5 between the text and what is directly behind it |
| The face | Still looks like the person |
| Honesty | Everything shown is in the video |
| File | 16:9, at least 1280 wide, under 2 MB |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Designing at full size.** A thumbnail that looks striking filling a monitor is mud at the size it is seen. Check it small before anything else.

**Repeating the title.** Eight words of title set in the thumbnail is the commonest waste. The thumbnail's words should add a fact, a number, or a reaction.

**White text on a bright picture.** Generated backgrounds are often light and busy. Put an outline, a shadow, or a solid band behind the words.

**Too much in the frame.** Three people, a logo, an arrow, a circle, and a headline compete, and none wins. Choose the subject and remove the rest.

**The generic AI look.** Glossy, symmetrical, over-lit images are now instantly recognisable and increasingly scrolled past. A real frame from the video, cut out and cleaned up, usually does better than a generated scene.

**A face that is no longer you.** Upscalers and "enhance" features move a face towards an average. Compare it with the original, and keep the real one.

**Garbled lettering.** Generated text can contain a wrong letter that the eye skips. Read it character by character, or set the text in a design tool.

**Clickbait.** A thumbnail that promises what the video lacks raises the click-through rate and lowers watch time, and the platform's test and its recommendations both use watch time. It also risks a policy strike, and it teaches viewers to distrust the next one.

**Judging by click-through rate alone.** The highest rate in the lab's example was the worst thumbnail. Look at watch time per impression.

**Calling a test early.** A few hundred impressions cannot separate 4 percent from 5. Let the platform's test run its course, and for small differences accept that you will not know.

**Testing shades.** Three versions that differ in the colour of an outline will not differ measurably. Test three different ideas.

**Changing thumbnail and title together, by hand.** If both are swapped at once outside a proper test, a change in results cannot be traced to either. Change one, or use the test feature, which handles combinations.

**Comparing with other channels.** A 3 percent rate may be excellent for a broad audience and poor for a loyal one. Compare a video with your own earlier videos from the same kind of traffic.

**No consistent style.** Thumbnails with a recognisable treatment let returning viewers find you in a feed. Agree a small set of fonts, colours, and layouts, and vary the content within it.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A thumbnail is seen small, for an instant, among others, and must show what the video is, who it is for, and leave something open. It works together with the title, so its few words should add to the title and not repeat it, and both are a promise the video must keep. Legibility can be measured: the contrast ratio $(L_{1} + 0.05)/(L_{2} + 0.05)$ between text and what is behind it should be at least 4.5, and text $h$ pixels tall in a design $W$ wide appears at $h \times w / W$ when shown $w$ wide, so lettering must be large and brief. The click-through rate, typically 2 to 10 percent, is not the goal. The platform's own test chooses by watch time, because a misleading thumbnail wins clicks and loses viewers, and the quantity that matters is watch time per impression. Separating two click-through rates takes about $15.68\,\bar{p}(1-\bar{p})/(p_{1}-p_{2})^{2}$ impressions per variant, thousands for a one-point difference, so only distinct ideas are worth testing. AI tools speed up concepts, images, cut-outs, and layout, with care needed over generic looks, altered faces, garbled text, and showing only what the video contains.

**Question 1.** A thumbnail has white text, RGB (255, 255, 255), on a mid-grey band, RGB (150, 150, 150). The contrast ratio is 2.96. Does it pass, and what would you change? The text is 70 pixels tall in a 1280-pixel design. How tall is it when the thumbnail is shown 168 pixels wide, and how tall must it be in the design to appear at 12 pixels?

<details>
<summary>View Answer</summary>

A ratio of 2.96 is below the 4.5 required for ordinary text and just below the 3.0 allowed for large text, so it does not pass either threshold. White and mid grey are too close in brightness. The fix is to change one of the two colours so that their luminances are far apart. A darker band is the simplest: white on black is 21, and white on a dark navy or charcoal is comfortably above 10. Alternatively keep the grey and change the text to black, which against a mid grey gives a ratio of about 7. A dark outline or shadow round white letters achieves the same thing locally, because the text is then judged against the outline. On size, the scaling factor from 1280 pixels to 168 is 168 divided by 1280, about 0.131. Text 70 pixels tall becomes about 9.2 pixels, which is below the 12 pixels taken as a floor for legibility, so in a list of suggested videos it would be hard to read. To appear at 12 pixels it needs to be 12 times 1280 divided by 168 in the design, which is about 91.4, so at least 92 pixels tall. In practice the text should be larger still, since 12 pixels is a minimum, and a larger size forces the wording down to three or four words, which is what a thumbnail should carry anyway.

</details>

**Question 2.** Two thumbnails are tested on the same video. Thumbnail A gets 8,000 impressions, 560 clicks, and 700 minutes of watch time. Thumbnail B gets 8,000 impressions, 400 clicks, and 1,200 minutes. Compute each one's click-through rate, average minutes per view, and watch minutes per thousand impressions. Which should be kept, and what probably explains the difference?

<details>
<summary>View Answer</summary>

Thumbnail A has a click-through rate of 560 divided by 8,000, which is 7 percent. Its viewers watched 700 minutes over 560 views, an average of 1.25 minutes each. Per thousand impressions it produced 700 divided by 8, which is 87.5 minutes of watch time. Thumbnail B has a rate of 400 divided by 8,000, which is 5 percent. Its viewers watched 1,200 minutes over 400 views, an average of 3 minutes each. Per thousand impressions it produced 150 minutes. B should be kept. It was clicked less often and produced about 70 percent more watch time for every thousand times it was shown, which is the measure the platform's own test uses to choose a winner and the one that feeds recommendations. The probable explanation is that A promises something the video does not deliver. It draws more people in, and they leave after about a minute, once they see that the content does not match the picture. B attracts fewer people, and they are the right ones: what they see is what they expected, so they stay. A is likely to be exaggerated or misleading, and B an honest picture of the result. With 8,000 impressions each, the difference in click-through rate between 7 and 5 percent is well established, since it needs roughly 2,200 impressions per variant to detect, so this is not noise. The lesson is that the click-through rate and the watch time pulled in opposite directions, and only the product of the two decides.

</details>

**Question 3.** A small channel gets about 2,000 impressions per video in its first week. The creator wants to test whether a new thumbnail style raises the click-through rate from 4 percent to 4.5 percent. Is this test feasible? What should the creator test instead, and how should thumbnails be improved when testing is not possible?

<details>
<summary>View Answer</summary>

It is not feasible. Using the sample-size formula, the mean of the two rates is 0.0425, and 0.0425 times 0.9575 is about 0.0407. Multiplied by 15.68 that is about 0.638, and divided by the square of the difference, 0.005 squared or 0.000025, it gives about 25,500 impressions for each thumbnail. Two variants need about 51,000 impressions, against 2,000 a week: around half a year of traffic for one video, by which time the audience and the season have changed. A difference of half a point is simply too small for this channel to see. What the creator can test is a large difference. Detecting 4 percent against 8 percent needs only about 550 impressions per variant, which one video supplies in a week. So the variants should be different ideas, a different subject, a different promise, a face against an object, and not adjustments of colour or font, since only different ideas can produce differences that large. The platform's test feature should be used so that the variants are shown to comparable viewers at the same time, and judged by watch time. Where even that is not possible, improvement comes from method instead of measurement. Apply the checks that need no traffic: readable at stamp size, contrast above 4.5, four words or fewer that do not repeat the title, one subject, an honest promise. Compare each thumbnail against the channel's own best-performing ones and against competitors in a mock feed. And look for patterns across many videos over months, grouping thumbnails by type, since twenty videos of a kind pool enough impressions to say something that no single video can.

</details>

@@starter
"""
Lab: Contrast, Size, Tests, Sample Size, and a Thumbnail Check
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import math

WHITE, BLACK, YELLOW, RED = (255, 255, 255), (0, 0, 0), (255, 221, 0), (220, 30, 30)
GREY, NAVY, SKY = (150, 150, 150), (10, 30, 80), (135, 206, 235)

TEST = {
    "shock face": {"impressions": 5000, "clicks": 300, "watch_minutes": 450},
    "clean result": {"impressions": 5000, "clicks": 250, "watch_minutes": 800},
    "tool close-up": {"impressions": 5000, "clicks": 200, "watch_minutes": 560},
}

GOOD = {"width": 1280, "height": 720, "file_mb": 0.8, "text": "4 POUND CHISEL",
        "title": "I Restored a Car Boot Sale Bargain to Razor Sharp", "contrast": 15.59, "text_px": 140}

WEAK = {"width": 1000, "height": 1000, "file_mb": 3.5, "text": "How to sharpen a chisel in ten minutes",
        "title": "How to Sharpen a Chisel in Ten Minutes", "contrast": 1.74, "text_px": 40}


def relative_luminance(rgb):
    """Provided helper: the relative luminance of an (R, G, B) colour with values 0 to 255,
    by the Web Content Accessibility Guidelines formula. 0.0 is black and 1.0 is white."""
    def linear(channel):
        c = channel / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    red, green, blue = (linear(value) for value in rgb)
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue


# ---------------------------------------------------------------- Step 1
def contrast_ratio(colour_a, colour_b):
    """The contrast ratio between two (R, G, B) colours:
        (lighter luminance + 0.05) / (darker luminance + 0.05)
    using relative_luminance for each. The order of the arguments must not matter.
    Return the ratio rounded to 2 places."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def text_at_size(text_px, design_width, display_width):
    """A design `design_width` pixels wide is shown `display_width` pixels wide. Return the
    height, in pixels, at which text `text_px` tall in the design appears: text_px scaled by
    display_width / design_width, rounded to 1 place."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def compare_variants(variants):
    """variants maps a name to {"impressions", "clicks", "watch_minutes"}. For each build
        {"name": name, "ctr": clicks / impressions rounded to 4 places,
         "minutes_per_1000": watch_minutes / impressions * 1000 rounded to 1 place}
    using 0.0 for both when impressions is 0. Then add to each row
        "share": its minutes_per_1000 divided by the total of that figure over all rows,
                 rounded to 3 places (0.0 if the total is 0)
    Return the rows sorted by share from highest to lowest, ties by name."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def impressions_needed(p1, p2):
    """The impressions each variant needs to tell click-through rate p1 from p2:
        mean = (p1 + p2) / 2
        n = 15.68 * mean * (1 - mean) / (p1 - p2) ** 2        rounded UP to a whole number
    If the two rates are equal, raise ValueError."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def thumbnail_lint(spec):
    """spec has width, height, file_mb, text, title, contrast, text_px. Report, in this order:
        "not-16:9"        if width * 9 != height * 16
        "too-small"       if width < 1280
        "file-too-large"  if file_mb > 2
        "too-many-words"  if the text has more than 4 words
        "repeats-title"   if more than half of the text's words are also in the title
        "low-contrast"    if contrast < 4.5
        "text-too-small"  if text_px * 168 / width < 12
    Compare words in lowercase with the characters . , ! ? stripped from their ends."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("contrast:", contrast_ratio(WHITE, SKY), contrast_ratio(YELLOW, BLACK))
    print("size    :", text_at_size(60, 1280, 168))
    print("test    :", compare_variants(TEST))
    print("needed  :", impressions_needed(0.04, 0.05))
    print("lint    :", thumbnail_lint(WEAK))

@@solution
"""
Lab solution: Contrast, Size, Tests, Sample Size, and a Thumbnail Check
Standard library only.
"""
import math

WHITE, BLACK, YELLOW, RED = (255, 255, 255), (0, 0, 0), (255, 221, 0), (220, 30, 30)
GREY, NAVY, SKY = (150, 150, 150), (10, 30, 80), (135, 206, 235)

TEST = {
    "shock face": {"impressions": 5000, "clicks": 300, "watch_minutes": 450},
    "clean result": {"impressions": 5000, "clicks": 250, "watch_minutes": 800},
    "tool close-up": {"impressions": 5000, "clicks": 200, "watch_minutes": 560},
}

GOOD = {"width": 1280, "height": 720, "file_mb": 0.8, "text": "4 POUND CHISEL",
        "title": "I Restored a Car Boot Sale Bargain to Razor Sharp", "contrast": 15.59, "text_px": 140}

WEAK = {"width": 1000, "height": 1000, "file_mb": 3.5, "text": "How to sharpen a chisel in ten minutes",
        "title": "How to Sharpen a Chisel in Ten Minutes", "contrast": 1.74, "text_px": 40}


def relative_luminance(rgb):
    """Provided helper: the relative luminance of an (R, G, B) colour with values 0 to 255,
    by the Web Content Accessibility Guidelines formula. 0.0 is black and 1.0 is white."""
    def linear(channel):
        c = channel / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    red, green, blue = (linear(value) for value in rgb)
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue


# ---------------------------------------------------------------- Step 1
def contrast_ratio(colour_a, colour_b):
    """Whether text can be read against its background is a number, not a matter of taste.
    White on a bright generated sky scores under 2."""
    first, second = relative_luminance(colour_a), relative_luminance(colour_b)
    return round((max(first, second) + 0.05) / (min(first, second) + 0.05), 2)


# ---------------------------------------------------------------- Step 2
def text_at_size(text_px, design_width, display_width):
    """A thumbnail is designed large and seen small. Everything in it shrinks by the same
    factor, which is why there is room for only a few words."""
    return round(text_px * display_width / design_width, 1)


# ---------------------------------------------------------------- Step 3
def compare_variants(variants):
    """The click-through rate and the watch time can pull in opposite directions. Only watch
    time per impression, their product, decides."""
    rows = []
    for name, numbers in variants.items():
        impressions = numbers["impressions"]
        rows.append({"name": name,
                     "ctr": round(numbers["clicks"] / impressions, 4) if impressions else 0.0,
                     "minutes_per_1000": round(numbers["watch_minutes"] / impressions * 1000, 1) if impressions else 0.0})
    total = sum(row["minutes_per_1000"] for row in rows)
    for row in rows:
        row["share"] = round(row["minutes_per_1000"] / total, 3) if total else 0.0
    return sorted(rows, key=lambda row: (-row["share"], row["name"]))


# ---------------------------------------------------------------- Step 4
def impressions_needed(p1, p2):
    """The difference is squared, so halving it roughly quadruples the traffic needed. Only
    large effects are worth testing on a small channel."""
    if p1 == p2:
        raise ValueError("the two rates are equal")
    mean = (p1 + p2) / 2
    return math.ceil(15.68 * mean * (1 - mean) / (p1 - p2) ** 2)


# ---------------------------------------------------------------- Step 5
def thumbnail_lint(spec):
    """A floor, not a verdict: these checks say the thumbnail can be read. They do not say
    anyone will want to click it."""
    problems = []
    if spec["width"] * 9 != spec["height"] * 16:
        problems.append("not-16:9")
    if spec["width"] < 1280:
        problems.append("too-small")
    if spec["file_mb"] > 2:
        problems.append("file-too-large")
    words = [word.strip(".,!?").lower() for word in spec["text"].split()]
    if len(words) > 4:
        problems.append("too-many-words")
    title_words = {word.strip(".,!?").lower() for word in spec["title"].split()}
    if words and sum(1 for word in words if word in title_words) * 2 > len(words):
        problems.append("repeats-title")
    if spec["contrast"] < 4.5:
        problems.append("low-contrast")
    if spec["text_px"] * 168 / spec["width"] < 12:
        problems.append("text-too-small")
    return problems


if __name__ == "__main__":
    print(contrast_ratio(WHITE, BLACK), contrast_ratio(YELLOW, BLACK), contrast_ratio(YELLOW, NAVY))
    print(contrast_ratio(WHITE, RED), contrast_ratio(WHITE, GREY), contrast_ratio(WHITE, SKY), contrast_ratio(WHITE, YELLOW))
    print(round(relative_luminance(YELLOW), 3), round(relative_luminance((128, 128, 128)), 3), contrast_ratio(BLACK, GREY))

    for text_px in (60, 120, 200):
        print(text_px, text_at_size(text_px, 1280, 320), text_at_size(text_px, 1280, 168))
    print(math.ceil(12 * 1280 / 168), text_at_size(70, 1280, 168), round(12 * 1280 / 168, 1))

    for row in compare_variants(TEST):
        print(row)
    print(compare_variants({"A": {"impressions": 8000, "clicks": 560, "watch_minutes": 700}, "B": {"impressions": 8000, "clicks": 400, "watch_minutes": 1200}}), 700 / 560, 1200 / 400, round(150 / 87.5, 2))

    print(impressions_needed(0.04, 0.05), impressions_needed(0.04, 0.06), impressions_needed(0.05, 0.055))
    print(impressions_needed(0.07, 0.05), impressions_needed(0.04, 0.045), impressions_needed(0.04, 0.08))
    print(thumbnail_lint(GOOD))
    print(thumbnail_lint(WEAK))

@@step
{
  "stepNumber": 1,
  "title": "Measure contrast",
  "instruction": "Implement contrast_ratio(colour_a, colour_b). Each colour is a tuple of red, green, and blue values from 0 to 255. Find the relative luminance of each with the provided helper relative_luminance. The contrast ratio is the lighter luminance plus 0.05, divided by the darker luminance plus 0.05, so the order of the two arguments must not matter. Return it rounded to 2 decimal places. Compare white on black, yellow on black, white on red, and white on sky blue. This is the contrast formula from Section 2, where a ratio of at least 4.5 is needed for ordinary text. [MOD-6.7]",
  "hintConceptual": "A torch is easy to see in a cellar and invisible in sunlight. What matters is not how bright the text is, but how far its brightness is from the brightness of what lies behind it.",
  "hintSyntax": "first, second = relative_luminance(colour_a), relative_luminance(colour_b)\nreturn round((max(first, second) + 0.05) / (min(first, second) + 0.05), 2)"
}
@@assert
assert contrast_ratio(WHITE, BLACK) == 21.0, f"White on black is the maximum, 21, got {contrast_ratio(WHITE, BLACK)}"
assert contrast_ratio(BLACK, WHITE) == 21.0 and contrast_ratio(SKY, WHITE) == contrast_ratio(WHITE, SKY), "The order of the two colours does not matter"
assert contrast_ratio(YELLOW, BLACK) == 15.59 and contrast_ratio(YELLOW, NAVY) == 11.86, "Yellow on black and on navy are both excellent"
assert contrast_ratio(WHITE, RED) == 4.94, "White on red passes the 4.5 threshold, narrowly"
assert contrast_ratio(WHITE, GREY) == 2.96 and contrast_ratio(WHITE, SKY) == 1.74 and contrast_ratio(WHITE, YELLOW) == 1.35, "White on mid grey, sky blue, and yellow all fail"
assert contrast_ratio(RED, RED) == 1.0 and contrast_ratio(BLACK, BLACK) == 1.0, "Identical colours have a ratio of 1"
assert contrast_ratio(WHITE, SKY) < 4.5 <= contrast_ratio(WHITE, RED), "The threshold separates the readable from the unreadable"
print("Step 1 passed: white on sky blue is 1.74, and yellow on black is 15.59.")

@@step
{
  "stepNumber": 2,
  "title": "How big is the text when shown small?",
  "instruction": "Implement text_at_size(text_px, design_width, display_width). A thumbnail designed design_width pixels wide is shown display_width pixels wide, and everything in it is scaled by the same factor. Return the height at which text that is text_px tall in the design appears: text_px times display_width divided by design_width, rounded to 1 decimal place. Try lettering of 60, 120, and 200 pixels in a 1280-pixel design, shown at 320 and at 168 pixels wide. This is the scaling formula from Section 2. [MOD-6.7]",
  "hintConceptual": "A poster photographed and printed on a postcard: the headline shrinks in exactly the same proportion as the poster does.",
  "hintSyntax": "return round(text_px * display_width / design_width, 1)"
}
@@assert
assert text_at_size(60, 1280, 168) == 7.9, f"Lettering 60 pixels tall appears at 7.9 pixels in a 168-pixel thumbnail, got {text_at_size(60, 1280, 168)}"
assert text_at_size(60, 1280, 320) == 15.0 and text_at_size(120, 1280, 168) == 15.8 and text_at_size(200, 1280, 168) == 26.2, "Larger text, and a larger display, both help"
assert text_at_size(70, 1280, 168) == 9.2, "The number from the first recall question"
assert text_at_size(100, 1280, 1280) == 100.0, "Shown at its design size, text is unchanged"
assert text_at_size(100, 1000, 500) == 50.0 and text_at_size(100, 500, 1000) == 200.0, "The factor is display width over design width, in that order"
assert text_at_size(92, 1280, 168) >= 12 > text_at_size(91, 1280, 168), "92 pixels in the design is the smallest that appears at 12"
assert text_at_size(0, 1280, 168) == 0.0, "No text, no height"
print("Step 2 passed: 60-pixel lettering shrinks to 7.9 pixels, and 12 pixels on screen needs 92 in the design.")

@@step
{
  "stepNumber": 3,
  "title": "Read a thumbnail test",
  "instruction": "Implement compare_variants(variants). The argument maps each variant's name to a dict with 'impressions', 'clicks', and 'watch_minutes'. For each variant build a row with 'name'; 'ctr', the clicks divided by the impressions, rounded to 4 decimal places; and 'minutes_per_1000', the watch minutes divided by the impressions, times 1000, rounded to 1 decimal place. Use 0.0 for both if the impressions are 0. Then add 'share' to each row: its minutes_per_1000 divided by the total of that figure over all rows, rounded to 3 decimal places, or 0.0 if the total is 0. Return the rows sorted by share from highest to lowest, with ties in alphabetical order of name. Run it on TEST. This is the watch-time measure from Section 2, and the highest click-through rate does not win. [MOD-6.7]",
  "hintConceptual": "Two shop windows: one draws more people in, and they walk straight out again. The other draws fewer, and they stay and buy. Count what was sold, not who came through the door.",
  "hintSyntax": "rows = []\nfor name, numbers in variants.items():\n    impressions = numbers[\"impressions\"]\n    rows.append({\"name\": name,\n                 \"ctr\": round(numbers[\"clicks\"] / impressions, 4) if impressions else 0.0,\n                 \"minutes_per_1000\": round(numbers[\"watch_minutes\"] / impressions * 1000, 1) if impressions else 0.0})\ntotal = sum(row[\"minutes_per_1000\"] for row in rows)\nfor row in rows:\n    row[\"share\"] = round(row[\"minutes_per_1000\"] / total, 3) if total else 0.0\nreturn sorted(rows, key=lambda row: (-row[\"share\"], row[\"name\"]))"
}
@@assert
_rows = compare_variants(TEST)
assert _rows is not None and [row["name"] for row in _rows] == ["clean result", "tool close-up", "shock face"], f"Ranked by watch time, the highest click-through rate comes last, got {_rows}"
assert _rows[0] == {"name": "clean result", "ctr": 0.05, "minutes_per_1000": 160.0, "share": 0.442}, "The winner: a 5 percent rate and 160 minutes per thousand impressions"
assert _rows[2] == {"name": "shock face", "ctr": 0.06, "minutes_per_1000": 90.0, "share": 0.249}, "The shock face has the highest rate, 6 percent, and the smallest share"
assert round(sum(row["share"] for row in _rows), 3) == 1.0, "The shares add up to 1"
_recall = compare_variants({"A": {"impressions": 8000, "clicks": 560, "watch_minutes": 700}, "B": {"impressions": 8000, "clicks": 400, "watch_minutes": 1200}})
assert _recall[0]["name"] == "B" and _recall[0]["minutes_per_1000"] == 150.0 and _recall[1]["ctr"] == 0.07 and _recall[1]["minutes_per_1000"] == 87.5, "The numbers from the second recall question"
_unequal = compare_variants({"A": {"impressions": 1000, "clicks": 50, "watch_minutes": 100}, "B": {"impressions": 4000, "clicks": 200, "watch_minutes": 400}})
assert [row["share"] for row in _unequal] == [0.5, 0.5] and [row["name"] for row in _unequal] == ["A", "B"], "Figures are per impression, so unequal traffic is compared fairly, and ties are ordered by name"
assert compare_variants({"A": {"impressions": 0, "clicks": 0, "watch_minutes": 0}}) == [{"name": "A", "ctr": 0.0, "minutes_per_1000": 0.0, "share": 0.0}], "A variant with no impressions does not cause a division by zero"
assert compare_variants({}) == [], "No variants, no rows"
print("Step 3 passed: the thumbnail with the most clicks produced the least watch time.")

@@step
{
  "stepNumber": 4,
  "title": "How many impressions does a test need?",
  "instruction": "Implement impressions_needed(p1, p2). The two arguments are click-through rates as fractions, such as 0.04 and 0.05. If they are equal, raise ValueError. Otherwise compute their mean, and return 15.68 times the mean times one minus the mean, divided by the square of the difference between the two rates, rounded up to a whole number with math.ceil. The result is the number of impressions each variant needs. Try 4 percent against 5, 4 against 6, and 5 against 5.5. This is the sample-size formula from Section 2. [MOD-6.7]",
  "hintConceptual": "Two coins that land heads 40 and 60 times in a hundred are easy to tell apart after a few dozen tosses. Two that differ by half a toss in a hundred need many thousands.",
  "hintSyntax": "if p1 == p2:\n    raise ValueError(\"the two rates are equal\")\nmean = (p1 + p2) / 2\nreturn math.ceil(15.68 * mean * (1 - mean) / (p1 - p2) ** 2)"
}
@@assert
assert impressions_needed(0.04, 0.05) == 6739, f"Telling 4 percent from 5 takes 6,739 impressions each, got {impressions_needed(0.04, 0.05)}"
assert impressions_needed(0.04, 0.06) == 1863 and impressions_needed(0.05, 0.055) == 31200, "A larger difference needs far fewer, and a smaller one far more"
assert impressions_needed(0.05, 0.04) == impressions_needed(0.04, 0.05), "The order of the two rates does not matter"
assert impressions_needed(0.04, 0.045) == 25524 and impressions_needed(0.04, 0.08) == 553, "The numbers from the third recall question"
assert impressions_needed(0.07, 0.05) == 2211, "Seven percent against five takes about 2,200"
assert isinstance(impressions_needed(0.04, 0.05), int), "The result is a whole number, rounded up"
assert 3.5 < impressions_needed(0.04, 0.05) / impressions_needed(0.04, 0.06) < 4, "Halving the difference nearly quadruples the impressions needed"
def _refuses():
    try:
        impressions_needed(0.05, 0.05)
    except ValueError:
        return True
    return False
assert _refuses(), "Equal rates raise ValueError: there is no difference to detect"
print("Step 4 passed: a one-point difference needs 6,739 impressions per thumbnail.")

@@step
{
  "stepNumber": 5,
  "title": "Check a thumbnail before upload",
  "instruction": "Implement thumbnail_lint(spec). The spec is a dict with width, height, file_mb, text, title, contrast, and text_px. Report problems in this order. 'not-16:9' if width times 9 does not equal height times 16. 'too-small' if the width is under 1280. 'file-too-large' if file_mb is over 2. 'too-many-words' if the text has more than 4 words. 'repeats-title' if more than half of the text's words also appear in the title, comparing words in lowercase with the characters . , ! ? stripped from their ends. 'low-contrast' if the contrast is under 4.5. 'text-too-small' if text_px times 168 divided by the width is under 12. Return the list. Run it on GOOD and on WEAK. These are the requirements and measurements of Section 2, gathered into one check. [MOD-6.7]",
  "hintConceptual": "A pilot's walk-round before take-off does not make the flight a good one. It catches the things that would certainly make it a bad one.",
  "hintSyntax": "problems = []\nif spec[\"width\"] * 9 != spec[\"height\"] * 16:\n    problems.append(\"not-16:9\")\nif spec[\"width\"] < 1280:\n    problems.append(\"too-small\")\nif spec[\"file_mb\"] > 2:\n    problems.append(\"file-too-large\")\nwords = [word.strip(\".,!?\").lower() for word in spec[\"text\"].split()]\nif len(words) > 4:\n    problems.append(\"too-many-words\")\ntitle_words = {word.strip(\".,!?\").lower() for word in spec[\"title\"].split()}\nif words and sum(1 for word in words if word in title_words) * 2 > len(words):\n    problems.append(\"repeats-title\")\nif spec[\"contrast\"] < 4.5:\n    problems.append(\"low-contrast\")\nif spec[\"text_px\"] * 168 / spec[\"width\"] < 12:\n    problems.append(\"text-too-small\")\nreturn problems"
}
@@assert
assert thumbnail_lint(GOOD) == [], f"The good thumbnail passes all seven checks, got {thumbnail_lint(GOOD)}"
assert thumbnail_lint(WEAK) == ["not-16:9", "too-small", "file-too-large", "too-many-words", "repeats-title", "low-contrast", "text-too-small"], f"The weak thumbnail fails all seven, got {thumbnail_lint(WEAK)}"
assert thumbnail_lint(dict(GOOD, width=1920, height=1080)) == [] and thumbnail_lint(dict(GOOD, width=1280, height=800)) == ["not-16:9"], "Any 16:9 size of at least 1280 wide passes the shape and size checks"
assert thumbnail_lint(dict(GOOD, file_mb=2)) == [] and thumbnail_lint(dict(GOOD, file_mb=2.1)) == ["file-too-large"], "Two megabytes is the limit"
assert thumbnail_lint(dict(GOOD, text="ONE TWO THREE FOUR")) == [] and thumbnail_lint(dict(GOOD, text="ONE TWO THREE FOUR FIVE")) == ["too-many-words"], "Four words pass and five do not"
assert thumbnail_lint(dict(GOOD, text="RAZOR SHARP!")) == ["repeats-title"] and thumbnail_lint(dict(GOOD, text="RAZOR EDGE")) == [], "Punctuation and case are ignored, and exactly half the words in the title is allowed"
assert thumbnail_lint(dict(GOOD, contrast=4.5)) == [] and thumbnail_lint(dict(GOOD, contrast=4.49)) == ["low-contrast"], "The contrast threshold is 4.5"
assert thumbnail_lint(dict(GOOD, text_px=92)) == [] and thumbnail_lint(dict(GOOD, text_px=91)) == ["text-too-small"], "92 pixels is the smallest text that appears at 12 pixels in a 168-pixel thumbnail"
assert thumbnail_lint(dict(GOOD, text="")) == [], "A thumbnail with no text has no words to count or repeat"
print("Step 5 passed: the weak thumbnail is square, small, heavy, wordy, repetitive, faint, and tiny.")
