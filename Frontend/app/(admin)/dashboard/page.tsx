"use client";

import { useMemo, useState } from "react";
import { Leaf } from "lucide-react";
import { useRequestsRegit } from "@/hooks/useRequestsRegit";
import { ApiRegistrationRequest, RequestStatus } from "@/types/registration";
import AdminStatsCharts from "@/components/admin/AdminStatsCharts";
import RegistrationRequestsFilters from "@/components/admin/RegistrationRequestsFilters";
import RegistrationRequestsTable from "@/components/admin/RegistrationRequestsTable";
import RegistrationRequestModal from "@/components/admin/RegistrationRequestModal";
import Spinner from "@/components/ui/spinner";
import {privateApi} from "@/lib/api/privateApi"
import {useUpdateRequestStatus} from "@/hooks/useUpdateRequestStatus"
export default function AdminDashboardPage() {
  const { data: dataRequests, isLoading, isError } = useRequestsRegit();
  const requests: ApiRegistrationRequest[] = dataRequests?.requests ?? [];

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RequestStatus | "ALL">("ALL");
  const [month, setMonth] = useState("ALL");
  const [year, setYear] = useState("ALL");
  const [selected, setSelected] = useState<ApiRegistrationRequest | null>(null);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch =
        search.trim() === "" ||
        r.company.commName.toLowerCase().includes(search.toLowerCase()) ||
        r.company.user.name.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "ALL" || r.status === status;

      const date = new Date(r.submittedAt);
      const matchesMonth = month === "ALL" || String(date.getMonth() + 1) === month;
      const matchesYear = year === "ALL" || String(date.getFullYear()) === year;

      return matchesSearch && matchesStatus && matchesMonth && matchesYear;
    });
  }, [requests, search, status, month, year]);

 
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
  const res = await privateApi.get(`/api/files/${docId}//download`, { responseType: "blob" });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = "";
  a.click();
  URL.revokeObjectURL(url);
};

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-olive-950">
        <Spinner size="h-10 w-10" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-olive-950 text-cream-50/70">
        Une erreur est survenue lors du chargement des demandes.
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:py-12">
        <div className="mb-8 flex items-center gap-2.5">
          <Leaf className="h-6 w-6 text-gold-300" />
          <span className="font-display text-lg tracking-wide">Ministère de l'Agriculture</span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl">Tableau de bord — Demandes d'inscription</h1>
        <p className="mt-1.5 text-sm text-cream-50/60">
          Consultez, filtrez et traitez les demandes d'inscription des exportateurs.
        </p>

        <div className="mt-8">
          <AdminStatsCharts requests={requests} />
        </div>

        <div className="mt-8 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
          <RegistrationRequestsFilters
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
            <RegistrationRequestsTable requests={filtered} onView={setSelected} />
          </div>
        </div>
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
    </main>
  );
}