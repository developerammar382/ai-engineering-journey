import ollama, { type Message } from "ollama";

// Every model has a "context window": the max amount of text it can read at once.
// It is measured in tokens (pieces of words). If our chat history grows too big,
// the oldest messages get cut off and the model forgets them. It also gets slower.
//
// Today we try two ways to keep the history small:
//   1. Trimming:     only keep the last few messages (simple, but forgets things)
//   2. Summarizing:  replace old messages with a short summary (keeps the important facts)

const MODEL = "qwen2.5:3b";

// Rough rule: 1 token is about 4 characters of English text.
function estimateTokens(messages: Message[]): number {
  const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0);
  return Math.round(totalChars / 4);
}

// Way 1: keep the system prompt + the last `keep` messages.
function trimHistory(messages: Message[], keep: number): Message[] {
  const [system, ...rest] = messages;
  return [system, ...rest.slice(-keep)];
}

// Way 2: ask the AI to summarize the old messages, keep the recent ones as they are.
async function summarizeHistory(messages: Message[], keep: number): Promise<Message[]> {
  const [system, ...rest] = messages;
  const oldMessages = rest.slice(0, -keep);
  const recentMessages = rest.slice(-keep);

  const transcript = oldMessages.map((m) => `${m.role}: ${m.content}`).join("\n");

  const response = await ollama.chat({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: `Summarize this conversation in 3 short bullet points.\nThe first bullet MUST list facts about the user: their name and preferences.\n\n${transcript}`,
      },
    ],
    options: { temperature: 0 },
  });

  console.log("\nSummary of old messages:\n" + response.message.content);

  // Put the summary inside the system prompt. Small models follow one system message
  // better than several.
  const systemWithSummary: Message = {
    role: "system",
    content: `${system.content}\n\nWhat you know from earlier in this conversation:\n${response.message.content}`,
  };

  return [systemWithSummary, ...recentMessages];
}

// ---------- Build a long fake conversation ----------
const history: Message[] = [
  { role: "system", content: "You are a helpful assistant. Keep answers to one sentence." },
  { role: "user", content: "Hi! My name is Ammar and my favorite color is green." },
  { role: "assistant", content: "Nice to meet you, Ammar! Green is a great color." },
];

const smallTalk = [
  "What is a variable in programming?",
  "What is a function?",
  "What is an array?",
  "What is a loop?",
  "What is an object?",
  "What is JSON?",
  "What is an API?",
  "What is Git?",
];

for (const question of smallTalk) {
  history.push({ role: "user", content: question });
  history.push({ role: "assistant", content: `(a short answer about: ${question})` });
}

const finalQuestion: Message = { role: "user", content: "What is my name and my favorite color?" };

async function test(label: string, messages: Message[]) {
  const response = await ollama.chat({
    model: MODEL,
    messages: [...messages, finalQuestion],
    options: { temperature: 0 },
  });
  console.log(`\n--- ${label} ---`);
  console.log(`messages: ${messages.length}, estimated tokens: ${estimateTokens(messages)}`);
  // prompt_eval_count = the REAL number of tokens the model read.
  console.log(`real prompt tokens: ${response.prompt_eval_count}`);
  console.log(`AI: ${response.message.content}`);
}

await test("Full history", history);
await test("Trimmed (last 4 messages)", trimHistory(history, 4));
await test("Summarized (summary + last 4 messages)", await summarizeHistory(history, 4));
