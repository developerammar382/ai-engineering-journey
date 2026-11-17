# Day 20 — RAG Part 2: Sources & "I Don't Know"

**Goal:** make RAG answers trustworthy.

## What I learned

Day 19's RAG had two problems:

1. I couldn't see **where** an answer came from.
2. For questions the docs don't cover, the AI might **invent** an answer.

Fixes:

- **Sources:** put the file name in front of each chunk (`[menu.md] ...`), then show the sources under the answer.
- **Minimum score:** ignore chunks with low similarity. If nothing is left, answer "I don't know" without even calling the AI.
- **Strict prompt:** "Answer ONLY using the context. If it's not there, say exactly: ...".
- The `MIN_SCORE` value (0.55) came from testing. Print the scores, look at good and bad matches, and pick a number between them.

## Files

| File     | What it does                                          |
| -------- | ----------------------------------------------------- |
| `rag.ts` | RAG with sources, a score filter and a strict prompt. |
| others   | Same as Day 19.                                       |

## Run it

```bash
npx tsx day-20/rag.ts
```

## Try it yourself

- Set `MIN_SCORE` to `0.3`, then `0.8`. What breaks?
- Show the matching chunk text under each answer, not just the file name.
