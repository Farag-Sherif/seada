import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "@/actions/products";
import { LanguageContext } from "@/helpers/Language/LanguageProvider";

let debounceTimer;

const SearchOverlay = () => {
  const { currentLanguage } = useContext(LanguageContext);
  const isAr = currentLanguage === "ar";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Listen for open event dispatched from the search icon button
  useEffect(() => {
    const handleOpen = () => {
      setQuery("");
      setResults([]);
      setIsOpen(true);
      // double rAF ensures the element is in the DOM before adding .visible
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
          setTimeout(() => inputRef.current?.focus(), 200);
        });
      });
    };

    window.addEventListener("open-search-overlay", handleOpen);
    return () => window.removeEventListener("open-search-overlay", handleOpen);
  }, []);

  // ✅ Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) closeSearch();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const closeSearch = () => {
    setVisible(false);
    setTimeout(() => setIsOpen(false), 400);
  };

  const handleSearch = async (value) => {
    if (!value.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await searchProducts(value);
      setResults(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => handleSearch(value), 400);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    closeSearch();
    navigate(`/page/search?q=${encodeURIComponent(query)}`);
  };

  const goToProduct = (id) => {
    closeSearch();
    navigate(`/product-details/${id}`);
  };

  // ✅ Unmount completely when closed — next open resets everything fresh
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap');

        .so-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 8vh;
          font-family: 'DM Sans', sans-serif;
          direction: ${isAr ? "rtl" : "ltr"};
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .so-overlay.visible { opacity: 1; }
        .so-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(10, 8, 6, 0.82);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }
        .so-panel {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 680px;
          margin: 0 20px;
          transform: translateY(-24px);
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .so-overlay.visible .so-panel { transform: translateY(0); }
        .so-label {
          font-family: 'Playfair Display', serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 18px;
          padding: ${isAr ? "0 4px 0 0" : "0 0 0 4px"};
        }
        .so-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.15);
          padding-bottom: 2px;
          transition: border-color 0.3s;
        }
        .so-input-wrap:focus-within { border-color: rgba(255,255,255,0.55); }
        .so-icon {
          flex-shrink: 0;
          color: rgba(255,255,255,0.4);
          margin-${isAr ? "left" : "right"}: 14px;
          transition: color 0.3s;
        }
        .so-input-wrap:focus-within .so-icon { color: rgba(255,255,255,0.8); }
        .so-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 5vw, 38px);
          font-weight: 500;
          color: #fff;
          caret-color: #d4a96a;
          padding: 8px 0 12px;
          width: 100%;
        }
        .so-input::placeholder { color: rgba(255,255,255,0.18); }
        .so-input::-webkit-search-cancel-button { display: none; }
        .so-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.15);
          border-top-color: #d4a96a;
          border-radius: 50%;
          animation: so-spin 0.7s linear infinite;
          flex-shrink: 0;
          margin-${isAr ? "right" : "left"}: 12px;
        }
        @keyframes so-spin { to { transform: rotate(360deg); } }
        .so-results {
          margin-top: 8px;
          max-height: 360px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .so-results::-webkit-scrollbar { width: 4px; }
        .so-results::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }
        .so-result {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 6px;
          cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: padding-${isAr ? "right" : "left"} 0.25s ease;
          opacity: 0;
          animation: so-fadeSlide 0.3s ease forwards;
        }
        @keyframes so-fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .so-result:hover { padding-${isAr ? "right" : "left"}: 16px; }
        .so-result:last-child { border-bottom: none; }
        .so-result-icon {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: rgba(255,255,255,0.4);
          transition: background 0.2s, color 0.2s;
        }
        .so-result:hover .so-result-icon { background: rgba(212,169,106,0.18); color: #d4a96a; }
        .so-result-title {
          font-size: 15px; font-weight: 400;
          color: rgba(255,255,255,0.8);
          flex: 1;
          transition: color 0.2s;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .so-result:hover .so-result-title { color: #fff; }
        .so-result-arrow {
          color: rgba(255,255,255,0.2);
          flex-shrink: 0;
          transition: color 0.2s, transform 0.2s;
        }
        .so-result:hover .so-result-arrow { color: #d4a96a; transform: translateX(${isAr ? "-" : ""}3px); }
        .so-empty {
          text-align: center;
          padding: 36px 0 20px;
          color: rgba(255,255,255,0.25);
          font-size: 14px;
          letter-spacing: 0.04em;
        }
        .so-hint {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 24px; padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .so-hint-text { font-size: 12px; color: rgba(255,255,255,0.2); letter-spacing: 0.04em; }
        .so-close-btn {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
          font-size: 12px; letter-spacing: 0.06em;
          padding: 6px 14px; border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .so-close-btn:hover { background: rgba(255,255,255,0.13); color: #fff; }
      `}</style>

      <div className={`so-overlay${visible ? " visible" : ""}`}>
        <div className="so-backdrop" onClick={closeSearch} />
        <div className="so-panel">
          <p className="so-label">
            {isAr ? "البحث في المنتجات" : "Product Search"}
          </p>

          <form onSubmit={onSubmit}>
            <div className="so-input-wrap">
              <svg className="so-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7.5" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
              <input
                ref={inputRef}
                className="so-input"
                type="text"
                placeholder={isAr ? "ابحث هنا..." : "Search here..."}
                value={query}
                onChange={onChange}
                autoComplete="off"
              />
              {loading && <div className="so-spinner" />}
            </div>
          </form>


          <div className="so-hint">
            <span className="so-hint-text">
              {isAr ? "اضغط Enter للبحث الكامل" : "Press Enter for full results"}
            </span>
            <button className="so-close-btn" type="button" onClick={closeSearch}>
              {isAr ? "إغلاق  esc" : "esc  close"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;