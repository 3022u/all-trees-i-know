import { toWebP } from "lib/shopify/image-utils";

export default function ImagesBlock({ images, bottom_align, left_right }: any) {
  const imgs = images?.references?.nodes || [];
  const isBottom = bottom_align?.value === "true";
  const isRightAligned = left_right?.value === "true";

  // Single image with right alignment should be placed on the right on desktop
  const singleImageRightAligned = imgs.length === 1 && isRightAligned;

  return (
    <div
      className={`px-[2rem] dt:px-[4rem] flex flex-row dt:grid grid-cols-8 gap-[1rem] dt:gap-[2rem]`}
    >
      <div
        className={`col-span-6 col-start-2 grid grid-cols-6 gap-[2rem] justify-end`}
      >
        {singleImageRightAligned && (
          <div className="hidden dt:block col-span-3" />
        )}
        {imgs.map((img: any, i: number) => (
          <img
            key={i}
            src={toWebP(img?.image?.url)}
            alt={img?.image?.altText || ""}
            className={`w-full h-auto ${imgs.length === 3 ? "col-span-2" : "col-span-3"} self-end`}
          />
        ))}
      </div>
    </div>
  );
}
