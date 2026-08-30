"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const languages: {
  code: "FR" | "EN" | "AR";
  label: string;
  flag: string;
}[] = [
  { code: "FR", label: "Français", flag: "🇫🇷" },
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "AR", label: "العربية", flag: "🇹🇳" },
];

export default function LanguageSelector() {
  const [language, setLanguage] = useState<"FR" | "EN" | "AR">("FR");
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(
    (lang) => lang.code === language
  );

  return (
    <div className="relative w-fit">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-fit items-center gap-2 rounded-full border border-cream-50/10 bg-olive-900/30 px-3 py-1.5 text-[12px] font-semibold transition-all duration-200 hover:border-gold-300/30 hover:bg-gold-300/[0.08]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">
          {currentLanguage?.flag}
        </span>

        <span className="text-gold-300">
          {currentLanguage?.code}
        </span>

        <ChevronDown
          className={`h-3.5 w-3.5 text-cream-100/50 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-[calc(100%+8px)] z-[100] min-w-[160px] overflow-hidden rounded-xl border border-cream-50/10 bg-olive-950/95 p-1.5 shadow-xl backdrop-blur-xl"
          role="listbox"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[12px] transition-colors ${
                language === lang.code
                  ? "bg-gold-300/[0.10] text-gold-300"
                  : "text-cream-100/70 hover:bg-gold-300/[0.06] hover:text-cream-100"
              }`}
              role="option"
              aria-selected={language === lang.code}
            >
              <span className="text-base leading-none">
                {lang.flag}
              </span>

              <span className="flex-1">
                {lang.label}
              </span>

              <span className="text-[10px] text-cream-100/30">
                {lang.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}