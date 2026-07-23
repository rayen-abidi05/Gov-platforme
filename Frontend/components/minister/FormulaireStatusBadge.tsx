
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { FormulaireStatus } from "@/types/ministerFormulaire";
import { cn } from "@/lib/utils";

const CONFIG: Record<FormulaireStatus, { label: string; className: string; icon: React.ElementType }> = {
  PENDING: {
    label: "En attente",
    className: "border-cream-50/20 bg-cream-50/5 text-cream-50/70",
    icon: Clock,
  },
  APPROVED: {
    label: "Approuvé",
    className: "border-green-400/30 bg-green-500/10 text-green-300",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejeté",
    className: "border-red-400/30 bg-red-500/10 text-red-300",
    icon: XCircle,
  },
};

export function FormulaireStatusBadge({ status }: { status: FormulaireStatus }) {
  const { label, className, icon: Icon } = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}