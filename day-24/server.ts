import http from "node:http";
import { readFile } from "node:fs/promises";
import ollama, { type Message } from "ollama";

// Day 23's server + a web page.
//   GET  /       -> sends public/index.html
//   POST /chat   -> streams the AI's answer back as plain text, piece by piece
//
// The BROWSER keeps the chat history and sends all messages each time.
// That way the server doesn't need to remember anything (it stays "stateless").

const PORT = 3000;
const MODEL = "qwen2.5:3b";

async function readJson(req: http.IncomingMessage): Promise<any> {
  let body = "";
  for await (const chunk of req) body += chunk;
  return JSON.parse(body);
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    const html = await readFile(new URL("./public/index.html", import.meta.url), "utf-8");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(html);
  }

  if (req.method === "POST" && req.url === "/chat") {
    try {
      const { messages } = (await readJson(req)) as { messages: Message[] };

      const stream = await ollama.chat({
        model: MODEL,
        messages: [{ role: "system", content: "You are a friendly assistant. Keep answers short." }, ...messages],
        stream: true,
      });

      // Send each piece as soon as we get it (Day 4 streaming, but over HTTP).
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      for await (const chunk of stream) {
        res.write(chunk.message.content);
      }
      return res.end();
    } catch (error) {
      console.error(error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      return res.end("Sorry, something went wrong.");
    }
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`Open http://localhost:${PORT} in your browser`);
});
