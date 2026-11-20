@@meta
{
  "moduleId": "MOD-1.8",
  "slug": "mod-1-8",
  "unitId": "UNIT-1",
  "unitTitle": "Unit 1: Understanding AI from Basics",
  "title": "AI Models Explained",
  "difficulty": "Foundational",
  "estimatedMinutes": 100,
  "citations": [
    { "title": "Reasoning models guide", "source": "OpenAI Docs", "url": "https://developers.openai.com/api/docs/guides/reasoning" },
    { "title": "Extended thinking", "source": "Anthropic Docs", "url": "https://platform.claude.com/docs/en/build-with-claude/extended-thinking" },
    { "title": "Why we no longer evaluate SWE-bench Verified", "source": "OpenAI", "url": "https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/" },
    { "title": "Artificial Analysis Intelligence Benchmarking Methodology", "source": "Artificial Analysis", "url": "https://artificialanalysis.ai/methodology/intelligence-benchmarking" },
    { "title": "Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference", "source": "arXiv", "url": "https://arxiv.org/pdf/2403.04132" },
    { "title": "Chatbot Arena: New models and Elo system update", "source": "LMSYS Blog", "url": "https://lmsys.org/blog/2023-12-07-leaderboard" },
    { "title": "Humanity's Last Exam benchmark review", "source": "Epoch AI", "url": "https://epoch.ai/benchmarks/hle/review" },
    { "title": "Model Cards", "source": "Hugging Face Docs", "url": "https://huggingface.co/docs/hub/model-cards" }
  ],
  "videoLibrary": [
    {
      "id": "VID-1.8-1",
      "title": "Local AI Explained | Hardware, Setup and Models",
      "creator": "Syntax",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=QKdKcFjjZhE",
      "timingInstruction": "Rewatch before Section 2 with one question in mind: what exactly is a parameter?",
      "keyTakeaway": "What it takes to run models locally: the hardware, the setup, and choosing a model size."
    },
    {
      "id": "VID-1.8-2",
      "title": "Five Steps to Create a New AI Model",
      "creator": "IBM Technology",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=jcgaNrC4ElU",
      "timingInstruction": "Watch the first 20 minutes after reading Section 1",
      "keyTakeaway": "The lifecycle that produces a model: data, training, evaluation, and deployment."
    },
    {
      "id": "VID-1.8-3",
      "title": "What Are Vision Language Models? How AI Sees & Understands Images",
      "creator": "IBM Technology",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=lOD_EE96jhM",
      "timingInstruction": "Watch the sections on base models, post-training, and thinking models after Section 2",
      "keyTakeaway": "How multimodal models combine images and text, extending the model families in this module."
    },
    {
      "id": "VID-1.8-4",
      "title": "Generative AI: Foundation Models and Platforms",
      "creator": "IBM",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/generative-ai-foundation-models-and-platforms",
      "timingInstruction": "Take after this module for a tour of model families and hosting platforms",
      "keyTakeaway": "About six hours on the main families of foundation models and the platforms that serve them, with hands-on exploration of a model hub."
    },
    {
      "id": "VID-1.8-5",
      "title": "Introduction to Large Language Models",
      "creator": "Google Cloud",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/introduction-to-large-language-models",
      "timingInstruction": "Optional short vocabulary review",
      "keyTakeaway": "A brief refresher on model terminology and use cases from one vendor's point of view."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Read Model Specs and Benchmarks Like an Engineer",
    "context": "Your manager forwards a vendor slide claiming a new 70-billion-parameter model 'runs on a laptop' and 'beats the competition by 3 points'. You will build the calculators needed to test both claims: memory footprint from parameter count, the precision that fits a given machine, Elo ratings from head-to-head votes, and a confidence interval that shows whether a benchmark gap is real.",
    "language": "python"
  }
}

@@reading
# AI Models Explained

Every week brings a new model with a new name, a parameter count, and a chart showing it at the top of something. Without a framework this is noise. With one, a model announcement becomes a short list of answerable questions: what kind of model is it, how big is it and what does that imply, and how much should the benchmark numbers move you? This chapter gives you that framework and the arithmetic to go with it.

## 1. First-Principles Mental Model & Intuition

### A kitchen and a cook

Think of a model as a kitchen plus a trained cook.

The **architecture** is the kitchen: the layout, the stations, the order in which a dish moves from one to the next. It is a design, written as code, and it is usually only a few hundred lines. Two models with the same architecture have the same kitchen.

The **weights**, also called **parameters**, are the cook's training. Imagine billions of small dials, each controlling one tiny judgement: a little more of this, a little less of that. Training sets every dial. After training the dials are locked.

A model is the two together. The architecture without weights is an empty kitchen that produces nothing useful. The weights without the architecture are a list of numbers with no meaning. This is why a downloaded model is always two things: a small amount of code and a very large file of numbers.

### What the parameter count tells you, and what it does not

The **parameter count** is the number of dials. A "7B" model has seven billion. A "70B" model has seventy billion.

It tells you three things reliably:

- how large the file is,
- how much memory you need to run it,
- roughly how much computation each generated token costs.

It does not tell you how good the model is. More dials allow more to be learned, but what was actually learned depends on the training data, the training method, and the tuning afterwards. A well-trained small model from this year regularly outperforms a larger model from two years ago. Treat parameter count as a measure of *cost*. Do not read it as a measure of *quality*.

### One cook, several job titles

The same kind of trained network is packaged in different ways for different jobs.

| Category | What it outputs | Kitchen analogy | Typical use |
|---|---|---|---|
| Base model | A continuation of whatever text it is given | A cook who finishes any dish you start | Research, and as the raw material for the others |
| Chat (instruct) model | A reply to an instruction | The same cook trained to take orders | Assistants, most everyday tasks |
| Reasoning model | A reply, after hidden working-out | A cook who drafts on scratch paper first | Hard multi-step problems |
| Embedding model | A list of numbers, not text | A cook who files dishes by similarity | Search, clustering, retrieval |
| Multimodal model | Text, and it accepts or produces images, audio, or video | A cook who can also read a photo of a dish | Documents with images, voice, vision |
| Small model | Same as chat, with fewer parameters | A fast cook with a short menu | Phones, laptops, high-volume cheap tasks |

These are not rival technologies. They are the same underlying idea with different training goals and different sizes.

### A benchmark is an exam

A **benchmark** is a fixed set of questions with known answers, used to compare models. It is an exam. Everything you know about the limits of exams applies. A student who has seen the paper in advance scores well without understanding. A school that teaches only to the test produces high scores and narrow skills. An exam with errors in its answer key punishes correct answers. And a five-question quiz tells you much less than a five-hundred-question exam. Each of these has an exact counterpart in AI benchmarks, covered in Section 2.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### From parameters to gigabytes

Each parameter is a number stored with some number of bits. The memory needed for the weights is:

$$
\text{bytes} = \frac{\text{parameters} \times \text{bits per parameter}}{8}
$$

Models are trained with 32-bit or 16-bit numbers. They can be stored and run at lower precision, a process called **quantization**, which rounds each number to fewer bits.

| Precision | Bits | Bytes per parameter | 7B model | 70B model |
|---|---|---|---|---|
| 32-bit float | 32 | 4 | 28 GB | 280 GB |
| 16-bit float | 16 | 2 | 14 GB | 140 GB |
| 8-bit integer | 8 | 1 | 7 GB | 70 GB |
| 4-bit | 4 | 0.5 | 3.5 GB | 35 GB |

Worked example for a 7-billion-parameter model at 16 bits:

$$
\frac{7 \times 10^{9} \times 16}{8} = 14 \times 10^{9} \text{ bytes} = 14 \text{ GB}
$$

Three practical corrections apply to this figure.

1. **Overhead.** Running the model needs working memory beyond the weights: intermediate results and the cache that stores earlier tokens. A common planning allowance is 20 percent on top, and more for very long contexts.
2. **Quantization is not free.** Rounding loses information. Going from 16 bits to 8 usually costs very little quality. Going to 4 bits costs a little more. Below 4 bits quality drops quickly.
3. **The memory must be the right kind.** For fast generation the weights need to sit in GPU memory, or in the unified memory of certain laptops. A machine with 64 GB of ordinary RAM and a small GPU can load a large model and run it slowly.

Now test the claim that a 70-billion-parameter model "runs on a laptop". At 4 bits the weights alone are 35 GB, about 42 GB with overhead. That fits only on a high-end machine with a great deal of unified memory, and nowhere near a typical 16 GB laptop.

### Model categories in more detail

**Base versus chat.** A base model has only been pre-trained to continue text. A chat model has additionally been fine-tuned on instruction and response examples and tuned on human preferences, as described in Module 1.3. Model names often signal this with suffixes such as "instruct" or "chat".

**Reasoning models.** These are trained to produce a stretch of intermediate working, often called thinking or reasoning tokens, before the final answer. Provider documentation describes controls for how much effort the model spends, and notes that these tokens count against output limits and are billed. Two points matter in practice. Reasoning improves results on hard multi-step problems and adds cost and delay on easy ones. And the thinking shown to you may be a summary. It is not guaranteed to be a faithful account of how the answer was produced.

**Embedding models.** These map a piece of text to a fixed-length list of numbers, a vector, such that texts with similar meanings get nearby vectors. They generate no text. They are the engine of semantic search and of the retrieval systems you will build in Unit 8.

**Multimodal models.** These accept or produce more than text. An image is cut into patches, each patch becomes a vector, and from there the same transformer machinery applies.

**Small models.** Models with a few billion parameters or fewer, designed to run on consumer hardware. They are cheaper and faster and, for well-defined tasks such as classification or extraction, often entirely sufficient.

### How head-to-head rankings work: Elo

Some leaderboards do not use questions with fixed answers at all. A person sees two anonymous answers to the same prompt and votes for the better one. Thousands of such votes are converted into ratings. The classic method is the **Elo** system from chess.

If model A has rating $R_A$ and model B has rating $R_B$, the expected score of A, meaning its probability of winning, is:

$$
E_A = \frac{1}{1 + 10^{(R_B - R_A)/400}}
$$

After a comparison in which A actually scored $S_A$ (1 for a win, 0.5 for a tie, 0 for a loss), the rating is updated:

$$
R_A' = R_A + K\,(S_A - E_A)
$$

$K$ controls how fast ratings move. The logic is that beating a much weaker opponent, which was expected, earns almost nothing, while an upset earns a lot.

Useful reference points from the first formula:

| Rating gap | Expected win rate of the higher-rated model |
|---|---|
| 0 | 50% |
| 20 | 53% |
| 100 | 64% |
| 400 | 91% |

Look at the second row. A 20-point lead on such a leaderboard means winning 53 comparisons in 100. That is real, and it is small. The widely used arena leaderboard now fits ratings with a related statistical model (Bradley-Terry) while still displaying Elo-style numbers. The interpretation is the same.

Human-preference rankings have their own biases. Voters tend to prefer longer, more confident, better-formatted answers regardless of correctness, and the people who vote are not a sample of your users.

### The benchmarks you will see quoted

| Benchmark | What it tests | Size | Known weaknesses |
|---|---|---|---|
| MMLU | Multiple-choice knowledge across 57 academic subjects | About 16,000 questions | Saturated: top models score around 90 percent, so it no longer separates them. Contains some wrong labels |
| GPQA | Graduate-level science multiple choice | 448 questions; the "Diamond" subset is 198 | Small, so scores carry wide uncertainty |
| SWE-bench Verified | Fixing real issues in open-source Python projects | 500 human-validated tasks | Public, so contamination is likely. In 2026 OpenAI announced it would stop reporting it, citing contamination and flawed tests |
| ARC-AGI | Abstract visual puzzles requiring a rule to be inferred from a few examples | Hundreds of puzzles, with a private test set | Resistant to memorisation, but scores depend heavily on how much computation is spent per puzzle |
| Humanity's Last Exam | Very hard expert-written questions | 2,500 questions | Independent reviews have reported a substantial share of disputed or incorrect answers in some subjects |
| Arena-style leaderboards | Human preference between two anonymous answers | Millions of votes | Style and length bias, unrepresentative voters |

Four failure modes recur.

- **Contamination.** If benchmark questions appear in a model's training data, the model can score well by recall. Public benchmarks leak onto the web, and the web is training data.
- **Saturation.** When top models all score near the ceiling, differences between them are noise.
- **Goodhart's law.** "When a measure becomes a target, it ceases to be a good measure." Once a benchmark matters commercially, models get tuned toward it specifically.
- **Incomparable settings.** The same model scores differently depending on the prompt format, whether tools are allowed, how much thinking is permitted, and whether the best of several attempts is counted. A vendor's number and an independent number for the same model can both be honest and still differ.

### How sure is a benchmark score?

A benchmark score is a measurement from a finite sample, so it has a margin of error. If a model answers a fraction $\hat{p}$ of $n$ questions correctly, the **standard error** of that fraction is:

$$
\text{SE} = \sqrt{\frac{\hat{p}\,(1 - \hat{p})}{n}}
$$

and an approximate 95 percent confidence interval is $\hat{p} \pm 1.96 \times \text{SE}$. At a score of 60 percent:

| Questions $n$ | Standard error | 95% margin |
|---|---|---|
| 198 | 3.5 points | about ±6.8 points |
| 500 | 2.2 points | about ±4.3 points |
| 2,500 | 1.0 point | about ±1.9 points |

Now test the claim "beats the competition by 3 points" on a 198-question benchmark. The margin of error on each score is nearly seven points. A three-point gap is well inside the noise.

For small samples or scores near 0 or 100 percent, the simple formula misbehaves, and practitioners use the **Wilson score interval**. With $z = 1.96$ for 95 percent confidence:

$$
\text{centre} = \frac{\hat{p} + \dfrac{z^{2}}{2n}}{1 + \dfrac{z^{2}}{n}}
\qquad
\text{half-width} = \frac{z}{1 + \dfrac{z^{2}}{n}} \sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z^{2}}{4n^{2}}}
$$

