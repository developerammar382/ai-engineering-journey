# Day 21 — 🛠 Mini Project: Chat With Your Notes

**Goal:** a RAG chat app I can actually use on my own files.

## What it does

- By default it indexes **this repository's README files**, so I can ask questions about my own learning journal ("What did I learn about temperature?").
- Give it any folder, and it indexes all `.md` and `.txt` files there.
- Saves the index to `store.json`, so the next start is instant.
- Streams answers (Day 4) and shows sources (Day 20).

## Files

| File              | What it does                                      |
| ----------------- | ------------------------------------------------- |
| `index.ts`        | Terminal chat + command-line options.             |
| `notes.ts`        | `buildIndex()` and `askNotes()`.                  |
| `chunk.ts`        | Word chunks with overlap (Day 18).                |
| `vector-store.ts` | From Day 17.                                      |

## Run it

```bash
npx tsx day-21/index.ts                 # chat with this repo's READMEs
npx tsx day-21/index.ts ~/my-notes      # chat with your own notes folder
npx tsx day-21/index.ts --rebuild       # re-index after changes
```

## Try it yourself

- Make it also search subfolders.
- Rebuild automatically when a file changed (hint: `fs.stat()` gives `mtime`).
