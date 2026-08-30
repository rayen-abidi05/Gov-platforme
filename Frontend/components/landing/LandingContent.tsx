"use client";

import { useEffect, useRef, useState } from "react";
import {
  Leaf, ShieldCheck, Lock, Server, ArrowRight, Clock,
  MessageSquareWarning, EyeOff, Activity, FileText, BellRing,
  GitBranch, UserPlus, UploadCloud, BadgeCheck,
  ArrowUpRight,Globe2,
  Users
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

import Image from "next/image";



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
/* ---------------- Olive Tree mark (replaces OliveBranch) ---------------- */
function OliveTree({ className = "" }: { className?: string }) {
  // Leaf clusters arranged like a canopy, mirroring the Olex-TN mark
  const leaves = [
    // left side
    { x: 70, y: 150, rx: 26, ry: 11, rot: -20 },
    { x: 55, y: 185, rx: 24, ry: 10, rot: -35 },
    { x: 50, y: 225, rx: 22, ry: 9, rot: -55 },
    { x: 90, y: 110, rx: 24, ry: 10, rot: -10 },
    { x: 110, y: 80, rx: 22, ry: 9, rot: 5 },
    // right side
    { x: 330, y: 150, rx: 26, ry: 11, rot: 20 },
    { x: 345, y: 185, rx: 24, ry: 10, rot: 35 },
    { x: 350, y: 225, rx: 22, ry: 9, rot: 55 },
    { x: 310, y: 110, rx: 24, ry: 10, rot: 10 },
    { x: 290, y: 80, rx: 22, ry: 9, rot: -5 },
    // top / center
    { x: 200, y: 55, rx: 24, ry: 10, rot: 0 },
    { x: 165, y: 65, rx: 22, ry: 9, rot: -20 },
    { x: 235, y: 65, rx: 22, ry: 9, rot: 20 },
    { x: 140, y: 95, rx: 22, ry: 9, rot: -40 },
    { x: 260, y: 95, rx: 22, ry: 9, rot: 40 },
  ];

  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leafShine" x1="0" y1="-8" x2="0" y2="8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="trunkShine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* trunk */}
      <path
        d="M200 380 L200 220 M200 240 L165 200 M200 235 L235 195"
        stroke="url(#trunkShine)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* canopy */}
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}>
          <ellipse cx="0" cy="0" rx={l.rx} ry={l.ry} fill="currentColor" opacity="0.9" />
          <ellipse cx="0" cy="0" rx={l.rx} ry={l.ry} fill="url(#leafShine)" opacity="0.4" />
        </g>
      ))}
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




/* ---------------- Hero visual (photo) ---------------- */
function HeroVisual() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        // distance scrolled past the element's initial position, clamped
        const delta = Math.max(-80, Math.min(80, -rect.top * 0.12));
        setOffset(delta);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-gold-500/20 shadow-[0_40px_120px_-30px] shadow-black/60"
    >
      {/* Reveal wipe wrapper — runs once on mount */}
      <div className="absolute inset-0 animate-reveal-wipe">
        {/* Parallax + Ken Burns wrapper */}
        <div
          className="absolute -inset-y-10 inset-x-0 animate-photo-settle"
          style={{ transform: `translateY(${offset}px)` }}
        >
          <div className="absolute inset-0 animate-kenburns">
            <Image
              src="/hero-olive-export.jpg"
              alt="Oliveraie tunisienne surplombant le port d'exportation"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
        </div>
      </div>

      {/* Gradients for legibility + theme blend */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-olive-950 via-olive-950/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-olive-950/50 to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-gold-400/15" />

      <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-cream-50/15 bg-olive-950/60 px-3.5 py-1.5 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
        <span className="text-[11px] tracking-wide text-cream-100/85">
          De l'oliveraie au port d'exportation
        </span>
      </div>
    </div>
  );
}

/* ---------------- Sections ---------------- */

/* ---------------- Hero (updated) ---------------- */

