import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ExportRequest } from "@/types/exportRequest";

export function useObserverExportRequests() {
  return useQuery({
    queryKey: ["observer-export-requests"],
    queryFn: async () => {
      const res = await privateApi.get("/api/export-requests");
      return res.data.requests as ExportRequest[];
    },
  });
}
