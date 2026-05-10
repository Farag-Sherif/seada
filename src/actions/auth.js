// actions/auth.js
import {
  clearAuthToken,
  get,
  post,
  postFormData,
  setAuthToken,
} from "../server/api";

/* ---------------- Local storage helpers ---------------- */
function saveLocalAuth({ token, user }) {
  try {
    if (token) localStorage.setItem("authToken", token);
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
    window.dispatchEvent(new Event("auth:changed"));
  } catch {}
}
function clearLocalAuth() {
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    window.dispatchEvent(new Event("auth:changed"));
  } catch {}
}

/* ======================== Auth ======================== */

export async function register(formDataLike) {
  const fd = formDataLike instanceof FormData ? formDataLike : new FormData();
  if (!(formDataLike instanceof FormData)) {
    const src = formDataLike || {};
    fd.append("fname", src.fname ?? src.first_name ?? src.firstName ?? "");
    fd.append("lname", src.lname ?? src.last_name ?? src.lastName ?? "");
    fd.append("phone", src.phone ?? "");
    fd.append("password", src.password ?? "");
    if (src.email) fd.append("email", src.email);
  }
  const res = await postFormData("/register", fd);
  if (res?.status === "success" && res?.token) {
    await setAuthToken(res.token);
    if (typeof window !== "undefined") {
      if (res?.user) {
        saveLocalAuth({ token: res.token, user: res.user });
      } else {
        const u = await getUser().catch(() => null);
        const user = u?.user || u?.data || u || null;
        saveLocalAuth({ token: res.token, user });
      }
    }
  }
  return res;
}

export async function login(formDataLike) {
  const fd = formDataLike instanceof FormData ? formDataLike : new FormData();
  if (!(formDataLike instanceof FormData)) {
    const src = formDataLike || {};
    fd.append("phone", src.phone ?? "");
    fd.append("password", src.password ?? "");
  }
  const res = await postFormData("/login", fd);
  if (res?.status === "success" && res?.token) {
    await setAuthToken(res.token);
    if (typeof window !== "undefined") {
      if (res?.user) {
        saveLocalAuth({ token: res.token, user: res.user });
      } else {
        const u = await getUser().catch(() => null);
        const user = u?.user || u?.data || u || null;
        saveLocalAuth({ token: res.token, user });
      }
    }
  } else {
    await getUser().catch(() => null);
  }
  return res;
}

export async function logout() {
  try {
    await get("/logout");
  } finally {
    await clearAuthToken?.();
    if (typeof window !== "undefined") clearLocalAuth();
  }
  return { status: "success" };
}

/* ======================== User ======================== */

export async function getUser() {
  const response = await get("/user");
  if (typeof window !== "undefined") {
    const user = response?.user || response?.data || response || null;
    if (user && typeof user === "object") {
      try {
        const existing = JSON.parse(localStorage.getItem("authUser") || "{}");
        localStorage.setItem("authUser", JSON.stringify({ ...existing, ...user }));
        window.dispatchEvent(new Event("auth:changed"));
      } catch {}
    }
  }
  return response;
}

export async function updateUser(input = {}) {
  const fname = input.fname ?? input.first_name ?? input.firstName ?? "";
  const lname = input.lname ?? input.last_name ?? input.lastName ?? "";
  const phone = input.phone ?? input.mobile ?? input.tel ?? "";

  const fd = new FormData();
  fd.append("fname", fname);
  fd.append("lname", lname);
  if (phone) fd.append("phone", phone);

  const res = await postFormData("/user/edit_profile", fd);

  if (res?.status && res.status !== "success") {
    const msg =
      res?.message ||
      (res?.errors && Object.values(res.errors).flat().join(" ")) ||
      "Failed to update profile";
    throw new Error(msg);
  }

  if (typeof window !== "undefined") {
    const updated = res?.user || res?.data || null;
    try {
      const current = JSON.parse(localStorage.getItem("authUser") || "{}");
      const merged = updated
        ? { ...current, ...updated }
        : {
            ...current,
            ...(fname ? { fname, first_name: fname } : {}),
            ...(lname ? { lname, last_name: lname } : {}),
            ...(phone ? { phone } : {}),
          };
      localStorage.setItem("authUser", JSON.stringify(merged));
      window.dispatchEvent(new Event("auth:changed"));
    } catch {}
  }

  return res;
}

