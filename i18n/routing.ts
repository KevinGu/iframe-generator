import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const defaultLocale = "en" as const;

export const localeWithName = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "es", name: "Español" },
  { code: "ar", name: "العربية" },
  { code: "pt", name: "Português" },
  { code: "fr", name: "Français" },
  { code: "ru", name: "Русский" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" },
  { code: "id", name: "Indonesia" },
  { code: "ko", name: "한국어" },
  { code: "it", name: "Italiano" },
  { code: "tr", name: "Türkçe" },
  { code: "nl", name: "Nederlands" },
  { code: "sv", name: "Svenska" },
  { code: "da", name: "Dansk" },
  { code: "fi", name: "Suomi" },
  { code: "no", name: "Norsk" },
] as const;

export const localeCodes = localeWithName.map((locale) => locale.code);

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: localeCodes,
  localePrefix: "as-needed",
  // Used when no locale matches
  defaultLocale: "en",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
