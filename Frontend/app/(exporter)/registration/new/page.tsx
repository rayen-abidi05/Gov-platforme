"use client";


import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  ShieldCheck, Leaf } from "lucide-react";
import { useSubmitRegistration } from "@/hooks/useSubmitRegistration";
import { documentsSchema, DocumentsFormValues } from "@/lib/validations/documentsSchema";
import { getRequiredDocTypes, DOCUMENT_LABELS, } from "@/lib/documentConfig";
import DocumentSlot from "@/components/DocumentSlot";
import Navbar from "@/components/Navbar.tsx"
import { useCompany } from "@/hooks/useCompany";
const MOCK_IS_RENTED = true;

export default function RegistrationPage() {
  const {data : company} = useCompany()
  const isRented = company?.company.isRented ;
  console.log(isRented)
  const requiredTypes = getRequiredDocTypes(isRented);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DocumentsFormValues>({
    resolver: zodResolver(documentsSchema),
  });

  const { mutateAsync, isPending, isError, error } = useSubmitRegistration();

  const onSubmit = async (values: DocumentsFormValues) => {
    if (isRented && !values.RENTEDDECLARATION) {
      setError("RENTEDDECLARATION", { message: "Ce document est requis" });
      return;
    }
    if (!isRented && !values.CERTIFICATIONOWNERSHIP) {
      setError("CERTIFICATIONOWNERSHIP", { message: "Ce document est requis" });
      return;
    }
    await mutateAsync(values);
  };

  return (
    <main className="relative min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-12 sm:px-10 lg:py-16">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Leaf className="h-6 w-6 text-gold-300" />
            <span className="font-display text-lg tracking-wide">
              MARP
            </span>
          </div>
          
        </div>

        <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-8 sm:p-10">
          <h1 className="font-display text-2xl sm:text-3xl">
            Finaliser votre demande d'inscription
          </h1>
          <p className="mt-2 text-sm text-cream-50/70">
            Téléversez les documents requis. Votre dossier sera vérifié par le
            Ministère avant l'activation de votre accès.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            <h2 className="text-sm font-medium text-cream-50/90">
              Documents requis
              <span className="ml-1.5 text-xs text-cream-50/50">الوثائق المطلوبة</span>
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {requiredTypes.map((type) => (
                <Controller
                  key={type}
                  name={type}
                  control={control}
                  render={({ field: { onChange, ref } }) => (
                    <DocumentSlot
                      docType={type}
                      label={DOCUMENT_LABELS[type]}
                      disabled={isPending}
                      error={(errors as any)[type]?.message}
                      onChange={(file) => onChange(file)}
                      inputRef={ref}
                    />
                  )}
                />
              ))}
            </div>

            {isError && (
              <div className="mt-4 rounded-lg border border-red-400/30 bg-red-950/20 p-3 text-sm text-red-300">
                {(error as any)?.response?.data?.message ??
                  "Une erreur est survenue lors de l'envoi. Veuillez réessayer."}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-gold-300 px-4 py-3 text-sm font-medium text-olive-950 transition-all duration-200 hover:bg-gold-300/90 disabled:opacity-60"
            >
              {isPending ? "Envoi en cours..." : "Soumettre la demande"}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-2 text-xs text-cream-50/50">
            <ShieldCheck className="h-3.5 w-3.5 text-gold-300" />
            <span>Accès chiffré et conforme aux normes du Ministère</span>
          </div>
        </div>
      </div>
    </main>
  );
}