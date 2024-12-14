import React, { HTMLAttributeReferrerPolicy } from "react";
import {
  Input,
  Select,
  SelectItem,
  Switch,
  Checkbox,
  Tabs,
  Tab,
  RadioGroup,
  Radio,
  Tooltip,
} from "@nextui-org/react";
import {
  MoveHorizontalIcon,
  MoveVerticalIcon,
  ShieldIcon,
  Settings2Icon,
  PaintbrushIcon,
  WrenchIcon,
  HelpCircleIcon,
} from "lucide-react";
import { IFrameConfig } from "../app/config/iframeTypes";
import { sandboxOptions, referrerPolicyOptions } from "@/utils/iframeHelpers";

interface SettingsTabsProps {
  config: IFrameConfig;
  updateConfig: (
    updates: Partial<IFrameConfig> | ((prev: IFrameConfig) => IFrameConfig)
  ) => void;
  errors: {
    url: boolean;
  };
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({
  config,
  updateConfig,
  errors,
}) => {
  const getSandboxTooltip = (value: string): string => {
    const tooltips: Record<string, string> = {
      "allow-scripts": "Allows scripts to run in the iframe",
      "allow-same-origin": "Allows the iframe to interact with the same origin",
      "allow-top-navigation":
        "Allows the iframe to navigate the top-level browsing context",
      "allow-forms": "Allows the iframe to submit forms",
      "allow-popups": "Allows the iframe to open popups",
      "allow-pointer-lock": "Allows the iframe to lock the pointer",
      "allow-orientation-lock":
        "Allows the iframe to lock the screen orientation",
      "allow-presentation": "Allows the iframe to present the document",
      "allow-fullscreen": "Allows the iframe to enter fullscreen mode",
    };
    return tooltips[value] || "";
  };

  // 添加 referrerPolicy 的 tooltip 辅助函数
  const getReferrerPolicyTooltip = (policy: string): string => {
    const tooltips: Record<string, string> = {
      "no-referrer":
        "Never send referrer information. Maximum privacy but may break some functionality.",
      "no-referrer-when-downgrade":
        "Send full referrer info only when protocol security level stays same or improves (e.g., HTTPS→HTTPS).",
      origin:
        'Only send the origin of the document as referrer. Example: "https://example.com/"',
      "origin-when-cross-origin":
        "Send full referrer to same origin, only send origin part for cross-origin requests.",
      "same-origin":
        "Send referrer info only for same-origin requests, omit it for cross-origin requests.",
      "strict-origin":
        "Send origin as referrer only when protocol security level stays same or improves.",
      "strict-origin-when-cross-origin":
        "Default. Send full referrer to same origin, origin-only to cross-origin, nothing to less secure.",
      "unsafe-url":
        "Send full referrer info always. Not recommended as it may leak private data over insecure connections.",
    };
    return tooltips[policy] || "No description available";
  };

  return (
    <div className="space-y-4">
      {/* Tabs Component */}
      <Tabs 
        aria-label="IFrame Settings Options" 
        radius="full" 
        color="primary"
        defaultSelectedKey="basic"
        classNames={{
          tabList: "gap-4",
          tab: "data-[selected=true]:font-medium",
        }}
      >
        {/* 基础设置 Tab */}
        <Tab
          key="basic"
          title={
            <div className="flex items-center space-x-2" aria-label="Basic Settings">
              <Settings2Icon className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Basic</span>
            </div>
          }
        >
          <div className="py-4 space-y-6">
            {/* 标题输入 */}
            <Input
              label="Title"
              labelPlacement="outside"
              placeholder="Enter iframe title"
              radius="lg"
              size="lg"
              value={config.title}
              onChange={(e) => updateConfig({ title: e.target.value })}
              classNames={{
                base: "w-full",
                mainWrapper: "h-full",
                inputWrapper: "h-[56px]",
              }}
              aria-label="Iframe title"
            />

            {/* 宽度和高度输入组 */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* 宽度输入组 */}
              <div className="flex-1 flex gap-2">
                <div className="flex-1">
                  <Input
                    label="Width"
                    type="number"
                    placeholder="100"
                    labelPlacement="outside"
                    radius="lg"
                    size="lg"
                    classNames={{
                      base: "max-w-full",
                      mainWrapper: "h-full",
                      inputWrapper: "h-full",
                    }}
                    value={config.width}
                    onChange={(e) => updateConfig({ width: e.target.value })}
                    startContent={
                      <MoveHorizontalIcon className="w-4 h-4 text-gray-600" aria-hidden="true" />
                    }
                    aria-label="Iframe width"
                  />
                </div>
                <Select
                  label=" "
                  size="lg"
                  labelPlacement="outside"
                  selectedKeys={[config.widthUnit]}
                  value={config.widthUnit}
                  className="w-[80px]"
                  classNames={{
                    trigger: "h-full min-h-unit-12",
                    value: "text-small font-normal",
                    label: "pb-1.5",
                  }}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      widthUnit: e.target.value as "px" | "%",
                    }))
                  }
                  radius="lg"
                  aria-label="Select width unit"
                >
                  <SelectItem key="%" value="%" className="text-small">
                    %
                  </SelectItem>
                  <SelectItem key="px" value="px" className="text-small">
                    px
                  </SelectItem>
                </Select>
              </div>

              {/* 高度输入 */}
              <div className="flex-1">
                <Input
                  type="number"
                  label="Height"
                  size="lg"
                  placeholder="600"
                  labelPlacement="outside"
                  radius="lg"
                  classNames={{
                    base: "max-w-full",
                    mainWrapper: "h-full",
                    inputWrapper: "h-full",
                  }}
                  value={config.height.replace(/[^0-9]/g, "")}
                  onChange={(e) => updateConfig({ height: e.target.value })}
                  startContent={
                    <MoveVerticalIcon className="w-4 h-4 text-gray-600" aria-hidden="true" />
                  }
                  endContent={
                    <div className="flex items-center px-3 text-gray-700" aria-hidden="true">
                      <span className="text-small">px</span>
                    </div>
                  }
                  aria-label="Iframe height"
                />
              </div>
            </div>

            {/* 快速设置组 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg" role="group" aria-label="Quick settings">
              <div className="flex items-center gap-1">
                <Switch
                  isSelected={config.scrolling ?? true}
                  onValueChange={(checked) =>
                    updateConfig((prev) => ({ ...prev, scrolling: checked }))
                  }
                  aria-label="Allow scrolling"
                  size="sm"
                  className="flex-1"
                >
                  <span className="text-sm">Allow Scrolling</span>
                </Switch>
                <Tooltip
                  content="Allow scrolling within iframe content"
                  placement="bottom"
                >
                  <HelpCircleIcon className="w-4 h-4 text-gray-600 cursor-help" />
                </Tooltip>
              </div>

              <div className="flex items-center gap-1">
                <Switch
                  isSelected={config.allowFullscreen}
                  onValueChange={(checked) =>
                    updateConfig((prev) => ({
                      ...prev,
                      allowFullscreen: checked,
                      allow: checked
                        ? [...(prev.allow || []), "fullscreen"]
                        : (prev.allow || []).filter((x) => x !== "fullscreen"),
                    }))
                  }
                  aria-label="Allow fullscreen mode"
                  size="sm"
                  className="flex-1"
                >
                  <span className="text-sm">Allow Fullscreen</span>
                </Switch>
                <Tooltip
                  content="Allow iframe content to enter fullscreen mode, which requires internal page support"
                  placement="bottom"
                >
                  <HelpCircleIcon className="w-4 h-4 text-gray-600 cursor-help" />
                </Tooltip>
              </div>

              <div className="flex items-center gap-1">
                <Switch
                  isSelected={config.loading === "lazy"}
                  onValueChange={(checked) =>
                    updateConfig((prev) => ({
                      ...prev,
                      loading: checked ? "lazy" : "eager",
                    }))
                  }
                  aria-label="Enable lazy loading"
                  size="sm"
                  className="flex-1"
                >
                  <span className="text-sm">Lazy Loading</span>
                </Switch>
                <Tooltip
                  content="Only load content when iframe enters the viewport, which can improve page performance"
                  placement="bottom"
                >
                  <HelpCircleIcon className="w-4 h-4 text-gray-600 cursor-help" />
                </Tooltip>
              </div>
            </div>
          </div>
        </Tab>

        {/* 2. 样式设置 - 视觉相关的所有设置 */}
        <Tab
          key="style"
          title={
            <div className="flex items-center space-x-2" aria-label="Style Settings">
              <PaintbrushIcon className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Style</span>
            </div>
          }
        >
          <div className="py-4 space-y-6">
            {/* 边框设置 */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Border Size"
                  labelPlacement="outside"
                  radius="lg"
                  size="lg"
                  type="number"
                  value={config.borderSize}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      borderSize: e.target.value,
                    }))
                  }
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    inputWrapper: "h-[56px]",
                  }}
                  endContent={
                    <div className="flex items-center px-3 text-gray-700">
                      <span className="text-small">px</span>
                    </div>
                  }
                  aria-label="Border size"
                />
                <Select
                  label="Border Style"
                  labelPlacement="outside"
                  radius="lg"
                  size="lg"
                  selectedKeys={[config.borderStyle]}
                  value={config.borderStyle}
                  classNames={{
                    base: "w-full",
                    trigger: "h-[56px]",
                  }}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      borderStyle: e.target.value as
                        | "none"
                        | "solid"
                        | "dashed"
                        | "dotted"
                        | "double",
                    }))
                  }
                  aria-label="Select border style"
                >
                  <SelectItem
                    key="none"
                    value="none"
                    startContent={
                      <div className="w-12 flex items-center">
                        <div className="w-full border-none" />
                      </div>
                    }
                  >
                    None
                  </SelectItem>
                  <SelectItem
                    key="solid"
                    value="solid"
                    startContent={
                      <div className="w-12 flex items-center">
                        <div className="w-full border-t-2 border-black border-solid" />
                      </div>
                    }
                  >
                    Solid
                  </SelectItem>
                  <SelectItem
                    key="dashed"
                    value="dashed"
                    startContent={
                      <div className="w-12 flex items-center">
                        <div className="w-full border-t-2 border-black border-dashed" />
                      </div>
                    }
                  >
                    Dashed
                  </SelectItem>
                  <SelectItem
                    key="dotted"
                    value="dotted"
                    startContent={
                      <div className="w-12 flex items-center">
                        <div className="w-full border-t-2 border-black border-dotted" />
                      </div>
                    }
                  >
                    Dotted
                  </SelectItem>
                  <SelectItem
                    key="double"
                    value="double"
                    startContent={
                      <div className="w-12 flex items-center">
                        <div className="w-full border-t-4 border-black border-double" />
                      </div>
                    }
                  >
                    Double
                  </SelectItem>
                </Select>
                <div className="w-full">
                  <label className="block text-sm mb-2 font-medium text-gray-900">
                    Border Color
                  </label>
                  <div className="h-[56px] flex items-center">
                    <div className="relative inline-block">
                      <input
                        type="color"
                        className="absolute inset-0 opacity-0 w-12 h-12 cursor-pointer"
                        value={config.borderColor}
                        onChange={(e) =>
                          updateConfig((prev) => ({
                            ...prev,
                            borderColor: e.target.value,
                          }))
                        }
                        aria-label="Select border color"
                      />
                      <div
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                        style={{ backgroundColor: config.borderColor }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 圆角、内边距和背景色设置 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Border Radius"
                labelPlacement="outside"
                radius="lg"
                size="lg"
                selectedKeys={[config.borderRadiusName]}
                value={config.borderRadiusName}
                classNames={{
                  base: "w-full",
                  trigger: "h-[56px]",
                }}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const value = e.target.value;
                  updateConfig((prev) => ({
                    ...prev,
                    borderRadiusName: value,
                  }));
                }}
                aria-label="Select border radius"
              >
                <SelectItem key="none">None</SelectItem>
                <SelectItem key="sm">Small</SelectItem>
                <SelectItem key="md">Medium</SelectItem>
                <SelectItem key="lg">Large</SelectItem>
                <SelectItem key="full">Full</SelectItem>
              </Select>

              <Input
                type="number"
                label="Padding"
                labelPlacement="outside"
                radius="lg"
                size="lg"
                placeholder="16"
                value={config.padding.replace(/[^0-9]/g, "")}
                classNames={{
                  base: "w-full",
                  mainWrapper: "h-full",
                  inputWrapper: "h-[56px]",
                }}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    padding: `${e.target.value}px`,
                  }))
                }
                endContent={
                  <div className="flex items-center px-3 text-gray-700">
                    <span className="text-small">px</span>
                  </div>
                }
                aria-label="Padding"
              />

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">
                  Background Color
                </label>
                <div className="h-[56px] flex items-center">
                  <div className="relative inline-block">
                    <input
                      type="color"
                      className="absolute inset-0 opacity-0 w-12 h-12 cursor-pointer"
                      value={config.backgroundColor}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          backgroundColor: e.target.value,
                        }))
                      }
                      aria-label="Select background color"
                    />
                    <div
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                      style={{ backgroundColor: config.backgroundColor }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tab>

        {/* 安全设置 Tab */}
        <Tab
          key="security"
          title={
            <div className="flex items-center space-x-2" aria-label="Security Settings">
              <ShieldIcon className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Security</span>
            </div>
          }
        >
          <div className="py-4 space-y-6">
            {/* Sandbox 设置组 */}
            <div className="space-y-3">
              <p className="text-base font-medium text-gray-900">
                Sandbox Permissions
              </p>
              <div className="p-5 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  {sandboxOptions.map((option) => (
                    <div key={option.value} className="flex items-center gap-1">
                      <Checkbox
                        isSelected={config.sandbox.includes(option.value)}
                        onValueChange={(checked) => {
                          updateConfig((prev) => ({
                            ...prev,
                            sandbox: checked
                              ? [...prev.sandbox, option.value]
                              : prev.sandbox.filter((v) => v !== option.value),
                          }));
                        }}
                        classNames={{
                          label: "text-sm",
                        }}
                        aria-label={option.label}
                      >
                        {option.label}
                      </Checkbox>
                      <Tooltip content={getSandboxTooltip(option.value)}>
                        <HelpCircleIcon className="w-4 h-4 text-gray-600 cursor-help" />
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Referrer Policy 设置组 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <p className="text-base font-medium text-gray-900">
                  Referrer Policy
                </p>
                <Tooltip content="Controls how much referrer information should be included when navigating away from the iframe. This affects privacy and security.">
                  <HelpCircleIcon className="w-4 h-4 text-gray-600 cursor-help" />
                </Tooltip>
              </div>
              <div className="p-5 bg-gray-50 rounded-lg">
                <RadioGroup
                  value={config.referrerPolicy || ""}
                  onValueChange={(value) =>
                    updateConfig((prev) => ({
                      ...prev,
                      referrerPolicy: value as HTMLAttributeReferrerPolicy,
                    }))
                  }
                  orientation="horizontal"
                  classNames={{
                    wrapper: "gap-6",
                  }}
                  aria-label="Select referrer policy"
                >
                  {referrerPolicyOptions.map((policy) => (
                    <div key={policy} className="flex items-center gap-1">
                      <Radio
                        value={policy}
                        classNames={{ label: "text-sm text-gray-900" }}
                        aria-label={policy}
                      >
                        {policy}
                      </Radio>
                      <Tooltip content={getReferrerPolicyTooltip(policy)}>
                        <HelpCircleIcon className="w-4 h-4 text-gray-600 cursor-help" />
                      </Tooltip>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        </Tab>

        {/* 高级设置 Tab */}
        <Tab
          key="advanced"
          title={
            <div className="flex items-center space-x-2" aria-label="Advanced Settings">
              <WrenchIcon className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Advanced</span>
            </div>
          }
        >
          <div className="py-4 space-y-6">
            {/* 基本信息设置组 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <label className="text-sm font-medium text-gray-900">
                    Name
                  </label>
                  <Tooltip content="The name attribute can be used as the target for form submissions and links. Example: If name='myFrame', you can use <a target='myFrame'> to open links in this iframe.">
                    <HelpCircleIcon className="w-4 h-4 text-gray-600 cursor-help" />
                  </Tooltip>
                </div>
                <Input
                  placeholder="Enter iframe name attribute"
                  radius="lg"
                  size="lg"
                  value={config.name}
                  onChange={(e) => updateConfig({ name: e.target.value })}
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    inputWrapper: "h-[56px]",
                  }}
                  aria-label="Iframe name"
                />
              </div>

              <div>
                <div className="flex items-center gap-1 mb-2">
                  <label className="text-sm font-medium text-gray-900">
                    ARIA Label
                  </label>
                  <Tooltip content="Provides an accessible name for screen readers. Should describe the iframe's purpose. Example: 'Product demonstration video' or 'Google Maps location view'">
                    <HelpCircleIcon className="w-4 h-4 text-gray-600 cursor-help" />
                  </Tooltip>
                </div>
                <Input
                  placeholder="Enter accessible label"
                  radius="lg"
                  size="lg"
                  value={config.ariaLabel}
                  onChange={(e) => updateConfig({ ariaLabel: e.target.value })}
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    inputWrapper: "h-[56px]",
                  }}
                  aria-label="Accessible label"
                />
              </div>
            </div>

            {/* 性能设置组 */}
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <p className="text-base font-medium text-gray-900">
                  Load Priority
                </p>
                <Tooltip content="Controls how the browser prioritizes the loading of this iframe relative to other resources on the page">
                  <HelpCircleIcon className="w-4 h-4 text-gray-600 cursor-help" />
                </Tooltip>
              </div>
              <div className="p-5 bg-gray-50 rounded-lg">
                <RadioGroup
                  value={config.importance}
                  onValueChange={(value) =>
                    updateConfig((prev) => ({
                      ...prev,
                      importance: value as "high" | "low" | "auto",
                    }))
                  }
                  orientation="horizontal"
                  classNames={{
                    wrapper: "gap-6",
                  }}
                  aria-label="Select load priority"
                >
                  <div className="flex items-center gap-1">
                    <Radio
                      value="high"
                      classNames={{ label: "text-sm text-gray-900" }}
                      aria-label="High priority"
                    >
                      High Priority
                    </Radio>
                    <Tooltip content="Load this iframe with high priority. Use for critical content that should load as soon as possible. Example: A main product image or primary content video">
                      <HelpCircleIcon className="w-4 h-4 text-gray-600 cursor-help" />
                    </Tooltip>
                  </div>

                  <div className="flex items-center gap-1">
                    <Radio
                      value="low"
                      classNames={{ label: "text-sm text-gray-900" }}
                      aria-label="Low priority"
                    >
                      Low Priority
                    </Radio>
                    <Tooltip content="Load this iframe with low priority. Good for non-essential content that can load later. Example: Advertisement frames or supplementary content">
                      <HelpCircleIcon className="w-4 h-4 text-gray-600 cursor-help" />
                    </Tooltip>
                  </div>

                  <div className="flex items-center gap-1">
                    <Radio
                      value="auto"
                      classNames={{ label: "text-sm text-gray-900" }}
                      aria-label="Auto priority"
                    >
                      Auto
                    </Radio>
                    <Tooltip content="Let the browser determine the loading priority automatically based on the iframe's viewport position and other factors">
                      <HelpCircleIcon className="w-4 h-4 text-gray-600 cursor-help" />
                    </Tooltip>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default SettingsTabs;
