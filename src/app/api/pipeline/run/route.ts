import { NextResponse } from "next/server";

import { recordRun } from "@/lib/orchestrator/history";
import { runGoalPipeline } from "@/lib/orchestrator/runGoalPipeline";
import type { PipelineRunResponse } from "@/lib/orchestrator/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON body." }, { status: 400 });
  }

  const goal =
    typeof body === "object" &&
    body !== null &&
    "goal" in body &&
    typeof (body as { goal: unknown }).goal === "string"
      ? (body as { goal: string }).goal
      : null;

  if (goal === null) {
    return NextResponse.json({ error: 'Send { "goal": "string" }.' }, { status: 400 });
  }

  const { steps, artifact, totalMs } = runGoalPipeline(goal);
  const run: PipelineRunResponse = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    goal,
    steps,
    artifact,
    totalMs,
  };

  recordRun(run);
  return NextResponse.json(run);
}
