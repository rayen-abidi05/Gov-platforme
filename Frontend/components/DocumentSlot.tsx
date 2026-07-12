"use client";

import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { DocType } from "@/types/registration";

interface Props {
  docType: DocType;
  label: { fr: string; ar: string };
  disabled?: boolean;
  error?: string;
  onChange: (file: File | null) => void;
  inputRef: React.Ref<HTMLInputElement>;
}

export default function DocumentSlot({
  docType,
  label,
  disabled,
  error,
  onChange,
  inputRef,
}: Props) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    setFileName(file ? file.name : null);
    onChange(file);
  };

  return (
    <label
      htmlFor={docType}
      className={`flex items-start gap-3 rounded-lg border bg-cream-50/[0.03] p-4 transition-all duration-200 ${
        error
          ? "border-red-400/40"
          : "border-cream-50/15 hover:border-gold-300/30"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <div className="mt-0.5 shrink-0">
        <FileText className="h-5 w-5 text-cream-50/40" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-cream-50">{label.fr}</p>
        <p className="text-xs text-cream-50/50" dir="rtl">
          {label.ar}
        </p>

        {fileName && (
          <p className="mt-1 truncate text-xs text-gold-300">
            {fileName}
          </p>
        )}

        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>

      <Upload className="h-4 w-4 shrink-0 text-cream-50/50" />

      <input
        id={docType}
        ref={inputRef}
        name={docType}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        disabled={disabled}
        onChange={handleChange}
      />
    </label>
  );
}