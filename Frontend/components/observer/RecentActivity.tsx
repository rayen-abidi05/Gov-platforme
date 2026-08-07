"use client";

import Link from "next/link";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { ActivityLogRow } from "@/components/observer/ActivityLogRow";
import Spinner from "@/components/ui/spinner";

export default function RecentActivity() {
  const { data, isLoading } = useActivityLogs({ page: 1 });
  const logs = (data?.logs ?? []).slice(0, 5);

  return (
    <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-cream-50/90">Activité récente</h3>
        <Link
          href="/observer/activity-log"
          className="text-xs text-gold-300/80 transition-colors duration-150 hover:text-gold-300"
        >
          Voir tout
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner size="h-6 w-6" />
        </div>
      ) : logs.length === 0 ? (
        <p className="py-8 text-center text-xs text-cream-50/40">Aucune activité récente.</p>
      ) : (
        <div className="mt-2 divide-y divide-cream-50/5">
          {logs.map((log) => (
            <ActivityLogRow key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}
