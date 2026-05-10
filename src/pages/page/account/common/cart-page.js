// pages/page/account/cart.jsx (or wherever your CartPage lives)
import React, { useState, useContext } from "react";
import Link from "@/router/NextLinkCompat";
import CartContext from "../../../../helpers/cart";
import { Container, Row, Col, Media } from "reactstrap";
import { CurrencyContext } from "../../../../helpers/Currency/CurrencyContext";
import cartEmptyImg from "@/assets/images/icon-empty-cart.png";
import { useLanguage } from "../../../../helpers/Language/useLanguage";
import { useRouter } from "@/router/useRouter";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StyleTag from "@/styles/StyleTag";
const CartPage = () => {
  const router = useRouter();
  const context = useContext(CartContext);
  const cartItems = context?.state || [];
  const updateQty = context?.updateQty;
  const removeFromCart = context?.removeFromCart;

  const curContext = useContext(CurrencyContext);
  const symbol = curContext?.state?.symbol || "$";
  const total = context?.cartTotal || 0;

  const { t, isRTL } = useLanguage();
  const locale = isRTL ? "ar-EG" : "en-US";

  // ---- i18n helpers ----
  const tt = (key, fallback) => {
    try {
      const v = t?.(key);
      return typeof v === "string" ? v : fallback;
    } catch {
      return fallback;
    }
  };

  // ---- money formatting (locale-aware) ----
  const formatMoney = (n) =>
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(n ?? 0));

  // Symbol placement RTL/LTR
  const moneyWithSymbol = (n, sym) =>
    isRTL ? `${formatMoney(n)} ${sym}` : `${sym}${formatMoney(n)}`;

  const [quantityError, setQuantityError] = useState(false);

  const goToProduct = (id) => {
    if (!id && id !== 0) return;
    router.push(`/product-details/${id}`);
  };

  const handleQtyUpdate = (item, rawValue) => {
    const next = parseInt(rawValue, 10);

    if (Number.isNaN(next)) {
      setQuantityError(true);
      toast.error(tt("cart.quantity_invalid", "Please enter a valid number."), {
        theme: "light",
        style: { backgroundColor: "#fff", color: "#111", fontWeight: 500 },
      });
      return;
    }

    if (next < 1) {
      setQuantityError(true);
      toast.warn(tt("cart.quantity_min", "Quantity must be at least 1."), {
        theme: "light",
        style: { backgroundColor: "#fff", color: "#111", fontWeight: 500 },
      });
      return;
    }

    if (item.stock != null && next > item.stock) {
      setQuantityError(true);
      toast.info(
        tt(
          "cart.quantity_exceeds_stock",
          "Requested quantity exceeds available stock."
        ),
        {
          theme: "light",
          style: { backgroundColor: "#fff", color: "#111", fontWeight: 500 },
        }
      );
      return;
    }

    setQuantityError(false);
    updateQty(item, next);
    toast.success(tt("cart.quantity_updated", "Quantity updated."), {
      theme: "light",
      style: { backgroundColor: "#fff", color: "#111", fontWeight: 500 },
    });
  };

  const handleRemove = (item) => {
    removeFromCart(item);
    toast.info(
      `${item?.title || tt("cart.item", "Item")} ${tt(
        "cart.removed",
        "removed from cart."
      )}`,
      {
        theme: "light",
        style: { backgroundColor: "#fff", color: "#111", fontWeight: 500 },
      }
    );
  };

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      toast.warn(tt("cart.no_items_checkout", "Your cart is empty."), {
        theme: "light",
        style: { backgroundColor: "#fff", color: "#111", fontWeight: 500 },
      });
      return;
    }

    const invalid = cartItems.find(
      (it) => !it.qty || it.qty < 1 || (it.stock != null && it.qty > it.stock)
    );
    if (invalid) {
      toast.error(
        tt(
          "cart.fix_quantities_before_checkout",
          "Please fix item quantities before checking out."
        ),
        {
          theme: "light",
          style: { backgroundColor: "#fff", color: "#111", fontWeight: 500 },
        }
      );
      return;
    }

    router.push("/page/account/checkout");
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ textAlign: isRTL ? "right" : "left" }}>
      <ToastContainer
        position="top-right"
        pauseOnHover
        newestOnTop
        theme="light"
        toastStyle={{
          backgroundColor: "#fff",
          color: "#111",
          fontWeight: 500,
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      />

      {cartItems && cartItems.length > 0 ? (
        <section className="cart-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <table className="table cart-table table-responsive-xs">
                  <thead>
                    <tr className="table-head">
                      <th scope="col">{tt("cart.image", "Image")}</th>
                      <th scope="col">{tt("cart.product_name", "Product Name")}</th>
                      <th scope="col">{tt("cart.price", "Price")}</th>
                      <th scope="col">{tt("cart.quantity", "Quantity")}</th>
                      <th scope="col">{tt("cart.action", "Action")}</th>
                      <th scope="col">{tt("cart.total", "Total")}</th>
                    </tr>
                  </thead>

                  {cartItems.map((item, index) => {
                    const unitPrice =
                      item.price - (item.price * (item.discount || 0)) / 100;

                    return (
                      <tbody key={index}>
                        <tr>
                          {/* Image */}
                          <td style={{ cursor: "pointer" }} onClick={() => goToProduct(item.id)}>
                            <Media
                              src={item?.images?.[0]?.src || "/assets/images/placeholder.png"}
                              alt={item?.title || "Product"}
                              style={{ width: "150px" }}
                            />
                          </td>

                          {/* Name */}
                          <td style={{ cursor: "pointer" }} onClick={() => goToProduct(item.id)}>
                            <Link href={`/product-details/${item.id}`}>{item.title}</Link>

                            <div className="mobile-cart-content row">
                              <div className="col-xs-3">
                                <div className="qty-box">
                                  <div className="input-group">
                                    <input
                                      type="number"
                                      name="quantity"
                                      min="1"
                                      aria-label={tt("cart.quantity", "Quantity")}
                                      className="form-control input-number"
                                      value={item.qty}
                                      onChange={(e) => handleQtyUpdate(item, e.target.value)}
                                      style={{ borderColor: quantityError ? "red" : undefined }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                </div>
                                {item.stock != null && item.qty >= item.stock
                                  ? tt("cart.out_of_stock", "Out of stock")
                                  : ""}
                              </div>

                              <div className="col-xs-3">
                                <h2 className="td-color">
                                  {moneyWithSymbol(unitPrice, symbol)}
                                </h2>
                              </div>

                              <div className="col-xs-3">
                                <h2 className="td-color">
                                  <a
                                    href="#"
                                    className="icon"
                                    aria-label={tt("cart.remove", "Remove")}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleRemove(item);
                                    }}
                                  >
                                    <i className="fa fa-times"></i>
                                  </a>
                                </h2>
                              </div>
                            </div>
                          </td>

                          {/* Unit price */}
                          <td>
                            <h2>{moneyWithSymbol(unitPrice, symbol)}</h2>
                          </td>

                          {/* Quantity */}
                          <td>
                            <div className="qty-box">
                              <div className="input-group">
                                <input
                                  type="number"
                                  name="quantity"
                                  min="1"
                                  aria-label={tt("cart.quantity", "Quantity")}
                                  className="form-control input-number"
                                  value={item.qty}
                                  onChange={(e) => handleQtyUpdate(item, e.target.value)}
                                  style={{ borderColor: quantityError ? "red" : undefined }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                            {item.stock != null && item.qty >= item.stock
                              ? tt("cart.out_of_stock", "Out of stock")
                              : ""}
                          </td>

                          {/* Action */}
                          <td>
                            <div className="action-btns">
                              <a
                                href="#"
                                aria-label={tt("cart.remove", "Remove")}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemove(item);
                                }}
                              >
                                <i className="fa fa-times" />
                              </a>
                            </div>
                          </td>

                          {/* Row total */}
                          <td>
                            <h2 className="td-color">
                              {moneyWithSymbol(item.total, symbol)}
                            </h2>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>

                <table className="table cart-table table-responsive-md">
                  <tfoot>
                    <tr>
                      <td>{tt("cart.total_price", "Total Price")} :</td>
                      <td>
                        <h2>{moneyWithSymbol(total, symbol)} </h2>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </Col>
            </Row>

            <Row className="cart-buttons">
              <Col xs="6">
                <Link href={`/shop/sidebar_popup`} className="btn btn-solid">
                  {tt("cart.continue_shopping", "Continue Shopping")}
                </Link>
              </Col>
              <Col xs="6">
                <button type="button" className="btn btn-solid" onClick={handleCheckout}>
                  {tt("cart.checkout", "Checkout")}
                </button>
              </Col>
            </Row>
          </Container>
        </section>
      ) : (
        <section className="cart-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <div className="col-sm-12 empty-cart-cls text-center">
                  <Media src={cartEmptyImg.src} alt="" className="mb-3" style={{marginLeft:"auto",marginRight:"auto"}}/>
                  <h3>
                    <strong>{tt("cart.empty_title", "Your cart is empty")}</strong>
                  </h3>
                  <h4>
                    {tt(
                      "cart.empty_subtitle",
                      "Looks like you haven’t added anything to your cart yet."
                    )}
                  </h4>
                  <Link href="/shop/sidebar_popup" className="btn btn-solid mt-3">
                    {tt("cart.continue_shopping", "Continue Shopping")}
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* tiny spacing for action icons (future-proof if more than one icon) */}
      <StyleTag global css={`
        .action-btns {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
      `} />
    </div>
  );
};

export default CartPage;
