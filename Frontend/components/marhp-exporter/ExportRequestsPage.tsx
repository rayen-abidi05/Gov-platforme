"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { StatusPill } from "./StatusPill";
import type {
  ExportRequestStatus,
  ExportRequestSummary,
  ExportRequestType,
} from "./types";

interface ExportRequestsPageProps {
  requests: ExportRequestSummary[];
}

type StatusFilter = "all" | ExportRequestStatus;
type TypeFilter = "all" | ExportRequestType;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tous statuts" },
  { value: "envoyee", label: "Envoyée" },
  { value: "examen_instance", label: "Examen par l'instance" },
  { value: "approuvee", label: "Approuvée" },
  { value: "rejetee", label: "Rejetée" },
];

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Tous types" },
  { value: "dakhil_hissa", label: "داخل الحصة" },
  { value: "kharij_hissa", label: "خارج الحصة" },
];

export function ExportRequestsPage({ requests }: ExportRequestsPageProps) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (type !== "all" && r.type !== type) return false;
      if (q) {
        const t = q.toLowerCase();
        if (
          !r.reference.toLowerCase().includes(t) &&
          !r.clientName.toLowerCase().includes(t) &&
          !(r.agrim?.reference.toLowerCase().includes(t) ?? false)
        )
          return false;
      }
      return true;
    });
  }, [requests, q, status, type]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-cream-50">
            Mes exportations
          </h1>
          <p className="mt-1 text-sm text-cream-50/60">
            Toutes vos demandes d'exportation{" "}
            <span className="opacity-70">جميع طلبات التصدير</span>
          </p>
        </div>
        <Link
          href="/espace/exportations/nouvelle"
          className="inline-flex items-center gap-2 rounded-xl bg-gold-300 px-4 py-2.5 text-sm font-medium text-olive-950 transition-colors hover:bg-gold-300/90"
        >
          <Plus className="h-4 w-4" /> Nouvelle demande
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-50/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Référence, client, AGRIM…"
              className="w-full rounded-xl border border-cream-50/10 bg-olive-950/60 py-2.5 pl-9 pr-3 text-sm text-cream-50 placeholder:text-cream-50/40 focus:border-gold-300/50 focus:outline-none"
            />
          </div>
          <Select value={type} onChange={setType} options={TYPE_OPTIONS} />
          <Select value={status} onChange={setStatus} options={STATUS_OPTIONS} />
        </div>
      </div>

      {/* Table (desktop) / cards (mobile) */}
      <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md">
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cream-50/10 text-xs uppercase tracking-widest text-cream-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">Référence</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">AGRIM / Quantité</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-50/5">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="group cursor-pointer transition-colors hover:bg-cream-50/[0.02]"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/espace/exportations/${r.id}`}
                      className="font-display text-cream-50 group-hover:text-gold-300"
                    >
                      {r.reference}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <TypeBadge type={r.type} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-cream-50">{r.clientName}</div>
                    {r.destinationCountry && (
                      <div className="text-xs text-cream-50/50">
                        {r.destinationCountry}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {r.agrim ? (
                      <>
                        <div className="text-cream-50/80">
                          {r.agrim.reference}
                        </div>
                        <div className="text-xs text-cream-50/50">
                          reste {r.agrim.remainingKg.toLocaleString("fr-FR")} kg
                          · demande {r.quantityKg.toLocaleString("fr-FR")} kg
                        </div>
                      </>
                    ) : (
                      <div className="text-cream-50/60">
                        {r.quantityKg.toLocaleString("fr-FR")} kg
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-cream-50/60">
                    {new Date(r.submittedAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <ul className="divide-y divide-cream-50/5 lg:hidden">
          {filtered.map((r) => (
            <li key={r.id}>
              <Link
                href={`/espace/exportations/${r.id}`}
                className="block space-y-2 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm text-cream-50">
                    {r.reference}
                  </span>
                  <StatusPill status={r.status} />
                </div>
                <div className="flex items-center gap-2">
                  <TypeBadge type={r.type} />
                  <span className="text-xs text-cream-50/60">
                    {new Date(r.submittedAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="text-sm text-cream-50/80">{r.clientName}</div>
                <div className="text-xs text-cream-50/50">
                  {r.agrim ? `${r.agrim.reference} · ` : ""}
                  {r.quantityKg.toLocaleString("fr-FR")} kg
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-cream-50/50">
            Aucune demande ne correspond aux filtres.
          </div>
        )}
      </div>
    </div>
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="rounded-xl border border-cream-50/10 bg-olive-950/60 px-3 py-2.5 text-sm text-cream-50 focus:border-gold-300/50 focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-olive-950">
          {o.label}
        </option>
      ))}
    </select>
  );
}

function TypeBadge({ type }: { type: ExportRequestType }) {
  const inside = type === "dakhil_hissa";
  return (
    <span
      className={`rounded-md border px-1.5 py-0.5 text-[10px] ${
        inside
          ? "border-gold-300/30 bg-gold-300/10 text-gold-300"
          : "border-cream-50/15 bg-cream-50/5 text-cream-50/70"
      }`}
    >
      {inside ? "داخل الحصة" : "خارج الحصة"}
    </span>
  );
}
