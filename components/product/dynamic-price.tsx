'use client';

import Price from 'components/price';
import { useProduct } from 'components/product/product-context';
import { ProductVariant } from 'lib/shopify/types';
import { useMemo } from 'react';

type DynamicPriceProps = {
  variants: ProductVariant[];
  fallbackPrice: {
    amount: string;
    currencyCode: string;
  };
};

export function DynamicPrice({ variants, fallbackPrice }: DynamicPriceProps) {
  const { state } = useProduct();

  const selectedVariant = useMemo(() => {
    // If no options are selected, use the first available variant
    if (Object.keys(state).length === 0) {
      return variants.find(variant => variant.availableForSale) || variants[0];
    }

    // Find the variant that matches the selected options
    const selectedVariant = variants.find((variant) => {
      return variant.selectedOptions.every((option) => {
        const optionNameLowerCase = option.name.toLowerCase();
        return state[optionNameLowerCase] === option.value;
      });
    });

    return selectedVariant;
  }, [variants, state]);

  // Use the selected variant's price if available, otherwise fall back to the provided fallback price
  const priceToDisplay = selectedVariant?.price || fallbackPrice;

  return (
    <Price
      amount={priceToDisplay.amount}
      currencyCode={priceToDisplay.currencyCode}
    />
  );
}