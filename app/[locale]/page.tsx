"use client";

import React from "react";
import { presets } from "../config/presets";
import { IFrameConfig } from "../config/iframeTypes";
import { useIframePerformance } from "../../hooks/useIframePerformance";
import { useAutoHeight } from "../../hooks/useAutoHeight";
import { useIframeLoading } from "../../hooks/useIframeLoading";
import { usePreloadStrategy } from "../../hooks/usePreloadStrategy";
import { useLazyLoading } from "../../hooks/useLazyLoading";
import SettingsTabs from "../../components/SettingsTabs";
import PreviewArea from "../../components/PreviewArea";
import CodePreview from "../../components/CodePreview";
import { isValidUrl, radiusPresets } from "../../utils/helpers";
import { Input } from "@nextui-org/react";
import { Link2, LinkIcon } from "lucide-react";
import { generateIframeProps } from "@/utils/iframeUtils";

// 默认配置更新
const defaultConfig: IFrameConfig = {
  url: "",
  width: "100",
  widthUnit: "%",
  height: "600",
  heightUnit: "px",
  border: true,
  borderSize: "0",
  borderStyle: "none",
  borderColor: "transparent",
  borderRadiusName: "none",
  scrolling: false,
  allowFullscreen: true,
  backgroundColor: "#ffffff",
  padding: "0px",
  loadingAnimation: "none",
  customClass: "",
  sandbox: [],
  referrerPolicy: "strict-origin-when-cross-origin",
  allowedDomains: [],
  title: "",
  ariaLabel: "",
  description: "",
  lazyLoad: false,
  autoHeight: false,
  preload: "auto",
  loading: "eager",
  importance: "auto",
  timeout: 10000,
  fallbackContent: "<p>加载失败，请刷新重试</p>",
  csp: {
    enabled: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'"],
    },
  },
  xFrameOptions: "SAMEORIGIN",
  securityHeaders: {
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
  },
  domainWhitelist: [],
  securityMode: "strict",
  performance: {
    preconnect: true,
    preload: true,
    priority: "auto",
    timeout: 10000,
    retryCount: 3,
    retryDelay: 1000,
    errorFallback: "<div>加载失败，请刷新重试</div>",
    loadingIndicator: true,
    loadingAnimation: "spinner",
    monitorPerformance: true,
  },
};

