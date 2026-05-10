// lib/locale.js
import { useRouter } from "@/router/useRouter";

export function useCurrentLocale(defaultLocale = "en") {
  try {
    const { locale } = useRouter();
    console.log(locale)
    return (locale || defaultLocale).split("-")[0]; // e.g. "en-US" → "en"
  } catch {
    return defaultLocale;
  }
}
