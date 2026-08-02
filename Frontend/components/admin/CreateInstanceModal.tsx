"use client";

import { useState } from "react";
import { X, Users, Upload, FileText } from "lucide-react";
import { useEligibleMembers } from "@/hooks/useEligibleMembers";
import { useCreateInstance } from "@/hooks/useCreateInstance";
import { ExportRequest } from "@/types/exportRequest";

interface Props {
  selectedRequests: ExportRequest[];
  onClose: () => void;
  onCreated: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  MINISTER: "Ministre",
  DIWAN_MEMBER: "Membre Diwan",
  OBSERVATOR: "Observateur",
  ADMIN: "Administrateur",
};

export default function CreateInstanceModal({ selectedRequests, onClose, onCreated }: Props) {
  const { data: members, isLoading: loadingMembers } = useEligibleMembers();
  const { mutateAsync, isPending, isError } = useCreateInstance();

  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [meetingDate, setMeetingDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [reportFile, setReportFile] = useState<File | null>(null);

  const toggleMember = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedMemberIds.length === 0) return;
    await mutateAsync({
      exportRequestIds: selectedRequests.map((r) => r.id),
      memberIds: selectedMemberIds,
      meetingDate,
      reportFile,
    });
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-cream-50/10 bg-olive-950 p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl text-cream-50">Créer une instance</h2>
            <p className="mt-1 text-sm text-cream-50/60">
              {selectedRequests.length} demande{selectedRequests.length > 1 ? "s" : ""} sélectionnée
              {selectedRequests.length > 1 ? "s" : ""} pour cette session
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-cream-50/50 transition-colors duration-150 hover:bg-cream-50/10 hover:text-cream-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        
        <div className="mt-5 space-y-1.5 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-3.5">
            {selectedRequests.map((r) => (
              <div key={r.id} className="flex items-center justify-between text-xs">
                <span className="text-cream-50/80">
                  {r.client}
                </span>

                <span className="text-cream-50/50">
                  AGRIM {r.agrimReference} · {r.requestedKg.toLocaleString("fr-FR")} kg
                </span>
              </div>
          ))}
        </div>


        <div className="mt-5">
          <label className="text-sm font-medium text-cream-50/90">Date de la réunion</label>
          <input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-4 py-2.5 text-sm text-cream-50 outline-none transition-all duration-200 focus:border-gold-300/40"
          />
        </div>

        {/* members */}
        <div className="mt-5">
          <label className="flex items-center gap-1.5 text-sm font-medium text-cream-50/90">
            <Users className="h-4 w-4 text-gold-300" />
            Membres de l'instance
          </label>
          {loadingMembers ? (
            <p className="mt-2 text-xs text-cream-50/40">Chargement...</p>
          ) : (
            <div className="mt-2 space-y-1.5">
              {members?.map((m) => (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-cream-50/10 px-3.5 py-2.5 transition-colors duration-150 hover:bg-cream-50/[0.03]"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={selectedMemberIds.includes(m.id)}
                      onChange={() => toggleMember(m.id)}
                      className="h-3.5 w-3.5 rounded border-cream-50/30 bg-cream-50/[0.03] accent-gold-300"
                    />
                    <span className="text-sm text-cream-50">{m.user.name}</span>
                  </div>
                  <span className="text-xs text-cream-50/50">{ROLE_LABELS[m.user.role]}</span>
                </label>
              ))}
            </div>
          )}
          {selectedMemberIds.length === 0 && (
            <p className="mt-1.5 text-xs text-red-400">Sélectionnez au moins un membre.</p>
          )}
        </div>

        {/* optional report file */}
        <div className="mt-5">
          <label className="text-sm font-medium text-cream-50/90">
            Fiche de données (optionnel)
          </label>
          <label className="mt-1.5 flex cursor-pointer items-center gap-3 rounded-lg border border-cream-50/15 p-3.5 hover:border-gold-300/30">
            <FileText className="h-4 w-4 shrink-0 text-cream-50/40" />
            <span className="flex-1 truncate text-sm text-cream-50/70">
              {reportFile ? reportFile.name : "Joindre un fichier Excel/PDF"}
            </span>
            <Upload className="h-4 w-4 shrink-0 text-cream-50/50" />
            <input
              type="file"
              className="hidden"
              accept=".xlsx,.xls,.pdf"
              onChange={(e) => setReportFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending || selectedMemberIds.length === 0}
          className="mt-7 w-full rounded-lg bg-gold-300 px-4 py-3 text-sm font-medium text-olive-950 transition-all duration-200 hover:bg-gold-300/90 disabled:opacity-50"
        >
          {isPending ? "Création en cours..." : "Créer l'instance"}
        </button>
      </div>
    </div>
  );
}