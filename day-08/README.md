# Day 08 — Tools by Hand: Calculator

**Goal:** understand why AI apps need "tools", by building one myself.

## What I learned

- LLMs predict text. They are **bad at exact math**. Try `index.ts` and compare the AI's answer with the real one.
- A **tool** is just a normal function my program runs, because code does some jobs better than the AI.
- Today my code decides when to use the tool: if a message starts with `calculate `, run the calculator. Otherwise ask the AI.
- **Never use `eval()` on user input.** Someone could type real code (like `process.exit()`) and it would run. I first check that the input only contains numbers and math symbols.
- Even when a tool answers, I save the reply in the history so the conversation stays complete.

## Files

| File              | What it does                                                   |
| ----------------- | -------------------------------------------------------------- |
| `tool.ts`         | A safe `calculate()` function.                                 |
| `chat.ts`         | `askAI()` sends `calculate ...` to the tool, the rest to the AI. |
| `conversation.ts` | Messages array + helpers.                                      |
| `index.ts`        | Compares AI math vs tool math, and shows the safety check.     |

## Run it

```bash
npx tsx day-08/index.ts
```

## Try it yourself

- Add a second tool: `time` returns the current time.
- What problems does "starts with `calculate`" have? (Hint: "please calculate 2+2".) Tomorrow the AI decides by itself.
