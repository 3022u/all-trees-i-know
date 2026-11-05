# 🌍 Shopify Localization Setup Guide

Your localization system is correctly implemented, but you need to configure Shopify first!

## ✅ What's Already Working
- ✅ Language switcher in UI  
- ✅ Localized API calls to Shopify
- ✅ GraphQL queries with `@inContext` directive
- ✅ Server-side locale detection from cookies

## ❌ What's Missing: Shopify Configuration

To see translations on product pages, you need to configure Shopify:

### 1. Enable Ukrainian Market in Shopify Admin
1. Go to **Settings → Markets** in your Shopify admin
2. Click **Add market** or edit your existing market
3. Add **Ukraine** as a country
4. Set **Ukrainian (UK)** as a language for this market

### 2. Add Ukrainian Language
1. In **Settings → Languages**
2. Click **Add language**
3. Select **Ukrainian (українська)**
4. Set it as published

### 3. Translate Your Products
1. Go to **Products** in Shopify admin
2. Open any product
3. Click **Manage translations** 
4. Add Ukrainian translations for:
   - Product title
   - Product description
   - Variant titles
   - Option names

### 4. Translate Collections & Pages
1. Go to **Collections** and translate collection names/descriptions
2. Go to **Pages** and translate page content
3. Go to **Navigation** and translate menu items

## 🧪 Testing Your Setup

1. **Switch language** in your app (use the language switcher)
2. **Visit a product page** 
3. **Check your terminal** - you should see debug logs like:
   ```
   🌍 Server-side locale detected: ua
   🛍️ Fetching product "example-product" with locale: ua
   📦 Product data received for "example-product": { title: "Назва продукту", ... }
   ```

## 🔧 Debug Information

The debug logs will show you:
- What locale is being detected
- What language is being sent to Shopify
- What content Shopify returns

If you see English content even with Ukrainian locale, it means:
- ❌ Shopify doesn't have Ukrainian translations for that product
- ❌ Ukrainian market/language isn't properly configured in Shopify

## 📋 Quick Check

Visit `/app/product/[any-product-handle]/page.tsx` and check your terminal output when switching languages. You should see the debug logs showing locale detection and API calls.

Once Shopify is configured with Ukrainian translations, you'll immediately see localized content!
