import { Pathnames } from "next-intl/routing";
import {localeCodes} from '@/i18n/routing'

export const pathnames = {
  "/": "/"
} satisfies Pathnames<typeof localeCodes>;

// Use the default: `always`
export const localePrefix = undefined;

export const WEBSITE_HOST = process.env.NEXT_PUBLIC_HOST as string;
export const WEBSITE_NAME = process.env.NEXT_PUBLIC_NAME as string;
export const WEBSITE_EMAIL = process.env.NEXT_PUBLIC_EMAIL as string;
export const WEBSITE_PUBLIC_DIR = process.env.NEXT_PUBLIC_DIR as string;
export const WEBSITE_CDN = process.env.NEXT_PUBLIC_CDN as string;

