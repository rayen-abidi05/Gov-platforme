"use client";

import { ExportRequest } from "@/types/exportRequest";
import ExportStatusBadge from "@/components/exporter/ExportStatusBadge";
import { Eye } from "lucide-react";

interface Props {
  requests: ExportRequest[];
  onView: (request: ExportRequest) => void;
}

export default function ExportRequestsTable({ requests, onView }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-cream-50/10 text-xs uppercase tracking-wide text-cream-50/50">
            <th className="px-5 py-3.5 font-medium">Client</th>
            <th className="px-5 py-3.5 font-medium">AGRIM</th>
            <th className="px-5 py-3.5 font-medium">Qté demandée</th>
            <th className="px-5 py-3.5 font-medium">Solde AGRIM</th>
            <th className="px-5 py-3.5 font-medium">Soumise le</th>
            <th className="px-5 py-3.5 font-medium">Statut</th>
            <th className="px-5 py-3.5 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => {
            const remaining = r.agrim.limitKg - r.agrim.consumedKg;
            return (
              <tr
                key={r.id}
                className="border-b border-cream-50/5 last:border-0 transition-colors duration-150 hover:bg-cream-50/[0.02]"
              >
                <td className="px-5 py-4 font-medium text-cream-50">{r.client}</td>
                <td className="px-5 py-4 text-cream-50/70">{r.agrim.reference}</td>
                <td className="px-5 py-4 text-cream-50/70">{r.agrim.requestedKg.toLocaleString("fr-FR")} kg</td>
                <td className="px-5 py-4 text-cream-50/70">{remaining.toLocaleString("fr-FR")} kg</td>
                <td className="px-5 py-4 text-cream-50/70">
                  {new Date(r.submittedAt).toLocaleDateString("fr-FR", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4">
                  <ExportStatusBadge status={r.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => onView(r)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gold-300/30 bg-gold-300/10 px-3 py-1.5 text-xs font-medium text-gold-300 transition-all duration-200 hover:bg-gold-300/20"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Examiner
                  </button>
                </td>
              </tr>
            );
          })}

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