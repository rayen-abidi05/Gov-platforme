"use client";

import { UserCircle, Mail, ShieldCheck } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import AdminHeader from "@/components/admin/AdminHeader";
import Spinner from "@/components/ui/spinner";

export default function InspaProfilePage() {
  const { data, isLoading, isError } = useUser();
  const user = data?.user ?? data;

  return (
    <>
      <AdminHeader title="Mon profil" subtitle="Informations de votre compte inspecteur" />

      <main className="mx-auto max-w-2xl px-6 py-8 sm:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="h-10 w-10" />
          </div>
        ) : isError || !user ? (
          <div className="flex items-center justify-center py-24 text-cream-50/70">
            Une erreur est survenue lors du chargement du profil.
          </div>
        ) : (
          <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold-300/10 text-gold-300">
                <UserCircle className="h-9 w-9" />
              </div>
              <div>
                <h2 className="font-display text-xl text-cream-50">{user.name}</h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-cream-50/60">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold-300" />
                  Inspecteur INSPA
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 border-t border-cream-50/10 pt-6 sm:grid-cols-2">
              <div className="flex items-center gap-2.5 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-4">
                <Mail className="h-4 w-4 shrink-0 text-cream-50/50" />
                <div className="min-w-0">
                  <p className="text-xs text-cream-50/50">Email</p>
                  <p className="truncate text-sm text-cream-50">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-cream-50/10 bg-cream-50/[0.03] p-4">
                <ShieldCheck className="h-4 w-4 shrink-0 text-cream-50/50" />
                <div className="min-w-0">
                  <p className="text-xs text-cream-50/50">Rôle</p>
                  <p className="truncate text-sm text-cream-50">Membre INSPA</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
