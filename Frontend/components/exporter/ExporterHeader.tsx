"use client";

import NotificationBell from "@/components/NotificationBell";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ExporterHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-cream-50/10 px-6 py-4 sm:px-10">
      <div>
        <h1 className="font-display text-xl sm:text-2xl text-cream-50">{title}</h1>
        {subtitle && <p className="text-xs text-cream-50/50">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
         <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-cream-50/15 px-3.5 py-2 text-sm text-cream-50/80 transition-all duration-200 hover:border-gold-300/30 hover:text-gold-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Accueil
            </Link>
         <NotificationBell />
      </div>
      
    </header>
  );
}