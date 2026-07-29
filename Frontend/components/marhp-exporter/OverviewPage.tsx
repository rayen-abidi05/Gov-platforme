"use client";

import Link from "next/link";
import {
  BadgeCheck,
  ListChecks,
  Clock3,
  BellRing,
  ArrowRight,
} from "lucide-react";
import { StatusPill } from "./StatusPill";
import type {
  ExportRequestSummary,
  ExporterProfile,
  NotificationItem,
} from "./types";

interface OverviewPageProps {
  profile: ExporterProfile;
  requests: ExportRequestSummary[];
  notifications: NotificationItem[];
}

const CARD =
  "rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-8";

export function OverviewPage({
  profile,
  requests,
  notifications,
}: OverviewPageProps) {
  const pending = requests.filter(
    (r) => r.status === "envoyee" || r.status === "examen_instance"
  ).length;
  const unread = notifications.filter((n) => !n.read).length;
  const listeLabel =
    profile.liste === "liste_1"
      ? "Liste 1 · Résidents"
      : profile.liste === "liste_2"
      ? "Liste 2 · Non-résidents"
      : "—";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-cream-50">
          Vue d'ensemble
        </h1>
        <p className="mt-1 text-sm text-cream-50/60">
          Tableau de bord de vos activités d'exportation{" "}
          <span className="opacity-70">لوحة تحكم صادراتكم</span>
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BadgeCheck}
          label="Statut d'inscription"
          labelAr="حالة التسجيل"
          value={
            profile.registrationStatus === "approuvee"
              ? "Approuvée"
              : profile.registrationStatus === "en_cours_examen"
              ? "En examen"
              : profile.registrationStatus === "envoyee"
              ? "Envoyée"
              : "Rejetée"
          }
          tone={profile.registrationStatus === "approuvee" ? "gold" : "neutral"}
        />
        <StatCard
          icon={ListChecks}
          label="Inscription à la liste"
          labelAr="القائمة"
          value={listeLabel}
          tone="gold"
        />
        <StatCard
          icon={Clock3}
          label="Demandes en attente"
          labelAr="طلبات قيد المعالجة"
          value={pending.toString()}
        />
        <StatCard
          icon={BellRing}
          label="Notifications non lues"
          labelAr="إشعارات جديدة"
          value={unread.toString()}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Recent requests */}
        <div className={`${CARD} xl:col-span-2`}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-cream-50">
                Demandes récentes
              </h2>
              <p className="text-xs text-cream-50/50">آخر الطلبات</p>
            </div>
            <Link
              href="/espace/exportations"
              className="inline-flex items-center gap-1 text-xs text-gold-300 hover:underline"
            >
              Tout voir <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <ul className="divide-y divide-cream-50/5">
            {requests.slice(0, 4).map((r) => (
              <li key={r.id}>
                <Link
                  href={`/espace/exportations/${r.id}`}
                  className="group flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm text-cream-50 group-hover:text-gold-300">
                        {r.reference}
                      </span>
                      <TypeBadge type={r.type} />
                    </div>
                    <div className="mt-1 truncate text-xs text-cream-50/60">
                      {r.clientName}
                      {r.destinationCountry ? ` · ${r.destinationCountry}` : ""}
                      {" · "}
                      {r.quantityKg.toLocaleString("fr-FR")} kg
                    </div>
                    {r.agrim && (
                      <div className="mt-0.5 text-[11px] text-cream-50/40">
                        AGRIM {r.agrim.reference} · reste{" "}
                        {r.agrim.remainingKg.toLocaleString("fr-FR")} kg
                      </div>
                    )}
                  </div>
                  <StatusPill status={r.status} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Notifications */}
        <div className={CARD}>
          <div className="mb-6">
            <h2 className="font-display text-xl text-cream-50">Notifications</h2>
            <p className="text-xs text-cream-50/50">الإشعارات</p>
          </div>

          <ul className="space-y-4">
            {notifications.slice(0, 5).map((n) => (
              <li
                key={n.id}
                className="rounded-xl border border-cream-50/5 bg-olive-950/30 p-4"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      n.read ? "bg-cream-50/20" : "bg-gold-300"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="font-display text-sm text-cream-50">
                      {n.title}
                    </div>
                    {n.titleAr && (
                      <div className="text-[11px] text-cream-50/50">
                        {n.titleAr}
                      </div>
                    )}
                    <p className="mt-1 text-xs text-cream-50/70">{n.body}</p>
                    <div className="mt-2 text-[10px] uppercase tracking-widest text-cream-50/40">
                      {new Date(n.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  labelAr,
  value,
  tone = "neutral",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  labelAr: string;
  value: string;
  tone?: "gold" | "neutral";
}) {
  return (
    <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-6">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            tone === "gold"
              ? "bg-gold-300/15 text-gold-300"
              : "bg-cream-50/5 text-cream-50/70"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <div className="text-xs text-cream-50/60">{label}</div>
          <div className="text-[10px] text-cream-50/40">{labelAr}</div>
        </div>
      </div>
      <div
        className={`mt-4 font-display text-2xl ${
          tone === "gold" ? "text-gold-300" : "text-cream-50"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: ExportRequestSummary["type"] }) {
  const inside = type === "dakhil_hissa";
  return (
    <span
      className={`rounded-md border px-1.5 py-0.5 text-[10px] font-body ${
        inside
          ? "border-gold-300/30 bg-gold-300/10 text-gold-300"
          : "border-cream-50/15 bg-cream-50/5 text-cream-50/70"
      }`}
    >
      {inside ? "داخل الحصة" : "خارج الحصة"}
    </span>
  );
}
