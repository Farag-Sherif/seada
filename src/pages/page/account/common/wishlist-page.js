import React, { useContext } from "react";
import { Container, Row, Col, Table } from "reactstrap";
import { WishlistContext } from "../../../../helpers/wishlist/WishlistContext";
import CartContext from "../../../../helpers/cart/index";
import { useRouter } from "@/router/useRouter";
import Link from "@/router/NextLinkCompat";
import { useLanguage } from "../../../../helpers/Language/useLanguage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StyleTag from "@/styles/StyleTag";
/* ---------- helpers ---------- */
const getId = (p) => p?.id ?? p?.product_id ?? p?.slug ?? null;

/** turn "E£ 220", "250.00 SAR", 250, etc → 250 (number) */
const parsePriceNumber = (val) => {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  if (val == null) return 0;
  const str = String(val);
  const cleaned = str.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const getUnitPrice = (item) => {
  const base =
    item?.price ??
    item?.sale_price ??
    item?.regular_price ??
    item?.amount ??
    item?.total_price ??
    0;
  const priceNum = parsePriceNumber(base);
  const discount = Number(item?.discount) || 0; // % discount if you use it
  const afterDiscount = priceNum - (priceNum * discount) / 100;
  return Number.isFinite(afterDiscount) ? afterDiscount : priceNum;
};

const getCurrency = (item) =>
  item?.currency_symbol ||
  item?.currency?.symbol ||
  item?.currency_code ||
  item?.currency?.code ||
  "£";

/* ---- localized currency formatter (keeps your symbol; Arabic digits in RTL) ---- */
const formatPrice = (amount, symbol, { isRTL, currentLanguage }) => {
  const locale = currentLanguage?.toLowerCase().startsWith("ar") ? "ar-EG" : "en-US";
  const nf = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...(isRTL ? { numberingSystem: "arab" } : {}),
  });
  const num = nf.format(Number(amount || 0));
  return isRTL ? `${num}\u00A0${symbol}` : `${symbol}${num}`;
};

