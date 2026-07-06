import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-xl border bg-cream-50/95 px-4 py-3 pr-10 text-sm font-body text-ink-900 transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent",
            hasError
              ? "border-red-400 focus:ring-red-300"
              : "border-transparent focus:ring-gold-300",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/40" />
      </div>
    );
  }
);
Select.displayName = "Select";