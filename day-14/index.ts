import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { chat, clearChat } from "./assistant.ts";

// Mini project: a personal assistant in the terminal.
// It combines everything from Week 2: tools, a tool loop, saved notes, history limits, error handling.

const rl = readline.createInterface({ input: stdin, output: stdout });

console.log("Personal Assistant 🤖");
console.log('Try: "remind me to buy milk", "show my notes", "what is 15% of 2400?", "what time is it?"');
console.log('Commands: "clear", "exit"\n');

while (true) {
  const input = (await rl.question("You: ")).trim();

  if (!input) continue;
  if (input === "exit") break;
  if (input === "clear") {
    clearChat();
    console.log("Chat cleared (your notes are still saved).\n");
    continue;
  }

  const reply = await chat(input);
  console.log(`AI: ${reply}\n`);
}

rl.close();
