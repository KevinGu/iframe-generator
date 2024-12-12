import "@/app/globals.css";
import { Providers } from "@/app/providers";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import ProgressBarProviders from "@/components/ProgressBarProvider";
import LanguageSelectionWrapper from "@/components/intl/LanguageSelectionWrapper";
import { localeCodes } from "@/i18n/routing";
import { GoogleTagManager } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ReactNode } from "react";
import { WEBSITE_NAME } from "../config";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next"

export type LocaleProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const favicon = (await import(`@/public/favicon.svg`))
    .default;

  const t = await getTranslations({
    locale: params.locale,
    namespace: "Index.metadata",
  });

  return {
    icons: [{ rel: "icon", url: favicon.src }],
    title: t("title", { websiteName: WEBSITE_NAME }),
    description: t("desc", { websiteName: WEBSITE_NAME }),
  };
}

export function generateStaticParams() {
  return localeCodes.map((locale) => ({ locale }));
}

async function RootLayout(props: LocaleProps) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const direction = ["ar", "fa", "he"].includes(locale) ? "rtl" : "ltr";
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html dir={direction} lang={locale}>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body suppressHydrationWarning={true} >
        <ProgressBarProviders>
          <Providers>
            <NextIntlClientProvider messages={messages}>
                <div className="bg-base-100">
                  <Nav locale={locale} />
                  <main>{children}</main>
                  <Footer locale={locale} />
                </div>
                <LanguageSelectionWrapper />
            </NextIntlClientProvider>
          </Providers>
        </ProgressBarProviders>
        <SpeedInsights />
      </body>
    </html>
  );
}

export default RootLayout;
