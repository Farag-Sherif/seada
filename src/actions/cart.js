// actions/cart.client.js
const jsonHeaders = { "Content-Type": "application/json" };

async function parse(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}
function ensureOk(res, payload) {
  if (!res.ok) {
    const msg = (payload && (payload.message || payload.error)) || "Request failed";
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return payload;
}

export async function getCart() {
  const res = await fetch("/api/proxy/cart", { method: "GET", credentials: "include" });
  const payload = await parse(res);
  return ensureOk(res, payload);
}

export async function addToCart(itemId, qty, weight = "") {
  const fd = new FormData();
  fd.append("item_id", String(itemId));
  fd.append("qty", String(qty));
  fd.append("weight", String(weight));
  const res = await fetch("/api/proxy/add-to-cart", { method: "POST", body: fd, credentials: "include" });
  const payload = await parse(res);
  return ensureOk(res, payload);
}

export async function updateCartQuantity(itemId, qty) {
  const fd = new FormData();
  fd.append("item_id", String(itemId));
  fd.append("qty", String(qty));
  const res = await fetch("/api/proxy/update-qty-cart", { method: "POST", body: fd, credentials: "include" });
  const payload = await parse(res);
  return ensureOk(res, payload);
}

export async function removeFromCart(itemId) {
  const fd = new FormData();
  fd.append("item_id", String(itemId));
  const res = await fetch("/api/proxy/remove-from-cart", { method: "POST", body: fd, credentials: "include" });
  const payload = await parse(res);
  return ensureOk(res, payload);
}

export async function removeAllFromCart() {
  const res = await fetch("/api/proxy/remove-all-cart", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({}),
    credentials: "include",
  });
  const payload = await parse(res);
  return ensureOk(res, payload);
}

/** AUTH checkout (requires address_id) */
export async function checkout({ address_id, notes = "" }) {
  const fd = new FormData();
  fd.append("address_id", String(address_id));
  fd.append("type", "cod");
  fd.append("notes", notes);
  const res = await fetch("/api/proxy/checkout", { method: "POST", body: fd, credentials: "include" });
  const payload = await parse(res);
  return ensureOk(res, payload);
}

/**
 * GUEST checkout (NO COOKIES!) — matches your Postman “checkout without user”
 * Sends cart[i][item_id], cart[i][qty], cart[i][weight] + guest fields.
 */
export async function checkoutGuest({
  f_name,
  l_name,
  email,
  phone,
  street = "",
  country = "",
  city,
  state = "",
  zip = "",
  notes = "",
  cart, // [{ item_id, qty, weight? }]
}) {
  const fd = new FormData();
  fd.append("f_name", f_name);
  fd.append("l_name", l_name);
  fd.append("email", email);
  fd.append("phone", phone);
  if (street) fd.append("street", street);
  if (country) fd.append("country", country);
  // your Postman sometimes sends ID for city; backend accepts text, so send what UI chose
  if (city !== undefined && city !== null) fd.append("city", String(city));
  if (state) fd.append("state", state);
  if (zip) fd.append("zip", zip);
  fd.append("type", "cod");
  fd.append("notes", notes || "");

  (cart || []).forEach((item, i) => {
    fd.append(`cart[${i}][item_id]`, String(item.item_id));
    fd.append(`cart[${i}][qty]`, String(item.qty));
    if (item.weight !== undefined && item.weight !== null) {
      fd.append(`cart[${i}][weight]`, String(item.weight));
    }
  });

  // IMPORTANT: omit credentials so the server treats it as guest
  const res = await fetch("/api/proxy/checkout", { method: "POST", body: fd, credentials: "omit" });
  const payload = await parse(res);
  return ensureOk(res, payload);
}
