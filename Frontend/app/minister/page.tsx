"use client";

import { useState } from "react";
import { FileStack } from "lucide-react";
import { useMinisterFormulaires } from "@/hooks/useMinisterFormulaires";
import { ApiMinisterFormulaire, FormulaireStatus } from "@/types/ministerFormulaire";
import MinisterHeader from "@/components/minister/MinisterHeader";
import { FormulaireCard } from "@/components/minister/FormulaireCard";
import { FormulaireReviewModal } from "@/components/minister/FormulaireReviewModal";
import { cn } from "@/lib/utils";
import Spinner from "@/components/ui/spinner";

const TABS: { key: FormulaireStatus | "ALL"; label: string }[] = [
  { key: "PENDING", label: "En attente" },
  { key: "APPROVED", label: "Approuvées" },
  { key: "REJECTED", label: "Rejetées" },
  { key: "ALL", label: "Toutes" },
];

export default function MinisterDashboardPage() {
  const [tab, setTab] = useState<FormulaireStatus | "ALL">("PENDING");
  const [selected, setSelected] = useState<ApiMinisterFormulaire | null>(null);

  const { data, isLoading } = useMinisterFormulaires(tab);
  const formulaires = data?.formulaires ?? [];

  return (
    <>
      <MinisterHeader
        title="Formulaires ministériels"
        subtitle="Demandes des sociétés exportatrices non résidentes"
      />

      <main className="mx-auto max-w-3xl px-6 py-8 sm:px-10">
        <div className="flex gap-1.5 rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex-1 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-200",
                tab === t.key
                  ? "bg-gold-300 text-olive-950 shadow-sm"
                  : "text-cream-50/60 hover:bg-cream-50/5 hover:text-cream-50"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="h-8 w-8" />
            </div>
          ) : formulaires.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-cream-50/10 bg-olive-950/30 py-20 text-center">
              <FileStack className="h-8 w-8 text-cream-50/20" />
              <p className="text-sm text-cream-50/40">Aucun formulaire dans cette catégorie.</p>
            </div>
          ) : (
            formulaires.map((f) => (
              <FormulaireCard key={f.id} formulaire={f} onOpen={() => setSelected(f)} />
            ))
          )}
        </div>
      </main>

      {selected && (
        <FormulaireReviewModal formulaire={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}