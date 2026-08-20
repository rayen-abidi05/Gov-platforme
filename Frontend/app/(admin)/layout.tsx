"use client"
import AdminSidebar from "@/components/admin/AdminSidebar";
import { redirect } from "next/navigation";

 import { useVerifyUser } from "@/hooks/useVerifyUser";
import { SECTION_ALLOWED_ROLES, ROLE_HOME_ROUTE } from "@/lib/auth/roleAccess";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const {data : user} =  useVerifyUser();
 
    if (!user) redirect("/login");
 
  if (!SECTION_ALLOWED_ROLES.adminArea.includes(user.role)) {
      redirect(ROLE_HOME_ROUTE[user.role] ?? "/");
    }
  return (
    <div className="flex min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}