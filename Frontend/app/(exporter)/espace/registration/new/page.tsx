"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ShieldCheck, Save } from "lucide-react";
import { toast } from "sonner";
import { useSubmitRegistration } from "@/hooks/useSubmitRegistration";
import { documentsSchema, DocumentsFormValues } from "@/lib/validations/documentsSchema";
import { getRequiredDocTypes, DOCUMENT_LABELS } from "@/lib/documentConfig";
import DocumentSlot from "@/components/DocumentSlot";
import { useCompany } from "@/hooks/useCompany";
import ExporterHeader from "@/components/exporter/ExporterHeader";
import Link from "next/link";

const DRAFT_KEY = "registration-draft-requestText";

export default function EspaceNewRegistrationPage() {
  const { data: company } = useCompany();
  const isRented = company?.company.isRented;
  const isResident = company?.company.isResident;

  const requiredTypes = getRequiredDocTypes(isRented, isResident);

  const {
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<DocumentsFormValues>({
    resolver: zodResolver(documentsSchema),
  });

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(DRAFT_KEY) : null;
    if (saved) {
      setValue("requestText", saved);
    }
  }, [setValue]);

  const handleSaveDraft = () => {
    const values = getValues();
    if (values.requestText) {
      localStorage.setItem(DRAFT_KEY, values.requestText);
    }
    toast.success("Brouillon enregistré. Vous pouvez revenir plus tard pour continuer.");
  };

  const { mutateAsync, isPending, isError, error } = useSubmitRegistration({
    redirectTo: "/espace/registration",
  });

  const onSubmit = async (values: DocumentsFormValues) => {
    if (isRented && !values.RENTEDDECLARATION) {
      setError("RENTEDDECLARATION", { message: "Ce document est requis" });
      return;
    }
    if (!isRented && !values.CERTIFICATIONOWNERSHIP) {
      setError("CERTIFICATIONOWNERSHIP", { message: "Ce document est requis" });
      return;
    }
    if (!isResident) {
      if (!values.DIWAN) {
        setError("DIWAN", { message: "Ce document est requis" });
        return;
      }
      if (!values.MARKETCONTROLDECLARATION) {
        setError("MARKETCONTROLDECLARATION", { message: "Ce document est requis" });
        return;
      }
      if (!values.requestText || !values.requestText.trim()) {
        setError("requestText", { message: "Ce champ est requis" });
        return;
      }
    }
    await mutateAsync(values);
    if (typeof window !== "undefined") localStorage.removeItem(DRAFT_KEY);
  };

  return (
    <>
      <ExporterHeader title="Nouvelle demande d'inscription" subtitle="Téléversez les documents requis" />

      <main className="mx-auto max-w-3xl px-6 py-8 sm:px-10">
        <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-8 sm:p-10">
          <h1 className="font-display text-2xl sm:text-3xl">
            Finaliser votre demande d'inscription
          </h1>
          <p className="mt-2 text-sm text-cream-50/70">
            Téléversez les documents requis. Votre dossier sera vérifié par le
            Ministère avant l'activation de votre accès.
          </p>
          <p className="mt-1 text-xs text-gold-300 opacity-55">
            Les documents téléversés doivent être des scans clairs et lisibles
             des pièces originales. Toute falsification ou altération constitue
              une infraction passible de sanctions.
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

            {isResident === false && (
              <div className="mt-6">
                <h2 className="text-sm font-medium text-cream-50/90">
                  Demande adressée au Ministre
                  <span className="ml-1.5 text-xs text-cream-50/50">مطلب موجه إلى السيد الوزير</span>
                </h2>
                <p className="mt-1 text-xs text-cream-50/50">
                  Décrivez votre demande d'inscription sur la liste des exportateurs
                  d'huile d'olive tunisienne conditionnée.
                </p>
                <textarea
                  {...register("requestText")}
                  rows={5}
                  disabled={isPending}
                  placeholder="Rédigez votre demande..."
                  className="mt-3 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] p-3 text-sm text-cream-50 placeholder:text-cream-50/30 focus:border-gold-300/40 focus:outline-none disabled:opacity-60"
                />
                {errors.requestText && (
                  <p className="mt-1.5 text-xs text-red-300">{errors.requestText.message}</p>
                )}
              </div>
            )}
            <div>
              <input type="checkbox" id="terms" required disabled={isPending} className="mr-2" />
              <label htmlFor="terms" className="text-sm text-cream-50/80">
              Je déclare que les documents fournis sont authentiques et conformes aux originaux, conformément aux{" "}
              <Link href="/terms" target="_blank" className="text-gold-300 hover:underline">
                conditions d'utilisation
              </Link>
            </label>
            </div>

            {isError && (
              <div className="mt-4 rounded-lg border border-red-400/30 bg-red-950/20 p-3 text-sm text-red-300">
                {(error as any)?.response?.data?.message ??
                  "Une erreur est survenue lors de l'envoi. Veuillez réessayer."}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isPending}
                className="flex items-center justify-center gap-2 rounded-lg border border-cream-50/15 px-4 py-3 text-sm font-medium text-cream-50/80 transition-all duration-200 hover:bg-cream-50/5 disabled:opacity-60 sm:flex-1"
              >
                <Save className="h-4 w-4" />
                Enregistrer le brouillon
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isPending}
                className="flex items-center justify-center gap-2 rounded-lg bg-gold-300 px-4 py-3 text-sm font-medium text-olive-950 transition-all duration-200 hover:bg-gold-300/90 disabled:opacity-60 sm:flex-1"
              >
                {isPending ? "Envoi en cours..." : "Soumettre la demande"}
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center gap-2 text-xs text-cream-50/50">
            <ShieldCheck className="h-3.5 w-3.5 text-gold-300" />
            <span>Accès chiffré et conforme aux normes du Ministère</span>
          </div>
        </div>
      </main>
    </>
  );
}
