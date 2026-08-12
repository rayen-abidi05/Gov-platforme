"use client";

import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import { ExportRequest } from "@/types/exportRequest";
import {
  computeMonthlyExports,
  computeExportTypeDistribution,
  computeTopExporters,
  computeVolumeByGovernorate,
  computeProcessingTimeSeries,
} from "@/lib/observerStats";

const tooltipStyle = {
  backgroundColor: "#1a2410",
  border: "1px solid rgba(253,246,227,0.15)",
  borderRadius: 8,
  color: "#fdf6e3",
};

const PIE_COLORS = ["#e8b923", "#60a5fa", "#4ade80", "#f87171", "#c084fc"];

export default function AnalyticsCharts({ requests }: { requests: ExportRequest[] }) {
  const monthly = computeMonthlyExports(requests);
  const exportTypeDist = computeExportTypeDistribution(requests);
  const topExporters = computeTopExporters(requests, 8);
  const byGovernorate = computeVolumeByGovernorate(requests).slice(0, 10);
  const processingTime = computeProcessingTimeSeries(requests);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5">
        <h3 className="text-sm font-medium text-cream-50/90">Exportations par mois (nombre de demandes)</h3>
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

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5">
          <h3 className="text-sm font-medium text-cream-50/90">Répartition par type d&apos;exportation</h3>
          <p className="text-xs text-cream-50/40">Liste 1 / Liste 2, selon le profil de l&apos;exportateur</p>
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={exportTypeDist} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {exportTypeDist.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 11, color: "#fdf6e3" }} />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5">
          <h3 className="text-sm font-medium text-cream-50/90">Exportations par gouvernorat</h3>
          <p className="text-xs text-cream-50/40">Basé sur le siège de l&apos;exportateur</p>
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byGovernorate} dataKey="volumeKg" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {byGovernorate.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 11, color: "#fdf6e3" }} />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5">
        <h3 className="text-sm font-medium text-cream-50/90">Meilleurs exportateurs (volume)</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topExporters}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(253,246,227,0.08)" />
              <XAxis dataKey="name" stroke="rgba(253,246,227,0.5)" fontSize={11} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis stroke="rgba(253,246,227,0.5)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="volumeKg" name="Volume (kg)" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5">
        <h3 className="text-sm font-medium text-cream-50/90">Temps de traitement (demandes récentes)</h3>
        <p className="text-xs text-cream-50/40">Jours entre soumission et décision</p>
        {processingTime.length === 0 ? (
          <p className="mt-16 text-center text-xs text-cream-50/40">Aucune demande traitée pour l&apos;instant.</p>
        ) : (
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processingTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(253,246,227,0.08)" />
                <XAxis dataKey="id" stroke="rgba(253,246,227,0.5)" fontSize={11} />
                <YAxis stroke="rgba(253,246,227,0.5)" fontSize={12} unit="j" />
                <Tooltip contentStyle={tooltipStyle}  />
                <Line type="monotone" dataKey="days" name="Jours" stroke="#e8b923" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
