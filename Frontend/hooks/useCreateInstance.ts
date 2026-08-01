// hooks/useCreateInstance.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateInstanceInput {
  exportRequestIds: string[];
  memberIds: string[];
  meetingDate: string;
  reportFile?: File | null;
}


export function useCreateInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateInstanceInput) => {
      await new Promise((r) => setTimeout(r, 500));
      return { id: `instance_${Date.now()}`, ...input };
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["admin-export-requests"] });
    },
  });
}