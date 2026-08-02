import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ApiInspection } from "@/types/inspection";

type InspectionTab = "assigned" | "completed" | "history";

const ENDPOINTS: Record<InspectionTab, string> = {
  assigned: "/api/inspections/assigned",
  completed: "/api/inspections/completed",
  history: "/api/inspections/history",
};

export function useInspections(tab: InspectionTab) {
  return useQuery({
    queryKey: ["inspa-inspections", tab],
    queryFn: async () => {
      const res = await privateApi.get(ENDPOINTS[tab]);
      return res.data as { inspections: ApiInspection[] };
    },
  });
}