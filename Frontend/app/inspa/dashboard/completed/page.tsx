"use client";

import { useInspections } from "@/hooks/useInspections";
import InspaHeader from "@/components/inspa/InspaHeader";
import InspectionsTable from "@/components/inspa/InspectionsTable";
import Spinner from "@/components/ui/spinner";

export default function CompletedInspectionsPage() {
  const { data, isLoading, isError } = useInspections("completed");

  return (
    <>
      <InspaHeader title="Inspections terminées" subtitle="Approuvées ou rejetées" />

      <main className="mx-auto max-w-5xl px-6 py-8 sm:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="h-10 w-10" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-24 text-cream-50/70">
            Une erreur est survenue lors du chargement.
          </div>
        ) : (
          <InspectionsTable
            inspections={data?.inspections ?? []}
            emptyMessage="Aucune inspection terminée pour le moment."
          />
        )}
      </main>
    </>
  );
}