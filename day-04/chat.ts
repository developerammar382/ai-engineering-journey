import ollama from "ollama";
import { getMessages, addMessage } from "./conversation.ts";

async function askAI(question: string) {
  try {
    // Add the user's question to the conversation before sending it.
    // The AI needs previous messages as context because it doesn't remember by itself.
    addMessage({
      role: "user",
      content: question,
    });

    // Send the complete conversation to Ollama.
    // stream: true means we get the answer in small pieces (chunks) as it is generated.
    const stream = await ollama.chat({
      model: process.env.OLLAMA_MODEL ?? "qwen2.5:3b",
      messages: getMessages(),
      stream: true,
    });

    let fullResponse = "";

    for await (const chunk of stream) {
      // Show the chunk to the user
      process.stdout.write(chunk.message.content);

      // Save the chunk for later
      fullResponse += chunk.message.content;
    }

    // Save the AI response so the next question can continue this conversation
    addMessage({
      role: "assistant",
      content: fullResponse,
    });

    return fullResponse;
  } catch (error) {
    console.error(error);
    return "Something went wrong.";
  }
}

// export function for use in terminal.ts to connect the askAI function to the command line interface
export { askAI };
