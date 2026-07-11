
export default function Spinner({ size = "h-6 w-6" }: { size?: string }) {
  return (
    <div
      className={`${size} animate-spin rounded-full border-2 border-gold-300/30 border-t-gold-300`}
      role="status"
      aria-label="Chargement"
    />
  );
}