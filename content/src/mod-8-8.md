@@meta
{
  "moduleId": "MOD-8.8",
  "slug": "mod-8-8",
  "unitId": "UNIT-8",
  "unitTitle": "Unit 8: Build Your Own AI Agents",
  "title": "Vector Databases",
  "difficulty": "Intermediate",
  "estimatedMinutes": 100,
  "citations": [
    { "title": "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs", "source": "arXiv (Malkov and Yashunin, 2016)", "url": "https://arxiv.org/abs/1603.09320" },
    { "title": "The Faiss library", "source": "arXiv (Douze et al., 2024)", "url": "https://arxiv.org/abs/2401.08281" },
    { "title": "Faiss indexes", "source": "Official Docs (Faiss wiki)", "url": "https://github.com/facebookresearch/faiss/wiki/Faiss-indexes" },
    { "title": "pgvector: open-source vector similarity search for Postgres", "source": "Official Docs (GitHub)", "url": "https://github.com/pgvector/pgvector" },
    { "title": "Filtering", "source": "Official Docs (Qdrant)", "url": "https://qdrant.tech/documentation/concepts/filtering/" },
    { "title": "ANN-Benchmarks", "source": "Benchmark site", "url": "https://ann-benchmarks.com/" }
  ],
  "videoLibrary": [
    {
      "id": "VID-8.8-1",
      "title": "Cosine vs Dot Product vs Euclidean: Which Distance Metric?",
      "creator": "Actian for Developers",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=zhs1IfdWye8",
      "timingInstruction": "Watch after the similarity metrics part of Section 2, before Step 1 of the lab",
      "keyTakeaway": "When the three metrics agree, when they disagree, and why normalisation decides it."
    },
    {
      "id": "VID-8.8-2",
      "title": "Vector Database Search - Hierarchical Navigable Small Worlds (HNSW) Explained",
      "creator": "DataMListic",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=77QH0Y2PYKg",
      "timingInstruction": "Watch after the HNSW part of Section 2, before Step 3 of the lab",
      "keyTakeaway": "How layered graphs let a search jump close to the answer quickly and then refine locally."
    },
    {
      "id": "VID-8.8-3",
      "title": "Vector Search & Approximate Nearest Neighbors (ANN) | FAISS (HNSW & IVF)",
      "creator": "Mustafa Zaki",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=chz74Mtd1AA",
      "timingInstruction": "Watch after the IVF part of Section 2, before Step 2 of the lab",
      "keyTakeaway": "Clustering vectors into lists and probing only a few of them, with the recall trade-off that brings."
    },
    {
      "id": "VID-8.8-4",
      "title": "Pre-Filtering vs Post-Filtering: Why Your Vector Database is Slow!",
      "creator": "Enterprise AI Recovery | Kris Kassem",
      "platform": "YouTube",
      "tier": "Free",
      "url": "https://www.youtube.com/watch?v=QaWJAwEVdYo",
      "timingInstruction": "Watch after the metadata filtering part of Section 2, before Step 4 of the lab",
      "keyTakeaway": "Why filtering after the search can return too few results, and what filtering during the search costs."
    }
  ],
  "lab": {
    "labTitle": "Hands-On Lab: Similarity Metrics, IVF, Graph Search, Filtering, Sizing",
    "context": "The tool shop is moving its product search from a brute-force scan to a vector index, and the team needs to understand what the index trades away before choosing one. You will compare similarity metrics, build and probe an IVF index, run a graph search like HNSW's bottom layer, compare pre-filtering with post-filtering, and measure recall and memory.",
    "language": "python"
  }
}

@@reading
# Vector Databases

Module 8.7 retrieved passages by comparing a question's embedding with every passage's embedding. With five passages that is instant. With ten million product descriptions, each a vector of 1,536 numbers, a single query would need over fifteen billion multiplications. A **vector database** stores embeddings and answers "which stored vectors are nearest to this one?" quickly, by building an **index** that checks only a small fraction of the collection, accepting that it will occasionally miss a true nearest neighbour.

This chapter explains the similarity measures, the two dominant index families, IVF and HNSW, how filtering by metadata interacts with them, and how to choose a store. The lab uses two-dimensional points so that every step can be checked by eye; real embeddings have hundreds or thousands of dimensions, but the mechanics are the same.

## 1. First-Principles Mental Model & Intuition

### Finding the nearest café

Suppose you want the café nearest to you in a large city. You could measure the distance to every café in the city: correct, but slow. Or you could look only in your own neighbourhood, which is fast and usually right, but wrong when you live near a neighbourhood border and the nearest café is across the street in the next district. Or you could ask a well-connected local, who points you to someone closer to your target, who points you closer again, until no one knows anyone nearer. That works well unless the chain of acquaintances leads you into a cul-de-sac.

These are exactly the three approaches of this chapter: **exact search** (measure everything), **IVF** (search only the nearest neighbourhoods), and **graph search, as in HNSW** (follow links that get closer). The last two are **approximate nearest neighbour**, ANN, search: they are fast because they skip most of the data, and they are occasionally wrong for the same reason.

```text
                         VECTOR DATABASE
   write path:  text -> embedding model -> vector + metadata (id, category, in_stock, tenant)
                                              |
                                  +-----------+-----------+
                                  |                       |
                            vector index             metadata index
                          (IVF lists / HNSW graph)   (category, tenant, dates)
                                  |                       |
   read path:  query vector ------+---- filter ----------+
                                  |
                       top k ids + distances -> fetch metadata -> application (RAG, search, recommendations)
```

### The trade-off triangle

Every index trades three things: **recall**, the fraction of true nearest neighbours it returns; **speed**, queries per second or latency; and **memory**. Index parameters move you around that triangle, and the right point depends on the application: a RAG system that reranks the top 50 tolerates lower recall at the first stage than a deduplication job that must find every near-copy.

## 2. Core Theory, Mathematical Foundations & Architecture Internals

### Similarity metrics

For vectors $a$ and $b$ with $d$ dimensions, the three common measures are:

$$\text{dot}(a, b) = \sum_{i=1}^{d} a_i b_i \qquad \cos(a, b) = \frac{a \cdot b}{\|a\|\,\|b\|} \qquad \text{L2}(a, b) = \sqrt{\sum_{i=1}^{d} (a_i - b_i)^2}$$

Dot product and cosine are **similarities**, higher meaning closer; Euclidean, L2, is a **distance**, lower meaning closer. Dot product depends on length: a long vector scores highly against many queries simply because it is long. Cosine ignores length and measures only direction. Euclidean measures straight-line separation.

The key relationship holds for **unit vectors**, $\|a\| = \|b\| = 1$:

$$\|a - b\|^2 = \|a\|^2 + \|b\|^2 - 2\,a \cdot b = 2 - 2\cos(a, b)$$

