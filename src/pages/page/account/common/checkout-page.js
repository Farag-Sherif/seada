import React, { useContext, useEffect, useMemo, useState } from "react";
import { Container, Form, Row, Col, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { useRouter } from "@/router/useRouter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// contexts
import CartContext from "../../../../helpers/cart";
import { CurrencyContext } from "../../../../helpers/Currency/CurrencyContext";
import { useLanguage } from "../../../../helpers/Language/useLanguage";

// actions
import {
  checkout as checkoutAuth,
  checkoutGuest,
  removeAllFromCart,
} from "../../../../actions/cart";
import { getAddresses, getAddress } from "../../../../actions/auth";
import { getCities, getCity } from "../../../../actions/main";

/* =============================
   Styles & tiny helpers
============================= */
const BRAND = "#0b6b37";
const brandText = { color: BRAND, fontSize: 18, margin: 0 };
const brandBtn = { backgroundColor: BRAND, borderColor: BRAND, color: "#fff" };
const brandChipBorder = (selected) => ({
  userSelect: "none",
  borderColor: selected ? BRAND : "#ced4da",
  boxShadow: selected ? "0 0 0 2px rgba(11,107,55,0.12)" : "none",
});

const errText = (e) => (typeof e === "string" ? e : e?.message || "");

function readAuthUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("authUser") ?? localStorage.getItem("user");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : { name: String(raw) };
  } catch {
    return { name: String(raw) };
  }
}
function readCartFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("cartList");
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function asCheckoutItem(it) {
  const id =
    it?.item_id ??
    it?.item?.id ??
    it?.variant_id ??
    it?.variation_id ??
    it?.product_item_id ??
    it?.product?.item_id ??
    it?.id ??
    it?.product_id ??
    it?.product?.id ??
    null;
  let qty = Number(it?.qty ?? it?.quantity ?? 1);
  qty = Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 1;
  const weight = it?.size_id ?? it?.weight ?? "";
  return id ? { item_id: id, qty, weight } : null;
}

/* =============================
   Cities & States normalization
============================= */
/**
 * ✅ الآن نُخرج فقط المدن/المحافظات في القائمة — لا نُسطّح الـ states مطلقًا.
 * - Shape A: city_en / city_ar + shipping_price
 * - Shape B: Governorate with translations (states قد تكون موجودة — لكن لا نضيفها للقائمة)
 */
function normalizeCities(raw) {
  const list =
    (Array.isArray(raw?.data) && raw.data) || (Array.isArray(raw) && raw) || [];
  const out = [];
  for (const item of list) {
    // Shape A: flat city with shipping_price
    if (
      (typeof item.city_en === "string" || typeof item.city_ar === "string") &&
      (typeof item.shipping_price === "number" ||
        typeof item.shipping_price === "string")
    ) {
      out.push({
        id: item.id,
        city_en: item.city_en || "",
        city_ar: item.city_ar || item.city_en || "",
        shipping_price: Number(item.shipping_price) || 0,
      });
      continue;
    }
    // Shape B: governorate with translations (states ignored in dropdown)
    const govEn =
      item?.name ||
      item?.translations?.find?.((t) => t.locale === "en")?.name ||
      "";
    const govAr =
      item?.translations?.find?.((t) => t.locale === "ar")?.name || govEn;
    const govTax = Number(item?.delivery_tax || 0);

    out.push({
      id: item?.id,
      city_en: govEn,
      city_ar: govAr,
      shipping_price: govTax,
    });
  }
  return out;
}
const getCityLabel = (c, isRTL) =>
  isRTL ? c.city_ar || c.city_en : c.city_en || c.city_ar;

