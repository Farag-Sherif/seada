// helpers/filter/FilterProvider.jsx
import React, { useState } from "react";
import FilterContext from "./FilterContext";
import { useRouter } from "@/router/useRouter";

const FilterProvider = (props) => {
  const router = useRouter();
  const brand = router.query.brand;
  const color = router.query.color;
  const category = router.query.category;
  const min = router.query.min;
  const max = router.query.max;

  const [selectedCategory, setSelectedCategory] = useState(category || "fashion");
  const [selectedBrands, setSelectedBrands] = useState(brand ? brand.split(",") : []);
  const [selectedColor, setSelectedColor] = useState(color || "");

  // السعر كمدى
  const [selectedPrice, setSelectedPrice] = useState({
    min: min ?? 0,
    max: max ?? 500,
  });

  // ✅ مدى الأوزان (جرام) بدل المقاس
  const [selectedWeightRange, setSelectedWeightRange] = useState({
    min: 0,
    max: 0,
  });

  const [isChecked, setIsChecked] = useState(true);
  const [filterChecked, setFilterChecked] = useState([{}]);

  const handleBrands = (brand, checked) => {
    const index = selectedBrands.indexOf(brand);
    setIsChecked(!isChecked);
    setFilterChecked([{ brand, checked }]);
    if (index > -1) setSelectedBrands(selectedBrands.filter((e) => e !== brand));
    else setSelectedBrands([...selectedBrands, brand]);
  };

  return (
    <FilterContext.Provider
      value={{
        ...props,
        state: selectedCategory,
        setSelectedCategory,
        setSelectedColor,
        selectedColor,
        selectedBrands,
        setSelectedBrands,
        selectedPrice,
        setSelectedPrice,
        // 👇 واجهة الأوزان
        selectedWeightRange,
        setSelectedWeightRange,
        isChecked,
        filterChecked,
        handleBrands,
      }}
    >
      {props.children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;
