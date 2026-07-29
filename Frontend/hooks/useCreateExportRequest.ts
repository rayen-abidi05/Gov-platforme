import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface NewExportRequestInput {
  client: string;
  agrimReference: string;
  requestedKg: number;
  agrimFile?: File | null;
  contractFile?: File | null;
  ministerialLetterFile?: File | null;
}


export function useCreateExportRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_input: NewExportRequestInput) => {
      await new Promise((r) => setTimeout(r, 600));
      return { id: `exp_${Date.now()}` };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["export-requests"] });
    },
  });
}