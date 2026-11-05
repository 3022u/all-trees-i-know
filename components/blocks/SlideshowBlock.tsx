import { toWebP } from 'lib/shopify/image-utils';

export default function SlideshowBlock({ imgs }: any) {
  const images = imgs?.references?.nodes || [];
  return (
    <div className="w-screen h-100dvh">
      {images.map((img: any, i: number) => (i === 0 &&
        <img
          key={i}
          src={toWebP(img?.image?.url)}
          alt={img?.image?.altText || ''}
          className="w-full h-auto object-cover object-center"
        />
      ))}
    </div>
  );
}