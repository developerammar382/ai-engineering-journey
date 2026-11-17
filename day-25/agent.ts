import ollama, { type Message } from "ollama";
import { tools, toolFunctions } from "./tools.ts";

// An "agent" is the tool loop from Day 10, but with a GOAL instead of a question.
// The AI decides by itself which steps to take:
//
//   think -> act (call a tool) -> observe (read the result) -> think again -> ... -> done
//
// Usage: npx tsx day-25/agent.ts "your goal here"

const MODEL = "qwen2.5:3b";
const MAX_STEPS = 10;

const goal =
  process.argv[2] ??
  "Read every file in the workspace. Then write a file called summary.md with a short summary of each file.";

const messages: Message[] = [
  {
    role: "system",
    content:
      "You are a helpful agent that works with files in a workspace. " +
      "Use the tools to reach the goal, one step at a time. " +
      "Start by listing the files. When the goal is done, reply with a short final message and no tool calls.",
  },
  { role: "user", content: `Goal: ${goal}` },
];

console.log(`🎯 Goal: ${goal}\n`);

for (let step = 1; step <= MAX_STEPS; step++) {
  const response = await ollama.chat({ model: MODEL, messages, tools, options: { temperature: 0 } });
  messages.push(response.message);

  const toolCalls = response.message.tool_calls ?? [];

  // The agent's "thinking" (if it wrote any text before acting)
  if (response.message.content.trim()) {
    console.log(`💭 ${response.message.content.trim()}`);
  }

  if (toolCalls.length === 0) {
    console.log(`\n✅ Done in ${step} steps.`);
    break;
  }

  for (const call of toolCalls) {
    const { name, arguments: args } = call.function;
    const shortArgs = JSON.stringify(args).slice(0, 80);
    console.log(`🔧 step ${step}: ${name}(${shortArgs})`);

    const toolFunction = toolFunctions[name];
    const result = toolFunction ? await toolFunction(args) : `Error: unknown tool ${name}`;

    console.log(`👀 ${result.split("\n")[0].slice(0, 80)}${result.includes("\n") ? " ..." : ""}`);
    messages.push({ role: "tool", content: result, tool_name: name });
  }

  if (step === MAX_STEPS) console.log("\n⛔ Stopped: too many steps.");
}
