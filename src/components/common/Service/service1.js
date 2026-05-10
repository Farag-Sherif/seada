// components/home/ServiceLayout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import MasterServiceContent from "./MasterServiceConternt";
import { useLanguage } from "../../../helpers/Language/useLanguage";
import { getChoices } from "../../../actions/main";

import { svgFreeShipping, svgservice, svgoffer } from "../../../services/script";

import StyleTag from "@/styles/StyleTag";
/* --- legacy fallback if API returns nothing --- */
const legacy = (t) => [
  { link: svgFreeShipping, title: t("free_shipping"), service: t("free_shipping_worldwide") },
  { link: svgservice,      title: t("24x7_service"),   service: t("online_service_24x7") },
  { link: svgoffer,        title: t("festival_offer"), service: t("new_online_special_festival_offer") },
];

const pickTranslation = (choice, locale) => {
  const list = choice?.translations || [];
  const tr =
    list.find((x) => x.locale === locale) ||
    list.find((x) => x.locale === "en") ||
    {};
  return {
    title: tr.title || choice.title || "",
    description: tr.description || choice.description || "",
  };
};

/** Safe icon renderer that accepts: URL string | JSX node | null */
const Icon = ({ src, alt }) => {
  if (React.isValidElement(src)) {
    return <span className="svc-icon-wrap">{src}</span>;
  }
  if (typeof src === "string" && src.trim()) {
    return (
      <span className="svc-icon-wrap">
        <img
          src={src}
          alt={alt || ""}
          width={56}
          height={56}
          loading="lazy"
          style={{ objectFit: "contain", display: "block" }}
        />
      </span>
    );
  }
  return <span className="svc-icon-wrap svc-fallback" aria-hidden="true">★</span>;
};

const ServiceSkeleton = () => (
  <div className="svc-card svc-skeleton">
    <div className="svc-icon-wrap" />
    <div className="svc-text">
      <div className="svc-line svc-line-lg" />
      <div className="svc-line" />
    </div>
  </div>
);

const ServiceItem = ({ icon, title, description }) => (
  <div className="svc-card">
    <Icon src={icon} alt={title} />
    <div className="svc-text">
      <h4 className="svc-title">{title}</h4>
      <p className="svc-desc">{description}</p>
    </div>
  </div>
);

const ServiceLayout = ({ sectionClass = "" }) => {
  const { t, isRTL, currentLanguage } = useLanguage();
  const [choices, setChoices] = useState(null); // null = not loaded yet
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getChoices();
        if (!alive) return;
        setChoices(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Failed to load choices");
        setChoices([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  const isLoading = choices === null;

  const serviceData = useMemo(() => {
    if (Array.isArray(choices) && choices.length) {
      return choices.map((c) => {
        const { title, description } = pickTranslation(c, currentLanguage);
        const icon = c.icon_path ?? c.icon ?? null;
        return { id: c.id ?? `${title}-${Math.random()}`, icon, title, description };
      });
    }
    // fallback (while loading or empty/error)
    return legacy(t).map((it, i) => ({
      id: `legacy-${i}`,
      icon: it.link,
      title: it.title,
      description: it.service,
    }));
  }, [choices, currentLanguage, t]);

  return (
    <Container className={"section-b-space section-t-space"}>
      <section
        className={`service-section  ${sectionClass}`}
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <Row className="gx-4 gy-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Col md="4" sm="6" xs="12" key={`skeleton-${i}`}>
                  <ServiceSkeleton />
                </Col>
              ))
            : serviceData.map((data) => (
                <Col md="4" sm="6" xs="12" key={data.id}>
                  {/* MasterServiceContent remains for compatibility, but now wrapped in a styled card */}
                  <div className="svc-card">
                    <Icon src={data.icon} alt={data.title} />
                    <div className="svc-text">
                      <MasterServiceContent
                        link={null}
                        title={<span className="svc-title">{data.title}</span>}
                        service={<span className="svc-desc">{data.description}</span>}
                      />
                    </div>
                  </div>
                </Col>
              ))}
        </Row>

        {error && import.meta.env.MODE !== "production" && (
          <div style={{ color: "#b91c1c", marginTop: 8, fontSize: 12 }}>{error}</div>
        )}
      </section>

      <StyleTag global css={`
        /* Layout container */
        .service-section {
          padding-block: 16px;
        }

        /* Card */
        .svc-card {
          display: grid;
          grid-template-columns: 56px 1fr;
          gap: 14px;
          align-items: center;
          padding: 18px 16px;
          border: 1px solid #ececec;
          border-radius: 14px;
          background: #fff;
          min-height: 110px;
          transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
        }
        .svc-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(0,0,0,.05);
          border-color: #e4efe9;
        }
        .svc-card:active {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(0,0,0,.04);
        }

        /* Icon (no circle container) */
        .svc-icon-wrap {
          width: 56px;
          height: 56px;
          min-width: 56px;
          display: grid;
          place-items: center;
          /* removed background, border, and rounding to show raw image */
          background: transparent;
          border: none;
          border-radius: 0;
          overflow: visible;
          padding: 0;
        }
        .svc-icon-wrap img {
          display: block;
          width: 56px;
          height: 56px;
          object-fit: contain;
        }
        .svc-icon-wrap.svc-fallback {
          font-size: 20px;
          color: #0b6b37;
          font-weight: 700;
        }

        /* Text */
        .svc-text {
          display: grid;
          align-content: center;
          gap: 4px;
        }
        .svc-title {
          font-size: 1.0625rem;
          font-weight: 700;
          line-height: 1.3;
          margin: 0;
          color: #111827;
        }
        .svc-desc {
          margin: 0;
          color: #4b5563;
          line-height: 1.7;
          font-size: .9375rem;
        }

        /* Skeletons */
        .svc-skeleton {
          pointer-events: none;
          border-color: #f0f0f0;
        }
        .svc-skeleton .svc-icon-wrap,
        .svc-line {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
          background-size: 400% 100%;
          animation: svc-shimmer 1.2s ease-in-out infinite;
        }
        .svc-line {
          height: 12px;
          border-radius: 8px;
          width: 100%;
        }
        .svc-line + .svc-line {
          margin-top: 8px;
          width: 80%;
        }
        .svc-line-lg {
          height: 14px;
          width: 60%;
        }
        @keyframes svc-shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }

        /* Responsive tweaks */
        @media (max-width: 767px) {
          .svc-card {
            grid-template-columns: 48px 1fr;
            gap: 12px;
            padding: 16px 14px;
            min-height: 100px;
          }
          .svc-icon-wrap {
            width: 48px;
            height: 48px;
            min-width: 48px;
          }
          .svc-icon-wrap img {
            width: 48px;
            height: 48px;
          }
          .svc-title {
            font-size: 1rem;
          }
          .svc-desc {
            font-size: .9rem;
          }
        }
      `} />
    </Container>
  );
};

export default ServiceLayout;
