import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { DocumentsFormValues } from "@/lib/validations/documentsSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export function useSubmitRegistration() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (values: DocumentsFormValues & { note?: string }) => {
      const formData = new FormData();

  const { note, requestText, ...docs } = values;

  Object.entries(docs).forEach(([docType, file]) => {
    if (file instanceof File) {
      formData.append(docType, file);
        }
      });

      if (note) {
        formData.append("note", note);
      }

      if (requestText) {
        formData.append("requestText", requestText);
      }


      const res = await privateApi.post("/api/registration", formData, {
       
      });
      return res.data;
    },
    onSuccess: () => {
      router.push("/registration");
      queryClient.invalidateQueries({ queryKey: ["registration-status"] });
    },
  });
}