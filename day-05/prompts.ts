import ollama from "ollama";

const MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:3b";

// Small helper: send a list of messages, get back only the answer text.
// "temperature" controls randomness: 0 = focused and repeatable, 1 = more creative.
async function ask(
  messages: { role: string; content: string }[],
  temperature = 0.7,
): Promise<string> {
  const response = await ollama.chat({
    model: MODEL,
    messages,
    options: { temperature },
  });
  return response.message.content;
}

function title(text: string) {
  console.log(`\n========== ${text} ==========\n`);
}

// 1. No system prompt: the model uses its default style.
title("1. Plain question (no system prompt)");
console.log(await ask([{ role: "user", content: "What is an API?" }]));

// 2. System prompt: the same question, but we decide WHO the AI is and HOW it answers.
title("2. With a system prompt");
console.log(
  await ask([
    {
      role: "system",
      content: "You are a friendly teacher for 10-year-old kids. Answer in 2 short sentences. Use a real-life example.",
    },
    { role: "user", content: "What is an API?" },
  ]),
);

// 3. Few-shot prompting: show a few examples, the model copies the pattern.
title("3. Few-shot (learning from examples)");
console.log(
  await ask(
    [
      { role: "system", content: "Classify the review as positive, negative or neutral. Reply with one word." },
      { role: "user", content: "The food was amazing!" },
      { role: "assistant", content: "positive" },
      { role: "user", content: "Delivery took 2 hours and the pizza was cold." },
      { role: "assistant", content: "negative" },
      { role: "user", content: "It was okay, nothing special." },
      { role: "assistant", content: "neutral" },
      { role: "user", content: "Best burger I have had this year." },
    ],
    0,
  ),
);

// 4. Temperature: ask the same creative question 3 times at low and high temperature.
title("4. Temperature 0 vs 1.2");
const question = [{ role: "user", content: "Give me one name for a coffee shop run by robots. Only the name." }];

for (const temperature of [0, 1.2]) {
  console.log(`temperature ${temperature}:`);
  for (let i = 0; i < 3; i++) {
    console.log("  -", (await ask(question, temperature)).trim());
  }
}
