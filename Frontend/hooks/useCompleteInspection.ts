import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { InspectionStatus } from "@/types/inspection";

export function useCompleteInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: Extract<InspectionStatus, "APPROVED" | "REJECTED">;
      notes?: string;
    }) => {
      const res = await privateApi.patch(`/api/inspections/${id}/complete`, { status, notes });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspa-inspections"] });
    },
  });
}