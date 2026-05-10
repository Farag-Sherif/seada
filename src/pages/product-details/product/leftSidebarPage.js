// pages/product/product/leftSidebarPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Row, Col, Container } from "reactstrap";
import Slider from "react-slick";

import ProductTab from "../../product-details/common/product-tab";
import ImageZoom from "../../product-details/common/image-zoom";
import DetailsWithPrice from "../../product-details/common/detail-price";
import { useLanguage } from "../../../helpers/Language/useLanguage";
import { getProduct } from "../../../actions/products";

import StyleTag from "@/styles/StyleTag";
/* ---------- i18n safe helper ---------- */
const trSafe = (t, key, fallback) => {
  try {
    const v = t ? t(key) : "";
    return !v || v === key ? fallback : v;
  } catch {
    return fallback;
  }
};

/* ---------------- Map backend item -> UI ---------------- */
const adaptItem = (raw, isRTL) => {
  if (!raw) return null;

  const tr = Array.isArray(raw.translations)
    ? raw.translations.find((t) => t.locale === (isRTL ? "ar" : "en")) ||
      raw.translations.find((t) => t.locale === (isRTL ? "en" : "ar"))
    : null;

  const title = tr?.name || raw.name || "";
  const descriptionHtml = tr?.description || raw.description || "";
  const weight = tr?.weight || raw.weight || "";

  const images = [];
  if (raw.image_path) images.push({ alt: title, src: raw.image_path });
  if (Array.isArray(raw.media)) {
    raw.media.forEach((m) => images.push({ alt: title, src: m.image_path, id: m.id }));
  }

  const categoryName =
    raw.category?.translations?.find((t) => t.locale === (isRTL ? "ar" : "en"))?.name ||
    raw.category?.name ||
    "";

  return {
    id: raw.id,
    title,
    descriptionHtml,
    weight,
    price: Number(raw.total ?? raw.price ?? 0),
    discount: Number(raw.discount ?? 0),
    stock: raw.is_available ? 99 : 0,
    serial_number: raw.serial_number || "",
    stock_number: raw.stock_number || "",
    categoryName,
    images,
    raw,
  };
};

/* ---------------- SVG chevrons for react-slick ---------------- */
const Chevron = ({ dir = "left" }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    {dir === "left" ? (
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    ) : (
      <path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" />
    )}
  </svg>
);

const PrevArrow = ({ onClick, className, style, isRTL }) => (
  <button
    type="button"
    aria-label="previous"
    className={`slick-arrow slick-prev ${className || ""}`}
    onClick={onClick}
    style={{ ...style }}
  >
    <Chevron dir={isRTL ? "right" : "left"} />
  </button>
);

const NextArrow = ({ onClick, className, style, isRTL }) => (
  <button
    type="button"
    aria-label="next"
    className={`slick-arrow slick-next ${className || ""}`}
    onClick={onClick}
    style={{ ...style }}
  >
    <Chevron dir={isRTL ? "left" : "right"} />
  </button>
);

