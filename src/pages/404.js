// pages/404.jsx
import React from "react";
import Link from "@/router/NextLinkCompat";
import CommonLayout from "../components/shop/common-layout";
import { Container, Row, Col } from "reactstrap";
import { useLanguage } from "../helpers/Language/useLanguage";

/* tiny i18n helper */
const tr = (t, key, fallback) => {
  try {
    const v = t ? t(key) : "";
    return !v || v === key ? fallback : v;
  } catch {
    return fallback;
  }
};

const Page404 = () => {
  const { t, isRTL } = useLanguage();

  const parentLabel = tr(t, "Home", isRTL ? "الرئيسية" : "Home"); // CommonLayout breadcrumb
  const title404 = tr(t, "notFound.title", "404");
  const subtitle = tr(
    t,
    "notFound.subtitle",
    isRTL ? "الصفحة غير موجودة" : "page not found"
  );
  const backHome = tr(
    t,
    "notFound.backToHome",
    isRTL ? "العودة إلى الرئيسية" : "back to home"
  );

  return (
    <CommonLayout parent={parentLabel} title={title404}>
      <section
        className="p-0"
        style={{
          direction: isRTL ? "rtl" : "ltr",
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
          padding: "40px 0",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col sm="12" md="10" lg="8">
              <div className="error-section" style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: 96, marginBottom: 12 }}>{title404}</h1>
                <h2 style={{ textTransform: "none", marginBottom: 24 }}>
                  {subtitle}
                </h2>
                <Link href="/" className="btn btn-solid">
                  {backHome}
                </Link>
                  {/*make button*/}

              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Page404;