So for normalised vectors, dot product equals cosine, and Euclidean distance is a decreasing function of cosine: **all three rank results identically.** Many embedding models return normalised vectors, which is why the choice often does not matter in practice; when vectors are not normalised, the choice matters a great deal. The rule is simple: use the metric the embedding model was trained with, which its documentation states, and if in doubt, normalise and use cosine.

### Exact search and why it does not scale

Exact, or **flat**, search compares the query with all $n$ vectors: $O(n \cdot d)$ per query. At $n = 10^7$ and $d = 1536$, that is about $1.5 \times 10^{10}$ multiply-adds. Optimised libraries running on a GPU can do this surprisingly fast, and for collections up to a few hundred thousand vectors flat search is often the right answer: perfect recall, no index to build or tune. Beyond that, indexes earn their keep.

### IVF: inverted file index

**IVF** clusters the vectors, typically with k-means, into $n_{\text{list}}$ groups, each represented by its **centroid**, and stores for each centroid an inverted list of the vectors assigned to it. To search, compare the query with the centroids, pick the $n_{\text{probe}}$ nearest, and scan only those lists:

```text
   build:  vectors --k-means--> centroids c0 c1 c2 ; each vector -> list of its nearest centroid
           c0: [p0 p1 p2 p3 p10 p11]   c1: [p4 p5 p6 p7]   c2: [p8 p9]

   search (nprobe = 1):  query --nearest centroid--> c1 --scan 4 vectors--> top k
```

The cost is $n_{\text{list}}$ centroid comparisons plus about $n \cdot n_{\text{probe}} / n_{\text{list}}$ vector comparisons, a large saving when the lists are balanced. The failure mode is the **border problem**: a query near the edge of a cluster may have its true neighbours in an adjacent list that was not probed. Raising $n_{\text{probe}}$ recovers recall at the cost of speed. The Faiss documentation describes this as the main tuning knob of IVF indexes, and a common rule of thumb sets the number of lists in proportion to the square root of the collection size. IVF is often combined with **product quantization**, which compresses each vector into a few bytes, trading some accuracy for a large memory saving.

### HNSW: hierarchical navigable small world graphs

**HNSW**, introduced by Malkov and Yashunin, builds a graph in which each vector is a node linked to some of its near neighbours, at most $M$ per node. Search is **greedy routing**: start at an entry point, repeatedly move to whichever neighbour is closest to the query, and stop when no neighbour is closer. Pure greedy routing can stop at a **local minimum**, a node closer than all its neighbours but not the true nearest. HNSW counters this two ways.

First, the search keeps a **beam** of the best `ef` candidates found so far, rather than one, and keeps expanding the closest unexpanded candidate until none could improve the beam. A larger `ef` explores more and escapes more local minima, at the cost of more distance computations.

Second, it is **hierarchical**: nodes are assigned to layers with exponentially decreasing probability, so the top layer has a few nodes with long-range links. Search starts at the top, greedily descends to the node nearest the query, and uses it as the entry point for the next layer down, finishing on the bottom layer, which contains every node. The upper layers act like a motorway network that brings the search into the right region before local streets take over.

```text
   layer 2:   p0 ----------------------------- p9                    (few nodes, long links)
               |                                |
   layer 1:   p0 ------ p11 ------ p5 -------- p9                    (more nodes)
               |         |          |           |
   layer 0:   p0-p1-p3-p11-p10-p4-p5-p6-p9-p8 (every node; one path shown) <- beam search with ef
```

Search cost grows roughly with the logarithm of the collection size, which is why HNSW is the default index in many vector stores. Its costs are memory, since every node stores up to $M$ links on each of its layers and up to $2M$ on the bottom layer in the original paper's settings, slower inserts than IVF, and deletes that are awkward, often implemented by marking nodes deleted and rebuilding later.

### Measuring an index: recall@k

Index quality is measured against exact search on a sample of real queries:

$$\text{recall@}k = \frac{|\text{ANN top } k \;\cap\; \text{exact top } k|}{k}$$

This is a different measure from Module 8.7's retrieval recall: that compared retrieved passages with passages a person judged relevant; this compares the index's answer with the exact answer. A RAG system's quality is limited by both. The ANN-Benchmarks project publishes recall versus queries-per-second curves for many libraries and datasets, and it is the standard way to compare them; always confirm on your own data.

### Metadata filtering

Real queries combine similarity with conditions: "saws, in stock, visible to this customer's tenant". There are three ways to combine them.

| Strategy | How | Strength | Failure mode |
|---|---|---|---|
| Post-filtering | ANN search for top $c$, then drop rows that fail the filter | Simple, fast | A selective filter leaves fewer than $k$ results, or none |
| Pre-filtering | Filter first, then search only matching vectors | Always returns $k$ if they exist | Brute force over the filtered set; slow when the filter is broad |
| Filtered search | Apply the filter during graph or list traversal | Best of both when supported | Very selective filters can disconnect the graph; stores handle this differently |

Post-filtering is the trap. If 2 percent of products are garden tools and you ask for the 10 nearest garden tools by retrieving the 10 nearest products and filtering, you will usually get none. Fetching more candidates helps but cannot guarantee a result. Stores such as Qdrant build indexes on metadata fields, called payload indexes in its documentation, and use them to filter during the search and to switch strategy depending on how selective the filter is. **Access control filters are not optional**: in a multi-tenant system, a tenant filter must be applied inside the query, never by the application afterwards.

### Memory

A float32 embedding of dimension $d$ takes $4d$ bytes. Ten million 1,536-dimension vectors take $10^7 \times 1536 \times 4 \approx 61.4$ GB before any index overhead. HNSW adds links: with about 32 links per node on the bottom layer at 4 bytes each, roughly 1.3 GB more. Scalar quantization to one byte per value cuts the vectors to about 15.4 GB; product quantization cuts further. Memory, not compute, is usually what decides the hardware bill.

### Choosing a store

| Option | Fits when |
|---|---|
| A library such as Faiss in your own process | Static or batch-updated collections, full control, you handle persistence |
| pgvector, an extension for PostgreSQL | You already run Postgres and want vectors next to relational data with transactions; supports exact search and HNSW and IVFFlat indexes |
| A dedicated vector database (Qdrant, Weaviate, Milvus, Pinecone, and others) | Large collections, heavy filtering, multi-tenancy, managed scaling |
| Search engines with vector support (Elasticsearch, OpenSearch) | You need keyword and vector hybrid search in one system |

Questions to ask, in order: how many vectors and how fast do they change; what filters and tenancy are needed; do you need hybrid keyword search, Module 8.7; what are the latency and recall targets; who operates it. At the time of writing (November 2026) every option above supports HNSW-style indexes; the differences that matter are filtering, operations, and cost.

### Complexity

