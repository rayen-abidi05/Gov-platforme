"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Hourglass,
  CheckCircle2,
  History,
  Bell,
  UserCircle,
} from "lucide-react";
import { LogOut } from "lucide-react";
import { privateApi } from "@/lib/api/privateApi";

import { useMutation } from "@tanstack/react-query";
import Image from "next/image";

const NAV_ITEMS = [
  { tab: "overview", href: "/inspa/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { tab: "assigned", href: "/inspa/dashboard?tab=assigned", label: "Inspections assignées", icon: ClipboardCheck },
  { tab: "pending", href: "/inspa/dashboard?tab=pending", label: "Inspections en attente", icon: Hourglass },
  { tab: "completed", href: "/inspa/dashboard?tab=completed", label: "Inspections terminées", icon: CheckCircle2 },
  { tab: "history", href: "/inspa/dashboard?tab=history", label: "Historique", icon: History },
  { tab: "notifications", href: "/inspa/dashboard?tab=notifications", label: "Notifications", icon: Bell },
  { tab: "profile", href: "/inspa/dashboard?tab=profile", label: "Profil", icon: UserCircle },
];

export default function InspaSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const LogoutMutation = useMutation({
    mutationFn: async () => {
      const res = await privateApi.post("/api/auth/logout");
      return res.data;
    },
    onSuccess: () => router.push("/login"),
    onError: () => console.log("nonnn"),
  });

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

        <span className="font-display text-base tracking-wide text-cream-50">
          MARHP
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 flex flex-col justify-between pb-5">
        <div>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.tab;
            const Icon = item.icon;
            return (
              <Link
                key={item.tab}
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
              LogoutMutation.mutate();
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-cream-50/80 hover:text-red-300 hover:bg-cream-50/5 transition-all duration-200 rounded-2xl"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      </nav>

      <div className="border-t border-cream-50/10 px-6 py-4">
        <p className="text-xs text-cream-50/40">Accès inspection (INSPA)</p>
      </div>
    </aside>
  );
}
