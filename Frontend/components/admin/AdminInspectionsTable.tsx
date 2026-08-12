"use client";

import { useRouter } from "next/navigation";
import { Eye, UserPlus } from "lucide-react";
import { ApiInspection } from "@/types/inspection";
import InspectionStatusBadge from "@/components/inspa/InspectionStatusBadge";
import InspectionPriorityBadge from "@/components/inspa/InspectionPriorityBadge";

interface Props {
  inspections: ApiInspection[];
  onAssign: (inspection: ApiInspection) => void;
  emptyMessage?: string;
}

export default function AdminInspectionsTable({ inspections, onAssign, emptyMessage }: Props) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-cream-50/10 text-xs uppercase tracking-wide text-cream-50/50">
            <th className="px-5 py-3.5 font-medium">Exportateur</th>
            <th className="px-5 py-3.5 font-medium">Gouvernorat</th>
            <th className="px-5 py-3.5 font-medium">Priorité</th>
            <th className="px-5 py-3.5 font-medium">Inspecteur</th>
            <th className="px-5 py-3.5 font-medium">Statut</th>
            <th className="px-5 py-3.5 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inspections.map((inspection) => {
            const isDecided = inspection.status === "APPROVED" || inspection.status === "REJECTED";
            return (
              <tr
                key={inspection.id}
                className="border-b border-cream-50/5 last:border-0 transition-colors duration-150 hover:bg-cream-50/[0.02]"
              >
                <td className="px-5 py-4 font-medium text-cream-50">{inspection.registrationRequest.company.commName}</td>
                <td className="px-5 py-4 text-cream-50/70">{inspection.registrationRequest.company.governorate}</td>
              
                <td className="px-5 py-4">
                  <InspectionStatusBadge status={inspection.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/inspections/${inspection.id}`)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-cream-50/15 px-3 py-1.5 text-xs font-medium text-cream-50/80 transition-all duration-200 hover:bg-cream-50/5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Voir
                    </button>
                   
                   
                  </div>
                </td>
              </tr>
            );
          })}

          {inspections.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-10 text-center text-cream-50/40">
                {emptyMessage ?? "Aucune inspection ne correspond à ces filtres."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
