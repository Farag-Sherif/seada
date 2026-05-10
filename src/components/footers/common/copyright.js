// components/footers/common/copyright.js
import React, { Fragment, useMemo } from "react";
import Image from "@/components/common/AppImage";
import { Container, Row, Col } from "reactstrap";
import { useLanguage } from "../../../helpers/Language/useLanguage";

// i18n with fallback
const tr = (t, key, fallback) => {
  try {
    const v = t ? t(key) : "";
    return !v || v === key ? fallback : v;
  } catch {
    return fallback;
  }
};

const CopyRight = ({ layout, fluid }) => {
  const lang = useLanguage?.();
  const t = lang?.t;
  const isRTL = Boolean(lang?.isRTL);

  const yearRange = useMemo(
    () => `2023–${new Date().getFullYear()}`,
    []
  );

  return (
    <Fragment>
      <div className={`sub-footer ${layout || ""}`} dir={isRTL ? "rtl" : "ltr"}>
        {/* reactstrap Container fluid expects boolean or breakpoint string; avoid empty string */}
        <Container fluid={typeof fluid === "string" ? fluid : !!fluid}>
          <Row className={`${isRTL ? "text-end" : "text-start"} align-items-center`}>
            <Col xl="6" md="6" sm="12">
              <div className="footer-end" style={isRTL ? { float: "right" } : undefined}>
                <p className="m-0">
                  <i className="fa fa-copyright" aria-hidden="true" />{" "}
                  {yearRange}{" "}
                  {tr(
                    t,
                    "footer.copyright",
                    isRTL
                      ? "  جميع الحقوق محفوظة بدعم من—  Bluebrain"
                      : "All rights reserved — powered by Bluebrain"
                  )}
                </p>
              </div>
            </Col>

            <Col xl="6" md="6" sm="12">
              <div className={`payment-card-bottom ${isRTL ? "text-start" : "text-end"}`}>
                <ul className="list-unstyled d-inline-flex gap-2 m-0">
                  {[
                    { src: "/assets/images/icon/visa.png", alt: "Visa", label: "Visa" },
                    { src: "/assets/images/icon/mastercard.png", alt: "Mastercard", label: "Mastercard" },
                    { src: "/assets/images/icon/paypal.png", alt: "PayPal", label: "PayPal" },
                    { src: "/assets/images/icon/american-express.png", alt: "American Express", label: "American Express" },
                    { src: "/assets/images/icon/discover.png", alt: "Discover", label: "Discover" },
                  ].map((item, i) => (
                    <li key={i}>
                      <a href="#" aria-label={item.label} rel="noreferrer">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          width={48}
                          height={32}
                          style={{ height: "auto", width: "auto", maxHeight: 24 }}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default CopyRight;
