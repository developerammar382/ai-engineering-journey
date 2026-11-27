import ollama from "ollama";
import { readFile, readdir } from "node:fs/promises";
import { VectorStore } from "./vector-store.ts";
import { chunkByParagraph } from "./chunk.ts";

// The "brain" of the Docs Assistant: Day 20's RAG, packed into two functions
// that the server can call.

const MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:3b";
const MIN_SCORE = 0.55;
const NOT_FOUND = "Sorry, I couldn't find that in the documents.";

export type Answer = {
  answer: string;
  sources: string[];
};

const store = new VectorStore();

// Load every .md / .txt file in the folder, split into chunks, embed.
export async function indexDocs(folder: URL) {
  for (const fileName of await readdir(folder)) {
    if (!fileName.endsWith(".md") && !fileName.endsWith(".txt")) continue;

    const text = await readFile(new URL(fileName, folder), "utf-8");
    const chunks = chunkByParagraph(text).map((chunk) => `[${fileName}] ${chunk}`);
    await store.add(chunks);
  }
  return store.items.length;
}

export async function ask(question: string): Promise<Answer> {
  const results = (await store.search(question, 4)).filter((r) => r.score >= MIN_SCORE);

  if (results.length === 0) {
    return { answer: NOT_FOUND, sources: [] };
  }

  const context = results.map((r) => r.text).join("\n\n");

  const response = await ollama.chat({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You answer questions using ONLY the documents below. " +
          `If the answer is not in the documents, reply exactly: "${NOT_FOUND}" ` +
          "Keep answers short and friendly, but always include specific details " +
          "like addresses, prices and times.\n\nDocuments:\n" +
          context,
      },
      { role: "user", content: question },
    ],
    options: { temperature: 0 },
  });

  const answer = response.message.content.trim();
  const sources = answer === NOT_FOUND ? [] : [...new Set(results.map((r) => r.text.match(/^\[(.+?)\]/)![1]))];

  return { answer, sources };
}
