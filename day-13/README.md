# Day 13 — Error Handling & Reliable Output

**Goal:** make AI code that doesn't crash when things go wrong.

## What I learned

AI apps can fail in extra ways: Ollama isn't running, the model isn't downloaded, the request hangs, or the AI returns the wrong data. Small helpers fix most of this:

- **Friendly errors:** turn `ECONNREFUSED` into "Is Ollama running?".
- **Timeout:** `Promise.race()` with a timer, so a request can't hang forever.
- **Retry:** try again a few times, waiting a bit longer each time.
- **Validation:** `JSON.parse()` only checks the JSON is valid, not that it has the right fields. A **type guard** (`isRecipe`) checks the real shape at runtime, and TypeScript then knows the type.

## Files

| File          | What it does                                                         |
| ------------- | -------------------------------------------------------------------- |
| `reliable.ts` | `explainError`, `withTimeout`, `withRetry`, `isRecipe` + a demo.     |

## Run it

```bash
npx tsx day-13/reliable.ts
```

To see the "Ollama not running" error: quit Ollama and run it again.

## Try it yourself

- Set the timeout to `1` ms and watch the retries.
- Add a `difficulty` field (`"easy" | "medium" | "hard"`) to `Recipe` and validate it.
