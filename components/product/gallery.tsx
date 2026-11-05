"use client";

import { useProduct, useUpdateURL } from "components/product/product-context";
import { useLanguage } from "lib/i18n";
import Image from "next/image";
import { startTransition, useEffect, useRef, useState } from "react";

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const { t } = useLanguage();
  const imageIndex = state.image ? parseInt(state.image) : 0;
  const [isMobile, setIsMobile] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    "h-full transition-all ease-in-out w-full cursor-pointer";

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 769);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isHorizontalSwipe.current = null;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current || !e.touches[0]) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;

    // Determine swipe direction on first significant movement
    if (
      isHorizontalSwipe.current === null &&
      (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)
    ) {
      isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY);
    }

    // Only track horizontal swipes
    if (isHorizontalSwipe.current) {
      // Limit drag at edges (add resistance)
      let offset = deltaX;
      if (
        (imageIndex === 0 && deltaX > 0) ||
        (imageIndex === images.length - 1 && deltaX < 0)
      ) {
        offset = deltaX * 0.3; // Add resistance at edges
      }
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !e.changedTouches[0]) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    // Swipe threshold - 80px or 20% of screen width
    const threshold = Math.min(80, window.innerWidth * 0.25);

    if (isHorizontalSwipe.current && Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && imageIndex < images.length - 1) {
        // Swiped left - go to next image
        startTransition(() => {
          const newState = updateImage(nextImageIndex.toString());
          updateURL(newState);
        });
      } else if (deltaX < 0 && imageIndex > 0) {
        // Swiped right - go to previous image
        startTransition(() => {
          const newState = updateImage(previousImageIndex.toString());
          updateURL(newState);
        });
      }
    }

    // Reset
    touchStartX.current = 0;
    touchStartY.current = 0;
    isHorizontalSwipe.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  return (
    <form>
      <div
        className="relative aspect-[3/4] h-full dt:h-screen w-full overflow-hidden mt-[8rem] dt:mt-0"
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchMove={isMobile ? handleTouchMove : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
        {/* Mobile Slider */}
        {isMobile ? (
          <div
            className="flex h-full"
            style={{
              width: `${images.length * 100}%`,
              transform: `translateX(calc(-${(imageIndex * 100) / images.length}% + ${dragOffset}px))`,
              transition: isDragging ? "none" : "transform 0.3s ease-out",
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-full"
                style={{ width: `${100 / images.length}%` }}
              >
                <Image
                  className="h-full w-full object-cover"
                  fill
                  sizes="100vw"
                  alt={image.altText}
                  src={image.src}
                  priority={index === 0}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        ) : (
          // Desktop single image view
          images[imageIndex] && (
            <Image
              className="h-full w-full object-cover"
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              alt={images[imageIndex]?.altText as string}
              src={images[imageIndex]?.src as string}
              priority={true}
            />
          )
        )}

        {images.length > 1 ? (
          <>
            {/* Desktop Navigation */}
            <div className="absolute z-10 dt:h-screen top-0 left-0 hidden dt:flex w-full justify-center">
              <button
                formAction={() => {
                  const newState = updateImage(previousImageIndex.toString());
                  updateURL(newState);
                }}
                aria-label={t("product.previousImage")}
                className={`${buttonClassName} cursor-arrow-left`}
              ></button>
              <button
                formAction={() => {
                  const newState = updateImage(nextImageIndex.toString());
                  updateURL(newState);
                }}
                aria-label={t("product.nextImage")}
                className={`${buttonClassName} cursor-arrow-right`}
              ></button>
            </div>

            {/* Mobile Navigation */}
            {isMobile && (
              <>
                {/* Mobile Arrow Buttons */}
                {/* Previous Button - only show if not first image */}
                {imageIndex > 0 && (
                  <button
                    formAction={() => {
                      const newState = updateImage(
                        previousImageIndex.toString(),
                      );
                      updateURL(newState);
                    }}
                    aria-label={t("product.previousImage")}
                    className="absolute left-[.85rem] top-1/2 -translate-y-1/2 z-20 w-[3rem] h-[3rem] items-center justify-center flex"
                  >
                    {/* Left arrow < using same technique as +/- buttons */}
                    <span className="h-[1px] bg-black w-[.8rem] absolute top-[calc(50%-0.25rem)] left-[calc(50%-1px)] -translate-x-1/2 -rotate-45 transform-origin-left"></span>
                    <span className="h-[1px] bg-black w-[.8rem] absolute top-[calc(50%+0.25rem)] left-[calc(50%-1px)] -translate-x-1/2 rotate-45 transform-origin-left"></span>
                  </button>
                )}

                {/* Next Button - only show if not last image */}
                {imageIndex < images.length - 1 && (
                  <button
                    formAction={() => {
                      const newState = updateImage(nextImageIndex.toString());
                      updateURL(newState);
                    }}
                    aria-label={t("product.nextImage")}
                    className="absolute right-[.85rem] w-[3rem] h-[3rem] top-1/2 -translate-y-1/2 z-20 items-center justify-center flex"
                  >
                    {/* Right arrow > using same technique as +/- buttons */}
                    <span className="h-[1px] bg-black w-[.8rem] absolute top-[calc(50%-0.25rem)] left-[calc(50%+1px)] -translate-x-1/2 rotate-45 transform-origin-left"></span>
                    <span className="h-[1px] bg-black w-[.8rem] absolute top-[calc(50%+0.25rem)] left-[calc(50%+1px)] -translate-x-1/2 -rotate-45 transform-origin-left"></span>{" "}
                  </button>
                )}

                {/* Mobile Line Indicators */}
                <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      formAction={() => {
                        const newState = updateImage(index.toString());
                        updateURL(newState);
                      }}
                      className={`h-[0.4rem] flex-1 transition-all duration-300 ease-in-out ${
                        index === imageIndex ? "bg-black" : "bg-transparent"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : null}
      </div>
    </form>
  );
}
