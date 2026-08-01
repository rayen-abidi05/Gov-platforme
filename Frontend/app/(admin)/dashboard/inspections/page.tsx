"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useInspections } from "@/hooks/useInspections";
import { useApprovedExporters } from "@/hooks/useApprovedExporters";
import { ApiInspection, InspectionStatus, INSPECTION_STATUS_LABELS } from "@/types/inspection";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminInspectionsTable from "@/components/admin/AdminInspectionsTable";
import InspectionAssignModal from "@/components/admin/InspectionAssignModal";
import CreateInspectionModal from "@/components/admin/CreateInspectionModal";
import Spinner from "@/components/ui/spinner";

const STATUS_TABS: { label: string; value: InspectionStatus | "ALL" }[] = [
  { label: "Toutes", value: "ALL" },
  { label: INSPECTION_STATUS_LABELS.PENDING_ASSIGNMENT, value: "PENDING_ASSIGNMENT" },
  { label: INSPECTION_STATUS_LABELS.ASSIGNED, value: "ASSIGNED" },
  { label: INSPECTION_STATUS_LABELS.UNDER_REVIEW, value: "UNDER_REVIEW" },
  { label: INSPECTION_STATUS_LABELS.APPROVED, value: "APPROVED" },
  { label: INSPECTION_STATUS_LABELS.REJECTED, value: "REJECTED" },
];

export default function AdminInspectionsPage() {
  const { data, isLoading, isError } = useInspections();
  const { data: exportersData } = useApprovedExporters();
  const exporters = exportersData?.exporters ?? [];

  const [statusFilter, setStatusFilter] = useState<InspectionStatus | "ALL">("ALL");
  const [assigning, setAssigning] = useState<ApiInspection | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const inspections = data?.inspections ?? [];
    return statusFilter === "ALL" ? inspections : inspections.filter((i) => i.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <>
      <AdminHeader
        title="Inspections"
        subtitle="Assignez les demandes d'inspection aux inspecteurs INSPA et suivez leur avancement"
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
            <div className="flex flex-wrap items-center justify-between gap-3">
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

              <button
                onClick={() => setCreating(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gold-300 px-3.5 py-2 text-xs font-medium text-olive-950 transition-colors duration-150 hover:bg-gold-300/90"
              >
                <Plus className="h-3.5 w-3.5" />
                Nouvelle inspection
              </button>
            </div>

            <div className="mt-5">
              <AdminInspectionsTable inspections={filtered} onAssign={setAssigning} />
            </div>
          </div>
        )}
      </main>

      {assigning && (
        <InspectionAssignModal inspection={assigning} onClose={() => setAssigning(null)} />
      )}

      {creating && <CreateInspectionModal exporters={exporters} onClose={() => setCreating(false)} />}
    </>
  );
}
