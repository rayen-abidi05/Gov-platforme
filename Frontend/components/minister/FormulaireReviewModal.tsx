
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Building2, Hash, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiMinisterFormulaire } from "@/types/ministerFormulaire";
import { useReviewFormulaire } from "@/hooks/useMinisterFormulaires";

export function FormulaireReviewModal({
  formulaire,
  onClose,
}: {
  formulaire: ApiMinisterFormulaire;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState("");
  const { mutateAsync, isPending } = useReviewFormulaire();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const company = formulaire.registrationRequest.company;
  const isPendingReview = formulaire.status === "PENDING";

  async function handleReview(status: "APPROVED" | "REJECTED") {
    await mutateAsync({ id: formulaire.id, status, notes: notes.trim() || undefined });
    onClose();
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-cream-50/10 bg-olive-950 p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <h2 className="font-display text-xl text-cream-50">Demande ministérielle</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-cream-50/50 transition-colors duration-150 hover:bg-cream-50/10 hover:text-cream-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-2.5 rounded-xl border border-cream-50/10 bg-cream-50/[0.03] p-4 text-sm">
          <div className="flex items-center gap-2 text-cream-50/80">
            <Building2 className="h-4 w-4 shrink-0 text-gold-300" />
            <span className="font-medium text-cream-50">{company.commName}</span>
          </div>
          <div className="flex items-center gap-2 text-cream-50/60">
            <Hash className="h-3.5 w-3.5 shrink-0" />
            RNE {company.rne} — MF {company.matFisc}
          </div>
          <div className="flex items-center gap-2 text-cream-50/60">
            <Globe className="h-3.5 w-3.5 shrink-0" />
            {company.nationality}
          </div>
          <div className="text-cream-50/50">
            {company.user.name} — {company.user.email}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-cream-50/60">
            <FileText className="h-3.5 w-3.5" />
            Texte de la demande
          </p>
          <p className="rounded-xl border border-cream-50/10 bg-cream-50/[0.02] p-3.5 text-sm leading-relaxed text-cream-50/85">
            {formulaire.requestText}
          </p>
        </div>

        {!isPendingReview && formulaire.notes && (
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-medium text-cream-50/60">Notes de révision</p>
            <p className="rounded-xl border border-cream-50/10 bg-cream-50/[0.02] p-3.5 text-sm text-cream-50/70">
              {formulaire.notes}
            </p>
          </div>
        )}

        {isPendingReview && (
          <>
            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-medium text-cream-50/60">
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                disabled={isPending}
                placeholder="Motif du rejet ou remarque..."
                className="w-full rounded-xl border border-cream-50/15 bg-cream-50/[0.03] p-3 text-sm text-cream-50 placeholder:text-cream-50/30 focus:border-gold-300/40 focus:outline-none disabled:opacity-60"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                isLoading={isPending}
                onClick={() => handleReview("REJECTED")}
                className="flex-1"
              >
                Rejeter
              </Button>
              <Button
                type="button"
                isLoading={isPending}
                onClick={() => handleReview("APPROVED")}
                className="flex-1"
              >
                Approuver
              </Button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}