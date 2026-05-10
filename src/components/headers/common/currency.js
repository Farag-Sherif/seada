import React, { useContext, useState, useCallback, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Media } from "reactstrap";
import language from "../../constant/langConfig.json";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import { useLanguage } from "../../../helpers/Language/useLanguage";
import StyleTag from "@/styles/StyleTag";

const langLabel = (val) => {
  switch ((val || "").toLowerCase()) {
    case "ar": return "العربية";
    case "en": return "English";
    default: return val;
  }
};

function Portal({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

const Currency = ({ icon }) => {
  // ✅ شلنا useQuery و gql — مش محتاجينهم
  useContext(CurrencyContext);
  const { changeLanguage, locale } = useLanguage();

  const [open, setOpen] = useState(false);
  const [hoverable, setHoverable] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, right: 0, dir: "ltr" });

  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const hoverTimer = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia?.("(hover: hover)");
    const set = () => setHoverable(!!mq && mq.matches);
    set();
    mq?.addEventListener?.("change", set);
    return () => mq?.removeEventListener?.("change", set);
  }, []);

  const recalc = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const dir = document.documentElement.getAttribute("dir")?.toLowerCase() || "ltr";
    setPos({ top: r.bottom - 4, left: r.left, right: r.right, dir });
  }, []);

  const openNow = useCallback(() => { setOpen(true); recalc(); }, [recalc]);
  const closeNow = useCallback(() => setOpen(false), []);

  const clearTimer = () => { clearTimeout(hoverTimer.current); hoverTimer.current = null; };
  const scheduleClose = () => { clearTimer(); hoverTimer.current = setTimeout(() => setOpen(false), 160); };

  const onTriggerEnter = () => { if (hoverable) { clearTimer(); openNow(); } };
  const onTriggerLeave = () => { if (hoverable) scheduleClose(); };
  const onPanelEnter = () => { if (hoverable) clearTimer(); };
  const onPanelLeave = () => { if (hoverable) scheduleClose(); };

  const toggleClick = useCallback(() => {
    setOpen((v) => { const nv = !v; if (nv) recalc(); return nv; });
  }, [recalc]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeNow();
    const onDown = (e) => {
      if (!wrapRef.current && !panelRef.current) return;
      if (!wrapRef.current?.contains(e.target) && !panelRef.current?.contains(e.target)) closeNow();
    };
    const onScroll = () => open && recalc();
    const onResize = () => open && recalc();
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown, true);
    window.addEventListener("touchstart", onDown, true);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown, true);
      window.removeEventListener("touchstart", onDown, true);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, closeNow, recalc]);

  useLayoutEffect(() => { if (open) recalc(); }, [open, recalc]);

  return (
    <>
      <li
        ref={wrapRef}
        className="c-lang-li"
        onMouseEnter={onTriggerEnter}
        onMouseLeave={onTriggerLeave}
      >
        <button
          ref={btnRef}
          type="button"
          className="c-lang-btn"
          aria-haspopup="true"
          aria-expanded={open ? "true" : "false"}
          onClick={toggleClick}
          aria-label="Change language"
        >
          <img
            src={typeof icon === "object" ? icon.src : icon}
            className="c-lang-icon"
            alt="settings"
          />
        </button>
      </li>

      {open && (
        <Portal>
          <div
            ref={panelRef}
            className="c-lang-portal"
            role="menu"
            onMouseEnter={onPanelEnter}
            onMouseLeave={onPanelLeave}
            style={{
              position: "fixed",
              zIndex: 100000,
              top: `${pos.top}px`,
              left: pos.dir === "rtl" ? "auto"
                : `${Math.min(Math.max(12, pos.left), Math.max(12, window.innerWidth - 12 - 220))}px`,
              right: pos.dir === "rtl"
                ? `${Math.min(Math.max(12, window.innerWidth - pos.right), Math.max(12, window.innerWidth - 12 - 220))}px`
                : "auto",
              width: "min(220px, 90vw)",
            }}
          >
            <div className="c-lang-panel">
              <div className="c-lang-head">LANGUAGE</div>
              <ul className="c-lang-list">
                {language.map((item, i) => {
                  const active = String(locale).toLowerCase() === String(item.val).toLowerCase();
                  return (
                    <li key={i} className={`c-lang-item ${active ? "active" : ""}`}>
                      <button
                        type="button"
                        role="menuitem"
                        className="c-lang-opt"
                        onClick={() => { changeLanguage(item.val); setOpen(false); }}
                        aria-current={active ? "true" : "false"}
                      >
                        <span className="c-lang-name">{langLabel(item.val)}</span>
                        <span className="c-lang-sub">{item.lang}</span>
                        {active && (
                          <span className="c-lang-check" aria-hidden="true">
                            <i className="fa fa-check" />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Portal>
      )}

      <StyleTag global css={`
        .c-lang-li { list-style: none; display: inline-flex; align-items: center; }
        .c-lang-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 36px; height: 36px;
          background: transparent; border: none;
          border-radius: 8px; cursor: pointer;
          transition: background 0.2s;
        }
        .c-lang-btn:hover { background: rgba(0,0,0,0.05); }
        .c-lang-icon { width: 20px; height: 20px; object-fit: contain; display: block; }
        .c-lang-panel {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 28px rgba(0,0,0,0.12);
        }
        .c-lang-head {
          padding: 8px 12px 6px;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #999;
          border-bottom: 1px solid #f0f0f0;
          background: #fafafa;
        }
        .c-lang-list { list-style: none; margin: 0; padding: 6px; display: flex; flex-direction: column; gap: 3px; }
        .c-lang-item { border-radius: 8px; overflow: hidden; }
        .c-lang-opt {
          width: 100%; display: flex; align-items: center; gap: 8px;
          padding: 7px 10px;
          background: #fff; border: 1px solid rgba(0,0,0,0.06);
          border-radius: 8px; cursor: pointer;
          text-align: start; transition: border-color 0.15s, background 0.15s, transform 0.15s;
        }
        .c-lang-opt:hover { border-color: rgba(0,0,0,0.12); transform: translateY(-1px); }
        .c-lang-item.active .c-lang-opt {
          border-color: rgba(10,125,85,0.35);
          background: rgba(10,125,85,0.04);
        }
        .c-lang-name { font-weight: 700; font-size: 13px; color: #111; }
        .c-lang-sub  { font-size: 11px; color: #888; margin-inline-start: auto; }
        .c-lang-check {
          width: 18px; height: 18px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 50%; background: rgba(10,125,85,0.1);
          color: #0a7d55; font-size: 9px; flex-shrink: 0;
        }
        @media (max-width: 575.98px) {
          .c-lang-btn  { width: 34px; height: 34px; }
          .c-lang-icon { width: 18px; height: 18px; }
        }
      `} />
    </>
  );
};

export default Currency;