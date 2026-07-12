import { cn } from "@/lib/utils";

export interface SegmentedOption {
  value: boolean;
  fr: string;
  ar: string;
}

export function SegmentedToggle({
  value,
  onChange,
  options,
  hasError,
}: {
  value: boolean ;
  onChange: (value: boolean) => void;
  options: [SegmentedOption, SegmentedOption];
  hasError?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-1.5 rounded-xl border p-1",
        hasError ? "border-red-400" : "border-cream-50/20"
      )}
    >
      {options.map((opt,index) => {
        const active = value === opt.value;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-sm font-body transition-colors",
              active
                ? "bg-gold-500 text-olive-950 font-semibold"
                : "text-cream-50/70 hover:bg-cream-50/10"
            )}
          >
            <span>{opt.fr}</span>
            <span dir="rtl" className="text-xs opacity-80">
              {opt.ar}
            </span>
          </button>
        );
      })}
    </div>
  );
}