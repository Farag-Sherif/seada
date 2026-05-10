import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ThemeSettings from "@/components/customizer/theme-settings";
import TapTop from "@/components/common/widgets/Tap-Top";
import CartContextProvider from "@/helpers/cart/CartContext";
import { WishlistContextProvider } from "@/helpers/wishlist/WishlistContext";
import FilterProvider from "@/helpers/filter/FilterProvider";
import SettingProvider from "@/helpers/theme-setting/SettingProvider";
import { CompareContextProvider } from "@/helpers/Compare/CompareContext";
import { CurrencyContextProvider } from "@/helpers/Currency/CurrencyContext";
import { LanguageProvider } from "@/helpers/Language/LanguageProvider";
import { AppProviders } from "@/app/providers/AppProviders";
import { AuthProvider } from "@/state/auth/AuthContext";
import "@/assets/scss/app.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);
  return null;
}

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add("dark");
    const timer = window.setTimeout(() => setIsLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  const url = useMemo(() => {
    const path = location.pathname.split("/").filter(Boolean);
    return path[path.length - 1] || "home";
  }, [location.pathname]);

  return (
    <AppProviders>
      <LanguageProvider>
        <SettingProvider>
          <CompareContextProvider>
            <CurrencyContextProvider>
              <AuthProvider>
                <CartContextProvider>
                  <WishlistContextProvider>
                    <FilterProvider>
                      <Helmet>
                        <title>Bleufleur</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <link rel="icon" href="/assets/images/favicon.ico" />
                      </Helmet>
                      <ScrollToTop />
                      {isLoading ? (
                        <div className="loader-wrapper">
                          {url === "Christmas" ? <div id="preloader"></div> : <div className="loader"></div>}
                        </div>
                      ) : (
                        <>
                          <Outlet />
                          <ThemeSettings />
                          <ToastContainer />
                          <TapTop />
                        </>
                      )}
                    </FilterProvider>
                  </WishlistContextProvider>
                </CartContextProvider>
              </AuthProvider>
            </CurrencyContextProvider>
          </CompareContextProvider>
        </SettingProvider>
      </LanguageProvider>
    </AppProviders>
  );
}