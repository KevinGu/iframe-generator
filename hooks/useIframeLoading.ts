import { useState, useEffect } from 'react'

/**
 * useIframeLoading Hook
 * 管理 iframe 的加载状态和超时处理。
 * 
 * @param url iframe 的 URL
 * @param timeout 超时时间（毫秒）
 * @returns 包含加载状态和处理函数的对象
 */
export const useIframeLoading = (url: string, timeout: number) => {
  const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'error'>('loading') // 加载状态
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null) // 超时计时器

  /**
   * 处理加载成功
   */
  const handleSuccess = () => {
    setLoadingState('success')
    if (timer) {
      clearTimeout(timer)
    }
  }

  /**
   * 处理加载错误
   */
  const handleError = () => {
    setLoadingState('error')
    if (timer) {
      clearTimeout(timer)
    }
  }

  // 监听 URL 变化，重置加载状态并设置超时
  useEffect(() => {
    setLoadingState('loading')
    if (timer) {
      clearTimeout(timer)
    }

    const newTimer = setTimeout(() => {
      setLoadingState('error')
    }, timeout)

    setTimer(newTimer)

    return () => {
      if (newTimer) {
        clearTimeout(newTimer)
      }
    }
  }, [url, timeout])

  return { loadingState, handleSuccess, handleError }
}
