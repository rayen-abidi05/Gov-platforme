import { RequestStatus } from "@/lib/types/registration";

const STYLES: Record<RequestStatus, string> = {
  PENDING: "bg-cream-50/10 text-cream-50/70 border-cream-50/20",
  UNDER_REVIEW: "bg-blue-400/10 text-blue-300 border-blue-400/30",
  APPROVED: "bg-green-400/10 text-green-300 border-green-400/30",
  REJECTED: "bg-red-400/10 text-red-300 border-red-400/30",
};

const LABELS: Record<RequestStatus, string> = {
  PENDING: "En attente",
  UNDER_REVIEW: "En examen",
  APPROVED: "Approuvée",
  REJECTED: "Rejetée",
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}