The interval is the centre plus and minus the half-width. You will implement it in the lab.

```text
 How to read a model announcement

   "NewModel-70B scores 62% on HardBench, beating RivalModel (59%)"
        |            |         |                    |
        |            |         |                    +-- what settings did each use? same prompts?
        |            |         +-- how many questions? is it public (contaminated)? saturated?
        |            +-- 62% of n: what is the margin of error?
        +-- 70B: memory = 70e9 * bits / 8. Which precision? Does it fit my hardware?
```

**Cost of the calculations.** Every formula in this section is constant-time arithmetic. Fitting ratings from a full history of $m$ comparisons takes one pass, time proportional to $m$, for the simple online Elo update.

## 3. Production-Grade Implementation & Annotated Walkthrough

The three calculators below turn the formulas into tools you can apply to any announcement. Standard library only.

```python
import math

def memory_gb(parameters, bits, overhead=0.0):
    """Memory for the weights in gigabytes (10**9 bytes), plus a fractional overhead."""
    return parameters * bits / 8 / 1e9 * (1 + overhead)

def best_precision(parameters, ram_gb, overhead=0.2):
    """Highest precision (in bits) that fits in ram_gb, or None if even 4-bit does not."""
    for bits in (32, 16, 8, 4):
        if memory_gb(parameters, bits, overhead) <= ram_gb:
            return bits
    return None

def elo_expected(r_a, r_b):
    """Probability that A beats B."""
    return 1 / (1 + 10 ** ((r_b - r_a) / 400))

def elo_update(r_a, r_b, score_a, k=32):
    """New ratings after one comparison. score_a is 1 (A wins), 0.5 (tie), or 0."""
    change = k * (score_a - elo_expected(r_a, r_b))
    return r_a + change, r_b - change

def wilson_interval(correct, total, z=1.96):
    """95% confidence interval for a benchmark score of correct/total."""
    p = correct / total
    denom = 1 + z * z / total
    centre = (p + z * z / (2 * total)) / denom
    half = z * math.sqrt(p * (1 - p) / total + z * z / (4 * total * total)) / denom
    return centre - half, centre + half

for name, params in (("7B", 7e9), ("70B", 70e9)):
    row = ", ".join(f"{bits}-bit {memory_gb(params, bits):6.1f} GB" for bits in (32, 16, 8, 4))
    print(f"{name:>4}: {row}")
print("70B on a 16 GB laptop :", best_precision(70e9, 16))
print("7B on a 16 GB laptop  :", best_precision(7e9, 16), "bits")

print("expected win rate with a 20-point lead :", round(elo_expected(1520, 1500), 3))
print("after an upset (1500 beats 1900)       :", tuple(round(r, 1) for r in elo_update(1500, 1900, 1)))

for n in (198, 500, 2500):
    low, high = wilson_interval(round(0.60 * n), n)
    print(f"60% on {n:>4} questions: {low:.3f} to {high:.3f}")
```

