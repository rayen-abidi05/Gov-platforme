"use client";

import { useMemo, useState } from "react";
import { useAdminExportRequests } from "@/hooks/useAdminExportRequests";
import { useUpdateExportRequestStatus } from "@/hooks/useUpdateExportRequestStatus";
import { ExportRequest, ExportRequestStatus } from "@/types/exportRequest";
import AdminHeader from "@/components/admin/AdminHeader";
import ExportStatsCharts from "@/components/admin/ExportStatsCharts";
import AgrimMonitoringCard from "@/components/admin/AgrimMonitoringCard";
import ExportRequestsFilters from "@/components/admin/ExportRequestsFilters";
import ExportRequestsTable from "@/components/admin/ExportRequestsTable";
import ExportRequestModal from "@/components/admin/ExportRequestModal";
import Spinner from "@/components/ui/spinner";

export default function AdminExportRequestsPage() {
  const { data, isLoading, isError } = useAdminExportRequests();
  const requests: ExportRequest[] = data?.requests ?? [];

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ExportRequestStatus | "ALL">("ALL");
  const [month, setMonth] = useState("ALL");
  const [year, setYear] = useState("ALL");
  const [selected, setSelected] = useState<ExportRequest | null>(null);

  const { mutate: updateStatus } = useUpdateExportRequestStatus();

  const handleStatusChange = (id: string, newStatus: ExportRequestStatus) => {
    updateStatus({ id, status: newStatus });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => {
      const matchesSearch =
        q === "" ||
        r.client.toLowerCase().includes(q) ||
        r.agrim.reference.toLowerCase().includes(q);

      const matchesStatus = status === "ALL" || r.status === status;

      const date = new Date(r.submittedAt);
      const matchesMonth = month === "ALL" || String(date.getMonth() + 1) === month;
      const matchesYear = year === "ALL" || String(date.getFullYear()) === year;

      return matchesSearch && matchesStatus && matchesMonth && matchesYear;
    });
  }, [requests, search, status, month, year]);

  // dedupe AGRIMs by reference for the monitoring section
  const uniqueAgrims = useMemo(() => {
    const map = new Map<string, ExportRequest["agrim"]>();
    requests.forEach((r) => map.set(r.agrim.reference, r.agrim));
    return Array.from(map.values());
  }, [requests]);

  const counts = {
    total: requests.length,
    sent: requests.filter((r) => r.status === "SENT").length,
    underReview: requests.filter((r) => r.status === "UNDER_COMMITTEE_REVIEW").length,
    approved: requests.filter((r) => r.status === "APPROVED").length,
    rejected: requests.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <>
      <AdminHeader
        title="Demandes d'exportation"
        subtitle="Suivi des demandes d'exportation dans le cadre du contingent"
      />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="h-10 w-10" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-24 text-cream-50/70">
            Une erreur est survenue lors du chargement des demandes.
          </div>
        ) : (
          <>
            {/* summary cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard label="Total" value={counts.total} accent="text-cream-50" />
              <StatCard label="Envoyées" value={counts.sent} accent="text-cream-50/70" />
              <StatCard label="En examen" value={counts.underReview} accent="text-blue-300" />
              <StatCard label="Approuvées" value={counts.approved} accent="text-green-300" />
              <StatCard label="Rejetées" value={counts.rejected} accent="text-red-300" />
            </div>

            {/* charts */}
            <div className="mt-8">
              <ExportStatsCharts requests={requests} />
            </div>

            {/* AGRIM monitoring */}
            <div className="mt-8">
              <h2 className="text-sm font-medium text-cream-50/90">
                Suivi des certificats AGRIM
                <span className="ml-1.5 text-xs text-cream-50/50">متابعة شهادات AGRIM</span>
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {uniqueAgrims.map((agrim) => (
                  <AgrimMonitoringCard key={agrim.reference} agrim={agrim} />
                ))}
              </div>
            </div>

            {/* filters + table */}
            <div className="mt-8 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
              <ExportRequestsFilters
                search={search}
                onSearchChange={setSearch}
                status={status}
                onStatusChange={setStatus}
                month={month}
                onMonthChange={setMonth}
                year={year}
                onYearChange={setYear}
              />
              <div className="mt-5">
                <ExportRequestsTable requests={filtered} onView={setSelected} />
              </div>
            </div>
          </>
        )}
      </main>

      {selected && (
        <ExportRequestModal
          request={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-4">
      <p className="text-xs text-cream-50/60">{label}</p>
      <p className={`mt-2 font-display text-2xl ${accent}`}>{value}</p>
    </div>
  );
}