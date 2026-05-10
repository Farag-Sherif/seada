import React, { useContext, useState } from "react";
import Link from "@/router/NextLinkCompat";
import { useRouter } from "@/router/useRouter";
import { Row, Col, Media, Modal, ModalBody } from "reactstrap";
import CartContext from "../../../helpers/cart";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import MasterProductDetail from "./MasterProductDetail";
import { useLanguage } from "../../../helpers/Language/useLanguage";

// actions
import { addToCart as addToCartAction } from "../../../actions/cart";
import { toggleFavorite } from "../../../actions/products";

const ProductItem = ({
  product,
  addCart,        // optional legacy prop
  backImage,
  des,
  addWishlist,    // optional legacy prop
  cartClass = "cart-info cart-wrap",
  productDetail,
  addCompare,     // optional legacy prop
  title,
}) => {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const cartContext = useContext(CartContext);
  const curContext = useContext(CurrencyContext);
  const currency = curContext.state;

  const { plusQty, minusQty, quantity, setQuantity } = cartContext;

  const [image, setImage] = useState("");
  const [modal, setModal] = useState(false);
  const [modalCompare, setModalCompare] = useState(false);
  const [isFav, setIsFav] = useState(!!(product?.is_favorite ?? product?.raw?.is_favorite));

  const toggle = () => setModal((v) => !v);
  const toggleCompare = () => setModalCompare((v) => !v);

  const uniqueTags = [];

  const onClickHandle = (img) => setImage(img);
  const changeQty = (e) => setQuantity(parseInt(e.target.value || "0", 10) || 0);

  const clickProductDetail = () => {
    const titleProps = (product.title || "").split(" ").join("");
    router.push(`/product-details/${product.id}-${titleProps}`);
  };

  const variantChangeByColor = (imgId, product_images) => {
    product_images.forEach((data) => {
      if (String(data.image_id) === String(imgId)) setImage(data.src);
    });
  };

  const handleAddToCart = async (e) => {
    if (e) e.preventDefault();
    try {
      if (typeof addCart === "function") {
        await addCart(product);
      } else {
        await addToCartAction(product.id, quantity || 1, "");
        cartContext?.refetch?.();
      }
      if (modal) setModal(false);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  const onToggleFav = async (e) => {
    if (e) e.preventDefault();
    const prev = isFav;
    setIsFav(!prev); // optimistic
    try {
      const res = await toggleFavorite(product.id, prev);
      setIsFav(res.is_fav);
      if (typeof addWishlist === "function") addWishlist(product);
    } catch (err) {
      setIsFav(prev); // rollback
      console.error("favorite failed", err);
    }
  };

  return (
    <div className="product-box product-wrap">
      <div className="img-wrapper">
        <div className="lable-block">
          {product.new ? <span className="lable3">new</span> : null}
          {product.sale ? <span className="lable4">on sale</span> : null}
        </div>

        <div className="front" onClick={clickProductDetail}>
          <Media
            src={image || product.images?.[0]?.src}
            className="img-fluid"
            alt={product.title || ""}
          />
        </div>

        {backImage ? (
          product.images?.[1] ? (
            <div className="back" onClick={clickProductDetail}>
              <Media
                src={image || product.images?.[1]?.src}
                className="img-fluid m-auto"
                alt={product.title || ""}
              />
            </div>
          ) : null
        ) : null}

        <div className={cartClass}>
          <button title="Add to cart" onClick={handleAddToCart}>
            <i className="fa fa-shopping-cart" aria-hidden="true" />
          </button>

          <a href="#" title="Wishlist" onClick={onToggleFav}>
            <i className={`fa ${isFav ? "fa-heart" : "fa-heart-o"}`} aria-hidden="true" />
          </a>

          <a href="#" title="Quick View" onClick={(e) => { e.preventDefault(); toggle(); }}>
            <i className="fa fa-search" aria-hidden="true" />
          </a>

          <a href="#" title="Compare" onClick={(e) => { e.preventDefault(); toggleCompare(); }}>
            <i className="fa fa-refresh" aria-hidden="true" />
          </a>

          <Modal isOpen={modalCompare} toggle={toggleCompare} size="lg" centered>
            <ModalBody>
              <Row className="compare-modal">
                <Col lg="12">
                  <div className="media">
                    <Media
                      src={(product.variants && image) ? image : product.images?.[0]?.src}
                      alt=""
                      className="img-fluid"
                    />
                    <div className="media-body align-self-center text-center">
                      <h5 style={{ direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" }}>
                        <i className="fa fa-check" /> <span>{product.title}</span>
                        <span> {t("item_successfully_added")}</span>
                      </h5>
                      <div className="buttons d-flex justify-content-center">
                        <Link href="/page/compare">
                          <button className="btn-sm btn-solid" onClick={() => addCompare?.(product)}>
                            {t("view_compare_list")}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </div>

        {Array.isArray(product.images) && product.images.length ? (
          <ul className="product-thumb-list">
            {product.images.map((img, i) => (
              <li className={`grid_thumb_img ${img.src === image ? "active" : ""}`} key={i}>
                <a href="#" onClick={(e) => { e.preventDefault(); onClickHandle(img.src); }}>
                  <Media src={img.src} alt="thumb" />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <MasterProductDetail
        product={product}
        productDetail={productDetail}
        currency={currency}
        uniqueTags={[]}
        title={title}
        des={des}
        variantChangeByColor={variantChangeByColor}
      />

      {/* Quick View */}
      <Modal isOpen={modal} toggle={toggle} className="modal-lg quickview-modal" centered>
        <ModalBody>
          <Row>
            <Col lg="6" xs="12">
              <div className="quick-view-img">
                <Media
                  src={(product.variants && image) ? image : product.images?.[0]?.src}
                  alt=""
                  className="img-fluid"
                />
              </div>
            </Col>

            <Col lg="6" className="rtl-text">
              <div className="product-right">
                <button
                  type="button"
                  data-dismiss="modal"
                  className="btn-close btn btn-secondary"
                  aria-label="Close"
                  onClick={toggle}
                />
                <h2>{product.title}</h2>
                <h3>
                  {currency.symbol}
                  {(Number(product.price) * Number(currency.value || 1)).toFixed(2)}
                </h3>

                <div
                  className="border-product"
                  style={{ direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" }}
                >
                  <h6 className="product-title">{t("product_details")}</h6>
                  <p>{product.description}</p>
                </div>

                <div className="product-description border-product">
                  {product.size ? (
                    <div className="size-box">
                      <ul>
                        {product.size.map((size, i) => (
                          <li key={i}>
                            <a href="#" onClick={(e)=>e.preventDefault()}>{size}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <h6 className="product-title">quantity</h6>
                  <div className="qty-box">
                    <div className="input-group">
                      <span className="input-group-prepend">
                        <button
                          type="button"
                          className="btn quantity-left-minus"
                          onClick={minusQty}
                          data-type="minus"
                          data-field=""
                        >
                          <i className="fa fa-angle-left" />
                        </button>
                      </span>
                      <input
                        type="text"
                        name="quantity"
                        value={quantity}
                        onChange={changeQty}
                        className="form-control input-number"
                      />
                      <span className="input-group-prepend">
                        <button
                          type="button"
                          className="btn quantity-right-plus"
                          onClick={() => plusQty(product)}
                          data-type="plus"
                          data-field=""
                        >
                          <i className="fa fa-angle-right" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="product-buttons">
                  <button className="btn btn-solid" onClick={handleAddToCart}>
                    {t("add_to_cart") || "add to cart"}
                  </button>
                  <button className="btn btn-solid" onClick={clickProductDetail}>
                    {t("view_detail") || "View detail"}
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ProductItem;
