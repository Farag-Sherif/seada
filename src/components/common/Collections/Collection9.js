// components/home/ProductSlider.jsx
import React, { Fragment, useContext, useEffect, useMemo, useState ,useRef} from "react";
import Slider from "react-slick";
import { useRouter } from "@/router/useRouter";
import { Media, Container, Col, Row } from "reactstrap";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import { getProducts } from "../../../actions/products";
import { useLanguage } from "../../../helpers/Language/useLanguage";

/* ---------- i18n helper ---------- */
const tr = (t, key, fallback) => {
  try {
    const v = t ? t(key) : "";
    return !v || v === key ? fallback : v;
  } catch {
    return fallback;
  }
};

/* ---------- helpers ---------- */
const adapt = (p, isRTL) => {
  const trn =
    (Array.isArray(p?.translations) &&
      (p.translations.find((x) => x.locale === (isRTL ? "ar" : "en")) ||
        p.translations[0])) ||
    null;

  const title = trn?.name || p?.name || "";
  const images = [];
  if (p?.image_path) images.push({ src: p.image_path });
  (p?.media || []).forEach((m) => m?.image_path && images.push({ src: m.image_path }));

  const base = Number(p?.price ?? p?.total ?? 0);
  const discount = Number(p?.discount ?? 0);
  const sale = discount > 0 ? base - (base * discount) / 100 : base;

  return {
    id: p?.id,
    title,
    images,
    price: base,
    discount,
    sale,
    created_at: p?.created_at,
    is_featured: Number(p?.is_featured) === 1,
  };
};

const chunk3 = (arr) => {
  const out = [];
  for (let i = 0; i < arr.length; i += 3) out.push(arr.slice(i, i + 3));
  return out.slice(0, 2);
};

const formatPrice = (value, currency, isRTL) => {
  const num = Number(value || 0) * Number(currency?.value || 1);
  const formatted = Number.isFinite(num)
    ? new Intl.NumberFormat(isRTL ? "ar-EG" : "en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num)
    : String(value);
  const sym = currency?.symbol || "£";
  return isRTL ? `${formatted} ${sym}` : `${sym}${formatted}`;
};

/* ---------- column card ---------- */


const ColumnCard = ({ title, items, currency, onClick, isRTL }) => {
  const slides = useMemo(() => chunk3(items), [items]);
  const sliderRef = useRef(null);

  // اجبر السلايدر يعيد التهيئة عند تغيّر الداتا/RTL
  useEffect(() => {
    // re-init fix
    if (sliderRef.current?.innerSlider?.onWindowResized) {
      sliderRef.current.innerSlider.onWindowResized();
    }
    // ارجع لأول شريحة
    sliderRef.current?.slickGoTo?.(0, true);
  }, [slides.length, isRTL]);

  return (
    <Col lg="3" sm="6" style={{ cursor: "pointer" }}>
      <div className="theme-card" dir={isRTL ? "rtl" : "ltr"}>
        <h5 className="title-border" style={{ textTransform: "capitalize" }}>{title}</h5>

        <Slider
          key={`${isRTL}-${slides.length}`}   // مفتاح لإجبار إعادة البناء
          className="offer-slider slide-1"
          ref={sliderRef}
          rtl={isRTL}
          arrows
          dots={false}
          infinite={false}
          slidesToShow={1}
          slidesToScroll={1}
          adaptiveHeight
          lazyLoad="progressive"
          initialSlide={0}
        >
          {slides.map((group, gi) => (
            <div key={gi}>
              {group.map((product, i) => {
                const img = product.images?.[0]?.src || "/assets/images/placeholder.png";
                return (
                  <div className="media" key={product.id ?? i} style={{minHeight: 110}}>
                    <a onClick={() => onClick(product)}>
                      <Media
                        className="img-fluid blur-up lazyload"
                        src={img}
                        alt={product.title}
                        style={{ objectFit: "contain" }}
                      />
                    </a>
                    <div className="media-body align-self-center">
                      <div className="rating" aria-label={isRTL ? "تقييم المنتج" : "Product rating"}>
                        <i className="fa fa-star" /> <i className="fa fa-star" />{" "}
                        <i className="fa fa-star" /> <i className="fa fa-star" />{" "}
                        <i className="fa fa-star" />
                      </div>
                      <a onClick={() => onClick(product)}>
                        <h6 style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {product.title}
                        </h6>
                      </a>
                      <h4 style={{ marginTop: 4 }}>
                        {formatPrice(product.sale, currency, isRTL)}{" "}
                        <del>
                          <span className="money">
                            {formatPrice(product.price, currency, isRTL)}
                          </span>
                        </del>
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </Slider>
      </div>
    </Col>
  );
};

/* ---------- main ---------- */
const ProductSlider = () => {
  const { t, isRTL } = useLanguage();
  const { state: currency } = useContext(CurrencyContext);
  const router = useRouter();

  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await getProducts({ page: 1, per_page: 50 }).catch(() => null);
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const mapped = list.map((p) => adapt(p, isRTL));
      if (mounted) setItems(mapped);
    })();
    return () => {
      mounted = false;
    };
  }, [isRTL]);

  const clickProductDetail = (p) => {
    router.push(`/product-details/${p.id}`);
  };

  const newProducts = useMemo(
    () => [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6),
    [items]
  );

  const featureProducts = useMemo(() => {
    const featured = items.filter((p) => p.is_featured);
    return (featured.length ? featured : items).slice(0, 6);
  }, [items]);

  const bestSeller = useMemo(() => [...items].sort((a, b) => b.sale - a.sale).slice(0, 6), [items]);

  const onSell = useMemo(() => items.filter((p) => p.discount > 0).slice(0, 6), [items]);

  // Localized section titles
  const titleNew = tr(t, "home.products.new", isRTL ? "منتجات جديدة" : "new products");
  const titleFeat = tr(t, "home.products.featured", isRTL ? "منتجات مميزة" : "feature product");
  const titleBest = tr(t, "home.products.bestSeller", isRTL ? "الأكثر مبيعًا" : "best seller");
  const titleSale = tr(t, "home.products.onSale", isRTL ? "عروض" : "on sale");

  return (
    <Fragment>
      <section className="section-b-space" style={{ direction: isRTL ? "rtl" : "ltr" }}>
        <Container>
          <Row className="multiple-slider">
            <ColumnCard
              title={titleNew}
              items={newProducts}
              currency={currency}
              onClick={clickProductDetail}
              isRTL={isRTL}
            />
            <ColumnCard
              title={titleFeat}
              items={featureProducts}
              currency={currency}
              onClick={clickProductDetail}
              isRTL={isRTL}
            />
            <ColumnCard
              title={titleBest}
              items={bestSeller}
              currency={currency}
              onClick={clickProductDetail}
              isRTL={isRTL}
            />
            <ColumnCard
              title={titleSale}
              items={onSell.length ? onSell : items.slice(0, 6)}
              currency={currency}
              onClick={clickProductDetail}
              isRTL={isRTL}
            />
          </Row>
        </Container>
      </section>
    </Fragment>
  );
};

export default ProductSlider;
