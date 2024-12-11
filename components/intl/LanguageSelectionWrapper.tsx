// components/LanguageSelectionWrapper.tsx
import LanguageSelectionModal from './LanguageSelectionModal';
import { headers, type UnsafeUnwrappedHeaders } from 'next/headers';

const isBot = (userAgent: string | null): boolean => {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return ua.includes('bot') || ua.includes('spider');
};

const LanguageSelectionWrapper = () => {
  const headersList = (headers() as unknown as UnsafeUnwrappedHeaders); // 使用 next/headers 获取请求头
  const userAgent = headersList.get('user-agent'); // 返回 string | null
  const botDetected = isBot(userAgent);

  if (botDetected) {
    // 如果检测到是爬虫，不渲染弹窗
    return null;
  }

  // 如果不是爬虫，渲染客户端的语言选择弹窗
  return <LanguageSelectionModal />;
};

export default LanguageSelectionWrapper;
