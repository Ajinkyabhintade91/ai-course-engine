@@meta
{
  "moduleId": "MOD-1.2",
  "slug": "mod-1-2",
  "unitId": "UNIT-1",
  "unitTitle": "Unit 1: Understanding AI from Basics",
  "title": "AI vs Machine Learning vs Deep Learning",
  "difficulty": "Foundational",
  "estimatedMinutes": 95,
  "citations": [
    { "title": "Deep learning (LeCun, Bengio & Hinton, Nature 2015)", "source": "Nature", "url": "https://doi.org/10.1038/nature14539" },
    { "title": "ImageNet Classification with Deep Convolutional Neural Networks (AlexNet, 2012)", "source": "Paper PDF", "url": "https://courses.cs.duke.edu/fall16/compsci527/papers/Krizhevsky%20et%20al%20DNN%20ImageNet%202012.pdf" },
    { "title": "Why do tree-based models still outperform deep learning on tabular data?", "source": "arXiv", "url": "https://arxiv.org/abs/2207.08815" },
    { "title": "Tabular Data: Is Deep Learning all you need?", "source": "arXiv", "url": "https://arxiv.org/abs/2402.03970" },
    { "title": "AI vs. machine learning vs. deep learning vs. neural networks", "source": "IBM", "url": "https://ibm.com/blog/ai-vs-machine-learning-vs-deep-learning-vs-neural-networks" },
    { "title": "scikit-learn User Guide", "source": "Official Docs", "url": "https://scikit-learn.org/stable/user_guide.html" }
  ],
  "videoLibrary": [
    {
      "id": "VID-1.2-1",
      "title": "Machine Learning vs Deep Learning",
      "creator": "IBM Technology",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=q6kJ71tEYqM",
      "timingInstruction": "Watch after reading Section 1 (the nested picture)",
      "keyTakeaway": "A short whiteboard explanation of where deep learning sits inside machine learning and what the extra layers buy you."
    },
    {
      "id": "VID-1.2-2",
      "title": "But what is a neural network? | Deep learning chapter 1",
      "creator": "3Blue1Brown",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=aircAruvnKk",
      "timingInstruction": "Watch after reading Section 2 (perceptrons and layers)",
      "keyTakeaway": "The clearest visual account of how layers of simple units turn raw pixels into learned features, using handwritten digit recognition."
    },
    {
      "id": "VID-1.2-3",
      "title": "Machine Learning Specialization",
      "creator": "DeepLearning.AI and Stanford Online (Andrew Ng)",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/specializations/machine-learning-introduction",
      "timingInstruction": "Begin after the lab if you want the full treatment of supervised, unsupervised, and reinforcement learning",
      "keyTakeaway": "Three beginner-level courses that build the classical machine-learning toolkit properly, with the mathematics this chapter only sketches."
    },
    {
      "id": "VID-1.2-4",
      "title": "Neural Networks and Deep Learning (Course 1 of the Deep Learning Specialization)",
      "creator": "DeepLearning.AI",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/neural-networks-deep-learning",
      "timingInstruction": "Optional: take after the Machine Learning Specialization",
      "keyTakeaway": "The lighter entry point into deep learning: you implement a small neural network from scratch and see backpropagation working."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Rule vs Learned Threshold vs Perceptron",
    "context": "A small mail provider wants to flag spam using two numbers per message: how many links it contains and how many exclamation marks. You will solve the same problem three ways (a hand-written rule, a threshold learned from data, and a perceptron) and score them on held-out messages to see what learning actually adds.",
    "language": "python"
  }
}

@@reading
# AI vs Machine Learning vs Deep Learning

These three terms are used as if they were interchangeable. They are not, and the difference is practical. It tells you what a system needs in order to work (rules, data, or a great deal of data and compute), how it will fail, and how much it will cost to build. This chapter gives you the precise relationship between the terms, the four ways a machine can learn, and an honest account of why deep learning took over some problems and not others.

## 1. First-Principles Mental Model & Intuition

### Nested dolls

Picture a set of Russian nesting dolls.

```text
+--------------------------------------------------------------+
| ARTIFICIAL INTELLIGENCE                                      |
| any technique that makes a machine act intelligently         |
| (includes hand-written rules, search, planning, logic)       |
|                                                              |
|   +------------------------------------------------------+   |
|   | MACHINE LEARNING                                     |   |
|   | behaviour is fitted from data, not written by hand   |   |
|   | (linear models, decision trees, boosting, k-means)   |   |
|   |                                                      |   |
|   |   +----------------------------------------------+   |   |
|   |   | DEEP LEARNING                                |   |   |
|   |   | machine learning with many-layer neural nets |   |   |
|   |   | that learn their own features                |   |   |
|   |   |                                              |   |   |
|   |   |   +--------------------------------------+   |   |   |
|   |   |   | MODERN GENERATIVE AI                 |   |   |   |
|   |   |   | large deep networks that produce new |   |   |   |
|   |   |   | text, images, audio, video, code     |   |   |   |
|   |   |   +--------------------------------------+   |   |   |
|   |   +----------------------------------------------+   |   |
|   +------------------------------------------------------+   |
+--------------------------------------------------------------+
```

Each doll sits inside the one before it. All deep learning is machine learning. All machine learning is AI. The reverse is false at every level: a chess engine built on search is AI with no machine learning, and a decision tree that predicts loan defaults is machine learning with no deep learning.

Two cautions about the picture. First, it is a taxonomy of *methods*, not a ranking of quality. The innermost doll is not "the best AI". Second, the innermost box says *modern* generative AI on purpose. Simple generative models existed long before deep learning, but the systems people mean today when they say "generative AI" are large deep networks.

### The cooking analogy

Imagine three chefs asked to produce the same dish.

- **The rule-based chef** follows a written recipe exactly. Someone else did all the thinking. If an ingredient is missing, the chef is stuck. This is classical, hand-programmed AI.
- **The classical machine-learning chef** is handed ingredients that someone has already washed, chopped, and measured, and learns by tasting how much seasoning to add. The chopping is **feature engineering**: a human expert decides which measurements of the raw data matter. The chef learns only the final adjustment.
- **The deep-learning chef** starts with whole raw produce and learns everything: how to chop, how to season, how to plate. Nobody supplies prepared ingredients. This chef needs to cook the dish many thousands of times before it comes out well, and needs a much bigger kitchen.

That analogy contains the whole trade-off. Moving inward through the dolls, humans supply less hand-crafted knowledge and the machine demands more data and more computation in exchange.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### What "learning" means

The phrase "machine learning" was popularised by Arthur Samuel in 1959, who wrote a checkers program that improved by playing against itself. The definition most textbooks use comes from Tom Mitchell (1997): a computer program is said to **learn** from experience $E$ with respect to some class of tasks $T$ and performance measure $P$, if its performance at tasks in $T$, as measured by $P$, improves with experience $E$.

Apply it to a spam filter. The task $T$ is labelling messages as spam or not. The performance measure $P$ is the fraction labelled correctly. The experience $E$ is a collection of messages that people have already labelled. If accuracy rises as you feed in more labelled messages, the program is learning. If a programmer raises accuracy by editing a rule, the program is not learning. The programmer is.

### The four learning paradigms

The paradigms differ in the kind of feedback the learner receives.

| Paradigm | Feedback available | Typical question | Everyday example |
|---|---|---|---|
| Supervised | The correct answer for every training example | "Which label goes with this input?" | Spam detection, house-price prediction |
| Unsupervised | No answers at all | "What structure is in this data?" | Grouping customers into segments |
| Self-supervised | Answers manufactured from the data itself | "What is the missing piece?" | Predicting the next word of a sentence |
| Reinforcement | A reward, often delayed, after acting | "Which action leads to the most reward?" | Game playing, robot control |

**Supervised learning.** We have $N$ examples, each an input $x_i$ with a known correct output $y_i$. We choose a family of functions $f_\theta$ controlled by adjustable numbers $\theta$ (the **parameters**) and a **loss function** $\mathcal{L}$ that measures how wrong a prediction is. Training means finding the parameters with the smallest average loss on the examples:

$$
\hat{\theta} = \arg\min_{\theta} \; \frac{1}{N} \sum_{i=1}^{N} \mathcal{L}\big(f_\theta(x_i),\, y_i\big)
$$

This recipe is called **empirical risk minimisation**. Nearly all of modern machine learning, including the training of large language models, is a version of this one line. What varies is the function family $f_\theta$, the loss, and the size of everything.

**Unsupervised learning.** There are no labels. A classic method, k-means clustering, places $k$ centre points $\mu_1, \dots, \mu_k$ and assigns each data point to its nearest centre, choosing the centres to minimise total squared distance:

$$
\min_{\mu_1,\dots,\mu_k} \; \sum_{i=1}^{N} \big\lVert x_i - \mu_{c(i)} \big\rVert^{2}
$$

where $c(i)$ is the index of the centre nearest to point $i$.

**Self-supervised learning.** This is the paradigm behind large language models and it is the one beginners most often miss. The trick is to hide part of the data and train the model to predict the hidden part. For text, hide the next word. The labels cost nothing because the text itself supplies them. The loss for a sequence of tokens $x_1, \dots, x_T$ is:

$$
\mathcal{L} = -\sum_{t=1}^{T} \log p_\theta\big(x_t \mid x_1, \dots, x_{t-1}\big)
$$

Mathematically this is supervised learning. Practically it changes everything, because you no longer need humans to label billions of examples.

**Reinforcement learning.** An agent acts in an environment and receives rewards $r_t$. It learns a behaviour that maximises expected total reward, with future rewards discounted by a factor $\gamma$ between 0 and 1:

$$
\max \; \mathbb{E}\left[\sum_{t=0}^{\infty} \gamma^{t}\, r_t\right]
$$

### The perceptron: the smallest learning machine

In 1958 Frank Rosenblatt described the **perceptron**, the ancestor of every neural network. It takes a list of numeric inputs $x$, multiplies each by a **weight** in $w$, adds a **bias** $b$, and outputs 1 if the total is positive and 0 otherwise:

$$
\hat{y} = \mathbb{1}\left[\, w^{\top} x + b > 0 \,\right]
$$

It learns with a very simple rule. For each training example, compare the prediction $\hat{y}$ with the true label $y$. If they match, do nothing. If they differ, nudge the weights toward the correct answer by a small step size $\eta$ called the **learning rate**:

$$
w \leftarrow w + \eta\,(y - \hat{y})\,x \qquad\qquad b \leftarrow b + \eta\,(y - \hat{y})
$$

Check the signs. If the true label is 1 and the perceptron said 0, then $(y - \hat{y}) = +1$ and the weights move in the direction of $x$, making a positive output more likely next time. If the label is 0 and it said 1, the weights move away from $x$. Geometrically the perceptron draws a straight line (in higher dimensions, a flat plane) and puts each class on one side.

That geometry is also its limit. In 1969 Marvin Minsky and Seymour Papert published a book showing that a single perceptron cannot learn the XOR pattern, where the label is 1 when exactly one of two inputs is on. No single straight line separates those points. The result contributed to a long decline of interest in neural networks.

### From one perceptron to deep networks

The fix is to stack units in layers, so the outputs of one layer become the inputs of the next. A deep network is a composition of simple functions:

$$
f(x) = f_L\big(\cdots f_2\big(f_1(x)\big)\big), \qquad f_\ell(h) = \sigma\big(W_\ell\, h + b_\ell\big)
$$

Each layer multiplies by a matrix of weights $W_\ell$, adds a bias vector, and applies a simple non-linear function $\sigma$. The non-linearity is essential: without it a stack of layers collapses mathematically into a single layer. Training uses **gradient descent**, which repeatedly moves every parameter a small step in the direction that reduces the loss:

$$
\theta \leftarrow \theta - \eta\, \nabla_\theta \mathcal{L}
$$

The gradients for all layers are computed efficiently by an algorithm called **backpropagation**, popularised in 1986 by David Rumelhart, Geoffrey Hinton, and Ronald Williams.

```text
 raw input          layer 1            layer 2            output
 (pixels)       (edges, blobs)     (eyes, wheels)     (cat? car?)

   o  ------------->  o  ------------->  o
   o  ------------->  o  ------------->  o  ----------->  o  "cat" 0.92
   o  ------------->  o  ------------->  o  ----------->  o  "car" 0.08
   o  ------------->  o  ------------->  o
        weights W1         weights W2         weights W3

 Nobody programs "edge" or "eye". Those features emerge during training.
```

The key idea, in the words of the 2015 *Nature* review by Yann LeCun, Yoshua Bengio, and Geoffrey Hinton, is **representation learning**: the layers of features are not designed by human engineers but learned from data using a general-purpose procedure.

### Why deep learning won in 2012

For decades the best image-recognition systems relied on hand-engineered features: clever formulas, designed by researchers, that summarised patches of an image. In 2012 a deep network known as AlexNet (Alex Krizhevsky, Ilya Sutskever, and Geoffrey Hinton) entered the ImageNet competition, which requires sorting photographs into 1,000 categories. It reached a top-5 error rate of 15.3 percent. The runner-up, built on hand-engineered features, scored 26.2 percent. A gap that large ended the argument.

Three ingredients arrived together.

1. **Data.** ImageNet supplied about 1.2 million labelled training images. Deep networks have millions of parameters and need that much evidence to set them.
2. **Compute.** AlexNet had about 60 million parameters and was trained on two consumer graphics cards. GPUs, built for video games, turned out to be ideal for the matrix arithmetic in neural networks.
3. **Algorithms and representation learning.** Training refinements made deep networks trainable in practice, and the network learned better features from raw pixels than experts had managed to design in decades.

**Cost of the trade.** A perceptron on $d$ input features has $d + 1$ parameters, and one pass over $N$ examples costs on the order of $N \times d$ arithmetic operations. A fully connected layer mapping $m$ inputs to $n$ outputs has $m \times n + n$ parameters, so a deep network's memory and training cost grow with the product of adjacent layer widths, summed over layers. Modern language models have billions of parameters. That is why the innermost dolls need data centres and the outer ones run on a laptop.

## 3. Production-Grade Implementation & Annotated Walkthrough

The following program solves one small problem three ways so you can see the progression from rules to learning. It uses only the standard library. The task: classify a point as class 1 or class 0 from two numeric features.

```python
import random

def make_data(n, seed):
    """Two overlapping clusters. Class 1 tends to have larger feature values."""
    rng = random.Random(seed)
    data = []
    for _ in range(n):
        label = rng.choice([0, 1])
        centre = 6.0 if label == 1 else 2.5
        x = (rng.gauss(centre, 1.2), rng.gauss(centre, 1.2))
        data.append((x, label))
    return data

def accuracy(classify, data):
    """Fraction of examples a classifier gets right."""
    return sum(classify(x) == y for x, y in data) / len(data)

# 1. AI without learning: a human picks the constant.
def hand_rule(x):
    return 1 if x[0] > 5 else 0

# 2. Machine learning in its smallest form: fit one number from data.
def learn_threshold(data):
    candidates = sorted({x[0] for x, _ in data})
    best_t, best_errors = candidates[0], len(data) + 1
    for t in candidates:
        errors = sum((1 if x[0] > t else 0) != y for x, y in data)
        if errors < best_errors:
            best_t, best_errors = t, errors
    return best_t

# 3. The seed of deep learning: a perceptron that weighs both features.
def train_perceptron(data, epochs=30, lr=0.1):
    w, b = [0.0, 0.0], 0.0
    for _ in range(epochs):
        for x, y in data:
            pred = 1 if w[0] * x[0] + w[1] * x[1] + b > 0 else 0
            error = y - pred                      # -1, 0, or +1
            w[0] += lr * error * x[0]
            w[1] += lr * error * x[1]
            b += lr * error
    return w, b

train, test = make_data(400, seed=1), make_data(400, seed=2)

t = learn_threshold(train)
w, b = train_perceptron(train)

print("hand rule        :", accuracy(hand_rule, test))
print("learned threshold:", accuracy(lambda x: 1 if x[0] > t else 0, test))
print("perceptron       :", accuracy(lambda x: 1 if w[0]*x[0] + w[1]*x[1] + b > 0 else 0, test))
```

Engineering commentary, block by block:

- **`make_data` uses a seeded generator.** `random.Random(seed)` gives the same data every run, so results are reproducible. The training set and test set use different seeds, which means the test set contains points the learner has never seen.
- **`accuracy` is the performance measure $P$ from Mitchell's definition.** It is always computed on `test`, never on `train`. A model that memorised its training data would look perfect on `train` and could be useless on new data. This failure is called **overfitting**, and the train/test split is the basic defence against it.
- **`hand_rule` contains a magic number, 5.** A person chose it by looking at the problem. If the data shifts (spammers start using fewer links), the rule silently degrades until a person notices and edits it.
- **`learn_threshold` replaces the person with a search.** It tries every observed value as the cut-off and keeps the one with the fewest training errors. The rule's *form* is still chosen by a human ("compare feature 0 with a constant"), but the constant now comes from data. Sorting takes on the order of $N \log N$ steps and the scan takes $N$ steps per candidate, so the whole function is on the order of $N^2$, which is fine for hundreds of points.
- **`train_perceptron` learns how to combine features.** It implements the update rule from Section 2 exactly. An **epoch** is one full pass over the training data. Notice that when the prediction is right, `error` is zero and nothing changes. Learning is driven entirely by mistakes.
- **The epoch cap matters.** On data that no straight line can separate, the perceptron never stops making mistakes and never settles. Without a fixed number of epochs the loop would run forever.

Now the limit. Add this to the end of the program:

```python
xor = [((0, 0), 0), ((0, 1), 1), ((1, 0), 1), ((1, 1), 0)]
w, b = train_perceptron(xor, epochs=1000)
print("XOR accuracy:", accuracy(lambda x: 1 if w[0]*x[0] + w[1]*x[1] + b > 0 else 0, xor))
# Never reaches 1.0. No straight line separates XOR.
```

There are two ways out. A human can hand-engineer a third feature, the product of the two inputs, after which a straight plane does separate the classes. That is feature engineering. Or you can add a hidden layer and let the network invent that feature for itself. That is deep learning. The choice between those two responses is the choice between classical machine learning and deep learning, in miniature.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Deep learning is not always the best choice.** This surprises newcomers more than anything else. For **tabular data**, meaning rows and columns such as a customer spreadsheet, tree-based methods like gradient-boosted trees remain extremely competitive. A widely cited 2022 study by Grinsztajn and colleagues compared methods across 45 datasets and found tree-based models still ahead on medium-sized tables of around ten thousand rows. Later benchmarks have reported neural networks catching up or winning with enough tuning, so treat the question as unsettled. The durable advice is that for a spreadsheet-shaped problem, try boosted trees before anything deep.

**Always build the simple baseline first.** Practitioners repeat this constantly. A logistic regression or a single decision tree takes minutes to train and tells you how hard the problem is. If the baseline reaches 94 percent and your deep network reaches 95 percent, you have learned that the extra complexity buys one point, and you can decide whether that is worth the cost.

**"Deep learning needs no feature work" is a half-truth.** Deep networks learn features from raw data, but someone must still clean the data, scale the inputs, split training and test sets correctly, and prevent **data leakage**, which is when information about the answer sneaks into the inputs. A model that reads the hospital name printed on an X-ray and uses it to predict disease has learned a real pattern in the data and a useless one in the world.

**Accuracy can lie.** If 95 percent of messages are not spam, a classifier that always says "not spam" scores 95 percent accuracy and catches nothing. With imbalanced classes, look at how many of the rare cases were caught (recall) and how many of the alarms were real (precision).

**More layers do not mean more intelligence.** The word "deep" refers only to the number of layers. And the name "neural network" is a loose historical metaphor. Artificial units are simple arithmetic and are not faithful models of brain cells.

**Self-supervised learning is the paradigm behind the headlines.** Many introductions list three paradigms and stop. The fourth is the reason language models could be trained on a large fraction of the public internet without anyone labelling it.

**The outer dolls are cheaper, faster, and easier to explain.** A rule can be read by an auditor. A small decision tree can be drawn on a whiteboard. A deep network with a billion parameters cannot be inspected the same way. In regulated settings such as lending or medicine, explainability may decide the method before accuracy does.

**Know when not to use learning at all.** If the correct behaviour can be written down exactly, such as tax arithmetic or sorting a list, write the code. Machine learning is for problems where you can show examples of the right answer but cannot state the rule.

## 5. Active Recall Check & Synthesis Summary

**Summary.** AI is the broad goal, machine learning is the subset of AI in which behaviour is fitted from data, and deep learning is the subset of machine learning that uses many-layer neural networks to learn its own features. Learning comes in four forms distinguished by feedback: supervised, unsupervised, self-supervised, and reinforcement. Deep learning took over perception and language after 2012 because large datasets, GPUs, and representation learning arrived together, but simpler methods remain the right tool for small data, tabular data, and problems where the rule can simply be written down.

**Question 1.** A fraud team has a system made of 200 if-then rules written by analysts. Is it AI? Is it machine learning? What would have to change for it to count as machine learning under Mitchell's definition?

<details>
<summary>View Answer</summary>

It is AI, because it is a machine making decisions that would otherwise need human judgement. It is not machine learning, because its performance does not improve with experience; it improves only when an analyst edits a rule. To count as machine learning, some part of the decision logic, for example the thresholds inside the rules or the whole scoring function, would have to be fitted automatically from past labelled transactions so that performance on the task improves as more data is supplied.

</details>

**Question 2.** Explain why predicting the next word of a sentence is called *self*-supervised learning, and why that property was essential for building large language models.

<details>
<summary>View Answer</summary>

The training signal is a correct answer for every example, exactly as in supervised learning, but the answer is taken from the data itself: the true next word is already in the text. No human has to label anything. That removes the labelling bottleneck. Supervised learning at the scale of billions of examples would require billions of human judgements, which is impractical, whereas raw text is available in enormous quantities and every position in it supplies a free training example.

</details>

**Question 3.** A single perceptron cannot learn XOR. Describe the two different ways to solve the problem and say which one corresponds to classical machine learning and which to deep learning.

<details>
<summary>View Answer</summary>

A perceptron can only separate classes with one straight line, and XOR's two classes cannot be separated that way. The first solution is for a human to add a new input feature, such as the product of the two inputs, which makes the classes separable by a flat plane. That is feature engineering, the classical machine-learning approach, where human insight goes into preparing the inputs. The second solution is to add a hidden layer of units with a non-linear function, so the network learns an intermediate feature that makes the problem separable. That is deep learning, where the representation is learned from data.

</details>

@@starter
"""
Lab: Rule vs Learned Threshold vs Perceptron
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".

Each message is described by two numbers:  x = (number_of_links, number_of_exclamation_marks)
The label is 1 for spam and 0 for normal mail.
A dataset is a list of (x, label) pairs, for example [((7, 4), 1), ((1, 0), 0)].
"""
import random


def make_data(n, seed):
    """Generate n labelled messages. Spam tends to have more links and more '!'. (Provided.)"""
    rng = random.Random(seed)
    data = []
    for _ in range(n):
        label = rng.choice([0, 1])
        centre = 6.0 if label == 1 else 2.5
        x = (round(rng.gauss(centre, 1.2), 2), round(rng.gauss(centre, 1.2), 2))
        data.append((x, label))
    return data


def predict(w, b, x):
    """Perceptron prediction: 1 if the weighted sum is positive, else 0. (Provided.)"""
    return 1 if w[0] * x[0] + w[1] * x[1] + b > 0 else 0


# ---------------------------------------------------------------- Step 1
def rule_classifier(x):
    """AI without learning: a rule a human wrote."""
    # TODO Step 1: return 1 (spam) if the message has MORE THAN 5 links (x[0] > 5), otherwise 0.
    return None


# ---------------------------------------------------------------- Step 2
def accuracy(classify, data):
    """Fraction of (x, label) pairs for which classify(x) == label."""
    # TODO Step 2: count the correct predictions and divide by len(data).
    #              Return 0.0 for an empty dataset.
    return None


# ---------------------------------------------------------------- Step 3
def learn_threshold(data):
    """Machine learning in miniature: choose the cut-off t for the rule  x[0] > t  from data."""
    # TODO Step 3: candidates = the sorted distinct values of x[0] in the data.
    #   For each candidate t, count the training errors of the rule (1 if x[0] > t else 0).
    #   Return the candidate with the FEWEST errors (the smallest such t if there is a tie).
    return None


# ---------------------------------------------------------------- Step 4
def train_perceptron(data, epochs=30, lr=0.1):
    """Learn weights for BOTH features with the perceptron update rule. Returns (w, b)."""
    w = [0.0, 0.0]
    b = 0.0
    # TODO Step 4: repeat `epochs` times over every (x, y) in data:
    #   pred  = predict(w, b, x)
    #   error = y - pred
    #   w[0] += lr * error * x[0];  w[1] += lr * error * x[1];  b += lr * error
    # then return (w, b)
    return None


if __name__ == "__main__":
    train, test = make_data(400, seed=1), make_data(400, seed=2)
    print("rule on one message :", rule_classifier((7, 3)))
    print("rule accuracy       :", accuracy(rule_classifier, test))
    print("learned threshold   :", learn_threshold(train))
    print("perceptron (w, b)   :", train_perceptron(train))

@@solution
"""
Lab solution: Rule vs Learned Threshold vs Perceptron
Standard library only.

Each message is described by two numbers:  x = (number_of_links, number_of_exclamation_marks)
The label is 1 for spam and 0 for normal mail.
"""
import random


def make_data(n, seed):
    """Generate n labelled messages. Spam tends to have more links and more '!'."""
    rng = random.Random(seed)
    data = []
    for _ in range(n):
        label = rng.choice([0, 1])
        centre = 6.0 if label == 1 else 2.5
        x = (round(rng.gauss(centre, 1.2), 2), round(rng.gauss(centre, 1.2), 2))
        data.append((x, label))
    return data


def predict(w, b, x):
    """Perceptron prediction: 1 if the weighted sum is positive, else 0."""
    return 1 if w[0] * x[0] + w[1] * x[1] + b > 0 else 0


# ---------------------------------------------------------------- Step 1
def rule_classifier(x):
    """AI without learning. The constant 5 came from a person, not from data.

    If spammers change their habits, this number is wrong until someone edits it.
    """
    return 1 if x[0] > 5 else 0


# ---------------------------------------------------------------- Step 2
def accuracy(classify, data):
    """The performance measure P. Always report it on data the model did not train on."""
    if not data:
        return 0.0
    correct = sum(1 for x, label in data if classify(x) == label)
    return correct / len(data)


# ---------------------------------------------------------------- Step 3
def learn_threshold(data):
    """Fit one parameter from data: the cut-off for the rule  x[0] > t.

    A human still chose the FORM of the rule. Only the constant is learned.
    Iterating candidates in ascending order and using a strict '<' keeps the
    smallest threshold when several are equally good.
    """
    candidates = sorted({x[0] for x, _ in data})
    best_t = candidates[0]
    best_errors = len(data) + 1
    for t in candidates:
        errors = sum(1 for x, label in data if (1 if x[0] > t else 0) != label)
        if errors < best_errors:
            best_t, best_errors = t, errors
    return best_t


# ---------------------------------------------------------------- Step 4
def train_perceptron(data, epochs=30, lr=0.1):
    """Rosenblatt's perceptron rule: learn how to combine BOTH features.

    The weights change only when a prediction is wrong (error is -1 or +1).
    The fixed number of epochs guarantees termination even when no straight
    line separates the classes (for example XOR).
    """
    w = [0.0, 0.0]
    b = 0.0
    for _ in range(epochs):
        for x, y in data:
            error = y - predict(w, b, x)
            w[0] += lr * error * x[0]
            w[1] += lr * error * x[1]
            b += lr * error
    return w, b


if __name__ == "__main__":
    train, test = make_data(400, seed=1), make_data(400, seed=2)

    t = learn_threshold(train)
    w, b = train_perceptron(train)

    print("hand-written rule  accuracy:", accuracy(rule_classifier, test))
    print(f"learned threshold  accuracy: {accuracy(lambda x: 1 if x[0] > t else 0, test)}  (t = {t})")
    print("perceptron         accuracy:", accuracy(lambda x: predict(w, b, x), test))

    # The limit of a single straight line: XOR is never learned perfectly.
    xor = [((0, 0), 0), ((0, 1), 1), ((1, 0), 1), ((1, 1), 0)]
    xw, xb = train_perceptron(xor, epochs=1000)
    print("perceptron on XOR  accuracy:", accuracy(lambda x: predict(xw, xb, x), xor))

@@step
{
  "stepNumber": 1,
  "title": "AI without learning: a hand-written rule",
  "instruction": "Implement rule_classifier(x). The input x is a tuple (links, exclamation_marks). Return 1 (spam) when the message has more than 5 links, that is x[0] > 5, and 0 otherwise. This is the outermost doll: it is AI, but nothing is learned, because a person chose the number 5. [MOD-1.2]",
  "hintConceptual": "You are playing the role of the 1980s knowledge engineer: you decide the rule and the constant yourself. No data is involved in this step at all.",
  "hintSyntax": "return 1 if x[0] > 5 else 0"
}
@@assert
assert rule_classifier((7, 0)) == 1, "7 links is more than 5, so this should be spam (1)"
assert rule_classifier((5, 9)) == 0, "Exactly 5 links is NOT more than 5, so this should be 0"
assert rule_classifier((0.5, 0)) == 0, "Few links should be classified 0"
assert rule_classifier((5.01, 0)) == 1, "5.01 is more than 5, so this should be 1"
print("Step 1 passed: you wrote a rule. A human did all the learning.")

@@step
{
  "stepNumber": 2,
  "title": "Define the performance measure",
  "instruction": "Implement accuracy(classify, data). `classify` is any function that takes x and returns 0 or 1, and `data` is a list of (x, label) pairs. Return the fraction of pairs where classify(x) equals the label, as a float between 0 and 1. Return 0.0 if data is empty. This is the performance measure P in Mitchell's definition of learning; without it you cannot say whether anything improved. [MOD-1.2]",
  "hintConceptual": "Accuracy is a count of correct answers divided by the total number of questions. Think about what should happen when there are no questions.",
  "hintSyntax": "if not data:\n    return 0.0\ncorrect = sum(1 for x, label in data if classify(x) == label)\nreturn correct / len(data)"
}
@@assert
_d = [((1, 1), 0), ((9, 9), 1), ((2, 2), 0), ((8, 8), 0)]
_always_one = lambda x: 1
_big = lambda x: 1 if x[0] > 5 else 0
assert accuracy(_always_one, _d) == 0.25, "Always predicting 1 is right on 1 of these 4 examples"
assert accuracy(_big, _d) == 0.75, "The rule x[0] > 5 is right on 3 of these 4 examples"
assert accuracy(_big, []) == 0.0, "An empty dataset should give 0.0, not an error"
assert isinstance(accuracy(_big, _d), float), "accuracy must return a float"
print("Step 2 passed: you can now measure any classifier.")

@@step
{
  "stepNumber": 3,
  "title": "Machine learning: fit the threshold from data",
  "instruction": "Implement learn_threshold(data). Build the list of candidate thresholds from the sorted distinct values of x[0] in the data. For each candidate t, count how many training examples the rule (1 if x[0] > t else 0) gets wrong. Return the candidate with the fewest errors; if several tie, return the smallest. You have just replaced the human-chosen 5 from Step 1 with a number fitted from experience E. [MOD-1.2]",
  "hintConceptual": "This is empirical risk minimisation with one parameter. The 'risk' is the number of training mistakes, and you minimise it by trying every sensible value and remembering the best one.",
  "hintSyntax": "candidates = sorted({x[0] for x, _ in data})\nbest_t, best_errors = candidates[0], len(data) + 1\nfor t in candidates:\n    errors = sum(1 for x, label in data if (1 if x[0] > t else 0) != label)\n    if errors < best_errors:\n        best_t, best_errors = t, errors\nreturn best_t"
}
@@assert
_train = [((1, 0), 0), ((2, 0), 0), ((3, 0), 0), ((4, 0), 1), ((6, 0), 1), ((7, 0), 1)]
assert learn_threshold(_train) == 3, "For this data the rule x[0] > 3 makes zero mistakes, so the answer is 3"
_noisy = [((1, 0), 0), ((2, 0), 1), ((3, 0), 0), ((8, 0), 1), ((9, 0), 1)]
assert learn_threshold(_noisy) == 1, "With one noisy label, thresholds 1 and 3 both make 1 mistake; return the smallest (1)"
_shifted = [((10, 0), 0), ((20, 0), 0), ((30, 0), 1), ((40, 0), 1)]
assert learn_threshold(_shifted) == 20, "The threshold must come from the data, not from a fixed constant"
print("Step 3 passed: the cut-off now comes from data. That is machine learning.")

@@step
{
  "stepNumber": 4,
  "title": "Train a perceptron on both features",
  "instruction": "Implement train_perceptron(data, epochs, lr). Start from w = [0.0, 0.0] and b = 0.0 (already written). For each epoch, go through every (x, y) in data: compute pred with the provided predict(w, b, x), compute error = y - pred, then update w[0], w[1], and b by lr * error times the matching input (the input for b is 1). Return the tuple (w, b). Unlike Step 3, the model now learns how to weigh two features together. [MOD-1.2]",
  "hintConceptual": "The perceptron only changes when it is wrong. A missed spam (error = +1) pulls the weights toward that message's features; a false alarm (error = -1) pushes them away.",
  "hintSyntax": "for _ in range(epochs):\n    for x, y in data:\n        error = y - predict(w, b, x)\n        w[0] += lr * error * x[0]\n        w[1] += lr * error * x[1]\n        b += lr * error\nreturn w, b"
}
@@assert
_sep = [((1, 1), 0), ((2, 1), 0), ((1, 3), 0), ((2, 2), 0), ((6, 5), 1), ((7, 8), 1), ((8, 6), 1), ((6, 7), 1)]
_result = train_perceptron(_sep, epochs=200, lr=0.1)
assert isinstance(_result, tuple) and len(_result) == 2, "train_perceptron must return a tuple (w, b)"
_w, _b = _result
assert len(_w) == 2, "w must contain one weight per feature (2 weights)"
_right = sum(1 for x, y in _sep if (1 if _w[0] * x[0] + _w[1] * x[1] + _b > 0 else 0) == y)
assert _right == len(_sep), f"On linearly separable data the perceptron should classify all 8 points correctly, got {_right}"
assert _w != [0.0, 0.0], "The weights never changed; did you apply the update rule?"
_xor = [((0, 0), 0), ((0, 1), 1), ((1, 0), 1), ((1, 1), 0)]
_xw, _xb = train_perceptron(_xor, epochs=500, lr=0.1)
_xor_right = sum(1 for x, y in _xor if (1 if _xw[0] * x[0] + _xw[1] * x[1] + _xb > 0 else 0) == y)
assert _xor_right < 4, "A single perceptron cannot classify all four XOR points"
print(f"Step 4 passed: 8/8 on separable data, {_xor_right}/4 on XOR. One straight line has limits.")
