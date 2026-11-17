# Day 28 — 🏁 Final Project (1/3): Docs Assistant Backend

**Goal:** start my final project, a **Docs Assistant** that answers questions about a folder of documents, with sources.

Over the last 3 days I build it step by step:

| Day | Part                                     |
| --- | ---------------------------------------- |
| 28  | Backend: RAG + HTTP API                  |
| 29  | Frontend: a web page                     |
| 30  | Polish: settings, better UI, an eval     |

## What I built today

- `assistant.ts`: Day 20's RAG wrapped in two functions, `indexDocs()` and `ask()`.
- `server.ts`: Day 23's server with one main route:

```
POST /ask   { "question": "..." }  →  { "answer": "...", "sources": ["menu.md"] }
```

- Input checks: the question must be a non-empty string, at most 500 characters (Day 27).

## Files

| File              | What it does                              |
| ----------------- | ----------------------------------------- |
| `server.ts`       | The HTTP API.                             |
| `assistant.ts`    | Indexing + answering with sources.        |
| `vector-store.ts` | From Day 17.                              |
| `chunk.ts`        | From Day 18.                              |
| `docs/`           | The Brewly documents (from Day 19).       |

## Run it

```bash
npx tsx day-28/server.ts
```

```bash
curl -X POST http://localhost:3000/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"When are you open on Sunday?"}'
```

## Note

"Sources" are the files of all chunks given to the AI, so sometimes an extra file shows up that wasn't really needed for the answer.
