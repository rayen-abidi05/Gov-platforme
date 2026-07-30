"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { ExportRequest, ExportRequestStatus } from "@/types/exportRequest";

interface Props {
  requests: ExportRequest[];
}

const STATUS_COLORS: Record<ExportRequestStatus, string> = {
  SENT: "#d4d4d4",
  UNDER_COMMITTEE_REVIEW: "#60a5fa",
  APPROVED: "#4ade80",
  REJECTED: "#f87171",
};

const STATUS_LABELS: Record<ExportRequestStatus, string> = {
  SENT: "Envoyées",
  UNDER_COMMITTEE_REVIEW: "En examen",
  APPROVED: "Approuvées",
  REJECTED: "Rejetées",
};

export default function ExportStatsCharts({ requests }: Props) {
  const byMonth = requests.reduce((acc, r) => {
    const d = new Date(r.submittedAt);
    const key = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const monthlyData = Object.entries(byMonth).map(([month, count]) => ({ month, count }));

  const decided = requests.filter((r) => r.status === "APPROVED" || r.status === "REJECTED");
  const approvedCount = decided.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = decided.filter((r) => r.status === "REJECTED").length;
  const ratioData = [
    { name: "Approuvées", value: approvedCount, color: STATUS_COLORS.APPROVED },
    { name: "Rejetées", value: rejectedCount, color: STATUS_COLORS.REJECTED },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5 lg:col-span-2">
        <h3 className="text-sm font-medium text-cream-50/90">
          Évolution mensuelle des demandes
          <span className="ml-1.5 text-xs text-cream-50/50">التطور الشهري للطلبات</span>
        </h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
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

      <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5">
        <h3 className="text-sm font-medium text-cream-50/90">
          Approbation vs rejet
          <span className="ml-1.5 text-xs text-cream-50/50">الموافقة مقابل الرفض</span>
        </h3>
        {decided.length === 0 ? (
          <p className="mt-16 text-center text-xs text-cream-50/40">Aucune décision pour l'instant.</p>
        ) : (
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ratioData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {ratioData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={24}
                  wrapperStyle={{ fontSize: 11, color: "#fdf6e3" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a2410",
                    border: "1px solid rgba(253,246,227,0.15)",
                    borderRadius: 8,
                    color: "#fdf6e3",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}