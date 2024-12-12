import dynamic from 'next/dynamic'
import type { FC } from 'react'
import React from 'react'
import { Skeleton } from '@nextui-org/react'

const LoadingPreview: FC = () => (
  <div className="w-full space-y-4">
    {/* 设备选择器 */}
    <div className="flex justify-between items-center">
      <Skeleton className="w-[200px] h-10 rounded-lg" />
      <Skeleton className="w-[100px] h-10 rounded-lg" />
    </div>
    {/* 预览区域 */}
    <div className="relative w-full aspect-video bg-default-100 rounded-lg overflow-hidden">
      <Skeleton className="absolute inset-0" />
    </div>
    {/* 状态栏 */}
    <div className="flex justify-between items-center">
      <Skeleton className="w-[150px] h-8 rounded-lg" />
      <Skeleton className="w-[100px] h-8 rounded-lg" />
    </div>
  </div>
)

const LoadingCode: FC = () => (
  <div className="w-full space-y-4">
    {/* 代码标题和复制按钮 */}
    <div className="flex justify-between items-center">
      <Skeleton className="w-[150px] h-8 rounded-lg" />
      <Skeleton className="w-[100px] h-8 rounded-lg" />
    </div>
    {/* 代码区域 */}
    <div className="w-full bg-default-100 rounded-lg p-4 space-y-2">
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-[90%] h-6" />
      <Skeleton className="w-[80%] h-6" />
      <Skeleton className="w-[85%] h-6" />
    </div>
  </div>
)

const LoadingSettings: FC = () => (
  <div className="w-full space-y-4">
    <Skeleton className="w-full h-12 rounded-lg" />
    <Skeleton className="w-3/4 h-12 rounded-lg" />
    <Skeleton className="w-1/2 h-12 rounded-lg" />
  </div>
)

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
    loading: () => <LoadingCode />
  }
)

export const DynamicSettingsTabs = dynamic<any>(
  () => import('../components/SettingsTabs'),
  {
    loading: () => <LoadingSettings />
  }
)
