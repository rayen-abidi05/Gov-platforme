"use client";

import Link from "next/link";
import { FileCheck2, Users, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { useRequestsRegit } from "@/hooks/useRequestsRegit";
import { useApprovedExporters } from "@/hooks/useApprovedExporters";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStatsCharts from "@/components/admin/AdminStatsCharts";
import StatusBadge from "@/components/admin/StatusBadge";
import Spinner from "@/components/ui/spinner";

export default function DashboardOverviewPage() {
  const { data: dataRequests, isLoading: loadingRequests } = useRequestsRegit();
  const { data: dataExporters, isLoading: loadingExporters } = useApprovedExporters();

  const requests = dataRequests?.requests ?? [];
  const exporters = dataExporters?.exporters ?? [];

  const isLoading = loadingRequests || loadingExporters;

  const pendingCount = requests.filter((r : any) => r.status === "PENDING").length;
  const underReviewCount = requests.filter((r : any) => r.status === "UNDER_REVIEW").length;
  const rejectedCount = requests.filter((r : any) => r.status === "REJECTED").length;

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <>
        <AdminHeader title="Tableau de bord" subtitle="Vue d'ensemble de la plateforme" />
        <div className="flex items-center justify-center py-24">
          <Spinner size="h-10 w-10" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Tableau de bord" subtitle="Vue d'ensemble de la plateforme" />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={Clock}
            label="En attente"
            value={pendingCount}
            accent="text-cream-50/70"
          />
          <SummaryCard
            icon={FileCheck2}
            label="En examen"
            value={underReviewCount}
            accent="text-blue-300"
          />
          <SummaryCard
            icon={XCircle}
            label="Rejetées"
            value={rejectedCount}
            accent="text-red-300"
          />
          <SummaryCard
            icon={CheckCircle2}
            label="Exportateurs approuvés"
            value={exporters.length}
            accent="text-gold-300"
          />
        </div>

       
        <div className="mt-8">
          <AdminStatsCharts requests={requests} />
        </div>

        {/* quick links */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <QuickLinkCard
            href="/dashboard/requests"
            icon={FileCheck2}
            title="Demandes d'inscription"
            description="Examiner, filtrer et traiter les demandes en attente"
            count={requests.length}
          />
          <QuickLinkCard
            href="/dashboard/exporters"
            icon={Users}
            title="Exportateurs"
            description="Consulter la liste des exportateurs approuvés"
            count={exporters.length}
          />
        </div>

        {/* recent activity */}
        <div className="mt-8 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-cream-50/90">Demandes récentes</h2>
            <Link
              href="/dashboard/requests"
              className="flex items-center gap-1 text-xs text-gold-300 transition-colors duration-150 hover:text-gold-300/80"
            >
              Voir tout
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-cream-50/5">
            {recentRequests.length === 0 ? (
              <p className="py-6 text-center text-sm text-cream-50/40">Aucune demande récente.</p>
            ) : (
              recentRequests.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-cream-50">
                      {r.company.commName}
                    </p>
                    <p className="text-xs text-cream-50/50">
                      {new Date(r.submittedAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))
            )}
          </div>
        </div>
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
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-4">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${accent}`} />
        <span className="text-xs text-cream-50/60">{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl text-cream-50">{value}</p>
    </div>
  );
}

function QuickLinkCard({
  href,
  icon: Icon,
  title,
  description,
  count,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 transition-all duration-200 hover:border-gold-300/30 hover:bg-olive-950/60"
    >
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-300/10 text-gold-300">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-cream-50">{title}</p>
          <p className="text-xs text-cream-50/50">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-cream-50/40 transition-colors duration-200 group-hover:text-gold-300">
        <span className="text-lg font-display">{count}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}