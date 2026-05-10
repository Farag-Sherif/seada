// components/headers/common/sidebar.jsx
import React, { useEffect, useRef } from "react";
import Link from "@/router/NextLinkCompat";
import { MENUITEMS } from "../../constant/menu";
import { useLanguage } from "../../../helpers/Language/useLanguage";
import StyleTag from "@/styles/StyleTag";

const Chevron = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="sb-caret" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SideBar = () => {
  const { t, isRTL } = useLanguage();
  const panelRef = useRef(null);

  const close = () => document.getElementById("mySidenav")?.classList.remove("open-side");

  // Body scroll lock
  useEffect(() => {
    const root = document.getElementById("mySidenav");
    if (!root) return;
    const observer = new MutationObserver(() => {
      document.body.style.overflow = root.classList.contains("open-side") ? "hidden" : "";
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // ESC key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Click outside
  useEffect(() => {
    const onDown = (e) => {
      const root = document.getElementById("mySidenav");
      if (!root?.classList.contains("open-side")) return;
      if (e.target?.id === "mySidenav") return close();
      if (panelRef.current && !panelRef.current.contains(e.target) && e.target?.id !== "sidebar-hamburger") close();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const toggleGroup = (btn) => {
    const next = btn.nextElementSibling;
    if (!next) return;
    next.classList.toggle("sb-open");
    btn.classList.toggle("sb-open");
  };

  return (
    <>
      <div id="mySidenav" className="sb-root" dir={isRTL ? "rtl" : "ltr"} aria-hidden="true">
        <aside ref={panelRef} className="sb-panel" role="dialog" aria-modal="true">

          {/* Header */}
          <div className="sb-header">
            <span className="sb-title">{t("Menu") || "Menu"}</span>
            <button className="sb-close" onClick={close} aria-label="Close sidebar">×</button>
          </div>

          {/* Nav */}
          <nav className="sb-nav">
            <ul className="sb-list">
              {MENUITEMS.map((item, idx) => (
                <li key={idx} className="sb-item">
                  {item.type === "link" ? (
                    <Link href={item.path} className="sb-link" onClick={close}>
                      {t(item.title)}
                    </Link>
                  ) : (
                    <>
                      <button
                        className="sb-link sb-accordion"
                        onClick={(e) => toggleGroup(e.currentTarget)}
                        aria-expanded="false"
                      >
                        <span>{t(item.title)}</span>
                        <Chevron />
                      </button>

                      {item.children && (
                        <ul className="sb-sublist">
                          {item.children.map((sub, sIdx) => (
                            <li key={sIdx} className="sb-subitem">
                              {sub.type === "link" ? (
                                <Link href={sub.path} className="sb-sublink" onClick={close}>
                                  {t(sub.title) || sub.title}
                                </Link>
                              ) : sub.type === "sub" ? (
                                <>
                                  <button
                                    className="sb-sublink sb-accordion"
                                    onClick={(e) => toggleGroup(e.currentTarget)}
                                    aria-expanded="false"
                                  >
                                    <span>{t(sub.title) || sub.title}</span>
                                    <Chevron />
                                  </button>
                                  {sub.children && (
                                    <ul className="sb-sublist">
                                      {sub.children.map((leaf, lIdx) => (
                                        <li key={lIdx} className="sb-subitem">
                                          {leaf.type === "link" && (
                                            <Link href={leaf.path} className="sb-sublink" onClick={close}>
                                              {t(leaf.title) || leaf.title}
                                            </Link>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      <StyleTag css={`
        .sb-caret { margin-inline-start: auto; flex-shrink: 0; transition: transform .22s ease; }
        .sb-accordion.sb-open .sb-caret { transform: rotate(180deg); }
      `} />

      <StyleTag global css={`
        /* Overlay */
        .sb-root {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.4);
          opacity: 0; visibility: hidden; pointer-events: none;
          transition: opacity .25s, visibility .25s;
          z-index: 1002;
        }
        .sb-root.open-side { opacity: 1; visibility: visible; pointer-events: auto; }

        /* Panel — slides from inline-end (right for LTR, left for RTL) */
        .sb-panel {
          position: absolute;
          top: 0;
          inset-inline-end: 0;
          width: min(85vw, 320px);
          height: 100%;
          background: #fff;
          box-shadow: 0 0 40px rgba(0,0,0,0.18);
          transform: translateX(100%);
          transition: transform .28s cubic-bezier(0.16,1,0.3,1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        [dir="rtl"] .sb-panel { transform: translateX(-100%); }
        .sb-root.open-side .sb-panel { transform: translateX(0); }

        /* Header */
        .sb-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid #f0f0f0;
          flex-shrink: 0;
        }
        .sb-title { font-weight: 700; font-size: 15px; }
        .sb-close {
          font-size: 26px; line-height: 1;
          background: transparent; border: 0;
          padding: 2px 8px; cursor: pointer;
          border-radius: 6px; color: #666;
          transition: background 0.2s, color 0.2s;
        }
        .sb-close:hover { background: #f5f5f5; color: #000; }

        /* Nav scroll */
        .sb-nav { flex: 1; overflow-y: auto; padding: 8px 0 24px; -webkit-overflow-scrolling: touch; }
        .sb-list, .sb-sublist { list-style: none; margin: 0; padding: 0; }
        .sb-item { border-bottom: 1px solid #f4f4f4; }

        /* Links */
        .sb-link, .sb-sublink {
          width: 100%; display: flex; align-items: center;
          padding: 13px 16px;
          background: transparent; border: 0;
          font-size: 14px; font-weight: 600;
          color: #222; text-decoration: none;
          cursor: pointer; text-align: start;
          transition: background 0.15s, color 0.15s;
        }
        .sb-link:hover, .sb-sublink:hover { background: #f9f9f9; color: #0a7d55; }
        .sb-sublink { font-weight: 400; font-size: 13.5px; padding: 10px 24px; color: #444; }

        /* Accordion */
        .sb-sublist {
          max-height: 0; overflow: hidden;
          transition: max-height .28s ease;
          background: #fafafa;
        }
        .sb-sublist.sb-open { max-height: 900px; }
        .sb-subitem { border-top: 1px solid #f0f0f0; }

        /* Responsive widths */
        @media (max-width: 575.98px) {
          .sb-panel { width: min(92vw, 300px); }
        }
        @media (min-width: 992px) {
          /* On desktop the sidebar is hidden by default — only shown if triggered */
          .sb-panel { width: min(60vw, 360px); }
        }
      `} />
    </>
  );
};

export default SideBar;