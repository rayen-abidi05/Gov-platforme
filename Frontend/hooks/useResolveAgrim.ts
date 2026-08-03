import { privateApi } from "@/lib/api/privateApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      toast.success("AGRIM résolu avec succès.");

      queryClient.invalidateQueries({
        queryKey: ["admin-export-requests"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
        "Une erreur est survenue lors de la résolution de l'AGRIM."
      );
    },
  });
}