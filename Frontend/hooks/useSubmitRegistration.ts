import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { DocumentsFormValues } from "@/lib/validations/documentsSchema";
import { toast } from "sonner";
export function useSubmitRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: DocumentsFormValues & { note?: string }) => {
      const formData = new FormData();

      const { note, ...docs } = values;
      Object.entries(docs).forEach(([docType, file]) => {
        if (file) formData.append(docType, file as File);
      });
      if (note) formData.append("note", note);

      const res = await privateApi.post("/api/registration", formData, {
       
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("envoyées avec succées!");
      queryClient.invalidateQueries({ queryKey: ["registration-status"] });
    },
  });
}