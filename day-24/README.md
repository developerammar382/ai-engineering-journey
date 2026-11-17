# Day 24 — A Simple Web Chat

**Goal:** give my AI a real chat page in the browser.

## What I learned

- The server sends an HTML file on `GET /` and streams answers on `POST /chat`.
- **Streaming over HTTP:** `res.write()` sends each chunk right away, and the browser reads them with `response.body.getReader()` (same idea as Day 22).
- The **browser keeps the chat history** and sends all messages each time. The server remembers nothing (it's "stateless"), which keeps it simple.
- Plain HTML + a `<script>` tag is enough. No React, no build step.
- `textContent` (not `innerHTML`) safely shows AI text without running any HTML inside it.

## Files

| File                | What it does                          |
| ------------------- | ------------------------------------- |
| `server.ts`         | Serves the page and streams answers.  |
| `public/index.html` | The chat page (HTML + CSS + JS).      |

## Run it

```bash
npx tsx day-24/server.ts
```

Then open http://localhost:3000.

## Try it yourself

- Add a "Clear chat" button.
- Save the messages in `localStorage` so a page refresh doesn't lose the chat.
