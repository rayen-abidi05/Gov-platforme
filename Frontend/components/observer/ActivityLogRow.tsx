
import { ApiActivityLog } from "@/types/activity-log";
import { cn } from "@/lib/utils";

function formatActionLabel(action: string) {
  return action.replace(/_/g, " ").toLowerCase().replace(/^./, (c) => c.toUpperCase());
}

function actionAccent(action: string) {
  if (action.includes("APPROVE")) return "border-gold-300/30 bg-gold-300/10 text-gold-300";
  if (action.includes("REJECT")) return "border-red-400/30 bg-red-500/10 text-red-300";
  return "border-cream-50/15 bg-cream-50/5 text-cream-50/70";
}

export function ActivityLogRow({ log }: { log: ApiActivityLog }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium",
              actionAccent(log.action)
            )}
          >
            {formatActionLabel(log.action)}
          </span>
          <p className="truncate text-sm text-cream-50/90">
            <span className="font-medium text-cream-50">{log.user.name}</span>
            {" — "}
            {log.entity} <span className="text-cream-50/40">#{log.entityId.slice(0, 8)}</span>
          </p>
        </div>
        <p className="mt-1 text-xs text-cream-50/40">{log.user.email}</p>
      </div>
      <p className="shrink-0 text-xs text-cream-50/50">
        {new Date(log.createdAt).toLocaleString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}