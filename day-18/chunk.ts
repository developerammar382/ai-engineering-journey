import { readFile } from "node:fs/promises";

// Real documents are long. We can't embed a whole book as ONE vector:
//   - the meaning gets "blurry" (one vector for 50 topics)
//   - the model can only read so much text at once (Day 12)
// So we split documents into small pieces called "chunks".
//
// Overlap: each chunk repeats the last few words of the previous one,
// so a sentence cut in the middle still appears whole in at least one chunk.

export function chunkText(text: string, chunkSize = 80, overlap = 15): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];

  for (let start = 0; start < words.length; start += chunkSize - overlap) {
    chunks.push(words.slice(start, start + chunkSize).join(" "));
    if (start + chunkSize >= words.length) break;
  }

  return chunks;
}

// Another simple way: split by paragraphs (empty lines).
// Paragraphs usually talk about one idea, so they make natural chunks.
export function chunkByParagraph(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter((paragraph) => paragraph.length > 0);
}

// Only run the demo when this file is run directly (not when imported).
if (import.meta.url === `file://${process.argv[1]}`) {
  const text = await readFile(new URL("./article.md", import.meta.url), "utf-8");

  console.log(`Article: ${text.split(/\s+/).length} words\n`);

  const wordChunks = chunkText(text, 80, 15);
  console.log(`--- By words (80 words, 15 overlap): ${wordChunks.length} chunks ---`);
  wordChunks.forEach((chunk, i) => {
    console.log(`\n[${i + 1}] ${chunk.slice(0, 120)}...`);
  });

  const paragraphChunks = chunkByParagraph(text);
  console.log(`\n--- By paragraph: ${paragraphChunks.length} chunks ---`);
  paragraphChunks.forEach((chunk, i) => {
    console.log(`\n[${i + 1}] ${chunk.slice(0, 120)}...`);
  });
}
