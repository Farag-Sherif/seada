// pages/page/account/login.js 
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
import { useRouter } from "@/router/useRouter";
import Link from "@/router/NextLinkCompat";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { login } from "../../../actions/auth";
import { useLanguage } from "../../../helpers/Language/useLanguage";

/* -------- Small helper to set a non-HttpOnly cookie for proxy auth -------- */
function setAuthCookie(token) {
  try {
    let maxAge = 60 * 60 * 24 * 30;
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

/* -------- normalize backend errors -------- */
function normalizeApiErrors(respLike) {
  const fieldErrors = {};
  const errors = respLike?.errors || respLike?.data?.errors;
  if (errors && typeof errors === "object") {
    for (const [k, v] of Object.entries(errors))
      fieldErrors[k] = Array.isArray(v) ? v.join(" ") : String(v);
  }
  const message =
    respLike?.message ||
    respLike?.error ||
    respLike?.data?.message ||
    respLike?.data?.error ||
    "";
  return { message, fieldErrors };
}

/* ---- translate common backend messages to i18n ---- */
function translateApiMessage(msg, t) {
  const m = String(msg || "").trim();
  if (!m) return "";

  const low = m.toLowerCase();

  if (/(unauthori[sz]ed|not authorized|unauthenticated|invalid token|401)/.test(low))
    return t("api.unauthorized") || "Unauthorized";

  if (/(invalid credentials|wrong email|wrong password|credentials mismatch|incorrect|login failed)/.test(low))
    return t("api.invalid_credentials") || "Invalid email/phone or password";

  if (/(user not found|no such user)/.test(low))
    return t("api.user_not_found") || "User not found";

  if (/(too many|rate limit|many attempts|try again later)/.test(low))
    return t("api.too_many_attempts") || "Too many attempts, please try again later";

  if (/(forbidden|no permission|403)/.test(low))
    return t("api.forbidden") || "You don’t have permission to perform this action";

  if (/(server error|internal|500|something went wrong)/.test(low))
    return t("api.server_error") || "Server error. Please try again";

  if (/(network|timeout|failed to fetch|connection)/.test(low))
    return t("api.network_error") || "Network error. Check your connection";

  return m;
}

const Login = () => {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const [form, setForm] = useState({ email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const isSubmitDisabled = useMemo(
    () =>
      loading ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.phone.trim(),
    [loading, form]
  );

  const onChange = (e) => {
    const { id, value } = e.target;
    const next = id === "phone" ? value.replace(/\D/g, "") : value; // allow digits only for phone
    setForm((s) => ({ ...s, [id]: next }));
    setFieldErrors((fe) => ({ ...fe, [id]: "" }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError(null);
    setFieldErrors({});
    setSuccessMsg("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("phone", form.phone);

      const resp = await login(fd);

      const token = resp?.token;
      const success =
        (resp?.status === "success" || resp?.success === true) &&
        typeof token === "string" &&
        token.length > 10;

      if (success) {
        const user = resp?.user;
        if (token) localStorage.setItem("authToken", token);
        if (user) localStorage.setItem("authUser", JSON.stringify(user));
        if (token) setAuthCookie(token);

        const okMsg = t("login_success") || "Logged in successfully.";
        setSuccessMsg(okMsg);
        toast.success(okMsg, {
          theme: "light",
          style: { color: "#111" },
          autoClose: 2200,
        });

        router.replace("/");
      } else {
        const { message, fieldErrors: fe } = normalizeApiErrors(resp);
        setFieldErrors(fe);
        const rawMsg =
          message ||
          fe?.email ||
          fe?.password ||
          fe?.phone ||
          t("login_failed") ||
          "Invalid credentials.";
        const msg = translateApiMessage(rawMsg, t);
        setApiError(msg);
        toast.error(msg, { theme: "light", style: { color: "#111" } });
      }
    } catch (err) {
      const { message, fieldErrors: fe } = normalizeApiErrors(err);
      const rawMsg =
        err?.message ||
        message ||
        t("something_wrong") ||
        "Something went wrong.";
      const msg = translateApiMessage(rawMsg, t);
      setApiError(msg);
      toast.error(msg, { theme: "light", style: { color: "#111" } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonLayout parent="home" title="login">
      <section
        className="login-page section-b-space"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <Container>
          <Row>
            <Col lg="6">
              <h3 style={{ textAlign: isRTL ? "right" : "left" }}>
                {t("login_title") || "Login"}
              </h3>

              {apiError && (
                <Alert color="danger" className="mb-3">
                  {apiError}
                </Alert>
              )}
              {successMsg && (
                <Alert color="success" className="mb-3">
                  {successMsg}
                </Alert>
              )}

              <div className="theme-card">
                <Form className="theme-form" onSubmit={handleLogin} noValidate>
                  {["email", "password", "phone"].map((field) => (
                    <div className="form-group" key={field}>
                      <Label className="form-label" htmlFor={field}>
                        {t(`${field}_label`) ||
                          field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        type={
                          field === "password"
                            ? "password"
                            : field === "email"
                            ? "email"
                            : "tel"
                        }
                        inputMode={field === "phone" ? "numeric" : undefined}
                        pattern={field === "phone" ? "[0-9]*" : undefined}
                        maxLength={field === "phone" ? 15 : undefined}
                        className={`form-control ${
                          fieldErrors[field] ? "is-invalid" : ""
                        }`}
                        id={field}
                        placeholder={
                          t(`${field}_placeholder`) || `Enter your ${field}`
                        }
                        required
                        value={form[field]}
                        onChange={onChange}
                        disabled={loading}
                      />
                      {fieldErrors[field] && (
                        <small className="text-danger">
                          {fieldErrors[field]}
                        </small>
                      )}
                    </div>
                  ))}

                  <Button
                    type="submit"
                    color="primary"
                    className="btn btn-solid w-auto"
                    disabled={isSubmitDisabled}
                    aria-busy={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />{" "}
                        {t("creating") || "Logging in..."}
                      </>
                    ) : (
                      t("login_btn") || "Login"
                    )}
                  </Button>
                </Form>
              </div>
            </Col>

            <Col lg="6" className="right-login">
              <h3 style={{ textAlign: isRTL ? "right" : "left" }}>
                {t("new_customer") || "New Customer"}
              </h3>
              <div className="theme-card authentication-right">
                <h6
                  className="title-font"
                  style={{ textAlign: isRTL ? "right" : "left" }}
                >
                  {t("create_account") || "Create An Account"}
                </h6>
                <p style={{ textAlign: isRTL ? "right" : "left" }}>
                  {t("create_account_desc") ||
                    "Sign up for a free account at our store. Registration is quick and easy. It allows you to order from our shop."}
                </p>
                <Link href="/page/account/register" className="btn btn-solid">
                  {t("create_account_btn") || "Create an Account"}
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Login;
