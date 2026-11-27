import http from "node:http";
import ollama from "ollama";

// Until now our AI only worked in the terminal. Today we put it behind an HTTP API,
// so any app (a website, a mobile app, another server) can use it.
// We use Node's built-in "http" module: no Express, no extra packages.

const PORT = 3000;
const MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:3b";

// Reads the full request body (it arrives in pieces) and parses it as JSON.
async function readJson(req: http.IncomingMessage): Promise<any> {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
  }
  return JSON.parse(body);
}

function sendJson(res: http.ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);

  // GET /  -> simple check that the server is running
  if (req.method === "GET" && req.url === "/") {
    return sendJson(res, 200, { status: "ok", model: MODEL });
  }

  // POST /chat  { "message": "..." }  ->  { "reply": "..." }
  if (req.method === "POST" && req.url === "/chat") {
    let message: unknown;
    try {
      ({ message } = await readJson(req));
    } catch {
      return sendJson(res, 400, { error: "Body must be JSON" });
    }

    if (typeof message !== "string" || !message.trim()) {
      return sendJson(res, 400, { error: 'Send JSON like: { "message": "Hello" }' });
    }

    try {
      const response = await ollama.chat({
        model: MODEL,
        messages: [
          { role: "system", content: "You are a helpful assistant. Keep answers short." },
          { role: "user", content: message },
        ],
      });
      return sendJson(res, 200, { reply: response.message.content });
    } catch (error) {
      console.error(error);
      return sendJson(res, 500, { error: "The AI is not available right now" });
    }
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`AI server running on http://localhost:${PORT}`);
  console.log(`Try: curl -X POST http://localhost:${PORT}/chat -H "Content-Type: application/json" -d '{"message":"Hi!"}'`);
});
