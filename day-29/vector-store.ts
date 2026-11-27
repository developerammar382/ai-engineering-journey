import ollama from "ollama";
import { readFile, writeFile } from "node:fs/promises";

// A "vector database" stores texts together with their embeddings, so we can search them.
// Real ones (Pinecone, Chroma, pgvector...) are fast with millions of items.
// To understand the idea, we build a tiny one: an array + a JSON file.

const EMBED_MODEL = process.env.EMBED_MODEL ?? "nomic-embed-text";

export type Item = {
  text: string;
  vector: number[];
};

export type SearchResult = {
  text: string;
  score: number;
};

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let lengthA = 0;
  let lengthB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    lengthA += a[i] * a[i];
    lengthB += b[i] * b[i];
  }
  return dot / (Math.sqrt(lengthA) * Math.sqrt(lengthB));
}

export class VectorStore {
  items: Item[] = [];

  // Embed the texts and keep them.
  // nomic-embed-text works best with a prefix that says what the text is for (see Day 16).
  async add(texts: string[]) {
    const input = texts.map((text) => `search_document: ${text}`);
    const response = await ollama.embed({ model: EMBED_MODEL, input });
    texts.forEach((text, i) => {
      this.items.push({ text, vector: response.embeddings[i] });
    });
  }

  // Return the `topK` items most similar to the query.
  async search(query: string, topK = 3): Promise<SearchResult[]> {
    const response = await ollama.embed({ model: EMBED_MODEL, input: `search_query: ${query}` });
    const queryVector = response.embeddings[0];

    return this.items
      .map((item) => ({ text: item.text, score: cosineSimilarity(queryVector, item.vector) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  // Embedding takes time, so we save the results and reuse them next time.
  async save(file: URL) {
    await writeFile(file, JSON.stringify(this.items));
  }

  async load(file: URL): Promise<boolean> {
    try {
      this.items = JSON.parse(await readFile(file, "utf-8"));
      return true;
    } catch {
      return false; // no saved file yet
    }
  }
}
