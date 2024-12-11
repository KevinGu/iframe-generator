import { WEBSITE_HOST, WEBSITE_NAME } from "@/app/config";
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
  const logo = (await import(`@/public/logo.svg`)).default;
  const favicon = (await import(`@/public/favicon.svg`)).default;

  const headersList = await headers();
  const pathname = headersList.get("x-pathname");

  // 定义前缀，默认语言不带前缀
  const localePrefix = locale === "en" ? "" : `/${locale}`;

  // 如果 pathname 是 null 或 undefined，使用空字符串来代替
  const currentPath = pathname ?? ""; // 使用空字符串防止 pathname 为 null

  // 使配置文件中的菜单项
  const t = await getTranslations("Nav");
  const commonT = await getTranslations("Common");
  const menuItems: MenuItem[] = menuConfig["default"](
    t,
    currentPath,
    localePrefix
  );

  return (
    <Navbar
      maxWidth="full"
      position="static"
      height="3.5rem"
      classNames={{
        wrapper: "px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200",
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
          "data-[active=true]:after:bg-blue-600",
        ].join(" "),
      }}
    >
      {/* 左侧内容 */}
      <NavbarContent>
        <NavbarBrand className="flex-none">
          <Link href="/" className="flex items-center">
            <Image
              priority
              height={28}
              src={logo}
              alt={WEBSITE_NAME}
              className="hidden sm:block"
            />
            <Image
              priority
              height={24}
              src={favicon}
              alt={WEBSITE_NAME}
              className="sm:hidden"
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
              className={[
                "px-3 py-1",
                "text-sm font-medium",
                item.isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900",
              ].join(" ")}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* 右侧内容 */}
      <NavbarContent justify="end">
        <NavbarMenuToggle className="sm:hidden" />
      </NavbarContent>

      {/* 移动端菜单 */}
      <NavbarMenu className="bg-white pt-4 pb-4">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color={item.isActive ? "primary" : "foreground"}
              className={[
                "w-full px-4 py-2",
                item.isActive ? "text-blue-600" : "text-gray-600",
              ].join(" ")}
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
