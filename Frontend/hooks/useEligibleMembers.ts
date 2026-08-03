import { useQuery } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";

import { CommitteeMember } from "@/types/instance";

export function useEligibleMembers() {
  return useQuery({
    queryKey: ["eligible-members"],

    queryFn: async () => {
      const res = await privateApi.get<CommitteeMember[]>(
        "/api/instances/members"
      );

      return res.data;
    },
  });
}