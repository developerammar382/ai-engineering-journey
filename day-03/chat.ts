import ollama from "ollama";
import messages from "./conversation.ts";

async function askAI(question: string) {
  // Add the user's question to the conversation before sending it.
  // The AI needs previous messages as context because it doesn't remember by itself.
  messages.push({
    role: "user",
    content: question,
  });

  // Send the complete conversation to Ollama.
  // This helps the model understand what was discussed before.
  const response = await ollama.chat({
    model: process.env.OLLAMA_MODEL ?? "qwen2.5:3b",
    messages,
  });

  // Save the AI response so the next question can continue this conversation.
  messages.push(response.message);

  // Showing only the latest AI answer.
  console.log("AI:", response.message.content);
}

// export function for use in terminal.ts to connect the askAI function to the command line interface
export { askAI };
