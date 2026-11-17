import http from "node:http";
import { indexDocs, ask } from "./assistant.ts";

// Final project, part 1: the backend.
// A small API that answers questions about a folder of documents (Day 20 RAG + Day 23 server).
//
//   GET  /      -> status + how many chunks are indexed
//   POST /ask   { "question": "..." }  ->  { "answer": "...", "sources": ["menu.md"] }

const PORT = 3000;
const DOCS_FOLDER = new URL("./docs/", import.meta.url);

console.log("Indexing documents...");
const chunkCount = await indexDocs(DOCS_FOLDER);
console.log(`Indexed ${chunkCount} chunks.`);

async function readJson(req: http.IncomingMessage): Promise<any> {
  let body = "";
  for await (const chunk of req) body += chunk;
  return JSON.parse(body);
}

function sendJson(res: http.ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    return sendJson(res, 200, { status: "ok", chunks: chunkCount });
  }

  if (req.method === "POST" && req.url === "/ask") {
    let question: unknown;
    try {
      ({ question } = await readJson(req));
    } catch {
      return sendJson(res, 400, { error: "Body must be JSON" });
    }

    if (typeof question !== "string" || !question.trim()) {
      return sendJson(res, 400, { error: 'Send JSON like: { "question": "..." }' });
    }
    if (question.length > 500) {
      return sendJson(res, 400, { error: "Question is too long (max 500 characters)" }); // Day 27
    }

    try {
      const result = await ask(question);
      console.log(`Q: ${question} -> ${result.sources.join(", ") || "no sources"}`);
      return sendJson(res, 200, result);
    } catch (error) {
      console.error(error);
      return sendJson(res, 500, { error: "The AI is not available right now" });
    }
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Docs Assistant API on http://localhost:${PORT}`);
  console.log(
    `Try: curl -X POST http://localhost:${PORT}/ask -H "Content-Type: application/json" -d '{"question":"When are you open?"}'`,
  );
});
