import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  ShieldCheck,
  Smartphone,
  BarChart3,
  FileCheck2,
  Bell,
  UserPlus,
  FolderCheck,
  Sprout,
} from "lucide-react";

import { OliveAuroraBackground } from "@/components/olive-ui/olive-aurora-background";
import { OliveBranchMotif } from "@/components/olive-ui/olive-branch-motif";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "À propos | Plateforme d'Export de l'Huile d'Olive - Tunisie",
  description:
    "Découvrez la plateforme nationale de gestion des demandes d'export d'huile d'olive du MARHP, et les chiffres clés de la campagne oléicole tunisienne 2025/2026.",
};

const campaignStats = [
  {
    value: "4 058,5",
    unit: "MDT",
    label: "de recettes à l'export",
    detail: "contre 2 801,2 MDT un an plus tôt (+44,9 %)",
  },
  {
    value: "87,1",
    unit: "%",
    label: "des volumes exportés en vrac",
    detail: "seuls 12,9 % sont conditionnés",
  },
  {
    value: "83,3",
    unit: "%",
    label: "d'huile extra vierge",
    detail: "part du volume total exporté",
  },
  {
    value: "44,5k",
    unit: "tonnes",
    label: "d'huile d'olive biologique",
    detail: "≈ 583,4 MDT de recettes",
  },
];

const processSteps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Créer un compte entreprise",
    description:
      "L'exportateur crée un compte à l'aide de son numéro RNE et des informations requises sur son entreprise.",
  },
  {
    number: "02",
    icon: FileCheck2,
    title: "Soumettre le dossier",
    description:
      "Les pièces justificatives sont déposées en ligne pour l'inscription sur la liste des entreprises exportatrices.",
  },
  {
    number: "03",
    icon: Bell,
    title: "Suivre et être notifié",
    description:
      "L'état d'avancement du dossier est suivi en temps réel, avec des notifications SMS sur chaque décision.",
  },
  {
    number: "04",
    icon: FolderCheck,
    title: "Déposer les demandes d'export",
    description:
      "Une fois inscrite, l'entreprise dépose ses demandes d'exportation et suit chaque dossier jusqu'à son traitement.",
  },
];

const platformFeatures = [
  {
    icon: Smartphone,
    title: "Design moderne et responsive",
    description:
      "Une interface intuitive, accessible depuis ordinateur, tablette ou mobile, portée par une charte graphique dédiée au secteur.",
  },
  {
    icon: ShieldCheck,
    title: "Comptes sécurisés",
    description:
      "Espaces personnels chiffrés pour les exportateurs, avec dépôt et gestion des documents administratifs numérisés.",
  },
  {
    icon: LayoutDashboard,
    title: "Espace administrateur",
    description:
      "Un espace dédié au MARHP pour consulter les dossiers, gérer l'archivage par entreprise et suivre chaque étape.",
  },
  {
    icon: BarChart3,
    title: "Tableaux de bord & analyse",
    description:
      "Des indicateurs de suivi en temps réel pour mesurer la portée des actions du Ministère et guider la décision.",
  },
];

const destinationMarkets = [
  { label: "Union européenne", value: 57.8 },
  { label: "Amérique du Nord", value: 22.8 },
  { label: "Asie", value: 11.5 },
  { label: "Afrique", value: 4.2 },
];

const topCountries = [
  { label: "Espagne", value: "33,6 %" },
  { label: "Italie", value: "19,5 %" },
  { label: "États-Unis", value: "18,3 %" },
];

