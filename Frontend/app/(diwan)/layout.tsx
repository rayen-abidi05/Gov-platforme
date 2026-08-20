"use client"
import { redirect } from "next/navigation";
 import { useVerifyUser } from "@/hooks/useVerifyUser";
import { SECTION_ALLOWED_ROLES, ROLE_HOME_ROUTE } from "@/lib/auth/roleAccess";

export default async function DiwanLayout({ children }: { children: React.ReactNode }) {
   const {data : user} =  useVerifyUser();

   if (!user) redirect("/login");

  if (!SECTION_ALLOWED_ROLES.diwanArea.includes(user.role)) {
     redirect(ROLE_HOME_ROUTE[user.role] ?? "/");
   }

  return <>{children}</>;
}