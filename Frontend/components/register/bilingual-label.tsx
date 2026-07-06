import { cn } from "@/lib/utils";

export function BilingualLabel({
  htmlFor,
  fr,
  ar,
  required,
  className,
}: {
  htmlFor?: string;
  fr: string;
  ar: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium font-body text-cream-50/90",
        className
      )}
    >
      <span>
        {fr}
        {required && <span className="ml-0.5 text-gold-300">*</span>}
      </span>
      <span dir="rtl" className="text-xs font-normal text-cream-50/55">
        {ar}
      </span>
    </label>
  );
}