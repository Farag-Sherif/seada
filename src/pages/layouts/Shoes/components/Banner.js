import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/router/useRouter";
import Slider from "react-slick";
import MasterBanner from "../../Fashion/Components/MasterBanner";
import { getSlider } from "./../../../../actions/slider";

import { useLanguage } from "../../../../helpers/Language/useLanguage"; // 

/* ----------------------------- helpers (inline) ----------------------------- */


// Get origin from VITE_API_URL (e.g. https://newstore.test.do-go.net/api -> https://newstore.test.do-go.net)
function apiOrigin() {
  const base = import.meta.env.VITE_API_URL || "";
  try {
    const u = new URL(base);
    return `${u.protocol}//${u.host}`;
  } catch {
    return "";
  }
}

// Resolve full image URL for slider items
function resolveSliderImage(item) {
  console.log(item)
  if (item?.image_path && item.image_path.startsWith("http")) return item.image_path;
  const origin = apiOrigin();
  console.log(origin)
  const file = item?.image || "";
  console.log(file)
  return file ? `${origin}/images/${file}` : "";
}

// Localize slider item based on currentLanguage
function localizeHomeBanner(item, currentLanguage) {
  if (!item) return {};
  const t = Array.isArray(item.translations)
    ? item.translations.find((x) => x?.locale?.startsWith(currentLanguage))
    : null;

  return {
    id: item.id,
    image: item.image,
    image_path: item.image_path,
    button_url: item.button_url,
    order: item.order,
    type: item.type,
    title: (t && t.title) || item.title || "",
    description: (t && t.description) || item.description || "",
    button_text: (t && t.button_text) || item.button_text || "",
  };
}

export default function Banner() {
  const [items, setItems] = useState([]);
  const { currentLanguage, isRTL } = useLanguage(); // ✅ use your context hook

  useEffect(() => {
    (async () => {
      try {
        const res = await getSlider();
        if (Array.isArray(res)) setItems(res);
      } catch (e) {
        console.error("Error fetching sliders:", e);
      }
    })();
  }, []);

  const sliderSettings = useMemo(
    () => ({
      dots: false,
      arrows: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 5000,
      speed: 600,
      slidesToShow: 1,
      slidesToScroll: 1,
      rtl: isRTL, // flips for Arabic
    }),
    [isRTL]
  );

  return (
    <section className={`p-0 ${isRTL ? "rtl" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
      <Slider className="slide-1 home-slider" {...sliderSettings}>
        {items.map((item) => {
          const localized = localizeHomeBanner(item, currentLanguage);
          const img = resolveSliderImage(localized);
        
          return (
            <MasterBanner
              key={localized.id}
              img={img}
              link={localized.button_url || "#"}
              title={localized.title}
              desc={localized.description}
              btn={localized.button_text || undefined}
              className={isRTL ? "text-right" : "text-left"}
              dir={isRTL ? "rtl" : "ltr"}
            />
          );
        })}
      </Slider>
    </section>
  );
}