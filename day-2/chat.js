import ollama from "ollama";
import messages from "./conversation.js";
console.log('messages', messages);

async function askAI(question){
    messages.push({
        role: "user",
        content: question
    });

   console.log('updated user messages', messages);

    const response  = await ollama.chat({
        model: "qwen2.5:3b",
        messages
    });

    messages.push(response.message);

    console.log('updated assistant messages', messages);

    console.log('model response', response.message.content);
}

async function main(){
    await askAI("Hello");
    await askAI("Who am I?");
    await askAI("What was my first question?");
}

main();
