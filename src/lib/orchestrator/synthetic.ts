import type { PipelineRunResponse } from "./types";
import { runGoalPipeline } from "./runGoalPipeline";

/** Fixed goals — deterministic output from `runGoalPipeline` (real logic, “synthetic” only in sense of seeded inputs). */
const SYNTHETIC_GOALS = [
  "Ship a Next.js dashboard that runs multi-step pipelines with traces and markdown artifacts.",
  "Add Docker plus GitHub Actions CI so recruiters can clone and verify builds in one click.",
  "Prototype RAG over internal docs using TypeScript APIs and vector embeddings.",
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
