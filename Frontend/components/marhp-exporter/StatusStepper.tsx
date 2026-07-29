import { Check, X } from "lucide-react";
import type { ExportRequestStatus } from "./types";

interface StatusStepperProps {
  status: ExportRequestStatus;
}

const STEPS: {
  key: ExportRequestStatus;
  fr: string;
  ar: string;
}[] = [
  { key: "envoyee", fr: "Envoyée", ar: "مرسلة" },
  { key: "examen_instance", fr: "Examen par l'instance", ar: "دراسة الهيئة" },
  { key: "approuvee", fr: "Approuvée", ar: "موافق عليها" },
];

export function StatusStepper({ status }: StatusStepperProps) {
  const rejected = status === "rejetee";
  const activeIdx = rejected
    ? 1
    : STEPS.findIndex((s) => s.key === status);

  return (
    <div className="w-full">
      <ol className="flex items-start justify-between gap-2">
        {STEPS.map((step, i) => {
          const isDone = !rejected && i < activeIdx;
          const isActive = !rejected && i === activeIdx;
          const isRejectedHere = rejected && i === 1;

          const circle = isRejectedHere
            ? "bg-rose-400/20 border-rose-400 text-rose-300"
            : isDone
            ? "bg-gold-300 border-gold-300 text-olive-950"
            : isActive
            ? "bg-gold-300/20 border-gold-300 text-gold-300"
            : "bg-transparent border-cream-50/20 text-cream-50/50";

          return (
            <li key={step.key} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <span
                  className={`absolute top-4 right-1/2 h-px w-full ${
                    isDone || isActive || isRejectedHere
                      ? "bg-gold-300/50"
                      : "bg-cream-50/15"
                  }`}
                />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border font-body text-xs font-semibold ${circle}`}
              >
                {isRejectedHere ? (
                  <X className="h-4 w-4" />
                ) : isDone ? (
                  <Check className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </span>
              <div className="mt-2 text-center">
                <div
                  className={`font-body text-xs ${
                    isActive || isDone || isRejectedHere
                      ? "text-cream-50"
                      : "text-cream-50/50"
                  }`}
                >
                  {isRejectedHere ? "Rejetée" : step.fr}
                </div>
                <div className="text-[10px] text-cream-50/40 font-body">
                  {isRejectedHere ? "مرفوضة" : step.ar}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
