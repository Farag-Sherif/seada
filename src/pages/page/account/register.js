// pages/page/account/register.js  
import React, { useMemo, useState } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import {
  Input,
  Container,
  Row,
  Form,
  Label,
  Col,
  Button,
  Alert,
  Spinner,
} from "reactstrap";
import { register as registerApi } from "../../../actions/auth";
import { useRouter } from "@/router/useRouter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../../helpers/Language/useLanguage";

/* -------- Small helper to set a non-HttpOnly cookie for proxy auth (optional) -------- */
function setAuthCookie(token) {
  try {
    let maxAge = 60 * 60 * 24 * 30; // default 30 days
    const parts = token?.split(".");
    if (parts?.length === 3) {
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      if (payload?.exp) {
        const nowSec = Math.floor(Date.now() / 1000);
        const secs = Math.max(0, payload.exp - nowSec);
        if (secs > 0) maxAge = secs;
      }
    }
    const secure =
      typeof window !== "undefined" && window.location.protocol === "https:"
        ? "Secure; "
        : "";
    document.cookie = `Stevia-token=${encodeURIComponent(
      token
    )}; Path=/; ${secure}SameSite=Lax; Max-Age=${maxAge}`;
  } catch {
    // ignore silently
  }
}

/* ---------- i18n: try multiple keys (dot & underscore styles) ---------- */
function tAny(t, keys = [], fb = "") {
  for (const k of keys) {
    try {
      const v = t(k);
      if (v && v !== k) return v;
    } catch {}
  }
  return fb;
}

/* -------- normalize backend errors to { message, fieldErrors, statusCode } -------- */
function normalizeApiErrors(respLike) {
  const fieldErrors = {};
  const errors = respLike?.errors || respLike?.data?.errors;
  if (errors && typeof errors === "object") {
    for (const [k, v] of Object.entries(errors)) {
      fieldErrors[k] = Array.isArray(v) ? v.join(" ") : String(v);
    }
  }
  const message =
    respLike?.message ||
    respLike?.error ||
    respLike?.data?.message ||
    respLike?.data?.error ||
    "";
  const statusCode =
    respLike?.statusCode ||
    respLike?.status_code ||
    respLike?.response?.status ||
    respLike?.status;
  return { message, fieldErrors, statusCode };
}

/* ---- translate common backend messages to i18n ---- */
function translateApiMessage(msg, t) {
  const m = String(msg || "").trim();
  if (!m) return "";
  const low = m.toLowerCase();

  if (/(already been taken|has already been taken|already exists|is taken|duplicate)/.test(low))
    return tAny(t, ["api.invalid_input", "api_invalid_input"], "Invalid data. Please check your inputs.");

  if (/(email.*exists|already.*registered)/.test(low))
    return tAny(t, ["api.email_exists", "api_email_exists"], "Email already registered.");

  if (/(phone.*exists|phone.*used)/.test(low))
    return tAny(t, ["api.phone_exists", "api_phone_exists"], "Phone already registered.");

  if (/(weak password|password too short|password.*invalid)/.test(low))
    return tAny(t, ["api.weak_password", "api_weak_password"], "Password is too weak.");

  if (/(invalid|bad request|validation)/.test(low))
    return tAny(t, ["api.invalid_input", "api_invalid_input"], "Invalid data. Please check your inputs.");

  if (/(unauthori[sz]ed|unauthenticated|invalid token|401)/.test(low))
    return tAny(t, ["api.unauthorized", "api_unauthorized"], "You are not authorized.");

  if (/(forbidden|no permission|403)/.test(low))
    return tAny(t, ["api.forbidden", "api_forbidden"], "You don’t have permission to perform this action.");

  if (/(server error|internal|500|something went wrong)/.test(low))
    return tAny(t, ["api.server_error", "api_server_error"], "Server error. Please try again.");

  if (/(network|timeout|failed to fetch|connection)/.test(low))
    return tAny(t, ["api.network_error", "api_network_error"], "Network error. Check your connection and try again.");

  return m;
}

