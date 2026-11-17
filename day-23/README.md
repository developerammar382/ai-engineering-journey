# Day 23 — Serving the AI Over HTTP

**Goal:** turn my AI into an API that any app can use.

## What I learned

- Node's built-in `node:http` module is enough for a small server. No Express needed.
- The request body arrives in pieces, so I read it with `for await` and then `JSON.parse` it.
- Good APIs **validate input** and return clear errors with the right status code:
  - `400` = the client sent something wrong
  - `404` = this route doesn't exist
  - `500` = something broke on the server
- `curl` is a quick way to test an API from the terminal.

## Files

| File        | What it does                                          |
| ----------- | ----------------------------------------------------- |
| `server.ts` | `GET /` health check and `POST /chat` → `{ reply }`.  |

## Run it

```bash
npx tsx day-23/server.ts
```

In another terminal:

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hi!"}'
```

## Try it yourself

- Add `POST /summarize` that uses the Day 7 prompt.
- Return how long the AI took, e.g. `{ reply, ms: 1234 }`.
