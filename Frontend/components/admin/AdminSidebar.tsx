"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileCheck2, Users, Settings, Leaf } from "lucide-react";
import {LogOut } from "lucide-react";
import { privateApi } from "@/lib/api/privateApi";

import { useMutation } from "@tanstack/react-query";
const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/requests", label: "Demandes d'inscription", icon: FileCheck2 },
  { href: "/dashboard/exporters", label: "Exportateurs", icon: Users },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

export default function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname();
const LogoutMutation = useMutation({
    mutationFn: async () => {
      const res = await privateApi.post("/api/auth/logout")
      return res.data
    },
    onSuccess: () => router.push("/login"),
    onError: () => console.log("nonnn"),
  })
  return (
    <aside className="hidden w-64 shrink-0 border-r border-cream-50/10 bg-olive-950/60 backdrop-blur-md lg:flex lg:flex-col">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <Leaf className="h-6 w-6 text-gold-300" />
        <span className="font-display text-base tracking-wide text-cream-50">
          MARHP
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 flex flex-col justify-between pb-5">
        <div>
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
        </div>
        <div>
          <button
            onClick={() => {
              
              LogoutMutation.mutate()
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-cream-50/80 hover:text-red-300 hover:bg-cream-50/5 transition-all duration-200 rounded-2xl"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      </nav>

      <div className="border-t border-cream-50/10 px-6 py-4">
        <p className="text-xs text-cream-50/40">Accès administrateur</p>
      </div>
    </aside>
  );
}