const LeftSidebarPage = ({ pathId, prefetched = null }) => {
  const { t, isRTL } = useLanguage();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(!prefetched);

  const sliderMainRef = useRef(null);

  const slickMain = useMemo(
    () => ({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: false,
      arrows: true,
      // Disable fade to get smooth looping + swipe
      fade: false,
      rtl: !!isRTL,
      adaptiveHeight: false,
      infinite: true, // ✅ loop forever
      speed: 400,
      swipe: true,
      swipeToSlide: true,
      lazyLoad: "ondemand",
      prevArrow: <PrevArrow isRTL={isRTL} />,
      nextArrow: <NextArrow isRTL={isRTL} />,
      responsive: [
        { breakpoint: 992, settings: { arrows: true } },
        { breakpoint: 576, settings: { arrows: true } },
      ],
    }),
    [isRTL]
  );

  const goToImage = (index) => {
    sliderMainRef.current?.slickGoTo?.(index);
  };

  const labels = useMemo(
    () => ({
      tabs: {
        details: trSafe(t, "product.tabs.details", isRTL ? "التفاصيل" : "Details"),
        description: trSafe(t, "product.tabs.description", isRTL ? "الوصف" : "Description"),
      },
      fields: {
        weight: trSafe(t, "product.details.weight", isRTL ? "الوزن" : "Weight"),
        category: trSafe(t, "product.details.category", isRTL ? "القسم" : "Category"),
      },
    }),
    [t, isRTL]
  );

  useEffect(() => {
    let mounted = true;

    const load = async (id) => {
      try {
        setLoading(true);
        const res = await getProduct(Number(id || 1));
        if (!mounted) return;
        setProduct(adaptItem(res?.item, isRTL));
      } catch {
        if (mounted) setProduct(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (prefetched) {
      setProduct(adaptItem(prefetched, isRTL));
      setLoading(false);
    } else if (pathId) {
      load(pathId);
    }
    return () => {
      mounted = false;
    };
  }, [pathId, prefetched, isRTL]);

  return (
    <section dir={isRTL ? "rtl" : "ltr"}>
      <div className="collection-wrapper">
        <Container>
          <Row>
            <Col sm="12" xs="12">
              <div className="container-fluid">
                {loading ? (
                  "loading"
                ) : !product ? (
                  "Not found"
                ) : (
                  <Row className="g-4" style={{ justifyContent: "space-between" }}>
                    {/* left: BIG gallery */}
                    <Col lg="5" className="product-thumbnail">
                      <div className="zoom-frame">
                        <Slider
                          key={`gallery-${isRTL ? "rtl" : "ltr"}-${product.id}`}
                          {...slickMain}
                          ref={sliderMainRef}
                          className="product-slick"
                        >
                          {(product.images || []).map((img, i) => (
                            <div key={i} className="slide-inner">
                              <ImageZoom image={img} />
                            </div>
                          ))}
                        </Slider>
                      </div>
                    </Col>

                    {/* right: details */}
                    <Col lg="6" className="rtl-text">
                      <DetailsWithPrice item={product} changeColorVar={goToImage} />

                      {(product.images || []).length > 0 && (
                        <div className="detail-thumbs mt-4">
                          <Row className="g-2">
                            {(product.images || []).slice(0, 6).map((img, index) => (
                              <Col xs="4" sm="3" md="2" key={`thumb-${index}`}>
                                <button
                                  type="button"
                                  className="thumb-btn"
                                  onClick={() => goToImage(index)}
                                  aria-label={`thumb-${index + 1}`}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={img.src}
                                    alt={img.alt || "thumb"}
                                    style={{
                                      width: "100%",
                                      height: 86,
                                      objectFit: "cover",
                                      display: "block",
                                      background: "#fafafa",
                                      borderRadius: 8,
                                      border: "1px solid #eee",
                                      direction: "ltr",
                                    }}
                                  />
                                </button>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}
                    </Col>

                    {/* Tabs: only API content (no lorem) */}
                    <Col xs="12" className="mt-4" style={{ marginBottom: "70px" }}>
                      <ProductTab
                        descriptionHtml={product.descriptionHtml}
                        details={{
                          serial_number: product.serial_number,
                          stock_number: product.stock_number,
                          weight: product.weight,
                          category: product.categoryName,
                        }}
                        labels={labels}
                        showVideo={false}
                        showReview={false}
                      />
                    </Col>
                  </Row>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Global CSS */}
      <StyleTag global css={`
        .product-thumbnail {
          position: relative;
          z-index: 1;
        }
        .zoom-frame {
          /* Make the main image BIG and responsive */
          width: 100%;
          height: 65vh;
          min-height: 420px;
          max-height: 760px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
          overflow: hidden;
        }
        @media (max-width: 992px) {
          .zoom-frame {
            height: 54vh;
            min-height: 360px;
          }
        }
        @media (max-width: 576px) {
          .zoom-frame {
            height: 48vh;
            min-height: 300px;
          }
        }

        .product-thumbnail .product-slick,
        .product-thumbnail .product-slick .slick-list,
        .product-thumbnail .product-slick .slick-track,
        .product-thumbnail .product-slick .slick-slide,
        .product-thumbnail .product-slick .slick-slide > div,
        .product-thumbnail .product-slick .slide-inner {
          height: 100%;
        }

        .product-thumbnail .product-slick .slide-inner {
          display: grid;
          place-items: center;
          padding: 8px;
          direction: ltr; /* keep slide content LTR so images never flip */
        }

        /* If ImageZoom renders an img inside, this keeps it nicely contained */
        .product-thumbnail .product-slick img {
          width: 100%;
          height: 100%;
          max-height: 100%;
          object-fit: contain; /* show full image nicely */
          background: #fafafa;
          border-radius: 8px;
        }

        .product-thumbnail .slick-list {
          overflow: hidden !important;
        }

        /* Arrows */
        .product-thumbnail .slick-prev,
        .product-thumbnail .slick-next {
          width: 40px;
          height: 40px;
          z-index: 3;
          top: 50%;
          transform: translateY(-50%);
          display: flex !important;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid #e5e5e5;
          border-radius: 50%;
        }
        .product-thumbnail .slick-prev {
          left: 10px;
          right: auto;
        }
        .product-thumbnail .slick-next {
          right: 10px;
          left: auto;
        }
        .product-thumbnail .slick-prev:before,
        .product-thumbnail .slick-next:before {
          display: none;
        }
        .product-thumbnail .slick-prev svg,
        .product-thumbnail .slick-next svg {
          fill: #333;
        }

        /* Mirror arrow positions for RTL pages */
        [dir="rtl"] .product-thumbnail .slick-prev {
          right: 10px;
          left: auto;
        }
        [dir="rtl"] .product-thumbnail .slick-next {
          left: 10px;
          right: auto;
        }
        [dir="rtl"] .product-thumbnail .slick-slide {
          float: right;
        }

        .thumb-btn {
          padding: 0;
          border: none;
          background: transparent;
          display: block;
          width: 100%;
          cursor: pointer;
        }
      `} />
    </section>
  );
};

export default LeftSidebarPage;
