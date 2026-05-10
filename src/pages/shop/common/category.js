// components/shop/filters/Category.jsx
import React, { useState, useContext, Fragment } from "react";
import { Collapse } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
import { useLanguage } from "../../../helpers/Language/useLanguage";

/** Safe i18n fallback */
const trSafe = (t, keyOrText, fallback) => {
  if (!keyOrText) return fallback ?? "";
  try {
    const res = t(keyOrText);
    if (res && res !== keyOrText) return res;
    const v1 = t(keyOrText.toLowerCase());
    if (v1 && v1 !== keyOrText.toLowerCase()) return v1;
    const v2 = t(keyOrText.replace(/-/g, "_"));
    if (v2 && v2 !== keyOrText.replace(/-/g, "_")) return v2;
    const v3 = t(keyOrText.toLowerCase().replace(/-/g, "_"));
    if (v3 && v3 !== keyOrText.toLowerCase().replace(/-/g, "_")) return v3;
    return fallback ?? keyOrText;
  } catch {
    return fallback ?? keyOrText;
  }
};

/** Get display name from translations array (fallback to `name`) */
const localizedName = (node, isRTL) => {
  const list = Array.isArray(node?.translations) ? node.translations : [];
  const want = isRTL ? "ar" : "en";
  const byLocale =
    list.find((x) => x?.locale === want)?.name ||
    list.find((x) => x?.locale)?.name ||
    "";
  return (byLocale || node?.name || `#${node?.id ?? ""}`).trim();
};

const Category = ({ categories = [] }) => {
  const { t, isRTL } = useLanguage();
  const fc = useContext(FilterContext);
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen((v) => !v);

  const selectCategory = (node) => {
    const id = node?.id ?? node?.value ?? node;
    // Prefer explicit setters if your context has them:
    if (typeof fc?.setSelectedCategoryId === "function") fc.setSelectedCategoryId(id);
    if (typeof fc?.setSelectedSubCategoryId === "function") fc.setSelectedSubCategoryId(id);
    if (typeof fc?.setSelectedCategory === "function") fc.setSelectedCategory(id);
    // For older shapes where `state` is category:
    if (typeof fc?.setState === "function") fc.setState(id);
  };

  const selectedId =
    fc?.selectedSubCategoryId ??
    fc?.selectedCategoryId ??
    (typeof fc?.state === "object" ? fc?.state?.id : fc?.state);

  const Item = ({ node, depth = 0 }) => {
    const label = localizedName(node, isRTL);
    const active = String(selectedId ?? "") === String(node?.id ?? "");
    return (
      <Fragment>
        <li style={{margin:'10px 0px'}}>
          <button
            type="button"
            onClick={() => selectCategory(node)}
            className={`btn btn-link p-0 text-start ${active ? "fw-bold" : ""}`}
            style={{
              textDecoration: "none",
              marginInlineStart: depth * 12,
              color: active ? "#0b6b37" : "inherit",
            }}
          >
            {label}
          </button>
        </li>
        {Array.isArray(node?.children) &&
          node.children.map((ch) => (
            <Item key={`c-${node.id}-${ch.id}`} node={ch} depth={depth + 1} />
          ))}
      </Fragment>
    );
  };

  return (
    <div className="collection-collapse-block open" dir={isRTL ? "rtl" : "ltr"}>
      <h3 className="collapse-block-title" onClick={toggle}>
        {trSafe(t, "category", "Category")}
      </h3>

      <Collapse isOpen={isOpen}>
        <div className="collection-collapse-block-content">
          <div className="collection-brand-filter">
            <ul className="category-list" style={{ listStyle: "none", paddingInlineStart: 0 }}>
              {/* “All products” option */}
              <li>
                <button
                  type="button"
                  onClick={() => selectCategory({ id: undefined })}
                  className={`btn btn-link p-0 text-start ${
                    selectedId == null ? "fw-bold" : ""
                  }`}
                  style={{
                    textDecoration: "none",
                    color: selectedId == null ? "#0b6b37" : "inherit",
                  }}
                >
                  {trSafe(t, "all_products", "All products")}
                </button>
              </li>

              {/* Render API categories (with localized names & nested children) */}
              {Array.isArray(categories) &&
                categories.map((cat) => <Item key={`cat-${cat.id}`}  node={cat} />)}
            </ul>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Category;
