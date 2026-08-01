import { InspectionStatus } from "@/types/inspection";

const STYLES: Record<InspectionStatus, string> = {
  PENDING_ASSIGNMENT: "bg-cream-50/10 text-cream-50/70 border-cream-50/20",
  ASSIGNED: "bg-cream-50/10 text-cream-50/80 border-cream-50/25",
  UNDER_REVIEW: "bg-blue-400/10 text-blue-300 border-blue-400/30",
  APPROVED: "bg-green-400/10 text-green-300 border-green-400/30",
  REJECTED: "bg-red-400/10 text-red-300 border-red-400/30",
};

const LABELS: Record<InspectionStatus, string> = {
  PENDING_ASSIGNMENT: "En attente d'assignation",
  ASSIGNED: "Assignée",
  UNDER_REVIEW: "En examen",
  APPROVED: "Approuvée",
  REJECTED: "Rejetée",
};

export default function InspectionStatusBadge({ status }: { status: InspectionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
