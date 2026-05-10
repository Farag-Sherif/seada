// components/common/detail-price.jsx
import React, { useContext, useMemo, useState } from "react";
import Link from "@/router/NextLinkCompat";
import { Modal, ModalBody, ModalHeader, Media, Input } from "reactstrap";
import sizeChart from "@/assets/images/size-chart.jpg";

import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import CartContext from "../../../helpers/cart";
import { useLanguage } from "../../../helpers/Language/useLanguage";

import StyleTag from "@/styles/StyleTag";
/* Inline SVG chevrons to replace FontAwesome in qty controls */
const SmallChevron = ({ dir = "left" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    {dir === "left" ? (
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    ) : (
      <path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" />
    )}
  </svg>
);

const DetailsWithPrice = ({ item, stickyClass = "", changeColorVar }) => {
  const { t, isRTL } = useLanguage();
  const [sizeModal, setSizeModal] = useState(false);
  const toggleSize = () => setSizeModal((v) => !v);

  const { state: cur } = useContext(CurrencyContext);
  const symbol = cur.symbol;

  const cart = useContext(CartContext);
  const { stock, plusQty, minusQty, quantity } = cart;

  // fallback numbers
  const basePrice = Number(item?.price || 0);
  const discount = Number(item?.discount || 0);
  const finalPrice = useMemo(
    () => Math.max(0, basePrice - (basePrice * discount) / 100),
    [basePrice, discount]
  );

  // unique sizes/colors if variants exist
  const uniqueSize = useMemo(() => {
    const set = new Set();
    (item?.variants || []).forEach((v) => v?.size && set.add(v.size));
    return Array.from(set);
  }, [item]);

  const uniqueColor = useMemo(() => {
    const seen = new Map();
    (item?.variants || []).forEach((v) => {
      if (v?.color && !seen.has(v.color)) seen.set(v.color, v);
    });
    return Array.from(seen.values());
  }, [item]);

  return (
    <>
      <div className={`product-right ${stickyClass}`} dir={isRTL ? "rtl" : "ltr"}>
        <h2 style={{ marginBottom: 10 }}>{item?.title || ""}</h2>

        {/* old price + discount */}
        <h4 style={{ gap: 12, display: "flex", alignItems: "center", marginBottom: 6 }}>
          {discount > 0 && (
            <>
              <del>
                {symbol}
                {basePrice.toFixed(2)}
              </del>
              <span>{discount}%</span>
            </>
          )}
        </h4>

        {/* final price */}
        <h3 style={{ marginBottom: 18 }}>
          {symbol}
          {finalPrice.toFixed(2)}
        </h3>

        {/* sizes (only if variants have size) */}
        {(uniqueSize?.length ?? 0) > 0 && (
          <div className="product-description border-product" style={{ paddingTop: 14, paddingBottom: 14 }}>
            <h6 className="product-title size-text" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {t?.("select_size") || (isRTL ? "اختر المقاس" : "select size")}
              <span>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href={null} onClick={toggleSize}>
                  {t?.("size_chart") || (isRTL ? "دليل المقاسات" : "size chart")}
                </a>
              </span>
            </h6>

            <Modal isOpen={sizeModal} toggle={toggleSize} centered>
              <ModalHeader toggle={toggleSize}>
                {t?.("size_chart") || (isRTL ? "دليل المقاسات" : "Size Chart")}
              </ModalHeader>
              <ModalBody>
                <Media src={sizeChart.src} alt="size" className="img-fluid" />
              </ModalBody>
            </Modal>

            <div className="size-box">
              <ul>
                {uniqueSize.map((sz) => (
                  <li key={sz}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href={null}>{sz}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* colors (if exist) */}
        {(uniqueColor?.length ?? 0) > 0 && (
          <div className="product-description border-product" style={{ paddingTop: 14, paddingBottom: 14 }}>
            <h6 className="product-title">
              {t?.("color") || (isRTL ? "اللون" : "color")}
            </h6>
            <div className="color-variant">
              {uniqueColor.map((c, i) => (
                <span
                  key={`${c.color}-${i}`}
                  onClick={() =>
                    typeof changeColorVar === "function" &&
                    changeColorVar(c?.image_id ?? i)
                  }
                  style={{
                    background: c.color,
                    width: 22,
                    height: 22,
                    display: "inline-block",
                    borderRadius: "50%",
                    border: "1px solid #eee",
                    marginInlineEnd: 8,
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* stock + qty */}
        <div className="product-description border-product" style={{ paddingTop: 14, paddingBottom: 14 }}>
          <span className="instock-cls" style={{ display: "inline-block", marginBottom: 8 }}>
            {stock}
          </span>

          <h6 className="product-title" style={{ marginBottom: 8 }}>
            {t?.("quantity") || (isRTL ? "الكمية" : "quantity")}
          </h6>

          <div className="qty-box" dir={isRTL ? "rtl" : "ltr"}>
            <div className="input-group">
              <span className="input-group-prepend">
                <button
                  type="button"
                  className="btn quantity-left-minus"
                  onClick={minusQty}
                  data-type="minus"
                >
                  <SmallChevron dir={isRTL ? "right" : "left"} />
                </button>
              </span>

              <Input
                type="text"
                name="quantity"
                value={quantity}
                onChange={(e) =>
                  cart.setQuantity
                    ? cart.setQuantity(Math.max(1, parseInt(e.target.value || "1", 10)))
                    : null
                }
                className="form-control input-number"
              />

              <span className="input-group-prepend">
                <button
                  type="button"
                  className="btn quantity-right-plus"
                  onClick={() => plusQty(item)}
                  data-type="plus"
                >
                  <SmallChevron dir={isRTL ? "left" : "right"} />
                </button>
              </span>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="product-buttons" style={{ gap: 8, display: "flex", flexWrap: "wrap" }}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            href={null}
            className="btn btn-solid"
            onClick={() => cart.addToCart(item, quantity)}
          >
            {t?.("add_to_cart") || (isRTL ? "أضف إلى السلة" : "add to cart")}
          </a>

          <Link
            href={`/page/account/checkout`}
            className="btn btn-solid"
            onClick={() => cart.addToCart(item, quantity)}
          >
            {t?.("buy_now") || (isRTL ? "اشتري الآن" : "buy now")}
          </Link>
        </div>

        {/* description */}
        <div className="border-product" style={{ paddingTop: 16, marginTop: 16 }}>
          <h6 className="product-title" style={{ marginBottom: 8 }}>
            {t?.("product_details") || (isRTL ? "تفاصيل المنتج" : "product details")}
          </h6>
          <div
            dangerouslySetInnerHTML={{ __html: item?.description || "" }}
            style={{ lineHeight: 1.8 }}
          />
        </div>
      </div>

      {/* Local CSS to ensure details layer wins over gallery if overlapping */}
      <StyleTag global css={`
        .product-right {
          position: relative;
          z-index: 5; /* keep details above anything from the left column */
        }

        /* Avoid any zoom overlay covering the details */
        .zoomImg,
        .image-zoom__lens,
        .image-zoom__overlay {
          z-index: 2 !important;
        }
      `} />
    </>
  );
};

export default DetailsWithPrice;
