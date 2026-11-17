// From Day 18: split text into chunks of words, with some overlap.
// Notes have many short lines and headings, so word chunks work better than paragraphs here.
export function chunkText(text: string, chunkSize = 120, overlap = 20): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];

  for (let start = 0; start < words.length; start += chunkSize - overlap) {
    chunks.push(words.slice(start, start + chunkSize).join(" "));
    if (start + chunkSize >= words.length) break;
  }

  return chunks;
}
