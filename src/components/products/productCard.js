// components/products/productCard.jsx
import React, { useContext, useMemo, useState } from "react";
import Link from "@/router/NextLinkCompat";
import { Row, Col, Media, Modal, ModalBody } from "reactstrap";
import DOMPurify from "isomorphic-dompurify";
import CartContext from "../../helpers/cart";
import { WishlistContext } from "../../helpers/wishlist/WishlistContext";
import { CompareContext } from "../../helpers/Compare/CompareContext";
import { useLanguage } from "../../helpers/Language/useLanguage";
import { toast } from "react-toastify";
import StyleTag from "@/styles/StyleTag";

/* ========== i18n labels ========== */
const AR = {
  productDetails: "تفاصيل المنتج",
  quantity: "الكمية",
  addToCart: "أضف إلى السلة",
  viewDetail: "عرض التفاصيل",
  addToWishlist: "أضف إلى المفضلة",
  quickView: "نظرة سريعة",
  compare: "مقارنة",
  ratingAria: "تقييم المنتج",
  weight: "الوزن",
};
const EN = {
  productDetails: "Product Details",
  quantity: "Quantity",
  addToCart: "Add to cart",
  viewDetail: "View detail",
  addToWishlist: "Add to Wishlist",
  quickView: "Quick View",
  compare: "Compare",
  ratingAria: "Product rating",
  weight: "Weight",
};

/* ========== small helpers ========== */
const cleanJoin = (...parts) =>
  parts.filter(Boolean).map((s) => String(s).trim()).filter((s) => s.length > 0).join(" ");

