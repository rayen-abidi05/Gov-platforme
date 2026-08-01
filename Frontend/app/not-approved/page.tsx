import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowLeft, ShieldCheck } from "lucide-react";
import { OliveAuroraBackground } from "@/components/olive-ui/olive-aurora-background";

export const metadata: Metadata = {
  title: "Compte en attente d'approbation — Plateforme d'Export de l'Huile d'Olive",
};

export default function NotApprovedPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center px-6 py-12 font-body text-cream-50">
      <OliveAuroraBackground />

      <div className="relative z-10 w-full max-w-md rounded-xl2 border border-cream-50/15 bg-olive-950/40 p-8 text-center shadow-glass backdrop-blur-xl sm:p-10">
        <div className="mx-auto flex items-center justify-center gap-2.5">
          <Image
            src="/logo-ministere.png"
            alt="Ministère de l'Agriculture"
            width={90}
            height={55}
            className="h-10 w-auto object-contain"
          />
        </div>

        <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-gold-300/10 text-gold-300">
          <Clock className="h-7 w-7" />
        </div>

        <h1 className="mt-6 font-display text-2xl text-cream-50">
          Compte en attente d'approbation
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-cream-50/70">
          Vous n'êtes pas encore approuvé(e) par l'administrateur.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-cream-50/50">
          Votre dossier est en cours d'examen par le Ministère. Vous recevrez une
          notification dès que votre accès sera activé.
        </p>

        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-cream-50/20 px-4 py-2.5 text-sm font-medium text-cream-50/80 transition-all duration-200 hover:border-gold-300/40 hover:text-gold-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <Link
            href="/registration"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gold-300 px-4 py-2.5 text-sm font-medium text-olive-950 transition-all duration-200 hover:bg-gold-300/90"
          >
            Suivre ma demande
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-cream-50/50">
          <ShieldCheck className="h-3.5 w-3.5 text-gold-300" />
          <span>Accès chiffré et conforme aux normes du Ministère</span>
        </div>
      </div>
    </main>
  );
}
