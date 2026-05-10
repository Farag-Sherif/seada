// components/shop/filters/Price.jsx
import React, { useState, useContext, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import FilterContext from "../../../helpers/filter/FilterContext";
import { useRouter } from "@/router/useRouter";
import { Collapse } from "reactstrap";
import { useLanguage } from "../../../helpers/Language/useLanguage";

const trSafe = (t, keyOrText, fallback) => {
  if (!keyOrText) return fallback ?? "";
  try {
    const res = t(keyOrText);
    if (res && res !== keyOrText) return res;
    const v1 = t(keyOrText.toLowerCase());
    if (v1 && v1 !== keyOrText.toLowerCase()) return v1;
    return fallback ?? keyOrText;
  } catch {
    return fallback ?? keyOrText;
  }
};

const Price = () => {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(FilterContext);
  const [values, setValues] = useState([0, 500]);
  const price = context.selectedPrice || { min: 0, max: 500 };
  const router = useRouter();
  const setSelectedPrice = context.setSelectedPrice;
  const toggle = () => setIsOpen(!isOpen);
  const [url, setUrl] = useState();

  useEffect(() => {
    const pathname = window.location.pathname;
    setUrl(pathname);
  }, []);

  const priceHandle = (value) => {
    if (value) {
      setSelectedPrice({ min: value[0], max: value[1] });
      setValues(value);
      router.push(
        `${url}?category=${context.state}&brand=${context.selectedBrands}&color=${context.selectedColor}&size=${context.selectedSize}&minPrice=${value[0]}&maxPrice=${value[1]}`,
        undefined,
        { shallow: true }
      );
    }
  };

  const minVal = price.min ?? 0;
  const maxVal = price.max ?? 500;

  return (
    <div className="collection-collapse-block border-0 open" dir={isRTL ? "rtl" : "ltr"}>
      <h3 className="collapse-block-title" onClick={toggle}>
        {trSafe(t, "price", "price")}
      </h3>

      <Collapse isOpen={isOpen}>
        <div className="collection-collapse-block-content">
          <div className="wrapper mt-3">
            <div className="range-slider">
              <Range
                values={values}
                step={10}
                min={0}
                max={500}
                onChange={(val) => priceHandle(val)}
                renderTrack={({ props, children }) => (
                  <div
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    style={{
                      ...props.style,
                      height: "36px",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <output style={{ marginTop: "30px" }}>{values[0]}</output>
                    <div
                      ref={props.ref}
                      style={{
                        height: "5px",
                        width: "100%",
                        borderRadius: "4px",
                        background: getTrackBackground({
                          values,
                          colors: ["#ccc", "#f84c3c", "#ccc"],
                          min: 0,
                          max: 500,
                        }),
                        alignSelf: "center",
                      }}
                    >
                      {children}
                    </div>
                    <output style={{ marginTop: "30px" }}>{values[1]}</output>
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "16px",
                      width: "16px",
                      borderRadius: "60px",
                      backgroundColor: "#f84c3c",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0px 2px 6px #AAA",
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Price;
