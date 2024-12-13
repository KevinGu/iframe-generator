import dynamic from 'next/dynamic'
import type { FC } from 'react'
import React from 'react'
import { Skeleton } from '@nextui-org/react'

const LoadingPreview: FC = () => (
  <div className="w-full min-h-[800px] flex flex-col gap-4">
    {/* 设备选择器 */}
    <div className="h-16 flex justify-between items-center">
      <div className="flex gap-2">
        <Skeleton className="w-[120px] h-[50px] rounded-lg" />
        <Skeleton className="w-[120px] h-[50px] rounded-lg" />
        <Skeleton className="w-[120px] h-[50px] rounded-lg" />
      </div>
      <Skeleton className="w-[120px] h-[50px] rounded-lg" />
    </div>
    {/* 预览区域 */}
    <div className="flex-1 min-h-[600px] bg-default-100 rounded-lg p-6">
      <div className="w-full h-full flex items-center justify-center">
        <Skeleton className="w-[1920px] h-[1080px] rounded-lg transform scale-[0.3] origin-center" />
      </div>
    </div>
    {/* 状态栏 */}
    <div className="h-16 flex justify-between items-center">
      <div className="flex gap-2">
        <Skeleton className="w-[200px] h-[40px] rounded-lg" />
        <Skeleton className="w-[160px] h-[40px] rounded-lg" />
      </div>
      <Skeleton className="w-[120px] h-[40px] rounded-lg" />
    </div>
  </div>
)

const LoadingCode: FC = () => (
  <div className="w-full min-h-[400px] flex flex-col gap-4">
    {/* 代码头部 */}
    <div className="h-12 flex justify-between items-center">
      <Skeleton className="w-36 h-10 rounded-lg" />
      <Skeleton className="w-28 h-10 rounded-lg" />
    </div>
    {/* 代码区域 */}
    <div className="flex-1 min-h-[300px] bg-default-100 rounded-lg p-4">
      <div className="space-y-3">
        <Skeleton className="w-full h-7" />
        <Skeleton className="w-[90%] h-7" />
        <Skeleton className="w-[85%] h-7" />
        <Skeleton className="w-[95%] h-7" />
      </div>
    </div>
  </div>
)

const LoadingSettings: FC = () => (
  <div className="w-full min-h-[400px] space-y-4 p-4">
    {/* 固定高度的设置项 */}
    <div className="space-y-4">
      <Skeleton className="w-full h-14 rounded-lg" />
      <Skeleton className="w-full h-14 rounded-lg" />
      <Skeleton className="w-full h-14 rounded-lg" />
      <Skeleton className="w-full h-14 rounded-lg" />
      <Skeleton className="w-full h-14 rounded-lg" />
    </div>
  </div>
)

const LoadingRecentlyUsed: FC = () => (
  <div className="w-full min-h-[50px] space-y-1 mt-8">
    <Skeleton className="w-full h-10 rounded-lg" />
  </div>
)

// 动态导入组件，统一禁用 SSR
export const DynamicPreviewArea = dynamic<any>(
  () => import('../components/PreviewArea'),
  {
    loading: () => <LoadingPreview />,
    ssr: false
  }
)

export const DynamicCodePreview = dynamic<any>(
  () => import('../components/CodePreview'),
  {
    loading: () => <LoadingCode />,
    ssr: false
  }
)

export const DynamicSettingsTabs = dynamic<any>(
  () => import('../components/SettingsTabs'),
  {
    loading: () => <LoadingSettings />,
    ssr: false
  }
)

export const DynamicRecentlyUsed = dynamic(
  () => import('../components/RecentlyUsed'),
  {
    loading: () => <LoadingRecentlyUsed />,
  }
)
