@@meta
{
  "moduleId": "MOD-1.3",
  "slug": "mod-1-3",
  "unitId": "UNIT-1",
  "unitTitle": "Unit 1: Understanding AI from Basics",
  "title": "What are Large Language Models?",
  "difficulty": "Foundational",
  "estimatedMinutes": 100,
  "citations": [
    { "title": "Attention Is All You Need (Vaswani et al., 2017)", "source": "arXiv", "url": "https://arxiv.org/abs/1706.03762" },
    { "title": "Training language models to follow instructions with human feedback (InstructGPT)", "source": "arXiv", "url": "https://arxiv.org/pdf/2203.02155" },
    { "title": "Training Compute-Optimal Large Language Models (Chinchilla)", "source": "arXiv", "url": "https://arxiv.org/pdf/2203.15556" },
    { "title": "Speech and Language Processing, Chapter 3: N-gram Language Models (Jurafsky & Martin)", "source": "Stanford", "url": "https://web.stanford.edu/~jurafsky/slp3/3.pdf" },
    { "title": "Tokenizer summary (BPE, WordPiece, SentencePiece)", "source": "Hugging Face Docs", "url": "https://huggingface.co/docs/transformers/tokenizer_summary" },
    { "title": "Neural Networks: Zero to Hero (lecture code and notebooks)", "source": "GitHub", "url": "https://github.com/karpathy/nn-zero-to-hero" },
    { "title": "Large Language Models explained briefly (companion post)", "source": "3Blue1Brown", "url": "https://3blue1brown.substack.com/p/large-language-models-explained-briefly" }
  ],
  "videoLibrary": [
    {
      "id": "VID-1.3-1",
      "title": "Large Language Models explained briefly",
      "creator": "3Blue1Brown",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=LPZh9BOjkQs",
      "timingInstruction": "Watch first, before or right after Section 1",
      "keyTakeaway": "An eight-minute visual map of the whole idea: a function that assigns probabilities to the next token, called over and over, with parameters set by training."
    },
    {
      "id": "VID-1.3-2",
      "title": "[1hr Talk] Intro to Large Language Models",
      "creator": "Andrej Karpathy",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=zjkBMFhNj_g",
      "timingInstruction": "Watch after reading Section 2 (training stages)",
      "keyTakeaway": "Explains a model as two files (parameters plus a small program), then walks through pre-training, fine-tuning into an assistant, and the security issues that follow."
    },
    {
      "id": "VID-1.3-3",
      "title": "The spelled-out intro to language modeling: building makemore",
      "creator": "Andrej Karpathy",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=PaCmpygFfXo",
      "timingInstruction": "Watch alongside the lab; it builds the same bigram model with counts",
      "keyTakeaway": "Builds a character-level bigram model from a count table, then replaces the table with a neural network, which is the exact bridge from this lab to real LLMs."
    },
    {
      "id": "VID-1.3-4",
      "title": "Let's build the GPT Tokenizer",
      "creator": "Andrej Karpathy",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=zduSFxRajkE",
      "timingInstruction": "Optional: watch after Section 4 if tokens still feel mysterious",
      "keyTakeaway": "Implements byte-pair encoding from scratch and shows why many odd model behaviours trace back to tokenization."
    },
    {
      "id": "VID-1.3-5",
      "title": "Introduction to Large Language Models",
      "creator": "Google Cloud",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/introduction-to-large-language-models",
      "timingInstruction": "Short vocabulary refresher after finishing the chapter",
      "keyTakeaway": "A brief, tool-oriented introduction to LLM vocabulary and use cases. Light on mechanics, useful for the terminology."
    },
    {
      "id": "VID-1.3-6",
      "title": "Generative AI with Large Language Models",
      "creator": "DeepLearning.AI and AWS",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/generative-ai-with-llms",
      "timingInstruction": "Optional deeper course once you are comfortable with Python",
      "keyTakeaway": "An intermediate course covering pre-training, fine-tuning, reinforcement learning from human feedback, and scaling laws in far more depth. Check the lab cost notes before starting."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Build a Tiny Language Model from Counts",
    "context": "You are prototyping an autocomplete feature for a note-taking app and want to understand the core mechanism before paying for a real model. You will build a bigram language model that tokenizes text, counts which token follows which, turns counts into probabilities, scores sentences with the chain rule, and generates new text by sampling.",
    "language": "python"
  }
}

@@reading
# What are Large Language Models?

A large language model, or LLM, is the engine inside ChatGPT, Claude, Gemini, and every similar assistant. The surprising fact about these systems is how simple their core job is. An LLM does one thing: given some text, it estimates which piece of text is likely to come next. Everything else, the essays, the code, the conversation, emerges from doing that one thing extremely well, billions of times. This chapter builds the idea from the ground up, with enough mathematics to make it exact and a working miniature you can run yourself.

## 1. First-Principles Mental Model & Intuition

### Your phone keyboard, scaled up

When you type a message on your phone, the keyboard suggests the next word. Type "see you" and it offers "later", "soon", "tomorrow". That feature is a small language model. It has learned, from a great deal of text, which words tend to follow which.

An LLM does the same job with three differences in scale.

1. **It looks much further back.** A phone keyboard considers the last word or two. An LLM considers thousands, sometimes hundreds of thousands, of preceding tokens at once.
2. **It has vastly more adjustable numbers.** A keyboard model is a modest table. An LLM contains billions of numbers called **parameters**, tuned during training.
3. **It learned from far more text.** Training data runs to trillions of words drawn from books, websites, and code.

The useful mental model is this: **an LLM is a mathematical function that takes a sequence of text and returns a probability for every possible next piece of text.** A chatbot is a loop wrapped around that function. It asks for the probabilities, picks one piece, appends it to the text, and asks again.

```text
 "The capital of France is"
            |
            v
   +------------------+        next-token probabilities
   |   LANGUAGE       |        " Paris"   0.91
   |   MODEL          | -----> " a"       0.02
   |  (billions of    |        " located" 0.01
   |   parameters)    |        ... every other token ...
   +------------------+
            |
       pick one token, append it, repeat
            v
 "The capital of France is Paris"
```

### Two files

Andrej Karpathy, a founding member of OpenAI, describes a model as just two files on a disk. One is a very large file holding the parameters. The other is a small program, a few hundred lines of code, that runs them. His example is Llama 2 with 70 billion parameters: at two bytes per parameter the parameter file is about 140 gigabytes. No database of facts sits alongside it, and no connection to the internet is required. Whatever the model "knows" is encoded in those numbers.

### The library and the apprenticeship

Building an assistant happens in two stages that are worth keeping separate in your head.

- **Pre-training** is like reading an enormous library with one exercise repeated endlessly: cover the next word, guess it, check, adjust. The result has absorbed a great deal about language and the world, but it has no manners. Given a question, it might continue with another question, because on the internet questions are often followed by more questions.
- **Fine-tuning** is a short apprenticeship. The model is shown many examples of a question followed by a helpful answer, and learns that this is the shape of response people want.

The first stage produces a **base model**. The second turns it into an **assistant model**. When people talk to ChatGPT or Claude they are talking to the second kind.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Language modeling and the chain rule

A **language model** assigns a probability to any sequence of words. Call the sequence $w_1, w_2, \dots, w_n$. The **chain rule of probability** says the probability of the whole sequence equals the product of the probability of each word given all the words before it:

$$
P(w_1, w_2, \dots, w_n) = \prod_{t=1}^{n} P\big(w_t \mid w_1, \dots, w_{t-1}\big)
$$

This is an exact identity, with no approximation. For the three-word sentence "the cat sat":

$$
P(\text{the cat sat}) = P(\text{the}) \times P(\text{cat} \mid \text{the}) \times P(\text{sat} \mid \text{the cat})
$$

The identity tells us something important. If you can predict the next word well in every context, you have a complete model of the language. Next-word prediction is not a party trick bolted onto a language model. It is the whole definition.

### The n-gram shortcut

The hard part is the conditional probability $P(w_t \mid w_1, \dots, w_{t-1})$, because the history can be any length. The oldest solution is the **Markov assumption**: pretend only the last few words matter. A **bigram** model looks at one previous word:

$$
P\big(w_t \mid w_1, \dots, w_{t-1}\big) \approx P\big(w_t \mid w_{t-1}\big)
$$

We estimate that probability by counting. Let $C(a\, b)$ be the number of times word $b$ follows word $a$ in the training text, and $C(a)$ the number of times $a$ is followed by anything:

$$
P\big(w_t \mid w_{t-1}\big) = \frac{C(w_{t-1}\, w_t)}{C(w_{t-1})}
$$

This is called the **maximum-likelihood estimate**. If "the" occurs 1,000 times and is followed by "cat" 20 times, then $P(\text{cat} \mid \text{the}) = 0.02$.

Bigram models are easy to build and badly limited. They forget everything beyond one word. Extending the history helps but hits a wall: with a vocabulary of $V$ words, a model that conditions on the previous $n-1$ words has up to $V^{n}$ possible entries. For $V = 50{,}000$ and a history of just four words that is more than $10^{23}$ combinations, almost none of which appear in any training text. This explosion is called **sparsity**, and it is the reason counting does not scale.

### The neural solution

A neural language model replaces the giant count table with a function that *computes* the probabilities. The steps are:

```text
  text  -->  tokens  -->  embeddings  -->  transformer layers  -->  logits  -->  probabilities
 "Hello"    [15496]      [0.12, -0.80,     mix information          one score     softmax
                          0.33, ...]       across positions         per token
```

1. **Tokens.** Text is cut into pieces called tokens. Each token has an integer ID.
2. **Embeddings.** Each ID is looked up in a table and replaced by a list of numbers, a vector, that the model has learned. Tokens used in similar ways end up with similar vectors.
3. **Transformer layers.** A stack of layers repeatedly mixes information between positions so that each position's vector comes to reflect its full context. The architecture is called the **transformer**, introduced in the 2017 paper "Attention Is All You Need". The next module covers how it works.
4. **Logits.** The final layer produces one raw score, called a **logit**, for every token in the vocabulary.
5. **Softmax.** The scores are converted to probabilities that are positive and sum to one. If the logit for token $v$ is $z_v$ and the vocabulary is $V$:

$$
P\big(w_t = v \mid w_1, \dots, w_{t-1}\big) = \frac{e^{z_v}}{\sum_{u \in V} e^{z_u}}
$$

Because the function *computes* its answer from learned vectors, it can give sensible probabilities for contexts it has never seen, which the count table cannot.

### Training: one number to push down

Training adjusts the parameters so the model assigns high probability to the token that actually came next in real text. The loss is the average negative log-probability of the true next token, called **cross-entropy**:

$$
\mathcal{L} = -\frac{1}{N} \sum_{t=1}^{N} \log P\big(w_t \mid w_1, \dots, w_{t-1}\big)
$$

If the model gives the true token probability 1, the log is 0 and the loss is 0. If it gives the true token a tiny probability, the log is a large negative number and the loss is large. A closely related number is **perplexity**, defined as $e^{\mathcal{L}}$. Roughly, a perplexity of 20 means the model is as uncertain as if it were choosing uniformly among 20 options at each step. Lower is better.

### Tokens are not words

Modern models do not use whole words as tokens. They use **sub-word** pieces found by an algorithm such as **byte-pair encoding (BPE)**. BPE starts with single characters or bytes and repeatedly merges the most frequent adjacent pair into a new token, until the vocabulary reaches a target size, typically tens of thousands of tokens. Common words become a single token. Rare words are split: an unusual word might become three or four pieces. Byte-level BPE starts from the 256 possible byte values, so any text at all can be encoded.

A common rule of thumb for English is that one token is about four characters, or roughly three quarters of a word. It is only a rule of thumb. Other languages, code, and unusual strings can use far more tokens per word.

### Parameters and the context window

| Term | What it is | Typical size |
|---|---|---|
| Vocabulary | The fixed set of tokens the model knows | Tens of thousands to a few hundred thousand |
| Embedding | The learned vector for one token | Hundreds to thousands of numbers |
| Parameters | Every learned number in the model, including embeddings and layer weights | Billions to hundreds of billions |
| Context window | The maximum number of tokens the model can take in at once, prompt and reply together | Thousands to over a million |

Two distinctions prevent a lot of confusion.

- **Parameters versus hyperparameters.** Parameters are learned during training. Hyperparameters, such as the number of layers, are chosen by engineers.
- **Training versus inference.** During training the parameters change. During **inference**, which is what happens when you use a chatbot, the parameters are frozen. The model does not learn from your conversation as it happens.

**Cost.** In a standard transformer every position attends to every other position, so the computation for a context of $n$ tokens grows roughly in proportion to $n^{2}$. Doubling the context roughly quadruples that part of the work. This is why long contexts are slower and more expensive, and why providers charge by the token.

### From base model to assistant

| Stage | Data | Objective | Result |
|---|---|---|---|
| 1. Pre-training | Trillions of tokens of general text | Predict the next token (self-supervised) | A base model that continues text |
| 2. Supervised fine-tuning | Many thousands of written prompt and response pairs | Predict the next token on those examples | A model that answers in assistant style |
| 3. Preference tuning | Human rankings of alternative answers | Produce answers people rate higher | A more helpful, better-behaved assistant |

Stage 3 is often done with **reinforcement learning from human feedback (RLHF)**. The 2022 InstructGPT paper from OpenAI showed how much this stage matters: human raters preferred the outputs of a 1.3-billion-parameter model tuned this way over those of the original 175-billion-parameter GPT-3, a model over a hundred times larger. The same paper notes that the tuned model still makes up facts. Tuning changes behaviour. It does not install a truth-checker.

A further finding worth knowing: the 2022 "Chinchilla" study from DeepMind showed that many large models had been given too little training data for their size, and that parameters and training tokens should be scaled up together. Bigger is not automatically better.

## 3. Production-Grade Implementation & Annotated Walkthrough

The best way to understand an LLM is to build its ancestor. The program below is a complete bigram language model in standard-library Python. It trains, computes probabilities, and generates text.

```python
import math
import random
import re
from collections import Counter, defaultdict

CORPUS = [
    "the cat sat on the mat .",
    "the dog sat on the rug .",
    "the cat chased the dog .",
    "a dog chased a cat .",
]

def tokenize(text):
    """Lower-case and split into word tokens and punctuation tokens."""
    return re.findall(r"[a-z']+|[.,!?]", text.lower())

def train(sentences):
    """Count how often each token follows each other token."""
    counts = defaultdict(Counter)
    for sentence in sentences:
        tokens = ["<s>"] + tokenize(sentence) + ["</s>"]
        for prev, nxt in zip(tokens, tokens[1:]):
            counts[prev][nxt] += 1
    return counts

def probs(counts, prev):
    """P(next | prev) for every token ever seen after prev."""
    total = sum(counts[prev].values())
    return {tok: c / total for tok, c in counts[prev].items()}

def generate(counts, seed, max_tokens=20):
    """Sample one token at a time until the end marker appears."""
    rng = random.Random(seed)
    prev, output = "<s>", []
    for _ in range(max_tokens):
        options = probs(counts, prev)
        nxt = rng.choices(list(options), weights=list(options.values()))[0]
        if nxt == "</s>":
            break
        output.append(nxt)
        prev = nxt
    return " ".join(output)

counts = train(CORPUS)
print(probs(counts, "the"))
for seed in range(3):
    print(generate(counts, seed))
```

Line-by-line commentary:

- **`tokenize`** is the tokenizer. The regular expression keeps runs of letters as one token and each punctuation mark as its own token. Real tokenizers use BPE, but the role is identical: turn a string into a list of discrete symbols.
- **`"<s>"` and `"</s>"`** are special marker tokens for the start and end of a sentence. Without a start marker the model could not say which words tend to begin a sentence, and without an end marker generation would never know when to stop. Real LLMs use special tokens in exactly this way, including markers that separate the user's turn from the assistant's.
- **`zip(tokens, tokens[1:])`** pairs each token with its successor. Every pair is one free training example, which is self-supervision in miniature: the text supplies its own labels.
- **`counts`** is the model. In this miniature the "parameters" are the entries of a count table. In an LLM they are the weights of a neural network, but both are numbers fitted to text.
- **`probs`** applies the maximum-likelihood formula from Section 2. On this corpus `probs(counts, "the")` gives `cat` and `dog` a probability of one third each and `mat` and `rug` one sixth each.
- **`generate`** is the autoregressive loop that every chatbot runs: get the distribution, sample, append, repeat. `rng.choices` picks a token at random in proportion to its probability. Seeding the generator makes a run repeatable.

Run it and you get sentences such as "the dog chased a cat ." that appear nowhere in the corpus. The model recombined pieces it had seen. That is generation, at the smallest possible scale.

Now the two classic problems. Add a scorer:

```python
def log_prob(counts, sentence):
    """Chain rule: add the log-probability of every transition."""
    tokens = ["<s>"] + tokenize(sentence) + ["</s>"]
    total = 0.0
    for prev, nxt in zip(tokens, tokens[1:]):
        p = probs(counts, prev).get(nxt, 0.0)
        total += math.log(p)          # crashes when p == 0
    return total
```

**Problem 1: underflow.** Multiplying many probabilities below one quickly produces a number too small for the computer to represent. The fix is to add logarithms instead of multiplying probabilities, which is why the function sums `math.log(p)`. Every real system works in log space.

**Problem 2: zeros.** Score "the cat sat on the rug ." and it works. Score "the mat sat ." and `math.log(0.0)` raises an error, because "mat" was never followed by "sat". A probability of zero for one unseen pair wipes out the whole sentence. The classic repair is **add-one (Laplace) smoothing**: pretend every possible pair was seen once more than it was.

$$
P_{\text{smooth}}\big(w_t \mid w_{t-1}\big) = \frac{C(w_{t-1}\, w_t) + 1}{C(w_{t-1}) + V}
$$

Here $V$ is the vocabulary size. No pair has zero probability any more. You will implement this in the lab. Neural models avoid the problem differently: the softmax never outputs exactly zero.

**Complexity.** Training makes one pass over the text, so it costs time proportional to the number of tokens $N$. The table stores at most one entry per distinct pair, bounded by both $N$ and $V^{2}$. Looking up a distribution costs time proportional to the number of distinct successors of one token. Compare that with an LLM, where producing a single token means multiplying through billions of parameters. The count table is fast and forgetful. The neural network is slow and remembers context.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**"It's just autocomplete" is true and misleading.** The training objective really is next-token prediction. But the function that results is not a lookup table of memorised phrases. To predict the next token of a physics derivation or a piece of code well, a model has to capture a great deal of structure. The phrase "stochastic parrot", from a 2021 paper by Emily Bender, Timnit Gebru, and colleagues, argues that fluency should not be mistaken for understanding. Critics respond that the phrase undersells what the models demonstrably do. You do not need to settle the debate to work effectively. Hold both facts: the objective is simple, and the learned behaviour is rich and also unreliable.

**A base LLM has no database and no internet.** It does not look anything up. Facts are smeared across its parameters, which is why it can state falsehoods fluently, and why it does not know about events after its training data was collected (its **knowledge cutoff**). Web search, document retrieval, and tools are separate components added around the model. When an assistant cites a current news story, a search tool fetched it.

**Tokens are not words, and this explains strange failures.** Because a model sees sub-word pieces and never individual letters, tasks like counting the letters in a word, reversing a string, or exact arithmetic on long numbers are harder for it than they look. Many "the AI can't even spell" posts are tokenization at work.

**The context window is not memory.** Within one conversation the application re-sends the whole history to the model on every turn. Nothing is stored inside the model. When a conversation grows beyond the window, older content must be dropped or summarised, and the model then really has "forgotten" it. Product features called "memory" work by saving notes and inserting them into later prompts.

**The model does not learn from your chat in real time.** Parameters are frozen at inference. A correction you make affects the rest of that conversation because your correction is now in the context, not because the model changed.

**Same prompt, different answer.** This is sampling, not malfunction. The model produces a distribution and the application draws from it. Settings such as temperature control how adventurous the draw is.

**Token counts drive cost and limits.** Providers bill by tokens in and tokens out, and non-English text and code often use more tokens than the word count suggests. Estimate with a tokenizer tool before committing to a budget.

**Bigger is not automatically better.** Parameter count is one factor among several: the amount and quality of training data, and the fine-tuning, matter as much. A well-tuned smaller model can beat a poorly trained larger one, as the InstructGPT result showed.

**A raw base model is a strange thing to talk to.** If you ever use one directly, you will find it continues your text and ignores your intent. Ask it a question and it may write three more questions. Everything that feels like an "assistant" was added by fine-tuning and by the hidden instructions the application places before your message.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A large language model is a function with billions of learned parameters that maps a sequence of tokens to a probability distribution over the next token. The chain rule shows that good next-token prediction amounts to a full model of language. Counting-based models fail because of sparsity, so modern models compute the distribution with a neural network: tokens become embeddings, transformer layers mix in context, and a softmax produces probabilities. Pre-training on vast text yields a base model that continues text, and fine-tuning with examples and human feedback turns it into an assistant. Text is generated one token at a time by sampling, the model's knowledge lives in frozen parameters, and the context window is the only "memory" it has during a conversation.

**Question 1.** The chain rule factorisation of $P(w_1, \dots, w_n)$ is exact, yet a bigram model built on it performs poorly. Where exactly does the approximation enter, and what goes wrong if you try to fix it by counting longer histories?

<details>
<summary>View Answer</summary>

The chain rule itself is exact. The approximation is the Markov assumption, which replaces the full history in each conditional probability with only the previous word, so everything earlier in the sentence is ignored. Lengthening the history to several words runs into sparsity: the number of possible contexts grows as the vocabulary size raised to the power of the history length, so almost every long context never appears in the training text, and its counts are zero. Neural language models solve this by computing the conditional probability from learned vectors, which lets them generalise to contexts they have not seen.

</details>

**Question 2.** A friend says, "I corrected the chatbot yesterday, so it knows the right answer now." What is wrong with this statement, and what actually happened during their conversation?

<details>
<summary>View Answer</summary>

During use the model's parameters are frozen, so nothing was learned in the training sense. Within yesterday's conversation, the correction became part of the text in the context window, and the model's later replies were conditioned on it, which made it appear to have learned. A new conversation starts without that text, so the correction is gone, unless the product has a separate memory feature that saved a note and inserts it into future prompts. Even then the model itself is unchanged.

</details>

**Question 3.** Why does a base model, fresh from pre-training, often respond to a question by writing more questions, and what two later stages change that?

<details>
<summary>View Answer</summary>

Pre-training optimises one thing: predicting the likely continuation of text found in its training data. In that data a question is frequently followed by further questions, a forum signature, or unrelated text, so continuing with more questions is a perfectly good prediction. Supervised fine-tuning on prompt and response pairs teaches the model that a question should be followed by a helpful answer. Preference tuning, often reinforcement learning from human feedback, then shifts it toward the answers people rate as better. These stages change the style and behaviour of responses. They do not guarantee the content is true.

</details>

@@starter
"""
Lab: Build a Tiny Language Model from Counts
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".

A bigram model predicts the next token from the previous token only.
START and END are special marker tokens for the beginning and end of a sentence.
"""
import math
import random
import re
from collections import Counter, defaultdict

START = "<s>"
END = "</s>"

CORPUS = [
    "The cat sat on the mat.",
    "The dog sat on the rug.",
    "The cat chased the dog.",
    "A dog chased a cat.",
]


# ---------------------------------------------------------------- Step 1
def tokenize(text):
    """Turn a string into a list of lower-case word tokens and punctuation tokens."""
    # TODO Step 1: lower-case the text, then use re.findall with the pattern
    #   r"[a-z']+|[.,!?]"   (a run of letters/apostrophes, OR one punctuation mark)
    return None


# ---------------------------------------------------------------- Step 2
def count_bigrams(token_lists):
    """Count how often each token follows each other token.

    token_lists is a list of token lists, e.g. [["the", "cat", "."], ["a", "dog", "."]].
    Return a dict of Counters: counts[previous_token][next_token] -> number of times seen.
    """
    counts = defaultdict(Counter)
    # TODO Step 2: for each token list, wrap it as [START] + tokens + [END],
    #   then for every adjacent pair (prev, nxt) add 1 to counts[prev][nxt].
    #   Finally return counts.
    return None


# ---------------------------------------------------------------- Step 3
def next_token_probs(counts, prev):
    """Maximum-likelihood estimate of P(next | prev) as a dict {token: probability}."""
    # TODO Step 3: if prev is not in counts, return an empty dict {}.
    #   Otherwise divide each count in counts[prev] by the total of counts[prev].
    return None


# ---------------------------------------------------------------- Step 4
def sentence_log_prob(counts, tokens, vocab_size):
    """Chain rule in log space with add-one smoothing.

    Score the sequence [START] + tokens + [END]. For each adjacent pair (prev, nxt) add
        log( (count(prev, nxt) + 1) / (total_count(prev) + vocab_size) )
    and return the sum (a negative float).
    """
    # TODO Step 4: use counts.get(prev, {}) so an unseen `prev` behaves like an empty row.
    return None


# ---------------------------------------------------------------- Step 5
def generate(counts, seed, max_tokens=20):
    """Sample a sentence token by token, starting from START. Return a list of tokens."""
    rng = random.Random(seed)
    prev = START
    output = []
    # TODO Step 5: repeat at most max_tokens times:
    #   options = next_token_probs(counts, prev); stop if it is empty
    #   nxt = rng.choices(list(options), weights=list(options.values()))[0]
    #   stop if nxt == END; otherwise append nxt to output and set prev = nxt
    # Return output (it must NOT contain START or END).
    return None


if __name__ == "__main__":
    token_lists = [tokenize(sentence) for sentence in CORPUS]
    counts = count_bigrams(token_lists)
    print("tokens of sentence 1 :", token_lists[0])
    print("P(next | 'the')      :", next_token_probs(counts, "the"))
    print("generated            :", generate(counts, seed=0))

@@solution
"""
Lab solution: Build a Tiny Language Model from Counts
Standard library only.

A bigram model predicts the next token from the previous token only.
START and END are special marker tokens for the beginning and end of a sentence.
"""
import math
import random
import re
from collections import Counter, defaultdict

START = "<s>"
END = "</s>"

CORPUS = [
    "The cat sat on the mat.",
    "The dog sat on the rug.",
    "The cat chased the dog.",
    "A dog chased a cat.",
]


# ---------------------------------------------------------------- Step 1
def tokenize(text):
    """The tokenizer: a string becomes a list of discrete symbols.

    Real LLMs use byte-pair encoding, which splits rare words into sub-word pieces,
    but the role in the pipeline is exactly this.
    """
    return re.findall(r"[a-z']+|[.,!?]", text.lower())


# ---------------------------------------------------------------- Step 2
def count_bigrams(token_lists):
    """Training. The count table IS the model: its entries play the role of parameters.

    Every adjacent pair is a free training example (self-supervision): the text
    supplies its own "correct next token".
    """
    counts = defaultdict(Counter)
    for tokens in token_lists:
        sequence = [START] + list(tokens) + [END]
        for prev, nxt in zip(sequence, sequence[1:]):
            counts[prev][nxt] += 1
    return counts


# ---------------------------------------------------------------- Step 3
def next_token_probs(counts, prev):
    """P(next | prev) = C(prev next) / C(prev). The output is a probability distribution."""
    if prev not in counts:
        return {}                      # a context never seen in training
    row = counts[prev]
    total = sum(row.values())
    return {token: count / total for token, count in row.items()}


# ---------------------------------------------------------------- Step 4
def sentence_log_prob(counts, tokens, vocab_size):
    """Chain rule, computed as a sum of logs to avoid numeric underflow.

    Add-one smoothing gives every unseen pair a small non-zero probability, so one
    unfamiliar transition no longer makes the whole sentence impossible.
    """
    sequence = [START] + list(tokens) + [END]
    total = 0.0
    for prev, nxt in zip(sequence, sequence[1:]):
        row = counts.get(prev, {})
        numerator = row.get(nxt, 0) + 1
        denominator = sum(row.values()) + vocab_size
        total += math.log(numerator / denominator)
    return total


# ---------------------------------------------------------------- Step 5
def generate(counts, seed, max_tokens=20):
    """The autoregressive loop every chatbot runs: distribution -> sample -> append -> repeat."""
    rng = random.Random(seed)          # seeded so a run can be reproduced
    prev = START
    output = []
    for _ in range(max_tokens):
        options = next_token_probs(counts, prev)
        if not options:                # dead end: nothing ever followed this token
            break
        nxt = rng.choices(list(options), weights=list(options.values()))[0]
        if nxt == END:
            break
        output.append(nxt)
        prev = nxt
    return output


if __name__ == "__main__":
    token_lists = [tokenize(sentence) for sentence in CORPUS]
    counts = count_bigrams(token_lists)
    vocab = {token for tokens in token_lists for token in tokens} | {END}

    print("tokens of sentence 1 :", token_lists[0])
    print("P(next | 'the')      :", next_token_probs(counts, "the"))
    for sentence in ["the cat sat on the rug.", "rug the on sat cat the."]:
        score = sentence_log_prob(counts, tokenize(sentence), len(vocab))
        print(f"log P = {score:8.3f}  :  {sentence}")
    for seed in range(4):
        print("generated            :", " ".join(generate(counts, seed)))

@@step
{
  "stepNumber": 1,
  "title": "Tokenize: text becomes symbols",
  "instruction": "Implement tokenize(text). Lower-case the text, then return re.findall(r\"[a-z']+|[.,!?]\", text). Words (including apostrophes, as in don't) become one token each, and each of the punctuation marks . , ! ? becomes its own token. Everything else, such as spaces and digits, is dropped. A language model never sees a string; it sees this list. [MOD-1.3]",
  "hintConceptual": "The model needs a fixed set of discrete symbols. Decide what counts as one symbol: here a run of letters is one symbol and a punctuation mark is another.",
  "hintSyntax": "return re.findall(r\"[a-z']+|[.,!?]\", text.lower())"
}
@@assert
assert tokenize("The cat sat.") == ["the", "cat", "sat", "."], "Expected ['the', 'cat', 'sat', '.']"
assert tokenize("Don't stop, OK?") == ["don't", "stop", ",", "ok", "?"], "Apostrophes stay inside words; punctuation is its own token"
assert tokenize("") == [], "An empty string has no tokens"
assert tokenize("  Hello   WORLD!  ") == ["hello", "world", "!"], "Extra spaces are ignored and text is lower-cased"
print("Step 1 passed: strings are now token lists.")

@@step
{
  "stepNumber": 2,
  "title": "Train: count which token follows which",
  "instruction": "Implement count_bigrams(token_lists). For each token list, build the sequence [START] + tokens + [END]. For every adjacent pair (prev, nxt) in that sequence, add 1 to counts[prev][nxt]. Return counts. This table is your trained model: its numbers play the role that billions of parameters play in an LLM, and every pair was a free training example taken from the text itself. [MOD-1.3]",
  "hintConceptual": "Training here is one pass of counting. The START and END markers let the model learn which tokens begin and finish a sentence, exactly like the special tokens in real models.",
  "hintSyntax": "for tokens in token_lists:\n    sequence = [START] + list(tokens) + [END]\n    for prev, nxt in zip(sequence, sequence[1:]):\n        counts[prev][nxt] += 1\nreturn counts"
}
@@assert
_c = count_bigrams([["the", "cat"], ["the", "dog"], ["a", "cat"]])
assert _c is not None, "count_bigrams must return the counts table"
assert _c["the"]["cat"] == 1 and _c["the"]["dog"] == 1, "'the' is followed once by 'cat' and once by 'dog'"
assert _c[START]["the"] == 2 and _c[START]["a"] == 1, "Two sentences start with 'the' and one with 'a'"
assert _c["cat"][END] == 2, "'cat' ends a sentence twice"
assert sum(sum(row.values()) for row in _c.values()) == 9, "3 sentences of 2 tokens give 3 pairs each: 9 pairs in total"
print("Step 2 passed: the count table is your model.")

@@step
{
  "stepNumber": 3,
  "title": "Turn counts into a probability distribution",
  "instruction": "Implement next_token_probs(counts, prev). If prev is not a key of counts, return an empty dict. Otherwise return a dict that maps each token seen after prev to its count divided by the total count for prev. This is the maximum-likelihood estimate from Section 2, and the result must sum to 1: it is the same kind of next-token distribution a real LLM outputs. [MOD-1.3]",
  "hintConceptual": "A probability distribution is a set of non-negative numbers that add up to one. Dividing every count in a row by the row's total gives exactly that.",
  "hintSyntax": "if prev not in counts:\n    return {}\nrow = counts[prev]\ntotal = sum(row.values())\nreturn {token: count / total for token, count in row.items()}"
}
@@assert
_counts = {"the": {"cat": 2, "dog": 1, "mat": 1}, "cat": {"sat": 3}}
_p = next_token_probs(_counts, "the")
assert _p == {"cat": 0.5, "dog": 0.25, "mat": 0.25}, "Counts 2, 1, 1 out of 4 should give 0.5, 0.25, 0.25"
assert abs(sum(_p.values()) - 1.0) < 1e-9, "Probabilities must sum to 1"
assert next_token_probs(_counts, "cat") == {"sat": 1.0}, "A token with a single successor gives that successor probability 1.0"
assert next_token_probs(_counts, "zebra") == {}, "An unseen previous token must return an empty dict"
print("Step 3 passed: you can now predict the next token.")

@@step
{
  "stepNumber": 4,
  "title": "Score a sentence with the chain rule",
  "instruction": "Implement sentence_log_prob(counts, tokens, vocab_size). Build the sequence [START] + tokens + [END]. For each adjacent pair (prev, nxt), let row = counts.get(prev, {}) and add math.log((row.get(nxt, 0) + 1) / (sum(row.values()) + vocab_size)) to a running total. Return the total. Summing logs is the chain rule without numeric underflow, and the +1 (add-one smoothing) stops a single unseen pair from making the whole sentence impossible. [MOD-1.3]",
  "hintConceptual": "The probability of a sentence is a product of next-token probabilities. A product of many small numbers underflows, and the log of a product is the sum of the logs, so add logs instead.",
  "hintSyntax": "sequence = [START] + list(tokens) + [END]\ntotal = 0.0\nfor prev, nxt in zip(sequence, sequence[1:]):\n    row = counts.get(prev, {})\n    total += math.log((row.get(nxt, 0) + 1) / (sum(row.values()) + vocab_size))\nreturn total"
}
@@assert
_counts = {START: {"hi": 3, "yo": 1}, "hi": {END: 2, "there": 1}, "there": {END: 1}}
_V = 4
_expected = math.log((3 + 1) / (4 + _V)) + math.log((2 + 1) / (3 + _V))
_got = sentence_log_prob(_counts, ["hi"], _V)
assert isinstance(_got, float), "sentence_log_prob must return a float"
assert abs(_got - _expected) < 1e-9, f"Expected {_expected:.6f} for ['hi'], got {_got}"
_unseen = sentence_log_prob(_counts, ["yo", "there"], _V)
_expected_unseen = math.log((1 + 1) / (4 + _V)) + math.log((0 + 1) / (0 + _V)) + math.log((1 + 1) / (1 + _V))
assert abs(_unseen - _expected_unseen) < 1e-9, "Unseen pairs and unseen previous tokens must be smoothed, not crash"
assert _got > _unseen, "A sentence made of common pairs must score higher than one with unseen pairs"
print(f"Step 4 passed: log P(seen) = {_got:.3f} > log P(unseen) = {_unseen:.3f}")

@@step
{
  "stepNumber": 5,
  "title": "Generate text by sampling",
  "instruction": "Implement generate(counts, seed, max_tokens). Starting with prev = START, repeat at most max_tokens times: get options = next_token_probs(counts, prev) and stop if it is empty; draw nxt = rng.choices(list(options), weights=list(options.values()))[0]; stop if nxt is END; otherwise append nxt to output and set prev = nxt. Return the output list, which must not contain START or END. This is the autoregressive loop every chatbot runs: get a distribution, sample one token, append, repeat. [MOD-1.3]",
  "hintConceptual": "Generation feeds the model's own output back in as the next input. Sampling in proportion to probability, and not always taking the most likely token, is what makes each run different.",
  "hintSyntax": "for _ in range(max_tokens):\n    options = next_token_probs(counts, prev)\n    if not options:\n        break\n    nxt = rng.choices(list(options), weights=list(options.values()))[0]\n    if nxt == END:\n        break\n    output.append(nxt)\n    prev = nxt\nreturn output"
}
@@assert
_counts = {
    START: {"the": 3, "a": 1},
    "the": {"cat": 2, "dog": 2},
    "a": {"dog": 1},
    "cat": {"sat": 1, END: 1},
    "dog": {"sat": 1, END: 2},
    "sat": {END: 2},
}
_runs = [generate(_counts, seed=s, max_tokens=10) for s in range(40)]
assert all(isinstance(r, list) for r in _runs), "generate must return a list of tokens"
assert all(START not in r and END not in r for r in _runs), "The output must not contain the START or END markers"
assert all(len(r) <= 10 for r in _runs), "The output must respect max_tokens"
for _r in _runs:
    _seq = [START] + _r
    assert all(b in _counts[a] for a, b in zip(_seq, _seq[1:])), f"Every generated pair must exist in the model: {_r}"
assert generate(_counts, seed=5) == generate(_counts, seed=5), "The same seed must give the same text"
assert len({tuple(r) for r in _runs}) > 1, "Different seeds should produce more than one distinct sentence (are you sampling?)"
assert generate({START: {"x": 1}, "x": {"x": 1}}, seed=0, max_tokens=7) == ["x"] * 7, "A model that never emits END must stop at max_tokens"
print("Step 5 passed: sample output ->", " ".join(_runs[0]))
