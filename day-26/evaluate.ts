import ollama from "ollama";

// How do we know if a prompt is GOOD? Or if a change made it better or worse?
// Trying 2-3 examples by hand is not enough. Instead we build a small test set
// ("eval") with known correct answers and measure the score.
//
// Today's task: sort customer support messages into a category.

type Category = "billing" | "technical" | "account" | "other";

const testCases: { message: string; expected: Category }[] = [
  { message: "I was charged twice this month", expected: "billing" },
  { message: "How do I get a refund?", expected: "billing" },
  { message: "Can I pay with PayPal?", expected: "billing" },
  { message: "The app crashes when I open settings", expected: "technical" },
  { message: "The page is loading forever", expected: "technical" },
  { message: "I get error 500 when uploading a photo", expected: "technical" },
  { message: "I forgot my password", expected: "account" },
  { message: "How do I change my email address?", expected: "account" },
  { message: "Please delete my profile", expected: "account" },
  { message: "Do you have an office in Karachi?", expected: "other" },
  { message: "Your team was super helpful, thanks!", expected: "other" },
  { message: "My card was declined but I still see the payment", expected: "billing" },
];

// ---------- Prompt version 1: just list the category names ----------
async function classifyV1(message: string): Promise<string> {
  const response = await ollama.chat({
    model: "qwen2.5:3b",
    messages: [
      { role: "user", content: `Classify this support message as billing, technical, account or other: ${message}` },
    ],
    options: { temperature: 0 },
  });
  return response.message.content.trim().toLowerCase();
}

// ---------- Prompt version 2: also say HOW to answer ----------
async function classifyV2(message: string): Promise<string> {
  const response = await ollama.chat({
    model: "qwen2.5:3b",
    messages: [
      {
        role: "user",
        content: `Classify this support message as billing, technical, account or other. Reply with only one word.\n\nMessage: ${message}`,
      },
    ],
    options: { temperature: 0 },
  });
  // Clean up things like "Billing." -> "billing"
  return response.message.content.trim().toLowerCase().replace(/[^a-z]/g, "");
}

// ---------- Prompt version 3: explain each category + force the output format ----------
async function classifyV3(message: string): Promise<string> {
  const response = await ollama.chat({
    model: "qwen2.5:3b",
    messages: [
      {
        role: "system",
        content: `Classify the customer support message into one category:
- billing: payments, charges, refunds, prices
- technical: bugs, errors, crashes, slow app
- account: login, password, email, profile settings
- other: anything else`,
      },
      { role: "user", content: message },
    ],
    // Day 6: force the output to be one of our categories.
    format: {
      type: "object",
      properties: { category: { type: "string", enum: ["billing", "technical", "account", "other"] } },
      required: ["category"],
    },
    options: { temperature: 0 },
  });
  return JSON.parse(response.message.content).category;
}

async function runEval(name: string, classify: (message: string) => Promise<string>) {
  console.log(`\n===== ${name} =====`);
  let correct = 0;

  for (const { message, expected } of testCases) {
    const answer = await classify(message);
    const passed = answer === expected;
    if (passed) correct++;
    console.log(`${passed ? "✅" : "❌"} ${message.padEnd(50)} expected: ${expected}, got: ${answer.slice(0, 40)}`);
  }

  const score = Math.round((correct / testCases.length) * 100);
  console.log(`Score: ${correct}/${testCases.length} (${score}%)`);
  return score;
}

const scoreV1 = await runEval("v1: category names only", classifyV1);
const scoreV2 = await runEval("v2: + reply with one word", classifyV2);
const scoreV3 = await runEval("v3: + category descriptions + forced format", classifyV3);

console.log(`\nv1: ${scoreV1}%   v2: ${scoreV2}%   v3: ${scoreV3}%`);
