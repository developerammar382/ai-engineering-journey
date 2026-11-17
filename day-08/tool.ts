// A "tool" is just a normal function that our program can run for the AI.
// LLMs are bad at exact math, but code is perfect at it.

export function calculate(expression: string): number | null {
  // Only allow numbers, spaces, dots, brackets and + - * / %.
  // Never run eval() on raw user input: someone could type real code
  // like process.exit() and our program would run it.
  if (!/^[0-9+\-*/%(). ]+$/.test(expression)) {
    console.error("Invalid expression:", expression);
    return null;
  }

  try {
    // Now it's safe: the string can only contain math characters.
    const result = Function(`"use strict"; return (${expression});`)();
    return typeof result === "number" && Number.isFinite(result) ? result : null;
  } catch (error) {
    console.error("Error evaluating expression:", error);
    return null;
  }
}
