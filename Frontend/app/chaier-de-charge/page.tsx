import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OliveAuroraBackground } from "@/components/olive-ui/olive-aurora-background";

export default function Charge() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center px-6 py-12 font-body text-cream-50">
      <OliveAuroraBackground />

      <div className="relative z-10 w-full max-w-md rounded-xl2 border border-cream-50/15 bg-olive-950/40 p-8 text-center shadow-glass backdrop-blur-xl sm:p-10">
        <h1 className="font-display text-2xl text-cream-50">
          Cahier des charges
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-cream-50/70">
          Consultez le cahier des charges depuis la page À propos.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg border border-cream-50/20 px-4 py-2.5 text-sm font-medium text-cream-50/80 transition-all duration-200 hover:border-gold-300/40 hover:text-gold-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}