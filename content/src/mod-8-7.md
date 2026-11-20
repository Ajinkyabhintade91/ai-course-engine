@@meta
{
  "moduleId": "MOD-8.7",
  "slug": "mod-8-7",
  "unitId": "UNIT-8",
  "unitTitle": "Unit 8: Build Your Own AI Agents",
  "title": "RAG",
  "difficulty": "Intermediate",
  "estimatedMinutes": 100,
  "citations": [
    { "title": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", "source": "arXiv (Lewis et al., 2020)", "url": "https://arxiv.org/abs/2005.11401" },
    { "title": "The Probabilistic Relevance Framework: BM25 and Beyond", "source": "Robertson and Zaragoza (2009)", "url": "https://www.staff.city.ac.uk/~sbrp622/papers/foundations_bm25_review.pdf" },
    { "title": "Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods", "source": "Cormack, Clarke, and Buettcher (SIGIR 2009)", "url": "https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf" },
    { "title": "Introducing Contextual Retrieval", "source": "Anthropic", "url": "https://www.anthropic.com/news/contextual-retrieval" },
    { "title": "Ragas: Automated Evaluation of Retrieval Augmented Generation", "source": "arXiv (Es et al., 2023)", "url": "https://arxiv.org/abs/2309.15217" }
  ],
  "videoLibrary": [
    {
      "id": "VID-8.7-1",
      "title": "Chunking Strategies in RAG: Optimising Data for Advanced AI Responses",
      "creator": "Mervin Praison",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=pIGRwMjhMaQ",
      "timingInstruction": "Watch after the indexing part of Section 2",
      "keyTakeaway": "Fixed-size, sentence-based, and semantic chunking, and how chunk size affects what retrieval finds."
    },
    {
      "id": "VID-8.7-2",
      "title": "Advanced RAG 03 - Hybrid Search BM25 & Ensembles",
      "creator": "Sam Witteveen",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=lYxGYXjfrNI",
      "timingInstruction": "Watch after the hybrid search part of Section 2, before Step 3 of the lab",
      "keyTakeaway": "Combining keyword and vector retrieval so each covers the other's blind spots."
    },
    {
      "id": "VID-8.7-3",
      "title": "RAG Evaluation: Precision, Recall, Faithfulness, RAGAS Explained Clearly",
      "creator": "Logical Lenses",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=7_LTU0LA374",
      "timingInstruction": "Watch after the evaluation part of Section 2, before Steps 4 and 5 of the lab",
      "keyTakeaway": "Measuring retrieval and generation separately, so you know which half of the system to fix."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: BM25, Toy Embeddings, Rank Fusion, Retrieval Metrics, Faithfulness",
    "context": "The tool shop's support agent answers from five help passages, and customers phrase questions in words the passages do not use. You will score passages with BM25, retrieve with a small concept-based embedding, fuse both rankings with reciprocal rank fusion, measure retrieval with recall, precision, and mean reciprocal rank, and check how much of an answer is supported by the retrieved context.",
    "language": "python"
  }
}

@@reading
# RAG

**Retrieval-augmented generation**, RAG, answers questions by first retrieving relevant passages from a body of documents and then having a language model answer from them. Module 7.18 built a support assistant on this idea with simple keyword retrieval and strict citation checks. This chapter goes deeper into the part that decides whether RAG works: retrieval. It covers how documents are prepared, how keyword search and embedding search each work and fail, how to combine them, how reranking helps, and, most importantly, how to measure retrieval and answer quality separately so you know which to fix.

The central fact of RAG is simple: **a model cannot use a passage it was never given.** If retrieval misses the right passage, the best model in the world will answer badly or, worse, answer confidently from its general knowledge. Most RAG failures are retrieval failures.

## 1. First-Principles Mental Model & Intuition

### A reference librarian

A good reference librarian does two jobs. First, finding: from a question asked in the reader's own words, locate the few passages in the whole library that bear on it. Second, answering: read those passages and explain them, quoting where needed, and saying "the books don't cover that" when they do not. A librarian who answers without looking is a guesser. A librarian who finds the wrong books gives well-written wrong answers.

```text
   INDEX (once, and when documents change)
   documents -> clean -> chunk -> [ keyword index (BM25) ] + [ embeddings -> vector index ]

   ANSWER (every question)
   question --> keyword search ----\
            --> vector search -----+--> fuse rankings --> rerank --> top k chunks
                                                                         |
                                                       prompt: answer ONLY from these, cite them
                                                                         |
                                                                   ANSWER + citations
                                                                         |
                                                       checks: cited? supported? (Module 7.18)
```

### Two halves, two kinds of failure

| Half | Fails when | Symptom |
|---|---|---|
| Retrieval | The right passage is not in the top results | "I don't know", or a confident answer from general knowledge |
| Generation | The passage is there but misused | Wrong details, invented additions, ignored passages |

Measuring the halves separately is what turns "the bot is bad" into a fixable problem.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Indexing: chunks

Documents are cleaned, removing navigation, boilerplate, and duplicates, and split into **chunks**, as Module 7.18 did at sentence boundaries. Chunk size is a trade-off. Small chunks retrieve precisely but lose context: "It must be unused" means nothing without "returns". Large chunks keep context but dilute relevance, since a chunk about five topics matches all of them weakly. Common remedies are chunks of a few hundred words with some overlap, chunking along headings, and attaching a short description of where the chunk comes from. Anthropic's "Contextual Retrieval" write-up does exactly that: before indexing, each chunk is prefixed with a brief context generated from the whole document, which, combined with keyword search, reduced failed retrievals by 49 percent in their tests, and by 67 percent when reranking was added.

### Keyword retrieval: BM25

The standard keyword scoring function is **BM25**, from the probabilistic relevance framework described by Robertson and Zaragoza. For a query with terms $q$, a document $D$ of length $|D|$, average document length $\overline{|D|}$, and term frequency $f(q, D)$:

$$\text{BM25}(D, Q) = \sum_{q \in Q} \text{IDF}(q) \cdot \frac{f(q, D)\,(k_1 + 1)}{f(q, D) + k_1\left(1 - b + b\,\frac{|D|}{\overline{|D|}}\right)}$$

with

$$\text{IDF}(q) = \ln\!\left(1 + \frac{N - n(q) + 0.5}{n(q) + 0.5}\right)$$

where $N$ is the number of documents and $n(q)$ the number containing $q$. Two refinements over the simple weighting in Module 7.18 matter. Repeated terms add less and less, controlled by $k_1$, typically about 1.2 to 2; a word appearing ten times is not ten times as relevant. And long documents are penalised, controlled by $b$, typically 0.75, because they contain more words by chance.

BM25 is fast, transparent, and excellent at exact matches: product codes, names, error messages. Its weakness is **vocabulary mismatch**: "how long until my money comes back" shares no meaningful word with "refunds reach your card within 5 to 7 working days", so it scores zero.

### Vector retrieval: embeddings

An **embedding** model turns text into a vector of numbers such that texts with similar meanings get nearby vectors. Retrieval then compares the question's vector with every chunk's vector, usually by **cosine similarity**, $\cos\theta = \frac{a \cdot b}{\|a\|\|b\|}$, which Module 8.8 covers with vector databases. Because similarity is about meaning, "money back" lands near "refund", solving vocabulary mismatch.

Embeddings have their own weakness: they blur exact details. A question about "SAW-3" may retrieve passages about saws in general, and an error code may match semantically similar but wrong codes. The lab uses a tiny concept-based "embedding", mapping words to concepts such as refund, shipping, and time, to show the behaviour without a real model; real embeddings learn such relationships from data across thousands of dimensions.

### Hybrid search and reciprocal rank fusion

Keyword and vector search fail in different places, so production systems usually run both and combine the results: **hybrid search**. Their scores are on different scales, so adding them is meaningless. **Reciprocal rank fusion**, from Cormack, Clarke, and Buettcher's 2009 paper, combines **ranks** instead:

$$\text{RRF}(d) = \sum_{r \in R} \frac{1}{k + \text{rank}_r(d)}$$

summed over the rankings $R$ in which document $d$ appears, with a constant $k$, commonly 60. A document ranked highly by either method gets a good score, and one ranked highly by both gets the best. The constant damps the difference between first and second place, so that one method's top result does not swamp the other's.

### Reranking

The first retrieval stage is tuned for speed and recall: get the right passage somewhere in the top 20 or 50. A **reranker**, typically a model that reads the question and each candidate together, then reorders the candidates more accurately, and only the best few go into the prompt. Rerankers are slower per passage than vector comparison, which is why they run only on the shortlist.

### Augmenting and generating

The prompt contains the question, the top chunks with identifiers, and instructions to answer only from them, cite them, and say when they do not answer the question: the pattern of Module 7.18. Two practical choices matter. **How many chunks**: too few and the answer may be missing; too many and the context fills with noise, the "lost in the middle" effect from Module 8.3. And **order**: put the most relevant chunks first or last, where models attend most reliably.

### Evaluating retrieval

Retrieval is measured against a **labelled query set**: real questions, each with the passages a person judged relevant. For the top $k$ results of each query:

| Metric | Definition | Question it answers |
|---|---|---|
| Recall@k | Relevant passages in the top $k$, divided by all relevant passages | Did we find what was needed? |
| Precision@k | Relevant passages in the top $k$, divided by $k$ | How much noise came with it? |
| MRR | Mean over queries of $1/\text{rank}$ of the first relevant passage | How high is the first good result? |

For RAG, recall@k matters most: a passage that is not retrieved cannot be used, while some noise is tolerable. MRR shows whether good passages come near the top, which matters when only a few fit in the prompt.

### Evaluating generation: faithfulness

**Faithfulness** asks whether every claim in the answer is supported by the retrieved context. Ragas, a framework for automated RAG evaluation by Es and colleagues, defines it with a language model that breaks the answer into statements and judges each against the context, and pairs it with measures of answer relevance and context relevance. A cheap first approximation, used in the lab, checks for each sentence how many of its meaningful words appear in the context; a sentence whose words are mostly absent is probably unsupported. It is crude, since it cannot see negation or paraphrase, but it reliably catches invented additions, such as a goodwill bonus no passage mentions.

### Complexity

BM25 over $N$ chunks is linear in the chunks for a query, or near-constant per term with an inverted index. Exact vector search is linear in chunks times dimensions; approximate indexes, Module 8.8, make it sublinear. RRF is linear in the total length of the rankings. Metrics are linear in the queries times $k$.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, BM25.

```python
import math
import re
from collections import Counter

WORD = re.compile(r"[a-z0-9]+")
STOP = {"the", "a", "an", "is", "are", "to", "of", "and", "in", "for", "on", "my", "i", "you", "your", "it", "can", "do",
        "be", "with", "what", "how", "if", "we", "our", "will", "get", "from", "after", "within", "by", "at"}

def tokens(text):
    return [w for w in WORD.findall(text.lower()) if w not in STOP]

DOCS = {"returns": "You can return unused items within 30 days of delivery for a full refund.",
        "refund_time": "Refunds reach your card within 5 to 7 working days after we receive the returned item.",
        "delivery": "Standard delivery takes 3 to 5 working days. Orders over 50 pounds ship free.",
        "warranty": "Power tools carry a 2 year warranty against manufacturing faults.",
        "express": "Express delivery arrives the next working day if you order before 2pm."}

def bm25(query, docs, k1=1.5, b=0.75):
    words_by_doc = {doc: tokens(text) for doc, text in docs.items()}
    n = len(docs)
    average = sum(len(words) for words in words_by_doc.values()) / n
    document_frequency = Counter(word for words in words_by_doc.values() for word in set(words))
    scores = {}
    for doc, words in words_by_doc.items():
        frequency, score = Counter(words), 0.0
        for term in set(tokens(query)):
            if frequency[term]:
                idf = math.log(1 + (n - document_frequency[term] + 0.5) / (document_frequency[term] + 0.5))
                score += idf * frequency[term] * (k1 + 1) / (frequency[term] + k1 * (1 - b + b * len(words) / average))
        scores[doc] = round(score, 3)
    return sorted(((score, doc) for doc, score in scores.items() if score > 0), key=lambda pair: (-pair[0], pair[1]))

print(bm25("how long until my money comes back", DOCS))
print(bm25("refund working days", DOCS))
```

- **Each term's contribution combines its rarity with a saturating frequency and a length penalty.** The formula is the one in Section 2, with $k_1 = 1.5$ and $b = 0.75$.
- **"How long until my money comes back" scores nothing.** None of its meaningful words appear in any passage, the vocabulary mismatch problem.
- **"Refund working days" ranks `returns` first.** It contains "refund" exactly; `refund_time` says "Refunds", a different string, so it scores only on "working" and "days". Exact matching misses word forms as well as synonyms.

Next, a toy embedding and cosine similarity.

```python
CONCEPTS = {"refund": "refund", "refunds": "refund", "money": "refund", "back": "refund", "reimbursement": "refund",
            "return": "return", "returned": "return", "returns": "return", "send": "return",
            "delivery": "shipping", "ship": "shipping", "shipping": "shipping", "postage": "shipping", "arrives": "shipping",
            "days": "time", "day": "time", "long": "time", "until": "time", "quickly": "time", "next": "time",
            "warranty": "warranty", "guarantee": "warranty", "faults": "warranty", "broken": "warranty",
            "free": "free", "cost": "price", "costs": "price", "price": "price", "pounds": "price"}

def embed(text):
    counts = Counter(CONCEPTS[word] for word in tokens(text) if word in CONCEPTS)
    norm = math.sqrt(sum(value * value for value in counts.values()))
    return {concept: value / norm for concept, value in counts.items()} if norm else {}

def cosine(a, b):
    return sum(value * b.get(concept, 0) for concept, value in a.items())

def vector_search(query, docs):
    q = embed(query)
    results = [(round(cosine(q, embed(text)), 3), doc) for doc, text in docs.items()]
    return sorted([r for r in results if r[0] > 0], key=lambda pair: (-pair[0], pair[1]))

print(vector_search("how long until my money comes back", DOCS))
print(vector_search("is postage free", DOCS))
```

- **Words map to concepts, and a text becomes a normalised count of its concepts.** "Money" and "back" both mean refund; "long" and "until" mean time.
- **Vectors are normalised to length 1, so cosine similarity is a dot product.**
- **The money question now retrieves `refund_time` first, 0.816.** It shares the refund and time concepts, without sharing a single word.
- **"Is postage free" finds `delivery`.** Postage and delivery are the same concept.
- **Real embeddings learn these relationships from data.** The hand-written concept table only stands in for that, so the lab runs without a model.

Then, fusing rankings.

```python
def rrf(rankings, k=60):
    scores = Counter()
    for ranking in rankings:
        for rank, doc in enumerate(ranking, start=1):
            scores[doc] += 1 / (k + rank)
    fused = [doc for doc, _ in sorted(scores.items(), key=lambda pair: (-pair[1], pair[0]))]
    return fused, {doc: round(score, 5) for doc, score in scores.items()}

lexical = [doc for _, doc in bm25("refund after return", DOCS)]
semantic = [doc for _, doc in vector_search("refund after return", DOCS)]
print(lexical, semantic)
print(rrf([lexical, semantic]))
```

- **Only ranks are used, never raw scores.** BM25 scores and cosine similarities live on different scales.
- **Keyword search finds only `returns`.** "Refunds" and "returned" do not match the query's exact words.
- **Vector search ranks `refund_time` first and `returns` second.**
- **Fusion puts `returns` first, 1/61 plus 1/62, and keeps `refund_time`, 1/61.** Each method contributes what the other missed; a reranker would then decide the final order.

Then, measuring retrieval.

```python
def retrieval_metrics(results, gold, k=3):
    recalls, precisions, reciprocal_ranks = [], [], []
    for query, ranked in results.items():
        relevant = gold[query]
        hits = [doc for doc in ranked[:k] if doc in relevant]
        recalls.append(len(hits) / len(relevant))
        precisions.append(len(hits) / k)
        reciprocal_ranks.append(next((1 / position for position, doc in enumerate(ranked, start=1) if doc in relevant), 0.0))
    n = len(results)
    return {"recall@k": round(sum(recalls) / n, 3), "precision@k": round(sum(precisions) / n, 3), "mrr": round(sum(reciprocal_ranks) / n, 3)}

RESULTS = {"q1": ["refund_time", "returns", "delivery"], "q2": ["express", "delivery", "returns"],
           "q3": ["delivery", "returns", "express"], "q4": ["returns", "delivery", "express"]}
GOLD = {"q1": {"refund_time"}, "q2": {"delivery", "express"}, "q3": {"warranty"}, "q4": {"returns", "refund_time"}}
print(retrieval_metrics(RESULTS, GOLD))
```

- **Each query's top 3 results are compared with the passages judged relevant.**
- **q1 and q2 find everything; q3 finds nothing; q4 finds half.** Recall@3 averages to 0.625.
- **Precision@3 is 0.333.** Most slots hold passages that were not needed, which is acceptable when recall matters more.
- **MRR is 0.75.** Three queries have a relevant passage first; q3 has none, contributing 0.
- **q3 is the one to investigate.** A warranty question retrieving delivery passages means a missing synonym, a badly chunked warranty page, or an embedding that misses the concept.

Finally, faithfulness.

```python
def faithfulness(answer, context, threshold=0.6):
    context_words = set(tokens(context))
    judged = []
    for sentence in [s for s in re.split(r"(?<=[.!?])\s+", answer.strip()) if s]:
        words = set(tokens(sentence))
        share = len(words & context_words) / len(words) if words else 1.0
        judged.append((sentence, round(share, 2), share >= threshold))
    supported = sum(1 for _, _, ok in judged if ok)
    return (round(supported / len(judged), 3) if judged else 1.0), judged

CONTEXT = DOCS["refund_time"] + " " + DOCS["returns"]
print(faithfulness("Refunds reach your card within 5 to 7 working days. You can return unused items within 30 days.", CONTEXT))
print(faithfulness("Refunds reach your card within 5 to 7 working days. We also pay a 10 pound goodwill bonus on every return.", CONTEXT)[0])
```

- **Each sentence is scored by the share of its meaningful words found in the context.**
- **Both sentences of the first answer are fully supported, so faithfulness is 1.0.**
- **The goodwill bonus sentence shares only "return" with the context, 0.12.** It is unsupported, and the answer's faithfulness drops to 0.5.
- **This is a proxy.** It cannot see negation, "refunds do not reach your card", or paraphrase; Ragas-style checks use a model to judge each statement, and Module 7.18's number check adds another layer.

**Complexity.** `bm25` is linear in the total words of the documents for each query. `vector_search` is linear in documents times concepts. `rrf` is linear in the rankings' total length. `retrieval_metrics` is linear in queries times ranked results. `faithfulness` is linear in the answer and context.

### A RAG configuration sheet

```text
SOURCES        help centre (180 articles), returns policy, delivery FAQ; owner per article
CHUNKING       by heading, 200 to 400 words, 1 sentence overlap, contextual prefix per chunk
RETRIEVAL      BM25 top 20 + vector top 20 -> RRF (k = 60) -> rerank -> top 5 into the prompt
PROMPT         answer only from passages, cite [id], say NO_ANSWER if not covered
CHECKS         citations present and retrieved; numbers in sources (Module 7.18); faithfulness >= 0.9
EVAL SET       120 real questions with relevant passages labelled; recall@20, MRR, faithfulness
TARGETS        recall@20 >= 0.95; MRR >= 0.7; faithfulness >= 0.9 on the eval set
```

### Diagnosing a bad answer

| Observation | Likely cause | Fix |
|---|---|---|
| Right passage not in top 20 | Retrieval: vocabulary mismatch, bad chunks | Hybrid search, contextual chunks, synonyms |
| Right passage at rank 15, not in prompt | Ranking | Reranking, fusion |
| Passage in prompt, answer ignores it | Generation | Prompt, passage order, fewer passages |
| Answer adds unsupported claims | Generation | Stricter prompt, faithfulness and citation checks |
| Passage itself is wrong or outdated | Content | Article ownership and review |

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Blaming the model for retrieval failures.** Most bad RAG answers come from missing passages. Measure recall first.

**Vector search alone.** Embeddings blur product codes and error numbers. Add keyword search.

**Keyword search alone.** Customers do not use your documents' words. Add embeddings or synonyms.

**Adding scores from different retrievers.** BM25 scores and cosine similarities are not comparable. Fuse ranks.

**Chunks without context.** "It must be unused" retrieved alone is useless. Prefix chunks with where they come from.

**Too many chunks in the prompt.** Twenty passages bury the right one. Rerank and keep the best few.

**No evaluation set.** Without labelled queries, changes are guesses. Build one from real questions.

**Judging only the final answer.** A wrong answer could be either half. Measure retrieval and faithfulness separately.

**Stale indexes.** Updated articles that are not re-indexed keep old answers alive. Re-index on change.

**Duplicate content.** Five near-identical passages crowd out everything else. Deduplicate before indexing.

**Trusting a single faithfulness score.** Word overlap misses negation; model judges can err. Combine checks.

**Ignoring access control.** Retrieval must only return passages the user may see. Filter by permissions before generation.

## 5. Active Recall Check & Synthesis Summary

**Summary.** Retrieval-augmented generation retrieves relevant chunks of a document collection and has the model answer only from them; since a model cannot use a passage it was not given, most failures are retrieval failures. Documents are cleaned and chunked with a size trade-off between precision and context, and adding a short contextual prefix to each chunk, with keyword search, cut failed retrievals by 49 percent, and by 67 percent with reranking, in Anthropic's tests. BM25 scores keyword matches by rarity, a saturating term frequency, and a length penalty, and is excellent for exact terms but blind to synonyms and word forms. Embedding search compares meaning by cosine similarity, solving vocabulary mismatch but blurring exact details. Hybrid search runs both and combines them by reciprocal rank fusion, summing $1/(k + \text{rank})$ with $k$ commonly 60, and a reranker reorders the shortlist before the top few enter the prompt. Retrieval is evaluated against labelled queries with recall@k, the most important for RAG, precision@k, and mean reciprocal rank; generation is evaluated by faithfulness, the share of answer statements supported by the context, as in Ragas, approximated here by word overlap. Diagnosing failures by half, then fixing retrieval, ranking, generation, or content, turns a vague "the bot is wrong" into specific work.

**Question 1.** A customer asks "What's the guarantee on a cordless drill?" and the help centre has "Power tools carry a 2 year warranty against manufacturing faults." Explain what BM25 and the concept embedding return, why, and what the fused result would be. What does this suggest about building the system?

<details>
<summary>View Answer</summary>

After removing filler words, the query's words are "guarantee", "cordless", and "drill", plus a stray "s" from "What's". None appear in the warranty passage, which says "power", "tools", "carry", "year", "warranty", "manufacturing", "faults", so BM25 scores it zero, and in fact no passage, since none mention those words: keyword retrieval returns nothing. The concept embedding maps "guarantee" to the warranty concept; "cordless" and "drill" are not in the concept table, so the query vector is entirely the warranty concept. The warranty passage's words "warranty" and "faults" map to the same concept, so its cosine similarity is 1.0 and it is retrieved first, with every other passage at zero. Fusion with an empty keyword ranking simply returns the vector ranking, so the warranty passage comes first. The lesson is that each retriever covers the other's blind spots: here meaning-based retrieval saved the query, while for a question about "SAW-3" keyword retrieval would be the one to find it. The system should run both and fuse them, and the content side can help too: the warranty article could mention "guarantee", "drill", and "cordless tools" explicitly, and a contextual prefix such as "Warranty policy for power tools, including drills and saws" would let both retrievers find it.

</details>

**Question 2.** A RAG system's evaluation over 50 queries gives recall@20 of 0.96, MRR of 0.41, and faithfulness of 0.93, and only the top 3 passages go into the prompt. Users report frequent "I don't know" answers to questions the help centre covers. Interpret the numbers and propose the most effective fix.

<details>
<summary>View Answer</summary>

Recall@20 of 0.96 means the right passage is almost always somewhere in the top 20: retrieval is finding it. MRR of 0.41 is what you get when many queries have their first relevant passage well below the top: reciprocal ranks of 1, 1/5, and 1/10, for example, average to about 0.43. Because only the top 3 passages reach the prompt, many queries have the right passage at rank 4 to 20, retrieved but never shown to the model, which then correctly says it does not know. Faithfulness of 0.93 shows the generation step behaves well with what it receives. The problem is ranking, not recall or generation. The most effective fix is a reranker over the top 20, which reads the question with each candidate and reorders them, so the relevant passage moves into the top 3; fusing keyword and vector rankings with RRF, if not already done, also tends to lift relevant passages. Simply passing more passages, say the top 10, is a cheaper alternative, but it adds noise and cost, while reranking fixes the order. After the change, MRR should rise and the "I don't know" rate fall, which the evaluation set will confirm.

</details>

**Question 3.** Using the lab's `faithfulness` function with context about refunds and returns, score the answer "Refunds reach your card within 5 to 7 working days. Refunds are never issued for returned items." and explain the result. What does this reveal about the method, and how would you strengthen the faithfulness check?

<details>
<summary>View Answer</summary>

The first sentence's meaningful words, "refunds", "reach", "card", "5", "7", "working", "days", all appear in the context, so its share is 1.0 and it is supported. The second sentence's meaningful words are "refunds", "never", "issued", "returned", and "items". "Refunds", "returned", and "items" appear in the context, while "never" and "issued" do not, so its share is 3 of 5, 0.6, which meets the 0.6 threshold: it is marked supported, and the answer scores 1.0. But the sentence contradicts the context, which says returned items get a full refund. The method measures word overlap, not meaning: it cannot detect negation, contradiction, or a changed relationship between the same words. Strengthening it means adding a model-based judge, as Ragas does, which breaks the answer into statements and asks, for each, whether the context entails it, contradicts it, or does not address it; requiring citations per sentence and checking numbers against the cited passage, as in Module 7.18; and spot-checking a sample by hand. The word-overlap proxy remains useful as a fast first filter for invented additions, but it should never be the only faithfulness check.

</details>

@@starter
"""
Lab: BM25, Toy Embeddings, Rank Fusion, Retrieval Metrics, Faithfulness
Standard library only. No network calls or models. Complete the TODO in each step, then press "Run & Verify Step".
"""
import math
import re
from collections import Counter

WORD = re.compile(r"[a-z0-9]+")
STOP = {"the", "a", "an", "is", "are", "to", "of", "and", "in", "for", "on", "my", "i", "you", "your", "it", "can", "do",
        "be", "with", "what", "how", "if", "we", "our", "will", "get", "from", "after", "within", "by", "at"}
DOCS = {"returns": "You can return unused items within 30 days of delivery for a full refund.",
        "refund_time": "Refunds reach your card within 5 to 7 working days after we receive the returned item.",
        "delivery": "Standard delivery takes 3 to 5 working days. Orders over 50 pounds ship free.",
        "warranty": "Power tools carry a 2 year warranty against manufacturing faults.",
        "express": "Express delivery arrives the next working day if you order before 2pm."}
CONCEPTS = {"refund": "refund", "refunds": "refund", "money": "refund", "back": "refund", "reimbursement": "refund",
            "return": "return", "returned": "return", "returns": "return", "send": "return",
            "delivery": "shipping", "ship": "shipping", "shipping": "shipping", "postage": "shipping", "arrives": "shipping",
            "days": "time", "day": "time", "long": "time", "until": "time", "quickly": "time", "next": "time",
            "warranty": "warranty", "guarantee": "warranty", "faults": "warranty", "broken": "warranty",
            "free": "free", "cost": "price", "costs": "price", "price": "price", "pounds": "price"}


def tokens(text):
    """Given: lower-case words without filler words."""
    return [w for w in WORD.findall(text.lower()) if w not in STOP]


# ---------------------------------------------------------------- Step 1
def bm25(query, docs, k1=1.5, b=0.75):
    """For each doc: sum over distinct query tokens with frequency f > 0 of
    idf * f * (k1 + 1) / (f + k1 * (1 - b + b * len / average_len)), idf = ln(1 + (N - df + 0.5) / (df + 0.5)).
    Round to 3 places. Return [(score, doc)] for scores > 0, sorted by score descending then doc name."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def embed(text):
    """Count CONCEPTS of the tokens that have one; divide each count by the vector's length; {} if none."""
    # TODO Step 2
    return None


def vector_search(query, docs):
    """Cosine (dot product of normalised vectors) between embed(query) and embed(each doc), rounded to 3 places.
    Return [(score, doc)] for scores > 0, sorted by score descending then doc name."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def rrf(rankings, k=60):
    """score(doc) = sum over rankings of 1 / (k + rank), ranks from 1. Return (docs sorted by score descending then
    name, {doc: round(score, 5)})."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def retrieval_metrics(results, gold, k=3):
    """Per query: recall = relevant hits in ranked[:k] / len(gold); precision = hits / k; reciprocal rank = 1 / position
    of the first relevant doc in the full ranking, or 0. Return the three means, each rounded to 3 places, under
    "recall@k", "precision@k", "mrr"."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def faithfulness(answer, context, threshold=0.6):
    """Split the answer into non-empty sentences (re.split(r"(?<=[.!?])\\s+", answer)). For each, share = |sentence tokens
    in context tokens| / |sentence tokens| (1.0 if none). Judge (sentence, round(share, 2), share >= threshold).
    Return (round(supported / sentences, 3) or 1.0 if no sentences, judgements)."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("bm25  :", bm25("refund working days", DOCS))
    print("vector:", vector_search("is postage free", DOCS))

@@solution
"""
Lab solution: BM25, Toy Embeddings, Rank Fusion, Retrieval Metrics, Faithfulness
Standard library only. No network calls or models.
"""
import math
import re
from collections import Counter

WORD = re.compile(r"[a-z0-9]+")
STOP = {"the", "a", "an", "is", "are", "to", "of", "and", "in", "for", "on", "my", "i", "you", "your", "it", "can", "do",
        "be", "with", "what", "how", "if", "we", "our", "will", "get", "from", "after", "within", "by", "at"}
DOCS = {"returns": "You can return unused items within 30 days of delivery for a full refund.",
        "refund_time": "Refunds reach your card within 5 to 7 working days after we receive the returned item.",
        "delivery": "Standard delivery takes 3 to 5 working days. Orders over 50 pounds ship free.",
        "warranty": "Power tools carry a 2 year warranty against manufacturing faults.",
        "express": "Express delivery arrives the next working day if you order before 2pm."}
CONCEPTS = {"refund": "refund", "refunds": "refund", "money": "refund", "back": "refund", "reimbursement": "refund",
            "return": "return", "returned": "return", "returns": "return", "send": "return",
            "delivery": "shipping", "ship": "shipping", "shipping": "shipping", "postage": "shipping", "arrives": "shipping",
            "days": "time", "day": "time", "long": "time", "until": "time", "quickly": "time", "next": "time",
            "warranty": "warranty", "guarantee": "warranty", "faults": "warranty", "broken": "warranty",
            "free": "free", "cost": "price", "costs": "price", "price": "price", "pounds": "price"}


def tokens(text):
    """Given: lower-case words without filler words."""
    return [w for w in WORD.findall(text.lower()) if w not in STOP]


# ---------------------------------------------------------------- Step 1
def bm25(query, docs, k1=1.5, b=0.75):
    """Rarity, saturating frequency, and a length penalty: excellent for exact terms, blind to synonyms."""
    words_by_doc = {doc: tokens(text) for doc, text in docs.items()}
    n = len(docs)
    average = sum(len(words) for words in words_by_doc.values()) / n
    document_frequency = Counter(word for words in words_by_doc.values() for word in set(words))
    scores = {}
    for doc, words in words_by_doc.items():
        frequency, score = Counter(words), 0.0
        for term in set(tokens(query)):
            if frequency[term]:
                idf = math.log(1 + (n - document_frequency[term] + 0.5) / (document_frequency[term] + 0.5))
                score += idf * frequency[term] * (k1 + 1) / (frequency[term] + k1 * (1 - b + b * len(words) / average))
        scores[doc] = round(score, 3)
    return sorted(((score, doc) for doc, score in scores.items() if score > 0), key=lambda pair: (-pair[0], pair[1]))


# ---------------------------------------------------------------- Step 2
def embed(text):
    """A toy stand-in for an embedding model: normalised counts of concepts."""
    counts = Counter(CONCEPTS[word] for word in tokens(text) if word in CONCEPTS)
    norm = math.sqrt(sum(value * value for value in counts.values()))
    return {concept: value / norm for concept, value in counts.items()} if norm else {}


def vector_search(query, docs):
    """Meaning, not spelling: 'money back' finds 'refunds'."""
    q = embed(query)
    results = [(round(sum(value * embed(text).get(concept, 0) for concept, value in q.items()), 3), doc) for doc, text in docs.items()]
    return sorted([r for r in results if r[0] > 0], key=lambda pair: (-pair[0], pair[1]))


# ---------------------------------------------------------------- Step 3
def rrf(rankings, k=60):
    """Fuse ranks, never raw scores from different retrievers."""
    scores = Counter()
    for ranking in rankings:
        for rank, doc in enumerate(ranking, start=1):
            scores[doc] += 1 / (k + rank)
    fused = [doc for doc, _ in sorted(scores.items(), key=lambda pair: (-pair[1], pair[0]))]
    return fused, {doc: round(score, 5) for doc, score in scores.items()}


# ---------------------------------------------------------------- Step 4
def retrieval_metrics(results, gold, k=3):
    """Recall first: a passage that is not retrieved cannot be used."""
    recalls, precisions, reciprocal_ranks = [], [], []
    for query, ranked in results.items():
        relevant = gold[query]
        hits = [doc for doc in ranked[:k] if doc in relevant]
        recalls.append(len(hits) / len(relevant))
        precisions.append(len(hits) / k)
        reciprocal_ranks.append(next((1 / position for position, doc in enumerate(ranked, start=1) if doc in relevant), 0.0))
    n = len(results)
    return {"recall@k": round(sum(recalls) / n, 3), "precision@k": round(sum(precisions) / n, 3), "mrr": round(sum(reciprocal_ranks) / n, 3)}


# ---------------------------------------------------------------- Step 5
def faithfulness(answer, context, threshold=0.6):
    """A fast proxy: catches invented additions, blind to negation; pair it with a model judge."""
    context_words = set(tokens(context))
    judged = []
    for sentence in [s for s in re.split(r"(?<=[.!?])\s+", answer.strip()) if s]:
        words = set(tokens(sentence))
        share = len(words & context_words) / len(words) if words else 1.0
        judged.append((sentence, round(share, 2), share >= threshold))
    supported = sum(1 for _, _, ok in judged if ok)
    return (round(supported / len(judged), 3) if judged else 1.0), judged


if __name__ == "__main__":
    print(bm25("What's the guarantee on a cordless drill?", DOCS), vector_search("What's the guarantee on a cordless drill?", DOCS))
    print(rrf([[d for _, d in bm25("refund after return", DOCS)], [d for _, d in vector_search("refund after return", DOCS)]]))
    context = DOCS["refund_time"] + " " + DOCS["returns"]
    print(faithfulness("Refunds reach your card within 5 to 7 working days. Refunds are never issued for returned items.", context))

@@step
{
  "stepNumber": 1,
  "title": "Score passages with BM25",
  "instruction": "Implement bm25(query, docs, k1, b). Tokenise every document, compute the average length and how many documents contain each word. For each document, add, for every distinct query token it contains, the IDF times the frequency times (k1 + 1), divided by the frequency plus k1 times (1 - b + b times the document length over the average), with IDF = ln(1 + (N - df + 0.5) / (df + 0.5)). Round to 3 places and return score and name pairs above zero, sorted by score from highest and then by name. Score two queries. This is BM25 from Section 2. [MOD-8.7]",
  "hintConceptual": "Score each book by the rare words it shares with the question, giving extra credit for repetition but less and less each time, and docking long books a little because they mention everything.",
  "hintSyntax": "words_by_doc = {doc: tokens(text) for doc, text in docs.items()}\nn = len(docs)\naverage = sum(len(words) for words in words_by_doc.values()) / n\ndocument_frequency = Counter(word for words in words_by_doc.values() for word in set(words))\nscores = {}\nfor doc, words in words_by_doc.items():\n    frequency, score = Counter(words), 0.0\n    for term in set(tokens(query)):\n        if frequency[term]:\n            idf = math.log(1 + (n - document_frequency[term] + 0.5) / (document_frequency[term] + 0.5))\n            score += idf * frequency[term] * (k1 + 1) / (frequency[term] + k1 * (1 - b + b * len(words) / average))\n    scores[doc] = round(score, 3)\nreturn sorted(((score, doc) for doc, score in scores.items() if score > 0), key=lambda pair: (-pair[0], pair[1]))"
}
@@assert
assert bm25("how long until my money comes back", DOCS) == [], f"Vocabulary mismatch scores nothing, got {bm25('how long until my money comes back', DOCS)}"
_r = bm25("refund working days", DOCS)
assert _r is not None and [d for _, d in _r] == ["returns", "refund_time", "delivery", "express"] and _r[0][0] == 2.099, f"Exact words rank returns first, got {_r}"
assert bm25("warranty", DOCS)[0][1] == "warranty" and len(bm25("warranty", DOCS)) == 1, "A rare exact term finds its passage alone"
_long = {"a": "saw saw saw saw saw", "b": "saw"}
assert bm25("saw", _long)[0][0] < 5 * bm25("saw", {"b": "saw", "c": "hammer"})[0][0], "Repeated terms saturate"
print("Step 1 passed: exact words score, and the money question scores nothing.")

@@step
{
  "stepNumber": 2,
  "title": "Retrieve by meaning with a toy embedding",
  "instruction": "Implement embed(text): count the CONCEPTS of the tokens that have one, divide each count by the square root of the sum of squared counts, and return an empty dict if there are none. Then implement vector_search(query, docs): the dot product of the query's embedding with each document's, rounded to 3 places, returning score and name pairs above zero sorted by score and then name. Search for the money question and the postage question. This is vector retrieval from Section 2. [MOD-8.7]",
  "hintConceptual": "Translate every sentence into a shopping list of ideas, refund, time, shipping, and compare lists rather than spellings, so 'money back' and 'refunds' end up on the same shelf.",
  "hintSyntax": "counts = Counter(CONCEPTS[word] for word in tokens(text) if word in CONCEPTS)\nnorm = math.sqrt(sum(value * value for value in counts.values()))\nreturn {concept: value / norm for concept, value in counts.items()} if norm else {}\n\n# vector_search\nq = embed(query)\nresults = [(round(sum(value * embed(text).get(concept, 0) for concept, value in q.items()), 3), doc) for doc, text in docs.items()]\nreturn sorted([r for r in results if r[0] > 0], key=lambda pair: (-pair[0], pair[1]))"
}
@@assert
_e = embed("refunds within 5 working days")
assert _e is not None and set(_e) == {"refund", "time"} and abs(sum(v * v for v in _e.values()) - 1.0) < 1e-9, f"Normalised concept counts, got {_e}"
assert embed("hammer nails") == {}, "No concepts, empty vector"
assert vector_search("how long until my money comes back", DOCS) == [(0.816, "refund_time"), (0.707, "returns"), (0.5, "express"), (0.267, "delivery")], f"Meaning finds refund_time, got {vector_search('how long until my money comes back', DOCS)}"
assert vector_search("is postage free", DOCS) == [(0.802, "delivery"), (0.5, "express"), (0.354, "returns")], "Postage means delivery"
assert vector_search("What's the guarantee on a cordless drill?", DOCS) == [(1.0, "warranty")], "The first recall question"
print("Step 2 passed: 'money back' retrieves refund_time without sharing a word.")

@@step
{
  "stepNumber": 3,
  "title": "Fuse rankings with RRF",
  "instruction": "Implement rrf(rankings, k). For every ranking, add 1 / (k + rank) to each document's score, with ranks starting at 1. Return the documents sorted by score from highest and then by name, and a dict of each document's score rounded to 5 places. Fuse a keyword ranking and a vector ranking. This is reciprocal rank fusion from Section 2. [MOD-8.7]",
  "hintConceptual": "Two judges each hand in a ranked list. Instead of comparing their marks, which use different scales, give each place a small number of points that shrinks with rank, and add them up.",
  "hintSyntax": "scores = Counter()\nfor ranking in rankings:\n    for rank, doc in enumerate(ranking, start=1):\n        scores[doc] += 1 / (k + rank)\nfused = [doc for doc, _ in sorted(scores.items(), key=lambda pair: (-pair[1], pair[0]))]\nreturn fused, {doc: round(score, 5) for doc, score in scores.items()}"
}
@@assert
assert rrf([["returns"], ["refund_time", "returns"]]) == (["returns", "refund_time"], {"returns": 0.03252, "refund_time": 0.01639}), f"Fusion rewards agreement, got {rrf([['returns'], ['refund_time', 'returns']])}"
_fused, _scores = rrf([["a", "b", "c"], ["c", "b", "a"]])
assert _fused == ["a", "c", "b"] and _scores["a"] == _scores["c"] and _scores["b"] == round(2 / 62, 5), "First and last places beat two middle places; ties break by name"
assert rrf([["x", "y"]], k=1)[1] == {"x": 0.5, "y": 0.33333} and rrf([]) == ([], {}), "k is an argument; no rankings, nothing fused"
print("Step 3 passed: returns, found by both retrievers, comes first.")

@@step
{
  "stepNumber": 4,
  "title": "Measure retrieval",
  "instruction": "Implement retrieval_metrics(results, gold, k). For each query, count the relevant documents among the top k: recall is that count divided by the number of relevant documents, precision is that count divided by k, and the reciprocal rank is one over the position of the first relevant document in the whole ranking, or 0. Return the means of the three, each rounded to 3 places, under 'recall@k', 'precision@k', and 'mrr'. Measure four queries. This is evaluating retrieval from Section 2. [MOD-8.7]",
  "hintConceptual": "Mark the librarian's shortlists: did each list contain the books that were needed, how much of the list was padding, and how near the top was the first useful book?",
  "hintSyntax": "recalls, precisions, reciprocal_ranks = [], [], []\nfor query, ranked in results.items():\n    relevant = gold[query]\n    hits = [doc for doc in ranked[:k] if doc in relevant]\n    recalls.append(len(hits) / len(relevant))\n    precisions.append(len(hits) / k)\n    reciprocal_ranks.append(next((1 / position for position, doc in enumerate(ranked, start=1) if doc in relevant), 0.0))\nn = len(results)\nreturn {\"recall@k\": round(sum(recalls) / n, 3), \"precision@k\": round(sum(precisions) / n, 3), \"mrr\": round(sum(reciprocal_ranks) / n, 3)}"
}
@@assert
_results = {"q1": ["refund_time", "returns", "delivery"], "q2": ["express", "delivery", "returns"], "q3": ["delivery", "returns", "express"], "q4": ["returns", "delivery", "express"]}
_gold = {"q1": {"refund_time"}, "q2": {"delivery", "express"}, "q3": {"warranty"}, "q4": {"returns", "refund_time"}}
assert retrieval_metrics(_results, _gold) == {"recall@k": 0.625, "precision@k": 0.333, "mrr": 0.75}, f"The four queries, got {retrieval_metrics(_results, _gold)}"
assert retrieval_metrics({"q": ["a", "b", "c", "d"]}, {"q": {"d"}}) == {"recall@k": 0.0, "precision@k": 0.0, "mrr": 0.25}, "A relevant passage below the cut-off still counts for MRR"
assert retrieval_metrics({"q": ["a", "b", "c", "d"]}, {"q": {"d"}}, k=4)["recall@k"] == 1.0, "k is an argument"
print("Step 4 passed: recall@3 of 0.625, and the warranty query is the one to fix.")

@@step
{
  "stepNumber": 5,
  "title": "Check faithfulness",
  "instruction": "Implement faithfulness(answer, context, threshold). Split the answer into non-empty sentences. For each, the share is the number of its distinct tokens found among the context's tokens divided by its number of distinct tokens, or 1.0 if it has none. Record the sentence, the share rounded to 2 places, and whether the share meets the threshold. Return the supported fraction rounded to 3 places, or 1.0 if there are no sentences, and the judgements. Score a faithful answer and one with an invented bonus. This is faithfulness from Section 2. [MOD-8.7]",
  "hintConceptual": "Check each sentence of the essay against the source pages: a sentence whose key words mostly appear in the sources is probably drawn from them; one whose words are mostly new was probably made up.",
  "hintSyntax": "context_words = set(tokens(context))\njudged = []\nfor sentence in [s for s in re.split(r\"(?<=[.!?])\\s+\", answer.strip()) if s]:\n    words = set(tokens(sentence))\n    share = len(words & context_words) / len(words) if words else 1.0\n    judged.append((sentence, round(share, 2), share >= threshold))\nsupported = sum(1 for _, _, ok in judged if ok)\nreturn (round(supported / len(judged), 3) if judged else 1.0), judged"
}
@@assert
_ctx = DOCS["refund_time"] + " " + DOCS["returns"]
_good = faithfulness("Refunds reach your card within 5 to 7 working days. You can return unused items within 30 days.", _ctx)
assert _good is not None and _good[0] == 1.0 and [j[1] for j in _good[1]] == [1.0, 1.0], f"A faithful answer, got {_good}"
_bad = faithfulness("Refunds reach your card within 5 to 7 working days. We also pay a 10 pound goodwill bonus on every return.", _ctx)
assert _bad[0] == 0.5 and _bad[1][1][1] == 0.12 and _bad[1][1][2] is False, "The invented bonus is unsupported"
_neg = faithfulness("Refunds reach your card within 5 to 7 working days. Refunds are never issued for returned items.", _ctx)
assert _neg[0] == 1.0 and _neg[1][1][1] == 0.6, "The third recall question: negation slips past word overlap"
assert faithfulness("", _ctx) == (1.0, []), "No sentences, nothing unsupported"
print("Step 5 passed: the invented goodwill bonus halves faithfulness, and the negation shows the proxy's limit.")
