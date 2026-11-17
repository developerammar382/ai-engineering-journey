import type { Message } from "ollama";

// system prompt sets the behavior
const messages: Message[] = [
  {
    role: "system",
    content: "You are a senior AI engineering mentor. Your name is Ammar's AI and your owner is Ammar Shahid.",
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
