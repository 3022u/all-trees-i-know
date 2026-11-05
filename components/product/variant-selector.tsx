'use client';

import clsx from 'clsx';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import { useLanguage } from 'lib/i18n';
import { ProductOption, ProductVariant } from 'lib/shopify/types';
import { startTransition, useEffect } from 'react';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateURL();
  const { t } = useLanguage();
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({ ...accumulator, [option.name.toLowerCase()]: option.value }),
      {}
    )
  }));

  // Preselect first available option for each option type if not already selected
  useEffect(() => {
    let hasUpdates = false;
    const updates: { [key: string]: string } = {};

    options.forEach((option) => {
      const optionNameLowerCase = option.name.toLowerCase();
      
      // If this option is not selected, find the first available value
      if (!state[optionNameLowerCase]) {
        for (const value of option.values) {
          // Check if this value is available for sale
          const optionParams = { ...state, [optionNameLowerCase]: value };
          const filtered = Object.entries(optionParams).filter(([key, value]) =>
            options.find(
              (option) => option.name.toLowerCase() === key && option.values.includes(value)
            )
          );
          const isAvailableForSale = combinations.find((combination) =>
            filtered.every(
              ([key, value]) => combination[key] === value && combination.availableForSale
            )
          );

          if (isAvailableForSale) {
            updates[optionNameLowerCase] = value;
            hasUpdates = true;
            break; // Use the first available option
          }
        }
      }
    });

    if (hasUpdates) {
      // Apply all updates at once wrapped in startTransition
      startTransition(() => {
        Object.entries(updates).forEach(([name, value]) => {
          const newState = updateOption(name, value);
          updateURL(newState);
        });
      });
    }
  }, [options, variants, state, updateOption, updateURL, combinations]);

  return options.map((option) => (
    <form key={option.id}>
      <dl className="mb-8">
        {/* <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt> */}
        <dd className="flex flex-wrap gap-3">
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();

            // Base option params on current selectedOptions so we can preserve any other param state.
            const optionParams = { ...state, [optionNameLowerCase]: value };

            // Filter out invalid options and check if the option combination is available for sale.
            const filtered = Object.entries(optionParams).filter(([key, value]) =>
              options.find(
                (option) => option.name.toLowerCase() === key && option.values.includes(value)
              )
            );
            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) => combination[key] === value && combination.availableForSale
              )
            );

            // The option is active if it's in the selected options.
            const isActive = state[optionNameLowerCase] === value;

            return (
              <button
                formAction={() => {
                  const newState = updateOption(optionNameLowerCase, value);
                  updateURL(newState);
                }}
                key={value}
                aria-disabled={!isAvailableForSale}
                disabled={!isAvailableForSale}
                title={`${option.name} ${value}${!isAvailableForSale ? ` (${t('product.outOfStock')})` : ''}`}
                className={clsx(
                  'flex flex-col mt-[1rem] justify-center cursor-pointer items-center text-[1.3rem] leading-[1.3rem] dt:leading-[1.8rem] dt:text-[1.8rem] tracking-tight',
                  {
                    ' underline': isActive,
                    '':
                      !isActive && isAvailableForSale,
                    'cursor-not-allowed':
                      !isAvailableForSale
                  }
                )}
              >
                {value}
              </button>
            );
          })}
        </dd>
      </dl>
    </form>
  ));
}
