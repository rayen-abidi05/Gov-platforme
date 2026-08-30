import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";

export function useUser() {
  return useQuery({
    queryKey: ["verify-check-ROLE"],
    queryFn: async () => {
      const res = await privateApi.get("/api/auth/verify");
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}