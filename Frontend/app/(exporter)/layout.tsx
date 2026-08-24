"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useVerifyUser } from "@/hooks/useVerifyUser";
import {
  SECTION_ALLOWED_ROLES,
  ROLE_HOME_ROUTE,
} from "@/lib/auth/roleAccess";
import { useCompany } from "@/hooks/useCompany";

import Spinner from "@/components/ui/spinner";

export default function ExporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const {
    data: user,
    isLoading: isUserLoading,
  } = useVerifyUser();

  const {
    isLoading: isCompanyLoading,
    isError: isCompanyError,
  } = useCompany();

  if (isUserLoading) {
    return <Spinner />;
  }


  if (!user) {
    router.replace("/login");
    return <Spinner />;
  }


  if (!SECTION_ALLOWED_ROLES.exporterArea.includes(user.role)) {
    router.replace(ROLE_HOME_ROUTE[user.role] ?? "/");
    return <Spinner />;
  }


  if (isCompanyLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-olive-950">
        <Spinner size="h-10 w-10" />
      </div>
    );
  }


  if (isCompanyError) {
    router.replace("/login");
    return <Spinner />;
  }

  return <div>{children}</div>;
}