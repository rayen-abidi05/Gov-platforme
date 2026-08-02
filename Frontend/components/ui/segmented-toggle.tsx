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
  disabled,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  options: [SegmentedOption, SegmentedOption];
  hasError?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-1.5 rounded-xl border p-1",
        hasError ? "border-red-400" : "border-cream-50/20",
        disabled && "opacity-50"
      )}
    >
      {options.map((opt, index) => {
        const active = value === opt.value;
        return (
          <button
            key={index}
            type="button"
            onClick={() => !disabled && onChange(opt.value)}
            disabled={disabled}
            aria-pressed={active}
            aria-disabled={disabled}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-sm font-body transition-colors",
              active
                ? "bg-gold-500 text-olive-950 font-semibold"
                : "text-cream-50/70 hover:bg-cream-50/10",
              disabled && "cursor-not-allowed "
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