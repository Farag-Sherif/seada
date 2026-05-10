import Link from "@/router/NextLinkCompat";
import { useRouter } from "@/router/useRouter";
import { useLanguage } from "../../../helpers/Language/useLanguage";
import StyleTag from "@/styles/StyleTag";
import { useState, useEffect } from "react";

export default function MobileBottomBar() {
  const router = useRouter();
  const { isRTL, t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authUser = localStorage.getItem("authUser");
      const authToken = localStorage.getItem("authToken");
      setIsLoggedIn(!!(authUser && authToken));
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChanged", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  const isActive = (href) => router?.pathname?.startsWith(href);

  const accountHref = isLoggedIn
    ? "/page/account/dashboard"
    : "/page/account/login-auth";

  return (
    <>
      <nav className="mobile-bottom-bar d-lg-none" role="navigation" aria-label="Mobile quick actions">
        <Link
          href="/"
          className={`mbb-item ${isActive("/") ? "active" : ""}`}
          aria-label={t("home") || "Home"}
        >
          <i className="fa fa-home" aria-hidden="true" />
          <span className="mbb-label">{t("home") || "Home"}</span>
        </Link>

        <Link
          href="/page/account/wishlist"
          className={`mbb-item ${isActive("/page/account/wishlist") ? "active" : ""}`}
          aria-label={t("wishlist") || "Wishlist"}
        >
          <i className="fa fa-heart" aria-hidden="true" />
          <span className="mbb-label">{t("wishlist") || "Wishlist"}</span>
        </Link>

        <Link
          href="/page/account/cart"
          className={`mbb-item ${isActive("/page/account/cart") ? "active" : ""}`}
          aria-label={t("cart") || "Cart"}
        >
          <i className="fa fa-shopping-cart" aria-hidden="true" />
          <span className="mbb-label">{t("cart") || "Cart"}</span>
        </Link>

        <Link
          href={accountHref}
          className={`mbb-item ${isActive("/page/account") ? "active" : ""}`}
          aria-label={t("my_account") || "Account"}
        >
          <i className="fa fa-user" aria-hidden="true" />
          <span className="mbb-label">{t("my_account") || "Account"}</span>
        </Link>
      </nav>

      <StyleTag global css={`
        @media (max-width: 991.98px) {
          body { padding-bottom: calc(56px + env(safe-area-inset-bottom, 0)); }
        }
      `} />

      <StyleTag css={`
        .mobile-bottom-bar {
          position: fixed;
          z-index: 10000;
          left: 0;
          right: 0;
          bottom: 0;
          height: 56px;
          padding-bottom: env(safe-area-inset-bottom, 0);
          background: #fff;
          border-top: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 -6px 18px rgba(0,0,0,0.06);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          align-items: center;
          text-align: center;
        }
        .mbb-item {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          height: 100%;
          color: #111;
          text-decoration: none !important;
          font-size: 11px;
        }
        .mbb-item i {
          font-size: 18px;
          line-height: 1;
        }
        .mbb-item.active,
        .mbb-item:hover { color: #0a7d55; }
        .mbb-label { font-size: 10px; }
        [dir="rtl"] .mobile-bottom-bar { direction: rtl; }
      `} />
    </>
  );
}