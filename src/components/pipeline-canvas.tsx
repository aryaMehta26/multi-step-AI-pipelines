"use client";

import pipelineDefinition from "@/data/goal-planning-pipeline.json";
import {
  buildLayoutNodes,
  edgePath,
  extractEdges,
  getGraphBounds,
  pickEdgeRoute,
  type LayoutNode,
  type PipeDefinition,
} from "@/lib/pipeline-graph";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const def = pipelineDefinition as PipeDefinition;

function providerTone(provider: string): string {
  if (provider.includes("chat")) return "from-sky-500/25 to-sky-600/10 border-sky-400/35";
  if (provider.includes("agent")) return "from-violet-500/25 to-fuchsia-600/10 border-violet-400/40";
  if (provider.includes("llm")) return "from-amber-500/25 to-orange-600/10 border-amber-400/35";
  if (provider.includes("memory")) return "from-emerald-500/25 to-teal-600/10 border-emerald-400/35";
  if (provider.includes("response")) return "from-rose-500/25 to-pink-600/10 border-rose-400/35";
  return "from-white/10 to-white/5 border-white/15";
}

function shortLabel(provider: string): string {
  return provider.replace(/_1$/, "").replace(/_/g, " ");
}

export function PipelineCanvas() {
  const components = def.components ?? [];
  const nodes = buildLayoutNodes(components);
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const edges = extractEdges(components);
  const pad = 48;
  const { width, height } = getGraphBounds(nodes, pad);

  return (
    <Card
      className="overflow-hidden border-white/10 bg-[#05070d]"
      suppressHydrationWarning
    >
      <div className="border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm font-semibold text-white">Pipeline canvas</div>
            <p className="text-xs text-white/50">
              Same graph as <code className="rounded bg-white/10 px-1">pipelines/goal-planning-agent.pipe</code>{" "}
              — layout matches the RocketRide VS Code canvas (positions + edges).
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <div
          className="relative mx-auto"
          style={{ width, height, minWidth: "min(100%, 920px)" }}
          suppressHydrationWarning
        >
          {/* subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.45) 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />

          <svg
            className="absolute inset-0 text-sky-400/55"
            width={width}
            height={height}
            aria-hidden
          >
            <defs>
              <linearGradient id="wire-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(56, 189, 248)" stopOpacity="0.25" />
                <stop offset="50%" stopColor="rgb(167, 139, 250)" stopOpacity="0.65" />
                <stop offset="100%" stopColor="rgb(244, 114, 182)" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            {edges.map((e, i) => {
              const from = nodeById.get(e.from);
              const to = nodeById.get(e.to);
              if (!from || !to) return null;
              const route = pickEdgeRoute(from, to);
              const d = edgePath(from, to, pad, route);
              return (
                <path
                  key={`${e.from}->${e.to}-${i}`}
                  d={d}
                  fill="none"
                  stroke="url(#wire-gradient)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {nodes.map((n) => (
            <CanvasNode key={n.id} node={n} offset={pad} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function CanvasNode({ node, offset }: { node: LayoutNode; offset: number }) {
  return (
    <div
      className={cn(
        "absolute z-10 rounded-xl border bg-gradient-to-br p-2.5 shadow-lg shadow-black/40 backdrop-blur-sm",
        providerTone(node.provider),
      )}
      style={{
        left: node.x + offset,
        top: node.y + offset,
        width: node.width,
        minHeight: node.height,
      }}
      suppressHydrationWarning
    >
      <div className="text-[10px] font-medium uppercase tracking-wide text-white/55">
        {shortLabel(node.provider)}
      </div>
      <div className="truncate font-mono text-[11px] text-white/90">{node.id}</div>
    </div>
  );
}
