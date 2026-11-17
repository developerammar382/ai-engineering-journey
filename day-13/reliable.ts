import ollama from "ollama";

// AI apps fail in more ways than normal apps:
//   - Ollama is not running, or the model is not downloaded
//   - the request hangs for a long time
//   - the model returns broken or incomplete JSON
// Today we build small helpers that handle these problems.

const MODEL = "qwen2.5:3b";

// ---------- 1. Friendly error messages ----------
function explainError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("ECONNREFUSED") || message.includes("fetch failed")) {
    return "Can't reach Ollama. Is it running? Start it with: ollama serve";
  }
  if (message.includes("not found")) {
    return `Model not found. Download it with: ollama pull ${MODEL}`;
  }
  return `Unexpected error: ${message}`;
}

// ---------- 2. Timeout ----------
// Promise.race returns whichever promise finishes first.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms),
  );
  return Promise.race([promise, timeout]);
}

// ---------- 3. Retry ----------
async function withRetry<T>(task: () => Promise<T>, attempts = 3): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await task();
    } catch (error) {
      if (attempt >= attempts) throw error;
      console.log(`  attempt ${attempt} failed (${explainError(error)}), retrying...`);
      // wait a bit longer after each failure: 1s, 2s, 3s...
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
}

// ---------- 4. Validate the AI's answer ----------
type Recipe = {
  name: string;
  minutes: number;
  ingredients: string[];
};

// A "type guard": checks at runtime that the data REALLY has the shape we expect.
// JSON.parse only checks that it's valid JSON, not that the fields are right.
function isRecipe(data: any): data is Recipe {
  return (
    typeof data?.name === "string" &&
    typeof data?.minutes === "number" &&
    Array.isArray(data?.ingredients) &&
    data.ingredients.every((item: unknown) => typeof item === "string")
  );
}

async function getRecipe(dish: string): Promise<Recipe> {
  return withRetry(async () => {
    const response = await withTimeout(
      ollama.chat({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: `Give me a simple recipe for ${dish}. Return JSON with: name (string), minutes (number), ingredients (array of strings).`,
          },
        ],
        format: "json",
      }),
      60_000,
    );

    const data = JSON.parse(response.message.content); // throws if broken JSON -> retry
    if (!isRecipe(data)) {
      throw new Error(`AI returned the wrong shape: ${response.message.content}`); // -> retry
    }
    return data;
  });
}

// ---------- Try it ----------
try {
  const recipe = await getRecipe("pancakes");
  console.log(`\n${recipe.name} (${recipe.minutes} min)`);
  recipe.ingredients.forEach((item) => console.log(" -", item));
} catch (error) {
  console.log(explainError(error));
}

// See what happens when something goes wrong: a model that doesn't exist.
console.log("\nNow asking a model that doesn't exist:");
try {
  await ollama.chat({ model: "this-model-does-not-exist", messages: [{ role: "user", content: "hi" }] });
} catch (error) {
  console.log(explainError(error));
}
