// pages/layouts/fashion/shoes.jsx (or wherever this lives)
import React, { useEffect } from "react";

import Banner from "./components/Banner";
import Category from "./components/Category";
import AboutUs from "./components/About-us";
import Collections from "./components/Collections";
// import CategoryTwo from "./components/Category-two";
import SpecialProducts from "../../../components/common/Collections/Collection3";
import ProductSlider from "../../../components/common/Collections/Collection9";
import Blog from "../../../components/common/Blog/blog1";
import ServiceLayout from "../../../components/common/Service/service1";
import Instagram from "../../../components/common/instagram/instagram2";

import { Product4 } from "../../../services/script";
import { useLanguage } from "../../../helpers/Language/useLanguage";
import  HydrationCloak  from "../../../helpers/hydrationClock"
/* tiny helper: prefer t(key) but fall back gracefully */
const tr = (t, key, fallback) => {
  try {
    const v = t ? t(key) : "";
    return !v || v === key ? fallback : v;
  } catch {
    return fallback;
  }
};

const Shoes = () => {
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    document.documentElement.style.setProperty("--theme-deafult", "#0b6b37");
    // keep document direction in sync (optional, if your layout doesn’t already do it)
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
  }, [isRTL]);

  // Localized strings
  const lblCollectionsSup = tr(t, "home.collections.subtitle", isRTL ? "عرض خاص" : "Special Offer");
  const lblCollectionsTitle = tr(t, "home.collections.title", isRTL ? "مجموعاتنا" : "Our Collections");

  const blogSectionClass = "blog blog-bg section-b-space ratio2_3";
  const blogTitleClass = "title3";
  const blogInnerTitle = "title-inner3";

  return (
    <>
      <Banner />

      {/* About section already reads from settings with i18n inside */}
      <AboutUs />

      {/* If your Collections component reads its own i18n, keep as-is */}
      <Collections  />


      {/* Special Products (pass localized title/subtitle) */}
      <SpecialProducts
        type="shoes"
        line
        innerClass="title3"
        inner="title-inner3"
        title={lblCollectionsTitle}
        subtitle={lblCollectionsSup}
        designClass="section-b-space p-t-0 ratio_asos"
        productSlider={Product4}
        noSlider="true"
        cartClass="cart-info"
      />

        {/* <CategoryTwo /> */}
      <Category />


      {/* Product slider (type is fine; internal component should read t() for headings) */}
      <ProductSlider type="shoes" />

      {/* Blog section: pass classes, the component localizes its own strings */}
      <Blog
        type="shoes"
        sectionClass={blogSectionClass}
        inner={blogInnerTitle}
        title={blogTitleClass}
      />

      <ServiceLayout sectionClass={"service border-section small-section border-top-0"} />

      {/* Instagram: your instagram2 component should already translate its heading */}
      <section className="instagram ratio_square section-b-space">
        <Instagram type="shoes" />
      </section>
    </>
  );
};

export default Shoes;
