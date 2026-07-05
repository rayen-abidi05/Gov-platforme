import { z } from "zod";

/**
 * RNE = Registre National des Entreprises — the Tunisian company
 * registration number exporters authenticate with instead of an email.
 * Format: 7 digits + 1 letter, e.g. 1234567A. Adjust to the real
 * registry format once confirmed with the Ministry's back office.
 */
const RNE_REGEX = /^[0-9]{7}[A-Za-z]$/;

export const loginSchema = z
  .object({
    identifier: z
      .string()
      .min(1, "Entrez votre email ou votre RNE."),
    identifierType: z.enum(["email", "rne"]),
    password: z
      .string()
      .min(1, "Le mot de passe est requis.")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    rememberMe: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.identifierType === "email") {
      const emailCheck = z.string().email().safeParse(data.identifier);
      if (!emailCheck.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["identifier"],
          message: "Adresse email invalide.",
        });
      }
    } else {
      if (!RNE_REGEX.test(data.identifier)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["identifier"],
          message: "Format RNE invalide (ex: 1234567A).",
        });
      }
    }
  });

export type LoginFormValues = z.infer<typeof loginSchema>;