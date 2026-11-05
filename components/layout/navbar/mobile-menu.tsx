"use client";

import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect } from "react";

import { useLanguage } from "lib/i18n";
import { useMobileMenu } from "lib/mobile-menu-context";
import { Menu } from "lib/shopify/types";

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t, locale, setLocale } = useLanguage();
  const { isOpen, closeMobileMenu } = useMobileMenu();

  console.log("MobileMenu render - isOpen:", isOpen);

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, closeMobileMenu]);

  // Close menu on navigation - but only if it was actually open
  // useEffect(() => {
  //   if (isOpen) {
  //     closeMobileMenu();
  //   }
  // }, [pathname, searchParams]);

  return (
    <>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-10">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Panel className="fixed inset-0 bg-white flex flex-col px-[2rem] pt-[11rem] pb-[2rem] overflow-hidden">
              {/* Header with logo and close */}
              {/* <div className="flex items-center justify-between mb-[4rem]">
                <div className="flex items-center gap-[1rem]">
                  <svg className='w-[3.5rem] h-[3.5rem]' viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_353_285)">
                      <path fillRule="evenodd" clipRule="evenodd" d="M29.1529 15.2701C31.1052 13.1135 32.0274 11.0119 31.7512 8.86903C31.2737 5.12819 25.7915 5.27471 24.6492 15.6822C24.4385 17.6145 24.3823 19.7344 24.5274 21.8452C29.3121 19.826 31.3392 16.0851 31.3392 16.0851C31.3392 16.0851 30.5574 22.4634 25.122 26.0943C26.0068 30.1007 27.8093 33.5027 30.8664 34.6886L30.9647 34.8031C25.3093 35.5861 20.754 34.1666 19.2653 28.3196C17.7765 28.5577 16.1098 28.6264 14.2419 28.4753C13.5396 28.4203 12.8889 28.3287 12.2849 28.2051C11.3767 29.3818 10.1969 30.7188 9.23718 31.5339C5.81489 34.4276 1.81677 36.4652 -0.00439453 33.6721C2.49092 33.2005 5.28119 29.9496 7.79991 26.0943C3.23531 21.7994 7.48156 13.2372 12.5892 11.7765C12.5892 11.7765 8.2868 17.5549 10.9507 20.8608C11.7372 19.4688 12.5237 18.0449 13.3008 16.6254C15.9132 11.8773 18.4694 7.22526 20.9085 4.37269C28.0949 -4.011 38.0246 0.728006 34.1201 9.60621C33.0434 12.0604 31.1567 14.4643 29.1529 15.2701ZM19.8879 14.4597C18.3243 17.8251 16.9432 20.6227 15.651 22.9533C16.1332 23.0174 16.6482 23.0586 17.21 23.0815C17.7437 23.1044 18.2587 23.1044 18.7596 23.0861C18.8065 20.6639 19.167 17.8068 19.8879 14.4551V14.4597Z" fill="#010101"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_353_285">
                        <rect width="35" height="35" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <Link href="/" onClick={closeMobileMenu} className="text-[2.4rem] underline uppercase leading-[2.4rem]">
                    {isOpen ? t('navigation.closeMenu') : t('navigation.menu')}
                  </Link>
                </div>
                <div className="flex items-center gap-[2rem]">
                  <Link href="/shop/all" onClick={closeMobileMenu} className="text-[2.4rem] underline uppercase leading-[2.4rem]">
                    {t('navigation.shop')}
                  </Link>
                  <div className="text-[2.4rem] uppercase leading-[2.4rem]">
                    BAG(2)
                  </div>
                </div>
              </div> */}

              {/* Main menu content */}
              <div className="flex-1 flex flex-col">
                {/* Description text */}
                <div className="mb-[4rem] max-w-[80%]">
                  <p className="text-[1.3rem] leading-[1.3rem] text-black">
                    We chose a manufactory on Awaji Island, where Japan's finest
                    incense has been crafted for over 150 years. Using
                    traditional techniques, it produces a gentle, long-lasting
                    aroma that fills a space delicately without overwhelming it.
                  </p>
                </div>
                {/* Language/Currency section */}
                <div className="mb-[4rem]">
                  <div className="text-[1.8rem] leading-[1.8rem] uppercase text-[#C2C2C2]">
                    <button
                      onClick={() => setLocale("en")}
                      className={`${locale === "en" ? "underline" : ""}`}
                    >
                      ENG
                    </button>
                    &nbsp;/&nbsp;
                    <button
                      onClick={() => setLocale("ua")}
                      className={`${locale === "ua" ? "underline" : ""}`}
                    >
                      UA
                    </button>
                  </div>
                </div>

                {/* Footer links */}
                <div className="space-y-[1.8rem]">
                  <a
                    target="_blank"
                    href="https://www.instagram.com/all_trees_i_know/"
                    onClick={closeMobileMenu}
                    className="block text-[1.8rem] leading-[1.8rem] uppercase"
                  >
                    {t("footer.instagram")}
                  </a>
                  <Link
                    href="/about"
                    onClick={closeMobileMenu}
                    className="block text-[1.8rem] leading-[1.8rem] uppercase"
                  >
                    {t("navigation.about")}
                  </Link>
                  <Link
                    href="/stockists"
                    onClick={closeMobileMenu}
                    className="block text-[1.8rem] leading-[1.8rem] uppercase"
                  >
                    Stockists
                  </Link>
                  <Link
                    href="/shipping-and-terms"
                    className="block text-[1.8rem] leading-[1.8rem] uppercase"
                    prefetch={true}
                    onClick={closeMobileMenu}
                  >
                    {t("footer.shippingReturns")}
                  </Link>
                  <Link
                    href="/contact"
                    onClick={closeMobileMenu}
                    className="block text-[1.8rem] leading-[1.8rem] uppercase"
                  >
                    {t("footer.contact")}
                  </Link>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
