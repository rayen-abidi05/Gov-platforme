import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ApiInspection } from "@/types/inspection";

// scope lets each dashboard tab (assigned / pending / completed / history)
// reuse the same hook while asking the backend to pre-filter the list.
// The backend can ignore the param for now and return everything — the
// pages also filter client-side as a safety net (same pattern used by
// useRequestsRegit + the admin requests page).
export type InspectionScope = "all" | "assigned" | "pending" | "completed" | "history";

export function useInspections(scope: InspectionScope = "all") {
  return useQuery({
    queryKey: ["inspections", scope],
    queryFn: async () => {
      const res = await privateApi.get("/api/inspections", { params: { scope } });
      return res.data as { inspections: ApiInspection[] };
    },
  });
}
