import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import CommonLayout from "../../components/shop/common-layout";
import { Container, Row, Col, Media, Spinner, Alert } from "reactstrap";
import { Slider2 } from "../../services/script";
import ServiceLayout from "../../components/common/Service/service1.js";
import { useLanguage } from "../../helpers/Language/useLanguage.js";

// lazy-load react-slick on client only
const Slick = dynamic(() => import("react-slick"), { ssr: false });

// actions
import { getSettings, getTestimonials } from "../../actions/main";

import StyleTag from "@/styles/StyleTag";
/* ---------------- helpers ---------------- */
const pickTr = (settings, key, isRTL) => {
  if (!settings) return "";
  const locale = isRTL ? "ar" : "en";
  const tr = settings?.translations?.find((t) => t?.locale === locale);
  return (tr && tr[key]) || settings[key] || "";
};

const fullName = (u) =>
  [u?.fname, u?.lname].filter(Boolean).join(" ") || u?.username || "User";

const resolveImage = (settings, src) => {
  if (!src) return "/assets/images/avtar.jpg";
  if (/^https?:\/\//i.test(src)) return src;

  let base =
    settings?.user_image_path ||
    settings?.users_image_path ||
    settings?.offer_image_path;

  if (!base) {
    const sampleAbs =
      settings?.image_logo_path ||
      settings?.banner_image_path ||
      settings?.about_section_image_path ||
      "";
    try {
      if (sampleAbs) {
        const u = new URL(sampleAbs);
        base = `${u.origin}/images`;
      }
    } catch {}
  }

  if (base) {
    return `${String(base).replace(/\/$/, "")}/${String(src).replace(/^\//, "")}`;
  }
  return `/assets/images/${src}`;
};

/* ---------------- Testimonial Card ---------------- */
const TestimonialCard = ({ img, name, post, about, rate }) => {
  return (
    <div className="h-100">
      <div className="card h-100 shadow-sm border-0 rounded-3">
        <div className="card-body d-flex" style={{ gap: 16 }}>
          <div className="text-center" style={{ minWidth: 84 }}>
            <Media
              src={img}
              alt={name}
              className="rounded-circle"
              style={{ width: 72, height: 72, objectFit: "cover" }}
            />
            <h6 className="mt-2 mb-0 text-capitalize">{name}</h6>
            {post ? <small className="text-muted">{post}</small> : null}
          </div>
          <div className="flex-grow-1">
            <p className="mb-2 text-muted" style={{ lineHeight: 1.6 }}>
              {about}
            </p>
            <div className="d-flex" style={{ gap: 4, fontSize: 18 }}>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  style={i < rate ? { color: "#b98848" } : { color: "#e2e2e2" }}
                  aria-hidden="true"
                >
                  ★
                </span>
              ))}
              <span className="visually-hidden">{rate} / 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================== PAGE ============================== */
