import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
 
  const dir = process.env.NEXT_PUBLIC_DIR || "default";

  return {
    locale,
    messages: (await import(`@/messages/${dir}/${locale}.json`)).default
  };
});