import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { toast } from "sonner";

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

      const formData = new FormData();

      formData.append(
        "exportRequestIds",
        JSON.stringify(input.exportRequestIds)
      );

      formData.append(
        "memberIds",
        JSON.stringify(input.memberIds)
      );

      formData.append(
        "meetingDate",
        input.meetingDate
      );


      if (input.reportFile) {
        formData.append(
          "reportFile",
          input.reportFile
        );
      }


      const res = await privateApi.post(
        "/api/instances",
        formData
      );


      return res.data;
    },


    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:["admin-export-requests"]
      });

      queryClient.invalidateQueries({
        queryKey:["instances"]
      });
    },
  });
}