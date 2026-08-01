"use client";

import { useMemo, useState } from "react";
import { useInspections } from "@/hooks/useInspections";
import AdminHeader from "@/components/admin/AdminHeader";
import InspectionsTable from "@/components/inspa/InspectionsTable";
import Spinner from "@/components/ui/spinner";
import { Search } from "lucide-react";

export default function InspaPendingPage() {
  const { data, isLoading, isError } = useInspections("pending");
  const inspections = data?.inspections ?? [];
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inspections
      .filter((i) => i.status === "PENDING_ASSIGNMENT")
      .filter((i) => q === "" || i.exporter.commName.toLowerCase().includes(q));
  }, [inspections, search]);

  return (
    <>
      <AdminHeader
        title="Inspections en attente"
        subtitle="Inspections non encore assignées à un inspecteur"
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
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-50/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un exportateur..."
                className="w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] py-2.5 pl-10 pr-3 text-sm text-cream-50 placeholder:text-cream-50/40 outline-none transition-all duration-200 focus:border-gold-300/40"
              />
            </div>
            <div className="mt-5">
              <InspectionsTable
                inspections={filtered}
                emptyLabel="Aucune inspection en attente d'assignation."
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
