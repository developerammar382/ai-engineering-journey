import ollama from "ollama";

// Yesterday: text -> numbers. Today: how do we compare two lists of numbers?
//
// Cosine similarity measures how much two vectors point in the same direction:
//    1.0  = same meaning
//    ~0   = unrelated
// It's the most common way to compare embeddings.

const EMBED_MODEL = "nomic-embed-text";

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

async function embed(texts: string[]): Promise<number[][]> {
  const response = await ollama.embed({ model: EMBED_MODEL, input: texts });
  return response.embeddings;
}

// ---------- Part 1: compare pairs ----------
const pairs = [
  ["cat", "kitten"],
  ["cat", "car"],
  ["How do I reset my password?", "I forgot my login details"],
  ["How do I reset my password?", "What's the weather today?"],
];

console.log("--- Comparing pairs ---");
for (const [a, b] of pairs) {
  const [vectorA, vectorB] = await embed([a, b]);
  console.log(cosineSimilarity(vectorA, vectorB).toFixed(3), ` "${a}"  vs  "${b}"`);
}

// ---------- Part 2: semantic search ----------
// Find the sentence that best matches a question, by MEANING, not by keywords.
const sentences = [
  "The Eiffel Tower is in Paris.",
  "Python is a popular programming language.",
  "Bananas are rich in potassium.",
  "The Great Wall of China is very long.",
  "JavaScript runs in the browser.",
  "Apples and oranges are fruits.",
];

const question = "Which coding languages are there?";

// Tip: nomic-embed-text works better when we tell it what each text is for.
// Documents get "search_document: " in front, questions get "search_query: ".
const sentenceVectors = await embed(sentences.map((s) => `search_document: ${s}`));
const [questionVector] = await embed([`search_query: ${question}`]);

const results = sentences
  .map((sentence, i) => ({ sentence, score: cosineSimilarity(questionVector, sentenceVectors[i]) }))
  .sort((a, b) => b.score - a.score);

console.log(`\n--- Search: "${question}" ---`);
for (const { sentence, score } of results) {
  console.log(score.toFixed(3), sentence);
}
console.log('\nNotice: no sentence contains the word "coding", but the right ones are on top.');
