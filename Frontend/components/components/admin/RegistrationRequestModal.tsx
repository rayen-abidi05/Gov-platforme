"use client";

import { useState } from "react";
import { X, FileText, Download, Eye as EyeIcon, CheckCircle2, Check } from "lucide-react";
import { ApiRegistrationRequest, RequestStatus } from "@/types/registration";
import { DOCUMENT_LABELS, getRequiredDocTypes } from "@/lib/documentConfig";
import StatusBadge from "./StatusBadge";

interface Props {
  request: ApiRegistrationRequest;
  onClose: () => void;
  onStatusChange: (id: string, status: RequestStatus, notes?: string) => void;
  
  onViewDocument: (docId: string) => void;
  onDownloadDocument: (docId: string) => void;
}

export default function RegistrationRequestModal({
  request,
  onClose,
  onStatusChange,
  onViewDocument,
  onDownloadDocument,
}: Props) {
  const [rejectNotes, setRejectNotes] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [verifiedDocIds, setVerifiedDocIds] = useState<Set<string>>(new Set());

  const requiredTypes = getRequiredDocTypes(request.company.isRented);
  const uploadedMap = new Map(request.documents.map((d) => [d.DocType, d]));

  const toggleVerified = (docId: string) => {
    setVerifiedDocIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) {
        next.delete(docId);
      } else {
        next.add(docId);
      }
      return next;
    });
  };





  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-cream-50/10 bg-olive-950 p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl text-cream-50">{request.company.commName}</h2>
            <p className="mt-1 text-sm text-cream-50/60">
              {request.company.user.name} · {request.company.user.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-cream-50/50 transition-colors duration-150 hover:bg-cream-50/10 hover:text-cream-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <StatusBadge status={request.status} />
          <span className="text-xs text-cream-50/50">
            Soumise le{" "}
            {new Date(request.submittedAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs text-cream-50/50">Matricule fiscal</p>
            <p className="text-cream-50">{request.company.matFisc}</p>
          </div>
          <div>
            <p className="text-xs text-cream-50/50">Gouvernorat</p>
            <p className="text-cream-50">{request.company.governorate}</p>
          </div>
          <div>
            <p className="text-xs text-cream-50/50">Statut du local</p>
            <p className="text-cream-50">{request.company.isRented ? "Loué" : "Propriété"}</p>
          </div>
        </div>

        {request.status === "REJECTED" && request.notes && (
          <div className="mt-4 rounded-lg border border-red-400/30 bg-red-950/20 p-3 text-sm">
            <p className="font-medium text-red-300">Motif du rejet précédent :</p>
            <p className="mt-1 text-cream-50/70">{request.notes}</p>
          </div>
        )}

        <h3 className="mt-6 text-sm font-medium text-cream-50/90">
          Documents ({request.documents.length}/{requiredTypes.length})
          {request.documents.length > 0 && (
            <span className="ml-2 font-normal text-cream-50/50">
              · {verifiedDocIds.size}/{request.documents.length} vérifiés
            </span>
          )}
        </h3>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {requiredTypes.map((type) => {
            const doc = uploadedMap.get(type);
            const isVerified = doc ? verifiedDocIds.has(doc.id) : false;
            return (
              <div
                key={type}
                className={`flex items-center justify-between gap-2 rounded-lg border p-3 ${
                  doc ? "border-gold-300/30 bg-gold-300/[0.04]" : "border-red-400/20 bg-red-950/10"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  {doc && (
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isVerified}
                      title={isVerified ? "Marqué comme valide" : "Confirmer la validité de ce document"}
                      onClick={() => toggleVerified(doc.id)}
                      className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors duration-150 ${
                        isVerified
                          ? "border-gold-300 bg-gold-300 text-olive-950"
                          : "border-cream-50/30 bg-transparent hover:border-gold-300/60"
                      }`}
                    >
                      {isVerified && <Check className="h-3 w-3" strokeWidth={3} />}
                    </button>
                  )}
                  {doc ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-300" />
                  ) : (
                    <FileText className="h-4 w-4 shrink-0 text-red-400/60" />
                  )}
                  <span className="truncate text-sm text-cream-50/90">
                    {DOCUMENT_LABELS[type].fr}
                  </span>
                </div>
                {doc ? (
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => onViewDocument(doc.id)}
                      className="rounded-md p-1.5 text-cream-50/60 transition-colors duration-150 hover:bg-cream-50/10 hover:text-gold-300"
                      title="Aperçu"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDownloadDocument(doc.id)}
                      className="rounded-md p-1.5 text-cream-50/60 transition-colors duration-150 hover:bg-cream-50/10 hover:text-gold-300"
                      title="Télécharger"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className="shrink-0 text-xs text-red-400/70">Manquant</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-7 border-t border-cream-50/10 pt-5">
          {showRejectInput ? (
            <div>
              <label className="text-xs text-cream-50/60">Motif du rejet</label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                rows={3}
                placeholder="Expliquez pourquoi cette demande est rejetée..."
                className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] p-3 text-sm text-cream-50 placeholder:text-cream-50/40 outline-none focus:border-red-400/40"
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setShowRejectInput(false)}
                  className="rounded-lg border border-cream-50/15 px-4 py-2 text-sm text-cream-50/70 transition-colors duration-150 hover:bg-cream-50/5"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    onStatusChange(request.id, "REJECTED", rejectNotes);
                    onClose();
                  }}
                  disabled={!rejectNotes.trim()}
                  className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-red-500 disabled:opacity-50"
                >
                  Confirmer le rejet
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => {
                  onStatusChange(request.id, "UNDER_REVIEW");
                  onClose();
                }}
                disabled={request.status === "UNDER_REVIEW"}
                className="rounded-lg border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300 transition-colors duration-150 hover:bg-blue-400/20 disabled:opacity-40"
              >
                Mettre en examen
              </button>
              <button
                onClick={() => {
                  onStatusChange(request.id, "APPROVED");
                  onClose();
                }}
                disabled={request.status === "APPROVED"}
                className="rounded-lg bg-gold-300 px-4 py-2 text-sm font-medium text-olive-950 transition-colors duration-150 hover:bg-gold-300/90 disabled:opacity-40"
              >
                Approuver
              </button>
              <button
                onClick={() => setShowRejectInput(true)}
                disabled={request.status === "REJECTED"}
                className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors duration-150 hover:bg-red-400/20 disabled:opacity-40"
              >
                Rejeter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}