const WishlistPage = () => {
  const router = useRouter();
  const context = useContext(WishlistContext);
  const cartContext = useContext(CartContext);
  const { t, isRTL, currentLanguage } = useLanguage();

  const wishlist = context?.wishlistItems || [];
  const removeFromWish = context?.removeFromWish;
  const addCart = cartContext?.addToCart;

  const checkOut = () => {
    if (wishlist.length === 0) {
      toast.warn(
        t("wishlist.no_items_checkout") ||
        (isRTL ? "قائمة الرغبات فارغة." : "Your wishlist is empty."),
        {
          theme: "light",
          style: { backgroundColor: "#fff", color: "#111", fontWeight: 500 },
        }
      );
      return;
    }
    router.push("/page/account/checkout");
  };

  const handleAddCart = (item) => {
    if (!item) return;

    const id = getId(item);
    if (id == null) {
      toast.error(isRTL ? "المعرّف مفقود." : "Missing product id.");
      return;
    }

    const unitPrice = getUnitPrice(item);
    const qty = item?.qty && item.qty > 0 ? item.qty : 1;

    const normalized = {
      ...item,
      id,
      qty,
      quantity: qty,
      price: unitPrice,
      total: Number((unitPrice * qty).toFixed(2)),
    };

    try {
      if (typeof addCart === "function") {
        if (addCart.length >= 2) {
          addCart(normalized, qty);
        } else {
          addCart(normalized);
        }
      } else {
        console.warn("addToCart not found in CartContext");
      }
    } catch (e) {
      console.error(e);
    }

    const symbol = getCurrency(item);
    toast.success(
      `${item.title || (isRTL ? "منتج" : "Item")} × ${qty} — ${formatPrice(
        unitPrice * qty,
        symbol,
        { isRTL, currentLanguage }
      )}`,
      {
        theme: "light",
        style: { backgroundColor: "#fff", color: "#111", fontWeight: 500 },
      }
    );
  };

  const handleRemove = (item) => {
    if (!item) return;
    removeFromWish(item);
    toast.info(
      `${item.title || (isRTL ? "منتج" : "Item")} ${isRTL ? "تمت إزالته من قائمة الرغبات." : "removed from wishlist."
      }`,
      {
        theme: "light",
        style: { backgroundColor: "#fff", color: "#111", fontWeight: 500 },
      }
    );
  };

  return (
    <>
      {/* Toastify container with dark text */}
      <ToastContainer
        position="top-right"
        pauseOnHover
        newestOnTop
        closeOnClick
        draggable
        theme="light"
        toastStyle={{
          backgroundColor: "#fff",
          color: "#111",
          fontWeight: 500,
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      />

      {wishlist.length > 0 ? (
        <section className="wishlist-section section-b-space" dir={isRTL ? "rtl" : "ltr"}>
          <Container>
            <Row>
              <Col sm="12">
                <Table className="table cart-table table-responsive-xs">
                  <thead>
                    <tr className="table-head">
                      <th scope="col">{t("wishlist.image") || (isRTL ? "الصورة" : "Image")}</th>
                      <th scope="col">
                        {t("wishlist.product_name") || (isRTL ? "اسم المنتج" : "Product Name")}
                      </th>
                      <th scope="col">{t("wishlist.price") || (isRTL ? "السعر" : "Price")}</th>
                      <th scope="col">
                        {t("wishlist.availability") || (isRTL ? "التوفر" : "Availability")}
                      </th>
                      <th scope="col">{t("wishlist.action") || (isRTL ? "إجراء" : "Action")}</th>
                    </tr>
                  </thead>

                  {wishlist.map((item, i) => {
                    const unitPrice = getUnitPrice(item);
                    const symbol = getCurrency(item);
                    const priceStr = formatPrice(unitPrice, symbol, { isRTL, currentLanguage });
                    return (
                      <tbody key={i}>
                        <tr>
                          <td>
                            <a href="#">
                              <img
                                src={item?.images?.[0]?.src || "/assets/images/placeholder.png"}
                                alt={item?.title || (isRTL ? "منتج" : "Product")}
                                style={{ width: 80, height: "auto" }}
                              />
                            </a>
                          </td>

                          <td>
                            <a href="#">{item.title}</a>
                            <Row className="mobile-cart-content">
                              <div className="col-xs-3">
                                <p className={item.stock > 0 ? "text-success" : "text-danger"}>
                                  {item.stock > 0
                                    ? t("wishlist.in_stock") || (isRTL ? "متوفر" : "In stock")
                                    : t("wishlist.out_of_stock") ||
                                    (isRTL ? "غير متوفر" : "Out of stock")}
                                </p>
                              </div>
                              <div className="col-xs-3">
                                <h2 className="td-color">{priceStr}</h2>
                              </div>
                              <div className="col-xs-3">
                                <h2 className="td-color">
                                  <a
                                    href="#"
                                    className={`icon ${isRTL ? "ms-1" : "me-1"}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleRemove(item);
                                    }}
                                    aria-label={isRTL ? "إزالة" : "Remove"}
                                  >
                                    <i className="fa fa-close"></i>
                                  </a>
                                  <a
                                    href="#"
                                    className="cart"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleAddCart(item);
                                    }}
                                    aria-label={isRTL ? "أضف إلى السلة" : "Add to cart"}
                                  >
                                    <i className="fa fa-shopping-cart"></i>
                                  </a>
                                </h2>
                              </div>
                            </Row>
                          </td>

                          <td>
                            <h2>{priceStr}</h2>
                          </td>

                          <td>
                            <p className={item.stock > 0 ? "text-success" : "text-danger"}>
                              {item.stock > 0
                                ? t("wishlist.in_stock") || (isRTL ? "متوفر" : "In stock")
                                : t("wishlist.out_of_stock") ||
                                (isRTL ? "غير متوفر" : "Out of stock")}
                            </p>
                          </td>

                          <td>
                            <div className="action-btns">
                              <a
                                href="#"
                                className="icon"
                                onClick={(e) => { e.preventDefault(); handleRemove(item); }}
                                aria-label={isRTL ? "إزالة" : "Remove"}
                              >
                                <i className="fa fa-times" />
                              </a>
                              <a
                                href="#"
                                className="cart"
                                onClick={(e) => { e.preventDefault(); handleAddCart(item); }}
                                aria-label={isRTL ? "أضف إلى السلة" : "Add to cart"}
                              >
                                <i className="fa fa-shopping-cart" />
                              </a>
                            </div>
                          </td>

                        </tr>
                      </tbody>
                    );
                  })}
                </Table>
              </Col>
            </Row>

            <Row className="wishlist-buttons">
              <Col sm="12" className={isRTL ? "text-start" : "text-end"}>
                <Link href={"/"} className="btn btn-solid">
                  {t("wishlist.continue_shopping") ||
                    (isRTL ? "متابعة التسوق" : "Continue Shopping")}
                </Link>
                <a href="#" className="btn btn-solid" onClick={checkOut}>
                  {t("wishlist.checkout") || (isRTL ? "إتمام الشراء" : "Checkout")}
                </a>
              </Col>
            </Row>
          </Container>
        </section>
      ) : (
        <section className="wishlist-empty section-b-space text-center" dir={isRTL ? "rtl" : "ltr"}>
          <Container>
            <Row>
              <Col sm="12">
                <h3>
                  {t("wishlist.empty_title") ||
                    (isRTL ? "قائمة الرغبات فارغة" : "Your wishlist is empty")}
                </h3>
                <p className="text-muted mb-4">
                  {t("wishlist.empty_message") ||
                    (isRTL
                      ? "لم تقم بإضافة أي عناصر إلى قائمة الرغبات بعد."
                      : "You haven’t added any items to your wishlist yet.")}
                </p>
                <Link href="/shop/sidebar_popup" className="btn btn-solid">
                  {t("wishlist.back_to_shop") || (isRTL ? "العودة إلى المتجر" : "Back to Shop")}
                </Link>
              </Col>
            </Row>
          </Container>
        </section>
      )}
      <StyleTag global css={`
  .action-btns {
    display: inline-flex;
    align-items: center;
    gap: 12px;           /* <-- space between icons */
  }
  .action-btns a {
    font-size: 18px;
    line-height: 1;
    color: #6c757d;
  }
  .action-btns a:hover { color: #111; }
`} />

    </>
  );
};

export default WishlistPage;