/* ---- helpers for error classification & localized strings ---- */
function isDuplicateError({ message, fieldErrors, statusCode }) {
  const low = String(message || "").toLowerCase();
  const fieldEmail = String(fieldErrors?.email || "").toLowerCase();
  const fieldPhone = String(fieldErrors?.phone || "").toLowerCase();

  const hasDupKeyword =
    /(already been taken|has already been taken|already exists|is taken|duplicate|registered|conflict)/.test(low) ||
    /(exist|already|taken)/.test(fieldEmail) ||
    /(exist|already|taken)/.test(fieldPhone);

  const is409or422 = Number(statusCode) === 409 || Number(statusCode) === 422;
  return hasDupKeyword || is409or422;
}

function getUserExistsMsg(t, isRTL) {
  return tAny(
    t,
    [
      "api.user_exists",
      "api.user_already_exists",
      "register.user_exists",
      "register_user_exists",
    ],
    isRTL
      ? "هذا الحساب مستخدم بالفعل. يرجى استخدام بريد إلكتروني أو رقم هاتف آخر."
      : "This account is already in use. Please use a different email or phone number."
  );
}

function getInvalidInputMsg(t, isRTL) {
  return tAny(
    t,
    ["api.invalid_input", "api_invalid_input"],
    isRTL ? "بيانات غير صحيحة، يرجى التحقق من المدخلات." : "Invalid data. Please check your inputs."
  );
}

function getRegisterFailedMsg(t, isRTL) {
  return tAny(
    t,
    ["register.failed", "register_failed"],
    isRTL ? "فشلت عملية التسجيل. يرجى التحقق من المدخلات." : "Registration failed. Please check your inputs."
  );
}

/* ---- translate field-level errors with context (email/phone/etc) ---- */
function translateFieldErrors(fe, t) {
  const out = {};
  for (const [field, raw] of Object.entries(fe || {})) {
    const msg = String(raw || "");
    const low = msg.toLowerCase();

    if (/(already been taken|has already been taken|already exists|is taken)/.test(low)) {
      if (field === "email") {
        out[field] = tAny(t, ["api.email_exists", "api_email_exists"], "Email already registered.");
        continue;
      }
      if (field === "phone") {
        out[field] = tAny(t, ["api.phone_exists", "api_phone_exists"], "Phone already registered.");
        continue;
      }
    }
    out[field] = translateApiMessage(msg, t);
  }
  return out;
}

/* ---- create a short toast message from field errors (first 2) ---- */
function summarizeFieldErrors(fe) {
  const parts = Object.values(fe || {}).filter(Boolean);
  if (parts.length === 0) return "";
  return parts.slice(0, 2).join(" • ");
}

/* ---- client-side form validation before submit ---- */
function validateFormValues(form, t, isRTL) {
  const errs = {};
  if (!form.fname.trim()) errs.fname = isRTL ? "الاسم الأول مطلوب." : "First name is required.";
  if (!form.lname.trim()) errs.lname = isRTL ? "اسم العائلة مطلوب." : "Last name is required.";

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    errs.email = isRTL ? "البريد الإلكتروني مطلوب." : "Email is required.";
  } else if (!emailRe.test(form.email.trim())) {
    errs.email = isRTL ? "صيغة البريد الإلكتروني غير صحيحة." : "Invalid email format.";
  }

  if (!form.password.trim()) {
    errs.password = isRTL ? "كلمة المرور مطلوبة." : "Password is required.";
  } else if (form.password.length < 6) {
    errs.password = isRTL ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل." : "Password must be at least 6 characters.";
  }

  const digitsOnly = form.phone.replace(/\D/g, "");
  if (!digitsOnly) {
    errs.phone = isRTL ? "رقم الجوال مطلوب." : "Phone number is required.";
  } else if (digitsOnly.length < 8 || digitsOnly.length > 15) {
    errs.phone = isRTL ? "رقم الجوال يجب أن يكون بين 8 و 15 رقمًا." : "Phone number must be 8–15 digits.";
  }

  return errs;
}

