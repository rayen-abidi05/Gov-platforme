"use client";

import { useMemo, useState } from "react";
import { Leaf, ShieldCheck, LogOut } from "lucide-react";
import { useApprovedExporters } from "@/hooks/useApprovedExporters";
import {  useRouter } from "next/navigation";
import { ApprovedExporter } from "@/types/registration";
import ExportersFilters, { ExporterSearchField } from "@/components/admin/ExportersFilters";
import DiwanExportersTable from "@/components/diwan/DiwanExportersTable";
import DiwanExporterDetailsModal from "@/components/diwan/DiwanExporterDetailsModal";
import NotificationBell from "@/components/NotificationBell";
import Spinner from "@/components/ui/spinner";
import { privateApi } from "@/lib/api/privateApi";
import { useMutation } from "@tanstack/react-query";
export default function DiwanExportersPage() {
  const router = useRouter()
  const { data, isLoading, isError } = useApprovedExporters();
  const exporters: ApprovedExporter[] = data?.exporters ?? [];
  const LogoutMutation = useMutation({
    mutationFn: async () => {
      const res = await privateApi.post("/api/auth/logout")
      return res.data
    },
    onSuccess: () => router.push("/login"),
    onError: () => console.log("nonnn"),
  })

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
    <main className="min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:py-12">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Leaf className="h-6 w-6 text-gold-300" />
            <span className="font-display text-lg tracking-wide">MARHP</span>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <button
              onClick={() => {LogoutMutation.mutate()}}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/15 bg-cream-50/[0.03] text-cream-50/70 transition-all duration-200 hover:border-red-400/30 hover:text-red-300"
              title="Se déconnecter"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-3 rounded-xl border border-gold-300/20 bg-gold-300/[0.04] px-5 py-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-gold-300" />
          <div>
            <h1 className="font-display text-xl text-cream-50">Espace Membre Diwan</h1>
            <p className="text-xs text-cream-50/60">
              Consultation des exportateurs approuvés et de leur catégorie d'exportation
            </p>
          </div>
        </div>

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
              <DiwanExportersTable exporters={filtered} onView={setSelected} />
            </div>
          </div>
        )}
      </div>

      {selected && (
        <DiwanExporterDetailsModal exporter={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}