import ollama from "ollama";
import { getMessages, addMessage } from "./conversation.ts";
import { calculate } from "./tool.ts";

async function askAI(question: string) {
  try {
    // add the user's question to the conversation before sending it.
    addMessage({
      role: "user",
      content: question,
    });

    // If the message starts with "calculate", WE run the tool instead of asking the AI.
    // This is "manual routing": our code decides when to use a tool.
    if (question.startsWith("calculate ")) {
      const expression = question.replace("calculate ", "");
      const result = calculate(expression);
      const answer = result === null ? "Sorry, I can't calculate that." : `Answer: ${result}`;

      // Save the answer too, so the history stays complete (user -> assistant).
      addMessage({ role: "assistant", content: answer });
      return answer;
    }

    // Everything else goes to the AI.
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

export { askAI };
