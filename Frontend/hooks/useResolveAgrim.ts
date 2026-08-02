import { privateApi } from "@/lib/api/privateApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useResolveAgrim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      limitKg,
    }: {
      id: string;
      limitKg: number;
    }) => {
      const res = await privateApi.patch(
        `/api/export-requests/${id}/resolve-agrim`,
        {
          limitKg,
        }
      );

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-export-requests"],
      });
    },
  });
}