"use client";

import { privateApi } from "@/lib/api/privateApi";
import { X, FileText, Download, Eye as EyeIcon, ShieldQuestion } from "lucide-react";
import { ExportRequest } from "@/types/exportRequest";
import ExportStatusBadge from "@/components/exporter/ExportStatusBadge";
import RequestTimeline from "@/components/observer/RequestTimeline";
import Spinner from "@/components/ui/spinner";

const DOC_LABELS: Record<string, string> = {
  AGRIM: "Certificat AGRIM",
  CONTRACT: "Contrat avec le client",
  MINISTERIAL_LETTER: "Lettre d'autorisation ministérielle",
};

interface Props {
  request: ExportRequest | null;
  isLoading?: boolean;
  onClose: () => void;
}

export default function ObserverExportRequestModal({ request, isLoading, onClose }: Props) {
  const handleDownloadDocument = async (docId: string) => {
    const res = await privateApi.get(`/api/files/${docId}/download`, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewDocument = async (docId: string) => {
    const res = await privateApi.get(`/api/files/${docId}/view`, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-cream-50/10 bg-olive-950 p-6 sm:p-8">
        {isLoading || !request ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="h-8 w-8" />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl text-cream-50">{request.client}</h2>
                <p className="mt-1 text-sm text-cream-50/60">
                  AGRIM {request.agrimReference}
                  {request.company?.commName && (
                    <span className="text-cream-50/40"> — {request.company.commName}</span>
                  )}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-cream-50/50 transition-colors duration-150 hover:bg-cream-50/10 hover:text-cream-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <ExportStatusBadge status={request.status} />
              <span className="text-xs text-cream-50/50">
                Quantité : {request.requestedKg.toLocaleString("fr-FR")} kg
              </span>
              {request.company?.governorate && (
                <span className="text-xs text-cream-50/50">
                  Gouvernorat : {request.company.governorate}
                </span>
              )}
            </div>

            {request.agrim && (
              <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-4 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-xs text-cream-50/50">Qté demandée</p>
                  <p className="text-cream-50">{request.requestedKg.toLocaleString("fr-FR")} kg</p>
                </div>
                <div>
                  <p className="text-xs text-cream-50/50">Limite AGRIM</p>
                  <p className="text-cream-50">{request.agrim.limitKg.toLocaleString("fr-FR")} kg</p>
                </div>
                <div>
                  <p className="text-xs text-cream-50/50">Déjà consommé</p>
                  <p className="text-cream-50">{request.agrim.consumedKg} kg</p>
                </div>
                <div>
                  <p className="text-xs text-cream-50/50">Restant</p>
                  <p className="text-gold-300">
                    {(request.agrim.limitKg - request.agrim.consumedKg).toLocaleString("fr-FR")} kg
                  </p>
                </div>
              </div>
            )}

            <h3 className="mt-6 text-sm font-medium text-cream-50/90">Suivi de la demande</h3>
            <div className="mt-3 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-4">
              <RequestTimeline request={request} />
            </div>

            <h3 className="mt-6 text-sm font-medium text-cream-50/90">
              Documents ({request.documents.length}/3)
            </h3>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {request.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-gold-300/30 bg-gold-300/[0.04] p-3"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <FileText className="h-4 w-4 shrink-0 text-gold-300" />
                    <span className="truncate text-sm text-cream-50/90">{DOC_LABELS[doc.DocType]}</span>
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
              {request.documents.length === 0 && (
                <p className="text-sm text-cream-50/40">Aucun document joint.</p>
              )}
            </div>

            <h3 className="mt-6 text-sm font-medium text-cream-50/90">Statut d&apos;inspection</h3>
            <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-4">
              <ShieldQuestion className="mt-0.5 h-4 w-4 shrink-0 text-cream-50/40" />
              <p className="text-sm text-cream-50/60">
                Le suivi d&apos;inspection concerne actuellement l&apos;enregistrement des sociétés,
                pas les demandes d&apos;exportation individuellement. Aucune donnée d&apos;inspection
                n&apos;est disponible pour cette demande.
              </p>
            </div>

            <div className="mt-7 border-t border-cream-50/10 pt-5">
              <p className="text-xs text-cream-50/40">
                Accès observateur — lecture seule, aucune action n&apos;est disponible sur cette demande.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
