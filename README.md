# 🚀 30 Days of AI Engineering

My day-by-day journey of learning **AI Engineering** with **TypeScript** and **Ollama**, by building small projects.

Every day has one topic, working code, and a short README explaining what I learned. It starts with a single AI call and ends with a full **Docs Assistant** (RAG + API + web page).

Everything runs **locally and for free** with [Ollama](https://ollama.com): no API keys, no cloud costs.

---

## 🗺️ Roadmap

### Week 1 — LLM Basics

| Day | Topic                                                         | What I built                          |
| --- | ------------------------------------------------------------- | ------------------------------------- |
| 01  | [Chat message structure](./day-01)                            | Typed chat messages                   |
| 02  | [First AI call + memory](./day-02)                            | A chat that remembers                 |
| 03  | [Terminal chatbot](./day-03)                                  | Live chat with `readline`             |
| 04  | [Streaming + commands](./day-04)                              | `history`, `clear`, `exit`            |
| 05  | [Prompt engineering basics](./day-05)                         | System prompts, few-shot, temperature |
| 06  | [Structured output (JSON)](./day-06)                          | Data extraction + JSON Schema         |
| 07  | [🛠 Mini project: File summarizer](./day-07)                  | CLI that summarizes any text file     |

### Week 2 — Tools & Memory

| Day | Topic                                                         | What I built                          |
| --- | ------------------------------------------------------------- | ------------------------------------- |
| 08  | [Tools by hand](./day-08)                                     | A safe calculator tool                |
| 09  | [Real tool calling](./day-09)                                 | The AI decides when to use a tool     |
| 10  | [Multiple tools + tool loop](./day-10)                        | Weather, time and math tools          |
| 11  | [Saving chat history](./day-11)                               | Memory that survives restarts         |
| 12  | [Context window limits](./day-12)                             | Trimming vs summarizing               |
| 13  | [Error handling & reliable output](./day-13)                  | Retry, timeout, validation            |
| 14  | [🛠 Mini project: Personal assistant](./day-14)               | Terminal assistant with notes         |

### Week 3 — Embeddings & RAG

| Day | Topic                                                         | What I built                          |
| --- | ------------------------------------------------------------- | ------------------------------------- |
| 15  | [What are embeddings?](./day-15)                              | Text → vectors                        |
| 16  | [Cosine similarity & semantic search](./day-16)               | Search by meaning                     |
| 17  | [Tiny vector store](./day-17)                                 | A vector DB in a JSON file            |
| 18  | [Chunking documents](./day-18)                                | Word and paragraph chunks             |
| 19  | [RAG part 1](./day-19)                                        | Q&A over a coffee shop's docs         |
| 20  | [RAG part 2: sources & "I don't know"](./day-20)              | Trustworthy answers                   |
| 21  | [🛠 Mini project: Chat with your notes](./day-21)             | RAG chat over any folder              |

### Week 4 — Building Real Apps

| Day | Topic                                                         | What I built                          |
| --- | ------------------------------------------------------------- | ------------------------------------- |
| 22  | [Calling the REST API directly](./day-22)                     | `fetch` + NDJSON streaming            |
| 23  | [Serving AI over HTTP](./day-23)                              | API with `node:http`                  |
| 24  | [Simple web chat](./day-24)                                   | Streaming chat in the browser         |
| 25  | [A simple agent](./day-25)                                    | File agent with safe tools            |
| 26  | [Testing AI output (evals)](./day-26)                         | Scoring prompt versions               |
| 27  | [Safety basics: prompt injection](./day-27)                   | Input and output checks               |
| 28  | [🏁 Final project: backend](./day-28)                         | Docs Assistant API                    |
| 29  | [🏁 Final project: frontend](./day-29)                        | Docs Assistant web page               |
| 30  | [🏁 Final project: polish & look back](./day-30)              | Config, eval, retrospective           |

---

## ✅ My Progress

I tick a day once I've run it, understood it, and done its "Try it yourself" exercise.

- [x] Day 01
- [x] Day 02
- [x] Day 03
- [x] Day 04
- [ ] Day 05
- [x] Day 06
- [ ] Day 07
- [x] Day 08
- [ ] Day 09
- [ ] Day 10
- [ ] Day 11
- [ ] Day 12
- [ ] Day 13
- [ ] Day 14
- [ ] Day 15
- [ ] Day 16
- [ ] Day 17
- [ ] Day 18
- [ ] Day 19
- [ ] Day 20
- [ ] Day 21
- [ ] Day 22
- [ ] Day 23
- [ ] Day 24
- [ ] Day 25
- [ ] Day 26
- [ ] Day 27
- [ ] Day 28
- [ ] Day 29
- [ ] Day 30

---

## ⚙️ Setup

You need [Node.js](https://nodejs.org) 18+ and [Ollama](https://ollama.com).

```bash
# 1. Download the models (once)
ollama pull qwen2.5:3b          # chat model (~2 GB)
ollama pull nomic-embed-text    # embedding model for Week 3+ (~270 MB)

# 2. Install packages
npm install

# 3. Run any day
npx tsx day-02/chat.ts
```

Each day's README shows the exact command to run.

**Useful:**

- `npm run typecheck` checks all TypeScript files for type errors.
- Make sure Ollama is running (open the app, or run `ollama serve`).

---

## 📂 Structure

```
.
├── day-01/            # one folder per day
│   ├── README.md      # what I learned + how to run it
│   └── index.ts
├── day-02/
├── ...
├── day-30/
├── package.json
├── tsconfig.json
└── README.md
```

Each day is a **standalone snapshot**. Some code (like the vector store) is copied forward on purpose, so every day runs on its own and shows the code as it was at that point in the journey.

---

## 🛠️ Tech Stack

- **TypeScript** (run with [`tsx`](https://github.com/privatenumber/tsx), no build step)
- **Node.js** built-ins: `readline`, `fs`, `http`, `fetch`
- **Ollama** + the [`ollama`](https://www.npmjs.com/package/ollama) npm package
- Models: `qwen2.5:3b` (chat) and `nomic-embed-text` (embeddings)

No frameworks, no vector database, no cloud. Just the basics, so I understand how things really work.

---

## 💡 Note

This is a learning repository. The code is kept simple on purpose, and you'll see it improve as the days go on.

---

## 👨‍💻 Author

**Ammar Shahid**

🌐 Portfolio: [ammarshahid.site](https://ammarshahid.site)

Learning AI Engineering one project at a time.

---

⭐ If you find this repository useful or interesting, feel free to star it!
