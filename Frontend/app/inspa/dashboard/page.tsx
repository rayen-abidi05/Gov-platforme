"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Hourglass,
  CheckCircle2,
  XCircle,
  History,
  Bell,
  UserCircle,
  ArrowRight,
  ArrowLeft,
  Mail,
  ShieldCheck,
  FileText,
  Download,
  Eye as EyeIcon,
} from "lucide-react";

import { useInspections, useInspection } from "@/hooks/useInspections";
import { useNotifications, useMarkNotificationRead } from "@/hooks/useNotifications";
import { useUser } from "@/hooks/useUser";
import { privateApi } from "@/lib/api/privateApi";
import { DOCUMENT_LABELS } from "@/lib/documentConfig";

import AdminHeader from "@/components/admin/AdminHeader";
import Spinner from "@/components/ui/spinner";
import InspectionsTable from "@/components/inspa/InspectionsTable";
import InspectionStatusBadge from "@/components/inspa/InspectionStatusBadge";
import InspectionPriorityBadge from "@/components/inspa/InspectionPriorityBadge";
import InspectionDecisionForm from "@/components/inspa/InspectionDecisionForm";

type TabId =
  | "overview"
  | "assigned"
  | "pending"
  | "completed"
  | "history"
  | "notifications"
  | "profile";

const TAB_META: Record<TabId, { label: string; subtitle: string }> = {
  overview: { label: "Tableau de bord", subtitle: "Vue d'ensemble de vos inspections" },
  assigned: { label: "Inspections assignées", subtitle: "Assignées, pas encore commencées" },
  pending: { label: "Inspections en attente", subtitle: "En cours d'examen — décision à rendre" },
  completed: { label: "Inspections terminées", subtitle: "Approuvées ou rejetées" },
  history: { label: "Historique", subtitle: "Toutes vos inspections, en ordre chronologique" },
  notifications: { label: "Centre de notifications", subtitle: "" },
  profile: { label: "Profil", subtitle: "Vos informations de compte" },
};

