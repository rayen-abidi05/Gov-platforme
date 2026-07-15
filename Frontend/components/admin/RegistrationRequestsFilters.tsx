"use client";

import { Search } from "lucide-react";
import { RequestStatus } from "@/types/registration";

export type SearchField = "commName" | "ownerName" | "rne" | "matFisc";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  searchFields: SearchField[];
  onSearchFieldsChange: (fields: SearchField[]) => void;
  status: RequestStatus | "ALL";
  onStatusChange: (v: RequestStatus | "ALL") => void;
  month: string;
  onMonthChange: (v: string) => void;
  year: string;
  onYearChange: (v: string) => void;
}

const STATUS_OPTIONS: { value: RequestStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tous les statuts" },
  { value: "PENDING", label: "En attente" },
  { value: "UNDER_REVIEW", label: "En examen" },
  { value: "APPROVED", label: "Approuvée" },
  { value: "REJECTED", label: "Rejetée" },
];

const SEARCH_FIELD_OPTIONS: { value: SearchField; label: string }[] = [
  { value: "commName", label: "Nom entreprise" },
  { value: "ownerName", label: "Propriétaire" },
  { value: "rne", label: "RNE" },
  { value: "matFisc", label: "Matricule fiscal" },
];

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export default function RegistrationRequestsFilters({
  search,
  onSearchChange,
  searchFields,
  onSearchFieldsChange,
  status,
  onStatusChange,
  month,
  onMonthChange,
  year,
  onYearChange,
}: Props) {
  const toggleField = (field: SearchField) => {
    if (searchFields.includes(field)) {
     
      if (searchFields.length === 1) return;
      onSearchFieldsChange(searchFields.filter((f) => f !== field));
    } else {
      onSearchFieldsChange([...searchFields, field]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-50/40" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher..."
            className="w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] py-2.5 pl-10 pr-3 text-sm text-cream-50 placeholder:text-cream-50/40 outline-none transition-all duration-200 focus:border-gold-300/40"
          />
        </div>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as RequestStatus | "ALL")}
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
            <option key={m} value={String(i + 1)} className="bg-olive-950">
              {m}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className="rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-3 py-2.5 text-sm text-cream-50 outline-none transition-all duration-200 focus:border-gold-300/40"
        >
          <option value="ALL" className="bg-olive-950">Toutes les années</option>
          {["2024", "2025", "2026"].map((y) => (
            <option key={y} value={y} className="bg-olive-950">
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="text-xs text-cream-50/50">Rechercher dans :</span>
        {SEARCH_FIELD_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-1.5 text-xs text-cream-50/70"
          >
            <input
              type="checkbox"
              checked={searchFields.includes(opt.value)}
              onChange={() => toggleField(opt.value)}
              className="h-3.5 w-3.5 rounded border-cream-50/30 bg-cream-50/[0.03] accent-gold-300"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}