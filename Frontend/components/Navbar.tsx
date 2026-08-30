"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useUser } from "@/hooks/useUser";
import { useLogout } from "@/hooks/useLogout";
import AuthLinks from "./AuthLinks";
import ProfileNav from "./ProfileNav";
import { User, UserCircle, LogOut, Menu, X, FileText, Home } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import LanguageSelector from "@/components/ui/LanguageSelector"
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const logoutMutation = useLogout();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: "/", label: "Accueil", title: "Retour à l'accueil" },
    { href: "/espace", label: "Espace exportateur", protected: true, title: "Espace exportateur" },
    { href: "/registration", label: "Demande d'enregistrement" ,title: "Demande d'enregistrement dans la liste des exportateurs"},
     { href: "/contact", label: "Contact" ,title: "Contact"},
    { href: "/about", label: "À propos" ,title: "À propos"},
  ];

  
  const navLinks = links.filter((l) => l.href !== "/");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname?.startsWith(`${href}/`);

  const guidePdfHref = "/docs/Guide_Exportation_Huile_Olive_FR.pdf";

  const handleProtectedNav = (href: string) => {
    setOpen(false);
    if (href !== "/espace") {
      router.push(href);
      return;
    }
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role === "EXPORTER" && user.status !== "APPROVED") {
      router.push("/not-approved");
      return;
    }
    router.push(href);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-olive-950/85 shadow-[0_1px_0_0_rgb(var(--gold-500)/0.25),0_12px_30px_-16px_rgb(0_0_0/0.6)]"
            : "backdrop-blur-md bg-olive-950/45"
        }`}
      >
        <div className="mx-auto flex h-[68px] container-page items-center justify-between gap-6 px-5">
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            <Image
              src="/logo-ministere.png"
              alt="Ministère de l'Agriculture"
              width={90}
              height={55}
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              priority
            />
            <div className="leading-tight">
              <div className="font-display text-[13px] tracking-wide text-cream-50">
                République Tunisienne
              </div>
              <div className="text-[8px] uppercase tracking-[0.14em] text-cream-300/60 max-w-[140px] sm:max-w-none sm:text-[9px] sm:tracking-[0.16em]">
                <span className="sm:hidden">MARHP</span>
                <span className="hidden sm:inline">
                  Ministère de l&apos;Agriculture, des Ressources <br /> Hydrauliques et de la Pêche
                </span>
              </div>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-center lg:flex">
            <nav className="flex items-center gap-1 rounded-full border border-cream-50/[0.07] bg-olive-900/30 px-1.5 py-1.5">
              <Link
                href="/"
                title="Retour à l'accueil"
                aria-label="Retour à l'accueil"
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 ${
                  isActive("/")
                    ? "bg-gold-300/15 text-gold-300"
                    : "text-cream-100/60 hover:bg-cream-50/[0.06] hover:text-gold-300"
                }`}
              >
                <Home className="h-4 w-4" />
              </Link>

              <span className="h-4 w-px bg-cream-50/10" aria-hidden />

              {navLinks.map((l) => (
                <button
                  title={l.title}
                  key={l.href}
                  onClick={() => handleProtectedNav(l.href)}
                  className={`rounded-full px-4 py-1.5 text-[13.5px] font-medium tracking-tight transition-colors duration-200 ${
                    isActive(l.href)
                      ? "bg-gold-300/15 text-gold-300"
                      : "text-cream-100/75 hover:bg-cream-50/[0.06] hover:text-cream-50"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={guidePdfHref}
              target="_blank"
              rel="noopener noreferrer"
              title="Guide d'exportation de l'huile d'olive"
              className="flex items-center gap-1.5 rounded-full border border-gold-300/25 px-3.5 py-[7px] text-[13px] font-medium text-gold-200 transition-all duration-200 hover:border-gold-300/45 hover:bg-gold-300/[0.08] hover:text-gold-300"
            >
              <FileText className="h-3.5 w-3.5" />
              Guide
            </a>
                
            <LanguageSelector />
              <span
        className="h-6 w-px bg-cream-50/10"
        aria-hidden
      />
            {isLoading ? (
              <div className="h-9 w-24 animate-pulse rounded-full bg-cream-50/5" />
            ) : user ? (
              <ProfileNav user={user} />
            ) : (
              <AuthLinks />
            )}
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-cream-50 lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-x-0 top-[68px] bottom-0 z-[60] bg-olive-950 lg:hidden">
          <div className="mx-auto flex h-full container-page flex-col gap-1 overflow-y-auto px-5 py-6">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => handleProtectedNav(l.href)}
                className={`flex items-center gap-2.5 rounded-md px-3 py-3 text-left text-base transition-colors duration-200 ${
                  isActive(l.href)
                    ? "bg-gold-300/10 text-gold-300"
                    : "text-cream-100 hover:bg-olive-800 hover:text-gold-300"
                }`}
              >
                {l.href === "/" && <Home className="h-4 w-4" />}
                {l.label}
              </button>
            ))}

            <a
              href={guidePdfHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-md px-3 py-3 text-base text-gold-200 hover:bg-olive-800 hover:text-gold-300"
            >
              <FileText className="h-4 w-4" />
              Guide
            </a>
              <LanguageSelector />
              

            <div className="mt-4 border-t border-cream-50/10 pt-4">
              {isLoading ? null : user ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-300/30 bg-gold-300/15 text-gold-300">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-cream-50">
                      {user.name}
                    </span>
                  </div>

                  <Link
                    href={`/${user.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-md px-3 py-3 text-sm text-cream-100/85 hover:bg-olive-800 hover:text-gold-300"
                  >
                    <UserCircle className="h-4 w-4" />
                    Profil
                  </Link>

                  <button
                    onClick={() => {
                      setOpen(false);
                      logoutMutation.mutate();
                    }}
                    className="flex items-center gap-2.5 rounded-md px-3 py-3 text-left text-sm text-cream-100/85 hover:bg-olive-800 hover:text-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    Se déconnecter
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-full bg-gold-500 px-4 py-3 text-center text-sm font-medium text-olive-950"
                  >
                    S'inscrire
                  </Link>

                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-full border border-gold-500/30 px-4 py-3 text-center text-sm font-medium text-cream-50"
                  >
                    Se connecter
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}