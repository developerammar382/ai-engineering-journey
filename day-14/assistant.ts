import ollama, { type Message } from "ollama";
import { tools, toolFunctions } from "./tools.ts";

const MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:3b";
const MAX_STEPS = 5;
const MAX_HISTORY = 20; // Day 12: don't let the history grow forever

const messages: Message[] = [
  {
    role: "system",
    content:
      "You are a personal assistant in the terminal. Use tools for math, time and notes. " +
      "Keep answers short and friendly. Never mention tool names to the user.",
  },
];

export function clearChat() {
  messages.length = 1;
}

// The tool loop from Day 10, now with a conversation that continues between questions.
export async function chat(userMessage: string): Promise<string> {
  messages.push({ role: "user", content: userMessage });

  try {
    for (let step = 0; step < MAX_STEPS; step++) {
      const response = await ollama.chat({ model: MODEL, messages, tools, options: { temperature: 0 } });
      messages.push(response.message);

      const toolCalls = response.message.tool_calls ?? [];

      if (toolCalls.length === 0) {
        if (!response.message.content.trim()) {
          // Small model returned an empty reply (see Day 10). Ask again without tools.
          messages.pop();
          const retry = await ollama.chat({ model: MODEL, messages, options: { temperature: 0 } });
          messages.push(retry.message);
        }
        trimHistory();
        return messages[messages.length - 1].content;
      }

      for (const call of toolCalls) {
        const { name, arguments: args } = call.function;
        const toolFunction = toolFunctions[name];
        const result = toolFunction ? await toolFunction(args) : `Error: unknown tool ${name}`;

        console.log(`  🔧 ${name}(${JSON.stringify(args)})`);
        messages.push({ role: "tool", content: result, tool_name: name });
      }
    }
    return "Sorry, that took too many steps.";
  } catch (error) {
    // Day 13: show a friendly message instead of crashing.
    const message = error instanceof Error ? error.message : String(error);
    return `Something went wrong: ${message}`;
  }
}

function trimHistory() {
  if (messages.length > MAX_HISTORY) {
    // keep the system prompt + the newest messages
    messages.splice(1, messages.length - MAX_HISTORY);
  }
}
