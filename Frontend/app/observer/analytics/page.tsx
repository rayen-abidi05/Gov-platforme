"use client";

import { Clock3 } from "lucide-react";
import { useObserverExportRequests } from "@/hooks/useObserverExportRequests";
import ObserverHeader from "@/components/observer/ObserverHeader";
import AnalyticsCharts from "@/components/observer/AnalyticsCharts";
import StatCard from "@/components/observer/StatCard";
import Spinner from "@/components/ui/spinner";
import { computeAvgProcessingDays } from "@/lib/observerStats";

export default function ObserverAnalyticsPage() {
  const { data, isLoading } = useObserverExportRequests();
  const requests = data ?? [];
  const avgDays = computeAvgProcessingDays(requests);

  return (
    <>
      <ObserverHeader
        title="Analytique"
        subtitle="Indicateurs détaillés sur les exportations d'huile d'olive"
      />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="h-8 w-8" />
          </div>
        ) : (
          <>
            <div className="mb-6 max-w-xs">
              <StatCard
                label="Temps de traitement moyen"
                value={`${avgDays} j`}
                icon={Clock3}
                accent="blue"
              />
            </div>
            <AnalyticsCharts requests={requests} />
          </>
        )}
      </main>
    </>
  );
}
