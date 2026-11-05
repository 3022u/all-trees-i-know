import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AjaxCartMapper } from "lib/ajax-cart";
import { shopifyFetch } from "lib/shopify";
import { getCartQuery } from "lib/shopify/queries/cart";
import type { Cart, ShopifyCart, ShopifyCartOperation } from "lib/shopify/types";

class CartIdResolver {
  static fromCookies(cartIdCookie: string | null, cartCookie: string | null): string | null {
    if (cartIdCookie) return cartIdCookie;
    if (!cartCookie) return null;

    const decoded = decodeURIComponent(cartCookie);
    const token = decoded.replace(/^gid:\/\/shopify\/Cart\//, "");
    return `gid://shopify/Cart/${token}`;
  }
}

async function fetchCartById(cartId: string) {
  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
  });
  return res.body.data.cart;
}

function reshapeCart(cart: ShopifyCart): Cart {
  const totalTaxAmount =
    cart.cost?.totalTaxAmount ??
    ({
      amount: "0.0",
      currencyCode: cart.cost.totalAmount.currencyCode,
    } as const);

  return {
    ...cart,
    cost: {
      ...cart.cost,
      totalTaxAmount,
    },
    lines: cart.lines.edges.map((edge) => edge?.node),
  };
}

export async function GET() {
  const cookieStore = await cookies();
  const cartIdCookie = cookieStore.get("cartId")?.value ?? null;
  const cartTokenCookie = cookieStore.get("cart")?.value ?? null;

  const resolvedCartId = CartIdResolver.fromCookies(cartIdCookie, cartTokenCookie);
  const rawCart = resolvedCartId ? await fetchCartById(resolvedCartId) : undefined;
  const cart = rawCart ? reshapeCart(rawCart) : undefined;

  const body = AjaxCartMapper.toAjaxCart(cart, cartTokenCookie ?? cartIdCookie);
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

