"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ApiInspection } from "@/types/inspection";
import { useInspectors, useAssignInspection } from "@/hooks/useInspections";
import Spinner from "@/components/ui/spinner";

interface Props {
  inspection: ApiInspection;
  onClose: () => void;
}

export default function InspectionAssignModal({ inspection, onClose }: Props) {
  const { data, isLoading } = useInspectors();
  const inspectors = data?.inspectors ?? [];
  const { mutate: assign, isPending } = useAssignInspection();

  const [inspectorId, setInspectorId] = useState(inspection.assignment?.inspector.id ?? "");

  const handleSubmit = () => {
    if (!inspectorId) return;
    assign(
      { id: inspection.id, inspectorId },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-cream-50/10 bg-olive-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-cream-50/10 px-6 py-4">
          <h2 className="font-display text-lg text-cream-50">
            {inspection.assignment ? "Réassigner l'inspection" : "Assigner l'inspection"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-cream-50/50 transition-colors duration-150 hover:bg-cream-50/10 hover:text-cream-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-cream-50/60">
            Exportateur : <span className="text-cream-50">{inspection.company.commName}</span>
          </p>

          <label className="mt-4 block text-xs text-cream-50/60">Inspecteur INSPA</label>
          {isLoading ? (
            <div className="mt-2 flex justify-center py-4">
              <Spinner size="h-6 w-6" />
            </div>
          ) : (
            <select
              value={inspectorId}
              onChange={(e) => setInspectorId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] p-3 text-sm text-cream-50 outline-none focus:border-gold-300/40"
            >
              <option value="" disabled>
                Sélectionner un inspecteur
              </option>
              {inspectors.map((inspector) => (
                <option key={inspector.id} value={inspector.id} className="bg-olive-950">
                  {inspector.name} — {inspector.email}
                </option>
              ))}
            </select>
          )}

          {inspectors.length === 0 && !isLoading && (
            <p className="mt-2 text-xs text-red-300">
              Aucun utilisateur avec le rôle INSPA n&apos;existe pour le moment.
            </p>
          )}

          <div className="mt-6 flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="rounded-lg border border-cream-50/15 px-4 py-2 text-sm text-cream-50/70 transition-colors duration-150 hover:bg-cream-50/5"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={!inspectorId || isPending}
              className="rounded-lg bg-gold-300 px-4 py-2 text-sm font-medium text-olive-950 transition-colors duration-150 hover:bg-gold-300/90 disabled:opacity-50"
            >
              {isPending ? "Envoi..." : "Confirmer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
