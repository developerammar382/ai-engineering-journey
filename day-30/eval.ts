import { indexDocs, ask } from "./assistant.ts";
import { DOCS_FOLDER } from "./config.ts";

// Day 26 idea applied to the final project: a small test set.
// Run it after every change (new prompt, new chunk size, new MIN_SCORE...) to see
// if the assistant got better or worse.
//
// Each test lists words the answer MUST contain. For questions the docs don't cover,
// we expect the "couldn't find" answer.

const tests: { question: string; mustContain: string[] }[] = [
  { question: "What time do you open on Sunday?", mustContain: ["11"] },
  { question: "Where is the shop?", mustContain: ["Gulberg"] },
  { question: "How much is an espresso?", mustContain: ["450"] },
  { question: "Is there oat milk?", mustContain: ["150"] },
  { question: "Are pets allowed inside?", mustContain: ["not"] },
  { question: "How many stamps for a free drink?", mustContain: ["9"] },
  { question: "Do you give cash refunds?", mustContain: ["don't"] },
  { question: "Is there a discount for big orders?", mustContain: ["10%"] },
  { question: "Do you sell pizza?", mustContain: ["couldn't find"] },
  { question: "What is the capital of France?", mustContain: ["couldn't find"] },
];

await indexDocs(DOCS_FOLDER);

let passed = 0;

for (const { question, mustContain } of tests) {
  const { answer } = await ask(question);
  const ok = mustContain.every((word) => answer.toLowerCase().includes(word.toLowerCase()));
  if (ok) passed++;

  console.log(`${ok ? "✅" : "❌"} ${question}`);
  if (!ok) console.log(`     expected to contain: ${mustContain.join(", ")}\n     got: ${answer}`);
}

console.log(`\nPassed ${passed}/${tests.length}`);
