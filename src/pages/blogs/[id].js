import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";

import CommonLayout from "../../components/shop/common-layout";
import { useLanguage } from "../../helpers/Language/useLanguage";
import { getBlog } from "../../actions/main";

/* ---------------- helpers ---------------- */

const trSafe = (t, key, fallback) => {
  try {
    const value = t ? t(key) : "";
    return !value || value === key ? fallback : value;
  } catch {
    return fallback;
  }
};

const pickLocalized = (blog, isRTL) => {
  if (!blog) {
    return {
      title: "",
      content: "",
    };
  }

  const locale = isRTL ? "ar" : "en";

  const translation =
    blog?.translations?.find(
      (item) => item?.locale?.toLowerCase() === locale
    ) ||
    blog?.translations?.find(
      (item) =>
        item?.locale?.toLowerCase() === (locale === "ar" ? "en" : "ar")
    );

  return {
    title: translation?.title || blog?.title || "",
    content: translation?.content || blog?.content || "",
  };
};

const toParagraphs = (text) => {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatDate = (date, locale) => {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
};

/* ---------------- api ---------------- */

async function fetchBlogById(id) {
  try {
    const response = await getBlog(id);

    console.log("BLOG RESPONSE => ", response);

    return response?.data || response || null;
  } catch (error) {
    console.log("FETCH ERROR => ", error);
    return null;
  }
}

/* ---------------- component ---------------- */

export default function BlogDetail() {
  const { id } = useParams();

  const { t, isRTL, currentLanguage } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  /* ------------ blog id ------------ */

  const blogId = useMemo(() => {
    return id;
  }, [id]);

  /* ------------ fetch blog ------------ */

  useEffect(() => {
    let mounted = true;

    if (!blogId) return;

    console.log("BLOG ID => ", blogId);

    setLoading(true);
    setError(null);
    setBlog(null);

    const loadBlog = async () => {
      try {
        const data = await fetchBlogById(blogId);

        if (!mounted) return;

        if (!data) {
          setError("not_found");
          return;
        }

        setBlog(data);
      } catch (err) {
        console.log(err);

        if (!mounted) return;

        setError("load_fail");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadBlog();

    return () => {
      mounted = false;
    };
  }, [blogId]);

  /* ------------ localized data ------------ */

  const localized = useMemo(() => {
    return pickLocalized(blog, isRTL);
  }, [blog, isRTL]);

  const title = localized?.title || "";
  const content = localized?.content || "";

  const paragraphs = toParagraphs(content);

  /* ------------ meta ------------ */

  const locale = currentLanguage === "ar" ? "ar-EG" : "en-US";

  const createdAt = formatDate(blog?.created_at, locale);

  const author =
    blog?.author ||
    blog?.user ||
    (isRTL ? "المدير" : "Admin");

  const hero = blog?.image_path || blog?.image || "";

  /* ---------------- render ---------------- */

  return (
    <CommonLayout
      parent={trSafe(t, "nav.home", "Home")}
      title={trSafe(t, "blog.title", "Blog")}
      subTitle={trSafe(t, "blog.detail", "Blog Detail")}
    >
      <section
        className="blog-detail-page"
        style={{
          padding: "60px 0",
        }}
      >
        <Container>
          <Row>
            <Col
              sm="12"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* loading */}

              {loading && (
                <p
                  style={{
                    color: "#666",
                    fontSize: 16,
                  }}
                >
                  {isRTL ? "جارِ التحميل..." : "Loading..."}
                </p>
              )}

              {/* not found */}

              {!loading && error === "not_found" && (
                <p
                  style={{
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  {isRTL
                    ? "المقال غير موجود"
                    : "Blog not found"}
                </p>
              )}

              {/* load fail */}

              {!loading && error === "load_fail" && (
                <p
                  style={{
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  {isRTL
                    ? "فشل تحميل المقال"
                    : "Failed to load blog"}
                </p>
              )}

              {/* content */}

              {!loading && blog && (
                <>
                  {/* image */}

                  {hero && (
                    <img
                      src={hero}
                      alt={title}
                      className="img-fluid"
                      style={{
                        width: "100%",
                        borderRadius: 16,
                        objectFit: "cover",
                        marginBottom: 30,
                      }}
                    />
                  )}

                  {/* title */}

                  <h1
                    style={{
                      fontWeight: 800,
                      marginBottom: 20,
                      lineHeight: 1.4,
                      color: "#111",
                    }}
                  >
                    {title}
                  </h1>

                  {/* meta */}

                  <ul
                    style={{
                      display: "flex",
                      gap: 20,
                      listStyle: "none",
                      padding: 0,
                      marginBottom: 30,
                      color: "#777",
                      flexWrap: "wrap",
                    }}
                  >
                    {createdAt && (
                      <li>{createdAt}</li>
                    )}

                    <li>
                      {isRTL ? "الناشر:" : "Posted by:"}{" "}
                      <span
                        style={{
                          color: "#111",
                          fontWeight: 600,
                        }}
                      >
                        {author}
                      </span>
                    </li>
                  </ul>

                  {/* paragraphs */}

                  {paragraphs.length > 0 ? (
                    paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        style={{
                          fontSize: 16,
                          lineHeight: 1.9,
                          color: "#444",
                          marginBottom: 20,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p>
                      {isRTL
                        ? "لا يوجد محتوى"
                        : "No content"}
                    </p>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
}