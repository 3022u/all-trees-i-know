"use client";

import LocaleLoader from "components/locale-loader";
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { Locale, defaultLocale, locales } from "./config";
import { translations } from "./translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const LOCALE_STORAGE_KEY = "preferred-locale";

function getBrowserLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;

  const browserLang = window.navigator.language.split("-")[0] as Locale;
  return locales.includes(browserLang) ? browserLang : defaultLocale;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale);
      document.cookie = `preferred-locale=${savedLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      // Use default locale for new users
      setLocaleState(defaultLocale);
      localStorage.setItem(LOCALE_STORAGE_KEY, defaultLocale);
      document.cookie = `preferred-locale=${defaultLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }
    setIsInitialized(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);

    // Also set cookie for server-side locale detection
    document.cookie = `preferred-locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Reload the page to apply the new locale
    window.location.reload();
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let result: any = translations[locale];

    for (const k of keys) {
      if (result && typeof result === "object" && k in result) {
        result = result[k];
      } else {
        // Fallback to English if key not found
        result = translations[defaultLocale];
        for (const fallbackKey of keys) {
          if (result && typeof result === "object" && fallbackKey in result) {
            result = result[fallbackKey];
          } else {
            return key; // Return key if not found in fallback
          }
        }
        break;
      }
    }

    return typeof result === "string" ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {isInitialized ? children : <LocaleLoader />}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
