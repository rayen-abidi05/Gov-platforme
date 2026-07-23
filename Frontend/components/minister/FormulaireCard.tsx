
import { Building2, Globe, Calendar, ArrowRight } from "lucide-react";
import { ApiMinisterFormulaire } from "@/types/ministerFormulaire";
import { FormulaireStatusBadge } from "./FormulaireStatusBadge";

export function FormulaireCard({
  formulaire,
  onOpen,
}: {
  formulaire: ApiMinisterFormulaire;
  onOpen: () => void;
}) {
  const company = formulaire.registrationRequest.company;

  return (
    <button
      onClick={onOpen}
      className="group flex w-full items-center justify-between gap-4 rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-4 text-left transition-all duration-200 hover:border-gold-300/30 hover:bg-olive-950/60"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 shrink-0 text-gold-300" />
          <p className="truncate text-sm font-medium text-cream-50">{company.commName}</p>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-cream-50/50">
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {company.nationality}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(formulaire.submittedAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <FormulaireStatusBadge status={formulaire.status} />
        <ArrowRight className="h-4 w-4 text-cream-50/30 transition-colors duration-200 group-hover:text-gold-300" />
      </div>
    </button>
  );
}