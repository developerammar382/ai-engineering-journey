import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { buildIndex, askNotes } from "./notes.ts";

// Mini project: chat with your notes.
//
//   npx tsx day-21/index.ts                    -> chat with this repo's READMEs
//   npx tsx day-21/index.ts ~/my-notes         -> chat with your own .md / .txt files
//   npx tsx day-21/index.ts --rebuild          -> re-index after notes changed

const args = process.argv.slice(2);
const rebuild = args.includes("--rebuild");
const folder = args.find((arg) => !arg.startsWith("--"));

const store = await buildIndex(folder, rebuild || folder !== undefined);

const rl = readline.createInterface({ input: stdin, output: stdout });
console.log('\nAsk anything about your notes. Type "exit" to quit.\n');

while (true) {
  const question = (await rl.question("You: ")).trim();
  if (!question) continue;
  if (question === "exit") break;

  await askNotes(store, question);
  console.log();
}

rl.close();
