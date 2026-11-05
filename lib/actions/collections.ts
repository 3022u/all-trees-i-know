'use server';

import { getCollections } from 'lib/shopify';

export async function getCollectionsAction(locale?: string) {
  try {
    const collections = await getCollections(locale);
    // Map collections to use /shop routes instead of /search routes
    return collections.map((collection) => ({
      handle: collection.handle,
      title: collection.title,
      path: collection.handle === '' ? '/shop/all' : `/shop/${collection.handle}`
    }));
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    // Return fallback collections if API fails
    return [
      { handle: 'all', title: 'All', path: '/shop/all' },
      { handle: 'incense', title: 'Incense', path: '/shop/incense' },
      { handle: 'holders', title: 'Holders', path: '/shop/holders' },  
      { handle: 'accessories', title: 'Accessories', path: '/shop/accessories' }
    ];
  }
}
