import ollama, { type Message } from "ollama";
import { calculate, calculateTool } from "./tools.ts";

// On Day 8 our code decided when to use the calculator ("calculate ...").
// Today the AI decides by itself. This is called "tool calling" (or "function calling").

const MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:3b";

async function ask(question: string) {
  const messages: Message[] = [{ role: "user", content: question }];

  // Step 1: send the question AND the list of tools the AI is allowed to use.
  const response = await ollama.chat({ model: MODEL, messages, tools: [calculateTool], options: { temperature: 0 } });
  messages.push(response.message);

  const toolCalls = response.message.tool_calls ?? [];

  // No tool needed? Then the AI answered directly.
  if (toolCalls.length === 0) {
    console.log("(no tool used)");
    return response.message.content;
  }

  // Step 2: the AI asked for a tool. We run it and send back the result.
  for (const call of toolCalls) {
    console.log(`(AI wants to call ${call.function.name} with`, call.function.arguments, ")");

    if (call.function.name === "calculate") {
      const result = calculate(call.function.arguments.expression);
      console.log(`(tool result: ${result})`);
      messages.push({ role: "tool", content: result, tool_name: "calculate" });
    }
  }

  // Step 3: ask again. Now the AI can see the tool result and write a final answer.
  const finalResponse = await ollama.chat({ model: MODEL, messages, options: { temperature: 0 } });
  return finalResponse.message.content;
}

console.log("Q: How many seconds are in 3.5 hours?");
console.log("A:", await ask("How many seconds are in 3.5 hours?"), "\n");

console.log("Q: Who wrote Romeo and Juliet?");
console.log("A:", await ask("Who wrote Romeo and Juliet?"));
