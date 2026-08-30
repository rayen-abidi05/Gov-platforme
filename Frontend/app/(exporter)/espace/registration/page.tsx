"use client";

import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  FileText,
  RefreshCcw,
  Plus,
  EyeIcon,
  Clock3,
  AlertCircle,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

import { useMyRegistrationRequests } from "@/hooks/useMyRegistrationRequests";
import { useModifyDocument } from "@/hooks/useModifyDocument";
import {
  getRequiredDocTypes,
  DOCUMENT_LABELS,
} from "@/lib/documentConfig";
import { DocType } from "@/types/registration";
import ExporterHeader from "@/components/exporter/ExporterHeader";
import Spinner from "@/components/ui/spinner";
import { privateApi } from "@/lib/api/privateApi";

const STEPS = [
  {
    key: "PENDING",
    label: "Envoyée",
    description: "Votre demande a été reçue",
  },
  {
    key: "UNDER_REVIEW",
    label: "En cours d'examen",
    description: "Votre dossier est vérifié",
  },
  {
    key: "APPROVED",
    label: "Approuvée",
    description: "Votre accès sera activé",
  },
];

export default function EspaceRegistrationPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useMyRegistrationRequests();

  const requestId = data?.requests?.[0]?.id ?? "";

  const {
    mutate: modifyDoc,
    isPending: isModifying,
  } = useModifyDocument(requestId);

  if (isLoading) {
    return (
      <>
        <ExporterHeader title="Mon inscription" subtitle="Suivi de votre demande d'inscription" />
        <div className="flex items-center justify-center py-24">
          <Spinner size="h-10 w-10" />
        </div>
      </>
    );
  }

  if (isError || !data?.requests?.length) {
    return (
      <>
        <ExporterHeader title="Mon inscription" subtitle="Suivi de votre demande d'inscription" />
        <main className="mx-auto flex max-w-4xl flex-col items-center px-6 py-16 text-center sm:px-10">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-cream-50/10 bg-cream-50/[0.03]">
            <FileText className="h-6 w-6 text-cream-50/40" />
          </div>

          <h1 className="mt-5 font-display text-2xl text-cream-50">
            Aucune demande trouvée
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-cream-50/55">
            Vous ne disposez actuellement d'aucune demande d'inscription.
          </p>

          <button
            onClick={() => router.push("/espace/registration/new")}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-3 text-sm font-medium text-olive-950 transition-all duration-200 hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/10"
          >
            <Plus className="h-4 w-4" />
            Créer une nouvelle demande
          </button>
        </main>
      </>
    );
  }

  const request = data.requests[0];

  const requiredTypes = getRequiredDocTypes(
    request.company.isRented,
    request.company.isResident
  );

  const uploadedMap = new Map(
    request.documents.map((d) => [d.DocType, d])
  );

  const isRejected = request.status === "REJECTED";

  const currentIndex = STEPS.findIndex(
    (step) => step.key === request.status
  );

  const currentStep =
    currentIndex >= 0 ? STEPS[currentIndex] : null;

  const handleReplace = (docType: DocType, file: File) => {
    modifyDoc({ docType, file });
  };

  const handleViewDocument = async (docId: string) => {
    const res = await privateApi.get(
      `/api/files/${docId}/view`,
      {
        responseType: "blob",
      }
    );

    const url = URL.createObjectURL(res.data);
    window.open(url, "_blank");
  };

  return (
    <>
      <ExporterHeader title="Mon inscription" subtitle="Suivi de votre demande d'inscription" />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        {/* ───────────────── MAIN DOCUMENT ───────────────── */}
        <div className="overflow-hidden rounded-2xl border border-cream-50/10 bg-olive-950/50 shadow-2xl shadow-black/10 backdrop-blur-md">

          {/* ───────────── TOP HORIZONTAL AREA ───────────── */}
          <div className="grid lg:grid-cols-2">

            {/* ───────────── REQUEST INFO ───────────── */}
            <section className="border-b border-cream-50/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="mb-5">
                <h2 className="text-sm font-medium text-cream-50/90">
                  Informations de la demande
                </h2>

                <p className="mt-1 text-xs text-cream-50/45">
                  Informations générales concernant votre dossier.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-xl border border-cream-50/10 bg-cream-50/[0.025] p-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-cream-50/40">
                    <FileText className="h-3.5 w-3.5" />
                    Type de demande
                  </div>

                  <p className="mt-2 text-sm font-medium text-cream-50/90">
                    Enregistrement d'exportateur
                  </p>
                </div>

                <div className="rounded-xl border border-cream-50/10 bg-cream-50/[0.025] p-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-cream-50/40">
                    <CalendarDays className="h-3.5 w-3.5" />
                    État actuel
                  </div>

                  <p
                    className={`mt-2 text-sm font-medium ${
                      isRejected
                        ? "text-red-300"
                        : "text-gold-300"
                    }`}
                  >
                    {isRejected
                      ? "Demande rejetée"
                      : currentStep?.label ?? "En attente"}
                  </p>
                </div>
              </div>
            </section>

            {/* ───────────── STATUS ───────────── */}
            <section className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-sm font-medium text-cream-50/90">
                  État de la demande
                </h2>

                <p className="mt-1 text-xs text-cream-50/45">
                  Suivez l'avancement de votre dossier auprès du Ministère.
                </p>
              </div>

              {isRejected ? (
                <div className="rounded-xl border border-red-400/20 bg-red-950/15 p-5">
                  <div className="flex gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-400/10">
                      <AlertCircle className="h-5 w-5 text-red-300" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-red-300">
                        Votre demande nécessite des modifications
                      </p>

                      <p className="mt-1.5 text-sm leading-relaxed text-cream-50/60">
                        Votre dossier a été examiné par les services du
                        Ministère. Veuillez consulter les observations
                        ci-dessous et remplacer les documents concernés.
                      </p>

                      {request.notes && (
                        <div className="mt-4 rounded-lg border border-red-400/10 bg-black/10 p-3.5">
                          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-red-300/70">
                            Motif du rejet
                          </p>

                          <p className="mt-1.5 text-sm leading-relaxed text-cream-50/70">
                            {request.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Progress line */}
                  <div className="relative">
                    <div className="absolute left-[16px] right-[16px] top-4 h-px bg-cream-50/10 sm:left-[32px] sm:right-[32px]" />

                    <div
                      className="absolute left-[16px] top-4 h-px bg-gold-300 transition-all duration-700 sm:left-[32px]"
                      style={{
                        width:
                          currentIndex <= 0
                            ? "0%"
                            : currentIndex === 1
                              ? "calc(50% - 16px)"
                              : "calc(100% - 64px)",
                      }}
                    />

                    <div className="relative grid grid-cols-3">
                      {STEPS.map((step, index) => {
                        const active = index <= currentIndex;
                        const current = index === currentIndex;

                        return (
                          <div
                            key={step.key}
                            className="flex flex-col items-center text-center"
                          >
                            <div
                              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium transition-all duration-300 ${
                                active
                                  ? "border-gold-300 bg-gold-300 text-olive-950 shadow-lg shadow-gold-500/10"
                                  : "border-cream-50/15 bg-olive-950 text-cream-50/35"
                              } ${
                                current
                                  ? "ring-4 ring-gold-300/10"
                                  : ""
                              }`}
                            >
                              {active && index < currentIndex ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                index + 1
                              )}
                            </div>

                            <p
                              className={`mt-3 text-xs font-medium sm:text-sm ${
                                active
                                  ? "text-cream-50/90"
                                  : "text-cream-50/35"
                              }`}
                            >
                              {step.label}
                            </p>

                            <p className="mt-1 hidden max-w-[130px] text-[10px] leading-relaxed text-cream-50/35 sm:block">
                              {step.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Current status */}
                  {currentStep && (
                    <div className="mt-7 flex items-start gap-3 rounded-xl border border-gold-300/15 bg-gold-300/[0.035] p-4">
                      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold-300/10">
                        <Clock3 className="h-4 w-4 text-gold-300" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gold-300">
                          {currentStep.label}
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-cream-50/55">
                          {currentStep.description}. Vous serez
                          informé de l'évolution de votre demande.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>

          {/* ───────────── DOCUMENTS ───────────── */}
          <section className="border-t border-cream-50/10 p-6 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-sm font-medium text-cream-50/90">
                  Documents envoyés
                </h2>

                <p
                  className="mt-1 text-xs text-cream-50/45"
                  dir="rtl"
                >
                  الوثائق المرسلة
                </p>
              </div>

              <div className="text-right text-[10px] text-cream-50/35">
                {request.documents.length} document
                {request.documents.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {requiredTypes.map((type) => {
                const doc = uploadedMap.get(type);

                return (
                  <div
                    key={type}
                    className={`group rounded-xl border p-4 transition-all duration-200 ${
                      doc
                        ? "border-gold-300/20 bg-gold-300/[0.025] hover:border-gold-300/35 hover:bg-gold-300/[0.04]"
                        : "border-cream-50/10 bg-cream-50/[0.015]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Document icon */}
                      <div
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                          doc
                            ? "bg-gold-300/10"
                            : "bg-cream-50/[0.04]"
                        }`}
                      >
                        {doc ? (
                          <CheckCircle2 className="h-4 w-4 text-gold-300" />
                        ) : (
                          <FileText className="h-4 w-4 text-cream-50/35" />
                        )}
                      </div>

                      {/* Document information */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-cream-50/90">
                          {DOCUMENT_LABELS[type].fr}
                        </p>

                        {doc ? (
                          <p className="mt-1 truncate text-xs text-cream-50/45">
                            {doc.fileName}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-cream-50/30">
                            Document non fourni
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-1">
                        {doc && (
                          <button
                            type="button"
                            onClick={() =>
                              handleViewDocument(doc.id)
                            }
                            className="rounded-lg p-2 text-cream-50/45 transition-colors duration-150 hover:bg-cream-50/10 hover:text-gold-300"
                            title="Aperçu du document"
                            aria-label="Aperçu du document"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        )}

                        {isRejected && (
                          <label
                            className={`cursor-pointer rounded-lg p-2 text-cream-50/45 transition-colors duration-150 hover:bg-cream-50/10 hover:text-gold-300 ${
                              isModifying
                                ? "pointer-events-none opacity-40"
                                : ""
                            }`}
                            title="Remplacer le document"
                          >
                            <RefreshCcw className="h-4 w-4" />

                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              disabled={isModifying}
                              onChange={(e) => {
                                const file =
                                  e.target.files?.[0];

                                if (file) {
                                  handleReplace(type, file);
                                }

                                e.target.value = "";
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Document status */}
                    <div className="mt-3 flex items-center gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          doc
                            ? "bg-gold-300"
                            : "bg-cream-50/20"
                        }`}
                      />

                      <span
                        className={`text-[10px] ${
                          doc
                            ? "text-gold-300/70"
                            : "text-cream-50/35"
                        }`}
                      >
                        {doc
                          ? "Document reçu"
                          : "Document manquant"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom actions */}
            {isRejected && (
              <div className="mt-7 flex flex-col gap-3 border-t border-cream-50/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium text-cream-50/65">
                    Besoin de repartir de zéro ?
                  </p>

                  <p className="mt-1 text-[11px] text-cream-50/35">
                    Vous pouvez créer une nouvelle demande d'inscription.
                  </p>
                </div>

                <button
                  onClick={() =>
                    router.push("/espace/registration/new")
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-cream-50/10 bg-cream-50/[0.02] px-4 py-2.5 text-sm font-medium text-cream-50/75 transition-all duration-200 hover:border-gold-300/25 hover:bg-cream-50/[0.05] hover:text-gold-300"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle demande
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Footer trust message */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-[10px] text-cream-50/30">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Accès sécurisé, plateforme officielle du Ministère</span>
        </div>
      </main>
    </>
  );
}
