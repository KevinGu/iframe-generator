import React, { useEffect, useState, useCallback } from 'react'
import { LinkIcon, XIcon } from 'lucide-react'
import { IFrameConfig } from '@/app/config/iframeTypes'

interface RecentlyUsedProps {
  setConfig: (config: IFrameConfig) => void
}

const MAX_HISTORY_ITEMS = 10;

const RecentlyUsed: React.FC<RecentlyUsedProps> = ({ setConfig }) => {
  // 移动状态管理到组件内部
  const [urlHistory, setUrlHistory] = useState<Array<{
    config: IFrameConfig
  }>>([]);

  // 初始化加载历史记录
  useEffect(() => {
    try {
      const saved = localStorage.getItem("iframe-url-history");
      const history = saved ? JSON.parse(saved) : [];
      // 如果超过限制，只保留最新的记录
      const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
      // 如果历史记录被裁剪了，更新localStorage
      if (history.length > MAX_HISTORY_ITEMS) {
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

  // 添加新的历史记录
  const addToHistory = useCallback((config: IFrameConfig) => {
    setUrlHistory(prevHistory => {
      // 检查是否已存在相同的URL
      const existingIndex = prevHistory.findIndex(item => item.config.url === config.url);
      let newHistory;
      
      if (existingIndex !== -1) {
        // 如果URL已存在，移除旧的记录
        newHistory = [...prevHistory];
        newHistory.splice(existingIndex, 1);
      } else {
        newHistory = [...prevHistory];
      }
      
      // 添加新记录到开头
      newHistory.unshift({ config });
      
      // 保持历史记录数量在限制之内
      if (newHistory.length > MAX_HISTORY_ITEMS) {
        newHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);
      }
      
      // 更新localStorage
      localStorage.setItem("iframe-url-history", JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // 删除历史记录
  const handleDelete = useCallback((index: number) => {
    setUrlHistory(prevHistory => {
      const newHistory = [...prevHistory];
      newHistory.splice(index, 1);
      // 更新localStorage
      localStorage.setItem("iframe-url-history", JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                  className="ml-2 p-1 rounded-full hover:bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from history"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// 导出组件和添加历史记录的方法
export { RecentlyUsed, type RecentlyUsedProps }
export const useUrlHistory = () => {
  const addToHistory = useCallback((config: IFrameConfig) => {
    try {
      const saved = localStorage.getItem("iframe-url-history");
      const history = saved ? JSON.parse(saved) : [];
      
      // 检查是否已存在相同的URL
      const existingIndex = history.findIndex((item: any) => item.config.url === config.url);
      if (existingIndex !== -1) {
        history.splice(existingIndex, 1);
      }
      
      // 添加新记录到开头
      history.unshift({ config });
      
      // 保持历史记录数量在限制之内
      const newHistory = history.slice(0, MAX_HISTORY_ITEMS);
      
      // 更新localStorage
      localStorage.setItem("iframe-url-history", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to add to history:", error);
    }
  }, []);

  return { addToHistory };
}
