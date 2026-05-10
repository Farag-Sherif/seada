import React from "react";
import { Container, Row, Col } from "reactstrap";
import Link from "@/router/NextLinkCompat";
import { useLanguage } from "../../../helpers/Language/useLanguage";

const trSafe = (t, maybeKeyOrText) => {
  if (!maybeKeyOrText) return "";
  try {
    const res = t(maybeKeyOrText);
    return !res || res === maybeKeyOrText ? maybeKeyOrText : res;
  } catch {
    return maybeKeyOrText;
  }
};

const Breadcrubs = ({ title, parent, subTitle }) => {
  const { t, isRTL } = useLanguage();

  const homeLabel = trSafe(t, "Home");
  const titleLabel = trSafe(t, title);
  const parentLabel = trSafe(t, parent);
  const subLabel = trSafe(t, subTitle);

  return (
    <div
      className="breadcrumb-section"
      style={{ direction: isRTL ? "rtl" : "ltr", background: "#f7f7f7" }}
    >
      <Container>
        <div
          className="d-flex justify-content-between align-items-center flex-wrap gap-2 py-3"
          style={{ minHeight: "60px" }}
        >
          {/* Left side: title */}
          <h2 className="m-0" style={{ textAlign: isRTL ? "right" : "left" }}>
            {titleLabel}
          </h2>

          {/* Right side: breadcrumb */}
          <nav aria-label="breadcrumb" className="theme-breadcrumb m-0">
            <ol
              className="breadcrumb mb-0"
              style={{
                direction: isRTL ? "rtl" : "ltr",
                background: "transparent",
              }}
            >
              <li className="breadcrumb-item">
                <Link href="/">{homeLabel}</Link>
              </li>

              {/* {parentLabel && (
                <li className="breadcrumb-item">
                  <Link href="#">{parentLabel}</Link>
                </li>
              )} */}

              <li
                className={`breadcrumb-item${subLabel ? "" : " active"}`}
                aria-current={subLabel ? undefined : "page"}
              >
                {titleLabel}
              </li>

              {subLabel && (
                <li className="breadcrumb-item active" aria-current="page">
                  {subLabel}
                </li>
              )}
            </ol>
          </nav>
        </div>
      </Container>
    </div>
  );
};

export default Breadcrubs;
