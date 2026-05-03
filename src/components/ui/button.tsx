import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  default:
    "bg-white text-black hover:bg-white/90 shadow-[0_1px_0_rgba(255,255,255,0.2)_inset]",
  secondary:
    "bg-white/10 text-white hover:bg-white/15 border border-white/10",
  ghost: "bg-transparent text-white/80 hover:bg-white/10 hover:text-white",
};

const sizes: Record<ButtonSize, string> = {
  default: "h-11 px-4",
  sm: "h-9 px-3",
  lg: "h-12 px-5 text-base",
};

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

type ButtonProps = ButtonOwnProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild,
  ...props
}: ButtonProps) {
  if (asChild) {
    const child = props.children;
    if (!React.isValidElement(child)) return null;

    const typedChild = child as React.ReactElement<{ className?: string }>;
    const mergedClassName = cn(
      base,
      variants[variant],
      sizes[size],
      className,
      typedChild.props.className,
    );

    return React.cloneElement(typedChild, { className: mergedClassName });
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

