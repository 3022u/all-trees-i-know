'use client';

import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import Price from 'components/price';
import { useProduct } from 'components/product/product-context';
import { useLanguage } from 'lib/i18n';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useActionState } from 'react';
import { useCart } from './cart-context';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  children,
  product,
  selectedVariant
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  children?: any;
  product: Product;
  selectedVariant?: ProductVariant;
}) {
  const { t } = useLanguage();
  const buttonClasses =
    'relative flex flex-row w-full items-center justify-center bg-black text-white py-[2.4rem] uppercase mt-[2.4rem] dt:mt-[4.8rem] text-[1.3rem] leading-[1.3rem] dt:text-[1.8rem] dt:leading-[1.8rem]';
  const disabledClasses = '!cursor-not-allowed opacity-50 hover:!opacity-50';

  // Use selected variant price if available, otherwise fall back to max price
  const priceToDisplay = selectedVariant?.price || product.priceRange.maxVariantPrice;

  if (!availableForSale) {
    return (
      <button disabled className={!children ? clsx(buttonClasses, disabledClasses) : disabledClasses}>
         {children || t('cart.addToCart')}
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label={t('cart.pleaseSelectOption')}
        disabled
        className={!children ? clsx(buttonClasses, disabledClasses) : 'cursor-pointer hover:opacity-90'}
      >
      {children || t('cart.addToCart')}
          <div className='flex flex-row dt:hidden'>
            <> &nbsp;-&nbsp;</>
        <Price
            amount={priceToDisplay.amount}
            currencyCode={priceToDisplay.currencyCode}
          />
          </div>
      </button>
    );
  }

  return (
    <button
      aria-label={t('aria.addToCart')}
      className={!children ? clsx(buttonClasses, 'flex flex-row gap-[.5rem]', {
        'hover:opacity-90': true
      }) : 'cursor-pointer hover:opacity-90'}
    >
      {children || t('cart.addToCart')}
          <div className=' dt:hidden'>
            -
            </div>
          <div className='buttonPrice dt:hidden'>
            
        <Price
            amount={priceToDisplay.amount}
            currencyCode={priceToDisplay.currencyCode}
          />
          </div>
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  )!;

  return (
    <form
      className="w-full dt:max-w-[220px]"
      action={async () => {
        addCartItem(finalVariant, product);
        addItemAction();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        product={product}
        selectedVariant={finalVariant}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}

export const AddVariantToCart = ({product, variantId, children}: {product: Product, variantId: string, children: any}) => {
  const { addCartItem } = useCart();
  const [message, formAction] = useActionState(addItem, null);
  const addItemAction = formAction.bind(null, variantId);
  const selectedVariant = product.variants.find((variant) => variant.id === variantId);
  
  return (
    <form
    action={async () => {
        addCartItem(selectedVariant!, product);
        addItemAction();
      }}
    >
      {children ? (
        children
      ) : (
        <SubmitButton
          availableForSale={product.availableForSale}
          selectedVariantId={variantId}
          product={product}
          selectedVariant={selectedVariant}
        />
      )}
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}