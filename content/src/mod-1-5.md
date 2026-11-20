@@meta
{
  "moduleId": "MOD-1.5",
  "slug": "mod-1-5",
  "unitId": "UNIT-1",
  "unitTitle": "Unit 1: Understanding AI from Basics",
  "title": "What is Generative AI?",
  "difficulty": "Foundational",
  "estimatedMinutes": 100,
  "citations": [
    { "title": "Generative Adversarial Networks (Goodfellow et al., 2014)", "source": "arXiv", "url": "https://arxiv.org/abs/1406.2661" },
    { "title": "Auto-Encoding Variational Bayes (Kingma & Welling, 2013)", "source": "arXiv", "url": "https://arxiv.org/abs/1312.6114" },
    { "title": "Denoising Diffusion Probabilistic Models (Ho, Jain & Abbeel, 2020)", "source": "arXiv", "url": "https://arxiv.org/abs/2006.11239" },
    { "title": "High-Resolution Image Synthesis with Latent Diffusion Models (Rombach et al.)", "source": "arXiv", "url": "https://arxiv.org/abs/2112.10752" },
    { "title": "On Discriminative vs. Generative Classifiers (Ng & Jordan, 2001)", "source": "NeurIPS Proceedings", "url": "https://papers.nips.cc/paper/2001/hash/7b7a53e239400a13bd6be6c91c4f6c4e-Abstract.html" },
    { "title": "But how do AI videos actually work? (Welch Labs guest post)", "source": "3Blue1Brown", "url": "https://3blue1brown.substack.com/p/but-how-do-ai-videos-actually-work" }
  ],
  "videoLibrary": [
    {
      "id": "VID-1.5-1",
      "title": "Introduction to Generative AI",
      "creator": "Google Cloud Tech",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=G2fqAlgmoPo",
      "timingInstruction": "Watch after reading Section 1",
      "keyTakeaway": "Sets out the vocabulary: where generative AI sits inside machine learning and how generative and discriminative models differ."
    },
    {
      "id": "VID-1.5-2",
      "title": "How AI Image Generators Work (Stable Diffusion / Dall-E)",
      "creator": "Computerphile",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=1CIpzeNxIhU",
      "timingInstruction": "Watch after reading Section 2 (diffusion)",
      "keyTakeaway": "Mike Pound explains noise prediction and iterative denoising with pen and paper, and why diffusion displaced GANs for images."
    },
    {
      "id": "VID-1.5-3",
      "title": "But how do AI images and videos actually work? | Guest video by Welch Labs",
      "creator": "3Blue1Brown",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=iv-5mZ_9CPY",
      "timingInstruction": "Watch after the lab, alongside the diffusion equations",
      "keyTakeaway": "A visual deep dive into diffusion, text conditioning, and guidance that makes the forward-noising formula from this chapter feel obvious."
    },
    {
      "id": "VID-1.5-4",
      "title": "Generative AI for Everyone",
      "creator": "DeepLearning.AI (Andrew Ng)",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/generative-ai-for-everyone",
      "timingInstruction": "Take after this module for applications and limits",
      "keyTakeaway": "A non-technical account of what generative AI can and cannot do, how to spot good use cases, and what it means for work."
    },
    {
      "id": "VID-1.5-5",
      "title": "Introduction to Generative AI",
      "creator": "Google Cloud",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/introduction-to-generative-ai",
      "timingInstruction": "Optional one-hour review",
      "keyTakeaway": "A short course version of the Google Cloud material with a quiz, useful as a quick consolidation of terminology."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: A Generative Model You Can Hold in Your Hand",
    "context": "A greenhouse startup records the height of seedlings from two plant varieties and wants both to identify a variety from a height reading and to create realistic synthetic readings for testing its software. You will fit a small generative model that does both, then add the forward-noising step that image generators are built on.",
    "language": "python"
  }
}

@@reading
# What is Generative AI?

Most machine learning you have met so far answers a question about data: is this message spam, which digit is in this picture, will this customer leave? Generative AI does something different in kind. It produces new data, an essay, an image, a voice, a block of code, that did not exist before. This chapter explains the single idea that makes that possible, the four families of model that implement it, and where each kind of generation is mature enough to rely on.

## 1. First-Principles Mental Model & Intuition

### The customs officer and the forger

Imagine two experts in passports.

The **customs officer** looks at a passport and decides: real or fake. To do that job the officer needs to know only what separates the two. Perhaps real passports have a particular watermark. The officer never needs to be able to draw a passport.

The **forger** needs to know far more. To make a convincing passport the forger must understand everything about what real ones look like: the paper, the fonts, the layout, the photo style, how these details fit together. A forger who has learned all of that can produce as many new passports as you like.

The customs officer is a **discriminative** model. It learns a boundary between categories. The forger is a **generative** model. It learns what the data itself looks like, and anything that has learned what data looks like can be asked to produce more of it.

Two things follow that are worth holding on to.

1. A forger can also do the officer's job. Given a document, the forger can ask "how likely is it that I would have made this as a real one versus as a fake?" Knowledge of how data is produced can be turned into a classifier.
2. An officer cannot do the forger's job. Knowing where the boundary lies tells you nothing about how to draw a passport.

### Learning a distribution, then sampling from it

The technical version of "what the data looks like" is a **probability distribution**. Think of all possible 512 by 512 pixel images. Nearly all of them are meaningless static. A vanishingly small region of that space contains images that look like photographs of cats. A generative model for cat photos is a machine that has learned where that region is, and can pick new points from inside it.

So generative AI always has two phases.

- **Training:** learn the distribution from many examples.
- **Sampling:** draw a new example from the learned distribution.

"Generating" is sampling. That is why the same prompt gives a different image each time: each run draws a different point from the same region.

### Why this suddenly works

The idea is old. Simple generative models have been used in statistics for a century. What changed after about 2014 is capacity. Deep neural networks with billions of parameters, trained on enormous datasets, can represent distributions as intricate as "all plausible English paragraphs" or "all plausible photographs". When people say "generative AI" today they mean these large deep models, trained at scale.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Generative versus discriminative, precisely

Let $x$ be the data (an email, an image) and $y$ a label (spam or not, cat or dog).

- A **discriminative** model learns $p(y \mid x)$: the probability of the label given the data.
- A **generative** model learns $p(x)$, the probability of the data itself, or the joint $p(x, y)$ of data and label together.

The two are connected by **Bayes' rule**:

$$
p(y \mid x) = \frac{p(x \mid y)\, p(y)}{p(x)}
$$

Read right to left, this is the forger doing the officer's job. If you have a model of how each class produces data, $p(x \mid y)$, and you know how common each class is, $p(y)$, you can compute which class most likely produced a given $x$. The denominator $p(x)$ is the same for every class, so for classification you can ignore it and simply compare $p(x \mid y)\,p(y)$ across classes.

A classic 2001 paper by Andrew Ng and Michael Jordan compared the two approaches directly. Their finding: the discriminative model reaches lower error when data is plentiful, while the generative model approaches its (higher) final error faster, so with very little training data the generative model can win. Neither kind is simply better.

**Conditional generation** is the bridge to products. A text-to-image model learns $p(\text{image} \mid \text{text})$. A chatbot learns $p(\text{reply} \mid \text{conversation})$. In both cases the model generates data, conditioned on something you supply. The thing you supply is the prompt.

### The four model families

The hard part of generative modeling is that $p(x)$ for real data is unimaginably complicated. Each family is a different trick for making it learnable and for making sampling practical.

| Family | The trick | Sampling | Dominant today in |
|---|---|---|---|
| Autoregressive | Break $x$ into pieces and predict each from the ones before | One piece at a time | Text and code |
| Diffusion | Learn to remove a little noise; start from pure noise and repeat | Many denoising steps | Images, video, audio |
| GAN | Train a generator against a critic that tries to catch fakes | One pass | Fast, specialised image tasks |
| VAE | Compress data to a small code and learn to decode codes | One pass | The compression stage inside other systems |

**1. Autoregressive models.** You met these in the language-model chapter. The chain rule factorises the probability of a sequence exactly:

$$
p(x) = \prod_{t=1}^{T} p\big(x_t \mid x_1, \dots, x_{t-1}\big)
$$

A transformer learns each conditional. Sampling is the token-by-token loop. This family gives an exact probability for any sequence and is trained by straightforward maximum likelihood, which makes training stable. Its cost is that generation is sequential.

**2. Generative adversarial networks (GANs).** Introduced by Ian Goodfellow and colleagues in 2014. Two networks compete. A **generator** $G$ turns random noise $z$ into a fake sample. A **discriminator** $D$ outputs the probability that a sample is real. They play a two-player game with the objective:

$$
\min_{G} \max_{D} \; \mathbb{E}_{x \sim p_{\text{data}}}\big[\log D(x)\big] + \mathbb{E}_{z \sim p_z}\big[\log\big(1 - D(G(z))\big)\big]
$$

The discriminator tries to make this large by scoring real data near 1 and fakes near 0. The generator tries to make it small by fooling the discriminator. In theory the game ends when the generator's output is indistinguishable from real data and the discriminator can do no better than answer one half for everything. In practice the game is hard to balance. Training can oscillate, and the generator can fall into **mode collapse**, producing only a few kinds of output that happen to fool the critic. GANs give no way to compute the probability of a sample.

**3. Variational autoencoders (VAEs).** Introduced by Diederik Kingma and Max Welling in 2013. An **encoder** compresses a data point $x$ into a short code $z$ in a **latent space**, and a **decoder** reconstructs $x$ from $z$. The model is trained to maximise a quantity called the evidence lower bound (ELBO):

$$
\log p_\theta(x) \;\ge\; \mathbb{E}_{q_\phi(z \mid x)}\big[\log p_\theta(x \mid z)\big] \;-\; D_{\mathrm{KL}}\big(q_\phi(z \mid x)\,\|\,p(z)\big)
$$

The first term rewards accurate reconstruction. The second term keeps the codes close to a simple known distribution $p(z)$, usually a standard bell curve, so that you can later draw a random $z$ from that simple distribution, decode it, and get a plausible new sample. VAEs train stably, though their samples tend to be blurry. Their most important role today is as the compressor inside diffusion systems.

**4. Diffusion models.** The family behind modern image and video generation, made practical by Jonathan Ho, Ajay Jain, and Pieter Abbeel in 2020. The idea has two halves.

The **forward process** destroys data by adding a little Gaussian noise at each of $T$ steps. With a small noise amount $\beta_t$ at step $t$:

$$
q(x_t \mid x_{t-1}) = \mathcal{N}\big(\sqrt{1 - \beta_t}\; x_{t-1},\; \beta_t I\big)
$$

A convenient fact is that you can jump straight to any step $t$ from the clean data $x_0$. Define $\bar{\alpha}_t = \prod_{s=1}^{t} (1 - \beta_s)$, the fraction of the original signal that survives to step $t$. Then:

$$
x_t = \sqrt{\bar{\alpha}_t}\; x_0 + \sqrt{1 - \bar{\alpha}_t}\; \epsilon, \qquad \epsilon \sim \mathcal{N}(0, I)
$$

When $\bar{\alpha}_t$ is near 1 the result is almost the clean data. When it is near 0 the result is almost pure noise. You will implement this formula in the lab.

The **reverse process** is learned. A neural network $\epsilon_\theta$ is shown a noisy $x_t$ and the step number $t$, and is trained to predict the noise that was added:

$$
\mathcal{L} = \mathbb{E}\Big[\big\lVert \epsilon - \epsilon_\theta(x_t, t) \big\rVert^{2}\Big]
$$

To generate, start from pure random noise and repeatedly ask the network what noise to remove, stepping gradually back toward a clean sample.

```text
 TRAINING (forward: add noise, known formula)
   clean image --> slightly noisy --> noisier --> ... --> pure static
       x0              x1              x2                    xT

 GENERATION (reverse: remove noise, learned network)
   pure static --> less noisy --> ... --> slightly noisy --> new image
       xT            x(T-1)                   x1                x0
                 ^ each arrow is one call to the denoising network,
                   steered by the text prompt
```

The original method used about a thousand steps. Later samplers need far fewer. **Latent diffusion** (Rombach and colleagues, published 2022), the design behind Stable Diffusion, made the approach affordable by running diffusion in the small latent space of a pretrained autoencoder and not on raw pixels, with the text prompt injected through attention.

### Cost comparison

Let $N$ be the size of the output (tokens or pixels) and $S$ the number of denoising steps.

| Family | Network calls to generate one sample | Exact likelihood available |
|---|---|---|
| Autoregressive | $N$ (one per token) | Yes |
| Diffusion | $S$ (tens to hundreds) | Only a bound |
| GAN | 1 | No |
| VAE | 1 | Only a bound |

This table explains product behaviour you have already noticed. Text streams out word by word because each token is a separate call. Images appear after a pause because the whole picture is refined together over many steps.

### Modalities and maturity

| Modality | Typical family | Maturity, as a rough guide |
|---|---|---|
| Text | Autoregressive transformer | Mature for drafting, summarising, and transforming text. Facts need checking |
| Code | Autoregressive transformer | Mature as an assistant. Output needs review and tests |
| Images | Diffusion | Mature for drafts, concepts, and marketing visuals. Fine details and text in images can fail |
| Speech | Autoregressive and diffusion variants | Mature. Voice cloning raises consent issues |
| Music | Autoregressive and diffusion variants | Improving. Licensing questions are open |
| Video | Diffusion | Improving fast. Clips are short and need heavy selection |

Treat the right-hand column as a snapshot. This field moves quickly, and "production-ready" always depends on how costly an error is in your particular use.

## 3. Production-Grade Implementation & Annotated Walkthrough

The smallest honest generative model fits in a page. The task: we have measurements from two classes, and we want to both classify a new measurement and generate new ones. The model assumes each class produces values from its own bell curve.

```python
import math
import random
import statistics

def fit_gaussian(values):
    """Learn the distribution of one class: its mean and standard deviation."""
    mean = statistics.fmean(values)
    std = max(statistics.pstdev(values), 1e-6)       # never allow zero spread
    return mean, std

def gaussian_log_pdf(x, mean, std):
    """log p(x | class) for a bell curve."""
    return -0.5 * math.log(2 * math.pi * std ** 2) - (x - mean) ** 2 / (2 * std ** 2)

def classify(x, models, priors):
    """Bayes' rule in log space: pick the class with the largest log p(x|y) + log p(y)."""
    return max(models, key=lambda label: gaussian_log_pdf(x, *models[label]) + math.log(priors[label]))

def generate(models, label, n, seed):
    """Sampling: draw n new values from the learned distribution of one class."""
    rng = random.Random(seed)
    mean, std = models[label]
    return [rng.gauss(mean, std) for _ in range(n)]

# Training data: seedling heights in centimetres.
data = {
    "basil": [9.8, 10.4, 11.1, 10.0, 9.5, 10.9, 10.2],
    "mint":  [14.2, 15.1, 13.8, 14.9, 15.5, 14.4],
}
models = {label: fit_gaussian(values) for label, values in data.items()}
total = sum(len(v) for v in data.values())
priors = {label: len(values) / total for label, values in data.items()}

print(models)
print(classify(12.0, models, priors), classify(13.2, models, priors))
print([round(v, 1) for v in generate(models, "mint", 5, seed=0)])
```

Commentary:

- **`fit_gaussian` is the training step.** The "parameters" of this model are just two numbers per class. Compare with a large image model, where the parameters number in the billions. The role is identical: they describe where real data lives.
- **`max(..., 1e-6)` guards an edge case.** If every training value in a class is identical, the standard deviation is zero and the density formula divides by zero. A tiny floor avoids the crash. Real systems add similar safeguards everywhere.
- **`gaussian_log_pdf` returns a log.** Densities for unlikely values are extremely small numbers. Working with logarithms avoids underflow and turns the product in Bayes' rule into a sum.
- **`classify` is Bayes' rule with the denominator dropped.** It compares $\log p(x \mid y) + \log p(y)$ across classes. The prior $p(y)$ matters: if one variety is far more common, an ambiguous reading should lean toward it.
- **`generate` is the whole point.** A discriminative classifier trained on the same data could tell basil from mint, but it could not produce a single plausible height. This model can produce unlimited new ones, because it learned the distribution and not just the boundary.

Now the diffusion ingredient. The closed-form forward process from Section 2 is one line:

```python
def forward_noise(x0, alpha_bar, eps):
    """Jump from clean data x0 to its noised version at a step with signal fraction alpha_bar."""
    return math.sqrt(alpha_bar) * x0 + math.sqrt(1 - alpha_bar) * eps

rng = random.Random(1)
clean = [rng.choice([-2.0, 2.0]) for _ in range(2000)]        # data with two sharp modes
for alpha_bar in (1.0, 0.9, 0.5, 0.0):
    noised = [forward_noise(x, alpha_bar, rng.gauss(0, 1)) for x in clean]
    near_zero = sum(abs(v) < 0.5 for v in noised) / len(noised)
    print(f"alpha_bar={alpha_bar}: mean={statistics.fmean(noised):+.2f}  "
          f"std={statistics.pstdev(noised):.2f}  share near zero={near_zero:.2f}")
```

The clean data has two spikes, at minus two and plus two, and nothing in between. As `alpha_bar` falls, the spikes smear, the gap fills in, and at `alpha_bar = 0` the data is a standard bell curve with mean near 0 and standard deviation near 1, carrying no trace of the original. A diffusion model is trained to undo exactly this, one small step at a time. Because the forward process is a formula and not a simulation, a training example at any noise level costs one line of arithmetic, which is a large part of why diffusion training is efficient.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**"It just copies and stitches together training data" and "it never copies" are both wrong.** A generative model stores parameters, not a library of images or documents, and almost all of its output is new. But memorisation is a documented phenomenon. Researchers have extracted near-copies of training images from diffusion models and verbatim passages from language models, particularly for items that appeared many times in the training set. The accurate position is that reproduction is uncommon, real, and more likely for heavily duplicated material. If your use has legal exposure, check outputs.

**Generation is sampling, so quality is a distribution too.** Practitioners routinely generate several candidates and choose. One disappointing image says little about a model. Twenty do. The same habit applies to text when quality matters.

**A fluent output is not a verified output.** A language model samples a plausible continuation. Plausible and true overlap most of the time and diverge without warning. This is the root of hallucination, covered in its own module.

**Diffusion is not a single clean-up pass.** Images are produced over many steps, and settings such as the number of steps and the strength of prompt guidance strongly affect results. Too few steps gives mushy output. Excessive guidance gives oversaturated, harsh images.

**GANs are not obsolete.** Diffusion became the default for quality and variety, but a GAN produces an image in one pass, which still matters for real-time work such as video upscaling.

**"Generative means unsupervised" is a simplification.** Text-to-image training needs images paired with captions, which is supervision of a kind, and chat models get supervised fine-tuning and preference tuning after pre-training.

**Evaluation is hard and partly subjective.** There is no accuracy score for "is this a good image". Automated measures exist and are imperfect, and human preference studies are slow and costly. Be sceptical of single-number claims that one generator is better than another.

**Costs that introductions skip.** Sampling cost and latency (a video clip can take minutes), rights and provenance of outputs, consent for voices and likenesses, and disclosure rules for synthetic media all become real the moment you use these tools for a client.

**Ask what your tolerance for error is.** A brainstormed tagline that is slightly off costs nothing. A generated contract clause that is slightly off can cost a great deal. The same model can be production-ready for one and unusable without review for the other.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Generative AI learns the probability distribution of data and then samples from it, which is what lets it create new text, images, audio, video, and code. A discriminative model learns only $p(y \mid x)$, the boundary between classes; a generative model learns $p(x)$ or $p(x, y)$ and can both generate and, through Bayes' rule, classify. Four families make this practical: autoregressive models that predict one piece at a time and dominate text, diffusion models that learn to remove noise step by step and dominate images and video, GANs that train a generator against a critic, and VAEs that learn a compressed latent space. Products are conditional generators steered by a prompt, their outputs are samples and vary from run to run, and their readiness for real work depends on the modality and on how expensive a mistake would be.

**Question 1.** Using Bayes' rule, explain how a generative model can be used as a classifier, and why a discriminative model cannot be used as a generator.

<details>
<summary>View Answer</summary>

A generative model provides $p(x \mid y)$ for each class, the probability that the class would produce the observed data, and the class frequencies $p(y)$. Bayes' rule gives $p(y \mid x)$ in proportion to $p(x \mid y)\,p(y)$, so you compute that product for each class and choose the largest. A discriminative model only represents $p(y \mid x)$, a mapping from given data to a label. It contains no description of which data points are likely to occur, so there is nothing to sample from: it can judge a passport and has no information about how to draw one.

</details>

**Question 2.** In the diffusion forward process $x_t = \sqrt{\bar{\alpha}_t}\,x_0 + \sqrt{1 - \bar{\alpha}_t}\,\epsilon$, describe $x_t$ when $\bar{\alpha}_t$ is 1, 0.5, and 0, and explain what the neural network is trained to do with it.

<details>
<summary>View Answer</summary>

When the signal fraction is 1 the noise term vanishes and $x_t$ equals the clean data. At 0.5 it is an equal-variance blend: the data scaled by about 0.71 plus noise scaled by about 0.71, so the original structure is visible but badly degraded. At 0 the data term vanishes and $x_t$ is pure standard Gaussian noise with no information about the original. The network receives the noisy $x_t$ and the step number and is trained to predict the noise $\epsilon$ that was mixed in. At generation time it starts from pure noise and repeatedly subtracts its predicted noise, stepping back toward a clean sample.

</details>

**Question 3.** A text chatbot streams its answer word by word, while an image generator shows nothing for several seconds and then displays a complete picture. Explain both behaviours from the model families involved.

<details>
<summary>View Answer</summary>

The chatbot is an autoregressive model. It produces one token per network call, each conditioned on all previous tokens, so tokens become available in order and can be shown as they are produced. The image generator is a diffusion model. It begins with noise for the entire image and refines all of it together across many denoising steps, so there is no finished part to show until the final steps. Its waiting time is governed by the number of steps and the image size, not by a left-to-right sequence.

</details>

@@starter
"""
Lab: A Generative Model You Can Hold in Your Hand
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".

DATA holds seedling heights (cm) for two plant varieties. You will learn the distribution
of each variety, use it to classify new readings, generate synthetic readings, and finally
implement the forward-noising formula used by diffusion models.
"""
import math
import random
import statistics

DATA = {
    "basil": [9.8, 10.4, 11.1, 10.0, 9.5, 10.9, 10.2],
    "mint": [14.2, 15.1, 13.8, 14.9, 15.5, 14.4],
}


# ---------------------------------------------------------------- Step 1
def fit_gaussian(values):
    """Training: return (mean, std) for a list of numbers."""
    # TODO Step 1: mean = statistics.fmean(values)
    #              std  = statistics.pstdev(values), but never smaller than 1e-6
    #              return (mean, std)
    return None


# ---------------------------------------------------------------- Step 2
def gaussian_log_pdf(x, mean, std):
    """Return log p(x) for a bell curve with the given mean and standard deviation."""
    # TODO Step 2: -0.5 * log(2 * pi * std**2)  -  (x - mean)**2 / (2 * std**2)
    return None


# ---------------------------------------------------------------- Step 3
def classify(x, models, priors):
    """Bayes' rule: return the label with the largest  log p(x | label) + log p(label).

    models: {label: (mean, std)}      priors: {label: probability of that label}
    """
    # TODO Step 3: score every label with gaussian_log_pdf(x, mean, std) + math.log(priors[label])
    #              and return the label with the highest score.
    return None


# ---------------------------------------------------------------- Step 4
def generate(models, label, n, seed):
    """Sampling: return a list of n new values drawn from the learned distribution of `label`."""
    rng = random.Random(seed)
    # TODO Step 4: mean, std = models[label]; draw n values with rng.gauss(mean, std)
    return None


# ---------------------------------------------------------------- Step 5
def forward_noise(x0, alpha_bar, eps):
    """Diffusion forward process in closed form.

    x0: clean value   alpha_bar: fraction of signal kept (1 = clean, 0 = pure noise)
    eps: one standard-normal noise value
    """
    # TODO Step 5: sqrt(alpha_bar) * x0 + sqrt(1 - alpha_bar) * eps
    return None


if __name__ == "__main__":
    print("basil model   :", fit_gaussian(DATA["basil"]))
    print("log pdf       :", gaussian_log_pdf(10.0, 10.0, 0.5))
    print("classify 12.0 :", classify(12.0, {"basil": (10.3, 0.5), "mint": (14.7, 0.6)}, {"basil": 0.5, "mint": 0.5}))
    print("generate mint :", generate({"mint": (14.7, 0.6)}, "mint", 3, seed=0))
    print("noised value  :", forward_noise(2.0, 0.5, 0.3))

@@solution
"""
Lab solution: A Generative Model You Can Hold in Your Hand
Standard library only.

DATA holds seedling heights (cm) for two plant varieties.
"""
import math
import random
import statistics

DATA = {
    "basil": [9.8, 10.4, 11.1, 10.0, 9.5, 10.9, 10.2],
    "mint": [14.2, 15.1, 13.8, 14.9, 15.5, 14.4],
}


# ---------------------------------------------------------------- Step 1
def fit_gaussian(values):
    """Training. The whole 'model' of one class is two numbers.

    The floor on std avoids a division by zero when every training value is identical.
    """
    mean = statistics.fmean(values)
    std = max(statistics.pstdev(values), 1e-6)
    return mean, std


# ---------------------------------------------------------------- Step 2
def gaussian_log_pdf(x, mean, std):
    """log of the bell-curve density. Logs avoid underflow for unlikely values."""
    return -0.5 * math.log(2 * math.pi * std ** 2) - (x - mean) ** 2 / (2 * std ** 2)


# ---------------------------------------------------------------- Step 3
def classify(x, models, priors):
    """The forger doing the customs officer's job.

    Bayes' rule says p(y | x) is proportional to p(x | y) * p(y). The denominator p(x)
    is the same for every label, so comparing log p(x | y) + log p(y) is enough.
    """
    def score(label):
        mean, std = models[label]
        return gaussian_log_pdf(x, mean, std) + math.log(priors[label])

    return max(models, key=score)


# ---------------------------------------------------------------- Step 4
def generate(models, label, n, seed):
    """Sampling from the learned distribution: this is what 'generating' means."""
    rng = random.Random(seed)
    mean, std = models[label]
    return [rng.gauss(mean, std) for _ in range(n)]


# ---------------------------------------------------------------- Step 5
def forward_noise(x0, alpha_bar, eps):
    """x_t = sqrt(alpha_bar) * x0 + sqrt(1 - alpha_bar) * eps

    The two coefficients are chosen so that signal variance and noise variance always
    add up to one: as the signal fades, noise takes its place.
    """
    return math.sqrt(alpha_bar) * x0 + math.sqrt(1 - alpha_bar) * eps


if __name__ == "__main__":
    models = {label: fit_gaussian(values) for label, values in DATA.items()}
    total = sum(len(values) for values in DATA.values())
    priors = {label: len(values) / total for label, values in DATA.items()}

    for label, (mean, std) in models.items():
        print(f"{label:>5}: mean={mean:.2f} cm  std={std:.2f} cm  prior={priors[label]:.2f}")
    for height in (10.5, 12.0, 12.6, 13.2):
        print(f"a {height} cm seedling is classified as {classify(height, models, priors)}")
    print("5 synthetic mint readings:", [round(v, 1) for v in generate(models, "mint", 5, seed=0)])

    # Forward noising: two sharp modes dissolve into a standard bell curve.
    rng = random.Random(1)
    clean = [rng.choice([-2.0, 2.0]) for _ in range(2000)]
    for alpha_bar in (1.0, 0.9, 0.5, 0.0):
        noised = [forward_noise(x, alpha_bar, rng.gauss(0, 1)) for x in clean]
        near_zero = sum(abs(v) < 0.5 for v in noised) / len(noised)
        print(f"alpha_bar={alpha_bar}: mean={statistics.fmean(noised):+.2f} "
              f"std={statistics.pstdev(noised):.2f} share near zero={near_zero:.2f}")

@@step
{
  "stepNumber": 1,
  "title": "Train: learn the distribution of one class",
  "instruction": "Implement fit_gaussian(values). Return a tuple (mean, std) where mean is statistics.fmean(values) and std is statistics.pstdev(values), raised to 1e-6 if it would be smaller. Those two numbers are the trained parameters of your generative model for that class: they describe where its data lives. [MOD-1.5]",
  "hintConceptual": "Training a generative model means summarising what the data looks like. For a bell curve that summary is its centre and its spread. Think about what the spread is when all values are identical, and why that would break later arithmetic.",
  "hintSyntax": "mean = statistics.fmean(values)\nstd = max(statistics.pstdev(values), 1e-6)\nreturn mean, std"
}
@@assert
_m = fit_gaussian([2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0])
assert _m is not None and len(_m) == 2, "fit_gaussian must return a tuple (mean, std)"
assert abs(_m[0] - 5.0) < 1e-9, f"The mean of this data is 5.0, got {_m[0]}"
assert abs(_m[1] - 2.0) < 1e-9, f"The population standard deviation of this data is 2.0, got {_m[1]} (use pstdev, not stdev)"
_flat = fit_gaussian([3.0, 3.0, 3.0])
assert _flat[0] == 3.0 and _flat[1] == 1e-6, "Identical values must give std = 1e-6, never 0"
print("Step 1 passed: model parameters ->", _m)

@@step
{
  "stepNumber": 2,
  "title": "Score a value: the log density",
  "instruction": "Implement gaussian_log_pdf(x, mean, std). Return -0.5 * math.log(2 * math.pi * std**2) - (x - mean)**2 / (2 * std**2). This is log p(x | class): how plausible the value x is under one class's learned distribution. Working in logs keeps very small probabilities from underflowing to zero. [MOD-1.5]",
  "hintConceptual": "The density is highest at the mean and falls off as x moves away, faster when the spread is small. The log turns the bell curve into an upside-down parabola.",
  "hintSyntax": "return -0.5 * math.log(2 * math.pi * std ** 2) - (x - mean) ** 2 / (2 * std ** 2)"
}
@@assert
_at_mean = gaussian_log_pdf(0.0, 0.0, 1.0)
assert _at_mean is not None, "gaussian_log_pdf must return a number"
assert abs(_at_mean - (-0.9189385332046727)) < 1e-9, f"log density of a standard bell curve at its mean is about -0.9189, got {_at_mean}"
assert abs(gaussian_log_pdf(1.0, 0.0, 1.0) - (-1.4189385332046727)) < 1e-9, "One standard deviation from the mean should give about -1.4189"
assert gaussian_log_pdf(10.0, 10.0, 0.5) > gaussian_log_pdf(11.0, 10.0, 0.5), "Values nearer the mean must score higher"
assert abs(gaussian_log_pdf(7.0, 5.0, 2.0) - (-0.5 * math.log(2 * math.pi * 4.0) - 0.5)) < 1e-9, "Check the std**2 terms in both parts of the formula"
print("Step 2 passed: you can score how plausible a value is.")

@@step
{
  "stepNumber": 3,
  "title": "Classify with Bayes' rule",
  "instruction": "Implement classify(x, models, priors). For each label in models, compute gaussian_log_pdf(x, mean, std) + math.log(priors[label]) and return the label with the highest score. This is Bayes' rule with the shared denominator dropped: the generative model is doing a classifier's job, and the prior shifts the decision toward the more common class. [MOD-1.5]",
  "hintConceptual": "Ask of each class: how likely would this class be to produce this value, and how common is the class to begin with? Multiply those two (add their logs) and pick the winner.",
  "hintSyntax": "def score(label):\n    mean, std = models[label]\n    return gaussian_log_pdf(x, mean, std) + math.log(priors[label])\nreturn max(models, key=score)"
}
@@assert
_models = {"low": (10.0, 1.0), "high": (14.0, 1.0)}
_even = {"low": 0.5, "high": 0.5}
assert classify(10.5, _models, _even) == "low", "10.5 is far closer to the 'low' class"
assert classify(13.9, _models, _even) == "high", "13.9 is far closer to the 'high' class"
assert classify(11.9, _models, _even) == "low", "With equal priors the boundary is the midpoint 12.0, so 11.9 is 'low'"
assert classify(11.9, _models, {"low": 0.05, "high": 0.95}) == "high", "A strong prior for 'high' must pull an ambiguous value to 'high'"
_wide = {"narrow": (0.0, 0.5), "wide": (0.0, 5.0)}
assert classify(6.0, _wide, {"narrow": 0.5, "wide": 0.5}) == "wide", "A value far from both means is better explained by the class with the larger spread"
print("Step 3 passed: the generative model now classifies.")

@@step
{
  "stepNumber": 4,
  "title": "Generate: sample new data",
  "instruction": "Implement generate(models, label, n, seed). The seeded generator rng is created for you. Look up (mean, std) for the label and return a list of n values, each drawn with rng.gauss(mean, std). This is generation in its simplest form: sampling new points from the distribution the model learned. A discriminative classifier trained on the same data could not do this. [MOD-1.5]",
  "hintConceptual": "Generating is drawing from the learned distribution. Each draw is different, and a large batch of draws should have roughly the same centre and spread as the training data.",
  "hintSyntax": "mean, std = models[label]\nreturn [rng.gauss(mean, std) for _ in range(n)]"
}
@@assert
_models = {"mint": (14.7, 0.6), "basil": (10.3, 0.5)}
_s = generate(_models, "mint", 4000, seed=42)
assert isinstance(_s, list) and len(_s) == 4000, "generate must return a list of n values"
assert abs(statistics.fmean(_s) - 14.7) < 0.05, f"Samples for 'mint' should average about 14.7, got {statistics.fmean(_s):.3f}"
assert abs(statistics.pstdev(_s) - 0.6) < 0.05, f"Samples for 'mint' should have spread about 0.6, got {statistics.pstdev(_s):.3f}"
assert len(set(_s)) > 3900, "Samples should (almost) all be different: are you drawing a new value each time?"
assert generate(_models, "mint", 5, seed=7) == generate(_models, "mint", 5, seed=7), "The same seed must reproduce the same samples"
assert abs(statistics.fmean(generate(_models, "basil", 4000, seed=1)) - 10.3) < 0.05, "The label must select which distribution is sampled"
print("Step 4 passed: first three synthetic readings ->", [round(v, 2) for v in _s[:3]])

@@step
{
  "stepNumber": 5,
  "title": "The diffusion forward process",
  "instruction": "Implement forward_noise(x0, alpha_bar, eps). Return math.sqrt(alpha_bar) * x0 + math.sqrt(1 - alpha_bar) * eps. This is the closed-form formula from Section 2 that jumps from clean data straight to any noise level. With alpha_bar = 1 the data is untouched; with alpha_bar = 0 it is pure noise. Image generators are trained to reverse exactly this. [MOD-1.5]",
  "hintConceptual": "It is a blend of signal and noise. The two square-root coefficients are designed so that as one shrinks the other grows, keeping the overall variance steady.",
  "hintSyntax": "return math.sqrt(alpha_bar) * x0 + math.sqrt(1 - alpha_bar) * eps"
}
@@assert
assert forward_noise(2.0, 1.0, 0.7) == 2.0, "alpha_bar = 1 must return the clean value unchanged"
assert forward_noise(2.0, 0.0, 0.7) == 0.7, "alpha_bar = 0 must return pure noise (eps)"
assert abs(forward_noise(2.0, 0.25, 1.0) - (0.5 * 2.0 + math.sqrt(0.75))) < 1e-9, "Check the square roots: sqrt(0.25) * 2.0 + sqrt(0.75) * 1.0"
_rng = random.Random(3)
_clean = [_rng.choice([-2.0, 2.0]) for _ in range(5000)]
_noised = [forward_noise(x, 0.0, _rng.gauss(0, 1)) for x in _clean]
assert abs(statistics.fmean(_noised)) < 0.08 and abs(statistics.pstdev(_noised) - 1.0) < 0.08, "At alpha_bar = 0 the result should be standard normal noise"
_half = [forward_noise(x, 0.5, _rng.gauss(0, 1)) for x in _clean]
assert abs(statistics.pstdev(_half) - math.sqrt(0.5 * 4.0 + 0.5)) < 0.08, "At alpha_bar = 0.5 the variance should be 0.5 * 4 + 0.5 = 2.5"
print("Step 5 passed: you can destroy data exactly the way a diffusion model learns to rebuild it.")
