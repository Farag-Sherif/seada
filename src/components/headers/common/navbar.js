// components/headers/common/navbar.jsx
import React, { useState, useEffect, useMemo } from "react";
import Link from "@/router/NextLinkCompat";
import { MENUITEMS } from "../../constant/menu";
import { Container, Row } from "reactstrap";
import { useLanguage } from "../../../helpers/Language/useLanguage";
import { useRouter } from "@/router/useRouter";
import StyleTag from "@/styles/StyleTag";

const ChevronRight = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" style={{ flexShrink: 0, marginInlineStart: 4 }}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function readAuthUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("authUser") ?? localStorage.getItem("user") ?? localStorage.getItem("authToken");
  if (!raw) return null;
  try { return (raw.startsWith("{") || raw.startsWith("[")) ? JSON.parse(raw) : raw; } catch { return null; }
}

const HIDE_WHEN_LOGGED_OUT = new Set([
  "/page/account/dashboard", "/page/account/forget_password",
  "/page/account/forget-pwd", "/page/account/profile",
]);

function filterMenuByAuth(items, isLoggedIn) {
  const recurse = (arr) => arr.map((it) => {
    if (!isLoggedIn && it.path && HIDE_WHEN_LOGGED_OUT.has(it.path)) return null;
    if (Array.isArray(it.children) && it.children.length) {
      const kids = recurse(it.children);
      if (!kids.length && (it.type === "sub" || it.megaMenu)) return null;
      return { ...it, children: kids };
    }
    return it;
  }).filter(Boolean);
  return recurse(items);
}

