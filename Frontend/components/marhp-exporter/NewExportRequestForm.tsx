"use client";

import { useState, type FormEvent } from "react";
import { UploadCloud, FileText, X, Check } from "lucide-react";
import type { ExportRequestType, ProductForm } from "./types";

export interface NewExportRequestPayload {
  type: ExportRequestType;
  clientName: string;
  destinationCountry: string;
  quantityKg: number;
  productForm: ProductForm;
  agrimReference?: string;
  documents: {
    agrim?: File;
    contrat?: File;
    autorisation?: File;
  };
}

interface NewExportRequestFormProps {
  onSubmit?: (payload: NewExportRequestPayload) => Promise<void> | void;
  submitting?: boolean;
}

const CARD =
  "rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-8";

export function NewExportRequestForm({
  onSubmit,
  submitting = false,
}: NewExportRequestFormProps) {
  const [type, setType] = useState<ExportRequestType>("dakhil_hissa");
  const [clientName, setClientName] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [quantityKg, setQuantityKg] = useState<string>("");
  const [productForm, setProductForm] = useState<ProductForm>("conditionne");
  const [agrimReference, setAgrimReference] = useState("");
  const [agrimFile, setAgrimFile] = useState<File | undefined>();
  const [contratFile, setContratFile] = useState<File | undefined>();
  const [autorisationFile, setAutorisationFile] = useState<File | undefined>();

  const insideQuota = type === "dakhil_hissa";
  const canSubmit =
    clientName.trim() &&
    quantityKg &&
    (!insideQuota ||
      (agrimReference && agrimFile && contratFile && autorisationFile));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    await onSubmit?.({
      type,
      clientName: clientName.trim(),
      destinationCountry: destinationCountry.trim(),
      quantityKg: Number(quantityKg),
      productForm,
      agrimReference: insideQuota ? agrimReference : undefined,
      documents: insideQuota
        ? { agrim: agrimFile, contrat: contratFile, autorisation: autorisationFile }
        : {},
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-cream-50">
          Nouvelle demande d'exportation
        </h1>
        <p className="mt-1 text-sm text-cream-50/60">
          Renseignez les informations relatives à votre opération d'exportation{" "}
          <span className="opacity-70">طلب تصدير جديد</span>
        </p>
      </div>

      {/* Type toggle */}
      <div className={CARD}>
        <div className="mb-4">
          <h2 className="font-display text-lg text-cream-50">
            Type d'exportation
          </h2>
          <p className="text-xs text-cream-50/50">نوع التصدير</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <TypeCard
            active={type === "dakhil_hissa"}
            onClick={() => setType("dakhil_hissa")}
            titleFr="Dans la quota"
            titleAr="داخل الحصة"
            description="Nécessite un certificat AGRIM, un contrat client et une autorisation ministérielle. Examinée par l'instance."
          />
          <TypeCard
            active={type === "kharij_hissa"}
            onClick={() => setType("kharij_hissa")}
            titleFr="Hors quota"
            titleAr="خارج الحصة"
            description="Opération réalisée directement en douane. Aucun dépôt de documents n'est requis dans la plateforme."
          />
        </div>

        {!insideQuota && (
          <div className="mt-4 rounded-xl border border-cream-50/10 bg-olive-950/50 p-4 text-xs text-cream-50/70">
            L'exportation <span className="text-cream-50">خارج الحصة</span> ne
            requiert pas de demande dans la plateforme, à condition que vous
            figuriez sur la liste des exportateurs approuvés. Vous pouvez
            toutefois enregistrer l'opération à des fins de suivi.
          </div>
        )}
      </div>

      {/* Common fields */}
      <div className={CARD}>
        <div className="mb-6">
          <h2 className="font-display text-lg text-cream-50">
            Informations générales
          </h2>
          <p className="text-xs text-cream-50/50">معلومات عامة</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Client" labelAr="الحريف">
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className={inputCls}
              placeholder="Nom du client"
            />
          </Field>
          <Field label="Pays de destination" labelAr="بلد الوجهة">
            <input
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              className={inputCls}
              placeholder="Italie, Espagne…"
            />
          </Field>
          <Field label="Quantité (kg)" labelAr="الكمية">
            <input
              type="number"
              min={1}
              value={quantityKg}
              onChange={(e) => setQuantityKg(e.target.value)}
              required
              className={inputCls}
              placeholder="Ex. 24000"
            />
          </Field>
          <Field label="Conditionnement" labelAr="التعبئة">
            <select
              value={productForm}
              onChange={(e) => setProductForm(e.target.value as ProductForm)}
              className={inputCls}
            >
              <option value="conditionne" className="bg-olive-950">
                Conditionné (≤ 5L)
              </option>
              <option value="vrac" className="bg-olive-950">
                Vrac
              </option>
            </select>
          </Field>
        </div>
      </div>

      {/* Documents (only inside quota) */}
      {insideQuota && (
        <div className={CARD}>
          <div className="mb-6">
            <h2 className="font-display text-lg text-cream-50">
              Documents requis
            </h2>
            <p className="text-xs text-cream-50/50">الوثائق المطلوبة</p>
          </div>

          <div className="mb-6">
            <Field
              label="Référence AGRIM"
              labelAr="مرجع أغريم"
            >
              <input
                value={agrimReference}
                onChange={(e) => setAgrimReference(e.target.value)}
                required={insideQuota}
                className={inputCls}
                placeholder="AGRIM-2026-0000"
              />
            </Field>
          </div>

          <div className="space-y-3">
            <FileField
              labelFr="Certificat AGRIM"
              labelAr="شهادة أغريم"
              file={agrimFile}
              onFile={setAgrimFile}
            />
            <FileField
              labelFr="Contrat avec le client"
              labelAr="عقد الحريف"
              file={contratFile}
              onFile={setContratFile}
            />
            <FileField
              labelFr="Autorisation ministérielle"
              labelAr="ترخيص وزاري"
              file={autorisationFile}
              onFile={setAutorisationFile}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          className="rounded-xl border border-cream-50/10 px-4 py-2.5 text-sm text-cream-50/70 hover:text-cream-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-gold-300 px-5 py-2.5 text-sm font-medium text-olive-950 transition-colors hover:bg-gold-300/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Check className="h-4 w-4" />
          {submitting ? "Envoi…" : "Soumettre la demande"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-cream-50/10 bg-olive-950/60 px-3 py-2.5 text-sm text-cream-50 placeholder:text-cream-50/40 focus:border-gold-300/50 focus:outline-none";

function Field({
  label,
  labelAr,
  children,
}: {
  label: string;
  labelAr: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="text-xs text-cream-50/70">{label}</span>
        <span className="text-[10px] text-cream-50/40">{labelAr}</span>
      </div>
      {children}
    </label>
  );
}

function TypeCard({
  active,
  onClick,
  titleFr,
  titleAr,
  description,
}: {
  active: boolean;
  onClick: () => void;
  titleFr: string;
  titleAr: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-colors ${
        active
          ? "border-gold-300 bg-gold-300/10"
          : "border-cream-50/10 bg-olive-950/30 hover:border-cream-50/25"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div
            className={`font-display text-base ${
              active ? "text-gold-300" : "text-cream-50"
            }`}
          >
            {titleFr}
          </div>
          <div className="text-[11px] text-cream-50/50">{titleAr}</div>
        </div>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
            active
              ? "border-gold-300 bg-gold-300 text-olive-950"
              : "border-cream-50/25"
          }`}
        >
          {active && <Check className="h-3 w-3" />}
        </span>
      </div>
      <p className="mt-2 text-xs text-cream-50/60">{description}</p>
    </button>
  );
}

function FileField({
  labelFr,
  labelAr,
  file,
  onFile,
}: {
  labelFr: string;
  labelAr: string;
  file?: File;
  onFile: (f: File | undefined) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-cream-50/10 bg-olive-950/40 p-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-300/10 text-gold-300">
        <FileText className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-display text-sm text-cream-50">
          {labelFr}{" "}
          <span className="text-[11px] font-body text-cream-50/50">
            {labelAr}
          </span>
        </div>
        <div className="truncate text-xs text-cream-50/50">
          {file
            ? `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} Mo`
            : "PDF · 10 Mo max"}
        </div>
      </div>

      {file ? (
        <button
          type="button"
          onClick={() => onFile(undefined)}
          className="rounded-lg border border-cream-50/10 p-2 text-cream-50/60 hover:text-rose-300"
          aria-label="Retirer le fichier"
        >
          <X className="h-4 w-4" />
        </button>
      ) : (
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-cream-50/15 px-3 py-2 text-xs text-cream-50/80 hover:border-gold-300/50 hover:text-gold-300">
          <UploadCloud className="h-4 w-4" />
          Choisir
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
      )}
    </div>
  );
}
