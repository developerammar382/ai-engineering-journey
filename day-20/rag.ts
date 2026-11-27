import ollama from "ollama";
import { readFile, readdir } from "node:fs/promises";
import { VectorStore } from "./vector-store.ts";
import { chunkByParagraph } from "./chunk.ts";

// Day 19's RAG works, but has two problems:
//   1. We can't see WHERE an answer came from, so we can't check it.
//   2. For questions our docs don't cover, the AI may invent an answer.
//
// Today's fixes:
//   - remember which file each chunk came from, and show sources
//   - skip chunks with a low similarity score
//   - tell the AI clearly: "if the answer isn't in the context, say you don't know"

const MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:3b";
const DOCS_FOLDER = new URL("./docs/", import.meta.url);
const MIN_SCORE = 0.55; // found by testing: below this, chunks were usually unrelated

// We put the file name in front of each chunk, e.g. "[menu.md] Espresso: Rs. 450 ..."
// so the source travels together with the text.
const store = new VectorStore();

for (const fileName of await readdir(DOCS_FOLDER)) {
  const text = await readFile(new URL(fileName, DOCS_FOLDER), "utf-8");
  const chunks = chunkByParagraph(text).map((chunk) => `[${fileName}] ${chunk}`);
  await store.add(chunks);
}

async function ask(question: string) {
  const results = (await store.search(question, 3)).filter((r) => r.score >= MIN_SCORE);

  // Nothing relevant found: don't even ask the AI.
  if (results.length === 0) {
    return { answer: "Sorry, I don't have information about that.", sources: [] };
  }

  const context = results.map((r) => r.text).join("\n\n");

  const response = await ollama.chat({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are the assistant of Brewly coffee shop. Answer ONLY using the context below. " +
          'If the answer is not in the context, reply exactly: "Sorry, I don\'t have information about that." ' +
          "Keep answers short.\n\nContext:\n" +
          context,
      },
      { role: "user", content: question },
    ],
    options: { temperature: 0 },
  });

  // Get the unique file names out of "[file.md] ..." for the sources list.
  const sources = [...new Set(results.map((r) => r.text.match(/^\[(.+?)\]/)?.[1] ?? "unknown"))];

  return { answer: response.message.content, sources, scores: results.map((r) => r.score.toFixed(2)) };
}

const questions = [
  "How much is a cappuccino with oat milk?",
  "Do you give refunds?",
  "Does the brownie have nuts?",
  "Do you sell pizza?", // not in our docs
  "Who is the president of the USA?", // completely unrelated
];

for (const question of questions) {
  const { answer, sources, scores } = await ask(question);
  console.log(`Q: ${question}`);
  console.log(`A: ${answer}`);
  if (sources.length > 0) console.log(`   📄 sources: ${sources.join(", ")}  (scores: ${scores?.join(", ")})`);
  console.log();
}