Line-by-line notes:

- **`memory_gb` uses decimal gigabytes.** One gigabyte here is $10^{9}$ bytes, the convention used for model sizes. Operating systems often report in units of $2^{30}$ bytes, about 7 percent larger, so reported numbers can differ slightly from your calculation.
- **`overhead` is explicit.** A function that silently added 20 percent would be hard to check against the table in Section 2. Keeping it as a parameter with a default of zero makes the pure formula testable and the planning figure a deliberate choice.
- **`best_precision` tries the highest precision first.** The loop order encodes a preference: use the least rounding that fits. It returns `None` when nothing fits, which is the honest answer to "does a 70B model run on a 16 GB laptop".
- **`elo_update` moves both ratings by the same amount in opposite directions.** Rating points are conserved: what one side gains the other loses. The upset example shows the asymmetry of surprise. A 1500-rated model beating a 1900-rated one gains about 29 of the 32 available points, because that result was expected only 9 percent of the time.
- **`wilson_interval` never leaves the range 0 to 1.** The simple "plus or minus 1.96 standard errors" formula can produce an upper bound above 100 percent for a near-perfect score on a small test. The Wilson form cannot, which is why it is preferred.
- **The last loop reproduces the table in Section 2.** On 198 questions a 60 percent score is compatible with a true ability anywhere from about 53 to 67 percent. On 2,500 questions the range shrinks to about 58 to 62.

