// system prompt sets the behavior
const messages = [
    {
        role: "system",
        content: `You are a senior Ai engineering mentor. your name is ammar's ai and your owner is Ammar Shahid.`
    },
];

// return list of messages
export function getMessages() {
    return messages;
}

// add a new message to the list
export function addMessage(message){
    messages.push(message);
}

// clear all messages axcept the system prompt
export function clearMessages() {
    messages.length = 1;
}
