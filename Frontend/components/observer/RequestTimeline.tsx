import { ExportRequest } from "@/types/exportRequest";
import { Send, Gavel, CheckCircle2, XCircle } from "lucide-react";

function formatDate(d: string) {
  return new Date(d).toLocaleString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function RequestTimeline({ request }: { request: ExportRequest }) {
  const steps = [
    {
      label: "Demande soumise",
      date: request.submittedAt,
      icon: Send,
      color: "text-cream-50/70 border-cream-50/20 bg-cream-50/5",
      done: true,
    },
  ];

  if (request.status === "UNDER_COMMITTEE_REVIEW") {
    steps.push({
      label: "En examen par l'instance",
      date: request.submittedAt,
      icon: Gavel,
      color: "text-blue-300 border-blue-400/30 bg-blue-400/10",
      done: true,
    });
  }

  if (request.status === "APPROVED" && request.reviewedAt) {
    steps.push({
      label: "Demande approuvée",
      date: request.reviewedAt,
      icon: CheckCircle2,
      color: "text-green-300 border-green-400/30 bg-green-400/10",
      done: true,
    });
  }

  if (request.status === "REJECTED" && request.reviewedAt) {
    steps.push({
      label: "Demande rejetée",
      date: request.reviewedAt,
      icon: XCircle,
      color: "text-red-300 border-red-400/30 bg-red-400/10",
      done: true,
    });
  }

  return (
    <div className="space-y-4">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <div key={i} className="flex gap-3">
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${step.color}`}>
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm text-cream-50/90">{step.label}</p>
              <p className="text-xs text-cream-50/40">{formatDate(step.date)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
