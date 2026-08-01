
import { useQuery } from "@tanstack/react-query";
import { MOCK_ELIGIBLE_MEMBERS } from "@/lib/mockData/eligibleMembers";

export function useEligibleMembers() {
  return useQuery({
    queryKey: ["eligible-members"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_ELIGIBLE_MEMBERS;
    },
  });
}