# Day 12 — Context Window Limits

**Goal:** understand why long chats are a problem, and two ways to fix it.

## What I learned

- The **context window** is the max amount of text a model can read at once, measured in **tokens** (about 4 characters of English each).
- Long histories are slower, use more memory, and old messages may get cut off.
- `response.prompt_eval_count` shows how many tokens the model really read.
- **Trimming:** keep only the last N messages. Simple, but the AI forgets early facts (like my name).
- **Summarizing:** let the AI summarize old messages and keep that summary in the system prompt. Fewer tokens, and important facts survive.
- Small models follow **one** system message better than several, so I merge the summary into it.

## Files

| File         | What it does                                                         |
| ------------ | -------------------------------------------------------------------- |
| `context.ts` | Builds a long chat and compares full, trimmed and summarized history. |

## Run it

```bash
npx tsx day-12/context.ts
```

## Try it yourself

- Add trimming to the Day 11 chat, so `history.json` never has more than 20 messages.
- Print the token count after every message in a chat.
