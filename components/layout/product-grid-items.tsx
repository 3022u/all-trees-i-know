import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/shopify/types';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn w-[calc(50vw-3.5rem)] dt:w-[calc(25vw-3.5rem)] dttt:w-[240px]">
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                minAmount: product.priceRange.minVariantPrice.amount,
                maxAmount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode
              }}
              variants={product.variants}
              src={product.featuredImage?.url}
              hovered={product.images[1]?.url}
              product={product}
              handle={product.handle}
              fill={false}
              width={480}
              height={480}
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
        </Grid.Item>
      ))}
    </>
  );
}
