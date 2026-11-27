# Contributing

Thanks for helping make this better for the next learner! 🙌

## Good ways to help

- **Fix something that doesn't run.** Include the day and the error in your PR.
- **Make an explanation clearer.** If a README confused you, it will confuse others too.
- **Fix typos and broken links.**
- **Add a "Try it yourself" exercise** to a day.
- **Share your solutions** in [Discussions](https://github.com/developerammar382/ai-engineering-journey/discussions), not as PRs, so the day folders stay the same as the original journey.

## Ground rules

1. **Each day runs on its own.** Never import from another `day-XX` folder. If a day needs shared code (like the vector store), it has its own copy. That's on purpose.
2. **No frameworks.** The point is to see how things work underneath, so no LangChain, LlamaIndex or vector databases.
3. **Keep it local.** Code must run with Ollama and no API keys.
4. **Keep it simple.** Code is written for learners. Clear beats clever.
5. **Small PRs.** One fix or idea per PR.

## Before you open a PR

```bash
npm install
npm run doctor      # Ollama + models ready?
npm run typecheck   # must pass (CI runs this too)
npm run day -- <N>  # run the day you changed
```

## Questions?

Open a [Discussion](https://github.com/developerammar382/ai-engineering-journey/discussions). There are no dumb questions here.
