# Running this project **with** RocketRide (VS Code / Cursor)

This repo is intentionally **two-sided**:

1. **`.pipe` pipeline** — a real RocketRide graph you open in the RocketRide extension and execute against the RocketRide engine.
2. **Next.js app** — product UI + deterministic “orchestrator” API that mirrors the same step/trace story for reviewers who only have a browser.

## Prerequisites

- Install the **RocketRide** extension from the VS Code Marketplace (works in VS Code; Cursor users can follow the extension’s Cursor integration settings if enabled).
- Start or connect the RocketRide **engine** (extension default is typically `http://127.0.0.1:5565` — see `rocketride.hostUrl` in extension settings).

## Open the bundled pipeline

1. Clone this repo and open the folder in VS Code/Cursor.
2. In the RocketRide activity bar, **open**  
   `pipelines/goal-planning-agent.pipe`  
   It contains **multiple nodes**: `chat` → `agent_rocketride` → `llm_openai` + `memory_internal` → `response_answers`.
3. Set `ROCKETRIDE_OPENAI_KEY` (or your configured provider) per RocketRide docs so the LLM node can run.
4. Click **Play** and watch **traces** in the extension UI.

## Screenshots for your submission

Drop 2–3 PNGs into `docs/screenshots/` (Git will track them if you add the files):

| File | What to capture |
|------|------------------|
| `01-canvas.png` | The visual canvas with nodes wired. |
| `02-run-trace.png` | Live run / trace panel during execution. |
| `03-next-app.png` | `/app` runner with step trace + artifact side-by-side. |

See [SCREENSHOTS.md](./SCREENSHOTS.md) for a printable checklist.

## Linking the Next.js app to the engine

Copy `.env.example` to `.env.local` (not committed). The dashboard calls:

`GET {ROCKETRIDE_BASE_URL}/health`

so you get a visible **connected / unreachable** badge when the engine is up.

No engine? The UI still runs using the built-in TypeScript orchestrator.
