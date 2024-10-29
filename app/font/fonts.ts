import {
  Noto_Sans,
  Noto_Serif,
  Noto_Sans_Mono,
  Noto_Sans_SC,
  Noto_Sans_KR,
  Noto_Sans_JP,
} from "next/font/google";

export const notoSans = Noto_Sans({
  subsets: ["latin", "latin-ext", "cyrillic", "greek", "vietnamese"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const notoSerif = Noto_Serif({
  subsets: ["latin", "latin-ext", "cyrillic", "greek", "vietnamese"],
  weight: ["400", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

export const notoSansMono = Noto_Sans_Mono({
  subsets: ["latin", "latin-ext", "cyrillic", "greek", "vietnamese"],
  weight: ["400", "700"],
  variable: "--font-noto-sans-mono",
  display: "swap",
});

export const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-serif-sc",
  display: "swap",
});

export const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

export const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

export const fontVariables = `${notoSans.variable} ${notoSerif.variable} ${notoSansMono.variable} ${notoSansSC.variable} ${notoSansKR.variable} ${notoSansJP.variable}`;

export const getFontClass = (locale: string) => {
  const baseClasses = {
    mono: "font-mono",
  };

  switch (locale) {
    case "zh":
      return {
        ...baseClasses,
        sans: "font-noto-sans-sc",
        serif: "font-noto-sans-serif-sc",
      };
    case "kr":
      return {
        ...baseClasses,
        sans: "font-noto-sans-kr",
        serif: "font-noto-sans-serif-kr",
      };
    case "ja":
      return {
        ...baseClasses,
        sans: "font-noto-sans-jp",
        serif: "font-noto-sans-serif-jp",
      };
    default:
      return {
        ...baseClasses,
        sans: "font-noto-sans",
        serif: "font-noto-sans-serif",
      };
  }
};
