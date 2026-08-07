"use client";

import { Eye } from "lucide-react";
import { ExportRequest } from "@/types/exportRequest";
import ExportStatusBadge from "@/components/exporter/ExportStatusBadge";

interface Props {
  requests: ExportRequest[];
  onViewDetails: (id: string) => void;
}

export default function ObserverExportRequestsTable({ requests, onViewDetails }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-cream-50/10 text-xs uppercase tracking-wide text-cream-50/50">
            <th className="px-5 py-3.5 font-medium">Référence (ID)</th>
            <th className="px-5 py-3.5 font-medium">Exportateur</th>
            <th className="px-5 py-3.5 font-medium">Quantité</th>
            <th className="px-5 py-3.5 font-medium">Gouvernorat</th>
            <th className="px-5 py-3.5 font-medium">Statut</th>
            <th className="px-5 py-3.5 font-medium">Date</th>
            <th className="px-5 py-3.5 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr
              key={r.id}
              className="border-b border-cream-50/5 last:border-0 transition-colors duration-150 hover:bg-cream-50/[0.02]"
            >
              <td className="px-5 py-4 font-medium text-cream-50">{r.agrimReference}</td>
              <td className="px-5 py-4 text-cream-50/70">{r.company?.commName ?? "—"}</td>
              <td className="px-5 py-4 text-cream-50/70">{r.requestedKg.toLocaleString("fr-FR")} kg</td>
              <td className="px-5 py-4 text-cream-50/70">{r.company?.governorate ?? "—"}</td>
              <td className="px-5 py-4">
                <ExportStatusBadge status={r.status} />
              </td>
              <td className="px-5 py-4 text-cream-50/70">
                {new Date(r.submittedAt).toLocaleDateString("fr-FR", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
              </td>
              <td className="px-5 py-4 text-right">
                <button
                  onClick={() => onViewDetails(r.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-3 py-1.5 text-xs font-medium text-cream-50/80 transition-all duration-200 hover:border-gold-300/40 hover:text-gold-300"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Détails
                </button>
              </td>
            </tr>
          ))}

          {requests.length === 0 && (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-cream-50/40">
                Aucune demande ne correspond à ces filtres.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