export default function InspaDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = (searchParams.get("tab") as TabId) || "overview";
  const openId = searchParams.get("id");

  const goTo = (nextTab: TabId) => router.push(`/inspa/dashboard?tab=${nextTab}`);
  const openInspection = (id: string) => router.push(`/inspa/dashboard?tab=${tab}&id=${id}`);
  const closeInspection = () => router.push(`/inspa/dashboard?tab=${tab}`);

  if (openId) {
    return (
      <>
        <AdminHeader title="Détails de l'inspection" subtitle="" />
        <main className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
          <button
            onClick={closeInspection}
            className="mb-5 inline-flex items-center gap-1.5 text-sm text-cream-50/60 transition-colors duration-150 hover:text-cream-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
          <InspectionDetailPanel id={openId} />
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader title={TAB_META[tab].label} subtitle={TAB_META[tab].subtitle} />

      <div className="border-b border-cream-50/10 px-6 sm:px-10">
        <nav className="flex flex-wrap gap-1.5 py-3">
          {(
            [
              ["overview", LayoutDashboard],
              ["assigned", ClipboardCheck],
              ["pending", Hourglass],
              ["completed", CheckCircle2],
              ["history", History],
              ["notifications", Bell],
              ["profile", UserCircle],
            ] as [TabId, React.ElementType][]
          ).map(([id, Icon]) => (
            <button
              key={id}
              onClick={() => goTo(id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                tab === id
                  ? "bg-gold-300/15 text-gold-300"
                  : "text-cream-50/60 hover:bg-cream-50/5 hover:text-cream-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {TAB_META[id].label}
            </button>
          ))}
        </nav>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        {tab === "overview" && <OverviewTab onGoTo={goTo} onOpenInspection={openInspection} />}
        {tab === "assigned" && <AssignedTab onOpenInspection={openInspection} />}
        {tab === "pending" && <PendingTab onOpenInspection={openInspection} />}
        {tab === "completed" && <CompletedTab onOpenInspection={openInspection} />}
        {tab === "history" && <HistoryTab onOpenInspection={openInspection} />}
        {tab === "notifications" && <NotificationsTab />}
        {tab === "profile" && <ProfileTab />}
      </main>
    </>
  );
}

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------

function OverviewTab({
  onGoTo,
  onOpenInspection,
}: {
  onGoTo: (tab: TabId) => void;
  onOpenInspection: (id: string) => void;
}) {
  const { data, isLoading } = useInspections();
  const inspections = data?.inspections ?? [];

  const assignedCount = inspections.filter((i) => i.status === "ASSIGNED").length;
  const underReviewCount = inspections.filter((i) => i.status === "UNDER_REVIEW").length;
  const approvedCount = inspections.filter((i) => i.status === "APPROVED").length;
  const rejectedCount = inspections.filter((i) => i.status === "REJECTED").length;

  const recent = [...inspections]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="h-10 w-10" />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard icon={ClipboardCheck} label="Assignées" value={assignedCount} accent="text-blue-300" />
        <SummaryCard
          icon={Hourglass}
          label="En attente de décision"
          value={underReviewCount}
          accent="text-gold-300"
        />
        <SummaryCard icon={CheckCircle2} label="Approuvées" value={approvedCount} accent="text-green-300" />
        <SummaryCard icon={XCircle} label="Rejetées" value={rejectedCount} accent="text-red-300" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <QuickLinkCard
          onClick={() => onGoTo("assigned")}
          icon={ClipboardCheck}
          title="Inspections assignées"
          description="Inspections qui vous ont été confiées"
          count={assignedCount}
        />
        <QuickLinkCard
          onClick={() => onGoTo("pending")}
          icon={Hourglass}
          title="Inspections en attente"
          description="En cours d'examen, décision à rendre"
          count={underReviewCount}
        />
        <QuickLinkCard
          onClick={() => onGoTo("completed")}
          icon={CheckCircle2}
          title="Inspections terminées"
          description="Décisions déjà soumises"
          count={approvedCount + rejectedCount}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-cream-50/90">Activité récente</h2>
          <button
            onClick={() => onGoTo("history")}
            className="flex items-center gap-1 text-xs text-gold-300 transition-colors duration-150 hover:text-gold-300/80"
          >
            Voir tout
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="mt-4 divide-y divide-cream-50/5">
          {recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-cream-50/40">Aucune inspection pour le moment.</p>
          ) : (
            recent.map((inspection) => (
              <button
                key={inspection.id}
                onClick={() => onOpenInspection(inspection.id)}
                className="flex w-full items-center justify-between gap-3 py-3 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-cream-50">
                    {inspection.company.commName}
                  </p>
                  <p className="text-xs text-cream-50/50">
                    {new Date(inspection.updatedAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <InspectionStatusBadge status={inspection.status} />
              </button>
            ))
          )}
        </div>
      </div>
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
  onClick,
  icon: Icon,
  title,
  description,
  count,
}: {
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  description: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 text-left transition-all duration-200 hover:border-gold-300/30 hover:bg-olive-950/60"
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
    </button>
  );
}

// ---------------------------------------------------------------------------
// List tabs (assigned / pending / completed / history)
// ---------------------------------------------------------------------------

function AssignedTab({ onOpenInspection }: { onOpenInspection: (id: string) => void }) {
  const { data, isLoading } = useInspections("ASSIGNED");
  if (isLoading) return <CenteredSpinner />;
  return (
    <InspectionsTable
      inspections={data?.inspections ?? []}
      emptyMessage="Aucune inspection assignée pour le moment."
      onOpen={onOpenInspection}
    />
  );
}

function PendingTab({ onOpenInspection }: { onOpenInspection: (id: string) => void }) {
  const { data, isLoading } = useInspections("UNDER_REVIEW");
  if (isLoading) return <CenteredSpinner />;
  return (
    <InspectionsTable
      inspections={data?.inspections ?? []}
      emptyMessage="Aucune inspection en attente de décision."
      onOpen={onOpenInspection}
    />
  );
}

function CompletedTab({ onOpenInspection }: { onOpenInspection: (id: string) => void }) {
  const { data, isLoading } = useInspections();
  const completed = useMemo(
    () => (data?.inspections ?? []).filter((i) => i.status === "APPROVED" || i.status === "REJECTED"),
    [data]
  );
  if (isLoading) return <CenteredSpinner />;
  return (
    <InspectionsTable
      inspections={completed}
      emptyMessage="Aucune inspection terminée pour le moment."
      onOpen={onOpenInspection}
    />
  );
}

function HistoryTab({ onOpenInspection }: { onOpenInspection: (id: string) => void }) {
  const { data, isLoading } = useInspections();
  const inspections = [...(data?.inspections ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (isLoading) return <CenteredSpinner />;

  if (inspections.length === 0) {
    return <p className="py-16 text-center text-sm text-cream-50/40">Aucune inspection dans votre historique.</p>;
  }

  return (
    <ol className="relative mx-auto max-w-3xl border-l border-cream-50/10 pl-6">
      {inspections.map((inspection) => (
        <li key={inspection.id} className="mb-6 last:mb-0">
          <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-gold-300" />
          <button
            onClick={() => onOpenInspection(inspection.id)}
            className="block w-full rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 text-left transition-all duration-200 hover:border-gold-300/30 hover:bg-olive-950/60"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-cream-50">{inspection.company.commName}</p>
              <InspectionStatusBadge status={inspection.status} />
            </div>
            <p className="mt-1 text-xs text-cream-50/50">
              Assignée le{" "}
              {inspection.assignment
                ? new Date(inspection.assignment.assignedAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </p>
            {inspection.decision && (
              <div className="mt-3 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-3 text-sm">
                <p className="text-cream-50/80">
                  Décision :{" "}
                  <span className={inspection.decision.decision === "APPROVED" ? "text-green-300" : "text-red-300"}>
                    {inspection.decision.decision === "APPROVED" ? "Approuvée" : "Rejetée"}
                  </span>{" "}
                  le{" "}
                  {new Date(inspection.decision.decidedAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                {inspection.decision.comment && (
                  <p className="mt-1 text-cream-50/60">{inspection.decision.comment}</p>
                )}
              </div>
            )}
          </button>
        </li>
      ))}
    </ol>
  );
}

function CenteredSpinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <Spinner size="h-10 w-10" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Notifications tab
// ---------------------------------------------------------------------------

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NotificationsTab() {
  const { data, isLoading } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();

  const notifications = data?.notifications ?? [];

  if (isLoading) return <CenteredSpinner />;

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <Bell className="h-8 w-8 text-cream-50/20" />
        <p className="text-sm text-cream-50/40">Aucune notification pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-2.5">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-start gap-3 rounded-xl border p-4 transition-colors duration-150 ${
            n.isRead ? "border-cream-50/10 bg-olive-950/40" : "border-gold-300/30 bg-gold-300/[0.04]"
          }`}
        >
          {!n.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold-300" />}
          <div className={`min-w-0 flex-1 ${n.isRead ? "pl-5" : ""}`}>
            <p className="text-sm font-medium text-cream-50">{n.title}</p>
            <p className="mt-0.5 text-sm text-cream-50/70">{n.message}</p>
            <p className="mt-1.5 text-xs text-cream-50/40">{formatDateTime(n.createdAt)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {!n.isRead && (
              <button
                onClick={() => markRead(n.id)}
                className="rounded-lg border border-cream-50/15 px-3 py-1.5 text-xs font-medium text-cream-50/70 transition-colors duration-150 hover:bg-cream-50/5"
              >
                Marquer comme lue
              </button>
            )}
            {n.link && (
              <Link
                href={n.link}
                onClick={() => !n.isRead && markRead(n.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gold-300 px-3 py-1.5 text-xs font-medium text-olive-950 transition-colors duration-150 hover:bg-gold-300/90"
              >
                Ouvrir
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profile tab
// ---------------------------------------------------------------------------

function ProfileTab() {
  const { data: user, isLoading: loadingUser } = useUser();
  const { data: inspectionsData, isLoading: loadingInspections } = useInspections();

  const inspections = inspectionsData?.inspections ?? [];
  const approvedCount = inspections.filter((i) => i.status === "APPROVED").length;
  const rejectedCount = inspections.filter((i) => i.status === "REJECTED").length;

  if (loadingUser || loadingInspections) return <CenteredSpinner />;

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-6 sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-300/15 text-gold-300">
          <UserCircle className="h-8 w-8" />
        </div>
        <div>
          <p className="font-display text-xl text-cream-50">{user?.name}</p>
          <p className="flex items-center gap-1.5 text-sm text-cream-50/60">
            <Mail className="h-3.5 w-3.5" />
            {user?.email}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-lg border border-gold-300/20 bg-gold-300/5 px-4 py-3 text-sm text-gold-300">
        <ShieldCheck className="h-4 w-4" />
        Inspecteur INSPA
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-cream-50/10 pt-6">
        <div className="text-center">
          <p className="font-display text-2xl text-cream-50">{inspections.length}</p>
          <p className="mt-1 text-xs text-cream-50/50">Total inspections</p>
        </div>
        <div className="text-center">
          <p className="font-display text-2xl text-green-300">{approvedCount}</p>
          <p className="mt-1 text-xs text-cream-50/50">Approuvées</p>
        </div>
        <div className="text-center">
          <p className="font-display text-2xl text-red-300">{rejectedCount}</p>
          <p className="mt-1 text-xs text-cream-50/50">Rejetées</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inspection detail panel (shown in place of tab content when ?id= is set)
// ---------------------------------------------------------------------------

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-cream-50/50">{label}</p>
      <p className="mt-0.5 text-cream-50">{value}</p>
    </div>
  );
}

function InspectionDetailPanel({ id }: { id: string }) {
  const { data: user } = useUser();
  const { data, isLoading, isError } = useInspection(id);
  const inspection = data?.inspection;

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

  if (isLoading) return <CenteredSpinner />;

  if (isError || !inspection) {
    return (
      <div className="py-16 text-center text-cream-50/60">
        Inspection introuvable ou accès non autorisé.
      </div>
    );
  }

  const documents = inspection.company.registrationRequests[0]?.documents ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-xl text-cream-50">{inspection.company.commName}</h1>
        <InspectionStatusBadge status={inspection.status} />
        <InspectionPriorityBadge priority={inspection.priority} />
        {inspection.assignment && (
          <span className="text-xs text-cream-50/50">
            Assignée le{" "}
            {new Date(inspection.assignment.assignedAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        )}
      </div>

      {inspection.notes && (
        <div className="mt-4 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-3 text-sm text-cream-50/70">
          <p className="text-xs font-medium text-cream-50/50">Note de l&apos;administrateur</p>
          <p className="mt-1">{inspection.notes}</p>
        </div>
      )}

      <section className="mt-6 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
        <h2 className="font-display text-lg text-cream-50">Informations sur l&apos;exportateur</h2>
        <p className="mt-1 text-sm text-cream-50/60">
          {inspection.company.user.name} · {inspection.company.user.email}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm sm:grid-cols-3">
          <Field label="RNE" value={inspection.company.rne} />
          <Field label="Matricule fiscal" value={inspection.company.matFisc} />
          <Field label="Activité" value={inspection.company.activity} />
          <Field label="Laboratoire d'analyse" value={inspection.company.labName} />
          <Field label="Nationalité" value={inspection.company.nationality} />
          <Field label="Statut de résidence" value={inspection.company.isResident ? "Résidente" : "Non-résidente"} />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
        <h2 className="font-display text-lg text-cream-50">Informations sur le lieu de stockage</h2>
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm sm:grid-cols-3">
          <Field label="Gouvernorat" value={inspection.company.governorate} />
          <Field label="Ville" value={inspection.company.city} />
          <Field label="Adresse" value={inspection.company.address} />
          <Field label="Téléphone" value={inspection.company.phone} />
          <Field label="Statut du local" value={inspection.company.isRented ? "Loué" : "Propriété"} />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
        <h2 className="font-display text-lg text-cream-50">Documents soumis ({documents.length})</h2>
        {documents.length === 0 ? (
          <p className="mt-3 text-sm text-cream-50/50">Aucun document disponible.</p>
        ) : (
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-gold-300/30 bg-gold-300/[0.04] p-3"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <FileText className="h-4 w-4 shrink-0 text-gold-300" />
                  <span className="truncate text-sm text-cream-50/90">
                    {DOCUMENT_LABELS[doc.DocType]?.fr ?? doc.fileName}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => handleViewDocument(doc.id)}
                    className="rounded-md p-1.5 text-cream-50/60 transition-colors duration-150 hover:bg-cream-50/10 hover:text-gold-300"
                    title="Aperçu"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadDocument(doc.id)}
                    className="rounded-md p-1.5 text-cream-50/60 transition-colors duration-150 hover:bg-cream-50/10 hover:text-gold-300"
                    title="Télécharger"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
        <h2 className="font-display text-lg text-cream-50">Décision</h2>
        <div className="mt-4">
          {user && <InspectionDecisionForm inspection={inspection} currentUserId={user.id} />}
        </div>
      </section>
    </div>
  );
}
