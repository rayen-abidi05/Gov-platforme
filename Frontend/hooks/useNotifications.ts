import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ApiNotification } from "@/types/registration";


export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await privateApi.get("/api/notifications");
      return res.data;
    },
    staleTime: 1000 * 10 , 
    refetchInterval: 1000 * 10,
  });
}


export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await privateApi.put(`/api/notifications/${id}/read`);
      return res.data;
      
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}