import type { Message } from "ollama";

// system prompt sets the behavior
const messages: Message[] = [
  {
    role: "system",
    content: `
        You are an information extraction AI.

        Always return valid JSON only.

        Never add explanations.
        Never add markdown.
        `,
  },
];

// return list of messages
export function getMessages() {
  return messages;
}

// add a new message to the list
export function addMessage(message: Message) {
  messages.push(message);
}

// clear all messages except the system prompt
export function clearMessages() {
  messages.length = 1;
}
