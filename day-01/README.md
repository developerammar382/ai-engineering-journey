# Day 01 — Chat Message Structure

**Goal:** understand what a "conversation" with an AI looks like as data, before calling any AI.

## What I learned

- A chat is just a **list of messages**.
- Every message has a **role** (`user` or `assistant`) and some **content**.
- TypeScript `type` and `interface` help me describe this shape, so mistakes show up before running the code.
- Extra info like the model name and token count can be stored with each message.

## Files

| File       | What it does                                              |
| ---------- | --------------------------------------------------------- |
| `index.ts` | Defines a `ChatMessage` type, adds messages, prints them. |

## Run it

```bash
npx tsx day-01/index.ts
```

## Try it yourself

- Add a `"system"` role to the `role` type and add a system message.
- Write a function that returns the total tokens of all messages.
