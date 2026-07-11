import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";


export function useCompany() {
  

  return useQuery({
    queryKey : ["company"],

    queryFn : async() => {
        const res = await privateApi.get("/api/company/me");
        return res.data;
    },
    staleTime: 1000 * 60 * 10
  });
}