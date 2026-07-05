import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border bg-cream-50/95 px-4 py-3 text-sm font-body text-ink-900 placeholder:text-ink-900/40 transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent",
          hasError
            ? "border-red-400 focus:ring-red-300"
            : "border-transparent focus:ring-gold-300",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";