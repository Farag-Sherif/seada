import React from "react";
import { Container } from "reactstrap";
import Link from "@/router/NextLinkCompat";
import { useLanguage } from "../../../helpers/Language/useLanguage";
import StyleTag from "@/styles/StyleTag";

const TopBar = ({ topClass }) => {
  const { t, isRTL } = useLanguage();

  return (
    <div
      id="topHeader"
      className={`tb-light-wrap ${topClass || ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Container>
        <div className="tb-light-row">
          {/* Left — hidden on xs */}
          <div className="tb-light-left d-none d-sm-flex">
            <span className="tb-light-text">{t("topbar_title")}</span>
            <span className="tb-light-sep">·</span>
            <span className="tb-light-text">
              <i className="fa fa-phone me-1" aria-hidden="true" />
              <span className="keep-ltr">{t("call_us")}: 123 - 456 - 7890</span>
            </span>
          </div>

          {/* Right links */}
          <ul className="tb-light-links">
            {/* Compare — desktop only */}
            <li className="d-none d-lg-flex">
              <Link href="/page/compare" className="tb-light-link">
                <i className="fa fa-random me-1" aria-hidden="true" />
                <span>{t("compare")}</span>
              </Link>
            </li>

            {/* Wishlist — hidden xs */}
            <li className="d-none d-sm-flex">
              <Link href="/page/account/wishlist" className="tb-light-link">
                <i className="fa fa-heart me-1" aria-hidden="true" />
                <span className="d-none d-md-inline">{t("wishlist")}</span>
              </Link>
            </li>

            {/* Account */}
            <li className="tb-light-account">
              <span className="tb-light-link tb-light-trigger">
                <i className="fa fa-user me-1" aria-hidden="true" />
                <span className="d-none d-sm-inline">{t("my_account")}</span>
              </span>
              <ul className="tb-light-menu">
                <li><Link href="/page/account/login">{t("login")}</Link></li>
                <li><Link href="/page/account/register">{t("register")}</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </Container>

      <StyleTag global css={`
        .tb-light-wrap {
          background: #f8f8f8;
          border-bottom: 1px solid #ebebeb;
          font-size: 13px;
        }
        .tb-light-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 36px;
          padding: 4px 0;
          gap: 12px;
        }
        .tb-light-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .tb-light-text { color: #555; font-size: 12px; white-space: nowrap; }
        .tb-light-sep  { color: #ccc; }
        .tb-light-links {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
          margin: 0; padding: 0;
          margin-inline-start: auto;
        }
        .tb-light-link {
          display: inline-flex;
          align-items: center;
          color: #444;
          text-decoration: none;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          transition: color 0.2s, background 0.2s;
          cursor: pointer;
        }
        .tb-light-link:hover { color: #000; background: rgba(0,0,0,0.04); }

        /* Account dropdown */
        .tb-light-account { position: relative; }
        .tb-light-trigger  { cursor: pointer; }
        .tb-light-menu {
          display: none;
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 160px;
          background: #fff;
          list-style: none;
          margin: 0; padding: 6px 0;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
          border: 1px solid rgba(0,0,0,0.06);
          z-index: 9999;
        }
        .tb-light-account:hover .tb-light-menu,
        .tb-light-account:focus-within .tb-light-menu { display: block; }
        .tb-light-account::after {
          content: ""; position: absolute;
          top: 100%; right: 0; width: 100%; height: 8px;
          background: transparent;
        }
        .tb-light-menu li a {
          display: block;
          padding: 9px 14px;
          color: #111;
          text-decoration: none;
          font-size: 13px;
          transition: background 0.15s;
        }
        .tb-light-menu li a:hover { background: #f5f5f5; }
        [dir="rtl"] .tb-light-menu { right: auto; left: 0; }

        .keep-ltr { direction: ltr; unicode-bidi: isolate; display: inline-block; }

        @media (max-width: 575.98px) {
          .tb-light-row { justify-content: flex-end; min-height: 30px; }
        }
      `} />
    </div>
  );
};

export default TopBar;