const normState = (raw) => {
  if (!raw) return null;
  const en =
    raw?.name ||
    raw?.translations?.find?.((t) => t.locale === "en")?.name ||
    "";
  const ar =
    raw?.translations?.find?.((t) => t.locale === "ar")?.name || en;
  const tax = Number(raw?.delivery_tax ?? 0);
  return { id: raw?.id, city_id: raw?.city_id, name_en: en, name_ar: ar, delivery_tax: tax };
};
const labelOfState = (st, isRTL) =>
  isRTL ? st?.name_ar || st?.name_en : st?.name_en || st?.name_ar;

/* =============================
   Address card
============================= */
function AddressCard({ addr, selected, onSelect, t }) {
  const label =
    [addr?.f_name, addr?.l_name].filter(Boolean).join(" ") ||
    addr?.name ||
    t("savedAddress");
  const line = [addr?.city, addr?.state].filter(Boolean).join(", ");
  return (
    <label
      className="d-block p-3 rounded border mb-3 cursor-pointer"
      style={brandChipBorder(selected)}
    >
      <input
        type="radio"
        name="address_id"
        value={addr?.id}
        checked={!!selected}
        onChange={() => onSelect(addr?.id)}
        className="me-2"
        style={{ accentColor: BRAND }}
      />
      <strong style={{ padding: "0 5px" }}>{label}</strong>
      <div className="text-muted small mt-1">{addr?.email || ""}</div>
      <div className="text-muted small">{addr?.phone || addr?.home_phone || ""}</div>
      <div className="text-muted small">
        {addr?.address || ""}
        {line ? `, ${line}` : ""}
        {addr?.pincode ? `, ${addr.pincode}` : ""}
      </div>
    </label>
  );
}

