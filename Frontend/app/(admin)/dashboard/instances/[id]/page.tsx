"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, Download, Users } from "lucide-react";
import { useInstance } from "@/hooks/useInstances";
import { useDecideExportRequest } from "@/hooks/useDecideExportRequest";
import ExportStatusBadge from "@/components/exporter/ExportStatusBadge";
import AdminHeader from "@/components/admin/AdminHeader";
import Spinner from "@/components/ui/spinner";

const ROLE_LABELS: Record<string, string> = {
  MINISTER: "Ministre",
  DIWAN_MEMBER: "Membre Diwan",
  OBSERVATOR: "Observateur",
  ADMIN: "Administrateur",
};

export default function InstanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: instance, isLoading } = useInstance(id);
  const { mutate: decide, isPending } = useDecideExportRequest();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="h-10 w-10" />
      </div>
    );
  }

  if (!instance) {
    return (
      <div className="flex items-center justify-center py-24 text-cream-50/60">
        Instance introuvable.
      </div>
    );
  }

  return (
    <>
      <AdminHeader
        title="Détail de l'instance"
        subtitle={new Date(instance.meetingDate).toLocaleDateString("fr-FR", {
          day: "2-digit", month: "long", year: "numeric",
        })}
      />

      <main className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
        <button
          onClick={() => router.push("/dashboard/instances")}
          className="mb-6 flex items-center gap-1.5 text-sm text-cream-50/60 transition-colors duration-150 hover:text-gold-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux instances
        </button>

        {/* members + report */}
        <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-6 sm:p-8">
          <h2 className="flex items-center gap-1.5 text-sm font-medium text-cream-50/90">
            <Users className="h-4 w-4 text-gold-300" />
            Membres de l'instance
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {instance.members.map((m) => (
              <span
                key={m.id}
                className="rounded-full border border-cream-50/15 px-3 py-1.5 text-xs text-cream-50/80"
              >
                {m.user.name} <span className="text-cream-50/40">· {ROLE_LABELS[m.user.role] ?? m.user.role}</span>
              </span>
            ))}
          </div>

          {instance.reportFileUrl && (
            <a
              href={instance.reportFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-gold-300 transition-colors duration-150 hover:text-gold-300/80"
            >
              <FileText className="h-3.5 w-3.5" />
              Voir la fiche de données
              <Download className="h-3 w-3" />
            </a>
          )}

          {instance.internalNotes && (
            <div className="mt-4 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-3.5 text-sm text-cream-50/70">
              {instance.internalNotes}
            </div>
          )}
        </div>

        {/* export requests to decide */}
        <div className="mt-6 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-6 sm:p-8">
          <h2 className="text-sm font-medium text-cream-50/90">
            Demandes examinées
            <span className="ml-1.5 text-xs text-cream-50/50">الطلبات المدروسة</span>
          </h2>

          <div className="mt-4 space-y-3">
            {instance.exportRequests.map((req) => {
              const isDecided = req.status === "APPROVED" || req.status === "REJECTED";
              return (
                <div
                  key={req.id}
                  className="flex flex-col gap-3 rounded-lg border border-cream-50/10 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-cream-50">{req.client}</p>
                    <p className="text-xs text-cream-50/50">
                      AGRIM {req.agrim.reference} · {req.requestedKg.toLocaleString("fr-FR")} kg
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <ExportStatusBadge status={req.status} />
                    {!isDecided && (
                      <>
                        <button
                          onClick={() => decide({ id: req.id, status: "APPROVED" })}
                          disabled={isPending}
                          className="rounded-lg bg-gold-300 px-3.5 py-1.5 text-xs font-medium text-olive-950 transition-all duration-200 hover:bg-gold-300/90 disabled:opacity-50"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => decide({ id: req.id, status: "REJECTED" })}
                          disabled={isPending}
                          className="rounded-lg border border-red-400/30 bg-red-400/10 px-3.5 py-1.5 text-xs font-medium text-red-300 transition-all duration-200 hover:bg-red-400/20 disabled:opacity-50"
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}