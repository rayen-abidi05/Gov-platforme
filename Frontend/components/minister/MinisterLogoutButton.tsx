"use client";

import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";

export default function MinisterLogoutButton() {
  const { mutate: logout } = useLogout();

  return (
    <button
      onClick={() => logout()}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/15 bg-cream-50/[0.03] text-cream-50/70 transition-all duration-200 hover:border-red-400/30 hover:text-red-300"
      title="Se déconnecter"
    >
      <LogOut className="h-4.5 w-4.5" />
    </button>
  );
}