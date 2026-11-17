# Day 02 — First AI Call + Conversation Memory

**Goal:** talk to a real AI model running on my own computer, and make it remember the conversation.

## What I learned

- [Ollama](https://ollama.com) runs AI models locally. No API key, no cost.
- `ollama.chat()` takes a model name and a list of messages, and returns the AI's reply.
- **The AI has no memory.** It only knows what I send in `messages`.
- To "remember", I push every question **and** every answer into the same array and send the whole array each time.
- The **system** message sets the AI's personality and rules for the whole chat.

## Files

| File              | What it does                                                      |
| ----------------- | ----------------------------------------------------------------- |
| `first-call.ts`   | My very first AI call: one message in, one answer out.            |
| `conversation.ts` | The messages array, starting with a system prompt.                |
| `chat.ts`         | Asks 3 questions in a row to test memory.                         |

## Run it

```bash
npx tsx day-02/first-call.ts
npx tsx day-02/chat.ts
```

## Note

"What is my name?" works because the first message is in the history. "What was my first question?" is harder. A small 3B model often gets it wrong even though the answer is right there in `messages`. Bigger models do better.

## Try it yourself

- Remove `messages.push(response.message)` in `chat.ts`. Does the AI still know your first question?
- Change the system prompt to make the AI answer like a pirate.
