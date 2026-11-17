# Day 07 — 🛠 Mini Project: File Summarizer

**Goal:** build a small, real tool with what I learned this week.

## What it does

Give it any text file, get back a short summary and key points, streamed in the terminal.

It combines:

- reading files with `node:fs/promises`
- reading command-line arguments with `process.argv`
- a system prompt that defines the output format (Day 5)
- streaming (Day 4)
- low temperature for focused answers (Day 5)

## Files

| File           | What it does                     |
| -------------- | -------------------------------- |
| `summarize.ts` | The summarizer.                  |
| `sample.txt`   | A short article to test it with. |

## Run it

```bash
npx tsx day-07/summarize.ts day-07/sample.txt
npx tsx day-07/summarize.ts README.md
```

## Note

Very long files are cut at 12,000 characters, because small models can only read a limited amount of text at once. On Day 18 I learn a better way: splitting text into chunks.

## Try it yourself

- Add a second argument for the language: `summarize.ts sample.txt urdu`.
- Save the summary to a new file `sample.summary.txt`.
