import React, { useEffect, useState } from 'react'
import PreviewArea from './PreviewArea'
import { useIframeStatus } from '@/hooks/useIframePerformance'
import { IFrameConfig } from '@/app/config/iframeTypes'

interface IframeLoaderProps {
  url: string
  config: IFrameConfig
}

const IframeLoader: React.FC<IframeLoaderProps> = ({ url, config }) => {
  const [canEmbed, setCanEmbed] = useState<boolean | null>(null)
  const [embedReason, setEmbedReason] = useState<string>('')

  const {
    loading,
    error,
    retry,
    retryCount,
    iframeRef,
    handleLoad,
    handleError,
    loadTime
  } = useIframeStatus(url, config.performance)

  useEffect(() => {
    const checkEmbed = async () => {
      try {
        const response = await fetch(`/api/check-embed?url=${encodeURIComponent(url)}`)
        const data = await response.json()
        if (data.canEmbed) {
          setCanEmbed(true)
        } else {
          setCanEmbed(false)
          setEmbedReason(data.reason || '无法嵌入该页面')
        }
      } catch (err) {
        setCanEmbed(false)
        setEmbedReason('无法连接到服务器进行嵌入检查')
      }
    }

    checkEmbed()
  }, [url])

  if (canEmbed === null) {
    return <p>正在检查嵌入权限...</p>
  }

  if (!canEmbed) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-red-100 rounded">
        <h3 className="text-lg font-semibold text-red-600">嵌入失败</h3>
        <p className="text-gray-700">{embedReason}</p>
      </div>
    )
  }

  return (
    <PreviewArea
      config={config}
      loading={loading}
      error={error}
      retry={retry}
      retryCount={retryCount}
      iframeRef={iframeRef}
      handleLoad={handleLoad}
      handleIframeError={handleError}
      generateStyles={() => ({})} // 根据需要生成样式
    />
  )
}

export default IframeLoader 