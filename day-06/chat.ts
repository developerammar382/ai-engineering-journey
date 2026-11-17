import ollama from "ollama";
import { getMessages, addMessage, clearMessages } from "./conversation.ts";

async function askAI(question: string) {
  try {
    // Each extraction is a separate job, so we start fresh every time.
    // Otherwise old answers stay in the history and can confuse the model.
    clearMessages();

    // add the user's question to the conversation before sending it.
    addMessage({
      role: "user",
      content: question,
    });

    // stream: false because we need the complete JSON before we can parse it.
    const response = await ollama.chat({
      model: "qwen2.5:3b",
      messages: getMessages(),
      stream: false,
    });

    addMessage({
      role: "assistant",
      content: response.message.content,
    });

    return response.message.content;
  } catch (error) {
    console.error(error);
    return "Something went wrong.";
  }
}

// export function for use in extract.ts
export { askAI };
