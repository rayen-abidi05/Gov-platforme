"use client";

import { useMemo, useState } from "react";
import { useRequestsRegit } from "@/hooks/useRequestsRegit";
import { ApiRegistrationRequest, RequestStatus } from "@/types/registration";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminStatsCharts from "@/components/admin/AdminStatsCharts";
import RegistrationRequestsFilters, { SearchField } from "@/components/admin/RegistrationRequestsFilters";
import RegistrationRequestsTable from "@/components/admin/RegistrationRequestsTable";
import RegistrationRequestModal from "@/components/admin/RegistrationRequestModal";
import NotificationBell from "@/components/NotificationBell";
import Spinner from "@/components/ui/spinner";
import { privateApi } from "@/lib/api/privateApi";
import { useUpdateRequestStatus } from "@/hooks/useUpdateRequestStatus";

export default function AdminDashboardPage() {
  const { data: dataRequests, isLoading, isError } = useRequestsRegit();
  const requests: ApiRegistrationRequest[] = dataRequests?.requests ?? [];

  const [search, setSearch] = useState("");
  const [searchFields, setSearchFields] = useState<SearchField[]>(["commName", "ownerName"]);
  const [status, setStatus] = useState<RequestStatus | "ALL">("ALL");
  const [month, setMonth] = useState("ALL");
  const [year, setYear] = useState("ALL");
  const [selected, setSelected] = useState<ApiRegistrationRequest | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return requests.filter((r) => {
      const matchesSearch =
        q === "" ||
        searchFields.some((field) => {
          switch (field) {
            case "commName":
              return r.company.commName.toLowerCase().includes(q);
            case "ownerName":
              return r.company.user.name.toLowerCase().includes(q);
            case "rne":
              return r.company.rne?.toLowerCase().includes(q);
            case "matFisc":
              return r.company.matFisc.toLowerCase().includes(q);
            default:
              return false;
          }
        });

      const matchesStatus = status === "ALL" || r.status === status;

      const date = new Date(r.submittedAt);
      const matchesMonth = month === "ALL" || String(date.getMonth() + 1) === month;
      const matchesYear = year === "ALL" || String(date.getFullYear()) === year;

      return matchesSearch && matchesStatus && matchesMonth && matchesYear;
    });
  }, [requests, search, searchFields, status, month, year]);

  const { mutate: updateStatus } = useUpdateRequestStatus();

  const handleStatusChange = (id: string, newStatus: RequestStatus, notes?: string) => {
    updateStatus({ id, status: newStatus, notes });
  };

  const handleViewDocument = async (docId: string) => {
    const res = await privateApi.get(`/api/files/${docId}/view`, { responseType: "blob" });
    
    const url = URL.createObjectURL(res.data);
    window.open(url, "_blank");
  };

  const handleDownloadDocument = async (docId: string) => {
    const res = await privateApi.get(`/api/files/${docId}/download`, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <AdminSidebar />

      <div className="flex-1 overflow-x-hidden">
        <header className="flex items-center justify-between border-b border-cream-50/10 px-6 py-4 sm:px-10">
          <div>
            <h1 className="font-display text-xl sm:text-2xl">Tableau de bord</h1>
            <p className="text-xs text-cream-50/50">Demandes d'inscription des exportateurs</p>
          </div>
          <NotificationBell />
        </header>

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
              <div className="mb-8">
                <AdminStatsCharts requests={requests} />
              </div>

              <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
                <RegistrationRequestsFilters
                  search={search}
                  onSearchChange={setSearch}
                  searchFields={searchFields}
                  onSearchFieldsChange={setSearchFields}
                  status={status}
                  onStatusChange={setStatus}
                  month={month}
                  onMonthChange={setMonth}
                  year={year}
                  onYearChange={setYear}
                />

                <div className="mt-5">
                  <RegistrationRequestsTable requests={filtered} onView={setSelected} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {selected && (
        <RegistrationRequestModal
          request={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onViewDocument={handleViewDocument}
          onDownloadDocument={handleDownloadDocument}
        />
      )}
    </div>
  );
}