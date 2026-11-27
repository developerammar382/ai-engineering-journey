// Runs a day without typing the full path.
//
//   npm run day -- 7                      → runs day-07's main file
//   npm run day -- 6 structured-output    → runs day-06/structured-output.ts
//   npm run day -- 7 day-07/sample.txt    → extra arguments are passed through

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

// The main file of each day (the one its README tells you to run first).
const ENTRY: Record<number, string> = {
  1: "index", 2: "chat", 3: "terminal", 4: "terminal", 5: "prompts", 6: "extract", 7: "summarize",
  8: "index", 9: "index", 10: "index", 11: "terminal", 12: "context", 13: "reliable", 14: "index",
  15: "embed", 16: "similarity", 17: "index", 18: "chunk", 19: "rag", 20: "rag", 21: "index",
  22: "rest-api", 23: "server", 24: "server", 25: "agent", 26: "evaluate", 27: "safety",
  28: "server", 29: "server", 30: "server",
};

const [dayArg, maybeFile, ...rest] = process.argv.slice(2);
const day = Number(dayArg);

if (!ENTRY[day]) {
  console.log("Usage: npm run day -- <1-30> [file] [args...]");
  console.log("Example: npm run day -- 7");
  process.exit(1);
}

const folder = `day-${String(day).padStart(2, "0")}`;

// If the second argument names a file in that day's folder, run it. Otherwise it's an argument.
let file = `${folder}/${ENTRY[day]}.ts`;
let args = [maybeFile, ...rest].filter((a) => a !== undefined);
if (maybeFile && existsSync(`${folder}/${maybeFile.replace(/\.ts$/, "")}.ts`)) {
  file = `${folder}/${maybeFile.replace(/\.ts$/, "")}.ts`;
  args = rest;
}

console.log(`▶ npx tsx ${[file, ...args].join(" ")}\n`);
const result = spawnSync("npx", ["tsx", file, ...args], { stdio: "inherit", shell: process.platform === "win32" });
process.exit(result.status ?? 1);
