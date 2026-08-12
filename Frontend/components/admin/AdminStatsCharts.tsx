"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {  ApiRegistrationRequest,RequestStatus } from "@/types/registration";

interface Props {
  requests: ApiRegistrationRequest[];
}

const STATUS_COLORS: Record<RequestStatus, string> = {
  PENDING: "#d4d4d4",
  UNDER_REVIEW: "#60a5fa",
  APPROVED: "#4ade80",
  REJECTED: "#f87171",
};

const STATUS_LABELS: Record<RequestStatus, string> = {
  PENDING: "En attente",
  UNDER_REVIEW: "En examen",
  APPROVED: "Approuvées",
  REJECTED: "Rejetées",
};

export default function AdminStatsCharts({ requests }: Props) {
  const counts = requests.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<RequestStatus, number>
  );

  // group by month for the trend chart
  const byMonth = requests.reduce((acc, r) => {
    const d = new Date(r.submittedAt);
    const key = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(byMonth).map(([month, count]) => ({ month, count }));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      
      <div className="grid grid-cols-2 gap-3 lg:col-span-1 lg:grid-rows-4 lg:gap-3">
        {(Object.keys(STATUS_LABELS) as RequestStatus[]).map((status) => (
          <div
            key={status}
            className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-4"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[status] }}
              />
              <span className="text-xs text-cream-50/60">{STATUS_LABELS[status]}</span>
            </div>
            <p className="mt-2 font-display text-2xl text-cream-50">
              {counts[status] ?? 0}
            </p>
          </div>
        ))}
      </div>

      {/* monthly trend chart */}
      <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 lg:col-span-2">
        <h3 className="text-sm font-medium text-cream-50/90">
          Demandes par mois
          <span className="ml-1.5 text-xs text-cream-50/50">الطلبات حسب الشهر</span>
        </h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(253,246,227,0.08)" />
              <XAxis dataKey="month" stroke="rgba(253,246,227,0.5)" fontSize={12} />
              <YAxis stroke="rgba(253,246,227,0.5)" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a2410",
                  border: "1px solid rgba(253,246,227,0.15)",
                  borderRadius: 8,
                  color: "#fdf6e3",
                }}
              />
              <Bar dataKey="count" fill="#e8b923" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}