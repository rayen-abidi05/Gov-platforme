import { useMutation } from "@tanstack/react-query";
import { publicApi } from "@/lib/api/publicApi";
import { type LoginFormValues } from "@/lib/validations/login";
import type { UseMutationOptions } from "@tanstack/react-query";

export function useLogin(
  options?: UseMutationOptions<any, Error, LoginFormValues>
) {
  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await publicApi.post("/api/auth/login", data);
      return res.data;
    },
    ...options,
  });
}