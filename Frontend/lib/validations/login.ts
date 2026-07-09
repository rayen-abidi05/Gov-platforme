import { z } from "zod";



export const loginSchema = z
  .object({
    email : z.string().
    min(1,"L'email est requis.").email("Adresse email invalide."),
    password: z
      .string()
      .min(1, "Le mot de passe est requis.")
      .min(3, "Le mot de passe doit contenir au moins 8 caractères."),
    
  })
  

export type LoginFormValues = z.infer<typeof loginSchema>;