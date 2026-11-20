@@meta
{
  "moduleId": "MOD-9.7",
  "slug": "mod-9-7",
  "unitId": "UNIT-9",
  "unitTitle": "Unit 9: Coding with AI",
  "title": "Building Websites",
  "difficulty": "Foundational",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "How the web works", "source": "MDN Web Docs", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works" },
    { "title": "Responsive design", "source": "MDN Web Docs", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design" },
    { "title": "Web Content Accessibility Guidelines (WCAG) 2.2", "source": "W3C", "url": "https://www.w3.org/TR/WCAG22/" },
    { "title": "Understanding Success Criterion 1.4.3: Contrast (Minimum)", "source": "W3C WAI", "url": "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" },
    { "title": "The WebAIM Million (2026)", "source": "WebAIM", "url": "https://webaim.org/projects/million/" },
    { "title": "Web Vitals", "source": "web.dev (Google)", "url": "https://web.dev/articles/vitals" }
  ],
  "videoLibrary": [
    {
      "id": "VID-9.7-1",
      "title": "How Websites Work | simply explained with examples",
      "creator": "TechWorld with Nana",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=vcRmKtL4o_4",
      "timingInstruction": "Watch after Section 1, before the structure part of Section 2",
      "keyTakeaway": "Browsers, servers, domains, and how HTML, CSS, and JavaScript fit together."
    },
    {
      "id": "VID-9.7-2",
      "title": "WCAG for beginners - What are the Web Content Accessibility Guidelines? - Web Accessibility",
      "creator": "Silktide",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=5H1JGdqLrWo",
      "timingInstruction": "Watch after the accessibility part of Section 2, before Step 1 of the lab",
      "keyTakeaway": "What WCAG is, its levels, and the everyday checks that make a site usable by everyone."
    },
    {
      "id": "VID-9.7-3",
      "title": "Core Web Vitals Explained: LCP, INP & CLS",
      "creator": "I Code It",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=cGiSr0MilsI",
      "timingInstruction": "Watch after the performance part of Section 2, before Step 3 of the lab",
      "keyTakeaway": "The three loading, responsiveness, and stability metrics and the thresholds for a good experience."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Accessibility Audit, Contrast Ratios, Page Weight, Breakpoints, Site Briefs",
    "context": "The tool shop wants a simple website built with AI and checked properly before it goes live. You will audit the generated HTML for accessibility problems, compute colour contrast ratios, measure page weight against a budget, check that the CSS is mobile-first, and turn the owner's notes into a complete brief that stops the AI inventing content.",
    "language": "python"
  }
}

@@reading
# Building Websites

A small business website is the most common first project for anyone building with AI, and AI tools are genuinely good at it: describe the shop, and a few minutes later there is a styled, multi-page site. What the AI does not reliably do is make the site **accessible** to everyone, **fast** on a phone in a car park, **responsive** on screens of every size, and **truthful**: AI-built sites regularly contain invented testimonials, prices, and opening hours. This module explains how websites work, how to brief an AI so it builds the right site, and how to check the result with simple, objective tests.

## 1. First-Principles Mental Model & Intuition

### A shop window, a building, and a set of signs

A website has three layers, like a shop. **HTML** is the building's structure: walls, rooms, doors, and the labels on them, a heading here, a product list there, a form for contact. **CSS** is the decoration and layout: colours, spacing, and how the furniture rearranges when the room is smaller. **JavaScript** is the moving parts: a menu that opens, a basket that updates. **Hosting** is the plot of land the shop stands on, and the **domain** is its street address.

A good shop is also usable by everyone: the door is wide enough for a wheelchair, the signs are readable, and someone who cannot see the window display can still find the counter. On the web, that is **accessibility**, and the international standard for it is **WCAG**, the Web Content Accessibility Guidelines, currently version 2.2.

```text
   visitor's browser  --- request https://toolshop.example/ --->  web host (static files)
         ^                                                          |
         |------------- index.html, styles.css, script.js, images <-|
         |
   browser builds the page:
     HTML  -> structure and meaning (headings, lists, links, forms, alt text, lang)
     CSS   -> layout and style (mobile first, then @media min-width breakpoints)
     JS    -> behaviour (only where needed)
   checks before launch:
     accessibility (WCAG 2.2: alt text, labels, contrast, headings, language)
     performance (page weight budget; LCP, INP, CLS)
     responsiveness (viewport meta; no fixed widths; breakpoints)
     truth (only real content: no invented prices, reviews, or hours)
```

### What AI gets wrong on websites

AI builders produce plausible sites, and plausible is the problem. The 2026 WebAIM Million survey of a million home pages found WCAG failures detected on **95.9 percent** of them, with an average of 56.1 errors per page; the most common were **low-contrast text**, on 83.9 percent of pages, **missing alternative text for images**, 53.1 percent, **missing form labels**, 51 percent, and **empty links**, 46.3 percent. AI models learned from that web, and reproduce its habits unless told and checked otherwise.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### How a page is delivered

When someone visits a site, as MDN's "How the web works" explains, the browser looks up the domain's address, connects to the server, requests the page, and receives HTML, which references CSS, JavaScript, images, and fonts that are requested in turn. A **static site** is just these files on a host; there is no server-side code or database. Static sites are fast, cheap, secure, and enough for most small-business sites; Module 9.8 covers applications that need a backend, and Module 9.11 covers hosting.

### Structure and meaning: semantic HTML

HTML elements carry meaning that browsers, search engines, and assistive technologies such as screen readers rely on. The essentials for every page:

| Element or attribute | Why |
|---|---|
| `<html lang="en">` | Screen readers choose the right pronunciation |
| `<title>` | Tab label, bookmarks, search results |
| `<meta name="viewport" content="width=device-width, initial-scale=1">` | Phones render at device width instead of a zoomed-out desktop layout |
| Headings in order, h1 then h2 then h3 | A navigable outline; skipping levels confuses it |
| `alt` on every image | Text for people who cannot see it; `alt=""` for purely decorative images |
| Visible link text | "Basket", not an icon with no name |
| A `<label>` for every form field | Users know what to type |

Each of these is mechanically checkable, which is why the lab can audit them.

### Accessibility: contrast

WCAG's contrast criterion requires a **contrast ratio** of at least **4.5 to 1** for normal text and **3 to 1** for large text at level AA. The ratio compares the **relative luminance** of the two colours. Each colour channel, scaled to 0 to 1 as $c$, is linearised:

$$c_{\text{lin}} = \begin{cases} c / 12.92 & c \le 0.04045 \\ \left(\frac{c + 0.055}{1.055}\right)^{2.4} & \text{otherwise} \end{cases}$$

and the luminance weights the channels by how sensitive the eye is to each:

$$L = 0.2126\,R_{\text{lin}} + 0.7152\,G_{\text{lin}} + 0.0722\,B_{\text{lin}}$$

The contrast ratio of the lighter luminance $L_1$ to the darker $L_2$ is

$$\text{ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

ranging from 1 for identical colours to 21 for black on white. A famous threshold case: grey `#767676` on white is 4.54, just passing; `#777777` is 4.48, just failing. Fashionable light-grey text and white text on bright brand colours fail most often.

### Responsive design

**Responsive design**, as MDN describes it, makes one page adapt to any screen. The robust approach is **mobile first**: write the base CSS for small screens, a single column, then add `@media (min-width: 768px)` style rules that enhance the layout as space grows. Two common mistakes are a missing viewport meta tag, which makes phones show a tiny desktop page, and **fixed widths** such as `width: 1200px`, which force sideways scrolling. Desktop-first CSS with `max-width` overrides works, but tends to accumulate exceptions.

### Performance

Google's **Core Web Vitals** define a good experience as a **Largest Contentful Paint** within 2.5 seconds, an **Interaction to Next Paint** of 200 milliseconds or less, and a **Cumulative Layout Shift** of 0.1 or less. For a simple site, the biggest lever is **page weight**: the bytes the visitor must download. A rough estimate of download time on a slow mobile connection with bandwidth $B$ megabits per second and round-trip time $r$:

$$t \approx \frac{8 \times \text{kilobytes}}{1000 \times B} + k \cdot r$$

where $k$ counts the sequential round trips before the page can render; the lab uses 3. At a slow-mobile profile of 1.6 megabits per second and 150 milliseconds, a 3,260-kilobyte page takes over 16 seconds; a 508-kilobyte page about 3. A **performance budget**, maximum kilobytes per asset type, makes the target explicit. Oversized hero images are the usual culprit: AI builders happily embed a 2.4-megabyte photograph where a 200-kilobyte compressed one looks identical.

### Prompting an AI to build a site

The quality of an AI-built site depends heavily on the brief. A good brief states:

| Field | Example |
|---|---|
| Audience | Local trade customers |
| Pages | Home, Products, Contact |
| Tone | Plain and friendly |
| Brand colours | Two or three colours, checked for contrast |
| Content | The real text: address, hours, services, prices |
| Constraints | Semantic HTML, no external JavaScript, WCAG 2.2 AA, mobile first |

And one instruction that matters more than all the others: **use only the content provided; do not invent facts, prices, or testimonials.** AI builders fill gaps with plausible fiction, and a website is a public statement by the business, the same lesson as Module 8.17's Air Canada case. Then iterate: ask for one change at a time, check it, and commit it, Module 9.10.

### Complexity

The HTML audit is a single pass over the document. Contrast is constant per colour pair. Page weight is linear in assets. Breakpoint checks are linear in the CSS. Brief checks are linear in fields.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, an accessibility audit with Python's built-in HTML parser.

```python
import re
from html.parser import HTMLParser

class Audit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.issues, self.inputs, self.labels = [], [], set()
        self.lang = self.title = self.viewport = self.in_title = self.in_a = False
        self.last_h, self.a_text, self.a_href = 0, "", ""

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html" and a.get("lang"):
            self.lang = True
        if tag == "title":
            self.in_title = True
        if tag == "meta" and a.get("name") == "viewport":
            self.viewport = True
        if tag == "img" and "alt" not in a:
            self.issues.append(f"img without alt: {a.get('src', '?')}")
        if re.fullmatch(r"h[1-6]", tag):
            level = int(tag[1])
            if self.last_h and level > self.last_h + 1:
                self.issues.append(f"heading jumps from h{self.last_h} to h{level}")
            self.last_h = level
        if tag == "a":
            self.in_a, self.a_text, self.a_href = True, "", a.get("href", "")
        if tag == "label" and a.get("for"):
            self.labels.add(a["for"])
        if tag == "input" and a.get("type") not in ("hidden", "submit"):
            self.inputs.append(a.get("id"))

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "a":
            if not self.a_text.strip():
                self.issues.append(f"empty link: {self.a_href}")
            self.in_a = False

    def handle_data(self, data):
        if self.in_title and data.strip():
            self.title = True
        if self.in_a:
            self.a_text += data

def audit_html(html):
    parser = Audit()
    parser.feed(html)
    issues = []
    if not parser.lang:
        issues.append("missing lang on html")
    if not parser.title:
        issues.append("missing title")
    if not parser.viewport:
        issues.append("missing viewport meta")
    return issues + parser.issues + [f"input without label: {i}" for i in parser.inputs if i not in parser.labels]

PAGE = """<html><head><title>Toolshop</title></head><body>
<h1>Toolshop</h1><h3>Saws</h3><img src="saw.jpg"><a href="/cart"><img src="cart.svg" alt=""></a>
<form><label for="email">Email</label><input id="email" type="email"><input id="postcode" type="text"><input type="submit"></form>
<h2>About</h2><a href="/about">About us</a></body></html>"""
for issue in audit_html(PAGE):
    print(issue)
```

- **The parser walks the HTML once, recording what it sees.** No browser needed.
- **No language and no viewport meta.** Screen readers guess the language; phones show a zoomed-out page.
- **The heading jumps from h1 to h3.** The outline skips a level.
- **The saw photo has no alt text.** The cart icon is marked decorative with `alt=""`, but it is the link's only content, so the link has no name: an "empty link".
- **The postcode field has no label.** Six issues, three of them, missing alt text, a missing label, and an empty link, among the WebAIM Million's most common.

Next, contrast ratios.

```python
def luminance(hex_colour):
    h = hex_colour.lstrip("#")
    def channel(v):
        c = int(v, 16) / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (channel(h[i:i + 2]) for i in (0, 2, 4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast(fg, bg, large=False):
    l1, l2 = sorted((luminance(fg), luminance(bg)), reverse=True)
    ratio = round((l1 + 0.05) / (l2 + 0.05), 2)
    return ratio, ratio >= (3 if large else 4.5)

for fg, bg, large in [("#000000", "#ffffff", False), ("#777777", "#ffffff", False), ("#767676", "#ffffff", False),
                      ("#ffffff", "#e8590c", False), ("#ffffff", "#e8590c", True)]:
    print(fg, bg, large, contrast(fg, bg, large))
```

- **Black on white is the maximum, 21.**
- **`#777777` fails at 4.48; `#767676` passes at 4.54.** One step of grey decides it.
- **White on a bright orange brand colour is 3.58.** It fails for body text but passes for large headings.
- **Order does not matter.** The lighter colour is always the numerator.

Then, page weight against a budget.

```python
def page_weight(assets, budget_kb, mbps=1.6, rtt_ms=150):
    by_type = {}
    for name, kind, kb in assets:
        by_type[kind] = by_type.get(kind, 0) + kb
    total = sum(by_type.values())
    seconds = round(total * 8 / 1000 / mbps + 3 * rtt_ms / 1000, 2)
    over = {k: v - budget_kb[k] for k, v in sorted(by_type.items()) if k in budget_kb and v > budget_kb[k]}
    return {"total_kb": total, "by_type": dict(sorted(by_type.items())), "est_seconds": seconds, "over_budget": over}

BUDGET = {"image": 500, "script": 300, "style": 100, "font": 150}
AI_BUILT = [("hero.jpg", "image", 2400), ("logo.png", "image", 180), ("app.js", "script", 420),
            ("analytics.js", "script", 90), ("styles.css", "style", 60), ("font.woff2", "font", 110)]
print(page_weight(AI_BUILT, BUDGET))
```

- **The AI-built page weighs 3,260 kilobytes.** About 16.75 seconds on a slow mobile connection.
- **Images are 2,080 kilobytes over budget, almost all the hero photograph.** Compressing it to a modern format at a sensible size fixes most of the problem.
- **Scripts are 210 over.** A static shop site rarely needs 510 kilobytes of JavaScript.
- **After optimisation, a 508-kilobyte version loads in about 3 seconds.** The lab checks it.

Then, responsive breakpoints.

```python
MEDIA = re.compile(r"@media[^{]*\((min|max)-width:\s*(\d+)px\)")

def breakpoints(css):
    found = [(kind, int(px)) for kind, px in MEDIA.findall(css)]
    mins = sorted(px for kind, px in found if kind == "min")
    maxs = sorted(px for kind, px in found if kind == "max")
    fixed = [int(w) for w in re.findall(r"(?<![-\w])width:\s*(\d+)px", css) if int(w) > 400]
    return {"min": mins, "max": maxs, "mobile_first": bool(mins) and not maxs, "fixed_widths": fixed}

MOBILE_FIRST = (".grid{display:grid;grid-template-columns:1fr}\n"
                "@media (min-width: 768px){.grid{grid-template-columns:1fr 1fr}}\n"
                "@media (min-width: 1200px){.grid{grid-template-columns:repeat(3,1fr)}}")
DESKTOP_FIRST = ".page{width:1200px}\n@media (max-width: 600px){.page{width:100%}}"
print(breakpoints(MOBILE_FIRST))
print(breakpoints(DESKTOP_FIRST))
```

- **The first stylesheet starts with one column and adds columns at 768 and 1,200 pixels.** Mobile first.
- **The second fixes the page at 1,200 pixels and patches small screens.** Tablets between 601 and 1,199 pixels scroll sideways.
- **The fixed-width check ignores `max-width` and `min-width` properties.** Only hard `width` values over 400 pixels are flagged.

Finally, a brief that prevents invention.

```python
REQUIRED = ["audience", "pages", "tone", "brand_colours", "content", "constraints"]

def site_prompt(brief):
    missing = [k for k in REQUIRED if not brief.get(k)]
    if missing:
        return None, missing
    lines = [f"Build a static website for {brief['audience']}.",
             f"Pages: {', '.join(brief['pages'])}.",
             f"Tone: {brief['tone']}.",
             f"Brand colours: {', '.join(brief['brand_colours'])}.",
             "Use only the content provided below; do not invent facts, prices, or testimonials.",
             f"Constraints: {'; '.join(brief['constraints'])}.",
             "Content:", brief["content"]]
    return "\n".join(lines), []

BRIEF = {"audience": "local trade customers", "pages": ["Home", "Products", "Contact"], "tone": "plain and friendly",
         "brand_colours": ["#1b4d3e", "#f2f2f2"], "content": "Toolshop, 1 Mill Lane, Leeds. Open 8 to 6.",
         "constraints": ["semantic HTML", "no external JavaScript", "WCAG 2.2 AA contrast", "mobile first"]}
print(site_prompt(BRIEF)[0])
print(site_prompt({**BRIEF, "tone": "", "content": None}))
```

- **A brief missing fields is refused, with the gaps listed.** Missing content is the gap AI fills with fiction.
- **The prompt states the constraints that the audit will check.** Ask for what you will test.
- **The no-invention instruction is always included.**

**Complexity.** `audit_html` is one pass over the HTML. `contrast` is constant. `page_weight` is linear in assets. `breakpoints` is linear in the CSS. `site_prompt` is linear in the brief.

### A website launch checklist

```text
BRIEF        audience, pages, tone, colours, REAL content, constraints; "do not invent" instruction
STRUCTURE    lang, title, viewport meta; headings in order; alt on images; labels on fields; named links
CONTRAST     body text >= 4.5:1, large text >= 3:1 (check brand colours before building)
RESPONSIVE   mobile-first CSS, min-width breakpoints, no fixed widths; test at 360, 768, 1280 px
PERFORMANCE  budget: images 500 KB, scripts 300 KB, CSS 100 KB, fonts 150 KB; compress images
TRUTH        every price, hour, review, and claim checked by the owner before launch
TOOLS        browser accessibility checker and performance audit before every release
```

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Invented testimonials and prices.** AI fills gaps with plausible fiction. Provide real content and forbid invention.

**Light grey text.** Fashionable and unreadable. Check contrast; `#767676` is the lightest grey that passes on white.

**White text on brand colours.** Often fails for body text. Use it for large headings only, or darken the colour.

**Missing alt text.** Screen-reader users hear "image". Describe meaningful images; mark decorative ones `alt=""`.

**Icon-only links.** A basket icon with no text is an empty link. Give the image meaningful alt text, such as "Basket", or add visually hidden text or an `aria-label`; the lab's simplified audit counts only text content as a link's name, so it would still flag the alt-text fix for a manual check.

**Placeholder instead of label.** Placeholders vanish when typing. Use real labels.

**No viewport meta.** Phones show a tiny desktop page. Add it.

**Fixed widths.** `width: 1200px` scrolls sideways on tablets. Use flexible layouts.

**Giant hero images.** Megabyte photographs dominate load time. Compress and size them.

**JavaScript for everything.** Static content does not need a framework. Ship HTML and CSS.

**Testing on your own laptop only.** Your fast connection hides problems. Test on a phone with throttling.

**Big-bang prompts.** "Make it better" rewrites everything. Ask for one change at a time and check it.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A website is HTML for structure and meaning, CSS for layout and style, JavaScript for behaviour, served from a host at a domain; a static site of plain files is enough for most small businesses. AI builders produce plausible sites but reproduce the web's common failures: the 2026 WebAIM Million found WCAG failures on 95.9 percent of home pages, led by low contrast, missing alt text, missing labels, and empty links. Semantic HTML essentials, language, title, viewport, ordered headings, alt text, named links, and labels, are mechanically checkable. WCAG AA contrast requires 4.5 to 1 for normal text and 3 to 1 for large, computed from linearised relative luminance. Responsive design works best mobile first with min-width breakpoints and no fixed widths. Performance follows from page weight and Core Web Vitals targets of LCP within 2.5 seconds, INP of 200 milliseconds or less, and CLS of 0.1 or less, managed with a budget. A complete brief with real content, explicit constraints, and an instruction not to invent anything produces better sites, which are then checked and refined one change at a time.

**Question 1.** An AI-generated home page passes a visual check but `audit_html` reports six issues. Explain who each issue affects and how to fix it.

<details>
<summary>View Answer</summary>

"Missing lang on html" affects screen-reader users, whose software may read English text with the wrong pronunciation rules; add `lang="en"` to the html element. "Missing viewport meta" affects every phone user, who sees a shrunken desktop layout; add the standard viewport tag. "Heading jumps from h1 to h3" affects people who navigate by headings with assistive technology, who meet a gap in the outline; change the "Saws" heading to h2 or insert the missing level. "img without alt: saw.jpg" affects blind and low-vision users and anyone whose images fail to load, who get no information about the product; add a description such as "Cordless circular saw". "empty link: /cart" affects screen-reader users, who hear only "link" because the only content is an icon marked decorative; add text, visible or visually hidden, or an `aria-label` such as "Basket". "input without label: postcode" affects screen-reader users and anyone confused by the form, who do not know what the field is for; add a `<label for="postcode">Postcode</label>`. Most of these, including missing alt text, missing labels, and empty links, are among the most common failures in the WebAIM Million, and all can be prevented by stating the constraints in the brief and checked automatically before launch.

</details>

**Question 2.** The shop's brand orange is `#e8590c`, and the AI used white body text on orange buttons and banners. Using `contrast`, decide which uses are acceptable and propose fixes.

<details>
<summary>View Answer</summary>

White on `#e8590c` has a contrast ratio of 3.58. For normal-size body text, WCAG 2.2 level AA requires 4.5 to 1, so white body text on orange fails; for large text, roughly 18 point, or 14 point bold, the requirement is 3 to 1, so large headings and large bold button labels in white on orange pass. The fixes keep the brand while meeting the standard. Use the orange as a background only for large, bold text, such as a banner headline or a large button label. For smaller text on orange, use a very dark colour instead of white, checking the ratio, or darken the orange for text-bearing surfaces until white reaches 4.5, keeping the brighter orange for decorative accents, borders, and icons, which carry no text. Record the approved colour pairs in the brief's constraints so that future AI edits use them, and recheck contrast after any design change. The calculation takes seconds, which is why it belongs before the build rather than after customers complain.

</details>

**Question 3.** The AI-built site weighs 3,260 kilobytes and `page_weight` estimates 16.75 seconds on a slow mobile connection. Explain the estimate, identify the biggest savings, and say how you would confirm the improvement.

<details>
<summary>View Answer</summary>

The estimate converts 3,260 kilobytes to about 26 megabits, divides by the 1.6 megabits per second of the slow-mobile profile to get about 16.3 seconds of transfer, and adds three round trips of 150 milliseconds for connection set-up and sequential requests, giving 16.75 seconds. It is rough, ignoring caching, compression, and parallel downloads, but it makes the scale clear: Google's guidance is for the largest content to appear within 2.5 seconds. The breakdown shows where to act: images total 2,580 kilobytes against a 500-kilobyte budget, almost all from the 2,400-kilobyte hero photograph, so resizing it to the largest size it is displayed at and compressing it in a modern format such as WebP or AVIF typically saves well over 2 megabytes alone; scripts total 510 kilobytes against 300, so removing unnecessary JavaScript, for example a framework used only for a menu, helps next. The lab's optimised version, 508 kilobytes, estimates about 3 seconds. To confirm, run a performance audit in the browser's developer tools with mobile throttling, check the Largest Contentful Paint against 2.5 seconds, and, after launch, watch real-user Core Web Vitals data, since lab estimates and real phones can differ.

</details>

@@starter
"""
Lab: Accessibility Audit, Contrast Ratios, Page Weight, Breakpoints, Site Briefs
Standard library only. No browser or network. Complete the TODO in each step, then press "Run & Verify Step".
"""
import re
from html.parser import HTMLParser

PAGE = """<html><head><title>Toolshop</title></head><body>
<h1>Toolshop</h1><h3>Saws</h3><img src="saw.jpg"><a href="/cart"><img src="cart.svg" alt=""></a>
<form><label for="email">Email</label><input id="email" type="email"><input id="postcode" type="text"><input type="submit"></form>
<h2>About</h2><a href="/about">About us</a></body></html>"""
GOOD = ('<html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>T</title></head>'
        '<body><h1>T</h1><h2>S</h2><img src="a.jpg" alt="A saw"><a href="/">Home</a></body></html>')
BUDGET = {"image": 500, "script": 300, "style": 100, "font": 150}
AI_BUILT = [("hero.jpg", "image", 2400), ("logo.png", "image", 180), ("app.js", "script", 420),
            ("analytics.js", "script", 90), ("styles.css", "style", 60), ("font.woff2", "font", 110)]
OPTIMISED = [("hero.webp", "image", 220), ("logo.svg", "image", 8), ("app.js", "script", 180), ("styles.css", "style", 40), ("font.woff2", "font", 60)]
MEDIA = re.compile(r"@media[^{]*\((min|max)-width:\s*(\d+)px\)")
MOBILE_FIRST = (".grid{display:grid;grid-template-columns:1fr}\n"
                "@media (min-width: 768px){.grid{grid-template-columns:1fr 1fr}}\n"
                "@media (min-width: 1200px){.grid{grid-template-columns:repeat(3,1fr)}}")
DESKTOP_FIRST = ".page{width:1200px}\n@media (max-width: 600px){.page{width:100%}}"
REQUIRED = ["audience", "pages", "tone", "brand_colours", "content", "constraints"]
BRIEF = {"audience": "local trade customers", "pages": ["Home", "Products", "Contact"], "tone": "plain and friendly",
         "brand_colours": ["#1b4d3e", "#f2f2f2"], "content": "Toolshop, 1 Mill Lane, Leeds. Open 8 to 6.",
         "constraints": ["semantic HTML", "no external JavaScript", "WCAG 2.2 AA contrast", "mobile first"]}


class Audit(HTMLParser):
    """Given: records lang, title, viewport, missing alt, heading jumps, empty links, inputs and labels."""

    def __init__(self):
        super().__init__()
        self.issues, self.inputs, self.labels = [], [], set()
        self.lang = self.title = self.viewport = self.in_title = self.in_a = False
        self.last_h, self.a_text, self.a_href = 0, "", ""

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html" and a.get("lang"):
            self.lang = True
        if tag == "title":
            self.in_title = True
        if tag == "meta" and a.get("name") == "viewport":
            self.viewport = True
        if tag == "img" and "alt" not in a:
            self.issues.append(f"img without alt: {a.get('src', '?')}")
        if re.fullmatch(r"h[1-6]", tag):
            level = int(tag[1])
            if self.last_h and level > self.last_h + 1:
                self.issues.append(f"heading jumps from h{self.last_h} to h{level}")
            self.last_h = level
        if tag == "a":
            self.in_a, self.a_text, self.a_href = True, "", a.get("href", "")
        if tag == "label" and a.get("for"):
            self.labels.add(a["for"])
        if tag == "input" and a.get("type") not in ("hidden", "submit"):
            self.inputs.append(a.get("id"))

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "a":
            if not self.a_text.strip():
                self.issues.append(f"empty link: {self.a_href}")
            self.in_a = False

    def handle_data(self, data):
        if self.in_title and data.strip():
            self.title = True
        if self.in_a:
            self.a_text += data


# ---------------------------------------------------------------- Step 1
def audit_html(html):
    """Feed an Audit parser. Issues in order: "missing lang on html", "missing title", "missing viewport meta" (when
    absent), then the parser's issues, then "input without label: <id>" for inputs whose id has no label."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def luminance(hex_colour):
    """WCAG relative luminance: linearise each channel (c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4), then
    0.2126 R + 0.7152 G + 0.0722 B."""
    # TODO Step 2
    return None


def contrast(fg, bg, large=False):
    """(round((L1 + 0.05) / (L2 + 0.05), 2), ratio >= 3 if large else 4.5), L1 the lighter."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def page_weight(assets, budget_kb, mbps=1.6, rtt_ms=150):
    """Sum kilobytes by type; total; est_seconds = round(total * 8 / 1000 / mbps + 3 * rtt_ms / 1000, 2);
    over_budget = {type: excess} for types over budget (sorted). Return {"total_kb", "by_type" (sorted),
    "est_seconds", "over_budget"}."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def breakpoints(css):
    """MEDIA matches -> sorted min and max widths; mobile_first = any min and no max; fixed_widths = "width: Npx"
    values over 400 not part of min-/max-width. Return {"min", "max", "mobile_first", "fixed_widths"}."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def site_prompt(brief):
    """Missing REQUIRED fields (falsy) -> (None, missing). Else the lines: "Build a static website for <audience>.",
    "Pages: <a, b>.", "Tone: <tone>.", "Brand colours: <a, b>.", "Use only the content provided below; do not invent
    facts, prices, or testimonials.", "Constraints: <a; b>.", "Content:", content, joined by newlines; and []."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("audit   :", audit_html(PAGE))
    print("contrast:", contrast("#767676", "#ffffff"))

@@solution
"""
Lab solution: Accessibility Audit, Contrast Ratios, Page Weight, Breakpoints, Site Briefs
Standard library only. No browser or network.
"""
import re
from html.parser import HTMLParser

PAGE = """<html><head><title>Toolshop</title></head><body>
<h1>Toolshop</h1><h3>Saws</h3><img src="saw.jpg"><a href="/cart"><img src="cart.svg" alt=""></a>
<form><label for="email">Email</label><input id="email" type="email"><input id="postcode" type="text"><input type="submit"></form>
<h2>About</h2><a href="/about">About us</a></body></html>"""
GOOD = ('<html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>T</title></head>'
        '<body><h1>T</h1><h2>S</h2><img src="a.jpg" alt="A saw"><a href="/">Home</a></body></html>')
BUDGET = {"image": 500, "script": 300, "style": 100, "font": 150}
AI_BUILT = [("hero.jpg", "image", 2400), ("logo.png", "image", 180), ("app.js", "script", 420),
            ("analytics.js", "script", 90), ("styles.css", "style", 60), ("font.woff2", "font", 110)]
OPTIMISED = [("hero.webp", "image", 220), ("logo.svg", "image", 8), ("app.js", "script", 180), ("styles.css", "style", 40), ("font.woff2", "font", 60)]
MEDIA = re.compile(r"@media[^{]*\((min|max)-width:\s*(\d+)px\)")
MOBILE_FIRST = (".grid{display:grid;grid-template-columns:1fr}\n"
                "@media (min-width: 768px){.grid{grid-template-columns:1fr 1fr}}\n"
                "@media (min-width: 1200px){.grid{grid-template-columns:repeat(3,1fr)}}")
DESKTOP_FIRST = ".page{width:1200px}\n@media (max-width: 600px){.page{width:100%}}"
REQUIRED = ["audience", "pages", "tone", "brand_colours", "content", "constraints"]
BRIEF = {"audience": "local trade customers", "pages": ["Home", "Products", "Contact"], "tone": "plain and friendly",
         "brand_colours": ["#1b4d3e", "#f2f2f2"], "content": "Toolshop, 1 Mill Lane, Leeds. Open 8 to 6.",
         "constraints": ["semantic HTML", "no external JavaScript", "WCAG 2.2 AA contrast", "mobile first"]}


class Audit(HTMLParser):
    """Given: records lang, title, viewport, missing alt, heading jumps, empty links, inputs and labels."""

    def __init__(self):
        super().__init__()
        self.issues, self.inputs, self.labels = [], [], set()
        self.lang = self.title = self.viewport = self.in_title = self.in_a = False
        self.last_h, self.a_text, self.a_href = 0, "", ""

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html" and a.get("lang"):
            self.lang = True
        if tag == "title":
            self.in_title = True
        if tag == "meta" and a.get("name") == "viewport":
            self.viewport = True
        if tag == "img" and "alt" not in a:
            self.issues.append(f"img without alt: {a.get('src', '?')}")
        if re.fullmatch(r"h[1-6]", tag):
            level = int(tag[1])
            if self.last_h and level > self.last_h + 1:
                self.issues.append(f"heading jumps from h{self.last_h} to h{level}")
            self.last_h = level
        if tag == "a":
            self.in_a, self.a_text, self.a_href = True, "", a.get("href", "")
        if tag == "label" and a.get("for"):
            self.labels.add(a["for"])
        if tag == "input" and a.get("type") not in ("hidden", "submit"):
            self.inputs.append(a.get("id"))

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "a":
            if not self.a_text.strip():
                self.issues.append(f"empty link: {self.a_href}")
            self.in_a = False

    def handle_data(self, data):
        if self.in_title and data.strip():
            self.title = True
        if self.in_a:
            self.a_text += data


# ---------------------------------------------------------------- Step 1
def audit_html(html):
    """The checkable WCAG basics, in one pass."""
    parser = Audit()
    parser.feed(html)
    issues = []
    if not parser.lang:
        issues.append("missing lang on html")
    if not parser.title:
        issues.append("missing title")
    if not parser.viewport:
        issues.append("missing viewport meta")
    return issues + parser.issues + [f"input without label: {i}" for i in parser.inputs if i not in parser.labels]


# ---------------------------------------------------------------- Step 2
def luminance(hex_colour):
    """WCAG relative luminance."""
    h = hex_colour.lstrip("#")

    def channel(v):
        c = int(v, 16) / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = (channel(h[i:i + 2]) for i in (0, 2, 4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(fg, bg, large=False):
    """AA: 4.5 for normal text, 3 for large."""
    l1, l2 = sorted((luminance(fg), luminance(bg)), reverse=True)
    ratio = round((l1 + 0.05) / (l2 + 0.05), 2)
    return ratio, ratio >= (3 if large else 4.5)


# ---------------------------------------------------------------- Step 3
def page_weight(assets, budget_kb, mbps=1.6, rtt_ms=150):
    """Bytes are the first performance lever."""
    by_type = {}
    for name, kind, kb in assets:
        by_type[kind] = by_type.get(kind, 0) + kb
    total = sum(by_type.values())
    seconds = round(total * 8 / 1000 / mbps + 3 * rtt_ms / 1000, 2)
    over = {k: v - budget_kb[k] for k, v in sorted(by_type.items()) if k in budget_kb and v > budget_kb[k]}
    return {"total_kb": total, "by_type": dict(sorted(by_type.items())), "est_seconds": seconds, "over_budget": over}


# ---------------------------------------------------------------- Step 4
def breakpoints(css):
    """Mobile first: min-width breakpoints, no fixed widths."""
    found = [(kind, int(px)) for kind, px in MEDIA.findall(css)]
    mins = sorted(px for kind, px in found if kind == "min")
    maxs = sorted(px for kind, px in found if kind == "max")
    fixed = [int(w) for w in re.findall(r"(?<![-\w])width:\s*(\d+)px", css) if int(w) > 400]
    return {"min": mins, "max": maxs, "mobile_first": bool(mins) and not maxs, "fixed_widths": fixed}


# ---------------------------------------------------------------- Step 5
def site_prompt(brief):
    """A complete brief, real content, and an explicit ban on invention."""
    missing = [k for k in REQUIRED if not brief.get(k)]
    if missing:
        return None, missing
    lines = [f"Build a static website for {brief['audience']}.",
             f"Pages: {', '.join(brief['pages'])}.",
             f"Tone: {brief['tone']}.",
             f"Brand colours: {', '.join(brief['brand_colours'])}.",
             "Use only the content provided below; do not invent facts, prices, or testimonials.",
             f"Constraints: {'; '.join(brief['constraints'])}.",
             "Content:", brief["content"]]
    return "\n".join(lines), []


if __name__ == "__main__":
    print(audit_html(PAGE))
    print(contrast("#ffffff", "#e8590c"), contrast("#ffffff", "#e8590c", large=True))
    print(page_weight(AI_BUILT, BUDGET)["est_seconds"], page_weight(OPTIMISED, BUDGET)["est_seconds"])
    print(breakpoints(DESKTOP_FIRST))
    print(site_prompt({**BRIEF, "content": ""}))

@@step
{
  "stepNumber": 1,
  "title": "Audit the HTML",
  "instruction": "Implement audit_html(html). Create an Audit parser and feed it the HTML. Start the issues with 'missing lang on html', 'missing title', and 'missing viewport meta' for whichever are absent, in that order; then add the parser's own issues; then 'input without label: <id>' for each recorded input whose id has no matching label. Audit the AI-built page and a good page. This is semantic HTML and accessibility from Section 2. [MOD-9.7]",
  "hintConceptual": "Walk through the building checking the signs: is the language marked, is there a name on the door, does it fit a phone, are the floors numbered in order, does every picture have a caption and every form field a label?",
  "hintSyntax": "parser = Audit()\nparser.feed(html)\nissues = []\nif not parser.lang: issues.append(\"missing lang on html\")\nif not parser.title: issues.append(\"missing title\")\nif not parser.viewport: issues.append(\"missing viewport meta\")\nreturn issues + parser.issues + [f\"input without label: {i}\" for i in parser.inputs if i not in parser.labels]"
}
@@assert
_a = audit_html(PAGE)
assert _a == ["missing lang on html", "missing viewport meta", "heading jumps from h1 to h3", "img without alt: saw.jpg", "empty link: /cart", "input without label: postcode"], f"Six issues, got {_a}"
assert audit_html(GOOD) == [], "A clean page"
assert audit_html("<html><body></body></html>") == ["missing lang on html", "missing title", "missing viewport meta"], "An empty page"
assert audit_html('<html lang="en"><head><title>x</title><meta name="viewport" content="w"></head><body><a href="/x">Basket</a></body></html>') == [], "A link with text is named"
print("Step 1 passed: six accessibility issues found in the AI-built page.")

@@step
{
  "stepNumber": 2,
  "title": "Compute contrast ratios",
  "instruction": "Implement luminance(hex_colour): for each two-digit channel, divide by 255, linearise it (c / 12.92 if c <= 0.04045, else ((c + 0.055) / 1.055) ** 2.4), and return 0.2126 R + 0.7152 G + 0.0722 B. Implement contrast(fg, bg, large): with L1 the larger and L2 the smaller luminance, return the ratio (L1 + 0.05) / (L2 + 0.05) rounded to 2 places, and whether it meets 3 for large text or 4.5 otherwise. Check five colour pairs, including the reversed order and the large-text case. This is contrast from Section 2. [MOD-9.7]",
  "hintConceptual": "Measure how bright each colour really looks to the eye, green counting most and blue least, then compare the brighter with the darker; the bigger the gap, the easier the text is to read.",
  "hintSyntax": "h = hex_colour.lstrip(\"#\")\ndef channel(v):\n    c = int(v, 16) / 255\n    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4\nr, g, b = (channel(h[i:i + 2]) for i in (0, 2, 4))\nreturn 0.2126 * r + 0.7152 * g + 0.0722 * b\n\n# contrast\nl1, l2 = sorted((luminance(fg), luminance(bg)), reverse=True)\nratio = round((l1 + 0.05) / (l2 + 0.05), 2)\nreturn ratio, ratio >= (3 if large else 4.5)"
}
@@assert
assert contrast("#000000", "#ffffff") == (21.0, True) and contrast("#ffffff", "#000000") == (21.0, True), f"Maximum contrast, got {contrast('#000000', '#ffffff')}"
assert contrast("#777777", "#ffffff") == (4.48, False) and contrast("#767676", "#ffffff") == (4.54, True), "The famous grey threshold"
assert contrast("#ffffff", "#e8590c") == (3.58, False) and contrast("#ffffff", "#e8590c", large=True) == (3.58, True), "White on brand orange"
assert contrast("#999999", "#ffffff", large=True) == (2.85, False) and abs(luminance("#ffffff") - 1.0) < 1e-9 and luminance("#000000") == 0.0, "Light grey fails even large; luminance bounds"
print("Step 2 passed: #767676 passes at 4.54; white on the brand orange is 3.58.")

@@step
{
  "stepNumber": 3,
  "title": "Measure page weight",
  "instruction": "Implement page_weight(assets, budget_kb, mbps, rtt_ms). Sum the kilobytes by asset type; total them; estimate seconds as round(total * 8 / 1000 / mbps + 3 * rtt_ms / 1000, 2); list, in type order, the types over budget with their excess. Return total_kb, by_type (sorted by type), est_seconds, and over_budget. Measure the AI-built and optimised pages. This is performance from Section 2. [MOD-9.7]",
  "hintConceptual": "Weigh the parcel the visitor must carry home, item by item, compare each kind of item with its allowance, and estimate the walk on a slow road.",
  "hintSyntax": "by_type = {}\nfor name, kind, kb in assets:\n    by_type[kind] = by_type.get(kind, 0) + kb\ntotal = sum(by_type.values())\nseconds = round(total * 8 / 1000 / mbps + 3 * rtt_ms / 1000, 2)\nover = {k: v - budget_kb[k] for k, v in sorted(by_type.items()) if k in budget_kb and v > budget_kb[k]}\nreturn {\"total_kb\": total, \"by_type\": dict(sorted(by_type.items())), \"est_seconds\": seconds, \"over_budget\": over}"
}
@@assert
_w = page_weight(AI_BUILT, BUDGET)
assert _w == {"total_kb": 3260, "by_type": {"font": 110, "image": 2580, "script": 510, "style": 60}, "est_seconds": 16.75, "over_budget": {"image": 2080, "script": 210}}, f"The heavy page, got {_w}"
assert page_weight(OPTIMISED, BUDGET) == {"total_kb": 508, "by_type": {"font": 60, "image": 228, "script": 180, "style": 40}, "est_seconds": 2.99, "over_budget": {}}, "The optimised page"
assert page_weight([], BUDGET) == {"total_kb": 0, "by_type": {}, "est_seconds": 0.45, "over_budget": {}} and page_weight(OPTIMISED, BUDGET, mbps=16)["est_seconds"] == 0.7, "Empty page; faster connection"
print("Step 3 passed: 3,260 KB takes about 16.75 s on a slow connection; 508 KB about 3 s.")

@@step
{
  "stepNumber": 4,
  "title": "Check responsive breakpoints",
  "instruction": "Implement breakpoints(css). Use MEDIA to find (min or max, pixels) pairs; return the sorted min widths, the sorted max widths, mobile_first (True when there is at least one min width and no max width), and fixed_widths: the pixel values over 400 from 'width: Npx' declarations that are not part of min-width or max-width. Check a mobile-first and a desktop-first stylesheet. This is responsive design from Section 2. [MOD-9.7]",
  "hintConceptual": "A room designed for the smallest space first, with extra furniture added as it grows, adapts better than a grand room squeezed down with exceptions.",
  "hintSyntax": "found = [(kind, int(px)) for kind, px in MEDIA.findall(css)]\nmins = sorted(px for kind, px in found if kind == \"min\")\nmaxs = sorted(px for kind, px in found if kind == \"max\")\nfixed = [int(w) for w in re.findall(r\"(?<![-\\w])width:\\s*(\\d+)px\", css) if int(w) > 400]\nreturn {\"min\": mins, \"max\": maxs, \"mobile_first\": bool(mins) and not maxs, \"fixed_widths\": fixed}"
}
@@assert
assert breakpoints(MOBILE_FIRST) == {"min": [768, 1200], "max": [], "mobile_first": True, "fixed_widths": []}, f"Mobile first, got {breakpoints(MOBILE_FIRST)}"
assert breakpoints(DESKTOP_FIRST) == {"min": [], "max": [600], "mobile_first": False, "fixed_widths": [1200]}, "Desktop first with a fixed width"
assert breakpoints(".c{max-width:1200px;min-width:320px}") == {"min": [], "max": [], "mobile_first": False, "fixed_widths": []}, "max-width and min-width properties are not fixed widths"
assert breakpoints(".a{width:300px}")["fixed_widths"] == [] and breakpoints("") == {"min": [], "max": [], "mobile_first": False, "fixed_widths": []}, "Small widths; empty CSS"
print("Step 4 passed: the 1,200 px page with a max-width patch is not mobile first.")

@@step
{
  "stepNumber": 5,
  "title": "Write a complete brief",
  "instruction": "Implement site_prompt(brief). If any REQUIRED field is missing or empty, return (None, the missing fields in order). Otherwise return the prompt and an empty list. The prompt is these lines joined by newlines: 'Build a static website for <audience>.', 'Pages: <pages joined by \", \">.', 'Tone: <tone>.', 'Brand colours: <colours joined by \", \">.', 'Use only the content provided below; do not invent facts, prices, or testimonials.', 'Constraints: <constraints joined by \"; \">.', 'Content:', and the content. Build the prompt and test an incomplete brief. This is prompting an AI to build a site from Section 2. [MOD-9.7]",
  "hintConceptual": "Hand the builder a complete order form, with the real words to use and the rules the finished building must pass, and refuse to send an order with blanks the builder would fill with guesses.",
  "hintSyntax": "missing = [k for k in REQUIRED if not brief.get(k)]\nif missing:\n    return None, missing\nlines = [f\"Build a static website for {brief['audience']}.\", f\"Pages: {', '.join(brief['pages'])}.\", f\"Tone: {brief['tone']}.\", f\"Brand colours: {', '.join(brief['brand_colours'])}.\", \"Use only the content provided below; do not invent facts, prices, or testimonials.\", f\"Constraints: {'; '.join(brief['constraints'])}.\", \"Content:\", brief[\"content\"]]\nreturn \"\\n\".join(lines), []"
}
@@assert
_p, _m = site_prompt(BRIEF)
assert _m == [] and _p.splitlines()[0] == "Build a static website for local trade customers." and _p.splitlines()[-1] == "Toolshop, 1 Mill Lane, Leeds. Open 8 to 6.", f"A complete prompt, got {_p!r}"
assert "Constraints: semantic HTML; no external JavaScript; WCAG 2.2 AA contrast; mobile first." in _p and "do not invent facts, prices, or testimonials" in _p and "Pages: Home, Products, Contact." in _p, "Constraints and the no-invention rule"
assert site_prompt({**BRIEF, "tone": "", "content": None}) == (None, ["tone", "content"]), "Incomplete brief"
assert site_prompt({}) == (None, REQUIRED), "Empty brief"
print("Step 5 passed: a brief without real content is refused before the AI can invent it.")
