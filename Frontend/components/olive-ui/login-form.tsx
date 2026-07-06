"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Mail,
  Hash,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema, type LoginFormValues } from "@/lib/validations/login";
import { ROLE_REDIRECTS, type LoginResponse } from "@/types/auth";


export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>();

 

  async function onSubmit(values: LoginFormValues) {
    
  }

  return (
    <form  className="w-full" noValidate>
      

      
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <Label htmlFor="identifier">
            Email
          </Label>
         
        </div>

        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/40">
            
              <Mail className="h-4 w-4" />
           
              
            
          </span>
          <Input
            id="identifier"
            type="email" 
            placeholder="nom@entreprise.tn"
            autoComplete="email"
            hasError={!!errors.identifier}
            className="pl-10"
            {...register("identifier")}
          />
        </div>
        {errors.identifier && (
          <p className="mt-1.5 text-xs text-red-300">
            {errors.identifier.message}
          </p>
        )}
      </div>

      
      <div className="mb-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/40">
            <Lock className="h-4 w-4" />
          </span>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Votre mot de passe"
            autoComplete="current-password"
            hasError={!!errors.password}
            className="pl-10 pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-900/40 hover:text-ink-900/70"
            aria-label={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-300">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-body text-cream-50/80">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
          Se souvenir de moi
        </label>
        <a
          href="/forgot-password"
          className="text-sm font-body text-gold-300 underline-offset-2 hover:underline"
        >
          Mot de passe oublié ?
        </a>
      </div>

      <Button type="submit" isLoading={isSubmitting}>
        {isSubmitting ? "Connexion en cours..." : "Se connecter"}
      </Button>

      <div className="mt-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-cream-50/20" />
        <span className="text-xs font-body text-cream-50/50">
          Plateforme officielle du Ministère
        </span>
        <span className="h-px flex-1 bg-cream-50/20" />
      </div>

      <p className="mt-6 text-center text-sm font-body text-cream-50/70">
        Nouvel exportateur ?{" "}
        <Link
          href="/register"
          className="font-medium text-gold-300 underline-offset-2 hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </form>
  );
}