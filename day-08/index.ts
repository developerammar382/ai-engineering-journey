import ollama from "ollama";
import { askAI } from "./chat.ts";

// First, see the problem: ask the AI to do the math by itself.
// Small models often get big multiplications wrong.
const direct = await ollama.chat({
  model: "qwen2.5:3b",
  messages: [{ role: "user", content: "What is 382349230 * 2 / 12384235 - 4 + 3? Only the number." }],
});
console.log("AI alone:      ", direct.message.content);

// Now let our tool do it.
console.log("With the tool: ", await askAI("calculate 382349230 * 2 / 12384235 - 4 + 3"));

console.log();
console.log(await askAI("calculate 25*30"));
console.log(await askAI("calculate process.exit()")); // blocked by our safety check
console.log(await askAI("What is the capital of France?")); // normal question goes to the AI
