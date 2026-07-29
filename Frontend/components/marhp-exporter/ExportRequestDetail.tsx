"use client";

import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Download,
  ShieldAlert,
} from "lucide-react";
import { StatusPill } from "./StatusPill";
import { StatusStepper } from "./StatusStepper";
import type { ExportRequestDetail as ExportRequestDetailT, UploadedDocument } from "./types";

interface ExportRequestDetailProps {
  request: ExportRequestDetailT;
}

const DOC_LABELS: Record<UploadedDocument["kind"], { fr: string; ar: string }> = {
  agrim: { fr: "Certificat AGRIM", ar: "شهادة أغريم" },
  contrat: { fr: "Contrat client", ar: "عقد الحريف" },
  autorisation_ministerielle: {
    fr: "Autorisation ministérielle",
    ar: "ترخيص وزاري",
  },
  autre: { fr: "Autre document", ar: "وثيقة أخرى" },
};

const CARD =
  "rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-8";

export function ExportRequestDetail({ request }: ExportRequestDetailProps) {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/espace/exportations"
          className="inline-flex items-center gap-1 text-xs text-cream-50/60 hover:text-gold-300"
        >
          <ArrowLeft className="h-3 w-3" /> Retour aux exportations
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-cream-50">
              {request.reference}
            </h1>
            <p className="mt-1 text-sm text-cream-50/60">
              {request.clientName}
              {request.destinationCountry
                ? ` · ${request.destinationCountry}`
                : ""}{" "}
              · {request.quantityKg.toLocaleString("fr-FR")} kg
            </p>
          </div>
          <StatusPill status={request.status} />
        </div>
      </div>

      {/* Stepper */}
      <div className={CARD}>
        <div className="mb-6">
          <h2 className="font-display text-lg text-cream-50">
            Suivi de la demande
          </h2>
          <p className="text-xs text-cream-50/50">مسار الطلب</p>
        </div>
        <StatusStepper status={request.status} />

        {request.status === "rejetee" && (
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/5 p-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
            <div>
              <div className="font-display text-sm text-rose-200">
                Demande rejetée
              </div>
              <p className="mt-1 text-xs text-cream-50/70">
                Votre demande n'a pas été approuvée par l'instance. Vous pouvez
                soumettre une nouvelle demande. Pour toute information
                complémentaire, veuillez contacter le service compétent du
                Ministère.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Documents */}
        <div className={`${CARD} xl:col-span-2`}>
          <div className="mb-6">
            <h2 className="font-display text-lg text-cream-50">
              Documents déposés
            </h2>
            <p className="text-xs text-cream-50/50">الوثائق المرسلة</p>
          </div>

          <ul className="space-y-3">
            {request.documents.map((d) => {
              const l = DOC_LABELS[d.kind];
              return (
                <li
                  key={d.id}
                  className="flex items-center gap-4 rounded-xl border border-cream-50/5 bg-olive-950/30 p-4"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-300/10 text-gold-300">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-sm text-cream-50">
                      {l.fr}{" "}
                      <span className="text-[11px] font-body text-cream-50/50">
                        {l.ar}
                      </span>
                    </div>
                    <div className="truncate text-xs text-cream-50/60">
                      {d.name} · {(d.sizeKb / 1024).toFixed(2)} Mo ·{" "}
                      {new Date(d.uploadedAt).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <button
                    className="inline-flex items-center gap-1 rounded-lg border border-cream-50/10 px-3 py-1.5 text-xs text-cream-50/70 hover:border-gold-300/40 hover:text-gold-300"
                    type="button"
                  >
                    <Download className="h-3 w-3" /> Télécharger
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Meta */}
        <div className={CARD}>
          <div className="mb-6">
            <h2 className="font-display text-lg text-cream-50">Informations</h2>
            <p className="text-xs text-cream-50/50">المعلومات</p>
          </div>

          <dl className="space-y-4 text-sm">
            <Row label="Type" labelAr="النوع">
              {request.type === "dakhil_hissa" ? (
                <span className="text-gold-300">داخل الحصة</span>
              ) : (
                <span>خارج الحصة</span>
              )}
            </Row>
            <Row label="Conditionnement" labelAr="التعبئة">
              {request.productForm === "vrac" ? "Vrac" : "Conditionné"}
            </Row>
            <Row label="Quantité" labelAr="الكمية">
              {request.quantityKg.toLocaleString("fr-FR")} kg
            </Row>
            {request.agrim && (
              <>
                <Row label="AGRIM" labelAr="أغريم">
                  {request.agrim.reference}
                </Row>
                <Row label="Solde AGRIM" labelAr="الرصيد">
                  <span className="text-gold-300">
                    {request.agrim.remainingKg.toLocaleString("fr-FR")} kg
                  </span>{" "}
                  <span className="text-cream-50/50">
                    / {request.agrim.totalKg.toLocaleString("fr-FR")} kg
                  </span>
                </Row>
              </>
            )}
            <Row label="Soumise le" labelAr="تاريخ الإرسال">
              {new Date(request.submittedAt).toLocaleDateString("fr-FR")}
            </Row>
          </dl>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  labelAr,
  children,
}: {
  label: string;
  labelAr: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-cream-50/5 pb-3 last:border-none last:pb-0">
      <dt className="text-xs text-cream-50/60">
        {label}
        <div className="text-[10px] text-cream-50/40">{labelAr}</div>
      </dt>
      <dd className="text-right text-cream-50">{children}</dd>
    </div>
  );
}
