import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";

export function useAssignToInspa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrationRequestId: string) => {
      const res = await privateApi.post(`/api/registration/${registrationRequestId}/assign-inspa`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requetsALL"] }); // matches useRequestsRegit's queryKey
    },
  });
}