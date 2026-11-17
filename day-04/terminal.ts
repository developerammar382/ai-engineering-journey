import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { askAI } from "./chat.ts";
import { getMessages, clearMessages } from "./conversation.ts";

// stdin = Standard Input
// This is where our program receives input from the user (keyboard).
//
// stdout = Standard Output
// This is where our program sends output to the terminal (screen).
const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

console.log('Commands: "history", "clear", "exit"\n');

// Ask the user a question and wait for their response.
// "await" pauses the code until the user types something and presses Enter.
while (true) {
  const question = await rl.question("You: ");

  if (!question.trim()) {
    continue;
  }

  const input = question.trim().toLowerCase();

  // Show all previous messages
  if (input === "history") {
    console.log("\n--- History ---");
    getMessages().forEach((message) => {
      console.log(`${message.role}: ${message.content}`);
    });
    console.log("---------------\n");
    continue;
  }

  // Clear memory except system prompt
  if (input === "clear") {
    clearMessages();
    console.log("Conversation history cleared.");
    continue;
  }

  // Stop the program
  if (input === "exit") {
    break;
  }

  // askAI streams the reply to the terminal while it is being generated,
  // so we don't print it again here. We just add a blank line after it.
  process.stdout.write("AI: ");
  await askAI(question);
  console.log("\n");
}

// Close the readline interface when we are done.
// This releases the terminal connection and lets the program exit.
rl.close();
