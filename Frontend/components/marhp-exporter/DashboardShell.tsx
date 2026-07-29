"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Leaf,
  LayoutDashboard,
  FileCheck2,
  Ship,
  FolderOpen,
  Building2,
  Menu,
  X,
} from "lucide-react";
import type { NotificationItem } from "./types";

interface NavItem {
  href: string;
  labelFr: string;
  labelAr: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV: NavItem[] = [
  { href: "/espace/vue-densemble", labelFr: "Vue d'ensemble", labelAr: "نظرة عامة", icon: LayoutDashboard },
  { href: "/espace/inscription", labelFr: "Mon inscription", labelAr: "تسجيلي", icon: FileCheck2 },
  { href: "/espace/exportations", labelFr: "Mes exportations", labelAr: "صادراتي", icon: Ship },
  { href: "/espace/documents", labelFr: "Mes documents", labelAr: "وثائقي", icon: FolderOpen },
  { href: "/espace/entreprise", labelFr: "Mon entreprise", labelAr: "مؤسستي", icon: Building2 },
];

interface DashboardShellProps {
  children: ReactNode;
  notifications?: NotificationItem[];
  companyName?: string;
}

export function DashboardShell({
  children,
  notifications = [],
  companyName = "Sté Oléa Carthage",
}: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-olive-950 text-cream-50 font-body">
      
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-cream-50/10 bg-olive-950/80 backdrop-blur-md transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-cream-50/10 px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-300/15 text-gold-300">
            <Leaf className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg text-cream-50">MARHP</div>
            <div className="text-[10px] uppercase tracking-widest text-cream-50/50">
              Exportateurs
            </div>
          </div>
        </div>

        <nav className="p-3">
          {NAV.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-gold-300/10 text-gold-300"
                    : "text-cream-50/70 hover:bg-cream-50/5 hover:text-cream-50"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <div className="flex-1">
                  <div>{item.labelFr}</div>
                  <div className="text-[10px] opacity-60">{item.labelAr}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-3 right-3 rounded-xl border border-cream-50/10 bg-olive-950/60 p-3">
          <div className="text-[10px] uppercase tracking-widest text-cream-50/40">
            Connecté
          </div>
          <div className="mt-1 truncate font-display text-sm text-cream-50">
            {companyName}
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-cream-50/10 bg-olive-950/80 px-4 backdrop-blur-md sm:px-8">
          <button
            className="rounded-lg p-2 text-cream-50/70 hover:bg-cream-50/5 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden text-xs text-cream-50/50 sm:block">
            République Tunisienne · Ministère de l'Agriculture, des Ressources
            Hydrauliques et de la Pêche
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              className="relative rounded-lg p-2 text-cream-50/70 hover:bg-cream-50/5"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-300 px-1 text-[10px] font-semibold text-olive-950">
                  {unread}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-8">{children}</main>
      </div>

      {/* Mobile scrim */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-olive-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
