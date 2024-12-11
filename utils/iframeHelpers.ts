import { IFrameConfig } from "../app/config/iframeTypes";
import { HTMLAttributeReferrerPolicy } from "react";

// 边框圆角预设
export const radiusPresets: Record<string, string> = {
  none: "0px",
  sm: "2px",
  md: "4px",
  lg: "8px",
  xl: "12px",
  xl2: "16px",
  xl3: "24px",
  full: "9999px",
};

// Sandbox 选项配置
export const sandboxOptions = [
  { value: "allow-forms", label: "Allow form submission" },
  { value: "allow-scripts", label: "Allow JavaScript execution" },
  { value: "allow-same-origin", label: "Allow same origin access" },
  { value: "allow-popups", label: "Allow window.open()" },
  { value: "allow-modals", label: "Allow alert/confirm/prompt" },
  { value: "allow-downloads", label: "Allow file downloads" },
  { value: "allow-popups-to-escape-sandbox", label: "Allow popups without sandbox restrictions" },
  { value: "allow-top-navigation", label: "Allow changing parent URL" },
  { value: "allow-top-navigation-by-user-activation", label: "Allow changing parent URL by user click" },
  { value: "allow-top-navigation-to-custom-protocols", label: "Allow custom protocol links" },
  { value: "allow-presentation", label: "Allow presentation mode" },
  { value: "allow-storage-access-by-user-activation", label: "Allow storage access by user click" },
  { value: "allow-orientation-lock", label: "Allow screen orientation lock" },
  { value: "allow-pointer-lock", label: "Allow mouse pointer lock" }
];

// Referrer Policy 选项
export const referrerPolicyOptions: HTMLAttributeReferrerPolicy[] = [
  "no-referrer",
  "no-referrer-when-downgrade",
  "origin",
  "origin-when-cross-origin",
  "same-origin",
  "strict-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url",
];

// URL 验证函数
export const isValidUrl = (url: string): boolean => {
  try {
    // 如果没有协议前缀，添加 https://
    const urlWithProtocol = url.match(/^https?:\/\//) ? url : `https://${url}`;
    new URL(urlWithProtocol);
    return true;
  } catch {
    return false;
  }
};

// 尺寸验证函数
export const isValidSize = (size: string) => {
  return /^\d+(%|px|rem|em|vh|vw)$/.test(size);
};

// iframe 属性生成函数
interface GenerateIframePropsParams {
  config: IFrameConfig;
  deviceType?: "desktop" | "tablet" | "mobile";
  devicePresets?: Record<
    "desktop" | "tablet" | "mobile",
    { width: string; height?: string }
  >;
  customStyles?: React.CSSProperties;
}

export const generateIframeProps = ({
  config,
  deviceType = "desktop",
  devicePresets,
  customStyles = {},
}: GenerateIframePropsParams) => {

  // 基础样式
  const baseStyles: React.CSSProperties = {
    border: "none",
    ...customStyles,
  };

  // 设备相关的尺寸处理
  if (devicePresets && deviceType) {
    if (deviceType === "desktop") {
      baseStyles.width = `${config.width}${config.widthUnit}`;
      baseStyles.height = "100%";
    } else {
      baseStyles.width = "100%";
      baseStyles.height = devicePresets[deviceType].height;
    }
  } else {
    baseStyles.width = `${config.width}${config.widthUnit}`;
    baseStyles.height = `${config.height}${config.heightUnit}`;
  }

  // 处理全屏相关属性
  const fullscreenProps = config.allowFullscreen
    ? {
        allowFullScreen: true,
        allow: [...(config.allow || []), "fullscreen"].join("; "),
        webkitallowfullscreen: "true",
        mozallowfullscreen: "true",
      }
    : {};

  // 通用 iframe 属性
  const commonProps = {
    src: config.url,
    loading: config.loading as "lazy" | "eager",
    style: baseStyles,
    ...fullscreenProps,
    ...(config.scrolling ? {} : { scrolling: "no" }),
    ...(config.title ? { title: config.title } : {}),
    ...(config.ariaLabel ? { "aria-label": config.ariaLabel } : {}),
    ...(config.name ? { name: config.name } : {}),
    ...(config.sandbox.length > 0 ? { sandbox: config.sandbox.join(" ") } : {}),
    ...(config.referrerPolicy ? { referrerPolicy: config.referrerPolicy } : {}),
    ...(config.importance ? { importance: config.importance } : {}),
  };

  return {
    props: commonProps,
    styleString: Object.entries(baseStyles)
      .map(
        ([key, value]) =>
          `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}`
      )
      .join("; "),
  };
};

// 添加 URL 归一化函数
export const normalizeUrl = (url: string): string => {
  try {
    // 如果没有协议前缀，添加 https://
    const urlWithProtocol = url.match(/^https?:\/\//) ? url : `https://${url}`;
    
    // 创建 URL 对象并移除尾部斜杠
    const urlObj = new URL(urlWithProtocol);
    const normalizedUrl = urlObj.toString().replace(/\/+$/, '');
    
    return normalizedUrl;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Invalid URL: ${errorMessage}`);
  }
}; 