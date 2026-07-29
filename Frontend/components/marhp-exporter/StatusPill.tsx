import type { ExportRequestStatus, RegistrationStatus } from "./types";

type AnyStatus = ExportRequestStatus | RegistrationStatus;

interface StatusPillProps {
  status: AnyStatus;
  className?: string;
}

const LABELS: Record<AnyStatus, { fr: string; ar: string }> = {
  envoyee: { fr: "Envoyée", ar: "مرسلة" },
  en_cours_examen: { fr: "En cours d'examen", ar: "قيد الدراسة" },
  examen_instance: { fr: "Examen par l'instance", ar: "دراسة الهيئة" },
  approuvee: { fr: "Approuvée", ar: "موافق عليها" },
  rejetee: { fr: "Rejetée", ar: "مرفوضة" },
};

const TONE: Record<AnyStatus, string> = {
  envoyee: "bg-cream-50/10 text-cream-50/80 border-cream-50/20",
  en_cours_examen: "bg-gold-300/10 text-gold-300 border-gold-300/30",
  examen_instance: "bg-gold-300/10 text-gold-300 border-gold-300/30",
  approuvee: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  rejetee: "bg-rose-400/10 text-rose-300 border-rose-400/30",
};

export function StatusPill({ status, className = "" }: StatusPillProps) {
  const l = LABELS[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${TONE[status]} ${className}`}
    >
      <span className="font-body">{l.fr}</span>
      <span className="text-[10px] opacity-70 font-body">{l.ar}</span>
    </span>
  );
}
