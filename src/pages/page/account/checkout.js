// pages/page/account/checkout.jsx
import React, { useEffect, useState, useCallback } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import CheckoutPage from "./common/checkout-page";

/** Read current user from localStorage (supports both 'authUser' and legacy 'user') */
function readStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("authUser") ?? localStorage.getItem("user");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : { id: null, name: String(raw) };
  } catch {
    return { id: null, name: String(raw) };
  }
}

const Checkout = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [booted, setBooted] = useState(false);

  const refresh = useCallback(() => setCurrentUser(readStoredUser()), []);

  useEffect(() => {
    // initial read after mount (avoids SSR mismatches)
    refresh();
    setBooted(true);

    // keep in sync across tabs or when your app updates localStorage
    const onStorage = (e) => {
      if (!e || !e.key) return;
      if (e.key === "authUser" || e.key === "user" || e.key === "authToken" || e.key === "Stevia-token") {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);

    // Optional: listen for custom events you can dispatch after login/logout
    const onAuthChanged = () => refresh();
    window.addEventListener("auth:changed", onAuthChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:changed", onAuthChanged);
    };
  }, [refresh]);

  if (!booted) return null;

  const isLoggedIn = !!currentUser;

  return (
    <CommonLayout parent="home" title="checkout">
      {/* Optional banner for guests */}
      {!isLoggedIn && (
        <div className="alert alert-info m-3" role="alert" style={{ margin: '30px auto !important'}}>
          You’re checking out as a <strong>guest</strong>. You can continue without creating an account,
          or <a href="/page/account/login" className="alert-link">log in</a> to save your details.
        </div>
      )}

      {/* Always allow checkout; pass mode + current user if present */}
      <CheckoutPage guest={!isLoggedIn} currentUser={currentUser} />
    </CommonLayout>
  );
};

export default Checkout;
