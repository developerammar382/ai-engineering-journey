// So far the "ollama" package did all the work for us. But what does it really do?
// It just sends HTTP requests to Ollama's REST API, running on localhost:11434.
// Today we call that API ourselves with fetch (built into Node 18+). No package needed.
//
// Every AI provider (OpenAI, Anthropic, Google...) works the same way: an HTTP API + JSON.

// Read the address from an environment variable, with a default.
// Try: OLLAMA_HOST=http://127.0.0.1:11434 npx tsx day-22/rest-api.ts
const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:3b";

// ---------- 1. List installed models (GET) ----------
const tagsResponse = await fetch(`${OLLAMA_HOST}/api/tags`);
const tags = await tagsResponse.json();
console.log("Installed models:", tags.models.map((m: { name: string }) => m.name).join(", "));

// ---------- 2. Chat without streaming (POST) ----------
const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: MODEL,
    messages: [{ role: "user", content: "Say hello in 5 words." }],
    stream: false,
  }),
});

if (!response.ok) {
  console.log("Request failed:", response.status, await response.text());
  process.exit(1);
}

const data = await response.json();
console.log("\nNon-streaming answer:", data.message.content);
console.log("Raw JSON keys:", Object.keys(data).join(", "));

// ---------- 3. Chat with streaming ----------
// With stream: true, Ollama sends one small JSON object per line ("NDJSON"):
//   {"message":{"content":"Once"},"done":false}
//   {"message":{"content":" upon"},"done":false}
//   ...
//   {"done":true, ...}
const streamResponse = await fetch(`${OLLAMA_HOST}/api/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: MODEL,
    messages: [{ role: "user", content: "Write a 2-sentence story about a robot." }],
    stream: true,
  }),
});

process.stdout.write("\nStreaming answer: ");

const reader = streamResponse.body!.getReader();
const decoder = new TextDecoder();
let buffer = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  // A network piece can end in the middle of a line, so we collect text in a buffer
  // and only handle complete lines.
  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split("\n");
  buffer = lines.pop()!; // last part may be incomplete, keep it for next time

  for (const line of lines) {
    if (!line.trim()) continue;
    const chunk = JSON.parse(line);
    if (chunk.message) process.stdout.write(chunk.message.content);
  }
}
console.log();
