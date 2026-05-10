// components/blog/BlogList.js
import React, { useEffect, useState } from "react";
import { Row, Col, Media } from "reactstrap";
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

// اختيار العنوان/المحتوى حسب اللغة
function pickLocalized(item, currentLanguage) {
  const t =
    item.translations?.find(
      (tr) => tr.locale?.toLowerCase() === currentLanguage.toLowerCase()
    ) || null;
  return {
    title: t?.title ?? item.title,
    content: t?.content ?? item.content,
  };
}

function makeExcerpt(text, max = 180) {
  const clean = (text || "").replace(/\r?\n+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).trim() + "…";
}

// لو عندك صفحة تفاصيل فعليّة بدّل الرابط هنا
const getBlogLink = (item) => `#`;

const BlogList = () => {
  const { t, currentLanguage, isRTL } = useLanguage();
  const [page] = useState(1);
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
const getBlogLink = (item) => {
  if (item?.slug) return `/blogs/${item.slug}`;
  if (item?.id) return `/blogs/${item.id}`;
  return `#`;
};

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        // ملاحظة: لو getBlogs بيرجع AxiosResponse استخدم res.data بدل res
        const res = await getBlogs({ page, per_page: 5 });
        if (active) setPayload(res);
      } catch (e) {
        if (active)
          setErr(
            tr(
              t,
              "blog.error",
              currentLanguage === "ar"
                ? "حدث خطأ أثناء تحميل المقالات"
                : "Failed to load blogs"
            )
          );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [page, t, currentLanguage]);

  if (loading)
    return (
      <p className="text-center my-4">
        {tr(
          t,
          "blog.loading",
          currentLanguage === "ar" ? "جارٍ التحميل…" : "Loading blogs…"
        )}
      </p>
    );

  if (err)
    return (
      <p className="text-center text-danger my-4">
        {err ||
          tr(
            t,
            "blog.error",
            currentLanguage === "ar"
              ? "حدث خطأ أثناء تحميل المقالات"
              : "Failed to load blogs"
          )}
      </p>
    );

  if (!payload || !payload.data || payload.data.length === 0)
    return (
      <p className="text-center my-4">
        {tr(
          t,
          "blog.empty",
          currentLanguage === "ar" ? "لا توجد مقالات" : "No blog posts."
        )}
      </p>
    );

  const posts = payload.data;

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {posts.map((item) => {
        const { title, content } = pickLocalized(item, currentLanguage);
        const shortDesc = makeExcerpt(content, 160);
        const dateStr = new Date(item.created_at).toLocaleDateString(
          currentLanguage === "ar" ? "ar-EG" : "en-US",
          { year: "numeric", month: "long", day: "2-digit" }
        );

        const Left = (
          <Col xl="5" >
            <div className="blog-left">
              <a href={getBlogLink(item)}>
                <Media
                  src={item.image_path}
                  className="img-fluid blur-up lazyload bg-img"
                  alt={title}
                  style={{ height: "350px",width:'100%',objectFit:'cover' }}
                />
              </a>
            </div>
          </Col>
        );

        const Right = (
          <Col xl="6">
            <div className="blog-right">
              <div>
                <h6>{dateStr}</h6>
                <a href={getBlogLink(item)}>
                  <h4>{title}</h4>
                </a>
                <ul className="post-social">
                  <li >
                    {tr(
                      t,
                      "blog.postedBy",
                      currentLanguage === "ar"
                        ? "الناشر: المدير"
                        : "Posted By : Admin"
                    )}
                  </li>
                  <li>
                    <i className="fa fa-comments" aria-hidden="true" />{" "}
                    {tr(
                      t,
                      "blog.commentsCount",
                      currentLanguage === "ar" ? "0 تعليق" : "0 Comment"
                    )}
                  </li>
                </ul>
                <p>{shortDesc}</p>
                {/* <a href={getBlogLink(item)} className="btn btn-link p-0">
                  {tr(
                    t,
                    "blog.readMore",
                    currentLanguage === "ar" ? "اقرأ المزيد" : "Read more"
                  )}
                </a> */}
              </div>
            </div>
          </Col>
        );

        return (
          <Row className={`blog-media ${isRTL ? "text-end" : ""}`} key={item.id}>
            {currentLanguage === 'en' ? (
              <>
                {Left}
                {Right}
              </>
            ) : (
              <>
                 {Left}
                {Right}
              </>
            )}
          </Row>
        );
      })}

      {/*
      // Pagination example (فعّل لو محتاج):
      <div className={`d-flex justify-content-${isRTL ? "start" : "end"} gap-2 mt-4`}>
        <button
          className="btn btn-outline-secondary"
          disabled={!payload.prev_page_url}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          {tr(t, "blog.prev", isRTL ? "السابق" : "Prev")}
        </button>
        <button
          className="btn btn-primary"
          disabled={!payload.next_page_url}
          onClick={() => setPage((p) => p + 1))}
        >
          {tr(t, "blog.next", isRTL ? "التالي" : "Next")}
        </button>
      </div>
      */}
    </div>
  );
};

export default BlogList;
