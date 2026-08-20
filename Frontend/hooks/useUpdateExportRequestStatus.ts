"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExportRequestStatus } from "@/types/exportRequest";
import { privateApi } from "@/lib/api/privateApi";
import { toast } from "sonner";


export function useUpdateExportRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: ExportRequestStatus;
    }) => {

      const res = await privateApi.patch(
        `/api/export-requests/${id}/decide`,
        {
          status,
        }
      );

      return res.data;
    },


    onSuccess: (_, variables) => {

      queryClient.invalidateQueries({
        queryKey:["admin-export-requests"],
      });


      if(variables.status === "APPROVED"){
        toast.success("Demande approuvée avec succès");
      }

      else if(variables.status === "REJECTED"){
        toast.success("Demande rejetée avec succès");
      }

    },


    onError:(error:any)=>{

      toast.error(
        error?.response?.data?.message ??
        "Une erreur est survenue"
      );

    }

  });
}