import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, ButtonGroup, Chip } from "@nextui-org/react";
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
  width: string;
  height?: string;
  scale: number;
  className: string;
}

const devicePresets: Record<DeviceType, DevicePreset> = {
  desktop: {
    width: "100%",
    scale: 1,
    className: "",
  },
  tablet: {
    width: "100%",
    scale: 0.75,
    className: "rounded-lg border-8 border-gray-200",
  },
  mobile: {
    width: "100%",
    scale: 0.7,
    className: "rounded-xl border-8 border-gray-200",
  },
};

interface PreviewAreaProps {
  config: IFrameConfig;
  error: IframeError | null;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  handleLoad: () => void;
  handleIframeError: (error: Error) => void;
  generateStyles: () => React.CSSProperties;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({
  config,
  error,
  iframeRef,
  handleLoad,
  handleIframeError,
  generateStyles,
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");
  const currentDevice = devicePresets[deviceType];

  // 添加响应式预览
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
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
    config,
    deviceType,
    devicePresets,
    customStyles: generateStyles(),
  });

  // 修改预览尺寸计算逻辑
  const getPreviewDimensions = () => {
    return {
      width: `${config.width}${config.widthUnit}`,
      height: `${config.height}${config.heightUnit}`
    };
  };

  // 修改预览容器样式
  const getPreviewContainerStyle = () => {
    const { width, height } = getPreviewDimensions();
    return {
      transform: `scale(${getPreviewScale()})`,
      width,
      height,
      transformOrigin: 'center top',
      overflow: 'hidden',
    };
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">预览</h2>
          {config.allowFullscreen && (
            <Chip
              startContent={<CheckIcon size={18} />}
              variant="bordered"
              color="success"
              size="sm"
            >
              全屏功能已启用，但需要 iframe 内部页面支持并通过用户交互触发
            </Chip>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-500">
            当前预览尺寸: {currentDevice.width} x{" "}
            {currentDevice.height || "auto"}
          </p>

          <p className="text-sm text-gray-500">
            (Ctrl + Z 撤销, Ctrl + Y 重做)
          </p>

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
              onClick={() => handleDeviceChange("desktop")}
              className={deviceType === "desktop" ? "bg-blue-100" : ""}
              aria-label="桌面视图"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              onClick={() => handleDeviceChange("tablet")}
              className={deviceType === "tablet" ? "bg-blue-100" : ""}
              aria-label="平板视图"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              onClick={() => handleDeviceChange("mobile")}
              className={deviceType === "mobile" ? "bg-blue-100" : ""}
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
            ${deviceType === "desktop" ? "min-h-[600px]" : "min-h-fit"}
          `}>
            <div
              className={`
                transition-all duration-300
                ${isChangingDevice ? "opacity-50 scale-95" : "opacity-100 scale-100"}
                ${currentDevice.className}
              `}
              style={getPreviewContainerStyle()}
            >
              {config.url ? (
                <div className="relative bg-white h-full">
                  {/* 错误状态显示 */}
                  {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-20 p-6">
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

                  <iframe
                    ref={iframeRef}
                    {...iframeProps}
                    onLoad={handleLoad}
                    onError={() => handleIframeError(new Error("iframe加载失败"))}
                    style={{
                      ...generateStyles(),
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </div>
              ) : (
                <div className={`
                  flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200
                  ${deviceType === "desktop" 
                    ? `h-[${config.height}${config.heightUnit}]` 
                    : "h-[400px]"}
                `}>
                  <p className="text-gray-500">请输入一个URL以预览</p>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PreviewArea;
