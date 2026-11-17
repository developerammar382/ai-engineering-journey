# Day 17 — Build a Tiny Vector Store

**Goal:** understand what a "vector database" is by building a very simple one.

## What I learned

- A vector store keeps **texts + their embeddings**, and can return the most similar ones for a query.
- Real ones (Chroma, Pinecone, pgvector) are built for millions of items. For learning, an **array + a JSON file** is enough.
- Embedding is slow, so I **save** the vectors to `store.json` and load them next time.
- Search isn't perfect. Sometimes the best answer is #2, not #1. That's why RAG usually takes the **top 3** results, not just one.

## Files

| File              | What it does                                         |
| ----------------- | ---------------------------------------------------- |
| `vector-store.ts` | `VectorStore` class: `add`, `search`, `save`, `load`. |
| `index.ts`        | Stores 10 facts and searches them.                   |

## Run it

```bash
npx tsx day-17/index.ts
```

Run it twice: the second time it loads `store.json` instead of embedding again.

## Try it yourself

- Add a `remove(text)` method.
- Time the first run vs the second run with `console.time()`.
