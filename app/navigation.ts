import { createNavigation } from "next-intl/navigation";
import { pathnames, localePrefix } from "./config";
import { localeCodes } from "@/i18n/routing";

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales: localeCodes,
  pathnames,
  localePrefix,
});