const parsePriceNumber = (v) => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (v == null) return 0;
  const n = parseFloat(String(v).replace(/[^0-9.,-]/g, "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const getId = (p) =>
  p?.id ?? p?.sku ?? p?.code ?? p?.slug ?? p?.uuid ?? p?.raw?.id ?? null;

const getImage = (p) =>
  p?.image_path || p?.images?.[0]?.src || p?.raw?.image_path || "/assets/images/placeholder.png";

const getStock = (p) => (p?.stock != null ? p.stock : p?.raw?.stock);

const getCurrency = (p) =>
  p?.currency_symbol || p?.currency?.symbol || p?.currency_code || p?.currency?.code || "£";

const getUnitPrice = (p) => {
  const base = p?.price ?? p?.sale_price ?? p?.regular_price ?? p?.amount ?? p?.raw?.price ?? 0;
  const price = parsePriceNumber(base);
  const disc = Number(p?.discount) || 0;
  return Number.isFinite(disc) ? price - (price * disc) / 100 : price;
};

const pickFromTranslations = (raw, key, isRTL) => {
  const list = raw?.translations;
  if (!Array.isArray(list) || !list.length) return null;
  const primary = list.find((x) => x?.locale === (isRTL ? "ar" : "en"))?.[key];
  if (primary != null && String(primary).trim() !== "") return primary;
  const fallback = list.find((x) => x?.locale === (isRTL ? "en" : "ar"))?.[key];
  return fallback ?? null;
};

const getLocalizedTitle = (p, isRTL) =>
  pickFromTranslations(p?.raw ?? p, "name", isRTL) ||
  p?.title || p?.name || p?.raw?.title || p?.raw?.name || "Product";

const normalizeProduct = (p, overrideQty) => {
  const id = getId(p);
  const price = getUnitPrice(p);
  const stock = getStock(p);
  const currency_symbol = getCurrency(p);
  const img = getImage(p);
  const images =
    p?.images && Array.isArray(p.images) && p.images.length
      ? p.images
      : img ? [{ src: img }] : [];
  const qty =
    Number.isFinite(overrideQty) && overrideQty > 0 ? overrideQty : p?.qty > 0 ? p.qty : 1;
  return { ...p, id, title: p?.title || p?.name || p?.raw?.name || "Product", images, price, qty, total: +(price * qty).toFixed(2), stock, currency_symbol };
};

function formatPrice(value, { isRTL, currencySymbol }) {
  const num = Number(value ?? 0);
  const locale = isRTL ? "ar-EG" : "en-GB";
  const formatted = Number.isFinite(num)
    ? new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)
    : String(value ?? "");
  return isRTL ? cleanJoin(formatted, currencySymbol) : cleanJoin(currencySymbol, formatted);
}

function extractWeight(product, isRTL) {
  const locWeight = pickFromTranslations(product?.raw ?? product, "weight", isRTL);
  if (locWeight && String(locWeight).trim()) return String(locWeight).trim();
  const w = product?.weight || product?.weightGrams || product?.specs?.weight;
  if (w) {
    const v = String(w).trim();
    if (/^\d+([.,]\d+)?$/.test(v)) return isRTL ? `${v} جم` : `${v} g`;
    return v;
  }
  const desc = String(product?.description || product?.raw?.description || "");
  const mEn = desc.match(/Weight\s*:\s*([\d.,]+)\s*(grams?|g|kg)/i);
  if (mEn) {
    const num = mEn[1];
    const unit = mEn[2].toLowerCase();
    const unitLabel = unit === "kg" ? (isRTL ? "كجم" : "kg") : isRTL ? "جم" : "g";
    return `${num} ${unitLabel}`;
  }
  const mAr = desc.match(/الوزن\s*[:：]\s*([\d\u0660-\u0669.,]+)\s*(جم|غرام|جرام|كجم)/);
  if (mAr) return `${mAr[1]} ${mAr[2]}`;
  return null;
}

/* ========== component ========== */
const ProductCardUnified = ({
  product,
  isRTL,
  currencySymbol = "E£",
  currencyValue = 1,
  image_path,
  onAddToCart,    // ✅ من الـ parent (Popupsidebar / Search)
  onAddToWishlist,
  onAddToCompare,
  onQuickView,
}) => {
  const labels = isRTL ? AR : EN;
  const { t } = useLanguage();

  const cartCtx = useContext(CartContext);
  const wishCtx = useContext(WishlistContext);
  const compareCtx = useContext(CompareContext);

  const [quickOpen, setQuickOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const id = getId(product);
  const href = `/product-details/${id}`;

  const images = product.images || [];
  const img0 = images[0]?.src || image_path || getImage(product);
  const img1 = images[1]?.src || img0;

  const unitBase = useMemo(() => getUnitPrice(product), [product]);
  const unitConverted = useMemo(() => +(unitBase * Number(currencyValue || 1)).toFixed(2), [unitBase, currencyValue]);
  const priceDisplay = useMemo(() => formatPrice(unitConverted, { isRTL, currencySymbol }), [unitConverted, isRTL, currencySymbol]);
  const weightLabel = useMemo(() => extractWeight(product, isRTL), [product, isRTL]);

  const descriptionHTML = useMemo(() => {
    const raw = product?.raw ?? product;
    const localized =
      pickFromTranslations(raw, "description", isRTL) ??
      product?.description ?? product?.descriptionHtml ?? raw?.description ?? "";
    return DOMPurify.sanitize(String(localized), {
      ALLOWED_TAGS: ["p", "strong", "b", "em", "i", "u", "br", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6", "span"],
      ALLOWED_ATTR: ["data-start", "data-end", "class"],
    });
  }, [product, isRTL]);

  const openQuick = (e) => { e?.preventDefault(); e?.stopPropagation(); setQty(1); setQuickOpen(true); };
  const closeQuick = () => setQuickOpen(false);
  const inc = (e) => { e?.preventDefault(); setQty((q) => Math.min(999, q + 1)); };
  const dec = (e) => { e?.preventDefault(); setQty((q) => Math.max(1, q - 1)); };

  /* ✅ addToCart — يستخدم onAddToCart من الـ parent لو موجود
     الـ parent (Popupsidebar/Search) هو المسؤول عن الـ toast
     لو مفيش parent prop → fallback للـ CartContext مباشرة */
  const handleAddToCart = (overrideQty) => {
    const quantity = Number.isFinite(overrideQty) && overrideQty > 0 ? overrideQty : qty;

    if (typeof onAddToCart === "function") {
      // ✅ الـ parent يتحكم — مفيش toast هنا
      onAddToCart(quantity);
      return;
    }

    // fallback لو استُخدم ProductCard بدون parent props
    const normalized = normalizeProduct(product, quantity);
    if (normalized.id == null) { toast.error("Missing product id"); return; }
    const addFn = cartCtx?.addToCartUnified || cartCtx?.addToCart;
    if (typeof addFn === "function") {
      addFn.length >= 2
        ? addFn({ ...normalized, price: unitBase }, normalized.qty)
        : addFn({ ...normalized, price: unitBase });
      // CartProvider يعمل الـ toast تلقائي
    }
  };

  /* ✅ wishlist — يستخدم onAddToWishlist من الـ parent لو موجود */
  const handleAddToWishlist = () => {
    if (typeof onAddToWishlist === "function") {
      onAddToWishlist();
      return;
    }
    if (!wishCtx?.addToWish) { toast.error("Wishlist is not available"); return; }
    const normalized = normalizeProduct(product);
    wishCtx.addToWish({ ...normalized, price: unitBase });
    toast.success(t("add_to_wishlist") || (isRTL ? "أضيف للمفضلة" : "Added to wishlist"));
  };

  /* ✅ compare — يستخدم onAddToCompare من الـ parent لو موجود */
  const handleAddToCompare = () => {
    if (typeof onAddToCompare === "function") {
      onAddToCompare();
      return;
    }
    if (!compareCtx?.addToCompare) return;
    compareCtx.addToCompare({ ...product, id, title: getLocalizedTitle(product, isRTL) });
    toast.success(t("item_successfully_added") || (isRTL ? "أضيف للمقارنة" : "Added to compare"));
  };

  const titleLocalized = getLocalizedTitle(product, isRTL);

  return (
    <div className="product" style={{ cursor: "pointer" }}>
      <div className="product-box" dir={isRTL ? "rtl" : "ltr"}>
        <div className="img-wrapper">
          <div className="front">
            <Link href={href} onClick={(e) => e.stopPropagation()}>
              <Media src={img0} className="img-fluid blur-up lazyload bg-img" alt={titleLocalized} style={{ objectFit: "contain" }} />
            </Link>
          </div>

          <div className="back">
            <Link href={href} onClick={(e) => e.stopPropagation()} style={{ width: "100%" }}>
              <Media src={img1} className="img-fluid blur-up lazyload bg-img" alt={titleLocalized} style={{ objectFit: "contain" }} />
            </Link>
          </div>

          <div className="cart-info cart-wrap">
            <button title={labels.addToCart} onClick={(e) => { e.stopPropagation(); handleAddToCart(1); }}>
              <i className="fa fa-shopping-cart" />
            </button>

            <a href="#" title={labels.addToWishlist} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToWishlist(); }}>
              <i className="fa fa-heart" aria-hidden="true" />
            </a>

            <a href="#" title={labels.quickView} onClick={openQuick}>
              <i className="fa fa-search" aria-hidden="true" />
            </a>

            <a href="#" title={labels.compare} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCompare(); }}>
              <i className="fa fa-refresh" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="product-detail">
          <div className="rating" aria-label={labels.ratingAria}>
            <i className="fa fa-star" /> <i className="fa fa-star" />{" "}
            <i className="fa fa-star" /> <i className="fa fa-star" />{" "}
            <i className="fa fa-star" />
          </div>

          <Link href={href} onClick={(e) => e.stopPropagation()}>
            <h6 style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {titleLocalized}
            </h6>
          </Link>

          <h4 style={{ marginTop: 6 }}>{priceDisplay}</h4>
        </div>
      </div>

      {/* ---------- QUICK VIEW ---------- */}
      <Modal isOpen={quickOpen} toggle={closeQuick} className="modal-lg quickview-modal" centered>
        <ModalBody>
          <Row>
            <Col lg="12" className={isRTL ? "rtl-text" : ""}>
              <div className="product-right" dir={isRTL ? "rtl" : "ltr"}>
                <button type="button" className="btn-close btn btn-secondary" aria-label="Close" onClick={closeQuick} />
                <h2 style={{ marginBottom: 8 }}>{titleLocalized}</h2>
                <h3 style={{ marginTop: 0, marginBottom: 8 }}>{priceDisplay}</h3>

                {weightLabel && (
                  <div>
                    <div style={{ display: "inline-block", padding: "4px 10px", borderRadius: 9999, background: "#f3f5f7", color: "#111", fontSize: 12, lineHeight: 1.2, whiteSpace: "nowrap" }}>
                      {isRTL ? cleanJoin(AR.weight + ":", weightLabel) : cleanJoin(EN.weight + ":", weightLabel)}
                    </div>
                    <br />
                  </div>
                )}

                <div className="border-product" style={{ direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" }}>
                  <h6 className="product-title" style={{ marginBottom: 8 }}>{labels.productDetails}</h6>
                  <div dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
                </div>

                {Array.isArray(product.size) && product.size.length > 0 && (
                  <div className="product-description border-product">
                    <div className="size-box">
                      <ul>
                        {product.size.map((s, i) => (
                          <li key={i}><a href="#" onClick={(e) => e.preventDefault()}>{s}</a></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="product-description border-product">
                  <h6 className="product-title" style={{ marginBottom: 8 }}>{labels.quantity}</h6>
                  <div className="qty-box">
                    <div className="input-group">
                      <span className="input-group-prepend">
                        <button type="button" className="btn quantity-left-minus" onClick={dec} data-type="minus">
                          {isRTL ? <i className="fa fa-angle-right" /> : <i className="fa fa-angle-left" />}
                        </button>
                      </span>
                      <input
                        type="text" name="quantity" value={qty}
                        onChange={(e) => { const v = parseInt(e.target.value || "1", 10); setQty(Number.isFinite(v) && v > 0 ? Math.min(v, 999) : 1); }}
                        className="form-control input-number" style={{ textAlign: "center" }}
                        inputMode="numeric" pattern="[0-9]*"
                      />
                      <span className="input-group-prepend">
                        <button type="button" className="btn quantity-right-plus" onClick={inc} data-type="plus">
                          {isRTL ? <i className="fa fa-angle-left" /> : <i className="fa fa-angle-right" />}
                        </button>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="product-buttons" style={{ gap: 8 }}>
                  <button className="btn btn-solid" onClick={() => { handleAddToCart(qty); closeQuick(); }}>
                    {labels.addToCart}
                  </button>
                  <Link href={href} onClick={() => setQuickOpen(false)}>
                    <button className="btn btn-solid">{labels.viewDetail}</button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <StyleTag global css={`
        .quickview-modal .modal-content { border-radius: 14px; }
        .quickview-modal .modal-body { padding: 20px 22px; }
        .quickview-modal .product-right h2 { font-size: 24px; line-height: 1.25; margin: 0 0 6px; }
        .quickview-modal .product-right h3 { font-size: 18px; margin: 0 0 10px; }
        .quickview-modal .border-product { padding-top: 10px; margin-top: 10px; }
        .quickview-modal .product-right .btn-close { position: absolute; top: 10px; }
        [dir="ltr"] .quickview-modal .product-right .btn-close { right: 10px; }
        [dir="rtl"] .quickview-modal .product-right .btn-close { left: 10px; }
        @media(max-width:568px){
          .product .product-box .img-wrapper .cart-info.cart-wrap > a,
          .product .product-box .img-wrapper .cart-info.cart-wrap > button {
            position: relative; display: inline-flex !important; align-items: center;
            justify-content: center; width: 16px; height: 16px; padding: 0 !important;
            margin: 0 !important; border: 0; background: none; line-height: 0;
          }
          .product .product-box .img-wrapper .cart-info.cart-wrap i,
          .product .product-box .img-wrapper .cart-info.cart-wrap svg {
            display: block; width: 18px; height: 18px; line-height: 1; vertical-align: middle; transform: none !important;
          }
          .product .product-box .img-wrapper .cart-info.cart-wrap > * {
            transform: none !important; top: auto !important; bottom: auto !important;
            margin-top: 0 !important; margin-bottom: 0 !important;
          }
        }
        @media (max-width: 575.98px) {
          .product .product-box .img-wrapper .cart-info.cart-wrap > a,
          .product .product-box .img-wrapper .cart-info.cart-wrap > button { width: 36px; height: 36px; }
          .product .product-box .img-wrapper .cart-info.cart-wrap i,
          .product .product-box .img-wrapper .cart-info.cart-wrap svg { width: 16px; height: 16px; font-size: 16px; }
        }
      `} />
    </div>
  );
};

export default ProductCardUnified;