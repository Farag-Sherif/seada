// pages/product/common/product_section.jsx
import React, { useContext, useMemo } from "react";
import { Container, Row, Col } from "reactstrap";
import { useRouter } from "@/router/useRouter";

import { useLanguage } from "../../../helpers/Language/useLanguage";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import { CompareContext } from "../../../helpers/Compare/CompareContext";

// Reuse the same unified card + adapter everywhere
import ProductCardUnified from "../../../components/products/productCard";
import { useProductAdapter } from "../../../components/products/useProductAdapter";
import { useCartActions } from "../../../components/products/useCartAction";

/* -------- stable key + strong de-dupe (same as other places) -------- */
const productKey = (p) => {
  const raw = p?.raw || p;
  const id =
    raw?.id ?? raw?.sku ?? raw?.code ?? raw?.slug ?? raw?.uuid ?? p?.id ?? "";
  const mainImg =
    p?.image || raw?.image_path || p?.images?.[0]?.src || p?.thumbnail || "";
  return String(id) + "|" + String(mainImg);
};
const uniqueProducts = (arr) => {
  const seen = new Set();
  const out = [];
  for (const p of arr || []) {
    const k = productKey(p);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  return out;
};

// absolutize helper for safety (if API returns relative paths)
const absolutize = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  try {
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://newstore.test.do-go.net";
    return new URL(url, base).toString();
  } catch {
    return url;
  }
};

const tr = (t, key, fallback) => {
  try {
    const v = t ? t(key) : "";
    return !v || v === key ? fallback : v;
  } catch {
    return fallback;
  }
};

const ProductSection = ({
  items = [],
  products = [],
  sectionTitle = "Related Products",
}) => {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const wishCtx = useContext(WishlistContext);
  const compareCtx = useContext(CompareContext);
  const { addToCartUnified } = useCartActions();

  // Use the same adapter used across the app
  const { adapt } = useProductAdapter(isRTL);

  // Prefer items then products
  const source = Array.isArray(items) && items.length ? items : products || [];

  // Adapt to unified card shape, absolutize image URLs, de-dupe, cap at 6
  const adapted = useMemo(() => {
    const list = (source || [])
      .map((p) => {
        // If already adapted (has images[0].src), leave as is; else adapt
        const alreadyAdapted =
          Array.isArray(p?.images) && p.images.length && p.images[0]?.src;
        const a = alreadyAdapted ? p : adapt(p);
        if (!a) return null;

        // ensure absolute URLs on primary image & gallery
        const first = a?.images?.[0]?.src || a?.image || a?.thumbnail || a?.raw?.image_path || "";
        const img = absolutize(first);

        return {
          ...a,
          image: img,
          thumbnail: img,
          images: (a?.images || []).map((im) => ({ ...im, src: absolutize(im.src) })),
        };
      })
      .filter(Boolean);

    return uniqueProducts(list).slice(0, 6);
  }, [source, adapt]);

  const onView = (p) => {
    const id = p?.id ?? p?.raw?.id;
    if (id) router.push(`/product-details/${id}`);
  };

  const emptyText = tr(
    t,
    "product.related_empty",
    isRTL ? "لا توجد منتجات ذات صلة." : "No related products."
  );

  return (
    <section className="section-b-space ratio_asos">
      <Container>
        <Row>
          <Col className="product-related">
            <h2
              style={{
                textTransform: "capitalize",
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {sectionTitle}
            </h2>
          </Col>
        </Row>

        <Row className="search-product">
          {adapted.length === 0 ? (
            <div className="text-center py-4 w-100">{emptyText}</div>
          ) : (
            adapted.map((p) => (
              <Col xl="2" md="4" sm="6" key={productKey(p)}>
                <ProductCardUnified
                  product={p}
                  isRTL={isRTL}
                  onAddToCart={addToCartUnified}
                  onAddWish={(prod) => wishCtx?.addToWish?.(prod)}
                  onAddCompare={(prod) => compareCtx?.addToCompare?.(prod)}
                  onView={onView}
                />
              </Col>
            ))
          )}
        </Row>
      </Container>
    </section>
  );
};

export default ProductSection;
