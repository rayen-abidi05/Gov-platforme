
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useActivityLogs, type ActivityLogFilters } from "@/hooks/useActivityLogs";
import ObserverHeader from "@/components/observer/ObserverHeader";
import { ActivityLogFiltersBar } from "@/components/observer/ActivityLogFilters";
import { ActivityLogRow } from "@/components/observer/ActivityLogRow";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

export default function ObserverDashboardPage() {
  const [filters, setFilters] = useState<ActivityLogFilters>({ page: 1 });
  const { data, isLoading, isFetching } = useActivityLogs(filters);

  const logs = data?.logs ?? [];
  const availableActions = data?.availableActions ?? [];

  return (
    <>
      <ObserverHeader
        title="Journal d'activité"
        subtitle="Historique des actions effectuées par les administrateurs"
      />

      <main className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
        <ActivityLogFiltersBar
          availableActions={availableActions}
          filters={filters}
          onChange={setFilters}
        />

        <div className="mt-6 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="h-8 w-8" />
            </div>
          ) : logs.length === 0 ? (
            <p className="py-10 text-center text-sm text-cream-50/40">
              Aucune activité trouvée pour ces filtres.
            </p>
          ) : (
            <div className={`divide-y divide-cream-50/5 ${isFetching ? "opacity-60" : ""}`}>
              {logs.map((log) => (
                <ActivityLogRow key={log.id} log={log} />
              ))}
            </div>
          )}
        </div>

        {data && data.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-cream-50/50">
              Page {data.page} sur {data.totalPages} — {data.total} entrées
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-auto px-3"
                disabled={filters.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-auto px-3"
                disabled={filters.page >= data.totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}