Flat search is $O(n d)$ per query. IVF is $O(n_{\text{list}} d + \frac{n \, n_{\text{probe}}}{n_{\text{list}}} d)$. HNSW search is roughly $O(\text{ef} \cdot M \cdot d \cdot \log n)$ in practice, with $O(n M)$ extra memory. Pre-filtering is $O(n_f d)$ for $n_f$ matching vectors.

## 3. Production-Grade Implementation & Annotated Walkthrough

First, the three metrics.

```python
import heapq
import math

def score(a, b, metric):
    dot = sum(x * y for x, y in zip(a, b))
    if metric == "dot":
        return round(dot, 4)
    if metric == "cosine":
        na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(y * y for y in b))
        return round(dot / (na * nb), 4) if na and nb else 0.0
    if metric == "euclidean":
        return round(math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b))), 4)
    raise ValueError(f"unknown metric {metric}")

def rank(query, vectors, metric, k=3):
    scored = [(score(query, v, metric), name) for name, v in vectors.items()]
    if metric == "euclidean":
        scored.sort(key=lambda pair: (pair[0], pair[1]))
    else:
        scored.sort(key=lambda pair: (-pair[0], pair[1]))
    return [name for _, name in scored[:k]], scored[:k]

VECTORS = {"short": (1.0, 0.1), "long": (3.0, 2.0), "side": (0.2, 1.0)}
for metric in ("dot", "cosine", "euclidean"):
    print(metric, rank((1.0, 0.0), VECTORS, metric))
```

- **Distances sort ascending, similarities descending.** Mixing these up is a classic bug that returns the farthest results.
- **Dot product ranks `long` first, 3.0.** It points about 34 degrees off the query, but its length inflates the score.
- **Cosine ranks `short` first, 0.995.** It points almost exactly along the query.
- **Euclidean also ranks `short` first, 0.1 away.** It is close in position as well as direction.
- **Normalise all three vectors and every metric gives the same order.** That is the unit-vector identity from Section 2, and the lab checks it.

Next, an IVF index on twelve points.

```python
POINTS = {"p0": (0.0, 0.0), "p1": (1.0, 0.5), "p2": (0.5, 1.5), "p3": (2.0, 1.0), "p4": (5.0, 5.0), "p5": (6.0, 5.5),
          "p6": (5.5, 6.5), "p7": (7.0, 6.0), "p8": (0.5, 6.0), "p9": (1.5, 7.0), "p10": (3.0, 3.5), "p11": (4.0, 2.5)}
CENTROIDS = {"c0": (1.0, 1.0), "c1": (6.0, 6.0), "c2": (1.0, 6.5)}

def dist(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))

def ivf_build(vectors, centroids):
    lists = {c: [] for c in centroids}
    for name, v in sorted(vectors.items()):
        nearest = min(centroids, key=lambda c: (dist(v, centroids[c]), c))
        lists[nearest].append(name)
    return lists

def ivf_search(query, vectors, centroids, lists, nprobe=1, k=3):
    probe = sorted(centroids, key=lambda c: (dist(query, centroids[c]), c))[:nprobe]
    candidates = [name for c in probe for name in lists[c]]
    ranked = sorted(candidates, key=lambda name: (dist(query, vectors[name]), name))[:k]
    return ranked, len(candidates)

LISTS = ivf_build(POINTS, CENTROIDS)
print(LISTS)
for nprobe in (1, 2, 3):
    print(nprobe, ivf_search((4.3, 4.2), POINTS, CENTROIDS, LISTS, nprobe))
```

- **The centroids are given, standing in for k-means.** Each point joins the list of its nearest centroid: c0 gets six points, c1 four, c2 two.
- **The query (4.3, 4.2) sits on a border.** Its exact top three are p4, p10, and p11, at distances 1.06, 1.48, and 1.73.
- **With one probe, the nearest centroid is c1.** Scanning its four points returns p4, p5, p6: one of three correct, recall 0.333.
- **Two probes do not help.** The second-nearest centroid is c2, at 4.02, not c0, at 4.60, so the search scans the two far-corner points and still misses p10 and p11.
- **Three probes scan all twelve points and are exact.** Here that is no faster than flat search; at scale, the probes are a small fraction of the lists.

Then, beam search over a neighbour graph, HNSW's bottom layer.

```python
GRAPH = {"p0": ["p1", "p2"], "p1": ["p0", "p3", "p2"], "p2": ["p0", "p1", "p10"], "p3": ["p1", "p11"],
         "p11": ["p3", "p10", "p4"], "p10": ["p11", "p4", "p2"], "p4": ["p10", "p5", "p11"], "p5": ["p4", "p7", "p6"],
         "p6": ["p5", "p9"], "p7": ["p5"], "p8": ["p9"], "p9": ["p8", "p6"]}

def graph_search(query, vectors, graph, entry, ef=1, k=1):
    d = lambda node: dist(query, vectors[node])
    visited = {entry}
    candidates = [(d(entry), entry)]
    best = [(-d(entry), entry)]
    while candidates:
        distance, node = heapq.heappop(candidates)
        if distance > -best[0][0] and len(best) >= ef:
            break
        for neighbour in graph[node]:
            if neighbour in visited:
                continue
            visited.add(neighbour)
            dn = d(neighbour)
            if len(best) < ef or dn < -best[0][0]:
                heapq.heappush(candidates, (dn, neighbour))
                heapq.heappush(best, (-dn, neighbour))
                if len(best) > ef:
                    heapq.heappop(best)
    found = sorted(((-negative, node) for negative, node in best), key=lambda pair: (pair[0], pair[1]))
    return [node for _, node in found[:k]], len(visited)

print(graph_search((0.6, 6.2), POINTS, GRAPH, "p0", ef=1))
print(graph_search((0.6, 6.2), POINTS, GRAPH, "p0", ef=6, k=2))
print(graph_search((0.6, 6.2), POINTS, GRAPH, "p9", ef=1))
```

- **`candidates` is a min-heap of nodes to expand; `best` is a max-heap, by negated distance, of the `ef` nearest found.** This is the search procedure described in the HNSW paper.
- **The loop stops when the closest unexpanded candidate is farther than the worst of a full beam.** Nothing reachable through it could improve the result.
- **With `ef=1` from p0, the search gets stuck at p10.** It walks p0, p2, p10; p10's neighbours p11 and p4 are farther from the query, so it stops after visiting 6 nodes, far from the true answer p8.
- **With `ef=6`, the beam keeps enough alternatives to route round through p4, p5, p6, and p9 to p8.** It returns p8 and p9, but visits all 12 nodes.
- **Starting at p9 with `ef=1` finds p8 after visiting 3 nodes.** This is what HNSW's upper layers provide: an entry point already near the query.

Then, filtering.

