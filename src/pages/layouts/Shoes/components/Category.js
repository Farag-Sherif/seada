import React, { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import { Product5 as Product5Base } from "../../../../services/script";
import { Container, Row, Col } from "reactstrap";
import { getCategories } from "./../../../../actions/categories";
import { useLanguage } from "../../../../helpers/Language/useLanguage";
import { useRouter } from "@/router/useRouter";

import StyleTag from "@/styles/StyleTag";
/* ---------------- helpers ---------------- */

// Pick name from translations based on wanted locale (ar/en), with safe fallbacks
const pickTranslatedName = (item, want = "en") => {
  const translations = Array.isArray(item?.translations) ? item.translations : [];
  const primary = translations.find((t) => t?.locale === want)?.name;
  const fallback = translations.find((t) => t?.locale && t.locale !== want)?.name;
  return primary || fallback || item?.name || "";
};

const inferBaseOrigin = (list) => {
  const url = list?.find(
    (x) => typeof x?.logo_path === "string" && /^https?:\/\//i.test(x.logo_path)
  )?.logo_path;
  try {
    return url ? new URL(url).origin : (typeof window !== "undefined" ? window.location.origin : "");
  } catch {
    return typeof window !== "undefined" ? window.location.origin : "";
  }
};

const toAbsolute = (maybeUrl, baseOrigin) => {
  if (!maybeUrl) return null;
  if (/^https?:\/\//i.test(maybeUrl)) return maybeUrl;
  if (maybeUrl.startsWith("/")) return `${baseOrigin}${maybeUrl}`;
  return `${baseOrigin}/images/${maybeUrl}`;
};

const pickImage = (item, baseOrigin) => {
  if (item?.logo_path) return item.logo_path;
  if (item?.meta?.image_path) return toAbsolute(item.meta.image_path, baseOrigin);
  if (item?.meta?.image) return toAbsolute(item.meta.image, baseOrigin);
  return null;
};

const extractSubs = (cat) => {
  const pools = [cat?.sub_categories, cat?.subCategories, cat?.children, cat?.subs, cat?.sub_cats]
    .filter(Array.isArray);
  return pools[0] || [];
};

const looksLikeFlatSubs = (arr) =>
  Array.isArray(arr) && arr.length > 0 && arr.every((x) => x?.meta?.type === "sub_sub_category");

// Strong de-dupe: prefer id, then slug, else logo_path
const dedupe = (items) => {
  const seen = new Set();
  const out = [];
  for (const it of items || []) {
    const idKey = it?.id != null ? `id:${it.id}` : null;
    const slugKey = it?.slug ? `slug:${String(it.slug).toLowerCase()}` : null;
    const logoKey = it?.logo_path ? `logo:${it.logo_path}` : null;
    const key = idKey || slugKey || logoKey;
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
};

/* ---------------- UI ---------------- */

// Name under the image; navigates with router.push to /shop/sidebar_popup
const Card = ({ img, subName, parentName, featured, linkId, isRTL }) => {
  const router = useRouter();
  const handleNavigate = () => {
    router.push({ pathname: "/shop/sidebar_popup", query: { category_id: linkId } });
  };

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigate();
    }
  };

  return (
    <div
      className="subcat-card"
      dir={isRTL ? "rtl" : "ltr"}
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={handleKey}
    >
      <div className="block-link" aria-label={subName}>
        <div className="thumb">
          <img src={img} alt={subName} loading="lazy" />
        </div>
        <div className="caption">
          <div className="name" title={subName}>{subName}</div>
          {parentName ? <div className="parent" title={parentName}>{parentName}</div> : null}
          {featured ? <span className="chip">★</span> : null}
        </div>
      </div>

      <StyleTag css={`
        .subcat-card { max-width: 160px; margin: 0 auto; padding: 6px; cursor: pointer; }
        .block-link { display: block; text-decoration: none; color: inherit; }
        .thumb { position: relative; width: 100%; padding-top: 100%; border-radius: 12px; overflow: hidden;  }
        .thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .caption { display: grid; grid-template-columns: 1fr auto; gap: 4px 8px; align-items: baseline; padding-top: 8px; }
        .name { grid-column: 1 / 2; font-size: .95rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .parent { grid-column: 1 / 2; font-size: .78rem; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .chip { grid-column: 2 / 3; justify-self: end; font-size: .7rem; line-height: 1; padding: 3px 6px; border-radius: 999px; background: #11a683; color: #fff; }
        @media (min-width: 1400px) { .subcat-card { max-width: 150px; } }
        @media (max-width: 576px) { .subcat-card { max-width: 140px; } }
      `} />
    </div>
  );
};

const Category = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Language context
  const { currentLanguage, isRTL } = useLanguage();
  const want = (currentLanguage || "en").toLowerCase().startsWith("ar") ? "ar" : "en";

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const res = await getCategories();
        const payload = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

        // Build subs; capture parent name (translated) if nested
        let allSubs;
        if (looksLikeFlatSubs(payload)) {
          allSubs = payload.map((s) => ({ ...s, __parentName: "" }));
        } else {
          allSubs = (payload || []).flatMap((cat) => {
            const parentName = pickTranslatedName(cat, want);
            return extractSubs(cat).map((s) => ({
              ...s,
              __parentId: cat?.id,
              __parentName: parentName,
            }));
          });
        }

        const base = inferBaseOrigin(allSubs);
        const deDuped = dedupe(allSubs);

        const mapped = deDuped
          .map((it) => {
            const img = pickImage(it, base);
            const subName = pickTranslatedName(it, want);
            const parentName = it.__parentName || "";
            return {
              id: it?.id ?? it?.slug,
              img,
              subName,
              parentName,
              featured: !!it?.home,
              linkId: it?.id ?? "", // only the id for navigation
            };
          })
          .filter((x) => !!x.img);

        if (mounted) setSubs(mapped);
      } catch {
        if (mounted) setSubs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [currentLanguage, want]);

  const renderList = useMemo(() => subs, [subs]);

  // Turn off react-slick clones to avoid visual duplicates
  const Product5 = { ...Product5Base, infinite: false };

  return (
    <Container>
      <section className="section-b-space border-section border-top-0">
        <Row>
          <Col>
            <Slider {...Product5} className="slide-6 no-arrow">
              {loading && renderList.length === 0
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div className="subcat-card" key={`sk-${i}`}>
                      <div className="thumb">
                        <div style={{ position: "absolute", inset: 0, background: "#f3f3f3" }} />
                      </div>
                    </div>
                  ))
                : renderList.map((d) => (
                    <Card
                      key={d.id}
                      img={d.img}
                      subName={d.subName}
                      parentName={d.parentName}
                      featured={d.featured}
                      linkId={d.linkId}
                      isRTL={isRTL}
                    />
                  ))}
            </Slider>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default Category;
