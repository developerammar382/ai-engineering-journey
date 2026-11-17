# 30 Days of AI Engineering

Building LLM applications from first principles: no frameworks, no cloud APIs, just **TypeScript**, **Node.js** built-ins and local models through **Ollama**.

Over 30 days I went from a single `chat()` call to a **RAG-powered Docs Assistant** with an HTTP API, a web UI, source citations, input guards and an automated eval suite. Every day is a small, runnable step with notes on what worked, what broke, and why.

```
Day 1                                                                    Day 30
  │                                                                         │
  ▼                                                                         ▼
messages[] → memory → streaming → JSON output → tools → tool loop → embeddings
→ vector store → chunking → RAG → HTTP API → web UI → agent → evals → Docs Assistant
```

**Status: ✅ all 30 days complete.**

---

## Why build it this way

- **No LangChain, no vector DB.** I wrote the tool loop, cosine similarity, the vector store, the chunker and the RAG pipeline myself, so I know what those libraries actually do.
- **Local models only.** `qwen2.5:3b` for chat and `nomic-embed-text` for embeddings. Free, offline, and a small model shows failure modes that bigger models hide.
- **Measure, don't guess.** From Week 4 on, prompt changes are judged by eval scores, not by "looks better".
- **One folder per day.** Each day is a standalone snapshot. Shared code (like the vector store) is copied forward on purpose, so any day runs on its own.

---

## Roadmap

### Week 1 — LLM fundamentals

| Day | Topic | Key idea | |
| --- | --- | --- | --- |
| [01](./day-01) | Chat message structure | A conversation is just a typed array of `{ role, content }` | ✅ |
| [02](./day-02) | First call + memory | The model is stateless. The app owns the history | ✅ |
| [03](./day-03) | Terminal chatbot | `readline` loop over the chat API | ✅ |
| [04](./day-04) | Streaming + commands | `for await` over token chunks; `history` / `clear` | ✅ |
| [05](./day-05) | Prompt engineering | System prompts, few-shot, temperature 0 vs 1.2 | ✅ |
| [06](./day-06) | Structured output | JSON Schema via `format` instead of "please return JSON" | ✅ |
| [07](./day-07) | 🛠 File summarizer | CLI tool: `fs` + `argv` + streaming | ✅ |

### Week 2 — Tools, memory, reliability

| Day | Topic | Key idea | |
| --- | --- | --- | --- |
| [08](./day-08) | Tools by hand | LLMs can't do exact math; a sandboxed calculator (no `eval` on raw input) | ✅ |
| [09](./day-09) | Native tool calling | The model asks, the app runs the function, the result goes back | ✅ |
| [10](./day-10) | Multi-tool loop | Run tools until no `tool_calls` remain, with a max-steps guard | ✅ |
| [11](./day-11) | Persistent history | Chat state saved to disk after every turn | ✅ |
| [12](./day-12) | Context window | Trimming vs LLM summarization, measured with `prompt_eval_count` | ✅ |
| [13](./day-13) | Reliability | Timeouts, retry with backoff, runtime type guards | ✅ |
| [14](./day-14) | 🛠 Personal assistant | Tool loop + persistent notes + bounded history | ✅ |

### Week 3 — Embeddings & RAG

