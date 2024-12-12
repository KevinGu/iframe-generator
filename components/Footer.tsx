import { Link } from "@nextui-org/react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import {
  WEBSITE_EMAIL,
  WEBSITE_HOST,
  WEBSITE_NAME,
} from "@/app/config";

export default async function Footer({ locale }: { locale: string }) {
  const logo = (await import(`@/public/logo.svg`))
    .default;
  const commonT = await getTranslations("Common");
  return (
    <footer
      className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8 shadow-lg"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Logo & Description */}
          <div className="space-y-6">
            <Link
              href={WEBSITE_HOST}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group transition-transform duration-200 hover:scale-105"
            >
              <Image
                priority
                height={100}
                src={logo}
                alt={WEBSITE_NAME}
                className="hidden sm:block h-12 w-auto"
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              {WEBSITE_NAME} is a powerful iframe code generator that helps you
              create secure, responsive and customizable embedded content. With
              features like custom styling, security controls, and real-time
              preview, it&apos;s perfect for developers, designers, and content
              creators who need professional iframe integration.
            </p>
          </div>

          {/* About */}
          <div>
            <h2 className="text-gray-900 font-semibold mb-6 text-lg">
              {commonT("about")}
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="group-hover:underline">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="group-hover:underline">Terms of Use</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`mailto:${WEBSITE_EMAIL}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="group-hover:underline">{WEBSITE_EMAIL}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-gray-900 font-semibold mb-6 text-lg">
              {commonT("resources")}
            </h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://keyboardcounter.top"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="group-hover:underline">Keyboard Counter</span>
                </a>
              </li>
              <li>
                <a
                  href="https://calculatoronline.tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="group-hover:underline">Calculator Online Tools</span>
                </a>
              </li>
              <li>
                <a
                  href="https://aitools.show"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="group-hover:underline">AI Tools Show</span>
                </a>
              </li>
              <li>
                <a
                  href="https://jiashuiyin.com/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="group-hover:underline">Watermark Adder</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-200/50 mt-12 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Pattern Hub, LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
