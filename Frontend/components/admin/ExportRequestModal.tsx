"use client";
import {privateApi} from "@/lib/api/privateApi";
import { X, FileText, Download, Eye as EyeIcon } from "lucide-react";
import { ExportRequest, ExportRequestStatus } from "@/types/exportRequest";
import ExportStatusBadge from "@/components/exporter/ExportStatusBadge";
import { useState } from "react";
import { useResolveAgrim } from "@/hooks/useResolveAgrim";
import { useSendToCommittee } from "@/hooks/useSendToCommittee";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

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

export default function ExportRequestModal({
  request,
  onClose,
  onStatusChange,
}: Props) {
  const [limitInput, setLimitInput] = useState("");

  const { 
    mutate: resolveAgrim,
    isPending: isResolving
  } = useResolveAgrim();
  const { mutate: sendToCommittee } = useSendToCommittee();

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

  const [pendingAction, setPendingAction] = useState<"REVIEW" | "APPROVE" | "REJECT" | null>(null);

  const STATUS_MAP = {
    REVIEW: "UNDER_COMMITTEE_REVIEW",
    APPROVE: "APPROVED",
    REJECT: "REJECTED",
  } as const;

  function executeAction(action: "REVIEW" | "APPROVE" | "REJECT") {
    if (action === "REVIEW") {
      sendToCommittee(request.id);
    } else {
      onStatusChange(request.id, STATUS_MAP[action]);
    }
    setPendingAction(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-cream-50/10 bg-olive-950 p-6 sm:p-8">

        <div className="flex items-start justify-between">

          <div>
            <h2 className="font-display text-xl text-cream-50">
              {request.client}
            </h2>

            <p className="mt-1 text-sm text-cream-50/60">
              AGRIM {request.agrimReference}
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

          <ExportStatusBadge status={request.status} />

          <span className="text-xs text-cream-50/50">
            Soumise le{" "}
            {new Date(request.submittedAt).toLocaleDateString(
              "fr-FR",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }
            )}
          </span>

        </div>


      {request.agrim ? (

    <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-4 text-sm sm:grid-cols-4">

      <div>
        <p className="text-xs text-cream-50/50">
          Qté demandée
        </p>

        <p className="text-cream-50">
          {request.requestedKg.toLocaleString("fr-FR")} kg
        </p>
      </div>


      <div>
        <p className="text-xs text-cream-50/50">
          Limite AGRIM
        </p>

        <p className="text-cream-50">
          {request.agrim.limitKg.toLocaleString("fr-FR")} kg
        </p>
      </div>


      <div>
        <p className="text-xs text-cream-50/50">
          Déjà consommé
        </p>

        <p className="text-cream-50">
          {request.agrim.consumedKg.toLocaleString("fr-FR")} kg
        </p>
      </div>


      <div>
        <p className="text-xs text-cream-50/50">
          Restant
        </p>

        <p className="text-gold-300">
          {(
            request.agrim.limitKg -
            request.agrim.consumedKg
        ).toLocaleString("fr-FR")} kg
        </p>
      </div>

    </div>


  ) : (

    <div className="mt-5 rounded-lg border border-blue-400/30 bg-blue-950/20 p-4">

      <p className="text-sm font-medium text-blue-300">
        AGRIM non résolu
      </p>


      <p className="mt-1 text-sm text-cream-50/70">
        Référence :
        <span className="font-medium text-cream-50">
          {" "}
          {request.agrimReference}
        </span>
      </p>


      <div className="mt-3 flex items-center gap-2">

        <input
          type="number"
          value={limitInput}
          onChange={(e)=>setLimitInput(e.target.value)}
          placeholder="Limite AGRIM kg"
          className="w-40 rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-3 py-2 text-sm text-cream-50 outline-none focus:border-gold-300/40"
        />


        <button
          onClick={() =>
            resolveAgrim({
              id: request.id,
              limitKg: Number(limitInput)
            })
          }
          disabled={!limitInput || isResolving}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isResolving ? "Résolution..." : "Résoudre AGRIM"}
        </button>

      </div>

    </div>

  )}



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

                <span className="truncate text-sm text-cream-50/90">
                  {DOC_LABELS[doc.DocType]}
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



        <div className="mt-7 border-t border-cream-50/10 pt-5">

          <div className="flex flex-wrap gap-2.5">


            <button
              onClick={() => setPendingAction("REVIEW")}
              disabled={
                request.status !== "SENT"
              }
              className="rounded-lg border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300 transition-colors duration-150 hover:bg-blue-400/20 disabled:opacity-40"
            >
              Envoyer à l'instance
            </button>



            <button
              onClick={() => setPendingAction("APPROVE")}
              disabled={
              request.status !== "UNDER_COMMITTEE_REVIEW"
            }
              className="rounded-lg bg-gold-300 px-4 py-2 text-sm font-medium text-olive-950 transition-colors duration-150 hover:bg-gold-300/90 disabled:opacity-40"
            >
              Approuver
            </button>



            <button
              onClick={() => setPendingAction("REJECT")}
              disabled={
                request.status !== "UNDER_COMMITTEE_REVIEW"
              }
              className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors duration-150 hover:bg-red-400/20 disabled:opacity-40"
            >
              Rejeter
            </button>


          </div>

        </div>


      </div>

      {pendingAction === "REVIEW" && (
        <ConfirmDialog
          title="Mettre le dossier en examen ?"
          description="Le dossier passera au statut « En examen ». Vous pourrez toujours l'approuver ou le rejeter par la suite."
          confirmLabel="Confirmer"
          onConfirm={() => executeAction("REVIEW")}
          onCancel={() => setPendingAction(null)}
        />
      )}

      {pendingAction === "APPROVE" && (
        <ConfirmDialog
          title="Approuver ce dossier ?"
          description={`Vous êtes sur le point d'approuver le dossier de ${request.client}. Cette action est définitive et ne pourra plus être modifiée.`}
          confirmLabel="Approuver"
          onConfirm={() => executeAction("APPROVE")}
          onCancel={() => setPendingAction(null)}
        />
      )}

      {pendingAction === "REJECT" && (
        <ConfirmDialog
          title="Rejeter ce dossier ?"
          description={`Vous êtes sur le point de rejeter le dossier de ${request.client}. Cette action est définitive et ne pourra plus être modifiée.`}
          confirmLabel="Rejeter"
          variant="danger"
          onConfirm={() => executeAction("REJECT")}
          onCancel={() => setPendingAction(null)}
        />
      )}

    </div>
  );
}