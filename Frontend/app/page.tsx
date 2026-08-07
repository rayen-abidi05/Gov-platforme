"use client"
import LandingContent from "@/components/landing/LandingContent"

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
 
  Lock,
 
  Mail,
  Phone,
  MapPin,

 
} from "lucide-react";




import Navbar from "@/components/Navbar";










function Footer() {
  return (
    <footer id="contact" className="relative border-t border-gold-500/15 bg-olive-950/80">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-ministere.png"
              alt="Ministère de l'Agriculture"
              width={90}
              height={55}
              className="h-10 w-auto object-contain"
            />
            <div>

              <div className="font-serif text-[15px] text-cream-50">
                MARHP
              </div>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-cream-100/60">
            Plateforme nationale officielle pour l'exportation de l'huile d'olive
            tunisienne.
          </p>
         
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-gold-300/80">
            Navigation
          </div>
          <ul className="mt-5 space-y-3 text-sm text-cream-100/75">
            <li><a href="#apropos" className="hover:text-gold-300">À propos</a></li>
            <li><a href="#cahier" className="hover:text-gold-300">Cahier de charge</a></li>
            <li><a href="#demande" className="hover:text-gold-300">Demande d'enregistrement</a></li>
            <li><a href="/login" className="hover:text-gold-300">Se connecter</a></li>
          </ul>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-gold-300/80">
            Ressources
          </div>
          <ul className="mt-5 space-y-3 text-sm text-cream-100/75">
            <li><a href="#" className="hover:text-gold-300">Guide de l'exportateur</a></li>
            <li><a href="#" className="hover:text-gold-300">FAQ</a></li>
            <li><a href="#" className="hover:text-gold-300">Mentions légales</a></li>
            <li><a href="#" className="hover:text-gold-300">Confidentialité</a></li>
          </ul>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-gold-300/80">
            Contact
          </div>
          <ul className="mt-5 space-y-3 text-sm text-cream-100/75">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 text-gold-300" />
              30 rue Alain Savary, 1002 Tunis
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-gold-300" />
              +216 71 786 833
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-gold-300" />
              contact@agriculture.tn
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-olive-700/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-cream-100/50 md:flex-row md:px-8">
          <div>
            © {new Date().getFullYear()} Ministère de l'Agriculture — République Tunisienne. Tous droits réservés.
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3 text-gold-300/70" />
            Connexion sécurisée · TLS 1.3
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-olive-950 text-cream-50">
      <Navbar />
      <main>
        <LandingContent/>
      </main>
      <Footer />
    </div>
  );
}