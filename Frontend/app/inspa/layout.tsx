"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import InspaSidebar from "@/components/inspa/InspaSidebar";

export default function InspaDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["INSPA"]}>
      <div className="flex min-h-screen w-full bg-olive-950 font-body text-cream-50">
        <InspaSidebar />
        <div className="flex-1 overflow-x-hidden">{children}</div>
      </div>
    </RoleGuard>
  );
}
