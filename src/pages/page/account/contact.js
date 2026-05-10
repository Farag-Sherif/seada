import React, { useEffect, useMemo, useState, useCallback } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Col, Form, Label, Input } from "reactstrap";
import { sendContact, getSettings } from "./../../../actions/main";
import { useLanguage } from "../../../helpers/Language/useLanguage";

// Toasts
import { ToastContainer, toast } from "react-toastify";
import StyleTag from "@/styles/StyleTag";
// import "react-toastify/dist/ReactToastify.css";

/** i18n helpers */
const trSafe = (t, keyOrText) => {
  if (!keyOrText) return "";
  try {
    const res = t(keyOrText);
    return !res || res === keyOrText ? keyOrText : res;
  } catch {
    return keyOrText;
  }
};
const trOr = (t, key, fallback) => {
  const v = trSafe(t, key);
  return v === key ? fallback : v;
};

/** string helpers */
const pickStr = (v) =>
  typeof v === "string"
    ? v
    : v == null
    ? ""
    : String(v?.value ?? v?.name ?? v?.title ?? v?.text ?? "");

/** --------- Map helpers --------- */
/** returns a safe html string of <iframe ...> ... </iframe> */
const ensureIframeHtml = (value) => {
  const fallback =
    '<iframe title="store-map" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1605.811957341231!2d25.45976406005396!3d36.3940974010114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1550912388321" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" style="width:100%;height:380px;border:0;"></iframe>';

  if (!value || typeof value !== "string") return fallback;

  const trimmed = value.trim();
  // If backend already sends full iframe HTML, just use it.
  if (/^<iframe[\s\S]*<\/iframe>$/.test(trimmed)) {
    return trimmed.includes("style=")
      ? trimmed
      : trimmed.replace(
          /^<iframe/i,
          '<iframe style="width:100%;height:380px;border:0;"'
        );
  }
  // If backend sends only src/URL, build an iframe around it.
  return `<iframe title="store-map" src="${trimmed}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" style="width:100%;height:380px;border:0;"></iframe>`;
};

/* ---------------- UI bits ---------------- */
const ContactDetail = ({ icon, title, desc1, desc2 }) => (

     <div className="contact-card" tabIndex={0}>
    <div className="contact-card__icon">
      <i className={`fa ${icon}`} aria-hidden="true" />
    </div>

    <div className="contact-card__title">{title}</div>

    <div className="contact-card__value">
      {desc1}
      {desc2 ? <><br />{desc2}</> : null}
    </div>
  </div>

 
);



