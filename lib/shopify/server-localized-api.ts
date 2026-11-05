import { cookies } from 'next/headers';
import { Locale, defaultLocale, locales } from '../i18n/config';

// Server-side locale detection from cookies
export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const savedLocale = cookieStore.get('preferred-locale')?.value as Locale;
    
    console.log('🍪 Server locale detection:', {
      savedLocale,
      isValidLocale: savedLocale && locales.includes(savedLocale),
      allCookies: cookieStore.getAll().map(c => ({ name: c.name, value: c.value }))
    });
    
    if (savedLocale && locales.includes(savedLocale)) {
      return savedLocale;
    }
  } catch (error) {
    // Fallback if cookies are not available
    console.warn('Could not access cookies for locale detection:', error);
  }
  
  console.log('🌍 Falling back to default locale:', defaultLocale);
  return defaultLocale;
}

// Server-side wrapper for Shopify API functions that includes locale context
export async function getLocalizedShopifyApi(locale?: Locale) {
  const currentLocale = locale || await getServerLocale();
  
  // Debug logging
  console.log('🌍 Server-side locale detected:', currentLocale);
  
  // Import the Shopify functions dynamically to avoid issues
  const shopifyApi = await import('./index');
  
  return {
    getProduct: (handle: string) => {
      console.log(`🛍️ Fetching product "${handle}" with locale: ${currentLocale}`);
      return shopifyApi.getProduct(handle, currentLocale);
    },
    getProducts: (params: Parameters<typeof shopifyApi.getProducts>[0]) => 
      shopifyApi.getProducts({ ...params, locale: currentLocale }),
    getProductRecommendations: (productId: string) => 
      shopifyApi.getProductRecommendations(productId, currentLocale),
    getCollection: (handle: string) => shopifyApi.getCollection(handle, currentLocale),
    getCollections: () => shopifyApi.getCollections(currentLocale),
    getCollectionProducts: (params: Parameters<typeof shopifyApi.getCollectionProducts>[0]) =>
      shopifyApi.getCollectionProducts({ ...params, locale: currentLocale }),
    getMenu: (handle: string) => shopifyApi.getMenu(handle, currentLocale),
    getPage: (handle: string) => shopifyApi.getPage(handle, currentLocale),
    getPages: () => shopifyApi.getPages(currentLocale),
    getPolicies: () => shopifyApi.getPolicies(currentLocale),
    // Cart operations don't need localization
    getCart: shopifyApi.getCart,
    createCart: shopifyApi.createCart,
    addToCart: shopifyApi.addToCart,
    removeFromCart: shopifyApi.removeFromCart,
    updateCart: shopifyApi.updateCart,
  };
}
