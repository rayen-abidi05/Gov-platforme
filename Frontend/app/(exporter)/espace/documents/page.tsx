"use client";

import { CheckCircle2, FileText } from "lucide-react";
import { useMyRegistrationRequests } from "@/hooks/useMyRegistrationRequests";
import { getRequiredDocTypes, DOCUMENT_LABELS } from "@/lib/documentConfig";
import ExporterHeader from "@/components/exporter/ExporterHeader";
import Spinner from "@/components/ui/spinner";

export default function MyDocumentsPage() {
  const { data, isLoading } = useMyRegistrationRequests();
  const request = data?.requests?.[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="h-10 w-10" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center py-24 text-cream-50/60">
        Aucun document trouvé.
      </div>
    );
  }

  const requiredTypes = getRequiredDocTypes(request.company.isRented,request.company.isResident);
  const uploadedMap = new Map(request.documents.map((d) => [d.DocType, d]));

  return (
    <>
      <ExporterHeader title="Mes documents" subtitle="Documents fournis lors de votre inscription" />

      <main className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
        <div className="grid gap-3 sm:grid-cols-2">
          {requiredTypes.map((type) => {
            const doc = uploadedMap.get(type);
            return (
              <div
                key={type}
                className={`flex items-center gap-2.5 rounded-lg border p-4 ${
                  doc ? "border-gold-300/30 bg-gold-300/[0.03]" : "border-cream-50/15"
                }`}
              >
                {doc ? (
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-gold-300" />
                ) : (
                  <FileText className="h-4.5 w-4.5 shrink-0 text-cream-50/40" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-cream-50">
                    {DOCUMENT_LABELS[type].fr}
                  </p>
                  {doc && <p className="truncate text-xs text-cream-50/50">{doc.fileName}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}