import Link from "next/link";

export default function AuthLinks() {
  return (
    <>
      <Link href="/register" className="px-3 py-2 text-sm font-medium bg-gold-300/20 hover:bg-gold-300/30 text-gold-300 rounded-lg transition-all duration-200">
        S'inscrire
      </Link>
      <Link href="/login" className="px-3 py-2 text-sm font-medium bg-olive-950/40 hover:bg-olive-800/20 text-cream-50 rounded-lg transition-all duration-200">
        Se connecter
      </Link>
    </>
  );
}