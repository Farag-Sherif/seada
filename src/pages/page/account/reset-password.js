// pages/page/account/reset-password.jsx
import React, { useEffect, useState } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Col, Form, Input, Button, Spinner } from "reactstrap";
import { useLanguage } from "../../../helpers/Language/useLanguage";
import { resetPassword } from "../../../actions/auth";
import { useRouter } from "@/router/useRouter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query || {};
    if (q.token) setToken(String(q.token));
    if (q.email) setEmail(String(q.email));
  }, [router.isReady]); // eslint-disable-line

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !token) {
      toast.error(t("missing_token_or_email") || "Missing token or email.");
      return;
    }
    if (!password || password.length < 6) {
      toast.error(t("password_min") || "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error(t("passwords_not_match") || "Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const res = await resetPassword({
        email,
        token,
        password,
        password_confirmation: confirm,
      });

      const ok =
        res?.status === "success" ||
        res?.success === true ||
        /reset|updated|success/i.test(res?.message || "");

      if (ok) {
        toast.success(res?.message || t("password_updated") || "Password updated.");
        // optionally redirect to login
        setTimeout(() => router.push("/page/account/login"), 1200);
      } else {
        toast.error(res?.message || t("error") || "Error");
      }
    } catch (err) {
      toast.error(err?.message || t("error") || "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <CommonLayout parent={t("Home")} title={t("reset_password") || "Reset password"}>
      <section className="section-b-space">
        <Container>
          <Row>
            <Col lg="6" className="m-auto">
              <h2 className="mb-4">{t("reset_password") || "Reset password"}</h2>

              <Form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">{t("email") || "Email"}</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={busy}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="token" className="form-label">Token</label>
                  <Input
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    disabled={busy}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">{t("new_password") || "New password"}</label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={busy}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirm" className="form-label">{t("confirm_password") || "Confirm password"}</label>
                  <Input
                    id="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    disabled={busy}
                  />
                </div>

                <Button type="submit" className="btn btn-solid" disabled={busy}>
                  {busy ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      {t("saving") || "Saving..."}
                    </>
                  ) : (
                    t("save") || "Save"
                  )}
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>

 
    </CommonLayout>
  );
};

export default ResetPassword;
