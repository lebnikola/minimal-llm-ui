# minimal-llm-ui

Next.js 14 app (App Router) — minimal UI for chatting with local LLMs via Ollama.

## Prerequisites

- **Node.js >= 18** (Next.js 14 requirement; README mentions 14.0.1 but that is outdated)
- **Ollama running** (`ollama serve` or `ollama run <model>`) on `http://localhost:11434` by default

## Setup

```bash
npm install
cp .env.example .env.local   # optional: set NEXT_PUBLIC_OLLAMA_BASEURL if Ollama is not on default host
npm run dev
```

Dev server runs on `http://localhost:3000`.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint (`next lint`) |
| `npm test` | Run Vitest tests (if configured) |

No CI pipeline exists (`.github/` is empty).

## Architecture

- **Single-page app** — all logic lives in `src/app/page.tsx` (the home route)
- **API routes** — `src/app/api/fs/*` handle file-based conversation persistence (JSON files under `/public/conversations/`)
- **State** — React `useState` in the page component; two Context providers (`ModalContext`, `PromptContext`) for modals and prompt templates
- **Storage** — conversations saved as JSON files on disk via API routes; prompt templates stored in `localStorage`; model selection persisted in `localStorage`
- **LLM integration** — LangChain.js `ChatOllama` with streaming responses

### Key entrypoints

| Path | Role |
|------|------|
| `src/app/page.tsx` | Main UI + chat logic + streaming |
| `src/app/layout.tsx` | Root layout, wraps providers |
| `src/app/api/fs/persist-convo/route.tsx` | Save conversation to disk |
| `src/app/api/fs/get-convos/route.tsx` | List saved conversations |
| `src/components/sidebar.tsx` | Conversation list sidebar |
| `src/components/app-navbar.tsx` | Model selector navbar |

### Constants

- `src/utils/constants.ts` — `baseUrl` (from env, defaults to `http://localhost:11434`), `fallbackModel` (`llama3.2`)

## Style / conventions

- ESLint: extends `next/core-web-vitals` only
- Prettier + `prettier-plugin-tailwindcss` (config in `prettier.config.js`, references `tailwind.config.ts`)
- Tailwind content glob covers `src/pages/`, `src/components/`, `src/app/`
- Path alias: `@/*` → `./src/*`

## Gotchas

- `/public/conversations/` is gitignored — conversations are local-only, never committed
- Ollama base URL must be configured via `NEXT_PUBLIC_OLLAMA_BASEURL` in `.env.local` if Ollama runs elsewhere; there is no runtime config UI for this
- Prompt templates are loaded from/stored to `localStorage` key `"prompts"`
- Sweep (`sweep.yaml`) enforces: no console.log, no dead code, no trailing whitespace, consistent indentation

## Agent rules

- **Every new/changed file must be linted** (`npm run lint`) and **tested** (Vitest) before delivery.
- **New behavior or features must be added to this file** — append a bullet under the relevant section without breaking existing structure.
- **If a requested feature contradicts anything in this file, ask the user first** — do not override documented constraints silently.
