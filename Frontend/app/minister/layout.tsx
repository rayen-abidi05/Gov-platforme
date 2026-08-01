
import { Leaf } from "lucide-react";
import Image from "next/image";
export default function MinisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <div className="flex items-center gap-2 border-b border-cream-50/10 px-6 py-3 sm:px-10">
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
      </div>
      {children}
    </div>
  );
}