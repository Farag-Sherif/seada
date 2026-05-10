import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { useLanguage } from "../../../../helpers/Language/useLanguage";
import { getSettings } from "../../../../actions/main";

/* helpers */
const pickTr = (settings, isRTL, keyg) => {
  if (!settings) return undefined;
  const tr = settings.translations?.find((x) => x?.locale === (isRTL ? "ar" : "en"));
  return tr?.[keyg] ?? settings?.[keyg];
};
const normLink = (l) => {
  if (!l) return "#";
  if (/^https?:\/\//i.test(l) || l.startsWith("/") || l.startsWith("?")) return l;
  return `/${l}`;
};
const withBust = (url, version) => {
  if (!url) return url;
  const sep = url.includes("?") ? "&" : "?";
  const v = version || Date.now();
  return `${url}${sep}_=${encodeURIComponent(v)}`;
};

/* 🔒 يعرض الصورة الجديدة فقط بعد اكتمال التحميل */
function ImageSwap({ src, alt, className, style, placeholderHeight = 260 }) {
  const [ready, setReady] = useState(false);
  const [showSrc, setShowSrc] = useState("");

  useEffect(() => {
    let alive = true;
    setReady(false);            // اخفِ القديمة فورًا
    setShowSrc("");             // امسح src المعروض

    if (!src) return;

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (!alive) return;
      setShowSrc(src);          // اعرض الجديدة مرة واحدة
      setReady(true);
    };
    img.onerror = () => {
      if (!alive) return;
      setShowSrc(src);          // حتى لو فشل onerror نعرضها
      setReady(true);
    };
    img.src = src;

    return () => { alive = false; };
  }, [src]);

  if (!ready) {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          width: "100%",
          height: placeholderHeight,
          borderRadius: 14,
          background: "#f3f4f6",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={showSrc}
      alt={alt || ""}
      className={className}
      style={style}
      decoding="async"
    />
  );
}

/* card */
const MasterCollection = ({ img, title, link, desc, isRTL }) => (
  <Col md="6" xs="12" className="mb-4">
    <a
      href={link}
      className={`collection-card ${isRTL ? "rtl" : ""}`}
      aria-label={title || desc || "offer"}
    >
      <div className="collection-media">
        <ImageSwap
          src={img}
          alt={title || ""}
          className="img-fluid"
          style={{
            width: "100%",
            objectFit: "cover",
            borderRadius: 14,
            boxShadow: "0 8px 24px rgba(0,0,0,.06)",
          }}
          placeholderHeight={260}
        />
      </div>

      <div className="collection-content">
        {title ? <span className="collection-cta">{title}</span> : null}
        {desc ? <h2 className="collection-title">{desc}</h2> : null}
      </div>
    </a>
  </Col>
);

const Collections = () => {
  const { isRTL } = useLanguage();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // لو عندك تعدد لغات، ممكن تحب تعيد الجلب عند تغيّر isRTL
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setSettings(null);
        const res = await getSettings(); // يفضل داخلها cache:'no-store'
        const s = res?.settings ?? res;
        if (mounted) setSettings(s || null);
      } catch {
        if (mounted) setSettings(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isRTL]); // لو لا تريد إعادة الجلب مع اللغة، احذف isRTL من الديبس

  const offers = useMemo(() => {
    const s = settings || {};
    const ver = s?.updated_at || s?.updatedAt || undefined;

    // first banner
    const img1Raw =
      s.offer_one_section_image_path ||
      s.offer_section_image1_path ||
      s.banner_image_path
    const img1 = withBust(img1Raw, ver);

    const title1 =
      pickTr(s, isRTL, "offer_section_title") ||
      pickTr(s, isRTL, "banner_product_title_section") ||
      "";

    const desc1 =
      pickTr(s, isRTL, "offer_section_content") ||
      pickTr(s, isRTL, "banner_product_content_section") ||
      "";

    const link1 = normLink(s.offer_section_link);

    // second banner
    const img2Raw =
      s.offer_tow_section_image_path ||
      s.offer_two_section_image_path ||
      s.offer_section_image2_path
    const img2 = withBust(img2Raw, ver);

    const title2 = pickTr(s, isRTL, "offer_section_title2") || title1;
    const desc2 = pickTr(s, isRTL, "offer_section_content2") || desc1;
    const link2 = normLink(s.offer_section_link2);

    return [
      { img: img1, title: title1, desc: desc1, link: link1 },
      { img: img2, title: title2, desc: desc2, link: link2 },
    ];
  }, [settings, isRTL]);

  const skeletons = [
    { img: "", title: "", desc: "", link: "#" },
    { img: "", title: "", desc: "", link: "#" },
  ];

  // أثناء التحميل لا نعرض أي صور قديمة—سكيليتون فقط
  const data = loading ? skeletons : offers;
  console.log(skeletons , offers)

  // مفتاح يعيد تركيب القائمة بالكامل لما الصور تتغيّر
  const listKey = useMemo(
    () => (loading ? "skeleton" : offers.map(o => o.img).join("|")),
    [loading, offers]
  );

  return (
    <Fragment>
      <section className="section-b-space p-t-0 collections-section" key={listKey}>
        <Container>
          <Row className="gy-4">
            {data.map((d, i) => (
              <MasterCollection
                key={`${i}-${d.img || "sk"}`}
                img={d.img}
                link={"/product-details/"+d.link.split("/")[d.link.split("/").length - 1]+"/"}
                title={d.title}
                desc={d.desc}
                isRTL={isRTL}
              />
            ))}
          </Row>
        </Container>
      </section>
    </Fragment>
  );
};

export default Collections;
