# Shopify Content Localization Implementation Guide

## Overview
I've successfully implemented Shopify content localization for your headless Shopify app. This adds support for localized product titles, descriptions, collection names, page content, and menu items in addition to your existing UI translations.

## What Was Added

### 1. Shopify GraphQL Localization
- **Updated fragments** (`lib/shopify/fragments/`):
  - Added `@inContext(language: $language)` directive to product, SEO, and collection fragments
  - This tells Shopify to return content in the specified language

### 2. Query Updates  
- **Updated all queries** (`lib/shopify/queries/`):
  - Added `$language: LanguageCode` parameter to all queries
  - Added `@inContext(language: $language)` directive to query definitions
  - Product, collection, page, and menu queries now support localization

### 3. API Function Updates
- **Enhanced Shopify API functions** (`lib/shopify/index.ts`):
  - Added optional `locale` parameter to all content-fetching functions
  - Added language mapping from your locale codes (`en`, `ua`) to Shopify language codes (`EN`, `UK`)
  - Added Accept-Language header support

### 4. Type Definitions
- **Updated TypeScript types** (`lib/shopify/types.ts`):
  - Added `language?: string` to all operation variable types
  - Ensures type safety for localized queries

### 5. Locale Mapping
- **Created localization utilities** (`lib/shopify/localization.ts`):
  - Maps UI locales (`en`, `ua`) to Shopify language codes (`EN`, `UK`)
  - Handles Accept-Language header generation

### 6. Convenient APIs
- **Client-side hook** (`lib/shopify/localized-api.ts`):
  - `useLocalizedShopify()` - automatically uses current language context
  
- **Server-side helper** (`lib/shopify/server-localized-api.ts`):
  - `getLocalizedShopifyApi()` - detects locale from cookies or accepts parameter

## How to Use

### In Server Components (Recommended)
```tsx
import { getLocalizedShopifyApi } from 'lib/shopify/server-localized-api';

export default async function ProductPage({ params }) {
  const shopify = await getLocalizedShopifyApi();
  const product = await shopify.getProduct(params.handle);
  
  return (
    <div>
      <h1>{product.title}</h1> {/* Automatically localized! */}
      <p>{product.description}</p> {/* Automatically localized! */}
    </div>
  );
}
```

### In Client Components  
```tsx
'use client';
import { useLocalizedShopify } from 'lib/shopify/localized-api';

export function ProductList() {
  const shopify = useLocalizedShopify();
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    shopify.getProducts({}).then(setProducts);
  }, []);
  
  return products.map(product => (
    <div key={product.id}>
      <h2>{product.title}</h2> {/* Automatically localized! */}
    </div>
  ));
}
```

### Manual Locale Override
```tsx
import { getProduct } from 'lib/shopify';

// Force specific locale
const product = await getProduct('product-handle', 'ua'); // Ukrainian
const product = await getProduct('product-handle', 'en'); // English
```

## What Content Gets Localized

### Products
- ✅ Product titles (`product.title`)  
- ✅ Product descriptions (`product.description`, `product.descriptionHtml`)
- ✅ Variant titles (`variant.title`)
- ✅ Option names (`option.name`)
- ✅ Selected option names (`selectedOption.name`)
- ✅ SEO titles and descriptions

### Collections  
- ✅ Collection titles (`collection.title`)
- ✅ Collection descriptions (`collection.description`)
- ✅ SEO titles and descriptions

### Pages
- ✅ Page titles (`page.title`)
- ✅ Page content (`page.body`, `page.bodySummary`)
- ✅ SEO titles and descriptions

### Menus
- ✅ Menu item titles (`menuItem.title`)

## Next Steps

1. **Update your page components** to use the localized APIs
2. **Configure Shopify** to have translations for your content:
   - In Shopify Admin, go to Settings > Markets
   - Set up Ukrainian market if not already done
   - Translate your product/collection content

3. **Test the implementation**:
   - Switch languages in your app
   - Verify that Shopify content changes language
   - Check that fallbacks work when translations are missing

## Important Notes

- **Fallback behavior**: If a translation doesn't exist in Shopify, it will fall back to the default language content
- **Cache considerations**: Localized content is cached separately for each language
- **SEO benefits**: Search engines will now see localized meta titles and descriptions
- **Backward compatibility**: All existing API calls will continue to work (they'll just use the default language)

The implementation is complete and ready to use! Your Shopify content will now be properly localized based on the user's language preference.
