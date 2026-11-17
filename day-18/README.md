# Day 18 — Chunking Documents

**Goal:** split long documents into small pieces before embedding them.

## What I learned

- One vector for a whole document is "blurry": it mixes many topics into one meaning.
- Models also have a context limit (Day 12), so I can't paste a whole book into a prompt.
- **Chunking** splits text into small pieces. Each piece gets its own embedding.
- Two simple ways:
  - **By words** (e.g. 80 words), with **overlap**, so a sentence cut in half still appears whole in one chunk.
  - **By paragraph**: each paragraph is usually one idea.
- ``if (import.meta.url === `file://${process.argv[1]}`)`` runs the demo only when the file is run directly, not when it's imported.

## Files

| File         | What it does                                       |
| ------------ | -------------------------------------------------- |
| `chunk.ts`   | `chunkText()` and `chunkByParagraph()` + a demo.   |
| `article.md` | A short article about coffee to split.             |

## Run it

```bash
npx tsx day-18/chunk.ts
```

## Try it yourself

- Try `chunkText(text, 30, 5)` and `chunkText(text, 200, 0)`. Which feels more useful?
- Write `chunkBySentence()` that groups 3 sentences per chunk.
