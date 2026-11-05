import Prose from "components/prose";
import { getLocalizedShopifyApi } from "lib/shopify/server-localized-api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Terms",
  description: "Shipping information, returns policy, and terms of service.",
};

export default async function ShippingAndTermsPage() {
  try {
    const shopify = await getLocalizedShopifyApi();
    const policies = await shopify.getPolicies();

    console.log("Policies received in page:", policies);

    if (!policies) {
      return (
        <div className="px-[2rem] w-full dt:w-[50%] mx-auto pt-[8rem] dt:pt-[32rem]">
          <h1 className="text-[3.2rem] font-medium pb-[1.8rem] uppercase">
            Shipping & Terms
          </h1>
          <p className="font-bold text-[700] text-[1.8rem] leading-[1.8rem]">
            Policies are currently being updated. Please check back soon.
          </p>
        </div>
      );
    }

    return (
      <div
        className="px-[2rem] w-full dt:w-[50%] mx-auto pt-[8rem] dt:pt-[32rem]"
        id="terms"
      >
        {/* Shipping Policy */}
        {policies.shipping && (
          <section className="mb-[4rem]">
            <h2 className="text-[3.2rem] font-medium pb-[1.8rem] uppercase">
              {policies.shipping.title}
            </h2>
            <Prose
              className="font-bold text-[700] text-[1.8rem] leading-[1.8rem]"
              html={policies.shipping.body}
            />
          </section>
        )}

        {/* Returns Policy */}
        {policies.returns && (
          <section className="mb-[4rem]">
            <h2 className="text-[3.2rem] font-medium py-[1.8rem] uppercase">
              {policies.returns.title}
            </h2>
            <Prose
              className="font-bold text-[700] text-[1.8rem] leading-[1.8rem]"
              html={policies.returns.body}
            />
          </section>
        )}

        {/* Terms of Service */}
        {policies.terms && (
          <section className="mb-[4rem]">
            <h2 className="text-[3.2rem] font-medium py-[1.8rem] uppercase">
              {policies.terms.title}
            </h2>
            <Prose
              className="font-bold text-[700] text-[1.8rem] leading-[1.8rem]"
              html={policies.terms.body}
            />
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading policies:", error);
    return (
      <div className="px-[2rem] w-full dt:w-[50%] mx-auto">
        <h1 className="text-[3.2rem] font-medium pb-[3.2rem]">
          Shipping & Terms
        </h1>
        <p>Unable to load policies at this time. Please try again later.</p>
      </div>
    );
  }
}