```python
META = {"p0": {"category": "drills", "in_stock": True}, "p1": {"category": "drills", "in_stock": False},
        "p2": {"category": "saws", "in_stock": True}, "p3": {"category": "drills", "in_stock": True},
        "p4": {"category": "saws", "in_stock": True}, "p5": {"category": "saws", "in_stock": False},
        "p6": {"category": "garden", "in_stock": True}, "p7": {"category": "garden", "in_stock": True},
        "p8": {"category": "garden", "in_stock": False}, "p9": {"category": "saws", "in_stock": True},
        "p10": {"category": "drills", "in_stock": True}, "p11": {"category": "saws", "in_stock": True}}

def matches(meta, where):
    return all(meta.get(key) == value for key, value in where.items())

def filtered_search(query, vectors, metadata, where, k=3, mode="pre", candidates=None):
    order = sorted(vectors, key=lambda name: (dist(query, vectors[name]), name))
    if mode == "pre":
        return [name for name in order if matches(metadata[name], where)][:k]
    if mode == "post":
        shortlist = order[:candidates or k]
        return [name for name in shortlist if matches(metadata[name], where)][:k]
    raise ValueError(f"unknown mode {mode}")

saws = {"category": "saws", "in_stock": True}
print(filtered_search((4.3, 4.2), POINTS, META, saws, 3, "pre"))
print(filtered_search((4.3, 4.2), POINTS, META, saws, 3, "post"))
print(filtered_search((1.0, 0.4), POINTS, META, {"category": "garden"}, 2, "post", candidates=5))
```

- **Pre-filtering returns three in-stock saws, p4, p11, p9.** It scans every matching product.
- **Post-filtering the top three returns only p4 and p11.** p10 is a drill, so one slot is lost.
- **Garden tools near (1.0, 0.4) with five candidates return nothing.** The five nearest products are all drills and saws, the selective-filter failure from Section 2.

Finally, recall and memory.

```python
def recall_at_k(approx, exact):
    return round(len(set(approx) & set(exact)) / len(exact), 3) if exact else 1.0

def memory_bytes(n, dim, bytes_per_value=4, links_per_node=0, bytes_per_link=4):
    return n * dim * bytes_per_value + n * links_per_node * bytes_per_link

print(recall_at_k(["p4", "p5", "p6"], ["p4", "p10", "p11"]))
print(memory_bytes(10_000_000, 1536) / 1e9, memory_bytes(10_000_000, 1536, 1) / 1e9, memory_bytes(10_000_000, 1536, 4, 32) / 1e9)
```

- **The one-probe IVF result has recall 0.333.** Measuring this on a sample of real queries is how you set `nprobe` or `ef`.
- **Ten million float32 vectors at 1,536 dimensions: 61.44 GB; at one byte per value: 15.36 GB; with 32 four-byte links each: 62.72 GB.** A rough estimate that ignores storage-engine overhead, but enough to choose between hardware sizes.

**Complexity.** `score` is $O(d)$. `rank` is $O(n d + n \log n)$. `ivf_build` is $O(n \cdot n_{\text{list}} \cdot d)$; `ivf_search` scans the probed lists. `graph_search` visits nodes in proportion to `ef` and the graph's degree. `filtered_search` here is a full sort, $O(n d + n \log n)$, standing in for a real index. `recall_at_k` and `memory_bytes` are constant or linear.

### An index decision record

```text
COLLECTION   2.4 million product and help-centre chunks, 1,024-dim normalised embeddings, 30,000 updates per day
METRIC       cosine (model trained with cosine; vectors normalised, so dot product is equivalent)
INDEX        HNSW, M = 16, ef_construction = 200, ef_search = 64 (tuned: recall@10 0.97 on 500 sampled queries)
FILTERS      tenant_id (mandatory, in-query), category, in_stock; payload indexes on all three
MEMORY       2.4M x 1024 x 4 bytes = 9.8 GB vectors + links; 32 GB node chosen
HYBRID       BM25 in the same store, fused with RRF (Module 8.7)
REVIEW       re-measure recall@10 monthly and after any embedding model change (requires full re-index)
```

## 4. Practitioner Wisdom & Edge Cases (Reddit / HN / Stack Overflow Synthesis)

**Wrong metric for the model.** Using dot product on unnormalised embeddings trained for cosine favours long vectors. Use the model's metric.

**Sorting distance the wrong way.** Euclidean distance sorts ascending, similarities descending. Test with a known nearest neighbour.

**Mixing embedding models.** Vectors from two models, or two versions of one model, are not comparable. Changing the model means re-embedding everything.

**Never measuring recall.** Default index parameters may give recall well below what you assume. Compare with exact search on sample queries.

**Post-filtering selective queries.** Rare categories return nothing. Use pre-filtering or filtered search for selective filters.

**Tenant filters in application code.** Filtering another tenant's results after retrieval leaks data into logs and caches and shortens result lists. Filter in the query.

**Index built before the data settled.** IVF centroids trained on a small early sample produce unbalanced lists later. Retrain the clustering as data grows.

**Ignoring deletes.** HNSW deletions are often soft; deleted vectors still consume memory and can slow search. Plan compaction or rebuilds.

**Underestimating memory.** Float32 vectors at high dimension dominate the bill. Estimate before choosing hardware, and consider quantization.

**A dedicated database too early.** A few hundred thousand vectors fit comfortably in pgvector or a flat index. Add infrastructure when measurements require it.

**Benchmarks on someone else's data.** Published curves are a starting point. Measure recall and latency on your own queries.

**No re-index plan.** Embedding model upgrades require re-embedding the whole collection. Keep the source text and a pipeline that can rebuild.

## 5. Active Recall Check & Synthesis Summary

**Summary.** A vector database stores embeddings with metadata and answers nearest-neighbour queries through an index that checks only part of the collection, trading recall for speed and memory. Dot product, cosine similarity, and Euclidean distance rank identically for unit vectors, since $\|a - b\|^2 = 2 - 2\cos(a, b)$, but disagree for unnormalised vectors, where dot product favours long vectors; use the metric the embedding model was trained with. Flat search is exact and often sufficient for a few hundred thousand vectors. IVF clusters vectors around centroids and scans only the `nprobe` nearest lists, failing for queries near cluster borders unless more lists are probed. HNSW searches a layered neighbour graph with a beam of size `ef`: the beam escapes local minima, and the upper layers provide an entry point near the query. Recall@k against exact search, measured on real queries, is how these parameters are tuned. Metadata filters can be applied after the search, which fails for selective filters, before it, which can be slow, or during it, which good stores support with indexes on metadata fields; tenant filters must always be in the query. Memory is dominated by the vectors themselves, four bytes per dimension in float32, and quantization reduces it. Choose a store by collection size and change rate, filtering and tenancy, hybrid search needs, targets, and who will operate it.

