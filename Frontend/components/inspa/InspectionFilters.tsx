"use client";

import { Search } from "lucide-react";
import { InspectionStatus } from "@/types/inspection";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  status: InspectionStatus | "ALL";
  onStatusChange: (v: InspectionStatus | "ALL") => void;
  statusOptions?: InspectionStatus[];
}

const STATUS_LABELS: Record<InspectionStatus, string> = {
  PENDING_ASSIGNMENT: "En attente d'assignation",
  ASSIGNED: "Assignée",
  UNDER_REVIEW: "En examen",
  APPROVED: "Approuvée",
  REJECTED: "Rejetée",
};

export default function InspectionFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  statusOptions = ["ASSIGNED", "UNDER_REVIEW", "APPROVED", "REJECTED"],
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-50/40" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un exportateur..."
          className="w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] py-2.5 pl-10 pr-3 text-sm text-cream-50 placeholder:text-cream-50/40 outline-none transition-all duration-200 focus:border-gold-300/40"
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as InspectionStatus | "ALL")}
        className="rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-3 py-2.5 text-sm text-cream-50 outline-none transition-all duration-200 focus:border-gold-300/40"
      >
        <option value="ALL" className="bg-olive-950">Tous les statuts</option>
        {statusOptions.map((s) => (
          <option key={s} value={s} className="bg-olive-950">
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}
