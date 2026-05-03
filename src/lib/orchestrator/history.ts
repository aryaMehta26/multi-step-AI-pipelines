import type { PipelineRunResponse } from "./types";

const MAX = 30;
const runs: PipelineRunResponse[] = [];

export function recordRun(run: PipelineRunResponse) {
  runs.unshift(run);
  runs.splice(MAX);
}

export function listRuns(): PipelineRunResponse[] {
  return [...runs];
}