**Question 1.** A team's product search uses dot product on embeddings from a model trained with cosine similarity, and the vectors are not normalised. Users complain that the same few long, detailed product descriptions appear at the top of almost every search. Using the lab's `short`, `long`, and `side` vectors and the query (1.0, 0.0), explain the symptom and the fix.

<details>
<summary>View Answer</summary>

Dot product multiplies the cosine of the angle by both vectors' lengths, so a long vector scores highly against any query it points even roughly towards. In the lab, `long` (3.0, 2.0) has length about 3.6 and points about 34 degrees away from the query, yet its dot product is 3.0, three times that of `short` (1.0, 0.1), which points almost exactly along the query and scores 1.0. Cosine, which divides out the lengths, ranks `short` first at 0.995 and `long` second at 0.832, which is the ranking the model was trained to produce. Long, detailed descriptions tend to produce embeddings with larger norms in some models, so they win under dot product for many queries: the symptom users see. The fix is to use the metric the model was trained with: either switch the index to cosine, or normalise every stored vector and every query vector to length 1, after which dot product equals cosine and the index can use the faster dot product. Normalising requires re-writing the stored vectors, so it should be done in the ingestion pipeline and verified by checking that the three metrics now rank a sample of queries identically.

</details>

**Question 2.** In the lab's IVF index, the query (4.3, 4.2) has recall 0.333 with one probe and still 0.333 with two probes. Explain why the second probe did not help, and what that implies for how `nprobe` should be chosen and how IVF clusters should be built.

<details>
<summary>View Answer</summary>

Probes are chosen by the distance from the query to each centroid, not by where the query's neighbours actually are. The query's nearest centroid is c1 at (6.0, 6.0), distance about 2.48, and its second nearest is c2 at (1.0, 6.5), distance about 4.02, ahead of c0 at (1.0, 1.0), distance about 4.60. But the true neighbours p10 and p11 belong to c0's list, because c0's cluster is large and spread out and they sit at its far edge. So the second probe scanned c2's two far-corner points, p8 and p9, and still missed them; only probing all three lists recovers full recall. The implications are, first, that `nprobe` cannot be chosen by reasoning about geometry: it must be set by measuring recall@k against exact search on a sample of real queries and increasing it until the target is met. Second, cluster quality matters: large, spread-out clusters put many vectors far from their centroids, where border effects are worst. More lists, built by k-means on a representative sample of the data and retrained as the data changes, give tighter clusters, and the measured recall at a given `nprobe` will improve.

</details>

**Question 3.** A marketplace with 3 million products uses post-filtering with 50 candidates. Searches filtered to a niche category, about 0.5 percent of products, often return no results, and searches filtered by seller, for multi-tenant seller dashboards, sometimes show fewer results than expected. Diagnose both and propose a design.

<details>
<summary>View Answer</summary>

With post-filtering, the index returns the 50 nearest products overall and the filter is applied afterwards. A category holding 0.5 percent of products contributes on average a quarter of one product to a random set of 50, so for most queries none of the 50 candidates are in the category and the result is empty, exactly as the lab's garden search near (1.0, 0.4) returned nothing. Raising the candidate count to thousands would help only partially and make every query slower. The seller dashboard problem is the same mechanism with a tenant filter, and it is also a security concern: applying a tenant filter after retrieval means other sellers' products pass through the application, its logs, and possibly its caches. The design is to filter inside the query. Create indexes on the category and seller fields; use a store that applies filters during the index traversal and switches to scanning the matching subset when a filter is very selective, as Qdrant describes for its payload indexes; for tenants, also consider partitioning, a separate collection or partition per large seller, so the tenant boundary is structural. Then measure recall@k for filtered queries specifically, since filtered search can lower recall when the filter disconnects parts of the graph, and tune `ef` for those queries.

</details>

@@starter
"""
Lab: Similarity Metrics, IVF, Graph Search, Filtering, Sizing
Standard library only. Two-dimensional points stand in for embeddings. Complete the TODO in each step, then press "Run & Verify Step".
"""
import heapq
import math

POINTS = {"p0": (0.0, 0.0), "p1": (1.0, 0.5), "p2": (0.5, 1.5), "p3": (2.0, 1.0), "p4": (5.0, 5.0), "p5": (6.0, 5.5),
          "p6": (5.5, 6.5), "p7": (7.0, 6.0), "p8": (0.5, 6.0), "p9": (1.5, 7.0), "p10": (3.0, 3.5), "p11": (4.0, 2.5)}
CENTROIDS = {"c0": (1.0, 1.0), "c1": (6.0, 6.0), "c2": (1.0, 6.5)}
GRAPH = {"p0": ["p1", "p2"], "p1": ["p0", "p3", "p2"], "p2": ["p0", "p1", "p10"], "p3": ["p1", "p11"],
         "p11": ["p3", "p10", "p4"], "p10": ["p11", "p4", "p2"], "p4": ["p10", "p5", "p11"], "p5": ["p4", "p7", "p6"],
         "p6": ["p5", "p9"], "p7": ["p5"], "p8": ["p9"], "p9": ["p8", "p6"]}
META = {"p0": {"category": "drills", "in_stock": True}, "p1": {"category": "drills", "in_stock": False},
        "p2": {"category": "saws", "in_stock": True}, "p3": {"category": "drills", "in_stock": True},
        "p4": {"category": "saws", "in_stock": True}, "p5": {"category": "saws", "in_stock": False},
        "p6": {"category": "garden", "in_stock": True}, "p7": {"category": "garden", "in_stock": True},
        "p8": {"category": "garden", "in_stock": False}, "p9": {"category": "saws", "in_stock": True},
        "p10": {"category": "drills", "in_stock": True}, "p11": {"category": "saws", "in_stock": True}}


def dist(a, b):
    """Given: Euclidean distance."""
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


# ---------------------------------------------------------------- Step 1
def score(a, b, metric):
    """'dot': sum of products; 'cosine': dot / (|a| |b|), 0.0 if either is zero; 'euclidean': dist. Round to 4 places.
    Raise ValueError for any other metric."""
    # TODO Step 1
    return None


def rank(query, vectors, metric, k=3):
    """Score every vector; sort ascending for 'euclidean', descending otherwise, ties by name.
    Return ([top k names], [top k (score, name)])."""
    # TODO Step 1
    return None


# ---------------------------------------------------------------- Step 2
def ivf_build(vectors, centroids):
    """{centroid: [names]}: each vector, in name order, joins the list of its nearest centroid (ties by centroid name)."""
    # TODO Step 2
    return None


def ivf_search(query, vectors, centroids, lists, nprobe=1, k=3):
    """Probe the nprobe centroids nearest the query; rank their vectors by distance then name.
    Return ([top k names], number of vectors scanned)."""
    # TODO Step 2
    return None


