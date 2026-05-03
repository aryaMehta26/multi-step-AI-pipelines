"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, PlayCircle } from "lucide-react";

import type { PipelineRunResponse } from "@/lib/orchestrator/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type RunsIndex = {
  runs: {
    id: string;
    createdAt: string;
    goalPreview: string;
    stepCount: number;
    totalMs: number;
  }[];
};

export function PipelineRunner() {
  const [goal, setGoal] = useState(
    "Ship a RocketRide-aligned demo: Next.js UI that runs a multi-step pipeline and shows traces.",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<PipelineRunResponse | null>(null);
  const [history, setHistory] = useState<RunsIndex["runs"]>([]);

  const refreshHistory = useCallback(async () => {
    const res = await fetch("/api/pipeline/runs");
    if (!res.ok) return;
    const data = (await res.json()) as RunsIndex;
    setHistory(data.runs);
  }, []);

  useEffect(() => {
    void refreshHistory();
  }, [refreshHistory]);

  const runPipeline = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Run failed.");
        return;
      }
      setLastRun(data as PipelineRunResponse);
      await refreshHistory();
    } catch {
      setError("Network error — is the dev server up?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Built-in orchestrator</Badge>
            <span className="text-xs text-white/50">
              Deterministic TS steps — swap for RocketRide HTTP later.
            </span>
          </div>
          <label className="text-sm font-medium text-white/85" htmlFor="goal">
            Goal / prompt
          </label>
          <textarea
            id="goal"
            rows={8}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full resize-y rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
            placeholder="Describe what you want the pipeline to plan…"
          />
          <Button
            type="button"
            onClick={() => void runPipeline()}
            disabled={loading}
            className="self-start"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Running…
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" /> Run pipeline
              </>
            )}
          </Button>
          {error ? (
            <p className="text-sm text-red-300/90" role="alert">
              {error}
            </p>
          ) : null}
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-white">Recent runs</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void refreshHistory()}
            >
              Refresh
            </Button>
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-white/55">No runs yet — execute once to populate.</p>
          ) : (
            <ul className="max-h-56 space-y-2 overflow-auto text-sm">
              {history.map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/45">
                    <time dateTime={r.createdAt}>{new Date(r.createdAt).toLocaleString()}</time>
                    <span>{r.totalMs} ms · {r.stepCount} steps</span>
                  </div>
                  <p className="mt-1 text-white/80">{r.goalPreview}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <div className="mb-3 text-sm font-semibold text-white">Step trace</div>
          {!lastRun ? (
            <p className="text-sm text-white/55">
              Output appears here after you run — mirrors how RocketRide surfaces node-by-node work.
            </p>
          ) : (
            <ol className="space-y-3">
              {lastRun.steps.map((s, i) => (
                <li
                  key={s.id}
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-medium text-white/45">
                      {i + 1}. {s.label}
                    </span>
                    <span className="text-xs text-white/40">{s.durationMs} ms</span>
                  </div>
                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-emerald-100/90">
                    {s.detail}
                  </pre>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-white">Artifact (markdown)</span>
            {lastRun ? (
              <span className="text-xs text-white/45">
                Run {lastRun.id.slice(0, 8)}… · {lastRun.totalMs} ms total
              </span>
            ) : null}
          </div>
          {!lastRun ? (
            <p className="text-sm text-white/55">Your generated handoff doc lands here.</p>
          ) : (
            <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-white/10 bg-black/45 p-3 font-mono text-xs leading-relaxed text-slate-100">
              {lastRun.artifact}
            </pre>
          )}
        </Card>
      </div>
    </div>
  );
}
