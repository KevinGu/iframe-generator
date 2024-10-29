import React, { useState, useRef, useEffect } from 'react'

export interface IframeError {
  type: 'X_FRAME_OPTIONS' | 'CSP_VIOLATION' | 'NETWORK_ERROR' | 'LOAD_ERROR' | 'TIMEOUT';
  message: string;
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
   * 处理 iframe 加载完成
   */
  const handleLoad = () => {
    setLoadTime(Date.now() - startTime.current);
    setError(null);
    setLoading(false);
  };

  /**
   * 处理 iframe 加载错误
   */
  const handleError = (error: Error) => {
    console.error('Iframe error:', error); // 添加日志便于调试

    if (error instanceof DOMException && error.name === 'SecurityError') {
      setError({
        type: 'X_FRAME_OPTIONS',
        message: '该网页不允许被嵌入，可能是由于安全限制。'
      });
    } else if (error.name === 'NetworkError' || error.message.includes('network')) {
      setError({
        type: 'NETWORK_ERROR',
        message: '网络连接失败，请检查网络状态。'
      });
    } else {
      setError({
        type: 'LOAD_ERROR',
        message: error.message || '页面加载失败，请检查URL是否正确。'
      });
    }
    setLoading(false);
  };

  /**
   * 重试加载 iframe
   */
  const retry = () => {
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