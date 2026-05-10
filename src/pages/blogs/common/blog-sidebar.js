// components/blog/BlogSidebar.js
import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "./../../../helpers/Language/useLanguage";
import { getBlogs } from "./../../../actions/main";

// ترجمة بمفتاح i18n مع fallback
const tr = (t, key, fallback) => {
  try {
    const v = t ? t(key) : "";
    return !v || v === key ? fallback : v;
  } catch {
    return fallback;
  }
};

function pickLocalized(item, currentLanguage) {
  const t =
    item.translations?.find(
      (tr) => tr.locale?.toLowerCase() === currentLanguage.toLowerCase()
    ) || null;
  return {
    title: t?.title ?? item.title,
  };
}

// بدّله للمسار الفعلي عندك (slug أو id)
const getBlogLink = (item) => `#`;

const BlogSidebar = ({ limit = 4 }) => {
  const { t, currentLanguage, isRTL } = useLanguage();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        // لو getBlogs بيرجع Axios response: استبدل res بـ res.data
        const res = await getBlogs({ page: 1, per_page: limit * 2 });
        if (active) setPayload(res);
      } catch (e) {
        if (active) setErr(e?.message || "Failed to load recent blogs");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [limit]);

  const recent = useMemo(() => {
    if (!payload?.data?.length) return [];
    const sorted = [...payload.data].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return sorted.slice(0, limit);
  }, [payload, limit]);

  return (
    <div className="col-xl-3 col-lg-4 col-md-5" dir={isRTL ? "rtl" : "ltr"}>
      <div className="blog-sidebar">
        <div className="theme-card">
          <h4>
            {tr(
              t,
              "blog.recent",
              currentLanguage === "ar" ? "أحدث المقالات" : "Recent Blog"
            )}
          </h4>

          {loading && (
            <p className="my-3">
              {tr(
                t,
                "blog.loading",
                currentLanguage === "ar" ? "جارٍ التحميل…" : "Loading…"
              )}
            </p>
          )}

          {err && (
            <p className="text-danger my-3">
              {tr(
                t,
                "blog.error",
                currentLanguage === "ar"
                  ? "حدث خطأ أثناء تحميل المقالات"
                  : "Failed to load recent blogs"
              )}
            </p>
          )}

          {!loading && !err && (
            <ul className={`recent-blog ${isRTL ? "text-end" : ""}`}>
              {recent.map((item) => {
                const { title } = pickLocalized(item, currentLanguage);
                const created = new Date(item.created_at);
                const day = created.toLocaleDateString(
                  currentLanguage === "ar" ? "ar-EG" : "en-US",
                  { day: "2-digit" }
                );
                const month = created.toLocaleDateString(
                  currentLanguage === "ar" ? "ar-EG" : "en-US",
                  { month: "short" }
                );

                return (
                  <li key={item.id}>
                    <div className="media">
                      <img
                        className="img-fluid blur-up lazyload"
                        src={item.image_path}
                        alt={title}
                        style={{ width: 80, height: 80, objectFit: "cover" }}
                      />
                      <div
                        className={`media-body align-self-center ${
                          isRTL ? "me-3" : "ms-3"
                        }`}
                      >
                        <div className="d-flex align-items-center gap-2 text-muted small">
                          <span className="fw-bold">{day}</span>
                          <span>{month}</span>
                        </div>
                        <a href={getBlogLink(item)}>
                          <h6 className="mt-1 mb-0">{title}</h6>
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
