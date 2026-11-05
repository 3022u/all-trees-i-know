'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

export function RelatedProductTile({
  src,
  hoverSrc,
  alt,
  handle,
  isInteractive = true,
  ...props
}: {
  src?: string;
  hoverSrc?: string;
  alt: string;
  handle: string;
  isInteractive?: boolean;
} & React.ComponentProps<typeof Image>) {
  return (
    <Link
      className="group block h-full w-full"
      href={`/product/${handle}`}
      prefetch={true}
    >
      <div className="aspect-square w-full relative overflow-hidden">
        {src ? (
          <Image
            className={clsx('relative h-full w-full object-cover object-center', {
              'transition duration-300 ease-in-out': isInteractive
            })}
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
            {...props}
          />
        ) : null}
        {hoverSrc ? (
          <Image
            className={clsx('absolute top-0 left-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100', {
              'transition duration-300 ease-in-out': isInteractive
            })}
            src={hoverSrc}
            alt={alt}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
          />
        ) : null}
      </div>
    </Link>
  );
}