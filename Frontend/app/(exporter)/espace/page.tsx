"use client";

import Link from "next/link";
import { Ship, Bell, ArrowRight } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useExportRequests } from "@/hooks/useExportRequests";
import { useNotifications } from "@/hooks/useNotifications";
import ExporterHeader from "@/components/exporter/ExporterHeader";
import ExportStatusBadge from "@/components/exporter/ExportStatusBadge";
import Spinner from "@/components/ui/spinner";

export default function ExporterOverviewPage() {
  const { data: user } = useUser();
  const { data: exportData, isLoading } = useExportRequests();
  const { data: notifData } = useNotifications();

  const requests = exportData?.requests ?? [];
  const pendingCount = requests.filter(
    (r) => r.status === "SENT" || r.status === "UNDER_COMMITTEE_REVIEW"
  ).length;
  const unreadCount = (notifData?.notifications ?? []).filter((n) => !n.isRead).length;
  const recent = [...requests]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  return (
    <>
      <ExporterHeader title="Vue d'ensemble" subtitle="Résumé de votre activité d'exportation" />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Statut d'inscription"
            value={user?.status === "APPROVED" ? "Approuvé" : "—"}
            accent="text-gold-300"
          />
          <SummaryCard
            label="Catégorie"
            value={user?.oliveListe === "LISTE_2" ? "Liste 2" : "Liste 1"}
            accent="text-blue-300"
          />
          <SummaryCard label="Demandes en attente" value={String(pendingCount)} accent="text-cream-50/70" />
          <SummaryCard
            icon={Bell}
            label="Notifications non lues"
            value={String(unreadCount)}
            accent="text-red-300"
          />
        </div>

        <div className="mt-8 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-cream-50/90">
              Demandes d'exportation récentes
              <span className="ml-1.5 text-xs text-cream-50/50">طلبات التصدير الأخيرة</span>
            </h2>
            <Link
              href="/dashboard/exports"
              className="flex items-center gap-1 text-xs text-gold-300 transition-colors duration-150 hover:text-gold-300/80"
            >
              Voir tout
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Spinner />
            </div>
          ) : recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-cream-50/40">
              Aucune demande d'exportation pour le moment.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-cream-50/5">
              {recent.map((r) => (
                <Link
                  key={r.id}
                  href={`/dashboard/exports/${r.id}`}
                  className="flex items-center justify-between gap-3 py-3 transition-colors duration-150 hover:bg-cream-50/[0.02]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-cream-50">{r.client}</p>
                    <p className="text-xs text-cream-50/50">
                      AGRIM {r.agrim.reference} · {r.agrim.requestedKg} kg
                    </p>
                  </div>
                  <ExportStatusBadge status={r.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/espace/exports/new"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold-300 px-5 py-3 text-sm font-medium text-olive-950 transition-all duration-200 hover:bg-gold-300/90"
        >
          <Ship className="h-4 w-4" />
          Nouvelle demande d'exportation
        </Link>
      </main>
    </>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`h-4 w-4 ${accent}`} />}
        <span className="text-xs text-cream-50/60">{label}</span>
      </div>
      <p className={`mt-2 font-display text-2xl ${Icon ? "text-cream-50" : accent}`}>{value}</p>
    </div>
  );
}