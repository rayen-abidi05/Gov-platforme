import { z } from "zod";
import { OTHER_ACTIVITY_VALUE } from "@/lib/data/activities";

export const registerSchema = z
  .object({
    
    name: z.string().min(1, "Le nom est requis."),
    email: z
      .string()
      .min(1, "L'email est requis.")
      .email("Adresse email invalide."),
    password: z
      .string()
      .min(1, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe."),

  
    commName: z.string().min(1, "Le nom commercial est requis."),
    rne: z.string().min(1, "Le RNE est requis."),
    matFisc: z.string().min(1, "Le matricule fiscal est requis."),
    activity: z.string().min(1, "L'activité est requise."),
    otherActivity: z.string().optional(),
    isResident: z.boolean({
      message: "Veuillez préciser le statut de résidence.",
    }),
    exportType: z.boolean({
      message: "Veuillez préciser le type d' exportation.",
    }),
    nationality: z.string().min(1, "La nationalité est requise."),
    phone: z
      .string()
      .min(1, "Le téléphone est requis.")
      .regex(/^[0-9+\s]{6,}$/, "Numéro de téléphone invalide."),
    address: z.string().min(1, "L'adresse est requise."),
    governorate: z.string().min(1, "Le gouvernorat est requis."),
    city: z.string().min(1, "La ville est requise."),
    isRented: z.boolean({
        message: "Veuillez préciser l' etat de lieux de Stockage'.",
      }),
    registerState: z.boolean({
        message: "Veuillez préciser l'etat de l entreprise.",
      }),
    labName: z.string().min(1, "Le nom du laboratoire est requis."),


    acceptTerms: z.literal(true, {
      message: "Vous devez accepter les conditions d'utilisation.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Les mots de passe ne correspondent pas.",
      });
    }
    if (
      data.activity === OTHER_ACTIVITY_VALUE &&
      !(data.otherActivity && data.otherActivity.trim().length > 0)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["otherActivity"],
        message: "Veuillez préciser l'activité.",
      });
    }
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const STEP_FIELDS = {
  account: ["name", "email", "password", "confirmPassword"] as const,
  company: [
    "commName",
    "rne",
    "matFisc",
    "activity",
    "otherActivity",
    "isResident",
    "nationality",
    "phone",
    "address",
    "governorate",
    "city",
    "isRented",
    "registerState",
    "labName",
  ] as const,
  confirm: ["acceptTerms"] as const,
};