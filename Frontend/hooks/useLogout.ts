
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { privateApi } from "@/lib/api/privateApi";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await privateApi.post("/api/auth/logout");
      return res.data;
    },

    onSettled: () => {
      // Clear all cached data from the previous user
      queryClient.clear();

      // Redirect to login
      router.replace("/login");
    },
  });
}

