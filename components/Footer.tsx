import { Link } from "@nextui-org/react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import {
  WEBSITE_EMAIL,
  WEBSITE_HOST,
  WEBSITE_NAME,
  WEBSITE_PUBLIC_DIR,
} from "@/app/config";
import { getFontClass } from "@/app/font/fonts";

export default async function Footer({ locale }: { locale: string }) {
  const logo = (await import(`@/public/${WEBSITE_PUBLIC_DIR}/logo.svg`))
    .default;

  const navT = await getTranslations("Nav");
  const commonT = await getTranslations("Common");
  const tagsT = await getTranslations("Tags");

  const fontClass = getFontClass(locale);

  return (
    <footer
      className={`bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 shadow-lg ${fontClass.sans}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link
              href={WEBSITE_HOST}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Image
                priority
                height={100}
                src={logo}
                alt={WEBSITE_NAME}
                className="hidden sm:block h-10"
              />
            </Link>
            <p className="text-gray-700 text-sm">
              {WEBSITE_NAME} is a powerful iframe code generator that helps you
              create secure, responsive and customizable embedded content. With
              features like custom styling, security controls, and real-time
              preview, it's perfect for developers, designers, and content
              creators who need professional iframe integration.
            </p>
          </div>

          {/* About */}
          <div>
            <div className="text-gray-900 font-medium mb-4 text-base">
              {commonT("about", { websiteName: WEBSITE_NAME })}
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-gray-500 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-gray-500 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href={`mailto:${WEBSITE_EMAIL}`}
                  className="text-gray-500 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  {WEBSITE_EMAIL}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="text-gray-900 font-medium mb-4 text-base">
              {commonT("resources")}
            </div>
            <ul className="space-y-2">
              {/* <li>
                <Link
                  href={`/${locale}/sites/p/1`}
                  className="text-gray-500 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  {navT("index", { websiteName: WEBSITE_NAME })}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/tags`}
                  className="text-gray-500 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  {tagsT("menu")}
                </Link>
              </li> */}
              <li>
                <a
                  href="https://keyboardcounter.top"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  Keyboard Counter
                </a>
              </li>
              <li>
                <a
                  href="https://calculatoronline.tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  Calculator Online Tools
                </a>
              </li>
              <li>
                <a
                  href="https://aitools.show"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  AI Tools Show
                </a>
              </li>
              <li>
                <a
                  href="https://jiashuiyin.com/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  Watermark Adder
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-200 mt-10 pt-6">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} Pattern Hub, LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
