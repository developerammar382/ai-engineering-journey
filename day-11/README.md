# Day 11 — Saving Chat History

**Goal:** the AI should remember me even after I restart the program.

## What I learned

- Memory in an array is lost when the program stops. Saving it to a **JSON file** keeps it.
- `JSON.stringify(data, null, 2)` writes nicely formatted JSON that I can open and read.
- `new URL("./history.json", import.meta.url)` saves the file next to the code, no matter where I run the command from.
- If the file is missing or broken, start fresh instead of crashing.
- Save after **every** message, so nothing is lost if the program crashes.

## Files

| File          | What it does                                     |
| ------------- | ------------------------------------------------ |
| `history.ts`  | `loadHistory`, `saveHistory`, `resetHistory`.    |
| `terminal.ts` | Streaming chat that loads and saves history.     |

`history.json` is created when you chat. It's in `.gitignore` because it's personal data.

## Run it

```bash
npx tsx day-11/terminal.ts
```

Tell it your name, type `exit`, run it again, and ask "What's my name?".

## Try it yourself

- Add a `history` command (like Day 4).
- Save each day's chat to its own file, like `history-2026-11-17.json`.
