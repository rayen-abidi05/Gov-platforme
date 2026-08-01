"use client";

interface Props {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = "Annuler",
  variant = "default",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-cream-50/10 bg-olive-950 p-6 shadow-2xl">
        <h3 className="font-display text-lg text-cream-50">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cream-50/70">{description}</p>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="rounded-lg border border-cream-50/15 px-4 py-2 text-sm text-cream-50/70 transition-colors duration-150 hover:bg-cream-50/5"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ${
              variant === "danger"
                ? "bg-red-500/90 text-white hover:bg-red-500"
                : "bg-gold-300 text-olive-950 hover:bg-gold-300/90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
