import React from 'react'
import { LinkIcon } from 'lucide-react'
import { IFrameConfig } from '@/app/config/iframeTypes'

interface RecentlyUsedProps {
  urlHistory: Array<{
    config: IFrameConfig
  }>
  setConfig: (config: IFrameConfig) => void
}

const RecentlyUsed: React.FC<RecentlyUsedProps> = ({ urlHistory, setConfig }) => {
  return (
    <div className="mt-4 space-y-2">
      {urlHistory.length > 0 && (
        <>
          <p className="text-sm text-gray-500">Recently used:</p>
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
                  {item.config.url.length > 30
                    ? `${item.config.url.substring(0, 30)}...`
                    : item.config.url}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default RecentlyUsed