A short extension shows why leaderboard gaps deserve caution:

```python
def distinguishable(k1, n1, k2, n2):
    """True only if the two scores' confidence intervals do not overlap."""
    low1, high1 = wilson_interval(k1, n1)
    low2, high2 = wilson_interval(k2, n2)
    return low1 > high2 or low2 > high1

print(distinguishable(129, 198, 119, 198))      # 65% vs 60% on 198 questions -> False
print(distinguishable(3250, 5000, 3000, 5000))  # 65% vs 60% on 5000 questions -> True
```

The same five-point gap is indistinguishable from chance on a small benchmark and clearly real on a large one. Requiring non-overlapping intervals is a conservative test: two scores can differ meaningfully while their intervals overlap slightly. As a first filter against over-reading a chart, conservative is the right direction to err.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**"Bigger is better" is the most persistent misconception.** People who run models locally repeat the same lesson: a recent, well-trained model at a third of the size often beats an older giant. Compare models on your task. Parameter counts are not a ranking.

**Parameter count is not the memory requirement.** The same model needs 28 GB at 32-bit precision and 3.5 GB at 4-bit. Then add the cache for the context, which grows with every token of conversation. A model that loads successfully can still run out of memory on a long prompt.

**Quantization has a knee.** Community testing consistently finds little visible loss down to around 4 or 5 bits, and a sharp decline below that. When memory forces a choice, a larger model at 4-bit is commonly reported to beat a smaller model at 8-bit, though it is worth testing on your own task.

