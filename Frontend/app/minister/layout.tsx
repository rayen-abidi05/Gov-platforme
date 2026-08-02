import { Leaf } from "lucide-react";
import Image from "next/image";
import NotificationBell from "@/components/NotificationBell";
import MinisterLogoutButton from "@/components/minister/MinisterLogoutButton";

export default function MinisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <header className="flex items-center justify-between border-b border-cream-50/10 bg-olive-950/60 px-6 py-3.5 backdrop-blur-md sm:px-10">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo-ministere.png"
            alt="Ministère de l'Agriculture"
            width={90}
            height={55}
            className="h-9 w-auto object-contain"
          />
          <div className="leading-tight">
            <span className="font-display text-base tracking-wide text-cream-50">MARHP</span>
            <p className="text-[10px] uppercase tracking-[0.15em] text-cream-50/40">
              Espace Ministre
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <MinisterLogoutButton />
        </div>
      </header>

      {children}
    </div>
  );
}