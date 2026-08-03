"use client";

import { useEffect, useRef, useState } from "react";
import {
  Leaf, ShieldCheck, Lock, Server, ArrowRight, Clock,
  MessageSquareWarning, EyeOff, Activity, FileText, BellRing,
  GitBranch, UserPlus, UploadCloud, BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

/* ---------------- Reveal on scroll ---------------- */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag ref={ref as never} className={`reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

/* ---------------- Count up ---------------- */
function CountUp({
  end,
  duration = 1800,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(end * eased);
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);
  const formatted =
    decimals > 0
      ? value.toFixed(decimals).replace(".", ",")
      : Math.round(value).toLocaleString("fr-FR");
  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* ---------------- Decorative olive branch ---------------- */
function OliveBranch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 340 C 130 260, 220 200, 340 90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {[
        [100, 300, -35], [140, 260, -25], [180, 220, -15], [220, 180, -5],
        [260, 140, 5], [300, 105, 15], [130, 285, 160], [170, 245, 170],
        [210, 205, 180], [250, 165, 190], [290, 128, 200],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <ellipse cx="0" cy="0" rx="22" ry="8" fill="currentColor" opacity="0.85" />
          <ellipse cx="0" cy="0" rx="22" ry="8" fill="url(#leafShine)" opacity="0.35" />
        </g>
      ))}
      <defs>
        <linearGradient id="leafShine" x1="0" y1="-8" x2="0" y2="8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ---------------- Aurora background ---------------- */
function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.45_0.09_130/0.55),transparent_65%)] blur-3xl animate-float-slow" />
      <div className="absolute right-[-15%] top-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.72_0.15_82/0.25),transparent_65%)] blur-3xl animate-float-slower" />
      <div className="absolute left-[20%] bottom-[-20%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.35_0.06_140/0.6),transparent_70%)] blur-3xl animate-float-slow" />
      <div className="absolute inset-0 bg-grain opacity-[0.35] mix-blend-overlay" />
    </div>
  );
}

/* ---------------- Sections ---------------- */
function Hero() {
  const { data: user } = useUser();
  const isLoggedInExporter = user?.role === "EXPORTER";

  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      <Aurora />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-gold-500/5 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 shadow-[0_0_10px] shadow-gold-400" />
              <span className="text-[11px] uppercase tracking-[0.22em] text-gold-300">
                Plateforme officielle du Ministère
              </span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-6 font-serif text-[42px] leading-[1.05] text-cream-50 md:text-[64px]">
              Plateforme Nationale
              <br />
              d'Exportation de <span className="text-gradient-gold">l'Huile d'Olive</span>
            </h1>
            <p className="mt-3 font-[Noto_Naskh_Arabic] text-lg text-cream-200/70" dir="rtl" lang="ar">
              المنصة الوطنية لتصدير زيت الزيتون
            </p>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-cream-100/75 md:text-base">
              Une plateforme moderne pour accélérer l'exportation de l'huile d'olive
              tunisienne vers les marchés internationaux. Suivi en temps réel,
              traçabilité complète et communication directe avec le Ministère —
              remplaçant les démarches papier par un système numérique transparent.
            </p>
          </Reveal>

          <Reveal delay={320}>
            {!isLoggedInExporter && (
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-medium text-olive-950 transition-all hover:scale-[1.03] hover:bg-gold-400 glow-gold"
                >
                  Devenir exportateur
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 px-6 py-3.5 text-sm font-medium text-cream-50 transition-all hover:border-gold-400 hover:text-gold-300"
                >
                  Se connecter
                </Link>
              </div>
            )}
          </Reveal>

          <Reveal delay={420}>
            <div className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-olive-700/60 bg-olive-900/40 px-4 py-2">
              <Lock className="h-3.5 w-3.5 text-gold-300" />
              <span className="text-xs text-cream-100/75">
                Accès chiffré et conforme aux normes du Ministère
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative hidden lg:block">
          <div className="relative aspect-square">
            <div className="absolute inset-8 rounded-full border border-gold-500/20" />
            <div className="absolute inset-16 rounded-full border border-gold-500/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-56 w-56 rounded-full bg-[radial-gradient(circle_at_30%_30%,oklch(0.72_0.15_82/0.5),transparent_70%)] blur-2xl" />
            </div>
            <OliveBranch className="absolute inset-0 h-full w-full text-gold-400/85 animate-float-slow" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { value: 145000, suffix: "+", label: "tonnes exportées en 2024" },
    { value: 1.46, decimals: 2, prefix: "", suffix: " Md $", label: "de valeur d'exportation" },
    { value: 100, suffix: " %", label: "de traçabilité garantie" },
    { value: 2340, suffix: "+", label: "exportateurs vérifiés" },
  ];
  return (
    <section className="relative border-y border-gold-500/10 bg-olive-900/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 py-14 md:px-8 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 100} className="text-center lg:text-left">
            <div className="font-serif text-4xl text-gradient-gold md:text-5xl">
              <CountUp end={it.value} decimals={it.decimals ?? 0} prefix={it.prefix ?? ""} suffix={it.suffix ?? ""} />
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.18em] text-cream-200/60">{it.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Problem() {
  const pains = [
    { icon: EyeOff, title: "Amélioration de la visibilité", desc: "Aucun suivi en temps réel du statut des demandes ni des étapes de validation." },
    { icon: MessageSquareWarning, title: "Communication fragmentée", desc: "Échanges dispersés entre exportateurs, administrations et organismes de contrôle." },
    { icon: Clock, title: "Traçabilité limitée", desc: "Documents papier, délais imprévisibles et transparence restreinte sur les décisions." },
  ];
  return (
    <section id="apropos" className="relative py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.22em] text-gold-300/80">Le problème</div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-cream-50 md:text-5xl">
              Un secteur stratégique,
              <br />
              un processus <span className="text-gradient-gold">dépassé</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream-100/70">
              L'huile d'olive tunisienne est un pilier de l'économie nationale, mais
              son processus d'exportation reste largement manuel — freinant la
              compétitivité et la transparence.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4">
          {pains.map((p, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="group flex gap-5 rounded-2xl border border-olive-700/60 bg-olive-900/40 p-6 transition-all hover:border-gold-500/40 hover:bg-olive-800/50">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-500/10 ring-hairline">
                  <p.icon className="h-5 w-5 text-gold-300" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-cream-50">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-cream-100/65">{p.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solution() {
  const features = [
    { icon: Activity, title: "Suivi en temps réel", desc: "Consultez à tout moment l'état de vos inscriptions et de vos demandes d'exportation." },
    { icon: FileText, title: "Documents centralisés", desc: "Gérez vos certificats, licences et attestations depuis un espace unique et sécurisé." },
    { icon: BellRing, title: "Communication directe", desc: "Recevez une notification instantanée dès qu'une décision est prise par DGEDA." },
    { icon: GitBranch, title: "Traçabilité complète", desc: "Historique d'audit complet, de l'enregistrement à l'exportation finale." },
  ];
  return (
    <section id="cahier" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.72_0.15_82/0.12),transparent_70%)] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.22em] text-gold-300/80">La solution</div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-cream-50 md:text-5xl">
              Un système numérique <span className="text-gradient-gold">traçable</span> et transparent
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 text-[15px] leading-relaxed text-cream-100/70">
              Tous les outils dont les exportateurs et les autorités ont besoin,
              réunis sur une seule plateforme officielle.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="group h-full rounded-2xl border border-olive-700/60 bg-gradient-to-b from-olive-900/60 to-olive-950/60 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-[0_20px_60px_-20px] hover:shadow-gold-500/20">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold-500/10 ring-hairline transition-colors group-hover:bg-gold-500/20">
                  <f.icon className="h-5 w-5 text-gold-300" />
                </div>
                <h3 className="mt-5 font-serif text-xl text-cream-50">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-100/65">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: UserPlus, title: "Créez votre compte", desc: "Renseignez les informations de votre entreprise exportatrice." },
    { icon: UploadCloud, title: "Soumettez vos documents", desc: "Téléversez les certificats et licences requis par le Ministère." },
    { icon: BadgeCheck, title: "Suivez votre statut", desc: "Obtenez la vérification officielle et commencez à exporter." },
  ];
  return (
    <section id="demande" className="relative py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.22em] text-gold-300/80">Comment ça marche</div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-cream-50 md:text-5xl">
              Trois étapes vers <span className="text-gradient-gold">l'exportation</span>
            </h2>
          </Reveal>
        </div>

        <div className="relative mt-20">
          <div
            className="pointer-events-none absolute left-1/2 top-8 hidden h-px w-[70%] -translate-x-1/2 lg:block"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.72 0.15 82 / 0.5), transparent)" }}
          />
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 150} className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold-500/30 bg-olive-950 shadow-[0_0_30px_-5px] shadow-gold-500/40">
                  <s.icon className="h-6 w-6 text-gold-300" />
                </div>
                <div className="mt-5 text-[11px] uppercase tracking-[0.22em] text-gold-300/80">
                  Étape {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-2 font-serif text-2xl text-cream-50">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-cream-100/65">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  const items = [
    { icon: Lock, title: "Chiffrement de bout en bout", desc: "Toutes les données sont protégées par un chiffrement de niveau étatique." },
    { icon: ShieldCheck, title: "Conformité aux normes", desc: "Respect des réglementations nationales et internationales en vigueur." },
    { icon: Server, title: "Hébergement sécurisé", desc: "Infrastructure souveraine hébergée sur le territoire tunisien." },
  ];
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="rounded-3xl border border-olive-700/60 bg-gradient-to-br from-olive-900/60 to-olive-950/80 p-10 md:p-14">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-gold-500/5 px-3.5 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-gold-300" />
                <span className="text-[11px] uppercase tracking-[0.22em] text-gold-300">Confiance</span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-5 font-serif text-3xl leading-tight text-cream-50 md:text-4xl">
                Une plateforme officielle du <span className="text-gradient-gold"> Ministère de l'Agriculture, des Ressources hydrauliques et de la Pêche</span>
              </h2>
            </Reveal>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {items.map((it, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="flex items-start gap-4 rounded-2xl border border-olive-700/50 bg-olive-950/50 p-6">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold-500/10 ring-hairline">
                    <it.icon className="h-4.5 w-4.5 text-gold-300" />
                  </div>
                  <div>
                    <div className="font-serif text-lg text-cream-50">{it.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-cream-100/65">{it.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { data: user } = useUser();
  const isLoggedInExporter = user?.role === "EXPORTER";

  return (
    <section className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.72_0.15_82/0.18),transparent_70%)] blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
        <OliveBranch className="mx-auto h-16 w-16 text-gold-400/60 -scale-x-100" />
        <Reveal>
          <h2 className="mt-6 font-serif text-4xl leading-tight text-cream-50 md:text-6xl">
            Prêt à exporter en <span className="text-gradient-gold">toute confiance</span> ?
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-cream-100/70">
            Rejoignez les exportateurs certifiés par le Ministère de l'Agriculture et
            simplifiez chaque étape de vos démarches d'exportation.
          </p>
        </Reveal>
        {!isLoggedInExporter && (
          <Reveal delay={220}>
            <Link
              href="/register"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-medium text-olive-950 transition-all hover:scale-[1.03] hover:bg-gold-400 glow-gold"
            >
              Créer mon compte exportateur
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default function LandingContent() {
  return (
    <>
      <Hero />
      <Stats />
      <Problem />
      <Solution />
      <HowItWorks />
      <Trust />
      <FinalCTA />
    </>
  );
}