// pages/collection/common/Popupsidebar.jsx
import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useRouter } from "@/router/useRouter";
import { Col, Row, Button, Spinner } from "reactstrap";
import { toast } from "react-toastify";

import FilterContext from "../../../helpers/filter/FilterContext";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import PostLoader from "../../../components/common/PostLoader";
import CartContext from "../../../helpers/cart/CartContext";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import { CompareContext } from "../../../helpers/Compare/CompareContext";
import FilterPage from "./filter";

import { getCategories, getSubCafesProducts } from "../../../actions/categories";
import { getProducts } from "../../../actions/products";
import { useLanguage } from "../../../helpers/Language/useLanguage";
import { addToCart as addToCartAction } from "../../../actions/cart";

import ProductCardUnified from "../../../components/products/productCard";
import { useProductAdapter } from "../../../components/products/useProductAdapter";

/* ---------- helpers ---------- */
const trSafe = (t, key, fallback) => {
  try {
    const v = t ? t(key) : "";
    return !v || v === key ? fallback : v;
  } catch {
    return fallback;
  }
};
const BRAND = "#0b6b37";

const productKey = (p) => {
  const raw = p?.raw || p;
  const id = raw?.id ?? raw?.sku ?? raw?.code ?? raw?.slug ?? raw?.uuid;
  const mainImg = raw?.image_path || p?.images?.[0]?.src || "";
  return String(id ?? "") + "|" + String(mainImg ?? "");
};
const uniqueProducts = (arr) => {
  const seen = new Set();
  const out = [];
  for (const p of arr || []) {
    const k = productKey(p);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  return out;
};

const sortToApi = (val) => {
  switch (val) {
    case "price_desc": return "high_to_low";
    case "price_asc": return "low_to_high";
    default: return undefined;
  }
};
const stripUndefined = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        v !== "" &&
        !(Array.isArray(v) && !v.length)
    )
  );
const num = (v) => (v === 0 || v === "0" ? 0 : v ? Number(v) : undefined);
const firstDefined = (...vals) =>
  vals.find((v) => v !== undefined && v !== null && v !== "");

const readNumber = (v) =>
  v === 0 || v === "0" ? 0 : v == null || v === "" || Number.isNaN(Number(v)) ? undefined : Number(v);

const getPrice = (p) => {
  const r = p?.raw || p || {};
  return (
    readNumber(p?.price) ??
    readNumber(p?.final_price) ??
    readNumber(p?.sale_price) ??
    readNumber(r?.price) ??
    readNumber(r?.final_price) ??
    readNumber(r?.sale_price) ??
    0
  );
};
const getWeight = (p) => {
  const r = p?.raw || p || {};
  return readNumber(p?.weight ?? r?.weight);
};

const localizedName = (node, isRTL) => {
  const base = node?.name || "";
  const list = Array.isArray(node?.translations) ? node.translations : [];
  const targetLocale = isRTL ? "ar" : "en";
  const byLocale =
    list.find((x) => x?.locale === targetLocale)?.name ||
    list.find((x) => x?.locale)?.name ||
    "";
  return (byLocale || base || "").trim();
};

const mapCategoriesWithNames = (arr, isRTL) =>
  (Array.isArray(arr) ? arr : []).map((c) => ({
    ...c,
    name: localizedName(c, isRTL) || `#${c?.id ?? ""}`,
    children: c?.children ? mapCategoriesWithNames(c.children, isRTL) : [],
  }));

/* ---------- extractors ---------- */
const extractCategoryId = (router, fc) => {
  const r = router?.query || {};
  const cands = [
    r.category_id,
    r.sub_category_id,
    r.subCategoryId,
    r.categoryId,
    fc?.selectedCategoryId,
    fc?.selectedSubCategoryId,
    fc?.selectedCategory?.id,
    Array.isArray(fc?.selectedCategory) ? fc.selectedCategory[0] : fc?.selectedCategory,
    fc?.category?.id,
    fc?.categoryId,
    fc?.state?.categoryId,
    fc?.state?.id,
    typeof fc?.state === "number" || typeof fc?.state === "string" ? fc.state : undefined,
  ];
  return num(firstDefined(...cands));
};

