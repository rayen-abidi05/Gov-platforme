"use client";

import NotificationBell from "@/components/NotificationBell";
import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
export default function InspaHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const LogoutMutation = useLogout();
  return (
    <header className="flex items-center justify-between border-b border-cream-50/10 px-6 py-4 sm:px-10">
      <div>
        <h1 className="font-display text-xl sm:text-2xl text-cream-50">{title}</h1>
        {subtitle && <p className="text-xs text-cream-50/50">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
       <button
          onClick={() => LogoutMutation.mutate()}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/15 bg-cream-50/[0.03] text-cream-50/70 transition-all duration-200 hover:border-red-400/30 hover:text-red-300"
          title="Se déconnecter"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
      
    </header>
  );
}