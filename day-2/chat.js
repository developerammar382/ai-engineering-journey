import ollama from "ollama";
import messages from "./conversation.js";

// This stores our chat history.
// Every time we talk with the AI, new messages are added here.
console.log("messages", messages);

async function askAI(question) {
    // Add the user's question to the conversation before sending it.
    // The AI needs previous messages as context because it doesn't remember by itself.
    messages.push({
        role: "user",
        content: question
    });

    console.log("updated user messages", messages);

    // Send the complete conversation to Ollama.
    // This helps the model understand what was discussed before.
    const response = await ollama.chat({
        model: "qwen2.5:3b",
        messages
    });

    // Save the AI response so the next question can continue this conversation.
    messages.push(response.message);

    console.log("updated assistant messages", messages);

    // Showing only the latest AI answer.
    console.log("model response", response.message.content);
}


// Calling questions one by one so every message gets added
// before moving to the next question.
async function main() {
    await askAI("Hello");
    await askAI("Who am I?");
    await askAI("What was my first question?");
}

main();