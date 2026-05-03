import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]",
        className,
      )}
      {...props}
      suppressHydrationWarning
    />
  );
}