const IFrameGenerator: React.FC = () => {
  // 添加历史记录状态
  const [urlHistory, setUrlHistory] = React.useState<
    Array<{
      url: string;
      config: IFrameConfig;
      timestamp: number;
    }>
  >(() => {
    // 从localStorage加载历史记录，并只保留最新的10条
    const saved = localStorage.getItem("iframe-url-history");
    const history = saved ? JSON.parse(saved) : [];
    // 如果超过10条，只保留最新的10条
    const trimmedHistory = history.slice(0, 10);
    // 如果历史记录被裁剪了，更新localStorage
    if (history.length > 10) {
      localStorage.setItem("iframe-url-history", JSON.stringify(trimmedHistory));
    }
    return trimmedHistory;
  });

  // 管理配置状态
  const [config, setConfig] = React.useState<IFrameConfig>(defaultConfig);
  const [errors, setErrors] = React.useState({
    url: false,
    width: false,
    height: false,
  });

  /**
   * 保存到历史记录
   * 只在URL完整且有效时保存
   */
  const saveToHistory = (url: string, currentConfig: IFrameConfig) => {
    // 确保URL是完整且有效的
    if (!url || !isValidUrl(url) || !url.includes(".")) {
      return;
    }

    const newHistory = [
      {
        url,
        config: currentConfig,
        timestamp: Date.now(),
      },
      ...urlHistory.filter((item) => item.url !== url),
    ].slice(0, 10); // 确保只保留10条记录

    setUrlHistory(newHistory);
    localStorage.setItem("iframe-url-history", JSON.stringify(newHistory));
  };

  /**
   * 核心验证函数
   * 根据配置项的键值进行验证，并更新配置和错误状态
   * @param key 配置项的键
   * @param value 配置项的值
   */
  const validateAndUpdateConfig = (key: keyof IFrameConfig, value: any) => {
    let isValid = true;

    switch (key) {
      case "url":
        setConfig((prev) => ({ ...prev, url: value }));
        isValid = isValidUrl(value);
        setErrors((prev) => ({ ...prev, url: !isValid }));
        return;
      case "width":
      case "height":
        const numericValue = value.replace(/[^0-9]/g, "");
        isValid = numericValue !== "" && parseInt(numericValue) > 0;
        setErrors((prev) => ({ ...prev, [key]: !isValid }));
        if (isValid) {
          setConfig((prev) => ({ ...prev, [key]: numericValue }));
        }
        break;
      default:
        setConfig((prev) => ({ ...prev, [key]: value }));
        return;
    }
  };

  /**
   * 处理URL输入完成事件
   * 在用户完成输入后(失去焦点或按回车)才保存
   */
  const handleUrlInputComplete = (url: string) => {
    if (url && isValidUrl(url) && url.includes(".")) {
      saveToHistory(url, config);
    }
  };

  /**
   * 应用预设配置
   * 根据预设名称应用相应的配置
   * @param presetName 预设名称
   */
  const applyPreset = (presetName: keyof typeof presets) => {
    setConfig((prev) => ({
      ...prev,
      ...presets[presetName],
    }));
  };

  /**
   * 格式化代码输出
   * 对生成的代码进行格式化，提高可读性
   * @param code 需要格式化的代码字符串
   * @returns 格式化后的代码字符串
   */
  const formatCode = (code: string) => {
    return code
      .replace(/\s+/g, " ")
      .replace(/>\s+</g, ">\n<")
      .replace(/([{};])/g, "$1\n  ")
      .trim();
  };

  /**
   * 生成 HTML 代码
   * 根据当前配置生成 iframe 的 HTML 代码
   * @param cfg 可选的配置对象，如未提供则使用当前状态配置
   * @returns 生成的 HTML 代码字符串
   */
  const generateHTML = (cfg?: IFrameConfig) => {
    const currentConfig = cfg || config;

    const { props, styleString } = generateIframeProps({
      config: currentConfig,
    });

    // 将 React 属性转换为 HTML 属性
    const htmlAttributes = Object.entries(props)
      .map(([key, value]) => {
        if (key === "className") return `class="${value}"`;
        if (key === "style") return `style="${styleString}"`;
        if (typeof value === "boolean") return value ? key : "";
        return `${key.toLowerCase()}="${value}"`;
      })
      .filter(Boolean)
      .join(" ");

    const code = `<iframe ${htmlAttributes}></iframe>`;
    return formatCode(code);
  };

  /**
   * 生成样式字符串
   * 根据当前配置生成 iframe 的行内样式
   * @returns 样式对象
   */
  const generateStyles = () => {
    const styles = {
      backgroundColor: config.backgroundColor,
      padding: config.padding,
      border: config.border
        ? `${config.borderStyle} ${config.borderColor}`
        : "none",
      borderRadius: radiusPresets[config.borderRadiusName],
    };
    return styles;
  };

  // 使用自定义 Hook 管理 iframe 的性能
  const {
    loading,
    error,
    retryCount,
    loadTime,
    retry,
    iframeRef,
    handleLoad,
    handleError: handleIframeError,
  } = useIframePerformance(config.url, config.performance);

  // 使用自定义 Hook 实现自动调整 iframe 高度
  const { adjustHeight } = useAutoHeight(iframeRef);

  // 使用自定义 Hook 管理 iframe 加载状态和超时
  const { loadingState, handleSuccess, handleError } = useIframeLoading(
    config.url,
    config.performance.timeout
  );

  // 使用自定义 Hook 实现预加载策略
  usePreloadStrategy(config.url, config);

  // 使用自定义 Hook 实现懒加载
  useLazyLoading(iframeRef, config.url, config.lazyLoad);

  /**
   * 删除历史记录
   */
  const removeFromHistory = (urlToRemove: string) => {
    const newHistory = urlHistory.filter((item) => item.url !== urlToRemove);
    setUrlHistory(newHistory);
    localStorage.setItem("iframe-url-history", JSON.stringify(newHistory));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* 顶部标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            IFrame 生成器
          </h1>
          <p className="text-lg text-gray-600">成和配置响应式、全的 iframe</p>
        </div>

        <div className="space-y-8">
          {/* URL 输入区域 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold mr-4 min-w-[6rem]">
                网页地址
              </h2>
              <div className="flex-1 w-full">
                <Input
                  placeholder="输入要嵌入的网页地址"
                  radius="none"
                  size="lg"
                  variant="underlined"
                  labelPlacement="outside-left"
                  value={config.url}
                  onChange={(e) =>
                    validateAndUpdateConfig("url", e.target.value)
                  }
                  isInvalid={errors.url}
                  errorMessage={errors.url && "请输入有效的网页地址"}
                  startContent={
                    <Link2 className="w-5 h-5 text-gray-400/90 flex-shrink-0" />
                  }
                  maxLength={2000}
                  classNames={{
                    mainWrapper: "h-[50px] w-10/12",
                  }}
                  onBlur={(e) =>
                    handleUrlInputComplete((e.target as HTMLInputElement).value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUrlInputComplete(e.currentTarget.value);
                    }
                  }}
                />
              </div>
            </div>

            {/* 历史记录列表 */}
            {urlHistory.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500">最近使用：</p>
                <div className="flex flex-wrap gap-2">
                  {urlHistory.map((item, index) => (
                    <div
                      key={index}
                      className="group inline-flex items-center px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 transition-colors"
                    >
                      <button
                        onClick={() => setConfig(item.config)}
                        className="inline-flex items-center"
                      >
                        <LinkIcon className="w-3 h-3 mr-2" />
                        {item.url.length > 30
                          ? item.url.substring(0, 30) + "..."
                          : item.url}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(item.url);
                        }}
                        className="ml-2 p-0.5 rounded-full hover:bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          className="w-3 h-3 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 设置选项卡 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <SettingsTabs
              config={config}
              setConfig={setConfig}
              errors={errors}
              validateAndUpdateConfig={validateAndUpdateConfig}
              applyPreset={applyPreset}
            />
          </div>

          {/* 预览区域 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <PreviewArea
              config={config}
              loading={loading}
              error={error}
              retry={retry}
              retryCount={retryCount}
              iframeRef={iframeRef}
              handleLoad={handleLoad}
              handleIframeError={handleIframeError}
              generateStyles={generateStyles}
            />
          </div>

          {/* 代码预览区域 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <CodePreview generateHTML={generateHTML} />
          </div>
        </div>

        {/* 底部区域 */}
        <footer className="mt-12 text-center text-sm text-gray-500 py-6 border-t">
          <p>使用先进的技术构建更好的iframe体验</p>
        </footer>
      </div>
    </div>
  );
};

export default IFrameGenerator;
