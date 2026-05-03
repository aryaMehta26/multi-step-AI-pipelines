import type { PipelineStep } from "./types";

const MAX_INPUT = 12_000;

const SIGNAL_LEXICON: { term: string; tag: string }[] = [
  { term: "rag", tag: "retrieval" },
  { term: "vector", tag: "retrieval" },
  { term: "embed", tag: "retrieval" },
  { term: "llm", tag: "models" },
  { term: "openai", tag: "models" },
  { term: "agent", tag: "orchestration" },
  { term: "pipeline", tag: "orchestration" },
  { term: "next.js", tag: "web" },
  { term: "nextjs", tag: "web" },
  { term: "typescript", tag: "web" },
  { term: "react", tag: "web" },
  { term: "api", tag: "integration" },
  { term: "docker", tag: "ops" },
  { term: "trace", tag: "observability" },
  { term: "token", tag: "observability" },
];

function tick(
  steps: PipelineStep[],
  id: string,
  label: string,
  start: number,
  detail: string,
) {
  steps.push({
    id,
    label,
    detail,
    durationMs: Math.max(0, Date.now() - start),
  });
}

/**
 * Deterministic multi-step “agentic” demo: our own orchestration, no external LLM required.
 * Swap this module later for RocketRide engine / HTTP calls.
 */
export function runGoalPipeline(rawGoal: string): {
  steps: PipelineStep[];
  artifact: string;
  totalMs: number;
} {
  const tAll = Date.now();
  const steps: PipelineStep[] = [];

  let t = Date.now();
  const goal = rawGoal.trim().replace(/\s+/g, " ").slice(0, MAX_INPUT);
  if (!goal.length) {
    tick(steps, "ingest", "Ingest goal", t, "Empty input — nothing to route.");
    return {
      steps,
      artifact: "_No pipeline output — provide a short goal describing what you want to build or debug._",
      totalMs: Date.now() - tAll,
    };
  }

  tick(
    steps,
    "ingest",
    "Ingest & normalize",
    t,
    `Units: ${goal.length} chars, ${goal.split(" ").filter(Boolean).length} words (capped at ${MAX_INPUT}).`,
  );

  t = Date.now();
  const lower = goal.toLowerCase();
  const hits = SIGNAL_LEXICON.filter(({ term }) => lower.includes(term));
  const tags = Array.from(new Set(hits.map((h) => h.tag)));
  tick(
    steps,
    "signals",
    "Extract signals",
    t,
    hits.length
      ? `Matched tokens → tags: ${tags.join(", ")}\nHits: ${hits.map((h) => h.term).join(", ")}`
      : "No lexicon hits — treating as generic software goal.",
  );

  t = Date.now();
  const plan = [
    "1. Restate success criteria in one sentence.",
    "2. List unknowns and the fastest experiment to kill each one.",
    "3. Sketch the smallest end-to-end slice (UI → API → persistence if any).",
    "4. Define observability: logs/metrics/traces you would watch on first prod run.",
    "5. Ship behind a feature flag or demo branch; iterate from real feedback.",
  ].join("\n");
  tick(steps, "plan", "Draft execution plan", t, plan);

  t = Date.now();
  const artifact = [
    `# Pipeline artifact`,
    ``,
    `## Goal`,
    goal,
    ``,
    `## Detected themes`,
    tags.length ? tags.map((x) => `- ${x}`).join("\n") : `- general`,
    ``,
    `## Suggested milestone zero`,
    `- Scope: vertical slice that proves the riskiest assumption.`,
    `- Timebox: one focused session with a crisp demo script.`,
    ``,
    `## Handoff`,
    `_This artifact is produced by our built-in orchestrator. Wire the same hook to RocketRide (\`localhost:5565\`) when you want real node traces._`,
  ].join("\n");
  tick(
    steps,
    "emit",
    "Emit markdown artifact",
    t,
    `Generated ${artifact.length} chars of structured markdown.`,
  );

  return { steps, artifact, totalMs: Date.now() - tAll };
}
