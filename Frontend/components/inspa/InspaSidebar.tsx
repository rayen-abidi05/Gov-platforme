"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardCheck, CheckCircle2, History, Leaf } from "lucide-react";
import Image from "next/image"; 
const NAV_ITEMS = [
  { href: "/inspa/dashboard", label: "Assignées", icon: ClipboardCheck },
  { href: "/inspa/dashboard/completed", label: "Terminées", icon: CheckCircle2 },
  { href: "/inspa/dashboard/history", label: "Historique", icon: History },
];

export default function InspaSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-cream-50/10 bg-olive-950/60 backdrop-blur-md lg:flex lg:flex-col">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex items-center gap-2.5">
                    <Image  
                      src="/logo-ministere.png"
                      alt="Ministère de l'Agriculture"
                      width={90}
                      height={55}
                      className="h-10 w-auto object-contain"
                    />
          </div>
        
                                    
              <div className="font-serif text-[15px] text-cream-50">
                MARHP
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
    </aside>
  );
}