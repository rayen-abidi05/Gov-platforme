import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { DocType } from "@/types/registration";


export function useModifyDocument(requestId: string) {


  return useMutation({
    mutationFn: async ({ docType, file }: { docType: DocType; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("docType", docType);

      const res = await privateApi.patch(
        `/api/registration/${requestId}/documents`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data;
    },
    
  });
}