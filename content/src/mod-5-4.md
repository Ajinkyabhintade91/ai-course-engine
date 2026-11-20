@@meta
{
  "moduleId": "MOD-5.4",
  "slug": "mod-5-4",
  "unitId": "UNIT-5",
  "unitTitle": "Unit 5: Complete Prompt Engineering Master Class",
  "title": "Few-Shot Prompting",
  "difficulty": "Intermediate",
  "estimatedMinutes": 95,
  "citations": [
    { "title": "Language Models are Few-Shot Learners", "source": "arXiv", "url": "https://arxiv.org/abs/2005.14165" },
    { "title": "Calibrate Before Use: Improving Few-Shot Performance of Language Models", "source": "arXiv", "url": "https://arxiv.org/abs/2102.09690" },
    { "title": "Rethinking the Role of Demonstrations: What Makes In-Context Learning Work?", "source": "arXiv", "url": "https://arxiv.org/abs/2202.12837" },
    { "title": "Fantastically Ordered Prompts and Where to Find Them: Overcoming Few-Shot Prompt Order Sensitivity", "source": "arXiv", "url": "https://arxiv.org/abs/2104.08786" },
    { "title": "What Makes Good In-Context Examples for GPT-3?", "source": "arXiv", "url": "https://arxiv.org/abs/2101.06804" },
    { "title": "Prompting best practices (use examples effectively)", "source": "Anthropic Docs", "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" }
  ],
  "videoLibrary": [
    {
      "id": "VID-5.4-1",
      "title": "Zero-shot, One-shot and Few-shot Prompting Explained | Prompt Engineering 101",
      "creator": "Analytics Vidhya",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=sW5xoicq5TY",
      "timingInstruction": "Watch before Section 1 as a short reminder that a model continues a pattern",
      "keyTakeaway": "How adding examples changes model behaviour, from zero-shot to few-shot."
    },
    {
      "id": "VID-5.4-2",
      "title": "Discover Few-Shot Prompting | Google AI Essentials",
      "creator": "Grow with Google",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=9qdgEBVkWR4",
      "timingInstruction": "Watch the section on how models are used after training, after reading Section 2",
      "keyTakeaway": "Google's short lesson on choosing examples for few-shot prompts."
    },
    {
      "id": "VID-5.4-3",
      "title": "Prompt Engineering for ChatGPT",
      "creator": "Vanderbilt University",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/prompt-engineering",
      "timingInstruction": "Take the lessons on few-shot examples after completing the lab",
      "keyTakeaway": "Works through few-shot patterns with many examples, including examples of intermediate steps and of actions."
    },
    {
      "id": "VID-5.4-4",
      "title": "Google Prompting Essentials",
      "creator": "Google",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/google-prompting-essentials",
      "timingInstruction": "Optional, alongside Unit 5",
      "keyTakeaway": "Includes practice in adding examples to a prompt and judging whether they improved the output."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Examples, Their Biases, and How to Correct Them",
    "context": "A support team labels customer reviews with a model and has noticed that results change when the examples in the prompt are shuffled. You will work with a stand-in model that learns from examples, and build the tools to use examples well: a consistent few-shot format, a check on label balance, a measurement of sensitivity to order, a selector that picks the most relevant examples for each input, and a calibration that removes a built-in bias.",
    "language": "python"
  }
}

@@reading
# Few-Shot Prompting

There is a limit to what description can do. You can write a paragraph explaining the tone you want for a product announcement, and the model will produce something in a tone. Or you can paste two announcements you like, and it will produce a third that sounds like them.

Giving examples in the prompt is called **few-shot prompting**. A prompt with no examples is **zero-shot**. Examples are among the most reliable tools in prompting, and they have their own failure modes that description does not. This chapter explains why examples work, how to choose and arrange them, what biases they introduce, and when to use something else.

## 1. First-Principles Mental Model & Intuition

### Show, don't tell

A new colleague will process expense forms. You could write them a manual. Or you could hand over three completed forms and say "like these". Most people learn faster from the forms. They infer the format, the level of detail, which fields matter, and the unwritten conventions, all at once, without any of it being stated.

They also copy accidents. If all three sample forms happened to be for taxi fares, the newcomer may hesitate over a train ticket. If the last one they looked at had a mistake, they may repeat it.

A model given examples behaves the same way, for better and worse.

```text
   ZERO-SHOT                                FEW-SHOT

   Classify the sentiment                   Classify the sentiment of each review.
   of this review.
                                            Review: Great quality, works perfectly
   Review: The box was late                 Sentiment: positive
   Sentiment:
                                            Review: Arrived broken, no reply from support
                                            Sentiment: negative

                                            Review: The box was late
                                            Sentiment:
```

In the few-shot prompt, the model has seen what an answer looks like: one lowercase word, one of two labels. It does not need to be told. The examples carry the format, the set of permitted labels, the style, and the boundary between the categories.

### Why it works: continuing a pattern

Module 1.4 described a model as a predictor of what comes next. A few-shot prompt is a document with an obvious pattern, interrupted at the point where the next item belongs. The most probable continuation of "Review, Sentiment, Review, Sentiment, Review, Sentiment:" is another sentiment label of the same kind.

Nothing inside the model changes when it reads examples. Its parameters are exactly as they were. This is called **in-context learning**, and it is learning only in a loose sense: the model's behaviour adapts to the text in its window, for the length of that one request. The paper that introduced the GPT-3 model in 2020 was titled "Language Models are Few-Shot Learners" because this ability, to pick up a task from a handful of examples with no retraining, was its most striking result.

### What examples teach

Research gives a surprising answer to what the model takes from examples. A 2022 study replaced the correct labels in the examples with random ones and found that performance on classification tasks fell only a little. What mattered most was that the examples showed the **format**, the **range of inputs**, and the **set of possible labels**. The individual pairings of input to label mattered less than expected.

The practical reading is this. Examples are, first, a specification of what the output should look like and what kind of input to expect. Their correctness still matters, particularly with stronger models and harder tasks. But if your examples are inconsistent in format, the model has lost the main thing they were there to teach.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### In-context learning, formally

With $k$ examples, each an input $x_i$ and its output $y_i$, and a new input $x$, the model produces

$$
P_\theta(y \mid x_1, y_1, \dots, x_k, y_k, x)
$$

The parameters $\theta$ are unchanged by the examples. All the adaptation happens through what is to the right of the bar. Compare **fine-tuning**, covered below, in which the parameters themselves are altered by further training.

| | Zero-shot | Few-shot | Fine-tuning |
|---|---|---|---|
| Examples needed | None | A handful, in the prompt | Hundreds to thousands, in a training set |
| What changes | Nothing | The prompt | The model's parameters |
| Cost per request | Lowest | Higher: examples are sent every time | Low, after a one-off training cost |
| Time to change behaviour | Seconds | Seconds | Hours or days |

### Three biases

Examples steer the model. They also tilt it, in ways that have nothing to do with the input being classified. A 2021 paper, "Calibrate Before Use", identified three such biases in few-shot prompts.

**Majority label bias.** If most of the examples carry one label, the model favours that label. Four positive examples and one negative make "positive" more likely for any input.

**Recency bias.** The examples nearest the end of the prompt have more influence. If the last two examples are negative, the model leans negative.

**Common token bias.** The model favours answers that were frequent in its training data, whatever the examples say.

The first two are under your control, and they interact: a single minority example placed last is helped by recency, and placed first it is hurt twice.

### Order sensitivity

Because of recency, and for less understood reasons, the **order** of the same examples changes the results. A 2021 study found that reordering a fixed set of examples could move performance from near the best published results to near chance.

The number of possible orders grows very fast. For $k$ examples there are

$$
k! = k \times (k - 1) \times \dots \times 1
$$

orderings: 24 for four examples, 40,320 for eight. You cannot try them all. What you can do is measure how much a few random orders differ. If accuracy swings widely between orders, the prompt is fragile, and any single measurement of it is unreliable.

### Calibration

The majority and recency biases can be measured and removed. The method from the same 2021 paper is called **contextual calibration**.

Give the model a **content-free input**, such as "N/A", in place of a real one. A fair classifier with no evidence should be undecided. Whatever preference it shows is pure bias from the examples. Call those probabilities $p^{\text{cf}}$. Then, for a real input with probabilities $p$, divide each by the content-free value and rescale:

$$
q_\ell = \frac{p_\ell \, / \, p^{\text{cf}}_\ell}{\sum_{m} p_m \, / \, p^{\text{cf}}_m}
$$

For example, suppose the content-free input gives positive 0.8 and negative 0.2, so the prompt is heavily tilted to positive. A real review gives positive 0.545 and negative 0.455, which are 6/11 and 5/11 rounded. Uncorrected, it is labelled positive. Dividing the unrounded values: $0.5455 / 0.8 = 0.682$ and $0.4545 / 0.2 = 2.273$. Rescaled, these are 0.231 and 0.769. The review is negative. The evidence in the review pointed to negative all along, and the tilt had hidden it.

The paper reported that this correction improved accuracy by up to 30 percentage points on some tasks and made results much less sensitive to the choice and order of examples. In the chat applications you cannot see probabilities, so you cannot apply the formula. You can apply the idea: balance your examples so that there is little bias to remove.

### Choosing examples

Which examples should go in the prompt? Three properties matter.

| Property | Meaning | Why |
|---|---|---|
| **Relevant** | Similar to the input you are about to give | A 2021 study found that selecting the examples most similar to each input beat a fixed random set |
| **Diverse** | Covering the range of cases, including the awkward ones | A narrow set teaches a narrow rule, and its accidents get copied |
| **Consistent** | Identical in format, down to punctuation and capitalisation | Format is the main thing examples teach |

Relevance can be automated. Keep a pool of labelled examples, and for each new input pick the $k$ most similar. Similarity can be measured by shared words, as in this chapter's lab, or by the embeddings of Module 3.2. This is retrieval applied to examples.

On quantity, Anthropic's guidance is to include three to five examples for best results, to make them relevant and diverse, and to mark them clearly as examples so that the model does not confuse them with instructions or with the input. More is not always better: every example is sent with every request, and long example sets crowd the real input, as Module 5.3 explained.

### What examples cost

If each example is $e$ tokens and you use $k$ of them, every request carries

$$
T_{\text{examples}} = k \cdot e
$$

extra input tokens. Five examples of 150 tokens are 750 tokens per request. Over 100,000 requests that is 75 million tokens, which at USD 2 per million is USD 150. Prompt caching, from Module 3.2, reduces this for a fixed example set placed at the start of the prompt. It does not help when examples are selected freshly for each input, since the prefix then changes every time. That is a real trade-off between relevance and cost.

### Zero-shot, few-shot, or fine-tuning

| Situation | Use |
|---|---|
| The task is common and easy to describe | Zero-shot, with a clear instruction |
| The output needs a particular format, tone, or set of labels | Few-shot |
| Description keeps failing to convey what you want | Few-shot |
| Very high volume, a narrow stable task, and thousands of labelled examples | Consider fine-tuning |
| The model reasons at length before answering | Start zero-shot. Add examples of the final format only if needed |

The last row needs a word. Vendors' guidance for reasoning models is to begin without examples, since such models work out an approach themselves and can be distracted by examples of someone else's reasoning. Examples of the **output format** remain useful for every kind of model.

Fine-tuning is rarely the first answer. It needs a large set of good examples, takes time, must be repeated when the base model is replaced, and fixes behaviour in a way that is slow to change. The usual advice from providers is to exhaust prompting and few-shot first.

### Complexity

Building a few-shot prompt is linear in the examples. Selecting the $k$ most similar from a pool of $n$ costs $O(n)$ comparisons per input, or less with an index. Measuring order sensitivity exhaustively costs $k!$ evaluations, which is why it is sampled.

## 3. Production-Grade Implementation & Annotated Walkthrough

To see the biases at work, this section uses a stand-in model: a small program that classifies a review by comparing its words with the examples it has been given. It has two of the biases built in on purpose, so that they can be observed and then corrected.

```python
from itertools import permutations

STOPWORDS = {"a", "an", "and", "the", "was", "is", "my", "of", "to", "after", "in", "it", "i", "on",
             "very", "never", "for", "again"}

def keywords(text):
    return {word.strip(".,;:!?").lower() for word in text.split()} - STOPWORDS - {""}

def stub_probabilities(examples, query, recency=0.3):
    wanted, scores, n = keywords(query), {}, len(examples)
    for position, (text, label) in enumerate(examples):
        similarity = len(wanted & keywords(text))
        weight = 1 + recency * position / max(1, n - 1)
        scores[label] = scores.get(label, 0) + (0.5 + similarity) * weight
    total = sum(scores.values())
    return {label: score / total for label, score in scores.items()}

def predict(probabilities):
    return min(probabilities, key=lambda label: (-probabilities[label], label))

def accuracy(examples, test, recency=0.3):
    return sum(predict(stub_probabilities(examples, query, recency)) == gold for query, gold in test) / len(test)

POOL = [
    ("The delivery was fast and the driver was friendly", "positive"),
    ("Great quality, works perfectly", "positive"),
    ("Love the new design", "positive"),
    ("Friendly support fixed my problem quickly", "positive"),
    ("Arrived broken and support never replied", "negative"),
    ("Terrible quality, stopped working after a week", "negative"),
    ("The delivery was late and the box was damaged", "negative"),
    ("Refund took a month", "negative"),
]
TEST = [
    ("Fast delivery, friendly driver", "positive"), ("The box arrived damaged", "negative"),
    ("Works perfectly, great design", "positive"), ("Late delivery again", "negative"),
    ("Love the quality", "positive"), ("The box was late", "negative"),
    ("Quick fix, friendly support", "positive"), ("Damaged on delivery", "negative"),
]
```

- **Every example votes for its label.** An example contributes a base of 0.5 simply for being there, plus one for each word it shares with the query. The base vote is the majority bias: a label with more examples gets more votes even when nothing matches.
- **Later examples count for more.** The weight rises from 1 for the first example to 1 plus `recency` for the last. That is the recency bias. Setting `recency` to zero switches it off.
- **The result is a probability for each label.** Votes are divided by their total, so the outputs behave like the probabilities a real model assigns.
- **This is a caricature.** A real model does not count shared words. The stand-in is built to have the same two biases the research found, so that they can be studied in a few lines.

First, a consistent format and a check on balance.

```python
def format_few_shot(examples, query, instruction="Classify the sentiment of each review as positive or negative."):
    blocks = [instruction]
    blocks += [f"Review: {text}\nSentiment: {label}" for text, label in examples]
    blocks.append(f"Review: {query}\nSentiment:")
    return "\n\n".join(blocks)

def label_balance(examples):
    counts = {}
    for _, label in examples:
        counts[label] = counts.get(label, 0) + 1
    return counts, max(counts.values()) / len(examples)

SKEWED = POOL[0:4] + [POOL[6]]
print(format_few_shot(POOL[1:2] + POOL[4:5], "The box was late"))
print(label_balance(SKEWED), label_balance(POOL))
```

- **Every example and the query use the same two field names, "Review" and "Sentiment".** The final block ends at "Sentiment:" with nothing after it, which is the gap the model is being asked to fill. Identical formatting is what makes the continuation obvious.
- **The instruction comes first and states the permitted labels.** Examples show the labels. Saying them as well removes any doubt.
- **`label_balance` counts the labels and reports the share of the commonest.** The skewed set has four positive examples and one negative, a majority share of 0.8. The full pool is balanced at 0.5.

Next, the majority bias and its correction.

```python
def calibrate(probabilities, content_free):
    raw = {label: probabilities[label] / content_free[label] for label in probabilities}
    total = sum(raw.values())
    return {label: value / total for label, value in raw.items()}

bias = stub_probabilities(SKEWED, "N/A", recency=0)
print("content-free input:", {label: round(p, 3) for label, p in bias.items()})
print("accuracy with skewed examples:", accuracy(SKEWED, TEST, recency=0))
late = stub_probabilities(SKEWED, "Late delivery again", recency=0)
print("'Late delivery again':", {label: round(p, 3) for label, p in late.items()}, "->", predict(late))
fixed = calibrate(late, bias)
print("after calibration   :", {label: round(p, 3) for label, p in fixed.items()}, "->", predict(fixed))
calibrated = sum(predict(calibrate(stub_probabilities(SKEWED, query, recency=0), bias)) == gold for query, gold in TEST) / len(TEST)
print("accuracy after calibration:", calibrated)
```

- **The content-free input exposes the bias.** "N/A" shares no words with any example, so a fair classifier would say 0.5 each. The stand-in says 0.8 positive. That preference comes entirely from the four-to-one imbalance.
- **The bias costs two of eight test reviews.** Accuracy is 0.75. Both errors are negative reviews labelled positive.
- **"Late delivery again" is one of them.** Its words match the negative example better, but four base votes for positive outweigh the evidence, giving 0.545 to 0.455.
- **`calibrate` divides by the content-free probabilities and rescales.** This is the formula from Section 2. The review becomes 0.769 negative.
- **Calibration brings accuracy to 1.0.** Nothing about the examples changed. The built-in preference was measured and divided out.

Then, recency and order.

```python
def order_sensitivity(examples, test, recency=0.3):
    scores = [accuracy(list(order), test, recency) for order in permutations(examples)]
    return min(scores), max(scores), len(scores)

balanced = [POOL[0], POOL[1], POOL[5], POOL[6]]
print("positives first:", {label: round(p, 3) for label, p in stub_probabilities(balanced, "N/A").items()})
print("negatives first:", {label: round(p, 3) for label, p in stub_probabilities(balanced[2:] + balanced[:2], "N/A").items()})
print("same four examples, every order:", order_sensitivity([POOL[0], POOL[3], POOL[6], POOL[7]], TEST))
```

- **A balanced set is still tilted by order.** With two positive examples followed by two negative, the content-free input comes out 0.543 negative. Reverse the order and it is 0.543 positive. Whatever comes last is favoured.
- **`order_sensitivity` tries every arrangement.** `permutations` generates all 24 orders of four examples, and the function reports the worst accuracy, the best, and how many orders there were.
- **The same four examples score between 0.75 and 1.0.** Nothing differs between the best and worst arrangements except the order. A single measurement of this prompt could have reported either figure.
- **For larger sets, sample.** With eight examples there are 40,320 orders. Trying twenty at random tells you whether the prompt is fragile.

Finally, choosing examples for each input.

```python
def select_examples(pool, query, k):
    wanted = keywords(query)
    ranked = sorted(range(len(pool)), key=lambda index: (-len(wanted & keywords(pool[index][0])), index))
    return [pool[index] for index in sorted(ranked[:k])]

print("first three of the pool:", accuracy(POOL[:3], TEST))
chosen = sum(predict(stub_probabilities(select_examples(POOL, query, 3), query)) == gold for query, gold in TEST) / len(TEST)
print("three chosen per input :", chosen)
print(select_examples(POOL, "Late delivery again", 3))
```

- **`select_examples` ranks the pool by words shared with the query.** Ties are broken by position in the pool, so the result is repeatable. The chosen examples are returned in their original order.
- **The first three examples in the pool are all positive.** A prompt built from them has never seen a negative review, and scores 0.5: it calls everything positive. This is what happens when examples are taken from the top of a list.
- **Selecting three per input scores 1.0.** Each review is classified using the examples most like it. For "Late delivery again" the selection includes the one negative example about a late delivery, which is the example that matters.
- **Selection changes the prompt for every input.** That is the source of its accuracy and the reason it cannot be cached as a fixed prefix.

**Complexity.** `format_few_shot` and `label_balance` are linear in the examples. `calibrate` is linear in the number of labels. `order_sensitivity` evaluates $k!$ orders. `select_examples` compares the query with every example in the pool.

### A few-shot template

```text
[Instruction: the task, the permitted outputs, and what to do when unsure.]

Here are examples.

[Example 1: input, then output, in exactly the format wanted]
[Example 2: a different kind of case]
[Example 3: an awkward or borderline case]

Now do the same for this input.

[The new input, in the same format, stopping where the output should begin]
```

### A checklist for examples

1. **Identical format** in every example and in the final input.
2. **Three to five examples**, unless testing shows more help.
3. **Balanced labels**, or as close as the task allows.
4. **Varied cases**, including one that is hard.
5. **No accidental pattern**: not all the same length, topic, or opening word.
6. **Correct**: wrong examples teach wrong answers.
7. **Clearly marked** as examples, separate from the instruction and the input.
8. **Tested in more than one order.**
9. **Not drawn from the data you will test on.**

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Every example has the same label.** The quickest way to break a classifier is to show it five examples of one category. It learns that the answer is that category. Check the balance before anything else.

**The output copies an example too closely.** With one example, a model often reproduces its length, its opening, even its subject. Give two or three that differ in everything except what you want kept, or say which features to imitate.

**Inconsistent formatting.** One example ends with a full stop and another does not. One label is capitalised. One has a blank line and another has none. Format is the main thing examples teach, so inconsistency teaches confusion.

**Examples that leak the answer.** A test input, or something nearly identical to it, appears among the examples. Results look excellent and mean nothing. Keep the examples and the test set apart.

**The unrepresentative example.** One example with an unusual feature, a very long input, a rare label, is over-weighted because there are so few examples in total. Each one is a large share of what the model has seen.

**The last example dominates.** Because of recency, whatever is in the final example has extra pull. If results are skewed, look at what was placed last.

**More examples, worse results.** Past a handful, extra examples add cost and crowd the input, and in a long prompt the examples in the middle are used least. Three good examples usually beat fifteen.

**Examples where an instruction would do.** If the requirement is "answer in one word, yes or no", say so. Examples are for what is hard to describe. A schema, as in Module 5.5, is often better still for strict formats.

**Examples of reasoning for a reasoning model.** Showing a model that plans for itself someone else's step-by-step working can constrain it. For such models, give examples of the final answer's form, not of the route.

**Stale examples.** An example set written for last year's products or policy keeps teaching last year's answers. Examples are part of the prompt and need the same upkeep.

**One order tested.** A prompt is tried once, in the order the examples happened to be written, and declared good. Shuffle and run again. If the result moves, the prompt is fragile.

**Reaching for fine-tuning too early.** Teams with fifty examples want to train a model. Fifty examples are a few-shot pool and a test set. Fine-tuning needs far more, and brings a maintenance burden with it.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Few-shot prompting puts examples of the task in the prompt, and it works because a model continues a pattern: its parameters do not change, and its behaviour adapts to what is in its window. Examples teach format, the range of inputs, and the set of possible outputs above all, which is why consistent formatting matters so much. They also introduce biases: toward the label that appears most among the examples, and toward the examples nearest the end. The same examples in a different order can give noticeably different results, and with $k!$ possible orders only sampling can show how fragile a prompt is. A content-free input reveals the built-in bias, and dividing by it, which is calibration, removes it. Good examples are relevant to the input, varied, balanced, correct, and clearly marked, and three to five are usually enough. Selecting the most similar examples for each input raises accuracy at the cost of a prompt that cannot be cached. Fine-tuning changes the model itself and is worth considering only for narrow, stable, high-volume tasks with many labelled examples.

**Question 1.** A few-shot prompt for classifying support tickets as "urgent" or "routine" gives, for the content-free input "N/A", the probabilities urgent 0.7 and routine 0.3. For a real ticket it gives urgent 0.6 and routine 0.4. Apply contextual calibration and state the corrected probabilities and label. What does the content-free result tell you about the prompt, and what would you change?

<details>
<summary>View Answer</summary>

Divide each probability by its content-free value. For urgent, 0.6 divided by 0.7 is about 0.857. For routine, 0.4 divided by 0.3 is about 1.333. The two sum to about 2.190. Rescaling, urgent becomes 0.857 divided by 2.190, about 0.391, and routine becomes 1.333 divided by 2.190, about 0.609. The uncorrected label was urgent. The corrected label is routine. The content-free result shows that the prompt prefers "urgent" by 0.7 to 0.3 before it has seen any ticket at all. A fair prompt would be near 0.5 each. The real ticket's 0.6 for urgent is actually below the prompt's resting preference of 0.7, which means the evidence in the ticket pushed away from urgent, and calibration makes that visible. The bias most likely comes from the examples: more urgent examples than routine ones, or urgent examples placed last. The first change is to balance the examples, with equal numbers of each label, and to avoid ending on a run of one label. Then run the content-free input again to confirm the preference has moved toward 0.5. Where probabilities are available, calibration can be kept as a safeguard. Where they are not, as in a chat application, balancing and reordering the examples is the available form of the same correction.

</details>

**Question 2.** A team has six examples for a prompt and tests it once, getting 92 percent accuracy. How many different orders of those six examples exist? Explain why the single figure may be misleading, and describe a cheap way to find out.

<details>
<summary>View Answer</summary>

Six examples can be arranged in six factorial ways: 6 times 5 times 4 times 3 times 2 times 1, which is 720. The team has measured one of 720 possible prompts. Research on few-shot prompts has found that the order of a fixed set of examples can change performance substantially, partly because examples near the end have more influence. The 92 percent might be typical of this example set, or it might be one of the best orders, with others far lower. There is no way to tell from a single run. If it happens to be a lucky order, then any later edit that reorders the examples, such as adding one or deleting one, could reduce accuracy with no obvious cause. Testing all 720 orders is unnecessary. A cheap check is to shuffle the examples at random ten or twenty times and measure accuracy on the same test set each time. If the results cluster tightly, say between 90 and 93 percent, the prompt is robust and the figure can be trusted. If they range from 75 to 93, the prompt is fragile, and the team should report the range, look for the cause, usually label imbalance or a dominant final example, and fix it by balancing the examples or by selecting examples per input. The test set must be separate from the examples throughout.

</details>

**Question 3.** A company wants a model to write product descriptions in its house style. It has 40 past descriptions it likes. One manager proposes describing the style in a long instruction, another proposes fine-tuning a model on the 40, and a third proposes few-shot prompting. Evaluate the three, and recommend an approach in detail.

<details>
<summary>View Answer</summary>

A long instruction alone is the weakest option for this task. House style is exactly the kind of thing that is hard to describe and easy to show: rhythm, level of formality, what is left out. A description will get the model into the general area and miss what makes the style distinctive. Fine-tuning is the wrong tool at this scale. Forty examples are far too few to train on reliably, the process takes time and money, it must be repeated whenever the underlying model is replaced, and it makes the style slow to change when the company's taste does. Few-shot prompting fits. The style can be shown, the behaviour changes in seconds when the examples change, and forty descriptions are plenty. In detail: set aside eight to ten of the forty as a test set and never put them in a prompt. From the rest, build a pool. For each new product, select three to five examples from the pool that are most similar to it, by product category for instance, so that a description of a kettle is written from examples of kitchen goods and not of software. Format every example identically, with the product facts as the input and the description as the output, and mark them as examples. Add a short instruction stating the length, the audience, and anything that must never appear. Make sure the examples vary, so that no single one is copied. Test on the held-out set, in more than one order, and have someone who knows the style judge the results. Revisit fine-tuning only if volume becomes very large and the style is settled.

</details>

@@starter
"""
Lab: Examples, Their Biases, and How to Correct Them
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".

stub_probabilities is a stand-in model that learns from examples. It has two biases
built in on purpose: a majority-label bias and a recency bias.
"""
from itertools import permutations

STOPWORDS = {"a", "an", "and", "the", "was", "is", "my", "of", "to", "after", "in", "it", "i", "on",
             "very", "never", "for", "again"}

POOL = [
    ("The delivery was fast and the driver was friendly", "positive"),
    ("Great quality, works perfectly", "positive"),
    ("Love the new design", "positive"),
    ("Friendly support fixed my problem quickly", "positive"),
    ("Arrived broken and support never replied", "negative"),
    ("Terrible quality, stopped working after a week", "negative"),
    ("The delivery was late and the box was damaged", "negative"),
    ("Refund took a month", "negative"),
]

TEST = [
    ("Fast delivery, friendly driver", "positive"), ("The box arrived damaged", "negative"),
    ("Works perfectly, great design", "positive"), ("Late delivery again", "negative"),
    ("Love the quality", "positive"), ("The box was late", "negative"),
    ("Quick fix, friendly support", "positive"), ("Damaged on delivery", "negative"),
]

SKEWED = POOL[0:4] + [POOL[6]]          # four positive examples and one negative


def keywords(text):
    """Provided helper: the set of meaningful lowercase words in a text."""
    return {word.strip(".,;:!?").lower() for word in text.split()} - STOPWORDS - {""}


def stub_probabilities(examples, query, recency=0.3):
    """Provided: the stand-in model. Returns a dict from label to probability.
    Each example votes for its label: 0.5 for being present, plus 1 per word shared with
    the query. Later examples weigh more, up to (1 + recency) for the last one."""
    wanted, scores, n = keywords(query), {}, len(examples)
    for position, (text, label) in enumerate(examples):
        similarity = len(wanted & keywords(text))
        weight = 1 + recency * position / max(1, n - 1)
        scores[label] = scores.get(label, 0) + (0.5 + similarity) * weight
    total = sum(scores.values())
    return {label: score / total for label, score in scores.items()}


def predict(probabilities):
    """Provided: the most probable label, with ties going to the label that sorts first."""
    return min(probabilities, key=lambda label: (-probabilities[label], label))


def accuracy(examples, test, recency=0.3):
    """Provided: the share of test items the stand-in model labels correctly."""
    return sum(predict(stub_probabilities(examples, query, recency)) == gold for query, gold in test) / len(test)


# ---------------------------------------------------------------- Step 1
def format_few_shot(examples, query, instruction="Classify the sentiment of each review as positive or negative."):
    """Build a few-shot prompt. Join these blocks with a blank line ("\\n\\n"):
         the instruction
         for each (text, label):   "Review: <text>\\nSentiment: <label>"
         finally:                  "Review: <query>\\nSentiment:"     (nothing after the colon)"""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def label_balance(examples):
    """Return (counts, majority_share): a dict from each label to how many examples have it,
    and the largest count divided by the number of examples."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def calibrate(probabilities, content_free):
    """Contextual calibration. Divide each label's probability by its probability for the
    content-free input, then divide by the total so that the results sum to 1.
    Return a dict from label to the corrected probability."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def order_sensitivity(examples, test, recency=0.3):
    """Measure accuracy(list(order), test, recency) for EVERY ordering of the examples
    (use itertools.permutations). Return (lowest accuracy, highest accuracy, number of orders)."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def select_examples(pool, query, k):
    """Choose the k examples from the pool that share the most keywords() with the query.
    Break ties by position in the pool (earlier first).
    Return the chosen examples in their original pool order."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print(format_few_shot(POOL[1:2] + POOL[4:5], "The box was late"))
    print("balance :", label_balance(SKEWED))
    print("calibrated:", calibrate({"positive": 0.545, "negative": 0.455}, {"positive": 0.8, "negative": 0.2}))
    print("orders  :", order_sensitivity([POOL[0], POOL[3], POOL[6], POOL[7]], TEST))
    print("selected:", select_examples(POOL, "Late delivery again", 3))

@@solution
"""
Lab solution: Examples, Their Biases, and How to Correct Them
Standard library only.

stub_probabilities is a stand-in model that learns from examples. It has two biases
built in on purpose: a majority-label bias and a recency bias.
"""
from itertools import permutations

STOPWORDS = {"a", "an", "and", "the", "was", "is", "my", "of", "to", "after", "in", "it", "i", "on",
             "very", "never", "for", "again"}

POOL = [
    ("The delivery was fast and the driver was friendly", "positive"),
    ("Great quality, works perfectly", "positive"),
    ("Love the new design", "positive"),
    ("Friendly support fixed my problem quickly", "positive"),
    ("Arrived broken and support never replied", "negative"),
    ("Terrible quality, stopped working after a week", "negative"),
    ("The delivery was late and the box was damaged", "negative"),
    ("Refund took a month", "negative"),
]

TEST = [
    ("Fast delivery, friendly driver", "positive"), ("The box arrived damaged", "negative"),
    ("Works perfectly, great design", "positive"), ("Late delivery again", "negative"),
    ("Love the quality", "positive"), ("The box was late", "negative"),
    ("Quick fix, friendly support", "positive"), ("Damaged on delivery", "negative"),
]

SKEWED = POOL[0:4] + [POOL[6]]          # four positive examples and one negative


def keywords(text):
    """Provided helper: the set of meaningful lowercase words in a text."""
    return {word.strip(".,;:!?").lower() for word in text.split()} - STOPWORDS - {""}


def stub_probabilities(examples, query, recency=0.3):
    """Provided: the stand-in model. Returns a dict from label to probability.
    Each example votes for its label: 0.5 for being present, plus 1 per word shared with
    the query. Later examples weigh more, up to (1 + recency) for the last one."""
    wanted, scores, n = keywords(query), {}, len(examples)
    for position, (text, label) in enumerate(examples):
        similarity = len(wanted & keywords(text))
        weight = 1 + recency * position / max(1, n - 1)
        scores[label] = scores.get(label, 0) + (0.5 + similarity) * weight
    total = sum(scores.values())
    return {label: score / total for label, score in scores.items()}


def predict(probabilities):
    """Provided: the most probable label, with ties going to the label that sorts first."""
    return min(probabilities, key=lambda label: (-probabilities[label], label))


def accuracy(examples, test, recency=0.3):
    """Provided: the share of test items the stand-in model labels correctly."""
    return sum(predict(stub_probabilities(examples, query, recency)) == gold for query, gold in test) / len(test)


# ---------------------------------------------------------------- Step 1
def format_few_shot(examples, query, instruction="Classify the sentiment of each review as positive or negative."):
    """Identical formatting in every example and in the final input is what makes the
    continuation obvious. The prompt stops exactly where the answer should begin."""
    blocks = [instruction]
    blocks += [f"Review: {text}\nSentiment: {label}" for text, label in examples]
    blocks.append(f"Review: {query}\nSentiment:")
    return "\n\n".join(blocks)


# ---------------------------------------------------------------- Step 2
def label_balance(examples):
    """A label that appears more often among the examples is favoured for every input."""
    counts = {}
    for _, label in examples:
        counts[label] = counts.get(label, 0) + 1
    return counts, max(counts.values()) / len(examples)


# ---------------------------------------------------------------- Step 3
def calibrate(probabilities, content_free):
    """Whatever preference the prompt shows for an input with no content is pure bias.
    Dividing by it and rescaling removes that bias."""
    raw = {label: probabilities[label] / content_free[label] for label in probabilities}
    total = sum(raw.values())
    return {label: value / total for label, value in raw.items()}


# ---------------------------------------------------------------- Step 4
def order_sensitivity(examples, test, recency=0.3):
    """The same examples in a different order can score differently. A wide range means
    the prompt is fragile and any single measurement of it is unreliable."""
    scores = [accuracy(list(order), test, recency) for order in permutations(examples)]
    return min(scores), max(scores), len(scores)


# ---------------------------------------------------------------- Step 5
def select_examples(pool, query, k):
    """Retrieval applied to examples: classify each input using the examples most like it."""
    wanted = keywords(query)
    ranked = sorted(range(len(pool)), key=lambda index: (-len(wanted & keywords(pool[index][0])), index))
    return [pool[index] for index in sorted(ranked[:k])]


if __name__ == "__main__":
    print(format_few_shot(POOL[1:2] + POOL[4:5], "The box was late"))
    print(label_balance(SKEWED), label_balance(POOL))

    bias = stub_probabilities(SKEWED, "N/A", recency=0)
    print("content-free input:", {label: round(p, 3) for label, p in bias.items()})
    print("accuracy with skewed examples:", accuracy(SKEWED, TEST, recency=0))
    late = stub_probabilities(SKEWED, "Late delivery again", recency=0)
    print("'Late delivery again':", {label: round(p, 3) for label, p in late.items()}, "->", predict(late))
    fixed = calibrate(late, bias)
    print("after calibration   :", {label: round(p, 3) for label, p in fixed.items()}, "->", predict(fixed))
    calibrated = sum(predict(calibrate(stub_probabilities(SKEWED, query, recency=0), bias)) == gold for query, gold in TEST) / len(TEST)
    print("accuracy after calibration:", calibrated)

    balanced = [POOL[0], POOL[1], POOL[5], POOL[6]]
    print("positives first:", {label: round(p, 3) for label, p in stub_probabilities(balanced, "N/A").items()})
    print("negatives first:", {label: round(p, 3) for label, p in stub_probabilities(balanced[2:] + balanced[:2], "N/A").items()})
    print("same four examples, every order:", order_sensitivity([POOL[0], POOL[3], POOL[6], POOL[7]], TEST))

    print("first three of the pool:", accuracy(POOL[:3], TEST))
    chosen = sum(predict(stub_probabilities(select_examples(POOL, query, 3), query)) == gold for query, gold in TEST) / len(TEST)
    print("three chosen per input :", chosen)
    print(select_examples(POOL, "Late delivery again", 3))
    print("recall question 1:", {label: round(p, 3) for label, p in calibrate({"urgent": 0.6, "routine": 0.4}, {"urgent": 0.7, "routine": 0.3}).items()})

@@step
{
  "stepNumber": 1,
  "title": "A consistent few-shot format",
  "instruction": "Implement format_few_shot(examples, query, instruction). Build a list of blocks. The first block is the instruction. Then, for each (text, label) pair in examples, add a block made of the line 'Review: ' followed by the text, a newline, and the line 'Sentiment: ' followed by the label. Finally add a block for the query: 'Review: ' and the query, a newline, and 'Sentiment:' with nothing after the colon. Join the blocks with a blank line between them and return the result. The prompt must end exactly where the answer should begin. This is the few-shot layout from Section 1: identical formatting is what makes the continuation obvious. [MOD-5.4]",
  "hintConceptual": "Write out a pattern several times and stop partway through the next repetition. The model's job is to finish it, so every repetition must look the same.",
  "hintSyntax": "blocks = [instruction]\nblocks += [f\"Review: {text}\\nSentiment: {label}\" for text, label in examples]\nblocks.append(f\"Review: {query}\\nSentiment:\")\nreturn \"\\n\\n\".join(blocks)"
}
@@assert
_prompt = format_few_shot([("Great quality, works perfectly", "positive"), ("Arrived broken and support never replied", "negative")], "The box was late")
assert _prompt == "Classify the sentiment of each review as positive or negative.\n\nReview: Great quality, works perfectly\nSentiment: positive\n\nReview: Arrived broken and support never replied\nSentiment: negative\n\nReview: The box was late\nSentiment:", f"The prompt does not have the expected layout:\n{_prompt!r}"
assert _prompt.endswith("Sentiment:"), "The prompt stops at 'Sentiment:' with nothing after it"
assert _prompt.count("Review: ") == 3 and _prompt.count("Sentiment:") == 3, "Each example and the query use the same two field names"
assert format_few_shot([], "Hello") == "Classify the sentiment of each review as positive or negative.\n\nReview: Hello\nSentiment:", "With no examples the prompt is zero-shot: the instruction and the query"
assert format_few_shot([("a", "b")], "c", instruction="Label it.") == "Label it.\n\nReview: a\nSentiment: b\n\nReview: c\nSentiment:", "The instruction argument must be used"
assert format_few_shot(POOL, "x").count("\n\n") == 9, "Eight examples, an instruction, and a query make ten blocks"
print("Step 1 passed: every example and the query share one format, and the prompt ends where the answer begins.")

@@step
{
  "stepNumber": 2,
  "title": "Check the label balance",
  "instruction": "Implement label_balance(examples). Count how many examples carry each label, in a dict from label to count. Return a tuple of that dict and the majority share, which is the largest count divided by the total number of examples. A share of 0.5 with two labels is balanced. A share of 0.8 means four of every five examples have the same label, which is the majority label bias described in Section 2. Try it on SKEWED and on POOL. [MOD-5.4]",
  "hintConceptual": "Tally the labels. If one label has far more examples than the others, the model will lean toward it whatever the input says.",
  "hintSyntax": "counts = {}\nfor _, label in examples:\n    counts[label] = counts.get(label, 0) + 1\nreturn counts, max(counts.values()) / len(examples)"
}
@@assert
assert label_balance(SKEWED) == ({"positive": 4, "negative": 1}, 0.8), f"Four positive and one negative: a majority share of 0.8, got {label_balance(SKEWED)}"
assert label_balance(POOL) == ({"positive": 4, "negative": 4}, 0.5), "The full pool is balanced"
assert label_balance(POOL[:3]) == ({"positive": 3}, 1.0), "Three examples with one label: a majority share of 1"
assert label_balance([("a", "x"), ("b", "y"), ("c", "z")])[1] == 1 / 3, "With three labels in equal numbers the share is one third"
assert label_balance([("a", "x")]) == ({"x": 1}, 1.0), "A single example is all one label"
assert label_balance([("a", "urgent"), ("b", "routine"), ("c", "urgent")])[0] == {"urgent": 2, "routine": 1}, "Labels can be any text"
print("Step 2 passed: the skewed set is 80 percent one label, and the pool is balanced.")

@@step
{
  "stepNumber": 3,
  "title": "Calibrate away a built-in bias",
  "instruction": "Implement calibrate(probabilities, content_free). Both arguments are dicts from label to probability: the first for a real input, the second for a content-free input such as 'N/A'. For each label, divide its probability by its content-free probability. Then divide each of those results by their sum, so that the corrected values add to 1. Return the dict of corrected probabilities. This is the calibration formula from Section 2. With probabilities of 0.545 and 0.455 and a content-free result of 0.8 and 0.2, the corrected values are about 0.23 and 0.77, and the label flips. [MOD-5.4]",
  "hintConceptual": "Ask the prompt what it thinks about nothing at all. Whatever preference it shows is its bias. Take that preference out of every real answer, then rescale so the numbers are probabilities again.",
  "hintSyntax": "raw = {label: probabilities[label] / content_free[label] for label in probabilities}\ntotal = sum(raw.values())\nreturn {label: value / total for label, value in raw.items()}"
}
@@assert
_fixed = calibrate({"positive": 0.545, "negative": 0.455}, {"positive": 0.8, "negative": 0.2})
assert abs(_fixed["positive"] - 0.2305) < 0.001 and abs(_fixed["negative"] - 0.7695) < 0.001, f"The corrected probabilities are about 0.231 and 0.769, got {_fixed}"
assert abs(sum(_fixed.values()) - 1) < 1e-12, "Corrected probabilities sum to 1"
assert predict({"positive": 0.545, "negative": 0.455}) == "positive" and predict(_fixed) == "negative", "Calibration flips the label for this review"
_same = calibrate({"a": 0.6, "b": 0.4}, {"a": 0.5, "b": 0.5})
assert abs(_same["a"] - 0.6) < 1e-12 and abs(_same["b"] - 0.4) < 1e-12, "With an unbiased content-free result nothing changes"
_neutral = calibrate({"a": 0.8, "b": 0.2}, {"a": 0.8, "b": 0.2})
assert abs(_neutral["a"] - 0.5) < 1e-12, "An input that looks exactly like the content-free one becomes undecided"
_q1 = calibrate({"urgent": 0.6, "routine": 0.4}, {"urgent": 0.7, "routine": 0.3})
assert abs(_q1["urgent"] - 0.3913) < 0.001 and abs(_q1["routine"] - 0.6087) < 0.001, f"Recall question 1: about 0.391 and 0.609, got {_q1}"
_bias = stub_probabilities(SKEWED, "N/A", recency=0)
assert sum(predict(calibrate(stub_probabilities(SKEWED, query, recency=0), _bias)) == gold for query, gold in TEST) == 8, "With calibration the skewed prompt labels all eight test reviews correctly"
assert accuracy(SKEWED, TEST, recency=0) == 0.75, "Without calibration the skewed prompt gets six of eight"
print("Step 3 passed: calibration raises the skewed prompt from 6 of 8 to 8 of 8.")

@@step
{
  "stepNumber": 4,
  "title": "Measure sensitivity to order",
  "instruction": "Implement order_sensitivity(examples, test, recency). Use itertools.permutations to generate every ordering of the examples. For each ordering, convert it to a list and compute its accuracy with the provided accuracy function, passing the test set and the recency value. Return a tuple of three numbers: the lowest accuracy, the highest accuracy, and the number of orderings tried. This is the order sensitivity from Section 2. For four examples there are 24 orderings, and the same four examples can score differently depending only on their order. [MOD-5.4]",
  "hintConceptual": "Shuffle the same examples every possible way, score each arrangement, and report the worst and the best. The gap between them is how much luck is in any single test.",
  "hintSyntax": "scores = [accuracy(list(order), test, recency) for order in permutations(examples)]\nreturn min(scores), max(scores), len(scores)"
}
@@assert
_four = [POOL[0], POOL[3], POOL[6], POOL[7]]
assert order_sensitivity(_four, TEST) == (0.75, 1.0, 24), f"The same four examples score between 0.75 and 1.0 across 24 orders, got {order_sensitivity(_four, TEST)}"
assert order_sensitivity(_four, TEST, recency=0) == (accuracy(_four, TEST, recency=0), accuracy(_four, TEST, recency=0), 24), "With no recency bias the stand-in model does not care about order: the recency argument must be passed on"
assert order_sensitivity([POOL[0], POOL[6]], TEST)[2] == 2, "Two examples have two orders"
assert order_sensitivity([POOL[0]], TEST) == (accuracy([POOL[0]], TEST), accuracy([POOL[0]], TEST), 1), "One example has a single order"
_low, _high, _count = order_sensitivity([POOL[0], POOL[1], POOL[4], POOL[7]], TEST, recency=0.6)
assert _count == 24 and _low <= _high and _low < 0.75, "A stronger recency bias widens the range for some example sets"
assert order_sensitivity(_four, TEST[:1])[2] == 24, "The test argument must be used"
print("Step 4 passed: the same four examples score anywhere from 0.75 to 1.0, depending only on their order.")

@@step
{
  "stepNumber": 5,
  "title": "Select the most relevant examples",
  "instruction": "Implement select_examples(pool, query, k). Compute the keywords of the query. Rank the positions in the pool by how many keywords each example's text shares with the query, most first, breaking ties by position so that earlier examples win. Take the first k positions, sort them back into their original order, and return the examples at those positions. This is example selection from Section 2: retrieval applied to examples. Compare the accuracy of the first three examples in the pool, which are all positive, with three examples chosen for each test review. [MOD-5.4]",
  "hintConceptual": "For each new input, pick the examples that most resemble it. An example about a late delivery is worth more to a review about a late delivery than one about a nice design.",
  "hintSyntax": "wanted = keywords(query)\nranked = sorted(range(len(pool)), key=lambda index: (-len(wanted & keywords(pool[index][0])), index))\nreturn [pool[index] for index in sorted(ranked[:k])]"
}
@@assert
assert select_examples(POOL, "Late delivery again", 3) == [POOL[0], POOL[1], POOL[6]], f"The late-delivery example shares two words, the first example one, and ties go to the earliest, in pool order, got {select_examples(POOL, 'Late delivery again', 3)}"
assert select_examples(POOL, "Late delivery again", 1) == [POOL[6]], "With k = 1 only the best match is returned"
assert select_examples(POOL, "Terrible quality", 2) == [POOL[1], POOL[5]], "Results are returned in pool order, not in order of similarity"
assert select_examples(POOL, "zebra", 2) == [POOL[0], POOL[1]], "With no shared words, ties are broken by position"
assert select_examples(POOL, "Refund", 20) == POOL, "Asking for more than the pool holds returns the whole pool"
assert select_examples([], "anything", 3) == [], "An empty pool gives no examples"
_chosen = sum(predict(stub_probabilities(select_examples(POOL, query, 3), query)) == gold for query, gold in TEST) / len(TEST)
assert _chosen == 1.0 and accuracy(POOL[:3], TEST) == 0.5, f"Three examples chosen per input score 1.0, against 0.5 for the first three in the pool, got {_chosen}"
print("Step 5 passed: choosing examples per input scores 8 of 8, against 4 of 8 for the first three in the pool.")
