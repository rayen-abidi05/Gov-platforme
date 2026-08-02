import {useMutation,useQueryClient} from "@tanstack/react-query";
import {privateApi} from "@/lib/api/privateApi";


export function useSendToCommittee(){

 const queryClient = useQueryClient();

 return useMutation({

  mutationFn: async(id:string)=>{

    const res = await privateApi.patch(
      `/api/export-requests/${id}/send-to-committee`
    );

    return res.data;
  },


  onSuccess:()=>{
    queryClient.invalidateQueries({
      queryKey:["admin-export-requests"]
    });
  }

 });

}