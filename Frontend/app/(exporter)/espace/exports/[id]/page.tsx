"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { useExportRequest } from "@/hooks/useExportRequests";
import ExporterHeader from "@/components/exporter/ExporterHeader";
import ExportStatusBadge from "@/components/exporter/ExportStatusBadge";
import Spinner from "@/components/ui/spinner";

const DOC_LABELS: Record<string, string> = {
  AGRIM: "Certificat AGRIM",
  CONTRACT: "Contrat avec le client",
  MINISTERIAL_LETTER: "Lettre d'autorisation ministérielle",
};

export default function ExportRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: request, isLoading } = useExportRequest(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="h-10 w-10" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center py-24 text-cream-50/60">
        Demande introuvable.
      </div>
    );
  }

  const quotaRemaining = request.agrim.limitKg - request.agrim.consumedKg;

  return (
    <>
      <ExporterHeader title="Détail de la demande" subtitle={request.client} />

      <main className="mx-auto max-w-3xl px-6 py-8 sm:px-10">
        <button
          onClick={() => router.push("/dashboard/exports")}
          className="mb-6 flex items-center gap-1.5 text-sm text-cream-50/60 transition-colors duration-150 hover:text-gold-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à mes exportations
        </button>

        <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-xl text-cream-50">{request.client}</h2>
              <p className="mt-1 text-xs text-cream-50/50">
                Soumise le{" "}
                {new Date(request.submittedAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <ExportStatusBadge status={request.status} />
          </div>

          {request.status === "REJECTED" && (
            <div className="mt-5 rounded-lg border border-red-400/30 bg-red-950/20 p-4 text-sm text-red-300">
              Cette demande a été rejetée par l'instance compétente.
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-5 text-sm sm:grid-cols-3">
            <Field label="Référence AGRIM" value={request.agrim.reference} />
            <Field label="Quantité demandée" value={`${request.agrim.requestedKg} kg`} />
            <Field label="Limite AGRIM" value={`${request.agrim.limitKg} kg`} />
            <Field label="Déjà consommé" value={`${request.agrim.consumedKg} kg`} />
            <Field label="Restant" value={`${quotaRemaining} kg`} />
          </div>

          <h3 className="mt-8 text-sm font-medium text-cream-50/90">
            Documents joints
            <span className="ml-1.5 text-xs text-cream-50/50">الوثائق المرفقة</span>
          </h3>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {request.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between gap-2.5 rounded-lg border border-cream-50/15 p-3.5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <FileText className="h-4 w-4 shrink-0 text-cream-50/40" />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-cream-50">{DOC_LABELS[doc.label]}</p>
                    <p className="truncate text-xs text-cream-50/50">{doc.fileName}</p>
                  </div>
                </div>
                <a
                  href={doc.fileUrl}
                  className="shrink-0 rounded-md p-1.5 text-cream-50/50 transition-colors duration-150 hover:bg-cream-50/10 hover:text-gold-300"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-cream-50/50">{label}</p>
      <p className="mt-0.5 text-cream-50">{value}</p>
    </div>
  );
}