import React, { useState, useRef, useEffect } from 'react'

export interface IframeError {
  type: 'X_FRAME_OPTIONS' | 'CSP_VIOLATION' | 'NETWORK_ERROR' | 'LOAD_ERROR' | 'TIMEOUT' | 'SECURITY_ERROR' | 'PARTIAL_ACCESS';
  message: string;
  details?: string;
}

/**
 * useIframePerformance Hook
 * 管理 iframe 的性能相关状态，包括加载状态、错误处理、重试机制等。
 * 
 * @param url iframe 的 URL
 * @param performanceConfig 性能配置选项
 * @returns 包含性能状态和操作函数的对象
 */
export const useIframePerformance = (url: string, performanceConfig: any) => {
  const [loading, setLoading] = useState(false) // 加载状态
  const [error, setError] = useState<IframeError | null>(null) // 错误状态
  const [retryCount, setRetryCount] = useState(0) // 重试次数
  const [loadTime, setLoadTime] = useState(0) // 加载时间

  const iframeRef = useRef<HTMLIFrameElement>(null) // iframe 引用
  const startTime = useRef(0) // 开始加载时间

  /**
   * 检查是否可以嵌入
   */
  const checkEmbed = async (): Promise<boolean> => {
    if (!url) return false;
    try {
      const response = await fetch(`/api/check-embed?url=${encodeURIComponent(url)}`);
      const data: { canEmbed: boolean; reason?: string } = await response.json();
      if (!data.canEmbed) {
        setError({
          type: 'SECURITY_ERROR',
          message: data.reason || '无法嵌入该页面',
        });
        return false;
      }
      return true;
    } catch (e) {
      setError({
        type: 'NETWORK_ERROR',
        message: '嵌入检测请求失败',
        details: (e as Error).message,
      });
      return false;
    }
  };

  /**
   * 处理 iframe 加载完成
   */
  const handleLoad = async () => {
    console.log("iframeRef", iframeRef)
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
        let accessLevel = 'full';
        
        try {
          // 尝试访问 location (最基本的跨域访问)
          iframeWindow?.location.href;
        } catch (e) {
          // 如果无法访问 location，检查是否至少能获取到 contentWindow
          if (iframeWindow) {
            accessLevel = 'partial';
          } else {
            accessLevel = 'none';
          }
        }

        if (accessLevel === 'none') {
          setError({
            type: 'SECURITY_ERROR',
            message: '无法访问嵌入页面的内容（完全跨域限制）',
            details: '无法获取 contentWindow，可能由于严格的跨域限制。',
          });
        } else if (accessLevel === 'partial') {
          // 仅显示警告，不阻止加载
          console.warn('iframe 内容访问受限，部分功能可能不可用');
        }

        // 加载成功
        setLoadTime(Date.now() - startTime.current);
        setError(null);
        setLoading(false);

      } catch (e) {
        // 处理其他错误
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
    console.error('Iframe error:', error);

    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('x-frame-options') || 
        errorMessage.includes('refused to display') ||
        errorMessage.includes('cross-origin-opener-policy')) {
      setError({
        type: 'SECURITY_ERROR',
        message: '该网页不允许被嵌入',
        details: error.message,
      });
    } else if (error instanceof DOMException && error.name === 'SecurityError') {
      setError({
        type: 'SECURITY_ERROR',
        message: '由于安全策略限制，无法加载该页面',
        details: error.message,
      });
    } else if (errorMessage.includes('network')) {
      setError({
        type: 'NETWORK_ERROR',
        message: '网络连接失败，请检查网络状态',
        details: error.message,
      });
    } else {
      setError({
        type: 'LOAD_ERROR',
        message: '页面加载失败，请检查URL是否正确',
        details: error.message,
      });
    }
    setLoading(false);
  };

  /**
   * 重试加载 iframe
   */
  const retry = async () => {
    if (retryCount < performanceConfig.retryCount) {
      setRetryCount(prev => prev + 1)
      setLoading(true)
      setError(null)
      startTime.current = Date.now()
      if (iframeRef.current) {
        iframeRef.current.src = url
      }
    }
  }

  // 监听 URL 变化，重置状态
  useEffect(() => {
    if (url) {
      setLoading(true)
      setError(null)
      setRetryCount(0)
      startTime.current = Date.now()
    }
  }, [url])

  useEffect(() => {
    if (!iframeRef.current) return;

    const handleIframeError = (event: ErrorEvent) => {
      // 阻止事件冒泡
      event.preventDefault();
      event.stopPropagation();

      const errorMessage = event.message || '';
      
      if (errorMessage.includes('X-Frame-Options') || 
          errorMessage.includes('refused to display') ||
          errorMessage.includes('Cross-Origin-Opener-Policy')) {
        setError({
          type: 'SECURITY_ERROR',
          message: '该网页不允许被嵌入',
          details: errorMessage,
        });
        setLoading(false);
      }
    };

    // 监听 iframe 的加载错误
    iframeRef.current.addEventListener('error', handleIframeError as any);
    window.addEventListener('error', handleIframeError);

    return () => {
      iframeRef.current?.removeEventListener('error', handleIframeError as any);
      window.removeEventListener('error', handleIframeError);
    };
  }, [iframeRef.current]);

  return {
    loading, // 当前加载状态
    error, // 当前错误
    retryCount, // 当前重试次数
    loadTime, // 加载时间
    retry, // 重试函数
    iframeRef, // iframe 引用
    handleLoad, // 加载完成处理函数
    handleError // 加载错误处理函数
  }
}
