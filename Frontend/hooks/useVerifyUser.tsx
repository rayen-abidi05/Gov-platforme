import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { AuthenticatedUser } from "@/types/auth";

export function useVerifyUser() {
  return useQuery({
    queryKey: ["verify-check-ROLE"],

    queryFn: async () : Promise<AuthenticatedUser> => {
      const res = await privateApi.get("/api/auth/verify");
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}