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
  return (
    <div className="space-y-4">
      {/* Tabs Component */}
      <Tabs aria-label="Settings" radius="full" color="primary">
        {/* 基础设置 Tab */}
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
            {/* 标题输入 */}
            <Input
              label="标题"
              labelPlacement="outside"
              placeholder="输入iframe标题"
              radius="lg"
              size="lg"
              value={config.title}
              onChange={(e) => updateConfig({ title: e.target.value })}
              classNames={{
                base: "w-full",
                mainWrapper: "h-full",
                inputWrapper: "h-[56px]",
              }}
            />

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
                    value={config.width}
                    onChange={(e) => updateConfig({ width: e.target.value })}
                    startContent={
                      <MoveHorizontalIcon className="w-4 h-4 text-gray-400" />
                    }
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
                  onChange={(e) => updateConfig({ height: e.target.value })}
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
              <div className="flex items-center gap-1">
                <Switch
                  isSelected={config.scrolling ?? true}
                  onValueChange={(checked) =>
                    updateConfig((prev) => ({ ...prev, scrolling: checked }))
                  }
                >
                  允许滚动
                </Switch>
                <Tooltip
                  content="允许在 iframe 内容中进行滚动操作"
                  placement="bottom"
                >
                  <HelpCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
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
                >
                  允许全屏
                </Switch>
                <Tooltip
                  content="允许 iframe 内容进入全屏模式，需要内部页面支持"
                  placement="bottom"
                >
                  <HelpCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
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
                >
                  延迟加载
                </Switch>
                <Tooltip
                  content="仅在 iframe 进入视口时才加载内容，可提升页面性能"
                  placement="bottom"
                >
                  <HelpCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
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
                          updateConfig((prev) => ({
                            ...prev,
                            borderColor: e.target.value,
                          }))
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
                  updateConfig((prev) => ({
                    ...prev,
                    padding: `${e.target.value}px`,
                  }))
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
                        updateConfig((prev) => ({
                          ...prev,
                          backgroundColor: e.target.value,
                        }))
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

        {/* 安全设置 Tab */}
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
            {/* Sandbox 设置组 */}
            <div className="space-y-3">
              <p className="text-base font-medium text-default-700">
                Sandbox 权限
              </p>
              <div className="p-5 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  {sandboxOptions.map((option) => (
                    <Checkbox
                      key={option.value}
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
                    >
                      {option.label}
                    </Checkbox>
                  ))}
                </div>
              </div>
            </div>

            {/* Referrer Policy 设置组 */}
            <div className="space-y-3">
              <p className="text-base font-medium text-default-700">
                Referrer Policy
              </p>
              <div className="p-5 bg-gray-50 rounded-lg">
                <RadioGroup
                  value={config.referrerPolicy}
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
                >
                  {referrerPolicyOptions.map((policy) => (
                    <Radio
                      key={policy}
                      value={policy}
                      classNames={{ label: "text-sm" }}
                    >
                      {policy}
                    </Radio>
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
            <div className="flex items-center space-x-2">
              <WrenchIcon className="w-4 h-4" />
              <span>高级</span>
            </div>
          }
        >
          <div className="py-4 space-y-6">
            {/* 基本信息设置组 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                labelPlacement="outside"
                placeholder="输入iframe的name属性"
                radius="lg"
                size="lg"
                value={config.name}
                onChange={(e) => updateConfig({ name: e.target.value })}
                classNames={{
                  base: "w-full",
                  mainWrapper: "h-full",
                  inputWrapper: "h-[56px]",
                }}
              />

              <Input
                label="ARIA"
                labelPlacement="outside"
                placeholder="输入可访问性标签"
                radius="lg"
                size="lg"
                value={config.ariaLabel}
                onChange={(e) => updateConfig({ ariaLabel: e.target.value })}
                classNames={{
                  base: "w-full",
                  mainWrapper: "h-full",
                  inputWrapper: "h-[56px]",
                }}
              />
            </div>

            {/* 性能设置组 */}
            <div className="space-y-3">
              <p className="text-base font-medium text-default-700">
                加载优先级
              </p>
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
                >
                  <Radio value="high" classNames={{ label: "text-sm" }}>
                    高优先级
                  </Radio>
                  <Radio value="low" classNames={{ label: "text-sm" }}>
                    低优先级
                  </Radio>
                  <Radio value="auto" classNames={{ label: "text-sm" }}>
                    自动
                  </Radio>
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
