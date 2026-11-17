import type { Tool } from "ollama";

// ---------- The real functions ----------

function calculate(args: { expression: string }): string {
  if (!/^[0-9+\-*/%(). ]+$/.test(args.expression)) return "Error: invalid expression";
  try {
    return String(Function(`"use strict"; return (${args.expression});`)());
  } catch {
    return "Error: could not calculate";
  }
}

function getCurrentTime(): string {
  return new Date().toLocaleString();
}

// Fake weather data. In a real app this would call a weather API.
function getWeather(args: { city: string }): string {
  const weather: Record<string, string> = {
    lahore: "34°C, sunny",
    london: "12°C, rainy",
    tokyo: "18°C, cloudy",
  };
  return weather[args.city.toLowerCase()] ?? `No weather data for ${args.city}`;
}

// ---------- Name -> function lookup ----------
// This lets us run any tool by its name without a big if/else.
export const toolFunctions: Record<string, (args: any) => string> = {
  calculate,
  get_current_time: getCurrentTime,
  get_weather: getWeather,
};

// ---------- Descriptions for the AI ----------
export const tools: Tool[] = [
  {
    type: "function",
    function: {
      name: "calculate",
      description: "Calculate a math expression.",
      parameters: {
        type: "object",
        properties: { expression: { type: "string", description: "e.g. 12 * (3 + 4)" } },
        required: ["expression"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_current_time",
      description: "Get the current local date and time.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get the current weather for a city.",
      parameters: {
        type: "object",
        properties: { city: { type: "string", description: "City name, e.g. Lahore" } },
        required: ["city"],
      },
    },
  },
];
