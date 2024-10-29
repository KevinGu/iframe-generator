import { IFrameConfig } from './iframeTypes'

// 简化预设配置，只保留不同的属性
export const presets: Record<string, Partial<IFrameConfig>> = {
  default: {
    width: '100%',
    height: '600px',
    border: false,
    scrolling: false,
    allowFullscreen: true,
    backgroundColor: '#ffffff',
    boxShadow: 'none',
    padding: '0px',
  },
  blog: {
    height: '400px',
    border: true,
    borderStyle: '1px solid',
    borderColor: '#E2E8F0',
    borderRadius: '8px',
    scrolling: true,
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    padding: '16px',
    customClass: 'blog-iframe',
  },
  video: {
    height: '480px',
    borderRadius: '12px',
    allowFullscreen: true,
    backgroundColor: '#000000',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    customClass: 'video-iframe',
  }
}
