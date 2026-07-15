import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ApprovedExporter } from "@/types/registration";


export function useApprovedExporters() {
  return useQuery({
    queryKey: ["approved-exporters"],
    queryFn: async () => {
      const res = await privateApi.get("/api/registration/exporters");
      return res.data as { exporters: ApprovedExporter[] };
    },
  });
}