import { useMemo } from "react";

export const pickLocale = (obj, isRTL) => {
  if (!obj) return obj;
  const ar = obj.translations?.find((t) => t.locale === "ar");
  const en = obj.translations?.find((t) => t.locale === "en");
  return isRTL ? ar || en || obj : en || ar || obj;
};

export const useProductAdapter = (isRTL) => {
  const adapt = useMemo(
    () =>
      (p) => {
        const t =
          p?.translations?.find((x) => x.locale === (isRTL ? "ar" : "en")) ||
          p?.translations?.[0];

        const name = t?.name || p?.name || "";
        const desc = t?.description || p?.description || "";
        const price = Number(p?.total ?? p?.price ?? 0);
        const discount = Number(p?.discount ?? 0);

        const images = [];
        if (p?.image_path) images.push({ id: "main", src: p.image_path, alt: name });
        if (Array.isArray(p?.media)) {
          p.media.forEach((m) => {
            if (m?.image_path) images.push({ id: m.id, src: m.image_path, alt: name });
          });
        }

        const catName = pickLocale(p?.category, isRTL)?.name || p?.category?.name || "";
        const brandName =
          pickLocale(p?.cafe, isRTL)?.name || p?.cafe?.name || p?.brand || "";

        return {
          id: p?.id,
          title: name,
          description: desc,
          price,
          discount,
          type: p?.type || "normal",
          brand: brandName,
          category: catName,
          stock: p?.is_available ? 99 : 0,
          sale: discount > 0,
          new: false,
          variants: [],
          images,
          raw: p,
        };
      },
    [isRTL]
  );

  return { adapt };
};
