"use client";

import { X, ShieldCheck } from "lucide-react";
import { ApprovedExporter } from "@/types/registration";

export default function ExporterDetailsModal({
  exporter,
  onClose,
}: {
  exporter: ApprovedExporter;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-cream-50/10 bg-olive-950 p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl text-cream-50">{exporter.commName}</h2>
            <p className="mt-1 text-sm text-cream-50/60">
              {exporter.user.name} · {exporter.user.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-cream-50/50 transition-colors duration-150 hover:bg-cream-50/10 hover:text-cream-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-gold-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          Exportateur approuvé le{" "}
          {new Date(exporter.approvedAt).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <Field label="RNE" value={exporter.rne} />
          <Field label="Matricule fiscal" value={exporter.matFisc} />
          <Field label="Activité" value={exporter.activity} />
          <Field label="Laboratoire d'analyse" value={exporter.labName} />
          <Field label="Gouvernorat" value={exporter.governorate} />
          <Field label="Ville" value={exporter.city} />
          <Field label="Adresse" value={exporter.address} className="col-span-2" />
          <Field label="Téléphone" value={exporter.phone} />
          <Field label="Nationalité" value={exporter.nationality} />
          <Field label="Statut de résidence" value={exporter.isResident ? "Résidente" : "Non-résidente"} />
          <Field label="Lieu de stockage" value={exporter.isRented ? "Loué" : "Propriété"} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs text-cream-50/50">{label}</p>
      <p className="mt-0.5 text-cream-50">{value}</p>
    </div>
  );
}