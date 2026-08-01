"use client";

import { Bell } from "lucide-react";
import { useNotifications, useMarkNotificationRead } from "@/hooks/useNotifications";
import { ApiNotification } from "@/types/registration";
import AdminHeader from "@/components/admin/AdminHeader";
import Spinner from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  return `Il y a ${days} jours`;
}

export default function InspaNotificationsPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();

  const notifications = data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleOpen = (n: ApiNotification) => {
    if (!n.isRead) markRead(n.id);
    if (n.link) router.push(n.link);
  };

  return (
    <>
      <AdminHeader
        title="Centre de notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} notification(s) non lue(s)` : "Toutes les notifications sont lues"}
      />

      <main className="mx-auto max-w-3xl px-6 py-8 sm:px-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="h-10 w-10" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-24 text-cream-50/70">
            Une erreur est survenue lors du chargement des notifications.
          </div>
        ) : (
          <div className="rounded-2xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md">
            {notifications.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-cream-50/40">
                Aucune notification pour le moment.
              </p>
            ) : (
              <div className="divide-y divide-cream-50/5">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleOpen(n)}
                    className={`flex w-full items-start gap-3 px-5 py-4 text-left transition-colors duration-150 hover:bg-cream-50/[0.04] ${
                      !n.isRead ? "bg-gold-300/[0.04]" : ""
                    }`}
                  >
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-300/10 text-gold-300">
                      <Bell className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {!n.isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-300" />}
                        <p className="truncate text-sm font-medium text-cream-50">{n.title}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-cream-50/60">{n.message}</p>
                      <p className="mt-1 text-xs text-cream-50/40">{timeAgo(n.createdAt)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
