"use client";

import { LogOut } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { privateApi } from "@/lib/api/privateApi";

export default function MinisterLogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await privateApi.post("/api/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      queryClient.clear();
      router.replace("/login");
    },
  });

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