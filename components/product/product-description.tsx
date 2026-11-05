import { AddToCart } from "components/cart/add-to-cart";
import Prose from "components/prose";
import { translations } from "lib/i18n";
import {
  getLocalizedShopifyApi,
  getServerLocale,
} from "lib/shopify/server-localized-api";
import { Product } from "lib/shopify/types";
import { DynamicPrice } from "./dynamic-price";
import { RelatedProductTile } from "./related-product-tile";
import { VariantSelector } from "./variant-selector";

async function RelatedProducts({ id }: { id: string }) {
  const shopify = await getLocalizedShopifyApi();
  const locale = await getServerLocale();
  const t = translations[locale];
  const relatedProducts = await shopify.getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="px-[2rem] dt:mt-auto pb-[2rem]">
      <h2 className="mb-[1rem] mt-[2rem] text-[1.3rem] dt:text-[1.8rem] leading-[1.4rem] dt:leading-[1.9rem] font-bold">
        {t.product.relevantProducts}
      </h2>
      <ul className="grid grid-cols-4 gap-[1rem] dt:gap-[2rem]">
        {relatedProducts.slice(0, 4).map((product: Product) => (
          <li key={product.handle} className="w-full">
            <RelatedProductTile
              src={product.featuredImage?.url}
              hoverSrc={product.images[1]?.url}
              alt={product.title}
              handle={product.handle}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductDescription({ product }: { product: Product }) {
  return (
    <div className="w-full flex flex-col dt:justify-between dt:min-h-screen">
      <div className="dt:max-w-[480px]  px-[2rem] flex flex-col items-start justify-center mb-[4rem] dt:mb-0 dt:mt-auto">
        <div className="flex flex-row dt:pt-[12rem] justify-between items-start w-full mb-[1rem] dt:mt-0 mt-[2rem] dt:mt-0">
          <h1 className="text-[1.3rem] leading-[1.4rem] dt:leading-[1.9rem] dt:text-[1.8rem] font-bold">
            {product.title}
          </h1>
          <br />
          <br className="hidden dt:block" />
          <div className="ml-[4rem] text-[2.4rem] hidden dt:block leading-[2.4rem] dt:leading-[1.8rem] dt:text-[1.8rem]">
            <DynamicPrice
              variants={product.variants}
              fallbackPrice={{
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode,
              }}
            />
          </div>
        </div>
        <VariantSelector
          options={product.options}
          variants={product.variants}
        />

        {product.descriptionHtml ? (
          <Prose
            className="text-[1.3rem] dt:text-[1.8rem] leading-[1.4rem] dt:leading-[1.9rem] font-bold"
            html={product.descriptionHtml}
          />
        ) : null}
        <AddToCart product={product} />
        {product.precaution_text?.value && (
          <div className="mt-[2rem] dt:mt-[4.4rem] pb-[3rem]">
            <div className=" whitespace-pre-line text-[1.3rem] dt:text-[1.8rem] leading-[1.4rem] dt:leading-[1.9rem] font-bold">
              {product.precaution_text.value}
            </div>
          </div>
        )}
      </div>

      {/* <RelatedProducts id={product.id} /> */}
    </div>
  );
}
