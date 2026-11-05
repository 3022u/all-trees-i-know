import type { Cart, CartItem } from "lib/shopify/types";

export type AjaxCartItem = {
  id: number | null;
  properties: Record<string, unknown>;
  quantity: number;
  variant_id: number | null;
  key: string;
  title: string;
  price: number;
  original_price: number;
  discounted_price: number;
  line_price: number;
  original_line_price: number;
  total_discount: number;
  discounts: { amount: number; title: string }[];
  sku: string;
  grams: number;
  vendor: string;
  taxable: boolean;
  product_id: number | null;
  product_has_only_default_variant: boolean;
  gift_card: boolean;
  final_price: number;
  final_line_price: number;
  url: string;
  featured_image: {
    aspect_ratio: number;
    alt: string;
    height: number;
    url: string;
    width: number;
  } | null;
  image: string | null;
  handle: string;
  requires_shipping: boolean;
  product_type: string;
  product_title: string;
  product_description: string;
  variant_title: string | null;
  variant_options: string[];
  options_with_values: { name: string; value: string }[];
  line_level_discount_allocations: unknown[];
  line_level_total_discount: number;
  quantity_rule: { min: number; max: number | null; increment: number };
  has_components: boolean;
};

export type AjaxCart = {
  token: string | null;
  note: string | null;
  attributes: Record<string, string>;
  original_total_price: number;
  total_price: number;
  total_discount: number;
  total_weight: number;
  item_count: number;
  items: AjaxCartItem[];
  requires_shipping: boolean;
  currency: string;
  items_subtotal_price: number;
  cart_level_discount_applications: unknown[];
  discount_codes?: { code: string; applicable: boolean }[];
};

class Money {
  static toCents(amount: string | undefined): number {
    const n = Number(amount);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 100);
  }
}

class DiscountMapper {
  static toItemDiscount(allocation: any, title: string) {
    return {
      amount: Money.toCents(allocation?.discountedAmount?.amount),
      title,
    };
  }

  static toCartLevelDiscountApplication(title: string, totalAllocatedAmount: number) {
    return {
      type: "discount_code",
      key: title || null,
      title,
      description: null,
      value: null,
      created_at: null,
      value_type: null,
      allocation_method: null,
      target_selection: null,
      target_type: null,
      total_allocated_amount: totalAllocatedAmount,
    };
  }
}

class ShopifyGid {
  static toNumericId(gid: string | undefined): number | null {
    if (!gid) return null;
    const parts = gid.split("/");
    const last = parts[parts.length - 1];
    const n = Number(last);
    return Number.isFinite(n) ? n : null;
  }

  static stripCartPrefix(gidOrToken: string | null | undefined): string | null {
    if (!gidOrToken) return null;
    return gidOrToken.replace(/^gid:\/\/shopify\/Cart\//, "");
  }
}

export class AjaxCartMapper {
  static toAjaxCart(cart: Cart | undefined, tokenOverride: string | null): AjaxCart {
    const empty: AjaxCart = {
      token: tokenOverride,
      note: null,
      attributes: {},
      original_total_price: 0,
      total_price: 0,
      total_discount: 0,
      total_weight: 0,
      item_count: 0,
      items: [],
      requires_shipping: true,
      currency: "USD",
      items_subtotal_price: 0,
      cart_level_discount_applications: [],
    };

    if (!cart) return { ...empty, token: ShopifyGid.stripCartPrefix(tokenOverride) };

    const currency = cart.cost?.totalAmount?.currencyCode ?? "USD";
    const primaryDiscountTitle =
      cart.discountCodes?.find((d) => d.applicable)?.code ?? cart.discountCodes?.[0]?.code ?? "";
    const items = cart.lines.map((line) => this.toAjaxItem(line, primaryDiscountTitle));
    const itemsSubtotal = Money.toCents(cart.cost?.subtotalAmount?.amount);
    const total = Money.toCents(cart.cost?.totalAmount?.amount);
    const originalTotal = itemsSubtotal;
    const cartDiscounts = (cart.discountAllocations ?? []).map((a) =>
      DiscountMapper.toItemDiscount(a, primaryDiscountTitle),
    );
    const cartDiscountTotalsByTitle = cartDiscounts.reduce((acc, d) => {
      const key = d.title || "";
      acc.set(key, (acc.get(key) ?? 0) + d.amount);
      return acc;
    }, new Map<string, number>());
    const cartLevelDiscountApplications = Array.from(cartDiscountTotalsByTitle.entries())
      .filter(([, amount]) => amount > 0)
      .map(([title, amount]) => DiscountMapper.toCartLevelDiscountApplication(title, amount));

    return {
      ...empty,
      token: ShopifyGid.stripCartPrefix(tokenOverride ?? cart.id),
      currency,
      item_count: cart.totalQuantity ?? items.reduce((sum, i) => sum + i.quantity, 0),
      items,
      items_subtotal_price: itemsSubtotal,
      total_price: total,
      original_total_price: originalTotal,
      total_discount: Math.max(0, originalTotal - total),
      cart_level_discount_applications: cartLevelDiscountApplications,
      discount_codes: cart.discountCodes?.map((d) => ({ code: d.code, applicable: d.applicable })) ?? [],
    };
  }

