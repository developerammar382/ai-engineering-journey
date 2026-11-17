# Day 16 — Cosine Similarity & Semantic Search

**Goal:** compare embeddings, and search by meaning instead of keywords.

## What I learned

- **Cosine similarity** measures how close two vectors point in the same direction. Higher = more similar meaning.
- I wrote it myself in a few lines: a dot product divided by the lengths.
- **Semantic search** = embed the question, embed all sentences, sort by similarity.
- It finds "Python is a programming language" for "Which **coding** languages are there?", even though "coding" never appears.
- `nomic-embed-text` works better with prefixes: `search_document: ` for stored texts and `search_query: ` for questions.

## Files

| File            | What it does                                     |
| --------------- | ------------------------------------------------ |
| `similarity.ts` | Compares word pairs, then runs a semantic search. |

## Run it

```bash
npx tsx day-16/similarity.ts
```

## Try it yourself

- Remove the `search_document:` / `search_query:` prefixes. How do the scores change?
- Add 5 of your own sentences and search them.
