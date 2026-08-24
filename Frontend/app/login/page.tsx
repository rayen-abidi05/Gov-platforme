
import type { Metadata } from "next";
import { ShieldCheck, Leaf } from "lucide-react";
import { OliveAuroraBackground } from "@/components/olive-ui/olive-aurora-background";
import { OliveBranchMotif } from "@/components/olive-ui/olive-branch-motif";
  import { LoginForm } from "@/components/olive-ui/login-form";
import Image from "next/image";
export const metadata: Metadata = {
  title: "Connexion — Plateforme d'Export de l'Huile d'Olive | Tunisie",
  description:
    "Accès sécurisé pour les exportateurs et les administrateurs du Ministère à la plateforme nationale d'export de l'huile d'olive.",
};

export default function LoginPage() {

  
  return (
    <main className="relative min-h-screen w-full font-body text-cream-50">
      <OliveAuroraBackground />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row pr-10">
        
        <section className="flex flex-1 flex-col justify-between px-8 py-10 sm:px-12 lg:px-16 lg:py-16">
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

          <div className="max-w-xl">
            <OliveBranchMotif className="mb-8 h-10 w-44 text-gold-300" />
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              L&apos;Or Vert
              <br />
              de la Tunisie,
              <br />
              <span className="text-gold-300">vers le Monde.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-cream-50/75">
              La plateforme nationale qui relie exportateurs et administration
              autour d&apos;une même filière — traçabilité, certification et
              accès aux marchés internationaux, en un seul endroit.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-cream-50/60">
            <ShieldCheck className="h-4 w-4 text-gold-300" />
            <span>Accès chiffré et conforme aux normes du Ministère</span>
          </div>
        </section>

        
        <section className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:max-w-xl lg:px-16">
          <div className="w-full max-w-md rounded-xl2 border border-cream-50/15 bg-olive-950/40 p-8 shadow-glass backdrop-blur-xl sm:p-10">
            <div className="mb-8">
              <h2 className="font-display text-2xl text-cream-50">
                Bon retour
              </h2>
              <p className="mt-1.5 text-sm text-cream-50/65">
                Connectez-vous à votre espace exportateur ou administrateur.
              </p>
            </div>
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}