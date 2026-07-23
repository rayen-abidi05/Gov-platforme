
"use client";

import { useState } from "react";
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
        <div className="flex gap-1.5 rounded-xl border border-cream-50/10 bg-olive-950/40 p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150",
                tab === t.key
                  ? "bg-gold-500 text-olive-950"
                  : "text-cream-50/60 hover:text-cream-50"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="h-8 w-8" />
            </div>
          ) : formulaires.length === 0 ? (
            <p className="py-16 text-center text-sm text-cream-50/40">
              Aucun formulaire dans cette catégorie.
            </p>
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