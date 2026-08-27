"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileCheck2, Ship, FolderOpen, Building2 } from "lucide-react";

const NAV_ITEMS = [
  { href: "/espace", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/registration", label: "Mon inscription", icon: FileCheck2 },
  { href: "/espace/exports", label: "Mes exportations", icon: Ship },
  { href: "/espace/documents", label: "Mes documents", icon: FolderOpen },
  { href: "/espace/company", label: "Mon entreprise", icon: Building2 },
];

export default function ExporterSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-cream-50/10 bg-olive-950/60 backdrop-blur-md lg:flex lg:flex-col">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <Image
          src="/logo-ministere.png"
          alt="Ministère de l'Agriculture"
          width={90}
          height={55}
          className="h-10 w-auto object-contain"
        />
        <div className="leading-tight">
          <div className="font-serif text-[9px] sm:text-[10px] text-cream-50">
            République Tunisienne
          </div>
          <div className="text-[6px] sm:text-[6px] uppercase tracking-[0.12em] sm:tracking-[0.18em] text-cream-300/70 max-w-[140px] sm:max-w-none">
            <span className="sm:hidden">MARHP</span>
            <span className="hidden sm:inline">
              Ministère de l'Agriculture, des Ressources <br /> Hydrauliques et de la Pêche
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gold-300/15 text-gold-300"
                  : "text-cream-50/70 hover:bg-cream-50/5 hover:text-cream-50"
              }`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-cream-50/10 px-6 py-4">
        <p className="text-xs text-cream-50/40">Espace exportateur</p>
      </div>
    </aside>
  );
}