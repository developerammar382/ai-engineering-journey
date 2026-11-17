import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Tool } from "ollama";

// The agent can READ files in workspace/ but can only WRITE files in output/.
// Why? In the first version of this code it could write anywhere in workspace/... and it
// overwrote the input files with empty text. Lesson: give agents the least power they need.
const WORKSPACE = new URL("./workspace/", import.meta.url);
const OUTPUT = new URL("./output/", import.meta.url);

// SAFETY: path.basename("../../secret.txt") === "secret.txt".
// So even if the AI asks for a path outside the folder, it stays inside.
function safeFile(name: string, folder: URL): URL {
  return new URL(path.basename(name), folder);
}

async function listFiles(): Promise<string> {
  const files = await readdir(WORKSPACE);
  return files.join("\n") || "(empty)";
}

async function readFileTool(args: { name: string }): Promise<string> {
  try {
    return await readFile(safeFile(args.name, WORKSPACE), "utf-8");
  } catch {
    return `Error: file "${args.name}" not found`;
  }
}

async function writeFileTool(args: { name: string; content: string }): Promise<string> {
  await mkdir(OUTPUT, { recursive: true });
  await writeFile(safeFile(args.name, OUTPUT), args.content);
  return `Wrote ${args.content.length} characters to output/${path.basename(args.name)}`;
}

export const toolFunctions: Record<string, (args: any) => Promise<string>> = {
  list_files: listFiles,
  read_file: readFileTool,
  write_file: writeFileTool,
};

export const tools: Tool[] = [
  {
    type: "function",
    function: {
      name: "list_files",
      description: "List all files in the workspace.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "read_file",
      description: "Read the content of a file in the workspace.",
      parameters: {
        type: "object",
        properties: { name: { type: "string", description: "File name, e.g. todo.txt" } },
        required: ["name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "write_file",
      description: "Create a file in the output folder. Use this to save results.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "File name, e.g. summary.md" },
          content: { type: "string", description: "The full text to write" },
        },
        required: ["name", "content"],
      },
    },
  },
];
