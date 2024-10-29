import { useEffect } from 'react'

/**
 * useAutoHeight Hook
 * 自动调整 iframe 的高度，以适应其内容高度。
 * 
 * @param iframeRef iframe 的引用对象
 */
export const useAutoHeight = (iframeRef: React.RefObject<HTMLIFrameElement>) => {
  /**
   * 调整 iframe 高度的函数
   */
  const adjustHeight = () => {
    const iframe = iframeRef.current
    if (iframe && iframe.contentWindow) {
      try {
        const height = iframe.contentWindow.document.body.scrollHeight
        iframe.style.height = `${height}px`
      } catch (error) {
        console.warn('无法访问 iframe 内容，自动高度调整失败。', error)
      }
    }
  }

  // 监听 iframe 加载完成后调整高度
  useEffect(() => {
    const iframe = iframeRef.current
    if (iframe) {
      iframe.addEventListener('load', adjustHeight)
      window.addEventListener('resize', adjustHeight)

      // 清理事件监听器
      return () => {
        iframe.removeEventListener('load', adjustHeight)
        window.removeEventListener('resize', adjustHeight)
      }
    }
  }, [iframeRef])

  return { adjustHeight }
}
