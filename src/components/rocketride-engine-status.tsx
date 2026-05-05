"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";

type HealthPayload = {
  ok: boolean;
  status: number;
  baseUrl: string;
  bodyPreview?: string;
  error?: string;
};

export function RocketrideEngineStatus() {
  const [data, setData] = useState<HealthPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/rocketride/health")
      .then((r) => r.json())
      .then((j: HealthPayload) => {
        if (!cancelled) setData(j);
      })
      .catch(() => {
        if (!cancelled) setData({ ok: false, status: 0, baseUrl: "", error: "fetch failed" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return (
      <Badge variant="outline" className="animate-pulse">
        Engine: checking…
      </Badge>
    );
  }

  if (data.ok) {
    return (
      <Badge className="border border-emerald-400/40 bg-emerald-500/15 text-emerald-100">
        RocketRide engine reachable · {data.baseUrl}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-amber-400/30 text-amber-100/90">
      Engine offline (Next.js orchestrator still works) · {data.baseUrl || "—"}
    </Badge>
  );
}
