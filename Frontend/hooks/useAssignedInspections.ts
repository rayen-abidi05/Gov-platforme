
import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";

export function useAssignedInspections() {
  return useQuery({
    queryKey: ["inspa-assigned"],
    queryFn: async () => {
      const res = await privateApi.get("/api/inspections/assigned");
      return res.data as {
        inspections: {
          id: string;
          registrationRequest: {
            company: { commName: string; governorate: string };
          };
          createdAt: string;
          status: string;
        }[];
      };
    },
  });
}