**Leaderboard rank is not fitness for your task.** A model that leads on a coding benchmark may be worse than a mid-table model at writing in your client's tone. Keep a private set of 20 to 50 examples from your real work and run every candidate on it. Because it is private it cannot be contaminated, which makes it the most trustworthy benchmark you will have.

**Small gaps are noise.** A two-point difference on a few hundred questions, or a ten-point difference in an arena rating, is within the margin of error. Vendors still build headlines on them.

**Vendor numbers are chosen.** A launch post shows the benchmarks on which the new model wins, under settings the vendor chose. That is marketing doing its job. Look for independent reproductions, and check whether the comparison used the same prompt format, tools, and thinking budget for every model.

**Hard benchmarks can be wrong.** Reviews of several difficult benchmarks have found errors in the answer keys and tests that reject correct solutions. A model can lose points for being right. Above a certain score, improvement may partly reflect learning the benchmark's quirks.

**Benchmarks die.** Contamination and saturation give every public benchmark a limited useful life. One that discriminated well two years ago may now be meaningless. Check when a benchmark was released and whether top scores are bunched at the ceiling.

**Reasoning is not always worth it.** Reasoning models cost more and respond more slowly. For extraction, classification, and simple rewriting they add expense and delay with no benefit. Match the model type to the difficulty of the task.

**The displayed "thinking" is not a transcript of the model's mind.** Providers state that the reasoning you see may be summarised, and research has shown that a model's stated reasoning does not always match what determined its answer. Use it as a debugging aid. It is not proof.

**Read the model card before the leaderboard.** The intended-use and limitations sections, the license, and the training-data cutoff date decide whether you can use a model at all. People routinely choose a model from a chart and discover the license problem afterwards.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A model is an architecture plus learned weights. The parameter count determines file size, memory, and compute cost through the formula bytes equals parameters times bits divided by eight, and it says little about quality. Quantization trades a small amount of quality for large memory savings down to about four bits. Base, chat, reasoning, embedding, multimodal, and small models are the same technology trained and sized for different jobs. Benchmarks are exams with all the weaknesses of exams: contamination, saturation, targeting, incomparable settings, and sampling error. A score from $n$ questions carries a margin of error that shrinks only with the square root of $n$, and a rating gap translates into a win probability that is often close to a coin flip. The only benchmark that cannot be gamed is a private one built from your own work.

**Question 1.** A model has 13 billion parameters. Compute the memory for its weights at 16-bit and at 4-bit precision, and decide whether each fits on a machine with 12 GB of GPU memory, allowing 20 percent overhead.

<details>
<summary>View Answer</summary>

At 16 bits: 13 billion times 16, divided by 8, is 26 billion bytes, or 26 GB. With 20 percent overhead that is 31.2 GB, which does not fit in 12 GB. At 4 bits: 13 billion times 4, divided by 8, is 6.5 GB. With overhead that is 7.8 GB, which fits in 12 GB with room for a moderate context. At 8 bits it would be 13 GB, or 15.6 GB with overhead, which does not fit. So this model can run on that machine only at 4-bit quantization, with some loss of quality compared with the full-precision version.

</details>

**Question 2.** Model A leads Model B by 15 points on an arena-style leaderboard. Using the Elo expected-score formula, roughly how often would A's answer be preferred, and what does that imply for choosing between them?

<details>
<summary>View Answer</summary>

The expected score is 1 divided by (1 plus 10 to the power of minus 15 over 400). The exponent is minus 0.0375, and 10 to that power is about 0.917, so the expected score is about 1 divided by 1.917, or 0.52. A would be preferred in roughly 52 of 100 comparisons. That is barely better than a coin flip, and it is an average over all the kinds of prompts voters happened to submit and the styles they happened to like. It implies the leaderboard gap should not decide the choice. Cost, speed, license, and performance on your own examples should.

</details>

**Question 3.** A vendor reports that its model scores 64 percent on a 200-question benchmark and a competitor scores 61 percent. Give three distinct reasons this does not establish that the vendor's model is better.

<details>
<summary>View Answer</summary>

First, sampling error: at about 60 percent on 200 questions the standard error is roughly 3.5 points, so the 95 percent margin on each score is close to 7 points and a 3-point gap is well within noise. Second, contamination and targeting: if the benchmark is public, either model may have seen its questions in training, and the vendor may have tuned for it, so the score may reflect familiarity with the test. Third, incomparable settings: the two scores may have been obtained with different prompt formats, tool access, thinking budgets, or numbers of attempts, particularly if the competitor's score was taken from a different source. A fourth possible reason is errors in the benchmark's own answer key. The claim would need the same settings for both models, a larger or private test set, and a confidence interval before it meant much.

</details>

@@starter
"""
Lab: Read Model Specs and Benchmarks Like an Engineer
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".
"""
import math


