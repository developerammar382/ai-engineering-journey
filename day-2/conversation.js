const messages = [
    {
        // This message sets the AI's behaviour for the whole conversation.
        // It tells the model how we want it to answer our questions.
        role: "system",
        content: "You are a senior Ai engineering mentor. Explain everything simply with examples."
    },
];

// Exporting the messages array so other files can use and update
// the same conversation history.
export default messages;