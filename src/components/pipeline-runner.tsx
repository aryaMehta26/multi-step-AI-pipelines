"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, PlayCircle } from "lucide-react";

import type { PipelineRunResponse } from "@/lib/orchestrator/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type RunRow = {
  id: string;
  createdAt: string;
  goalPreview: string;
  stepCount: number;
  totalMs: number;
  synthetic?: boolean;
};

type RunsPayload = {
  runs: RunRow[];
  demo?: boolean;
};

async function fetchRunRows(includeDemo: boolean): Promise<RunRow[]> {
  const q = includeDemo ? "?demo=1" : "";
  const res = await fetch(`/api/pipeline/runs${q}`);
  if (!res.ok) return [];
  const data = (await res.json()) as RunsPayload;
  return data.runs;
}

export function PipelineRunner() {
  const [goal, setGoal] = useState(
    "Ship a RocketRide-aligned demo: Next.js UI that runs a multi-step pipeline and shows traces.",
  );
  const [includeDemo, setIncludeDemo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<PipelineRunResponse | null>(null);
  const [history, setHistory] = useState<RunRow[]>([]);

  const refreshHistory = useCallback(async () => {
    setHistory(await fetchRunRows(includeDemo));
  }, [includeDemo]);

  useEffect(() => {
    let cancelled = false;
    void fetchRunRows(includeDemo).then((rows) => {
      if (!cancelled) setHistory(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [includeDemo]);

  const loadSyntheticDetail = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/pipeline/demo/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data?.error === "string" ? data.error : "Could not load demo run.");
        return;
      }
      setLastRun(data as PipelineRunResponse);
    } catch {
      setError("Network error loading synthetic run.");
    }
  };

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
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-white">Recent runs</span>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-white/65">
                <input
                  type="checkbox"
                  className="accent-sky-400"
                  checked={includeDemo}
                  onChange={(e) => setIncludeDemo(e.target.checked)}
                />
                Include seeded demo rows
              </label>
              <Button type="button" variant="ghost" size="sm" onClick={() => void refreshHistory()}>
                Refresh
              </Button>
            </div>
          </div>
          <p className="mb-3 text-xs text-white/45">
            Seeded rows use fixed goals through the same pipeline code — useful for Docker / GitHub empty instances.
            Click a row marked <Badge className="mx-1 align-middle text-[10px]">seed</Badge> to load full trace + artifact.
          </p>
          {history.length === 0 ? (
            <p className="text-sm text-white/55">
              No runs yet — turn on seeded demos or execute once.
            </p>
          ) : (
            <ul className="max-h-56 space-y-2 overflow-auto text-sm">
              {history.map((r) => (
                <li key={r.id}>
                  {r.synthetic ? (
                    <button
                      type="button"
                      className="w-full rounded-lg border border-violet-500/25 bg-violet-500/10 px-3 py-2 text-left transition hover:bg-violet-500/15"
                      onClick={() => void loadSyntheticDetail(r.id)}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/45">
                        <span className="flex flex-wrap items-center gap-2">
                          <time dateTime={r.createdAt}>{new Date(r.createdAt).toLocaleString()}</time>
                          <Badge variant="outline" className="text-[10px]">
                            seed
                          </Badge>
                        </span>
                        <span>
                          {r.totalMs} ms · {r.stepCount} steps
                        </span>
                      </div>
                      <p className="mt-1 text-white/85">{r.goalPreview}</p>
                    </button>
                  ) : (
                    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/45">
                        <time dateTime={r.createdAt}>{new Date(r.createdAt).toLocaleString()}</time>
                        <span>
                          {r.totalMs} ms · {r.stepCount} steps
                        </span>
                      </div>
                      <p className="mt-1 text-white/80">{r.goalPreview}</p>
                    </div>
                  )}
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
