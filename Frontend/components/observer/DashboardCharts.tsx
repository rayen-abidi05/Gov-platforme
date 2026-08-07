"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { ExportRequest } from "@/types/exportRequest";
import { computeMonthlyExports, computeStatusDistribution } from "@/lib/observerStats";

const tooltipStyle = {
  backgroundColor: "#1a2410",
  border: "1px solid rgba(253,246,227,0.15)",
  borderRadius: 8,
  color: "#fdf6e3",
};

const STATUS_COLORS: Record<string, string> = {
  SENT: "#a3a3a3",
  UNDER_COMMITTEE_REVIEW: "#60a5fa",
  APPROVED: "#4ade80",
  REJECTED: "#f87171",
};

export default function DashboardCharts({ requests }: { requests: ExportRequest[] }) {
  const monthly = computeMonthlyExports(requests);
  const statusDist = computeStatusDistribution(requests);
  const hasData = statusDist.some((s) => s.value > 0);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 lg:col-span-2">
        <h3 className="text-sm font-medium text-cream-50/90">Demandes d&apos;exportation mensuelles</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(253,246,227,0.08)" />
              <XAxis dataKey="month" stroke="rgba(253,246,227,0.5)" fontSize={12} />
              <YAxis stroke="rgba(253,246,227,0.5)" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" name="Demandes" fill="#e8b923" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5">
        <h3 className="text-sm font-medium text-cream-50/90">Demandes par statut</h3>
        {!hasData ? (
          <p className="mt-16 text-center text-xs text-cream-50/40">Aucune demande pour l&apos;instant.</p>
        ) : (
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDist} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {statusDist.map((s) => (
                    <Cell key={s.status} fill={STATUS_COLORS[s.status]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={40} wrapperStyle={{ fontSize: 11, color: "#fdf6e3" }} />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
