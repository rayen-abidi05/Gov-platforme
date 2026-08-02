"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ApiInspection } from "@/types/inspection";
import { useCompleteInspection } from "@/hooks/useCompleteInspection";

interface Props {
  inspection: ApiInspection;
  onClose: () => void;
}

export default function DecideInspectionModal({ inspection, onClose }: Props) {
  const [notes, setNotes] = useState("");
  const { mutate: complete, isPending } = useCompleteInspection();

  const handleDecide = (status: "APPROVED" | "REJECTED") => {
    complete(
      { id: inspection.id, status, notes: notes.trim() || undefined },
      { onSuccess: onClose }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-cream-50/10 bg-olive-950 p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl text-cream-50">
              {inspection.registrationRequest.company.commName}
            </h2>
            <p className="mt-1 text-sm text-cream-50/60">
              {inspection.registrationRequest.company.governorate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-cream-50/50 transition-colors duration-150 hover:bg-cream-50/10 hover:text-cream-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5">
          <label className="text-sm font-medium text-cream-50/90">
            Notes d'inspection (optionnel)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Observations sur le lieu de stockage..."
            className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] p-3 text-sm text-cream-50 placeholder:text-cream-50/40 outline-none transition-all duration-200 focus:border-gold-300/40"
          />
        </div>

        <div className="mt-6 flex gap-2.5">
          <button
            onClick={() => handleDecide("APPROVED")}
            disabled={isPending}
            className="flex-1 rounded-lg bg-gold-300 px-4 py-2.5 text-sm font-medium text-olive-950 transition-colors duration-150 hover:bg-gold-300/90 disabled:opacity-50"
          >
            Approuver
          </button>
          <button
            onClick={() => handleDecide("REJECTED")}
            disabled={isPending}
            className="flex-1 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm font-medium text-red-300 transition-colors duration-150 hover:bg-red-400/20 disabled:opacity-50"
          >
            Rejeter
          </button>
        </div>
      </div>
    </div>
  );
}