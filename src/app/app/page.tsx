import Link from "next/link";
import { ArrowLeft, GitBranch, Sparkles } from "lucide-react";

import { PipelineRunner } from "@/components/pipeline-runner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AppDashboardPage() {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "#070a10", color: "#f8fafc" }}
      suppressHydrationWarning
    >
      <header className="border-b border-white/10 px-6 py-4" suppressHydrationWarning>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" prefetch={false} suppressHydrationWarning>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <span className="text-white/40">|</span>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white/70" />
              <span className="font-semibold tracking-tight">Pipeline workspace</span>
            </div>
          </div>
          <Badge variant="outline">Live · built-in orchestrator</Badge>
        </div>
      </header>

      <main
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10"
        suppressHydrationWarning
      >
        <section className="space-y-2" suppressHydrationWarning>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Run your own multi-step pipeline
          </h1>
          <p className="max-w-3xl text-sm text-white/70 sm:text-base">
            This is <strong className="text-white/90">our orchestration</strong>: a TypeScript
            pipeline that ingests your goal, extracts signals, drafts a plan, and emits a markdown
            artifact. It runs on the server via{" "}
            <code className="rounded bg-white/10 px-1 text-xs">POST /api/pipeline/run</code>.
            Later you can swap the executor for{" "}
            <a
              className="text-sky-300 underline-offset-2 hover:underline"
              href="https://github.com/rocketride-org/rocketride-server"
              target="_blank"
              rel="noreferrer"
              suppressHydrationWarning
            >
              RocketRide
            </a>{" "}
            (e.g. engine at{" "}
            <code className="rounded bg-white/10 px-1 text-xs">localhost:5565</code>) without
            changing the dashboard layout.
          </p>
        </section>

        <PipelineRunner />

        <Card className="border-white/10 bg-white/[0.03]">
          <div className="flex flex-wrap items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5">
              <GitBranch className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="font-semibold text-white">Why this counts as “ours”</div>
              <p className="text-sm text-white/65">
                The step graph, artifact format, HTTP surface, and UI are authored here — not a
                generic ChatGPT wrapper. RocketRide integration becomes a backend adapter when you
                are ready.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
