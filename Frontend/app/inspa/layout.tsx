import { redirect } from "next/navigation";

import InspaSidebar from "@/components/inspa/InspaSidebar";

export default async function InspaLayout({ children }: { children: React.ReactNode }) {
  // const user = await verifyUser();

  // if (!user) redirect("/login");
  // if (user.role !== "INSPA") redirect("/login");

  return (
    <div className="flex min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <InspaSidebar />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}