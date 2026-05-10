// helpers/tr.ts (or inline in the component)
export const trMenu = (t, keyOrText) => {
  if (!keyOrText) return "";
  const variants = [
    keyOrText,                                   // "Home"
    keyOrText.toLowerCase(),                     // "home"
    keyOrText.replace(/-/g, "_"),                // "about-us" -> "about_us"
    keyOrText.toLowerCase().replace(/-/g, "_"),  // "About-Us" -> "about_us"
    keyOrText.replace(/_/g, "-"),                // "about_us" -> "about-us"
  ];
  for (const k of variants) {
    const v = t(k);
    if (v && v !== k) return v; // translated
  }
  return keyOrText; // fallback
};
