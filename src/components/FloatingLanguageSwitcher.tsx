import { useTranslation, Language } from "@/lib/i18n";
import { useState } from "react";
import { Globe } from "lucide-react";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "he", label: "עברית", flag: "https://flagcdn.com/w40/il.png" },
  { code: "en", label: "English", flag: "https://flagcdn.com/w40/us.png" },
  { code: "fr", label: "Français", flag: "https://flagcdn.com/w40/fr.png" },
];

export const FloatingLanguageSwitcher = () => {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="fixed top-28 left-3 z-[70] lg:hidden"
    >
      <div className="flex flex-col items-center gap-2">
        {/* Toggle button - always visible */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-11 h-11 rounded-full
            bg-black/90 backdrop-blur-md 
            border-2 border-[#c9a84c]/50
            flex items-center justify-center
            transition-all duration-300
            hover:border-[#c9a84c] hover:scale-105
            ${isOpen ? "bg-[#c9a84c]/20" : ""}
          `}
          aria-label={isOpen ? "הסתר שפות" : "הצג שפות"}
          aria-expanded={isOpen}
        >
          <Globe className="w-5 h-5 text-[#c9a84c]" />
        </button>

        {/* Language options - dropdown */}
        <div 
          className={`
            flex flex-col items-center gap-2
            bg-black/90 backdrop-blur-md 
            border border-[#c9a84c]/30 
            rounded-xl p-2
            transition-all duration-300 origin-top
            ${isOpen 
              ? "opacity-100 scale-100 translate-y-0" 
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }
          `}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`
                w-10 h-10 rounded-full border 
                flex items-center justify-center 
                transition-all duration-300
                ${language === lang.code
                  ? "border-[#c9a84c] ring-[1.5px] ring-[#c9a84c] ring-offset-[3px] ring-offset-black/80 scale-110"
                  : "border-transparent hover:border-[#c9a84c]/40 hover:scale-105"
                }
              `}
              aria-label={lang.label}
            >
              <img
                src={lang.flag}
                alt={lang.label}
                loading="lazy"
                decoding="async"
                className="w-7 h-7 rounded-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
