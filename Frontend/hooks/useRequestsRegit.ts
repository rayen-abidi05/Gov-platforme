import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";




export function useRequestsRegit() {
  

  return useQuery({
    queryKey : ["requetsALL"],
    queryFn : async() => {
        const res = await privateApi.get("/api/registration");
        return res.data;
    },
    
  });
}