export default function About() {
  return (
    <main className="relative min-h-screen w-full font-body text-cream-50">
      <OliveAuroraBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        {/* Hero */}
        <section className="px-8 pt-28 sm:px-12 sm:pt-32 lg:px-16 lg:pt-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-2.5">
              <Image
              src="/logo-ministere.png"
              alt="Ministère de l'Agriculture"
              width={90}
              height={55}
              className="h-10 w-auto object-contain"
            />
              <span className="font-display text-lg tracking-wide">MARHP</span>
            </div>

            <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <OliveBranchMotif className="mb-6 h-9 w-40 text-gold-300" />
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-300">
                  À propos de la plateforme
                </p>
                <h1 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  L&apos;huile d&apos;olive tunisienne,
                  <br />
                  <span className="text-gold-300">connectée au monde</span>
                </h1>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-cream-50/75">
                  Développée par le Ministère de l&apos;Agriculture, des Ressources
                  Hydrauliques et de la Pêche (MARHP), cette plateforme
                  numérique modernise et digitalise le processus d&apos;autorisation
                  à l&apos;export de l&apos;huile d&apos;olive — de la création du compte
                  entreprise jusqu&apos;au suivi des demandes en temps réel.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/registration">
                    <Button variant="primary" className="w-auto px-6">
                      Demande d&apos;enregistrement
                    </Button>
                  </Link>
                  <Link href="/chaier-de-charge">
                    <Button variant="outline" className="w-auto px-6">
                      Cahier des charges
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Signature illustration: campaign N vs N-1 comparison */}
              <div className="relative rounded-xl2 border border-cream-50/15 bg-olive-950/40 p-6 shadow-glass backdrop-blur-xl sm:p-8">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-cream-50/50">
                  Campagne 2025/2026 vs 2024/2025
                </p>
                <p className="mt-1 font-display text-lg text-cream-50">
                  Sept premiers mois (nov. – mai)
                </p>

                <div className="mt-8 flex items-end justify-around gap-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-44 items-end gap-2">
                      <div
                        className="w-7 rounded-t-md bg-cream-50/20"
                        style={{ height: "63%" }}
                        aria-hidden
                      />
                      <div
                        className="w-7 rounded-t-md bg-gold-300"
                        style={{ height: "100%" }}
                        aria-hidden
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-display text-2xl text-cream-50">
                        327,4k
                      </p>
                      <p className="text-xs text-cream-50/60">
                        tonnes (vs 207,3k)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-44 items-end gap-2">
                      <div
                        className="w-7 rounded-t-md bg-cream-50/20"
                        style={{ height: "69%" }}
                        aria-hidden
                      />
                      <div
                        className="w-7 rounded-t-md bg-olive-400"
                        style={{ height: "100%" }}
                        aria-hidden
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-display text-2xl text-cream-50">
                        4 058,5
                      </p>
                      <p className="text-xs text-cream-50/60">MDT (vs 2 801,2)</p>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -right-4 -top-4 rounded-xl border border-gold-300/30 bg-olive-950 px-4 py-2.5 shadow-glass sm:-right-6 sm:-top-6">
                  <p className="font-display text-xl text-gold-300">
                    +57,9&nbsp;%
                  </p>
                  <p className="text-[11px] text-cream-50/60">
                    de croissance des volumes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="px-8 pt-20 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-px overflow-hidden rounded-xl2 border border-cream-50/15 bg-cream-50/10 sm:grid-cols-2 lg:grid-cols-4">
              {campaignStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-olive-950/50 p-6 backdrop-blur-xl sm:p-8"
                >
                  <p className="font-display text-3xl text-gold-300">
                    {stat.value}
                    <span className="ml-1 text-lg text-cream-50/60">
                      {stat.unit}
                    </span>
                  </p>
                  <p className="mt-2 text-sm font-medium text-cream-50/90">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-cream-50/55">
                    {stat.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="px-8 pt-24 sm:px-12 lg:px-16">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-300">
                Notre mission
              </p>
              <h2 className="font-display text-3xl leading-tight sm:text-4xl">
                Moderniser l&apos;accès à l&apos;export, pour un secteur qui en a besoin
              </h2>
              <p className="mt-5 text-base leading-relaxed text-cream-50/75">
                L&apos;huile conditionnée ne représente que 12,9 % des volumes
                exportés, le reste partant en vrac. La Tunisie vend donc
                surtout une matière première peu valorisée plutôt qu&apos;un
                produit fini à marque tunisienne. Le Ministère répond à ce défi
                à la fois par des programmes de promotion — les exportations
                conditionnées ont progressé de 69 % en valeur à fin mars 2026
                — et par la digitalisation du parcours administratif des
                exportateurs, pour leur faire gagner en temps et en
                transparence.
              </p>
              <p className="mt-4 text-base leading-relaxed text-cream-50/75">
                Cette plateforme s&apos;inscrit dans la politique du gouvernement
                tunisien en matière de digitalisation des services, au profit
                des agriculteurs, des entrepreneurs et des opérateurs
                économiques du secteur oléicole.
              </p>
            </div>

            <div className="rounded-xl2 border border-cream-50/15 bg-olive-950/40 p-8 shadow-glass backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Sprout className="h-5 w-5 text-gold-300" />
                <p className="font-display text-lg text-cream-50">
                  Nouveaux marchés ciblés
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream-50/70">
                Au-delà des marchés historiques, des programmes promotionnels
                visent à diversifier les débouchés du conditionné :
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Canada", "États-Unis", "Golfe", "Chine", "Russie", "Brésil"].map(
                  (market) => (
                    <span
                      key={market}
                      className="rounded-lg bg-cream-50/10 px-3 py-1.5 text-sm text-cream-50/85"
                    >
                      {market}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="px-8 pt-24 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-300">
              Parcours de l&apos;exportateur
            </p>
            <h2 className="max-w-xl font-display text-3xl leading-tight sm:text-4xl">
              De l&apos;inscription au dépôt de la demande d&apos;export
            </h2>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step) => (
                <div key={step.number} className="relative">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-4xl text-cream-50/15">
                      {step.number}
                    </span>
                    <step.icon className="h-5 w-5 text-gold-300" />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-cream-50">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-50/65">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section className="px-8 pt-24 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-300">
              La plateforme
            </p>
            <h2 className="max-w-xl font-display text-3xl leading-tight sm:text-4xl">
              Une plateforme pensée pour le secteur oléicole
            </h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {platformFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl2 border border-cream-50/15 bg-olive-950/40 p-6 shadow-glass backdrop-blur-xl"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-300/15">
                    <feature.icon className="h-5 w-5 text-gold-300" />
                  </div>
                  <h3 className="mt-4 font-display text-base text-cream-50">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-50/65">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Market data */}
        <section className="px-8 pt-24 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-300">
              Le secteur en chiffres
            </p>
            <h2 className="max-w-xl font-display text-3xl leading-tight sm:text-4xl">
              Où va l&apos;huile d&apos;olive tunisienne ?
            </h2>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Destination bar chart */}
              <div className="rounded-xl2 border border-cream-50/15 bg-olive-950/40 p-8 shadow-glass backdrop-blur-xl">
                <p className="text-sm font-medium text-cream-50/90">
                  Répartition du volume exporté par région
                </p>
                <div className="mt-6 flex flex-col gap-5">
                  {destinationMarkets.map((market) => (
                    <div key={market.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cream-50/80">{market.label}</span>
                        <span className="font-medium text-gold-300">
                          {market.value}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream-50/10">
                        <div
                          className="h-full rounded-full bg-gold-300"
                          style={{ width: `${market.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-xl2 border border-cream-50/15 bg-olive-950/40 p-6 shadow-glass backdrop-blur-xl">
                  <p className="text-sm font-medium text-cream-50/90">
                    Premiers pays importateurs
                  </p>
                  <div className="mt-4 flex flex-col gap-3">
                    {topCountries.map((country) => (
                      <div
                        key={country.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-cream-50/80">{country.label}</span>
                        <span className="font-display text-base text-gold-300">
                          {country.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl2 border border-gold-300/20 bg-gold-300/5 p-6 shadow-glass backdrop-blur-xl">
                  <p className="text-sm font-medium text-cream-50/90">
                    Segment biologique
                  </p>
                  <p className="mt-2 font-display text-2xl text-gold-300">
                    13,10 DT/kg
                  </p>
                  <p className="mt-1 text-xs text-cream-50/60">
                    prix moyen du bio, mieux valorisé que le conventionnel
                    (12,96 DT/kg)
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-cream-50/55">
                    Italie (38 %), Espagne (26 %), États-Unis (24 %) et France
                    (8 %) en sont les principaux clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-8 pb-24 pt-24 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-xl2 border border-cream-50/15 bg-olive-950 px-8 py-14 text-center shadow-glass sm:px-16">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgb(199 154 46 / 0.18), transparent 60%)",
                }}
              />
              <div className="relative">
                <OliveBranchMotif className="mx-auto mb-6 h-8 w-36 text-gold-300" />
                <h2 className="font-display text-3xl leading-tight sm:text-4xl">
                  Prêt à exporter votre huile d&apos;olive ?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-cream-50/75">
                  Créez votre compte entreprise et suivez votre dossier
                  d&apos;autorisation d&apos;export en temps réel.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/register">
                    <Button variant="primary" className="w-auto px-8">
                      S&apos;inscrire
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="w-auto px-8">
                      Nous contacter
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
