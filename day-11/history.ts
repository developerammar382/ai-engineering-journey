import { readFile, writeFile } from "node:fs/promises";
import type { Message } from "ollama";

// Until now, our chat history lived in an array. When the program stopped, it was gone.
// Today we save it to a JSON file, so the AI "remembers" us next time.

// import.meta.url = the location of THIS file. So history.json is always saved next to it,
// no matter which folder we run the program from.
const HISTORY_FILE = new URL("./history.json", import.meta.url);

const SYSTEM_PROMPT: Message = {
  role: "system",
  content: "You are a friendly assistant. Keep answers short. Remember what the user tells you.",
};

export async function loadHistory(): Promise<Message[]> {
  try {
    const text = await readFile(HISTORY_FILE, "utf-8");
    return JSON.parse(text);
  } catch {
    // File doesn't exist yet (first run) or is broken: start fresh.
    return [SYSTEM_PROMPT];
  }
}

export async function saveHistory(messages: Message[]) {
  // null, 2 = pretty print with 2 spaces, so we can open the file and read it.
  await writeFile(HISTORY_FILE, JSON.stringify(messages, null, 2));
}

export async function resetHistory(): Promise<Message[]> {
  const fresh = [SYSTEM_PROMPT];
  await saveHistory(fresh);
  return fresh;
}
