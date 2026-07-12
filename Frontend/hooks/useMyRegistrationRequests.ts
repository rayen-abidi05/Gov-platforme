import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ApiRegistrationRequest } from "@/types/registration";


export function useMyRegistrationRequests() {
  return useQuery({
    queryKey: ["my-registration-requests"],
    queryFn: async () => {
      const res = await privateApi.get("/api/registration/myRequests");
      return res.data as { requests: ApiRegistrationRequest[] };
    },
  });
}