"use client";

import { X, FileText, Download, Eye as EyeIcon } from "lucide-react";
import { ExportRequest, ExportRequestStatus } from "@/types/exportRequest";
import ExportStatusBadge from "@/components/exporter/ExportStatusBadge";

const DOC_LABELS: Record<string, string> = {
  AGRIM: "Certificat AGRIM",
  CONTRACT: "Contrat avec le client",
  MINISTERIAL_LETTER: "Lettre d'autorisation ministérielle",
};

interface Props {
  request: ExportRequest;
  onClose: () => void;
  onStatusChange: (id: string, status: ExportRequestStatus) => void;
}

export default function ExportRequestModal({ request, onClose, onStatusChange }: Props) {
  const remaining = request.agrim.limitKg - request.agrim.consumedKg;

  // TODO: wire to real /api/files/:docId/view and /download once the
  // backend Document model supports ExportRequest-linked files, same
  // pattern as the registration document viewer/downloader.
  const handleView = (fileUrl: string) => window.open(fileUrl, "_blank");
  const handleDownload = (fileUrl: string) => window.open(fileUrl, "_blank");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-cream-50/10 bg-olive-950 p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl text-cream-50">{request.client}</h2>
            <p className="mt-1 text-sm text-cream-50/60">AGRIM {request.agrim.reference}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-cream-50/50 transition-colors duration-150 hover:bg-cream-50/10 hover:text-cream-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <ExportStatusBadge status={request.status} />
          <span className="text-xs text-cream-50/50">
            Soumise le{" "}
            {new Date(request.submittedAt).toLocaleDateString("fr-FR", {
              day: "2-digit", month: "long", year: "numeric",
            })}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-cream-50/50">Qté demandée</p>
            <p className="text-cream-50">{request.agrim.requestedKg.toLocaleString("fr-FR")} kg</p>
          </div>
          <div>
            <p className="text-xs text-cream-50/50">Limite AGRIM</p>
            <p className="text-cream-50">{request.agrim.limitKg.toLocaleString("fr-FR")} kg</p>
          </div>
          <div>
            <p className="text-xs text-cream-50/50">Déjà consommé</p>
            <p className="text-cream-50">{request.agrim.consumedKg.toLocaleString("fr-FR")} kg</p>
          </div>
          <div>
            <p className="text-xs text-cream-50/50">Restant</p>
            <p className="text-gold-300">{remaining.toLocaleString("fr-FR")} kg</p>
          </div>
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
                <span className="truncate text-sm text-cream-50/90">{DOC_LABELS[doc.label]}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => handleView(doc.fileUrl)}
                  className="rounded-md p-1.5 text-cream-50/60 transition-colors duration-150 hover:bg-cream-50/10 hover:text-gold-300"
                  title="Aperçu"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDownload(doc.fileUrl)}
                  className="rounded-md p-1.5 text-cream-50/60 transition-colors duration-150 hover:bg-cream-50/10 hover:text-gold-300"
                  title="Télécharger"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 border-t border-cream-50/10 pt-5">
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onStatusChange(request.id, "UNDER_COMMITTEE_REVIEW")}
              disabled={request.status === "UNDER_COMMITTEE_REVIEW"}
              className="rounded-lg border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300 transition-colors duration-150 hover:bg-blue-400/20 disabled:opacity-40"
            >
              Envoyer à l'instance
            </button>
            <button
              onClick={() => onStatusChange(request.id, "APPROVED")}
              disabled={request.status === "APPROVED"}
              className="rounded-lg bg-gold-300 px-4 py-2 text-sm font-medium text-olive-950 transition-colors duration-150 hover:bg-gold-300/90 disabled:opacity-40"
            >
              Approuver
            </button>
            <button
              onClick={() => onStatusChange(request.id, "REJECTED")}
              disabled={request.status === "REJECTED"}
              className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors duration-150 hover:bg-red-400/20 disabled:opacity-40"
            >
              Rejeter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}