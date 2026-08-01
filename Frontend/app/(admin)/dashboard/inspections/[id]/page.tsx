"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FileText, Download, Eye as EyeIcon, UserPlus } from "lucide-react";
import { useInspection } from "@/hooks/useInspections";
import { DOCUMENT_LABELS } from "@/lib/documentConfig";
import { privateApi } from "@/lib/api/privateApi";

import AdminHeader from "@/components/admin/AdminHeader";
import InspectionAssignModal from "@/components/admin/InspectionAssignModal";
import InspectionStatusBadge from "@/components/inspa/InspectionStatusBadge";
import InspectionPriorityBadge from "@/components/inspa/InspectionPriorityBadge";
import Spinner from "@/components/ui/spinner";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-cream-50/50">{label}</p>
      <p className="mt-0.5 text-cream-50">{value}</p>
    </div>
  );
}

export default function AdminInspectionDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useInspection(id);
  const inspection = data?.inspection;
  const [assigning, setAssigning] = useState(false);

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

  if (isLoading) {
    return (
      <>
        <AdminHeader title="Détails de l'inspection" />
        <div className="flex items-center justify-center py-24">
          <Spinner size="h-10 w-10" />
        </div>
      </>
    );
  }

  if (isError || !inspection) {
    return (
      <>
        <AdminHeader title="Détails de l'inspection" />
        <div className="flex items-center justify-center py-24 text-cream-50/60">
          Inspection introuvable.
        </div>
      </>
    );
  }

  const documents = inspection.company.registrationRequests[0]?.documents ?? [];
  const isDecided = inspection.status === "APPROVED" || inspection.status === "REJECTED";

  return (
    <>
      <AdminHeader title={inspection.company.commName} subtitle="Détails de l'inspection" />

      <main className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <InspectionStatusBadge status={inspection.status} />
            <InspectionPriorityBadge priority={inspection.priority} />
          </div>
          {!isDecided && (
            <button
              onClick={() => setAssigning(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gold-300/30 bg-gold-300/10 px-3.5 py-2 text-xs font-medium text-gold-300 transition-all duration-200 hover:bg-gold-300/20"
            >
              <UserPlus className="h-3.5 w-3.5" />
              {inspection.assignment ? "Réassigner" : "Assigner"}
            </button>
          )}
        </div>

        {/* Assignment info */}
        <section className="mt-6 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
          <h2 className="font-display text-lg text-cream-50">Assignation</h2>
          {inspection.assignment ? (
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm sm:grid-cols-3">
              <Field label="Inspecteur" value={inspection.assignment.inspector.name} />
              <Field label="Email" value={inspection.assignment.inspector.email} />
              <Field
                label="Assignée le"
                value={new Date(inspection.assignment.assignedAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              />
            </div>
          ) : (
            <p className="mt-3 text-sm text-cream-50/50">Aucun inspecteur assigné pour le moment.</p>
          )}
        </section>

        {/* Exporter information */}
        <section className="mt-6 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
          <h2 className="font-display text-lg text-cream-50">Informations sur l&apos;exportateur</h2>
          <p className="mt-1 text-sm text-cream-50/60">
            {inspection.company.user.name} · {inspection.company.user.email}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm sm:grid-cols-3">
            <Field label="RNE" value={inspection.company.rne} />
            <Field label="Matricule fiscal" value={inspection.company.matFisc} />
            <Field label="Activité" value={inspection.company.activity} />
          </div>
        </section>

        {/* Local storage information */}
        <section className="mt-6 rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 sm:p-6">
          <h2 className="font-display text-lg text-cream-50">Informations sur le lieu de stockage</h2>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm sm:grid-cols-3">
            <Field label="Gouvernorat" value={inspection.company.governorate} />
            <Field label="Ville" value={inspection.company.city} />
            <Field label="Adresse" value={inspection.company.address} />
            <Field label="Statut du local" value={inspection.company.isRented ? "Loué" : "Propriété"} />
          </div>
        </section>

        {/* Documents */}
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

        {/* Decision */}
        {inspection.decision && (
          <section
            className={`mt-6 rounded-2xl border p-5 sm:p-6 ${
              inspection.decision.decision === "APPROVED"
                ? "border-green-400/30 bg-green-950/20"
                : "border-red-400/30 bg-red-950/20"
            }`}
          >
            <h2 className="font-display text-lg text-cream-50">Décision de l&apos;inspecteur</h2>
            <p
              className={`mt-2 text-sm ${
                inspection.decision.decision === "APPROVED" ? "text-green-300" : "text-red-300"
              }`}
            >
              {inspection.decision.decision === "APPROVED" ? "Approuvée" : "Rejetée"} par{" "}
              {inspection.assignment?.inspector.name}
            </p>
            {inspection.decision.comment && (
              <p className="mt-1 text-sm text-cream-50/70">{inspection.decision.comment}</p>
            )}
            <p className="mt-2 text-xs text-cream-50/40">
              Le{" "}
              {new Date(inspection.decision.decidedAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </section>
        )}
      </main>

      {assigning && (
        <InspectionAssignModal inspection={inspection} onClose={() => setAssigning(false)} />
      )}
    </>
  );
}
