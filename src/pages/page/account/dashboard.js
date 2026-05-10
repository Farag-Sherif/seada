// pages/page/account/dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Container, Row, Col, Spinner, Form, Label, Input, Button, Table,
} from "reactstrap";
import CommonLayout from "../../../components/shop/common-layout";
import { useLanguage } from "../../../helpers/Language/useLanguage";
import {
  getUser, getAddresses, createAddress, editAddress, deleteAddress,
  updateUser, updateUserPassword, getAddress,
} from "../../../actions/auth";
import { getOrders, getCities } from "../../../actions/main";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StyleTag from "@/styles/StyleTag";
/* ---------- i18n helper ---------- */
const tr = (t, key, fallback) => {
  try { const v = t ? t(key) : ""; return !v || v === key ? fallback : v; }
  catch { return fallback; }
};

/* ---------- utils ---------- */
const safeJSON = (s) => { try { return JSON.parse(s); } catch { return null; } };
const readLocalUser = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("authUser");
  if (!raw) return null;
  const u = safeJSON(raw);
  return u && typeof u === "object" ? u : null;
};
const userName = (u) => {
  const f = u?.first_name ?? u?.fname ?? "";
  const l = u?.last_name ?? u?.lname ?? "";
  const name = `${f} ${l}`.trim();
  return name || u?.name || u?.username || "—";
};
/** read a property using aliases */
const pick = (obj, ...keys) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "";
};
const objLabel = (o) => {
  if (!o || typeof o !== "object") return null;
  const direct = o.name ?? o.title ?? o.label ?? o.display ?? o.code ?? o.slug ?? o.value ?? null;
  if (direct) return direct;
  const trns = o.translations;
  if (trns) {
    if (Array.isArray(trns)) {
      const ar = trns.find((x) => x.locale === "ar")?.name;
      const en = trns.find((x) => x.locale === "en")?.name;
      return ar ?? en ?? null;
    }
    return trns.ar?.name ?? trns.en?.name ?? null;
  }
  return null;
};
const toText = (v) => {
  if (v === null || v === undefined) return "—";
  const t = typeof v;
  if (t === "string" || t === "number" || t === "boolean") return String(v);
  if (Array.isArray(v)) return v.map((x) => toText(x)).join(", ");
  if (t === "object") return objLabel(v) ?? "—";
  return "—";
};
const fmtDateTime = (v) => {
  const s = (typeof v === "string" && v) || v?.created_at || v?.date || v?.createdAt || null;
  if (!s) return "—";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? String(s) : d.toLocaleString();
};
const getOrderMoney = (o) => {
  const currencyRaw = o?.currency_symbol || o?.currency?.symbol || o?.currency?.code || o?.currency_code || "";
  const currency = toText(currencyRaw) !== "—" ? toText(currencyRaw) : "";
  const totalRaw = o?.total ?? o?.grand_total ?? o?.amount ?? o?.summary?.total ?? o?.total_price ?? null;
  const formatted = o?.total_formatted || o?.amount_formatted || o?.grand_total_formatted || null;
  if (formatted && typeof formatted === "string") return formatted;
  if (totalRaw === null || totalRaw === undefined) return currency || "—";
  const num = Number(totalRaw);
  if (!Number.isNaN(num)) return `${currency ? currency + " " : ""}${num.toFixed(2)}`;
  return `${currency ? currency + " " : ""}${toText(totalRaw)}`;
};
const summarizeAddress = (a) => {
  const apartment = pick(a, "apartment", "suite", "apt");
  const street = pick(a, "street", "address", "address1", "address_1", "addr", "line1");
  const address2 = pick(a, "address2", "address_2", "line2");
  const city = pick(a, "city", "city_name");
  const state = pick(a, "state", "region", "province");
  const zip = pick(a, "postal_code", "zip", "postcode");
  const country = pick(a, "country");
  const parts = [apartment, street, address2, city, state, zip, country].filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
};

/* ---------- address payload helpers (key fix + omit empties) ---------- */
/* ---------- address payload helpers (key fix + omit empties) ---------- */
const omitEmpty = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== "" && v !== undefined && v !== null));

