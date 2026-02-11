import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import he from "@/locales/he.json";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

export type Language = "he" | "en" | "fr";

type TranslationValue = string | string[] | { [key: string]: TranslationValue };
type Translations = { [key: string]: TranslationValue };

const translations: Record<Language, Translations> = { he, en, fr };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("language") as Language;
    return stored && ["he", "en", "fr"].includes(stored) ? stored : "he";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const dir = language === "he" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: TranslationValue = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to Hebrew if key not found
        let fallback: TranslationValue = translations.he;
        for (const fk of keys) {
          if (fallback && typeof fallback === "object" && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key; // Return key if not found in fallback either
          }
        }
        return typeof fallback === "string" ? fallback : key;
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
