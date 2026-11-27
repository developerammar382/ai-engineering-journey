import ollama from "ollama";

// An "embedding" turns text into a list of numbers (a vector).
// Texts with similar MEANING get similar numbers, even if they use different words.
// This is the base of semantic search and RAG (Week 3).
//
// We use a special small model made only for embeddings:
//   ollama pull nomic-embed-text

const EMBED_MODEL = process.env.EMBED_MODEL ?? "nomic-embed-text";

const response = await ollama.embed({
  model: EMBED_MODEL,
  input: "I love programming in TypeScript",
});

const vector = response.embeddings[0];

console.log("Text:    I love programming in TypeScript");
console.log("Length: ", vector.length, "numbers");
console.log("First 8:", vector.slice(0, 8).map((n) => n.toFixed(4)));

// We can embed many texts in one call by passing an array.
const many = await ollama.embed({
  model: EMBED_MODEL,
  input: ["cat", "kitten", "car"],
});

console.log("\nEmbedded 3 words at once. Each one has", many.embeddings[0].length, "numbers.");
console.log("cat:   ", many.embeddings[0].slice(0, 5).map((n) => n.toFixed(4)));
console.log("kitten:", many.embeddings[1].slice(0, 5).map((n) => n.toFixed(4)));
console.log("car:   ", many.embeddings[2].slice(0, 5).map((n) => n.toFixed(4)));
console.log("\nHard to compare by eye... tomorrow we measure how close they are with math.");
