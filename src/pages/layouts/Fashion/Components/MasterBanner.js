import Link from "@/router/NextLinkCompat";
import { Col, Container, Row } from "reactstrap";
import { useLanguage } from "../../../../helpers/Language/useLanguage";

const MasterBanner = ({ img, title, desc, link, classes, btn, btnClass }) => {
  const { currentLanguage } = useLanguage();
  const fallbackBtn = currentLanguage === "ar" ? "تسوق الآن" : "Shop Now";

  return (
    <div>
      <div
        className={`home ${classes ? classes : "text-center"} banner`}
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay BELOW content */}
        <span className="banner__overlay" />

        <Container>
          <Row>
            <Col>
              {/* content ABOVE overlay */}
              <div className="slider-contain banner__content">
                <div>
                  <h4 style={{ color: "white" }}>{title}</h4>
                  <h1>{desc}</h1>

                  {/* Always navigate to working shop page */}
                  <Link
                    href="/shop/sidebar_popup"
                    className={`btn ${btnClass ? btnClass : "btn-solid"}`}
                  >
                    {btn || fallbackBtn}
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MasterBanner;