const NavBar = ({ onOpenSidebar }) => {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!readAuthUser());
    const onStorage = (e) => {
      if (["authUser", "user", "authToken"].includes(e.key)) setIsLoggedIn(!!readAuthUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const VISIBLE_MENU = useMemo(() => filterMenuByAuth(MENUITEMS, isLoggedIn), [isLoggedIn]);
  const tt = (k) => t(k) || k;

  const handleMegaSubmenu = (event) => {
    if (event.target.classList.contains("sub-arrow")) return;
    const content = event.target.parentNode.nextElementSibling;
    if (!content) return;
    if (content.classList.contains("opensubmegamenu")) content.classList.remove("opensubmegamenu");
    else {
      document.querySelectorAll(".menu-content").forEach((el) => el.classList.remove("opensubmegamenu"));
      content.classList.add("opensubmegamenu");
    }
  };

  return (
    <div className="nb-wrap" dir={isRTL ? "rtl" : "ltr"}>
      {/* Desktop only — mobile nav is handled by sidebar + bottom bar */}
      <ul className="nb-list">
        {VISIBLE_MENU.map((menuItem, i) => (
          <li
            key={i}
            className={`nb-item ${menuItem.megaMenu ? "nb-mega" : ""}`}
            onMouseEnter={(e) => e.currentTarget.classList.add("nb-open")}
            onMouseLeave={(e) => e.currentTarget.classList.remove("nb-open")}
          >
            {menuItem.type === "link" ? (
              <Link href={menuItem.path} className="nb-link">{tt(menuItem.title)}</Link>
            ) : (
              <a className="nb-link nb-has-sub">
                {tt(menuItem.title)}
                <span className="nb-arrow" aria-hidden="true" />
              </a>
            )}

            {/* Regular dropdown */}
            {menuItem.children && !menuItem.megaMenu && (
              <ul className="nb-dropdown">
                {menuItem.children.map((child, ci) => (
                  <li key={ci} className={`nb-dropdown-item ${child.children ? "nb-has-children" : ""}`}>
                    {child.type === "sub" ? (
                      <a className="nb-dropdown-link nb-sub-trigger">
                        <span>{tt(child.title)}</span>
                        {child.tag === "new" && <span className="nb-tag-new">New</span>}
                        <ChevronRight />
                      </a>
                    ) : (
                      <Link href={child.path || "/"} className="nb-dropdown-link">
                        <span>{tt(child.title)}</span>
                        {child.tag === "new" && <span className="nb-tag-new">New</span>}
                      </Link>
                    )}
                    {child.children && (
                      <ul className="nb-dropdown nb-sub-dropdown">
                        {child.children.map((leaf, li) => (
                          <li key={li}>
                            {leaf.type === "link" && (
                              <Link href={leaf.path} className="nb-dropdown-link">
                                {tt(leaf.title)}
                                {leaf.tag === "new" && <span className="nb-tag-new">New</span>}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Mega menu */}
            {menuItem.megaMenu && menuItem.children && (
              <div className="nb-mega-panel">
                <Container>
                  <Row>
                    {menuItem.children.map((col, ci) => (
                      <div
                        key={ci}
                        className={
                          menuItem.megaMenuType === "small" ? "col mega-box"
                            : menuItem.megaMenuType === "medium" ? "col-lg-3"
                              : "col"
                        }
                      >
                        <div className="nb-mega-col">
                          <h6 className="nb-mega-title" onClick={handleMegaSubmenu}>
                            {tt(col.title)}
                          </h6>
                          <ul className="nb-mega-list">
                            {col.children?.map((sub, si) => (
                              <li key={si}>
                                <Link href={sub.path} className="nb-mega-link">{tt(sub.title)}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </Row>
                </Container>
              </div>
            )}
          </li>
        ))}
      </ul>

      <StyleTag css={`
        /* Desktop nav list */
        .nb-wrap { width: 100%; }
        .nb-list {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0;
          list-style: none;
          margin: 0; padding: 0;
        }

        /* Nav item */
        .nb-item { position: relative; }
        .nb-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 500;
          color: #222;
          text-decoration: none;
          white-space: nowrap;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
          cursor: pointer;
        }
        .nb-link:hover, .nb-item.nb-open > .nb-link { color: #0a7d55; }

        /* Arrow */
        .nb-arrow {
          display: inline-block;
          width: 0; height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid currentColor;
          margin-inline-start: 4px;
          opacity: 0.5;
          transition: transform 0.2s;
        }
        .nb-item.nb-open .nb-arrow { transform: rotate(180deg); }

        /* Dropdown */
        .nb-dropdown {
          display: none;
          position: absolute;
          top: calc(100% + 4px);
          inset-inline-start: 0;
          min-width: 200px;
          background: #fff;
          list-style: none;
          margin: 0; padding: 6px 0;
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          border: 1px solid rgba(0,0,0,0.06);
          z-index: 9000;
        }
        .nb-item.nb-open > .nb-dropdown { display: block; }

        .nb-dropdown-item { position: relative; }
        .nb-dropdown-item:hover > .nb-sub-dropdown { display: block; }

        .nb-dropdown-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 16px;
          color: #333;
          text-decoration: none;
          font-size: 13.5px;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .nb-dropdown-link:hover { background: #f7f7f7; color: #0a7d55; }

        /* Sub dropdown */
        .nb-sub-dropdown {
          top: -6px;
          inset-inline-start: 100%;
          inset-inline-end: auto;
        }

        /* New tag */
        .nb-tag-new {
          font-size: 10px;
          font-weight: 700;
          background: #0a7d55;
          color: #fff;
          padding: 1px 5px;
          border-radius: 4px;
          margin-inline-start: 6px;
          text-transform: uppercase;
        }

        /* Mega menu panel */
        .nb-mega-panel {
          display: none;
          position: absolute;
          top: calc(100% + 4px);
          inset-inline-start: 0;
          width: 100vw;
          max-width: 900px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          border: 1px solid rgba(0,0,0,0.06);
          padding: 20px 0;
          z-index: 9000;
        }
        .nb-item.nb-open > .nb-mega-panel { display: block; }
        .nb-mega-col { padding: 0 16px; }
        .nb-mega-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 10px;
          cursor: pointer;
        }
        .nb-mega-list { list-style: none; margin: 0; padding: 0; }
        .nb-mega-link {
          display: block;
          padding: 5px 0;
          color: #333;
          font-size: 13.5px;
          text-decoration: none;
          transition: color 0.15s;
        }
        .nb-mega-link:hover { color: #0a7d55; }

        /* RTL */
        [dir="rtl"] .nb-sub-dropdown {
          inset-inline-start: auto;
          inset-inline-end: 100%;
        }
      `} />
    </div>
  );
};

export default NavBar;