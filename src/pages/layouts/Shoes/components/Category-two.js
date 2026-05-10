import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Container, Media, Row, Col } from "reactstrap";
import { useRouter } from "@/router/useRouter";
import cart1 from "@/assets/images/shoes/cat1.jpg";
import cart2 from "@/assets/images/shoes/cat2.jpg";
import cart3 from "@/assets/images/shoes/cat3.jpg";
import { getCategories } from "./../../../../actions/categories";
import { useLanguage } from "../../../../helpers/Language/useLanguage";

const FALLBACKS = [cart1, cart2, cart3];

/* ---------------- helpers ---------------- */

// pick localized name from translations
const pickTranslatedName = (item, want = "en") => {
  const tr = Array.isArray(item?.translations) ? item.translations : [];
  const primary = tr.find((t) => t?.locale === want)?.name;
  const fallback = tr.find((t) => t?.locale && t.locale !== want)?.name;
  return primary || fallback || item?.name || "";
};

const pickImage = (item, idx) => {
  if (item?.logo_path) return item.logo_path;         // full URL in your API
  if (item?.meta?.image_path) return item.meta.image_path;
  if (item?.meta?.image) return item.meta.image;
  return (FALLBACKS[idx % FALLBACKS.length] || cart1).src;
};

// light dedupe by id -> slug -> logo_path
const dedupe = (arr) => {
  const seen = new Set();
  const out = [];
  for (const it of arr || []) {
    const k =
      (it?.id != null && `id:${it.id}`) ||
      (it?.slug && `slug:${String(it.slug).toLowerCase()}`) ||
      (it?.logo_path && `logo:${it.logo_path}`);
    if (!k) continue;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(it);
  }
  return out;
};

/* ---------------- UI ---------------- */

const MasterCategory = ({ img, title, onClick }) => (
  <Col sm="4" className="border-padding">
    <div className="category-banner" role="button" tabIndex={0}
         onClick={onClick}
         onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}>
      <div>
        <Media src={img} className="img-fluid blur-up lazyload bg-img" alt={title} />
      </div>
      <div className="category-box">
        <span>
          <h2>{title}</h2>
        </span>
      </div>
    </div>
  </Col>
);

const CategoryTwo = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // language context
  const { currentLanguage } = useLanguage();
  const want = (currentLanguage || "en").toLowerCase().startsWith("ar") ? "ar" : "en";

  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getCategories(); // GET /categories
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (mounted) setItems(dedupe(list));
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const data = useMemo(
    () =>
      (items?.length ? items : []).map((it, i) => ({
        id: it?.id,
        img: pickImage(it, i),
        title: pickTranslatedName(it, want),
        // Navigate client-side with query (?category_id=...)
        onClick: () => router.push({ pathname: "/shop/sidebar_popup", query: { category_id: it?.id } }),
      })),
    [items, want, router]
  );

  const fallbackData = useMemo(
    () =>
      FALLBACKS.map((img, i) => ({
        id: `fb-${i}`,
        img: img.src,
        title: ["men", "women", "kids"][i] ?? "—",
        onClick: () => {}, // no-op
      })),
    []
  );

  const renderList = (loading || data.length === 0) ? fallbackData : data.slice(0, 3);

  return (
    <Fragment>
      <section className="p-0 ratio2_1">
        <Container fluid={true}>
          <Row className="category-border">
            {renderList.map((d) => (
              <MasterCategory key={d.id} img={d.img} title={d.title} onClick={d.onClick} />
            ))}
          </Row>
        </Container>
      </section>
    </Fragment>
  );
};

export default CategoryTwo;
