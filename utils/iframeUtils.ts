import { IFrameConfig } from '../app/config/iframeTypes'
import { DeviceType } from '../types/device'

interface GenerateIframePropsParams {
  config: IFrameConfig
  deviceType?: DeviceType
  devicePresets?: Record<DeviceType, { width: string; height?: string }>
  customStyles?: React.CSSProperties
}

export const generateIframeProps = ({
  config,
  deviceType = 'desktop',
  devicePresets,
  customStyles = {}
}: GenerateIframePropsParams) => {
  // 基础类名
  const baseClasses = [
    'w-full',
    'transition-all',
    'duration-200',
    config.customClass
  ].filter(Boolean)

  // 基础样式
  const baseStyles: React.CSSProperties = {
    border: 'none',
    ...customStyles,
  }

  // 设备相关的尺寸处理
  if (devicePresets && deviceType) {
    if (deviceType === 'desktop') {
      baseStyles.width = `${config.width}${config.widthUnit}`
      baseStyles.height = '100%'
    } else {
      baseStyles.width = '100%'
      baseStyles.height = devicePresets[deviceType].height
    }
  } else {
    baseStyles.width = `${config.width}${config.widthUnit}`
    baseStyles.height = `${config.height}${config.heightUnit}`
  }

  // 通用 iframe 属性
  const commonProps = {
    src: config.url,
    className: baseClasses.join(' '),
    loading: config.performance.preload ? 'eager' as const : 'lazy' as const,
    style: baseStyles,
    ...(config.scrolling ? {} : { scrolling: 'no' }),
    ...(config.allowFullscreen ? { allowFullScreen: true } : {}),
    ...(config.title ? { title: config.title } : {}),
    ...(config.ariaLabel ? { 'aria-label': config.ariaLabel } : {}),
    ...(config.sandbox.length > 0 ? { sandbox: config.sandbox.join(' ') } : {}),
    ...(config.referrerPolicy ? { referrerPolicy: config.referrerPolicy } : {}),
    ...(config.importance ? { importance: config.importance } : {})
  }

  return {
    props: commonProps,
    styleString: Object.entries(baseStyles)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ')
  }
} 