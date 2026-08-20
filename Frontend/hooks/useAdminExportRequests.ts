"use client";
import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ExportRequest } from "@/types/exportRequest";

export function useAdminExportRequests() {
  return useQuery({
    queryKey: ["admin-export-requests"],
    queryFn: async (): Promise<{ requests: ExportRequest[] }> => {
      const res = await privateApi.get("/api/export-requests");

      return res.data;
    },
  });
}