/** Convert form -> backend friendly payload with aliases; avoid overwriting with empties */
const normalizeAddressForApi = (f) => {
  const address1 = f.street || f.address || "";
  const address2 = f.address2 || f.apartment || "";

  // Backend expects city as an ID in "city" (0/empty => unset)
  const cityIdNum =
    f.city_id !== "" && f.city_id !== undefined && f.city_id !== null
      ? Number(f.city_id)
      : (typeof f.city === "number" ? f.city : undefined);

  return omitEmpty({
    // Names (send common variants to be safe)
    first_name: f.f_name || f.first_name,
    last_name:  f.l_name || f.last_name,
    f_name:     f.f_name || f.first_name,
    l_name:     f.l_name || f.last_name,

    email:      f.email,
    phone:      f.phone,
    home_phone: f.home_phone,
    company:    f.company,

    // Address lines & aliases
    address1,
    address2,
    street:     f.street,
    address:    address1,
    apartment:  f.apartment,

    // Postal / region
    postal_code: f.postal_code || f.zip,
    zip:         f.postal_code || f.zip,       // <-- include "zip" for your backend
    state:       typeof f.state === "number" ? undefined : f.state, // ignore numeric 0
    country:     f.country,

    // City info
    city:        Number.isFinite(cityIdNum) ? cityIdNum : undefined, // <-- numeric ID for backend
    city_id:     Number.isFinite(cityIdNum) ? cityIdNum : undefined, // keep alias for flexible backends
    city_name:   typeof f.city === "string" ? f.city : undefined,     // human-readable (optional)

    notes:       f.notes,
  });
};

