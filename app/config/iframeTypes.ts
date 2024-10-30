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
  referrerPolicy?: HTMLAttributeReferrerPolicy;
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
  | "CSP_ERROR"
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
        title: "Embedding Restricted",
        message: "This webpage has X-Frame-Options restrictions and cannot be embedded.",
        suggestion: "Suggestion: Try contacting the site administrator for embedding permissions, or choose another page.",
      };
    case "CSP_ERROR":
      return {
        title: "Content Security Policy Restriction",
        message: "This webpage has Content Security Policy (CSP) restrictions that prevent iframe display.",
        suggestion: "Suggestion: Please choose another page that allows embedding, or contact the site administrator.",
      };
    case "SECURITY_ERROR":
      return {
        title: "Security Restriction",
        message: "This page cannot be embedded due to security policy restrictions.",
        suggestion: "Suggestion: Please check the target website's security policy settings or choose another page.",
      };
    default:
      return {
        title: "Unknown Error",
        message: error.message || "An error occurred during loading.",
        suggestion: "Suggestion: Please refresh the page and try again.",
      };
  }
};
