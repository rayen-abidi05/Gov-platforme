import Link from "next/link";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MailIcon, PhoneIcon } from "lucide-react";
import { MapPin } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    {
      href: "https://maps.app.goo.gl/bKXHeA3eSnxfMAhb8",
      icon:  MapPin,
      ariaLabel: "Adresse"

    },

    
    {
      href: "https://www.facebook.com/uic.agrinet",
      icon:  FaFacebook,
      ariaLabel: "Facebook"
    },
    {
      href: "https://x.com/M_Agriculture",
      icon: FaXTwitter,
      ariaLabel: "X (formerly Twitter)"
    },
    {
      href: "https://www.youtube.com/channel/UCYeWBkwldbzwlJ4W4sWTh4Q",
      icon:  FaYoutube,
      ariaLabel: "YouTube"
    }
  ];

    const contactInfo = [
      {
        href: "mailto:bo.brcmarh@iresa.agrinet.tn",
        label: "bo.brcmarh@iresa.agrinet.tn"
      },
      {
        href: "tel:+21671786833",
        label: "71.786.833"
      },
      {
        href: "adressto:نهج آلان سافاري 1002 تونس",
        label: "نهج آلان سافاري 1002 تونس"
      },


  ];

  return (
    <footer className="relative py-16 px-6 sm:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-cream-50">
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-sm">
            {socialLinks.map((link : any) => (
              <a
                key={link.href}
                href={link.href}

                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="flex items-center gap-2 hover:text-gold-300 transition-all duration-200"
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                <span className="hidden md:inline">{link.label || ""}</span>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4 text-sm">
            {contactInfo.map((info) => (
              <a
                key={info.href}
                href={info.href}
        
                className="flex items-center gap-2 hover:text-gold-300 transition-all duration-200"
              >
                {info.href.startsWith("mailto:") ? (
                  <MailIcon className="w-4 h-4" />
                )  : info.href.startsWith("tel:") ? (
                  <PhoneIcon className="w-4 h-4" />
                ) : (
                   <MapPin className="w-4 h-4" />
                )}
                <span>{info.label}</span>
              </a>
            ))}
          </div>
          <div className="text-sm text-cream-50/70 text-center">
            © جميع الحقوق محفوظة © وزارة الزراعة والموارد المائية والصيد البحري - 2026
          </div>
          <div className="text-sm text-cream-50/70 text-center ">
              
        
          </div>
        </div>
      </div>
    </footer>
  );
}