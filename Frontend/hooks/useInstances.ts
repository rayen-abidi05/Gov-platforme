import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import { AdminInstance } from "@/types/instance";

export function useInstances() {
  return useQuery({
    queryKey: ["admin-instances"],
    queryFn: async () => {
      const res = await privateApi.get("/api/instances");
      return res.data as { instances: AdminInstance[] };
    },
  });
}

export function useInstance(id: string) {
  return useQuery({
    queryKey: ["admin-instances", id],
    queryFn: async () => {
      const res = await privateApi.get(`/api/instances/${id}`);
      return res.data as AdminInstance;
    },
    enabled: !!id,
  });
}