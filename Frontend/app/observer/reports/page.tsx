"use client";

import { useObserverExportRequests } from "@/hooks/useObserverExportRequests";
import ObserverHeader from "@/components/observer/ObserverHeader";
import ReportCard from "@/components/observer/ReportCard";
import Spinner from "@/components/ui/spinner";
import {
  buildExportRequestsReport,
  buildMonthlyExportsReport,
  buildCompanyReport,
} from "@/lib/observerReports";
import { computeMonthlyExports, computeTopExporters } from "@/lib/observerStats";

export default function ObserverReportsPage() {
  const { data, isLoading } = useObserverExportRequests();
  const requests = data ?? [];

  return (
    <>
      <ObserverHeader
        title="Rapports d'exportation"
        subtitle="Générez des rapports à partir des demandes d'exportation enregistrées"
      />

      <main className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="h-8 w-8" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <ReportCard
              title="Rapport complet des demandes"
              description="Toutes les demandes d'exportation avec statut, exportateur et quantité."
              filename="rapport-demandes-exportation"
              rowCount={requests.length}
              getData={() => buildExportRequestsReport(requests)}
            />
            <ReportCard
              title="Rapport mensuel des exportations"
              description="Nombre de demandes et volume approuvé, agrégés par mois."
              filename="rapport-mensuel-exportations"
              rowCount={computeMonthlyExports(requests).length}
              getData={() => buildMonthlyExportsReport(requests)}
            />
            <ReportCard
              title="Rapport par exportateur"
              description="Volume total et nombre de demandes, par société exportatrice."
              filename="rapport-par-exportateur"
              rowCount={computeTopExporters(requests, requests.length || 1).length}
              getData={() => buildCompanyReport(requests)}
            />
          </div>
        )}

        <p className="mt-6 text-xs text-cream-50/40">
          Les rapports d&apos;inspection et de conformité ne sont pas encore disponibles pour le rôle
          observateur : ces données ne sont pas exposées par l&apos;API actuelle.
        </p>
      </main>
    </>
  );
}
