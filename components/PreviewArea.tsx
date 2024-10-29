import React, { useState, useEffect } from 'react'
import { Card, CardBody, Button, ButtonGroup } from "@nextui-org/react"
import { IFrameConfig } from '../app/config/iframeTypes'
import { Monitor, Tablet, Smartphone, RefreshCw } from 'lucide-react'
import { generateIframeProps } from '../utils/iframeUtils'
import { IframeError } from '@/hooks/useIframePerformance'

type DeviceType = 'desktop' | 'tablet' | 'mobile'

interface DevicePreset {
  width: string;
  height?: string;
  scale: number;
  className: string;
}

const devicePresets: Record<DeviceType, DevicePreset> = {
  desktop: {
    width: '100%',
    scale: 1,
    className: ''
  },
  tablet: {
    width: '768px',
    height: '1024px',
    scale: 0.75,
    className: 'rounded-lg border-8 border-gray-200'
  },
  mobile: {
    width: '375px',
    height: '667px',
    scale: 0.7,
    className: 'rounded-xl border-8 border-gray-200'
  }
}

interface PreviewAreaProps {
  config: IFrameConfig
  loading: boolean
  error: IframeError | null
  retry: () => void
  retryCount: number
  iframeRef: React.RefObject<HTMLIFrameElement>
  handleLoad: () => void
  handleIframeError: (error: Error) => void
  generateStyles: () => React.CSSProperties
}

const PreviewArea: React.FC<PreviewAreaProps> = ({
  config,
  loading,
  error,
  retry,
  retryCount,
  iframeRef,
  handleLoad,
  handleIframeError,
  generateStyles
}) => {
  const [deviceType, setDeviceType] = React.useState<DeviceType>('desktop')
  const currentDevice = devicePresets[deviceType]

  // 添加响应式预览
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 动态调整预览尺寸
  const getPreviewScale = () => {
    if(viewportWidth < 768) {
      return Math.min(viewportWidth / parseInt(config.width), 1);
    }
    return currentDevice.scale;
  };

  // 添加预览刷新功能
  const refreshPreview = () => {
    if(iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  };

  // 添加设备切换动画状态
  const [isChangingDevice, setIsChangingDevice] = useState(false);

  const handleDeviceChange = (newDevice: DeviceType) => {
    setIsChangingDevice(true);
    setDeviceType(newDevice);
    setTimeout(() => setIsChangingDevice(false), 300);
  };

  const { props: iframeProps } = generateIframeProps({
    config,
    deviceType,
    devicePresets,
    customStyles: generateStyles()
  })

  /**
   * 获取错误消息详情
   * @param error IframeError 对象
   * @returns 错误详情对象
   */
  const getErrorMessage = (error: IframeError) => {
    switch (error.type) {
      case 'X_FRAME_OPTIONS':
        return {
          title: '页面限制嵌入',
          message: '该网页设置了 X-Frame-Options 限制，无法被嵌入。',
          suggestion: '建议：尝试联系网站管理员获取嵌入权限，或选择其他可嵌入的页面。'
        };
      case 'CSP_VIOLATION':
        return {
          title: 'CSP 限制',
          message: '内容安全策略限制了该页面的嵌入。',
          suggestion: '建议：检查目标网站的内容安全策略(CSP)设置。'
        };
      case 'SECURITY_ERROR':
        return {
          title: '安全错误',
          message: error.message,
          suggestion: error.details 
                      ? `详细信息: ${error.details}`
                      : '建议：请刷新页面重试或检查网络连接。'
        };
      case 'NETWORK_ERROR':
        return {
          title: '网络错误',
          message: '无法连接到目标网页。',
          suggestion: '建议：检查网络连接和URL是否正确。'
        };
      case 'LOAD_ERROR':
        return {
          title: '加载失败',
          message: '页面加载失败。',
          suggestion: '建议：检查URL是否正确，或稍后重试。'
        };
      case 'TIMEOUT':
        return {
          title: '加载超时',
          message: '页面加载超时。',
          suggestion: '建议：检查网络连接，或稍后重试。'
        };
      case 'PARTIAL_ACCESS':
        return {
          title: '部分内容受限',
          message: '无法完全访问嵌入页面的内容，部分功能可能受限。',
          suggestion: '建议：联系网站管理员以获取更多访问权限，或检查跨域设置。'
        };
      default:
        return {
          title: '未知错误',
          message: error.message || '加载过程中发生错误。',
          suggestion: '建议：请刷新页面重试。'
        };
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">预览</h2>
        
        {/* 添加预览尺寸显示和快捷键提示 */}
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-500">
            当前预览尺寸: {currentDevice.width} x {currentDevice.height || 'auto'}
          </p>
          
          {/* 添加快捷键提示 */}
          <p className="text-sm text-gray-500">
            (Ctrl + Z 撤销, Ctrl + Y 重做)
          </p>
          
          {/* 添加刷新按钮 */}
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={refreshPreview}
            aria-label="刷新预览"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          
          <ButtonGroup variant="light" size="sm">
            <Button
              isIconOnly
              onClick={() => handleDeviceChange('desktop')}
              className={deviceType === 'desktop' ? 'bg-blue-100' : ''}
              aria-label="桌面视图"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              onClick={() => handleDeviceChange('tablet')}
              className={deviceType === 'tablet' ? 'bg-blue-100' : ''}
              aria-label="平板视图"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              onClick={() => handleDeviceChange('mobile')}
              className={deviceType === 'mobile' ? 'bg-blue-100' : ''}
              aria-label="手机视图"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <Card className="bg-gray-50">
        <CardBody className="p-4">
          <div className={`
            flex justify-center items-center
            ${deviceType === 'desktop' ? 'min-h-[600px] h-[calc(100vh-200px)]' : 'min-h-fit'}
          `}>
            <div
              className={`
                transition-all duration-300
                ${isChangingDevice ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
                ${currentDevice.className}
              `}
              style={{
                transform: `scale(${getPreviewScale()})`,
                width: currentDevice.width,
                transformOrigin: 'center top',
                overflow: 'hidden',
                height: deviceType === 'desktop' ? '100%' : 'auto',
              }}
            >
              {config.url ? (
                <div className="relative bg-white h-full">
                  {/* 加载状态指示器 */}
                  {loading && config.performance.loadingIndicator && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                      {config.performance.loadingAnimation === 'spinner' && (
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
                      )}
                    </div>
                  )}
                  
                  {/* 错误状态显示 */}
                  {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-20 p-6">
                      <div className="text-center max-w-md space-y-4">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-red-600">
                          {getErrorMessage(error).title}
                        </h3>
                        <p className="text-gray-700">
                          {getErrorMessage(error).message}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getErrorMessage(error).suggestion}
                        </p>
                        <Button 
                          color="primary"
                          onClick={retry}
                          disabled={retryCount >= (config.performance?.retryCount || 3)}
                          className="mt-4"
                        >
                          重试 ({retryCount}/{config.performance?.retryCount || 3})
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <iframe
                    ref={iframeRef}
                    {...iframeProps}
                    onLoad={handleLoad}
                    onError={() => handleIframeError(new Error('iframe加载失败'))}
                    style={{
                      ...generateStyles(),
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                  />
                </div>
              ) : (
                <div className={`
                  flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200
                  ${deviceType === 'desktop' ? 'h-[600px]' : 'h-[400px]'}
                `}>
                  <p className="text-gray-500">请输入一个URL以预览</p>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default PreviewArea
