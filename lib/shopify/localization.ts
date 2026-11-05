import { Locale } from '../i18n/config';

// Map UI locale codes to Shopify LanguageCode enum values
export const localeToShopifyLanguage = (locale: Locale): string | undefined => {
  const mapping: Record<Locale, string> = {
    'en': 'EN',
    'ua': 'UK'  // Ukrainian in Shopify is 'UK'
  };
  
  return mapping[locale];
};

// Helper to get Accept-Language header value
export const getAcceptLanguageHeader = (locale: Locale): string | undefined => {
  const mapping: Record<Locale, string> = {
    'en': 'en',
    'ua': 'uk'  // Ukrainian language code
  };
  
  return mapping[locale];
};
