// components/shop/filters/Size.jsx
import React, { useState, useContext } from "react";
import { Collapse, Input } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
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

const Size = () => {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const fc = useContext(FilterContext);

  // read current range safely
  const currentMin = fc?.selectedWeightRange?.min ?? "";
  const currentMax = fc?.selectedWeightRange?.max ?? "";

  const [minWeight, setMinWeight] = useState(currentMin);
  const [maxWeight, setMaxWeight] = useState(currentMax);

  const toggle = () => setIsOpen((v) => !v);

  const apply = () => {
    // push to context (numbers or undefined if empty)
    fc?.setSelectedWeightRange?.({
      min: minWeight === "" ? undefined : Number(minWeight),
      max: maxWeight === "" ? undefined : Number(maxWeight),
    });
  };

  const clear = () => {
    setMinWeight("");
    setMaxWeight("");
    fc?.setSelectedWeightRange?.({ min: undefined, max: undefined });
  };

  return (
    <div className="collection-collapse-block border-0 open" dir={isRTL ? "rtl" : "ltr"}>
      <h3 className="collapse-block-title" onClick={toggle}>
        {/* label kept under "Weight" to replace old "Size" */}
        {trSafe(t, "weight", isRTL ? "الوزن" : "Weight")}
      </h3>

      <Collapse isOpen={isOpen}>
        <div className="collection-collapse-block-content">
          <div className="collection-size-filter" style={{ display: "grid", gap: 8 }}>
            <div className="d-flex align-items-center" style={{ gap: 8 }}>
              <label className="mb-0" style={{ minWidth: 60 }}>
                {trSafe(t, "Minimum", isRTL ? "الأدنى" : "Minimum")}
              </label>
              <Input
                type="number"
                min="0"
                placeholder={isRTL ? "أدخل الوزن" : "Enter weight"}
                value={minWeight}
                onChange={(e) => setMinWeight(e.target.value)}
              />
              <span className="text-muted">{isRTL ? "جرام" : "g"}</span>
            </div>

            <div className="d-flex align-items-center" style={{ gap: 8 }}>
              <label className="mb-0" style={{ minWidth: 60 }}>
                {trSafe(t, "max", isRTL ? "الأقصى" : "Max")}
              </label>
              <Input
                type="number"
                min="0"
                placeholder={isRTL ? "أدخل الوزن" : "Enter weight"}
                value={maxWeight}
                onChange={(e) => setMaxWeight(e.target.value)}
              />
              <span className="text-muted">{isRTL ? "جرام" : "g"}</span>
            </div>

            <div className="d-flex" style={{ gap: 8, marginTop: 4 }}>
              <button type="button" className="btn btn-solid" onClick={apply}>
                {trSafe(t, "apply", isRTL ? "تطبيق" : "Apply")}
              </button>
              <button type="button" className="btn btn-outline" onClick={clear}>
                {trSafe(t, "clear", isRTL ? "مسح" : "Clear")}
              </button>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Size;
