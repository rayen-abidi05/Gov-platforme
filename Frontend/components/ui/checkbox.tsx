import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, ...props }, ref) => {
    return (
      <span className="relative inline-flex h-4.5 w-4.5 shrink-0">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          className={cn(
            "peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-md border border-cream-50/40 bg-cream-50/10 transition-colors checked:border-gold-500 checked:bg-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300",
            className
          )}
          {...props}
        />
        <Check className="pointer-events-none absolute left-[2px] top-[2px] h-[14px] w-[14px] text-olive-950 opacity-0 peer-checked:opacity-100" />
      </span>
    );
  }
);
Checkbox.displayName = "Checkbox";