import readline from "node:readline/promises";
import {stdin, stdout} from "node:process";
import { askAI } from "./chat.js";

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

  if (question === "exit") {
    break;
  }

  await askAI(question);
}

// Close the readline interface when we are done.
// This releases the terminal connection and lets the program exit.
rl.close();