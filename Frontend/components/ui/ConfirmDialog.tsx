
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = "Annuler",
  variant = "default",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDanger = variant === "danger";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-cream-50/10 bg-olive-950 p-6">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              isDanger ? "bg-red-500/10 text-red-300" : "bg-gold-300/10 text-gold-300"
            )}
          >
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 pt-0.5">
            <h2 className="font-display text-base text-cream-50">{title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-cream-50/70">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
            {cancelLabel}
          </Button>
          <Button
            type="button"
            isLoading={isLoading}
            onClick={onConfirm}
            className={cn(
              "flex-1",
              isDanger && "!bg-red-500 hover:!bg-red-400 !text-white !shadow-none"
            )}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}