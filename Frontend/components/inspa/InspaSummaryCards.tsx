import { LucideIcon } from "lucide-react";

interface CardData {
  icon: LucideIcon;
  label: string;
  value: number;
  accent: string;
}

export default function InspaSummaryCards({ cards }: { cards: CardData[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-4"
        >
          <div className="flex items-center gap-2">
            <card.icon className={`h-4 w-4 ${card.accent}`} />
            <span className="text-xs text-cream-50/60">{card.label}</span>
          </div>
          <p className="mt-2 font-display text-2xl text-cream-50">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
