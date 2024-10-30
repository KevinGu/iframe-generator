import { WEBSITE_HOST, WEBSITE_NAME, WEBSITE_PUBLIC_DIR } from "@/app/config";
import { menuConfig, MenuItem } from "@/app/menuConfig";
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { getTranslations } from "next-intl/server";
import { LogoJsonLd } from "next-seo";
import { headers } from "next/headers";
import Image from "next/image";
import LocaleSwitcher from "./intl/LanguageSwitcher";

export default async function Nav({ locale }: { locale: string }) {
  const logo = (await import(`@/public/${WEBSITE_PUBLIC_DIR}/logo.svg`))
    .default;
  const favicon = (await import(`@/public/${WEBSITE_PUBLIC_DIR}/favicon.svg`))
    .default;

  const headersList = headers();
  const pathname = headersList.get("x-pathname");

  // 定义前缀，默认语言不带前缀
  const localePrefix = locale === "en" ? "" : `/${locale}`;

  // 如果 pathname 是 null 或 undefined，使用空字符串来代替
  const currentPath = pathname ?? ""; // 使用空字符串防止 pathname 为 null

  // 使配置文件中的菜单项
  const t = await getTranslations("Nav");
  const commonT = await getTranslations("Common");
  const menuItems: MenuItem[] = (
    menuConfig[WEBSITE_PUBLIC_DIR] || menuConfig["default"]
  )(t, commonT, currentPath, localePrefix);

  return (
    <Navbar
      maxWidth="full"
      position="static"
      height="3rem"
      classNames={{
        wrapper: "px-4 sm:px-6 lg:px-8 bg-blue-50 ",
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-0.5",
          "data-[active=true]:after:bg-blue-700",
          "transition-all",
          "duration-200",
          "ease-in-out",
          "hover:text-blue-700",
        ].join(" "),
      }}
    >
      {/* 左侧内容 */}
      <NavbarContent>
        <NavbarBrand className="flex-none items-center">
          <Link href="/" className="flex items-center">
            <Image
              priority
              height={30}
              src={logo}
              alt={WEBSITE_NAME}
              className="hidden sm:block h-10"
            />
            <Image
              priority
              height={32}
              src={favicon}
              alt={WEBSITE_NAME}
              className="sm:hidden h-8"
            />
          </Link>
          <LogoJsonLd
            useAppDir={true}
            logo={`${WEBSITE_HOST}/logo.svg`}
            url={WEBSITE_HOST as string}
          />
        </NavbarBrand>
      </NavbarContent>

      {/* 中间导航项 */}
      <NavbarContent className="hidden sm:flex gap-2 flex-1" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name} isActive={item.isActive}>
            <Link
              color={item.isActive ? "primary" : "foreground"}
              href={item.href}
              className="text-lg font-medium px-4 py-1 h-full hover:border-blue-300 border-b-2 border-transparent"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* 右侧内容 */}
      <NavbarContent justify="end" className="flex items-center gap-4">
        {/* <NavbarItem className="hidden lg:flex">
          <LocaleSwitcher />
        </NavbarItem> */}
        <NavbarMenuToggle className="sm:hidden" />
      </NavbarContent>

      {/* 移动端菜单 */}
      <NavbarMenu className="bg-blue-50 bg-opacity-95 pt-8 pb-6 px-6 shadow-lg">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color={item.isActive ? "primary" : "foreground"}
              className="w-full text-xl py-3 px-6 mb-2 hover:bg-blue-100 rounded-lg transition-colors duration-150"
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
