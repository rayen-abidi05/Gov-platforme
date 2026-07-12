// hooks/useUpdateRequestStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { RequestStatus } from "@/types/registration";

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: RequestStatus;
      notes?: string;
    }) => {
      const res = await privateApi.post(`/api/registration/updateStatus/${id}`, {
        status,
        notes,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requetsALL"] }); 
    },
  });
}