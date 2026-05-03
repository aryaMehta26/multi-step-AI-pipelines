export type PipelineStep = {
  id: string;
  label: string;
  detail: string;
  durationMs: number;
};

export type PipelineRunResponse = {
  id: string;
  createdAt: string;
  goal: string;
  steps: PipelineStep[];
  artifact: string;
  totalMs: number;
};
