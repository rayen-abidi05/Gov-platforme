"use client";

import { ApiInspection } from "@/types/inspection";
import InspectionStatusBadge from "./InspectionStatusBadge";
import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  inspections: ApiInspection[];
  emptyMessage: string;
  onDecide?: (inspection: ApiInspection) => void;
}

export default function InspectionsTable({ inspections, emptyMessage, onDecide }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-cream-50/10 text-xs uppercase tracking-wide text-cream-50/50">
            <th className="px-5 py-3.5 font-medium">Exportateur</th>
            <th className="px-5 py-3.5 font-medium">Gouvernorat</th>
            <th className="px-5 py-3.5 font-medium">Assignée le</th>
            <th className="px-5 py-3.5 font-medium">Statut</th>
            {onDecide && <th className="px-5 py-3.5 font-medium text-right">Action</th>}
          </tr>
        </thead>
        <tbody>
          {inspections.map((i) => (
            <tr
              key={i.id}
              className="border-b border-cream-50/5 last:border-0 transition-colors duration-150 hover:bg-cream-50/[0.02]"
            >
              <td className="px-5 py-4 font-medium text-cream-50">
                {i.registrationRequest.company.commName}
              </td>
              <td className="px-5 py-4 text-cream-50/70">{i.registrationRequest.company.governorate}</td>
              <td className="px-5 py-4 text-cream-50/70">
                {new Date(i.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
              </td>
              <td className="px-5 py-4">
                <InspectionStatusBadge status={i.status} />
              </td>
              {onDecide && (
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => onDecide(i)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gold-300/30 bg-gold-300/10 px-3 py-1.5 text-xs font-medium text-gold-300 transition-all duration-200 hover:bg-gold-300/20"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Décider
                  </button>
                </td>
              )}
            </tr>
          ))}

          {inspections.length === 0 && (
            <tr>
              <td colSpan={onDecide ? 5 : 4} className="px-5 py-10 text-center text-cream-50/40">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}