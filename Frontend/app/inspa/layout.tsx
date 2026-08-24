"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useVerifyUser } from "@/hooks/useVerifyUser";
import {
  SECTION_ALLOWED_ROLES,
  ROLE_HOME_ROUTE,
} from "@/lib/auth/roleAccess";

import InspaSidebar from "@/components/inspa/InspaSidebar";
import Spinner from "@/components/ui/spinner";

export default function InspaLayout({
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

    if (!SECTION_ALLOWED_ROLES.inspaArea.includes(user.role)) {
      router.replace(ROLE_HOME_ROUTE[user.role] ?? "/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <Spinner />;
  }

  if (!SECTION_ALLOWED_ROLES.inspaArea.includes(user.role)) {
    return <Spinner />;
  }

  return (
    <div className="flex min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <InspaSidebar />

      <div className="flex-1 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}