import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WizardStep {
  key: string;
  fr: string;
  ar: string;
}

export function StepIndicator({
  steps,
  currentIndex,
}: {
  steps: WizardStep[];
  currentIndex: number;
}) {
  return (
    <div className="mb-8 flex items-center">
      {steps.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-initial">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                  isDone && "border-gold-500 bg-gold-500 text-olive-950",
                  isActive &&
                    "border-gold-300 bg-transparent text-gold-300 ring-2 ring-gold-300/40",
                  !isDone && !isActive && "border-cream-50/25 text-cream-50/45"
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <div className="hidden text-center sm:block">
                <div
                  className={cn(
                    "text-[11px] font-medium leading-tight",
                    isActive ? "text-cream-50" : "text-cream-50/50"
                  )}
                >
                  {step.fr}
                </div>
                <div
                  dir="rtl"
                  className={cn(
                    "text-[11px] leading-tight",
                    isActive ? "text-cream-50/70" : "text-cream-50/35"
                  )}
                >
                  {step.ar}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-px flex-1",
                  isDone ? "bg-gold-500" : "bg-cream-50/20"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}