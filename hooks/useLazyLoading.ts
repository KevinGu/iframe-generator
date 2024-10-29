import { useEffect } from 'react'

/**
 * useLazyLoading Hook
 * 实现 iframe 的懒加载功能，当 iframe 进入视口时才开始加载。
 * 
 * @param iframeRef iframe 的引用对象
 * @param url iframe 的 URL
 * @param lazyLoad 是否启用懒加载
 */
export const useLazyLoading = (
  iframeRef: React.RefObject<HTMLIFrameElement>,
  url: string,
  lazyLoad: boolean
) => {
  useEffect(() => {
    if (!lazyLoad) {
      return
    }

    const iframe = iframeRef.current
    if (!iframe) {
      return
    }

    // 使用 Intersection Observer 监听 iframe 是否进入视口
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            iframe.src = url
            observerInstance.unobserve(entry.target)
          }
        })
      },
      {
        root: null, // 相对于视口
        rootMargin: '0px',
        threshold: 0.1 // 进入视口 10% 时触发
      }
    )

    observer.observe(iframe)

    // 清理观察器
    return () => {
      if (iframe) {
        observer.unobserve(iframe)
      }
    }
  }, [iframeRef, url, lazyLoad])
}
