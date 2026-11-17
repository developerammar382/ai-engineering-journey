# Day 09 — Real Tool Calling

**Goal:** let the AI decide by itself when to use a tool.

## What I learned

- I describe my tool to the AI: its **name**, a **description**, and its **parameters** (JSON Schema).
- The AI **never runs my code**. It replies with a `tool_calls` list, like "please call `calculate` with `3.5 * 60 * 60`".
- The flow:
  1. Send the question + the list of tools.
  2. If the AI asks for a tool, **I** run it.
  3. Send the result back as a `tool` message.
  4. Ask again. Now the AI writes the final answer using the result.
- If no tool is needed (like "Who wrote Romeo and Juliet?"), the AI just answers.

## Files

| File       | What it does                                                 |
| ---------- | ------------------------------------------------------------ |
| `tools.ts` | The `calculate` function and its description for the AI.     |
| `index.ts` | One question with a tool, one without.                       |

## Run it

```bash
npx tsx day-09/index.ts
```

## Note

Small models can make mistakes even when using tools, for example copying a number wrong into the expression. That's why the code prints every tool call: **always log what the AI asked for**.

## Try it yourself

- Ask "What is 1234 * 5678?" and check whether the AI copies the numbers correctly.
- Improve the tool `description` and see if the AI uses it more often.
