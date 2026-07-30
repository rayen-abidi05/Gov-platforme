import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExportRequestStatus } from "@/types/exportRequest";

export function useUpdateExportRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ExportRequestStatus }) => {
      await new Promise((r) => setTimeout(r, 400));
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-export-requests"] });
    },
  });
}