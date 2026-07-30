import ollama from "ollama";
import {getMessages, addMessage} from "./conversation.js";

// This stores our chat history.
// Every time we talk with the AI, new messages are added here.
// console.log("messages", messages);

async function askAI(question) {
    try{
    // Add the user's question to the conversation before sending it.
    // The AI needs previous messages as context because it doesn't remember by itself.
    addMessage({
        role: "user",
        content: question
    });

    // console.log("updated user messages", getMessages());

    // Send the complete conversation to Ollama.
    // This helps the model understand what was discussed before.
    const stream = await ollama.chat({
        model: "qwen2.5:3b",
        messages: getMessages(),
        stream: true
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

    // console.log("updated assistant messages", getMessages());

    // Showing only the latest AI answer.
    return fullResponse;
    } catch (error) {
        console.error(error);
        return "Something went wrong.";
    }
}


// Calling questions one by one so every message gets added
// before moving to the next question.
// async function main() {
//     await askAI("Hello");
//     await askAI("Who am I?");
//     await askAI("What was my first question?");
// }

// main();

// export function for use in terminal.js to connect the askAI function to the command line interface
export { askAI };