| Day | Topic | Key idea | |
| --- | --- | --- | --- |
| [15](./day-15) | Embeddings | Text → 768-dim vectors with `nomic-embed-text` | ✅ |
| [16](./day-16) | Semantic search | Cosine similarity from scratch; task prefixes improve ranking | ✅ |
| [17](./day-17) | Vector store | In-memory index + JSON persistence, top-k search | ✅ |
| [18](./day-18) | Chunking | Fixed-size with overlap vs paragraph splitting | ✅ |
| [19](./day-19) | RAG v1 | Retrieve → augment → generate over private docs | ✅ |
| [20](./day-20) | RAG v2 | Source citations, similarity threshold, grounded refusals | ✅ |
| [21](./day-21) | 🛠 Chat with your notes | RAG CLI over any folder (indexes this repo's READMEs by default) | ✅ |

### Week 4 — Shipping AI apps

| Day | Topic | Key idea | |
| --- | --- | --- | --- |
| [22](./day-22) | Raw REST API | `fetch` + NDJSON stream parsing: what the SDK does underneath | ✅ |
| [23](./day-23) | HTTP API | `node:http` server with input validation and proper status codes | ✅ |
| [24](./day-24) | Web chat UI | Token streaming to the browser; stateless server, client-side history | ✅ |
| [25](./day-25) | Agent | Goal-driven tool loop over files, least-privilege file access | ✅ |
| [26](./day-26) | Evals | Test set + scoring to compare prompt versions | ✅ |
| [27](./day-27) | Prompt injection | Delimiters, sandwich defense, input and output guards | ✅ |
| [28](./day-28) | 🏁 Docs Assistant: API | RAG behind `POST /ask` → `{ answer, sources }` | ✅ |
| [29](./day-29) | 🏁 Docs Assistant: UI | Vanilla HTML/JS frontend | ✅ |
| [30](./day-30) | 🏁 Docs Assistant: polish | Env config, eval suite, prompt fix driven by eval results | ✅ |

---

## Final project: Docs Assistant

Ask questions about any folder of Markdown or text files and get grounded answers with sources.

```
                ┌──────────── indexing (on startup) ────────────┐
 docs/*.md ──▶  chunk by paragraph ──▶ embed (nomic-embed-text) ──▶ vector store
                └───────────────────────────────────────────────┘
                                                                      │
 question ──▶ embed ──▶ top-k cosine search ──▶ filter score ≥ 0.55 ──┘
                                │
                     no chunks? → "couldn't find it" (no LLM call)
                                │
                      context + strict prompt ──▶ qwen2.5:3b ──▶ { answer, sources }
```

```bash
npx tsx day-30/server.ts                        # http://localhost:3000
DOCS_FOLDER=~/my-notes npx tsx day-30/server.ts # any folder
npx tsx day-30/eval.ts                          # run the eval suite
```

---

## What I found along the way

Real results from running the code, not theory:

| Experiment | Result | Takeaway |
| --- | --- | --- |
| Prompt versions on a support-ticket classifier (Day 26) | v1 **0%** → v2 **100%** → v3 **100%** | The model knew the answer in v1 but wrapped it in a sentence. Output format matters as much as content. |
| RAG eval on the Docs Assistant (Day 30) | **7/10 → 9/10** | Two "failures" were bad tests. One was a vague-answer bug fixed by a single prompt line. |
| Remaining RAG failure (Day 30) | Correct chunk not in top 6 | When retrieval misses, no prompt can save the answer. Next step: hybrid keyword + vector search. |
| `search_query:` / `search_document:` prefixes (Day 16) | Top match score **0.66 → 0.74**, better ranking | Read the embedding model's docs. Small details move retrieval quality. |
| Agent with write access to its inputs (Day 25) | Overwrote its own input files | Least privilege isn't optional for agents: read-only inputs, a separate output dir. |
| Prompt injection vs a "safe" prompt (Day 27) | 3B model still followed the injected text | Defenses reduce risk, they don't remove it. Never put secrets in prompts. |
| Tool calling with a 3B model (Days 9–10) | Mis-copied numbers, occasional empty replies | Log every tool call, and build fallbacks for model quirks. |

---

## Setup

Requires [Node.js](https://nodejs.org) 18+ and [Ollama](https://ollama.com).

```bash
ollama pull qwen2.5:3b          # chat model (~2 GB)
ollama pull nomic-embed-text    # embedding model (~270 MB)

npm install
npx tsx day-02/chat.ts          # run any day
npm run typecheck               # type-check the whole repo
```

Each day's README has its own run command and a "Try it yourself" exercise.

---

## Tech stack

**TypeScript** · **Node.js** (`readline`, `fs`, `http`, `fetch`) · **Ollama** · `qwen2.5:3b` · `nomic-embed-text` · [`tsx`](https://github.com/privatenumber/tsx)

Only one runtime dependency: [`ollama`](https://www.npmjs.com/package/ollama).

---

## Author

**Ammar Shahid** · [ammarshahid.site](https://ammarshahid.site)

If this helped you learn something, a ⭐ is appreciated.
