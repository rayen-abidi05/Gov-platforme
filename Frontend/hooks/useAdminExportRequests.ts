import { useQuery } from "@tanstack/react-query";
import { MOCK_ADMIN_EXPORT_REQUESTS } from "@/lib/mockData/adminExportRequests";
import { ExportRequest } from "@/types/exportRequest";


export function useAdminExportRequests() {
  return useQuery({
    queryKey: ["admin-export-requests"],
    queryFn: async (): Promise<{ requests: ExportRequest[] }> => {
      await new Promise((r) => setTimeout(r, 300));
      return { requests: MOCK_ADMIN_EXPORT_REQUESTS };
    },
  });
}