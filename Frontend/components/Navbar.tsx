"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useUser } from "@/hooks/useUser";
import AuthLinks from "./AuthLinks";
import ProfileNav from "./ProfileNav";
import { useMutation } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { User, UserCircle, LogOut, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter()
  const { data: user, isLoading } = useUser();
  console.log(user)
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await privateApi.post("/api/auth/logout");
      return res.data;
    },
    onSuccess: () => router.push("/login"),
  });
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "À propos" },
    { href: "/chaier-de-charge", label: "Cahier de charge" },
    { href: "/registration", label: "Demande d'enregistrement" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-olive-950/75 border-b border-gold-500/15"
          : "backdrop-blur-md bg-olive-950/35 border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/logo-ministere.png"
            alt="Ministère de l'Agriculture"
            width={90}
            height={55}
            className="h-20 w-20 object-contain"
            priority
          />
          <div className="leading-tight">
            <div className="font-serif text-[15px] text-cream-50">
              République Tunisienne
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-cream-300/70">
              Ministère de l'Agriculture, des Ressources <br /> Hydrauliques et de la Pêche
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-cream-100/85 transition-colors hover:text-gold-300"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoading ? null : user ? <ProfileNav user={user} /> : <AuthLinks />}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-cream-50 lg:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-[999] bg-olive-950 lg:hidden">
          <div className="mx-auto flex h-full max-w-7xl flex-col gap-1 overflow-y-auto px-5 py-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base text-cream-100 hover:bg-olive-800 hover:text-gold-300"
              >
                {l.label}
              </Link>
            ))}

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
    </header>
  );
}