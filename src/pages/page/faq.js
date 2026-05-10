import React, { useState } from "react";
import CommonLayout from "../../components/shop/common-layout";
import {
  Collapse,
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import { useLanguage } from "../../helpers/Language/useLanguage";

const getFaqData = (t) => [
  {
    qus: t('faq_q1'),
    ans: t('faq_answer'),
  },
  {
    qus: t('faq_q2'),
    ans: t('faq_answer'),
  },
  {
    qus: t('faq_q3'),
    ans: t('faq_answer'),
  },
  {
    qus: t('faq_q4'),
    ans: t('faq_answer'),
  },
  {
    qus: t('faq_q5'),
    ans: t('faq_answer'),
  },
  {
    qus: t('faq_q6'),
    ans: t('faq_answer'),
  },
];

const FaqList = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  return (
    <Card>
      <CardHeader id="headingOne">
        <h5 className="mb-0">
          <button
            className="btn btn-link"
            type="button"
            onClick={toggle}
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            {faq.qus}
          </button>
        </h5>
      </CardHeader>
      <Collapse
        isOpen={isOpen}
        id="collapseOne"
        className="collapse"
        aria-labelledby="headingOne"
        data-parent="#accordionExample"
      >
        <div className="card-body">
          <p>{faq.ans}</p>
        </div>
      </Collapse>
    </Card>
  );
};

const FaqPage = () => {
  const { t, isRTL } = useLanguage();
  const faqData = getFaqData(t);

  return (
    <>
      <CommonLayout parent="home" title="faq">
        <section className="faq-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <div className="text-center mb-4">
                  <h2 style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('faq_title')}</h2>
                </div>
                <div
                  className="accordion theme-accordion"
                  id="accordionExample"
                  style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                >
                  {faqData.map((faq, i) => (
                    <FaqList faq={faq} key={i} />
                  ))}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </CommonLayout>
    </>
  );
};

export default FaqPage;
