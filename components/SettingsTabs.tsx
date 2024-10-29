import React, { HTMLAttributeReferrerPolicy } from "react";
import {
  Input,
  Select,
  SelectItem,
  Switch,
  Checkbox,
  Chip,
  Tabs,
  Tab,
  RadioGroup,
  Radio,
  Tooltip,
} from "@nextui-org/react";
import {
  LinkIcon,
  MoveHorizontalIcon,
  MoveVerticalIcon,
  ShieldIcon,
  Settings2Icon,
  PaintbrushIcon,
  WrenchIcon,
  CircleGauge,
} from "lucide-react";
import { IFrameConfig } from "../app/config/iframeTypes";
import { sandboxOptions, referrerPolicyOptions } from "../utils/helpers";
import { presets } from "../app/config/presets";

interface SettingsTabsProps {
  config: IFrameConfig;
  setConfig: React.Dispatch<React.SetStateAction<IFrameConfig>>;
  errors: {
    url: boolean;
    width: boolean;
    height: boolean;
  };
  validateAndUpdateConfig: (key: keyof IFrameConfig, value: any) => void;
  applyPreset: (presetName: keyof typeof presets) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({
  config,
  setConfig,
  errors,
  validateAndUpdateConfig,
}) => {
  return (
    <div className="space-y-4">
      {/* Tabs Component */}
      <Tabs aria-label="Settings" radius="full" color="primary">
        {/* 基础设置 Tab - 移除了 URL input */}
        <Tab
          key="basic"
          title={
            <div className="flex items-center space-x-2">
              <Settings2Icon className="w-4 h-4" />
              <span>基础</span>
            </div>
          }
        >
          <div className="py-4 space-y-6">
            {/* 宽度和高度输入组 */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              {/* 宽度输入组 */}
              <div className="flex-1 flex space-x-2">
                <div className="flex-1">
                  <Input
                    label="宽度"
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
                    value={config.width.replace(/[^0-9]/g, "")}
                    onChange={(e) =>
                      validateAndUpdateConfig("width", e.target.value)
                    }
                    isInvalid={errors.width}
                    errorMessage={errors.width && "请输入有效的宽度"}
                    startContent={
                      <MoveHorizontalIcon className="w-4 h-4 text-gray-400" />
                    }
                  />
                </div>
                <Select
                  label=" "
                  size="lg"
                  labelPlacement="outside"
                  defaultSelectedKeys={["%"]}
                  value={config.widthUnit}
                  className="w-[80px]"
                  classNames={{
                    trigger: "h-full min-h-unit-12",
                    value: "text-small font-normal",
                    label: "pb-1.5",
                  }}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      widthUnit: e.target.value as "px" | "%",
                    }))
                  }
                  radius="lg"
                  aria-label="选择宽度单位"
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
                  label="高度"
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
                  onChange={(e) =>
                    validateAndUpdateConfig("height", e.target.value)
                  }
                  isInvalid={errors.height}
                  errorMessage={errors.height && "请输入有效的高度"}
                  startContent={
                    <MoveVerticalIcon className="w-4 h-4 text-gray-400" />
                  }
                  endContent={
                    <div className="flex items-center px-3 text-default-400">
                      <span className="text-small">px</span>
                    </div>
                  }
                />
              </div>
            </div>

            {/* 快速设置开关组 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <Switch
                isSelected={config.scrolling}
                onValueChange={(checked) =>
                  setConfig((prev) => ({ ...prev, scrolling: checked }))
                }
              >
                允许滚动
              </Switch>

              <Switch
                isSelected={config.allowFullscreen}
                onValueChange={(checked) =>
                  setConfig((prev) => ({ ...prev, allowFullscreen: checked }))
                }
              >
                允许全屏
              </Switch>

              <Switch
                isSelected={config.lazyLoad}
                onValueChange={(checked) =>
                  setConfig((prev) => ({ ...prev, lazyLoad: checked }))
                }
              >
                延迟加载
              </Switch>

              <Switch
                isSelected={config.autoHeight}
                onValueChange={(checked) =>
                  setConfig((prev) => ({ ...prev, autoHeight: checked }))
                }
              >
                自动高度
              </Switch>
            </div>
          </div>
        </Tab>

        {/* 2. 样式设置 - 视觉相关的所有设置 */}
        <Tab
          key="style"
          title={
            <div className="flex items-center space-x-2">
              <PaintbrushIcon className="w-4 h-4" />
              <span>样式</span>
            </div>
          }
        >
          <div className="py-4 space-y-6">
            {/* 边框设置 */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="边框大小"
                  labelPlacement="outside"
                  radius="lg"
                  size="lg"
                  type="number"
                  value={config.borderSize}
                  onChange={(e) =>
                    setConfig({ ...config, borderSize: e.target.value })
                  }
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    inputWrapper: "h-[56px]",
                  }}
                  endContent={
                    <div className="flex items-center px-3 text-default-400">
                      <span className="text-small">px</span>
                    </div>
                  }
                />
                <Select
                  label="边框类型"
                  labelPlacement="outside"
                  radius="lg"
                  size="lg"
                  value={config.borderStyle}
                  defaultSelectedKeys={["none"]}
                  classNames={{
                    base: "w-full",
                    trigger: "h-[56px]",
                  }}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      borderStyle: e.target.value as
                        | "none"
                        | "solid"
                        | "dashed"
                        | "dotted"
                        | "double",
                    })
                  }
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
                    无边框
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
                    实线
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
                    虚线
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
                    点线
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
                    双线
                  </SelectItem>
                </Select>
                <div className="w-full">
                  <label className="block text-sm mb-2 font-medium text-default-700">
                    边框颜色
                  </label>
                  <div className="h-[56px] flex items-center">
                    <div className="relative inline-block">
                      <input
                        type="color"
                        className="absolute inset-0 opacity-0 w-12 h-12 cursor-pointer"
                        value={config.borderColor}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            borderColor: e.target.value,
                          })
                        }
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
                label="边框圆角"
                labelPlacement="outside"
                radius="lg"
                size="lg"
                defaultSelectedKeys={["none"]}
                value={config.borderRadiusName}
                classNames={{
                  base: "w-full",
                  trigger: "h-[56px]",
                }}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const value = e.target.value;
                  setConfig({ ...config, borderRadiusName: value });
                }}
              >
                <SelectItem key="none">无圆角</SelectItem>
                <SelectItem key="sm">小圆角</SelectItem>
                <SelectItem key="md">中等圆角</SelectItem>
                <SelectItem key="lg">大圆角</SelectItem>
                <SelectItem key="xl">超大圆角</SelectItem>
                <SelectItem key="xl2">特大圆角</SelectItem>
                <SelectItem key="xl3">最圆角</SelectItem>
                <SelectItem key="full">完全圆角</SelectItem>
              </Select>

              <Input
                type="number"
                label="内边距"
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
                  setConfig({ ...config, padding: `${e.target.value}px` })
                }
                endContent={
                  <div className="flex items-center px-3 text-default-400">
                    <span className="text-small">px</span>
                  </div>
                }
              />

              <div>
                <label className="block text-sm font-medium mb-2 text-default-700">
                  背景颜色
                </label>
                <div className="h-[56px] flex items-center">
                  <div className="relative inline-block">
                    <input
                      type="color"
                      className="absolute inset-0 opacity-0 w-12 h-12 cursor-pointer"
                      value={config.backgroundColor}
                      onChange={(e) =>
                        setConfig({ ...config, backgroundColor: e.target.value })
                      }
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

        {/* 4. 安全设置 Tab */}
        <Tab
          key="security"
          title={
            <div className="flex items-center space-x-2">
              <ShieldIcon className="w-4 h-4" />
              <span>安全</span>
            </div>
          }
        >
          <div className="py-4 space-y-6">
            {/* 1. 域名白名单设置组 */}
            <div className="space-y-3">
              <p className="text-base font-medium text-default-700">域名白名单</p>
              <div className="space-y-4 p-5 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-default-100 rounded-lg">
                  {config.domainWhitelist.map((domain, index) => (
                    <Chip
                      key={index}
                      onClose={() => {
                        setConfig((prev) => ({
                          ...prev,
                          domainWhitelist: prev.domainWhitelist.filter(
                            (_, i) => i !== index
                          ),
                        }));
                      }}
                      variant="flat"
                      classNames={{
                        base: "h-8",
                        content: "text-sm",
                      }}
                    >
                      {domain}
                    </Chip>
                  ))}
                </div>
                <Input
                  placeholder="添加域名 (例如: example.com)"
                  radius="lg"
                  size="lg"
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    inputWrapper: "h-[56px]",
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const input = e.currentTarget;
                      const domain = input.value.trim();
                      if (domain) {
                        setConfig((prev) => ({
                          ...prev,
                          domainWhitelist: [...prev.domainWhitelist, domain],
                        }));
                        input.value = "";
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* 2. CSP 设置组 */}
            <div className="space-y-3">
              <p className="text-base font-medium text-default-700">内容安全策略</p>
              <div className="space-y-4 p-5 bg-gray-50 rounded-lg">
                <div className="p-4 bg-default-100 rounded-lg">
                  <Switch
                    isSelected={config.csp.enabled}
                    onValueChange={(checked) =>
                      setConfig((prev) => ({
                        ...prev,
                        csp: { ...prev.csp, enabled: checked },
                      }))
                    }
                    classNames={{
                      label: "text-sm",
                    }}
                  >
                    启用 CSP
                  </Switch>
                </div>

                {config.csp.enabled && (
                  <Input
                    label="Frame-Src 指令"
                    labelPlacement="outside"
                    placeholder="'self' https://trusted-domain.com"
                    radius="lg"
                    size="lg"
                    value={config.csp.directives.frameSrc.join(" ")}
                    onChange={(e) => {
                      const values = e.target.value.split(" ").filter(Boolean);
                      setConfig((prev) => ({
                        ...prev,
                        csp: {
                          ...prev.csp,
                          directives: {
                            ...prev.csp.directives,
                            frameSrc: values,
                          },
                        },
                      }));
                    }}
                    classNames={{
                      base: "w-full",
                      mainWrapper: "h-full",
                      inputWrapper: "h-[56px]",
                      label: "text-sm font-medium text-default-700",
                    }}
                  />
                )}
              </div>
            </div>

            {/* 3. X-Frame-Options 设置组 */}
            <div className="space-y-3">
              <p className="text-base font-medium text-default-700">X-Frame-Options</p>
              <div className="p-5 bg-gray-50 rounded-lg">
                <RadioGroup
                  value={config.xFrameOptions}
                  onValueChange={(value) =>
                    setConfig((prev) => ({
                      ...prev,
                      xFrameOptions: value as typeof config.xFrameOptions,
                    }))
                  }
                  orientation="horizontal"
                  classNames={{
                    wrapper: "gap-6",
                  }}
                >
                  <Radio value="DENY" classNames={{label: "text-sm"}}>DENY</Radio>
                  <Radio value="SAMEORIGIN" classNames={{label: "text-sm"}}>SAMEORIGIN</Radio>
                  <Radio value="ALLOW-FROM" classNames={{label: "text-sm"}}>ALLOW-FROM</Radio>
                </RadioGroup>
              </div>
            </div>

            {/* 4. Sandbox 设置组 */}
            <div className="space-y-3">
              <p className="text-base font-medium text-default-700">Sandbox 权限</p>
              <div className="p-5 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  {sandboxOptions.map((option) => (
                    <Checkbox
                      key={option.value}
                      isSelected={config.sandbox.includes(option.value)}
                      onValueChange={(checked) => {
                        setConfig({
                          ...config,
                          sandbox: checked
                            ? [...config.sandbox, option.value]
                            : config.sandbox.filter((v) => v !== option.value),
                        });
                      }}
                      classNames={{
                        label: "text-sm",
                      }}
                    >
                      {option.label}
                    </Checkbox>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Referrer Policy 设置组 */}
            <div className="space-y-3">
              <p className="text-base font-medium text-default-700">Referrer Policy</p>
              <div className="p-5 bg-gray-50 rounded-lg">
                <RadioGroup
                  value={config.referrerPolicy}
                  onValueChange={(value) =>
                    setConfig((prev) => ({
                      ...prev,
                      referrerPolicy: value as HTMLAttributeReferrerPolicy,
                    }))
                  }
                  orientation="horizontal"
                  classNames={{
                    wrapper: "gap-6",
                  }}
                >
                  {referrerPolicyOptions.map((policy) => (
                    <Radio key={policy} value={policy} classNames={{label: "text-sm"}}>
                      {policy}
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        </Tab>

        {/* 5. 高级设置 - 不常用的高级选项 */}
        <Tab
          key="advanced"
          title={
            <div className="flex items-center space-x-2">
              <WrenchIcon className="w-4 h-4" />
              <span>高级</span>
            </div>
          }
        >
          <div className="py-4 space-y-6">
            {/* 1. 基本信息设置组 */}
            <div className="space-y-3">
              <p className="text-base font-medium text-default-700">基本信息</p>
              <div className="space-y-5 p-5 bg-gray-50 rounded-lg">
                <Input
                  label="标题"
                  labelPlacement="outside"
                  placeholder="输入iframe标题"
                  radius="lg"
                  size="lg"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    inputWrapper: "h-[56px]",
                    label: "text-sm font-medium text-default-700",
                  }}
                />
                <Input
                  label="描述"
                  labelPlacement="outside"
                  placeholder="输入iframe描述"
                  radius="lg"
                  size="lg"
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    inputWrapper: "h-[56px]",
                    label: "text-sm font-medium text-default-700",
                  }}
                />
                <Input
                  label="ARIA 标签"
                  labelPlacement="outside"
                  placeholder="输入可访问性标签"
                  radius="lg"
                  size="lg"
                  value={config.ariaLabel}
                  onChange={(e) => setConfig({ ...config, ariaLabel: e.target.value })}
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    inputWrapper: "h-[56px]",
                    label: "text-sm font-medium text-default-700",
                  }}
                />
              </div>
            </div>

            {/* 2. 性能设置组 */}
            <div className="space-y-3">
              <p className="text-base font-medium text-default-700">性能优化</p>
              <div className="space-y-6 p-5 bg-gray-50 rounded-lg">
                {/* 加载优先级单选框组 */}
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-default-700">加载优先级</label>
                  <RadioGroup
                    value={config.performance.priority}
                    onValueChange={(value) =>
                      setConfig((prev) => ({
                        ...prev,
                        performance: {
                          ...prev.performance,
                          priority: value as "high" | "low" | "auto",
                        },
                      }))
                    }
                    orientation="horizontal"
                    classNames={{
                      wrapper: "gap-6",
                      label: "text-sm",
                    }}
                  >
                    <Radio value="high" classNames={{label: "text-sm"}}>高优先级</Radio>
                    <Radio value="low" classNames={{label: "text-sm"}}>低优先级</Radio>
                    <Radio value="auto" classNames={{label: "text-sm"}}>自动</Radio>
                  </RadioGroup>
                </div>

                {/* 预加开关组 */}
                <div className="grid grid-cols-2 gap-6 p-4 bg-default-100 rounded-lg">
                  <Switch
                    isSelected={config.performance.preconnect}
                    onValueChange={(checked) =>
                      setConfig((prev) => ({
                        ...prev,
                        performance: { ...prev.performance, preconnect: checked },
                      }))
                    }
                    classNames={{
                      label: "text-sm",
                    }}
                  >
                    启用预连接
                  </Switch>
                  <Switch
                    isSelected={config.performance.preload}
                    onValueChange={(checked) =>
                      setConfig((prev) => ({
                        ...prev,
                        performance: { ...prev.performance, preload: checked },
                      }))
                    }
                    classNames={{
                      label: "text-sm",
                    }}
                  >
                    启用预加载
                  </Switch>
                </div>
              </div>
            </div>

            {/* 3. 加载体验设置组 */}
            <div className="space-y-3">
              <p className="text-base font-medium text-default-700">加载体验</p>
              <div className="space-y-6 p-5 bg-gray-50 rounded-lg">
                {/* 加载动画单选框组 */}
                <div className="space-y-2.5">
                  <label className="text-sm font-medium text-default-700">加载动画</label>
                  <RadioGroup
                    value={config.performance.loadingAnimation}
                    onValueChange={(value) =>
                      setConfig((prev) => ({
                        ...prev,
                        performance: {
                          ...prev.performance,
                          loadingAnimation: value as "spinner" | "skeleton" | "blur" | "none",
                        },
                      }))
                    }
                    orientation="horizontal"
                    classNames={{
                      wrapper: "gap-6",
                      label: "text-sm",
                    }}
                  >
                    <Radio value="spinner" classNames={{label: "text-sm"}}>加载圈</Radio>
                    <Radio value="skeleton" classNames={{label: "text-sm"}}>骨架屏</Radio>
                    <Radio value="blur" classNames={{label: "text-sm"}}>模糊效果</Radio>
                    <Radio value="none" classNames={{label: "text-sm"}}>无动画</Radio>
                  </RadioGroup>
                </div>

                <Input
                  type="number"
                  label="超时时间"
                  labelPlacement="outside"
                  placeholder="10000"
                  radius="lg"
                  size="lg"
                  value={config.performance.timeout.toString()}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      performance: {
                        ...prev.performance,
                        timeout: parseInt(e.target.value) || 10000,
                      },
                    }))
                  }
                  classNames={{
                    base: "w-full",
                    mainWrapper: "h-full",
                    inputWrapper: "h-[56px]",
                    label: "text-sm font-medium text-default-700",
                  }}
                  endContent={
                    <div className="flex items-center px-3 text-default-400">
                      <span className="text-small">ms</span>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default SettingsTabs;
