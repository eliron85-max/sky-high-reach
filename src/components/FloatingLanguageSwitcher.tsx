import { useTranslation, Language } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "he", label: "עברית", flag: "https://flagcdn.com/w40/il.png" },
  { code: "en", label: "English", flag: "https://flagcdn.com/w40/us.png" },
  { code: "fr", label: "Français", flag: "https://flagcdn.com/w40/fr.png" },
];

export const FloatingLanguageSwitcher = () => {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setMenuOpen(!!document.documentElement.dataset.mobileMenuOpen);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mobile-menu-open"] });
    return () => observer.disconnect();
  }, []);

  if (menuOpen) return null;

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
            bg-background/90 dark:bg-black/90 backdrop-blur-md 
            border-2 border-primary/50
            flex items-center justify-center
            transition-all duration-300
            hover:border-primary hover:scale-105
            ${isOpen ? "bg-primary/20" : ""}
          `}
          aria-label={isOpen ? "הסתר שפות" : "הצג שפות"}
          aria-expanded={isOpen}
        >
          <Globe className="w-5 h-5 text-primary" />
        </button>

        {/* Language options - dropdown */}
        <div 
          className={`
            flex flex-col items-center gap-2
            bg-background/90 dark:bg-black/90 backdrop-blur-md 
            border border-border 
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
                  ? "border-primary ring-[1.5px] ring-primary ring-offset-[3px] ring-offset-background scale-110"
                  : "border-transparent hover:border-primary/40 hover:scale-105"
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