# ---------------------------------------------------------------- Step 3
def graph_search(query, vectors, graph, entry, ef=1, k=1):
    """Beam search: candidates min-heap and best max-heap of the ef nearest. Pop the closest candidate; stop if it is
    farther than the worst of a full beam; push unvisited neighbours that fit the beam, trimming best to ef.
    Return ([k nearest of best by distance then name], number of visited nodes)."""
    # TODO Step 3
    return None


# ---------------------------------------------------------------- Step 4
def filtered_search(query, vectors, metadata, where, k=3, mode="pre", candidates=None):
    """Order all vectors by distance then name. 'pre': keep matches, take k. 'post': take the first candidates
    (default k), keep matches, take k. A row matches when every key in where equals its metadata value."""
    # TODO Step 4
    return None


# ---------------------------------------------------------------- Step 5
def recall_at_k(approx, exact):
    """Shared names / len(exact), rounded to 3 places; 1.0 if exact is empty."""
    # TODO Step 5
    return None


def memory_bytes(n, dim, bytes_per_value=4, links_per_node=0, bytes_per_link=4):
    """Vector bytes plus link bytes."""
    # TODO Step 5
    return None


if __name__ == "__main__":
    print("rank:", rank((1.0, 0.0), {"short": (1.0, 0.1), "long": (3.0, 2.0)}, "cosine"))
    print("graph:", graph_search((0.6, 6.2), POINTS, GRAPH, "p0"))

@@solution
"""
Lab solution: Similarity Metrics, IVF, Graph Search, Filtering, Sizing
Standard library only. Two-dimensional points stand in for embeddings.
"""
import heapq
import math

POINTS = {"p0": (0.0, 0.0), "p1": (1.0, 0.5), "p2": (0.5, 1.5), "p3": (2.0, 1.0), "p4": (5.0, 5.0), "p5": (6.0, 5.5),
          "p6": (5.5, 6.5), "p7": (7.0, 6.0), "p8": (0.5, 6.0), "p9": (1.5, 7.0), "p10": (3.0, 3.5), "p11": (4.0, 2.5)}
CENTROIDS = {"c0": (1.0, 1.0), "c1": (6.0, 6.0), "c2": (1.0, 6.5)}
GRAPH = {"p0": ["p1", "p2"], "p1": ["p0", "p3", "p2"], "p2": ["p0", "p1", "p10"], "p3": ["p1", "p11"],
         "p11": ["p3", "p10", "p4"], "p10": ["p11", "p4", "p2"], "p4": ["p10", "p5", "p11"], "p5": ["p4", "p7", "p6"],
         "p6": ["p5", "p9"], "p7": ["p5"], "p8": ["p9"], "p9": ["p8", "p6"]}
META = {"p0": {"category": "drills", "in_stock": True}, "p1": {"category": "drills", "in_stock": False},
        "p2": {"category": "saws", "in_stock": True}, "p3": {"category": "drills", "in_stock": True},
        "p4": {"category": "saws", "in_stock": True}, "p5": {"category": "saws", "in_stock": False},
        "p6": {"category": "garden", "in_stock": True}, "p7": {"category": "garden", "in_stock": True},
        "p8": {"category": "garden", "in_stock": False}, "p9": {"category": "saws", "in_stock": True},
        "p10": {"category": "drills", "in_stock": True}, "p11": {"category": "saws", "in_stock": True}}


def dist(a, b):
    """Given: Euclidean distance."""
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


# ---------------------------------------------------------------- Step 1
def score(a, b, metric):
    """Similarities rise as vectors get closer; distances fall."""
    dot = sum(x * y for x, y in zip(a, b))
    if metric == "dot":
        return round(dot, 4)
    if metric == "cosine":
        na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(y * y for y in b))
        return round(dot / (na * nb), 4) if na and nb else 0.0
    if metric == "euclidean":
        return round(dist(a, b), 4)
    raise ValueError(f"unknown metric {metric}")


def rank(query, vectors, metric, k=3):
    """Sort the right way for the metric: the classic bug returns the farthest results."""
    scored = [(score(query, v, metric), name) for name, v in vectors.items()]
    if metric == "euclidean":
        scored.sort(key=lambda pair: (pair[0], pair[1]))
    else:
        scored.sort(key=lambda pair: (-pair[0], pair[1]))
    return [name for _, name in scored[:k]], scored[:k]


# ---------------------------------------------------------------- Step 2
def ivf_build(vectors, centroids):
    """Inverted lists: each vector filed under its nearest centroid."""
    lists = {c: [] for c in centroids}
    for name, v in sorted(vectors.items()):
        nearest = min(centroids, key=lambda c: (dist(v, centroids[c]), c))
        lists[nearest].append(name)
    return lists


def ivf_search(query, vectors, centroids, lists, nprobe=1, k=3):
    """Scan only the probed lists: fast, and blind to neighbours across a border."""
    probe = sorted(centroids, key=lambda c: (dist(query, centroids[c]), c))[:nprobe]
    candidates = [name for c in probe for name in lists[c]]
    ranked = sorted(candidates, key=lambda name: (dist(query, vectors[name]), name))[:k]
    return ranked, len(candidates)


# ---------------------------------------------------------------- Step 3
def graph_search(query, vectors, graph, entry, ef=1, k=1):
    """HNSW's bottom-layer search: a beam of ef escapes local minima that greedy routing falls into."""
    d = lambda node: dist(query, vectors[node])
    visited = {entry}
    candidates = [(d(entry), entry)]
    best = [(-d(entry), entry)]
    while candidates:
        distance, node = heapq.heappop(candidates)
        if distance > -best[0][0] and len(best) >= ef:
            break
        for neighbour in graph[node]:
            if neighbour in visited:
                continue
            visited.add(neighbour)
            dn = d(neighbour)
            if len(best) < ef or dn < -best[0][0]:
                heapq.heappush(candidates, (dn, neighbour))
                heapq.heappush(best, (-dn, neighbour))
                if len(best) > ef:
                    heapq.heappop(best)
    found = sorted(((-negative, node) for negative, node in best), key=lambda pair: (pair[0], pair[1]))
    return [node for _, node in found[:k]], len(visited)


# ---------------------------------------------------------------- Step 4
def filtered_search(query, vectors, metadata, where, k=3, mode="pre", candidates=None):
    """Post-filtering a selective condition can return nothing; pre-filtering always fills k if it can."""
    def matches(meta):
        return all(meta.get(key) == value for key, value in where.items())
    order = sorted(vectors, key=lambda name: (dist(query, vectors[name]), name))
    if mode == "pre":
        return [name for name in order if matches(metadata[name])][:k]
    if mode == "post":
        shortlist = order[:candidates or k]
        return [name for name in shortlist if matches(metadata[name])][:k]
    raise ValueError(f"unknown mode {mode}")


# ---------------------------------------------------------------- Step 5
def recall_at_k(approx, exact):
    """How much of the exact answer the index returned: the number that tunes nprobe and ef."""
    return round(len(set(approx) & set(exact)) / len(exact), 3) if exact else 1.0


