import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const fileSchema = z
  .instanceof(File, { message: "Ce document est requis" })
  .refine((f) => f.size <= MAX_FILE_SIZE, "Le fichier ne doit pas dépasser 5 Mo")
  .refine((f) => ACCEPTED_TYPES.includes(f.type), "Format accepté : PDF, JPG, PNG");

export const exportRequestSchema = z.object({
  client: z.string().min(2, "Le nom du client est requis"),
  agrimReference: z.string().min(3, "La référence AGRIM est requise"),
  requestedKg: z.coerce
    .number({ error: "Quantité invalide" })
    .positive("La quantité doit être supérieure à 0"),
  agrimFile: fileSchema,
  contractFile: fileSchema,
  ministerialLetterFile: fileSchema,
});

export type ExportRequestFormValues = z.infer<typeof exportRequestSchema>;