const Contact = () => {
  const { t, isRTL } = useLanguage();

  /* --------------- single API call (getSettings) --------------- */
  const [loading, setLoading] = useState(true);
  const [mapHtml, setMapHtml] = useState("");
  const [phones, setPhones] = useState([]);
  const [emails, setEmails] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getSettings(); // shape as provided in the message
        // support both {settings, mobiles, emails, addresse} and nested under data
        const root = res?.data?.settings ? res.data : res;
        const settings = root?.settings ?? {};
        const mobilesArr = Array.isArray(root?.mobiles) ? root.mobiles : [];
        const emailsArr = Array.isArray(root?.emails) ? root.emails : [];

        // map
        const loc = settings?.location_url;
        if (alive) setMapHtml(ensureIframeHtml(loc));

        // phones
        const phoneList = mobilesArr.map((m) => pickStr(m?.mobile)).filter(Boolean);
        if (alive) setPhones(phoneList);

        // emails
        const emailList = emailsArr.map((e) => pickStr(e?.email)).filter(Boolean);
        if (alive) setEmails(emailList);

        // addresses
        const addr = pickStr(root?.addresse) || pickStr(settings?.addresse) || "";
        const addrList = addr ? [addr] : [];
        if (alive) setAddresses(addrList);
      } catch {
        if (alive) {
          setMapHtml(ensureIframeHtml(null));
          setPhones([]);
          setEmails([]);
          setAddresses([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Info boxes
  const boxes = useMemo(
    () => [
      {
        icon: "fa-phone",
        title: trOr(t, "contact.section.contact", "Contact"),
        desc1: phones[0] || "+00 000 - 000 - 0000",
        desc2: phones[1] || "",
      },
      {
        icon: "fa-map-marker",
        title: trOr(t, "contact.section.address", "Address"),
        desc1: addresses[0] || trOr(t, "contact.address_line1", "Your address here"),
        desc2: addresses[1] || "",
      },
      {
        icon: "fa-envelope-o",
        title: trOr(t, "contact.section.email", "Email"),
        desc1: emails[0] || "info@example.com",
        desc2: emails[1] || "",
      },
    ],
    [t, phones, emails, addresses]
  );

  /* ---------------- form ---------------- */
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = useCallback(
    (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value })),
    []
  );

 const onSubmit = async (e) => {
  e.preventDefault();
  if (submitting) return;

  const name = `${form.firstName} ${form.lastName}`.replace(/\s+/g, " ").trim();
  const subject =
    form.subject?.trim() ||
    trOr(t, "contact.form.default_subject", "Contact form message");

  const message = `Phone: ${form.phone || "-"}\n\n${form.message || ""}`;
  const payload = {
    name: name || form.firstName || form.lastName || "User",
    email: form.email,
    subject,
    message,
  };

  try {
    setSubmitting(true);
    await toast.promise(sendContact(payload), {
      pending: trOr(t, "contact.form.sending", "Sending…"),
      success: trOr(t, "contact.form.success", "Message sent successfully"),
      error: {
        render({ data }) {
          const e = data;
          return (
            e?.response?.data?.message ||
            e?.message ||
            trOr(t, "contact.form.error", "Failed to send message")
          );
        },
      },
    });

    // Reset form after successful submission
    setForm({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    });
  } finally {
    setSubmitting(false);
  }
};


  const pageTitle = trOr(t, "contact.title", "Contact");
  const parentCrumb = trOr(t, "Home", "Home");
  const toastPosition = isRTL ? "top-left" : "top-right";

  return (
    <CommonLayout parent={parentCrumb} title={pageTitle}>
      <ToastContainer position={toastPosition} rtl={isRTL} theme="colored" autoClose={3500} />

     <section
  className="contact-page section-b-space contact-modern"
  dir={isRTL ? "rtl" : "ltr"}>
        <Container>
          {/* Top: Full-width map */}
          <Row className="section-b-space">
            <Col xs="12">
              <div
                className="map"
                aria-busy={loading}
                dangerouslySetInnerHTML={{ __html: mapHtml || ensureIframeHtml(null) }}
              />
            </Col>
          </Row>

          {/* Under the map: 3 cards (phone / address / email) */}
          <Row className="g-3 g-md-4 mb-4 info-row">
            {boxes.map((b, i) => (
              <Col key={i} xs="12" md="4">
                <ContactDetail icon={b.icon} title={b.title} desc1={b.desc1} desc2={b.desc2} />
              </Col>
            ))}
          </Row>

          {/* Form */}
          <Row>
            <Col sm="12">
              <Form className="theme-form" onSubmit={onSubmit}>
                <Row>
                  <Col md="6">
                    <Label className="form-label" htmlFor="firstName">
                      {trOr(t, "contact.form.first_name", "First name")}
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="form-control"
                      placeholder={trOr(t, "contact.form.first_name_placeholder", "Enter your first name")}
                      value={form.firstName}
                      onChange={onChange}
                      required
                    />
                  </Col>

                  <Col md="6">
                    <Label className="form-label" htmlFor="lastName">
                      {trOr(t, "contact.form.last_name", "Last name")}
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="form-control"
                      placeholder={trOr(t, "contact.form.last_name_placeholder", "Enter your last name")}
                      value={form.lastName}
                      onChange={onChange}
                      required
                    />
                  </Col>

                  <Col md="6">
                    <Label className="form-label" htmlFor="phone">
                      {trOr(t, "contact.form.phone", "Phone")}
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      className="form-control"
                      placeholder={trOr(t, "contact.form.phone_placeholder", "Enter your phone")}
                      value={form.phone}
                      onChange={onChange}
                    />
                  </Col>

                  <Col md="6">
                    <Label className="form-label" htmlFor="email">
                      {trOr(t, "contact.form.email", "Email")}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder={trOr(t, "contact.form.email_placeholder", "Enter your email")}
                      value={form.email}
                      onChange={onChange}
                      required
                    />
                  </Col>

                  <Col md="12">
                    <Label className="form-label" htmlFor="subject">
                      {trOr(t, "contact.form.subject", "Subject")}
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      className="form-control"
                      placeholder={trOr(t, "contact.form.subject_placeholder", "How can we help?")}
                      value={form.subject}
                      onChange={onChange}
                      required
                    />
                  </Col>

                  <Col md="12">
                    <Label className="form-label" htmlFor="message">
                      {trOr(t, "contact.form.message", "Message")}
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-control"
                      rows="6"
                      placeholder={trOr(t, "contact.form.message_placeholder", "Write your message here…")}
                      value={form.message}
                      onChange={onChange}
                      required
                    />
                  </Col>

                  <Col md="12">
                    <button className="btn btn-solid" type="submit" disabled={submitting} aria-busy={submitting}>
                      {submitting
                        ? trOr(t, "contact.form.sending", "Sending…")
                        : trOr(t, "contact.form.submit", "Send Message")}
                    </button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
<StyleTag global css={`
  /* ===== contact section (green theme) ===== */
  .contact-modern { --cm-primary: #0b6b37; }

  .contact-modern .map iframe{
    width:100%; height:420px; border:0; display:block;
    border-radius:16px; box-shadow:0 1px 2px rgba(16,24,40,.06);
  }

  .contact-modern .info-row{ row-gap:18px; margin-top:8px; }

  .contact-modern .contact-card{
    position:relative; height:100%;
    padding:18px 20px 20px;
    border-radius:16px; border:1px solid #e6e8ee; background:#fff;
    box-shadow:0 1px 2px rgba(16,24,40,.06);
    text-align:center; transition:transform .18s, box-shadow .18s, border-color .18s;
  }

  .contact-modern .contact-card::before{
    content:""; position:absolute; left:0; right:0; top:0; height:3px;
    background:linear-gradient(135deg, color-mix(in srgb, var(--cm-primary) 20%), var(--cm-primary));
    border-radius:16px 16px 0 0;
  }

  .contact-modern .contact-card:hover,
  .contact-modern .contact-card:focus{
    transform:translateY(-3px);
    box-shadow:0 10px 30px rgba(16,24,40,.12);
    border-color:color-mix(in srgb, var(--cm-primary) 28%, #ffffff);
    outline:none;
  }

  .contact-modern .contact-card__icon{
    width:54px;height:54px;margin:4px auto 10px;border-radius:14px; display:grid;place-items:center;
    background:
      linear-gradient(#fff,#fff) padding-box,
      linear-gradient(135deg, color-mix(in srgb, var(--cm-primary) 20%), var(--cm-primary)) border-box;
    border:1px solid transparent;
  }
  .contact-modern .contact-card__icon i{ font-size:20px; color:var(--cm-primary); }

  .contact-modern .contact-card__title{ margin:0 0 6px; font-weight:700; font-size:15px; color:#111827; }
  .contact-modern .contact-card__value{ margin:0; color:#5b6472; line-height:1.45; word-break:break-word; }

  @media (max-width:420px){
    .contact-modern .contact-card{ padding:16px; }
    .contact-modern .contact-card__icon{ width:48px; height:48px; }
  }

  /* optional dark mode */
  html.dark .contact-modern .contact-card{ background:#0b1220; border-color:#1c2434; }
  html.dark .contact-modern .contact-card__title{ color:#e5e7eb; }
  html.dark .contact-modern .contact-card__value{ color:#aeb7c6; }
`} />


    </CommonLayout>
  );
};

export default Contact;