const Register = () => {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const isSubmitDisabled = useMemo(
    () =>
      loading ||
      !form.fname.trim() ||
      !form.lname.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.phone.trim(),
    [loading, form]
  );

  const onChange = (e) => {
    const { id, value } = e.target;
    const nextVal = id === "phone" ? value.replace(/\D/g, "") : value;
    setForm((s) => ({ ...s, [id]: nextVal }));
    setFieldErrors((fe) => ({ ...fe, [id]: "" }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMsg("");

    // 1) Client-side validation
    const clientErrs = validateFormValues(form, t, isRTL);
    if (Object.keys(clientErrs).length > 0) {
      setFieldErrors(clientErrs);
      const summary = summarizeFieldErrors(clientErrs) || getInvalidInputMsg(t, isRTL);
      setApiError(summary);
      toast.error(summary, { theme: "light", style: { color: "#111" }, autoClose: 4000 });
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      // 2) API call
      const fd = new FormData();
      fd.append("fname", form.fname);
      fd.append("lname", form.lname);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("phone", form.phone);

      const resp = await registerApi(fd); // { status, token?, user?, message?, errors? }
      const token = resp?.token;
      const success =
        (resp?.status === "success" || resp?.success === true) &&
        (typeof token === "string" ? token.length > 10 : true);

      if (success) {
        const okMsg = tAny(
          t,
          ["register.success", "register_success"],
          isRTL ? "تم إنشاء الحساب بنجاح." : "Account created successfully."
        );
        setSuccessMsg(okMsg);
        if (token) {
          localStorage.setItem("authToken", token);
          setAuthCookie(token);
        }
        if (resp?.user) localStorage.setItem("authUser", JSON.stringify(resp.user));
        toast.success(okMsg, { theme: "light", style: { color: "#111" }, autoClose: 2200 });
        router.replace("/");
        return;
      }

      // 3) Server returned failure (without throw)
      const { message, fieldErrors: feRaw, statusCode } = normalizeApiErrors(resp);
      const fe = translateFieldErrors(feRaw, t);
      setFieldErrors(fe);

      const fieldSummary = summarizeFieldErrors(fe);
      let msg =
        fieldSummary ||
        (isDuplicateError({ message, fieldErrors: feRaw, statusCode })
          ? getUserExistsMsg(t, isRTL)
          : translateApiMessage(message, t) || "");

      // 👇 اجعل الرسالة الافتراضية دائمًا "الحساب موجود بالفعل" لو كانت الرسالة عامة أو فاضية
      const generic = String(msg || "").trim().toLowerCase();
      if (!generic || /request failed/.test(generic)) {
        msg = getUserExistsMsg(t, isRTL);
      }

      setApiError(msg);
      toast.error(msg, { theme: "light", style: { color: "#111" }, autoClose: 4000 });
    } catch (err) {
      // 4) Thrown errors (network/Axios/etc.)
      const statusCode = err?.response?.status ?? err?.status;
      const serverMsg = err?.response?.data?.message ?? err?.message;
      const serverErrors = err?.response?.data?.errors;

      const { message, fieldErrors: feRaw } = normalizeApiErrors({
        message: serverMsg,
        errors: serverErrors,
        status: statusCode,
      });

      const fe = translateFieldErrors(feRaw, t);
      setFieldErrors(fe);

      const fieldSummary = summarizeFieldErrors(fe);

      let finalMsg =
        fieldSummary ||
        (isDuplicateError({ message, fieldErrors: feRaw, statusCode })
          ? getUserExistsMsg(t, isRTL)
          : translateApiMessage(message, t) || "");

      // 👇 افتراضيًا اعرض "الحساب موجود بالفعل" لو الرسالة عامة/فاضية
      const generic = String(finalMsg || "").trim().toLowerCase();
      if (!generic || /request failed/.test(generic)) {
        finalMsg = getUserExistsMsg(t, isRTL);
      }

      setApiError(finalMsg);
      toast.error(finalMsg, { theme: "light", style: { color: "#111" }, autoClose: 4500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonLayout parent="home" title="register">
      {/* Toasts (مطلوب لظهور التوستس) */}
      <ToastContainer
        position="top-right"
        pauseOnHover
        newestOnTop
        theme="light"
        toastStyle={{ backgroundColor: "#fdfdfd", color: "#111", fontWeight: 500 }}
      />

      <section className="register-page section-b-space">
        <Container>
          <Row>
            <Col lg="12">
              <h3 style={{ textAlign: isRTL ? "right" : "left" }}>
                {tAny(t, ["register.title", "register_title"], "Create Account")}
              </h3>

              {apiError && (
                <Alert color="danger" className="mb-3" style={{ textAlign: isRTL ? "right" : "left" }}>
                  {apiError}
                </Alert>
              )}
              {successMsg && (
                <Alert color="success" className="mb-3" style={{ textAlign: isRTL ? "right" : "left" }}>
                  {successMsg}
                </Alert>
              )}

              <div className="theme-card">
                <Form className="theme-form" onSubmit={handleRegister} noValidate>
                  <Row>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" htmlFor="fname">
                        {tAny(t, ["register.first_name", "register_first_name"], "First Name")}
                      </Label>
                      <Input
                        type="text"
                        className={`form-control ${fieldErrors.fname ? "is-invalid" : ""}`}
                        id="fname"
                        placeholder={tAny(t, ["register.first_name_ph", "register_first_name_ph"], "First Name")}
                        required
                        value={form.fname}
                        onChange={onChange}
                        disabled={loading}
                        aria-invalid={!!fieldErrors.fname}
                      />
                      {fieldErrors.fname && <small className="text-danger">{fieldErrors.fname}</small>}
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label className="form-label" htmlFor="lname">
                        {tAny(t, ["register.last_name", "register_last_name"], "Last Name")}
                      </Label>
                      <Input
                        type="text"
                        className={`form-control ${fieldErrors.lname ? "is-invalid" : ""}`}
                        id="lname"
                        placeholder={tAny(t, ["register.last_name_ph", "register_last_name_ph"], "Last Name")}
                        required
                        value={form.lname}
                        onChange={onChange}
                        disabled={loading}
                        aria-invalid={!!fieldErrors.lname}
                      />
                      {fieldErrors.lname && <small className="text-danger">{fieldErrors.lname}</small>}
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" htmlFor="email">
                        {tAny(t, ["register.email", "register_email"], "Email")}
                      </Label>
                      <Input
                        type="email"
                        className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
                        id="email"
                        placeholder={tAny(t, ["register.email_ph", "register_email_ph"], "Email")}
                        required
                        value={form.email}
                        onChange={onChange}
                        disabled={loading}
                        aria-invalid={!!fieldErrors.email}
                        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                      />
                      {fieldErrors.email && <small className="text-danger">{fieldErrors.email}</small>}
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label className="form-label" htmlFor="password">
                        {tAny(t, ["register.password", "register_password"], "Password")}
                      </Label>
                      <Input
                        type="password"
                        className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
                        id="password"
                        placeholder={tAny(t, ["register.password_ph", "register_password_ph"], "Enter your password")}
                        required
                        value={form.password}
                        onChange={onChange}
                        disabled={loading}
                        aria-invalid={!!fieldErrors.password}
                        minLength={6}
                      />
                      {fieldErrors.password && <small className="text-danger">{fieldErrors.password}</small>}
                    </Col>

                    <Col md="12" className="mb-3">
                      <Label className="form-label" htmlFor="phone">
                        {tAny(t, ["register.phone", "register_phone"], "Phone")}
                      </Label>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className={`form-control ${fieldErrors.phone ? "is-invalid" : ""}`}
                        id="phone"
                        placeholder={tAny(t, ["register.phone_ph", "register_phone_ph"], "Enter your phone")}
                        required
                        value={form.phone}
                        onChange={onChange}
                        disabled={loading}
                        aria-invalid={!!fieldErrors.phone}
                        minLength={8}
                        maxLength={15}
                      />
                      {fieldErrors.phone && <small className="text-danger">{fieldErrors.phone}</small>}
                    </Col>

                    <Col md="12" className="mt-2">
                      <Button
                        type="submit"
                        className="btn btn-solid w-auto"
                        disabled={isSubmitDisabled || loading}
                        aria-busy={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner size="sm" className={isRTL ? "ms-2" : "me-2"} />
                            {tAny(t, ["register.creating", "register_creating"], "Creating...")}
                          </>
                        ) : (
                          tAny(t, ["register.cta", "register_cta"], "Create Account")
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Register;
