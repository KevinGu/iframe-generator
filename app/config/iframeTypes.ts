import { HTMLAttributeReferrerPolicy } from "react";

// 定义配置类型
export interface IFrameConfig {
  url: string;
  width: string;
  widthUnit: "px" | "%";
  height: string;
  heightUnit: "px" | "%";
  border: boolean;
  borderSize: string;
  borderStyle: "none" | "solid" | "dashed" | "dotted" | "double";
  borderColor: string;
  borderRadiusName: string;
  scrolling: boolean;
  allowFullscreen: boolean;
  backgroundColor: string;
  padding: string;
  customClass: string;
  sandbox: string[];
  referrerPolicy: HTMLAttributeReferrerPolicy;
  title: string;
  ariaLabel: string;
  name: string;
  loading: "lazy" | "eager";
  importance: "auto" | "high" | "low";
  allow: string[];
}

// 添加错误类型定义
export type IframeErrorType =
  | "X_FRAME_OPTIONS"
  | "CSP_VIOLATION"
  | "NETWORK_ERROR"
  | "LOAD_ERROR"
  | "TIMEOUT"
  | "SECURITY_ERROR"
  | "PARTIAL_ACCESS";

export interface IframeError {
  type: IframeErrorType;
  message: string;
  details?: string;
}

export interface IframeErrorMessage {
  title: string;
  message: string;
  suggestion: string;
}

// 添加错误消息映射函数
export const getIframeErrorMessage = (error: IframeError): IframeErrorMessage => {
  switch (error.type) {
    case "X_FRAME_OPTIONS":
      return {
        title: "页面限制嵌入",
        message: "该网页设置了 X-Frame-Options 限制，无法被嵌入。",
        suggestion: "建议：尝试联系网站管理员获取嵌入权限，或选择其他可嵌入的页面。",
      };
    // ... 其他错误类型的处理 ...
    default:
      return {
        title: "未知错误",
        message: error.message || "加载过程中发生错误。",
        suggestion: "建议：请刷新页面重试。",
      };
  }
};
