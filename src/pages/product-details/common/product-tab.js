// components/product-details/common/product-tab.jsx
import React from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { useLanguage } from "../../../helpers/Language/useLanguage";

import StyleTag from "@/styles/StyleTag";
const ProductTab = ({
  descriptionHtml = "",
  details = {},
  showVideo = false,
  showReview = false,
  /** اختياري: تمرير تسميات من الخارج
   * {
   *   tabs: { details, description, video, review },
   *   fields: { serial, stock, weight, category }
   * }
   */
  labels,
}) => {
  const { t, isRTL } = useLanguage();

  // i18n helper
  const L = (key, fallback) => {
    try {
      const v = t?.(key);
      return v && v !== key ? v : fallback;
    } catch {
      return fallback;
    }
  };

  // --- Labels (merge props.labels -> i18n -> fallback) ---
  const labelsSafe = {
    tabs: {
      details:
        labels?.tabs?.details ??
        L("product.tabs.details", isRTL ? "التفاصيل" : "Details"),
      description:
        labels?.tabs?.description ??
        L("product.tabs.description", isRTL ? "الوصف" : "Description"),
      video:
        labels?.tabs?.video ??
        L("product.tabs.video", isRTL ? "فيديو" : "Video"),
      review:
        labels?.tabs?.review ??
        L("product.tabs.review", isRTL ? "اكتب مراجعة" : "Write Review"),
    },
    fields: {
      serial:
        labels?.fields?.serial ??
        L("product.details.serial", isRTL ? "الرقم التسلسلي" : "Serial"),
      stock:
        labels?.fields?.stock ??
        L("product.details.stock", isRTL ? "رقم المخزون" : "Stock #"),
      weight:
        labels?.fields?.weight ??
        L("product.details.weight", isRTL ? "الوزن" : "Weight"),
      category:
        labels?.fields?.category ??
        L("product.details.category", isRTL ? "القسم" : "Category"),
    },
  };

  // Tabs (dynamic)
  const hasDetails = Object.values(details || {}).some(Boolean);

  const tabs = [
    ...(showReview ? [{ key: "review", label: labelsSafe.tabs.review }] : []),
    ...(showVideo ? [{ key: "video", label: labelsSafe.tabs.video }] : []),
    ...(hasDetails ? [{ key: "details", label: labelsSafe.tabs.details }] : []),
    { key: "description", label: labelsSafe.tabs.description },
  ];

  const [active, setActive] = React.useState(tabs[0]?.key || "description");

  // Ordered fields mapping
  const fieldOrder = [
    ["serial_number", labelsSafe.fields.serial],
    ["stock_number", labelsSafe.fields.stock],
    ["weight", labelsSafe.fields.weight],
    ["category", labelsSafe.fields.category],
  ];

  return (
    <div className="product-tab mt-5" dir={isRTL ? "rtl" : "ltr"}>
      {/* Tabs header */}
      <Nav tabs className="justify-content-end justify-content-lg-start px-3 px-lg-0">
        {tabs.map((tItem) => (
          <NavItem key={tItem.key}>
            <NavLink
              className={classnames({ active: active === tItem.key })}
              onClick={() => setActive(tItem.key)}
              role="button"
            >
              {tItem.label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>

      {/* Tabs content */}
      <TabContent activeTab={active} className="pt-4 px-3 px-lg-0">
        {showReview && (
          <TabPane tabId="review">
            {/* ضع ويدجت المراجعات هنا */}
            <div />
          </TabPane>
        )}

        {showVideo && (
          <TabPane tabId="video">
            {/* ضع مشغل الفيديو هنا عند توفر الرابط من الـ API */}
            <div />
          </TabPane>
        )}

        {hasDetails && (
          <TabPane tabId="details">
            <ul className="prod-details">
              {fieldOrder.map(([key, label]) =>
                details?.[key] ? (
                  <li key={key}>
                    <strong>{label}</strong>
                    <span>{details[key]}</span>
                  </li>
                ) : null
              )}
            </ul>
          </TabPane>
        )}

        <TabPane tabId="description">
          <div
            className="prod-description"
            // HTML من الـ API
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        </TabPane>
      </TabContent>

      {/* Styles */}
      <StyleTag global css={`
        /* Tabs */
        .product-tab .nav-tabs {
          border-bottom: 0;
          gap: 22px;
        }
        .product-tab .nav-tabs .nav-link {
          border: 0 !important;
          background: transparent !important;
          color: #1f2937;
          font-weight: 700;
          letter-spacing: 0.2px;
          padding: 0 0 14px;
          position: relative;
          font-size: 1.125rem;
          line-height: 1.2;
        }
        .product-tab .nav-tabs .nav-link:hover,
        .product-tab .nav-tabs .nav-link.active {
          color: #0b7d4e;
        }
        .product-tab .nav-tabs .nav-link.active::after {
          content: "";
          position: absolute;
          height: 3px;
          background: #0b7d4e;
          inline-size: 90px; /* يعمل LTR/RTL */
          inset-inline-start: 0;
          inset-block-end: 0;
          border-radius: 3px;
        }
        [dir="rtl"] .product-tab .nav-tabs .nav-link.active::after {
          inset-inline-start: auto;
          inset-inline-end: 0;
        }

        /* Content */
        .product-tab .tab-content {
          border-top: 1px solid #eaeaea;
          padding-top: 28px;
        }

        .prod-description,
        .prod-details {
          font-size: 1.0625rem; /* ~17px */
        }
        .prod-description p,
        .prod-description li {
          line-height: 1.95;
          color: #374151;
          margin-bottom: 12px;
        }
        .prod-description ul {
          padding-inline-start: 22px;
          margin-top: 6px;
        }
        .prod-description p {
          font-size: 1.0625rem;
        }

        /* Details list */
        .prod-details {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .prod-details li {
          display: flex;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px dashed #eee;
          align-items: baseline;
        }
        .prod-details li strong {
          min-inline-size: 140px; /* يتوافق مع RTL */
          color: #111827;
          font-weight: 700;
        }
        [dir="rtl"] .prod-details li {
          flex-direction: row;
          text-align: right;
        }
        [dir="rtl"] .prod-details li strong {
          text-align: start;
        }

        /* Larger on lg+ */
        @media (min-width: 992px) {
          .product-tab .nav-tabs .nav-link {
            font-size: 1.3rem;
            padding-bottom: 16px;
          }
          .prod-description,
          .prod-details {
            font-size: 1.125rem; /* 18px */
          }
        }
      `} />
    </div>
  );
};

export default ProductTab;
