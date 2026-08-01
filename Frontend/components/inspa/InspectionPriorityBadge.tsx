import { InspectionPriority, INSPECTION_PRIORITY_LABELS } from "@/types/inspection";

const STYLES: Record<InspectionPriority, string> = {
  LOW: "bg-cream-50/10 text-cream-50/60 border-cream-50/20",
  MEDIUM: "bg-gold-300/10 text-gold-300 border-gold-300/30",
  HIGH: "bg-red-400/10 text-red-300 border-red-400/30",
};

export default function InspectionPriorityBadge({ priority }: { priority: InspectionPriority | null }) {
  if (!priority) {
    return <span className="text-xs text-cream-50/40">—</span>;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${STYLES[priority]}`}
    >
      {INSPECTION_PRIORITY_LABELS[priority]}
    </span>
  );
}