const AboutUs = () => {
  const { t, isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [settings, setSettings] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  const dirStyle = useMemo(
    () => ({
      direction: isRTL ? "rtl" : "ltr",
      textAlign: isRTL ? "right" : "left",
    }),
    [isRTL]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setApiError(null);
      try {
        const [sRes, tRes] = await Promise.all([getSettings(), getTestimonials()]);
        if (!mounted) return;

        const sData =
          sRes?.settings || sRes?.data?.settings || sRes?.data || sRes || null;
        if (!sData) throw new Error("Failed to load settings");
        setSettings(sData);

        const tData = Array.isArray(tRes)
          ? tRes
          : Array.isArray(tRes?.data)
          ? tRes.data
          : Array.isArray(tRes?.data?.data)
          ? tRes.data.data
          : Array.isArray(tRes?.testimonials)
          ? tRes.testimonials
          : [];
        setTestimonials(tData);
      } catch (err) {
        if (mounted)
          setApiError(err?.message || t("something_wrong") || "Something went wrong");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [t]);

  /* ---------- About copy ---------- */
  const aboutTitle =
    pickTr(settings, "about_section_sub_title", isRTL) ||
    pickTr(settings, "about_section_title", isRTL) ||
    t("about_subtitle");

  const p1 =
    pickTr(settings, "about_section_introduction", isRTL) ||
    pickTr(settings, "about_us", isRTL) ||
    t("about_description");

  const p2 = [
    pickTr(settings, "about_section_vision", isRTL),
    pickTr(settings, "about_section_apart", isRTL),
    pickTr(settings, "about_section_commitment", isRTL),
  ]
    .filter(Boolean)
    .join(" ");

  const aboutImg =
    settings?.about_section_image_path

  /* ---------- Normalize testimonials ---------- */
  const items = useMemo(() => {
    return (testimonials || []).map((it) => {
      const u = it?.user || it?.users || {};
      const name = fullName(u);
      const post = u?.username || t("customer");
      const about = it?.review || "";
      const rateRaw = Number(it?.rate);
      const rate = Number.isFinite(rateRaw) ? Math.max(0, Math.min(5, rateRaw)) : 0;
      const img = resolveImage(settings, u?.image);
      return {
        id: it?.id ?? `${name}-${about?.slice(0, 8)}`,
        img,
        name,
        post,
        about,
        rate,
      };
    });
  }, [testimonials, settings, t]);

  /* ---------- Slider settings (cleaned) ---------- */
  const sliderSettings = useMemo(() => {
    const base = (typeof Slider2 === "object" && Slider2) || {};
    return {
      dots: true,
      arrows: false,
      infinite: items.length > 2,
      speed: 500,
      slidesToShow: Math.min(2, Math.max(1, items.length)),
      slidesToScroll: 1,
      rtl: isRTL,
      responsive: [{ breakpoint: 992, settings: { slidesToShow: 1, slidesToScroll: 1 } }],
      ...base,
      rtl: isRTL,
      slidesToShow: Math.min(2, Math.max(1, items.length)),
    };
  }, [items.length, isRTL]);

  return (
    <CommonLayout parent="home" title="About-us">
      <section className="about-page section-b-space" style={dirStyle}>
        <Container>
          {/* Hero Banner */}
          <Row>
            <Col lg="12">
              <div className="position-relative rounded-3 overflow-hidden shadow-sm">
                {/* image / skeleton */}
                {loading ? (
                  <div
                    className="w-100"
                    style={{
                      height: 420,
                      background:
                        "linear-gradient(90deg, #f3f3f3 25%, #ecebeb 37%, #f3f3f3 63%)",
                      backgroundSize: "400% 100%",
                      animation: "shimmer 1.4s ease-in-out infinite",
                      borderRadius: 12,
                    }}
                  />
                ) : (
                  <Media
                    src={aboutImg}
                    className="img-fluid"
                    alt={pickTr(settings, "about_section_title", isRTL) || "About"}
                    style={{ height: 420, width: "100%", objectFit: "cover" }}
                  />
                )}

                {/* soft gradient overlay */}
                <div
                  className="position-absolute  top-0 start-0 w-100 h-100"
                 
                />

                {/* headline */}
                <div
                  className="position-absolute w-100"
                  style={{
                    bottom: 24,
                    left: 0,
                    right: 0,
                    paddingInline: 24,
                  }}
                >
                  <h2
                    className="m-0 text-white fw-semibold"
                    style={{ textShadow: "0 2px 12px rgba(0,0,0,.25)" }}
                  >
                    {pickTr(settings, "about_section_title", isRTL) ||
                      t("about_title") ||
                      "About Us"}
                  </h2>
                </div>
              </div>
            </Col>
          </Row>

          {/* About Content */}
          <Row className="mt-4 g-4">
            <Col lg="12">
              {apiError ? (
                <Alert color="danger" className="mt-2">
                  {apiError}
                </Alert>
              ) : (
                <div className="card border-0  shadow-sm rounded-3">
                  <div className="card-body svc-card p-4 p-md-5" style={{flexDirection:"column",display:'flex'}}>
                    <h4 className="m-0" style={{ fontSize: 24 ,alignSelf:'flex-start'}}>
                      {aboutTitle}
                    </h4>
                    <p className="text-muted mb-3" style={{ lineHeight: 1.8 }}>
                      {p1}
                    </p>
                    {!!p2 && (
                      <p className="text-muted" style={{ lineHeight: 1.8 }}>
                        {p2}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Col>

            {/* Quick Stats / Highlights (optional, stays empty if no data) */}
            {/* <Col lg="4">
              <div className="card border-0 shadow-sm rounded-3 h-100">
                <div className="card-body p-4">
                  <h6 className="text-uppercase text-muted mb-3">
                    {t("highlights") || "Highlights"}
                  </h6>
                  <ul className="list-unstyled m-0">
                    {[
                      pickTr(settings, "about_highlight_1", isRTL),
                      pickTr(settings, "about_highlight_2", isRTL),
                      pickTr(settings, "about_highlight_3", isRTL),
                    ]
                      .filter(Boolean)
                      .map((v, i) => (
                        <li key={i} className="d-flex align-items-start mb-3">
                          <span
                            className="rounded-circle me-2"
                            style={{
                              display: "inline-block",
                              width: 8,
                              height: 8,
                              background: "#b98848",
                              marginTop: 8,
                              flex: "0 0 auto",
                            }}
                          />
                          <span className="text-muted">{v}</span>
                        </li>
                      ))}
                    {!pickTr(settings, "about_highlight_1", isRTL) &&
                      !pickTr(settings, "about_highlight_2", isRTL) &&
                      !pickTr(settings, "about_highlight_3", isRTL) && (
                        <li className="text-muted">{t("no_data") || "—"}</li>
                      )}
                  </ul>
                </div>
              </div>
            </Col> */}
          </Row>

          {/* Testimonials */}
          {items.length > 0 && (
            <Row className="mt-5">
              <Col lg="12">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4 className="m-0" style={{ fontSize: 22 }}>
                    {t("what_customers_say") || "What our customers say"}
                  </h4>
                </div>

                <div className="position-relative">
                  <Slick {...sliderSettings}>
                    {items.map((it) => (
                      <div key={it.id} className="px-2 px-md-3">
                        <TestimonialCard {...it} />
                      </div>
                    ))}
                  </Slick>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* Services strip */}
      <div className="section-b-space">
        <ServiceLayout sectionClass={"service border-section small-section"} />
      </div>

      {/* local shimmer keyframes */}
      <StyleTag global css={`
        @keyframes shimmer {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: -135% 0%;
          }
        }
      `} />
    </CommonLayout>
  );
};

export default AboutUs;
