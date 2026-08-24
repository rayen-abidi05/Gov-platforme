"use client"
import { redirect } from "next/navigation";
 import { useVerifyUser } from "@/hooks/useVerifyUser";
import { SECTION_ALLOWED_ROLES, ROLE_HOME_ROUTE } from "@/lib/auth/roleAccess";
import Spinner from "@/components/ui/spinner";

export default async function DiwanLayout({ children }: { children: React.ReactNode }) {
   const {data : user,isLoading} =  useVerifyUser();
   if (isLoading) {
      return <Spinner />;
    }
    else{

   if (!user) redirect("/login");

  if (!SECTION_ALLOWED_ROLES.diwanArea.includes(user.role)) {
     redirect(ROLE_HOME_ROUTE[user.role] ?? "/");
   }
  }
  return <>{children}</>;
}