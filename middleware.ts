import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

export function middleware(request: NextRequest): NextResponse {
  const handleI18nRouting = createMiddleware(routing);

  const response = handleI18nRouting(request);

  //custom
  const pathname: string = request.nextUrl.pathname;
  response.headers.set("x-pathname", pathname);

  return response;
}

// 路径匹配配置
export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/((?!api|_next/static|_next/image|assets|favicon.ico|favicon.svg|icon.ico|sw.js|sitemap.xml|robots.txt).*)",
  ],
};
