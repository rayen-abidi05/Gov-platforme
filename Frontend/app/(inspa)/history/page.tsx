"use client";

import { useMemo, useState } from "react";
import { useInspections } from "@/hooks/useInspections";
import { InspectionStatus } from "@/types/inspection";
import AdminHeader from "@/components/admin/AdminHeader";
import InspectionFilters from "@/components/inspa/InspectionFilters";
import InspectionsTable from "@/components/inspa/InspectionsTable";
import Spinner from "@/components/ui/spinner";

export default function InspaHistoryPage() {
  const { data, isLoading, isError } = useInspections("history");
  const inspections = data?.inspections ?? [];

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InspectionStatus | "ALL">("ALL");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...inspections]
      .filter((i) => {
        const matchesSearch = q === "" || i.exporter.commName.toLowerCase().includes(q);
        const matchesStatus = status === "ALL" || i.status === status;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [inspections, search, status]);

  return (
    <>
      <AdminHeader
        title="Historique des inspections"
        subtitle="Ensemble des inspections traitées, tous statuts confondus"
      />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="h-10 w-10" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-24 text-cream-50/70">
            Une erreur est survenue lors du chargement de l'historique.
          </div>
        ) : (
          <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
            <InspectionFilters
              search={search}
              onSearchChange={setSearch}
              status={status}
              onStatusChange={setStatus}
              statusOptions={["PENDING_ASSIGNMENT", "ASSIGNED", "UNDER_REVIEW", "APPROVED", "REJECTED"]}
            />
            <div className="mt-5">
              <InspectionsTable
                inspections={filtered}
                emptyLabel="Aucun historique disponible."
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
