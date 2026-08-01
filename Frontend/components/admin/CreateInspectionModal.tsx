"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ApprovedExporter } from "@/types/registration";
import { InspectionPriority } from "@/types/inspection";
import { useCreateInspection, useInspectors } from "@/hooks/useInspections";

interface Props {
  exporters: ApprovedExporter[];
  onClose: () => void;
}

export default function CreateInspectionModal({ exporters, onClose }: Props) {
  const [companyId, setCompanyId] = useState("");
  const [inspectorId, setInspectorId] = useState("");
  const [priority, setPriority] = useState<InspectionPriority | "">("");
  const [notes, setNotes] = useState("");

  const { data: inspectorsData } = useInspectors();
  const inspectors = inspectorsData?.inspectors ?? [];

  const { mutate: createInspection, isPending, isError } = useCreateInspection();

  const handleSubmit = () => {
    if (!companyId) return;
    createInspection(
      {
        companyId,
        priority: priority || undefined,
        notes: notes || undefined,
        inspectorId: inspectorId || undefined,
      },
      { onSuccess: onClose }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-cream-50/10 bg-olive-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-cream-50/10 px-6 py-4">
          <h2 className="font-display text-lg text-cream-50">Nouvelle inspection</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-cream-50/60 transition-colors duration-150 hover:bg-cream-50/10 hover:text-cream-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div>
            <label className="text-xs text-cream-50/60">Exportateur</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] p-2.5 text-sm text-cream-50 outline-none focus:border-gold-300/40"
            >
              <option value="" className="bg-olive-950">
                Sélectionner un exportateur
              </option>
              {exporters.map((exp) => (
                <option key={exp.id} value={exp.id} className="bg-olive-950">
                  {exp.commName} — {exp.governorate}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-cream-50/60">
              Assigner à un inspecteur INSPA (optionnel)
            </label>
            <select
              value={inspectorId}
              onChange={(e) => setInspectorId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] p-2.5 text-sm text-cream-50 outline-none focus:border-gold-300/40"
            >
              <option value="" className="bg-olive-950">
                Ne pas assigner maintenant
              </option>
              {inspectors.map((insp) => (
                <option key={insp.id} value={insp.id} className="bg-olive-950">
                  {insp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-cream-50/60">Priorité (optionnel)</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as InspectionPriority | "")}
              className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] p-2.5 text-sm text-cream-50 outline-none focus:border-gold-300/40"
            >
              <option value="" className="bg-olive-950">
                Aucune
              </option>
              <option value="LOW" className="bg-olive-950">Basse</option>
              <option value="MEDIUM" className="bg-olive-950">Moyenne</option>
              <option value="HIGH" className="bg-olive-950">Haute</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-cream-50/60">Note (optionnel)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Contexte utile pour l'inspecteur..."
              className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] p-2.5 text-sm text-cream-50 placeholder:text-cream-50/40 outline-none focus:border-gold-300/40"
            />
          </div>

          {isError && (
            <p className="text-xs text-red-300">
              Une erreur est survenue lors de la création de l&apos;inspection.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2.5 border-t border-cream-50/10 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-cream-50/15 px-4 py-2 text-sm text-cream-50/70 transition-colors duration-150 hover:bg-cream-50/5"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!companyId || isPending}
            className="rounded-lg bg-gold-300 px-4 py-2 text-sm font-medium text-olive-950 transition-colors duration-150 hover:bg-gold-300/90 disabled:opacity-50"
          >
            {isPending ? "Création..." : "Créer l'inspection"}
          </button>
        </div>
      </div>
    </div>
  );
}
