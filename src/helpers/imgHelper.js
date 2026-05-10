// lib/assets.ts
export function apiOrigin() {
  // e.g. "https://newstore.test.do-go.net/api" -> "https://newstore.test.do-go.net"
  const base = import.meta.env.VITE_API_URL || "";
  try {
    const u = new URL(base);
    return `${u.protocol}//${u.host}`;
  } catch {
    return ""; // fallback
  }
}

export function resolveSliderImage(item) {
  // Prefer full URL from API if provided
  if (item?.image_path?.startsWith("http")) return item.image_path;

  // Fallback to /images/<filename> using the API origin
  const origin = apiOrigin();
  const file = item?.image || "";
  return file ? `${origin}/images/${file}` : "";
}
