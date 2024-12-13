"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  FocusEvent,
  Suspense,
} from "react";
import { IFrameConfig } from "../config/iframeTypes";
import { useIframeStatus } from "../../hooks/useIframeStatus";
import RecentlyUsed, { useUrlHistory } from "../../components/RecentlyUsed";

import {
  isValidUrl,
  radiusPresets,
  normalizeUrl,
} from "../../utils/iframeHelpers";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { Link2 } from "lucide-react";
import { generateIframeProps } from "@/utils/iframeHelpers";
import {
  DynamicCodePreview,
  DynamicPreviewArea,
  DynamicSettingsTabs,
  DynamicRecentlyUsed,
  LoadingRecentlyUsed,
  LoadingSettings,
} from "@/utils/dynamic-components";
import CodePreview from "@/components/CodePreview";
import PreviewArea from "@/components/PreviewArea";
import SettingsTabs from "@/components/SettingsTabs";

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
  referrerPolicy: undefined,
  title: "",
  ariaLabel: "",
  name: "",
  loading: "eager",
  importance: "auto",
  allow: ["fullscreen"],
};

// 添加获取默认配置的函数
const getDefaultConfigForUrl = (url: string): IFrameConfig => {
  return {
    ...defaultConfig,
    url,
    width: "100",
    widthUnit: "%",
    height: "600",
    heightUnit: "px",
    border: true,
    borderSize: "0",
    borderStyle: "none",
    borderColor: "transparent",
    borderRadiusName: "none",
    // 保持其他默认值不变
  };
};

