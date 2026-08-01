"use client";


import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, RefreshCcw, Plus, ArrowLeft } from "lucide-react";
import { useMyRegistrationRequests } from "@/hooks/useMyRegistrationRequests";
import { useModifyDocument } from "@/hooks/useModifyDocument";
import { getRequiredDocTypes, DOCUMENT_LABELS } from "@/lib/documentConfig";
import { DocType } from "@/types/registration";
import NotificationBell from "@/components/NotificationBell";
import Spinner from "@/components/ui/spinner";

const STEPS = [
  { key: "PENDING", label: "Envoyée" },
  { key: "UNDER_REVIEW", label: "En cours d'examen" },
  { key: "APPROVED", label: "Approuvée" },
];

export default function RegistrationTrackingPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useMyRegistrationRequests();

  const requestId = data?.requests?.[0]?.id ?? "";
  const { mutate: modifyDoc, isPending: isModifying } = useModifyDocument(requestId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-olive-950">
        <Spinner size="h-10 w-10" />
      </div>
    );
  }

 if (isError || !data?.requests?.length) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-olive-950 text-cream-50/70">
      <p className="text-center text-sm">
        Aucune demande d'inscription trouvée.
      </p>

      <p className="mt-2 text-center text-xs text-cream-50/50">
        Remplacez un document via l'icône, ou repartez de zéro :
      </p>

      <button
        onClick={() => router.push("/registration/new")}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-cream-50/15 px-4 py-2.5 text-sm font-medium text-cream-50/80 transition-all duration-200 hover:bg-cream-50/5"
      >
        <Plus className="h-4 w-4" />
        Créer une nouvelle demande
      </button>
    </div>
  );
}
  const request = data.requests[0];
  const requiredTypes = getRequiredDocTypes(request.company.isRented, request.company.isResident);
  const uploadedMap = new Map(request.documents.map((d) => [d.DocType, d]));
  const isRejected = request.status === "REJECTED";

  const handleReplace = (docType: DocType, file: File) => {
    modifyDoc({ docType, file });
  };

  return (
    <main className="min-h-screen w-full bg-olive-950 font-body text-cream-50">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-10 lg:py-16">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-ministere.png"
              alt="Ministère de l'Agriculture"
              width={90}
              height={55}
              className="h-10 w-auto object-contain"
            />
            <span className="font-display text-lg tracking-wide">MARHP</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-cream-50/15 px-3.5 py-2 text-sm text-cream-50/80 transition-all duration-200 hover:border-gold-300/30 hover:text-gold-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Accueil
            </Link>
            <NotificationBell />
          </div>
        </div>

        <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-8 sm:p-10">
          <h1 className="font-display text-2xl sm:text-3xl">Suivi de votre demande d'inscription</h1>
          <p className="mt-2 text-sm text-cream-50/70">
            Votre dossier sera vérifié par le Ministère avant l'activation de votre accès.
          </p>

          
          <div className="mt-8">
            {isRejected ? (
              <div className="rounded-lg border border-red-400/30 bg-red-950/20 p-4">
                <p className="text-sm font-medium text-red-300">Statut : Demande rejetée</p>
                {request.notes && (
                  <p className="mt-1.5 text-sm text-cream-50/70">{request.notes}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4">
                {STEPS.map((step, i) => {
                  const currentIndex = STEPS.findIndex((s) => s.key === request.status);
                  const active = i <= currentIndex;
                  return (
                    <div key={step.key} className="flex items-center gap-2 sm:gap-3">
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition-all duration-200 ${
                            active
                              ? "border-gold-300 bg-gold-300 text-olive-950"
                              : "border-cream-50/20 text-cream-50/40"
                          }`}
                        >
                          {i + 1}
                        </div>
                        <span className={`text-xs text-center ${active ? "text-cream-50" : "text-cream-50/40"}`}>
                          {step.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && <div className="h-px w-8 sm:w-14 bg-cream-50/15" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        
          <h2 className="mt-10 text-sm font-medium text-cream-50/90">
            Documents envoyés
            <span className="ml-1.5 text-xs text-cream-50/50">الوثائق المرسلة</span>
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {requiredTypes.map((type) => {
              const doc = uploadedMap.get(type);
              return (
                <div
                  key={type}
                  className={`flex items-center justify-between gap-2.5 rounded-lg border p-4 ${
                    doc ? "border-gold-300/30 bg-gold-300/[0.03]" : "border-cream-50/15"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    {doc ? (
                      <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-gold-300" />
                    ) : (
                      <FileText className="h-4.5 w-4.5 shrink-0 text-cream-50/40" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-cream-50">
                        {DOCUMENT_LABELS[type].fr}
                      </p>
                      {doc && (
                        <p className="truncate text-xs text-cream-50/50">{doc.fileName}</p>
                      )}
                    </div>
                  </div>

                  {isRejected && (
                    <label className="shrink-0 cursor-pointer rounded-md p-1.5 text-cream-50/50 transition-colors duration-150 hover:bg-cream-50/10 hover:text-gold-300">
                      <RefreshCcw className="h-4 w-4" />
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={isModifying}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleReplace(type, file);
                        }}
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>

          
          {isRejected && (
            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
              <p className="flex-1 text-xs text-cream-50/50 sm:hidden">
                Remplacez un document via l'icône, ou repartez de zéro :
              </p>
              <button
                onClick={() => router.push("/registration/new")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-cream-50/15 px-4 py-2.5 text-sm font-medium text-cream-50/80 transition-all duration-200 hover:bg-cream-50/5"
              >
                <Plus className="h-4 w-4" />
                Créer une nouvelle demande
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}