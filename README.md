# AI Meme Generator

React 19 + Vite frontend that calls a local Express backend to generate
AI-written memes (Hinglish humour) painted onto classic meme templates.

## Project structure

```
.
├── index.html            Frontend entry point
├── src/                  React app (React 19 + TypeScript)
│   ├── main.tsx          React root
│   ├── App.tsx           Main component: category picker + meme grid
│   ├── App.css           App styles
│   ├── api.ts            Frontend API client → POST /api/memes
│   ├── index.css         Global styles
│   └── types.ts          Meme / Category types
├── server/               Express backend (Node.js)
│   ├── index.js          Express server (POST /api/memes)
│   ├── memegen.js        Meme template catalog + image builder (memegen.link)
│   ├── memes-core.js     Shared generation logic
│   ├── openrouter.js     AI text generation via OpenRouter
│   ├── .env.example      Env template (copy to .env)
│   └── package.json      Server deps (express, dotenv)
└── vite.config.ts        Vite config + /api dev proxy → :8787
```

## Prerequisites

- Node.js 18+ (frontend) and a recent Node for the server (uses `fetch`).
- An OpenRouter API key. Copy `server/.env.example` to `server/.env` and set
  `OPEN_ROUTER_API_KEY`. Without it the /api/memes endpoint returns 502.

## Running locally (two terminals)

1. Start the backend:

   ```bash
   cd server
   npm install
   cp .env.example .env   # then add your OPEN_ROUTER_API_KEY
   npm run dev            # Express on http://localhost:8787
   ```

2. Start the frontend (root):

   ```bash
   npm install
   npm run dev            # Vite on http://localhost:5173
   ```

Vite proxies `/api` → `http://localhost:8787` during development, so the AI
key never leaks to the browser.

## Scripts

| Command               | Description                          |
| --------------------- | ------------------------------------ |
| `npm run dev`         | Start Vite dev server                |
| `npm run build`       | Type-check + production build        |
| `npm run lint`        | Run oxlint (React + TS rules)        |
| `npm run preview`     | Preview the production build         |

## API contract

```
POST /api/memes  body: { "category": "bollywood" }
-> { "memes": [{ "id", "imageUrl", "caption" }] }
```

Categories: `bollywood`, `cartoon`, `viral-songs`, `sports`.