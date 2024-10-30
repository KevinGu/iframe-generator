import { useState, useRef, useEffect } from "react";
import { IframeError, IframeErrorType } from "@/app/config/iframeTypes";

/**
 * useIframePerformance Hook
 * 管理 iframe 的性能相关状态，包括加载状态、错误处理、重试机制等。
 *
 * @param url iframe 的 URL
 * @param performanceConfig 性能配置选项
 * @returns 包含性能状态和操作函数的对象
 */
export const useIframeStatus = (url: string) => {
  const [loading, setLoading] = useState(false); // 加载状态
  const [error, setError] = useState<IframeError | null>(null); // 错误状态

  const iframeRef = useRef<HTMLIFrameElement>(null); // iframe 引用

  // 添加一个辅助函数来确保 URL 格式一致
  const ensureProtocol = (inputUrl: string): string => {
    return inputUrl.match(/^https?:\/\//) ? inputUrl : `https://${inputUrl}`;
  };

  // 统一的错误处理函数
  const handleIframeError = (errorType: IframeErrorType, message: string, details?: string) => {
    setError({
      type: errorType,
      message,
      details
    });
    setLoading(false);
  };

  /**
   * 增强版检查嵌入功能
   */
  const checkEmbed = async (): Promise<boolean> => {
    if (!url) return false;
    
    try {
      const fullUrl = ensureProtocol(url);
      
      const response = await fetch(
        `/api/check-embed?url=${encodeURIComponent(fullUrl)}`,
        {
          redirect: "follow",
          signal: AbortSignal.timeout(10000)
        }
      );

      // 如果返回500错误，直接允许嵌入
      if (response.status === 500) return true;

      const { headers } = await response.json();
      
      // 检查 X-Frame-Options
      const xfo = headers["x-frame-options"]?.toLowerCase();
      if (xfo === "deny" || xfo === "sameorigin") {
        handleIframeError(
          "X_FRAME_OPTIONS",
          "目标网站禁止嵌入",
          `X-Frame-Options: ${xfo}`
        );
        return false;
      }

      // 检查 Content-Security-Policy
      const csp = headers["content-security-policy"];
      if (csp) {
        const frameAncestorsMatch = csp.match(/frame-ancestors\s+([^;]+)/);
        if (frameAncestorsMatch) {
          const allowedOrigins = frameAncestorsMatch[1]
            .split(' ')
            .map((origin: string) => origin.replace(/['"]/g, ''));
          
          if (allowedOrigins.includes('none') || allowedOrigins.length === 0) {
            handleIframeError(
              "CSP_ERROR",
              "目标网站的CSP策略禁止嵌入",
              `Content-Security-Policy frame-ancestors: ${allowedOrigins.join(', ')}`
            );
            return false;
          }
        }
      }
    } catch (e) {
      console.error("Error checking embed permissions:", e);
    }
    return true;
  };

  // 统一的事件处理
  useEffect(() => {
    if (!iframeRef.current) return;

    const handlers = {
      error: (event: ErrorEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const errorMessage = (event.message || "").toLowerCase();
        
        if (errorMessage.includes("content security policy") || 
            errorMessage.includes("frame-ancestors") || 
            errorMessage.includes("refused to frame")) {
          handleIframeError(
            "CSP_ERROR",
            "The webpage has Content Security Policy (CSP) restrictions that prevent iframe display",
            event.message
          );
        } else if (errorMessage.includes("x-frame-options")) {
          handleIframeError(
            "X_FRAME_OPTIONS",
            "The webpage has X-Frame-Options restrictions and cannot be embedded",
            event.message
          );
        }
      },
      
      securitypolicyviolation: (e: SecurityPolicyViolationEvent) => {
        handleIframeError(
          "CSP_ERROR",
          "该网页设置了内容安全策略(CSP)限制，不允许在iframe中显示",
          e.violatedDirective
        );
      }
    };

    // 添加事件监听
    Object.entries(handlers).forEach(([event, handler]) => {
      iframeRef.current?.addEventListener(event, handler as any);
      window.addEventListener(event, handler as any);
    });

    // 清理事件监听
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        iframeRef.current?.removeEventListener(event, handler as any);
        window.removeEventListener(event, handler as any);
      });
    };
  }, [iframeRef.current]);

  // 只在 URL 变化时检查一次
  useEffect(() => {
    if (url) {
      setLoading(true);
      setError(null);

      // 使用处理过的 URL 进行检查
      const fullUrl = ensureProtocol(url);
      checkEmbed().then((canEmbed) => {
        if (!canEmbed) {
          setLoading(false);
        }
      });
    }
  }, [url]);

  // 简化 load 事件处理
  const handleLoad = () => {
    if (!error) {
      setLoading(false);
    }
  };

  /**
   * 处理 iframe 加载错误
   */
  const handleError = (error: Error) => {
    console.error("Iframe error:", error);
    const errorMessage = error.message.toLowerCase();

    let iframeError: IframeError;

    if (errorMessage.includes("x-frame-options")) {
      iframeError = {
        type: "X_FRAME_OPTIONS",
        message: "该网页不允许被嵌入",
        details: error.message,
      };
    } else if (
      error instanceof DOMException &&
      error.name === "SecurityError"
    ) {
      iframeError = {
        type: "SECURITY_ERROR",
        message: "由于安全策略限制，无法加载该页面",
        details: error.message,
      };
    } else if (errorMessage.includes("network")) {
      iframeError = {
        type: "NETWORK_ERROR",
        message: "网络连接失败，请检查网络状态",
        details: error.message,
      };
    } else {
      iframeError = {
        type: "LOAD_ERROR",
        message: "页面加载失败，请检查URL是否正确",
        details: error.message,
      };
    }

    setError(iframeError);
    setLoading(false);
  };

  return {
    loading, // 当前加载状态
    error, // 当前错误
    iframeRef, // iframe 引用
    handleLoad, // 加载完成处理函数
    handleError, // 加载错误处理函数
  };
};