const extractRange = (raw) => {
  if (Array.isArray(raw) && raw.length >= 2)
    return { min: num(raw[0]), max: num(raw[1]) };
  if (raw && (raw.min != null || raw.max != null))
    return { min: num(raw.min), max: num(raw.max) };
  return { min: undefined, max: undefined };
};

const useNormalizedFilters = (router, fc) => {
  const subCategoryId = useMemo(() => extractCategoryId(router, fc), [
    router?.query, fc?.state, fc?.selectedCategory, fc?.selectedCategoryId,
  ]);
  const price = useMemo(
    () => extractRange(fc?.selectedPrice ?? fc?.price ?? fc?.prices ?? fc?.state?.price ?? fc?.state?.selectedPrice),
    [fc?.selectedPrice, fc?.price, fc?.prices, fc?.state]
  );
  const weightRange = useMemo(
    () => extractRange(fc?.selectedWeightRange ?? fc?.weightRange ?? fc?.state?.weightRange ?? fc?.state?.selectedWeightRange),
    [fc?.selectedWeightRange, fc?.weightRange, fc?.state]
  );
  const brandIds = useMemo(() => {
    const arr = fc?.selectedBrands ?? fc?.brands ?? fc?.state?.brands ?? fc?.state?.selectedBrands ?? [];
    return Array.isArray(arr) ? arr.map(String).filter(Boolean) : [];
  }, [fc?.selectedBrands, fc?.brands, fc?.state]);

  return {
    subCategoryId,
    price,
    weightRange,
    brandIds,
    priceKey: `${price.min ?? ""}|${price.max ?? ""}`,
    weightKey: `${weightRange.min ?? ""}|${weightRange.max ?? ""}`,
    brandKey: brandIds.join(","),
  };
};

