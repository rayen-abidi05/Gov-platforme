// lib/schemas/documentsSchema.ts
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const fileSchema = z
  .instanceof(File, { message: "Ce document est requis" })
  .refine((file) => file.size <= MAX_FILE_SIZE, "Le fichier ne doit pas dépasser 5 Mo")
  .refine((file) => ACCEPTED_TYPES.includes(file.type), "Format accepté : PDF, JPG, PNG");

const optionalFileSchema = fileSchema.optional().nullable();

export const documentsSchema = z.object({
  RNE: fileSchema,
  TAXREALTED: fileSchema,
  DIWAN: fileSchema,
  QUITTANCE: fileSchema,
  EXISTANCEDECLARATION: fileSchema,
  LABDOC: fileSchema,
  RENTEDDECLARATION: optionalFileSchema,
  CERTIFICATIONOWNERSHIP: optionalFileSchema,
});

export type DocumentsFormValues = z.infer<typeof documentsSchema>;