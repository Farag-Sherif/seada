import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Container, Row, Col } from "reactstrap";
import Link from "@/router/NextLinkCompat";
import { useRouter } from "@/router/useRouter";
import { useLanguage } from "../../../helpers/Language/useLanguage";
import { logout } from "../../../actions/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StyleTag from "@/styles/StyleTag";
const STORAGE_USER_KEY = "authUser";
const STORAGE_TOKEN_KEY = "authToken";

const TopBarDark = ({ topClass, fluid }) => {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const [apiError, setApiError] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const readAuth = () => {
      try {
        const userStr =
          typeof window !== "undefined" ? localStorage.getItem(STORAGE_USER_KEY) : null;
        const token =
          typeof window !== "undefined" ? localStorage.getItem(STORAGE_TOKEN_KEY) : null;

        let parsedUser = null;
        if (userStr) {
          try {
            parsedUser = JSON.parse(userStr);
          } catch {
            parsedUser = null;
          }
        }

        setAuthUser(parsedUser);
        setHasToken(Boolean(token));
      } catch {
        setAuthUser(null);
        setHasToken(false);
      }
    };

    readAuth();

    const onStorage = (e) => {
      if (!e.key || [STORAGE_USER_KEY, STORAGE_TOKEN_KEY].includes(e.key)) {
        readAuth();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const displayName = useMemo(() => {
    const u = authUser || {};
    const pieces = [
      u.name,
      u.fullName,
      [u.fname, u.lname].filter(Boolean).join(" ").trim(),
      [u.first_name, u.last_name].filter(Boolean).join(" ").trim(),
      u.username,
      u.email,
    ].filter((s) => s && String(s).trim().length > 0);

    return pieces.length ? String(pieces[0]).trim() : null;
  }, [authUser]);

  const isLoggedIn = Boolean(displayName) || hasToken;

  const Logout = useCallback(async () => {
    setApiError(null);
    try {
      const res = await logout().catch(() => null);
      const success = !res || res?.status === "success";

      try {
        localStorage.removeItem(STORAGE_USER_KEY);
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem("user"); // legacy
      } catch {}

      setAuthUser(null);
      setHasToken(false);

      if (success) {
        toast.success(t("logout_success") || "Logged out successfully", {
          theme: "colored",
          position: isRTL ? "top-left" : "top-right",
        });
        setTimeout(() => router.push("/page/account/login-auth"), 600);
      } else {
        const msg =
          res?.message ||
          (typeof res?.error === "string" && res.error) ||
          (res?.errors && Object.values(res.errors).flat().join(" ")) ||
          t("logout_failed") ||
          "Logout failed.";
        setApiError(msg);
        toast.error(msg, {
          theme: "colored",
          position: isRTL ? "top-left" : "top-right",
        });
        setTimeout(() => router.push("/page/account/login-auth"), 900);
      }
    } catch (err) {
      const msg = err?.message || t("common_something_wrong") || "Something went wrong.";
      setApiError(msg);
      try {
        localStorage.removeItem(STORAGE_USER_KEY);
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem("user");
      } catch {}
      toast.error(msg, {
        theme: "colored",
        position: isRTL ? "top-left" : "top-right",
      });
      setTimeout(() => router.push("/page/account/login-auth"), 900);
    }
  }, [router, isRTL, t]);



  return (
    <div className={topClass} style={{ zIndex: 100000000000000, position: "relative" }}>
      
      <Container fluid={fluid}>
        <Row>
          <Col lg="6">
            <div className="header-contact">
              <ul>
                <li className="text-white">{t("topbar_title")}</li>
                <li className="text-white">
                  <i className="fa fa-phone text-white" aria-hidden="true" />
                  {/* 🟢 ثبّت الاتجاه LTR لرقم الهاتف */}
                  <span className="keep-ltr"> 123 - 456 - 7890</span>
                </li>
              </ul>
            </div>
          </Col>

          <Col lg="6" className="text-end">
            <ul className="header-dropdown">
              <li className="mobile-wishlist text-white">
                <Link href="/page/account/wishlist" className="text-white">
                  <i className="fa fa-heart" aria-hidden="true" /> {t("wishlist")}
                </Link>
              </li>
              <li className="mobile-cart text-white">
               <Link href="/page/account/cart">
               <i className="fa fa-shopping-cart" aria-hidden="true" /> {t("cart")}
               </Link>  

              </li>
              {/* Account Menu */}
              <li className="onhover-dropdown mobile-account tb-account text-white">
                <span className="tb-trigger">
                  <i className="fa fa-user" aria-hidden="true" />{" "}
                  {isLoggedIn ? (displayName || t("my_account")) : t("my_account")}
                  {/* <i className="fa fa-angle-down ms-1" aria-hidden="true" /> */}
                </span>

                <ul className="onhover-show-div tb-menu">
                  {isLoggedIn ? (
                    <>
                      <li style={{ pointerEvents: "none", opacity: 0.9 }}>
                        <a>
                          <i className="fa fa-id-badge" aria-hidden="true" />{" "}
                          {displayName || t("my_account")}
                        </a>
                      </li>
                      <li onClick={Logout}>
                        <a>
                          <i className="fa fa-sign-out" aria-hidden="true" /> {t("logout")}
                        </a>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link href={`/page/account/login`}>
                          <i className="fa fa-sign-in" aria-hidden="true" /> {t("login")}
                        </Link>
                      </li>
                      <li>
                        <Link href={`/page/account/register`}>
                          <i className="fa fa-user-plus" aria-hidden="true" /> {t("register")}
                        </Link>
                      </li>
                    </>
                  )}
                </ul>

                {/* 🧹 ستايلات موحّدة (أزلت التكرار) */}
                <StyleTag global css={`
                  .tb-account {
                    position: relative;
                  }
                  .tb-account .tb-trigger {
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    user-select: none;
                    position: relative;
                    z-index: 2;
                  }
                  .tb-account .tb-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    left: auto;
                    min-width: 200px;
                    z-index: 1200;
                    display: none;
                    padding: 6px 0;
                    margin-top: 2px;
                    background: #fff;
                    color: #111;
                    border: 1px solid rgba(0, 0, 0, 0.06);
                    border-radius: 10px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                    pointer-events: auto;
                  }
                  .tb-account:hover .tb-menu,
                  .tb-account:focus-within .tb-menu,
                  .tb-account .tb-menu:hover {
                    display: block;
                  }
                  .tb-account::after {
                    content: "";
                    position: absolute;
                    top: 100%;
                    right: 0;
                    width: 100%;
                    height: 8px;
                    background: transparent;
                  }
                  .tb-account .tb-menu > li {
                    list-style: none;
                  }
                  .tb-account .tb-menu > li > a,
                  .tb-account .tb-menu > li > a:visited,
                  .tb-account .tb-menu > li > a:active,
                  .tb-account .tb-menu > li > a:link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    width: 100%;
                    padding: 10px 14px;
                    color: #111;
                    text-decoration: none !important;
                    white-space: nowrap;
                  }
                  .tb-account .tb-menu > li > a:hover {
                    background: #f7f7f7;
                  }
                  [dir="rtl"] .tb-account .tb-menu {
                    right: auto;
                    left: 0;
                    text-align: right;
                  }

                  /* 🟢 ثبات اتجاه رقم الهاتف */
                  .keep-ltr {
                    direction: ltr !important;
                    unicode-bidi: isolate; /* يمنع تأثير الـ RTL المحيط */
                    display: inline-block;
                    margin-inline-start: 6px;
                  }
                  [dir="rtl"] .keep-ltr {
                    text-align: left;
                  }
                `} />
              </li>
           

            </ul>

            {apiError ? (
              <div
                style={{
                  color: "#ffd3d3",
                  fontSize: 12,
                  marginTop: 6,
                  textAlign: isRTL ? "left" : "right",
                }}
              >
                {apiError}
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TopBarDark;
