import { useTranslation, Language } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "he", label: "עברית", flag: "https://flagcdn.com/w40/il.png" },
  { code: "en", label: "English", flag: "https://flagcdn.com/w40/us.png" },
  { code: "fr", label: "Français", flag: "https://flagcdn.com/w40/fr.png" },
];

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center gap-2 bg-transparent">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(lang.code)}
          className={`h-9 w-9 p-0 rounded-full transition-all bg-transparent hover:bg-transparent ${
            language === lang.code
              ? "ring-[1.5px] ring-[#c9a84c] ring-offset-[3px] ring-offset-black/80"
              : "opacity-60 hover:opacity-100"
          }`}
          aria-label={lang.label}
        >
          <img
            src={lang.flag}
            alt={lang.label}
            loading="lazy"
            decoding="async"
            className="w-6 h-6 rounded-full object-cover"
          />
        </Button>
      ))}
    </div>
  );
};
