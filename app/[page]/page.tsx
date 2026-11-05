import type { Metadata } from "next";

import PageRenderer from "components/page-renderer";
import { getLocalizedShopifyApi } from "lib/shopify/server-localized-api";
import { notFound } from "next/navigation";

// Internal paths that should not be treated as page handles
const INTERNAL_PATHS = ["__vite_fetch_module", "_next", "favicon.ico"];

function isInternalPath(path: string): boolean {
  return INTERNAL_PATHS.some((p) => path.startsWith(p) || path.includes(p));
}

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  try {
    const params = await props.params;

    // Skip internal/development paths
    if (isInternalPath(params.page)) {
      return notFound();
    }

    const shopify = await getLocalizedShopifyApi();
    const page = await shopify.getPage(params.page);

    if (!page) return notFound();

    return {
      title: page.seo?.title || page.title,
      description: page.seo?.description || page.bodySummary,
      openGraph: {
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error generating metadata for page:", error);
    return notFound();
  }
}

export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  try {
    const params = await props.params;

    // Skip internal/development paths
    if (isInternalPath(params.page)) {
      return notFound();
    }

    const shopify = await getLocalizedShopifyApi();
    const page = await shopify.getPage(params.page);

    if (!page) return notFound();

    return (
      <div className="text-[#A9AC00] text-[1.8rem] leading-[1.8rem] py-[8rem] dt:py-[12rem]">
        <PageRenderer page={page} />
      </div>
    );
  } catch (error) {
    console.error("Error loading page:", error);
    return notFound();
  }
}