  static toAjaxItem(line: CartItem, primaryDiscountTitle: string): AjaxCartItem {
    const variantId = ShopifyGid.toNumericId(line.merchandise?.id);
    const productId = ShopifyGid.toNumericId(line.merchandise?.product?.id);
    const productTitle = line.merchandise?.product?.title ?? "";
    const variantTitle = line.merchandise?.title ?? "";
    const handle = line.merchandise?.product?.handle ?? "";
    const image = line.merchandise?.product?.featuredImage ?? null;
    const quantity = line.quantity ?? 0;

    const explicitUnitPriceCents = Money.toCents(line.merchandise?.price?.amount);
    const fallbackUnitPriceCents =
      quantity > 0 ? Math.round(Money.toCents(line.cost?.totalAmount?.amount) / quantity) : 0;
    const unitPriceCents = explicitUnitPriceCents || fallbackUnitPriceCents;
    const linePriceCents = Money.toCents(line.cost?.totalAmount?.amount);
    const originalLinePriceCents = unitPriceCents * quantity;
    const lineDiscountCents = Math.max(0, originalLinePriceCents - linePriceCents);
    const lineDiscountAllocations = (line.discountAllocations ?? []).map((a) =>
      DiscountMapper.toItemDiscount(a, primaryDiscountTitle),
    );

    const options = (line.merchandise?.selectedOptions ?? []).map((o) => ({
      name: o.name,
      value: o.value,
    }));

    return {
      id: variantId,
      properties: {},
      quantity,
      variant_id: variantId,
      key: `${variantId ?? "unknown"}:${line.id ?? "line"}`,
      title: productTitle || variantTitle,
      price: unitPriceCents,
      original_price: unitPriceCents,
      discounted_price: unitPriceCents,
      line_price: linePriceCents,
      original_line_price: originalLinePriceCents,
      total_discount: lineDiscountCents,
      discounts: lineDiscountAllocations,
      sku: "",
      grams: 0,
      vendor: "",
      taxable: true,
      product_id: productId,
      product_has_only_default_variant: false,
      gift_card: false,
      final_price: unitPriceCents,
      final_line_price: linePriceCents,
      url: handle ? `/product/${handle}` : "/",
      featured_image: image
        ? {
            aspect_ratio: image.width && image.height ? image.width / image.height : 1,
            alt: image.altText ?? productTitle,
            height: image.height ?? 0,
            url: image.url,
            width: image.width ?? 0,
          }
        : null,
      image: image?.url ?? null,
      handle,
      requires_shipping: true,
      product_type: "",
      product_title: productTitle,
      product_description: "",
      variant_title: variantTitle || null,
      variant_options: options.map((o) => o.value),
      options_with_values: options,
      line_level_discount_allocations: lineDiscountAllocations,
      line_level_total_discount: lineDiscountCents,
      quantity_rule: { min: 1, max: null, increment: 1 },
      has_components: false,
    };
  }
}

