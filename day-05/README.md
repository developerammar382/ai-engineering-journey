# Day 05 — Prompt Engineering Basics

**Goal:** see how much the *way* I ask changes the answer.

## What I learned

- **System prompt:** decides who the AI is and how it answers (length, tone, audience).
- **Few-shot prompting:** show the AI a few example questions and answers. It copies the pattern. Great for classification and fixed formats.
- **Temperature:** controls randomness.
  - `0` gives (almost) the same answer every time. Good for facts, data, classification.
  - `1+` gives more varied, creative answers. Good for names, stories, ideas.

## Files

| File         | What it does                                                  |
| ------------ | ------------------------------------------------------------- |
| `prompts.ts` | 4 experiments: plain, system prompt, few-shot, temperature.   |

## Run it

```bash
npx tsx day-05/prompts.ts
```

## Try it yourself

- Change the system prompt in experiment 2 to "explain like a senior engineer". Compare.
- Remove the examples from experiment 3. Does the AI still reply with one word?