/* =============================
   Main component
============================= */
export default function CheckoutPage() {
  const router = useRouter();
  const lang = useLanguage?.() || {};
  const isRTL = !!(lang.isRTL || lang.isRtl || lang.rtl);

  const STR = {
    en: {
      billingDetails: "Billing Details",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone",
      email: "Email Address",
      street: "Street",
      country: "Country",
      city: "City",
      state: "State",
      postalCode: "Postal Code",
      reqFirstName: "First name is required",
      reqLastName: "Last name is required",
      reqPhone: "Please enter a valid phone.",
      reqEmail: "Please enter a valid email address.",
      reqStreet: "Please enter your street.",
      reqCountry: "Country is required",
      reqCity: "City is required",
      reqState: "State is required",
      digitsOnly: "Digits only",
      product: "Product",
      subtotal: "Subtotal",
      shipping: "Shipping",
      total: "Total",
      cod: "Cash on Delivery",
      placeOrder: "Place Order",
      placing: "Placing…",
      orderPlaced: "Order placed successfully.",
      checkoutFailed: "Checkout failed.",
      selectCity: "Select city",
      savedAddress: "Saved Address",
      useSaved: "Use one of my saved addresses",
      manageAddresses: "Manage addresses",
      loadingAddresses: "Loading addresses…",
      noSaved: "No saved addresses found. Uncheck above to checkout as guest.",
      selectNeighborhood: "Select neighborhood",
      notes: "Notes",
      notesPh: "Notes (optional)",
      noStates: "This city has no neighborhoods. Please choose another city.",
    },
    ar: {
      billingDetails: "بيانات الفواتير",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      street: "الشارع",
      country: "الدولة",
      city: "المدينة",
      state: "الولاية",
      postalCode: "الرمز البريدي",
      reqFirstName: "الاسم الأول مطلوب",
      reqLastName: "اسم العائلة مطلوب",
      reqPhone: "يرجى إدخال رقم هاتف صالح.",
      reqEmail: "يرجى إدخال بريد إلكتروني صالح.",
      reqStreet: "يرجى إدخال الشارع.",
      reqCountry: "الدولة مطلوبة",
      reqCity: "المدينة مطلوبة",
      reqState: "حقل الولاية/الحي مطلوب",
      digitsOnly: "أرقام فقط",
      product: "المنتج",
      subtotal: "الإجمالي الفرعي",
      shipping: "الشحن",
      total: "الإجمالي",
      cod: "الدفع عند الاستلام",
      placeOrder: "إتمام الطلب",
      placing: "جارٍ التنفيذ…",
      orderPlaced: "تم تنفيذ الطلب بنجاح.",
      checkoutFailed: "فشل تنفيذ الطلب.",
      selectCity: "اختر المدينة",
      savedAddress: "عنوان محفوظ",
      useSaved: "استخدام أحد عناويني المحفوظة",
      manageAddresses: "إدارة العناوين",
      loadingAddresses: "جارٍ تحميل العناوين…",
      noSaved:
        "لا توجد عناوين محفوظة. ألغِ التحديد أعلاه لإتمام الشراء كضيف.",
      selectNeighborhood: "اختر الحي",
      notes: "ملاحظات",
      notesPh: "ملاحظات (اختياري)",
      noStates: "لا توجد أحياء/مناطق لهذه المدينة. اختر مدينة أخرى.",
    },
  };
  const t = (key) => (isRTL ? STR.ar[key] : STR.en[key]);

  const cartContext = useContext(CartContext);
  const cartItems = cartContext?.state || [];
  const cartTotal = cartContext?.cartTotal || 0;

  const curContext = useContext(CurrencyContext);
  const symbol = curContext?.state?.symbol || "£";

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);

  const authUser = useMemo(() => readAuthUser(), []);
  const isLoggedIn = !!authUser;

  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  const [cityList, setCityList] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [stateList, setStateList] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");

  const [shippingCost, setShippingCost] = useState(0);

  const [cityStatesError, setCityStatesError] = useState(""); // ✅ رسالة خطأ عند عدم وجود states

  const hasItems =
    (cartItems && cartItems.length > 0) || readCartFromStorage().length > 0;

  /* ===== load addresses if logged in ===== */
  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!isLoggedIn) return;
      setAddressesLoading(true);
      try {
        const resp = await getAddresses();
        const list =
          Array.isArray(resp) ? resp :
          Array.isArray(resp?.addresses) ? resp.addresses :
          Array.isArray(resp?.data) ? resp.data : [];
        if (!ignore) {
          setAddresses(list);
          if (list.length > 0) {
            setUseSavedAddress(true);
            setSelectedAddressId(list[0]?.id ?? null);
          } else {
            setUseSavedAddress(false);
          }
        }
      } catch {
        if (!ignore) { setAddresses([]); setUseSavedAddress(false); }
      } finally {
        if (!ignore) setAddressesLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [isLoggedIn]);

  /* ===== load cities (dropdown shows cities only) ===== */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await getCities();
        const normalized = normalizeCities(raw); // ✅ لا نضمّن states
        if (!alive) return;
        setCityList(normalized);
      } catch {
        if (alive) setCityList([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  /* ===== recompute shipping when city or state changes ===== */
  useEffect(() => {
    async function calc() {
      if (!selectedCityId) { setShippingCost(0); return; }

      // لو المدينة بلا states، لا نحسب شحن (أو اتركه 0 إن ده منطقك)
      if (stateList.length === 0) {
        setShippingCost(0);
        return;
      }

      // إذا الحي/المنطقة المختارة لها ضريبة
      if (selectedStateId && stateList.length) {
        const st = stateList.find((s) => String(s.id) === String(selectedStateId));
        if (st && Number.isFinite(st.delivery_tax) && st.delivery_tax >= 0) {
          setShippingCost(Number(st.delivery_tax));
          return;
        }
      }

      // وإلا استخدم ضريبة المدينة إن رغبت
      try {
        const city = await getCity(selectedCityId);
        const cityTax = Number(city?.delivery_tax ?? city?.data?.delivery_tax ?? 0);
        setShippingCost(Number.isFinite(cityTax) ? cityTax : 0);
      } catch { setShippingCost(0); }
    }
    calc();
  }, [selectedCityId, selectedStateId, stateList]);

  const grandTotal = useMemo(
    () => Number(cartTotal) + Number(shippingCost || 0),
    [cartTotal, shippingCost]
  );

  const buildGuestCartArray = () => {
    const base = cartItems.length ? cartItems : readCartFromStorage();
    return base.map(asCheckoutItem).filter(Boolean);
  };

  async function runGuestCheckout(data) {
    const cartArray = buildGuestCartArray();
    if (!cartArray.length) throw new Error(t("checkoutFailed"));

    const payload = {
      f_name: data.first_name,
      l_name: data.last_name,
      email: data.email,
      phone: data.phone,
      street: data.street || "",
      country: data.country || "",
      city: String(selectedCityId || ""), // city ID
      state: stateList.length ? String(selectedStateId || "") : (data.state || ""), // state ID if exists
      zip: data.zip || "",
      notes: data.notes || "",
      cart: cartArray,
    };

    const resp = await checkoutGuest(payload);
    if (resp?.status === "success" || resp?.data?.status === "success") return resp;
    throw new Error((resp && (resp.message || resp.error)) || t("checkoutFailed"));
  }

  async function runAuthCheckout(address_id) {
    try {
      const res = await checkoutAuth({ address_id, type: "cod", notes: "" });
      if (res?.status === "success" || res?.data?.status === "success") return res;
      throw new Error(res?.message || res?.error || "address_id failed");
    } catch (e) {
      let selected = null;
      try {
        const r = await getAddress(address_id);
        selected =
          (r?.data && (Array.isArray(r.data) ? r.data.find((a) => String(a?.id) === String(address_id)) : r.data)) ||
          r?.address ||
          (r && typeof r === "object" ? r : null);
      } catch {}

      if (!selected) {
        selected = addresses.find((a) => String(a?.id) === String(address_id)) || null;
      }
      if (!selected) throw e;

      const cartArray = (cartItems.length ? cartItems : readCartFromStorage())
        .map(asCheckoutItem)
        .filter(Boolean);
      if (!cartArray.length) throw new Error(t("checkoutFailed"));

      const cityValue = selected?.city_id ?? selected?.city ?? selected?.city_name ?? "";
      const stateValue = selected?.state_id ?? selected?.state ?? selected?.state_name ?? "";

      const payload = {
        f_name: selected?.f_name || selected?.fname || selected?.first_name || "",
        l_name: selected?.l_name || selected?.lname || selected?.last_name || "",
        email: selected?.email || "",
        phone: selected?.phone || selected?.mobile || "",
        street: selected?.street || selected?.address || selected?.address1 || "",
        country: selected?.country || "",
        city: String(cityValue || ""),
        state: String(stateValue || ""),
        zip: selected?.postal_code || selected?.zip || "",
        notes: "",
        cart: cartArray,
      };

      const fallback = await checkoutGuest(payload);
      if (fallback?.status === "success" || fallback?.data?.status === "success") return fallback;

      throw new Error(
        errText(e) || fallback?.message || fallback?.error || t("checkoutFailed")
      );
    }
  }

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (!hasItems) return;

    setApiError(null);
    setApiSuccess(null);
    setSubmitting(true);

    try {
      // Auth flow using saved address
      if (isLoggedIn && useSavedAddress) {
        if (!selectedAddressId) {
          const msg = t("noSaved");
          setApiError(msg);
          toast.error(msg, { theme: "light" });
          setSubmitting(false);
          return;
        }

        await runAuthCheckout(selectedAddressId);

        setApiSuccess(t("orderPlaced"));
        toast.success(t("orderPlaced"), { theme: "light", autoClose: 2200 });
        try { await removeAllFromCart(); } catch {}
        try {
          localStorage.removeItem("cartList");
          localStorage.removeItem("wishlist");
          localStorage.removeItem("compare");
          if (cartContext?.clearCart) cartContext.clearCart();
          if (cartContext?.setState) cartContext.setState([]);
        } catch {}
        router.push({ pathname: "/page/order-success", query: { total: String(grandTotal) } });
        return;
      }

      // Guest flow checks
      if (!selectedCityId) {
        toast.error(t("reqCity"), { theme: "light" });
        setSubmitting(false);
        return;
      }
      // لو المدينة المختارة لا تحتوي أحياء => امنع الإتمام
      if (selectedCityId && stateList.length === 0) {
        toast.error(t("noStates"), { theme: "light" });
        setSubmitting(false);
        return;
      }
      if (stateList.length > 0 && !selectedStateId) {
        toast.error(t("reqState"), { theme: "light" });
        setSubmitting(false);
        return;
      }

      await runGuestCheckout(data);

      setApiSuccess(t("orderPlaced"));
      toast.success(t("orderPlaced"), { theme: "light", autoClose: 2200 });
      try { await removeAllFromCart(); } catch {}
      try {
        localStorage.removeItem("cartList");
        localStorage.removeItem("wishlist");
        localStorage.removeItem("compare");
        if (cartContext?.clearCart) cartContext.clearCart();
        if (cartContext?.setState) cartContext.setState([]);
      } catch {}
      router.push({ pathname: "/page/order-success", query: { total: String(grandTotal) } });
    } catch (err) {
      const msg = err?.message || t("checkoutFailed");
      setApiError(msg);
      toast.error(msg, { theme: "light" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="section-b-space"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ textAlign: isRTL ? "right" : "left" }}
    >
      <ToastContainer position="top-right" newestOnTop theme="light" />
      <Container className="py-4 py-md-5">
        <div className="checkout-page">
          <div className="checkout-form">
            {apiError ? <Alert color="danger" className="mb-4">{apiError}</Alert> : null}
            {apiSuccess ? <Alert color="success" className="mb-4">{apiSuccess}</Alert> : null}

            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Row className="g-4 g-md-5">
                <Col lg="6" sm="12">
                  <div className="checkout-title mb-3 mb-md-4">
                    <h3 style={brandText} className="fs-4 fw-semibold mb-0">
                      {t("billingDetails")}
                    </h3>
                  </div>

                  {isLoggedIn && (
                    <div className="mb-4 p-3 p-md-4 rounded border">
                      <div
                        className="d-flex align-items-center justify-content-between flex-wrap"
                        style={{ gap: 12 }}
                      >
                        <label className="mb-0" style={brandText}>
                          <input
                            type="checkbox"
                            className={isRTL ? "ms-2" : "me-2"}
                            checked={useSavedAddress}
                            onChange={(e) => setUseSavedAddress(e.target.checked)}
                            disabled={addressesLoading || addresses.length === 0}
                            style={{ accentColor: BRAND }}
                          />
                          {t("useSaved")}
                        </label>
                        <a
                          href="/page/account/dashboard"
                          className="small fw-semibold"
                          style={brandText}
                        >
                          {t("manageAddresses")}
                        </a>
                      </div>

                      {useSavedAddress && (
                        <div className="mt-3">
                          {addressesLoading ? (
                            <div className="text-muted small">{t("loadingAddresses")}</div>
                          ) : addresses.length > 0 ? (
                            addresses.map((a) => (
                              <AddressCard
                                key={a.id}
                                addr={a}
                                selected={String(selectedAddressId) === String(a.id)}
                                onSelect={setSelectedAddressId}
                                t={t}
                              />
                            ))
                          ) : (
                            <div className="text-muted small">{t("noSaved")}</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {!useSavedAddress && (
                    <div className="row check-out g-3">
                      <div className="form-group col-md-6">
                        <div className="field-label mb-1">{t("firstName")}</div>
                        <input
                          type="text"
                          className={`form-control form-control-lg ${errors.first_name ? "error_border" : ""}`}
                          placeholder={isRTL ? "أدخل الاسم الأول" : "Enter first name"}
                          {...register("first_name", { required: true })}
                        />
                        <span className="error-message">
                          {errors.first_name && t("reqFirstName")}
                        </span>
                      </div>

                      <div className="form-group col-md-6">
                        <div className="field-label mb-1">{t("lastName")}</div>
                        <input
                          type="text"
                          className={`form-control form-control-lg ${errors.last_name ? "error_border" : ""}`}
                          placeholder={isRTL ? "أدخل اسم العائلة" : "Enter last name"}
                          {...register("last_name", { required: true })}
                        />
                        <span className="error-message">
                          {errors.last_name && t("reqLastName")}
                        </span>
                      </div>

                      <div className="form-group col-md-6">
                        <div className="field-label mb-1">{t("phone")}</div>
                        <input
                          type="tel"
                          className={`form-control form-control-lg ${errors.phone ? "error_border" : ""}`}
                          placeholder={isRTL ? "أدخل رقم الهاتف" : "Enter phone number"}
                          {...register("phone", { required: true, pattern: /^[+()\d\s-]{5,}$/i })}
                        />
                        <span className="error-message">{errors.phone && t("reqPhone")}</span>
                      </div>

                      <div className="form-group col-md-6">
                        <div className="field-label mb-1">{t("email")}</div>
                        <input
                          className={`form-control form-control-lg ${errors.email ? "error_border" : ""}`}
                          type="text"
                          placeholder="name@example.com"
                          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                        />
                        <span className="error-message">{errors.email && t("reqEmail")}</span>
                      </div>

                      <div className="form-group col-md-12">
                        <div className="field-label mb-1">{t("street")}</div>
                        <input
                          className={`form-control form-control-lg ${errors.street ? "error_border" : ""}`}
                          type="text"
                          placeholder={isRTL ? "اكتب العنوان بالتفصيل" : "Street address"}
                          {...register("street", { required: true, minLength: 3, maxLength: 160 })}
                        />
                        <span className="error-message">{errors.street && t("reqStreet")}</span>
                      </div>

                      <div className="form-group col-md-6">
                        <div className="field-label mb-1">{t("country")}</div>
                        <input
                          type="text"
                          className={`form-control form-control-lg ${errors.country ? "error_border" : ""}`}
                          placeholder={isRTL ? "الدولة" : "Country"}
                          {...register("country", { required: true })}
                        />
                        <span className="error-message">{errors.country && t("reqCountry")}</span>
                      </div>

                      {/* City */}
                      <div className="form-group col-md-6">
                        <div className="field-label mb-1">{t("city")}</div>
                        <select
                          className="form-select form-select-lg"
                          value={selectedCityId}
                          onChange={async (e) => {
                            const id = e.target.value;
                            setSelectedCityId(id);
                            setSelectedStateId("");
                            setStateList([]);
                            setCityStatesError(""); // clear previous error

                            if (!id) { return; }
                            try {
                              const city = await getCity(id);
                              const rawStates =
                                (Array.isArray(city?.states) && city.states) ||
                                (Array.isArray(city?.data?.states) && city?.data?.states) ||
                                [];
                              const normalized = rawStates.map(normState).filter(Boolean);

                              if (normalized.length === 0) {
                                setCityStatesError(t("noStates")); // لا توجد أحياء لهذه المدينة
                                setStateList([]);
                                setSelectedStateId("");
                              } else {
                                setStateList(normalized);
                              }
                            } catch {
                              setCityStatesError(t("noStates"));
                              setStateList([]);
                              setSelectedStateId("");
                            }
                          }}
                        >
                          <option value="">{t("selectCity")}</option>
                          {cityList.map((c) => (
                            <option key={c.id} value={c.id}>
                              {getCityLabel(c, isRTL)}
                            </option>
                          ))}
                        </select>
                        {!selectedCityId && (
                          <span className="error-message">{t("reqCity")}</span>
                        )}
                        {cityStatesError && (
                          <span className="error-message">{cityStatesError}</span>
                        )}
                      </div>

                      {/* Neighborhood / State (dependent) */}
                      {stateList.length > 0 ? (
                        <div className="form-group col-md-6">
                          <div className="field-label mb-1">
                            {isRTL ? "الحي / المنطقة" : "Neighborhood / State"}
                          </div>
                          <select
                            className="form-select form-select-lg"
                            value={selectedStateId}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedStateId(val);
                            }}
                          >
                            <option value="">{t("selectNeighborhood")}</option>
                            {stateList.map((s) => (
                              <option key={s.id} value={s.id}>
                                {labelOfState(s, isRTL)}
                              </option>
                            ))}
                          </select>
                          {!selectedStateId && (
                            <span className="error-message">{t("reqState")}</span>
                          )}
                        </div>
                      ) : null}

                      <div className="form-group col-md-6">
                        <div className="field-label mb-1">{t("postalCode")}</div>
                        <input
                          type="text"
                          className={`form-control form-control-lg ${errors.zip ? "error_border" : ""}`}
                          placeholder={isRTL ? "مثال 12345" : "e.g. 12345"}
                          {...register("zip", { pattern: /\d+/ })}
                        />
                        <span className="error-message">{errors.zip && t("digitsOnly")}</span>
                      </div>

                      <div className="form-group col-md-12">
                        <div className="field-label mb-1">{t("notes")}</div>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          placeholder={t("notesPh")}
                          {...register("notes")}
                        />
                      </div>
                    </div>
                  )}
                </Col>

                <Col lg="6" sm="12">
                  {hasItems ? (
                    <div className="checkout-details">
                      <div className="order-box p-3 p-md-4 border rounded mb-4">
                        <div className="title-box mb-3">
                          <div className="fw-semibold">
                            {t("product")} <span style={brandText}>{t("total")}</span>
                          </div>
                        </div>

                        <ul className="qty list-unstyled mb-3">
                          {(cartItems.length ? cartItems : readCartFromStorage()).map((item, index) => (
                            <li
                              key={index}
                              className="d-flex justify-content-between align-items-center py-2 border-bottom"
                            >
                              <span className="me-2">
                                {item.title} × {item.qty}
                              </span>
                              <span style={brandText}>{symbol}{item.total}</span>
                            </li>
                          ))}
                        </ul>

                        <ul className="sub-total list-unstyled mb-3">
                          <li className="d-flex justify-content-between align-items-center">
                            <span>{t("subtotal")}</span>
                            <span className="count" style={brandText}>
                              {symbol}{cartTotal}
                            </span>
                          </li>
                          <li className="d-flex justify-content-between align-items-center mt-2">
                            <span>{t("shipping")}</span>
                            <span className="count" style={brandText}>
                              {symbol}{Number(shippingCost || 0).toFixed(2)}
                            </span>
                          </li>
                        </ul>

                        <ul className="total list-unstyled pt-3 border-top">
                          <li className="d-flex justify-content-between align-items-center">
                            <span className="fw-semibold">{t("total")}</span>
                            <span className="count fw-semibold" style={brandText}>
                              {symbol}{grandTotal.toFixed(2)}
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="payment-box p-3 p-md-4 border rounded">
                        <div className="radio-option d-flex align-items-center mb-3">
                          <input type="radio" id="payment-cod" defaultChecked style={{ accentColor: BRAND }} />
                          <label
                            htmlFor="payment-cod"
                            className={isRTL ? "me-2 mb-0" : "ms-2 mb-0"}
                            style={brandText}
                          >
                            {t("cod")}
                          </label>
                        </div>

                        <div className="text-end">
                          <button
                            type="submit"
                            className="btn btn-lg btn-solid"
                            style={brandBtn}
                            disabled={submitting}
                          >
                            {submitting ? t("placing") : t("placeOrder")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Container>
    </section>
  );
}
