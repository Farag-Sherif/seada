// components/blog/BlogSection.jsx
import React, { Fragment, useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import Link from "@/router/NextLinkCompat";
import { Slider3 } from "../../../services/script";
import { Media, Container, Row, Col } from "reactstrap";
import { getBlogs } from "../../../actions/main";
import { useLanguage } from "../../../helpers/Language/useLanguage";

import StyleTag from "@/styles/StyleTag";
/* ---------- i18n helpers ---------- */
const tr = (t, key, fallback) => {
  try {
    const v = t ? t(key) : "";
    return !v || v === key ? fallback : v;
  } catch {
    return fallback;
  }
};

function pickLocalized(item, currentLanguage) {
  const trns =
    item.translations?.find(
      (tr) => tr.locale?.toLowerCase() === currentLanguage.toLowerCase()
    ) || null;
  return {
    title: trns?.title ?? item.title,
    content: trns?.content ?? item.content,
  };
}

function makeExcerpt(text, max = 180) {
  const clean = (text || "").replace(/\r?\n+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).trim() + "…";
}

function formatDate(dt, locale = "en-US") {
  try {
    return new Date(dt).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  } catch {
    return dt;
  }
}

// If you have a real details page, adjust here
const getBlogLink = (item) => {
  if (item?.slug) return `/blogs/${item.slug}`;
  if (item?.id) return `/blogs/${item.id}`;
  return `#`;
};

const BlogSection = ({ type, sectionClass, title, inner, hrClass }) => {
  const { t, currentLanguage, isRTL } = useLanguage();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await getBlogs({ page: 1, per_page: 12, type });
        console.log(res)
        if (active) setPayload(res);
      } catch (e) {
        if (active)
          setErr(
            tr(
              t,
              "blog.error",
              currentLanguage === "ar"
                ? "حدث خطأ أثناء تحميل المقالات"
                : "Failed to load blogs"
            )
          );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [type, t, currentLanguage]);

  const posts = payload?.data ?? [];
  const count = posts.length;

  // When 1–3 items: center each slide
  // Always show up to 3 items per row
  const sliderSettings = useMemo(() => {
    const base = {
      ...Slider3,
      rtl: !!isRTL,
      vertical: false,
      adaptiveHeight: true,
    };

    return {
      ...base,
      slidesToShow: 2,
      slidesToScroll: 1,
      infinite: count > 2,
      arrows: count > 1,
      dots: false,
      centerMode: false,
      variableWidth: false,
      responsive: [
        {
          breakpoint: 1200,
          settings: { slidesToShow: 2, slidesToScroll: 1 },
        },
        {
          breakpoint: 992,
          settings: { slidesToShow: 1, slidesToScroll: 1 },
        },
        {
          breakpoint: 576,
          settings: { slidesToShow: 1, slidesToScroll: 1 },
        },
      ],
    };
  }, [isRTL, count]);

  const createdLabel = tr(
    t,
    "blog.created",
    currentLanguage === "ar" ? "تاريخ النشر:" : "Created:"
  );

  return (
    <Fragment>
      <section className={sectionClass}>
        <Container>
          <Row>
            <Col md="12">
              <div className={title} dir={isRTL ? "rtl" : "ltr"}>
                <h4 className="blog-suptitle">
                  {tr(t, "blog.sectionSup", currentLanguage === "ar" ? "أخبارنا" : "Our News")}
                </h4>
                <h2 className={`blog-title ${inner}`}>
                  {tr(t, "blog.sectionTitle", currentLanguage === "ar" ? "اقرأ المدونة" : "Check Blogs")}
                </h2>
                {hrClass ? (
                  <hr role="tournament6" />
                ) : (
                  <div className="line">
                    <span></span>
                  </div>
                )}
              </div>

              {loading ? (
                <p className="text-center my-4 blog-muted">
                  {tr(t, "blog.loading", currentLanguage === "ar" ? "جارٍ التحميل…" : "Loading…")}
                </p>
              ) : err ? (
                <p className="text-center text-danger my-4">{err}</p>
              ) : count === 0 ? (
                <p className="text-center my-4 blog-muted">
                  {tr(t, "blog.empty", currentLanguage === "ar" ? "لا توجد مقالات" : "No blog posts.")}
                </p>
              ) : (
                <Slider
                  {...sliderSettings}
                  className="slide-3 no-arrow slick-default-margin blog-slider"
                >
                  {posts.map((item) => {
                    const { title: localizedTitle, content } = pickLocalized(
                      item,
                      currentLanguage
                    );
                    const desc = makeExcerpt(content, 150);
                    const dateStr = item.created_at
                      ? formatDate(
                          item.created_at,
                          currentLanguage === "ar" ? "ar-EG" : "en-US"
                        )
                      : "";

                    return (
                      <div key={item.id}>
                        <div className={`blog-card ${isRTL ? "rtl" : "ltr"}`}>
                          <Link href={getBlogLink(item)} className="blog-card-media">
                            <div className="classic-effect">
                              <Media
                                src={item.image_path || item.image || item.img}
                                className="img-fluid"
                                alt={localizedTitle}
                              />
                              <span></span>
                            </div>
                          </Link>

                          <div className="blog-details">
                            <h4 className="blog-item-title" title={localizedTitle}>
                              {localizedTitle}
                            </h4>

                            <Link href={getBlogLink(item)} className="blog-desc-link">
                              <p className="blog-desc" title={desc}>
                                {desc}
                              </p>
                            </Link>

                            <hr className="style1" />

                            {dateStr ? (
                              <h6 className="blog-date">
                                <span className="label">{createdLabel}</span> {dateStr}
                              </h6>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Polished typography & spacing */}
     <StyleTag css={`
  /* --- NEW: slide gap --- */
  :global(.blog-slider .slick-list){
    margin: 0 -12px;               /* يعادل نصف الـ gap يمين ويسار */
  }
  :global(.blog-slider .slick-slide > div){
    padding: 0 12px;               /* هذا هو الـ gap بين العناصر */
    height: 100%;
    box-sizing: border-box;
  }
  :global(.blog-slider .slick-track){
    display: flex !important;
    align-items: stretch;
  }
  :global(.blog-slider .slick-slide){
    display: flex !important;
  }

  /* Card container */
  .blog-card{
    /* كان: width: 33.333vw; max-width: 33.333vw; */
    width: 100%;
    max-width: 100%;
    background: #fff;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(16, 24, 40, 0.06);
    transition: transform 160ms ease, box-shadow 160ms ease;
    display: flex;                 /* يضمن تساوي الارتفاعات */
    flex-direction: column;
  }
  .blog-card:hover{
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 24, 40, 0.12);
  }

  .blog-card.ltr{ direction:ltr; text-align:left; }
  .blog-card.rtl{ direction:rtl; text-align:right; }

  /* Image */
  .blog-card-media{ display:block; }
  .blog-card-media :global(img){
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;
  }

  /* Details */
  .blog-details{
    padding: 20px;
    flex: 1;                       /* يشد التفاصيل لملء الكارد */
    display: flex;
    flex-direction: column;
  }

  .blog-item-title{
    font-size: 1.05rem;
    line-height: 1.35;
    margin: 4px 0 6px;
    font-weight: 700;
    color: #111827;
  }

  .blog-desc{
    color: #4b5563;
    font-size: 0.92rem;
    line-height: 2;
    margin: 0 0 16px;              /* إزالة margin الكبيرة السابقة */
    flex: 1;                        /* تخلي الملخص يتمدد */
  }
  .blog-desc-link{ text-decoration:none; }

  .blog-date{
    margin: 0;
    font-size: 0.85rem;
    color: #6b7280;
    display: flex;
    gap: 6px;
    align-items: baseline;
    padding-bottom: 12px;
  }
  .blog-date .label{
    color: #374151;
    font-weight: 600;
  }

  .blog-suptitle{
    color: #0b6b37;
    letter-spacing: .02em;
    margin-bottom: 4px;
    font-weight: 700;
    text-transform: uppercase;
    font-size: .9rem;
  }
  .blog-title{ margin: 2px 0 8px; }

  @media (max-width: 576px){
    :global(.blog-slider .slick-list){ margin: 0 -8px; }
    :global(.blog-slider .slick-slide > div){ padding: 0 8px; }
    .blog-details{ padding: 12px; }
    .blog-item-title{ font-size: 1rem; }
    .blog-desc{ font-size: .9rem; }
  }

  .blog-muted{ color: #6b7280; }
`} />

    </Fragment>
  );
};

export default BlogSection;
