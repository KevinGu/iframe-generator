import { WEBSITE_NAME } from "@/app/config";
import { localeCodes } from '@/i18n/routing'
import { ReadonlyURLSearchParams } from "next/navigation";

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export function extractDomainName(urlString: string): string {
  // 使用URL类解析给定的URL字符串
  const url = new URL(urlString);
  // 获取主机名
  const hostname = url.hostname;
  // 将主机名按点分割成数组
  const parts = hostname.split(".");
  // 根据域名部分的数量来决定如何提取二级域名
  // 这里假设大多数情况下URL至少有两个部分（如example.com）
  let secondLevelDomain = parts[0];
  if (parts.length > 2) {
    // 如果主机名像sub.example.com这样有三部分或更多，我们取中间的部分作为二级域名
    secondLevelDomain = parts[parts.length - 2];
  }
  return secondLevelDomain;
}

export function convertToPercentage(num: number): string {
  return (num * 100).toFixed(2) + "%";
}

// 定义参数类型
type UtmParams = {
  [key: string]: string;
};

const utmParams = {
  utm_source: `${WEBSITE_NAME}`,
  utm_medium: "web",
};

export const addUtmParameters = (url: string, params: UtmParams): string => {
  try {
    // 创建一个 URL 对象
    const urlObj = new URL(url);

    // 遍历 params 对象，添加到查询参数中
    Object.keys(params).forEach((key) => {
      urlObj.searchParams.set(key, params[key]);
    });

    return urlObj.toString();
  } catch (error) {
    console.error("Invalid URL:", url);
    return url; // 如果 URL 无效，则返回原始 URL
  }
};

export const addDefaultUtmParameters = (url: string): string => {
  return addUtmParameters(url, utmParams);
};

export const generateSlug = (name: string) => {
  return name.replace(/&/g, "and").replace(/\s+/g, "-").toLowerCase();
};

export function formatReadableNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (
      (num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1) + "B"
    );
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + "K";
  }
  return num.toString();
}

export function formatPercentage(value: number, fix: number): string {
  return `${(value * 100).toFixed(fix)}%`;
}

export const buildMetaAlternatesTag = (path: string) => {
  return localeCodes.reduce((acc, loc) => {
    acc[loc] =
      loc === "en"
        ? `${process.env.NEXT_PUBLIC_HOST}/${path}`
        : `${process.env.NEXT_PUBLIC_HOST}/${loc}/${path}`;
    return acc;
  }, {} as Record<string, string>);
};

export function formatNumber(value: number): string {
  // 使用 toLocaleString 来格式化数字，保留2位小数
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
