import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import ollama from "ollama";
import { loadHistory, saveHistory, resetHistory } from "./history.ts";

let messages = await loadHistory();

const rl = readline.createInterface({ input: stdin, output: stdout });

// messages[0] is the system prompt, so a fresh chat has length 1.
if (messages.length > 1) {
  console.log(`Loaded ${messages.length - 1} old messages. I remember our last chat!`);
} else {
  console.log("New chat. Tell me something about yourself, then restart the program.");
}
console.log('Commands: "reset", "exit"\n');

while (true) {
  const question = (await rl.question("You: ")).trim();

  if (!question) continue;
  if (question === "exit") break;

  if (question === "reset") {
    messages = await resetHistory();
    console.log("Memory wiped.\n");
    continue;
  }

  messages.push({ role: "user", content: question });

  process.stdout.write("AI: ");
  const stream = await ollama.chat({ model: process.env.OLLAMA_MODEL ?? "qwen2.5:3b", messages, stream: true });

  let reply = "";
  for await (const chunk of stream) {
    process.stdout.write(chunk.message.content);
    reply += chunk.message.content;
  }
  console.log("\n");

  messages.push({ role: "assistant", content: reply });

  // Save after every message, so nothing is lost if the program crashes.
  await saveHistory(messages);
}

rl.close();
