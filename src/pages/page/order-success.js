// pages/order-success.jsx (or wherever this file lives)
import React, { useContext } from "react";
import CommonLayout from "../../components/shop/common-layout";
import { Container, Row, Col, Media } from "reactstrap";
import one from "@/assets/images/pro3/1.jpg"; // (kept as in your original)
import CartContext from "../../helpers/cart";
import { CurrencyContext } from "../../helpers/Currency/CurrencyContext";
import { useLanguage } from "../../helpers/Language/useLanguage";

const OrderSuccess = () => {
  const cartContext = useContext(CartContext);
  const cartItems = cartContext?.state || [];
  const cartTotal = cartContext?.cartTotal || 0;

  const curContext = useContext(CurrencyContext);
  const symbol = curContext?.state?.symbol || "$";

  const { t, isRTL } = useLanguage();

  // Safe translator with fallback text
  const tt = (key, fallback) => {
    try {
      const v = t?.(key);
      return typeof v === "string" ? v : fallback;
    } catch {
      return fallback;
    }
  };

  return (
    <CommonLayout parent={tt("Home", "Home")} title={tt("order_success.title", "order success")}>
      <section className="section-b-space light-layout white-1" dir={isRTL ? "rtl" : "ltr"}>
        <Container>
          <Row>
            <Col md="12">
              <div className="success-text">
                <i className="fa fa-check-circle" aria-hidden="true" />
                <h2>{tt("order_success.thank_you", "thank you")}</h2>
                <p>
                  {tt(
                    "order_success.payment_success",
                    "Payment is successfully processed and your order is on the way"
                  )}
                </p>
                <p>
                  {tt("order_success.transaction_id", "Transaction ID")}:267676GHERT105467
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-b-space" dir={isRTL ? "rtl" : "ltr"}>
        <Container>
          <Row>
            <Col lg="6">
              <div className="product-order">
                <h3>{tt("order_success.your_order_details", "your order details")}</h3>

                {cartItems.map((item, i) => (
                  <Row className="product-order-detail" key={i}>
                    <Col xs="3">
                      <Media
                        src={item?.images?.[0]?.src}
                        alt=""
                        className="img-fluid blur-up lazyload"
                      />
                    </Col>
                    <Col xs="3" className="order_detail">
                      <div>
                        <h4>{tt("order_success.product_name", "product name")}</h4>
                        <h5>{item?.title}</h5>
                      </div>
                    </Col>
                    <Col xs="3" className="order_detail">
                      <div>
                        <h4>{tt("order_success.quantity", "quantity")}</h4>
                        <h5>{item?.qty}</h5>
                      </div>
                    </Col>
                    <Col xs="3" className="order_detail">
                      <div>
                        <h4>{tt("order_success.price", "price")}</h4>
                        <h5>
                          {symbol}
                          {item?.price}
                        </h5>
                      </div>
                    </Col>
                  </Row>
                ))}

                <div className="total-sec">
                  <ul>
                    <li>
                      {tt("order_success.subtotal", "subtotal")}{" "}
                      <span>
                        {symbol}
                        {cartTotal}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="final-total">
                  <h3>
                    {tt("order_success.total", "total")}{" "}
                    <span>
                      {symbol}
                      {cartTotal}
                    </span>
                  </h3>
                </div>
              </div>
            </Col>

            <Col lg="6">
              <Row className="order-success-sec">
                <Col sm="6">
                  <h4>{tt("order_success.summary", "summary")}</h4>
                  <ul className="order-detail">
                    <li>
                      {tt("order_success.order_id", "order ID")}: 5563853658932
                    </li>
                    <li>
                      {tt("order_success.order_date", "Order Date")}: October 22, 2023
                    </li>
                    <li>
                      {tt("order_success.order_total", "Order Total")}: $907.28
                    </li>
                  </ul>
                </Col>

                <Col sm="6">
                  <h4>{tt("order_success.shipping_address", "shipping address")}</h4>
                  <ul className="order-detail">
                    <li>gerg harvell</li>
                    <li>568, suite ave.</li>
                    <li>Austrlia, 235153</li>
                    <li>{tt("order_success.contact_no", "Contact No.")} 987456321</li>
                  </ul>
                </Col>

                <Col sm="12" className="payment-mode">
                  <h4>{tt("order_success.payment_method", "payment method")}</h4>
                  <p>
                    {tt(
                      "order_success.payment_note",
                      "Pay on Delivery (Cash/Card). Cash on delivery (COD) available. Card/Net banking acceptance subject to device availability."
                    )}
                  </p>
                </Col>

                <Col md="12">
                  <div className="delivery-sec">
                    <h3>{tt("order_success.expected_delivery", "expected date of delivery")}</h3>
                    <h2>{tt("order_success.expected_date_value", "october 22, 2023")}</h2>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default OrderSuccess;
