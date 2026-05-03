import { ArrowRight, GitBranch, PlayCircle, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div
      className="flex-1"
      style={{
        backgroundColor: "#070a10",
        color: "#f8fafc",
        minHeight: "100vh",
      }}
      suppressHydrationWarning
    >
      <header
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6"
        suppressHydrationWarning
      >
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">RocketRide</div>
            <div className="text-xs text-white/60">Pipeline Demo</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge>Demo-ready UI</Badge>
          <Button asChild variant="secondary">
            <a href="/app" suppressHydrationWarning>
              Open app <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </header>

      <main
        className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10"
        suppressHydrationWarning
      >
        <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
          <section className="space-y-6">
            <Badge variant="outline">Built for RocketRide evaluation</Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl text-white">
              A polished UI that runs multi-step AI pipelines.
            </h1>
            <p className="max-w-xl text-pretty text-base text-white/70 sm:text-lg">
              This demo shows a clean “product UI” on top of a pipeline runner:
              create a run, watch step-by-step outputs, and share reproducible
              results.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild>
                <a href="/app" suppressHydrationWarning>
                  Launch the dashboard <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a
                  href="https://github.com/rocketride-org/rocketride-server"
                  target="_blank"
                  rel="noreferrer"
                  suppressHydrationWarning
                >
                  View `rocketride-server` <GitBranch className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </section>

          <section className="grid gap-4">
            <Card>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
                  <PlayCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Runs history</div>
                  <div className="text-sm text-white/70">
                    Every run is saved with structured step outputs for easy
                    review.
                  </div>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Pipeline steps</div>
                  <div className="text-sm text-white/70">
                    Clear step-by-step outputs (extract → plan → draft →
                    validate).
                  </div>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
                  <GitBranch className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">PR-ready artifacts</div>
                  <div className="text-sm text-white/70">
                    Outputs are formatted to copy directly into issues/PRs.
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <Card>
            <div className="text-sm text-white/70">Time-to-wow</div>
            <div className="mt-1 text-2xl font-semibold">30 seconds</div>
            <div className="mt-2 text-sm text-white/60">
              A reviewer can run a pipeline and see value immediately.
            </div>
          </Card>
          <Card>
            <div className="text-sm text-white/70">UX quality</div>
            <div className="mt-1 text-2xl font-semibold">Product-grade</div>
            <div className="mt-2 text-sm text-white/60">
              Clean typography, states, and layouts — not a hackathon UI.
            </div>
          </Card>
          <Card>
            <div className="text-sm text-white/70">Scope</div>
            <div className="mt-1 text-2xl font-semibold">MVP + polish</div>
            <div className="mt-2 text-sm text-white/60">
              Enough to be real, small enough to ship fast.
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
