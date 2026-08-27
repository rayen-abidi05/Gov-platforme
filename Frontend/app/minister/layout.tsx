"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import NotificationBell from "@/components/NotificationBell";
import MinisterLogoutButton from "@/components/minister/MinisterLogoutButton";
import Spinner from "@/components/ui/spinner";

import { useVerifyUser } from "@/hooks/useVerifyUser";
import {
  SECTION_ALLOWED_ROLES,
  ROLE_HOME_ROUTE,
} from "@/lib/auth/roleAccess";
import Link from "next/dist/client/link";

export default function MinisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { data: user, isLoading } = useVerifyUser();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!SECTION_ALLOWED_ROLES.ministerArea.includes(user.role)) {
      router.replace(ROLE_HOME_ROUTE[user.role] ?? "/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <Spinner />;
  }

  if (!SECTION_ALLOWED_ROLES.ministerArea.includes(user.role)) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <header className="flex items-center justify-between border-b border-cream-50/10 bg-olive-950/60 px-6 py-3.5 backdrop-blur-md sm:px-10">
        <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="/logo-ministere.png"
              alt="Ministère de l'Agriculture"
              width={90}
              height={55}
              className="h-10 w-auto object-contain"
              priority
            />
           <div className="leading-tight">
            <div className="font-serif text-[12px] sm:text-[15px] text-cream-50">
              République Tunisienne
            </div>
            <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.18em] text-cream-300/70 max-w-[140px] sm:max-w-none">
              <span className="sm:hidden">MARHP</span>
              <span className="hidden sm:inline">
                Ministère de l'Agriculture, des Ressources <br /> Hydrauliques et de la Pêche
              </span>
            </div>
          </div>
          </Link>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <MinisterLogoutButton />
        </div>
      </header>

      {children}
    </div>
  );
}