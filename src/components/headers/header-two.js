// components/headers/HeaderTwo.jsx
import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";

import cart from "@/assets/images/icon/cart.png";
import search from "@/assets/images/icon/search.png";
import settings from "@/assets/images/icon/setting.png";

import TopBar from "./common/topbar-dark";
import NavBar from "./common/navbar";
import SideBar from "./common/sidebar";
import Cart from "../containers/Cart";
import CartContainer from "../containers/CartContainer";
import LogoImage from "./common/logo";
import Currency from "./common/currency";
import SearchOverlay from "./common/search-overlay";
import MobileBottomBar from "./common/mobileBottomBar";
import StyleTag from "@/styles/StyleTag";

const HeaderTwo = ({ logoName, headerClass, topClass, direction }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Hide loaders
    const timer = setTimeout(() => {
      document.querySelectorAll(".loader-wrapper")
        .forEach((el) => (el.style.display = "none"));
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const openSearch = () => window.dispatchEvent(new Event("open-search-overlay"));

  return (
    <div>
      <header className={`h2-header ${headerClass || ""} ${scrolled ? "h2-scrolled" : ""}`}>
        {/* Top bar — hidden on xs/sm */}
        <div className="d-none d-md-block">
          <TopBar topClass={topClass} />
        </div>

        {/* Main row */}
        <div className="h2-main">
          <Container>
            <div className="h2-row">

              {/* Hamburger — mobile/tablet only */}
              <button
                className="h2-hamburger d-lg-none"
                id="sidebar-hamburger"
                type="button"
                onClick={() => document.getElementById("mySidenav")?.classList.toggle("open-side")}
                aria-label="Toggle menu"
              >
                <span /><span /><span />
              </button>

              {/* Logo */}
              <a href="/" className="h2-logo" aria-label="Home">
                <LogoImage logo={logoName} />
              </a>

              {/* Desktop nav */}
              <nav className="h2-desktop-nav d-none d-lg-flex">
                <NavBar />
              </nav>

              {/* Actions */}
              <ul className="h2-actions">
                <li>
                  <button className="h2-icon-btn" type="button" onClick={openSearch} aria-label="Search">
                    <img src={search.src || search} alt="" className="h2-icon-img" />
                  </button>
                </li>
                <li className="d-none d-md-flex align-items-center">
                  <Currency icon={settings} />
                </li>
                <li>
                  {direction === undefined
                    ? <CartContainer icon={cart.src || cart} />
                    : <Cart icon={cart} layout={direction} />}
                </li>
              </ul>

            </div>
          </Container>
        </div>
      </header>

      {/* Mobile bottom bar replaces bottom nav on small screens */}
      <MobileBottomBar />

      <SearchOverlay />
      <SideBar />

      <StyleTag global css={`
        .h2-header {
          position: sticky;
          top: 0;
          z-index: 1002;
          background: #fff;
          transition: box-shadow 0.3s;
        }
        .h2-header.h2-scrolled {
          box-shadow: 0 2px 16px rgba(0,0,0,0.10);
        }
        .h2-main { width: 100%; }
        .h2-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          min-height: 60px;
        }

        /* Logo */
        .h2-logo { display: inline-flex; align-items: center; flex-shrink: 0; text-decoration: none; }
        .h2-logo img { height: 56px; width: auto; }

        @media (max-width: 575.98px)              { .h2-logo img { height: 38px; } .h2-row { min-height: 52px; } }
        @media (min-width: 576px) and (max-width: 767.98px)  { .h2-logo img { height: 44px; } }
        @media (min-width: 768px) and (max-width: 991.98px)  { .h2-logo img { height: 50px; } }

        /* Desktop nav */
        .h2-desktop-nav { flex: 1; margin: 0 12px; overflow: visible; }

        /* Actions */
        .h2-actions {
          list-style: none; margin: 0; padding: 0;
          display: flex; align-items: center; gap: 2px;
          margin-inline-start: auto;
        }

        /* Icon button */
        .h2-icon-btn {
          width: 40px; height: 40px;
          display: inline-flex; align-items: center; justify-content: center;
          background: transparent; border: none; border-radius: 10px;
          cursor: pointer; transition: background 0.2s;
        }
        .h2-icon-btn:hover { background: rgba(0,0,0,0.05); }
        .h2-icon-img { width: 20px; height: 20px; object-fit: contain; display: block; }
        @media (max-width: 575.98px) {
          .h2-icon-btn { width: 34px; height: 34px; }
          .h2-icon-img { width: 17px; height: 17px; }
        }

        /* Hamburger */
        .h2-hamburger {
          display: inline-flex; flex-direction: column; justify-content: center; gap: 5px;
          width: 40px; height: 40px; padding: 9px;
          background: transparent; border: none; border-radius: 8px;
          cursor: pointer; flex-shrink: 0; transition: background 0.2s;
        }
        .h2-hamburger:hover { background: rgba(0,0,0,0.05); }
        .h2-hamburger span { display: block; height: 2px; background: #333; border-radius: 2px; }
        @media (max-width: 575.98px) {
          .h2-hamburger { width: 34px; height: 34px; padding: 8px; }
        }
      `} />
    </div>
  );
};

export default HeaderTwo;