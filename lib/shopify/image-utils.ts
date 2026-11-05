/**
 * Transform Shopify image URL to WebP format
 * Shopify supports URL parameters for image transformation
 * @param url - Original Shopify image URL
 * @param width - Optional width parameter
 * @returns Transformed URL with WebP format
 */
export function toWebP(url: string, width?: number): string {
  if (!url) return url;
  
  // Only transform Shopify CDN URLs
  if (!url.includes('cdn.shopify.com')) return url;
  
  // Parse the URL
  const urlObj = new URL(url);
  
  // Add format parameter for WebP
  urlObj.searchParams.set('format', 'webp');
  
  // Optionally add width parameter
  if (width) {
    urlObj.searchParams.set('width', width.toString());
  }
  
  return urlObj.toString();
}
