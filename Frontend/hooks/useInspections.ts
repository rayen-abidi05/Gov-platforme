import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { privateApi } from "@/lib/api/privateApi";
import {
  ApiInspection,
  InspectionDecisionValue,
  InspectionPriority,
  InspectionStatus,
} from "@/types/inspection";

// ---------- list (role-aware: admin sees all, INSPA sees own) ----------
export function useInspections(status?: InspectionStatus) {
  return useQuery({
    queryKey: ["inspections", status ?? "ALL"],
    queryFn: async () => {
      const res = await privateApi.get("/api/inspections", {
        params: status ? { status } : undefined,
      });
      return res.data as { inspections: ApiInspection[] };
    },
  });
}

// ---------- single inspection ----------
export function useInspection(id: string | undefined) {
  return useQuery({
    queryKey: ["inspection", id],
    queryFn: async () => {
      const res = await privateApi.get(`/api/inspections/${id}`);
      return res.data as { inspection: ApiInspection };
    },
    enabled: !!id,
  });
}

// ---------- admin: list INSPA users for the assignment dropdown ----------
export function useInspectors() {
  return useQuery({
    queryKey: ["inspectors"],
    queryFn: async () => {
      const res = await privateApi.get("/api/inspections/inspectors");
      return res.data as { inspectors: { id: string; name: string; email: string }[] };
    },
  });
}

// ---------- admin: create an inspection request (optionally assigning immediately) ----------
export function useCreateInspection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      companyId: string;
      priority?: InspectionPriority;
      notes?: string;
      inspectorId?: string;
    }) => {
      const res = await privateApi.post("/api/inspections", payload);
      return res.data as { inspection: ApiInspection };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspections"] });
    },
  });
}

// ---------- admin: assign / reassign an inspector ----------
export function useAssignInspection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, inspectorId }: { id: string; inspectorId: string }) => {
      const res = await privateApi.patch(`/api/inspections/${id}/assign`, { inspectorId });
      return res.data as { inspection: ApiInspection };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inspections"] });
      queryClient.invalidateQueries({ queryKey: ["inspection", variables.id] });
    },
  });
}

// ---------- INSPA: mark an inspection as under review ----------
export function useStartInspectionReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await privateApi.patch(`/api/inspections/${id}/review`);
      return res.data as { inspection: ApiInspection };
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["inspections"] });
      queryClient.invalidateQueries({ queryKey: ["inspection", id] });
    },
  });
}

// ---------- INSPA: submit a decision (approve / reject) ----------
export function useSubmitInspectionDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      decision,
      comment,
    }: {
      id: string;
      decision: InspectionDecisionValue;
      comment?: string;
    }) => {
      const res = await privateApi.post(`/api/inspections/${id}/decision`, { decision, comment });
      return res.data as { inspection: ApiInspection };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inspections"] });
      queryClient.invalidateQueries({ queryKey: ["inspection", variables.id] });
    },
  });
}
