import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ExportRequest } from "@/types/exportRequest";

export function useObserverExportRequest(id: string | null) {
  return useQuery({
    queryKey: ["observer-export-request", id],
    queryFn: async () => {
      const res = await privateApi.get(`/api/export-requests/${id}`);
      return res.data.request as ExportRequest;
    },
    enabled: !!id,
  });
}
