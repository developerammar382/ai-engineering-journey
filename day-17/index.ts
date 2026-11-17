import { VectorStore } from "./vector-store.ts";

const STORE_FILE = new URL("./store.json", import.meta.url);

const facts = [
  "Ollama lets you run large language models on your own computer.",
  "TypeScript is JavaScript with types.",
  "Node.js lets you run JavaScript outside the browser.",
  "Embeddings turn text into vectors of numbers.",
  "Cosine similarity measures how similar two vectors are.",
  "A system prompt tells the AI how to behave.",
  "Streaming shows the AI's answer while it is being generated.",
  "Tool calling lets the AI ask our code to run a function.",
  "The context window is the max amount of text a model can read at once.",
  "Git tracks changes in your code over time.",
];

const store = new VectorStore();

// First run: embed everything and save. Next runs: just load the file (much faster).
if (await store.load(STORE_FILE)) {
  console.log(`Loaded ${store.items.length} items from store.json`);
} else {
  console.log("Embedding facts for the first time...");
  await store.add(facts);
  await store.save(STORE_FILE);
  console.log(`Saved ${store.items.length} items to store.json`);
}

const queries = ["How can I run an AI model on my laptop?", "What happens when my chat gets too long?", "version control"];

for (const query of queries) {
  console.log(`\n🔍 ${query}`);
  for (const result of await store.search(query, 2)) {
    console.log(`  ${result.score.toFixed(3)}  ${result.text}`);
  }
}
