"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ExporterHeader from "@/components/exporter/ExporterHeader";

const companySchema = z.object({
  commName: z.string().min(2, "Requis"),
  activity: z.string().min(2, "Requis"),
  phone: z.string().min(6, "Numéro invalide"),
  address: z.string().min(5, "Requis"),
  city: z.string().min(2, "Requis"),
  governorate: z.string().min(2, "Requis"),
  labName: z.string().min(2, "Requis"),
});
type CompanyFormValues = z.infer<typeof companySchema>;

// TODO: replace with real company data via a hook (e.g. useMyCompany())
const MOCK_COMPANY: CompanyFormValues = {
  commName: "Huilerie El Baraka",
  activity: "Production et export d'huile d'olive",
  phone: "+216 20 000 000",
  address: "Rue de l'Olivier, Zone Industrielle",
  city: "Sfax",
  governorate: "Sfax",
  labName: "Laboratoire Central Sfax",
};

export default function MyCompanyPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: MOCK_COMPANY,
  });

  // TODO: replace with a real useUpdateCompany() mutation once backend exists
  const onSubmit = async (values: CompanyFormValues) => {
    await new Promise((r) => setTimeout(r, 500));
    console.log("TODO: PATCH /api/company", values);
  };

  return (
    <>
      <ExporterHeader title="Mon entreprise" subtitle="Informations de votre société" />

      <main className="mx-auto max-w-2xl px-6 py-8 sm:px-10">
        <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field label="Nom commercial" error={errors.commName?.message} {...register("commName")} />
            <Field label="Activité" error={errors.activity?.message} {...register("activity")} />
            <Field label="Téléphone" error={errors.phone?.message} {...register("phone")} />
            <Field label="Adresse" error={errors.address?.message} {...register("address")} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ville" error={errors.city?.message} {...register("city")} />
              <Field label="Gouvernorat" error={errors.governorate?.message} {...register("governorate")} />
            </div>
            <Field label="Laboratoire d'analyse" error={errors.labName?.message} {...register("labName")} />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gold-300 px-4 py-3 text-sm font-medium text-olive-950 transition-all duration-200 hover:bg-gold-300/90 disabled:opacity-60"
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

function Field({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-cream-50/90">{label}</label>
      <input
        {...props}
        className="mt-1.5 w-full rounded-lg border border-cream-50/15 bg-cream-50/[0.03] px-4 py-2.5 text-sm text-cream-50 outline-none transition-all duration-200 focus:border-gold-300/40"
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}