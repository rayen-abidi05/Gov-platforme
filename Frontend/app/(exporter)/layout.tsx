"use client";

import { useCompany } from "@/hooks/useCompany";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";
export default function ExporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isError } = useCompany();
 const router = useRouter();
 if (isLoading) {
     return (
       <div className="flex min-h-screen items-center justify-center bg-olive-950">
         <Spinner size="h-10 w-10" />
       </div>
     );
   }

  if (isError) {
    router.replace("/login")
  }

  return children;
}