export const locales = ["en", "ua"] as const;
export const defaultLocale = "ua" as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ua: "Українська",
};

export const localeDisplayNames: Record<Locale, string> = {
  en: "Eng",
  ua: "Укр",
};
