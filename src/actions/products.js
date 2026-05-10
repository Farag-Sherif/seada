// actions/products.js
import { get, postFormData } from "../server/api";

/* ------------------------- helpers ------------------------- */
const mapSort = (val) => {
  switch ((val || "").toString()) {
    case "price_desc":
    case "high_to_low":
      return "high_to_low";
    case "price_asc":
    case "low_to_high":
      return "low_to_high";
    case "newest":
      return "newest";
    case "oldest":
      return "oldest";
    default:
      return undefined;
  }
};
const num = (v) =>
  v === 0 || v === "0" ? 0 : v === undefined || v === null || v === "" ? undefined : Number(v);
const stripUndefined = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        v !== "" &&
        !(Array.isArray(v) && v.length === 0)
    )
  );

/** Accepts either raw API keys or a friendly shape and returns API params */
function buildProductParams(input = {}) {
  const page = num(input.page ?? input.current_page);
  const per_page = num(input.per_page ?? input.perPage ?? input.limit);

  const sub_category_id = num(
    input.sub_category_id ??
      input.subCategoryId ??
      input.category_id ??
      input.categoryId
  );

  // price (allow {min,max} | [min,max] | direct keys)
  const price =
    Array.isArray(input.price)
      ? { min: num(input.price[0]), max: num(input.price[1]) }
      : input.price || input.prices || {};
  const min_price = num(input.min_price ?? price.min ?? 0); // ALWAYS include (default 0)
  const max_price = num(input.max_price ?? price.max);      // include only when provided

  // optional weight range (grams)
  const weight =
    Array.isArray(input.weightRange) || Array.isArray(input.weight)
      ? {
          min: num((input.weightRange || input.weight)[0]),
          max: num((input.weightRange || input.weight)[1]),
        }
      : input.weightRange || input.weight || {};
  const min_weight = num(input.min_weight ?? weight.min);
  const max_weight = num(input.max_weight ?? weight.max);

  // brands (comma string or array)
  const brandsRaw =
    input.brand_ids ??
    input.brandIds ??
    input.brands ??
    (Array.isArray(input.selectedBrands) ? input.selectedBrands : undefined);
  const brand_ids = Array.isArray(brandsRaw)
    ? brandsRaw.map(String).filter(Boolean).join(",")
    : (brandsRaw || "").toString();

  const q = input.q ?? input.search ?? input.keyword;

  const params = {
    page,
    per_page,
    sort: mapSort(input.sort ?? input.sortBy),
    sub_category_id,      // remapped below to API’s typo key
    min_price,            // ALWAYS present (0 default)
    max_price,            // optional
    min_weight,
    max_weight,
    brand_ids: brand_ids || undefined,
    q: q || undefined,
  };

  return stripUndefined(params);
}

/* ------------------- normalizers ------------------- */
function normalizePaged(payload) {
  const list =
    (Array.isArray(payload?.data) && payload.data) ||
    (Array.isArray(payload?.items) && payload.items) ||
    (Array.isArray(payload?.data?.data) && payload.data.data) ||
    (Array.isArray(payload) && payload) ||
    [];

  const current =
    Number(
      payload?.current_page ??
        payload?.meta?.current_page ??
        payload?.data?.current_page ??
        1
    ) || 1;

  const last =
    Number(
      payload?.last_page ??
        payload?.meta?.last_page ??
        payload?.data?.last_page ??
        1
    ) || 1;

  return { data: list, current_page: current, last_page: last, raw: payload };
}

function normalizeList(payload) {
  return (
    (Array.isArray(payload?.data) && payload.data) ||
    (Array.isArray(payload?.items) && payload.items) ||
    (Array.isArray(payload) && payload) ||
    []
  );
}

/* --------------------------- exports --------------------------- */

/** PRODUCTS (PAGINATED) — matches Postman:
// /api/items?min_price=0&sub-catagory_id=<id>&sort=low_to_high */
export async function getProducts(params) {
  const apiParams = buildProductParams(params);

  // Backend expects the misspelled key:
  if (apiParams.sub_category_id != null) {
    apiParams["sub-catagory_id"] = apiParams.sub_category_id;
    delete apiParams.sub_category_id;
  }

  // Ensure min_price always present (already defaulted to 0 in builder)
  if (apiParams.min_price == null) apiParams.min_price = 0;

  const response = await get("/items", { params: apiParams });
  const out = normalizePaged(response);
  if (!Array.isArray(out.data)) throw new Error("Failed to fetch products");
  return out;
}

/** SINGLE PRODUCT */
export async function getProduct(productId) {
  const response = await get(`/item/${productId}`);
  return response;
}

/** FAVORITES toggle */
export async function updateFavorites(productId) {
  const formData = new FormData();
  formData.append("item_id", String(productId));
  const response = await postFormData("/user/update-fav", formData);
  return response;
}

/** FAVORITES list */
export async function getFavorites() {
  const response = await get("/user/my-favorites");
  return normalizeList(response);
}

/** SEARCH by name (server expects form-data) */
export async function searchProducts(name) {
  const formData = new FormData();
  formData.append("name", name);
  const response = await postFormData(`/items/find`, formData);
  return normalizeList(response);
}

/** BRAND PRODUCTS (paged) */
export async function getBrandProducts(page = 1) {
  const response = await get(`/brand-items`, { params: { page } });
  return normalizePaged(response);
}

/** CATEGORIES (for brands / filters) */
export async function getCategories() {
  const response = await get("/categories");
  return response;
}

/* -------- optional favorite toggle helper -------- */
function readIsFav(payload, fallback) {
  if (payload == null) return !!fallback;
  if (typeof payload.is_favorite === "boolean") return payload.is_favorite;
  if (payload?.data?.is_favorite != null) return !!payload.data.is_favorite;
  if (payload?.favorite != null) return !!payload.favorite;
  if (payload?.status === "added" || payload?.action === "added") return true;
  if (payload?.status === "removed" || payload?.action === "removed") return false;
  if (payload?.message && /removed/i.test(payload.message)) return false;
  if (payload?.message && /(added|favorit)/i.test(payload.message)) return true;
  return !!fallback;
}

export async function toggleFavorite(itemId, current) {
  try {
    const raw = await updateFavorites(itemId);
    const is_fav = readIsFav(raw, !current);
    return { ok: true, is_fav, raw };
  } catch (error) {
    return { ok: false, is_fav: !!current, error };
  }
}
