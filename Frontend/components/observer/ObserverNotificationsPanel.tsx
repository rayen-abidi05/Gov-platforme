"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { ApiNotification } from "@/types/registration";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  return `Il y a ${days} jours`;
}

export default function ObserverNotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data } = useNotifications();
  const notifications: ApiNotification[] = data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/15 bg-cream-50/[0.03] text-cream-50/70 transition-all duration-200 hover:border-gold-300/30 hover:text-gold-300"
        title="Notifications"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-cream-50/10 bg-olive-950/95 backdrop-blur-md shadow-lg overflow-hidden z-50">
          <div className="border-b border-cream-50/10 px-4 py-3">
            <p className="text-sm font-medium text-cream-50">Notifications</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-cream-50/40">
                Aucune notification
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-2.5 px-4 py-3 ${
                    !n.isRead ? "bg-gold-300/[0.04]" : ""
                  }`}
                >
                  {!n.isRead && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-300" />}
                  <div className={`min-w-0 flex-1 ${n.isRead ? "pl-4" : ""}`}>
                    <p className="truncate text-sm font-medium text-cream-50">{n.title}</p>
                    <p className="truncate text-xs text-cream-50/60">{n.message}</p>
                    <p className="mt-0.5 text-[11px] text-cream-50/40">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
