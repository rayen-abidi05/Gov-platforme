import type { Metadata } from "next";
import { Leaf, Mail, Phone, MapPin, Clock } from "lucide-react";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { OliveAuroraBackground } from "@/components/olive-ui/olive-aurora-background";
import { OliveBranchMotif } from "@/components/olive-ui/olive-branch-motif";
import { ContactForm } from "@/components/olive-ui/contact-form";
import Navbar from "@/components/Navbar.tsx";
import Footer from "@/components/Footer";
import Image from "next/image";
export const metadata: Metadata = {
  title: "Contact | Plateforme d'Export de l'Huile d'Olive - Tunisie",
  description:
    "Contactez le Ministère de l'Agriculture pour toute question relative à la plateforme nationale d'export de l'huile d'olive.",
};

const contactDetails = [
  {
    href: "tel:+21671786833",
    label: "71.786.833",
    icon: Phone,
  },
  {
    href: "mailto:bo.brcmarh@iresa.agrinet.tn",
    label: "bo.brcmarh@iresa.agrinet.tn",
    icon: Mail,
  },
  {
    href: "https://maps.app.goo.gl/bKXHeA3eSnxfMAhb8",
    label: "نهج آلان سافاري 1002 تونس",
    icon: MapPin,
    external: true,
  },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/uic.agrinet",
    icon: FaFacebook,
    ariaLabel: "Facebook",
  },
  {
    href: "https://x.com/M_Agriculture",
    icon: FaXTwitter,
    ariaLabel: "X (formerly Twitter)",
  },
  {
    href: "https://www.youtube.com/channel/UCYeWBkwldbzwlJ4W4sWTh4Q",
    icon: FaYoutube,
    ariaLabel: "YouTube",
  },
];

export default function Contact() {
  return (
    <main className="relative min-h-screen w-full font-body text-cream-50">
      <OliveAuroraBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <section className="flex-1 px-8 pt-28 pb-16 sm:px-12 sm:pt-32 lg:px-16 lg:pt-24 lg:pb-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 flex items-center gap-2.5">
              <Image
                            src="/logo-ministere.png"
                            alt="Ministère de l'Agriculture"
                            width={90}
                            height={55}
                            className="h-10 w-auto object-contain"
                          />
              <span className="font-display text-lg tracking-wide">
                MARHP
              </span>
            </div>

            <OliveBranchMotif className="mb-6 h-9 w-40 text-gold-300" />
            <h1 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              Contactez-nous
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-cream-50/75">
              Une question sur l&apos;export de l&apos;huile d&apos;olive ou
              sur votre dossier ? Notre équipe se tient à votre disposition.
            </p>

            <div className="mt-12 overflow-hidden rounded-xl2 border border-cream-50/15 shadow-glass backdrop-blur-xl lg:grid lg:grid-cols-[360px_1fr]">
              {/* Contact information panel */}
              <div className="relative flex flex-col justify-between gap-10 bg-olive-950 p-8 sm:p-10">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle at 20% 0%, rgb(199 154 46 / 0.15), transparent 60%)",
                  }}
                />

                <div className="relative">
                  <h2 className="font-display text-2xl text-cream-50">
                    Informations de contact
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-cream-50/65">
                    Pour toute question, n&apos;hésitez pas à nous contacter.
                  </p>

                  <ul className="mt-8 flex flex-col gap-5">
                    {contactDetails.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="group flex items-start gap-3 text-sm text-cream-50/85 transition-colors duration-200 hover:text-gold-300"
                        >
                          <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                          <span
                            dir={item.icon === MapPin ? "rtl" : undefined}
                            className="leading-relaxed"
                          >
                            {item.label}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex items-start gap-3 text-sm text-cream-50/85">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                    <div>
                      <p>Lundi - Vendredi</p>
                      <p className="text-cream-50/65">9h00 - 18h00</p>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.ariaLabel}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream-50/10 text-cream-50 transition-all duration-200 hover:bg-gold-300/20 hover:text-gold-300"
                    >
                      <link.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Form panel */}
              <div className="bg-olive-950/40 p-8 sm:p-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}