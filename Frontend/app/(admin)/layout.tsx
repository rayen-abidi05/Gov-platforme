
// import { redirect } from "next/navigation";
// import { verifyUser } from "@/lib/auth/verifyUser";
// import { SECTION_ALLOWED_ROLES, ROLE_HOME_ROUTE } from "@/lib/auth/roleAccess";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
//   const user = await verifyUser();

//   if (!user) redirect("/login");

//   if (!SECTION_ALLOWED_ROLES.adminArea.includes(user.role)) {
//     redirect(ROLE_HOME_ROUTE[user.role] ?? "/");
//   }

  return <>{children}</>;
}