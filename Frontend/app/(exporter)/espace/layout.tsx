"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import ExporterSidebar from "@/components/exporter/ExporterSidebar";
import Spinner from "@/components/ui/spinner";

export default function ExporterDashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useUser();
  const router = useRouter();
  console.log(user)
  useEffect(() => {
    if (!isLoading && user && user.status !== "APPROVED") {
      router.replace("/not-approved");
    }
  }, [isLoading, user, router]);

  if (isLoading || (user && user.status !== "APPROVED")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-olive-950">
        <Spinner size="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <ExporterSidebar />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}