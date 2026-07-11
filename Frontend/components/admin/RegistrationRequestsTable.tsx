"use client";

import { ApiRegistrationRequest } from "@/types/registration";
import { getRequiredDocTypes } from "@/lib/documentConfig";
import StatusBadge from "./StatusBadge";
import { Eye } from "lucide-react";

interface Props {
  requests: ApiRegistrationRequest[];
  onView: (request: ApiRegistrationRequest) => void;
}

export default function RegistrationRequestsTable({ requests, onView }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-cream-50/10 text-xs uppercase tracking-wide text-cream-50/50">
            <th className="px-5 py-3.5 font-medium">Entreprise</th>
            <th className="px-5 py-3.5 font-medium">Propriétaire</th>
            <th className="px-5 py-3.5 font-medium">Gouvernorat</th>
            <th className="px-5 py-3.5 font-medium">Soumise le</th>
            <th className="px-5 py-3.5 font-medium">Documents</th>
            <th className="px-5 py-3.5 font-medium">Statut</th>
            <th className="px-5 py-3.5 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            const required = getRequiredDocTypes(req.company.isRented);
            return (
              <tr
                key={req.id}
                className="border-b border-cream-50/5 last:border-0 transition-colors duration-150 hover:bg-cream-50/[0.02]"
              >
                <td className="px-5 py-4 font-medium text-cream-50">{req.company.commName}</td>
                <td className="px-5 py-4 text-cream-50/70">{req.company.user.name}</td>
                <td className="px-5 py-4 text-cream-50/70">{req.company.governorate}</td>
                <td className="px-5 py-4 text-cream-50/70">
                  {new Date(req.submittedAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4 text-cream-50/70">
                  {req.documents.length}/{required.length}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => onView(req)}
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