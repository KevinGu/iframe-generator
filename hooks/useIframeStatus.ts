import { useState, useRef, useEffect } from "react";
import { IframeError } from "@/app/config/iframeTypes";

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

  /**
   * 检查是否可以嵌入
   */
  const checkEmbed = async (): Promise<boolean> => {
    if (!url) return false;
    try {
      const response = await fetch(
        `/api/check-embed?url=${encodeURIComponent(url)}`
      );
      const data: { canEmbed: boolean; reason?: string } =
        await response.json();
      if (!data.canEmbed) {
        setError({
          type: "SECURITY_ERROR",
          message: data.reason || "无法嵌入该页面",
        });
        return false;
      }
      return true;
    } catch (e) {
      setError({
        type: "NETWORK_ERROR",
        message: "嵌入检测请求失败",
        details: (e as Error).message,
      });
      return false;
    }
  };

  /**
   * 处理 iframe 加载完成
   */
  const handleLoad = async () => {
    console.log("iframeRef", iframeRef);
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;

      // 检查是否可以嵌入
      const canEmbed = await checkEmbed();
      if (!canEmbed) {
        setLoading(false);
        return;
      }

      try {
        const iframeWindow = iframe.contentWindow;

        // 尝试多种方式检测访问权限
        let accessLevel = "full";

        try {
          iframeWindow?.location.href;
        } catch (e) {
          if (iframeWindow) {
            accessLevel = "partial";
          } else {
            accessLevel = "none";
          }
        }

        if (accessLevel === "none") {
          setError({
            type: "SECURITY_ERROR",
            message: "无法访问嵌入页面的内容（完全跨域限制）",
            details: "无法获取 contentWindow，可能由于严格的跨域限制。",
          });
        } else if (accessLevel === "partial") {
          console.warn("iframe 内容访问受限，部分功能可能不可用");
        }

        setError(null);
        setLoading(false);
      } catch (e) {
        handleError(e as Error);
      }
    } catch (e) {
      handleError(e as Error);
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
    } else if (error instanceof DOMException && error.name === "SecurityError") {
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

  // 监听 URL 变化，重置状态
  useEffect(() => {
    if (url) {
      setLoading(true);
      setError(null);
    }
  }, [url]);

  useEffect(() => {
    if (!iframeRef.current) return;

    const handleIframeError = (event: ErrorEvent) => {
      // 阻止事件冒泡
      event.preventDefault();
      event.stopPropagation();

      const errorMessage = event.message || "";

      if (
        errorMessage.includes("X-Frame-Options") ||
        errorMessage.includes("refused to display") ||
        errorMessage.includes("Cross-Origin-Opener-Policy")
      ) {
        setError({
          type: "SECURITY_ERROR",
          message: "该网页不允许被嵌入",
          details: errorMessage,
        });
        setLoading(false);
      }
    };

    // 监听 iframe 的加载错误
    iframeRef.current.addEventListener("error", handleIframeError as any);
    window.addEventListener("error", handleIframeError);

    return () => {
      iframeRef.current?.removeEventListener("error", handleIframeError as any);
      window.removeEventListener("error", handleIframeError);
    };
  }, [iframeRef.current]);

  return {
    loading, // 当前加载状态
    error, // 当前错误
    iframeRef, // iframe 引用
    handleLoad, // 加载完成处理函数
    handleError, // 加载错误处理函数
  };
};
