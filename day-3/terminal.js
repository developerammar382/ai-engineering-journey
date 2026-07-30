import readline from "node:readline/promises";
import {stdin, stdout} from "node:process";
import { askAI } from "./chat.js";
import {getMessages, clearMessages} from "./conversation.js";

// stdin = Standard Input
// This is where our program receives input from the user (keyboard).
//
// stdout = Standard Output
// This is where our program sends output to the terminal (screen).
const rl = readline.createInterface({
    input: stdin,
    output: stdout,
});

// Ask the user a question and wait for their response.
// "await" pauses the code until the user types something and presses Enter.
while (true) {
  const question = await rl.question("You: ");

  if (!question.trim()) {
    continue;
  }

  const input = question.trim().toLowerCase();

  // Show all previous messages
  if (input === "history"){
    console.log("Conversation history:");
    getMessages().forEach((message) => {
      console.log(`${message.role}: ${message.content}`);
    });
    continue;
  }

  // Clear memory except system prompt
  if (input === "clear") {
    clearMessages(); // call the clearMessages function to clear the conversation history

    console.log("Conversation history cleared.");
    continue;
  }

  // Stop the program
  if (input === "exit") {
    break;
  }

  // send question to AI and print reply
  const reply = await askAI(question);
  console.log("AI:", reply);
}

// Close the readline interface when we are done.
// This releases the terminal connection and lets the program exit.
rl.close();