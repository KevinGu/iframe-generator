import { HTMLAttributeReferrerPolicy } from "react";

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

// Sandbox 选项
export const sandboxOptions = [
  { value: "allow-forms", label: "允许表单" },
  { value: "allow-scripts", label: "允许脚本" },
  { value: "allow-same-origin", label: "允许同源" },
  { value: "allow-popups", label: "允许弹窗" },
  { value: "allow-modals", label: "允许模态框" },
  { value: "allow-downloads", label: "允许下载" },
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

// URL验证函数优化
export const isValidUrl = (url: string) => {
  // 空字符串允许通过
  if (url === "") return true;

  // 简单的 URL 格式验证
  const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
  return urlPattern.test(url);
};

// 尺寸验证函数
export const isValidSize = (size: string) => {
  return /^\d+(%|px|rem|em|vh|vw)$/.test(size);
};
