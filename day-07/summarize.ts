import ollama from "ollama";
import { readFile } from "node:fs/promises";

// Mini project: summarize any text file from the terminal.
// Usage: npx tsx day-07/summarize.ts day-07/sample.txt

const filePath = process.argv[2];

if (!filePath) {
  console.log("Please give me a file to summarize.");
  console.log("Example: npx tsx day-07/summarize.ts day-07/sample.txt");
  process.exit(1);
}

let text: string;
try {
  text = await readFile(filePath, "utf-8");
} catch {
  console.log(`Could not read file: ${filePath}`);
  process.exit(1);
}

// Small models have a limited context window, so very long files won't fit.
// For now we just cut the text. (On Day 18 we learn a better way: chunking.)
const MAX_CHARS = 12000;
if (text.length > MAX_CHARS) {
  console.log(`File is long, only using the first ${MAX_CHARS} characters.\n`);
  text = text.slice(0, MAX_CHARS);
}

const stream = await ollama.chat({
  model: process.env.OLLAMA_MODEL ?? "qwen2.5:3b",
  messages: [
    {
      role: "system",
      content:
        "You summarize text. Reply in this format:\n" +
        "Summary: <2-3 sentences>\n" +
        "Key points:\n- <point>\n- <point>\n- <point>",
    },
    { role: "user", content: text },
  ],
  stream: true,
  options: { temperature: 0.3 },
});

for await (const chunk of stream) {
  process.stdout.write(chunk.message.content);
}
console.log();
