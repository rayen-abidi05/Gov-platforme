import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { publicApi } from "@/lib/api/publicApi";
import { type LoginFormValues } from "@/lib/validations/login";
import { ROLE_HOME_ROUTE } from "@/lib/auth/roleAccess";

interface LoginResponse {
  id?: string;
  role: "EXPORTER" | "ADMIN" | "OBSERVATOR" | "DIWAN_MEMBER" | "MINISTER" |"INSPA";
  status?: "APPROVED" | "REJECTED";
  name?: string;
  email?: string;
}

export function useLogin(
  options?: UseMutationOptions<LoginResponse, Error, LoginFormValues>
) {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await publicApi.post("/api/auth/login", data);
      return res.data as LoginResponse;
    },

    onSuccess: (data) => {
      if (data.role === "EXPORTER" ) {
        router.replace("/");
      } else {
        router.replace(ROLE_HOME_ROUTE[data.role]);
      }
    },
    ...options,
  });
}