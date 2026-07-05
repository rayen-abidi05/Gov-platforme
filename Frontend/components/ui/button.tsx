import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", isLoading, children, disabled, ...props },
    ref
  ) => {
    const base =
      "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold font-body transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-olive-950 disabled:cursor-not-allowed disabled:opacity-60";

    const variants: Record<string, string> = {
      primary:
        "bg-gold-500 text-olive-950 hover:bg-gold-300 shadow-[0_4px_20px_-4px_rgba(199,154,46,0.55)] hover:shadow-[0_6px_24px_-4px_rgba(227,197,107,0.65)]",
      ghost:
        "bg-transparent text-cream-50/90 hover:bg-cream-50/10",
      outline:
        "border border-cream-50/30 text-cream-50 hover:bg-cream-50/10",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, variants[variant], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";