"use server";

import { TAGS } from "lib/constants";
import {
    addToCart,
    createCart,
    getCart,
    removeFromCart,
    updateCart,
} from "lib/shopify";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined,
) {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    // Check if we have a valid cart, create one if needed
    let cart = await getCart();
    console.log("DEBUG: Existing cart:", cart?.id);

    if (!cart) {
      cart = await createCart();
      console.log("DEBUG: Created new cart:", cart?.id);

      const cartToken = cart.id!.split("/").pop()!;
      const cookieOpts = {
        path: "/",
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
      };
      (await cookies()).set("cartId", cart.id!, cookieOpts);
      // Set native `cart` cookie so Chekly's client-side script can read the token
      (await cookies()).set("cart", cartToken, cookieOpts);
      console.log("DEBUG: Set cookie for cart:", cart.id);
    }

    console.log("DEBUG: About to add to cart with ID:", cart.id);
    const result = await addToCart(
      [{ merchandiseId: selectedVariantId, quantity: 1 }],
      cart.id,
    );
    console.log("DEBUG: Add to cart result:", result);

    revalidateTag(TAGS.cart, { expire: 0 });
  } catch (e) {
    console.error("DEBUG: Error in addItem:", e);
    return "Error adding item to cart";
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart, { expire: 0 });
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  },
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart, { expire: 0 });
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  let cart = await getCart();
  if (!cart || !cart.id) redirect("/");

  const cartToken = cart.id.split("/").pop()!;
  const shopifyDomain = (process.env.SHOPIFY_STORE_DOMAIN ?? "").replace(
    /^https?:\/\//,
    "",
  );

  const cheklyUrl = new URL("https://chekly-app.com/checkout/");
  cheklyUrl.searchParams.set("storeName", shopifyDomain);
  cheklyUrl.searchParams.set("cartToken", cartToken);
  cheklyUrl.searchParams.set("curRate", "1.0");
  cheklyUrl.searchParams.set("theme", "chekly");
  cheklyUrl.searchParams.set("shopifyDomain", shopifyDomain);

  const cookiesList = await cookies();
  const preferredLocale = cookiesList.get("preferred-locale")?.value;
  if (preferredLocale) {
    const checkoutLocale = preferredLocale === "ua" ? "uk" : "en";
    cheklyUrl.searchParams.set("locale", checkoutLocale);
  }

  console.log("Redirecting to Chekly checkout:", cheklyUrl.toString());
  redirect(cheklyUrl.toString());
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set("cartId", cart.id!, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}
