"use client";

import { useMemo } from "react";
import { Ship, Clock, CheckCircle2, XCircle, PackageSearch } from "lucide-react";
import { useObserverExportRequests } from "@/hooks/useObserverExportRequests";
import ObserverHeader from "@/components/observer/ObserverHeader";
import StatCard from "@/components/observer/StatCard";
import DashboardCharts from "@/components/observer/DashboardCharts";
import RecentActivity from "@/components/observer/RecentActivity";
import Spinner from "@/components/ui/spinner";
import { computeKpis } from "@/lib/observerStats";

export default function ObserverDashboardPage() {
  const { data, isLoading } = useObserverExportRequests();
  const requests = data ?? [];

  const kpis = useMemo(() => computeKpis(requests), [requests]);

  return (
    <>
      <ObserverHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble des exportations d'huile d'olive"
      />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="h-8 w-8" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard label="Total des demandes" value={String(kpis.total)} icon={Ship} accent="gold" />
              <StatCard label="En attente" value={String(kpis.sent)} icon={Clock} accent="blue" />
              <StatCard
                label="En cours d'examen"
                value={String(kpis.underReview)}
                icon={PackageSearch}
                accent="blue"
                hint="Suivi d'expédition non disponible — demandes en cours d'instruction"
              />
              <StatCard label="Approuvées" value={String(kpis.approved)} icon={CheckCircle2} accent="green" />
              <StatCard label="Rejetées" value={String(kpis.rejected)} icon={XCircle} accent="red" />
            </div>

            <div className="mt-6">
              <DashboardCharts requests={requests} />
            </div>

            <div className="mt-6">
              <RecentActivity />
            </div>
          </>
        )}
      </main>
    </>
  );
}
