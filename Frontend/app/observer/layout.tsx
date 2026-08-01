
import { Leaf } from "lucide-react";
import Image from "next/image";
export default function ObserverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-cream-50/10 px-5 py-6 sm:flex">
            <div className="mb-10 flex items-center gap-2.5">
              <Image
                            src="/logo-ministere.png"
                            alt="Ministère de l'Agriculture"
                            width={90}
                            height={55}
                            className="h-10 w-auto object-contain"
                          />
              <span className="font-display text-lg tracking-wide">
                MARHP
              </span>
            </div>
        <p className="mt-1 text-xs text-cream-50/40">Accès en lecture seule</p>
      </aside>
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}