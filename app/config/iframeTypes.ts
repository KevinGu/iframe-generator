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
  loadingAnimation: string;
  customClass: string;
  sandbox: string[];
  referrerPolicy: HTMLAttributeReferrerPolicy;
  allowedDomains: string[];
  title: string;
  ariaLabel: string;
  description: string;
  lazyLoad: boolean;
  autoHeight: boolean;
  preload: "none" | "auto";
  loading: "eager" | "lazy";
  importance: "auto" | "high" | "low";
  timeout?: number;
  fallbackContent?: string;
  csp: {
    enabled: boolean;
    directives: {
      defaultSrc: string[];
      scriptSrc: string[];
      styleSrc: string[];
      imgSrc: string[];
      connectSrc: string[];
      frameSrc: string[];
    };
  };
  xFrameOptions: "DENY" | "SAMEORIGIN" | "ALLOW-FROM";
  xFrameOptionsAllowFrom?: string;
  securityHeaders: {
    [key: string]: string;
  };
  domainWhitelist: string[];
  securityMode: "strict" | "moderate" | "relaxed";
  performance: {
    preconnect: boolean;
    preload: boolean;
    priority: "high" | "low" | "auto";
    timeout: number;
    retryCount: number;
    retryDelay: number;
    errorFallback: string;
    loadingIndicator: boolean;
    loadingAnimation: "spinner" | "skeleton" | "blur" | "none";
    monitorPerformance: boolean;
  };
}

// 添加自定义错误类
export class IframeError extends Error {
  type?: string;
  
  constructor(message: string, type?: string) {
    super(message);
    this.name = 'IframeError';
    this.type = type;
  }
}
