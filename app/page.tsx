import PageRenderer from "components/page-renderer";
import { getLocalizedShopifyApi } from "lib/shopify/server-localized-api";
import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  try {
    const params = await props.params;
    const shopify = await getLocalizedShopifyApi();
    const page = await shopify.getPage("homepage");

    if (!page) {
      return {
        title: "Our Store",
        description: "Welcome to our store",
      };
    }

    return {
      title: page.seo?.title || page.title,
      description: page.seo?.description || page.bodySummary,
      openGraph: {
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Our Store",
      description: "Welcome to our store",
    };
  }
}

export default async function HomePage() {
  try {
    const shopify = await getLocalizedShopifyApi();
    const page = await shopify.getPage("homepage");
    if (!page) {
      console.warn("Homepage not found, falling back to default content");
      return (
        <div className="text-[#A9AC00] text-[1.8rem] leading-[1.8rem] pt-[8rem] dt:pt-[12rem]"></div>
      );
    }
    return (
      <div className="text-[#A9AC00] text-[1.8rem] leading-[1.8rem] py-[8rem] dt:py-[12rem]">
        <PageRenderer page={page} />
      </div>
    );
  } catch (error) {
    console.error("Error loading homepage:", error);
    return (
      <div className="text-[#A9AC00] text-[1.8rem] leading-[1.8rem] pt-[8rem] dt:pt-[12rem]"></div>
    );
  }
}
