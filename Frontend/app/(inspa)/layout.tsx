import { redirect } from "next/navigation";
// import { verifyUser } from "@/lib/auth/verifyUser";
import { SECTION_ALLOWED_ROLES, ROLE_HOME_ROUTE } from "@/lib/auth/roleAccess";
import InspaSidebar from "@/components/inspa/InspaSidebar";

export default async function InspaLayout({ children }: { children: React.ReactNode }) {
  //   const user = await verifyUser();

  //   if (!user) redirect("/login");

  //   if (!SECTION_ALLOWED_ROLES.inspaArea.includes(user.role)) {
  //     redirect(ROLE_HOME_ROUTE[user.role] ?? "/");
  //   }

  return (
    <div className="flex min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <InspaSidebar />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
