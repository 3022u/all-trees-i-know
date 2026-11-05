import { CartProvider } from "components/cart/cart-context";
import Footer from "components/layout/footer";
import { Navbar } from "components/layout/navbar";
import { LanguageProvider } from "lib/i18n";
import { MobileMenuProvider } from "lib/mobile-menu-context";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { Metadata } from "next";
import Script from "next/script";
import { ReactNode } from "react";
import "./fonts.css";
import "./globals.css";

const { SITE_NAME, SHOPIFY_STORE_DOMAIN, SHOPIFY_CURRENCY } = process.env;
const ASSET_URL = "/chekly-script.js";

const shopDomain = (SHOPIFY_STORE_DOMAIN ?? "").replace(/^https?:\/\//, "");
const shopifyCurrency = SHOPIFY_CURRENCY ?? "USD";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    images: ["https://cdn.shopify.com/s/files/1/0684/3439/5302/files/og.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cart = getCart();

  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="https://cdn.shopify.com/s/files/1/0684/3439/5302/files/forest-backdrop.webp?v=1749591098"
          as="image"
          type="image/webp"
        />
        <meta
          property="og:image"
          content="https://cdn.shopify.com/s/files/1/0684/3439/5302/files/og.png"
        />
        <meta
          name="twitter:image"
          content="https://cdn.shopify.com/s/files/1/0684/3439/5302/files/og.png"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.Shopify = window.Shopify || {};
window.Shopify.shop = ${JSON.stringify(shopDomain)};
window.Shopify.currency = { active: ${JSON.stringify(shopifyCurrency)}, rate: "1.0" };
window.Shopify.routes = { root: "/" };`,
          }}
        />
        <Script
          id="chekly-script"
          data-chekly-url="https://chekly-app.com"
          data-chekly-theme="chekly"
          data-chekly-script="GLOBAL"
          src={ASSET_URL}
          strategy="beforeInteractive"
        />
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KBR3MSQJ');`,
          }}
        />
        {/* Google Analytics 4 */}
        <Script
          id="ga4-script"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-4PDR7RPPRY"
        />
        <Script
          id="ga4-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-4PDR7RPPRY');`,
          }}
        />
        {/* Microsoft Clarity */}
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","wq1fvcv5k2");`,
          }}
        />
      </head>
      <body className=" selection:bg-black selection:text-white ">
        {/* Google Tag Manager (noscript fallback) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KBR3MSQJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <LanguageProvider>
          <MobileMenuProvider>
            <CartProvider cartPromise={cart}>
              <Navbar />
              <main className="font-bold min-h-dvh">{children}</main>
              <Footer />
            </CartProvider>
          </MobileMenuProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