function Hero() {
  const { data: user } = useUser();
  const isLoggedInExporter = user?.role === "EXPORTER";

  return (
    <section className="relative isolate overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/hero-olive-export.jpg"
          alt="Oliveraie tunisienne surplombant le port d'exportation"
          fill
          priority
          className="object-cover animate-kenburns"
          sizes="100vw"
        />

        <div className="absolute inset-0 animate-fade-in bg-gradient-to-r from-olive-950/95 via-olive-950/55 to-olive-950/10" />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-olive-950 to-transparent" />
      </div>

      {/* Hero content */}
      <div className="relative mx-auto flex min-h-[92vh] container-page flex-col justify-end px-5 pb-20 pt-32 md:px-8 md:pb-28">

        <div className="max-w-2xl">

          {/* Badge */}
          <Reveal delay={100}>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-gold-500/5 px-3.5 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-badge-pulse rounded-full bg-gold-400" />

              <span className="text-[11px] uppercase tracking-[0.22em] text-gold-300">
                Plateforme officielle du Ministère
              </span>
            </div>
          </Reveal>

          {/* Title */}
          <Reveal delay={250}>
            <h1 className="mt-6 font-serif text-[42px] leading-[1.05] text-cream-50 md:text-[68px]">
              Prévenir la complexité,
              <br />
              exporter{" "}
              <span className="text-gradient-gold">
                l'huile d'olive
              </span>{" "}
              simplement
            </h1>
          </Reveal>

          {/* Description */}
          <Reveal delay={400}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-cream-100/80 md:text-base">
              Une plateforme moderne pour accélérer l'exportation de l'huile
              d'olive tunisienne vers les marchés internationaux — suivi en
              temps réel, traçabilité complète et communication directe avec
              le Ministère.
            </p>
          </Reveal>

          {/* =====================================================
              EXPORTER SERVICE PORTAL
             ===================================================== */}
          {isLoggedInExporter && (
            <Reveal delay={520}>
              <Link
                href="/espace"
                className="group mt-6 flex w-fit items-center gap-4 rounded-2xl border border-gold-400/25 bg-olive-950/65 px-4 py-3 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/50 hover:bg-olive-950/80 hover:shadow-[0_15px_40px_-15px] hover:shadow-gold-500/30"
              >

                {/* Icon */}
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-400/10 ring-1 ring-gold-400/20 transition-colors group-hover:bg-gold-400/20">
                  <ArrowUpRight className="h-4.5 w-4.5 text-gold-300" />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-cream-50">
                      Votre espace exportateur
                    </span>

                    <span className="rounded-full border border-green-400/20 bg-green-400/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-green-300">
                      Connecté
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-cream-100/50">
                    Accéder à votre portail de services
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight className="ml-2 h-4 w-4 text-cream-50/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold-300" />
              </Link>
            </Reveal>
          )}

          {/* CTA for visitors */}
          {!isLoggedInExporter && (
            <Reveal delay={550}>
              <div className="mt-9 flex flex-wrap items-center gap-3">

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-medium text-olive-950 transition-all hover:scale-[1.03] hover:bg-gold-400 glow-gold"
                >
                  Devenir exportateur
                </Link>

                <Link
                  href="/login"
                  className="grid h-12 w-12 place-items-center rounded-full border border-cream-50/25 text-cream-50 transition-all hover:border-gold-400 hover:text-gold-300"
                  aria-label="Se connecter"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

              </div>
            </Reveal>
          )}

        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE VISUAL CARDS
         ===================================================== */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="mx-auto container-page px-8">

          {/* Main card */}
          <div
            className="pointer-events-auto absolute right-8 top-[30%] w-[340px] hero-card-in rounded-2xl bg-gradient-to-br from-cream-50 via-cream-50 to-gold-300/25 p-5 shadow-glass ring-1 ring-gold-400/20 backdrop-blur-sm"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="hero-card-float">

              <div className="font-serif text-lg text-olive-950">
                Traçabilité de bout en bout
              </div>

              <p className="mt-1.5 text-sm leading-relaxed text-olive-950/65">
                De l'enregistrement à l'exportation, chaque étape est suivie
                et vérifiée par le Ministère.
              </p>

              <Link
                href="/registration"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-olive-950 px-3.5 py-2 text-xs font-medium text-cream-50 transition-transform hover:scale-105"
              >
                En savoir plus
                <ArrowUpRight className="h-3 w-3" />
              </Link>

            </div>
          </div>

          {/* Small cards */}
          <div className="pointer-events-auto absolute bottom-16 right-8 flex gap-4">

            {/* Countries */}
            <div
              className="w-[165px] hero-card-in rounded-2xl bg-gradient-to-br from-cream-50 via-cream-50 to-gold-300/25 p-5 shadow-glass ring-1 ring-gold-400/20"
              style={{ animationDelay: "0.65s" }}
            >
              <div
                className="hero-card-float"
                style={{ animationDelay: "0.3s" }}
              >
                <Globe2 className="h-5 w-5 text-olive-700" />

                <div className="mt-3 font-serif text-2xl text-olive-950">
                  60+
                </div>

                <div className="mt-0.5 text-[11px] leading-snug text-olive-950/55">
                  pays de destination
                </div>
              </div>
            </div>

            {/* Exporters */}
            <div
              className="w-[165px] hero-card-in rounded-2xl bg-gradient-to-br from-cream-50 via-cream-50 to-gold-300/25 p-5 shadow-glass ring-1 ring-gold-400/20"
              style={{ animationDelay: "0.8s" }}
            >
              <div
                className="hero-card-float"
                style={{ animationDelay: "0.6s" }}
              >
                <Users className="h-5 w-5 text-olive-700" />

                <div className="mt-3 font-serif text-2xl text-olive-950">
                  2 340+
                </div>

                <div className="mt-0.5 text-[11px] leading-snug text-olive-950/55">
                  exportateurs vérifiés
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}



function Stats() {
  const items = [
    { value: 145000, suffix: "+", label: "tonnes exportées en 2024" },
    { value: 1.46, decimals: 2, prefix: "", suffix: " Md TND", label: "de valeur d'exportation" },
    { value: 100, suffix: " %", label: "de traçabilité garantie" },
    { value: 2340, suffix: "+", label: "exportateurs vérifiés" },
  ];
  return (
    <section className="relative border-y border-gold-500/10 bg-olive-900/40">
      <div className="mx-auto grid container-page grid-cols-2 gap-y-10 px-5 py-14 md:px-8 lg:grid-cols-4">
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
      <div className="mx-auto grid container-page grid-cols-1 gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.15fr]">
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
              son processus d'exportation reste largement manuel freinant la
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
      <div className="relative mx-auto container-page px-5 md:px-8">
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
      <div className="mx-auto container-page px-5 md:px-8">
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
      <div className="mx-auto container-page px-5 md:px-8">
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