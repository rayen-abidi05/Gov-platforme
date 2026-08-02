
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ApiMinisterFormulaire, FormulaireStatus } from "@/types/ministerFormulaire";

export function useMinisterFormulaires(status?: FormulaireStatus | "ALL") {
  return useQuery({
    queryKey: ["minister-formulaires", status],
    queryFn: async () => {
      const res = await privateApi.get("/api/minister-formulaires", {
        params: status && status !== "ALL" ? { status } : undefined,
      });
      return res.data as { formulaires: ApiMinisterFormulaire[] };
    },
  });
}

export function useReviewFormulaire() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: "APPROVED" | "REJECTED"; notes?: string }) => {
      const res = await privateApi.patch(`/api/minister-formulaires/${id}/review`, { status, notes });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["minister-formulaires"] });
    },
  });
}