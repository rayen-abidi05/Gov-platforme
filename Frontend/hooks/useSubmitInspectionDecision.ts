import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { InspectionDecisionType } from "@/types/inspection";

interface SubmitDecisionInput {
  id: string;
  decision: InspectionDecisionType;
  reason?: string;
  comment?: string;
}

export function useSubmitInspectionDecision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, decision, reason, comment }: SubmitDecisionInput) => {
      const res = await privateApi.post(`/api/inspections/${id}/decision`, {
        decision,
        reason,
        comment,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inspections"] });
      queryClient.invalidateQueries({ queryKey: ["inspection", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
