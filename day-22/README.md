# Day 22 — Calling the REST API Directly

**Goal:** understand what the `ollama` package does under the hood.

## What I learned

- The `ollama` package just sends **HTTP requests** to Ollama's REST API at `http://127.0.0.1:11434`.
- With `fetch` (built into Node 18+) I can call it myself: `GET /api/tags` lists models, `POST /api/chat` chats.
- The raw response also has useful info like `eval_count` (tokens generated) and durations.
- **Streaming** comes as **NDJSON**: one small JSON object per line. Network pieces can end mid-line, so I keep a buffer and only parse complete lines.
- **Environment variables** (`process.env.OLLAMA_HOST`) let me change settings without changing code.
- Cloud AI providers (OpenAI, Anthropic, Google...) work the same way: HTTP + JSON + an API key in a header.

## Files

| File          | What it does                                          |
| ------------- | ----------------------------------------------------- |
| `rest-api.ts` | List models, chat, and stream, all with plain `fetch`. |

## Run it

```bash
npx tsx day-22/rest-api.ts
```

## Try it yourself

- Call `POST /api/embed` with `fetch` and compare it to `ollama.embed()` from Day 15.
- Print how many tokens per second the model generated (`eval_count / eval_duration`).
