# Day 27 — Safety Basics: Prompt Injection

**Goal:** understand the most common attack on AI apps, and simple defenses.

## What I learned

- **Prompt injection:** text from users or outside sources (emails, web pages, documents) can contain instructions like "ignore all previous instructions...". The AI can't always tell my instructions apart from the data.
- Defenses that help (none are perfect):
  1. **Separate data from instructions:** wrap it in tags like `<email>...</email>` and say it is data, not instructions.
  2. **Sandwich:** repeat the real task *after* the data.
  3. **Check input:** length limits and a list of suspicious phrases.
  4. **Check output:** before showing a reply, check it doesn't contain things it shouldn't.
- **Never put secrets in a prompt** (API keys, passwords, discount codes). Assume the AI *can* leak anything in its prompt.
- Small models are easy to fool. Defenses make attacks harder, not impossible.

## Files

| File        | What it does                                               |
| ----------- | ---------------------------------------------------------- |
| `safety.ts` | Injection demo, input checks, and an output leak check.    |

## Run it

```bash
npx tsx day-27/safety.ts
```

## Try it yourself

- Write your own injection that gets past `checkInput()`. Then improve `checkInput()`.
- Add the input check to the Day 23 server.
