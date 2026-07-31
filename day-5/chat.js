import ollama from "ollama";
import {getMessages, addMessage} from "./conversation.js";

async function askAI(question) {
    try{
    // add the user's question to the conversation before sending it.
    addMessage({
        role: "user",
        content: question
    });

    // console.log("updated user messages", getMessages());

    // Send the complete conversation to Ollama.
    // This helps the model understand what was discussed before.
    const response = await ollama.chat({
        model: "qwen2.5:3b",
        messages: getMessages(),
        stream: false
    });

    // Save the AI response so the next question can continue this conversation
    addMessage({
        role: "assistant",
        content: response.message.content,
    });

    // console.log("updated assistant messages", getMessages());

    // Showing only the latest AI answer.
    return response.message.content;
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