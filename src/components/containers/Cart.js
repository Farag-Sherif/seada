import React, { useContext, Fragment, useState } from "react";
import Link from "@/router/NextLinkCompat";
import CartContext from "../../helpers/cart";
import { Media } from "reactstrap";
import { CurrencyContext } from "../../helpers/Currency/CurrencyContext";
import { useLanguage } from "../../helpers/Language/useLanguage";

import StyleTag from "@/styles/StyleTag";
/* i18n helper with fallback */
const tr = (t, key, fallback) => {
  try {
    const v = t ? t(key) : "";
    return !v || v === key ? fallback : v;
  } catch {
    return fallback;
  }
};

/* format numbers (Arabic digits when RTL) */
const fmtNum = (n, isRTL) => {
  try {
    return Number(n).toLocaleString(isRTL ? "ar" : undefined);
  } catch {
    return n;
  }
};

const CartComponent = ({ icon, layout }) => {
  const context = useContext(CartContext);
  const currContext = useContext(CurrencyContext);
  const { t, isRTL, locale } = useLanguage();

  const symbol = currContext.state.symbol;
  const cartList = context.state;
  const total = context.cartTotal;
  const removeFromCart = context.removeFromCart;
  const [openSide, setOpenSide] = useState(false);

  const dirStyle = { direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" };

  return (
    <Fragment>
      <li
        className="onhover-div mobile-cart"
        onClick={() => setOpenSide(true)}
        aria-label={tr(t, "open_cart", "Open cart")}
      >
        <div className="cart-qty-cls">{fmtNum(cartList.length, isRTL)}</div>
        <div>
          <Media alt="cart" src={icon} className="img-fluid blur-up lazyload" />
          {/* <i className="fa fa-shopping-cart" aria-hidden="true" /> */}
        </div>
      </li>

      <div
        id="cart_side"
        className={`add_to_cart ${layout} ${openSide ? "open-side" : ""} ${isRTL ? "rtl" : ""}`}
        style={dirStyle}
        role="dialog"
        aria-modal="true"
        aria-label={tr(t, "my_cart", "My cart")}
      >
        <a className="overlay" onClick={() => setOpenSide(false)} />

        <div className="cart-inner">
          <div className="cart_top">
            <h3>{tr(t, "my_cart", "my cart")}</h3>

            <button
              type="button"
              className="close-cart"
              onClick={() => setOpenSide(false)}
              aria-label={tr(t, "close", "Close")}
            >
              <i className="fa fa-times" aria-hidden="true" />
            </button>
          </div>

          <div className="cart_media">
            <ul className="cart_product">
              {cartList.length > 0 &&
                cartList.map((item, index) => (
                  <li key={`cart-popup-${index}`}>
                    <div className="media">
                      <a>
                        <Media alt="" className="me-3" src={`${item?.images[0]?.src}`} />
                      </a>
                      <div className="media-body">
                        <a>
                          <h4>{item.title}</h4>
                        </a>
                        <h4>
                          <span>
                            {fmtNum(item.qty, isRTL)} × {symbol} {fmtNum(item.price, isRTL)}
                          </span>
                        </h4>
                      </div>
                    </div>
                    <div className="close-circle">
                      <button
                        type="button"
                        className="btn p-0"
                        onClick={() => removeFromCart(item)}
                        aria-label={tr(t, "remove_item", "Remove item")}
                      >
                        <i className="fa fa-trash" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
            </ul>

            <ul className="cart_total">
              <li>
                <div className="total">
                  <h5>
                    {tr(t, "subtotal", "subtotal")} :{" "}
                    <span>
                      {symbol} {fmtNum(total, isRTL)}
                    </span>
                  </h5>
                </div>
              </li>
              <li>
                <div className="buttons" style={{display:"flex",gap:'16px'}}>
                  <Link href="/page/account/cart" className="btn btn-solid btn-xs view-cart">
                    {tr(t, "view_cart", "view cart")}
                  </Link>
                  <Link href="/page/account/checkout" className="btn btn-solid btn-xs checkout">
                    {tr(t, "checkout", "checkout")}
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Optional: small RTL CSS hook if you need it */}
      <StyleTag global css={`
        /* Example: slide panel edge for RTL (edit if your CSS already handles it) */
        .add_to_cart.rtl.open-side {
          right: 0;
          left: auto;
        }
      `} />
    </Fragment>
  );
};

export default CartComponent;
