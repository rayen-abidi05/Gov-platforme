import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { ApiNotification } from "@/types/registration";

// TODO: backend endpoint — GET current user's notifications, newest first
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await privateApi.get("/api/notifications");
      return res.data as { notifications: ApiNotification[] };
    },
  });
}

// TODO: backend endpoint — PATCH mark a single notification as read
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // const res = await privateApi.patch(`/api/notifications/${id}/read`);
      // return res.data;
      return []
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}