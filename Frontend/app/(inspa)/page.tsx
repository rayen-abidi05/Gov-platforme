"use client";

import Link from "next/link";
import { ClipboardList, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { useInspections } from "@/hooks/useInspections";
import AdminHeader from "@/components/admin/AdminHeader";
import InspaSummaryCards from "@/components/inspa/InspaSummaryCards";
import InspectionStatusBadge from "@/components/inspa/InspectionStatusBadge";
import Spinner from "@/components/ui/spinner";

export default function InspaDashboardPage() {
  const { data, isLoading, isError } = useInspections("all");
  const inspections = data?.inspections ?? [];

  const assignedCount = inspections.filter(
    (i) => i.status === "ASSIGNED" || i.status === "UNDER_REVIEW"
  ).length;
  const pendingCount = inspections.filter((i) => i.status === "PENDING_ASSIGNMENT").length;
  const approvedCount = inspections.filter((i) => i.status === "APPROVED").length;
  const rejectedCount = inspections.filter((i) => i.status === "REJECTED").length;

  const recentInspections = [...inspections]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <>
        <AdminHeader title="Tableau de bord INSPA" subtitle="Vue d'ensemble de vos inspections" />
        <div className="flex items-center justify-center py-24">
          <Spinner size="h-10 w-10" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Tableau de bord INSPA" subtitle="Vue d'ensemble de vos inspections" />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        {isError ? (
          <div className="flex items-center justify-center py-24 text-cream-50/70">
            Une erreur est survenue lors du chargement des inspections.
          </div>
        ) : (
          <>
            <InspaSummaryCards
              cards={[
                { icon: ClipboardList, label: "Inspections assignées", value: assignedCount, accent: "text-blue-300" },
                { icon: Clock, label: "En attente d'assignation", value: pendingCount, accent: "text-cream-50/70" },
                { icon: CheckCircle2, label: "Approuvées", value: approvedCount, accent: "text-gold-300" },
                { icon: XCircle, label: "Rejetées", value: rejectedCount, accent: "text-red-300" },
              ]}
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <QuickLinkCard
                href="/inspa/assigned"
                icon={ClipboardList}
                title="Inspections assignées"
                description="Vos inspections en cours de traitement"
                count={assignedCount}
              />
              <QuickLinkCard
                href="/inspa/pending"
                icon={Clock}
                title="En attente"
                description="Inspections non encore assignées"
                count={pendingCount}
              />
              <QuickLinkCard
                href="/inspa/completed"
                icon={CheckCircle2}
                title="Terminées"
                description="Inspections approuvées ou rejetées"
                count={approvedCount + rejectedCount}
              />
            </div>

            <div className="mt-8 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-cream-50/90">Activité récente</h2>
                <Link
                  href="/inspa/history"
                  className="flex items-center gap-1 text-xs text-gold-300 transition-colors duration-150 hover:text-gold-300/80"
                >
                  Voir tout
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="mt-4 divide-y divide-cream-50/5">
                {recentInspections.length === 0 ? (
                  <p className="py-6 text-center text-sm text-cream-50/40">Aucune activité récente.</p>
                ) : (
                  recentInspections.map((i) => (
                    <Link
                      key={i.id}
                      href={`/inspa/inspections/${i.id}`}
                      className="flex items-center justify-between gap-3 py-3 transition-colors duration-150 hover:bg-cream-50/[0.02]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-cream-50">
                          {i.exporter.commName}
                        </p>
                        <p className="text-xs text-cream-50/50">
                          {new Date(i.updatedAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <InspectionStatusBadge status={i.status} />
                    </Link>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </>
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

