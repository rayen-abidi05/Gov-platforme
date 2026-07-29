"use client";

import Link from "next/link";
import { Plus, Info } from "lucide-react";
import { useExportRequests } from "@/hooks/useExportRequests";
import ExporterHeader from "@/components/exporter/ExporterHeader";
import ExportStatusBadge from "@/components/exporter/ExportStatusBadge";
import Spinner from "@/components/ui/spinner";

export default function ExportRequestsPage() {
  const { data, isLoading, isError } = useExportRequests();
  const requests = data?.requests ?? [];

  return (
    <>
      <ExporterHeader title="Mes exportations" subtitle="Demandes d'exportation dans le cadre du contingent" />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        {/* outside-quota informational badge */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-400/20 bg-blue-400/[0.04] px-5 py-4">
          <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-300" />
          <div>
            <p className="text-sm font-medium text-cream-50">
              Export hors contingent
              <span className="ml-1.5 text-xs text-cream-50/50">خارج الحصة</span>
            </p>
            <p className="mt-0.5 text-xs text-cream-50/60">
              Les exportations hors contingent sont traitées directement en douane et ne nécessitent
              pas de demande sur la plateforme.
            </p>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-medium text-cream-50/90">
            Demandes dans le cadre du contingent
            <span className="ml-1.5 text-xs text-cream-50/50">داخل الحصة</span>
          </h2>
          <Link
            href="/dashboard/exports/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gold-300 px-4 py-2 text-sm font-medium text-olive-950 transition-all duration-200 hover:bg-gold-300/90"
          >
            <Plus className="h-4 w-4" />
            Nouvelle demande
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="h-8 w-8" />
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-cream-50/60">
            Erreur lors du chargement des demandes.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-cream-50/10 text-xs uppercase tracking-wide text-cream-50/50">
                  <th className="px-5 py-3.5 font-medium">Client</th>
                  <th className="px-5 py-3.5 font-medium">AGRIM</th>
                  <th className="px-5 py-3.5 font-medium">Quantité</th>
                  <th className="px-5 py-3.5 font-medium">Soumise le</th>
                  <th className="px-5 py-3.5 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr
                    key={r.id}
                    className="cursor-pointer border-b border-cream-50/5 last:border-0 transition-colors duration-150 hover:bg-cream-50/[0.02]"
                    onClick={() => (window.location.href = `/dashboard/exports/${r.id}`)}
                  >
                    <td className="px-5 py-4 font-medium text-cream-50">{r.client}</td>
                    <td className="px-5 py-4 text-cream-50/70">{r.agrim.reference}</td>
                    <td className="px-5 py-4 text-cream-50/70">{r.agrim.requestedKg} kg</td>
                    <td className="px-5 py-4 text-cream-50/70">
                      {new Date(r.submittedAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <ExportStatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}

                {requests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-cream-50/40">
                      Aucune demande d'exportation pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}