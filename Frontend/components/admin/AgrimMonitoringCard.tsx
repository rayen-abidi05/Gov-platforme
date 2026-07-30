import { AgrimInfo } from "@/types/exportRequest";

export default function AgrimMonitoringCard({ agrim }: { agrim: AgrimInfo }) {
  const remaining = agrim.limitKg - agrim.consumedKg;
  const percentage = Math.min(100, Math.round((agrim.consumedKg / agrim.limitKg) * 100));
  const isNearLimit = percentage >= 90;

  return (
    <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-cream-50">AGRIM {agrim.reference}</p>
        <span className={`text-xs font-medium ${isNearLimit ? "text-red-300" : "text-gold-300"}`}>
          {percentage}%
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream-50/10">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isNearLimit ? "bg-red-400" : "bg-gold-300"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[11px] text-cream-50/50">Total</p>
          <p className="mt-0.5 text-sm font-medium text-cream-50">
            {agrim.limitKg.toLocaleString("fr-FR")} kg
          </p>
        </div>
        <div>
          <p className="text-[11px] text-cream-50/50">Consommé</p>
          <p className="mt-0.5 text-sm font-medium text-cream-50">
            {agrim.consumedKg.toLocaleString("fr-FR")} kg
          </p>
        </div>
        <div>
          <p className="text-[11px] text-cream-50/50">Restant</p>
          <p className="mt-0.5 text-sm font-medium text-gold-300">
            {remaining.toLocaleString("fr-FR")} kg
          </p>
        </div>
      </div>
    </div>
  );
}