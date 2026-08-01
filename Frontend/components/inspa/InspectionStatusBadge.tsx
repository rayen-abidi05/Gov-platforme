import { InspectionStatus, INSPECTION_STATUS_LABELS } from "@/types/inspection";

const STYLES: Record<InspectionStatus, string> = {
  PENDING_ASSIGNMENT: "bg-cream-50/10 text-cream-50/70 border-cream-50/20",
  ASSIGNED: "bg-blue-400/10 text-blue-300 border-blue-400/30",
  UNDER_REVIEW: "bg-gold-300/10 text-gold-300 border-gold-300/30",
  APPROVED: "bg-green-400/10 text-green-300 border-green-400/30",
  REJECTED: "bg-red-400/10 text-red-300 border-red-400/30",
};

export default function InspectionStatusBadge({ status }: { status: InspectionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}
    >
      {INSPECTION_STATUS_LABELS[status]}
    </span>
  );
}
