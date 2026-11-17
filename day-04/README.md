# Day 04 — Streaming + Chat Commands

**Goal:** make the chatbot feel fast and add useful commands.

## What I learned

- **Streaming** (`stream: true`) sends the answer in small chunks while the AI is still writing. The user sees text right away instead of waiting.
- `for await (const chunk of stream)` reads the chunks one by one.
- I still need to join all chunks into the full answer, so I can save it in the history.
- Wrapping the conversation in functions (`getMessages`, `addMessage`, `clearMessages`) keeps the array safe from random changes.
- Simple commands make a chatbot much nicer to use:
  - `history`: show all messages
  - `clear`: forget everything except the system prompt
  - `exit`: quit

## Files

| File              | What it does                                         |
| ----------------- | ---------------------------------------------------- |
| `terminal.ts`     | Chat loop with `history`, `clear` and `exit`.        |
| `chat.ts`         | Streams the answer to the terminal and saves it.     |
| `conversation.ts` | The messages array + helper functions.               |

## Run it

```bash
npx tsx day-04/terminal.ts
```

## Try it yourself

- Add a `help` command that lists all commands.
- Add a `count` command that shows how many messages are saved.
