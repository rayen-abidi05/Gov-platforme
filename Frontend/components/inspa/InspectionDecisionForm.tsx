"use client";

import { useState } from "react";
import { InspectionDecisionType, REJECTION_REASONS, APPROVAL_NOTES } from "@/types/inspection";

interface Props {
  onSubmit: (decision: InspectionDecisionType, reason?: string, comment?: string) => void;
  isSubmitting?: boolean;
  disabled?: boolean;
}

export default function InspectionDecisionForm({ onSubmit, isSubmitting, disabled }: Props) {
  const [mode, setMode] = useState<InspectionDecisionType | null>(null);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const reset = () => {
    setMode(null);
    setReason("");
    setComment("");
  };

  if (disabled) return null;

  if (mode === "REJECTED") {
    return (
      <div>
        <label className="text-xs text-cream-50/60">Motif du rejet (obligatoire)</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-3 py-2.5 text-sm text-cream-50 outline-none transition-all duration-200 focus:border-red-400/40"
        >
          <option value="" className="bg-olive-950">Sélectionner un motif...</option>
          {REJECTION_REASONS.map((r) => (
            <option key={r.value} value={r.value} className="bg-olive-950">
              {r.label}
            </option>
          ))}
        </select>

        <label className="mt-4 block text-xs text-cream-50/60">Commentaire (optionnel)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Précisez les observations relevées lors de l'inspection..."
          className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] p-3 text-sm text-cream-50 placeholder:text-cream-50/40 outline-none focus:border-red-400/40"
        />

        <div className="mt-3 flex gap-2">
          <button
            onClick={reset}
            className="rounded-lg border border-cream-50/15 px-4 py-2 text-sm text-cream-50/70 transition-colors duration-150 hover:bg-cream-50/5"
          >
            Annuler
          </button>
          <button
            onClick={() => onSubmit("REJECTED", reason, comment)}
            disabled={!reason || isSubmitting}
            className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-red-500 disabled:opacity-50"
          >
            {isSubmitting ? "Envoi..." : "Confirmer le rejet"}
          </button>
        </div>
      </div>
    );
  }

  if (mode === "APPROVED") {
    return (
      <div>
        <label className="text-xs text-cream-50/60">Remarque (optionnel)</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-3 py-2.5 text-sm text-cream-50 outline-none transition-all duration-200 focus:border-gold-300/40"
        >
          <option value="" className="bg-olive-950">Aucune remarque particulière</option>
          {APPROVAL_NOTES.map((r) => (
            <option key={r.value} value={r.value} className="bg-olive-950">
              {r.label}
            </option>
          ))}
        </select>

        <label className="mt-4 block text-xs text-cream-50/60">Commentaire (optionnel)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Ajoutez un commentaire sur l'inspection..."
          className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] p-3 text-sm text-cream-50 placeholder:text-cream-50/40 outline-none focus:border-gold-300/40"
        />

        <div className="mt-3 flex gap-2">
          <button
            onClick={reset}
            className="rounded-lg border border-cream-50/15 px-4 py-2 text-sm text-cream-50/70 transition-colors duration-150 hover:bg-cream-50/5"
          >
            Annuler
          </button>
          <button
            onClick={() => onSubmit("APPROVED", reason, comment)}
            disabled={isSubmitting}
            className="rounded-lg bg-gold-300 px-4 py-2 text-sm font-medium text-olive-950 transition-colors duration-150 hover:bg-gold-300/90 disabled:opacity-50"
          >
            {isSubmitting ? "Envoi..." : "Confirmer l'approbation"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      <button
        onClick={() => setMode("APPROVED")}
        className="rounded-lg bg-gold-300 px-4 py-2 text-sm font-medium text-olive-950 transition-colors duration-150 hover:bg-gold-300/90"
      >
        Approuver
      </button>
      <button
        onClick={() => setMode("REJECTED")}
        className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors duration-150 hover:bg-red-400/20"
      >
        Rejeter
      </button>
    </div>
  );
}
