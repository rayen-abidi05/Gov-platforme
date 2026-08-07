"use client";

import { Search } from "lucide-react";
import { ExportRequestStatus } from "@/types/exportRequest";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  status: ExportRequestStatus | "ALL";
  onStatusChange: (v: ExportRequestStatus | "ALL") => void;
  company: string;
  onCompanyChange: (v: string) => void;
  companies: string[];
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
}

const STATUS_OPTIONS: { value: ExportRequestStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tous les statuts" },
  { value: "SENT", label: "Envoyée" },
  { value: "UNDER_COMMITTEE_REVIEW", label: "Examen par l'instance" },
  { value: "APPROVED", label: "Approuvée" },
  { value: "REJECTED", label: "Rejetée" },
];

const inputClass =
  "rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-3 py-2.5 text-sm text-cream-50 outline-none transition-all duration-200 focus:border-gold-300/40";

export default function ObserverExportRequestsFilters({
  search, onSearchChange,
  status, onStatusChange,
  company, onCompanyChange, companies,
  dateFrom, onDateFromChange,
  dateTo, onDateToChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-50/40" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher par référence, client ou exportateur..."
          className={`w-full py-2.5 pl-10 pr-3 ${inputClass}`}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ExportRequestStatus | "ALL")}
          className={inputClass}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-olive-950 text-cream-50">
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
          className={`${inputClass} max-w-[220px]`}
        >
          <option value="ALL" className="bg-olive-950">Toutes les sociétés</option>
          {companies.map((c) => (
            <option key={c} value={c} className="bg-olive-950">{c}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <label className="text-xs text-cream-50/50">Du</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className={inputClass}
          />
          <label className="text-xs text-cream-50/50">au</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
