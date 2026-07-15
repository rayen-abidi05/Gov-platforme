import type { Metadata } from "next";
import { ShieldCheck, Leaf } from "lucide-react";
import { OliveAuroraBackground } from "@/components/olive-ui/olive-aurora-background";
import { OliveBranchMotif } from "@/components/olive-ui/olive-branch-motif";
import Navbar from "@/components/Navbar.tsx"
import Footer from "@/components/Footer";
import "./globals.css";
export const metadata: Metadata = {
  title: "Plateforme d'Export de l'Huile d'Olive | Tunisie",
  description:
    "Plateforme nationale d'export de l'huile d'olive tunisienne - Inscription, connexion et suivi des exportations.",
};

export default function Home() {
  return (
   <main className="relative min-h-screen w-full font-body text-cream-50">
      <OliveAuroraBackground />
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <Navbar />
        <section className="flex flex-1 flex-col justify-between pt-28 px-8 pb-10 sm:pt-32 sm:px-12 lg:pt-16 lg:px-16 lg:py-16">
          <div className="flex items-center gap-2.5">
            <Leaf className="h-6 w-6 text-gold-300" />
            <span className="font-display text-lg tracking-wide">
              MARHP
            </span>
          </div>

          <div className="max-w-xl">
            <OliveBranchMotif className="mb-8 h-10 w-44 text-gold-300" />
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              Plateforme Nationale
              <br />
              d'Exportation
              <br />
              <span className="text-gold-300">de l'Huile d'Olive</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-cream-50/75">
              La solution tunisienne pour faciliter l'exportation de l'huile d'olive
              vers les marchés internationaux avec traçabilité complète et
              certification conforme aux normes internationales.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-cream-50/60">
            <ShieldCheck className="h-4 w-4 text-gold-300" />
            <span>Accès chiffré et conforme aux normes du Ministère</span>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