def memory_bytes(n, dim, bytes_per_value=4, links_per_node=0, bytes_per_link=4):
    """Vectors dominate; links add a little; quantization shrinks the vectors."""
    return n * dim * bytes_per_value + n * links_per_node * bytes_per_link


if __name__ == "__main__":
    lists = ivf_build(POINTS, CENTROIDS)
    exact = sorted(POINTS, key=lambda name: (dist((4.3, 4.2), POINTS[name]), name))[:3]
    for nprobe in (1, 2, 3):
        found, scanned = ivf_search((4.3, 4.2), POINTS, CENTROIDS, lists, nprobe)
        print(nprobe, found, scanned, recall_at_k(found, exact))
    print(graph_search((0.6, 6.2), POINTS, GRAPH, "p0", ef=1), graph_search((0.6, 6.2), POINTS, GRAPH, "p0", ef=6, k=2))
    print(memory_bytes(10_000_000, 1536) / 1e9, memory_bytes(10_000_000, 1536, 1) / 1e9)

@@step
{
  "stepNumber": 1,
  "title": "Compare similarity metrics",
  "instruction": "Implement score(a, b, metric) for 'dot', 'cosine' (0.0 if either vector has zero length), and 'euclidean', each rounded to 4 places, raising ValueError for any other metric. Then implement rank(query, vectors, metric, k): score every vector, sort ascending for Euclidean and descending for the similarities, breaking ties by name, and return the top k names and the top k score and name pairs. Rank three vectors under all three metrics, then again after normalising them. This is similarity metrics from Section 2. [MOD-8.8]",
  "hintConceptual": "Two of the measures say 'how alike', where bigger is better, and one says 'how far apart', where smaller is better. Only one of them cares how long the arrows are.",
  "hintSyntax": "dot = sum(x * y for x, y in zip(a, b))\nif metric == \"dot\":\n    return round(dot, 4)\nif metric == \"cosine\":\n    na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(y * y for y in b))\n    return round(dot / (na * nb), 4) if na and nb else 0.0\nif metric == \"euclidean\":\n    return round(dist(a, b), 4)\nraise ValueError(metric)\n\n# rank\nscored = [(score(query, v, metric), name) for name, v in vectors.items()]\nscored.sort(key=lambda p: (p[0], p[1]) if metric == \"euclidean\" else (-p[0], p[1]))\nreturn [name for _, name in scored[:k]], scored[:k]"
}
@@assert
_v = {"short": (1.0, 0.1), "long": (3.0, 2.0), "side": (0.2, 1.0)}
_d = rank((1.0, 0.0), _v, "dot")
assert _d is not None and _d[0] == ["long", "short", "side"] and _d[1][0] == (3.0, "long"), f"Dot product favours the long vector, got {_d}"
assert rank((1.0, 0.0), _v, "cosine")[1] == [(0.995, "short"), (0.8321, "long"), (0.1961, "side")], "Cosine ignores length"
assert rank((1.0, 0.0), _v, "euclidean")[1][0] == (0.1, "short") and rank((1.0, 0.0), _v, "euclidean")[0] == ["short", "side", "long"], "Distance sorts ascending"
_unit = {n: tuple(x / math.sqrt(sum(y * y for y in v)) for x in v) for n, v in _v.items()}
assert rank((1.0, 0.0), _unit, "dot")[0] == rank((1.0, 0.0), _unit, "cosine")[0] == rank((1.0, 0.0), _unit, "euclidean")[0], "Unit vectors: all three metrics agree"
assert score((0.0, 0.0), (1.0, 1.0), "cosine") == 0.0, "Zero vector has no direction"
try:
    score((1, 0), (0, 1), "manhattan")
    raise AssertionError("Unknown metrics must raise ValueError")
except ValueError:
    pass
print("Step 1 passed: dot product picks the long vector; after normalising, all three metrics agree.")

@@step
{
  "stepNumber": 2,
  "title": "Build and probe an IVF index",
  "instruction": "Implement ivf_build(vectors, centroids): going through the vectors in name order, put each one in the list of its nearest centroid, breaking ties by centroid name. Then implement ivf_search(query, vectors, centroids, lists, nprobe, k): choose the nprobe centroids nearest the query, gather their lists, and return the k nearest of those vectors, ordered by distance and then name, together with the number of vectors scanned. Probe a query on a cluster border with one, two, and three lists. This is IVF from Section 2. [MOD-8.8]",
  "hintConceptual": "File every point under its nearest landmark. To search, only open the drawers of the landmarks nearest the question, and accept that a neighbour filed in the next drawer will be missed.",
  "hintSyntax": "lists = {c: [] for c in centroids}\nfor name, v in sorted(vectors.items()):\n    nearest = min(centroids, key=lambda c: (dist(v, centroids[c]), c))\n    lists[nearest].append(name)\nreturn lists\n\n# ivf_search\nprobe = sorted(centroids, key=lambda c: (dist(query, centroids[c]), c))[:nprobe]\ncandidates = [name for c in probe for name in lists[c]]\nranked = sorted(candidates, key=lambda name: (dist(query, vectors[name]), name))[:k]\nreturn ranked, len(candidates)"
}
@@assert
_lists = ivf_build(POINTS, CENTROIDS)
assert _lists == {"c0": ["p0", "p1", "p10", "p11", "p2", "p3"], "c1": ["p4", "p5", "p6", "p7"], "c2": ["p8", "p9"]}, f"Lists by nearest centroid, got {_lists}"
assert ivf_search((4.3, 4.2), POINTS, CENTROIDS, _lists, 1) == (["p4", "p5", "p6"], 4), f"One probe misses the border neighbours, got {ivf_search((4.3, 4.2), POINTS, CENTROIDS, _lists, 1)}"
assert ivf_search((4.3, 4.2), POINTS, CENTROIDS, _lists, 2) == (["p4", "p5", "p6"], 6), "The second-nearest centroid is the wrong one"
assert ivf_search((4.3, 4.2), POINTS, CENTROIDS, _lists, 3) == (["p4", "p10", "p11"], 12), "Probing everything is exact"
assert ivf_search((0.8, 0.6), POINTS, CENTROIDS, _lists, 1, k=2) == (["p1", "p2"], 6), "An interior query is fine with one probe"
print("Step 2 passed: one probe scans 4 of 12 vectors and misses p10 and p11 across the border.")

