import type { Metadata } from "next";
import { ShieldCheck, Leaf } from "lucide-react";
import { OliveAuroraBackground } from "@/components/olive-ui/olive-aurora-background";
import { OliveBranchMotif } from "@/components/olive-ui/olive-branch-motif";
import { RegisterWizard } from "@/components/register/register-wizard";
import Link from "next/link";
import Image from "next/image";
export const metadata: Metadata = {
  title: "Inscription Exportateur — Plateforme d'Export de l'Huile d'Olive | Tunisie",
  description:
    "Créez votre compte exportateur pour accéder à la plateforme nationale d'export de l'huile d'olive.",
};

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen w-full font-body text-cream-50">
      <OliveAuroraBackground />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        
        <section className="flex flex-1 flex-col justify-between px-8 py-10 sm:px-12 lg:px-16 lg:py-16">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-ministere.png"
              alt="Ministère de l'Agriculture"
              width={90}
              height={55}
              className="h-10 w-auto object-contain"
            />
            <span className="font-display text-lg tracking-wide">
              Ministère de l&apos;Agriculture
            </span>
          </div>

          <div className="max-w-xl">
            <OliveBranchMotif className="mb-8 h-10 w-44 text-gold-300" />
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              Rejoignez
              <br />
              les exportateurs
              <br />
              <span className="text-gold-300">de confiance.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-cream-50/75">
              L&apos;inscription est réservée aux entreprises exportatrices
              d&apos;huile d&apos;olive. Votre dossier sera vérifié par le
              Ministère avant l&apos;activation de votre accès.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-cream-50/60">
            <ShieldCheck className="h-4 w-4 text-gold-300" />
            <span>Accès chiffré et conforme aux normes du Ministère</span>
          </div>
        </section>

       
        <section className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:max-w-2xl lg:px-16">
          <div className="w-full max-w-xl rounded-xl2 border border-cream-50/15 bg-olive-950/40 p-8 shadow-glass backdrop-blur-xl sm:p-10">
            <div className="mb-8">
              <h2 className="font-display text-2xl text-cream-50">
                Créer un compte exportateur
              </h2>
              <p className="mt-1.5 text-sm text-cream-50/65">
                Déjà inscrit ?{" "}
                <Link
                  href="/login"
                  className="font-medium text-gold-300 underline-offset-2 hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </div>
            <RegisterWizard />
          </div>
        </section>
      </div>
    </main>
  );
}