// pages/page/account/forget_password.jsx
import React, { useState } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Form, Input, Col, Button, Spinner } from "reactstrap";
import { useLanguage } from "../../../helpers/Language/useLanguage";
import { requestPasswordReset } from "../../../actions/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgetPwd = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warn(t("please_enter_email") || "Please enter your email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(t("invalid_email") || "Invalid email address.");
      return;
    }

    setBusy(true);
    try {
      const res = await requestPasswordReset({ email });
      const ok =
        res?.status === "success" ||
        res?.success === true ||
        /sent|email|reset/i.test(res?.message || "");

      if (ok) {
        toast.success(
          res?.message ||
            t("reset_link_sent_check_email") ||
            "Reset link sent. Please check your email."
        );
        setEmail("");
      } else {
        toast.error(
          res?.message ||
            t("unable_to_request_password_reset") ||
            "Unable to request password reset."
        );
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <CommonLayout parent={t("Home")} title={t("forget_password")}>
      <section className="pwd-page section-b-space">
        <Container>
          <Row>
            <Col lg="6" className="m-auto">
              <h2 className="mb-4">{t("forget_your_password") || "Forgot your password?"}</h2>

              <Form className="theme-form" onSubmit={onSubmit} noValidate>
                <Row className="g-3">
                  <Col md="12">
                    <Input
                      type="email"
                      id="email"
                      placeholder={t("enter_your_email") || "Enter your email"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      disabled={busy}
                    />
                  </Col>

                  <Col md="12">
                    <Button type="submit" className="btn btn-solid w-auto" disabled={busy}>
                      {busy ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          {t("submitting") || "Submitting..."}
                        </>
                      ) : (
                        t("submit") || "Submit"
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>

    </CommonLayout>
  );
};

export default ForgetPwd;
