"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Download, Eye as EyeIcon, Building2, Warehouse, User } from "lucide-react";
import { useInspectionDetails } from "@/hooks/useInspectionDetails";
import { useSubmitInspectionDecision } from "@/hooks/useSubmitInspectionDecision";
import { InspectionDecisionType } from "@/types/inspection";
import AdminHeader from "@/components/admin/AdminHeader";
import InspectionStatusBadge from "@/components/inspa/InspectionStatusBadge";
import InspectionDecisionForm from "@/components/inspa/InspectionDecisionForm";
import Spinner from "@/components/ui/spinner";
import { privateApi } from "@/lib/api/privateApi";

export default function InspectionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useInspectionDetails(id);
  const inspection = data?.inspection;

  const { mutate: submitDecision, isPending } = useSubmitInspectionDecision();

  const handleDecision = (decision: InspectionDecisionType, reason?: string, comment?: string) => {
    submitDecision({ id, decision, reason, comment });
  };

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

  return (
    <>
      <AdminHeader title="Détails de l'inspection" subtitle="Examen de l'exportateur et du local de stockage" />

      <main className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1.5 text-sm text-cream-50/60 transition-colors duration-150 hover:text-cream-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="h-10 w-10" />
          </div>
        ) : isError || !inspection ? (
          <div className="flex items-center justify-center py-24 text-cream-50/70">
            Une erreur est survenue lors du chargement de l'inspection.
          </div>
        ) : (
          <div className="space-y-6">
            {/* header card */}
            <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl text-cream-50">{inspection.exporter.commName}</h2>
                  <p className="mt-1 text-sm text-cream-50/60">
                    {inspection.exporter.ownerName}
                    {inspection.exporter.email ? ` · ${inspection.exporter.email}` : ""}
                  </p>
                </div>
                <InspectionStatusBadge status={inspection.status} />
              </div>

              {inspection.assignedInspector && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-cream-50/50">
                  <User className="h-3.5 w-3.5" />
                  Assignée à {inspection.assignedInspector.name}
                  {inspection.assignedAt &&
                    ` · le ${new Date(inspection.assignedAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}`}
                </p>
              )}
            </div>

            {/* exporter info */}
            <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-6 sm:p-8">
              <h3 className="flex items-center gap-2 text-sm font-medium text-cream-50/90">
                <Building2 className="h-4 w-4 text-gold-300" />
                Informations exportateur
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-cream-50/50">Matricule fiscal</p>
                  <p className="text-cream-50">{inspection.exporter.matFisc}</p>
                </div>
                <div>
                  <p className="text-xs text-cream-50/50">RNE</p>
                  <p className="text-cream-50">{inspection.exporter.rne}</p>
                </div>
                <div>
                  <p className="text-xs text-cream-50/50">Gouvernorat</p>
                  <p className="text-cream-50">{inspection.exporter.governorate}</p>
                </div>
                {inspection.exporter.phone && (
                  <div>
                    <p className="text-xs text-cream-50/50">Téléphone</p>
                    <p className="text-cream-50">{inspection.exporter.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* storage info */}
            <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-6 sm:p-8">
              <h3 className="flex items-center gap-2 text-sm font-medium text-cream-50/90">
                <Warehouse className="h-4 w-4 text-gold-300" />
                Local de stockage
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-cream-50/50">Adresse</p>
                  <p className="text-cream-50">{inspection.storage.address}</p>
                </div>
                <div>
                  <p className="text-xs text-cream-50/50">Ville</p>
                  <p className="text-cream-50">{inspection.storage.city}</p>
                </div>
                <div>
                  <p className="text-xs text-cream-50/50">Statut du local</p>
                  <p className="text-cream-50">{inspection.storage.isRented ? "Loué" : "Propriété"}</p>
                </div>
                {inspection.storage.capacity && (
                  <div>
                    <p className="text-xs text-cream-50/50">Capacité</p>
                    <p className="text-cream-50">{inspection.storage.capacity}</p>
                  </div>
                )}
              </div>
            </div>

            {/* documents */}
            <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-6 sm:p-8">
              <h3 className="text-sm font-medium text-cream-50/90">
                Documents soumis ({inspection.documents.length})
              </h3>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {inspection.documents.length === 0 ? (
                  <p className="text-sm text-cream-50/40">Aucun document soumis.</p>
                ) : (
                  inspection.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-gold-300/30 bg-gold-300/[0.04] p-3"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <FileText className="h-4 w-4 shrink-0 text-gold-300" />
                        <span className="truncate text-sm text-cream-50/90">{doc.fileName}</span>
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
                  ))
                )}
              </div>
            </div>

            {/* previous decision, if any */}
            {inspection.decision && (
              <div
                className={`rounded-2xl border p-6 sm:p-8 ${
                  inspection.decision.decision === "APPROVED"
                    ? "border-green-400/30 bg-green-950/10"
                    : "border-red-400/30 bg-red-950/10"
                }`}
              >
                <h3 className="text-sm font-medium text-cream-50/90">Décision précédente</h3>
                <p className="mt-2 text-sm text-cream-50/80">
                  {inspection.decision.decision === "APPROVED" ? "Approuvée" : "Rejetée"} par{" "}
                  {inspection.decision.inspector.name} le{" "}
                  {new Date(inspection.decision.decidedAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                {inspection.decision.comment && (
                  <p className="mt-1 text-sm text-cream-50/60">{inspection.decision.comment}</p>
                )}
              </div>
            )}

            {/* decision form */}
            <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-6 sm:p-8">
              <h3 className="text-sm font-medium text-cream-50/90">Décision d'inspection</h3>
              <div className="mt-4">
                <InspectionDecisionForm
                  onSubmit={handleDecision}
                  isSubmitting={isPending}
                  disabled={inspection.status === "APPROVED" || inspection.status === "REJECTED"}
                />
                {(inspection.status === "APPROVED" || inspection.status === "REJECTED") && (
                  <p className="text-sm text-cream-50/50">
                    Cette inspection est déjà clôturée et ne peut plus être modifiée.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
