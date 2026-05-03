<div align="center">

# multi-step AI pipelines

**A small, sharp Next.js demo for multi-step AI workflows &mdash; built with an eye toward [RocketRide](https://github.com/rocketride-org/rocketride-server)-style pipelines.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Landing](#-what-you-get) &middot; [Quick start](#-quick-start) &middot; [Roadmap](#-roadmap)

</div>

---

## Why this exists

Recruiters skim repos in seconds. This project is a **fast-to-parse story**:

1. **Landing** (`/`) &mdash; product-shaped UI, clear value prop, obvious CTAs.
2. **Dashboard** (`/app`) &mdash; **runs a real multi-step pipeline** (TypeScript orchestrator) with step traces + markdown artifact + recent run history (in-memory per server).

The stack is intentionally boring-in-a-good-way: **Next.js App Router**, **TypeScript**, **Tailwind v4**, **lucide** icons &mdash; so the focus stays on **workflow UX**, not novelty framework churn.

---

## What you get

| Surface | Purpose |
|--------|---------|
| **`/`** | Dark, readable marketing shell + links to GitHub / inner app |
| **`/app`** | Live runner UI wired to **`POST /api/pipeline/run`** (built-in orchestrator; swap adapter for RocketRide engine later) |

### HTTP API (built-in)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/pipeline/run` | Body: `{ "goal": "…" }` — executes [`runGoalPipeline`](src/lib/orchestrator/runGoalPipeline.ts), returns steps + artifact |
| `GET` | `/api/pipeline/runs` | Live runs from memory; add **`?demo=1`** to prepend **seeded** rows (`syn-1` …) built from fixed goals via the same orchestrator |
| `GET` | `/api/pipeline/demo/[id]` | Full trace + artifact for a seeded id (e.g. `syn-1`) |

### Docker (Node production image)

Uses Next [**standalone**](https://nextjs.org/docs/app/building-your-application/deploying#docker-image) output (`next.config.ts`).

```bash
docker compose up --build
# app → http://localhost:3000
```

### GitHub Actions

Workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs **`npm ci` → `npm run lint` → `npm run build`** on pushes and PRs to `main`.

### Seeded (“synthetic”) data — does it work?

**Yes, for demos.** The checklist rows are **not** random junk: they run the **same TypeScript pipeline** as live traffic on **fixed goals**, so traces stay reproducible in fresh Docker/GitHub environments. Toggle **“Include seeded demo rows”** on `/app` or call `GET /api/pipeline/runs?demo=1`. Production persistence would replace in-memory history — seeds remain optional.

---

## Quick start

```bash
git clone git@github.com:aryaMehta26/multi-step-AI-pipelines.git
cd multi-step-AI-pipelines
npm install
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Then open **[http://127.0.0.1:3000](http://127.0.0.1:3000)** and **[http://127.0.0.1:3000/app](http://127.0.0.1:3000/app)**.

### Scripts

| Command | What it does |
|--------|----------------|
| `npm run dev` | Dev server (polling-friendly defaults for macOS file watchers) |
| `npm run build` | Production build |
| `npm run start` | Serve production output |
| `npm run lint` | ESLint |

---

## RocketRide alignment

RocketRide pitches **visual `.pipe` pipelines**, **live traces**, and a **fast runtime** inside VS Code &mdash; see their marketplace README / docs for settings like `rocketride.hostUrl` (often `http://localhost:5565`).

This repo ships **both**:

- **Our orchestrator** — deterministic pipeline steps you own (`src/lib/orchestrator/`).
- **A clean insertion point** — replace the executor behind `/api/pipeline/run` with HTTP/SDK calls to RocketRide when you wire `localhost:5565` (or hosted).

*(Integration PRs welcome once the HTTP surface you need is pinned.)*

---

## Dev notes

- **Hydration warnings**: Some browser extensions inject attributes (`rtrvr-*`) into anchors before React hydrates. This UI uses `suppressHydrationWarning` on key links and keeps layout tolerant; disabling extensions on `localhost` is the cleanest fix.
- **Port busy**: `lsof -tiTCP:3000 -sTCP:LISTEN | xargs kill -9` (macOS) then rerun `npm run dev`.

---

## Roadmap

- [x] API route: `POST /api/pipeline/run` + step traces + artifact (built-in orchestrator)
- [x] Docker image + `docker compose` for portable demos
- [x] GitHub Actions CI (`lint` + `build`)
- [x] Optional seeded runs (`?demo=1`) for empty environments
- [ ] Adapter: proxy same UI to RocketRide engine / `.pipe` execution
- [ ] Run history persistence (SQLite or KV) for believable demos
- [ ] Step trace panel (tokens, timings) when API allows
- [ ] One-click deploy story (Vercel) + env template

---

## License

MIT &mdash; see [LICENSE](./LICENSE).

---

<div align="center">

**Built by [@aryaMehta26](https://github.com/aryaMehta26)** &mdash; *ship the story, then ship the wires.*

</div>
