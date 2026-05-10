// components/home/TopCollection.jsx
import React, { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import { Row, Col, Container } from "reactstrap";

import PostLoader from "../PostLoader";
import { getProducts } from "../../../actions/products";
import { useLanguage } from "../../../helpers/Language/useLanguage";

import ProductCardUnified from "../../../components/products/productCard";
import { useProductAdapter } from "../../../components/products/useProductAdapter";

/* ---- i18n safe helper ---- */
const tr = (t, key, fallback) => {
  try {
    const v = t ? t(key) : "";
    return !v || v === key ? fallback : v;
  } catch {
    return fallback;
  }
};

/* -------- stable key + strong de-dupe -------- */
const productKey = (p) => {
  const raw = p?.raw || p;
  const id = raw?.id ?? raw?.sku ?? raw?.code ?? raw?.slug ?? raw?.uuid;
  const mainImg = raw?.image_path || p?.images?.[0]?.src || "";
  return String(id ?? "") + "|" + String(mainImg ?? "");
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

const TopCollection = ({
  type,
  title,        // pass translated text from parent if you want a custom title
  subtitle,     // same here
  designClass,
  noSlider,
  cartClass,
  productSlider,
  titleClass,
  noTitle,
  innerClass,
  inner,
  backImage,
}) => {
  const { t, isRTL } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const { adapt } = useProductAdapter(isRTL);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getProducts({ page: 1, per_page: 50 });
        const list =
          (Array.isArray(res?.data) && res.data) ||
          (Array.isArray(res) && res) ||
          [];
        const adapted = list.map((p) => adapt(p));
        const unique = uniqueProducts(adapted);
        if (mounted) setItems(unique);
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [adapt, isRTL]);

  // keep what you want to display
  const gridItems = useMemo(() => items.slice(0, 9), [items]);

  /* -------- slider: strict one per slide -------- */
  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: false, // no clones
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 1,
    slidesPerRow: 1,
    rtl: !!isRTL,
    variableWidth: false,
    adaptiveHeight: true,
    centerMode: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 992, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
    ...(productSlider || {}),
  };

  const sliderKey = `topcol-${isRTL ? "rtl" : "ltr"}-${gridItems.length}`;

  const renderCard = (p) => (
    <ProductCardUnified
      key={productKey(p)}
      product={p}
      isRTL={isRTL}
      // Card handles its own i18n internally
    />
  );

  const noProductsFound = tr(
    t,
    "collection.no_products_found",
    isRTL ? "لا توجد منتجات." : "No products found."
  );
  const noProductsAvailable = tr(
    t,
    "collection.no_products_available",
    isRTL ? "لا توجد منتجات متاحة." : "No products available."
  );

  return (
    <section className={designClass}>
      {noSlider ? (
        /* ===== SLIDER MODE ===== */
        <Container>
          <Row>
            <Col>
              {noTitle === "null" ? (
                ""
              ) : (
                <div className={innerClass}>
                  {subtitle ? <h4>{subtitle}</h4> : ""}
                  <h2 className={inner}>{title}</h2>
                  {titleClass ? (
                    <hr role="tournament6" />
                  ) : (
                    <div className="line">
                      <span />
                    </div>
                  )}
                </div>
              )}

              {loading ? (
                <div className="row mx-0 margin-default">
                  <div className="col-xl-12">
                    <PostLoader />
                  </div>
                </div>
              ) : gridItems.length === 0 ? (
                <div className="text-center py-4">{noProductsFound}</div>
              ) : (
                <Slider
                  key={sliderKey}
                  {...sliderSettings}
                  className="topcollection-slider no-arrow"
                >
                  {gridItems.map((p) => (
                    <div key={productKey(p)}>{renderCard(p)}</div>
                  ))}
                </Slider>
              )}
            </Col>
          </Row>
        </Container>
      ) : (
        /* ===== GRID MODE (one per row) ===== */
        <>
          {title ? (
            <div className="title1 title-gradient section-t-space">
              <h4>{subtitle}</h4>
              <h2 className="title-inner1">{title}</h2>
              <hr role="tournament6" />
            </div>
          ) : (
            ""
          )}

          <Container>
            <Row className="margin-default">
              {loading ? (
                <div className="row margin-default" style={{ width: "100%" }}>
                  <div className="col-xl-12">
                    <PostLoader />
                  </div>
                </div>
              ) : gridItems.length === 0 ? (
                <div className="text-center py-4 w-100">
                  {noProductsAvailable}
                </div>
              ) : (
                gridItems.map((p) => (
                  <Col
                    xl="12"
                    lg="12"
                    md="12"
                    sm="12"
                    key={productKey(p)}
                  >
                    {renderCard(p)}
                  </Col>
                ))
              )}
            </Row>
          </Container>
        </>
      )}
    </section>
  );
};

export default TopCollection;
