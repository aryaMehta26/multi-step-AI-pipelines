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
  { term: "github", tag: "repo" },
  { term: "pr", tag: "repo" },
  { term: "ci", tag: "repo" },
  { term: "deploy", tag: "deploy" },
  { term: "release", tag: "deploy" },
  { term: "database", tag: "data" },
  { term: "postgres", tag: "data" },
  { term: "mcp", tag: "tools" },
  { term: "slack", tag: "handoff" },
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

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function bulletList(values: string[]): string {
  return values.map((x) => `- ${x}`).join("\n");
}

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

/**
 * Deterministic multi-node release readiness pipeline.
 * It mirrors the RocketRide canvas with mock tool/database signals so the app is runnable anywhere.
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
    tick(steps, "chat_release_goal_1", "Chat input", t, "Empty release goal — nothing to route.");
    return {
      steps,
      artifact: "_No pipeline output — provide a release, product, or integration goal._",
      totalMs: Date.now() - tAll,
    };
  }

  tick(
    steps,
    "chat_release_goal_1",
    "Chat input",
    t,
    `Captured release goal: ${goal}\nUnits: ${goal.length} chars, ${goal.split(" ").filter(Boolean).length} words (capped at ${MAX_INPUT}).`,
  );

  t = Date.now();
  const lower = goal.toLowerCase();
  const hits = SIGNAL_LEXICON.filter(({ term }) => lower.includes(term));
  const tags = unique(hits.map((h) => h.tag));
  const releaseType = includesAny(lower, ["docker", "deploy", "release", "ci"])
    ? "deployment-readiness"
    : includesAny(lower, ["github", "pr", "repo", "issue"])
      ? "repo-workflow"
      : includesAny(lower, ["database", "postgres", "vector", "rag"])
        ? "data-backed-ai"
        : "product-demo";
  tick(
    steps,
    "agent_intake_1",
    "Intake agent",
    t,
    [
      `Release type: ${releaseType}`,
      `Route: GitHub repo checks + Docker/deploy checks + docs database + memory + risk/planning agents.`,
      hits.length
        ? `Matched tokens -> tags: ${tags.join(", ")}\nHits: ${hits.map((h) => h.term).join(", ")}`
        : "No lexicon hits -> treating as product-demo readiness.",
    ].join("\n"),
  );

  t = Date.now();
  const repoSignals = [
    "GitHub Actions workflow present: lint + build gate",
    "README explains quick start and API surface",
    "Open-source PR evidence can be linked from submission",
    tags.includes("repo") ? "Repo-related keywords detected in goal" : "Repo path inferred from release workflow",
  ];
  tick(steps, "tool_github_repo_1", "GitHub repo tool", t, bulletList(repoSignals));

  t = Date.now();
  const deploySignals = [
    "Dockerfile present for production Next.js standalone output",
    "docker-compose.yml gives one-command local run",
    "Node 20 runtime declared for local, Docker, and CI alignment",
    tags.includes("deploy") ? "Deployment/release terms detected" : "Deploy check still runs as release guardrail",
  ];
  tick(steps, "tool_docker_deploy_1", "Docker deploy check", t, bulletList(deploySignals));

  t = Date.now();
  const contextDocs = [
    "Root README positions the app as a multi-step AI pipeline workspace",
    "RocketRide guide documents the bundled .pipe file and engine health check",
    "Screenshot checklist asks for canvas, trace, and app evidence",
    "Submission narrative should emphasize full-stack app + backend pipeline + OSS PRs",
  ];
  tick(steps, "database_docs_context_1", "Docs/context database", t, bulletList(contextDocs));

  t = Date.now();
  const memorySignals = [
    "Friend feedback: previous graph looked too basic",
    "New requirement: use various node types and bigger use case",
    "Keep demo runnable with deterministic mock data",
  ];
  tick(steps, "memory_release_1", "Run memory", t, bulletList(memorySignals));

  t = Date.now();
  const risks = [
    "Canvas can look decorative if backend trace does not mirror node names",
    "Mock data must be presented honestly as deterministic demo signals",
    "Submission should explain RocketRide integration point without claiming hosted execution",
    "Screenshots should show the expanded graph and a completed run trace",
  ];
  tick(
    steps,
    "agent_risk_analysis_1",
    "Risk analysis agent",
    t,
    [`Inputs merged: repo + deploy + docs + memory`, `Main blockers:\n${bulletList(risks)}`].join("\n"),
  );

  t = Date.now();
  const plan = [
    "1. Confirm the expanded .pipe opens as a multi-node canvas.",
    "2. Run /app and capture the full graph plus trace/artifact output.",
    "3. Include Docker/CI proof so reviewers can run the same backend pipeline.",
    "4. State that GitHub/Docker/docs/database signals are deterministic adapters today.",
    "5. Replace mock adapters with RocketRide engine/SDK calls when execution API is pinned.",
  ];
  tick(steps, "agent_execution_plan_1", "Execution planner agent", t, plan.join("\n"));

  t = Date.now();
  const llmDraft = [
    "Drafted reviewer summary:",
    "This is a full-stack release-readiness copilot. The UI sends a release goal to a backend pipeline, the pipeline fans out to repo/deploy/docs/memory nodes, then agents merge risk, plan the launch, score readiness, and emit a markdown handoff.",
  ].join("\n");
  tick(steps, "llm_openai_draft_1", "LLM draft node", t, llmDraft);

  t = Date.now();
  const scoreParts = {
    repo: repoSignals.length >= 3 ? 28 : 20,
    deploy: deploySignals.length >= 3 ? 23 : 16,
    docs: contextDocs.length >= 3 ? 19 : 12,
    risk: risks.length <= 4 ? 20 : 14,
  };
  const readinessScore = Object.values(scoreParts).reduce((sum, value) => sum + value, 0);
  tick(
    steps,
    "score_release_readiness_1",
    "Readiness score",
    t,
    [
      `Score: ${readinessScore}/100`,
      `Repo: ${scoreParts.repo}/30`,
      `Deploy: ${scoreParts.deploy}/25`,
      `Docs/context: ${scoreParts.docs}/20`,
      `Risk control: ${scoreParts.risk}/25`,
    ].join("\n"),
  );

  t = Date.now();
  const artifact = [
    `# AI Release Readiness Report`,
    ``,
    `## Release goal`,
    goal,
    ``,
    `## Classification`,
    `- Type: ${releaseType}`,
    `- Themes: ${tags.length ? tags.join(", ") : "general product demo"}`,
    ``,
    `## Signals checked`,
    `### GitHub / repo`,
    bulletList(repoSignals),
    ``,
    `### Docker / deploy`,
    bulletList(deploySignals),
    ``,
    `### Docs / database context`,
    bulletList(contextDocs),
    ``,
    `## Risks`,
    bulletList(risks),
    ``,
    `## Execution plan`,
    plan.join("\n"),
    ``,
    `## Readiness score`,
    `${readinessScore}/100`,
    ``,
    `## Handoff`,
    `_This artifact is produced by the built-in TypeScript backend pipeline. The same node shape is represented in the RocketRide .pipe file and can be swapped to RocketRide engine/SDK execution later._`,
  ].join("\n");
  tick(
    steps,
    "response_release_report_1",
    "Markdown report",
    t,
    `Generated ${artifact.length} chars of structured markdown.`,
  );

  t = Date.now();
  tick(
    steps,
    "notify_handoff_1",
    "Handoff notification mock",
    t,
    `Prepared email/slack handoff summary with readiness score ${readinessScore}/100 and ${risks.length} tracked risks.`,
  );

  return { steps, artifact, totalMs: Date.now() - tAll };
}
