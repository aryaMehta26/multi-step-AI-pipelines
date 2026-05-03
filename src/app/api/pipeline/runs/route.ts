import { NextResponse } from "next/server";

import { listRuns } from "@/lib/orchestrator/history";

export const runtime = "nodejs";

export async function GET() {
  const runs = listRuns().map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    goalPreview: r.goal.slice(0, 120) + (r.goal.length > 120 ? "…" : ""),
    stepCount: r.steps.length,
    totalMs: r.totalMs,
  }));

  return NextResponse.json({ runs });
}
