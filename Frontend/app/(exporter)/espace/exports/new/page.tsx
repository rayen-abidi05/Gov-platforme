"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import { useCreateExportRequest } from "@/hooks/useCreateExportRequest";
import { exportRequestSchema, ExportRequestFormValues } from "@/lib/validations/exportRequest";
import ExporterHeader from "@/components/exporter/ExporterHeader";

export default function NewExportRequestPage() {
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExportRequestFormValues>({
    // resolver: zodResolver(exportRequestSchema),
  });

  const { mutateAsync, isPending, isError } = useCreateExportRequest();

  const onSubmit = async (values: ExportRequestFormValues) => {
    await mutateAsync(values);
    router.push("/dashboard/exports");
  };

  return (
    <>
      <ExporterHeader title="Nouvelle demande d'exportation" subtitle="Dans le cadre du contingent (داخل الحصة)" />

      <main className="mx-auto max-w-2xl px-6 py-8 sm:px-10">
        <button
          onClick={() => router.push("/dashboard/exports")}
          className="mb-6 flex items-center gap-1.5 text-sm text-cream-50/60 transition-colors duration-150 hover:text-gold-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>

        <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-cream-50/90">
                Nom du client
                <span className="ml-1.5 text-xs text-cream-50/50">اسم العميل</span>
              </label>
              <input
                {...register("client")}
                placeholder="Ex: Acétites Coosur S.A."
                className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-4 py-2.5 text-sm text-cream-50 placeholder:text-cream-50/40 outline-none transition-all duration-200 focus:border-gold-300/40"
              />
              {errors.client && <p className="mt-1 text-xs text-red-400">{errors.client.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-cream-50/90">Référence AGRIM</label>
                <input
                  {...register("agrimReference")}
                  placeholder="Ex: 20FFFF1"
                  className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-4 py-2.5 text-sm text-cream-50 placeholder:text-cream-50/40 outline-none transition-all duration-200 focus:border-gold-300/40"
                />
                {errors.agrimReference && (
                  <p className="mt-1 text-xs text-red-400">{errors.agrimReference.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-cream-50/90">Quantité (kg)</label>
                <input
                  type="number"
                  {...register("requestedKg")}
                  placeholder="Ex: 200"
                  className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-4 py-2.5 text-sm text-cream-50 placeholder:text-cream-50/40 outline-none transition-all duration-200 focus:border-gold-300/40"
                />
                {errors.requestedKg && (
                  <p className="mt-1 text-xs text-red-400">{errors.requestedKg.message}</p>
                )}
              </div>
            </div>

            <h3 className="pt-2 text-sm font-medium text-cream-50/90">
              Documents requis
              <span className="ml-1.5 text-xs text-cream-50/50">الوثائق المطلوبة</span>
            </h3>

            <FileField
              name="agrimFile"
              control={control}
              label="Certificat AGRIM"
              error={errors.agrimFile?.message as string}
            />
            <FileField
              name="contractFile"
              control={control}
              label="Contrat avec le client"
              error={errors.contractFile?.message as string}
            />
            <FileField
              name="ministerialLetterFile"
              control={control}
              label="Lettre d'autorisation ministérielle"
              error={errors.ministerialLetterFile?.message as string}
            />

            {isError && (
              <div className="rounded-lg border border-red-400/30 bg-red-950/20 p-3 text-sm text-red-300">
                Une erreur est survenue. Veuillez réessayer.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="w-full rounded-lg bg-gold-300 px-4 py-3 text-sm font-medium text-olive-950 transition-all duration-200 hover:bg-gold-300/90 disabled:opacity-60"
            >
              {isPending ? "Envoi en cours..." : "Soumettre la demande"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

function FileField({
  name,
  control,
  label,
  error,
}: {
  name: "agrimFile" | "contractFile" | "ministerialLetterFile";
  control: any;
  label: string;
  error?: string;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <label
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-4 transition-all duration-200 ${
            error ? "border-red-400/40" : "border-cream-50/15 hover:border-gold-300/30"
          }`}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <FileText className="h-4.5 w-4.5 shrink-0 text-cream-50/40" />
            <div className="min-w-0">
              <p className="text-sm text-cream-50">{label}</p>
              {value && <p className="truncate text-xs text-gold-300/80">{value.name}</p>}
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
          </div>
          <Upload className="h-4 w-4 shrink-0 text-cream-50/50" />
          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          />
        </label>
      )}
    />
  );
}