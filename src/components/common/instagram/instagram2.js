// components/instagram/Instagram.js
import React, { useEffect, useState, useMemo } from "react";
import Slider from "react-slick";
import { Row, Col, Container } from "reactstrap";
import { Slider5 as BaseSlider5 } from "../../../services/script";
import { getImages } from "../../../actions/main";
import { useLanguage } from "../../../helpers/Language/useLanguage";

/* i18n fallback helper */
const tr = (t, key, fallback) => {
  try {
    const v = t ? t(key) : "";
    return !v || v === key ? fallback : v;
  } catch {
    return fallback;
  }
};

const Instagram = ({ type }) => {
  const { t, isRTL } = useLanguage();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Localized strings (falls back to Arabic when RTL, else English)
  const sectionTitle = tr(t, "gallery.title", isRTL ? "المعرض" : "Gallery");
  const altBase = tr(t, "gallery.imageAlt", isRTL ? "صورة من المعرض" : "Gallery image");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getImages(/* optionally pass type */);
        console.log(res)
        if (mounted && Array.isArray(res)) setItems(res);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [type]);

  // Ensure slider mirrors layout direction
  const sliderSettings = useMemo(() => ({ ...BaseSlider5, rtl: !!isRTL }), [isRTL]);

  return (
    <Container>
      <Row>
        <Col md="12">
          <h2
            className="title-borderless"
            style={{ textAlign: "center",marginBottom:'50px'}}
            aria-label={sectionTitle}
          >
            {sectionTitle}
          </h2>

          <Slider {...sliderSettings} className="slide-5 no-arrow slick-instagram">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={`ph-${i}`}>
                    <div
                      className="instagram-box"
                      style={{
                        width: "100%",
                        paddingTop: "100%",
                        background: "rgba(0,0,0,0.05)",
                      }}
                      aria-hidden="true"
                    />
                  </div>
                ))
              : items.map((item, idx) => {
                  const href = item.url || "#";
                  const hasLink = Boolean(item.url);
                  const alt = item.alt || `${altBase} ${idx + 1}`;
                  return (
                    <div key={item.id || idx}>
                      <a
                        href={href}
                        target={hasLink ? "_blank" : undefined}
                        rel={hasLink ? "noreferrer" : undefined}
                        aria-label={sectionTitle}
                      >
                        <div className="instagram-box">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image_path}
                            className="bg-img"
                            alt={alt}
                            style={{ width: "100%" }}
                            loading="lazy"
                          />
                          <div className="overlay">
                            <i className="fa fa-image" aria-hidden="true" />
                          </div>
                        </div>
                      </a>
                    </div>
                  );
                })}
          </Slider>
        </Col>
      </Row>
    </Container>
  );
};

export default Instagram;
