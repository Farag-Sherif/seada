// components/footers/common/MasterFooter.js
import React, { useEffect, useMemo, useState } from "react";
import Link from "@/router/NextLinkCompat";
import {
  Container,
  Row,
  Col,
  Form,
  Input,
  Button,
  Collapse,
} from "reactstrap";
import LogoImage from "../../headers/common/logo";
import CopyRight from "./copyright";
import { useLanguage } from "../../../helpers/Language/useLanguage";
import {
  sendContact,
  getSocialLinks,
  getSettings,
  getPhone,
  getEmail,
  getAddress,
} from "../../../actions/main";
import { getCategories } from "../../../actions/categories";
import { getProducts } from "../../../actions/products";
import { MENUITEMS } from "../../constant/menu";
// 👇 unified toast helpers
import { notify } from "../../../helpers/toast";

import StyleTag from "@/styles/StyleTag";
/* ---------------- i18n helpers ---------------- */
const tr = (t, key, fallback) => {
  try {
    const v = t ? t(key) : "";
    return !v || v === key ? fallback : v;
  } catch {
    return fallback;
  }
};

// Read from settings like AboutUs page
const pickTrFromSettings = (settings, isRTL, key) => {
  if (!settings) return undefined;
  const trans = Array.isArray(settings?.translations) ? settings.translations : [];
  const m =
    trans.find((x) => x?.locale === (isRTL ? "ar" : "en")) ||
    trans.find((x) => x?.locale && x.locale !== (isRTL ? "ar" : "en"));
  return (m && m[key]) || settings[key];
};

// Category helpers (mirroring your Category component’s logic)
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
    return url
      ? new URL(url).origin
      : typeof window !== "undefined"
      ? window.location.origin
      : "";
  } catch {
    return typeof window !== "undefined" ? window.location.origin : "";
  }
};

const extractSubs = (cat) => {
  const pools = [cat?.sub_categories, cat?.subCategories, cat?.children, cat?.subs, cat?.sub_cats]
    .filter(Array.isArray);
  return pools[0] || [];
};

const looksLikeFlatSubs = (arr) =>
  Array.isArray(arr) && arr.length > 0 && arr.every((x) => x?.meta?.type === "sub_sub_category");

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

/* ---------------- contact normalizers ---------------- */
const asArray = (res) =>
  Array.isArray(res)
    ? res
    : Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
    ? res.data.data
    : [];

const pickStr = (v) =>
  typeof v === "string"
    ? v
    : v == null
    ? ""
    : String(v?.value ?? v?.name ?? v?.title ?? v?.text ?? "");

const extractPhone = (x) => pickStr(x?.mobile ?? x?.phone ?? x?.number ?? x);
const extractEmail = (x) => pickStr(x?.email ?? x?.mail ?? x?.value ?? x);
const extractAddress = (x) =>
  pickStr(
    x?.full_address ??
      x?.address ??
      [x?.street, x?.city, x?.country, x?.zip].filter(Boolean).join(", ")
  );

const coalesce = (...vals) => vals.find((v) => v !== undefined && v !== null && v !== "");

// =========================================================

