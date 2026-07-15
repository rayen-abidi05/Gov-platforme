"use client";

import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import AuthLinks from "./AuthLinks";
import ProfileNav from "./ProfileNav";

export default function Navbar() {
  const { data: user, isLoading } = useUser();

  return (
    <nav className="absolute top-0 right-0 z-20 p-4 sm:p-6 lg:p-10 flex flex-wrap justify-end items-center gap-3 sm:gap-6 max-w-full lg:max-w-[80%] bg-olive-950/30 backdrop-blur-md rounded-bl-xl">
      <Link href="/contact" className="px-3 py-2 text-sm font-medium text-cream-50/80 hover:text-gold-300 rounded-lg transition-all duration-200">
        Contact
      </Link>
      <Link href="/about" className="px-3 py-2 text-sm font-medium text-cream-50/80 hover:text-gold-300 rounded-lg transition-all duration-200">
        À propos
      </Link>
      <Link href="/chaier-de-charge" className="px-3 py-2 text-sm font-medium text-cream-50/80 hover:text-gold-300 rounded-lg transition-all duration-200">
        Chaier de charge
      </Link>
       
       <Link href="/registration" className="px-3 py-2 text-sm font-medium text-cream-50/80 hover:text-gold-300 rounded-lg transition-all duration-200">
        Demande d'enregistrement
      </Link>


      {isLoading ? null : user ? <ProfileNav user={user} /> : <AuthLinks />}
    </nav>
  );
}