"use client";

import { Search } from "lucide-react";
import { ExportRequestStatus } from "@/types/exportRequest";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  status: ExportRequestStatus | "ALL";
  onStatusChange: (v: ExportRequestStatus | "ALL") => void;
  month: string;
  onMonthChange: (v: string) => void;
  year: string;
  onYearChange: (v: string) => void;
}

const STATUS_OPTIONS: { value: ExportRequestStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tous les statuts" },
  { value: "SENT", label: "Envoyée" },
  { value: "UNDER_COMMITTEE_REVIEW", label: "Examen par l'instance" },
  { value: "APPROVED", label: "Approuvée" },
  { value: "REJECTED", label: "Rejetée" },
];

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export default function ExportRequestsFilters({
  search, onSearchChange, status, onStatusChange, month, onMonthChange, year, onYearChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-50/40" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher par client ou référence AGRIM..."
          className="w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] py-2.5 pl-10 pr-3 text-sm text-cream-50 placeholder:text-cream-50/40 outline-none transition-all duration-200 focus:border-gold-300/40"
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as ExportRequestStatus | "ALL")}
        className="rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-3 py-2.5 text-sm text-cream-50 outline-none transition-all duration-200 focus:border-gold-300/40"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-olive-950 text-cream-50">
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        className="rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-3 py-2.5 text-sm text-cream-50 outline-none transition-all duration-200 focus:border-gold-300/40"
      >
        <option value="ALL" className="bg-olive-950">Tous les mois</option>
        {MONTHS.map((m, i) => (
          <option key={m} value={String(i + 1)} className="bg-olive-950">{m}</option>
        ))}
      </select>

      <select
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
        className="rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-3 py-2.5 text-sm text-cream-50 outline-none transition-all duration-200 focus:border-gold-300/40"
      >
        <option value="ALL" className="bg-olive-950">Toutes les années</option>
        {["2024", "2025", "2026"].map((y) => (
          <option key={y} value={y} className="bg-olive-950">{y}</option>
        ))}
      </select>
    </div>
  );
}