const MasterFooter = ({
  containerFluid,
  logoName,
  layoutClass,
  footerClass,
  footerLayOut,
  footerSection,
  belowSection,
  belowContainerFluid,
  CopyRightFluid,
  newLatter,
}) => {
  const { t, isRTL, currentLanguage } = useLanguage();
  const locale = isRTL ? "ar" : "en";
  const want = (currentLanguage || "en").toLowerCase().startsWith("ar") ? "ar" : "en";

  // Collapse + responsive
  const [isOpen, setIsOpen] = useState(false);
  const [collapse, setCollapse] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const applyByWidth = () => {
      const mobile = window.innerWidth <= 767;
      setIsMobile(mobile);
      setIsOpen(!mobile); // open on desktop, closed on mobile
      if (mobile) setCollapse(0);
    };
    applyByWidth();
    window.addEventListener("resize", applyByWidth);
    return () => window.removeEventListener("resize", applyByWidth);
  }, []);

  // Newsletter
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState(null);

  const onNewsletterSubmit = async (e) => {
    e.preventDefault();

    const emailRequired = tr(
      t,
      "footer.emailRequired",
      isRTL ? "برجاء إدخال البريد الإلكتروني" : "Please enter your email"
    );
    const subscribingText = tr(
      t,
      "footer.subscribing",
      isRTL ? "جارٍ الاشتراك..." : "Subscribing..."
    );
    const subscribedText = tr(
      t,
      "footer.subscribed",
      isRTL ? "تم الاشتراك بنجاح" : "Subscribed successfully"
    );
    const subscribeFailedText = tr(
      t,
      "footer.subscribeFailed",
      isRTL ? "فشل الاشتراك، حاول مرة أخرى." : "Subscription failed, please try again."
    );

    if (!email) {
      setStatus({ ok: false, msg: emailRequired });
      notify.error(emailRequired);
      return;
    }

    setPending(true);
    setStatus(null);

    try {
      await notify.promise(
        sendContact({
          name: "Newsletter Subscriber",
          email,
          subject: "Newsletter Signup",
          message: `Please subscribe this email: ${email}`,
        }),
        {
          pending: subscribingText,
          success: subscribedText,
          error: subscribeFailedText,
        }
      );

      setStatus({ ok: true, msg: subscribedText });
      setEmail("");
    } catch {
      setStatus({ ok: false, msg: subscribeFailedText });
    } finally {
      setPending(false);
    }
  };

  // -------- Settings + socials + ABOUT section data --------
  const [appSettings, setAppSettings] = useState(null);
  const [aboutBlob, setAboutBlob] = useState({
    subTitle: "",
    title: "",
    intro: "",
  });
  const [socials, setSocials] = useState([]);
  const [socialsLoading, setSocialsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await getSettings?.();
        const settings = res?.settings ?? res ?? null;
        if (mounted && settings) {
          setAppSettings(settings);

          // About fields (mirroring AboutUs)
          const subTitle =
            pickTrFromSettings(settings, isRTL, "about_section_sub_title") ||
            (isRTL ? "من نحن" : "About Us");
          const title =
            pickTrFromSettings(settings, isRTL, "about_section_title") ||
            tr(t, "welcome_multi_store", isRTL ? "مرحباً بكم" : "Welcome");
          const intro =
            pickTrFromSettings(settings, isRTL, "about_section_introduction") ||
            pickTrFromSettings(settings, isRTL, "about_us") ||
            tr(
              t,
              "lorem_about_text",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            );
          setAboutBlob({ subTitle, title, intro });

          // Socials (prefer from settings first)
          const sFromSettings =
            (Array.isArray(settings?.socials) && settings.socials) ||
            (Array.isArray(settings?.socails) && settings.socails) ||
            (Array.isArray(settings?.social_links) && settings.social_links) ||
            [];
          if (sFromSettings.length) {
            setSocials(sFromSettings);
          } else {
            const resSL = await getSocialLinks?.();
            if (mounted && Array.isArray(resSL)) setSocials(resSL);
          }
        } else {
          const resSL = await getSocialLinks?.();
          if (mounted && Array.isArray(resSL)) setSocials(resSL);
        }
      } catch {
        // proceed without
      } finally {
        if (mounted) setSocialsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isRTL, t]);

  // -------- Categories (follow Category component logic) --------
  const [footerCategories, setFooterCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingCats(true);
      try {
        const res = await getCategories?.().catch(() => null);
        const payload = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

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

        // Fallback to products if needed
        if (!Array.isArray(allSubs) || allSubs.length === 0) {
          const proRes = await getProducts?.({ page: 1, per_page: 50 }).catch(() => null);
          const items =
            (Array.isArray(proRes?.data) && proRes.data) ||
            (Array.isArray(proRes?.items) && proRes.items) ||
            [];
          const cats = [];
          const seen = new Set();
          items.forEach((it) => {
            const cat = it?.category || it?.cafe;
            if (!cat) return;
            if (!cat.slug || seen.has(cat.slug)) return;
            seen.add(cat.slug);
            cats.push({ ...cat, __parentName: "" });
          });
          allSubs = cats;
        }

        inferBaseOrigin(allSubs); // kept from previous logic (no direct use)
        const deDuped = dedupe(allSubs);

        const mapped = deDuped
          .map((it) => {
            const label = pickTranslatedName(it, want);
            const slug = it?.slug || it?.id;
            return {
              id: it?.id ?? slug,
              slug: slug,
              label: label || (isRTL ? "بدون عنوان" : "Untitled"),
            };
          })
          .slice(0, 12);

        if (mounted) setFooterCategories(mapped);
      } catch {
        if (mounted) setFooterCategories([]);
      } finally {
        if (mounted) setLoadingCats(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [want, isRTL]);

  const footerNavItems = useMemo(() => {
    const wantKeys = new Set(["menu.home", "menu.aboutUs", "menu.shop", "menu.contact"]);
    const out = [];
    const add = (it) => {
      if (!it) return;
      out.push({ titleKey: it.titleKey, title: it.title, path: it.path });
    };
    MENUITEMS.forEach((m) => {
      if (wantKeys.has(m.titleKey) && m.type === "link") add(m);
      if (Array.isArray(m.children)) {
        m.children.forEach((c) => {
          if (wantKeys.has(c.titleKey) && c.type === "link") add(c);
        });
      }
    });
    return out;
  }, []);

  /* -------- Contact info -------- */
  const [phones, setPhones] = useState([]);
  const [emails, setEmails] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [ph, em, ad] = await Promise.all([
          getPhone?.().catch(() => null),
          getEmail?.().catch(() => null),
          getAddress?.().catch(() => null),
        ]);
        if (!alive) return;
        setPhones(asArray(ph).map(extractPhone).filter(Boolean));
        setEmails(asArray(em).map(extractEmail).filter(Boolean));
        setAddresses(asArray(ad).map(extractAddress).filter(Boolean));
      } catch {
        // silent
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const storeBlob =
    appSettings?.store ||
    appSettings?.settings ||
    appSettings?.data ||
    appSettings ||
    {};

  const storeAddress =
    addresses[0] ||
    coalesce(
      storeBlob?.address,
      storeBlob?.location,
      storeBlob?.store_address,
      storeBlob?.contact_address
    ) ||
    tr(t, "footer.storeAddress", "Multikart Demo Store");

  const storePhone =
    phones[0] ||
    coalesce(
      storeBlob?.phone,
      storeBlob?.mobile,
      storeBlob?.contact_phone,
      storeBlob?.support_phone
    ) ||
    tr(t, "footer.callUs", "Call us: 123-456-789");

  const storeEmail =
    emails[0] ||
    coalesce(storeBlob?.email, storeBlob?.contact_email, storeBlob?.support_email) ||
    "Support@Fiot.com";

  const storeAddress2 = addresses[1] || "";
  const storePhone2 = phones[1] || "";
  const storeEmail2 = emails[1] || "";

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <footer className={footerClass}>
        {/* Newsletter */}
        {newLatter ? (
          <div className={footerLayOut}>
            <Container fluid={containerFluid || ""}>
              <section className={footerSection}>
                <Row className={`${isRTL ? "text-end" : "text-start"}`}>
                  <Col lg="6">
                    <div className="subscribe" style={{ textAlign: isRTL ? "right" : "left" }}>
                      <div>
                        <h4>
                          {tr(
                            t,
                            "footer.knowFirst",
                            t?.("know_it_all_first") || (isRTL ? "كن أول من يعرف" : "Know it all first")
                          )}
                        </h4>
                        <p>
                          {tr(
                            t,
                            "footer.newsletterDescription",
                            t?.("newsletter_desc") ||
                              (isRTL
                                ? "اشترك ليصلك كل جديد عن العروض والمنتجات."
                                : "Subscribe to get updates on offers and products.")
                          )}
                        </p>
                      </div>
                    </div>
                  </Col>

                  <Col lg="6">
                    <Form
                      className="form-inline subscribe-form"
                      style={{ direction: isRTL ? "rtl" : "ltr" }}
                      onSubmit={onNewsletterSubmit}
                      noValidate
                    >
                      <div className={`${isRTL ? "mx-sm-0 me-sm-3" : "mx-sm-3"}`}>
                        <Input
                          type="email"
                          className="form-control"
                          id="newsletterEmail"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={tr(
                            t,
                            "footer.enterEmail",
                            t?.("enter_your_email") ||
                              (isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email")
                          )}
                          style={{
                            textAlign: isRTL ? "right" : "left",
                            marginLeft: isRTL ? "16px" : "",
                          }}
                          required
                        />
                      </div>
                      <Button type="submit" className="btn btn-solid" disabled={pending}>
                        {pending
                          ? tr(t, "footer.subscribing", isRTL ? "جارٍ الاشتراك..." : "Subscribing...")
                          : tr(t, "footer.subscribe", t?.("subscribe") || (isRTL ? "اشترك" : "Subscribe"))}
                      </Button>
                    </Form>

                    {status && (
                      <div
                        className={`mt-2 ${status.ok ? "text-success" : "text-danger"}`}
                        style={{ textAlign: isRTL ? "right" : "left" }}
                        aria-live="polite"
                      >
                        {status.msg}
                      </div>
                    )}
                  </Col>
                </Row>
              </section>
            </Container>
          </div>
        ) : (
          ""
        )}

        {/* Below sections */}
        <section className={belowSection}>
          <Container fluid={belowContainerFluid || ""}>
            <Row className="footer-theme partition-f">
              {/* Who we are / About */}
              <Col lg="4" md="6">
                <Collapse isOpen={isMobile ? (collapse === 1 ? isOpen : false) : true}>
                  <div
                    className="footer-contant"
                    style={{
                      direction: isRTL ? "rtl" : "ltr",
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    <div className="footer-logo">
                      <LogoImage logo={logoName} />
                    </div>
                    <p className="about-intro" style={{ marginTop: 6 }}>{aboutBlob.intro}</p>

                    {/* Socials */}
                    <div className="footer-social">
                      <ul>
                        {socialsLoading && (
                          <li style={{ opacity: 0.6 }}>
                            <span>{isRTL ? "جاري التحميل..." : "Loading..."}</span>
                          </li>
                        )}
                        {!socialsLoading &&
                          socials?.map((s, i) => (
                            <li key={s?.id || i}>
                              <a
                                href={s?.url || s?.link || "#"}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`social-${s?.id || i}`}
                              >
                                {s?.icon_path || s?.icon ? (
                                  <img
                                    src={s.icon_path || s.icon}
                                    alt="social"
                                    width={22}
                                    height={22}
                                    style={{ display: "inline-block" }}
                                  />
                                ) : (
                                  <i className="fa fa-external-link" aria-hidden="true" />
                                )}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </Collapse>
              </Col>

              {/* CATEGORIES */}
              <Col className="offset-xl-1">
                <div className="sub-title">
                  <div className={`footer-title ${isOpen && collapse === 2 ? "active" : ""}`}>
                    <h4
                      onClick={() => {
                        if (isMobile) {
                          setIsOpen(!isOpen);
                          setCollapse(2);
                        } else setIsOpen(true);
                      }}
                    >
                      {tr(t, "footer.categories", t?.("category") || (isRTL ? "الفئات" : "Categories"))}
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse isOpen={isMobile ? (collapse === 2 ? isOpen : false) : true}>
                    <div
                      className="footer-contant"
                      style={{
                        direction: isRTL ? "rtl" : "ltr",
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      <ul>
                        {!loadingCats && footerCategories.length === 0 && (
                          <li style={{ opacity: 0.7 }}>
                            {isRTL ? "لا توجد فئات متاحة حالياً" : "No categories available right now"}
                          </li>
                        )}
                        {footerCategories.map((cat) => (
                          <li key={cat.id || cat.slug}>
                            <Link href={`/shop/sidebar_popup?category_id=${encodeURIComponent(cat.id || "")}`}>
                              {cat.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Collapse>
                </div>
              </Col>

              {/* Quick Links */}
              <Col>
                <div className="sub-title">
                  <div className={`footer-title ${isOpen && collapse === 3 ? "active" : ""}`}>
                    <h4
                      onClick={() => {
                        if (isMobile) {
                          setIsOpen(!isOpen);
                          setCollapse(3);
                        } else setIsOpen(true);
                      }}
                    >
                      {tr(t, "footer.quickLinks", isRTL ? "روابط سريعة" : "Quick Links")}
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse isOpen={isMobile ? (collapse === 3 ? isOpen : false) : true}>
                    <div
                      className="footer-contant"
                      style={{
                        direction: isRTL ? "rtl" : "ltr",
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      <ul>
                        {footerNavItems.map((it, idx) => (
                          <li key={idx}>
                            <Link href={it.path}>{tr(t, it.titleKey, it.title)}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Collapse>
                </div>
              </Col>

              {/* Store information */}
              <Col>
                <div className="sub-title">
                  <div className={`footer-title ${isOpen && collapse === 4 ? "active" : ""}`}>
                    <h4
                      onClick={() => {
                        if (isMobile) {
                          setIsOpen(!isOpen);
                          setCollapse(4);
                        } else setIsOpen(true);
                      }}
                    >
                      {tr(t, "footer.storeInformation", t?.("store_information") || "store information")}
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse isOpen={isMobile ? (collapse === 4 ? isOpen : false) : true}>
                    <div
                      className="footer-contant"
                      style={{
                        direction: isRTL ? "rtl" : "ltr",
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      <ul className="contact-list">
                        <li>
                          <i className="fa fa-map-marker" aria-hidden="true"></i>{" "}
                          <span>{storeAddress}</span>
                          {storeAddress2 ? <div style={{ opacity: 0.85 }}>{storeAddress2}</div> : null}
                        </li>
                        <li>
                          <i className="fa fa-phone" aria-hidden="true"></i>{" "}
                          <span>{storePhone}</span>
                          {storePhone2 ? <div style={{ opacity: 0.85 }}>{storePhone2}</div> : null}
                        </li>
                        <li>
                          <i className="fa fa-envelope-o" aria-hidden="true"></i>{" "}
                          {tr(t, "footer.emailUs", t?.("email_us") || (isRTL ? "راسلنا:" : "Email us:"))}{" "}
                          <a href={`mailto:${storeEmail}`}>{storeEmail}</a>
                          {storeEmail2 ? (
                            <div style={{ opacity: 0.85 }}>
                              {tr(t, "footer.altEmail", isRTL ? "بريد بديل:" : "Alt:")}{" "}
                              <a href={`mailto:${storeEmail2}`}>{storeEmail2}</a>
                            </div>
                          ) : null}
                        </li>
                      </ul>
                    </div>
                  </Collapse>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <CopyRight layout={layoutClass} fluid={CopyRightFluid || ""} />
        <StyleTag css={`
  .about-intro{
    margin-top: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 3;   /* 👈 two lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.6;
  }
`} />
      </footer>
    </div>
  );
};

export default MasterFooter;
