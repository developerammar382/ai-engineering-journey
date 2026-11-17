# Day 15 — What Are Embeddings?

**Goal:** turn text into numbers, the base of semantic search and RAG.

## What I learned

- An **embedding** is a list of numbers (a **vector**) that represents the *meaning* of a text.
- Texts with similar meaning get similar vectors, even with different words ("cat" and "kitten").
- Embeddings come from special small models. I use `nomic-embed-text`, which gives 768 numbers per text.
- `ollama.embed()` accepts one text or an array of texts.
- The numbers alone mean nothing to a human. They only become useful when I **compare** them (tomorrow).

## Setup

```bash
ollama pull nomic-embed-text
```

## Files

| File       | What it does                                  |
| ---------- | --------------------------------------------- |
| `embed.ts` | Embeds a sentence and 3 words, prints vectors. |

## Run it

```bash
npx tsx day-15/embed.ts
```

## Try it yourself

- Embed a long paragraph. Is the vector longer? (No! Always 768 numbers.)
- Embed the same sentence twice. Are the numbers the same?
