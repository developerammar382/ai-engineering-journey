# Day 10 — Multiple Tools + The Tool Loop

**Goal:** give the AI several tools and let it use them as many times as it needs.

## What I learned

- A `name -> function` object (`toolFunctions`) lets me run any tool by name, with no big `if/else`.
- Some questions need **several** tool calls ("weather in London **and** Tokyo").
- So I use a **loop**: ask, run the tools it asks for, send results, ask again, until the AI answers without a tool call.
- Always add a **max steps** limit, so a confused model can't loop forever.
- Small models sometimes reply with an **empty answer** when tools are available but none fits the question. Fix: ask once more without tools.

## Files

| File       | What it does                                                            |
| ---------- | ----------------------------------------------------------------------- |
| `tools.ts` | 3 tools: `calculate`, `get_current_time`, `get_weather` (fake data).    |
| `index.ts` | The tool loop + 5 test questions.                                       |

## Run it

```bash
npx tsx day-10/index.ts
```

## Try it yourself

- Add a `convert_currency` tool with fake exchange rates.
- Ask "What's the weather in Lahore, and what is 34 * 9 / 5 + 32?" and watch how many steps it takes.
