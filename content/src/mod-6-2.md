@@meta
{
  "moduleId": "MOD-6.2",
  "slug": "mod-6-2",
  "unitId": "UNIT-6",
  "unitTitle": "Unit 6: AI Content Creation Masterclass",
  "title": "AI Images",
  "difficulty": "Foundational",
  "estimatedMinutes": 90,
  "citations": [
    { "title": "High-Resolution Image Synthesis with Latent Diffusion Models", "source": "arXiv", "url": "https://arxiv.org/abs/2112.10752" },
    { "title": "Image-to-image", "source": "Hugging Face Diffusers Docs", "url": "https://huggingface.co/docs/diffusers/using-diffusers/img2img" },
    { "title": "Adding Conditional Control to Text-to-Image Diffusion Models (ControlNet)", "source": "arXiv", "url": "https://arxiv.org/abs/2302.05543" },
    { "title": "LoRA: Low-Rank Adaptation of Large Language Models", "source": "arXiv", "url": "https://arxiv.org/abs/2106.09685" },
    { "title": "Real-ESRGAN: Training Real-World Blind Super-Resolution with Pure Synthetic Data", "source": "arXiv", "url": "https://arxiv.org/abs/2107.10833" },
    { "title": "Copyright and Artificial Intelligence, Part 2: Copyrightability", "source": "U.S. Copyright Office", "url": "https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf" }
  ],
  "videoLibrary": [
    {
      "id": "VID-6.2-1",
      "title": "How Stable Diffusion Works (AI Image Generation)",
      "creator": "Gonkee",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=sFztPP9qPRc",
      "timingInstruction": "Watch after reading Section 1, before the settings in Section 2",
      "keyTakeaway": "Walks through the parts of a latent diffusion model, the compressed latent, the denoising loop, and the text conditioning, with animations."
    },
    {
      "id": "VID-6.2-2",
      "title": "AI art, explained",
      "creator": "Vox",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=SVcsDDABEkM",
      "timingInstruction": "Watch before the licensing part of Section 2, for the artists' side of the argument about training data",
      "keyTakeaway": "An accessible account of how text-to-image models arrived and the questions about style, credit, and consent that they raised."
    },
    {
      "id": "VID-6.2-3",
      "title": "How Diffusion Models Work (Short Course)",
      "creator": "DeepLearning.AI",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/projects/how-diffusion-models-work-project",
      "timingInstruction": "Take after Section 2 if you want to see the denoising loop built in code",
      "keyTakeaway": "Builds a small diffusion model step by step: adding noise, training a network to predict it, and sampling with and without context."
    },
    {
      "id": "VID-6.2-4",
      "title": "Introduction to Image Generation",
      "creator": "Google Cloud",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/introduction-to-image-generation",
      "timingInstruction": "Take as a short recap after completing the lab",
      "keyTakeaway": "A compact overview of the families of image generation model and where diffusion fits among them."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Latents, Strength, Masks, Tool Choice, and Upscaling",
    "context": "A shop is producing product and editorial images with AI and needs to understand the settings well enough to stop wasting generations. You will compute the size of the compressed image a model really works on, the effect of the strength setting when transforming an existing picture, the blend that an inpainting mask performs, a rule for choosing a kind of tool for a job, and a plan for upscaling an image for print.",
    "language": "python"
  }
}

@@reading
# AI Images

Module 5.11 was about the words of an image prompt. This chapter is about everything else that goes into producing a usable image: the settings beside the prompt, the choice of tool, the editing that follows the first generation, and the question of whether you may use the result.

The aim is practical. A person who understands what the steps, strength, and mask settings do, and which kind of tool suits which job, gets to a usable image in a handful of attempts. A person who does not presses the generate button a hundred times.

## 1. First-Principles Mental Model & Intuition

### A sculptor and a block

A sculptor begins with a rough block and removes material until a figure appears. Early cuts decide the pose and proportions. Late cuts decide the fingernails.

A diffusion model works the same way with noise. It starts from a field of random static and removes noise in steps. Early steps settle the composition: where the subject is, what the large shapes are. Late steps add texture and detail. The prompt is the sculptor's instruction about what the figure should be.

Three settings follow directly from this picture.

- **Steps** is how many cuts are made. Too few leaves the figure rough. Past a certain number, more cuts change nothing visible.
- **The seed** is the block itself. A different block gives a different figure from the same instruction.
- **Strength**, when starting from an existing picture, is how much of the finished statue is covered back up with rough stone before carving resumes. A little, and only the surface changes. A lot, and the pose can change too.

### The pipeline of a single image

```text
   PROMPT, REFERENCES                  SETTINGS
          |                               |
          v                               v
   +---------------------------------------------------+
   |  1. GENERATE    several candidates, low cost      |
   |  2. SELECT      a person picks one                |
   |  3. EDIT        fix a region, extend the frame    |
   |  4. UPSCALE     to the size the use needs         |
   |  5. CHECK       hands, text, logos, rights        |
   +---------------------------------------------------+
          |
          v
   FINISHED IMAGE, with its prompt, seed, and tool recorded
```

Most of the skill is in steps 2 to 5. Generation is the cheap part. Choosing well, repairing what is nearly right, and knowing when a picture cannot be used are what separate a usable image from a generated one.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Why models work on a compressed image

A picture of 512 by 512 pixels with three colour channels is 786,432 numbers. Denoising that directly, dozens of times, is slow.

The design that made image generation practical, latent diffusion, adds a compressor. An encoder shrinks the picture by a factor of 8 in each direction into a small grid called a **latent**, with four channels. The model denoises the latent. A decoder turns the finished latent back into pixels.

For an image of width $W$ and height $H$:

$$
\text{latent size} = \frac{H}{8} \times \frac{W}{8} \times 4
$$

A 512 by 512 picture becomes a latent of 64 by 64 by 4, which is 16,384 numbers: 48 times fewer. That ratio holds at any size.

Two practical consequences follow. Image dimensions are generally required to be multiples of 8, and many tools restrict them further. And very fine detail, such as small lettering and distant faces, lives below the resolution of the latent, where one latent cell covers an 8 by 8 block of pixels. This is one reason small text and small faces come out garbled, and why generating larger or upscaling helps.

### The settings

| Setting | What it controls | Practical advice |
|---|---|---|
| **Steps** | How many denoising steps are run | Use the tool's default. More costs time for little gain |
| **Guidance scale** | How literally the prompt is followed | Module 5.11 gave the formula. Stay in the middle of the range |
| **Seed** | The starting noise | Record it. Change it to explore, hold it to compare |
| **Resolution and aspect ratio** | The size and shape | Generate at the model's native size, then upscale |
| **Sampler** | The numerical method used for each step | Leave at the default unless you have a reason |
| **Strength** | With an input image, how much of it is replaced by noise | Low to retouch, high to reimagine |

On the fourth row: each model was trained at particular sizes. Asked for something much larger, it tends to repeat the subject, producing two heads or a doubled horizon, because it is composing as if for several smaller pictures. Generate at a size the model knows and enlarge afterwards.

### Starting from an image

**Image-to-image** generation begins from a picture you supply. Noise is added to it, and the model denoises from there. The strength setting decides how much noise.

If a run has $N$ steps and the strength is $s$, between 0 and 1, the model adds noise corresponding to $s \times N$ steps and then runs that many:

$$
\text{steps run} = \lfloor s \times N \rfloor
$$

The documentation of the widely used Diffusers library gives the example: at 50 steps and a strength of 0.8, the picture is noised to the level of step 40 and then denoised for 40 steps. At a strength of 1.0 the input is almost entirely ignored.

| Strength | Effect | Use |
|---|---|---|
| 0.2 to 0.4 | Texture and detail change. Composition is kept | Clean up, restyle lightly |
| 0.5 to 0.7 | Shapes shift. The layout is recognisable | A new version of a sketch or photograph |
| 0.8 to 1.0 | Little of the original survives | Use the input as a loose suggestion |

### Editing a region

**Inpainting** regenerates one part of a picture and keeps the rest. You paint a **mask** over the region to change and describe what should be there.

The final picture is a blend. If $m$ is the mask value at a pixel, 1 inside the region and 0 outside, with $g$ the generated value and $o$ the original:

$$
\text{result} = m \times g + (1 - m) \times o
$$

Where the mask is 0 the original is untouched, exactly. Where it is 1 the new content replaces it. A mask with soft edges, values between 0 and 1, mixes the two and hides the seam. A hard-edged mask often leaves a visible outline.

**Outpainting** is the same operation with the mask outside the original frame, extending the picture. It is how a square image becomes a wide banner.

The chat-based image models described in Module 5.11 do the same job from a sentence: "remove the cup from the table and change nothing else". They are convenient, and they sometimes alter parts of the picture you did not mention. A mask guarantees that the rest is untouched.

### Control beyond the prompt

| Technique | Supplies | Use |
|---|---|---|
| **ControlNet** | A structural guide: an outline, a depth map, or a pose | Keep a composition or a pose while changing everything else |
| **A reference image or adapter** | An example of a style or a subject | Match a look or carry a character across pictures |
| **LoRA** | A small add-on trained on a few dozen images | Teach a model one product, person, or house style |

ControlNet, from a 2023 paper, feeds the model a second image that fixes the structure, such as the edges of a room or the skeleton of a figure, while the prompt decides the appearance. A LoRA is a small set of additional weights trained on your own examples and loaded alongside the main model. It is how a brand gets its actual product, and not an approximation of it, into generated pictures.

### Style consistency

A set of images that belong together needs deliberate work. In rising order of effort and reliability:

1. **A fixed style block** in every prompt, as in Module 5.11.
2. **A style reference image**, where the tool accepts one.
3. **A style sheet**: a saved page of approved images with their prompts, seeds, and settings, used as references for everything new.
4. **A LoRA** trained on the approved images.

And one rule above all: stay on one model and one version for a project. A model update changes the look, and a seed means nothing across versions.

### Upscaling

Models generate at around one megapixel. A print or a large banner needs far more. **Upscaling** enlarges an image, and there are two kinds.

| Kind | How it works | Result |
|---|---|---|
| Interpolation | Averages neighbouring pixels | Bigger and blurrier. Adds nothing |
| AI upscaling | A model trained to predict fine detail from coarse | Sharper, with plausible detail added |

AI upscalers, of which Real-ESRGAN is a well-known open example, typically enlarge by a factor of 2 or 4 per pass. The word "plausible" matters. The detail is invented to look right. On skin, foliage, and fabric this is welcome. On a face, a product label, or lettering, an upscaler can change what was there. Check them after every pass.

The size needed for print is arithmetic. At a printing resolution of $d$ dots per inch, a width of $w$ inches needs

$$
\text{pixels} = w \times d
$$

A 24-inch poster at 300 dots per inch needs 7,200 pixels across. From a 1,024-pixel image that is a factor of about 7, which is a 4 times pass followed by a 2 times pass.

### Choosing a tool

Tools change every few months. The kinds of tool are stable. At the time of writing (November 2026), the landscape looks like this.

| Kind | Strength | Examples at the time of writing |
|---|---|---|
| General image models | Striking pictures from a prompt | Midjourney, FLUX, Stable Diffusion |
| Chat-based image models | Editing by instruction, following long descriptions, text in images | Image generation in ChatGPT and in Gemini |
| Text-rendering specialists | Posters, signs, and layouts with correct lettering | Ideogram |
| Vector generators | Logos and icons as editable shapes, not pixels | Recraft |
| Licensed-data models | Trained on licensed content, with commercial terms to match | Adobe Firefly |
| Open models run locally | Privacy, control, custom training, no fee per image | Stable Diffusion and open FLUX variants on your own hardware |

| The job | Reach for |
|---|---|
| A logo or an icon | A vector generator, then a designer |
| Changing one thing in an existing photograph | A chat-based editing model, or inpainting with a mask |
| A poster with a headline | A text-rendering model |
| Confidential product images | An open model run locally |
| Advertising for a cautious client | A licensed-data model |
| An atmospheric illustration | A general image model |

Budget by attempts, not by price per image. If one generation in $k$ is usable and you need $n$ images, expect to make about $n \times k$. Six images at one keeper in eight is 48 generations. The settings and methods in this chapter exist to lower $k$.

### Licensing and rights

Four separate questions are often run together.

**May you use the output commercially?** That is set by the tool's terms and often by your plan. Free tiers and some open models are restricted to non-commercial use. Read the terms for the plan you are on.

**Do you own it?** Module 5.11 noted that in the United States copyright requires human authorship. The Copyright Office's 2025 report on the question concluded that prompts alone do not make their writer the author of the output. What a person adds, selecting, arranging, and substantially modifying, can be protected. An image used exactly as generated may be free for anyone to copy.

**Was the model lawfully trained?** This is being decided in courts in several countries, and results so far are mixed. In a closely watched case in the United Kingdom, decided in November 2025, an image library's main copyright claims against a model developer failed, while narrow trademark claims about reproduced watermarks succeeded. Cases brought by film studios against image generators in the United States are continuing. A user is rarely the target of such claims, but some clients want assurance, and the licensed-data models, some of which offer indemnity on business plans, exist to give it.

**Does the picture itself infringe?** A generated image that shows a trademarked character, a recognisable real person, or a near-copy of an existing artwork carries the same risk as one drawn by hand. The model's having made it is no defence.

Lastly, **provenance**. Many tools attach Content Credentials, a signed record of how a file was made, and some embed an invisible watermark. Platforms read these and add AI labels automatically, as Module 6.1 described. Assume a generated image can be identified as one.

### Complexity

Generation time grows with the number of steps and with the area of the image. The latent has one sixty-fourth as many positions as the image has pixels, which is where the speed comes from. Image-to-image runs only the fraction of steps given by the strength. The cost that matters to a project is the number of generations per usable image.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, the size of what the model works on, and the steps an image-to-image run performs.

```python
import math

def latent_shape(width, height, factor=8, channels=4):
    if width % factor or height % factor:
        raise ValueError(f"width and height must be multiples of {factor}")
    latent_width, latent_height = width // factor, height // factor
    pixel_values = width * height * 3
    latent_values = latent_width * latent_height * channels
    return {"latent": (latent_height, latent_width, channels), "pixel_values": pixel_values,
            "latent_values": latent_values, "compression": round(pixel_values / latent_values, 1)}

def img2img_steps(steps, strength):
    if not 0 <= strength <= 1:
        raise ValueError("strength must be between 0 and 1")
    run = min(int(steps * strength), steps)
    return {"run": run, "skipped": steps - run}

print(latent_shape(512, 512))
print(latent_shape(1344, 768))
try:
    latent_shape(1000, 750)
except ValueError as error:
    print(error)
print(img2img_steps(50, 0.8), img2img_steps(50, 0.3), img2img_steps(50, 1.0), img2img_steps(50, 0))
```

- **`latent_shape` divides each dimension by 8.** A 512 by 512 picture is a latent of 64 by 64 with four channels.
- **The compression is 48 times, at every size.** 786,432 numbers become 16,384. The wide 1344 by 768 picture gives the same ratio.
- **Dimensions that are not multiples of 8 are refused.** A width of 1,000 divides evenly, and a height of 750 does not. Real tools either reject such a size or silently change it, which is why a requested size and a delivered one sometimes differ.
- **`img2img_steps` is the strength formula.** At 50 steps and a strength of 0.8, 40 steps are run and 10 are skipped, as in the library's documentation.
- **At 0.3 only 15 steps run.** The picture is lightly noised and lightly repaired, so its composition survives.
- **At 1.0 all 50 run, and at 0 none do.** Full strength is ordinary generation with the input almost irrelevant. Zero strength returns the input.

Next, what a mask does.

```python
def inpaint(original, generated, mask):
    return [[round(m * g + (1 - m) * o, 3) for o, g, m in zip(original_row, generated_row, mask_row)]
            for original_row, generated_row, mask_row in zip(original, generated, mask)]

ORIGINAL = [[0.2, 0.2, 0.2, 0.2], [0.2, 0.8, 0.8, 0.2], [0.2, 0.8, 0.8, 0.2], [0.2, 0.2, 0.2, 0.2]]
GENERATED = [[0.5, 0.5, 0.5, 0.5], [0.5, 0.1, 0.1, 0.5], [0.5, 0.1, 0.1, 0.5], [0.5, 0.5, 0.5, 0.5]]
HARD_MASK = [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]
SOFT_MASK = [[0, 0, 0, 0], [0.5, 1, 1, 0.5], [0.5, 1, 1, 0.5], [0, 0, 0, 0]]
for row in inpaint(ORIGINAL, GENERATED, HARD_MASK):
    print(row)
print(inpaint(ORIGINAL, GENERATED, SOFT_MASK)[1])
```

- **Three small grids stand in for pictures.** Each number is the brightness of one pixel. The original has a bright square in the middle. The generated picture has a dark square there, and a different background.
- **`inpaint` is the blend from Section 2, pixel by pixel.** The mask value times the generated pixel, plus the remainder times the original.
- **With the hard mask, only the four centre pixels change.** They take the generated value of 0.1. The twelve around them are exactly the original 0.2, although the generated picture had 0.5 there. The model's ideas about the background are discarded.
- **This is the guarantee a mask gives.** Whatever is outside it cannot change. An instruction in a chat-based tool to "change nothing else" is a request. A mask is arithmetic.
- **With the soft mask, the edge pixels are a mixture.** The second row begins 0.35, halfway between the original 0.2 and the generated 0.5. A gradual transition hides the join.

Then, a rule for choosing a kind of tool.

```python
def choose_tool(job):
    if job.get("vector"):
        return "vector generator"
    if job.get("edit_existing"):
        return "chat-based editing model"
    if job.get("text_in_image"):
        return "text-rendering model"
    if job.get("private"):
        return "open model run locally"
    if job.get("commercial_safe"):
        return "licensed-data model"
    return "general image model"

print(choose_tool({"vector": True, "text_in_image": True}))
print(choose_tool({"edit_existing": True}), "/", choose_tool({"text_in_image": True, "commercial_safe": True}))
print(choose_tool({"private": True}), "/", choose_tool({"commercial_safe": True}), "/", choose_tool({}))
```

- **The function returns a kind of tool, not a brand.** Brands change within a year. The kinds in Section 2's table have been stable for longer.
- **The order of the checks is the order of how much a requirement constrains the choice.** A logo must be a vector whatever else is true, so that is asked first. Editing an existing picture comes next, then lettering, then privacy, then licensing.
- **A logo with text is still a vector job.** The first example has two requirements, and the more constraining wins.
- **A poster for a cautious client comes out as a text-rendering model.** The rule returns one answer. In practice you would look for a tool that meets both needs, and the function's order tells you which need to give up last.
- **With no special requirement, a general image model.** That covers most illustrative work.

Finally, planning an upscale for print.

```python
def upscale_plan(width, height, print_width_inches, dpi=300):
    needed = math.ceil(print_width_inches * dpi)
    passes = []
    while width < needed:
        factor = 4 if width * 2 < needed else 2
        passes.append(factor)
        width, height = width * factor, height * factor
    return {"needed_width": needed, "passes": passes, "final": (width, height), "megapixels": round(width * height / 1e6, 1)}

print(upscale_plan(1024, 1024, 24))
print(upscale_plan(1024, 1024, 3))
print(upscale_plan(1344, 768, 8))
```

- **The width needed is the print width times the dots per inch.** A 24-inch poster at 300 dots per inch needs 7,200 pixels.
- **Passes are chosen as 2 times or 4 times.** If doubling would still fall short, the function takes a 4 times pass. Otherwise it takes a 2 times pass and stops.
- **From 1,024 pixels, the poster needs a 4 times pass and then a 2 times pass.** The result is 8,192 pixels across, 67 megapixels, comfortably over the 7,200 needed.
- **A 3-inch print needs no upscaling.** It needs 900 pixels and the image has 1,024.
- **The wide image for an 8-inch print needs one 2 times pass.** It ends at 2,688 by 1,536.
- **Every pass is a chance for invented detail.** Two passes mean two inspections of faces, labels, and lettering.

**Complexity.** `latent_shape`, `img2img_steps`, and `choose_tool` are constant time. `inpaint` is linear in the number of pixels. `upscale_plan` loops once per pass, and a handful of passes covers any realistic size.

### A record for every image you keep

```text
Purpose:      [where it will be used, and at what size]
Tool:         [name, model, and version]         Plan: [which licence terms apply]
Prompt:       [the full text]                    Negative: [if any]
Seed:         [number]     Size: [W x H]         Steps / guidance: [values]
References:   [files used for style, subject, or structure]
Edits:        [inpainting, outpainting, upscaling passes, manual retouching]
Checked:      [hands, faces, text, logos, real people, similarity to existing work]
```

### Inspecting an image before it is used

| Look at | For |
|---|---|
| Hands, teeth, eyes, ears | Extra or fused parts, mismatched pairs |
| Any lettering | Misspellings and invented characters |
| Edges of objects | Things that melt into each other |
| Shadows and reflections | Light coming from two directions |
| Background figures | Distorted faces at small sizes |
| Logos and products | Marks that resemble a real brand |
| The whole picture, small | Whether it reads at the size it will be shown |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Rerolling when an edit would do.** A picture that is right except for one hand is regenerated fifty times in the hope of a perfect one. Mask the hand and regenerate that region.

**Generating at the final size.** Asking a model for a very large image directly gives repeated subjects and odd anatomy. Generate at the native size and upscale.

**Too many steps.** Doubling the steps doubles the wait and rarely improves the picture. If the result is poor at the default, the prompt, the guidance, or the model is the problem.

**The wrong strength.** At 0.9 the reference photograph is gone. At 0.1 nothing happens. For "the same picture, restyled", begin around 0.4 to 0.6 and adjust.

**Hard-edged masks.** A crisp mask around a replaced object leaves a halo. Feather the edge, and make the mask a little larger than the object so that its shadow is regenerated too.

**Upscaling a face without checking.** An upscaler invents detail, and on a face that can mean a different person. Compare before and after at full size, and use the tools' face-preserving options where a real person is shown.

**Trusting text.** Lettering that looks right at a glance has a transposed pair of letters. Read every word, or add the text afterwards in a design tool, which is still the dependable method for anything longer than a short headline.

**Logos from an image model.** A logo must be a vector, work in one colour, and be distinctive enough to register. A raster image from a general model is none of those. Use a vector generator for ideas and a designer for the result.

**One tool for everything.** Each kind of tool is poor at something. People who get good results keep two or three, and move a picture between them: generate in one, edit in another, upscale in a third.

**Style drift across a project.** Ten images made over two weeks, on a model that updated in the middle, do not match. Fix the model and version, keep a style sheet, and generate a set in one sitting where possible.

**No record.** The one image that worked cannot be reproduced or extended, because nobody saved the prompt and seed. Keep the record above for anything you intend to use.

**Free-tier images in paid work.** Many free plans and some open models forbid commercial use. A picture made on the wrong plan is a liability. Check the terms before the work begins, not after the client approves it.

**Assuming ownership.** A picture used exactly as generated may have no copyright protection, so a competitor may copy it. Where exclusivity matters, add substantial work of your own, and keep the files that show it.

**Real people and brands.** A realistic image of a real person, or one containing a recognisable mark, is risky however it was made, and platform rules add disclosure duties. Avoid both unless you have permission.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A diffusion model carves an image out of noise in steps, working on a latent that is one eighth of the size in each direction, 48 times fewer numbers than the pixels. The settings follow from that picture: steps set how long the carving goes on, the seed is the starting noise, guidance sets how literally the prompt is followed, and resolution should be the model's native size. Starting from an existing image, a strength $s$ over $N$ steps runs $\lfloor sN \rfloor$ of them, so low strength retouches and high strength reimagines. Inpainting blends new content into a masked region as $m g + (1 - m) o$, leaving everything outside the mask exactly as it was. Structure guides, reference images, and small trained add-ons give control beyond the prompt, and a style sheet on a fixed model version keeps a set consistent. Upscaling adds invented detail and must be checked. Tools come in kinds, general, chat-based, text-rendering, vector, licensed-data, and local, and the job decides the kind. Using an image commercially depends on the tool's terms for your plan, owning it depends on human authorship, and the picture itself must not infringe.

**Question 1.** A model generates images of 1,024 by 1,024 pixels. How large is the latent it works on, and by what factor is the image compressed? A designer transforms a sketch using 40 steps at a strength of 0.25, and then again at a strength of 0.75. How many steps run in each case, and what difference should the designer expect? Finally, how many upscaling passes are needed to print the result 18 inches wide at 300 dots per inch?

<details>
<summary>View Answer</summary>

Each dimension is divided by 8, so the latent is 128 by 128, with four channels: 65,536 numbers. The image has 1,024 times 1,024 times 3, which is 3,145,728 numbers, so the compression is 48 times, the same ratio as at any other size. At 40 steps and a strength of 0.25, the model runs 10 steps. The sketch is covered with a small amount of noise and lightly repaired, so its composition, its outlines, and its proportions survive, and only texture, shading, and finish change. At a strength of 0.75 it runs 30 steps. Most of the sketch is buried in noise before denoising begins, so the model is free to move the large shapes, and the result may share only the rough layout and colour of the original. The designer should use the lower value to render the sketch faithfully and the higher one to get a looser reinterpretation, and try values in between if neither is right. For the print, 18 inches at 300 dots per inch needs 5,400 pixels across. From 1,024 pixels, doubling gives 2,048, which is still short, so the first pass is 4 times, to 4,096. That is still under 5,400, and doubling it gives 8,192, which is enough, so the second pass is 2 times. Two passes in all, ending at 8,192 pixels. Because each pass invents detail, the designer should inspect faces, lettering, and fine lines after each one.

</details>

**Question 2.** A product photograph is perfect except that the label on the bottle is misspelt. A colleague suggests regenerating the whole image with a corrected prompt. Explain why that is a poor plan, describe better methods, and say which gives the stronger guarantee that the rest of the photograph is unchanged.

<details>
<summary>View Answer</summary>

Regenerating the whole image throws away everything that was right. A new generation begins from noise, and even with the same seed, a changed prompt shifts the composition, the lighting, and the bottle's shape. The colleague would be searching again for a picture as good as the one already in hand, with no assurance that the label will be spelt correctly this time, since lettering is exactly what image models get wrong. If one generation in eight was usable before, the same odds apply again. The first better method is inpainting. Paint a mask over the label, a little larger than the text and with a soft edge, describe the label with the exact words in quotation marks, and regenerate only that region, several times if needed, using a model that renders text well. The second is to ask a chat-based image model to correct the spelling on the label and change nothing else, which is quicker and often works. A third, and for a product label the most dependable, is to remove the text by inpainting a blank label and set the real wording in a design tool, where the spelling and the typeface are under direct control. The mask gives the stronger guarantee. The inpainted result is a blend in which every pixel outside the mask is the original value, exactly, so the rest of the photograph cannot change. A chat-based edit is a request: the model regenerates the picture as it understands the instruction, and it may subtly alter the bottle's reflections or the background without saying so. For a client's product image, that is worth checking by comparing the two versions closely, or avoiding by using the mask.

</details>

**Question 3.** A marketing agency plans to produce a campaign's images with AI for a client who is nervous about legal risk. The agency intends to use a free plan on a general image model, name a famous living illustrator in the prompts for style, and use the images exactly as generated. Identify the problems and propose a safer approach.

<details>
<summary>View Answer</summary>

There are four separate problems. The first is permission to use the output: free plans frequently forbid commercial use, so images made on one may breach the tool's terms however good they are. The agency must read the terms for the plan it is on and move to a plan that permits commercial work. The second is the style prompt. Naming a living illustrator to imitate their manner is legally contested and widely regarded as unfair to the artist, and for a nervous client it is also a reputational risk if the resemblance is noticed. The qualities wanted should be described directly, the line, the palette, the composition, which also gives the agency a style it can reproduce in other tools. The third is ownership. In the United States an image used exactly as generated may have no copyright protection, because protection depends on human authorship and a prompt alone has been judged insufficient. The client could find a competitor copying the campaign with no remedy. The agency should add real work of its own, compositing, retouching, typography, and arrangement, and keep the working files that show it. The fourth is the content of the pictures: anything that resembles a trademarked character, a real person, or an existing artwork is a risk whoever or whatever drew it, so each image needs a check before delivery. A safer approach is to use a model trained on licensed material, on a business plan with clear commercial terms and indemnity if the client wants it. Prompts should describe qualities and not people. The work should stay on one model version with a style sheet. Every final image should have a record of tool, plan, prompt, seed, edits, and checks. And the agency should tell the client plainly that the images are AI-assisted, since the files may carry provenance data that reveals it in any case.

</details>

@@starter
"""
Lab: Latents, Strength, Masks, Tool Choice, and Upscaling
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import math

# Tiny 4 x 4 "pictures": each number is the brightness of one pixel.
ORIGINAL = [[0.2, 0.2, 0.2, 0.2], [0.2, 0.8, 0.8, 0.2], [0.2, 0.8, 0.8, 0.2], [0.2, 0.2, 0.2, 0.2]]
GENERATED = [[0.5, 0.5, 0.5, 0.5], [0.5, 0.1, 0.1, 0.5], [0.5, 0.1, 0.1, 0.5], [0.5, 0.5, 0.5, 0.5]]
HARD_MASK = [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]
SOFT_MASK = [[0, 0, 0, 0], [0.5, 1, 1, 0.5], [0.5, 1, 1, 0.5], [0, 0, 0, 0]]


# ---------------------------------------------------------------- Step 1
def latent_shape(width, height, factor=8, channels=4):
    """If width or height is not a multiple of factor, raise ValueError.
    The latent is (height // factor) rows by (width // factor) columns with `channels` channels.
    Return {"latent": (latent height, latent width, channels),
            "pixel_values": width * height * 3,
            "latent_values": latent width * latent height * channels,
            "compression": pixel_values / latent_values, rounded to 1 place}."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def img2img_steps(steps, strength):
    """If strength is not between 0 and 1 inclusive, raise ValueError.
    run = int(steps * strength), but never more than steps.
    Return {"run": run, "skipped": steps - run}."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def inpaint(original, generated, mask):
    """All three are grids (lists of rows) of the same size. For each pixel:
        result = mask * generated + (1 - mask) * original        rounded to 3 places
    Return the new grid."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def choose_tool(job):
    """job is a dict of requirements that are true for this job. Check in this order and
    return the first that applies:
        job["vector"]            -> "vector generator"
        job["edit_existing"]     -> "chat-based editing model"
        job["text_in_image"]     -> "text-rendering model"
        job["private"]           -> "open model run locally"
        job["commercial_safe"]   -> "licensed-data model"
        otherwise                -> "general image model"
    A missing key counts as false."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def upscale_plan(width, height, print_width_inches, dpi=300):
    """needed = math.ceil(print_width_inches * dpi) pixels across.
    While the width is below needed: use a factor of 4 if width * 2 is still below needed,
    otherwise 2. Record the factor and multiply width and height by it.
    Return {"needed_width": needed, "passes": the list of factors, "final": (width, height),
            "megapixels": width * height / 1e6 rounded to 1 place}."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("latent  :", latent_shape(512, 512))
    print("steps   :", img2img_steps(50, 0.8))
    print("inpaint :", inpaint(ORIGINAL, GENERATED, HARD_MASK))
    print("tool    :", choose_tool({"text_in_image": True}))
    print("upscale :", upscale_plan(1024, 1024, 24))

@@solution
"""
Lab solution: Latents, Strength, Masks, Tool Choice, and Upscaling
Standard library only.
"""
import math

# Tiny 4 x 4 "pictures": each number is the brightness of one pixel.
ORIGINAL = [[0.2, 0.2, 0.2, 0.2], [0.2, 0.8, 0.8, 0.2], [0.2, 0.8, 0.8, 0.2], [0.2, 0.2, 0.2, 0.2]]
GENERATED = [[0.5, 0.5, 0.5, 0.5], [0.5, 0.1, 0.1, 0.5], [0.5, 0.1, 0.1, 0.5], [0.5, 0.5, 0.5, 0.5]]
HARD_MASK = [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]
SOFT_MASK = [[0, 0, 0, 0], [0.5, 1, 1, 0.5], [0.5, 1, 1, 0.5], [0, 0, 0, 0]]


# ---------------------------------------------------------------- Step 1
def latent_shape(width, height, factor=8, channels=4):
    """The model denoises a grid one eighth of the size in each direction. That is where the
    speed comes from, and why detail smaller than a latent cell comes out garbled."""
    if width % factor or height % factor:
        raise ValueError(f"width and height must be multiples of {factor}")
    latent_width, latent_height = width // factor, height // factor
    pixel_values = width * height * 3
    latent_values = latent_width * latent_height * channels
    return {"latent": (latent_height, latent_width, channels), "pixel_values": pixel_values,
            "latent_values": latent_values, "compression": round(pixel_values / latent_values, 1)}


# ---------------------------------------------------------------- Step 2
def img2img_steps(steps, strength):
    """Strength is the share of the run that is redone. Low strength retouches the input.
    High strength leaves little of it."""
    if not 0 <= strength <= 1:
        raise ValueError("strength must be between 0 and 1")
    run = min(int(steps * strength), steps)
    return {"run": run, "skipped": steps - run}


# ---------------------------------------------------------------- Step 3
def inpaint(original, generated, mask):
    """Outside the mask the original is untouched, exactly. A sentence asking a chat model
    to change nothing else is a request. A mask is arithmetic."""
    return [[round(m * g + (1 - m) * o, 3) for o, g, m in zip(original_row, generated_row, mask_row)]
            for original_row, generated_row, mask_row in zip(original, generated, mask)]


# ---------------------------------------------------------------- Step 4
def choose_tool(job):
    """A kind of tool, not a brand: brands change within a year. The order of the checks is
    the order of how much each requirement constrains the choice."""
    if job.get("vector"):
        return "vector generator"
    if job.get("edit_existing"):
        return "chat-based editing model"
    if job.get("text_in_image"):
        return "text-rendering model"
    if job.get("private"):
        return "open model run locally"
    if job.get("commercial_safe"):
        return "licensed-data model"
    return "general image model"


# ---------------------------------------------------------------- Step 5
def upscale_plan(width, height, print_width_inches, dpi=300):
    """Generate at the model's native size and enlarge afterwards. Each pass invents
    plausible detail, so each pass is followed by an inspection."""
    needed = math.ceil(print_width_inches * dpi)
    passes = []
    while width < needed:
        factor = 4 if width * 2 < needed else 2
        passes.append(factor)
        width, height = width * factor, height * factor
    return {"needed_width": needed, "passes": passes, "final": (width, height), "megapixels": round(width * height / 1e6, 1)}


if __name__ == "__main__":
    print(latent_shape(512, 512))
    print(latent_shape(1344, 768))
    print(latent_shape(1024, 1024))
    try:
        latent_shape(1000, 750)
    except ValueError as error:
        print(error)
    print(img2img_steps(50, 0.8), img2img_steps(50, 0.3), img2img_steps(50, 1.0), img2img_steps(50, 0))
    print(img2img_steps(40, 0.25), img2img_steps(40, 0.75))

    for row in inpaint(ORIGINAL, GENERATED, HARD_MASK):
        print(row)
    print(inpaint(ORIGINAL, GENERATED, SOFT_MASK)[1])

    print(choose_tool({"vector": True, "text_in_image": True}))
    print(choose_tool({"edit_existing": True}), "/", choose_tool({"text_in_image": True, "commercial_safe": True}))
    print(choose_tool({"private": True}), "/", choose_tool({"commercial_safe": True}), "/", choose_tool({}))

    print(upscale_plan(1024, 1024, 24))
    print(upscale_plan(1024, 1024, 3))
    print(upscale_plan(1344, 768, 8))
    print(upscale_plan(1024, 1024, 18))
    print(6 * 8)

@@step
{
  "stepNumber": 1,
  "title": "The size of the latent",
  "instruction": "Implement latent_shape(width, height, factor, channels). If the width or the height is not a multiple of the factor, raise ValueError. The latent has height divided by the factor rows, width divided by the factor columns, and the given number of channels. Return a dict with 'latent', the tuple of latent height, latent width, and channels; 'pixel_values', which is width times height times 3; 'latent_values', which is latent width times latent height times channels; and 'compression', the pixel values divided by the latent values, rounded to 1 decimal place. Try 512 by 512 and then 1344 by 768. This is the latent size formula from Section 2. [MOD-6.2]",
  "hintConceptual": "The model sketches on a small pad and has the sketch enlarged afterwards. Each mark on the pad stands for a block of eight by eight pixels in the finished picture.",
  "hintSyntax": "if width % factor or height % factor:\n    raise ValueError(f\"width and height must be multiples of {factor}\")\nlatent_width, latent_height = width // factor, height // factor\npixel_values = width * height * 3\nlatent_values = latent_width * latent_height * channels\nreturn {\"latent\": (latent_height, latent_width, channels), \"pixel_values\": pixel_values,\n        \"latent_values\": latent_values, \"compression\": round(pixel_values / latent_values, 1)}"
}
@@assert
assert latent_shape(512, 512) == {"latent": (64, 64, 4), "pixel_values": 786432, "latent_values": 16384, "compression": 48.0}, f"A 512 by 512 image is a 64 by 64 by 4 latent, 48 times fewer numbers, got {latent_shape(512, 512)}"
assert latent_shape(1024, 1024)["latent"] == (128, 128, 4) and latent_shape(1024, 1024)["compression"] == 48.0, "The ratio is the same at 1,024 by 1,024"
assert latent_shape(1344, 768)["latent"] == (96, 168, 4), "The latent tuple is height first, then width: a wide image has more columns than rows"
assert latent_shape(1344, 768)["pixel_values"] == 3096576 and latent_shape(1344, 768)["latent_values"] == 64512, "Pixel values count three colour channels, latent values count four"
def _refuses(width, height):
    try:
        latent_shape(width, height)
    except ValueError:
        return True
    return False
assert _refuses(1000, 750) and _refuses(513, 512) and not _refuses(1000, 752), "A dimension that is not a multiple of 8 raises ValueError"
assert latent_shape(64, 64, factor=16, channels=16) == {"latent": (4, 4, 16), "pixel_values": 12288, "latent_values": 256, "compression": 48.0}, "The factor and the number of channels are arguments"
assert latent_shape(8, 8)["latent"] == (1, 1, 4), "The smallest image is one latent cell"
print("Step 1 passed: a 512 by 512 image is denoised as a 64 by 64 latent, 48 times smaller.")

@@step
{
  "stepNumber": 2,
  "title": "What strength does",
  "instruction": "Implement img2img_steps(steps, strength). If the strength is below 0 or above 1, raise ValueError. The number of steps run is int(steps * strength), and never more than steps. Return a dict with 'run', that number, and 'skipped', the steps minus the number run. Try 50 steps at strengths of 0.8, 0.3, 1.0, and 0. This is the strength formula from Section 2: the input picture is noised to the level of the steps that will be run, and then those steps are run. [MOD-6.2]",
  "hintConceptual": "A restorer told to redo eighty percent of a painting strips most of it back before repainting. Told to redo twenty percent, they touch up the surface and the picture underneath is still there.",
  "hintSyntax": "if not 0 <= strength <= 1:\n    raise ValueError(\"strength must be between 0 and 1\")\nrun = min(int(steps * strength), steps)\nreturn {\"run\": run, \"skipped\": steps - run}"
}
@@assert
assert img2img_steps(50, 0.8) == {"run": 40, "skipped": 10}, f"At 50 steps and a strength of 0.8, 40 steps run, got {img2img_steps(50, 0.8)}"
assert img2img_steps(50, 0.3) == {"run": 15, "skipped": 35}, "At a strength of 0.3 only 15 steps run, so the composition survives"
assert img2img_steps(50, 1.0) == {"run": 50, "skipped": 0} and img2img_steps(50, 0) == {"run": 0, "skipped": 50}, "Full strength runs every step, and zero strength runs none"
assert img2img_steps(40, 0.25) == {"run": 10, "skipped": 30} and img2img_steps(40, 0.75) == {"run": 30, "skipped": 10}, "The numbers from the first recall question"
assert img2img_steps(30, 0.5) == {"run": 15, "skipped": 15} and img2img_steps(25, 0.5) == {"run": 12, "skipped": 13}, "A fractional result is rounded down"
def _refuses(strength):
    try:
        img2img_steps(50, strength)
    except ValueError:
        return True
    return False
assert _refuses(1.5) and _refuses(-0.1) and not _refuses(1) and not _refuses(0.0), "A strength outside 0 to 1 raises ValueError"
assert img2img_steps(0, 0.8) == {"run": 0, "skipped": 0}, "No steps, nothing run"
print("Step 2 passed: strength is the share of the run that is redone.")

@@step
{
  "stepNumber": 3,
  "title": "What a mask does",
  "instruction": "Implement inpaint(original, generated, mask). The three arguments are grids of the same size, each a list of rows of numbers. For every pixel, compute the mask value times the generated value, plus one minus the mask value times the original value, rounded to 3 decimal places. Return the new grid as a list of rows. Run it on ORIGINAL and GENERATED with HARD_MASK, and confirm that every pixel where the mask is 0 is exactly the original value. Then run it with SOFT_MASK and look at the edge pixels. This is the inpainting blend from Section 2. [MOD-6.2]",
  "hintConceptual": "A stencil laid over a wall lets paint through the holes and nowhere else. Where the stencil is solid, the wall is exactly as it was. A stencil with a feathered edge lets a little paint through near the hole.",
  "hintSyntax": "return [[round(m * g + (1 - m) * o, 3) for o, g, m in zip(original_row, generated_row, mask_row)]\n        for original_row, generated_row, mask_row in zip(original, generated, mask)]"
}
@@assert
_hard = inpaint(ORIGINAL, GENERATED, HARD_MASK)
assert _hard == [[0.2, 0.2, 0.2, 0.2], [0.2, 0.1, 0.1, 0.2], [0.2, 0.1, 0.1, 0.2], [0.2, 0.2, 0.2, 0.2]], f"Only the four masked pixels take the generated value, got {_hard}"
assert all(_hard[row][column] == ORIGINAL[row][column] for row in range(4) for column in range(4) if HARD_MASK[row][column] == 0), "Every pixel outside the mask is exactly the original"
assert sum(1 for row in range(4) for column in range(4) if _hard[row][column] != ORIGINAL[row][column]) == 4, "Four pixels changed and twelve did not"
_soft = inpaint(ORIGINAL, GENERATED, SOFT_MASK)
assert _soft[1] == [0.35, 0.1, 0.1, 0.35] and _soft[0] == [0.2, 0.2, 0.2, 0.2], "A mask value of 0.5 gives the midpoint of the original and the generated pixel"
assert inpaint([[1.0, 0.0]], [[0.0, 1.0]], [[1, 1]]) == [[0.0, 1.0]] and inpaint([[1.0, 0.0]], [[0.0, 1.0]], [[0, 0]]) == [[1.0, 0.0]], "A mask of all ones returns the generated picture, and all zeros returns the original"
assert inpaint([[0.9]], [[0.3]], [[0.25]]) == [[0.75]], "0.25 of the generated value plus 0.75 of the original"
assert ORIGINAL[1][1] == 0.8 and GENERATED[1][1] == 0.1, "The input grids are not modified"
assert inpaint([], [], []) == [], "Empty grids give an empty grid"
print("Step 3 passed: outside the mask, nothing changes, and a soft edge blends the join.")

@@step
{
  "stepNumber": 4,
  "title": "Choose a kind of tool",
  "instruction": "Implement choose_tool(job). The job is a dict whose keys are requirements that are true for this job, and a missing key counts as false. Check the requirements in this order and return the first that applies: 'vector' gives 'vector generator'; 'edit_existing' gives 'chat-based editing model'; 'text_in_image' gives 'text-rendering model'; 'private' gives 'open model run locally'; 'commercial_safe' gives 'licensed-data model'. If none applies, return 'general image model'. The order matters: a logo that also contains text is still a vector job. This is the tool-choice table from Section 2, written as a rule. [MOD-6.2]",
  "hintConceptual": "Choosing a vehicle: if it must float, it is a boat, whatever else you wanted. Ask first about the requirement that rules out the most.",
  "hintSyntax": "if job.get(\"vector\"):\n    return \"vector generator\"\nif job.get(\"edit_existing\"):\n    return \"chat-based editing model\"\nif job.get(\"text_in_image\"):\n    return \"text-rendering model\"\nif job.get(\"private\"):\n    return \"open model run locally\"\nif job.get(\"commercial_safe\"):\n    return \"licensed-data model\"\nreturn \"general image model\""
}
@@assert
assert choose_tool({"text_in_image": True}) == "text-rendering model", f"A poster with a headline needs a text-rendering model, got {choose_tool({'text_in_image': True})}"
assert choose_tool({"vector": True, "text_in_image": True}) == "vector generator", "A logo with text is still a vector job"
assert choose_tool({"edit_existing": True, "text_in_image": True, "private": True}) == "chat-based editing model", "Editing an existing picture is asked before lettering and privacy"
assert choose_tool({"text_in_image": True, "commercial_safe": True}) == "text-rendering model", "Lettering is asked before licensing"
assert choose_tool({"private": True, "commercial_safe": True}) == "open model run locally" and choose_tool({"commercial_safe": True}) == "licensed-data model", "Privacy is asked before licensing"
assert choose_tool({}) == "general image model", "With no special requirement, a general image model"
assert choose_tool({"vector": False, "text_in_image": False, "private": True}) == "open model run locally", "A requirement set to False does not apply"
assert choose_tool({"photoreal": True}) == "general image model", "A requirement the rule does not know about changes nothing"
print("Step 4 passed: the most constraining requirement decides the kind of tool.")

@@step
{
  "stepNumber": 5,
  "title": "Plan an upscale for print",
  "instruction": "Implement upscale_plan(width, height, print_width_inches, dpi). The width needed in pixels is math.ceil(print_width_inches * dpi). Start with an empty list of passes. While the width is below the needed width, choose a factor: 4 if the width times 2 is still below the needed width, and otherwise 2. Append the factor to the list and multiply both the width and the height by it. Return a dict with 'needed_width'; 'passes', the list of factors; 'final', the tuple of the final width and height; and 'megapixels', the final width times height divided by one million, rounded to 1 decimal place. Plan a 24-inch poster from a 1,024 by 1,024 image. This is the print arithmetic from Section 2. [MOD-6.2]",
  "hintConceptual": "A photocopier that enlarges by two or by four: to make a small original into a poster, use the larger setting while you are far from the size, and the smaller one for the last step.",
  "hintSyntax": "needed = math.ceil(print_width_inches * dpi)\npasses = []\nwhile width < needed:\n    factor = 4 if width * 2 < needed else 2\n    passes.append(factor)\n    width, height = width * factor, height * factor\nreturn {\"needed_width\": needed, \"passes\": passes, \"final\": (width, height), \"megapixels\": round(width * height / 1e6, 1)}"
}
@@assert
assert upscale_plan(1024, 1024, 24) == {"needed_width": 7200, "passes": [4, 2], "final": (8192, 8192), "megapixels": 67.1}, f"A 24-inch poster needs a 4 times pass and a 2 times pass, got {upscale_plan(1024, 1024, 24)}"
assert upscale_plan(1024, 1024, 3) == {"needed_width": 900, "passes": [], "final": (1024, 1024), "megapixels": 1.0}, "A 3-inch print needs no upscaling"
assert upscale_plan(1344, 768, 8) == {"needed_width": 2400, "passes": [2], "final": (2688, 1536), "megapixels": 4.1}, "The wide image needs one 2 times pass, and both dimensions are enlarged"
assert upscale_plan(1024, 1024, 18)["passes"] == [4, 2] and upscale_plan(1024, 1024, 18)["needed_width"] == 5400, "The numbers from the first recall question"
assert upscale_plan(1024, 1024, 36)["passes"] == [4, 4] and upscale_plan(1024, 1024, 36)["final"] == (16384, 16384), "A 36-inch print needs two 4 times passes"
assert upscale_plan(1000, 500, 10, dpi=200) == {"needed_width": 2000, "passes": [2], "final": (2000, 1000), "megapixels": 2.0}, "The dots per inch is an argument, and reaching the needed width exactly is enough"
assert upscale_plan(1000, 1000, 10, dpi=150)["passes"] == [2], "At 150 dots per inch, a 10-inch print needs 1,500 pixels: one 2 times pass"
print("Step 5 passed: from 1,024 pixels, a 24-inch poster takes a 4 times pass and a 2 times pass.")
