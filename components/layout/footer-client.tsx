"use client";

import { useLanguage } from "lib/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function FooterClient() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Check if we're on a product page
  const isProductPage = pathname.startsWith("/product/");

  return (
    <footer
      className={`px-[2rem] py-[2rem] gap-[2rem] dt:px-[4rem] flex flex-col dt:flex-row dt:justify-between text-[1.3rem] dt:text-[1.8rem] leading-[1.3rem] dt:leading-[1.8rem] ${
        isProductPage ? "dt:hidden" : ""
      }`}
    >
      <div className="order-2 dt:order-1">
        {currentYear} © {t("footer.copyright")}
      </div>
      <div className="gap-[2rem] flex flex-col dt:flex-row order-1 dt:order-2">
        <Link href="/about" prefetch={true}>
          {t("footer.about")}
        </Link>
        <a
          href="https://www.instagram.com/all_trees_i_know/"
          target="_blank"
          rel="noopener noreferrer"
          className=""
        >
          {t("footer.instagram")}
        </a>
        <Link href="/contact" prefetch={true}>
          {t("footer.contact")}
        </Link>
        <Link href="/stockists" prefetch={true}>
          {t("footer.stockists")}
        </Link>
        <Link href="/shipping-and-terms" prefetch={true}>
          {t("footer.shippingReturns")}
        </Link>
        {/* <Link href="/policies/privacy" prefetch={true}>
          {t('footer.privacy')}
        </Link> */}
      </div>
    </footer>
  );
}
