"use client";

import { useMemo, useState } from "react";
import { useObserverExportRequests } from "@/hooks/useObserverExportRequests";
import { useObserverExportRequest } from "@/hooks/useObserverExportRequest";
import ObserverHeader from "@/components/observer/ObserverHeader";
import ObserverExportRequestsFilters from "@/components/observer/ObserverExportRequestsFilters";
import ObserverExportRequestsTable from "@/components/observer/ObserverExportRequestsTable";
import ObserverExportRequestModal from "@/components/observer/ObserverExportRequestModal";
import Spinner from "@/components/ui/spinner";
import { ExportRequestStatus } from "@/types/exportRequest";

export default function ObserverExportRequestsPage() {
  const { data, isLoading } = useObserverExportRequests();
  const requests = data ?? [];

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ExportRequestStatus | "ALL">("ALL");
  const [company, setCompany] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: selectedRequest, isLoading: isDetailsLoading } =
    useObserverExportRequest(selectedId);

  const companies = useMemo(() => {
    const names = new Set(
      requests.map((r) => r.company?.commName).filter((n): n is string => !!n)
    );
    return Array.from(names).sort();
  }, [requests]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (status !== "ALL" && r.status !== status) return false;
      if (company !== "ALL" && r.company?.commName !== company) return false;

      const submitted = new Date(r.submittedAt);
      if (dateFrom && submitted < new Date(dateFrom)) return false;
      if (dateTo && submitted > new Date(`${dateTo}T23:59:59`)) return false;

      if (search) {
        const q = search.toLowerCase();
        const haystack = [r.agrimReference, r.client, r.company?.commName ?? ""]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [requests, search, status, company, dateFrom, dateTo]);

  return (
    <>
      <ObserverHeader
        title="Suivi des demandes d'exportation"
        subtitle={`${filtered.length} demande(s) sur ${requests.length}`}
      />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        <ObserverExportRequestsFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          company={company}
          onCompanyChange={setCompany}
          companies={companies}
          dateFrom={dateFrom}
          onDateFromChange={setDateFrom}
          dateTo={dateTo}
          onDateToChange={setDateTo}
        />

        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Spinner size="h-8 w-8" />
            </div>
          ) : (
            <ObserverExportRequestsTable
              requests={filtered}
              onViewDetails={(id) => setSelectedId(id)}
            />
          )}
        </div>
      </main>

      {selectedId && (
        <ObserverExportRequestModal
          request={selectedRequest ?? null}
          isLoading={isDetailsLoading}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}
