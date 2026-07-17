import { OliveListe, OLIVE_LISTE_LABELS } from "@/types/registration";

export default function OliveListeBadge({ liste }: { liste?: OliveListe }) {
  if (!liste) {
    return <span className="text-xs text-cream-50/40">—</span>;
  }

  const style =
    liste === "liste1"
      ? "bg-blue-400/10 text-blue-300 border-blue-400/30"
      : "bg-purple-400/10 text-purple-300 border-purple-400/30";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}>
      {OLIVE_LISTE_LABELS[liste].fr}
    </span>
  );
}