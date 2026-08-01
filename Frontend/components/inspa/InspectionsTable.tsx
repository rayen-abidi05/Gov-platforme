"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { ApiInspection } from "@/types/inspection";
import InspectionStatusBadge from "./InspectionStatusBadge";

const PRIORITY_STYLES: Record<string, string> = {
  HIGH: "text-red-300",
  MEDIUM: "text-gold-300",
  LOW: "text-cream-50/50",
};

const PRIORITY_LABELS: Record<string, string> = {
  HIGH: "Haute",
  MEDIUM: "Moyenne",
  LOW: "Basse",
};

interface Props {
  inspections: ApiInspection[];
  emptyLabel?: string;
}

export default function InspectionsTable({
  inspections,
  emptyLabel = "Aucune inspection ne correspond à ces filtres.",
}: Props) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-cream-50/10 text-xs uppercase tracking-wide text-cream-50/50">
            <th className="px-5 py-3.5 font-medium">Exportateur</th>
            <th className="px-5 py-3.5 font-medium">Gouvernorat</th>
            <th className="px-5 py-3.5 font-medium">Local de stockage</th>
            <th className="px-5 py-3.5 font-medium">Priorité</th>
            <th className="px-5 py-3.5 font-medium">Assignée le</th>
            <th className="px-5 py-3.5 font-medium">Statut</th>
            <th className="px-5 py-3.5 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {inspections.map((inspection) => (
            <tr
              key={inspection.id}
              className="border-b border-cream-50/5 last:border-0 transition-colors duration-150 hover:bg-cream-50/[0.02]"
            >
              <td className="px-5 py-4 font-medium text-cream-50">
                {inspection.exporter.commName}
              </td>
              <td className="px-5 py-4 text-cream-50/70">{inspection.exporter.governorate}</td>
              <td className="px-5 py-4 text-cream-50/70">
                {inspection.storage.city}
                <span className="ml-1 text-cream-50/40">
                  ({inspection.storage.isRented ? "Loué" : "Propriété"})
                </span>
              </td>
              <td className="px-5 py-4">
                {inspection.priority ? (
                  <span className={`text-xs font-medium ${PRIORITY_STYLES[inspection.priority]}`}>
                    {PRIORITY_LABELS[inspection.priority]}
                  </span>
                ) : (
                  <span className="text-xs text-cream-50/30">—</span>
                )}
              </td>
              <td className="px-5 py-4 text-cream-50/70">
                {inspection.assignedAt
                  ? new Date(inspection.assignedAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </td>
              <td className="px-5 py-4">
                <InspectionStatusBadge status={inspection.status} />
              </td>
              <td className="px-5 py-4 text-right">
                <button
                  onClick={() => router.push(`/inspa/inspections/${inspection.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gold-300/30 bg-gold-300/10 px-3 py-1.5 text-xs font-medium text-gold-300 transition-all duration-200 hover:bg-gold-300/20"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Examiner
                </button>
              </td>
            </tr>
          ))}

          {inspections.length === 0 && (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-cream-50/40">
                {emptyLabel}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
