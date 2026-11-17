# Day 26 — Testing AI Output (Evals)

**Goal:** measure if a prompt is good, instead of guessing.

## What I learned

- Trying 2–3 examples by hand isn't enough. An **eval** is a list of test inputs with the **correct answer**, plus a score.
- Change one thing at a time and compare scores. That's how you know a change helped.
- My three prompt versions:
  - **v1:** category names only. The AI picks the right idea but answers in a full sentence, so my code can't use it.
  - **v2:** + "Reply with only one word". Much better.
  - **v3:** + a description of each category + `format` with an `enum` (Day 6). The output can **only** be a valid category.
- If two versions both score 100%, my test set is **too easy**. Good evals include tricky cases.

## Files

| File          | What it does                                     |
| ------------- | ------------------------------------------------ |
| `evaluate.ts` | 12 test cases, 3 prompt versions, a score each.  |

## Run it

```bash
npx tsx day-26/evaluate.ts
```

## Try it yourself

- Add 5 tricky messages, e.g. "I can't log in since I paid for premium". Which version wins now?
- Run v2 three times with `temperature: 1`. Is the score stable?
