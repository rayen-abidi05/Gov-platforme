import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "gold" | "green" | "red" | "blue";
  hint?: string;
}

const ACCENTS: Record<NonNullable<Props["accent"]>, string> = {
  gold: "bg-gold-300/10 text-gold-300",
  green: "bg-green-400/10 text-green-300",
  red: "bg-red-400/10 text-red-300",
  blue: "bg-blue-400/10 text-blue-300",
};

export default function StatCard({ label, value, icon: Icon, accent = "gold", hint }: Props) {
  return (
    <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-cream-50/50">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${ACCENTS[accent]}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-2xl text-cream-50">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-cream-50/35">{hint}</p>}
    </div>
  );
}
