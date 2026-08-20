"use client";
import { redirect } from "next/navigation";
 import { useVerifyUser } from "@/hooks/useVerifyUser";
import { SECTION_ALLOWED_ROLES, ROLE_HOME_ROUTE } from "@/lib/auth/roleAccess";
import { useCompany } from "@/hooks/useCompany";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";
export default function ExporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const {data : user} =  useVerifyUser();
 
    if (!user) redirect("/login");
 
   if (!SECTION_ALLOWED_ROLES.exporterArea.includes(user.role)) {
      redirect(ROLE_HOME_ROUTE[user.role] ?? "/");
    }
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

  return <div>{children}</div>;
}