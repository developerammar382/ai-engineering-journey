import path from "node:path";
import { pathToFileURL } from "node:url";

// Settings come from environment variables, with sensible defaults.
// This way I can point the assistant at ANY folder without changing code:
//
//   DOCS_FOLDER=~/my-notes PORT=4000 npx tsx day-30/server.ts

export const PORT = Number(process.env.PORT ?? 3000);

export const DOCS_FOLDER = process.env.DOCS_FOLDER
  ? pathToFileURL(path.resolve(process.env.DOCS_FOLDER) + "/")
  : new URL("./docs/", import.meta.url);
