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
2. **Dashboard** (`/app`) &mdash; placeholder workspace where pipeline runs, traces, and history will land.

The stack is intentionally boring-in-a-good-way: **Next.js App Router**, **TypeScript**, **Tailwind v4**, **lucide** icons &mdash; so the focus stays on **workflow UX**, not novelty framework churn.

---

## What you get

| Surface | Purpose |
|--------|---------|
| **`/`** | Dark, readable marketing shell + links to GitHub / inner app |
| **`/app`** | Dashboard stub aligned with future RocketRide engine hooks (`localhost:5565` in extension defaults) |

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

This repo is the **thin web shell** where you would:

- Trigger runs against that engine (or mock responses first).
- Render **step-by-step outputs**, **run history**, and later **trace widgets**.

*(Integration PRs welcome once the HTTP surface you need is pinned.)*

---

## Dev notes

- **Hydration warnings**: Some browser extensions inject attributes (`rtrvr-*`) into anchors before React hydrates. This UI uses `suppressHydrationWarning` on key links and keeps layout tolerant; disabling extensions on `localhost` is the cleanest fix.
- **Port busy**: `lsof -tiTCP:3000 -sTCP:LISTEN | xargs kill -9` (macOS) then rerun `npm run dev`.

---

## Roadmap

- [ ] API route: `POST /api/runs` &rarr; proxy to RocketRide engine or mock pipeline
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
