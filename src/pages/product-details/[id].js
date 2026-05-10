// pages/product/index.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/router/useRouter";
import CommonLayout from "../../components/shop/common-layout";
import ProductSection from "./common/product_section";
import LeftSidebarPage from "./product/leftSidebarPage";
import { getProduct } from "../../actions/products";
import { useLanguage } from "../../helpers/Language/useLanguage";

const unwrapItem = (res) =>
  res?.item || res?.data?.item || res?.data || res || null;
const unwrapRelated = (res) =>
  res?.related || res?.data?.related || [];

/** Normalize a product (from API) for ProductSection cards */
const adaptCardItem = (raw, isRTL) => {
  if (!raw) return null;

  const tr = Array.isArray(raw.translations)
    ? raw.translations.find((t) => t.locale === (isRTL ? "ar" : "en")) ||
      raw.translations.find((t) => t.locale === (isRTL ? "en" : "ar"))
    : null;

  const title = tr?.name || raw.name || "";
  const price = Number(raw.total ?? raw.price ?? 0);
  const discount = Number(raw.discount ?? 0);

  const images = [];
  if (raw.image_path) images.push({ alt: title, src: raw.image_path });
  if (Array.isArray(raw.media)) {
    raw.media.forEach((m) =>
      images.push({ alt: title, src: m.image_path, id: m.id })
    );
  }

  return {
    id: raw.id,
    title,
    price,
    discount,
    is_available: !!raw.is_available,
    images, // [{src, alt}]
    raw,
  };
};

const ProductDetailsPage = () => {
  const router = useRouter();
  const idParam = router.query?.id;
  const { isRTL, t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!idParam) return;
    let mounted = true;

    (async () => {
      const res = await getProduct(Number(idParam));
      console.log(res)
      try {
        setLoading(true);
        const res = await getProduct(Number(idParam));
        if (!mounted) return;
        setProduct(unwrapItem(res));
        setRelated(unwrapRelated(res));
      } catch {
        if (mounted) {
          setProduct(null);
          setRelated([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [idParam]);

  // adapt related items for the card section
  const relatedCards = useMemo(() => {
    if (!Array.isArray(related)) return [];
    const cards = related
      .map((r) => adaptCardItem(r, isRTL))
      .filter(Boolean);
    // remove current product if it slipped into related
    const currentId = Number(idParam);
    return cards.filter((c) => c.id !== currentId);
  }, [related, isRTL, idParam]);

  return (
    <CommonLayout parent="Home" title={t("product") || "Product"}>
      {/* Product details (renders solely from API data) */}
      <LeftSidebarPage pathId={idParam} prefetched={product} />

      {/* Related products */}
      {!loading && relatedCards.length > 0 ? (
        <ProductSection
          products={relatedCards}
          items={relatedCards} // some themes read either prop
          sectionTitle={t("related_products") || "Related Products"}
        />
      ) : null}
    </CommonLayout>
  );
};

export default ProductDetailsPage;
