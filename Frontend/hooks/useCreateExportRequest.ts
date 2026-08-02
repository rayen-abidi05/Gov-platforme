import { privateApi } from "@/lib/api/privateApi";
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
    mutationFn: async (input: NewExportRequestInput) => {
      const formData = new FormData();

      formData.append("client", input.client);
      formData.append("agrimReference", input.agrimReference);
      formData.append("requestedKg", input.requestedKg.toString());

      if (input.agrimFile) {
        formData.append("AGRIM", input.agrimFile);
      }

      if (input.contractFile) {
        formData.append("CONTRACT", input.contractFile);
      }

      if (input.ministerialLetterFile) {
        formData.append("MINISTERIAL_LETTER", input.ministerialLetterFile);
      }

      const res = await privateApi.post(
        "/api/export-requests",
        formData
      );

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["export-requests"],
      });
    },
  });
}