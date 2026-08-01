import { useQuery } from "@tanstack/react-query";
import { MOCK_EXPORT_REQUESTS } from "@/lib/mockData/exportRequests";
import { ExportRequest } from "@/types/exportRequest";


export function useExportRequests() {
  return useQuery({
    queryKey: ["export-requests"],
    queryFn: async (): Promise<{ requests: ExportRequest[] }> => {
      
      return { requests: MOCK_EXPORT_REQUESTS };
    },
  });
}

export function useExportRequest(id: string) {
  return useQuery({
    queryKey: ["export-requests", id],
    queryFn: async (): Promise<ExportRequest | undefined> => {
      
      return MOCK_EXPORT_REQUESTS.find((r) => r.id === id);
    },
    enabled: !!id,
  });
}