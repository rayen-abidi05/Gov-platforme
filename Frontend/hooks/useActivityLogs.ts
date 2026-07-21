
import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ActivityLogsResponse } from "@/types/activity-log";

export interface ActivityLogFilters {
  action?: string;
  from?: string;
  to?: string;
  page: number;
}

export function useActivityLogs(filters: ActivityLogFilters) {
  return useQuery({
    queryKey: ["activity-logs", filters],
    queryFn: async () => {
      const res = await privateApi.get("/api/activity-logs", {
        params: {
          action: filters.action || undefined,
          from: filters.from || undefined,
          to: filters.to || undefined,
          page: filters.page,
          limit: 20,
        },
      });
      return res.data as ActivityLogsResponse;
    },
  });
}