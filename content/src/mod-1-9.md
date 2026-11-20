@@meta
{
  "moduleId": "MOD-1.9",
  "slug": "mod-1-9",
  "unitId": "UNIT-1",
  "unitTitle": "Unit 1: Understanding AI from Basics",
  "title": "How AI Processes Information",
  "difficulty": "Foundational",
  "estimatedMinutes": 105,
  "citations": [
    { "title": "Neural Machine Translation of Rare Words with Subword Units (BPE)", "source": "arXiv", "url": "https://arxiv.org/abs/1508.07909v2" },
    { "title": "Efficient Estimation of Word Representations in Vector Space (word2vec)", "source": "arXiv", "url": "https://arxiv.org/abs/1301.3781" },
    { "title": "RoFormer: Enhanced Transformer with Rotary Position Embedding", "source": "arXiv", "url": "https://arxiv.org/abs/2104.09864v5" },
    { "title": "Lost in the Middle: How Language Models Use Long Contexts", "source": "arXiv", "url": "https://arxiv.org/abs/2307.03172v3" },
    { "title": "Context Rot: How Increasing Input Tokens Impacts LLM Performance", "source": "Chroma Research", "url": "https://research.trychroma.com/context-rot" },
    { "title": "Fair Is Better than Sensational: Man Is to Doctor as Woman Is to Doctor", "source": "ACL Anthology", "url": "https://aclanthology.org/2020.cl-2.7" },
    { "title": "tiktoken (includes an educational BPE module)", "source": "GitHub", "url": "https://github.com/openai/tiktoken" },
    { "title": "Byte-Pair Encoding tokenization", "source": "Hugging Face Course", "url": "https://huggingface.co/course/chapter6/5" }
  ],
  "videoLibrary": [
    {
      "id": "VID-1.9-1",
      "title": "Tokens vs Embeddings – what are they + how are they different?",
      "creator": "Annie Sexton",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=izbifbq3-eI",
      "timingInstruction": "Watch the first 30 minutes after reading Section 2 (tokenization)",
      "keyTakeaway": "The difference between tokens and embeddings, the two representations this module builds on."
    },
    {
      "id": "VID-1.9-2",
      "title": "Vectoring Words (Word Embeddings) - Computerphile",
      "creator": "Computerphile",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=gQddtTdmG_8",
      "timingInstruction": "Watch after reading Section 2 (embeddings)",
      "keyTakeaway": "Rob Miles explains how predicting neighbouring words forces a model to place related words near each other, and demonstrates vector arithmetic on real embeddings."
    },
    {
      "id": "VID-1.9-3",
      "title": "Most devs don't understand how LLM tokens work",
      "creator": "Matt Pocock",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=nKSk_TiR8YA",
      "timingInstruction": "Watch the embedding section (from about the midpoint) after the lab",
      "keyTakeaway": "Practical consequences of tokenization: token counts, costs, and odd model behaviour."
    },
    {
      "id": "VID-1.9-4",
      "title": "What are Word Embeddings?",
      "creator": "IBM Technology",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=wgfSDrqYMJ4",
      "timingInstruction": "Watch after Section 2 (attention and position) if you skipped it in Module 1.4",
      "keyTakeaway": "How embeddings place words in a vector space so that similar meanings sit close together."
    },
    {
      "id": "VID-1.9-5",
      "title": "Natural Language Processing with Attention Models",
      "creator": "DeepLearning.AI",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/attention-models-in-nlp",
      "timingInstruction": "Optional intermediate course after finishing Unit 1",
      "keyTakeaway": "The final course of the NLP Specialization: you implement attention and a transformer in code. Requires Python and some machine-learning background."
    },
    {
      "id": "VID-1.9-6",
      "title": "Transformer Models and BERT Model",
      "creator": "Google Cloud",
      "platform": "Coursera Plus",
      "tier": "Paid",
      "url": "https://www.coursera.org/learn/transformer-models-and-bert-model",
      "timingInstruction": "Optional one-hour overview; reviewers report the lab may not run, so treat it as video only",
      "keyTakeaway": "A compact vendor overview of the transformer's components, useful as a second explanation of the same pipeline."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Build a Tokenizer and a Semantic Search",
    "context": "Your support team wants to estimate what its chatbot will cost and to search its help articles by meaning, and both depend on mechanics nobody on the team has seen. You will implement byte-pair encoding from scratch to see where tokens come from, then cosine similarity and nearest-neighbour search to see how meaning becomes geometry.",
    "language": "python"
  }
}

@@reading
# How AI Processes Information

A language model never sees a word, a letter, or a sentence. It sees a list of integers, turns each into a long list of decimal numbers, and does arithmetic on those. Every strength and every strange weakness of these systems follows from that pipeline. This chapter walks through its three stages in order: how text is cut into **tokens**, how tokens become **embeddings** in which meaning is a matter of geometry, and how **attention** combined with position information lets the model read an entire context at once.

## 1. First-Principles Mental Model & Intuition

### Stage 1: tokens are Lego bricks

Suppose you had to build any sentence in any language from a fixed box of bricks. You could give yourself one brick per word, but then you would need millions of bricks, and a new word, a typo, or a name you had never seen could not be built at all. You could give yourself one brick per letter, which can build anything, but then every sentence would be an enormous pile of tiny bricks.

Tokenization takes the middle path. Common words get their own brick. Rarer words are assembled from a few smaller bricks. Anything at all can be built, because the smallest bricks are single characters or bytes.

```text
 "the"            ->  [the]                      1 brick  (very common)
 "tokenization"   ->  [token][ization]           2 bricks (common pieces)
 "Zyxwvut"        ->  [Z][yx][w][v][ut]          5 bricks (never seen before)
```

The model receives the bricks' ID numbers and nothing else. It has no direct view of the letters inside a brick. Keep that fact in mind. It explains why a system that can write a sonnet may miscount the letters in a word.

### Stage 2: embeddings are a map

An ID number such as 4821 carries no meaning. So the first thing the model does is look up each ID in a giant table and replace it with a list of numbers, typically a few hundred to a few thousand of them. That list is the token's **embedding**.

Think of the embedding as coordinates on a map. On a map of a country, nearby coordinates mean nearby places. On the map of embeddings, nearby coordinates mean tokens that are *used in similar ways*. "Doctor" sits near "nurse" and "hospital". "Tuesday" sits near "Wednesday". Nobody places them. Training moves the points until the map is useful for prediction, and words with related uses end up as neighbours as a side effect.

Because position on the map encodes meaning, *direction* does too. Moving in a particular direction might correspond to "more formal", or "plural", or "feminine". This is what people mean by **meaning as geometry**.

### Stage 3: attention is a meeting, and everyone needs a name tag with a seat number

A token's embedding is the same wherever the token appears. But "bank" means different things in "river bank" and "bank account". Module 1.4 described attention as a meeting in which each token gathers information from the others, so that the vector for "bank" comes to reflect its context.

There is a catch that Module 1.4 skipped. In that meeting, each token collects a weighted mix of the others' information, and a mix has no order. "Dog bites man" and "man bites dog" contain the same three tokens and would produce the same mix. Attention alone cannot tell them apart.

The fix is a seat number. Before the meeting starts, each token's vector is stamped with information about its **position** in the sequence. Now "dog in seat 1" differs from "dog in seat 3", and word order becomes visible.

### The room has a size

The meeting room holds a fixed number of seats. That is the **context window**: the maximum number of tokens the model can take in at once. Text beyond it is simply not in the room. And as you will see, a full room is not a room where everyone is heard equally.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Byte-pair encoding, step by step

The dominant tokenization method is **byte-pair encoding (BPE)**. It began as a data-compression technique and was adapted for language models by Rico Sennrich, Barry Haddow, and Alexandra Birch in a 2015 paper on translating rare words. The training procedure is short.

1. Start with a small base vocabulary: every individual character (or, in GPT-style models, every one of the 256 possible byte values). Split every word in the training text into these base symbols.
2. Count every adjacent pair of symbols across the whole text.
3. Take the most frequent pair and merge it into a single new symbol. Add that symbol to the vocabulary and record the merge as a rule.
4. Repeat from step 2 until the vocabulary reaches the size you want.

The ordered list of merge rules *is* the tokenizer. To tokenize new text, split it into base symbols and apply the rules in the order they were learned.

A worked example. Take a tiny corpus of four words with these frequencies: `low` 5 times, `lower` 2 times, `newest` 6 times, `widest` 3 times. Each word gets an end-of-word marker, written here as `_`, so the tokenizer can tell "est" at the end of a word from "est" in the middle of one.

```text
 start:   l o w _  (5)    l o w e r _  (2)    n e w e s t _  (6)    w i d e s t _  (3)

 pair counts:   (e,s)=9   (s,t)=9   (t,_)=9   (w,e)=8   (l,o)=7   (o,w)=7  ...

 merge 1:  e + s    -> es       n e w es t _      w i d es t _
 merge 2:  es + t   -> est      n e w est _       w i d est _
 merge 3:  est + _  -> est_     n e w est_        w i d est_
 merge 4:  l + o    -> lo       lo w _            lo w e r _
 merge 5:  lo + w   -> low      low _             low e r _
```

After five merges the vocabulary has learned the ending `est_` and the stem `low`, because those sequences were frequent. (When several pairs tie for most frequent, an implementation needs a fixed rule to pick one. This example takes the alphabetically first pair.)

Now tokenize a word the corpus never contained: "lowest". Split it into characters and replay the five merges in order. The result is two tokens, `low` and `est_`. The tokenizer has never seen the word and still represents it compactly from meaningful parts. That is the whole point of sub-word tokenization: a fixed vocabulary of modest size, typically tens of thousands to a couple of hundred thousand tokens, that can represent any input.

**Consequences worth memorising.**

- The number of tokens is not the number of words. For ordinary English prose a common rule of thumb is about four characters, or three quarters of a word, per token.
- Other languages, code, numbers, and unusual strings usually cost more tokens per word than English does. Published ratios vary widely by tokenizer and by how they were measured, so measure your own text. Avoid relying on a quoted figure.
- Leading spaces, capitalisation, and punctuation change the tokenization. " hello", "hello", and "Hello" may be three different tokens.
- Different models use different tokenizers. A token count from one is not valid for another.
- Tokens are built on bytes, not on characters as people perceive them. The English word "hello" is 5 characters and 5 bytes in the standard UTF-8 encoding. The Hindi greeting नमस्ते is 6 Unicode code points and 18 bytes.

**Cost of training BPE.** Each merge requires counting pairs across the corpus. For a corpus of $N$ symbols and $M$ merges, the straightforward algorithm takes time proportional to $N \times M$. Production tokenizers use cleverer bookkeeping, but the simple version is what you will write in the lab, and it is instant on small data.

### Embeddings and the geometry of meaning

The embedding table is a matrix with one row per vocabulary token. If the vocabulary has $V$ tokens and each embedding has $d$ numbers, the table holds $V \times d$ parameters. With $V = 100{,}000$ and $d = 4{,}096$ that is about 410 million parameters, before a single transformer layer.

To compare two embeddings $a$ and $b$ we need a measure of closeness. The standard one is **cosine similarity**, the cosine of the angle between the vectors:

$$
\cos(a, b) = \frac{a \cdot b}{\lVert a \rVert \, \lVert b \rVert} = \frac{\sum_{i=1}^{d} a_i b_i}{\sqrt{\sum_{i=1}^{d} a_i^{2}} \; \sqrt{\sum_{i=1}^{d} b_i^{2}}}
$$

It ranges from $-1$ (pointing in opposite directions) through $0$ (unrelated, at right angles) to $1$ (pointing the same way). Its key property is that it ignores length and compares direction only. If you double every number in a vector, its cosine similarity with everything else is unchanged. This matters because the length of an embedding often reflects incidental things such as how frequent a word is, while its direction carries the meaning.

The idea that such vectors could be learned efficiently from raw text became famous with **word2vec**, published by Tomas Mikolov and colleagues at Google in 2013. They trained a small network on a simple task, predicting a word from its neighbours, and found that the resulting vectors captured relationships as consistent directions. The celebrated example:

$$
\text{vec}(\text{king}) - \text{vec}(\text{man}) + \text{vec}(\text{woman}) \approx \text{vec}(\text{queen})
$$

Two refinements to that picture matter today.

- **Static versus contextual.** word2vec assigns one fixed vector per word, so "bank" has a single vector for both of its meanings. In a transformer the embedding table is only the starting point. After the attention layers, each token has a **contextual** vector that depends on the whole sentence.
- **Embeddings of whole texts.** Embedding models produce a single vector for an entire sentence or document. Comparing those vectors by cosine similarity is how semantic search works: the query and each document are embedded, and the documents whose vectors point most nearly in the query's direction are returned. Unit 8 builds on this.

**Cost of search.** Comparing a query against $n$ stored vectors of dimension $d$ by brute force takes time proportional to $n \times d$. That is fine for thousands of documents. For millions, vector databases use approximate methods, covered in Unit 8.

### Position: giving attention a sense of order

The original transformer added a fixed pattern of sines and cosines to each embedding. For a token at position $pos$ and embedding dimension index $i$, with embedding size $d$:

$$
PE(pos,\, 2i) = \sin\!\left(\frac{pos}{10000^{\,2i/d}}\right)
\qquad
PE(pos,\, 2i+1) = \cos\!\left(\frac{pos}{10000^{\,2i/d}}\right)
$$

Each pair of dimensions is a wave with a different wavelength, from very short to very long. Together they give every position a unique fingerprint, much as the hands of a clock, each turning at a different rate, identify a unique time.

Most recent models use a different scheme, **rotary position embedding (RoPE)**, introduced in 2021. Instead of adding a pattern to the embedding, it rotates the query and key vectors inside attention by an angle proportional to their position. The effect is that the attention score between two tokens depends on how far apart they are, which is usually what matters in language. You do not need the mathematics. You need the conclusion: position information is injected deliberately, and without it the model would treat a sentence as an unordered bag of tokens.

### The context window and what really happens inside it

```text
 +----------------------------- context window ------------------------------+
 | system instructions | earlier conversation | documents | question | reply |
 +---------------------------------------------------------------------------+
   strong recall                weaker recall in the middle       strong recall
```

A model can attend to every token in its window, and "can" is doing a lot of work in that sentence. In 2023 Nelson Liu and colleagues at Stanford published "Lost in the Middle", which tested models on finding one relevant document among many. Accuracy followed a **U-shape**: highest when the relevant document was at the beginning or the end of the context, and markedly lower when it sat in the middle. Performance also fell as the context grew longer, even for models built for long contexts. Those were 2023 models and the exact numbers do not carry over to current ones. The pattern has proved persistent.

A 2025 study by the retrieval company Chroma, titled "Context Rot", tested eighteen models and reported the same direction of effect: reliability declines as input length grows, even on simple tasks, and declines faster when the context contains distracting material that resembles the answer.

The practical lesson is that the context window is a capacity limit. It is not a promise of quality. More context is not automatically better, and where you place important material matters.

## 3. Production-Grade Implementation & Annotated Walkthrough

Both halves of this chapter fit in a short standard-library program. First, a complete BPE trainer and encoder.

```python
from collections import Counter

END = "_"                                   # end-of-word marker

def to_symbols(word):
    return tuple(word) + (END,)

def count_pairs(words):
    """Count adjacent symbol pairs, weighted by how often each word occurs."""
    pairs = Counter()
    for symbols, count in words.items():
        for left, right in zip(symbols, symbols[1:]):
            pairs[(left, right)] += count
    return pairs

def merge_pair(words, pair):
    """Rewrite every word, fusing each occurrence of `pair` into one symbol."""
    merged = {}
    for symbols, count in words.items():
        out, i = [], 0
        while i < len(symbols):
            if i + 1 < len(symbols) and (symbols[i], symbols[i + 1]) == pair:
                out.append(symbols[i] + symbols[i + 1])
                i += 2
            else:
                out.append(symbols[i])
                i += 1
        merged[tuple(out)] = merged.get(tuple(out), 0) + count
    return merged

def learn_bpe(word_counts, num_merges):
    words = {to_symbols(word): count for word, count in word_counts.items()}
    merges = []
    for _ in range(num_merges):
        pairs = count_pairs(words)
        if not pairs:
            break
        best = min(pairs, key=lambda pair: (-pairs[pair], pair))   # most frequent; ties alphabetical
        merges.append(best)
        words = merge_pair(words, best)
    return merges

def encode(word, merges):
    """Tokenize a new word by replaying the learned merges in order."""
    words = {to_symbols(word): 1}
    for pair in merges:
        words = merge_pair(words, pair)
    return list(next(iter(words)))

corpus = {"low": 5, "lower": 2, "newest": 6, "widest": 3}
merges = learn_bpe(corpus, 5)
print(merges)
for word in ("lowest", "newer", "xylophone"):
    print(f"{word:>10} -> {encode(word, merges)}")
```

Commentary:

- **`words` maps a tuple of symbols to a count.** Storing each distinct word once with its frequency, and not every occurrence, is what makes training fast. Real corpora contain billions of words and only a few million distinct ones.
- **`count_pairs` weights by frequency.** A pair inside a word that occurs 6 times counts 6 times. This is why the merges favour pieces of common words.
- **`merge_pair` scans left to right and skips ahead by two after a merge.** That prevents overlapping merges. In the symbols `a a a` with the pair `(a, a)`, the result is `aa a`, never a double-counted `aa aa`.
- **The tie-break in `learn_bpe` is explicit.** `min` over `(-count, pair)` selects the highest count and, among equals, the alphabetically first pair. Without a fixed rule, two runs could learn different tokenizers from the same data, which would be a serious bug in a system where the tokenizer must match the model exactly.
- **`encode` replays merges in learned order.** Order matters: merge 2 (`es` + `t`) can only apply after merge 1 has created `es`.
- **The three test words show the three behaviours.** "lowest" becomes `low` and `est_`, two meaningful pieces. "newer" keeps several single letters because its pieces were not frequent enough to be merged in only five steps. "xylophone" falls back almost entirely to single characters, with only `lo` matching a learned merge, a reminder that merges are applied wherever the symbols occur whether or not the piece is meaningful there. Nothing is ever unrepresentable.

Second, embeddings and search, with hand-made four-number vectors whose dimensions mean royalty, masculine, feminine, and animal. Real embeddings have thousands of dimensions with no human-readable labels, but the arithmetic is identical.

```python
import math

VECTORS = {
    "king":     [0.9, 0.8, 0.1, 0.0],
    "queen":    [0.9, 0.1, 0.8, 0.0],
    "man":      [0.1, 0.9, 0.1, 0.0],
    "woman":    [0.1, 0.1, 0.9, 0.0],
    "prince":   [0.7, 0.8, 0.1, 0.0],
    "princess": [0.7, 0.1, 0.8, 0.0],
    "lion":     [0.3, 0.5, 0.1, 0.9],
    "cat":      [0.0, 0.3, 0.3, 0.9],
}

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def nearest_to_vector(target, vectors, exclude=(), k=3):
    scored = [(cosine(target, vec), word) for word, vec in vectors.items() if word not in exclude]
    scored.sort(key=lambda item: (-item[0], item[1]))
    return [(word, round(score, 3)) for score, word in scored[:k]]

print(nearest_to_vector(VECTORS["cat"], VECTORS, exclude=("cat",)))

analogy = [k - m + w for k, m, w in zip(VECTORS["king"], VECTORS["man"], VECTORS["woman"])]
print(nearest_to_vector(analogy, VECTORS, exclude=("king", "man", "woman")))

doubled = [2 * x for x in VECTORS["queen"]]
print(round(cosine(VECTORS["queen"], doubled), 6))
```

- **The zero-vector guard prevents a division by zero.** An all-zero vector has no direction, so similarity is undefined. Returning 0.0 is the conventional safe choice.
- **Sorting by `(-score, word)` gives a deterministic order.** Ties are broken alphabetically, so results are reproducible.
- **The first query returns "lion" as the nearest neighbour of "cat".** No rule says cats and lions are related. Their vectors simply point in similar directions.
- **The analogy lands on "queen", with "princess" a very close second.** Look at the scores when you run it: the two are almost tied. The famous demonstration is real and also fragile. It works only because the three input words are excluded from the results by convention, and small changes to the vectors can flip the winner.
- **The last line prints 1.0.** Doubling a vector changes its length and leaves its direction alone, so cosine similarity is unaffected. This is the property that makes cosine the default choice.

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Count tokens with the right tokenizer.** Budgets, context limits, and bills are all measured in tokens. Estimating from word count is acceptable for a rough plan in English and can be badly wrong for other languages, code, tables, and data dumps. Use the provider's token-counting tool for the specific model you will call.

**Non-English text and structured data cost more.** A page of text in a language that the tokenizer's training data under-represented can use several times the tokens of the same page in English. JSON, logs, and base64 strings are also token-hungry. Teams routinely discover this when a bill arrives.

**Tokenization explains the classic "dumb" failures.** Counting letters, reversing strings, rhyming, and digit-by-digit arithmetic all require access to characters the model does not directly see. Modern models have improved, often by reasoning step by step or by calling a code tool. When exactness matters, have the model write and run code and avoid asking it to do the operation "in its head".

**Whitespace and casing are part of the prompt.** A trailing space or a change of capitalisation alters the token sequence, and occasionally the output. This matters most when you compare prompts or try to reproduce a result.

**High cosine similarity means "used in similar contexts".** It does not mean "has the same meaning". Antonyms such as "hot" and "cold" appear in nearly identical sentences and therefore sit close together. A semantic search for "increase revenue" can return documents about decreasing revenue. Search results need a second look, by a person or by a re-ranking step.

**The king-and-queen arithmetic is overstated.** In the standard demonstration the three input words are excluded from the candidates. Without that exclusion the nearest vector to the result is frequently one of the inputs. A 2020 paper by Malvina Nissim and colleagues argues that analogy tests are a weak and distorting tool for drawing conclusions about what embeddings contain, including claims about bias. Treat analogies as an illustration of the geometry and never as proof of anything.

**Embeddings from different models are not interchangeable.** Vectors from one embedding model cannot be compared with vectors from another, or even with a different version of the same model. If you change models you must re-embed everything.

**Bigger context is not better context.** Filling a large window with marginally relevant documents can lower answer quality, because the relevant passage competes with distractors and may land in the weakly attended middle. Practitioners working with long contexts report better results from including less, selecting carefully, and placing the most important material and the question near the end.

**Accepting a million tokens is not the same as using them.** A context limit is a hard capacity. Reliability within it degrades gradually and unevenly. Test at the context lengths you will really use.

**Position has edge effects.** Instructions at the very start and the very end of a prompt tend to be followed most reliably. With long documents, a common and effective pattern is to put the documents first and the question last.

**The tokenizer is part of the model.** A model only works with the exact tokenizer it was trained with. Mismatched tokenizer files are a classic cause of nonsense output when running models locally.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Text reaches a model as tokens: sub-word pieces chosen by byte-pair encoding, which builds a vocabulary by repeatedly merging the most frequent adjacent pair of symbols. Each token ID is replaced by an embedding, a vector in a space where direction encodes how the token is used, and cosine similarity measures how alike two directions are. Attention then mixes information between positions to make each vector depend on its context, and because mixing is order-blind, position information must be added explicitly. The context window caps how many tokens can be processed at once, and within it models use material at the beginning and end more reliably than material in the middle. Tokens determine cost and explain character-level failures, embeddings power semantic search, and context is a resource to be curated, not simply filled.

**Question 1.** Using the BPE procedure, explain why a tokenizer trained mostly on English text produces many more tokens for a sentence in a rarely represented language than for an English sentence of the same length, and name one practical consequence.

<details>
<summary>View Answer</summary>

BPE merges the most frequent adjacent pairs in its training text. Sequences that are common in English get merged many times and become single tokens covering whole words. Character sequences from a rarely represented language appeared seldom in training, so few of them were ever merged, and at tokenization time that text stays broken into small pieces, often individual bytes, with several bytes per character for non-Latin scripts. The same amount of meaning therefore takes far more tokens. Practical consequences include higher cost per request, slower responses, and less content fitting in the context window, and budgets based on English word counts will be too low.

</details>

**Question 2.** Two embeddings have a cosine similarity of 0.95. A colleague concludes the two words mean the same thing. What is wrong with that conclusion, and why does cosine similarity ignore vector length?

<details>
<summary>View Answer</summary>

Embeddings are shaped by the contexts in which words appear, so high similarity means the words are used in similar surroundings. Synonyms satisfy that, and so do antonyms, words from the same category, and words that merely co-occur in the same topics. "Hot" and "cold" can score very high. Similarity is evidence of relatedness, not of identical meaning. Cosine similarity divides the dot product by both vectors' lengths, which leaves only the angle between them. Length often reflects incidental factors such as word frequency, while direction carries the relationships that matter, so removing length makes comparisons depend on meaning-related structure alone.

</details>

**Question 3.** You must give a model twelve long documents and ask a question whose answer is in one of them. Based on what this chapter says about position and context length, describe two changes that would improve reliability, and explain why attention needs position information in the first place.

<details>
<summary>View Answer</summary>

First, reduce what goes in: select the few documents most likely to contain the answer, or the relevant passages from them, because reliability falls as context grows and distractors make it worse. Second, control placement: put the most relevant material near the beginning or the end, and put the question after the documents, because models use material at the edges of the context more reliably than material in the middle. Attention needs position information because it computes each token's update as a weighted mix of the other tokens, and a mix does not record order. Without positions stamped on or rotated into the vectors, sentences containing the same tokens in different orders would look identical to the model.

</details>

@@starter
"""
Lab: Build a Tokenizer and a Semantic Search
Standard library only. Complete the TODO in each step, then press "Run & Verify Step".

PART 1 (Steps 1-3): byte-pair encoding. A word is stored as a tuple of symbols ending
with the end-of-word marker END, for example ("l", "o", "w", "_").
PART 2 (Steps 4-5): embeddings. A vector is a list of numbers.
"""
import math
from collections import Counter

END = "_"

CORPUS = {"low": 5, "lower": 2, "newest": 6, "widest": 3}

# Hand-made embeddings. Dimensions: [royalty, masculine, feminine, animal]
VECTORS = {
    "king": [0.9, 0.8, 0.1, 0.0],
    "queen": [0.9, 0.1, 0.8, 0.0],
    "man": [0.1, 0.9, 0.1, 0.0],
    "woman": [0.1, 0.1, 0.9, 0.0],
    "prince": [0.7, 0.8, 0.1, 0.0],
    "princess": [0.7, 0.1, 0.8, 0.0],
    "lion": [0.3, 0.5, 0.1, 0.9],
    "cat": [0.0, 0.3, 0.3, 0.9],
}


def to_symbols(word):
    """'low' -> ('l', 'o', 'w', '_')   (Provided.)"""
    return tuple(word) + (END,)


# ---------------------------------------------------------------- Step 1
def count_pairs(words):
    """Count adjacent symbol pairs.

    words: dict mapping a tuple of symbols to how many times that word occurs.
    Return a Counter mapping (left, right) -> total count, where each pair inside a
    word is counted `count` times.
    """
    pairs = Counter()
    # TODO Step 1: for each (symbols, count), add `count` to pairs[(left, right)]
    #              for every adjacent pair in symbols. Then return pairs.
    return None


# ---------------------------------------------------------------- Step 2
def merge_pair(words, pair):
    """Return a NEW dict in which every occurrence of `pair` is fused into one symbol.

    Scan each word left to right. When symbols[i] and symbols[i+1] equal the pair,
    output symbols[i] + symbols[i+1] and skip ahead by 2; otherwise copy symbols[i].
    Keys of the result are tuples; add up counts if two words become identical.
    """
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def learn_bpe(word_counts, num_merges):
    """Learn up to num_merges merge rules and return them as a list of pairs, in order.

    word_counts: dict such as {"low": 5, "lower": 2}
    Each round: count pairs; stop if there are none; choose the pair with the HIGHEST
    count (ties: the alphabetically smallest pair); record it; apply merge_pair.
    """
    words = {to_symbols(word): count for word, count in word_counts.items()}
    merges = []
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def cosine(a, b):
    """Cosine similarity of two vectors: dot(a, b) / (|a| * |b|).
    Return 0.0 if either vector has zero length."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def nearest(word, vectors, k=3):
    """Return the k words most similar to `word` (excluding the word itself),
    most similar first. Break ties alphabetically."""
    # TODO Step 5: score every OTHER word with cosine(vectors[word], vectors[other]),
    #              sort by (-score, other), and return the first k names.
    return None


if __name__ == "__main__":
    start = {to_symbols(w): c for w, c in CORPUS.items()}
    print("pair counts   :", count_pairs(start))
    print("after merge   :", merge_pair(start, ("e", "s")))
    print("merge rules   :", learn_bpe(CORPUS, 5))
    print("cosine        :", cosine(VECTORS["king"], VECTORS["queen"]))
    print("nearest to cat:", nearest("cat", VECTORS))

@@solution
"""
Lab solution: Build a Tokenizer and a Semantic Search
Standard library only.

PART 1 (Steps 1-3): byte-pair encoding. A word is stored as a tuple of symbols ending
with the end-of-word marker END, for example ("l", "o", "w", "_").
PART 2 (Steps 4-5): embeddings. A vector is a list of numbers.
"""
import math
from collections import Counter

END = "_"

CORPUS = {"low": 5, "lower": 2, "newest": 6, "widest": 3}

# Hand-made embeddings. Dimensions: [royalty, masculine, feminine, animal]
VECTORS = {
    "king": [0.9, 0.8, 0.1, 0.0],
    "queen": [0.9, 0.1, 0.8, 0.0],
    "man": [0.1, 0.9, 0.1, 0.0],
    "woman": [0.1, 0.1, 0.9, 0.0],
    "prince": [0.7, 0.8, 0.1, 0.0],
    "princess": [0.7, 0.1, 0.8, 0.0],
    "lion": [0.3, 0.5, 0.1, 0.9],
    "cat": [0.0, 0.3, 0.3, 0.9],
}


def to_symbols(word):
    """'low' -> ('l', 'o', 'w', '_')"""
    return tuple(word) + (END,)


# ---------------------------------------------------------------- Step 1
def count_pairs(words):
    """Pair counts weighted by word frequency.

    Storing each distinct word once with a count (not every occurrence) is what makes
    BPE training fast on real corpora.
    """
    pairs = Counter()
    for symbols, count in words.items():
        for left, right in zip(symbols, symbols[1:]):
            pairs[(left, right)] += count
    return pairs


# ---------------------------------------------------------------- Step 2
def merge_pair(words, pair):
    """Fuse every occurrence of `pair`.

    Skipping ahead by two after a merge prevents overlapping merges: in ('a','a','a')
    with pair ('a','a') the result is ('aa','a').
    """
    merged = {}
    for symbols, count in words.items():
        out = []
        i = 0
        while i < len(symbols):
            if i + 1 < len(symbols) and (symbols[i], symbols[i + 1]) == pair:
                out.append(symbols[i] + symbols[i + 1])
                i += 2
            else:
                out.append(symbols[i])
                i += 1
        key = tuple(out)
        merged[key] = merged.get(key, 0) + count
    return merged


# ---------------------------------------------------------------- Step 3
def learn_bpe(word_counts, num_merges):
    """The ordered list of merges IS the tokenizer.

    The explicit tie-break makes training deterministic. A tokenizer must match its
    model exactly, so two runs on the same data must never disagree.
    """
    words = {to_symbols(word): count for word, count in word_counts.items()}
    merges = []
    for _ in range(num_merges):
        pairs = count_pairs(words)
        if not pairs:
            break                                            # every word is one symbol
        best = min(pairs, key=lambda pair: (-pairs[pair], pair))
        merges.append(best)
        words = merge_pair(words, best)
    return merges


def encode(word, merges):
    """Tokenize a new word by replaying the learned merges in order."""
    words = {to_symbols(word): 1}
    for pair in merges:
        words = merge_pair(words, pair)
    return list(next(iter(words)))


# ---------------------------------------------------------------- Step 4
def cosine(a, b):
    """Direction-only similarity. An all-zero vector has no direction, so return 0.0."""
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


# ---------------------------------------------------------------- Step 5
def nearest(word, vectors, k=3):
    """Brute-force nearest-neighbour search: the core of semantic search."""
    target = vectors[word]
    scored = [(cosine(target, vec), other) for other, vec in vectors.items() if other != word]
    scored.sort(key=lambda item: (-item[0], item[1]))        # best first; ties alphabetical
    return [other for _, other in scored[:k]]


if __name__ == "__main__":
    merges = learn_bpe(CORPUS, 5)
    print("merge rules:", merges)
    for word in ("lowest", "newer", "xylophone"):
        print(f"{word:>10} -> {encode(word, merges)}")

    print()
    print("cosine(king, queen):", round(cosine(VECTORS["king"], VECTORS["queen"]), 3))
    print("cosine(king, cat)  :", round(cosine(VECTORS["king"], VECTORS["cat"]), 3))
    print("nearest to cat     :", nearest("cat", VECTORS))
    print("nearest to queen   :", nearest("queen", VECTORS))

    analogy = [k - m + w for k, m, w in zip(VECTORS["king"], VECTORS["man"], VECTORS["woman"])]
    ranked = sorted(((round(cosine(analogy, vec), 4), name) for name, vec in VECTORS.items()
                     if name not in ("king", "man", "woman")), reverse=True)
    print("king - man + woman :", ranked[:2])

    for text in ("hello", "नमस्ते"):
        print(f"{text!r}: {len(text)} code points, {len(text.encode('utf-8'))} bytes")

@@step
{
  "stepNumber": 1,
  "title": "Count adjacent pairs",
  "instruction": "Implement count_pairs(words). The argument maps each word, stored as a tuple of symbols, to its frequency. For every word, look at each adjacent pair of symbols and add the word's frequency to that pair's total in the Counter. Return the Counter. This is step 2 of the BPE procedure in Section 2: finding out which neighbouring symbols occur together most often. [MOD-1.9]",
  "hintConceptual": "A pair inside a word that appears 6 times in the corpus has itself appeared 6 times. Weighting by frequency is what makes common endings and stems win.",
  "hintSyntax": "for symbols, count in words.items():\n    for left, right in zip(symbols, symbols[1:]):\n        pairs[(left, right)] += count\nreturn pairs"
}
@@assert
_w = {("l", "o", "w", "_"): 5, ("l", "o", "w", "e", "r", "_"): 2}
_p = count_pairs(_w)
assert _p is not None, "count_pairs must return the Counter"
assert _p[("l", "o")] == 7 and _p[("o", "w")] == 7, "('l','o') and ('o','w') occur in both words: 5 + 2 = 7"
assert _p[("w", "_")] == 5, "('w','_') occurs only in 'low', which appears 5 times"
assert _p[("w", "e")] == 2 and _p[("r", "_")] == 2, "Pairs found only in 'lower' count 2"
assert sum(_p.values()) == 5 * 3 + 2 * 5, "A word of n symbols contributes n-1 pairs, each weighted by its count"
assert count_pairs({("a",): 9}) == Counter(), "A single-symbol word has no pairs"
print("Step 1 passed: you can find the most frequent neighbours.")

@@step
{
  "stepNumber": 2,
  "title": "Merge a pair into one symbol",
  "instruction": "Implement merge_pair(words, pair). Build and return a new dict. For each word, scan its symbols from left to right: when the current symbol and the next one equal the pair, append their concatenation and skip ahead by two; otherwise append the current symbol and move ahead by one. Use the resulting tuple as the key, adding counts together if two words end up identical. This is the merge in step 3 of BPE. [MOD-1.9]",
  "hintConceptual": "You are replacing two neighbouring bricks with one bigger brick, everywhere they occur together. Moving ahead by two after a merge stops one symbol from being used in two merges.",
  "hintSyntax": "merged = {}\nfor symbols, count in words.items():\n    out, i = [], 0\n    while i < len(symbols):\n        if i + 1 < len(symbols) and (symbols[i], symbols[i + 1]) == pair:\n            out.append(symbols[i] + symbols[i + 1])\n            i += 2\n        else:\n            out.append(symbols[i])\n            i += 1\n    key = tuple(out)\n    merged[key] = merged.get(key, 0) + count\nreturn merged"
}
@@assert
_w = {("n", "e", "w", "e", "s", "t", "_"): 6, ("l", "o", "w", "_"): 5}
_m = merge_pair(_w, ("e", "s"))
assert _m == {("n", "e", "w", "es", "t", "_"): 6, ("l", "o", "w", "_"): 5}, f"Merging ('e','s') should fuse only that pair, got {_m}"
assert _w == {("n", "e", "w", "e", "s", "t", "_"): 6, ("l", "o", "w", "_"): 5}, "merge_pair must return a new dict and leave the input unchanged"
assert merge_pair({("a", "a", "a"): 1}, ("a", "a")) == {("aa", "a"): 1}, "Overlapping pairs: ('a','a','a') becomes ('aa','a')"
assert merge_pair({("a", "b", "a", "b"): 2}, ("a", "b")) == {("ab", "ab"): 2}, "Every occurrence in a word must be merged"
assert merge_pair({("x", "y"): 3, ("xy",): 4}, ("x", "y")) == {("xy",): 7}, "Words that become identical must have their counts added"
print("Step 2 passed: two symbols can become one.")

@@step
{
  "stepNumber": 3,
  "title": "Learn the merge rules",
  "instruction": "Implement learn_bpe(word_counts, num_merges). The words dict and the empty merges list are created for you. Repeat up to num_merges times: call count_pairs; if it is empty, stop; choose the pair with the highest count, breaking ties by taking the alphabetically smallest pair; append it to merges; replace words with merge_pair(words, that pair). Return merges. The ordered list you return is the tokenizer: applying it to new text is tokenization. [MOD-1.9]",
  "hintConceptual": "Greedy compression: always glue together whatever occurs most often, then recount, because each merge changes which pairs exist. A fixed tie-break keeps the result identical on every run.",
  "hintSyntax": "for _ in range(num_merges):\n    pairs = count_pairs(words)\n    if not pairs:\n        break\n    best = min(pairs, key=lambda pair: (-pairs[pair], pair))\n    merges.append(best)\n    words = merge_pair(words, best)\nreturn merges"
}
@@assert
_rules = learn_bpe({"low": 5, "lower": 2, "newest": 6, "widest": 3}, 5)
assert _rules == [("e", "s"), ("es", "t"), ("est", "_"), ("l", "o"), ("lo", "w")], f"The first five merges should build 'est_' and then 'low', got {_rules}"
assert learn_bpe({"low": 5, "lower": 2, "newest": 6, "widest": 3}, 2) == [("e", "s"), ("es", "t")], "num_merges must limit how many rules are learned"
assert learn_bpe({"ab": 3}, 10) == [("a", "b"), ("ab", "_")], "Learning must stop when no pairs are left, even if num_merges is larger"
assert learn_bpe({"ba": 1, "ab": 1}, 1) == [("a", "_")], "Ties must go to the alphabetically smallest pair"
assert learn_bpe({}, 3) == [], "An empty corpus yields no merges"
print("Step 3 passed: you trained a tokenizer. Rules ->", _rules)

@@step
{
  "stepNumber": 4,
  "title": "Cosine similarity",
  "instruction": "Implement cosine(a, b). Compute the dot product (the sum of a[i] * b[i]), the length of each vector (the square root of the sum of its squared entries), and return the dot product divided by the product of the two lengths. If either length is zero, return 0.0. This is the formula from Section 2 that measures whether two embeddings point in the same direction. [MOD-1.9]",
  "hintConceptual": "Similarity here means angle, not distance. Dividing by both lengths removes the effect of how long each vector is and leaves only how well their directions agree.",
  "hintSyntax": "dot = sum(x * y for x, y in zip(a, b))\nnorm_a = math.sqrt(sum(x * x for x in a))\nnorm_b = math.sqrt(sum(y * y for y in b))\nif norm_a == 0 or norm_b == 0:\n    return 0.0\nreturn dot / (norm_a * norm_b)"
}
@@assert
assert abs(cosine([1.0, 0.0], [1.0, 0.0]) - 1.0) < 1e-12, "Identical directions give 1.0"
assert abs(cosine([1.0, 0.0], [0.0, 1.0])) < 1e-12, "Perpendicular vectors give 0.0"
assert abs(cosine([1.0, 2.0], [-1.0, -2.0]) + 1.0) < 1e-12, "Opposite directions give -1.0"
assert abs(cosine([3.0, 4.0], [4.0, 3.0]) - 0.96) < 1e-12, "cosine([3,4],[4,3]) = 24 / 25 = 0.96"
assert abs(cosine([1.0, 2.0, 3.0], [10.0, 20.0, 30.0]) - 1.0) < 1e-12, "Scaling a vector must not change its cosine similarity"
assert cosine([0.0, 0.0], [1.0, 2.0]) == 0.0, "A zero vector has no direction: return 0.0, do not divide by zero"
print("Step 4 passed: you can measure whether two meanings point the same way.")

@@step
{
  "stepNumber": 5,
  "title": "Nearest-neighbour search",
  "instruction": "Implement nearest(word, vectors, k). Compute the cosine similarity between vectors[word] and the vector of every other word in the dict, excluding the word itself. Sort the others from most to least similar, breaking ties alphabetically, and return the names of the first k as a list. This brute-force search over embeddings is exactly how semantic search finds related text. [MOD-1.9]",
  "hintConceptual": "Rank everything by how closely its direction matches the query's direction, then keep the top few. The query word would always match itself perfectly, so leave it out.",
  "hintSyntax": "target = vectors[word]\nscored = [(cosine(target, vec), other) for other, vec in vectors.items() if other != word]\nscored.sort(key=lambda item: (-item[0], item[1]))\nreturn [other for _, other in scored[:k]]"
}
@@assert
_v = {
    "king": [0.9, 0.8, 0.1, 0.0], "queen": [0.9, 0.1, 0.8, 0.0], "man": [0.1, 0.9, 0.1, 0.0],
    "woman": [0.1, 0.1, 0.9, 0.0], "prince": [0.7, 0.8, 0.1, 0.0], "princess": [0.7, 0.1, 0.8, 0.0],
    "lion": [0.3, 0.5, 0.1, 0.9], "cat": [0.0, 0.3, 0.3, 0.9],
}
_n = nearest("cat", _v, k=3)
assert isinstance(_n, list) and len(_n) == 3, "nearest must return a list of k names"
assert _n[0] == "lion", f"The nearest neighbour of 'cat' should be 'lion', got {_n}"
assert "cat" not in _n, "The query word itself must be excluded"
assert nearest("king", _v, k=1) == ["prince"], "The nearest neighbour of 'king' should be 'prince'"
assert nearest("queen", _v, k=2) == ["princess", "woman"], f"Expected ['princess', 'woman'] for 'queen', got {nearest('queen', _v, k=2)}"
assert len(nearest("man", _v, k=50)) == 7, "Asking for more neighbours than exist returns all the other words"
assert nearest("a", {"a": [1.0, 0.0], "c": [1.0, 0.0], "b": [1.0, 0.0]}, k=2) == ["b", "c"], "Ties must be broken alphabetically"
print("Step 5 passed: nearest to 'cat' ->", _n)
