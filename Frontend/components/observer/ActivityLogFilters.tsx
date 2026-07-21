
"use client";

import { RotateCcw } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ActivityLogFilters as Filters } from "@/hooks/useActivityLogs";

function formatActionLabel(action: string) {
  return action.replace(/_/g, " ").toLowerCase().replace(/^./, (c) => c.toUpperCase());
}

export function ActivityLogFiltersBar({
  availableActions,
  filters,
  onChange,
}: {
  availableActions: string[];
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const hasActiveFilters = !!(filters.action || filters.from || filters.to);

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-4">
      <div className="min-w-[180px]">
        <label className="mb-1.5 block text-xs text-cream-50/60">Type d&apos;action</label>
        <Select
          value={filters.action ?? ""}
          onChange={(e) => onChange({ ...filters, action: e.target.value, page: 1 })}
        >
          <option value="">Toutes les actions</option>
          {availableActions.map((a) => (
            <option key={a} value={a}>
              {formatActionLabel(a)}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-cream-50/60">Du</label>
        <Input
          type="date"
          value={filters.from ?? ""}
          onChange={(e) => onChange({ ...filters, from: e.target.value, page: 1 })}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-cream-50/60">Au</label>
        <Input
          type="date"
          value={filters.to ?? ""}
          onChange={(e) => onChange({ ...filters, to: e.target.value, page: 1 })}
        />
      </div>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange({ page: 1 })}
          className="w-auto px-4"
        >
          <RotateCcw className="h-4 w-4" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}