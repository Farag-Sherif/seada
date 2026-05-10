import React, { Fragment, useEffect, useState } from "react";
import { Container, Row, Col, Media } from "reactstrap";
import { useLanguage } from "../../../../helpers/Language/useLanguage";
import { getSettings } from "../../../../actions/main";

/* helpers */
const pickTr = (settings, isRTL, key) => {
  if (!settings) return undefined;
  const tr = settings.translations?.find(
    (x) => x?.locale === (isRTL ? "ar" : "en")
  );
  return tr?.[key] ?? settings[key];
};

const AboutUs = () => {
  const { t, isRTL } = useLanguage();

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  /* fetch from /settings */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getSettings();
        // endpoint may return { settings, ... } or the settings object directly
        const s = res?.settings ?? res;
        console.log(res)
        if (mounted) setSettings(s);
      } catch (e) {
        if (mounted) setSettings(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* derive UI fields with robust fallbacks */
  const smallTitle =
    pickTr(settings, isRTL, "about_section_sub_title") ||
    (isRTL ? "من نحن" : "About Us");

  const bigTitle =
    pickTr(settings, isRTL, "about_section_title") ||
    t("welcome_multi_store");

  const intro =
    pickTr(settings, isRTL, "about_section_introduction") ||
    pickTr(settings, isRTL, "about_us") ||
    t("lorem_about_text");

  const vision = pickTr(settings, isRTL, "about_section_vision");
  const apart = pickTr(settings, isRTL, "about_section_apart");
  const commitment = pickTr(settings, isRTL, "about_section_commitment");

  const imageSrc =
    settings?.about_section_image_path ||
    settings?.banner_image_path ||
    settings?.image_logo_path ||
    "";

  return (
    <Fragment>
      <section>
        <Container>
          <Row className="align-items-center">
            {/* Optional image (shown when available) */}
            {imageSrc ? (
              <Col lg="5" className="mb-4 mb-lg-0">
                <Media
                  src={imageSrc}
                  className="img-fluid rounded-3"
                  alt={smallTitle}
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              </Col>
            ) : null}

            <Col lg={imageSrc ? "7" : "8"} className={imageSrc ? "" : "m-auto"}>
              <div className="title3">
                <h4 style={{ textAlign: isRTL ? "right" : "left" }}>
                  {loading ? "…" : smallTitle}
                </h4>
                <h2
                  className="title-inner3"
                  style={{ textAlign: isRTL ? "right" : "left" }}
                >
                  {loading ? "…" : bigTitle}
                </h2>
                <div className="line" />
              </div>

              <div
                className="about-text"
                style={{
                  direction: isRTL ? "rtl" : "ltr",
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                <p>{loading ? "…" : intro}</p>

                {/* extra bullets if present in API */}
                {(vision || apart || commitment) && (
                  <ul style={{ marginTop: 12 }}>
                    {vision && <li>{vision}</li>}
                    {apart && <li>{apart}</li>}
                    {commitment && <li>{commitment}</li>}
                  </ul>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Fragment>
  );
};

export default AboutUs;
