# Day 19 — RAG Part 1: Retrieve, Then Answer

**Goal:** let the AI answer questions about **my own documents**.

## What I learned

**RAG** = Retrieval-Augmented Generation. It's how most "chat with your docs" apps work:

1. **Index:** load documents, chunk them (Day 18), embed them (Day 17).
2. **Retrieve:** find the chunks most similar to the question.
3. **Augment:** paste those chunks into the prompt.
4. **Generate:** the AI answers using that information.

The AI knows nothing about "Brewly", a made-up coffee shop. Without RAG it can only say "I don't know" or guess. With RAG it gives the correct opening hours and prices.

## Files

| File              | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `rag.ts`          | Indexes `docs/` and answers 4 questions.        |
| `docs/`           | The Brewly coffee shop's info, menu, policies.  |
| `vector-store.ts` | From Day 17.                                    |
| `chunk.ts`        | `chunkByParagraph` from Day 18.                 |

## Run it

```bash
npx tsx day-19/rag.ts
```

## Try it yourself

- Add a `docs/events.md` (e.g. "live music every Friday") and ask about it.
- Ask something that's NOT in the docs, like "Do you sell pizza?". What happens? (Fixed tomorrow.)
