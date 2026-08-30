import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { privateApi } from "@/lib/api/privateApi";

/**
 * Shared logout hook.
 *
 * IMPORTANT: this clears the entire react-query cache on success.
 * Without this, the cached response of /api/auth/verify (used by
 * useUser / useVerifyUser) stays in memory after logout. If a
 * different user then logs in, every role-guarded layout keeps
 * reading the *previous* user's role until the 5 minute staleTime
 * expires (or a full page reload recreates the QueryClient), which
 * sends the new user to the wrong "home" route the first time they
 * navigate. queryClient.clear() forces a fresh /verify fetch instead.
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await privateApi.post("/api/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      queryClient.clear();
      router.replace("/login");
    },
  });
}
