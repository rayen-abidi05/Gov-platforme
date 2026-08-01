import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ExportRequestStatus } from "@/types/exportRequest";

export function useDecideExportRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ExportRequestStatus }) => {
      const res = await privateApi.patch(`/api/export-requests/${id}/decide`, { status });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-instances"] });
      queryClient.invalidateQueries({ queryKey: ["admin-export-requests"] });
    },
  });
}