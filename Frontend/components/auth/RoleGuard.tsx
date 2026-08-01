"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { ROLE_HOME_ROUTE } from "@/lib/auth/roleAccess";
import { Role } from "@/types/registration";
import Spinner from "@/components/ui/spinner";

interface Props {
  allowedRoles: Role[];
  children: React.ReactNode;
}

/**
 * Client-side gate for a role-specific dashboard. Redirects to /login when
 * there is no session, and to the user's own home route when their role
 * isn't allowed in this section. Real authorization still happens on the
 * API (see checkRole middleware) — this only protects the UI shell.
 */
export default function RoleGuard({ allowedRoles, children }: Props) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useUser();

  useEffect(() => {
    if (isLoading) return;

    if (isError || !user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace(ROLE_HOME_ROUTE[user.role as Role] ?? "/");
    }
  }, [isLoading, isError, user, allowedRoles, router]);

  if (isLoading || isError || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-olive-950">
        <Spinner size="h-10 w-10" />
      </div>
    );
  }

  return <>{children}</>;
}
