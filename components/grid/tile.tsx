'use client';

import clsx from 'clsx';
import { AddVariantToCart } from 'components/cart/add-to-cart';
import Image from 'next/image';
import Link from 'next/link';
import Label from '../label';

export function GridTileImage({
  isInteractive = true,
  active,
  variants,
  product,
  hovered,
  handle,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  hovered?: string;
  handle?: string;
  variants?: any;
  product?: any;
  label?: {
    minAmount: string;
    maxAmount?: string;
    title: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
} & React.ComponentProps<typeof Image>) {
  console.log(product);
  return (
    <div
      className={clsx(
        'group flex flex-col h-full w-full items-center justify-start overflow-hidden'
      )}
    >
        <div className="aspect-[6/7] w-full relative overflow-hidden">  
        <Link
            className="relative inline-block h-full w-full"
            href={`/product/${handle}`}
            prefetch={true}
          >
      {props.src ? (
        <Image
          className={clsx('relative h-full w-full object-cover object-center', {
            'transition duration-300 ease-in-out': isInteractive
          })}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          {...props}
        />
      ) : null}
      {hovered ? (
        <Image
          className={clsx('absolute top-0 left-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100', {
            'transition duration-300 ease-in-out': isInteractive
          })}
          src={hovered}
          alt={props.alt}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      ) : null}
      </Link>
      {variants && variants.length > 1 ? (
        <div className='absolute z-[10] bottom-[.8rem] right-[.8rem] flex items-center justify-center gap-[.5rem]'>
        {variants.map((variant: any, index: number) => (
<AddVariantToCart
            key={variant.id}
            product={product}
variantId={variant.id}>
          <button
            type="submit"
            className={clsx(
              'rounded-full w-[2.8rem] h-[2.8rem] relative items-center justify-center flex transparent-shadow bg-transparent border-0 cursor-pointer',
            )}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.currentTarget.classList.add('pressed-shadow');
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              e.currentTarget.classList.add('pressed-shadow');
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              e.currentTarget.classList.remove('pressed-shadow');
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              e.currentTarget.classList.remove('pressed-shadow');
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span className='h-[1.8rem] bg-black w-[1px] absolute top-[calc(50%)] left-[calc(50%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none'></span>
            <span className='h-[1px] bg-black w-[1.8rem] absolute top-[calc(50%)] left-[calc(50%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none'></span>
            <span className='absolute -top-[1.75rem] arial tracking-normal text-[1.2rem] leading-[1.8rem] cursor-pointer pointer-events-none'>{variant.title}</span>
          </button>
          </AddVariantToCart>
        ))}
        </div>
      ) : null}
        </div>
      <Link
        href={`/product/${handle}`}
        prefetch={true}
        className="w-full"
      >
        {label ? (
          <Label
            title={label.title}
            minAmount={label.minAmount}
            maxAmount={label.maxAmount}
            currencyCode={label.currencyCode}
            position={label.position}
            handle={handle}
            smells={product?.smells}
          />
        ) : null}
      </Link>
    </div>
  );
}
