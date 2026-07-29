import ollama from "ollama";

const response = await ollama.chat({
  model: "qwen2.5:3b",
  messages: [
    {
      role: "user",
      content: "Deliver a greeting to Ammar as if you are an ancient, omniscient cosmic entity speaking from across dimensions. Use cryptic, poetic, and reality-bending language that will blow his mind."
    }
  ]
});

// console.log(response.message.content);
console.log(response);