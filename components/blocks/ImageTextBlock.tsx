import { toWebP } from 'lib/shopify/image-utils';

export default function ImageTextBlock({ img, text, col_start, gap, bottom_align, text_color, reverse }: any) {
  const start = parseInt(col_start?.value || '1');
  const isBottom = bottom_align?.value === 'true';
  const textStyle = text_color?.value ? { color: text_color.value } : {};
  const isReversed = reverse?.value === 'true';
  const gapSize = parseInt(gap?.value || '0');

  // Map start values to Tailwind classes
  const getColStartClass = (colStart: number) => {
    switch(colStart) {
      case 1: return 'col-start-1';
      case 2: return 'col-start-2';
      case 3: return 'col-start-3';
      case 4: return 'col-start-4';
      case 5: return 'col-start-5';
      case 6: return 'col-start-6';
      case 7: return 'col-start-7';
      case 8: return 'col-start-8';
      default: return 'col-start-1';
    }
  };

  const imageElement = (
    <div className={`col-span-3 order-2 dt:order-2 ${getColStartClass(isReversed ? start + 3 + gapSize : start)} w-full`}>
      <img src={toWebP(img?.reference?.image?.url)} alt={img?.reference?.image?.altText || ''} className="w-full h-auto" />
    </div>
  );

  const gapElement = gap && gapSize > 0 && (
    <div className={`order-3 dt:order-2 col-span-${gapSize} w-full`}></div>
  );

  const textElement = (
    <div className={`order-1 dt:order-3 col-span-3 ${getColStartClass(isReversed ? start : start + 3 + gapSize)} w-full flex h-full flex-col justify-${isBottom ? 'end' : 'start'}`}>
      <p className="whitespace-pre-wrap dt:w-[66.6%]" style={textStyle}>{text?.value}</p>
    </div>
  );

  return (
    <div className={`px-[2rem] dt:px-[4rem] flex flex-col dt:grid dt:grid-cols-8 gap-[2rem]`}>
        <>
          {imageElement}
          {gapElement}
          {textElement}
        </>
    </div>
  );
}