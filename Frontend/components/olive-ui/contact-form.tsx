"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact";

const CONTACT_EMAIL = "bo.brcmarh@iresa.agrinet.tn";

export function ContactForm() {
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(values: ContactFormValues) {
    const subject = encodeURIComponent(
      `Contact — ${values.firstName} ${values.lastName}`
    );
    const body = encodeURIComponent(
      `Nom : ${values.firstName} ${values.lastName}\n` +
        `Email : ${values.email}\n` +
        `Téléphone : ${values.phone}\n\n` +
        `Message :\n${values.message}`
    );

    const mailLink = document.createElement("a");
    mailLink.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    mailLink.click();

    setIsSent(true);
    reset();
  }

  if (isSent) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gold-300/30 bg-gold-300/10 px-6 py-10 text-center">
        <CheckCircle2 className="h-8 w-8 text-gold-300" />
        <p className="font-display text-xl text-cream-50">
          Merci de nous avoir contactés
        </p>
        <p className="max-w-sm text-sm text-cream-50/70">
          Votre client de messagerie s&apos;est ouvert avec votre message
          pré-rempli. Notre équipe vous répondra dans les plus brefs délais.
        </p>
        <button
          type="button"
          onClick={() => setIsSent(false)}
          className="mt-2 text-sm font-medium text-gold-300 underline-offset-2 hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form className="w-full" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Prénom"
            autoComplete="given-name"
            hasError={!!errors.firstName}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="mt-1.5 text-xs text-red-300">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Nom"
            autoComplete="family-name"
            hasError={!!errors.lastName}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="mt-1.5 text-xs text-red-300">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Votre email"
          autoComplete="email"
          hasError={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-300">{errors.email.message}</p>
        )}
      </div>

      <div className="mt-5">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+216 00 000 000"
          autoComplete="tel"
          hasError={!!errors.phone}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="mt-1.5 text-xs text-red-300">{errors.phone.message}</p>
        )}
      </div>

      <div className="mt-5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={5}
          placeholder="Votre message"
          hasError={!!errors.message}
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-red-300">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button type="submit" isLoading={isSubmitting} className="mt-7 w-auto px-8">
        <Send className="h-4 w-4" />
        Envoyer le message
      </Button>
    </form>
  );
}