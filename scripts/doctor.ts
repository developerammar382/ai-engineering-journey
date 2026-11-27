// Checks that your machine is ready to run the 30 days.
//
//   npm run doctor
//
// It looks at: Node version, whether Ollama is running, and whether the models are pulled.
// Same env vars as the days: OLLAMA_HOST, OLLAMA_MODEL, EMBED_MODEL.

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
const CHAT_MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:3b";
const EMBED_MODEL = process.env.EMBED_MODEL ?? "nomic-embed-text";

let problems = 0;

function ok(message: string) {
  console.log(`  ✅ ${message}`);
}

function fail(message: string, fix: string) {
  problems++;
  console.log(`  ❌ ${message}`);
  console.log(`     → ${fix}`);
}

console.log("\nChecking your setup...\n");

// 1. Node version
const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor >= 18) {
  ok(`Node.js ${process.versions.node}`);
} else {
  fail(`Node.js ${process.versions.node} is too old`, "Install Node.js 18 or newer: https://nodejs.org");
}

// 2. Ollama running?
let installed: string[] | null = null;
try {
  const response = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: AbortSignal.timeout(3000) });
  const data = (await response.json()) as { models: { name: string }[] };
  installed = data.models.map((m) => m.name);
  ok(`Ollama is running at ${OLLAMA_HOST}`);
} catch {
  fail(
    `Can't reach Ollama at ${OLLAMA_HOST}`,
    "Install it from https://ollama.com, then start it (open the app, or run `ollama serve`).",
  );
}

// 3. Models pulled? Ollama adds ":latest" when no tag is given.
function hasModel(name: string): boolean {
  const wanted = name.includes(":") ? name : `${name}:latest`;
  return installed!.includes(wanted);
}

if (installed) {
  for (const [label, model] of [
    ["Chat model", CHAT_MODEL],
    ["Embedding model", EMBED_MODEL],
  ]) {
    if (hasModel(model)) {
      ok(`${label} ${model} is pulled`);
    } else {
      fail(`${label} ${model} is not pulled`, `Run: ollama pull ${model}`);
    }
  }
}

if (problems === 0) {
  console.log("\nAll good! Start with: npm run day -- 1\n");
} else {
  console.log(`\n${problems} problem(s) found. Fix them and run \`npm run doctor\` again.\n`);
  process.exit(1);
}
