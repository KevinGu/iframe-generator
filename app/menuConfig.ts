export interface MenuItem {
  name: string;
  href: string;
  isActive: boolean
}

export interface MenuConfig {
  [host: string]: (
    t: (key: string) => string,
    currentPath: string,
    localePrefix: string
  ) => MenuItem[];
}

export const menuConfig: MenuConfig = {
  default: (t, currentPath, localePrefix) => [
    {
      name: t("IFrame Generator"),
      href: "/",
      isActive: currentPath === `${localePrefix}` || currentPath === `${localePrefix}/`,
    },
    {
      name: t("YouTube Embed"),
      href: "/youtube",
      isActive: currentPath.startsWith(`${localePrefix}/youtube`),
    },
  ],
};
