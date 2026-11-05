!(function () {
  "use strict";
  (() => {
    const t = () => {
      const t = sessionStorage.getItem("chekly_return_timestamp");
      return !!t && 15e3 > Date.now() - parseInt(t, 10);
    };
    try {
      const e =
        Object.getOwnPropertyDescriptor(window, "location") ||
        Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(window),
          "location",
        );
      if (e && e.set) {
        const o = e.set;
        Object.defineProperty(window, "location", {
          set: function (e) {
            const n = "string" == typeof e ? e : e.href || "";
            (t() && n.includes("/checkout") && !n.includes("/cart")) ||
              o.call(window, e);
          },
          get: e.get,
          configurable: !0,
        });
      }
      const o =
        Object.getOwnPropertyDescriptor(window.location, "href") ||
        Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(window.location),
          "href",
        );
      if (o && o.set) {
        const e = o.set;
        Object.defineProperty(window.location, "href", {
          set: function (o) {
            (t() &&
              "string" == typeof o &&
              o.includes("/checkout") &&
              !o.includes("/cart")) ||
              e.call(window.location, o);
          },
          get: o.get,
          configurable: !0,
        });
      }
      const n = window.location.replace;
      window.location.replace = function (e) {
        if (
          !t() ||
          "string" != typeof e ||
          !e.includes("/checkout") ||
          e.includes("/cart")
        )
          return n.call(window.location, e);
      };
      const r = window.location.assign;
      window.location.assign = function (e) {
        if (
          !t() ||
          "string" != typeof e ||
          !e.includes("/checkout") ||
          e.includes("/cart")
        )
          return r.call(window.location, e);
      };
    } catch (t) {}
  })();
  const t = () => {
    const t = sessionStorage.getItem("chekly_redirecting"),
      e = sessionStorage.getItem("chekly_about_to_redirect"),
      o = document.referrer,
      n = o && (o.includes("chekly") || o.includes("chekly-app.com")),
      r = window.location.pathname.includes("/cart");
    if ("true" === t || n || (("true" === e || "true" === t) && r)) {
      const t = Date.now().toString();
      sessionStorage.setItem("chekly_return_timestamp", t),
        sessionStorage.removeItem("chekly_redirecting"),
        sessionStorage.removeItem("chekly_about_to_redirect"),
        sessionStorage.removeItem("chekly_redirect_timestamp");
    }
  };
  t(),
    window.addEventListener("pageshow", (e) => {
      t();
    });
  class e {
    static getCookie(t) {
      const e = t.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1"),
        o = RegExp(`(?:^|; )${e}=([^;]*)`),
        n = document.cookie.match(o);
      return n ? decodeURIComponent(n[1]) : void 0;
    }
    static setCookie(t, e) {
      const o = new Date(Date.now() + 18e5).toUTCString();
      document.cookie = `${t}=${e}; expires=${o}; path=/;`;
    }
    static setCookieWithExpire(t, e, o) {
      const n = new Date(Date.now() + 864e5 * o).toUTCString();
      document.cookie = `${t}=${e}; expires=${n}; path=/;`;
    }
  }
  class o {
    static isChild(t, e) {
      let o = e.parentNode;
      for (; o; ) {
        if (o === t) return !0;
        o = o.parentNode;
      }
      return !1;
    }
    static debounce(t, e) {
      let o = !1;
      return function (...n) {
        o ||
          ((o = !0),
          setTimeout(() => {
            t.apply(this, n), (o = !1);
          }, e));
      };
    }
  }
  class n {
    static clearCart() {
      return fetch("/cart/clear.js", {
        method: "POST",
        credentials: "same-origin",
      });
    }
    static addToCart(t) {
      const e = "FORM" === t.nodeName ? new FormData(t) : t;
      return fetch("/cart/add.js", {
        method: "POST",
        credentials: "same-origin",
        body: e,
      });
    }
  }
  class r {
    constructor() {
      (this._cache = null), (this._pending = !1);
    }
    getLinkerParam() {
      try {
        if ("string" == typeof this._cache) return this._cache;
        try {
          const t = new URLSearchParams(window.location.search).get("_gl");
          if (t) {
            const e = "_gl=" + t;
            return (this._cache = e), e;
          }
        } catch (t) {}
        try {
          if ("undefined" != typeof gtag && Array.isArray(window.dataLayer)) {
            const t = window.dataLayer.find(
              (t) =>
                Array.isArray(t) &&
                "config" === t[0] &&
                "string" == typeof t[1] &&
                t[1].startsWith("G-"),
            );
            if (t && !this._pending) {
              this._pending = !0;
              const e = t[1];
              setTimeout(() => {
                try {
                  gtag("get", e, "linker_param", (t) => {
                    (this._pending = !1),
                      t &&
                        "string" == typeof t &&
                        t.includes("_gl=") &&
                        (this._cache = t);
                  });
                } catch (t) {
                  this._pending = !1;
                }
              }, 0);
            }
          }
        } catch (t) {}
        return "";
      } catch (t) {
        return console.warn("Error getting GA linker param:", t), "";
      }
    }
    clearCache() {
      (this._cache = null), (this._pending = !1);
    }
  }
  class i {
    constructor(t) {
      (this.cookieHelper = t),
        (this.trackingCookieName = "chekly_tracking"),
        (this.trackingCookieExpirationDays = 7),
        (this.trackingParams = [
          "utm_campaign",
          "utm_medium",
          "utm_source",
          "utm_content",
          "utm_term",
          "utm_id",
          "fbclid",
          "ttclid",
          "epik",
          "ScCid",
          "gclid",
        ]);
    }
    saveTrackingParams(t) {
      const e = {};
      let o = !1;
      this.trackingParams.forEach((n) => {
        const r = t.get(n);
        r && ((e[n] = r), (o = !0));
      }),
        o &&
          this.cookieHelper.setCookieWithExpire(
            this.trackingCookieName,
            JSON.stringify(e),
            this.trackingCookieExpirationDays,
          );
    }
    getTrackingParams(t) {
      let e = {};
      try {
        const t = this.cookieHelper.getCookie(this.trackingCookieName);
        t && (e = JSON.parse(t));
      } catch (t) {
        console.warn("Error parsing tracking cookie:", t);
      }
      const o = (o) => t.get(o) || e[o] || "",
        n = {
          utm_campaign: o("utm_campaign"),
          utm_medium: o("utm_medium"),
          utm_source: o("utm_source"),
          utm_content: o("utm_content"),
          utm_term: o("utm_term"),
          utm_id: o("utm_id"),
          fbclid: o("fbclid"),
          ttclid: o("ttclid"),
          epik: o("epik"),
          scCid: o("ScCid"),
        };
      return (
        n.utm_campaign &&
          n.utm_campaign.includes("__CAMPAIGN_NAME__") &&
          console.warn(
            "TikTok macro __CAMPAIGN_NAME__ not expanded:",
            n.utm_campaign,
          ),
        n.utm_id &&
          n.utm_id.includes("__CAMPAIGN_ID__") &&
          console.warn("TikTok macro __CAMPAIGN_ID__ not expanded:", n.utm_id),
        n
      );
    }
    buildTrackingQueryString(t, e = {}) {
      return [
        t.utm_campaign
          ? "utm_campaign=" + encodeURIComponent(t.utm_campaign)
          : "",
        t.utm_medium ? "utm_medium=" + encodeURIComponent(t.utm_medium) : "",
        t.utm_source ? "utm_source=" + encodeURIComponent(t.utm_source) : "",
        t.utm_content ? "utm_content=" + encodeURIComponent(t.utm_content) : "",
        t.utm_term ? "utm_term=" + encodeURIComponent(t.utm_term) : "",
        t.utm_id ? "utm_id=" + encodeURIComponent(t.utm_id) : "",
        t.fbclid ? "fbclid=" + encodeURIComponent(t.fbclid) : "",
        t.ttclid ? "ttclid=" + encodeURIComponent(t.ttclid) : "",
        t.epik ? "epik=" + encodeURIComponent(t.epik) : "",
        t.scCid ? "sccid=" + encodeURIComponent(t.scCid) : "",
        e.fbc ? "_fbc=" + encodeURIComponent(e.fbc) : "",
        e.fbp ? "_fbp=" + encodeURIComponent(e.fbp) : "",
        e.ttp ? "ttp=" + encodeURIComponent(e.ttp) : "",
        e.lang ? "utm_lang=" + e.lang : "",
        e.sa_p || "",
      ]
        .filter(Boolean)
        .join("&");
    }
  }
  class s {
    constructor(t) {
      (this.config = t),
        (this.selectors = {
          checkoutForm:
            'form[action="/checkout"], form[action="/a/checkout"], form[action^="/cart"]:not([action="/cart"]):not([action^="/cart/"])',
          checkoutButton:
            '[name="checkout"],[name="Checkout"],[class*="opcCheckout"],[class*="checkout-btn"],[class*="btn-checkout"],[class*="checkout-button"],[class*="button-checkout"],[class*="carthook_checkout"],[type*="submit"][class*="action_button"]:not([name*="add"]),[href*="/checkout"][class*="action_button"],[id*="checkout"],[id*="Checkout"],[id*="checkout-button"],[id*="checkout-btn"]',
          directCheckoutLink:
            'a[href^="/checkout"],[onclick*="/checkout"],a[href*="/checkout"]',
          addToCartForm: 'form[action^="/cart/add"]',
          returnToField: 'input[name="return_to"][value*="checkout"]',
          buyNowForm: 'form[action^="/cart/add"][data-skip-cart="true"]',
          checkoutUpdateButton: '[type="submit"][name="update"]',
          dynamicPaymentButton:
            '[data-shopify="payment-button"] button,[data-shopify="payment-button"] .shopify-payment-button__button',
          dynamicPaymentButtonContainer: '[data-shopify="payment-button"]',
        });
    }
    getCheckoutForms() {
      return document.querySelectorAll(this.selectors.checkoutForm);
    }
    getCheckoutButtons() {
      return document.querySelectorAll(this.selectors.checkoutButton);
    }
    getCheckoutLinks() {
      return document.querySelectorAll(this.selectors.directCheckoutLink);
    }
    getBuyItNowForms() {
      return [...document.querySelectorAll(this.selectors.buyNowForm)];
    }
    cleanupReturnToFields() {
      document
        .querySelectorAll('input[name="return_to"][data-chekly-return-to]')
        .forEach((t) => {
          t.remove();
        });
    }
    getAddToCartForm() {
      return document.querySelector(this.selectors.addToCartForm);
    }
    getDynamicPaymentButtons() {
      return document.querySelectorAll(this.selectors.dynamicPaymentButton);
    }
    getUpdateCartButtons() {
      return document.querySelectorAll(this.selectors.checkoutUpdateButton);
    }
    getDynamicPaymentButtonContainer() {
      return document.querySelector(
        this.selectors.dynamicPaymentButtonContainer,
      );
    }
    isProcessed(t) {
      return "true" === t.getAttribute(this.config.dataAttrCheckout);
    }
    markAsProcessed(t) {
      t.setAttribute(this.config.dataAttrCheckout, "true");
    }
  }
  class c {
    constructor(t, e) {
      (this.domHandler = t),
        (this.config = e),
        (this._listeners = new Map()),
        this._setupGlobalListeners();
    }
    _setupGlobalListeners() {
      ["click", "mousedown", "touchstart", "submit"].forEach((t) => {
        if (!this._listeners.has(t)) {
          const e = (e) => {
            const n = e.target,
              r = this._listeners.get(t);
            if (r && r.elementMap)
              for (const [t, i] of r.elementMap.entries())
                if (n === t || o.isChild(t, n)) {
                  e.stopImmediatePropagation(),
                    e.preventDefault(),
                    i.forEach((t) => t(e));
                  break;
                }
          };
          window.addEventListener(t, e, !0),
            this._listeners.set(t, { handler: e, elementMap: new Map() });
        }
      });
    }
    _removeElementListeners(t, e) {
      e.forEach((e) => {
        const o = this._listeners.get(e);
        o && o.elementMap && o.elementMap.delete(t);
      });
    }
    addWrapperListener(t, e, o) {
      if (!t || !t.addEventListener) return;
      const n = this._listeners.get(e);
      if (!n)
        return this._setupGlobalListeners(), this.addWrapperListener(t, e, o);
      n.elementMap.has(t) || n.elementMap.set(t, []),
        n.elementMap.get(t).push(o);
    }
    removeWrapperListener(t, e, o) {
      const n = this._listeners.get(e);
      if (!n || !n.elementMap) return;
      const r = n.elementMap.get(t);
      if (r) {
        const e = r.indexOf(o);
        e > -1 && r.splice(e, 1), 0 === r.length && n.elementMap.delete(t);
      }
    }
    clearAllListeners() {
      this._listeners.forEach((t, e) => {
        t.handler && window.removeEventListener(e, t.handler, !0);
      }),
        this._listeners.clear(),
        this._setupGlobalListeners();
    }
    attachCheckoutFormHandlers(t, e = !1) {
      [...this.domHandler.getCheckoutForms()].forEach((o) => {
        this.domHandler.isProcessed(o) ||
          (this._removeElementListeners(o, ["submit"]),
          e &&
            o.addEventListener(
              "submit",
              (t) => {
                t.preventDefault(), t.stopImmediatePropagation();
              },
              { capture: !0, once: !0 },
            ),
          this.addWrapperListener(o, "submit", () => {
            t();
          }),
          this.domHandler.markAsProcessed(o));
      });
    }
    attachCheckoutButtonHandlers(t) {
      [
        ...this.domHandler.getCheckoutLinks(),
        ...this.domHandler.getCheckoutButtons(),
      ].forEach((e) => {
        this.domHandler.isProcessed(e) ||
          (this._removeElementListeners(e, [
            "click",
            "mousedown",
            "touchstart",
          ]),
          ["mousedown", "touchstart", "click"].forEach((o) => {
            this.addWrapperListener(e, o, () => {
              t();
            });
          }),
          this.domHandler.markAsProcessed(e));
      });
    }
    attachBuyNowFormHandlers(t) {
      [...this.domHandler.getBuyItNowForms()].forEach((e) => {
        this.domHandler.isProcessed(e) ||
          (this._removeElementListeners(e, ["submit"]),
          this.addWrapperListener(e, "submit", () => {
            t(e);
          }),
          this.domHandler.markAsProcessed(e));
      });
    }
    attachUpdateCartHandlers() {
      [...this.domHandler.getUpdateCartButtons()].forEach((t) => {
        this.domHandler.isProcessed(t) ||
          (this._removeElementListeners(t, ["click"]),
          this.addWrapperListener(t, "click", () => {
            const e = t.closest("form");
            e && e.submit();
          }),
          this.domHandler.markAsProcessed(t));
      });
    }
    attachDynamicPaymentButtonHandlers(t) {
      [...this.domHandler.getDynamicPaymentButtons()].forEach((e) => {
        this.domHandler.isProcessed(e) ||
          (this._removeElementListeners(e, ["click"]),
          this.addWrapperListener(e, "click", () => {
            t(e);
          }),
          this.domHandler.markAsProcessed(e));
      });
    }
  }
  class a {
    static getOriginUrl() {
      return window.location.origin;
    }
    static getCartToken(t) {
      return t.getCookie("cart");
    }
    static getStoreName() {
      return window.Shopify && window.Shopify.shop ? window.Shopify.shop : "";
    }
    static getStoreActiveCurrency() {
      return window.Shopify?.currency?.active || "";
    }
    static getStoreActiveCurrencyRate() {
      return window.Shopify?.currency?.rate || 1;
    }
    static getStoreCountry() {
      return window.Shopify?.country || "";
    }
    static getStoreRootRoute() {
      return window.Shopify?.routes?.root || "";
    }
    static getUserName() {
      return window.Shopify?.customer?.firstName || null;
    }
    static getUserLastName() {
      return window.Shopify?.customer?.lastName || null;
    }
    static getUserEmail() {
      return window.Shopify?.customer?.email || null;
    }
    static getUserPhone() {
      return window.Shopify?.customer?.phone || null;
    }
  }
  class u {
    constructor(t = {}) {
      (this.config = {
        dataAttrAppUrl: t.dataAttrAppUrl || "data-chekly-url",
        dataAttrCheckout: t.dataAttrCheckout || "chekly-procceded",
        dataAttrCustomDomain: t.dataAttrCustomDomain || "data-checkout-domain",
        dataAttrCheckoutTheme: t.dataAttrCheckoutTheme || "data-chekly-theme",
        defaultAppBaseUrl: t.defaultAppBaseUrl || "https://chekly-app.com",
        domainPath: t.domainPath || "checkout",
      }),
        (this.isCheckoutProcessing = !1),
        (this.isReturningFromChekly = !1),
        (this.returnCooldownPeriod = 15e3),
        (this.cookieHelper = e),
        (this.cartAPI = n),
        (this.domHandler = new s(this.config)),
        (this.eventHandler = new c(this.domHandler, this.config)),
        (this.trackingManager = new i(this.cookieHelper)),
        (this.gaLinker = new r()),
        (this.shopifyData = a),
        (this.hooks = {
          beforeCheckout: [],
          afterCheckout: [],
          beforeTrackingSave: [],
          afterTrackingSave: [],
          beforeUrlBuild: [],
          afterUrlBuild: [],
        });
    }
    on(t, e) {
      this.hooks[t] && "function" == typeof e && this.hooks[t].push(e);
    }
    executeHook(t, e) {
      return this.hooks[t]
        ? this.hooks[t].reduce((e, o) => {
            try {
              return void 0 !== o(e) ? o(e) : e;
            } catch (o) {
              return console.warn(`Error in hook ${t}:`, o), e;
            }
          }, e)
        : e;
    }
    getAppBaseUrl() {
      const t = document.querySelector(`[${this.config.dataAttrAppUrl}]`);
      if (!t) return this.config.defaultAppBaseUrl;
      const e = t.getAttribute(this.config.dataAttrCustomDomain),
        o = t.getAttribute(this.config.dataAttrAppUrl);
      return e || o || this.config.defaultAppBaseUrl;
    }
    getCheckoutTheme() {
      const t = document.querySelector(`[${this.config.dataAttrAppUrl}]`);
      return (t && t.getAttribute(this.config.dataAttrCheckoutTheme)) || !1;
    }
    async submitBuyNowForm(t) {
      let e = t.closest("form") || this.domHandler.getAddToCartForm();
      if (e) {
        if (!e.querySelector('[name="quantity"]')) {
          const t = document.createElement("input");
          (t.type = "hidden"),
            (t.name = "quantity"),
            (t.value = "1"),
            e.appendChild(t);
        }
        if (e.querySelector('input[name="return_to"]')) {
          const t = e.querySelector('input[name="return_to"]');
          t && t.setAttribute("data-chekly-return-to", "true");
        } else {
          const t = document.createElement("input");
          (t.type = "hidden"),
            (t.name = "return_to"),
            (t.value = "/checkout"),
            t.setAttribute("data-chekly-return-to", "true"),
            e.appendChild(t);
        }
        try {
          await this.cartAPI.clearCart(),
            await this.cartAPI.addToCart(e),
            this.processCheckout();
        } catch (t) {
          console.error("Error in buy now flow:", t),
            (this.isCheckoutProcessing = !1);
        }
      }
    }
    isInReturnCooldown() {
      if (!this.isReturningFromChekly) return !1;
      try {
        const t = sessionStorage.getItem("chekly_return_timestamp");
        return t
          ? Date.now() - parseInt(t, 10) <= this.returnCooldownPeriod ||
              (sessionStorage.removeItem("chekly_return_timestamp"),
              (this.isReturningFromChekly = !1),
              !1)
          : ((this.isReturningFromChekly = !1), !1);
      } catch (t) {
        return (this.isReturningFromChekly = !1), !1;
      }
    }
    isComingFromChekly() {
      try {
        const t = document.referrer;
        if (!t) return !1;
        const e = this.getAppBaseUrl(),
          o = new URL(t).hostname;
        return o === new URL(e).hostname || o.includes("chekly");
      } catch (t) {
        return !1;
      }
    }
    markRedirectingToChekly() {
      try {
        sessionStorage.setItem("chekly_redirecting", "true"),
          sessionStorage.setItem(
            "chekly_redirect_timestamp",
            Date.now().toString(),
          ),
          sessionStorage.setItem("chekly_about_to_redirect", "true");
      } catch (t) {}
    }
    checkAndHandleReturnFromChekly() {
      try {
        const t = sessionStorage.getItem("chekly_redirecting"),
          e = sessionStorage.getItem("chekly_about_to_redirect"),
          o = this.isComingFromChekly(),
          n = window.location.pathname.includes("/cart");
        ("true" === t || "true" === e || o || (t && n)) &&
          ((this.isReturningFromChekly = !0),
          sessionStorage.setItem(
            "chekly_return_timestamp",
            Date.now().toString(),
          ),
          sessionStorage.removeItem("chekly_redirecting"),
          sessionStorage.removeItem("chekly_about_to_redirect"),
          sessionStorage.removeItem("chekly_redirect_timestamp"),
          this.domHandler.cleanupReturnToFields(),
          setTimeout(() => {
            this.isReturningFromChekly = !1;
            try {
              sessionStorage.removeItem("chekly_return_timestamp");
            } catch (t) {}
          }, this.returnCooldownPeriod));
      } catch (t) {}
    }
    processCheckout(t = !1) {
      if (this.isCheckoutProcessing) return;
      if (this.isInReturnCooldown() && !t) return;
      if (!1 === this.executeHook("beforeCheckout", !0)) return;
      this.isCheckoutProcessing = !0;
      const e = this.getAppBaseUrl(),
        o = this.shopifyData.getCartToken(this.cookieHelper),
        n = this.shopifyData.getOriginUrl().replace(/^https?:\/\//, ""),
        r = this.shopifyData.getStoreRootRoute(),
        i = this.shopifyData.getStoreName(),
        s = this.shopifyData.getStoreActiveCurrencyRate(),
        c = this.getCheckoutTheme(),
        a = this.shopifyData.getUserName(),
        u = this.shopifyData.getUserLastName(),
        h = this.shopifyData.getUserEmail(),
        d = this.shopifyData.getUserPhone(),
        l = new URLSearchParams(window.location.search),
        m = this.trackingManager.getTrackingParams(l),
        p = this.cookieHelper.getCookie("_fbp"),
        g = this.cookieHelper.getCookie("_fbc"),
        k = this.cookieHelper.getCookie("_ttp"),
        y = this.cookieHelper.getCookie("_shopify_sa_p"),
        f =
          (navigator.languages && navigator.languages[0]?.slice(0, 2)) ||
          navigator.language.slice(0, 2);
      if (e && o && n) {
        let t = `${e}/${this.config.domainPath}/?storeName=${n}&cartToken=${o}&curRate=${s}${c ? "&theme=" + c : ""}&shopifyDomain=${i}${r.length > 2 ? "&subFolder=" + r.replace(/\//g, "") : ""}`;
        const l = [];
        null !== a && l.push("user_name=" + a),
          null !== u && l.push("user_lastname=" + u),
          null !== h && l.push("user_email=" + h),
          null !== d && l.push("user_phone=" + d),
          l.length && (t += "&" + l.join("&"));
        const _ = { fbc: g, fbp: p, ttp: k, lang: f, sa_p: y };
        let w = this.trackingManager.buildTrackingQueryString(m, _),
          C = this.executeHook("beforeUrlBuild", t);
        w && (C += "&" + w);
        const b = this.gaLinker.getLinkerParam();
        b && (C += "&" + b),
          (C = this.executeHook("afterUrlBuild", C)),
          this.executeHook("afterCheckout", { url: C }),
          this.markRedirectingToChekly();
        try {
          sessionStorage.setItem("chekly_redirecting", "true"),
            sessionStorage.setItem(
              "chekly_redirect_timestamp",
              Date.now().toString(),
            ),
            sessionStorage.setItem("chekly_about_to_redirect", "true");
        } catch (t) {}
        window.addEventListener(
          "beforeunload",
          () => {
            try {
              sessionStorage.setItem("chekly_redirecting", "true"),
                sessionStorage.setItem("chekly_about_to_redirect", "true");
            } catch (t) {}
          },
          { once: !0 },
        ),
          (window.location = C);
      } else window.location = "/checkout";
    }
    duplicateCheckoutButtonAsLink() {
      try {
        const t = document.querySelectorAll(
          'button[type="submit"].cart__checkout-button',
        );
        let e = null;
        for (let o = 0; o < t.length; o++) {
          const n = t[o];
          if (
            ("checkout" === n.name || "checkout" === n.id) &&
            !n.hasAttribute("data-chekly-duplicated")
          ) {
            e = n;
            break;
          }
        }
        if (!e) return;
        const o = document.createElement("a");
        (o.className = e.className),
          (o.innerHTML = e.innerHTML),
          o.setAttribute("href", "#"),
          o.setAttribute("data-chekly-duplicated", "true"),
          e.setAttribute("data-chekly-duplicated", "true"),
          (e.style.display = "none"),
          o.addEventListener("click", (t) => {
            t.preventDefault(), this.processCheckout(!0);
          }),
          e.parentNode && e.parentNode.insertBefore(o, e.nextSibling);
      } catch (t) {
        console.warn("Error duplicating checkout button:", t);
      }
    }
    reInit(t = !1) {
      if ((this.domHandler.cleanupReturnToFields(), t)) {
        const t = document.getElementById("cart");
        t &&
          "/cart" === t.action &&
          "post" === t.method.toLowerCase() &&
          t.addEventListener(
            "submit",
            (t) => {
              this.isInReturnCooldown() &&
                (t.preventDefault(), t.stopImmediatePropagation());
            },
            { capture: !0, once: !0 },
          );
      }
      this.eventHandler.attachDynamicPaymentButtonHandlers((t) => {
        this.submitBuyNowForm(t);
      }),
        this.eventHandler.attachCheckoutFormHandlers(() => {
          this.processCheckout(!0);
        }, t),
        this.eventHandler.attachCheckoutButtonHandlers(() => {
          this.processCheckout(!0);
        }),
        this.eventHandler.attachBuyNowFormHandlers((t) => {
          this.submitBuyNowForm(t);
        }),
        this.eventHandler.attachUpdateCartHandlers(),
        this.duplicateCheckoutButtonAsLink();
    }
    init() {
      this.checkAndHandleReturnFromChekly(),
        this.domHandler.cleanupReturnToFields();
      const t = new URLSearchParams(window.location.search);
      this.executeHook("beforeTrackingSave", t),
        this.trackingManager.saveTrackingParams(t),
        this.executeHook("afterTrackingSave", t);
      const e = this.isInReturnCooldown();
      if (e) {
        const t = document.getElementById("cart");
        if (t && "/cart" === t.action && "post" === t.method.toLowerCase()) {
          const o = (t) => (
            t.preventDefault(),
            t.stopImmediatePropagation(),
            t.stopPropagation(),
            !1
          );
          t.addEventListener("submit", o, { capture: !0, passive: !1 });
          const n = t.submit;
          t.submit = function () {
            if (!e) return n.call(this);
          };
        }
        [...this.domHandler.getCheckoutForms()].forEach((t) => {
          ("cart" === t.id && "/cart" === t.action) ||
            t.addEventListener(
              "submit",
              (t) => {
                t.preventDefault(), t.stopImmediatePropagation();
              },
              { capture: !0, once: !0 },
            );
        });
      }
      this.reInit(e),
        "loading" === document.readyState &&
          document.addEventListener("DOMContentLoaded", () => {
            const t = this.isInReturnCooldown();
            this.reInit(t);
          }),
        window.addEventListener("load", () => {
          const t = this.isInReturnCooldown();
          this.reInit(t);
          const e = o.debounce(() => {
            const t = this.isInReturnCooldown();
            this.reInit(t);
          }, 500);
          new MutationObserver(() => e()).observe(document, {
            attributes: !0,
            childList: !0,
            subtree: !0,
          });
        }),
        window.addEventListener("pageshow", (t) => {
          (this.isCheckoutProcessing = !1),
            (t.persisted || this.isComingFromChekly()) &&
              this.checkAndHandleReturnFromChekly(),
            this.isInReturnCooldown() || this.reInit();
        }),
        window.addEventListener("focus", () => {
          this.isCheckoutProcessing && (this.isCheckoutProcessing = !1);
        }),
        window.addEventListener("popstate", () => {
          this.isCheckoutProcessing = !1;
        }),
        document.addEventListener("visibilitychange", () => {
          !document.hidden &&
            this.isCheckoutProcessing &&
            (this.isCheckoutProcessing = !1);
        });
    }
  }
  const h = new u();
  h.init(),
    "undefined" != typeof window &&
      ((window.CheckoutManager = u), (window.checkoutManager = h));
})();
