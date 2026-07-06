import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { GOVERNORATES } from "@/lib/data/governorates";
import { ACTIVITIES, OTHER_ACTIVITY_VALUE } from "@/lib/data/activities";
import type { RegisterFormValues } from "@/lib/validations/register";

function ReviewRow({ fr, ar, value }: { fr: string; ar: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-cream-50/10 py-2 text-sm">
      <span className="text-cream-50/55">
        {fr} <span dir="rtl" className="text-xs">({ar})</span>
      </span>
      <span className="text-right font-medium text-cream-50">{value || "—"}</span>
    </div>
  );
}

export function StepConfirm() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  const values = watch();
  const activityLabel =
    values.activity === OTHER_ACTIVITY_VALUE
      ? values.otherActivity
      : ACTIVITIES.find((a) => a.value === values.activity)?.fr;
  const governorateLabel = GOVERNORATES.find(
    (g) => g.value === values.governorate
  )?.fr;

  return (
    <div>
      <h3 className="font-display text-xl text-cream-50">
        Vérification et confirmation
        <span dir="rtl" className="ml-2 text-base text-cream-50/60">
          التحقق والتأكيد
        </span>
      </h3>
      <p className="mt-1.5 mb-6 text-sm text-cream-50/65">
        Vérifiez vos informations avant de soumettre votre demande d&apos;inscription.
      </p>

      <div className="rounded-xl border border-cream-50/15 bg-cream-50/5 px-4 py-2">
        <ReviewRow fr="Nom" ar="الاسم" value={values.name} />
        <ReviewRow fr="Email" ar="البريد" value={values.email} />
        <ReviewRow fr="Entreprise" ar="الشركة" value={values.commName} />
        <ReviewRow fr="RNE" ar="السجل الوطني" value={values.rne} />
        <ReviewRow fr="Matricule fiscal" ar="المعرف الجبائي" value={values.matFisc} />
        <ReviewRow fr="Activité" ar="النشاط" value={activityLabel ?? ""} />
        <ReviewRow
          fr="Gouvernorat"
          ar="الولاية"
          value={governorateLabel ?? ""}
        />
        <ReviewRow fr="Ville" ar="المدينة" value={values.city} />
        <ReviewRow fr="Téléphone" ar="الهاتف" value={values.phone} />
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-2.5 text-sm font-body text-cream-50/85">
        <Controller
          name="acceptTerms"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="mt-0.5"
            />
          )}
        />
        <span>
          J&apos;accepte les{" "}
          <a href="/terms" className="text-gold-300 underline-offset-2 hover:underline">
            conditions d&apos;utilisation
          </a>{" "}
          de la plateforme.
          <span dir="rtl" className="mt-0.5 block text-xs text-cream-50/60">
            أوافق على شروط استخدام المنصة
          </span>
        </span>
      </label>
      {errors.acceptTerms && (
        <p className="mt-1.5 text-xs text-red-300">
          {errors.acceptTerms.message as string}
        </p>
      )}
    </div>
  );
}