/* ---------- component ---------- */
const Dashboard = () => {
  const { t, isRTL } = useLanguage();

  const [accountInfo, setAccountInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [active, setActive] = useState("account_info");
  const [bootLoading, setBootLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [user, setUser] = useState(readLocalUser());
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cities, setCities] = useState([]);

  // profile form
  const [acctForm, setAcctForm] = useState({ fname: "", lname: "", phone: "", email: "", message: "" });

  // password form
  const [pwdForm, setPwdForm] = useState({ current_password: "", password: "", confirm_password: "" });

  // address form
  const [addrForm, setAddrForm] = useState({
    id: null,
    f_name: "", l_name: "", email: "", phone: "", home_phone: "",
    company: "", apartment: "",
    street: "", address: "", address2: "",
    postal_code: "", state: "", city: "", city_id: "", country: "", notes: "",
  });

  /* ---------- responsive ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsMobile(window.innerWidth <= 991);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ---------- bootload ---------- */
  useEffect(() => {
    let alive = true;

    const hydrateLocal = () => {
      const u = readLocalUser();
      if (!u) return;
      if (alive) {
        setUser(u);
        setAcctForm({
          fname: u?.first_name ?? u?.fname ?? "",
          lname: u?.last_name ?? u?.lname ?? "",
          phone: u?.phone ?? "",
          email: u?.email ?? "",
          message: "",
        });
      }
    };
    hydrateLocal();

    (async () => {
      try {
        setBootLoading(true);

        const uRes = await getUser().catch(() => null);
        const u = uRes?.user || uRes?.data || uRes || null;
        if (alive && u) {
          setUser(u);
          setAcctForm({
            fname: u?.first_name ?? u?.fname ?? "",
            lname: u?.last_name ?? u?.lname ?? "",
            phone: u?.phone ?? "",
            email: u?.email ?? "",
            message: "",
          });
        }

        const aRes = await getAddresses().catch(() => null);
        const list =
          (Array.isArray(aRes?.data) && aRes.data) ||
          (Array.isArray(aRes?.addresses) && aRes.addresses) ||
          (Array.isArray(aRes) && aRes) || [];
        if (alive) setAddresses(list);

        const oRes = await getOrders().catch(() => null);
        const oList =
          (Array.isArray(oRes?.data) && oRes.data) ||
          (Array.isArray(oRes?.orders) && oRes.orders) ||
          (Array.isArray(oRes) && oRes) || [];
        if (alive) setOrders(oList);

        const cRes = await getCities().catch(() => null);
        const cList =
          (Array.isArray(cRes?.data) && cRes.data) ||
          (Array.isArray(cRes?.cities) && cRes.cities) ||
          (Array.isArray(cRes) && cRes) || [];
        if (alive) setCities(cList);
      } finally {
        if (alive) setBootLoading(false);
      }
    })();

    const onAuthChanged = () => {
      const u = readLocalUser();
      setUser(u);
      setAcctForm({
        fname: u?.first_name ?? u?.fname ?? "",
        lname: u?.last_name ?? u?.lname ?? "",
        phone: u?.phone ?? "",
        email: u?.email ?? "",
        message: "",
      });
    };
    window.addEventListener("auth:changed", onAuthChanged);

    return () => {
      alive = false;
      window.removeEventListener("auth:changed", onAuthChanged);
    };
  }, []);

  const handleSelect = (key) => {
    setActive(key);
    if (isMobile) setAccountInfo(false);
  };

  /* ---------- form handlers ---------- */
  const onAcctChange = (e) => { const { id, value } = e.target; setAcctForm((s) => ({ ...s, [id]: value })); };
  const onPwdChange = (e) => { const { id, value } = e.target; setPwdForm((s) => ({ ...s, [id]: value })); };
  const onAddrChange = (e) => { const { id, value } = e.target; setAddrForm((s) => ({ ...s, [id]: value })); };

  const onCityChange = (e) => {
    const id = e.target.value;
    const cityObj = cities.find((c) => String(c.id) === String(id));
    const name =
      (isRTL
        ? (Array.isArray(cityObj?.translations) && cityObj.translations.find((x) => x.locale === "ar")?.name) || cityObj?.name_ar
        : (Array.isArray(cityObj?.translations) && cityObj.translations.find((x) => x.locale === "en")?.name) || cityObj?.name_en) ||
      cityObj?.name || "";
    setAddrForm((s) => ({ ...s, city_id: id, city: name }));
  };

  /* ---------- actions (account/pwd) ---------- */
  const saveAccount = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        first_name: acctForm.fname,
        last_name: acctForm.lname,
        phone: acctForm.phone,
        email: acctForm.email,
        message: acctForm.message,
      };
      await updateUser(payload);
      toast.success(tr(t, "saved", "Saved"));
    } catch (err) {
      toast.error(err?.message || tr(t, "error", "Error"));
    } finally {
      setBusy(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    const { current_password, password, confirm_password } = pwdForm;
    if (!password || password.length < 6) {
      toast.error(tr(t, "password_min", "Password must be at least 6 characters."));
      return;
    }
    if (password !== confirm_password) {
      toast.error(tr(t, "passwords_not_match", "New password and confirmation do not match."));
      return;
    }
    setBusy(true);
    try {
      await updateUserPassword({ current_password, password });
      toast.success(tr(t, "password_updated", "Password updated successfully."));
      setPwdForm({ current_password: "", password: "", confirm_password: "" });
    } catch (err) {
      toast.error(err?.message || tr(t, "error", "Error"));
    } finally {
      setBusy(false);
    }
  };

  /* ---------- addresses ---------- */
  const startAddAddress = () => {
    setAddrForm({
      id: null,
      f_name: "", l_name: "", email: user?.email || "", phone: "",
      home_phone: "", company: "", apartment: "",
      street: "", address: "", address2: "",
      postal_code: "", state: "", city: "", city_id: "", country: "", notes: "",
    });
    setActive("address_edit");
  };

  /** normalize API address -> form fields */
  const mapAddressToForm = (a) => {
    if (!a) return null;
    const foundCity = cities.find(
      (c) =>
        c?.id === a?.city_id ||
        objLabel(c)?.toLowerCase?.() === String(pick(a, "city", "city_name")).toLowerCase()
    );
    return {
      id: a?.id ?? null,
      f_name: pick(a, "f_name", "fname", "first_name"),
      l_name: pick(a, "l_name", "lname", "last_name"),
      email: pick(a, "email"),
      phone: pick(a, "phone", "mobile"),
      home_phone: pick(a, "home_phone", "landline"),
      company: pick(a, "company", "company_name"),
      apartment: pick(a, "apartment", "suite", "apt"),
      street: pick(a, "street", "address", "address1", "address_1", "addr", "line1"),
      address: pick(a, "address", "address1", "address_1", "line1"),
      address2: pick(a, "address2", "address_2", "line2"),
      postal_code: pick(a, "postal_code", "zip", "postcode"),
      state: pick(a, "state", "region", "province"),
      city: pick(a, "city", "city_name") || (foundCity ? objLabel(foundCity) : ""),
      city_id: foundCity?.id ? String(foundCity.id) : (a?.city_id ? String(a.city_id) : ""),
      country: pick(a, "country"),
      notes: pick(a, "notes"),
    };
  };

  /** load address by id via getAddress(), then open edit with filled values */
  const startEditAddressById = async (id) => {
    if (!id) return;
    setBusy(true);
    try {
      // try both signatures: getAddress(id) and getAddress({ id })
      let res = await getAddress?.(id).catch(() => null);
      if (!res && typeof getAddress === "function") {
        res = await getAddress?.({ id }).catch(() => null);
      }

      const detail =
        (res && (res.data || res.address || res.item)) ||
        res ||
        null;

      if (!detail) {
        // fallback to list lookup
        let found = addresses.find((x) => String(x?.id) === String(id));
        if (!found) {
          const aRes = await getAddresses().catch(() => null);
          const list =
            (Array.isArray(aRes?.data) && aRes.data) ||
            (Array.isArray(aRes?.addresses) && aRes.addresses) ||
            (Array.isArray(aRes) && aRes) || [];
          setAddresses(list);
          found = list.find((x) => String(x?.id) === String(id));
        }
        if (!found) {
          toast.error(tr(t, "not_found", isRTL ? "العنوان غير موجود" : "Address not found"));
          return;
        }
        setAddrForm(mapAddressToForm(found));
      } else {
        setAddrForm(mapAddressToForm(detail));
      }

      setActive("address_edit");
    } catch (err) {
      toast.error(err?.message || tr(t, "error", isRTL ? "خطأ" : "Error"));
    } finally {
      setBusy(false);
    }
  };

  const refetchAddresses = async () => {
    const aRes = await getAddresses().catch(() => null);
    const list =
      (Array.isArray(aRes?.data) && aRes.data) ||
      (Array.isArray(aRes?.addresses) && aRes.addresses) ||
      (Array.isArray(aRes) && aRes) || [];
    setAddresses(list);
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const apiPayload = normalizeAddressForApi(addrForm);

      if (addrForm.id) {
        await editAddress({ id: addrForm.id, ...apiPayload });
      } else {
        await createAddress(apiPayload);
      }
      await refetchAddresses();
      toast.success(tr(t, "address_saved", isRTL ? "تم حفظ العنوان." : "Address saved."));
      setActive("address_book");
    } catch (err) {
      toast.error(err?.message || tr(t, "error", "Error"));
    } finally {
      setBusy(false);
    }
  };

  const removeAddress = async (id) => {
    if (!id) return;
    if (!confirm(tr(t, "delete_confirm", isRTL ? "حذف هذا العنوان؟" : "Delete this address?"))) return;
    setBusy(true);
    try {
      await deleteAddress(id);
      await refetchAddresses();
      toast.success(tr(t, "address_removed", isRTL ? "تم حذف العنوان." : "Address removed."));
    } catch (err) {
      toast.error(err?.message || tr(t, "error", "Error"));
    } finally {
      setBusy(false);
    }
  };

  const tabs = useMemo(
    () => [
      { key: "account_info", label: tr(t, "dashboard.account_info", isRTL ? "معلومات الحساب" : "Account info") },
      { key: "address_book", label: tr(t, "dashboard.address_book", isRTL ? "دفتر العناوين" : "Address book") },
      { key: "my_orders", label: tr(t, "dashboard.my_orders", isRTL ? "طلباتي" : "My orders") },
    ],
    [t, isRTL]
  );

  const cityOptions = useMemo(() => {
    return (cities || []).map((c) => {
      const name =
        (isRTL
          ? (Array.isArray(c?.translations) && c.translations.find((x) => x.locale === "ar")?.name) || c?.name_ar
          : (Array.isArray(c?.translations) && c.translations.find((x) => x.locale === "en")?.name) || c?.name_en) ||
        c?.name || "";
      return { id: String(c.id), name };
    });
  }, [cities, isRTL]);

  return (
    <CommonLayout
      parent={tr(t, "Home", isRTL ? "الرئيسية" : "Home")}
      title={tr(t, "dashboard.title", isRTL ? "لوحة التحكم" : "Dashboard")}
    >
      <section
        className="section-b-space"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
        aria-busy={bootLoading ? "true" : "false"}
      >
        <Container>
          <Row className="g-4">
            {/* Sidebar */}
            <Col lg="3">
              {isMobile ? (
                <div
                  className="account-sidebar mb-3"
                  role="button"
                  tabIndex={0}
                  onClick={() => setAccountInfo(!accountInfo)}
                  onKeyDown={(e) => (e.key === "Enter" ? setAccountInfo(!accountInfo) : null)}
                >
                  <span className="popup-btn">
                    {tr(t, "dashboard.my_account", isRTL ? "حسابي" : "My account")}
                  </span>
                </div>
              ) : null}

              <aside
                className={`dashboard-left card-like ${accountInfo ? "open" : ""}`}
                style={accountInfo ? { left: "0px" } : {}}
              >
                <div
                  className="collection-mobile-back"
                  onClick={() => setAccountInfo(!accountInfo)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" ? setAccountInfo(!accountInfo) : null)}
                >
                  <span className="filter-back">
                    <i className="fa fa-angle-left" /> {tr(t, "back", isRTL ? "رجوع" : "Back")}
                  </span>
                </div>

                <div className="block-content">
                  <ul className="list-unstyled nav-vertical">
                    {tabs.map((tab) => (
                      <li key={tab.key} className={active === tab.key ? "active" : ""}>
                        <button
                          type="button"
                          className="nav-tab"
                          onClick={() => handleSelect(tab.key)}
                          aria-current={active === tab.key ? "page" : undefined}
                        >
                          {tab.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </Col>

            {/* Content */}
            <Col lg="9">
              <div className="dashboard-right">
                <header className="page-title mb-3 d-flex align-items-center justify-content-between">
                  <h2 className="mb-0">
                    {tr(t, "dashboard.my_dashboard", isRTL ? "لوحتي" : "My dashboard")}
                  </h2>
                  {bootLoading && <Spinner size="sm" />}
                </header>

                {!bootLoading && (
                  <div className="stack gap-4">
                    {/* account_info */}
                    {active === "account_info" && (
                      <section className="card-like">
                        <div className="stack gap-2">
                          <div className="welcome-msg">
                            <p className="lead">
                              {tr(
                                t,
                                "dashboard.hello_name",
                                isRTL ? "مرحباً، {{name}}" : "Hello, {{name}}"
                              ).replace("{{name}}", user ? userName(user) : "…")}
                            </p>
                            <p className="muted">
                              {tr(
                                t,
                                "dashboard.intro",
                                isRTL ? "من هنا يمكنك إدارة حسابك وبياناتك." : "Manage your account and details here."
                              )}
                            </p>
                          </div>

                          <div className="divider" />

                          <div className="box-head">
                            <h3 className="h5 m-0">
                              {tr(
                                t,
                                "dashboard.account_information",
                                isRTL ? "معلومات الحساب" : "Account information"
                              )}
                            </h3>
                          </div>

                          <Form onSubmit={saveAccount} className="mt-2">
                            <Row className="g-3">
                              <Col md="6">
                                <Label htmlFor="fname">{tr(t, "first_name", isRTL ? "الاسم الأول" : "First name")}</Label>
                                <Input id="fname" value={acctForm.fname} onChange={onAcctChange} />
                              </Col>
                              <Col md="6">
                                <Label htmlFor="lname">{tr(t, "last_name", isRTL ? "الاسم الأخير" : "Last name")}</Label>
                                <Input id="lname" value={acctForm.lname} onChange={onAcctChange} />
                              </Col>
                              <Col md="6">
                                <Label htmlFor="email">{tr(t, "email", isRTL ? "البريد الإلكتروني" : "Email")}</Label>
                                <Input id="email" type="email" value={acctForm.email} onChange={onAcctChange} />
                              </Col>
                              <Col md="6">
                                <Label htmlFor="phone">{tr(t, "phone", isRTL ? "رقم الهاتف" : "Phone")}</Label>
                                <Input id="phone" value={acctForm.phone} onChange={onAcctChange} />
                              </Col>
                            </Row>

                            <div className="mt-3">
                              <Button className="btn-stevia" disabled={busy} type="submit">
                                {busy ? tr(t, "saving", isRTL ? "جارٍ الحفظ..." : "Saving...") : tr(t, "save", isRTL ? "حفظ" : "Save")}
                              </Button>
                            </div>
                          </Form>

                          <div className="divider" />

                          <details className="details-reset">
                            <summary className="summary-btn">
                              {tr(t, "dashboard.change_password", isRTL ? "تغيير كلمة المرور" : "Change password")}
                            </summary>
                            <Form onSubmit={savePassword} className="mt-3">
                              <Row className="g-3">
                                <Col md="4">
                                  <Label htmlFor="current_password">{tr(t, "current_password", isRTL ? "كلمة المرور الحالية" : "Current password")}</Label>
                                  <Input id="current_password" type="password" value={pwdForm.current_password} onChange={onPwdChange} />
                                </Col>
                                <Col md="4">
                                  <Label htmlFor="password">{tr(t, "new_password", isRTL ? "كلمة المرور الجديدة" : "New password")}</Label>
                                  <Input id="password" type="password" value={pwdForm.password} onChange={onPwdChange} />
                                </Col>
                                <Col md="4">
                                  <Label htmlFor="confirm_password">{tr(t, "confirm_password", isRTL ? "تأكيد كلمة المرور" : "Confirm password")}</Label>
                                  <Input id="confirm_password" type="password" value={pwdForm.confirm_password} onChange={onPwdChange} />
                                </Col>
                              </Row>
                              <div className="mt-3">
                                <Button className="btn-stevia" disabled={busy} type="submit">
                                  {busy ? tr(t, "saving", isRTL ? "جارٍ الحفظ..." : "Saving...") : tr(t, "save", isRTL ? "حفظ" : "Save")}
                                </Button>
                              </div>
                            </Form>
                          </details>
                        </div>
                      </section>
                    )}

                    {/* address_book */}
                    {active === "address_book" && (
                      <section className="card-like">
                        <div className="box-title d-flex justify-content-between align-items-center">
                          <h3 className="h5 m-0">
                            {tr(t, "dashboard.address_book", isRTL ? "دفتر العناوين" : "Address book")}
                          </h3>
                          <Button className="btn-stevia" size="sm" onClick={startAddAddress}>
                            {tr(t, "add", isRTL ? "إضافة" : "Add")}
                          </Button>
                        </div>

                        {addresses?.length ? (
                          <div className="table-wrap">
                            <Table bordered responsive className="mt-3 align-middle">
                              <thead className="table-head">
                                <tr>
                                  <th>{tr(t, "name", isRTL ? "الاسم" : "Name")}</th>
                                  <th>{tr(t, "phone", isRTL ? "الهاتف" : "Phone")}</th>
                                  <th style={{ width: "45%" }}>{tr(t, "address", isRTL ? "العنوان" : "Address")}</th>
                                  <th style={{ width: 180 }}>{tr(t, "action", isRTL ? "إجراء" : "Action")}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {addresses.map((a) => (
                                  <tr key={a?.id || `${pick(a, "f_name", "fname")}-${pick(a, "phone")}`}>
                                    <td>{`${toText(pick(a, "f_name", "fname", "first_name"))} ${toText(pick(a, "l_name", "lname", "last_name"))}`.trim()}</td>
                                    <td>{toText(pick(a, "phone", "mobile"))}</td>
                                    <td className="truncate">{summarizeAddress(a)}</td>
                                    <td>
                                      <div className="hstack gap-2">
                                        <Button
                                          size="sm"
                                          color="secondary"
                                          onClick={() => startEditAddressById(a?.id)}
                                        >
                                          {tr(t, "edit", isRTL ? "تعديل" : "Edit")}
                                        </Button>
                                        <Button
                                          size="sm"
                                          color="danger"
                                          onClick={() => removeAddress(a?.id)}
                                        >
                                          {tr(t, "delete", isRTL ? "حذف" : "Delete")}
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        ) : (
                          <p className="mt-3 muted">
                            {tr(t, "dashboard.address_book_hint", isRTL ? "لا توجد عناوين محفوظة بعد." : "No saved addresses yet.")}
                          </p>
                        )}
                      </section>
                    )}

                    {/* address_edit */}
                    {active === "address_edit" && (
                      <section className="card-like">
                        <div className="box-title">
                          <h3 className="h5 m-0">
                            {addrForm.id
                              ? tr(t, "edit_address", isRTL ? "تعديل العنوان" : "Edit address")
                              : tr(t, "add_address", isRTL ? "إضافة عنوان" : "Add address")}
                          </h3>
                        </div>
                        <Form onSubmit={saveAddress} className="mt-3">
                          <Row className="g-3">
                            <Col md="6">
                              <Label htmlFor="f_name">{tr(t, "first_name", isRTL ? "الاسم الأول" : "First name")}</Label>
                              <Input id="f_name" value={addrForm.f_name} onChange={onAddrChange} required />
                            </Col>
                            <Col md="6">
                              <Label htmlFor="l_name">{tr(t, "last_name", isRTL ? "الاسم الأخير" : "Last name")}</Label>
                              <Input id="l_name" value={addrForm.l_name} onChange={onAddrChange} required />
                            </Col>
                            <Col md="6">
                              <Label htmlFor="email">{tr(t, "email", isRTL ? "البريد الإلكتروني" : "Email")}</Label>
                              <Input type="email" id="email" value={addrForm.email} onChange={onAddrChange} required />
                            </Col>
                            <Col md="6">
                              <Label htmlFor="phone">{tr(t, "phone", isRTL ? "رقم الهاتف" : "Phone")}</Label>
                              <Input id="phone" value={addrForm.phone} onChange={onAddrChange} required />
                            </Col>
                            <Col md="6">
                              <Label htmlFor="home_phone">{tr(t, "home_phone", isRTL ? "هاتف المنزل" : "Home phone")}</Label>
                              <Input id="home_phone" value={addrForm.home_phone} onChange={onAddrChange} />
                            </Col>

                            <Col md="6">
                              <Label htmlFor="apartment">{tr(t, "apartment", isRTL ? "شقة / قطعة" : "Apartment / Suite")}</Label>
                              <Input id="apartment" value={addrForm.apartment} onChange={onAddrChange} />
                            </Col>
                            <Col md="6">
                              <Label htmlFor="company">{tr(t, "company_name", isRTL ? "اسم الشركة" : "Company name")}</Label>
                              <Input id="company" value={addrForm.company} onChange={onAddrChange} />
                            </Col>

                            <Col md="6">
                              <Label htmlFor="street">{tr(t, "street", isRTL ? "الشارع" : "Street")}</Label>
                              <Input id="street" value={addrForm.street} onChange={onAddrChange} required />
                            </Col>

                            <Col md="6">
                              <Label htmlFor="address">{tr(t, "address", isRTL ? "العنوان" : "Address")}</Label>
                              <Input id="address" value={addrForm.address} onChange={onAddrChange} />
                            </Col>
                            <Col md="6">
                              <Label htmlFor="address2">{tr(t, "address_2", isRTL ? "العنوان 2" : "Address 2")}</Label>
                              <Input id="address2" value={addrForm.address2} onChange={onAddrChange} />
                            </Col>

                            <Col md="6">
                              <Label htmlFor="postal_code">{tr(t, "postal_code", isRTL ? "الرمز البريدي" : "Postal code")}</Label>
                              <Input id="postal_code" value={addrForm.postal_code} onChange={onAddrChange} />
                            </Col>

                            <Col md="6">
                              <Label htmlFor="state">{tr(t, "state_region", isRTL ? "المنطقة/الولاية" : "State/Region")}</Label>
                              <Input id="state" value={addrForm.state} onChange={onAddrChange} />
                            </Col>

                            <Col md="6">
                              <Label htmlFor="city_id">{tr(t, "city", isRTL ? "المدينة" : "City")}</Label>
                              <Input id="city_id" type="select" value={addrForm.city_id} onChange={onCityChange}>
                                <option value="">{tr(t, "select_city", isRTL ? "اختر المدينة" : "Select city")}</option>
                                {cityOptions.map((c) => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </Input>
                            </Col>

                            <Col md="12">
                              <Label htmlFor="notes">{tr(t, "notes", isRTL ? "ملاحظات" : "Notes")}</Label>
                              <Input id="notes" type="textarea" rows={3} value={addrForm.notes} onChange={onAddrChange} />
                            </Col>
                          </Row>

                          <div className="mt-3 d-flex gap-2">
                            <Button className="btn-stevia" disabled={busy} type="submit">
                              {busy ? tr(t, "saving", isRTL ? "جارٍ الحفظ..." : "Saving...") : tr(t, "save", isRTL ? "حفظ" : "Save")}
                            </Button>
                            <Button color="secondary" type="button" onClick={() => setActive("address_book")}>
                              {tr(t, "cancel", isRTL ? "إلغاء" : "Cancel")}
                            </Button>
                          </div>
                        </Form>
                      </section>
                    )}

                    {/* my_orders */}
                    {active === "my_orders" && (
                      <section className="card-like">
                        <div className="box-title">
                          <h3 className="h5 m-0">{tr(t, "dashboard.my_orders", isRTL ? "طلباتي" : "My orders")}</h3>
                        </div>
                        {orders?.length ? (
                          <div className="table-wrap">
                            <Table bordered responsive className="mt-3 align-middle">
                              <thead className="table-head">
                                <tr>
                                  <th style={{ width: 90 }}>{tr(t, "number_symbol", "#")}</th>
                                  <th style={{ width: "30%" }}>{tr(t, "date", isRTL ? "التاريخ" : "Date")}</th>
                                  <th style={{ width: "30%" }}>{tr(t, "status", isRTL ? "الحالة" : "Status")}</th>
                                  <th>{tr(t, "total", isRTL ? "الإجمالي" : "Total")}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {orders.map((o) => {
                                  const idText = o?.id ?? o?.order_id ?? o?.reference ?? o?.ref ?? "—";
                                  const dateText = fmtDateTime(o?.created_at || o?.date || o?.createdAt);
                                  const statusText = toText(o?.status) || toText(o?.payment_status) || toText(o?.order_status);
                                  const totalText = getOrderMoney(o);
                                  return (
                                    <tr key={String(idText)}>
                                      <td>{toText(idText)}</td>
                                      <td>{dateText}</td>
                                      <td>{statusText}</td>
                                      <td>{totalText}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </Table>
                          </div>
                        ) : (
                          <div className="empty-state">
                            <p className="muted">{tr(t, "dashboard.no_orders", isRTL ? "لا توجد طلبات" : "No orders yet.")}</p>
                          </div>
                        )}
                      </section>
                    )}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Style */}
      <StyleTag global css={`
        :root { --sp-1: 6px; --sp-2: 10px; --sp-3: 14px; --sp-4: 18px; --sp-5: 24px; --sp-6: 32px; --radius: 14px; --line: #e7e7e9; --muted: #6b7280; --card-bg: #ffffff; }
        .stack { display: grid; align-items: start; }
        .stack.gap-2 { gap: var(--sp-3); } .stack.gap-4 { gap: var(--sp-5); }
        .hstack { display: inline-flex; align-items: center; } .hstack.gap-2 > * + * { margin-inline-start: var(--sp-2); }
        .card-like { background: var(--card-bg); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--sp-6); box-shadow: 0 6px 18px rgba(0,0,0,.04); }
        .divider { height: 1px; background: var(--line); margin: var(--sp-3) 0; }
        .muted { color: var(--muted); }
        .nav-vertical { margin: 0; padding: 0; } .nav-vertical li + li { margin-top: var(--sp-2); }
        .nav-tab { width: 100%; text-align: start; padding: 10px 12px; border-radius: 10px; border: 1px solid transparent; background: transparent; color: #111; transition: background .15s, border-color .15s; }
        .nav-vertical li.active .nav-tab { background: #f6fbf8; border-color: #d7efe3; } .nav-tab:hover { background: #f9fafb; }
        .dashboard-left.card-like { padding: var(--sp-4); }
        .table-wrap { overflow: auto; border-radius: 10px; }
        table thead.table-head th { background: #fafafa; border-bottom-color: var(--line); }
        td.truncate { max-width: 520px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .btn-stevia { background: #0b6b37 !important; border-color: #0b6b37 !important; color: #fff !important; padding-inline: 18px; }
        .btn-stevia:disabled { opacity: .85; cursor: not-allowed; }
        .summary-btn { display: inline-block; padding: 8px 12px; border-radius: 10px; background: #f8faf9; border: 1px solid #e6f0eb; cursor: pointer; }
        .details-reset[open] .summary-btn { background: #f2f9f5; }
      `} />
    </CommonLayout>
  );
};

export default Dashboard;
