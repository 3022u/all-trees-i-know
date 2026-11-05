'use client';

// Client-side wrapper for Shopify API functions that includes locale context
import { useLanguage } from '../i18n/context';
import * as shopifyApi from './index';

export function useLocalizedShopify() {
  const { locale } = useLanguage();

  return {
    getProduct: (handle: string) => shopifyApi.getProduct(handle, locale),
    getProducts: (params: Parameters<typeof shopifyApi.getProducts>[0]) => 
      shopifyApi.getProducts({ ...params, locale }),
    getProductRecommendations: (productId: string) => 
      shopifyApi.getProductRecommendations(productId, locale),
    getCollection: (handle: string) => shopifyApi.getCollection(handle, locale),
    getCollections: () => shopifyApi.getCollections(locale),
    getCollectionProducts: (params: Parameters<typeof shopifyApi.getCollectionProducts>[0]) =>
      shopifyApi.getCollectionProducts({ ...params, locale }),
    getMenu: (handle: string) => shopifyApi.getMenu(handle, locale),
    getPage: (handle: string) => shopifyApi.getPage(handle, locale),
    getPages: () => shopifyApi.getPages(locale),
    // Cart operations don't need localization
    getCart: shopifyApi.getCart,
    createCart: shopifyApi.createCart,
    addToCart: shopifyApi.addToCart,
    removeFromCart: shopifyApi.removeFromCart,
    updateCart: shopifyApi.updateCart,
  };
}
