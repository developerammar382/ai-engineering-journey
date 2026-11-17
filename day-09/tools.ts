import type { Tool } from "ollama";

// The real function that does the work.
export function calculate(expression: string): string {
  if (!/^[0-9+\-*/%(). ]+$/.test(expression)) {
    return "Error: invalid expression";
  }
  try {
    const result = Function(`"use strict"; return (${expression});`)();
    return String(result);
  } catch {
    return "Error: could not calculate";
  }
}

// A description of the function for the AI.
// The AI never runs our code. It only reads this description and says:
// "please call calculate with expression = ...". Then WE run it.
export const calculateTool: Tool = {
  type: "function",
  function: {
    name: "calculate",
    description: "Calculate a math expression. Use this for any arithmetic.",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "A math expression like 25 * (4 + 3)",
        },
      },
      required: ["expression"],
    },
  },
};
