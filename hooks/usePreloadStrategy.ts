import { useEffect } from 'react'
import { IFrameConfig } from '../app/config/iframeTypes'

/**
 * usePreloadStrategy Hook
 * 实现 iframe 的预加载策略，包括预连接和预加载资源。
 * 
 * @param url iframe 的 URL
 * @param config iframe 配置对象
 */
export const usePreloadStrategy = (url: string, config: IFrameConfig) => {
  useEffect(() => {
    if (config.performance.preconnect) {
      const linkPreconnect = document.createElement('link')
      linkPreconnect.rel = 'preconnect'
      linkPreconnect.href = url
      document.head.appendChild(linkPreconnect)

      // 清理预连接链接
      return () => {
        document.head.removeChild(linkPreconnect)
      }
    }
  }, [url, config.performance.preconnect])

  useEffect(() => {
    if (config.performance.preload) {
      const linkPreload = document.createElement('link')
      linkPreload.rel = 'preload'
      linkPreload.as = 'document'
      linkPreload.href = url
      document.head.appendChild(linkPreload)

      // 清理预加载链接
      return () => {
        document.head.removeChild(linkPreload)
      }
    }
  }, [url, config.performance.preload])
}
