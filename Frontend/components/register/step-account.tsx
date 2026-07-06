import { useFormContext } from "react-hook-form";
import { User, Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BilingualLabel } from "@/components/register/bilingual-label";
import type { RegisterFormValues } from "@/lib/validations/register";

export function StepAccount() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  return (
    <div>
      <h3 className="font-display text-xl text-cream-50">
        Informations du compte
        <span dir="rtl" className="ml-2 text-base text-cream-50/60">
          معلومات الحساب
        </span>
      </h3>
      <p className="mt-1.5 mb-6 text-sm text-cream-50/65">
        Ces informations vous permettront de vous connecter à votre espace exportateur.
      </p>

      <div className="mb-5">
        <BilingualLabel htmlFor="name" fr="Nom complet" ar="الاسم الكامل" required />
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/40">
            <User className="h-4 w-4" />
          </span>
          <Input
            id="name"
            placeholder="Votre nom et prénom"
            autoComplete="name"
            hasError={!!errors.name}
            className="pl-10"
            {...register("name")}
          />
        </div>
        {errors.name && (
          <p className="mt-1.5 text-xs text-red-300">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-5">
        <BilingualLabel htmlFor="email" fr="Email" ar="البريد الإلكتروني" required />
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/40">
            <Mail className="h-4 w-4" />
          </span>
          <Input
            id="email"
            type="email"
            placeholder="nom@entreprise.tn"
            autoComplete="email"
            hasError={!!errors.email}
            className="pl-10"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-300">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-5">
        <BilingualLabel htmlFor="password" fr="Mot de passe" ar="كلمة السر" required />
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/40">
            <Lock className="h-4 w-4" />
          </span>
          <Input
            id="password"
            type="password"
            placeholder="Au moins 8 caractères"
            autoComplete="new-password"
            hasError={!!errors.password}
            className="pl-10"
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-300">{errors.password.message}</p>
        )}
      </div>

      <div>
        <BilingualLabel
          htmlFor="confirmPassword"
          fr="Confirmer le mot de passe"
          ar="تأكيد كلمة السر"
          required
        />
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/40">
            <Lock className="h-4 w-4" />
          </span>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Retapez le mot de passe"
            autoComplete="new-password"
            hasError={!!errors.confirmPassword}
            className="pl-10"
            {...register("confirmPassword")}
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-red-300">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
    </div>
  );
}