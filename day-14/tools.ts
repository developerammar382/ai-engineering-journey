import { readFile, writeFile } from "node:fs/promises";
import type { Tool } from "ollama";

// Notes are saved to a JSON file so they survive restarts (Day 11).
const NOTES_FILE = new URL("./notes.json", import.meta.url);

async function loadNotes(): Promise<string[]> {
  try {
    return JSON.parse(await readFile(NOTES_FILE, "utf-8"));
  } catch {
    return [];
  }
}

// ---------- Tool functions ----------

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

async function addNote(args: { text: string }): Promise<string> {
  const notes = await loadNotes();
  notes.push(args.text);
  await writeFile(NOTES_FILE, JSON.stringify(notes, null, 2));
  return `Saved note #${notes.length}`;
}

async function listNotes(): Promise<string> {
  const notes = await loadNotes();
  if (notes.length === 0) return "No notes yet.";
  return notes.map((note, i) => `${i + 1}. ${note}`).join("\n");
}

export const toolFunctions: Record<string, (args: any) => string | Promise<string>> = {
  calculate,
  get_current_time: getCurrentTime,
  add_note: addNote,
  list_notes: listNotes,
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
      name: "add_note",
      description: "Save a note or reminder for the user.",
      parameters: {
        type: "object",
        properties: { text: { type: "string", description: "The note to save" } },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_notes",
      description: "Show all saved notes.",
      parameters: { type: "object", properties: {} },
    },
  },
];
