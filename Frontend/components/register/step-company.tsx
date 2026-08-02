"use client";

import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Building2, Hash, FileText, MapPin, Phone, FlaskConical, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SegmentedToggle } from "@/components/ui/segmented-toggle";
import { BilingualLabel } from "@/components/register/bilingual-label";
import { GOVERNORATES } from "@/lib/data/governorates";
import { COUNTRIES } from "@/lib/data/countries";
import { ACTIVITIES, OTHER_ACTIVITY_VALUE } from "@/lib/data/activities";
import type { RegisterFormValues } from "@/lib/validations/register";

export function StepCompany() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  const activity = watch("activity");
  const isResident = watch("isResident");

  useEffect(() => {
    if (isResident === false) {
      setValue("exportType", false, { shouldValidate: true, shouldDirty: true });
    }
  }, [isResident, setValue]);
  return (
    <div>
      <h3 className="font-display text-xl text-cream-50">
        Informations sur l&apos;entreprise
        <span dir="rtl" className="ml-2 text-base text-cream-50/60">
          معلومات الشركة
        </span>
      </h3>
      <p className="mt-1.5 mb-6 text-sm text-cream-50/65">
        Ces informations seront vérifiées par le Ministère avant l&apos;activation de votre compte.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        
        <div className="sm:col-span-2">
          <BilingualLabel htmlFor="commName" fr="Nom commercial" ar="الاسم التجاري" required />
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/40">
              <Building2 className="h-4 w-4" />
            </span>
            <Input
              id="commName"
              placeholder="Ex: Huilerie El Baraka"
              hasError={!!errors.commName}
              className="pl-10"
              {...register("commName")}
            />
          </div>
          {errors.commName && (
            <p className="mt-1.5 text-xs text-red-300">{errors.commName.message}</p>
          )}
        </div>

        
        <div>
          <BilingualLabel htmlFor="rne" fr="RNE" ar="السجل الوطني للمؤسسات" required />
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/40">
              <Hash className="h-4 w-4" />
            </span>
            <Input
              id="rne"
              placeholder="Ex: 1234567A"
              hasError={!!errors.rne}
              className="pl-10"
              {...register("rne")}
            />
          </div>
          {errors.rne && (
            <p className="mt-1.5 text-xs text-red-300">{errors.rne.message}</p>
          )}
        </div>

       
        <div>
          <BilingualLabel htmlFor="matFisc" fr="Matricule fiscal" ar="المعرف الجبائي" required />
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/40">
              <FileText className="h-4 w-4" />
            </span>
            <Input
              id="matFisc"
              placeholder="Ex: 1234567/A/M/000"
              hasError={!!errors.matFisc}
              className="pl-10"
              {...register("matFisc")}
            />
          </div>
          {errors.matFisc && (
            <p className="mt-1.5 text-xs text-red-300">{errors.matFisc.message}</p>
          )}
        </div>

        
        <div>
          <BilingualLabel fr="Activité" ar="النشاط" required />
          <Controller
            name="activity"
            control={control}
            render={({ field }) => (
              <Select hasError={!!errors.activity} {...field}>
                <option value="" disabled>
                  Sélectionnez une activité
                </option>
                {ACTIVITIES.map((a) => (
                  <option key={a.value} value={a.value} className="text-black">
                    {a.fr} — {a.ar}
                  </option>
                ))}
                <option value={OTHER_ACTIVITY_VALUE}>Autre — أخرى</option>
              </Select>
            )}
          />
          {errors.activity && (
            <p className="mt-1.5 text-xs text-red-300">{errors.activity.message}</p>
          )}
        </div>

        
        {activity === OTHER_ACTIVITY_VALUE && (
          <div>
            <BilingualLabel
              htmlFor="otherActivity"
              fr="Précisez l'activité"
              ar="حدد النشاط"
              required
            />
            <Input
              id="otherActivity"
              placeholder="Décrivez votre activité"
              hasError={!!errors.otherActivity}
              {...register("otherActivity")}
            />
            {errors.otherActivity && (
              <p className="mt-1.5 text-xs text-red-300">
                {errors.otherActivity.message}
              </p>
            )}
          </div>
        )}

       
        <div className={activity === OTHER_ACTIVITY_VALUE ? "" : "sm:col-span-2"}>
          <BilingualLabel fr="Statut de résidence" ar="صفة الإقامة" required />
          <Controller
            name="isResident"
            control={control}
            render={({ field }) => (
              <SegmentedToggle
                value={field.value}
                onChange={field.onChange}
                hasError={!!errors.isResident}
                options={[
                  { value: true, fr: "Résidente", ar: "مقيمة" },
                  { value: false, fr: "Non-résidente", ar: "غير مقيمة" },
                ]}
              />
            )}
          />
          {errors.isResident && (
            <p className="mt-1.5 text-xs text-red-300">{errors.isResident.message}</p>
          )}
        </div>

        
        <div>
          <BilingualLabel fr="Nationalité du propriétaire" ar="جنسية المالك" required />
          <Controller
            name="nationality"
            control={control}
            render={({ field }) => (
              <Select hasError={!!errors.nationality} {...field}>
                <option value="" disabled>
                  Sélectionnez un pays
                </option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c} className="text-black">
                    {c}
                  </option>
                ))}
              </Select>
            )}
          />
          {errors.nationality && (
            <p className="mt-1.5 text-xs text-red-300">{errors.nationality.message}</p>
          )}
        </div>

        
        <div>
          <BilingualLabel htmlFor="phone" fr="Téléphone" ar="الهاتف" required />
          <div className="relative sm:mt-6.5">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/40">
              <Phone className="h-4 w-4" />
            </span>
            <Input
              id="phone"
              type="tel"
              placeholder="+216 XX XXX XXX"
              hasError={!!errors.phone}
              className="pl-10 "
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="mt-1.5 text-xs text-red-300">{errors.phone.message}</p>
          )}
        </div>

        
        <div className="sm:col-span-2">
          <BilingualLabel htmlFor="address" fr="Adresse" ar="العنوان" required />
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/40">
              <MapPin className="h-4 w-4" />
            </span>
            <Input
              id="address"
              placeholder="Rue, numéro, quartier"
              hasError={!!errors.address}
              className="pl-10"
              {...register("address")}
            />
          </div>
          {errors.address && (
            <p className="mt-1.5 text-xs text-red-300">{errors.address.message}</p>
          )}
        </div>

        
        <div>
          <BilingualLabel fr="Gouvernorat" ar="الولاية" required />
          <Controller
            name="governorate"
            control={control}
            render={({ field }) => (
              <Select hasError={!!errors.governorate} {...field}>
                <option value="" disabled>
                  Sélectionnez un gouvernorat
                </option>
                {GOVERNORATES.map((g) => (
                  <option key={g.value} value={g.value} className="text-black">
                    {g.fr} — {g.ar}
                  </option>
                ))}
              </Select>
            )}
          />
          {errors.governorate && (
            <p className="mt-1.5 text-xs text-red-300">{errors.governorate.message}</p>
          )}
        </div>

        
        <div>
          <BilingualLabel htmlFor="city" fr="Ville" ar="المدينة" required />
          <Input
            id="city"
            placeholder="Ex: Sfax"
            hasError={!!errors.city}
            {...register("city")}
          />
          {errors.city && (
            <p className="mt-1.5 text-xs text-red-300">{errors.city.message}</p>
          )}
        </div>

        
        <div>
          <BilingualLabel fr="Lieu de stockage" ar="مكان التخزين" required />
          <Controller
            name="isRented"
            control={control}
            render={({ field }) => (
              <SegmentedToggle
                value={field.value}
                onChange={field.onChange}
                hasError={!!errors.isRented}
                options={[
                  { value: true, fr: "Loué", ar: "مكتري" },
                  { value: false, fr: "Propriété", ar: "ملك خاص" },
                ]}
              />
            )}
          />
          {errors.isRented && (
            <p className="mt-1.5 text-xs text-red-300">{errors.isRented.message}</p>
          )}
        </div>

        
        <div>
          <BilingualLabel fr="État actuel de l'entreprise" ar="الحالة الحالية للشركة" required />
          <Controller
            name="registerState"
            control={control}
            render={({ field }) => (
              <SegmentedToggle
                value={field.value}
                onChange={field.onChange}
                hasError={!!errors.registerState}
                options={[
                  { value: true, fr: "En activité", ar: "نشيطة" },
                  { value: false, fr: "Suspendue", ar: "معلقة" },
                ]}
              />
            )}
          />
          {errors.registerState && (
            <p className="mt-1.5 text-xs text-red-300">
              {errors.registerState.message}
            </p>
          )}
        </div>

        

        <div className="sm:col-span-2">
          <BilingualLabel
            htmlFor="labName"
            fr="Laboratoire d'analyse"
            ar="مخبر التحليل"
            required
          />
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/40">
              <FlaskConical className="h-4 w-4" />
            </span>
            <Input
              id="labName"
              placeholder="Nom du laboratoire de contrôle qualité"
              hasError={!!errors.labName}
              className="pl-10"
              {...register("labName")}
            />
          </div>
          {errors.labName && (
            <p className="mt-1.5 text-xs text-red-300">{errors.labName.message}</p>
          )}

          <div className="mt-5">
            <BilingualLabel fr="Type d'exportation" ar="نوع التصدير" required />
            <Controller
              name="exportType"
              control={control}
              render={({ field }) => (
                <SegmentedToggle
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isResident === false}
                  hasError={!!errors.exportType}
                  options={[
                    { value: false, fr: "Conditionnée", ar: "معلب" },
                    { value: true, fr: "En vrac", ar: "جميع الأنواع" },
                  ]}
                />
              )}
            />
            {isResident === false && (
              <p className="mt-1.5 flex items-start gap-1.5 text-xs text-cream-50/60">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-300" />
                Les entreprises non-résidentes ne peuvent exporter que de l&apos;huile
                conditionnée (≤ 5 litres).
              </p>
            )}
            {errors.exportType && (
              <p className="mt-1.5 text-xs text-red-300">{errors.exportType.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}