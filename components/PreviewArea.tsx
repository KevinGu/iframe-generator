import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Chip, Spinner } from "@nextui-org/react";
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
import cn from "clsx";

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
    width: 1280,
    height: 720,
    scale: 1,
    className: "",
    label: "Desktop",
  },
  tablet: {
    width: 768,
    height: 1024,
    scale: 1,
    className: "rounded-lg",
    label: "Tablet",
  },
  mobile: {
    width: 375,
    height: 667,
    scale: 1,
    className: "rounded-xl",
    label: "Mobile",
  },
};

interface PreviewAreaProps {
  config: IFrameConfig;
  error: IframeError | null;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
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
    if (iframeRef.current?.contentWindow) {
      // 设置加载状态
      handleLoad();
      // 重新加载 iframe 内容
      iframeRef.current.contentWindow.location.reload();
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
      url:
        config.url && !config.url.startsWith("http")
          ? `https://${config.url}`
          : config.url,
    },
    deviceType,
    devicePresets: {
      desktop: { width: `${devicePresets.desktop.width}px` },
      tablet: { width: `${devicePresets.tablet.width}px` },
      mobile: { width: `${devicePresets.mobile.width}px` },
    },
    customStyles: generateStyles(),
  });

  // 修改预览尺寸计算逻辑
  const getPreviewDimensions = () => {
    return {
      width: `${config.width}${config.widthUnit}`,
      height: `${config.height}${config.heightUnit}`,
    };
  };

  // 添加判断是否需要显示设备轮廓的函数
  const shouldShowDeviceOutline = () => {
    const configWidth = parseInt(config.width);
    const configHeight = parseInt(config.height);
    return (
      configWidth <= devicePresets[deviceType].width ||
      configHeight <= devicePresets[deviceType].height
    );
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
    const actualHeight = configHeight;

    // 缩放后的尺寸
    const scale = getPreviewScale();
    const getScaledSize = () => {
      const scaledWidth = Math.round(actualWidth * scale);
      const scaledHeight = Math.round(actualHeight * scale);

      const scaledWidthWithUnit =
        config.widthUnit === "%"
          ? `${Math.round(configWidth * scale)}%`
          : `${scaledWidth}px`;

      return `${scaledWidthWithUnit}×${scaledHeight}px`;
    };

    return {
      device: deviceInfo, // 始终返回设备信息
      content: `Content: ${getContentSize()}`,
      scaled: scale !== 1 ? `Display: ${getScaledSize()}` : null,
    };
  };

  // 获取预览容器样式
  const getPreviewContainerStyle = (): React.CSSProperties => {
    const showOutline = shouldShowDeviceOutline();
    const devicePreset = devicePresets[deviceType];

    return {
      transform: `scale(${getPreviewScale()})`,
      width: showOutline
        ? `${devicePreset.width}px`
        : `${config.width}${config.widthUnit}`,
      height: showOutline
        ? `${devicePreset.height}px`
        : `${config.height}${config.heightUnit}`,
      transformOrigin: "center top",
      overflow: "hidden",
      ...(showOutline && {
        backgroundColor: "white",
        border: "12px solid #e2e8f0",
        borderRadius: deviceType === "mobile" ? "32px" : "16px",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        position: "relative",
      }),
    };
  };

  // 修改内部内容器样式
  const getContentContainerStyle = () => {
    const showOutline = shouldShowDeviceOutline();
    return {
      width: showOutline ? `${config.width}${config.widthUnit}` : "100%",
      height: "100%",
      margin: "0 auto",
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
      scaled: scale !== 1 ? ` (Scaled: ${scaledWidth}×${scaledHeight})` : "",
    };
  };

  return (
    <section className="space-y-4" aria-label="Preview section">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-gray-900">Preview</h2>
          {config.allowFullscreen && (
            <Chip
              startContent={<CheckIcon size={18} />}
              variant="flat"
              color="success"
              className="text-gray-900"
            >
              Fullscreen
            </Chip>
          )}
        </div>

        <nav
          className="flex items-center space-x-4"
          aria-label="Preview controls"
        >
          <ul
            className="text-sm text-gray-700 space-x-3 flex items-center"
            aria-label="Preview size information"
          >
            {(() => {
              const { device, content, scaled } = getPreviewSizeInfo();
              return (
                <>
                  <li aria-label="Device info">
                    <span>{device}</span>
                  </li>
                  <li aria-label="Content size">
                    <span>{content}</span>
                  </li>
                  {scaled && (
                    <li aria-label="Scaled size">
                      <span>{scaled}</span>
                    </li>
                  )}
                </>
              );
            })()}
          </ul>

          <Button
            isIconOnly
            aria-label="Refresh preview"
            onPress={refreshPreview}
            variant="light"
            className="ml-2"
            isLoading={loading}
          />

          <ButtonGroup variant="flat" aria-label="Device selection">
            <Button
              isIconOnly
              aria-label="Desktop view"
              aria-pressed={deviceType === "desktop"}
              onPress={() => handleDeviceChange("desktop")}
              className={deviceType === "desktop" ? "bg-blue-300" : ""}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              aria-label="Tablet view"
              aria-pressed={deviceType === "tablet"}
              onPress={() => handleDeviceChange("tablet")}
              className={deviceType === "tablet" ? "bg-blue-300" : ""}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              aria-label="Mobile view"
              aria-pressed={deviceType === "mobile"}
              onPress={() => handleDeviceChange("mobile")}
              className={deviceType === "mobile" ? "bg-blue-300" : ""}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </ButtonGroup>
        </nav>
      </header>

      <main className="relative bg-gray-50" role="main">
        {error && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20 p-6"
            role="alert"
            aria-live="assertive"
          >
            <div className="text-center max-w-md space-y-4">
              <div className="flex justify-center" aria-hidden="true">
                <svg
                  className="w-6 h-6 text-red-700"
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
              <h3 className="text-lg font-semibold text-red-700">
                {getIframeErrorMessage(error).title}
              </h3>
              <p className="text-gray-900">
                {getIframeErrorMessage(error).message}
              </p>
              <p className="text-sm text-gray-700">
                {getIframeErrorMessage(error).suggestion}
              </p>
            </div>
          </div>
        )}

        <div
          className={`
            flex justify-center items-center
            ${deviceType === "desktop" ? "min-h-[200px]" : "min-h-fit"}
          `}
          role="region"
          aria-label="Preview container"
        >
          <div
            className={`
              transition-all duration-300 relative
              ${isChangingDevice ? "opacity-50 scale-95" : "opacity-100 scale-100"}
              ${currentDevice.className}
            `}
            style={getPreviewContainerStyle()}
            role="presentation"
          >
            {config.url ? (
              <article
                className="relative bg-white h-full"
                style={getContentContainerStyle()}
              >
                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20 p-6">
                    <div className="text-center max-w-md space-y-4">
                      <div className="flex justify-center">
                        <svg
                          className="w-6 h-6 text-red-700"
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
                      <h3 className="text-lg font-semibold text-red-700">
                        {getIframeErrorMessage(error).title}
                      </h3>
                      <p className="text-gray-900">
                        {getIframeErrorMessage(error).message}
                      </p>
                      <p className="text-sm text-gray-700">
                        {getIframeErrorMessage(error).suggestion}
                      </p>
                    </div>
                  </div>
                )}

                {!error && (
                  <iframe
                    ref={iframeRef as React.LegacyRef<HTMLIFrameElement>}
                    {...iframeProps}
                    onLoad={handleLoad}
                    onError={() =>
                      handleIframeError(new Error("iframe加载失败"))
                    }
                    style={{
                      ...generateStyles(),
                      width: "100%",
                      height: "100%",
                      display: error ? "none" : "block",
                    }}
                    title="Preview content"
                  />
                )}
              </article>
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center bg-gray-50",
                  deviceType === "desktop"
                    ? `h-[${config.height}${config.heightUnit}]`
                    : "h-[400px]"
                )}
                role="region"
                aria-label="Empty preview area"
              />
            )}
          </div>
        </div>
      </main>
    </section>
  );
};

export default PreviewArea;
