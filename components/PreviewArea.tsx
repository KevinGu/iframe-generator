import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, ButtonGroup, Chip, Spinner } from "@nextui-org/react";
import { IFrameConfig } from "../app/config/iframeTypes";
import {
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  CheckIcon,
} from "lucide-react";
import { generateIframeProps } from "@/utils/iframeHelpers";
import { IframeError, getIframeErrorMessage } from "@/app/config/iframeTypes";

type DeviceType = "desktop" | "tablet" | "mobile";

interface DevicePreset {
  width: number;
  height: number;
  scale: number;
  className: string;
  label: string;
}

const devicePresets: Record<DeviceType, DevicePreset> = {
  desktop: {
    width: 1920,
    height: 1080,
    scale: 1,
    className: "",
    label: "Desktop"
  },
  tablet: {
    width: 768,
    height: 1024,
    scale: 1,
    className: "rounded-lg",
    label: "Tablet"
  },
  mobile: {
    width: 375,
    height: 667,
    scale: 1,
    className: "rounded-xl",
    label: "Mobile"
  },
};

interface PreviewAreaProps {
  config: IFrameConfig;
  error: IframeError | null;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  handleLoad: () => void;
  handleIframeError: (error: Error) => void;
  generateStyles: () => React.CSSProperties;
  loading: boolean;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({
  config,
  error,
  iframeRef,
  handleLoad,
  handleIframeError,
  generateStyles,
  loading,
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");
  const currentDevice = devicePresets[deviceType];

  // 修复服务器端渲染问题
  const [viewportWidth, setViewportWidth] = useState<number>(0);

  useEffect(() => {
    // 在客户端初始化时设置视口宽度
    setViewportWidth(window.innerWidth);
    
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 动态调整预览尺寸
  const getPreviewScale = () => {
    if (viewportWidth < 768) {
      return Math.min(viewportWidth / parseInt(config.width), 1);
    }
    return currentDevice.scale;
  };

  // 添加预览刷新功能
  const refreshPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
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
    config: {
      ...config,
      // 确保 URL 包含协议
      url: config.url && !config.url.startsWith('http') 
        ? `https://${config.url}`
        : config.url
    },
    deviceType,
    devicePresets: {
      desktop: { width: `${devicePresets.desktop.width}px` },
      tablet: { width: `${devicePresets.tablet.width}px` },
      mobile: { width: `${devicePresets.mobile.width}px` }
    },
    customStyles: generateStyles(),
  });

  // 修改预览尺寸计算逻辑
  const getPreviewDimensions = () => {
    return {
      width: `${config.width}${config.widthUnit}`,
      height: `${config.height}${config.heightUnit}`
    };
  };

  // 添加判断是否需要显示设备轮廓的函数
  const shouldShowDeviceOutline = () => {
    const configWidth = parseInt(config.width);
    const configHeight = parseInt(config.height);
    return configWidth <= devicePresets[deviceType].width || 
           configHeight <= devicePresets[deviceType].height;
  };

  // 获取预览尺寸信息
  const getPreviewSizeInfo = () => {
    const configWidth = parseInt(config.width);
    const configHeight = parseInt(config.height);
    const devicePreset = devicePresets[deviceType];
    const showOutline = shouldShowDeviceOutline();
    
    // 始终显示设备信息，不再对桌面设备特殊处理
    const deviceInfo = `${devicePreset.label} (${devicePreset.width}×${devicePreset.height}px)`;
    
    // 添加单位显示逻辑
    const getContentSize = () => {
      const widthWithUnit = `${configWidth}${config.widthUnit}`;
      const heightWithUnit = `${configHeight}px`; // 高度始终使用px
      return `${widthWithUnit}×${heightWithUnit}`;
    };
    
    // 实际渲染尺寸
    const actualWidth = showOutline 
      ? Math.min(configWidth, devicePresets[deviceType].width)
      : configWidth;
    const actualHeight = showOutline
      ? Math.min(configHeight, devicePreset.height)
      : configHeight;
    
    // 缩放后的尺寸
    const scale = getPreviewScale();
    const getScaledSize = () => {
      const scaledWidth = Math.round(actualWidth * scale);
      const scaledHeight = Math.round(actualHeight * scale);
      
      const scaledWidthWithUnit = config.widthUnit === '%' 
        ? `${Math.round(configWidth * scale)}%`
        : `${scaledWidth}px`;
      
      return `${scaledWidthWithUnit}×${scaledHeight}px`;
    };
    
    return {
      device: deviceInfo, // 始终返回设备信息
      content: `Content: ${getContentSize()}`,
      scaled: scale !== 1 ? `Display: ${getScaledSize()}` : null
    };
  };

  // 获取预览容器样式
  const getPreviewContainerStyle = (): React.CSSProperties => {
    const showOutline = shouldShowDeviceOutline();
    const devicePreset = devicePresets[deviceType];
    
    return {
      transform: `scale(${getPreviewScale()})`,
      width: showOutline ? `${devicePreset.width}px` : `${config.width}${config.widthUnit}`,
      height: showOutline ? `${devicePreset.height}px` : `${config.height}${config.heightUnit}`,
      transformOrigin: 'center top',
      overflow: 'hidden',
      ...(showOutline && {
        backgroundColor: 'white',
        border: '12px solid #e2e8f0',
        borderRadius: deviceType === 'mobile' ? '32px' : '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        position: 'relative',
      })
    };
  };

  // 修改内部内容器样式
  const getContentContainerStyle = () => {
    const showOutline = shouldShowDeviceOutline();
    return {
      width: showOutline ? `${config.width}${config.widthUnit}` : '100%',
      height: '100%',
      margin: '0 auto',
    };
  };

  // 添加一个函数来获当前实际预览尺寸
  const getCurrentPreviewSize = () => {
    const showOutline = shouldShowDeviceOutline();
    const configWidth = parseInt(config.width);
    const configHeight = parseInt(config.height);
    
    // 实际宽度
    const actualWidth = showOutline 
      ? Math.min(configWidth, devicePresets[deviceType].width) 
      : configWidth;
    
    // 实际高度
    const actualHeight = configHeight;
    
    // 缩放后的尺寸
    const scale = getPreviewScale();
    const scaledWidth = Math.round(actualWidth * scale);
    const scaledHeight = Math.round(actualHeight * scale);
    
    return {
      actual: `${actualWidth}×${actualHeight}`,
      scaled: scale !== 1 ? ` (Scaled: ${scaledWidth}×${scaledHeight})` : ''
    };
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">Preview</h2>
          {config.allowFullscreen && (
            <Chip
              startContent={<CheckIcon size={18} />}
              variant="bordered"
              color="success"
              size="sm"
            >
              Fullscreen enabled but requires internal page support and user interaction
            </Chip>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 space-x-3">
            {(() => {
              const { device, content, scaled } = getPreviewSizeInfo();
              return (
                <>
                  {device && <span>{device}</span>}
                  <span>{content}</span>
                  {scaled && <span>{scaled}</span>}
                </>
              );
            })()}
          </div>

          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={refreshPreview}
            aria-label="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          <ButtonGroup variant="light" size="sm">
            <Button
              isIconOnly
              onClick={() => handleDeviceChange("desktop")}
              className={deviceType === "desktop" ? "bg-blue-100" : ""}
              aria-label="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              onClick={() => handleDeviceChange("tablet")}
              className={deviceType === "tablet" ? "bg-blue-100" : ""}
              aria-label="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              onClick={() => handleDeviceChange("mobile")}
              className={deviceType === "mobile" ? "bg-blue-100" : ""}
              aria-label="Mobile View"
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
            ${deviceType === "desktop" ? "min-h-[600px]" : "min-h-fit"}
          `}>
            <div
              className={`
                transition-all duration-300 relative
                ${isChangingDevice ? "opacity-50 scale-95" : "opacity-100 scale-100"}
                ${currentDevice.className}
              `}
              style={getPreviewContainerStyle()}
            >
              {config.url ? (
                <div 
                  className="relative bg-white h-full"
                  style={getContentContainerStyle()}
                >
                  {/* 加载状态显示 */}
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                      <div className="text-center space-y-3">
                        <Spinner size="lg" color="primary" />
                        <p className="text-sm text-gray-600">Loading...</p>
                      </div>
                    </div>
                  )}

                  {/* 错误状态显示 */}
                  {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20 p-6">
                      <div className="text-center max-w-md space-y-4">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-red-600">
                          {getIframeErrorMessage(error).title}
                        </h3>
                        <p className="text-gray-700">
                          {getIframeErrorMessage(error).message}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getIframeErrorMessage(error).suggestion}
                        </p>
                      </div>
                    </div>
                  )}

                  {!error && (
                    <iframe
                      ref={iframeRef}
                      {...iframeProps}
                      onLoad={handleLoad}
                      onError={() => handleIframeError(new Error("iframe加载失败"))}
                      style={{
                        ...generateStyles(),
                        width: '100%',
                        height: '100%',
                        display: error ? 'none' : 'block',
                      }}
                    />
                  )}
                </div>
              ) : (
                <div 
                  className={`
                    flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200
                    ${deviceType === "desktop" 
                      ? `h-[${config.height}${config.heightUnit}]` 
                      : "h-[400px]"}
                  `}
                  aria-label="Empty preview area"
                />
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PreviewArea;
