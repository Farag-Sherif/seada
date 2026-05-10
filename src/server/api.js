const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

function toProxyPath(path) {
  if (!path) return "/api/proxy";
  return path.startsWith("/") ? `/api/proxy${path}` : `/api/proxy/${path}`;
}

function getStoredAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

async function parsePayload(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res.text();
}

async function request(input, init = {}) {
  const headers = new Headers(init.headers || {});
  const token = getStoredAuthToken();
  if (token && !headers.has("authorization")) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const res = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  const payload = await parsePayload(res);

  if (!res.ok) {
    const msg =
      (payload && typeof payload === "object" && (payload.message || payload.error)) ||
      (typeof payload === "string" ? payload : "Request failed");
    throw new Error(msg);
  }
  return payload;
}

export { API_BASE_URL };

export async function get(path, options = {}) {
  const url = new URL(toProxyPath(path), window.location.origin);
  const params = options?.params || {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return request(url.toString(), { method: "GET" });
}

export async function post(path, body) {
  return request(toProxyPath(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
}

export async function put(path, body) {
  return request(toProxyPath(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
}

export async function postFormData(path, formData) {
  return request(toProxyPath(path), {
    method: "POST",
    body: formData,
  });
}

export async function putFormData(endpoint, data, options = {}) {
  return request(toProxyPath(endpoint), {
    method: "PUT",
    body: data,
    ...options,
  });
}

export async function del(endpoint, options = {}) {
  return request(toProxyPath(endpoint), {
    method: "DELETE",
    ...options,
  });
}

export async function setAuthToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
    window.dispatchEvent(new Event("auth:changed"));
  }
}

export async function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    window.dispatchEvent(new Event("auth:changed"));
  }
}
export async function searchProducts(name) {
  return post(`items/find`, { name });
}