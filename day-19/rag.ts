import ollama from "ollama";
import { readFile, readdir } from "node:fs/promises";
import { VectorStore } from "./vector-store.ts";
import { chunkByParagraph } from "./chunk.ts";

// RAG = Retrieval-Augmented Generation.
//
// The AI doesn't know anything about "Brewly", our made-up coffee shop.
// So before asking the AI, we:
//   1. RETRIEVE: search our documents for the paragraphs related to the question
//   2. AUGMENT:  paste those paragraphs into the prompt
//   3. GENERATE: let the AI answer using that information
//
// Everything we learned this week comes together here.

const MODEL = "qwen2.5:3b";
const DOCS_FOLDER = new URL("./docs/", import.meta.url);

// ---------- Step 0: index the documents (load, chunk, embed) ----------
const store = new VectorStore();

for (const fileName of await readdir(DOCS_FOLDER)) {
  const text = await readFile(new URL(fileName, DOCS_FOLDER), "utf-8");
  await store.add(chunkByParagraph(text));
}
console.log(`Indexed ${store.items.length} chunks.\n`);

// ---------- Steps 1-3 ----------
async function ask(question: string): Promise<string> {
  // 1. Retrieve
  const results = await store.search(question, 3);
  const context = results.map((r) => r.text).join("\n\n");

  // 2. Augment
  const prompt = `Answer the question using this information:

${context}

Question: ${question}`;

  // 3. Generate
  const response = await ollama.chat({
    model: MODEL,
    messages: [
      { role: "system", content: "You are the friendly assistant of Brewly coffee shop. Keep answers short." },
      { role: "user", content: prompt },
    ],
    options: { temperature: 0 },
  });

  return response.message.content;
}

// First, see the problem: the AI alone just guesses.
const noRag = await ollama.chat({
  model: MODEL,
  messages: [{ role: "user", content: "What time does Brewly coffee shop open on Sunday?" }],
});
console.log("WITHOUT RAG:", noRag.message.content, "\n");

const questions = [
  "What time does Brewly open on Sunday?",
  "How much is a cappuccino with oat milk?",
  "Can I bring my dog?",
  "How do I get a free drink?",
];

for (const question of questions) {
  console.log(`Q: ${question}`);
  console.log(`A: ${await ask(question)}\n`);
}