const IFrameGenerator: React.FC = () => {
  const { addToHistory } = useUrlHistory();

  // 管理配置状态
  const [config, setConfig] = useState<IFrameConfig>(defaultConfig);
  const [errors, setErrors] = useState({
    url: false,
    width: false,
    height: false,
  });

  // 添加协议状态
  const [protocol, setProtocol] = useState<string>("https://");

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
            const normalizedUrl = normalizeUrl(newConfig.url);

            // 创建新的配置对象，使用归一化后的 URL
            const configToSave = {
              ...newConfig,
              url: normalizedUrl, // 使用归一化后的 URL
            };

            // 更新配置存储
            const savedConfigs = JSON.parse(
              localStorage.getItem("iframeConfigs") || "{}"
            );
            savedConfigs[normalizedUrl] = configToSave;
            localStorage.setItem("iframeConfigs", JSON.stringify(savedConfigs));

            // 更新历史记录
            const currentHistory = JSON.parse(
              localStorage.getItem("iframe-url-history") || "[]"
            );
            const newHistory = [
              {
                url: normalizedUrl,
                config: configToSave, // 使用包含归一化 URL 的配置
                timestamp: Date.now(),
              },
              ...currentHistory.filter(
                (item: any) => item.url !== normalizedUrl
              ),
            ].slice(0, 10);

            localStorage.setItem(
              "iframe-url-history",
              JSON.stringify(newHistory)
            );

            // 更新当前配置为归一化后的版本
            return configToSave;
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
   */
  const handleUrlInputComplete = useCallback(
    (url: string) => {
      if (url && isValidUrl(url)) {
        const normalizedUrl = normalizeUrl(url);
        const newConfig = getDefaultConfigForUrl(normalizedUrl);
        setConfig(newConfig);

        // 添加到历史记录
        addToHistory(newConfig);

        // 手动触发一个 storage 事件来更新组件
        const event = new StorageEvent("storage", {
          key: "iframe-url-history",
          newValue: localStorage.getItem("iframe-url-history"),
          storageArea: localStorage,
        });
        window.dispatchEvent(event);
      }
    },
    [addToHistory]
  );

  /**
   * URL 输入处理
   */
  const handleUrlChange = (url: string) => {
    // 只移除协议前缀，保留其他内容
    let cleanUrl = url.replace(/^(https?:\/\/)/, "");

    // 如果用户粘贴了完整URL，自动选择对应协议
    if (url.startsWith("https://")) {
      setProtocol("https://");
    } else if (url.startsWith("http://")) {
      setProtocol("http://");
    }

    setConfig((prev) => ({ ...prev, url: cleanUrl }));

    // 验证时加上协议前缀
    const fullUrl = protocol + cleanUrl;
    setErrors((prev) => ({
      ...prev,
      url: !isValidUrl(fullUrl),
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

    // 生成样式对象
    const styles = {
      backgroundColor: currentConfig.backgroundColor,
      padding: currentConfig.padding,
      border: currentConfig.border
        ? `${currentConfig.borderSize}px ${currentConfig.borderStyle} ${currentConfig.borderColor}`
        : "none",
      borderRadius: radiusPresets[currentConfig.borderRadiusName],
      width: `${currentConfig.width}${currentConfig.widthUnit}`,
      height: `${currentConfig.height}${currentConfig.heightUnit}`,
    };

    // 将样式对象转换为样式字符串
    const styleString = Object.entries(styles)
      .map(([key, value]) => {
        // 转换驼峰命名为连字符命名
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        return `${cssKey}: ${value}`;
      })
      .join("; ");

    const { props } = generateIframeProps({ config: currentConfig });

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

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-[1800px] mx-auto">
      {/* 左侧设置区域 */}
      <div className="w-full lg:w-[800px] space-y-8">
        {/* URL 输入区域 */}

        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-200">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Website URL</h2>
            <div className="w-full flex items-center gap-2">
              <Select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                defaultSelectedKeys={["https://"]}
                className="w-[140px]"
                size="lg"
                variant="bordered"
                radius="sm"
                classNames={{
                  trigger:
                    "h-[50px] bg-gray-50/50 border-gray-200 hover:bg-gray-100/70",
                  value: "text-gray-600 font-mono text-sm",
                }}
              >
                <SelectItem
                  key="https://"
                  value="https://"
                  className="font-mono text-sm"
                >
                  https://
                </SelectItem>
                <SelectItem
                  key="http://"
                  value="http://"
                  className="font-mono text-sm"
                >
                  http://
                </SelectItem>
              </Select>

              <Input
                placeholder="Enter website URL to embed (protocol not needed)"
                radius="none"
                size="lg"
                variant="underlined"
                labelPlacement="outside-left"
                value={config.url.replace(/^(https?:\/\/)/, "")}
                onChange={(e) => handleUrlChange(e.target.value)}
                isInvalid={errors.url}
                errorMessage={errors.url && "Please enter a valid website URL"}
                startContent={
                  <Link2 className="w-5 h-5 text-gray-400/90 flex-shrink-0" />
                }
                maxLength={2000}
                classNames={{
                  mainWrapper: "h-[50px] flex-1",
                  input: "text-gray-700",
                  inputWrapper:
                    "h-[50px] border-b-2 border-gray-200 hover:border-gray-300 focus-within:border-primary",
                }}
                onBlur={(e: FocusEvent<Element>) => {
                  const target = e.target as HTMLInputElement;
                  handleUrlInputComplete(target.value);
                }}
                onKeyDown={(e: React.KeyboardEvent<Element>) => {
                  if (e.key === "Enter") {
                    const target = e.currentTarget as HTMLInputElement;
                    handleUrlInputComplete(target.value);
                  }
                }}
              />
            </div>
          </div>

          <DynamicRecentlyUsed setConfig={setConfig} />
        </div>

        {/* 设置选项卡 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <SettingsTabs
            config={config}
            updateConfig={updateConfig}
            errors={errors}
          />
        </div>
      </div>

      {/* 右侧预览区域 */}
      <div className="w-full lg:w-[700px] space-y-8">
        {/* 代码预览区域 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <CodePreview generateHTML={generateHTML} />
        </div>

        {/* 预览区域 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <PreviewArea
            config={config}
            error={error}
            loading={loading}
            iframeRef={iframeRef}
            handleLoad={handleLoad}
            handleIframeError={handleIframeError}
            generateStyles={generateStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default IFrameGenerator;
