import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ApiInspection } from "@/types/inspection";

export function useInspectionDetails(id: string) {
  return useQuery({
    queryKey: ["inspection", id],
    queryFn: async () => {
      const res = await privateApi.get(`/api/inspections/${id}`);
      return res.data as { inspection: ApiInspection };
    },
    enabled: !!id,
  });
}
