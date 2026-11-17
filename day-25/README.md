# Day 25 — A Simple Agent

**Goal:** give the AI a goal instead of a question, and let it plan the steps itself.

## What I learned

- An **agent** is the tool loop from Day 10 with a **goal**: think → act (tool) → observe (result) → repeat → done.
- The AI decides the order by itself: list files, read each one, then write the summary.
- **Agents can do damage.** In the first version of this code, the agent could write anywhere in the workspace, and it overwrote the input files with empty text. Fixes:
  - **Least power:** it can only **read** from `workspace/` and only **write** to `output/`.
  - `path.basename()` stops paths like `../../secret.txt` from escaping the folder.
  - A **max steps** limit.
- Printing every step makes it easy to see what the agent is doing (and where it goes wrong).

## Files

| File         | What it does                                          |
| ------------ | ----------------------------------------------------- |
| `agent.ts`   | The agent loop.                                       |
| `tools.ts`   | `list_files`, `read_file`, `write_file` (safe).       |
| `workspace/` | Input files for the agent to read.                    |

`output/` is created when the agent runs (ignored by git).

## Run it

```bash
npx tsx day-25/agent.ts
npx tsx day-25/agent.ts "Read todo.txt and write the tasks sorted by importance to priorities.md"
```

## Try it yourself

- Add a `confirm` step: ask the user (readline) before every `write_file`.
- Give it a goal that is impossible with its tools. How does it fail?
