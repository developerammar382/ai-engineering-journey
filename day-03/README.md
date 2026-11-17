# Day 03 — Terminal Chatbot

**Goal:** stop hard-coding questions. Chat with the AI live in the terminal.

## What I learned

- `node:readline/promises` lets me read what the user types.
- `stdin` = keyboard input, `stdout` = terminal output.
- A `while (true)` loop + `await rl.question()` makes a simple chat loop.
- Typing `exit` breaks the loop and closes readline.

## Files

| File              | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `terminal.ts`     | The chat loop: read input, send it, repeat.    |
| `chat.ts`         | `askAI()` sends the conversation to Ollama.    |
| `conversation.ts` | The shared messages array with system prompt.  |

## Run it

```bash
npx tsx day-03/terminal.ts
```

## Try it yourself

- Make `exit` work even if the user types `EXIT` or ` exit `.
- Print how many messages are in the history after each answer.
