"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Bell, ArrowRight } from "lucide-react";
import { ApiNotification } from "@/types/registration";

export default function NotificationModal({
  notification,
  onClose,
}: {
  notification: ApiNotification;
  onClose: () => void;
}) {
  const router = useRouter();
  // Portals need `document` to exist, which isn't available during
  // server-side rendering — this guards against a Next.js SSR crash.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-cream-50/10 bg-olive-950 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="h-5 w-5 text-gold-300" />
            <h2 className="font-display text-lg text-cream-50">{notification.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-cream-50/50 transition-colors duration-150 hover:bg-cream-50/10 hover:text-cream-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-cream-50/80">{notification.message}</p>
        <p className="mt-4 text-xs text-cream-50/40">
          {new Date(notification.createdAt).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        {notification.link && (
          <button
            onClick={() => {
              onClose();
              router.push(notification.link!);
            }}
            className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gold-300 px-4 py-2.5 text-sm font-medium text-olive-950 transition-colors duration-150 hover:bg-gold-300/90"
          >
            {notification.linkLabel || "Voir les détails"}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>,
    document.body 
  );
}