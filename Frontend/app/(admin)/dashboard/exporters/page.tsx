"use client";

import { useMemo, useState } from "react";
import { useApprovedExporters } from "@/hooks/useApprovedExporters";
import { ApprovedExporter } from "@/types/registration";
import AdminHeader from "@/components/admin/AdminHeader";
import ExportersFilters, { ExporterSearchField } from "@/components/admin/ExportersFilters";
import ExportersTable from "@/components/admin/ExportersTable";
import ExporterDetailsModal from "@/components/admin/ExporterDetailsModal";
import Spinner from "@/components/ui/spinner";

export default function ExportersPage() {
  const { data, isLoading, isError } = useApprovedExporters();
  const exporters: ApprovedExporter[] = data?.exporters ?? [];

  const [search, setSearch] = useState("");
  const [searchFields, setSearchFields] = useState<ExporterSearchField[]>(["commName", "ownerName"]);
  const [governorate, setGovernorate] = useState("ALL");
  const [selected, setSelected] = useState<ApprovedExporter | null>(null);

  const governorateOptions = useMemo(
    () => Array.from(new Set(exporters.map((e) => e.governorate))).sort(),
    [exporters]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return exporters.filter((e) => {
      const matchesSearch =
        q === "" ||
        searchFields.some((field) => {
          switch (field) {
            case "commName":
              return e.commName.toLowerCase().includes(q);
            case "ownerName":
              return e.user.name.toLowerCase().includes(q);
            case "rne":
              return e.rne?.toLowerCase().includes(q);
            case "matFisc":
              return e.matFisc.toLowerCase().includes(q);
            default:
              return false;
          }
        });

      const matchesGovernorate = governorate === "ALL" || e.governorate === governorate;

      return matchesSearch && matchesGovernorate;
    });
  }, [exporters, search, searchFields, governorate]);

  return (
    <>
      <AdminHeader
        title="Exportateurs"
        subtitle={`${exporters.length} exportateur${exporters.length > 1 ? "s" : ""} approuvé${exporters.length > 1 ? "s" : ""}`}
      />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="h-10 w-10" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-24 text-cream-50/70">
            Une erreur est survenue lors du chargement des exportateurs.
          </div>
        ) : (
          <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
            <ExportersFilters
              search={search}
              onSearchChange={setSearch}
              searchFields={searchFields}
              onSearchFieldsChange={setSearchFields}
              governorate={governorate}
              onGovernorateChange={setGovernorate}
              governorateOptions={governorateOptions}
            />

            <div className="mt-5">
              <ExportersTable exporters={filtered} onView={setSelected} />
            </div>
          </div>
        )}
      </main>

      {selected && <ExporterDetailsModal exporter={selected} onClose={() => setSelected(null)} />}
    </>
  );
}