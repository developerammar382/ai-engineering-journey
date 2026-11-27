# Day 29 — 🏁 Final Project (2/3): Frontend

**Goal:** give the Docs Assistant a simple web page.

## What I built today

- `public/index.html`: a question box. Each answer appears as a card with its sources, newest on top.
- The server now serves the page on `GET /` and moved the status check to `GET /api/status`.
- Plain HTML, CSS and JavaScript, using `fetch("/ask")` (same idea as Day 24, but JSON instead of streaming).

## Files

| File                | What it does                       |
| ------------------- | ---------------------------------- |
| `public/index.html` | The web page.                      |
| `server.ts`         | Serves the page + the API.         |
| others              | Same as Day 28.                    |

## Run it

```bash
npx tsx day-29/server.ts
```

Open http://localhost:3000.

## Try it yourself

- Press Enter to send instead of clicking the button.
- Save past answers in `localStorage` so they survive a page refresh.
- Make each source clickable, and show that chunk's text when clicked.

## What's missing (fixed tomorrow)

- No "loading" state. You can't tell if it's working.
- Errors aren't shown nicely.
- The docs folder is hard-coded.
- No way to check if a change made answers better or worse.