@@step
{
  "stepNumber": 3,
  "title": "Search a neighbour graph with a beam",
  "instruction": "Implement graph_search(query, vectors, graph, entry, ef, k). Keep a set of visited nodes, a min-heap of candidates by distance, and a max-heap of the best ef found (store negated distances), all starting from the entry. Repeatedly pop the closest candidate; stop if it is farther than the worst in the beam and the beam is full. Otherwise, for each unvisited neighbour, mark it visited and, if the beam has room or the neighbour beats the worst, push it onto both heaps and trim the beam to ef. Return the k nearest of the beam, ordered by distance and then name, and the number of visited nodes. Search from p0 with ef 1 and ef 6, and from p9. This is HNSW search from Section 2. [MOD-8.8]",
  "hintConceptual": "Ask for directions, but instead of trusting only the single best tip, keep a short list of promising leads and follow the best unexplored one until none of them could beat what you have already found.",
  "hintSyntax": "d = lambda node: dist(query, vectors[node])\nvisited = {entry}\ncandidates = [(d(entry), entry)]\nbest = [(-d(entry), entry)]\nwhile candidates:\n    distance, node = heapq.heappop(candidates)\n    if distance > -best[0][0] and len(best) >= ef:\n        break\n    for neighbour in graph[node]:\n        if neighbour in visited:\n            continue\n        visited.add(neighbour)\n        dn = d(neighbour)\n        if len(best) < ef or dn < -best[0][0]:\n            heapq.heappush(candidates, (dn, neighbour))\n            heapq.heappush(best, (-dn, neighbour))\n            if len(best) > ef:\n                heapq.heappop(best)\nfound = sorted(((-neg, node) for neg, node in best), key=lambda p: (p[0], p[1]))\nreturn [node for _, node in found[:k]], len(visited)"
}
@@assert
_g1 = graph_search((0.6, 6.2), POINTS, GRAPH, "p0", ef=1)
assert _g1 == (["p10"], 6), f"Greedy search is stuck at a local minimum, got {_g1}"
assert graph_search((0.6, 6.2), POINTS, GRAPH, "p0", ef=5, k=2)[0] == ["p10", "p4"], "ef 5 is still not enough here"
assert graph_search((0.6, 6.2), POINTS, GRAPH, "p0", ef=6, k=2) == (["p8", "p9"], 12), "A wider beam routes round to the answer"
assert graph_search((0.6, 6.2), POINTS, GRAPH, "p9", ef=1) == (["p8"], 3), "A good entry point, as HNSW's upper layers give, needs only greedy search"
assert graph_search((6.8, 6.2), POINTS, GRAPH, "p0", ef=2, k=2) == (["p7", "p5"], 9), "An easy query"
print("Step 3 passed: ef 1 stops at p10; ef 6 or a better entry point finds p8.")

@@step
{
  "stepNumber": 4,
  "title": "Pre-filter versus post-filter",
  "instruction": "Implement filtered_search(query, vectors, metadata, where, k, mode, candidates). Order all vectors by distance and then name. A vector matches when every key in where equals its metadata value. In 'pre' mode, keep the matching vectors and take k. In 'post' mode, take the first candidates vectors (k if candidates is None), keep the matching ones, and take k. Raise ValueError for any other mode. Search for in-stock saws both ways, and for garden tools with post-filtering. This is metadata filtering from Section 2. [MOD-8.8]",
  "hintConceptual": "Filtering afterwards is like taking the ten nearest shops and then keeping only the bakeries: in a neighbourhood with no bakery among the ten, you go hungry. Filtering first only looks at bakeries.",
  "hintSyntax": "def matches(meta):\n    return all(meta.get(key) == value for key, value in where.items())\norder = sorted(vectors, key=lambda name: (dist(query, vectors[name]), name))\nif mode == \"pre\":\n    return [n for n in order if matches(metadata[n])][:k]\nif mode == \"post\":\n    return [n for n in order[:candidates or k] if matches(metadata[n])][:k]\nraise ValueError(mode)"
}
@@assert
_saws = {"category": "saws", "in_stock": True}
assert filtered_search((4.3, 4.2), POINTS, META, _saws, 3, "pre") == ["p4", "p11", "p9"], f"Pre-filtering fills k, got {filtered_search((4.3, 4.2), POINTS, META, _saws, 3, 'pre')}"
assert filtered_search((4.3, 4.2), POINTS, META, _saws, 3, "post") == ["p4", "p11"], "Post-filtering loses a slot"
assert filtered_search((4.3, 4.2), POINTS, META, _saws, 3, "post", candidates=8) == ["p4", "p11", "p9"], "More candidates can recover it"
assert filtered_search((1.0, 0.4), POINTS, META, {"category": "garden"}, 2, "post", candidates=5) == [], "A selective filter can return nothing"
assert filtered_search((1.0, 0.4), POINTS, META, {"category": "garden"}, 2, "pre") == ["p8", "p6"], "Pre-filtering finds them"
try:
    filtered_search((0, 0), POINTS, META, {}, 1, "sideways")
    raise AssertionError("Unknown modes must raise ValueError")
except ValueError:
    pass
print("Step 4 passed: post-filtering for garden tools near the drills returns nothing.")

@@step
{
  "stepNumber": 5,
  "title": "Measure recall and size the memory",
  "instruction": "Implement recall_at_k(approx, exact): the number of names in both, divided by the length of exact, rounded to 3 places, or 1.0 if exact is empty. Implement memory_bytes(n, dim, bytes_per_value, links_per_node, bytes_per_link): the vectors' bytes plus the links' bytes. Measure the one-probe IVF result and size ten million 1,536-dimension vectors in float32, in one byte per value, and with HNSW links. This is measuring an index and memory from Section 2. [MOD-8.8]",
  "hintConceptual": "Grade the fast answer against the slow, exact one; then add up the bytes, remembering that the vectors themselves are almost all of it.",
  "hintSyntax": "def recall_at_k(approx, exact):\n    return round(len(set(approx) & set(exact)) / len(exact), 3) if exact else 1.0\n\ndef memory_bytes(n, dim, bytes_per_value=4, links_per_node=0, bytes_per_link=4):\n    return n * dim * bytes_per_value + n * links_per_node * bytes_per_link"
}
@@assert
assert recall_at_k(["p4", "p5", "p6"], ["p4", "p10", "p11"]) == 0.333, f"One probe, got {recall_at_k(['p4', 'p5', 'p6'], ['p4', 'p10', 'p11'])}"
assert recall_at_k(["p11", "p4", "p10"], ["p4", "p10", "p11"]) == 1.0 and recall_at_k([], []) == 1.0, "Order does not matter; empty exact is perfect"
assert memory_bytes(10_000_000, 1536) == 61_440_000_000, "Float32 vectors"
assert memory_bytes(10_000_000, 1536, 1) == 15_360_000_000, "One byte per value"
assert memory_bytes(10_000_000, 1536, 4, 32) == 62_720_000_000, "With 32 links per node"
assert memory_bytes(1_000_000, 768, 4, 32) == 3_200_000_000, "A smaller collection"
print("Step 5 passed: recall 0.333 for one probe; 61.44 GB of float32 vectors before any index.")
