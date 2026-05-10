// pages/page/account/profile.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Container, Row, Form, Input, Label, Col } from "reactstrap";
import { useLanguage } from "../../../../helpers/Language/useLanguage";
import { getUser, updateUser } from "./../../../../actions/auth";
import { getCities } from "./../../../../actions/main";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* i18n helpers */
const trSafe = (t, k) => { if (!k) return ""; try { const r = t(k); return !r || r === k ? k : r; } catch { return k; } };
const trOr = (t, k, fb) => (trSafe(t, k) === k ? fb : trSafe(t, k));

/* mapping helpers */
const getAny = (o, keys, d = "") => { for (const k of keys) { const v = o?.[k]; if (v != null && v !== "") return v; } return d; };
const splitName = (full = "") => {
  const parts = String(full).trim().split(/\s+/);
  if (parts.length <= 1) return { first: parts[0] || "", last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
};

const userToForm = (u = {}) => {
  const firstName = getAny(u, ["first_name","fname","firstName"]) || splitName(getAny(u, ["name","full_name"])).first;
  const lastName  = getAny(u, ["last_name","lname","lastName"])  || splitName(getAny(u, ["name","full_name"])).last;
  return {
    firstName: String(firstName || ""),
    lastName : String(lastName  || ""),
    phone    : String(getAny(u, ["phone","mobile","tel"]) || ""),
    email    : String(getAny(u, ["email","mail"]) || ""),
    flatPlot : String(getAny(u, ["flat_plot","apartment","suite","company"]) || ""),
    address  : String(getAny(u, ["address","address_line","address_line1","street"]) ||
                      [u?.street,u?.building,u?.landmark].filter(Boolean).join(", ") || ""),
    zip      : String(getAny(u, ["zip","zip_code","postal_code","postcode"]) || ""),
    // country removed
    city     : String(getAny(u, ["city","town"]) || ""),
    regionState: String(getAny(u, ["region_state","state","governorate","province"]) || ""),
    message  : String(getAny(u, ["bio","about","note","message"]) || ""),
  };
};

// IMPORTANT: no 'country' in payload anymore
const formToPayload = (f, resolvedCityName, resolvedStateName) => ({
  first_name: f.firstName?.trim() || "",
  last_name : f.lastName?.trim()  || "",
  phone     : f.phone?.trim()     || "",
  email     : f.email?.trim()     || "",
  flat_plot : f.flatPlot?.trim()  || "",
  address   : f.address?.trim()   || "",
  zip_code  : f.zip?.trim()       || "",
  city      : (resolvedCityName ?? f.city)?.trim() || "",
  region_state: (resolvedStateName ?? f.regionState)?.trim() || "",
  bio       : f.message ?? "",
});

/* merge helpers (write updated form back into a user object for localStorage) */
const mergeFormIntoUser = (user = {}, form = {}) => {
  const out = { ...user };
  const setIf = (key, val) => { if (val !== undefined) out[key] = val; };

  setIf("first_name", form.firstName); setIf("last_name", form.lastName);
  if (out.fname !== undefined) out.fname = form.firstName;
  if (out.lname !== undefined) out.lname = form.lastName;
  setIf("phone", form.phone); if (out.mobile !== undefined) out.mobile = form.phone;
  setIf("email", form.email);
  setIf("flat_plot", form.flatPlot); if (out.apartment !== undefined) out.apartment = form.flatPlot;
  setIf("address", form.address);
  setIf("zip_code", form.zip); if (out.zip !== undefined) out.zip = form.zip;

  // country intentionally not touched
  setIf("city", form.city);
  setIf("region_state", form.regionState);

  if ("bio" in out || form.message) out.bio = form.message;
  else if ("about" in out) out.about = form.message;

  const fullName = `${form.firstName || ""} ${form.lastName || ""}`.trim();
  if (out.name !== undefined) out.name = fullName;

  return out;
};

const safeParseJSON = (s) => { try { return JSON.parse(s); } catch { return null; } };

// pick translated display name (ar/en) from your API objects (city/state)
const pickTranslatedName = (item, langWant = "en") => {
  const tr = Array.isArray(item?.translations) ? item.translations : [];
  const primary = tr.find((t) => t?.locale === langWant)?.name;
  const fallback = tr.find((t) => t?.locale && t.locale !== langWant)?.name;
  return primary || fallback || item?.name || "";
};

// try to find a city by any name match (either base 'name' or translations)
const findCityByName = (cities, name) => {
  if (!name) return null;
  const needle = String(name).trim().toLowerCase();
  for (const c of cities || []) {
    if ((c?.name || "").toLowerCase() === needle) return c;
    if (Array.isArray(c?.translations) && c.translations.some(tr => (tr?.name || "").toLowerCase() === needle)) {
      return c;
    }
  }
  return null;
};

// try to find state by name within a city.states
const findStateByName = (states, name) => {
  if (!name) return null;
  const needle = String(name).trim().toLowerCase();
  for (const s of states || []) {
    if ((s?.name || "").toLowerCase() === needle) return s;
    if (Array.isArray(s?.translations) && s.translations.some(tr => (tr?.name || "").toLowerCase() === needle)) {
      return s;
    }
  }
  return null;
};

const ProfilePage = () => {
  const { t, isRTL, currentLanguage } = useLanguage();
  const want = (currentLanguage || "en").toLowerCase().startsWith("ar") ? "ar" : "en";

  const [form, setForm] = useState({
    firstName:"", lastName:"", phone:"", email:"",
    flatPlot:"", address:"", zip:"", city:"", regionState:"",
    message:""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  // Cities data
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");    // store id
  const [selectedStateId, setSelectedStateId] = useState("");  // store id

  // load localStorage fast; then refresh user; then load cities
  useEffect(() => {
    let alive = true;

    // 1) localStorage
    if (typeof window !== "undefined") {
      const stored = safeParseJSON(localStorage.getItem("authUser"));
      if (stored && alive) {
        setForm(userToForm(stored));
        setLoading(false);
      }
    }

    // 2) user API
    (async () => {
      try {
        const res = await getUser();
        const u = res?.user || res?.data?.user || res?.data || res?.profile || res || {};
        if (!alive) return;
        setForm(userToForm(u));

        if (typeof window !== "undefined") {
          const existing = safeParseJSON(localStorage.getItem("authUser")) || {};
          const merged = { ...existing, ...u };
          localStorage.setItem("authUser", JSON.stringify(merged));
        }
      } catch {
        if (!localStorage.getItem("authUser")) {
          toast.error(trOr(t, "profile.load_error", "Failed to load your profile"));
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    // 3) cities API
    (async () => {
      try {
        const resp = await getCities();
        const list = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
        if (!alive) return;
        setCities(list);

        // try to auto-select city/state by current form values
        const c = findCityByName(list, form.city);
        if (c) {
          setSelectedCityId(String(c.id));
          const s = findStateByName(c.states, form.regionState);
          if (s) setSelectedStateId(String(s.id));
        }
      } catch {
        // if fails, just keep empty dropdowns
      }
    })();

    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // Options for selects (localized)
  const cityOptions = useMemo(() => {
    return (cities || []).map((c) => ({
      id: String(c.id),
      label: pickTranslatedName(c, want),
    }));
  }, [cities, want]);

  const selectedCity = useMemo(
    () => cities.find((c) => String(c.id) === String(selectedCityId)) || null,
    [cities, selectedCityId]
  );

  const stateOptions = useMemo(() => {
    const st = selectedCity?.states || [];
    return (st || []).map((s) => ({
      id: String(s.id),
      label: pickTranslatedName(s, want),
    }));
  }, [selectedCity, want]);

  const selectedState = useMemo(
    () => (selectedCity?.states || []).find((s) => String(s.id) === String(selectedStateId)) || null,
    [selectedCity, selectedStateId]
  );

  // when language changes, keep selected labels in form
  useEffect(() => {
    // sync visible text in text inputs with localized labels
    if (selectedCity) {
      const cityName = pickTranslatedName(selectedCity, want);
      setForm((s) => ({ ...s, city: cityName }));
    }
    if (selectedState) {
      const stateName = pickTranslatedName(selectedState, want);
      setForm((s) => ({ ...s, regionState: stateName }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [want]);

  // handlers
  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }, []);

  const onCityChange = (e) => {
    const id = e.target.value || "";
    setSelectedCityId(id);
    setSelectedStateId(""); // reset state when city changes
    const city = cities.find((c) => String(c.id) === String(id));
    const cityName = city ? pickTranslatedName(city, want) : "";
    setForm((s) => ({ ...s, city: cityName, regionState: "" }));
  };

  const onStateChange = (e) => {
    const id = e.target.value || "";
    setSelectedStateId(id);
    const st = (selectedCity?.states || []).find((s) => String(s.id) === String(id));
    const stName = st ? pickTranslatedName(st, want) : "";
    setForm((s) => ({ ...s, regionState: stName }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);

    // Resolve names (prefer current selections’ localized labels)
    const resolvedCity = selectedCity ? pickTranslatedName(selectedCity, want) : form.city;
    const resolvedState = selectedState ? pickTranslatedName(selectedState, want) : form.regionState;

    const payload = formToPayload(form, resolvedCity, resolvedState);

    try {
      const resp = await toast.promise(updateUser(payload), {
        pending: trOr(t, "profile.saving", "Saving…"),
        success: trOr(t, "profile.saved", "Profile updated successfully"),
        error: trOr(t, "profile.save_error", "Failed to update profile"),
      });

      // Normalize the returned user (if any) and sync to localStorage
      const updated = resp?.user || resp?.data?.user || resp?.data || resp?.profile || null;

      if (typeof window !== "undefined") {
        const current = safeParseJSON(localStorage.getItem("authUser")) || {};
        const nextUser = updated ? { ...current, ...updated } : mergeFormIntoUser(current, { ...form, city: resolvedCity, regionState: resolvedState });
        localStorage.setItem("authUser", JSON.stringify(nextUser));
      }
    } catch (e2) {
      console.error(e2);
    } finally {
      setSaving(false);
    }
  };

  const toastPosition = isRTL ? "top-left" : "top-right";

  return (
    <>
      <ToastContainer position={toastPosition} rtl={isRTL} theme="colored" autoClose={3000} />

      {/* Personal details */}
      <section className="contact-page register-page" dir={isRTL ? "rtl" : "ltr"}>
        <Container>
          <Row>
            <Col sm="12">
              <h3 style={{marginBottom:"32px",marginTop:"0px"}}>
                {trOr(t, "profile.personal_detail", "Personal details")}
              </h3>

              <Form className="theme-form" onSubmit={onSubmit}>
                <Row>
                  <Col md="6">
                    <Label className="form-label" htmlFor="firstName">
                      {trOr(t, "first_name", "First name")}
                    </Label>
                    <Input
                      id="firstName" name="firstName" type="text" className="form-control"
                      placeholder={trOr(t, "enter_your_name", "Enter your first name")}
                      value={form.firstName} onChange={onChange}
                      required disabled={loading || saving}
                    />
                  </Col>

                  <Col md="6">
                    <Label className="form-label" htmlFor="lastName">
                      {trOr(t, "last_name", "Last name")}
                    </Label>
                    <Input
                      id="lastName" name="lastName" type="text" className="form-control"
                      placeholder={trOr(t, "enter_your_last_name", "Enter your last name")}
                      value={form.lastName} onChange={onChange}
                      required disabled={loading || saving}
                    />
                  </Col>

                  <Col md="6">
                    <Label className="form-label" htmlFor="phone">
                      {trOr(t, "phone_number", "Phone number")}
                    </Label>
                    <Input
                      id="phone" name="phone" type="tel" className="form-control"
                      placeholder={trOr(t, "enter_your_number", "Enter your phone")}
                      value={form.phone} onChange={onChange}
                      disabled={loading || saving}
                    />
                  </Col>

                  <Col md="6">
                    <Label className="form-label" htmlFor="email">
                      {trOr(t, "email", "Email")}
                    </Label>
                    <Input
                      id="email" name="email" type="email" className="form-control"
                      placeholder={trOr(t, "email", "Email")}
                      value={form.email} onChange={onChange}
                      required disabled={loading || saving}
                    />
                  </Col>

                  <Col md="12">
                    <Label className="form-label" htmlFor="message">
                      {trOr(t, "write_your_message", "About / Bio")}
                    </Label>
                    <textarea
                      id="message" name="message" className="form-control mb-0" rows="6"
                      placeholder={trOr(t, "write_your_message", "Tell us about yourself…")}
                      value={form.message} onChange={onChange}
                      disabled={loading || saving}
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Shipping address */}
      <section className="contact-page register-page section-b-space" dir={isRTL ? "rtl" : "ltr"}>
        <Container>
          <Row>
            <Col sm="12">
              <h3 style={{marginBottom:"32px",marginTop:"0px"}}>
                {trOr(t, "shipping_address", "Shipping address")}
              </h3>

              <Form className="theme-form" onSubmit={onSubmit}>
                <Row>
                  <Col md="6">
                    <Label className="form-label" htmlFor="flatPlot">
                      {trOr(t, "flat_plot", "Flat / Plot / Company")}
                    </Label>
                    <Input
                      id="flatPlot" name="flatPlot" type="number" className="form-control"
                      placeholder={trOr(t, "company_name", "Company / Apartment")}
                      value={form.flatPlot} onChange={onChange}
                      disabled={loading || saving}
                    />
                  </Col>

                  <Col md="6">
                    <Label className="form-label" htmlFor="address">
                      {trOr(t, "address", "Address")} *
                    </Label>
                    <Input
                      id="address" name="address" type="text" className="form-control"
                      placeholder={trOr(t, "address", "Address")}
                      value={form.address} onChange={onChange}
                      required disabled={loading || saving}
                    />
                  </Col>

                  <Col md="6">
                    <Label className="form-label" htmlFor="zip">
                      {trOr(t, "zip_code", "ZIP code")} *
                    </Label>
                    <Input
                      id="zip" name="zip" type="text" className="form-control"
                      placeholder={trOr(t, "zip_code", "ZIP code")}
                      value={form.zip} onChange={onChange}
                      required disabled={loading || saving}
                    />
                  </Col>

                  {/* Country REMOVED */}

                  {/* City as dropdown from API */}
                  <Col md="6" className="select_input">
                    <Label className="form-label" htmlFor="citySelect">
                      {trOr(t, "city", "City")} *
                    </Label>
                    <select
                      id="citySelect"
                      className="form-select py-2"
                      value={selectedCityId}
                      onChange={onCityChange}
                      disabled={loading || saving || cityOptions.length === 0}
                      required
                    >
                      <option value="">
                        {trOr(t, "select_city", "Select city")}
                      </option>
                      {cityOptions.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </Col>

                  {/* Region / State: dropdown if city has states, else text input */}
                  {stateOptions.length > 0 ? (
                    <Col md="6" className="select_input">
                      <Label className="form-label" htmlFor="stateSelect">
                        {trOr(t, "region_state", "Region / State")} *
                      </Label>
                      <select
                        id="stateSelect"
                        className="form-select py-2"
                        value={selectedStateId}
                        onChange={onStateChange}
                        disabled={loading || saving}
                        required
                      >
                        <option value="">
                          {trOr(t, "select_region_state", "Select region / state")}
                        </option>
                        {stateOptions.map((s) => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </Col>
                  ) : (
                    <Col md="6">
                      <Label className="form-label" htmlFor="regionState">
                        {trOr(t, "region_state", "Region / State")} *
                      </Label>
                      <Input
                        id="regionState" name="regionState" type="text" className="form-control"
                        placeholder={trOr(t, "region_state", "Region / State")}
                        value={form.regionState} onChange={onChange}
                        required disabled={loading || saving}
                      />
                    </Col>
                  )}

                  <div className="col-md-12">
                    <button className="btn btn-sm btn-solid" type="submit" disabled={loading || saving}>
                      {saving ? trOr(t, "profile.saving", "Saving…") : trOr(t, "save_setting", "Save settings")}
                    </button>
                  </div>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ProfilePage;