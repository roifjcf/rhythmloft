'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { en } from "@/locales/en";
import { jp } from "@/locales/jp";
import { id } from "@/locales/id";
import { zh_cn } from "@/locales/zh_cn";
import { zh_tw } from "@/locales/zh_tw";
import { Language } from "@/common/type";

export const translationsMap = {
  EN: en,
  JP: jp,
  ID: id,
  ZH_CN: zh_cn,
  ZH_TW: zh_tw,
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof en;
  translate: (key: string, subKey?: string | number) => string; // translation fallback
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("EN");

  const translate = (key: string, subKey?: string | number) => {
    const current = translationsMap[lang] as Record<string, any>;
    const value = key in current ? current[key] : en[key as keyof typeof en] ?? key;

    if (subKey != null && typeof value === "object") {
      return value[subKey] ?? key;
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translationsMap[lang], translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}