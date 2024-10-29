"use client";

import React, { useEffect, useState, useCallback } from "react";
import { IFrameConfig } from "../config/iframeTypes";
import { useIframeStatus } from "../../hooks/useIframeStatus";
import SettingsTabs from "../../components/SettingsTabs";
import PreviewArea from "../../components/PreviewArea";
import CodePreview from "../../components/CodePreview";
import { isValidUrl, radiusPresets } from "../../utils/iframeHelpers";
import { Input } from "@nextui-org/react";
import { Link2, LinkIcon } from "lucide-react";
import { generateIframeProps } from "@/utils/iframeHelpers";

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
  scrolling: true,
  allowFullscreen: true,
  backgroundColor: "#ffffff",
  padding: "0px",
  customClass: "",
  sandbox: [],
  referrerPolicy: "strict-origin-when-cross-origin",
  title: "",
  ariaLabel: "",
  name: "",
  loading: "eager",
  importance: "auto",
  allow: ["fullscreen"],
};

const IFrameGenerator: React.FC = () => {
  // 添加历史记录状态，初始为空数组
  const [urlHistory, setUrlHistory] = useState<
    Array<{
      url: string;
      config: IFrameConfig;
      timestamp: number;
    }>
  >([]);

  // 添加初始化 effect
  useEffect(() => {
    try {
      const saved = localStorage.getItem("iframe-url-history");
      const history = saved ? JSON.parse(saved) : [];
      // 如果超过10条，只保留最新的10条
      const trimmedHistory = history.slice(0, 10);
      // 如果历史记录被裁剪了，更新localStorage
      if (history.length > 10) {
        localStorage.setItem(
          "iframe-url-history",
          JSON.stringify(trimmedHistory)
        );
      }
      setUrlHistory(trimmedHistory);
    } catch (error) {
      console.error("Failed to load history:", error);
      setUrlHistory([]);
    }
  }, []);

  // 管理配置状态
  const [config, setConfig] = useState<IFrameConfig>(defaultConfig);
  const [errors, setErrors] = useState({
    url: false,
    width: false,
    height: false,
  });

  /**
   * 统一的配置更新函数
   * 只在URL完整且有效时保存
   */
  const updateConfig = useCallback(
    (
      updates: Partial<IFrameConfig> | ((prev: IFrameConfig) => IFrameConfig)
    ) => {
      setConfig((prev) => {
        const newConfig =
          typeof updates === "function"
            ? updates(prev)
            : { ...prev, ...updates };

        // 只在 URL 有效时保存配置和历史记录
        if (newConfig.url && isValidUrl(newConfig.url)) {
          try {
            // 更新配置存储
            const savedConfigs = JSON.parse(
              localStorage.getItem("iframeConfigs") || "{}"
            );
            savedConfigs[newConfig.url] = newConfig;
            localStorage.setItem("iframeConfigs", JSON.stringify(savedConfigs));

            // 更新历史记录
            const currentHistory = JSON.parse(
              localStorage.getItem("iframe-url-history") || "[]"
            );
            const newHistory = [
              {
                url: newConfig.url,
                config: newConfig,
                timestamp: Date.now(),
              },
              ...currentHistory.filter(
                (item: any) => item.url !== newConfig.url
              ),
            ].slice(0, 10);

            localStorage.setItem(
              "iframe-url-history",
              JSON.stringify(newHistory)
            );
            setUrlHistory(newHistory);
          } catch (error) {
            console.error("Failed to save config and history:", error);
          }
        }

        return newConfig;
      });
    },
    []
  );

  /**
   * 处理URL输入完成事件
   * 在用户完成输入后(失去焦点或按回车)才保存
   */
  const handleUrlInputComplete = (url: string) => {
    if (url && isValidUrl(url) && url.includes(".")) {
      updateConfig({ url });
    }
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
      border:
        config.borderStyle !== "none"
          ? `${config.borderSize}px ${config.borderStyle} ${config.borderColor}`
          : "none",
      borderRadius: radiusPresets[config.borderRadiusName],
    };
    return styles;
  };

  // 使用自定义 Hook 管理 iframe 的性能
  const {
    loading,
    error,
    iframeRef,
    handleLoad,
    handleError: handleIframeError,
  } = useIframeStatus(config.url);

  /**
   * 删除历史记录
   */
  const removeFromHistory = (urlToRemove: string) => {
    try {
      const newHistory = urlHistory.filter((item) => item.url !== urlToRemove);
      setUrlHistory(newHistory);
      localStorage.setItem("iframe-url-history", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to remove from history:", error);
    }
  };

  // URL 输入处理
  const handleUrlChange = (url: string) => {
    updateConfig({ url });
    setErrors((prev) => ({
      ...prev,
      url: !isValidUrl(url),
    }));
  };

  // 从历史记录加载配置
  const loadFromHistory = (historyItem: {
    url: string;
    config: IFrameConfig;
  }) => {
    updateConfig(historyItem.config);
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
                  onChange={(e) => handleUrlChange(e.target.value)}
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
              updateConfig={updateConfig}
              errors={errors}
            />
          </div>

          {/* 预览区域 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <PreviewArea
              config={config}
              error={error}
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
