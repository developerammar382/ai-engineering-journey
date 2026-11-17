type AIModel =
  | "qwen2.5"
  | "llama3.2"
  | "gemma3";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  model: AIModel;
  tokens: number;
}
  
const messages: ChatMessage[] = [];

function addMessage(
  role: "user" | "assistant",
  content: string,
  model: AIModel,
  tokens: number
) {
  messages.push({
    id: messages.length + 1,
    role,
    content,
    createdAt: new Date(),
    model,
    tokens
  });
}

function printConversation() {
  for (const message of messages) {
    const roleName =
      message.role === "user" ? "User" : "Assistant";

    console.log(`${roleName}: ${message.content}`);
  }

  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];

    console.log(`\nModel: ${lastMessage.model}`);
    console.log(`Tokens: ${lastMessage.tokens}`);
  }
}

addMessage("user", "Hello", "qwen2.5", 42);
addMessage("assistant", "Hi Ammar!", "qwen2.5", 42);

printConversation();