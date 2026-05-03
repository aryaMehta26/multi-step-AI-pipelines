import { NextResponse } from "next/server";

import { findSyntheticRun } from "@/lib/orchestrator/synthetic";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const run = findSyntheticRun(id);

  if (!run) {
    return NextResponse.json({ error: "Unknown synthetic run id." }, { status: 404 });
  }

  return NextResponse.json(run);
}
