import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ExportRequest } from "@/types/exportRequest";

export function useExportRequests() {
  return useQuery({
    queryKey: ["export-requests"],
    queryFn: async (): Promise<{ requests: ExportRequest[] }> => {
      const res = await privateApi.get("/api/export-requests/my-requests");
      return res.data;
    },
  });
}

export function useExportRequest(id: string) {
  return useQuery({
    queryKey: ["export-requests", id],

    queryFn: async (): Promise<ExportRequest> => {
      const res = await privateApi.get(
        `/api/export-requests/my-requests/${id}`
      );

      return res.data.request; 
    },

    enabled: !!id,
  });
}