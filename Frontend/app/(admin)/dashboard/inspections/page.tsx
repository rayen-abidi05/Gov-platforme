"use client";

import { useMemo, useState } from "react";
import { useAdminInspections } from "@/hooks/useAdminInspections";
import { InspectionStatus, INSPECTION_STATUS_LABELS } from "@/types/inspection";
import AdminHeader from "@/components/admin/AdminHeader";
import InspectionStatusBadge from "@/components/inspa/InspectionStatusBadge";
import Spinner from "@/components/ui/spinner";

const STATUS_TABS: { label: string; value: InspectionStatus | "ALL" }[] = [
  { label: "Toutes", value: "ALL" },
  { label: INSPECTION_STATUS_LABELS.PENDING, value: "PENDING" },
  { label: INSPECTION_STATUS_LABELS.APPROVED, value: "APPROVED" },
  { label: INSPECTION_STATUS_LABELS.REJECTED, value: "REJECTED" },
];

export default function AdminInspectionsPage() {
  const { data, isLoading, isError } = useAdminInspections();
  const [statusFilter, setStatusFilter] = useState<InspectionStatus | "ALL">("ALL");

  const filtered = useMemo(() => {
    const inspections = data?.inspections ?? [];
    return statusFilter === "ALL" ? inspections : inspections.filter((i) => i.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <>
      <AdminHeader
        title="Inspections"
        subtitle="Suivi des inspections du lieu de stockage effectuées par l'INSPA"
      />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="h-10 w-10" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-24 text-cream-50/70">
            Une erreur est survenue lors du chargement des inspections.
          </div>
        ) : (
          <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    statusFilter === tab.value
                      ? "bg-gold-300/15 text-gold-300"
                      : "text-cream-50/60 hover:bg-cream-50/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-5 overflow-x-auto rounded-xl border border-cream-50/10 bg-olive-950/40">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-cream-50/10 text-xs uppercase tracking-wide text-cream-50/50">
                    <th className="px-5 py-3.5 font-medium">Exportateur</th>
                    <th className="px-5 py-3.5 font-medium">Gouvernorat</th>
                    <th className="px-5 py-3.5 font-medium">Assignée le</th>
                    <th className="px-5 py-3.5 font-medium">Inspectée le</th>
                    <th className="px-5 py-3.5 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((i) => (
                    <tr
                      key={i.id}
                      className="border-b border-cream-50/5 last:border-0 transition-colors duration-150 hover:bg-cream-50/[0.02]"
                    >
                      <td className="px-5 py-4 font-medium text-cream-50">
                        {i.registrationRequest.company.commName}
                      </td>
                      <td className="px-5 py-4 text-cream-50/70">
                        {i.registrationRequest.company.governorate}
                      </td>
                      <td className="px-5 py-4 text-cream-50/70">
                        {new Date(i.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 text-cream-50/70">
                        {i.inspectedAt
                          ? new Date(i.inspectedAt).toLocaleDateString("fr-FR", {
                              day: "2-digit", month: "short", year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <InspectionStatusBadge status={i.status} />
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-cream-50/40">
                        Aucune inspection ne correspond à ce filtre.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
}