import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "outline";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variant === "outline"
          ? "border border-white/15 bg-transparent text-white/80"
          : "bg-white/10 text-white/85 border border-white/10",
        className,
      )}
      {...props}
    />
  );
}

