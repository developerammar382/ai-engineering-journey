import ollama from "ollama";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { VectorStore } from "./vector-store.ts";
import { chunkText } from "./chunk.ts";

const MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:3b";
const MIN_SCORE = 0.5;
const STORE_FILE = new URL("./store.json", import.meta.url);

// Which files to index:
//   - with a folder argument: every .md and .txt file in that folder
//   - without: this repo's own README files (my learning journal!)
async function findFiles(folder?: string): Promise<string[]> {
  if (folder) {
    const names = await readdir(folder);
    return names.filter((n) => n.endsWith(".md") || n.endsWith(".txt")).map((n) => path.join(folder, n));
  }

  // fileURLToPath turns this file's URL into a normal path, ".." goes up to the repo folder.
  const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
  const files = [path.join(repoRoot, "README.md")];
  for (const name of (await readdir(repoRoot)).sort()) {
    if (name.startsWith("day-")) files.push(path.join(repoRoot, name, "README.md"));
  }
  return files;
}

export async function buildIndex(folder: string | undefined, rebuild: boolean): Promise<VectorStore> {
  const store = new VectorStore();

  // Embedding takes a while, so reuse the saved index unless asked to rebuild.
  if (!rebuild && (await store.load(STORE_FILE))) {
    console.log(`Loaded ${store.items.length} chunks from store.json (use --rebuild after changing notes)`);
    return store;
  }

  for (const file of await findFiles(folder)) {
    let text: string;
    try {
      text = await readFile(file, "utf-8");
    } catch {
      continue; // e.g. a day folder without a README
    }
    const source = path.relative(process.cwd(), file);
    const chunks = chunkText(text).map((chunk) => `[${source}] ${chunk}`);
    await store.add(chunks);
    console.log(`  indexed ${source} (${chunks.length} chunks)`);
  }

  await store.save(STORE_FILE);
  console.log(`Saved ${store.items.length} chunks to store.json`);
  return store;
}

// Same idea as Day 20, but the answer is streamed (Day 4) while it's generated.
export async function askNotes(store: VectorStore, question: string) {
  const results = (await store.search(question, 4)).filter((r) => r.score >= MIN_SCORE);

  if (results.length === 0) {
    console.log("AI: I couldn't find anything about that in your notes.");
    return;
  }

  const context = results.map((r) => r.text).join("\n\n---\n\n");

  const stream = await ollama.chat({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You answer questions about the user's notes. Use ONLY the notes below. " +
          "If the answer is not in the notes, say so. Keep answers short.\n\nNotes:\n" +
          context,
      },
      { role: "user", content: question },
    ],
    stream: true,
    options: { temperature: 0 },
  });

  process.stdout.write("AI: ");
  for await (const chunk of stream) {
    process.stdout.write(chunk.message.content);
  }

  const sources = [...new Set(results.map((r) => r.text.match(/^\[(.+?)\]/)?.[1]))];
  console.log(`\n   📄 ${sources.join(", ")}`);
}