export async function updateUserPassword({ current_password, password }) {
  const fd = new FormData();
  if (current_password) fd.append("current_password", current_password);
  fd.append("password", password);
  return postFormData("/user/password", fd);
}

/* ====================== Password reset ====================== */
/** Send reset email — POST /api/password/email */
export async function requestPasswordReset({ email }) {
  const fd = new FormData();
  fd.append("email", email ?? "");
  return postFormData("/password/email", fd);
}

/** Final reset — POST /api/password/reset (email, token, password, password_confirmation) */
export async function resetPassword({
  email,
  token,
  password,
  password_confirmation,
}) {
  const fd = new FormData();
  fd.append("email", email ?? "");
  fd.append("token", token ?? "");
  fd.append("password", password ?? "");
  fd.append(
    "password_confirmation",
    password_confirmation ?? password ?? ""
  );
  return postFormData("/password/reset", fd);
}

/* ====================== Addresses ====================== */

export async function getAddresses() {
  return get("/user/addresses");
}

/** GET ONE: GET /api/user/address/{id} */
export async function getAddress(id) {
  if (!id) throw new Error("id is required");
  return get(`/user/address/${id}`);
}

/** CREATE: POST /api/user/addresses/add */
export async function createAddress({
  street,
  address,
  address2,
  apartment,
  company,
  postal_code,
  notes,
  f_name,
  l_name,
  email,
  phone,
  country,
  city,
  zip,
  state,
  home_phone,
} = {}) {
  const fd = new FormData();

  const mergedAddress = [street, address].filter(Boolean).join(" ").trim();
  if (mergedAddress) fd.append("address", mergedAddress);
  if (address2 != null) fd.append("address2", address2);
  if (apartment != null) fd.append("apartment", apartment);
  if (company != null) fd.append("company", company);
  if (postal_code != null) fd.append("postal_code", postal_code);
  if (notes != null) fd.append("notes", notes);

  fd.append("f_name", f_name ?? "");
  fd.append("l_name", l_name ?? "");
  fd.append("email", email ?? "");
  fd.append("phone", phone ?? "");

  if (country != null) fd.append("country", country);
  if (city != null) fd.append("city", city);
  if (zip != null) fd.append("zip", zip);
  if (state != null) fd.append("state", state);
  if (home_phone != null) fd.append("home_phone", home_phone);

  return postFormData("/user/addresses/add", fd);
}

/** EDIT: POST /api/user/addresses/edit/{id} */
export async function editAddress({
  id,
  street,
  address,
  address2,
  apartment,
  company,
  postal_code,
  notes,
  f_name,
  l_name,
  email,
  phone,
  country,
  city,
  zip,
  state,
  home_phone,
} = {}) {
  const fd = new FormData();

  const mergedAddress = [street, address].filter(Boolean).join(" ").trim();
  if (mergedAddress) fd.append("address", mergedAddress);
  if (address2 != null) fd.append("address2", address2);
  if (apartment != null) fd.append("apartment", apartment);
  if (company != null) fd.append("company", company);
  if (postal_code != null) fd.append("postal_code", postal_code);
  if (notes != null) fd.append("notes", notes);

  fd.append("f_name", f_name ?? "");
  fd.append("l_name", l_name ?? "");
  fd.append("email", email ?? "");
  fd.append("phone", phone ?? "");

  if (country != null) fd.append("country", country);
  if (city != null) fd.append("city", city);
  if (zip != null) fd.append("zip", zip);
  if (state != null) fd.append("state", state);
  if (home_phone != null) fd.append("home_phone", home_phone);

  return postFormData(`/user/addresses/edit/${id}`, fd);
}

/** DELETE: GET /api/user/delete/addresse/{id} (matches collection) */
export async function deleteAddress(id) {
  if (!id) throw new Error("id is required");
  return get(`/user/delete/addresse/${id}`);
}

/* ============== Optional granular updaters ============== */
export async function updateFirstName(fname) {
  const fd = new FormData();
  fd.append("fname", fname ?? "");
  return postFormData("/user/fname", fd);
}
export async function updateLastName(lname) {
  const fd = new FormData();
  fd.append("lname", lname ?? "");
  return postFormData("/user/lname", fd);
}
export async function updateEmail(email) {
  const fd = new FormData();
  fd.append("email", email ?? "");
  return postFormData("/user/email", fd);
}
export async function updatePhone(phone) {
  const fd = new FormData();
  fd.append("phone", phone ?? "");
  return postFormData("/user/phone", fd);
}
