# Day 14 — 🛠 Mini Project: Personal Assistant

**Goal:** combine everything from Week 2 into one useful terminal app.

## What it does

A chat assistant that can do math, tell the time, and **save notes that survive restarts**.

| Week 2 idea                | Where it's used                           |
| -------------------------- | ----------------------------------------- |
| Tool calling (Day 9)       | `tools.ts`                                |
| Tool loop (Day 10)         | `chat()` in `assistant.ts`                |
| Saving to JSON (Day 11)    | notes are saved in `notes.json`           |
| History limits (Day 12)    | `trimHistory()` keeps the last 20         |
| Error handling (Day 13)    | `try/catch` with a friendly message       |

## Files

| File           | What it does                                       |
| -------------- | -------------------------------------------------- |
| `index.ts`     | The terminal interface.                            |
| `assistant.ts` | Conversation + tool loop.                          |
| `tools.ts`     | `calculate`, `get_current_time`, `add_note`, `list_notes`. |

## Run it

```bash
npx tsx day-14/index.ts
```

Try: "remind me to buy milk", "show my notes", "what is 15% of 2400?".

## Try it yourself

- Add a `delete_note` tool.
- Save the chat history too (Day 11), not just the notes.
