import ollama, { type Message } from "ollama";
import { tools, toolFunctions } from "./tools.ts";

// Some questions need more than one tool, sometimes one after another.
// So instead of "call tool once, then answer", we use a LOOP:
//
//   ask AI -> AI wants tools? -> run them -> send results -> ask AI again -> ...
//
// We stop when the AI answers without asking for a tool.

const MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:3b";
const MAX_STEPS = 5; // safety limit so we never loop forever

async function ask(question: string) {
  const messages: Message[] = [
    { role: "system", content: "You are a helpful assistant. Use tools when they help. Keep answers short." },
    { role: "user", content: question },
  ];

  for (let step = 1; step <= MAX_STEPS; step++) {
    const response = await ollama.chat({ model: MODEL, messages, tools, options: { temperature: 0 } });
    messages.push(response.message);

    const toolCalls = response.message.tool_calls ?? [];

    // Final answer reached.
    if (toolCalls.length === 0) {
      if (response.message.content.trim()) {
        return response.message.content;
      }

      // Small models sometimes reply with an EMPTY answer when tools are available
      // but none of them fit the question. Fix: remove the empty reply and ask once more without tools.
      messages.pop();
      const retry = await ollama.chat({ model: MODEL, messages, options: { temperature: 0 } });
      return retry.message.content;
    }

    for (const call of toolCalls) {
      const { name, arguments: args } = call.function;
      const toolFunction = toolFunctions[name];
      const result = toolFunction ? toolFunction(args) : `Error: unknown tool ${name}`;

      console.log(`  [step ${step}] ${name}(${JSON.stringify(args)}) -> ${result}`);
      messages.push({ role: "tool", content: result, tool_name: name });
    }
  }

  return "Sorry, I needed too many steps to answer that.";
}

const questions = [
  "What's the weather in Lahore?",
  "What time is it right now?",
  "What's the weather in London and Tokyo?",
  "If I have 3 boxes with 48 apples each, how many apples do I have?",
  "Tell me a fun fact about cats.",
];

for (const question of questions) {
  console.log(`\nQ: ${question}`);
  console.log(`A: ${await ask(question)}`);
}
