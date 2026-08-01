"use client";

import { useState } from "react";
import { ApiInspection } from "@/types/inspection";
import {
  useStartInspectionReview,
  useSubmitInspectionDecision,
} from "@/hooks/useInspections";

interface Props {
  inspection: ApiInspection;
  currentUserId: string;
}

export default function InspectionDecisionForm({ inspection, currentUserId }: Props) {
  const [comment, setComment] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const { mutate: startReview, isPending: isStartingReview } = useStartInspectionReview();
  const { mutate: submitDecision, isPending: isSubmitting } = useSubmitInspectionDecision();

  const isAssignee = inspection.assignment?.inspector.id === currentUserId;
  const isDecided = inspection.status === "APPROVED" || inspection.status === "REJECTED";

  if (!isAssignee) {
    return (
      <div className="rounded-xl border border-cream-50/10 bg-cream-50/[0.03] p-4 text-sm text-cream-50/60">
        Cette inspection ne vous est pas assignée.
      </div>
    );
  }

  if (isDecided && inspection.decision) {
    return (
      <div
        className={`rounded-xl border p-4 text-sm ${
          inspection.decision.decision === "APPROVED"
            ? "border-green-400/30 bg-green-950/20"
            : "border-red-400/30 bg-red-950/20"
        }`}
      >
        <p className={inspection.decision.decision === "APPROVED" ? "text-green-300" : "text-red-300"}>
          Décision soumise : {inspection.decision.decision === "APPROVED" ? "Approuvée" : "Rejetée"}
        </p>
        {inspection.decision.comment && (
          <p className="mt-1 text-cream-50/70">{inspection.decision.comment}</p>
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
      </div>
    );
  }

  if (inspection.status === "ASSIGNED") {
    return (
      <button
        onClick={() => startReview(inspection.id)}
        disabled={isStartingReview}
        className="rounded-lg border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300 transition-colors duration-150 hover:bg-blue-400/20 disabled:opacity-50"
      >
        {isStartingReview ? "Démarrage..." : "Commencer l'examen"}
      </button>
    );
  }

  // status === UNDER_REVIEW
  return (
    <div>
      {showRejectInput ? (
        <div>
          <label className="text-xs text-cream-50/60">Motif du rejet</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Expliquez pourquoi cette inspection est rejetée..."
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
              onClick={() =>
                submitDecision({ id: inspection.id, decision: "REJECTED", comment })
              }
              disabled={!comment.trim() || isSubmitting}
              className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-red-500 disabled:opacity-50"
            >
              {isSubmitting ? "Envoi..." : "Confirmer le rejet"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <label className="text-xs text-cream-50/60">Commentaire (optionnel pour une approbation)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Observations sur l'exportateur ou le lieu de stockage..."
            className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] p-3 text-sm text-cream-50 placeholder:text-cream-50/40 outline-none focus:border-gold-300/40"
          />
          <div className="mt-3 flex flex-wrap gap-2.5">
            <button
              onClick={() =>
                submitDecision({ id: inspection.id, decision: "APPROVED", comment: comment || undefined })
              }
              disabled={isSubmitting}
              className="rounded-lg bg-gold-300 px-4 py-2 text-sm font-medium text-olive-950 transition-colors duration-150 hover:bg-gold-300/90 disabled:opacity-50"
            >
              {isSubmitting ? "Envoi..." : "Approuver"}
            </button>
            <button
              onClick={() => setShowRejectInput(true)}
              className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors duration-150 hover:bg-red-400/20"
            >
              Rejeter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
