import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis."),
  lastName: z.string().min(1, "Le nom est requis."),
  email: z
    .string()
    .min(1, "L'email est requis.")
    .email("Adresse email invalide."),
  phone: z
    .string()
    .min(1, "Le numéro de téléphone est requis.")
    .min(8, "Numéro de téléphone invalide."),
  message: z
    .string()
    .min(1, "Le message est requis.")
    .min(10, "Votre message doit contenir au moins 10 caractères."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;