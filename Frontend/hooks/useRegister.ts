import { useMutation } from "@tanstack/react-query";
import { publicApi } from "@/lib/api/publicApi";
import { type LoginFormValues } from "@/lib/validations/login";
import type { UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";
import { RegisterFormValues } from "@/lib/validations/register";
export function useRegister(
  options?: UseMutationOptions<any, Error, RegisterFormValues>
) {
  return useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      try{
      const response  = await publicApi.post("/api/auth/register", {...data, role : "EXPORTER"});
      return response.data;
      }
      catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message ??
            "Une erreur est survenue lors de l'inscription."
          );
        }

        throw new Error("Une erreur est survenue lors de l'inscription.");
      }
    },
    ...options,
  });
}