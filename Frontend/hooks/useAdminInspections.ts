import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ApiInspection } from "@/types/inspection";

export function useAdminInspections() {
  return useQuery({
    queryKey: ["admin-inspections"],
    queryFn: async () => {
      const res = await privateApi.get("/api/inspections/admin/all");
      return res.data as { inspections: ApiInspection[] };
    },
  });
}