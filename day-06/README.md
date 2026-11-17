# Day 06 — Structured Output (JSON)

**Goal:** get data from the AI that my code can use, not just text for humans.

## What I learned

- I can ask the AI to return **JSON** with a fixed structure, then `JSON.parse()` it.
- Always wrap `JSON.parse()` in `try/catch`. The AI sometimes adds extra text and breaks the JSON.
- Each extraction is its own job, so I clear the history before each one. Old answers can confuse the model.
- Ollama's `format` option is more reliable: I pass a **JSON Schema** and the output is forced to match it.

## Files

| File                   | What it does                                                         |
| ---------------------- | -------------------------------------------------------------------- |
| `extract.ts`           | Extracts country, person and product info by asking for JSON.        |
| `structured-output.ts` | Same idea with `format` + a JSON Schema and a TypeScript type.       |
| `chat.ts`              | `askAI()` for extraction (no streaming, we need the full JSON).      |
| `conversation.ts`      | System prompt: "return valid JSON only".                             |

## Run it

```bash
npx tsx day-06/extract.ts
npx tsx day-06/structured-output.ts
```

## Try it yourself

- Write `extractJob()` that pulls `title`, `company`, `salary` and `remote` (true/false) from a job post.
- Rewrite one of the `extract.ts` functions to use `format` with a schema.
