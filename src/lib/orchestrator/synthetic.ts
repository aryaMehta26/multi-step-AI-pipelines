import type { PipelineRunResponse } from "./types";
import { runGoalPipeline } from "./runGoalPipeline";

/** Fixed goals — deterministic output from `runGoalPipeline` (real logic, “synthetic” only in sense of seeded inputs). */
const SYNTHETIC_GOALS = [
  "Prepare a release-readiness review for a Next.js AI pipeline app with GitHub, Docker, docs, risk scoring, and handoff.",
  "Assess whether a Dockerized full-stack demo with CI, screenshots, and OSS PR links is ready for recruiter review.",
  "Plan a data-backed AI workflow using docs context, memory, GitHub repo signals, and a markdown launch report.",
] as const;

let cached: PipelineRunResponse[] | null = null;

function isoMinutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

/** Lazily-built demo runs — same orchestrator as live traffic; IDs prefixed so UI can label them. */
export function getSyntheticRuns(): PipelineRunResponse[] {
  if (cached) return cached;

  cached = SYNTHETIC_GOALS.map((goal, idx) => {
    const { steps, artifact, totalMs } = runGoalPipeline(goal);
    return {
      id: `syn-${idx + 1}`,
      createdAt: isoMinutesAgo(120 - idx * 37),
      goal,
      steps,
      artifact,
      totalMs,
    };
  });

  return cached;
}

export function findSyntheticRun(id: string): PipelineRunResponse | undefined {
  return getSyntheticRuns().find((r) => r.id === id);
}
