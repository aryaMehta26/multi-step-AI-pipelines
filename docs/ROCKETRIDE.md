# Running this project **with** RocketRide (VS Code)

This repo is intentionally **two-sided**:

1. **`.pipe` pipeline** — a real RocketRide graph you open in the RocketRide extension and execute against the RocketRide engine.
2. **Next.js app** — product UI + deterministic backend pipeline API that mirrors the same multi-node step/trace story for reviewers who only have a browser.

## Prerequisites

- Install the **RocketRide** extension from the VS Code Marketplace.
- Start or connect the RocketRide **engine** (extension default is typically `http://127.0.0.1:5565` — see `rocketride.hostUrl` in extension settings).

## Open the bundled pipeline

1. Clone this repo and open the folder in VS Code.
2. In the RocketRide activity bar, **open**  
   `pipelines/goal-planning-agent.pipe`  
   It contains **12 nodes**: `chat` → intake agent → GitHub tool + Docker tool + docs database + memory → risk agent → planning agent → LLM draft → readiness score → markdown report → handoff notification.
3. Set `ROCKETRIDE_OPENAI_KEY` (or your configured provider) per RocketRide docs so the LLM node can run.
4. Click **Play** and watch **traces** in the extension UI.

## Screenshots for your submission

Drop 3–4 PNGs into `docs/screenshots/` (Git will track them if you add the files):

| File | What to capture |
|------|------------------|
| `01-canvas.png` | The visual RocketRide canvas with the expanded release-readiness nodes wired. |
| `01-canvas-ui.png` | The `/app` UI canvas showing the same multi-node graph in the web app. |
| `02-run-trace.png` | Live run / trace panel during execution. |
| `03-next-app.png` | `/app` runner with node trace + readiness report side-by-side. |

See [SCREENSHOTS.md](./SCREENSHOTS.md) for a printable checklist.

## Linking the Next.js app to the engine

Copy `.env.example` to `.env.local` (not committed). The dashboard calls:

`GET {ROCKETRIDE_BASE_URL}/health`

so you get a visible **connected / unreachable** badge when the engine is up.

No engine? The UI still runs using the built-in TypeScript backend pipeline.
