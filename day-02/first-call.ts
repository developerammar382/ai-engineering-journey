import ollama from "ollama";

// My very first call to a local AI model.
// One message in, one answer out. No memory yet.
const response = await ollama.chat({
  model: process.env.OLLAMA_MODEL ?? "qwen2.5:3b",
  messages: [
    {
      role: "user",
      content:
        "Deliver a greeting to Ammar as if you are an ancient, omniscient cosmic entity speaking from across dimensions. Use cryptic, poetic, and reality-bending language that will blow his mind.",
    },
  ],
});

// Only the text of the answer.
console.log(response.message.content);

// Uncomment to see everything Ollama sends back (model name, timings, token counts...).
// console.log(response);
