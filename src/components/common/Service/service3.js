import React, { Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import {
  svgFreeShipping,
  svgservice,
  svgoffer,
  svgpayment,
} from "../../../services/script";
import MasterServiceContent from "./MasterServiceConternt";
import { useLanguage } from "../../../helpers/Language/useLanguage";

const getServiceData = (t) => [
  {
    link: svgFreeShipping,
    title: t('free_shipping'),
    service: t('free_shipping_worldwide'),
  },
  {
    link: svgservice,
    title: t('24x7_service'),
    service: t('online_service_24x7'),
  },
  {
    link: svgoffer,
    title: t('festival_offer'),
    service: t('new_online_special_festival_offer'),
  },
  {
    link: svgpayment,
    title: t('online_payment'),
    service: t('new_online_special_festival_offer'),
  },
];

const Service = ({ layoutClass, hrLine }) => {
  const { t, isRTL } = useLanguage();
  const serviceData = getServiceData(t);
  
  return (
    <Fragment>
      <section className={layoutClass} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <Container className="absolute-bg">
          <div className="service p-0 ">
            <Row>
              {serviceData.map((data, i) => {
                return (
                  <Col
                    key={i}
                    lg="3"
                    sm="6"
                    className={` ${
                      hrLine ? "service-block1" : "service-block"
                    }`}
                  >
                    <MasterServiceContent
                      link={data.link}
                      title={data.title}
                      service={data.service}
                      hrLine={hrLine}
                    />
                  </Col>
                );
              })}
            </Row>
          </div>
        </Container>
      </section>
    </Fragment>
  );
};

export default Service;
