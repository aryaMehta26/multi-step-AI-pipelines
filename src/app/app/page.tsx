import { ArrowLeft, GitBranch, PlayCircle, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AppDashboardPage() {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "#070a10", color: "#f8fafc" }}
    >
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <a href="/" suppressHydrationWarning>
                <ArrowLeft className="h-4 w-4" />
                Back
              </a>
            </Button>
            <span className="text-white/40">|</span>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white/70" />
              <span className="font-semibold tracking-tight">Pipeline dashboard</span>
            </div>
          </div>
          <Badge variant="outline">Coming next: live runs</Badge>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            RocketRide demo workspace
          </h1>
          <p className="max-w-2xl text-sm text-white/70 sm:text-base">
            Wire Run / history to your local engine (default extension URL{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
              http://localhost:5565
            </code>
            ) or a mocked pipeline for demos.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5">
                <PlayCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-white">Run pipeline</div>
                <div className="mt-1 text-sm text-white/65">
                  Trigger from UI once API route + engine URL are configured.
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-white">Step traces</div>
                <div className="mt-1 text-sm text-white/65">
                  Mirror RocketRide debug traces per node when integrated.
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5">
                <GitBranch className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-white">Contributions</div>
                <div className="mt-1 text-sm text-white/65">
                  Pair this demo with PRs to{" "}
                  <code className="rounded bg-white/10 px-1 text-[11px]">
                    rocketride-server
                  </code>
                  .
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="border-dashed border-white/20 bg-white/[0.03]">
          <p className="text-sm text-white/65">
            Hydration warnings in dev often come from extensions injecting{" "}
            <code className="rounded bg-white/10 px-1">rtrvr-*</code> into links.
            This page uses{" "}
            <code className="rounded bg-white/10 px-1">suppressHydrationWarning</code>{" "}
            on anchors; you can also disable extensions on localhost.
          </p>
        </Card>
      </main>
    </div>
  );
}
