"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StepIndicator, type WizardStep } from "@/components/register/step-indicator";
import { StepAccount } from "@/components/register/step-account";
import { StepCompany } from "@/components/register/step-company";
import { StepConfirm } from "@/components/register/step-confirm";
import {
  registerSchema,
  STEP_FIELDS,
  type RegisterFormValues,
} from "@/lib/validations/register";

const STEPS: WizardStep[] = [
  { key: "account", fr: "Compte", ar: "الحساب" },
  { key: "company", fr: "Entreprise", ar: "الشركة" },
  { key: "confirm", fr: "Confirmation", ar: "التأكيد" },
];

export interface RegisterWizardProps {

  onSubmit?: (values: RegisterFormValues) => Promise<void> | void;
}

export function RegisterWizard({ onSubmit }: RegisterWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      commName: "",
      rne: "",
      matFisc: "",
      activity: "",
      otherActivity: "",
      isResident: undefined,
      nationality: "",
      phone: "",
      address: "",
      governorate: "",
      city: "",
      isRented: undefined,
      registerState: undefined,
      labName: "",
      acceptTerms: false as unknown as true,
    },
  });

  const { trigger, handleSubmit } = methods;

  const isLastStep = stepIndex === STEPS.length - 1;

  async function goNext() {
    const currentKey = STEPS[stepIndex].key as keyof typeof STEP_FIELDS;
    const fieldsToValidate = STEP_FIELDS[currentKey];
    const valid = await trigger(fieldsToValidate as any);
    if (valid) setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function submit(values: RegisterFormValues) {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
    } catch {
      setSubmitError(
        "Une erreur est survenue lors de la soumission. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(submit)}
        noValidate
        onKeyDown={(e) => {
          
          if (e.key === "Enter" && !isLastStep) {
            e.preventDefault();
            goNext();
          }
        }}
      >
        <StepIndicator steps={STEPS} currentIndex={stepIndex} />

        {submitError && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            {submitError}
          </div>
        )}

        {stepIndex === 0 && <StepAccount />}
        {stepIndex === 1 && <StepCompany />}
        {stepIndex === 2 && <StepConfirm />}

        <div className="mt-8 flex items-center gap-3">
          {stepIndex > 0 && (
            <Button type="button" variant="outline" onClick={goBack} className="flex-1">
              <ArrowLeft className="h-4 w-4" />
              Précédent
            </Button>
          )}

          {!isLastStep ? (
            <Button type="button" onClick={goNext} className="flex-1">
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              {isSubmitting ? (
                "Envoi en cours..."
              ) : (
                <>
                  <span>S&apos;inscrire</span>
                  <span dir="rtl" className="ml-1 text-xs opacity-80">
                    إنشاء حساب
                  </span>
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}