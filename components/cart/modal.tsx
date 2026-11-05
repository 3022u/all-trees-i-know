"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { useLanguage } from "lib/i18n";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";

type MerchandiseSearchParams = {
  [key: string]: string;
};

function CheckoutButton() {
  const { pending } = useFormStatus();
  const { t } = useLanguage();

  return (
    <button
      className="bg-black text-white uppercase text-[1.8rem] w-full block text-center rounded-[1.5rem] py-[2rem] box-border mb-[2rem] disabled:opacity-75"
      type="submit"
      disabled={pending}
    >
      {pending ? t("cart.redirecting") : t("cart.proceedToCheckout")}
    </button>
  );
}

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Note: Cart is created on-demand when adding items, not eagerly.
  // This preserves cart state when returning from an incomplete checkout.

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      // Only auto-open cart when adding first product (going from 0 to >0)
      if (!isOpen && (!quantityRef.current || quantityRef.current === 0)) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <button aria-label={t("cart.openCart")} onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-600"
            enterFrom="opacity-0 backdrop-blur-[none]"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-700 delay-300"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <img
              className="cursor-hover top-0 left-0 fixed w-screen h-[100dvh] object-center object-cover"
              src="https://cdn.shopify.com/s/files/1/0684/3439/5302/files/forest-backdrop.webp?v=1749591098"
              aria-hidden="true"
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300 delay-700"
            enterFrom="translate-y-[120%] dt:translate-y-0 dt:translate-x-[120%]"
            enterTo="translate-y-0 dt:translate-x-0"
            leave="transition-all ease-in-out duration-300"
            leaveFrom="translate-y-0 dt:translate-x-0"
            leaveTo="translate-y-[120%] dt:translate-y-0 dt:translate-x-[120%]"
          >
            <Dialog.Panel className="fixed h-[calc(75dvh-2rem)] dt:h-[calc(100dvh-2rem)] right-[1rem] bottom-[1rem] dt:bottom-auto dt:top-[1rem] w-[calc(100vw-2rem)] flex-col px-[2rem] pt-[2rem] dt:pt-[4rem] pb-[2.8rem] text-black dt:w-[33.3vw] rounded-[2.8rem] bg-white">
              <div className="flex items-center justify-between">
                <p className="font-bold text-[1.8rem] underline">
                  {t("cart.bag")}
                </p>
                <button aria-label={t("cart.closeCart")} onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="flex w-full h-full flex-col items-left justify-between">
                  <div></div>
                  <p className="text-[1.8rem] py-[4rem]">{t("cart.empty")}</p>
                  <Link
                    href="/shop/all"
                    className="bg-black text-white uppercase text-[1.8rem] w-full block text-center rounded-[1.5rem] py-[2rem] box-border mb-[2rem]"
                    onClick={closeCart}
                  >
                    {t("cart.backToShop")}
                  </Link>
                </div>
              ) : (
                <div className="flex w-full h-full flex-col items-left justify-between">
                  <div className="relative mb-[2rem] dt:mb-0  after:content-[''] after:absolute before:absolute after:bottom-0 before:top-0 after:left-0 before:left-0 after:right-0  before:right-0 after:h-[3.2rem] after:bg-gradient-to-b after:from-white/0 after:to-white after:pointer-events-none before:w-full before:h-[5rem] before:bg-gradient-to-t before:from-white/0 before:to-white before:z-10 after:z-10 before:pointer-events-none">
                    <ul className="flex flex-col gap-[2rem] max-h-[calc(75dvh-26rem)] dt:max-h-[calc(100dvh-26rem)]  overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-[3.2rem] pb-[3.2rem]">
                      {cart.lines
                        .sort((a, b) =>
                          a.merchandise.product.title.localeCompare(
                            b.merchandise.product.title,
                          ),
                        )
                        .map((item, i) => {
                          const merchandiseSearchParams =
                            {} as MerchandiseSearchParams;

                          item.merchandise.selectedOptions.forEach(
                            ({ name, value }) => {
                              if (value !== DEFAULT_OPTION) {
                                merchandiseSearchParams[name.toLowerCase()] =
                                  value;
                              }
                            },
                          );

                          const merchandiseUrl = createUrl(
                            `/product/${item.merchandise.product.handle}`,
                            new URLSearchParams(merchandiseSearchParams),
                          );

                          return (
                            <li key={i} className="flex w-full flex-col">
                              <div className="relative flex w-full flex-row justify-between gap-[1rem]">
                                <div className="grid grid-cols-4 w-full gap-[1rem]">
                                  <Image
                                    className="h-full w-full aspect-square object-cover object-center col-span-1"
                                    width={115}
                                    height={115}
                                    alt={
                                      item.merchandise.product.featuredImage
                                        .altText ||
                                      item.merchandise.product.title
                                    }
                                    src={
                                      item.merchandise.product.featuredImage.url
                                    }
                                  />
                                  <div className="flex flex-col justify-between w-full h-full col-span-3">
                                    <div className="flex flex-row items-start w-full justify-between">
                                      <Link
                                        href={merchandiseUrl}
                                        onClick={closeCart}
                                        className="flex flex-col"
                                      >
                                        <div className="text-[1.2rem]">
                                          {item.merchandise.product.title}
                                        </div>
                                        {item.merchandise.title !==
                                        DEFAULT_OPTION ? (
                                          <div className="text-[1.2rem]">
                                            {item.merchandise.title}
                                          </div>
                                        ) : null}
                                      </Link>

                                      <Price
                                        className="text-[1.2rem]"
                                        amount={item.cost.totalAmount.amount}
                                        currencyCode={
                                          item.cost.totalAmount.currencyCode
                                        }
                                      />
                                    </div>
                                    <div className="flex flex-row justify-between w-full items-center">
                                      <div className="flex w-[33.3%] flex-row justify-between items-center">
                                        <EditItemQuantityButton
                                          item={item}
                                          type="minus"
                                          optimisticUpdate={updateCartItem}
                                        />
                                        <p className="text-[1.2rem]">
                                          {item.quantity}
                                        </p>
                                        <EditItemQuantityButton
                                          item={item}
                                          type="plus"
                                          optimisticUpdate={updateCartItem}
                                        />
                                      </div>

                                      <DeleteItemButton
                                        item={item}
                                        optimisticUpdate={updateCartItem}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                  <div className="mt-auto mb-[2rem]">
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-col">
                        <p className="text-[1.8rem] text-uppercase">
                          {t("cart.subtotal")}
                        </p>
                        <p className="text-[1.2rem]">{t("cart.shippingTax")}</p>
                      </div>
                      <Price
                        className="text-[1.8rem] text-uppercase"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                  </div>
                  <form action={redirectToCheckout}>
                    <CheckoutButton />
                  </form>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex items-center justify-center text-black">
      <XMarkIcon
        className={clsx("h-[2rem] transition-all ease-in-out", className)}
      />
    </div>
  );
}
