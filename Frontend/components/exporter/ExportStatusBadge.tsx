import { ExportRequestStatus, EXPORT_STATUS_LABELS } from "@/types/exportRequest";

const STYLES: Record<ExportRequestStatus, string> = {
  SENT: "bg-cream-50/10 text-cream-50/70 border-cream-50/20",
  UNDER_COMMITTEE_REVIEW: "bg-blue-400/10 text-blue-300 border-blue-400/30",
  APPROVED: "bg-green-400/10 text-green-300 border-green-400/30",
  REJECTED: "bg-red-400/10 text-red-300 border-red-400/30",
};

export default function ExportStatusBadge({ status }: { status: ExportRequestStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}>
      {EXPORT_STATUS_LABELS[status].fr}
    </span>
  );
}