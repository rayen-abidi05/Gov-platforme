"use client";

import { ApprovedExporter } from "@/types/registration";
import OliveListeBadge from "./OliveListeBadge";
import { Eye } from "lucide-react";

interface Props {
  exporters: ApprovedExporter[];
  onView: (exporter: ApprovedExporter) => void;
}

export default function DiwanExportersTable({ exporters, onView }: Props) {
  console.log(exporters)
  return (
    <div className="overflow-x-auto rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-cream-50/10 text-xs uppercase tracking-wide text-cream-50/50">
            <th className="px-5 py-3.5 font-medium">Entreprise</th>
            <th className="px-5 py-3.5 font-medium">Propriétaire</th>
            <th className="px-5 py-3.5 font-medium">RNE</th>
            <th className="px-5 py-3.5 font-medium">Matricule fiscal</th>
            <th className="px-5 py-3.5 font-medium">Gouvernorat</th>
            <th className="px-5 py-3.5 font-medium">Catégorie</th>
            <th className="px-5 py-3.5 font-medium">Approuvé le</th>
            <th className="px-5 py-3.5 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {exporters.map((exp) => (
            <tr
              key={exp.id}
              className="border-b border-cream-50/5 last:border-0 transition-colors duration-150 hover:bg-cream-50/[0.02]"
            >
              <td className="px-5 py-4 font-medium text-cream-50">{exp.commName}</td>
              <td className="px-5 py-4 text-cream-50/70">{exp.user.name}</td>
              <td className="px-5 py-4 text-cream-50/70">{exp.rne}</td>
              <td className="px-5 py-4 text-cream-50/70">{exp.matFisc}</td>
              <td className="px-5 py-4 text-cream-50/70">{exp.governorate}</td>
              <td className="px-5 py-4">
                <OliveListeBadge liste={exp.exportType} />
              </td>
              <td className="px-5 py-4 text-cream-50/70">
                {new Date(exp.approvedAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-5 py-4 text-right">
                <button
                  onClick={() => onView(exp)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gold-300/30 bg-gold-300/10 px-3 py-1.5 text-xs font-medium text-gold-300 transition-all duration-200 hover:bg-gold-300/20"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Voir
                </button>
              </td>
            </tr>
          ))}

          {exporters.length === 0 && (
            <tr>
              <td colSpan={8} className="px-5 py-10 text-center text-cream-50/40">
                Aucun exportateur ne correspond à ces filtres.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}