import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import ShopNavigation from 'components/shop-navigation';
import { defaultSort, sorting } from 'lib/constants';
import { translations } from 'lib/i18n';
import { getLocalizedShopifyApi, getServerLocale } from 'lib/shopify/server-localized-api';
import { notFound } from 'next/navigation';


const { BASE_URL } = process.env;

export async function generateMetadata({params}: {params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  const handle = slug && slug.length > 0 ? slug[slug.length - 1] : null;
  const shopify = await getLocalizedShopifyApi();
  const collection = await shopify.getCollection(handle || 'all');

  if (!collection) {
    return notFound();
  }

  return {
    title: collection.seo?.title || collection.title,
    description: collection.seo?.description || collection.description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    }
  };
}

export default async function CollectionPage(
  {params, searchParams}: {params: Promise<{ slug: string }>, searchParams: Promise<Record<string, string>>}
) {
  const { slug } = await params;
  const { sort } = await searchParams;
  

  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const handle = slug.length > 0 ? slug[slug.length - 1] : 'all';

  const shopify = await getLocalizedShopifyApi();
  const locale = await getServerLocale();
  const t = translations[locale];
  const products = await shopify.getCollectionProducts({
    collection: handle || 'all',
    sortKey,
    reverse
  });
  if (!products) {
    return notFound();
  }

  return (
    <div>
      <ShopNavigation />
     <div className="pt-[9rem] dttt:pt-[20rem]  pb-[2rem] dtt:pb-[calc((100vw-8rem-960px)/3)] relative min-h-screen">
      {products && products.length === 0 ? (
        <p className="py-3 px-[2rem] dt:px-[4rem] min-h-[75dvh]">{t.collections.noProductsFound}</p>
      ) : (
        <Grid className="grid grid-cols-2 dt:grid-cols-4 gap-[2rem] dttt:gap-[calc((100vw-8rem-960px)/3)] px-[2rem] dt:px-[4rem]">
            <ProductGridItems products={products} />
        </Grid>
      )}
      </div>
    </div>
  );
}