import { NextResponse } from "next/server";

import { listRuns } from "@/lib/orchestrator/history";
import type { PipelineRunResponse } from "@/lib/orchestrator/types";
import { getSyntheticRuns } from "@/lib/orchestrator/synthetic";

export const runtime = "nodejs";

function toSummary(r: PipelineRunResponse) {
  return {
    id: r.id,
    createdAt: r.createdAt,
    goalPreview: r.goal.slice(0, 120) + (r.goal.length > 120 ? "…" : ""),
    stepCount: r.steps.length,
    totalMs: r.totalMs,
    synthetic: r.id.startsWith("syn-"),
  };
}

export async function GET(req: Request) {
  const demo = new URL(req.url).searchParams.get("demo") === "1";

  const live = listRuns().map(toSummary);

  const synthetic = demo ? getSyntheticRuns().map(toSummary) : [];

  return NextResponse.json({
    runs: [...synthetic, ...live],
    demo,
  });
}
