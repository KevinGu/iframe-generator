export interface MenuItem {
  name: string;
  href: string;
  isActive: boolean
}

export interface MenuConfig {
  [host: string]: (
    t: (key: string) => string,
    commonT: (key: string) => string,
    currentPath: string,
    localePrefix: string
  ) => MenuItem[];
}

export const menuConfig: MenuConfig = {
  default: (t, commonT, currentPath, localePrefix) => [
    // {
    //   name: t("Index"),
    //   href: "/",
    //   isActive: currentPath === `${localePrefix}` || currentPath === `${localePrefix}/`,
    // },
    // {
    //   name: t("Calculators"),
    //   href: "/calculators/ago-and-from",
    //   isActive: currentPath.startsWith(`${localePrefix}/calculators`),
    // },
    // {
    //   name: t("Widgets"),
    //   href: "/widgets",
    //   isActive: currentPath.startsWith(`${localePrefix}/widgets`),
    // },
  ]
};