# ---------------------------------------------------------------- Step 1
def memory_gb(parameters, bits, overhead=0.0):
    """Memory needed for a model's weights, in gigabytes (1 GB = 10**9 bytes).

    bytes = parameters * bits / 8, then multiply by (1 + overhead).
    """
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def best_precision(parameters, ram_gb, overhead=0.2):
    """Return the HIGHEST precision in bits, tried in the order 32, 16, 8, 4, whose
    memory_gb(parameters, bits, overhead) is <= ram_gb. Return None if none fits."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def elo_expected(r_a, r_b):
    """Probability that A beats B:  1 / (1 + 10 ** ((r_b - r_a) / 400))"""
    # TODO Step 3a
    return None


def elo_update(r_a, r_b, score_a, k=32):
    """Return the new ratings (new_r_a, new_r_b) after one comparison.

    score_a is 1 if A won, 0.5 for a tie, 0 if A lost.
    change = k * (score_a - elo_expected(r_a, r_b));  A gains `change`, B loses `change`.
    """
    # TODO Step 3b
    return None


# ---------------------------------------------------------------- Step 4
def wilson_interval(correct, total, z=1.96):
    """95% confidence interval (low, high) for a score of correct/total.

    p      = correct / total
    denom  = 1 + z*z / total
    centre = (p + z*z / (2*total)) / denom
    half   = z * sqrt(p*(1-p)/total + z*z / (4*total*total)) / denom
    return (centre - half, centre + half)
    """
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def distinguishable(k1, n1, k2, n2):
    """True if the Wilson intervals of the two scores (k1/n1 and k2/n2) do NOT overlap."""
    # TODO Step 5: compute both intervals; return True when one interval lies entirely
    #              above the other (low1 > high2 or low2 > high1), otherwise False.
    return None


if __name__ == "__main__":
    print("7B at 16-bit      :", memory_gb(7e9, 16))
    print("70B on 16 GB      :", best_precision(70e9, 16))
    print("20-point lead     :", elo_expected(1520, 1500))
    print("60% of 198        :", wilson_interval(119, 198))
    print("65% vs 60% on 198 :", distinguishable(129, 198, 119, 198))

@@solution
"""
Lab solution: Read Model Specs and Benchmarks Like an Engineer
Standard library only.
"""
import math


# ---------------------------------------------------------------- Step 1
def memory_gb(parameters, bits, overhead=0.0):
    """bytes = parameters * bits / 8.

    Decimal gigabytes (10**9 bytes) are the convention for model sizes. Overhead is an
    explicit argument so the pure formula stays easy to check against a table.
    """
    return parameters * bits / 8 / 1e9 * (1 + overhead)


# ---------------------------------------------------------------- Step 2
def best_precision(parameters, ram_gb, overhead=0.2):
    """Prefer the least rounding that fits: try 32, then 16, then 8, then 4 bits.

    None is the honest answer when even 4-bit does not fit.
    """
    for bits in (32, 16, 8, 4):
        if memory_gb(parameters, bits, overhead) <= ram_gb:
            return bits
    return None


# ---------------------------------------------------------------- Step 3
def elo_expected(r_a, r_b):
    """Expected score of A. Equal ratings give 0.5; a 400-point lead gives about 0.91."""
    return 1 / (1 + 10 ** ((r_b - r_a) / 400))


def elo_update(r_a, r_b, score_a, k=32):
    """Rating points are conserved: what A gains, B loses.

    An expected result moves ratings very little; an upset moves them a lot.
    """
    change = k * (score_a - elo_expected(r_a, r_b))
    return r_a + change, r_b - change


# ---------------------------------------------------------------- Step 4
def wilson_interval(correct, total, z=1.96):
    """Wilson score interval. Unlike p +/- 1.96*SE it never leaves the range 0..1."""
    p = correct / total
    denom = 1 + z * z / total
    centre = (p + z * z / (2 * total)) / denom
    half = z * math.sqrt(p * (1 - p) / total + z * z / (4 * total * total)) / denom
    return centre - half, centre + half


# ---------------------------------------------------------------- Step 5
def distinguishable(k1, n1, k2, n2):
    """A conservative first filter against over-reading a leaderboard gap."""
    low1, high1 = wilson_interval(k1, n1)
    low2, high2 = wilson_interval(k2, n2)
    return low1 > high2 or low2 > high1


if __name__ == "__main__":
    for name, params in (("7B", 7e9), ("70B", 70e9)):
        row = ", ".join(f"{bits}-bit {memory_gb(params, bits):6.1f} GB" for bits in (32, 16, 8, 4))
        print(f"{name:>4}: {row}")
    print("70B on a 16 GB laptop :", best_precision(70e9, 16))
    print("7B on a 16 GB laptop  :", best_precision(7e9, 16), "bits")

    for gap in (0, 20, 100, 400):
        print(f"rating gap {gap:>3}: expected win rate {elo_expected(1500 + gap, 1500):.2f}")
    print("after an upset (1500 beats 1900):", tuple(round(r, 1) for r in elo_update(1500, 1900, 1)))

    for n in (198, 500, 2500):
        low, high = wilson_interval(round(0.60 * n), n)
        print(f"60% on {n:>4} questions: {low:.3f} to {high:.3f}")

    print("65% vs 60% on 198 questions distinguishable? ", distinguishable(129, 198, 119, 198))
    print("65% vs 60% on 5000 questions distinguishable?", distinguishable(3250, 5000, 3000, 5000))

@@step
{
  "stepNumber": 1,
  "title": "Parameters to gigabytes",
  "instruction": "Implement memory_gb(parameters, bits, overhead). Compute parameters * bits / 8 to get bytes, divide by 1e9 to get gigabytes, and multiply by (1 + overhead). With the default overhead of 0 this is exactly the formula from Section 2: a 7-billion-parameter model at 16 bits needs 14 GB for its weights. [MOD-1.8]",
  "hintConceptual": "Every parameter is one stored number. The storage per number depends on its precision in bits, and there are 8 bits in a byte. Overhead is extra working memory expressed as a fraction of the weights.",
  "hintSyntax": "return parameters * bits / 8 / 1e9 * (1 + overhead)"
}
@@assert
assert memory_gb(7e9, 16) == 14.0, f"7B parameters at 16 bits is 14.0 GB, got {memory_gb(7e9, 16)}"
assert memory_gb(7e9, 32) == 28.0, "7B parameters at 32 bits is 28.0 GB"
assert memory_gb(70e9, 4) == 35.0, "70B parameters at 4 bits is 35.0 GB"
assert abs(memory_gb(7e9, 16, overhead=0.2) - 16.8) < 1e-9, "20% overhead on 14 GB gives 16.8 GB"
assert memory_gb(1e9, 8) == 1.0, "1B parameters at 8 bits is exactly 1 GB"
print("Step 1 passed: you can size any model from its parameter count.")

@@step
{
  "stepNumber": 2,
  "title": "Which precision fits this machine?",
  "instruction": "Implement best_precision(parameters, ram_gb, overhead). Try the precisions 32, 16, 8, and 4 bits in that order and return the first one for which memory_gb(parameters, bits, overhead) is less than or equal to ram_gb. If none fits, return None. This answers the practical question behind every 'runs on a laptop' claim. [MOD-1.8]",
  "hintConceptual": "Higher precision means less rounding and better quality, so prefer it when it fits. Work down the list and stop at the first precision that fits in the available memory.",
  "hintSyntax": "for bits in (32, 16, 8, 4):\n    if memory_gb(parameters, bits, overhead) <= ram_gb:\n        return bits\nreturn None"
}
@@assert
assert best_precision(7e9, 16) == 8, "A 7B model with 20% overhead needs 16.8 GB at 16-bit, so on 16 GB the best fit is 8-bit"
assert best_precision(7e9, 24) == 16, "On 24 GB a 7B model fits at 16-bit (16.8 GB)"
assert best_precision(1e9, 16) == 32, "A 1B model fits at full 32-bit precision on 16 GB"
assert best_precision(70e9, 16) is None, "A 70B model does not fit on 16 GB even at 4-bit (42 GB with overhead)"
assert best_precision(70e9, 48) == 4, "A 70B model fits on 48 GB only at 4-bit"
assert best_precision(7e9, 14, overhead=0.0) == 16, "With zero overhead a 7B model fits exactly at 16-bit in 14 GB (use <=)"
print("Step 2 passed: a 70B model does not run on a 16 GB laptop.")

@@step
{
  "stepNumber": 3,
  "title": "Elo: expected score and update",
  "instruction": "Implement two functions. elo_expected(r_a, r_b) returns 1 / (1 + 10 ** ((r_b - r_a) / 400)), the probability that A beats B. elo_update(r_a, r_b, score_a, k) computes change = k * (score_a - elo_expected(r_a, r_b)) and returns the tuple (r_a + change, r_b - change). These are the formulas that turn thousands of head-to-head votes into the ratings on arena-style leaderboards. [MOD-1.8]",
  "hintConceptual": "A rating predicts a win rate. After each comparison the ratings move by how surprising the result was: nothing for an expected result, a lot for an upset. Whatever one side gains, the other loses.",
  "hintSyntax": "# elo_expected\nreturn 1 / (1 + 10 ** ((r_b - r_a) / 400))\n\n# elo_update\nchange = k * (score_a - elo_expected(r_a, r_b))\nreturn r_a + change, r_b - change"
}
@@assert
assert elo_expected(1500, 1500) == 0.5, "Equal ratings must give an expected score of 0.5"
assert abs(elo_expected(1900, 1500) - 10 / 11) < 1e-12, "A 400-point lead gives 10/11, about 0.909"
assert abs(elo_expected(1520, 1500) - 0.5287) < 1e-3, "A 20-point lead gives about 0.529"
assert abs(elo_expected(1500, 1900) + elo_expected(1900, 1500) - 1.0) < 1e-12, "The two expected scores must sum to 1"
_a, _b = elo_update(1500, 1500, 1, k=32)
assert (_a, _b) == (1516.0, 1484.0), f"Equal ratings, A wins, k=32: expected (1516.0, 1484.0), got {(_a, _b)}"
_u = elo_update(1500, 1900, 1, k=32)
assert abs(_u[0] - 1529.0909) < 1e-3 and abs(_u[1] - 1870.9091) < 1e-3, "An upset (1500 beats 1900) should move about 29 points"
_t = elo_update(1600, 1400, 0.5)
assert _t[0] < 1600 and _t[1] > 1400, "A tie should cost the higher-rated model points"
assert abs(sum(elo_update(1712, 1489, 0)) - (1712 + 1489)) < 1e-9, "Rating points must be conserved"
print("Step 3 passed: a 20-point lead is a 53% win rate.")

@@step
{
  "stepNumber": 4,
  "title": "Put error bars on a benchmark score",
  "instruction": "Implement wilson_interval(correct, total, z). Let p = correct / total, denom = 1 + z*z/total, centre = (p + z*z/(2*total)) / denom, and half = z * math.sqrt(p*(1-p)/total + z*z/(4*total*total)) / denom. Return the tuple (centre - half, centre + half). This is the Wilson score interval from Section 2, the standard way to state how uncertain a score from a finite number of questions is. [MOD-1.8]",
  "hintConceptual": "A benchmark score is an estimate from a sample. Fewer questions means a wider range of true abilities are compatible with the observed score. The interval shrinks with the square root of the number of questions.",
  "hintSyntax": "p = correct / total\ndenom = 1 + z * z / total\ncentre = (p + z * z / (2 * total)) / denom\nhalf = z * math.sqrt(p * (1 - p) / total + z * z / (4 * total * total)) / denom\nreturn centre - half, centre + half"
}
@@assert
_w = wilson_interval(119, 198)
assert _w is not None and len(_w) == 2, "wilson_interval must return a tuple (low, high)"
_z = 1.96; _p = 119 / 198; _n = 198
_den = 1 + _z * _z / _n
_c = (_p + _z * _z / (2 * _n)) / _den
_h = _z * math.sqrt(_p * (1 - _p) / _n + _z * _z / (4 * _n * _n)) / _den
assert abs(_w[0] - (_c - _h)) < 1e-12 and abs(_w[1] - (_c + _h)) < 1e-12, "Check the formula for centre and half-width"
assert 0.52 < _w[0] < 0.54 and 0.66 < _w[1] < 0.68, f"60% on 198 questions should span roughly 0.53 to 0.67, got {_w}"
_big = wilson_interval(1500, 2500)
assert (_big[1] - _big[0]) < (_w[1] - _w[0]) / 3, "The interval on 2500 questions must be much narrower than on 198"
_perfect = wilson_interval(20, 20)
assert _perfect[1] <= 1.0 + 1e-12 and _perfect[0] < 0.9, "A perfect score on 20 questions must not exceed 1.0, and its lower bound is well below 1"
_zero = wilson_interval(0, 20)
assert abs(_zero[0]) < 1e-12 and _zero[1] > 0.1, "A zero score on 20 questions has a lower bound of 0 and a clearly positive upper bound"
print(f"Step 4 passed: 60% on 198 questions means {_w[0]:.2f} to {_w[1]:.2f}.")

@@step
{
  "stepNumber": 5,
  "title": "Is the gap real?",
  "instruction": "Implement distinguishable(k1, n1, k2, n2). Compute the Wilson interval for each score with wilson_interval, and return True only when the intervals do not overlap: when the first interval's low end is above the second's high end, or the second's low end is above the first's high end. Otherwise return False. Use it to test the vendor claim from the lab scenario: the same 5-point gap can be noise on a small benchmark and real on a large one. [MOD-1.8]",
  "hintConceptual": "If the ranges of plausible true scores for two models overlap, the data cannot tell you which is better. Non-overlap is a deliberately cautious test.",
  "hintSyntax": "low1, high1 = wilson_interval(k1, n1)\nlow2, high2 = wilson_interval(k2, n2)\nreturn low1 > high2 or low2 > high1"
}
@@assert
assert distinguishable(129, 198, 119, 198) is False, "65% vs 60% on 198 questions overlap: not distinguishable"
assert distinguishable(3250, 5000, 3000, 5000) is True, "65% vs 60% on 5000 questions do not overlap: distinguishable"
assert distinguishable(3000, 5000, 3250, 5000) is True, "The order of the two models must not matter"
assert distinguishable(128, 200, 122, 200) is False, "A 3-point gap on 200 questions is noise"
assert distinguishable(190, 200, 100, 200) is True, "95% vs 50% on 200 questions is clearly a real difference"
assert distinguishable(50, 100, 50, 100) is False, "Identical scores are never distinguishable"
print("Step 5 passed: you can now tell a real benchmark gap from noise.")