/* ============================== COMPONENT ============================== */
const Popupsidebar = ({ colClass = "col-lg-3", layoutList = "" }) => {
  const router = useRouter();

  const cartContext = useContext(CartContext);
  const wishlistContext = useContext(WishlistContext);
  const compareContext = useContext(CompareContext);
  const curContext = useContext(CurrencyContext);
  const symbol = curContext?.state?.symbol || "£";

  const { t, isRTL } = useLanguage();
  const filterContext = useContext(FilterContext);

  const [limit, setLimit] = useState(10);
  const [grid, setGrid] = useState(colClass);
  const [layout, setLayout] = useState(layoutList);
  const [sidebarView, setSidebarView] = useState(false);

  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const [categories, setCategories] = useState([]);

  const brands = useMemo(() => {
    const seen = new Map();
    for (const c of categories || []) {
      const list =
        c?.brands ||
        (Array.isArray(c?.children) ? c.children.flatMap((ch) => ch?.brands || []) : []) ||
        [];
      for (const b of list) {
        const id = String(b?.id ?? b?.brand_id ?? "");
        const name =
          localizedName(b, isRTL) ||
          b?.name ||
          (Array.isArray(b?.translations) ? b.translations.find((x) => x?.name)?.name : "") ||
          `#${id}`;
        if (id && !seen.has(id)) seen.set(id, { id, name });
      }
    }
    return Array.from(seen.values());
  }, [categories, isRTL]);

  const refetchTimer = useRef(null);

  const { subCategoryId, price, weightRange, brandIds, priceKey, weightKey, brandKey } =
    useNormalizedFilters(router, filterContext);

  const { adapt } = useProductAdapter(isRTL);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const res = await getCategories().catch(() => null);
        const raw =
          (Array.isArray(res?.data) && res.data) ||
          (Array.isArray(res?.categories) && res.categories) ||
          (Array.isArray(res) && res) ||
          [];
        const withNames = mapCategoriesWithNames(raw, isRTL);
        if (on) setCategories(withNames);
      } catch {
        if (on) setCategories([]);
      }
    })();
    return () => { on = false; };
  }, [isRTL]);

  const applyLocalFilters = (arr) =>
    arr.filter((p) => {
      const pr = getPrice(p);
      const wt = getWeight(p);
      if (price.min != null && pr < Number(price.min)) return false;
      if (price.max != null && pr > Number(price.max)) return false;
      if (weightRange.min != null && wt != null && wt < Number(weightRange.min)) return false;
      if (weightRange.max != null && wt != null && wt > Number(weightRange.max)) return false;
      return true;
    });

  const fetchPage = async ({ pageToLoad = 1, append = false }) => {
    const firstLoad = pageToLoad === 1 && !append;
    if (firstLoad) setLoading(true);
    else setLoadingMore(true);

    try {
      let list = [];

      if (subCategoryId) {
        const res = await getSubCafesProducts(subCategoryId, pageToLoad);
        const rawList =
          (Array.isArray(res?.data) && res.data) ||
          (Array.isArray(res?.items) && res.items) ||
          (Array.isArray(res?.data?.data) && res.data.data) ||
          (Array.isArray(res) && res) ||
          [];
        list = rawList;
      } else {
        const params = stripUndefined({
          page: pageToLoad,
          per_page: limit,
          sort: sortToApi(sortBy),
          min_price: price.min ?? 0,
          min_weight: weightRange.min,
          max_weight: weightRange.max,
          brand_ids: brandIds.join(","),
          q: filterContext?.search ?? filterContext?.keyword ?? filterContext?.q ?? undefined,
        });
        const res = await getProducts(params);
        list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      }

      const adapted = list.map((p) => adapt(p));
      const filtered = subCategoryId ? applyLocalFilters(adapted) : adapted;
      const clean = uniqueProducts(filtered);

      let sorted = clean;
      if (sortBy === "price_desc") sorted = [...clean].sort((a, b) => getPrice(b) - getPrice(a));
      else if (sortBy === "price_asc") sorted = [...clean].sort((a, b) => getPrice(a) - getPrice(b));

      setItems((prev) => (append ? uniqueProducts([...prev, ...sorted]) : sorted));

      const current = pageToLoad;
      const last = sorted.length === limit ? current + 1 : current;
      setHasMore(current < last);
      setPage(current);
    } catch {
      setHasMore(false);
      if (!append) setItems([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPage({ pageToLoad: 1, append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (refetchTimer.current) clearTimeout(refetchTimer.current);
    refetchTimer.current = setTimeout(() => {
      fetchPage({ pageToLoad: 1, append: false });
    }, 150);
    return () => clearTimeout(refetchTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, sortBy, subCategoryId, priceKey, weightKey, brandKey, isRTL,
    filterContext?.search, filterContext?.keyword, filterContext?.q]);

  const handlePagination = () => {
    if (!hasMore || loadingMore) return;
    fetchPage({ pageToLoad: page + 1, append: true });
  };

  const goToPdp = useCallback((id) => router.push(`/product-details/${id}`), [router]);

  /* ✅ addToCartBoth — toast واحد بس، بدون تكرار */
  const addToCartBoth = useCallback(
    async (product, qty = 1) => {
      // 1. أضف local أولاً — CartProvider هيعمل toast "تمت الإضافة بنجاح"
      cartContext?.addToCart?.(product, qty);

      // 2. sync مع السيرفر في الخلفية — بدون toast إضافي
      try {
        const weight = product?.raw?.weight || "";
        await addToCartAction(product.id, qty, weight);
        cartContext?.refetch?.();
      } catch (err) {
        // السيرفر فشل — البيانات محفوظة local، مش لازم toast تاني
        console.warn("Server cart sync failed (non-critical):", err);
      }
    },
    [cartContext]
  );

  return (
    <Col className="collection-content">
      <div className="page-main-content">
        <Row>
          <Col sm="12">
            <div className="collection-product-wrapper">
              {/* Top filter bar */}
              <div className="product-top-filter">
                <Row>
                  <Col>
                    <div className="popup-filter">
                      <div className="sidebar-popup" onClick={() => setSidebarView((v) => !v)}>
                        <a className="popup-btn" style={{ color: BRAND }}>
                          {trSafe(t, "filter", isRTL ? "تصفية" : "Filter")}{" "}
                          {trSafe(t, "Products", "products")}
                        </a>
                      </div>

                      <div id="filterpopup" className={`open-popup ${sidebarView ? "open" : ""}`}>
                        <FilterPage
                          sidebarView={sidebarView}
                          closeSidebar={() => setSidebarView(false)}
                          categories={categories}
                          brands={brands}
                          weightUnitLabel={isRTL ? "جرام" : "g"}
                        />
                      </div>

                      <div className="collection-view">
                        <ul>
                          <li>
                            <i
                              className="fa fa-th grid-layout-view"
                              onClick={() => { setLayout(""); setGrid("col-lg-3"); }}
                              style={{ color: BRAND }}
                            />
                          </li>
                          <li>
                            <i
                              className="fa fa-list-ul list-layout-view"
                              onClick={() => { setLayout("list-view"); setGrid("col-lg-12"); }}
                              style={{ color: BRAND }}
                            />
                          </li>
                        </ul>
                      </div>

                      <div className="product-page-per-view">
                        <select
                          value={limit}
                          onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                          style={{ borderColor: "#e5e7eb" }}
                        >
                          <option value="10">10 {isRTL ? "منتج/صفحة" : "Products / page"}</option>
                          <option value="15">15 {isRTL ? "منتج/صفحة" : "Products / page"}</option>
                          <option value="20">20 {isRTL ? "منتج/صفحة" : "Products / page"}</option>
                        </select>
                      </div>

                      <div className="product-page-filter">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          style={{ borderColor: "#e5e7eb" }}
                        >
                          <option value="">{trSafe(t, "sort_by", isRTL ? "ترتيب حسب" : "Sort By")}</option>
                          <option value="price_desc">{isRTL ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
                          <option value="price_asc">{isRTL ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
                        </select>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Product grid/list */}
              <div className={`product-wrapper-grid ${layout}`}>
                <Row>
                  {loading ? (
                    <div className="row mx-0 mt-3 margin-default" style={{ width: "100%" }}>
                      <div className="col-xl-3 col-lg-4 col-6"><PostLoader /></div>
                      <div className="col-xl-3 col-lg-4 col-6"><PostLoader /></div>
                      <div className="col-xl-3 col-lg-4 col-6"><PostLoader /></div>
                      <div className="col-xl-3 col-lg-4 col-6"><PostLoader /></div>
                    </div>
                  ) : items.length === 0 ? (
                    <Col xs="12">
                      <div className="col-sm-12 empty-cart-cls text-center">
                        <img
                          src="/assets/images/empty-search.jpg"
                          className="img-fluid mb-4 mx-auto"
                          alt=""
                        />
                        <h3>
                          <strong>
                            {trSafe(t, "no_results_found", isRTL ? "لا توجد نتائج" : "No results found")}
                          </strong>
                        </h3>
                        <h4>
                          {isRTL
                            ? "استكشف الأقسام أو عدّل عوامل التصفية."
                            : "Explore categories or adjust your filters."}
                        </h4>
                      </div>
                    </Col>
                  ) : (
                    items.map((product) => (
                      <Col key={productKey(product)} className={grid} xl={grid === "col-lg-12" ? "12" : undefined}>
                        <ProductCardUnified
                          product={product}
                          isRTL={isRTL}
                          onQuickView={() => { }}
                          onAddToCart={(qty = 1) => addToCartBoth(product, qty)}
                          onAddToWishlist={() => wishlistContext?.addToWish?.(product)}
                          onAddToCompare={() => compareContext?.addToCompare?.(product)}
                        />
                      </Col>
                    ))
                  )}
                </Row>
              </div>

              {/* Load more */}
              <div className="section-t-space">
                <div className="text-center">
                  <Row>
                    <Col xl="12" md="12" sm="12">
                      {hasMore && (
                        <Button
                          className="load-more"
                          onClick={handlePagination}
                          disabled={loadingMore}
                          style={{
                            background: BRAND,
                            borderColor: BRAND,
                            paddingInline: 18,
                            fontWeight: 700,
                            borderRadius: 10,
                          }}
                        >
                          {loadingMore && <Spinner size="sm" style={{ marginInlineEnd: 8 }} />}
                          {loadingMore
                            ? trSafe(t, "loading", isRTL ? "جاري التحميل..." : "Loading...")
                            : trSafe(t, "load_more", isRTL ? "تحميل المزيد" : "Load More")}
                        </Button>
                      )}
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default Popupsidebar;