
import { Leaf } from "lucide-react";

export default function MinisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <div className="flex items-center gap-2 border-b border-cream-50/10 px-6 py-3 sm:px-10">
        <Leaf className="h-4.5 w-4.5 text-gold-300" />
        <span className="font-display text-sm">Ministère de l&apos;Agriculture</span>
      </div>
      {children}
    </div>
  );
}